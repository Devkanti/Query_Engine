import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Database, FileSpreadsheet, Activity, ShieldCheck, Zap, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const AdminDashboardView = () => {
 const [data, setData] = useState({ datasets: [], queries: [] });
 const [chartData, setChartData] = useState([]);
 const prevQueryCount = useRef(null);

 useEffect(() => {
 const fetchAuditData = async () => {
 try {
 const res = await axios.get(`${API_URL}/admin/audit`);
 setData(res.data);
 
 const currentCount = res.data.queries.length;
 let delta = 0;
 if (prevQueryCount.current !== null) {
     delta = currentCount - prevQueryCount.current;
 }
 if (delta < 0) delta = 0;
 
 setChartData(prev => [...prev.slice(1), { queries: delta }]);
 prevQueryCount.current = currentCount;
 
 } catch (err) {
 console.error("Failed to fetch admin audit data", err);
 }
 };
 
 fetchAuditData();
 const interval = setInterval(fetchAuditData, 3000);
 return () => clearInterval(interval);
 }, []);

 return (
 <motion.div 
 initial={{ opacity: 0, y: 20 }} 
 animate={{ opacity: 1, y: 0 }} 
 transition={{ duration: 0.5 }}
 className="flex flex-col h-full gap-8 max-w-7xl mx-auto overflow-y-auto pb-10"
 >
 
 {/* Header */}
 <div className="flex justify-between items-end border-b border-white/10 pb-6 mt-4">
 <div>
 <div className="flex items-center gap-3 mb-2">
 <div className="w-8 h-8 rounded-lg bg-[#eab308]/10 border border-[#eab308]/20 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.2)]">
 <ShieldCheck size={16} className="text-[#eab308]" />
 </div>
 <h1 className="text-3xl font-bold text-white tracking-tight">System Administrator</h1>
 </div>
 <p className="text-xs text-gray-500 font-mono mt-2 ml-11">
 Global View of Datasets & Query Audits
 </p>
 </div>
 </div>

 {/* KPI Cards */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group shadow-2xl border-t border-t-white/10">
 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
 <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#eab308]/10 rounded-full blur-3xl group-hover:bg-[#eab308]/20 transition-all duration-500"></div>
 
 <div className="flex items-center gap-3 mb-6 relative z-10">
 <div className="w-8 h-8 flex items-center justify-center bg-[#eab308]/10 border border-[#eab308]/20 rounded-lg">
 <Database size={14} className="text-[#eab308]" />
 </div>
 <h3 className="font-bold text-gray-400 text-[10px]">Total Datasets</h3>
 </div>
 <div className="text-5xl font-light text-white font-mono tracking-tighter relative z-10">{data.datasets.length}</div>
 </div>

 <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group shadow-2xl border-t border-t-white/10">
 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
 <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#c4f033]/10 rounded-full blur-3xl group-hover:bg-[#c4f033]/20 transition-all duration-500"></div>
 
 <div className="flex items-center gap-3 mb-6 relative z-10">
 <div className="w-8 h-8 flex items-center justify-center bg-[#c4f033]/10 border border-[#c4f033]/20 rounded-lg">
 <Zap size={14} className="text-[#c4f033]" />
 </div>
 <h3 className="font-bold text-gray-400 text-[10px]">Queries Executed</h3>
 </div>
 <div className="text-5xl font-light text-white font-mono tracking-tighter relative z-10">{data.queries.length}</div>
 </div>

 <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group flex flex-col shadow-2xl border-t border-t-white/10">
 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
 
 <div className="flex items-center gap-3 mb-2 relative z-10">
 <div className="w-8 h-8 flex items-center justify-center bg-[#00d2ff]/10 border border-[#00d2ff]/20 rounded-lg">
 <Activity size={14} className="text-[#00d2ff]" />
 </div>
 <h3 className="font-bold text-gray-400 text-[10px]">System Load</h3>
 </div>
 <div className="flex-1 mt-4 relative z-10 h-24">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
 <defs>
 <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.5}/>
 <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
 </linearGradient>
 </defs>
 <YAxis hide domain={[0, 'dataMax + 5']} />
 <Area 
   type="monotone" 
   dataKey="queries" 
   stroke="#00d2ff" 
   strokeWidth={3} 
   fillOpacity={1} 
   fill="url(#colorSys)" 
   isAnimationActive={false}
   className="drop-shadow-[0_0_8px_rgba(0,210,255,0.6)]"
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
 
 {/* Datasets Uploaded */}
 <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-2xl border-t border-t-white/10">
 <div className="h-16 border-b border-white/10 flex items-center gap-3 px-8 bg-[#0a0a0a]/50">
 <div className="w-2 h-2 rounded-full bg-[#eab308] shadow-[0_0_10px_#eab308]"></div>
 <h2 className="text-[11px] font-bold text-gray-300 tracking-[0.2em]">Uploaded Datasets</h2>
 </div>
 
 <div className="p-0 overflow-auto flex-1">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm text-gray-400">
 <thead className="bg-[#050505] text-[10px] text-gray-500 font-bold border-b border-white/10">
 <tr>
 <th className="px-8 py-5">Dataset Name</th>
 <th className="px-8 py-5">Total Rows</th>
 <th className="px-8 py-5 text-right">Upload Time</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5 bg-black/20">
 {data.datasets.length === 0 ? (
 <tr>
 <td colSpan="3" className="px-8 py-16 text-center">
 <div className="flex flex-col items-center justify-center">
 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-600">
 <FileSpreadsheet size={20} />
 </div>
 <h4 className="text-xs font-bold text-gray-400 mb-1">No Datasets Found</h4>
 </div>
 </td>
 </tr>
 ) : data.datasets.map((ds, i) => (
 <tr key={i} className="hover:bg-white/5 transition-colors">
 <td className="px-8 py-5 font-bold text-white text-xs">{ds.name}</td>
 <td className="px-8 py-5 font-mono text-[#00d2ff] text-xs">{ds.rows.toLocaleString()}</td>
 <td className="px-8 py-5 text-right font-mono text-xs">{new Date(parseInt(ds.time) * 1000).toLocaleString()}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 {/* Query Audit Log */}
 <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-2xl border-t border-t-white/10">
 <div className="h-16 border-b border-white/10 flex items-center gap-3 px-8 bg-[#0a0a0a]/50">
 <div className="w-2 h-2 rounded-full bg-[#c4f033] shadow-[0_0_10px_#c4f033]"></div>
 <h2 className="text-[11px] font-bold text-gray-300 tracking-[0.2em]">Query Audit Log</h2>
 </div>
 
 <div className="p-0 overflow-auto flex-1">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm text-gray-400">
 <thead className="bg-[#050505] text-[10px] text-gray-500 font-bold border-b border-white/10">
 <tr>
 <th className="px-8 py-5">Query / Aggregation</th>
 <th className="px-8 py-5">Target Dataset</th>
 <th className="px-8 py-5">Strategy</th>
 <th className="px-8 py-5 text-right">Exec Time</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5 bg-black/20">
 {data.queries.length === 0 ? (
 <tr>
 <td colSpan="4" className="px-8 py-16 text-center">
 <div className="flex flex-col items-center justify-center">
 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-600">
 <Server size={20} />
 </div>
 <h4 className="text-xs font-bold text-gray-400 mb-1">No Audit Logs</h4>
 </div>
 </td>
 </tr>
 ) : data.queries.map((q, i) => (
 <tr key={i} className="hover:bg-white/5 transition-colors">
 <td className="px-8 py-5">
 <div className="font-mono text-xs text-gray-300">{q.sql}</div>
 </td>
 <td className="px-8 py-5 text-xs font-mono text-gray-500">
 {q.dataset || 'Memory / Default'}
 </td>
 <td className="px-8 py-5">
 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold border ${
 q.alg === 'EXACT' 
 ? 'bg-black border-white/10 text-gray-400 shadow-inner' 
 : 'bg-[#c4f033]/10 border-[#c4f033]/30 text-[#c4f033] shadow-[0_0_10px_rgba(196,240,51,0.1)]'
 }`}>
 {q.alg !== 'EXACT' && <span className="w-1.5 h-1.5 rounded-full bg-[#c4f033] animate-pulse"></span>}
 {q.alg}
 </span>
 </td>
 <td className="px-8 py-5 text-right font-mono text-xs text-white">
 {q.time}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 </div>
 </motion.div>
 );
};

export default AdminDashboardView;
