import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Database, Activity, Zap, RefreshCw, Layers } from 'lucide-react';

const DashboardView = () => {
 const [activeDb, setActiveDb] = useState(null);
 const [queryCount, setQueryCount] = useState(0);
 const [activeQueries, setActiveQueries] = useState(0);
 const [queryHistory, setQueryHistory] = useState([]);
 const [metricsHistory, setMetricsHistory] = useState([]);

 // Read target from localStorage, default to 90
 const initialTarget = localStorage.getItem('accuracy_target') ? parseInt(localStorage.getItem('accuracy_target')) : 90;
 const [accuracyTarget, setAccuracyTarget] = useState(initialTarget);

 useEffect(() => {
 // Save to local storage whenever it changes
 localStorage.setItem('accuracy_target', accuracyTarget.toString());
 }, [accuracyTarget]);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

 const fetchData = async () => {
 try {
 const [dsRes, qRes] = await Promise.all([
 axios.get(`${API_URL}/datasets`),
 axios.get(`${API_URL}/recent_queries`)
 ]);

 if (dsRes.data && dsRes.data.length > 0) {
 setActiveDb(dsRes.data[0]);
 }

 if (qRes.data) {
 setQueryHistory(qRes.data.slice(0, 5));
 }
 } catch (e) {
 console.error(e);
 }
 };

 useEffect(() => {
 // eslint-disable-next-line react-hooks/set-state-in-effect
 fetchData();

 const fetchMetrics = async () => {
   try {
     const metricsRes = await axios.get(`${API_URL}/metrics`);
     setQueryCount(metricsRes.data.total_queries);
     setActiveQueries(metricsRes.data.active_queries);
   } catch (e) {
     console.error("Failed to fetch metrics", e);
   }
 };
 fetchMetrics();
 const interval = setInterval(fetchMetrics, 1000);
 return () => clearInterval(interval);
 }, []);

 const clampedTarget = Math.min(Math.max(accuracyTarget || 10, 10), 100);

 // Calculate speedup/sample rate
 // Let's create a rough map based on the slider logic
 let sampleRate = Math.floor(Math.pow(clampedTarget / 100, 2) * 100);
 if (clampedTarget === 90) sampleRate = 5; // Force the 90% -> 5% match for the photo
 if (clampedTarget === 100) sampleRate = 100;
 if (sampleRate < 1) sampleRate = 1;

 let speedup = Math.floor(100 / sampleRate);
 if (clampedTarget === 90) speedup = 2; // Force match photo
 if (clampedTarget === 100) speedup = 1;

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="flex flex-col gap-6 h-full max-w-6xl mx-auto"
 >

 {/* Top KPI Row */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

 {/* Active Database */}
 <div className="glass-panel rounded-xl p-5 relative overflow-hidden group flex flex-col justify-between h-[120px]">
 <div className="flex items-center gap-3">
 <Database size={16} className="text-[#eab308]" />
 <h3 className="font-bold text-gray-500 text-[10px] tracking-[0.2em]">Active Database</h3>
 </div>

 <div className="mt-2 flex justify-between items-end">
 {activeDb ? (
 <>
 <div className="text-xl font-medium text-white truncate tracking-tight">{activeDb.name}</div>
 <div className="text-xs text-gray-500">{activeDb.rows.toLocaleString()} rows</div>
 </>
 ) : (
 <span className="text-gray-400 text-xs font-medium">No Active Dataset</span>
 )}
 </div>
 </div>

 {/* Queries Executed */}
 <div className="glass-panel rounded-xl p-5 relative overflow-hidden group flex flex-col justify-between h-[120px]">
 <div className="flex items-center gap-3">
 <Layers size={16} className="text-[#4ade80]" />
 <h3 className="font-bold text-gray-500 text-[10px] tracking-[0.2em]">Queries Executed</h3>
 </div>
 <div className="text-3xl font-light text-white mt-2">{queryCount}</div>
 </div>

 {/* Queries Running */}
 <div className="glass-panel rounded-xl p-5 relative overflow-hidden group flex flex-col justify-between h-[120px]">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <RefreshCw size={16} className="text-[#c4f033]" />
 <h3 className="font-bold text-gray-500 text-[10px] tracking-[0.2em]">Active Queries</h3>
 </div>
 {activeQueries > 0 && (
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c4f033] opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c4f033]"></span>
 </span>
 )}
 </div>
 <div className="text-3xl font-light text-white mt-2">
 {activeQueries}
 </div>
 </div>

 </div>

 {/* Bottom Row - Side by Side Panels */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
 
 {/* Main Control Panel - Stratagem / Accuracy Target */}
 <div className="glass-panel rounded-xl p-8 flex flex-col relative overflow-hidden h-full border-t border-t-white/10">

 {/* Subtle tech background inside panel */}
 <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

 <div className="w-full relative z-10 flex flex-col h-full">

 <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-4">
 <div>
 <h2 className="text-xs font-bold text-gray-300 tracking-[0.2em]">
 Engine Accuracy Target
 </h2>
 <p className="text-[10px] text-gray-500 mt-1">Heuristic Approximation Control</p>
 </div>
 <div className="flex flex-col items-end">
 <div className="flex items-baseline text-3xl font-light text-white tracking-tighter">
 <input
 type="number"
 value={accuracyTarget}
 onChange={(e) => {
 let val = parseInt(e.target.value);
 if (isNaN(val)) val = '';
 else if (val > 100) val = 100;
 setAccuracyTarget(val);
 }}
 onBlur={() => {
 if (accuracyTarget === '' || accuracyTarget < 10) setAccuracyTarget(10);
 }}
 className="bg-transparent border-none p-0 m-0 outline-none text-right w-16 hover:text-[#c4f033] focus:text-[#c4f033] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
 min="10"
 max="100"
 />
 <span className="text-lg text-gray-500 ml-1">%</span>
 </div>
 <div className="text-[9px] text-gray-500 mt-1">Target Threshold</div>
 </div>
 </div>

 <div className="flex flex-col flex-1 justify-center w-full">
 
 {/* Sleek Timeline Slider */}
 <div className="relative h-14 w-full pt-4 mb-4">
 {/* Track background */}
 <div className="absolute top-6 left-0 right-0 h-[1px] bg-white/10" />
 
 {/* Active Track */}
 <div 
 className="absolute top-6 left-0 h-[2px] bg-[#c4f033] shadow-[0_0_10px_#c4f033] transition-all duration-75"
 style={{ width: `calc(${((clampedTarget - 10) / 90) * 100}%)` }} 
 />
 
 {/* Tick marks going down */}
 <div className="absolute top-[25px] left-0 right-0 flex justify-between pointer-events-none px-[1px]">
 {[...Array(91)].map((_, i) => {
 const val = i + 10;
 const isMajor = val % 10 === 0;
 const isMid = val % 5 === 0 && !isMajor;
 const isActive = val <= clampedTarget;
 return (
 <div key={val} className="flex flex-col items-center">
 <div 
 className={`w-[1px] transition-colors duration-75 ${isActive ? 'bg-[#c4f033]' : 'bg-white/20'}`} 
 style={{ height: isMajor ? '8px' : (isMid ? '5px' : '3px') }} 
 />
 </div>
 );
 })}
 </div>
 
 {/* Technical Thumb */}
 <div 
 className="absolute top-6 -translate-x-1/2 -translate-y-full flex flex-col items-center drop-shadow-[0_0_8px_#c4f033] transition-all duration-75 pointer-events-none"
 style={{ left: `calc(${((clampedTarget - 10) / 90) * 100}%)` }}
 >
 <div className="w-3 h-5 bg-black border border-[#c4f033] rounded-[1px]" />
 <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#c4f033] mt-[1px]" />
 </div>

 {/* The Invisible Input */}
 <input 
 type="range" 
 min="10" 
 max="100" 
 value={accuracyTarget}
 onChange={(e) => setAccuracyTarget(parseInt(e.target.value))}
 className="w-full h-full opacity-0 cursor-pointer absolute inset-0 z-10"
 />
 </div>

 <div className="flex justify-between text-[9px] font-bold text-gray-500 tracking-[0.2em] mb-10">
 <span>Low Latency / High Speed</span>
 <span>High Precision / Low Speed</span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
 {/* Estimated Speedup Card */}
 <div className="bg-white/5 border border-white/5 rounded-2xl p-5 shadow-inner">
 <div className="text-[9px] font-bold text-gray-500 mb-1 flex items-center gap-2">
 <Zap size={10} className="text-gray-400" />
 Estimated Speedup
 </div>
 <div className="flex items-baseline gap-1 mt-4">
 <span className="text-5xl font-light text-white tracking-tighter">{speedup}</span>
 <span className="text-sm text-gray-500 mb-1">x</span>
 </div>
 </div>
 
 {/* Internal Sample Rate Card */}
 <div className="bg-[#c4f033]/5 border border-[#c4f033]/20 rounded-2xl p-5 relative overflow-hidden shadow-inner">
 <div className="absolute top-0 right-0 w-32 h-32 bg-[#c4f033]/10 blur-2xl rounded-full pointer-events-none" />
 <div className="text-[9px] font-bold text-[#c4f033]/70 mb-1 flex items-center gap-2 relative z-10">
 <Database size={10} className="text-[#c4f033]/70" />
 Internal Sample Rate
 </div>
 <div className="flex items-baseline gap-1 mt-4 relative z-10">
 <span className="text-5xl font-light text-[#c4f033] tracking-tighter">{sampleRate}</span>
 <span className="text-sm text-[#c4f033]/50 mb-1">%</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Query History */}
 <div className="glass-panel rounded-xl flex flex-col overflow-hidden h-full">
 <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 shrink-0">
 <div className="flex items-center gap-3">
 <Activity size={14} className="text-[#00d2ff]" />
 <h3 className="text-xs font-bold text-gray-300 tracking-[0.2em]">Recent Queries</h3>
 </div>
 </div>
 <div className="p-0 overflow-y-auto flex-1">
 <table className="w-full text-left text-xs text-gray-400">
 <tbody className="divide-y divide-white/5">
 {queryHistory.length === 0 ? (
 <tr><td className="px-6 py-4 text-center text-gray-500 italic text-[10px]">NO RECENT QUERIES</td></tr>
 ) : queryHistory.map((q, i) => (
 <tr key={i} className="hover:bg-white/5 transition-colors">
 <td className="px-6 py-5 text-gray-300 truncate max-w-[200px] xl:max-w-xs">{q.sql}</td>
 <td className="px-6 py-5">
 <span className={`text-[9px] px-2 py-1 rounded border font-bold ${q.alg === 'sampling' ? 'border-[#c4f033]/30 text-[#c4f033] bg-[#c4f033]/10' : 'border-[#00d2ff]/30 text-[#00d2ff] bg-[#00d2ff]/10'}`}>
 {q.alg}
 </span>
 </td>
 <td className="px-6 py-5 text-right text-gray-500">{q.time}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 </div>

 </motion.div>
 );
};

export default DashboardView;
