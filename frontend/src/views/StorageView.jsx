import { CloudUpload, Table2, Search, Database, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const StorageView = () => {
 const [isUploading, setIsUploading] = useState(false);
 const [datasets, setDatasets] = useState([]);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

 const fetchDatasets = async () => {
 try {
 const res = await axios.get(`${API_URL}/datasets`);
 setDatasets(res.data);
 } catch (error) {
    console.error("Failed to fetch datasets", error);
  }
 };

 useEffect(() => {
 // eslint-disable-next-line react-hooks/set-state-in-effect
 fetchDatasets();
 }, []);

  const handleDelete = (datasetName) => {
    setDatasets(datasets.filter(d => d.name !== datasetName));
    toast.success(`${datasetName} deleted successfully`);
  };

 const handleFileUpload = async (e) => {
 const file = e.target.files[0];
 if (!file) return;
 
 setIsUploading(true);
 const formData = new FormData();
 formData.append('file', file);

 try {
 const res = await fetch(`${API_URL}/upload`, {
 method: 'POST',
 headers: {
   'X-Company-ID': sessionStorage.getItem('company_name') || 'default'
 },
 body: formData,
 });
      if (res.ok) {
        toast.success('Data successfully ingested into Query Engine!');
        fetchDatasets();
      } else {
        toast.error('Upload failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Upload error.');
    }
 setIsUploading(false);
 };

 return (
 <motion.div 
 initial={{ opacity: 0, y: 20 }} 
 animate={{ opacity: 1, y: 0 }} 
 transition={{ duration: 0.5 }}
 className="flex flex-col h-full gap-8 max-w-6xl mx-auto"
 >
 
 {/* Header */}
 <div className="flex justify-between items-end border-b border-[#222] pb-6">
 <div>
 <h1 className="text-3xl font-bold text-white mb-2">Storage & Datasets</h1>
 <p className="text-sm text-gray-500 font-mono">Manage data connections and monitor ingestion pipelines.</p>
 </div>

 </div>

 <div className="grid grid-cols-1 gap-8 mt-4">
 
 {/* Connect New Data (Dropzone) */}
 <motion.label 
 whileHover={{ scale: 1.005, borderColor:"rgba(196,240,51,0.5)", backgroundColor:"rgba(196,240,51,0.02)" }}
 whileTap={{ scale: 0.995 }}
 className={`relative border border-dashed ${isUploading ? 'border-[#c4f033] bg-[#c4f033]/5 shadow-[inset_0_0_30px_rgba(196,240,51,0.1)]' : 'border-white/20 bg-white/[0.01] hover:shadow-[0_0_30px_rgba(196,240,51,0.05)]'} rounded-3xl flex flex-col items-center justify-center p-12 text-center h-[320px] cursor-pointer group overflow-hidden transition-all duration-300`}
 >
 {/* Subtle Grid Background */}
 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
 
 <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
 
 <div className="relative mb-6">
 <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100 ${isUploading ? 'bg-[#c4f033]/50 opacity-100 animate-pulse' : 'bg-white/20'}`}></div>
 <div className={`relative w-20 h-20 rounded-full bg-black/50 border border-white/10 flex items-center justify-center group-hover:border-[#c4f033]/50 group-hover:scale-105 transition-all duration-300 shadow-2xl ${isUploading ? 'text-[#c4f033] border-[#c4f033]' : 'text-gray-400'}`}>
 <CloudUpload size={28} className={isUploading ? 'animate-bounce' : ''} />
 </div>
 </div>
 
 <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">{isUploading ? 'Ingesting Data...' : 'Connect New Data'}</h2>
 <p className="text-sm text-gray-400 mb-8 max-w-sm">{isUploading ? 'Parsing rows into the memory buffer engine...' : 'Drag and drop your dataset files here, or click anywhere to browse your computer.'}</p>
 
 </motion.label>
 </div>

 {/* Left Column - Database Engine Config */}
 <div className="glass-panel rounded-2xl flex flex-col relative overflow-hidden shadow-2xl border-t border-t-white/10">
 <div className="absolute top-0 right-0 w-96 h-96 bg-[#c4f033]/5 rounded-full blur-[100px] pointer-events-none"></div>
 
 <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0a0a0a]/50">
 <div className="flex items-center gap-3">
 <div className="w-2 h-2 rounded-full bg-[#c4f033] shadow-[0_0_10px_#c4f033]"></div>
 <h3 className="text-sm text-gray-300 font-bold tracking-[0.2em]">Active Datasets</h3>
 </div>
 <div className="relative group">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#c4f033] transition-colors" size={14} />
 <input 
 type="text" 
 placeholder="Filter datasets..." 
 className="bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 w-72 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#c4f033]/50 focus:bg-[#c4f033]/5 transition-all shadow-inner"
 />
 </div>
 </div>

 <div className="flex-1 overflow-auto">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm whitespace-nowrap">
 <thead className="bg-[#050505] text-[10px] text-gray-500 font-bold border-b border-white/10">
 <tr>
 <th className="px-8 py-5">Dataset Name</th>
 <th className="px-8 py-5">Rows</th>
 <th className="px-8 py-5">Upload Time</th>
 <th className="px-8 py-5">Status</th>
 <th className="px-8 py-5 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5 bg-black/20">
 {datasets.length === 0 ? (
 <tr>
 <td colSpan="5" className="px-8 py-20 text-center">
 <div className="flex flex-col items-center justify-center">
 <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-600">
 <Database size={24} />
 </div>
 <h4 className="text-sm font-bold text-gray-400 mb-1">No Datasets Found</h4>
 <p className="text-xs text-gray-600 font-mono">Upload a CSV file above to begin indexing data.</p>
 </div>
 </td>
 </tr>
 ) : datasets.map((dataset, idx) => (
 <tr key={idx} className="hover:bg-white/5 transition-colors group">
 <td className="px-8 py-5">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg bg-[#c4f033]/10 border border-[#c4f033]/20 flex items-center justify-center">
 <Table2 size={14} className="text-[#c4f033]" />
 </div>
 <span className="font-bold text-white tracking-tight">{dataset.name}</span>
 </div>
 </td>
 <td className="px-8 py-5 text-gray-400 font-mono text-xs">{dataset.rows.toLocaleString()}</td>
 <td className="px-8 py-5 text-gray-400 font-mono text-xs">{new Date(parseInt(dataset.time) * 1000).toLocaleString()}</td>
 <td className="px-8 py-5">
 <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-[0.2em] border border-[#c4f033]/30 bg-[#c4f033]/10 text-[#c4f033] shadow-[0_0_10px_rgba(196,240,51,0.1)]">
 <span className="w-1.5 h-1.5 rounded-full bg-[#c4f033] animate-pulse"></span>
 Ready
 </span>
 </td>
 <td className="px-8 py-5 text-right">
 <button onClick={() => handleDelete(dataset.name)} className="text-xs text-red-500 hover:text-red-400 font-bold transition-colors flex items-center justify-end gap-2 ml-auto">
 <Trash2 size={14} />
 Delete
 </button>
 </td>
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

export default StorageView;
