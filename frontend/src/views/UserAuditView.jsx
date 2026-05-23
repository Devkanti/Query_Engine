import { useState, useEffect } from 'react';
import { Users, LogIn, Search, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const UserAuditView = () => {
 const [logins, setLogins] = useState([]);
 const [searchTerm, setSearchTerm] = useState('');

 useEffect(() => {
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

   const fetchLogins = async () => {
     try {
       const res = await axios.get(`${API_URL}/admin/logins`);
       setLogins(res.data);
     } catch (err) {
       console.error("Failed to fetch login events", err);
     }
   };
   fetchLogins();
   const interval = setInterval(fetchLogins, 2000);
   return () => clearInterval(interval);
 }, []);

 const filteredLogins = logins.filter(login => 
 login.company.toLowerCase().includes(searchTerm.toLowerCase())
 );

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
 <Users size={16} className="text-[#eab308]" />
 </div>
 <h1 className="text-3xl font-bold text-white tracking-tight">User Audit Log</h1>
 </div>
 <p className="text-xs text-gray-500 font-mono mt-2 ml-11">
 Global View of Company Authentications
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 gap-8">
 
 {/* User Login History */}
 <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-2xl border-t border-t-white/10 relative">
 <div className="absolute top-0 right-0 w-96 h-96 bg-[#eab308]/5 rounded-full blur-[100px] pointer-events-none"></div>

 <div className="h-auto py-4 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between px-8 bg-[#0a0a0a]/50 gap-4">
 <div className="flex items-center gap-3">
 <div className="w-2 h-2 rounded-full bg-[#eab308] shadow-[0_0_10px_#eab308]"></div>
 <h2 className="text-[11px] font-bold text-gray-300 tracking-[0.2em]">Authentication Events</h2>
 </div>
 
 <div className="relative group z-10 w-full md:w-auto">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#eab308] transition-colors" size={14} />
 <input 
 type="text" 
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder="Filter by Company..." 
 className="bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 w-full md:w-72 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#eab308]/50 focus:bg-[#eab308]/5 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
 />
 </div>
 </div>
 
 <div className="flex-1 overflow-auto z-10">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm text-gray-400">
 <thead className="bg-[#050505] text-[10px] text-gray-500 font-bold border-b border-white/10">
 <tr>
 <th className="px-8 py-5">Company Name</th>
 <th className="px-8 py-5">IP Address</th>
 <th className="px-8 py-5">Status</th>
 <th className="px-8 py-5 text-right">Login Time</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5 bg-black/20">
 {filteredLogins.length === 0 ? (
 <tr>
 <td colSpan="4" className="px-8 py-20 text-center">
 <div className="flex flex-col items-center justify-center">
 <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-600">
 <ShieldCheck size={24} />
 </div>
 <h4 className="text-sm font-bold text-gray-400 mb-1">No Login Events Found</h4>
 <p className="text-xs text-gray-600 font-mono">No authentications match the current filter.</p>
 </div>
 </td>
 </tr>
 ) : filteredLogins.map((login, i) => (
 <tr key={i} className="hover:bg-white/5 transition-colors group">
 <td className="px-8 py-5">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg bg-[#eab308]/10 border border-[#eab308]/20 flex items-center justify-center">
 <LogIn size={14} className="text-[#eab308]" />
 </div>
 <span className="font-bold text-white tracking-tight">{login.company}</span>
 </div>
 </td>
 <td className="px-8 py-5 font-mono text-gray-500 text-xs">{login.ip}</td>
 <td className="px-8 py-5">
 <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-[0.2em] border ${
 login.status === 'Success' 
 ? 'border-[#c4f033]/30 bg-[#c4f033]/10 text-[#c4f033] shadow-[0_0_10px_rgba(196,240,51,0.1)]' 
 : 'border-red-500/30 bg-red-500/10 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
 }`}>
 <span className={`w-1.5 h-1.5 rounded-full ${login.status === 'Success' ? 'bg-[#c4f033]' : 'bg-red-500'}`}></span>
 {login.status}
 </span>
 </td>
 <td className="px-8 py-5 text-right font-mono text-xs text-gray-400">
 {new Date(login.time * 1000).toLocaleString()}
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

export default UserAuditView;
