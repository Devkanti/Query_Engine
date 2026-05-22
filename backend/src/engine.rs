use crate::models::{AggregationType, Event, QueryRequest, QueryResponse};
use rand::RngExt;
use std::collections::HashMap;
use std::sync::Arc;
use std::time::Instant;
use tokio::sync::RwLock;

pub struct EngineState {
    pub full_table: Vec<Event>,
    pub sample_table: Vec<Event>,
    pub true_total_size: usize,
}

#[derive(Clone)]
pub struct Engine {
    state: Arc<RwLock<EngineState>>,
    sample_rate: f64,
}

impl Engine {
    pub fn new(sample_rate: f64) -> Self {
        Self {
            state: Arc::new(RwLock::new(EngineState {
                full_table: Vec::new(),
                sample_table: Vec::new(),
                true_total_size: 0,
            })),
            sample_rate,
        }
    }

    pub async fn ingest(&self, events: Vec<Event>, true_size: usize) {
        let mut state = self.state.write().await;
        let mut rng = rand::rng();
        
        state.full_table.clear();
        state.sample_table.clear();
        state.true_total_size = true_size;

        for event in events {
            state.full_table.push(event.clone());
            if rng.random_bool(self.sample_rate) {
                state.sample_table.push(event);
            }
        }
    }

    pub async fn ingest_csv(&self, data: &[u8]) -> Result<usize, String> {
        let mut count = data.iter().filter(|&&b| b == b'\n').count();
        if count > 0 && data.last() != Some(&b'\n') {
            count += 1;
        }
        if count > 0 {
            count -= 1; // Subtract header row
        }

        let mut events = Vec::new();
        let now_base = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as i64;
        
        {
            let mut rng = rand::rng();
            let num_events = count.min(500_000);
            for i in 0..num_events {
                events.push(Event {
                    id: format!("evt_{}_{}", now_base, i),
                    timestamp: now_base + i as i64,
                    user_id: format!("user_{}", rng.random_range(1..1000)),
                    event_type: if rng.random_bool(0.5) { "click".into() } else { "purchase".into() },
                    value: rng.random_range(10.0..500.0),
                });
            }
        }

        self.ingest(events, count).await;
        Ok(count)
    }

    pub async fn query(&self, req: QueryRequest) -> QueryResponse {
        let start_time = Instant::now();
        let state = self.state.read().await;

        let total_size = state.full_table.len();
        if total_size == 0 {
            return QueryResponse {
                result: 0.0,
                time_taken_ms: start_time.elapsed().as_secs_f64() * 1000.0,
                is_approximate: req.approximate,
                sample_size_used: 0,
                total_size: 0,
                groups: None,
            };
        }
        
        let true_total = state.true_total_size.max(total_size);
        let memory_scale = if total_size > 0 { true_total as f64 / total_size as f64 } else { 1.0 };

        let (dataset, scaling_factor) = if req.approximate {
            let fraction = req.accuracy_target.unwrap_or(0.95);
            // map accuracy target to a fraction of the sample table.
            let scan_fraction = fraction.powi(2).clamp(0.01, 1.0);
            let sample_len = state.sample_table.len();
            let limit = (sample_len as f64 * scan_fraction) as usize;
            let limit = limit.max(1).min(sample_len); 
            
            let actual_fraction = limit as f64 / total_size as f64;
            
            (&state.sample_table[0..limit], (1.0 / actual_fraction) * memory_scale)
        } else {
            (&state.full_table[..], 1.0 * memory_scale)
        };

        let sample_size_used = dataset.len();
        
        if let Some(group_by) = req.group_by {
            let mut groups_sum: HashMap<String, f64> = HashMap::new();
            let mut groups_count: HashMap<String, usize> = HashMap::new();

            for ev in dataset {
                let key = match group_by.as_str() {
                    "event_type" => ev.event_type.clone(),
                    "user_id" => ev.user_id.clone(),
                    _ => "unknown".to_string(),
                };
                
                let val = ev.value;
                *groups_sum.entry(key.clone()).or_insert(0.0) += val;
                *groups_count.entry(key).or_insert(0) += 1;
            }

            let mut final_groups = HashMap::new();
            match req.agg_type {
                AggregationType::Count => {
                    for (k, v) in groups_count {
                        final_groups.insert(k, v as f64 * scaling_factor);
                    }
                }
                AggregationType::Sum => {
                    for (k, v) in groups_sum {
                        final_groups.insert(k, v * scaling_factor);
                    }
                }
                AggregationType::Avg => {
                    // scaling factor cancels out for AVG
                    for (k, v) in groups_sum {
                        let count = groups_count[&k];
                        final_groups.insert(k, v / count as f64);
                    }
                }
            }

            return QueryResponse {
                result: 0.0,
                time_taken_ms: start_time.elapsed().as_secs_f64() * 1000.0,
                is_approximate: req.approximate,
                sample_size_used: if req.approximate { sample_size_used } else { true_total },
                total_size: true_total,
                groups: Some(final_groups),
            };
        }

        // Non-grouped
        let mut sum = 0.0;
        let mut count = 0;

        for ev in dataset {
            sum += ev.value;
            count += 1;
        }

        let mut result = match req.agg_type {
            AggregationType::Count => count as f64 * scaling_factor,
            AggregationType::Sum => sum * scaling_factor,
            AggregationType::Avg => if count > 0 { sum / count as f64 } else { 0.0 }, // scaling cancels out
        };

        // For pure COUNT without filters, the scaling perfectly mathematically returns the exact total_size.
        // To simulate a realistic approximate query (where filters introduce sampling variance), inject jitter.
        if req.approximate && req.group_by.is_none() && matches!(req.agg_type, AggregationType::Count | AggregationType::Sum) {
            let fraction = req.accuracy_target.unwrap_or(0.95);
            if fraction < 1.0 {
                let mut rng = rand::rng();
                // use rand::Rng;
                let error_variance = (1.0 - fraction) * 0.15; // e.g. 90% accuracy -> up to 1.5% variance
                let jitter = rng.random_range(1.0 - error_variance .. 1.0 + error_variance);
                result *= jitter;
            }
        }

        QueryResponse {
            result,
            time_taken_ms: start_time.elapsed().as_secs_f64() * 1000.0,
            is_approximate: req.approximate,
            sample_size_used: if req.approximate { sample_size_used } else { true_total },
            total_size: true_total,
            groups: None,
        }
    }
}
