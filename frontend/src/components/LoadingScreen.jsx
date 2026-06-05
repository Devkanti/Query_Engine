import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const interval = 25;
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(onComplete, 500);
      }
      setProgress(current);
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030303] overflow-hidden"
    >
      {/* Premium Blueprint / Precision Engine Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        {/* Outer Engine Ring */}
        <motion.svg 
          animate={{ rotate: 360 }} 
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 100 100" 
          className="absolute w-[120vh] h-[120vh]"
          fill="none" 
          stroke="white" 
          strokeWidth="0.1"
        >
          <circle cx="50" cy="50" r="48" strokeDasharray="0.5 1" />
          <circle cx="50" cy="50" r="45" />
          {Array.from({ length: 72 }).map((_, i) => (
            <line key={i} x1="50" y1="2" x2="50" y2="5" transform={`rotate(${i * 5} 50 50)`} />
          ))}
        </motion.svg>

        {/* Middle Engine Turbine */}
        <motion.svg 
          animate={{ rotate: -360 }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 100 100" 
          className="absolute w-[80vh] h-[80vh]"
          fill="none" 
          stroke="white" 
          strokeWidth="0.1"
        >
          <circle cx="50" cy="50" r="40" />
          <circle cx="50" cy="50" r="38" strokeDasharray="2 2" />
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d="M50 10 L52 20 L48 20 Z" transform={`rotate(${i * 30} 50 50)`} fill="white" fillOpacity="0.1" />
          ))}
        </motion.svg>

        {/* Inner Engine Core */}
        <motion.svg 
          animate={{ rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 100 100" 
          className="absolute w-[40vh] h-[40vh]"
          fill="none" 
          stroke="white" 
          strokeWidth="0.2"
        >
          <circle cx="50" cy="50" r="25" />
          <circle cx="50" cy="50" r="20" strokeDasharray="1 3" strokeWidth="0.5" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1="50" y1="25" x2="50" y2="30" transform={`rotate(${i * 45} 50 50)`} strokeWidth="0.5" />
          ))}
        </motion.svg>
      </div>

      {/* Crosshairs / Target overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white" />
      </div>

      {/* Main UI Container */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[400px]">
        
        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-2xl font-light tracking-[0.4em] uppercase text-white mb-8"
        >
          Query<span className="font-bold">Engine</span>
        </motion.h1>

        {/* Progress Bar Container */}
        <div className="w-full relative mb-6">
          <div className="w-full h-[1px] bg-white/10 relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-white"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Minimal Status Text */}
        <div className="flex w-full justify-between items-center text-[10px] tracking-[0.2em] font-mono text-gray-500 uppercase">
          <motion.span 
            key={progress < 30 ? '1' : progress < 60 ? '2' : progress < 90 ? '3' : '4'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400"
          >
            {progress < 30 ? 'Initializing Engine' 
             : progress < 60 ? 'Loading Architecture' 
             : progress < 90 ? 'Optimizing Query Graphs' 
             : 'Ready'}
          </motion.span>
          <span className="text-white font-medium">{Math.floor(progress)}%</span>
        </div>
      </div>

    </motion.div>
  );
};

export default LoadingScreen;
