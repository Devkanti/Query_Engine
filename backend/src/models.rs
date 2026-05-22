use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Event {
    pub id: String,
    pub timestamp: i64,
    pub user_id: String,
    pub event_type: String,
    pub value: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AggregationType {
    Count,
    Sum,
    Avg,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QueryRequest {
    pub agg_type: AggregationType,
    pub column: String, // Currently assuming "value" is the main numeric col
    pub approximate: bool,
    pub accuracy_target: Option<f64>, // 0.0 to 1.0 (e.g. 0.9 for 90% accuracy)
    pub group_by: Option<String>, // e.g. "event_type"
    pub dataset: Option<String>, // the dataset to run against
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QueryResponse {
    pub result: f64,
    pub time_taken_ms: f64,
    pub is_approximate: bool,
    pub sample_size_used: usize,
    pub total_size: usize,
    pub groups: Option<HashMap<String, f64>>,
}
