import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// High-end metallic turbine component
const Turbine = ({ blades, size, speed, reverse, innerRing }) => {
  return (
    <motion.div 
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      className="absolute flex items-center justify-center rounded-full"
      style={{ 
        width: size, 
        height: size, 
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9), 0 0 50px rgba(0,0,0,0.8)',
        border: '2px solid rgba(255,255,255,0.03)',
        background: 'radial-gradient(circle, rgba(10,10,10,1) 0%, rgba(2,2,2,1) 100%)'
      }}
    >
      {/* Blades */}
      {Array.from({ length: blades }).map((_, i) => (
        <div 
          key={i} 
          className="absolute top-1/2 left-1/2 origin-left"
          style={{ 
            transform: `translateY(-50%) rotate(${(360 / blades) * i}deg)`,
            width: size / 2,
            height: size * 0.08,
            background: 'linear-gradient(to right, #0a0a0a 0%, #2a2a2a 40%, #525252 80%, #1a1a1a 100%)',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            borderBottom: '2px solid rgba(0,0,0,0.9)',
            clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 70%)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.8)'
          }}
        />
      ))}
      
      {/* Inner Casing Shadow */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(0,0,0,1)] pointer-events-none" />

      {/* Central Hub */}
      <div 
        className="absolute rounded-full border border-white/5 flex items-center justify-center"
        style={{
          width: innerRing,
          height: innerRing,
          background: 'linear-gradient(135deg, #333 0%, #111 50%, #000 100%)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), inset 0 2px 5px rgba(255,255,255,0.1)'
        }}
      >
        <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-[#0a0a0a] to-[#222] shadow-[inset_0_5px_15px_rgba(0,0,0,1)]" />
      </div>
    </motion.div>
  );
};

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const interval = 30;
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
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020202] overflow-hidden"
    >
      {/* Ambient Engine Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />

      {/* Parallax Engine Parts (Turbines) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none scale-[1.2] md:scale-100 opacity-80">
        {/* Stage 1: Massive Outer Intake Turbine */}
        <Turbine blades={48} size={1400} speed={40} reverse={false} innerRing={800} />
        
        {/* Stage 2: Mid Compression Turbine */}
        <div className="absolute shadow-[0_0_100px_rgba(0,0,0,1)] rounded-full">
          <Turbine blades={36} size={800} speed={25} reverse={true} innerRing={400} />
        </div>

        {/* Stage 3: High-Pressure Inner Core */}
        <div className="absolute shadow-[0_0_80px_rgba(0,0,0,1)] rounded-full">
          <Turbine blades={24} size={400} speed={10} reverse={false} innerRing={150} />
        </div>
      </div>

      {/* Elegant Frosted Glass UI Panel */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[500px] px-10 py-12 bg-black/30 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)]">
        
        {/* Premium Corporate Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-4xl font-extralight tracking-[0.3em] uppercase text-white mb-10 flex flex-col items-center gap-2"
        >
          <span>Query</span>
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 tracking-[0.4em]">Engine</span>
        </motion.h1>

        {/* Sophisticated Progress Bar */}
        <div className="w-full relative mb-8">
          <div className="w-full h-[3px] bg-white/5 relative rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,1)]">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-600 via-gray-200 to-white"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Subtle flare tracking the progress */}
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[6px] opacity-60"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>

        {/* Professional Status Readout */}
        <div className="flex w-full justify-between items-end font-sans uppercase">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-500 tracking-[0.2em] font-semibold">Engine Status</span>
            <motion.span 
              key={progress < 30 ? 'init' : progress < 60 ? 'load' : progress < 90 ? 'opt' : 'ready'}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-gray-200 text-xs tracking-[0.1em] font-medium"
            >
              {progress < 30 ? 'Initializing Rotor Assembly' 
               : progress < 60 ? 'Pressurizing Query Matrix' 
               : progress < 90 ? 'Synchronizing Data Streams' 
               : 'System Operational'}
            </motion.span>
          </div>
          
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[9px] text-gray-500 tracking-[0.2em] font-semibold">Load</span>
            <div className="flex items-start">
              <span className="text-white font-medium text-2xl leading-none tracking-tighter">
                {Math.floor(progress)}
              </span>
              <span className="text-gray-400 font-medium text-xs ml-0.5">%</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default LoadingScreen;
