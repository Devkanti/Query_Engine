import { useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import { Download, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


const CustomTooltip = ({ active, payload }) => {
 if (active && payload && payload.length) {
 const data = payload[0].payload;
  return (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="bg-[#050505]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-[0_10px_40px_rgba(196,240,51,0.15)]"
  >
  <p className="text-white font-bold text-sm mb-3 flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-[#c4f033] animate-pulse"></div>
    {data.name}
  </p>
 <div className="flex flex-col gap-2">
 <div className="flex justify-between items-center gap-6">
 <span className="text-[9px] text-gray-500 font-mono">Accuracy</span>
 <span className="text-xs text-white font-mono font-bold">{data.accuracy.toFixed(1)}%</span>
 </div>
 <div className="flex justify-between items-center gap-6">
 <span className="text-[9px] text-gray-500 font-mono">Speed</span>
 <span className="text-xs text-[#c4f033] font-mono font-bold">{data.speed.toLocaleString()} <span className="text-gray-500 text-[9px]">OPS/S</span></span>
 </div>
 </div>
 </motion.div>
 );
 }
 return null;
};

const PerformanceView = () => {
  const chartRef = useRef(null);
  const [dataSampling, setDataSampling] = useState([]);

  useEffect(() => {
    const fetchBenchmark = async () => {
      try {
        const token = sessionStorage.getItem('company_token') || sessionStorage.getItem('admin_token');
        const companyName = sessionStorage.getItem('company_name') || 'default';
        const res = await axios.get(`${API_URL}/benchmark`, {
          headers: { 'X-Company-ID': companyName }
        });
        setDataSampling(res.data);
      } catch (err) {
        console.error('Failed to fetch benchmark', err);
      }
    };
    fetchBenchmark();
    const interval = setInterval(fetchBenchmark, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, { backgroundColor: '#050505' });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = 'accuracy-vs-speed-chart.png';
        link.click();
      } catch (err) {
        console.error("Failed to export image", err);
      }
    }
  };

 return (
 <motion.div 
 initial={{ opacity: 0, y: 20 }} 
 animate={{ opacity: 1, y: 0 }} 
 transition={{ duration: 0.5 }}
 className="flex flex-col h-full gap-6 max-w-6xl mx-auto pb-10"
 >
 
 {/* Header */}
 <div className="flex justify-between items-end border-b border-white/10 pb-6 mt-4">
 <div>
 <div className="flex items-center gap-3 mb-2">
 <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
 <BarChart2 size={16} className="text-white" />
 </div>
 <h1 className="text-3xl font-bold text-white tracking-tight">Benchmark Runs</h1>
 </div>
 <p className="text-xs text-gray-500 font-mono mt-2 ml-11">
 Engine Latency vs. Probabilistic Accuracy Trade-offs
 </p>
 </div>
 <motion.button 
 onClick={handleExport}
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 className="flex items-center gap-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
 >
 <Download size={14} /> Export Report
 </motion.button>
 </div>

 <div className="grid grid-cols-1 gap-6 flex-1 min-h-[500px]">
 
 {/* Scatter Plot Area */}
 <div ref={chartRef} className="glass-panel rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-2xl border-t border-t-white/10">
 
 <div className="flex justify-between items-center mb-8 relative z-10">
 <div className="flex items-center gap-3">
 <motion.div 
   animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
   transition={{ repeat: Infinity, duration: 2 }} 
   className="w-2 h-2 rounded-full bg-[#c4f033] shadow-[0_0_15px_#c4f033]"
 />
 <h2 className="text-sm font-bold text-gray-300 tracking-[0.2em] uppercase">Accuracy vs. Speed</h2>
 </div>
 </div>


 <div className="flex-1 w-full h-full relative z-10 pl-6 pr-4 pb-4">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={dataSampling} margin={{ top: 30, right: 30, bottom: 20, left: 10 }}>
 <defs>
   <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
     <stop offset="5%" stopColor="#c4f033" stopOpacity={0.4}/>
     <stop offset="95%" stopColor="#c4f033" stopOpacity={0}/>
   </linearGradient>
   <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
     <stop offset="0%" stopColor="#eab308" />
     <stop offset="100%" stopColor="#c4f033" />
   </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
 
 <XAxis 
 type="number" 
 dataKey="accuracy" 
 domain={[60, 100]} 
 stroke="#333" 
 tick={{fill: '#666', fontSize: 10, fontFamily: 'monospace'}} 
 tickLine={false}
 axisLine={{stroke: '#222'}}
 />
 
 <YAxis 
 type="number" 
 dataKey="speed" 
 domain={[0, 25000]}
 stroke="#333" 
 tick={{fill: '#666', fontSize: 10, fontFamily: 'monospace'}} 
 tickLine={false}
 axisLine={false}
 tickFormatter={(val) => `${val/1000}k`}
 />
 
 <Tooltip 
 cursor={{stroke: 'rgba(196,240,51,0.2)', strokeWidth: 2, strokeDasharray: '3 3'}} 
 content={<CustomTooltip />}
 />
 
 <Area 
 type="monotone" 
 dataKey="speed" 
 stroke="url(#strokeGradient)" 
 fill="url(#colorSpeed)"
 strokeWidth={4} 
 isAnimationActive={true}
 animationDuration={2000}
 animationEasing="ease-out"
 dot={{ fill: '#050505', stroke: '#eab308', strokeWidth: 2, r: 4 }}
 activeDot={{ r: 8, fill: '#c4f033', stroke: '#050505', strokeWidth: 2, style: { filter: 'drop-shadow(0px 0px 8px #c4f033)' } }}
 className="drop-shadow-[0_0_12px_rgba(196,240,51,0.3)]" 
 />
 </AreaChart>
 </ResponsiveContainer>
 
 {/* Axis Labels */}
 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 font-bold">
 Approximation Accuracy (%)
 </div>
 <div className="absolute top-1/2 -left-4 -rotate-90 text-[9px] text-gray-500 font-bold origin-center -translate-y-1/2">
 Operations per Second
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 );
};

export default PerformanceView;
