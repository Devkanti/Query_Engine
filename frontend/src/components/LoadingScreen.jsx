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
 className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
 >
 {/* Black & White Grid / Dots Animation (same as Login) */}
 <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
 <motion.div 
 animate={{ rotate: 360 }}
 transition={{ duration: 150, repeat: Infinity, ease:"linear" }}
 className="absolute w-[800px] h-[800px] border-[1px] border-white/5 rounded-full pointer-events-none"
 />
 
 <div className="relative z-10 flex flex-col items-center w-[400px]">
 
 <motion.h1 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }}
 className="text-3xl font-bold tracking-[0.3em] text-white mb-12"
 >
 Query Engine
 </motion.h1>

 <div className="w-full h-[2px] bg-white/10 overflow-hidden mb-6">
 <motion.div 
 className="h-full bg-white"
 style={{ width: `${progress}%` }}
 />
 </div>

 <div className="flex flex-col items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-gray-500">
 <span>{progress < 40 ? 'Initializing Engine...' : progress < 80 ? 'Optimizing Probabilistic Sketches...' : 'Ready'}</span>
 <span className="text-white font-bold text-xs">{Math.floor(progress)}%</span>
 </div>
 </div>

 </motion.div>
 );
};

export default LoadingScreen;
