import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
 const [progress, setProgress] = useState(0);

 useEffect(() => {
 const duration = 2500; // 2.5 seconds
 const interval = 25; // ms
 const steps = duration / interval;
 const increment = 100 / steps;
 
 let current = 0;
 const timer = setInterval(() => {
 current += increment;
 if (current >= 100) {
 current = 100;
 clearInterval(timer);
 setTimeout(onComplete, 400); // Wait a bit at 100% before completing
 }
 setProgress(current);
 }, interval);

 return () => clearInterval(timer);
 }, [onComplete]);

 return (
 <motion.div 
 initial={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.8, ease: 'easeInOut' }}
 className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030303] overflow-hidden"
 >
 {/* Black & White Grid / Dots Animation */}
 <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
 
 {/* Engine Core Concentric Rings */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-30 pointer-events-none mix-blend-screen">
 <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute w-[800px] h-[800px] border border-white/5 rounded-full border-t-white/20 border-b-white/20" />
 <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute w-[500px] h-[500px] border border-white/5 rounded-full border-l-white/40 border-r-white/40" />
 <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute w-[300px] h-[300px] border border-white/10 rounded-full border-t-[#a7f3d0]/40 border-b-[#a7f3d0]/40 border-dashed" />
 </div>
 
 <div className="relative z-10 flex flex-col items-center w-full max-w-[500px] px-6">
 
 {/* Title */}
 <motion.h1 
 initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
 animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
 transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
 className="text-3xl md:text-5xl font-black tracking-[0.4em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-white to-gray-400 mb-16 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] text-center"
 >
 Query Engine
 </motion.h1>

 {/* Progress Bar */}
 <div className="w-full h-[2px] bg-white/10 overflow-hidden mb-10 relative rounded-full">
 {/* Glowing Progress Fill */}
 <motion.div 
 className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-[#a7f3d0] to-white shadow-[0_0_20px_#a7f3d0]"
 style={{ width: `${progress}%` }}
 />
 </div>

 {/* Status Text */}
 <div className="flex flex-col items-center gap-4 font-mono text-[11px] tracking-[0.3em] uppercase">
 <motion.span 
 key={progress < 30 ? 'init' : progress < 60 ? 'cache' : progress < 90 ? 'opt' : 'ready'}
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.3 }}
 className="text-gray-400 text-center h-4"
 >
 {progress < 30 ? 'Booting Engine Core...' 
 : progress < 60 ? 'Loading Approx Schemas...' 
 : progress < 90 ? 'Optimizing Sketches...' 
 : 'System Ready'}
 </motion.span>
 
 <div className="flex items-end gap-1 mt-2">
 <span className="text-white font-black text-2xl leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
 {Math.floor(progress)}
 </span>
 <span className="text-gray-500 font-bold text-xs mb-0.5">%</span>
 </div>
 </div>
 </div>

 </motion.div>
 );
};

export default LoadingScreen;
