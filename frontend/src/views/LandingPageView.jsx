import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPageView = () => {
 const navigate = useNavigate();

 return (
 <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
 
 {/* Background styling to match the pitch black theme */}
 <style>{`
 body { background-color: #000 !important; }
 body::before, body::after { display: none !important; }
 `}</style>

 {/* Top Nav */}
 <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full relative z-10">
 <div className="flex items-center gap-12">
 {/* Logo */}
 <div className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl shadow-lg">
    <img src="/logo-full.png" alt="Query Engine" className="h-8 w-auto object-contain" />
 </div>
 
 {/* Links */}
 <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-400">
 <a href="#" className="hover:text-white transition-colors">Marketplace</a>
 <a href="#" className="hover:text-white transition-colors">Discover</a>
 <a href="#" className="hover:text-white transition-colors">Collections</a>
 <a href="#" className="hover:text-white transition-colors">Wallet</a>
 </div>
 </div>

 <div className="flex items-center gap-6">
 <button onClick={() => navigate('/login')} className="text-sm font-medium hover:text-gray-300 transition-colors">Log In</button>
 <button onClick={() => navigate('/login')} className="px-6 py-2.5 rounded-full border border-[#333] text-sm font-medium hover:bg-white/5 transition-colors">
 Sign Up
 </button>
 </div>
 </nav>

 {/* Main Content Area */}
 <main className="flex-1 flex flex-col lg:flex-row items-center justify-between max-w-[1400px] mx-auto w-full px-8 py-12 gap-16 relative z-10">
 
 {/* Left Side: Copy */}
 <div className="flex-1 w-full lg:max-w-[650px] shrink-0">
 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="text-[48px] lg:text-[68px] font-medium leading-[1.1] tracking-tight mb-8"
 >
 Fostering <span className="text-[#eab308]">Confidence</span><br/>
 and <span className="text-[#eab308]">Clarity</span> within the<br/>
 NFT Ecosystem
 </motion.h1>
 
 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.2 }}
 className="text-gray-400 text-lg lg:text-xl mb-12 max-w-lg leading-relaxed"
 >
 Acquire premium NFTs from leading creators and contribute to the expansion of the NFT ecosystem
 </motion.p>

 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.4 }}
 className="flex items-center gap-6"
 >
 <motion.button 
 whileHover={{ scale: 1.02, backgroundColor:"#d4ed31" }}
 whileTap={{ scale: 0.98 }}
 onClick={() => navigate('/login')}
 className="bg-[#c4f033] text-black px-10 py-4 rounded-[18px] font-bold text-lg transition-colors"
 >
 Start Collecting
 </motion.button>
 <motion.button 
 whileHover={{ scale: 1.02, backgroundColor:"rgba(255,255,255,0.05)" }}
 whileTap={{ scale: 0.98 }}
 className="px-10 py-4 rounded-[18px] border border-white/20 text-gray-300 font-medium text-lg transition-colors"
 >
 Learn How
 </motion.button>
 </motion.div>
 </div>

 {/* Right Side: Image Card */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.8, delay: 0.3 }}
 className="w-full lg:w-[600px] xl:w-[700px] shrink-0 relative"
 >
 {/* Main Image */}
 <div className="w-full aspect-square rounded-[40px] overflow-hidden relative shadow-[0_0_50px_rgba(234,179,8,0.05)]">
 <img 
 src="/hero-bg.png" 
 alt="Sci-Fi Dunes" 
 className="w-full h-full object-cover"
 />
 
 {/* Floating Profile Badge */}
 <motion.div 
 initial={{ y: 20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.8, duration: 0.5 }}
 className="absolute top-8 left-8 bg-[#222128] border border-white/5 rounded-[20px] p-2 pr-6 flex items-center gap-3 shadow-2xl"
 >
 <div className="w-10 h-10 rounded-full bg-[#111] overflow-hidden flex items-center justify-center text-xl">
 🧑🏽‍🚀
 </div>
 <span className="text-white font-medium text-[15px]">zealous_bunny_37</span>
 </motion.div>

 {/* Pagination / Dots indicator */}
 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
 <div className="w-8 h-1 bg-[#c4f033] rounded-full"></div>
 <div className="w-8 h-1 bg-white/20 rounded-full"></div>
 <div className="w-8 h-1 bg-white/20 rounded-full"></div>
 </div>
 </div>
 </motion.div>

 </main>
 </div>
 );
};

export default LandingPageView;
