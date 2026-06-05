import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 3 seconds to let them enjoy the animation
    const interval = 30; // ms
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(onComplete, 600);
      }
      setProgress(current);
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020505] overflow-hidden perspective-[1000px]"
    >
      {/* Dynamic Floor Grid (Motion) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div 
          animate={{ translateY: [0, 40] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-full h-[200%] absolute bottom-0"
          style={{
            backgroundImage: 'linear-gradient(to bottom, transparent 39px, #a7f3d0 40px), linear-gradient(to right, transparent 39px, #a7f3d0 40px)',
            backgroundSize: '40px 40px',
            transform: 'rotateX(60deg) translateY(-50%)',
            transformOrigin: 'top center',
            maskImage: 'linear-gradient(to top, black 10%, transparent 60%)',
            WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 60%)'
          }}
        />
      </div>

      {/* Massive Engine Gears Structure */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none mix-blend-screen opacity-40">
        {/* Outer Gear */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-[900px] h-[900px]"
        >
          {[...Array(24)].map((_, i) => (
            <div key={i} className="absolute top-0 left-1/2 w-6 h-full -ml-3" style={{ transform: `rotate(${i * 15}deg)` }}>
              <div className="w-full h-8 bg-[#a7f3d0]/20 rounded-sm shadow-[0_0_15px_#a7f3d0]" />
              <div className="w-full h-8 bg-[#a7f3d0]/20 rounded-sm absolute bottom-0 shadow-[0_0_15px_#a7f3d0]" />
            </div>
          ))}
          <div className="absolute inset-6 rounded-full border-[12px] border-white/10" />
        </motion.div>

        {/* Counter-Rotating Inner Mechanism */}
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[650px] h-[650px]"
        >
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute top-0 left-1/2 w-12 h-full -ml-6" style={{ transform: `rotate(${i * 30}deg)` }}>
              <div className="w-full h-16 bg-white/5 border border-white/20 rounded-b-xl backdrop-blur-md" />
              <div className="w-full h-16 bg-white/5 border border-white/20 rounded-t-xl absolute bottom-0 backdrop-blur-md" />
            </div>
          ))}
          <div className="absolute inset-16 rounded-full border-4 border-[#a7f3d0]/30 border-dashed" />
        </motion.div>

        {/* Rapid Core Spinner */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.05, 1] }} 
          transition={{ rotate: { duration: 5, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute w-[350px] h-[350px] rounded-full border-t-4 border-b-4 border-white shadow-[0_0_40px_rgba(255,255,255,0.8)]"
        />
        
        {/* Pulsing Core Glow */}
        <motion.div 
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[200px] h-[200px] rounded-full bg-[#a7f3d0] blur-[100px]"
        />
      </div>
      
      {/* Floating Data Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: '-10vh', opacity: [0, 1, 0] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "linear", delay: Math.random() * 2 }}
            className="absolute w-1 h-8 bg-gradient-to-t from-transparent to-[#a7f3d0] rounded-full"
            style={{ left: `${Math.random() * 100}vw` }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-[600px] px-8 bg-black/40 backdrop-blur-sm p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Glitching Title */}
        <div className="relative mb-16 overflow-hidden pb-2 px-4">
          <motion.h1 
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.4em' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-[#a7f3d0] to-white drop-shadow-[0_0_25px_rgba(167,243,208,0.4)] text-center relative z-10"
          >
            Query Engine
          </motion.h1>
          {/* Scanline Effect over title */}
          <motion.div 
            animate={{ top: ['-20%', '120%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-1 bg-white opacity-80 blur-[1px] z-20 mix-blend-overlay"
          />
        </div>

        {/* High-Tech Progress Bar Container */}
        <div className="w-full relative mb-12">
          {/* Hexagonal decorative ends */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-4 border border-[#a7f3d0]/50 border-r-0 rounded-l-sm" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-4 border border-[#a7f3d0]/50 border-l-0 rounded-r-sm" />
          
          <div className="w-full h-2 bg-white/5 overflow-hidden relative rounded-full border border-white/10 shadow-inner">
            {/* Glowing Progress Fill */}
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-[#a7f3d0] to-white shadow-[0_0_20px_#a7f3d0]"
              style={{ width: `${progress}%` }}
            />
            {/* Moving flare on the tip */}
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 w-8 h-4 bg-white rounded-full blur-[4px]"
              style={{ left: `calc(${progress}% - 16px)` }}
            />
          </div>
        </div>

        {/* HUD Status Text */}
        <div className="flex w-full justify-between items-end font-mono uppercase">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] text-[#a7f3d0] tracking-[0.3em] opacity-70">System Status</span>
            <motion.span 
              key={progress < 30 ? 'init' : progress < 60 ? 'cache' : progress < 90 ? 'opt' : 'ready'}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-gray-200 text-xs tracking-[0.2em] font-bold"
            >
              {progress < 30 ? 'Engaging Core Protocols...' 
               : progress < 60 ? 'Compiling Query Matrix...' 
               : progress < 90 ? 'Overclocking CPU Threads...' 
               : 'System Online'}
            </motion.span>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] text-[#a7f3d0] tracking-[0.3em] opacity-70">Power Level</span>
            <div className="flex items-end gap-1">
              <span className="text-white font-black text-3xl leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                {Math.floor(progress)}
              </span>
              <span className="text-gray-400 font-bold text-sm mb-0.5">%</span>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default LoadingScreen;
