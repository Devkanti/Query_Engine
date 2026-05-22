import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { motion } from 'framer-motion';
import { useState } from 'react';

const MainLayout = ({ role }) => {
 const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

 return (
 <div className="flex h-screen text-gray-300 font-sans bg-black relative overflow-hidden">
 {/* Global Animated B&W Background */}
 <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
 <motion.div 
 animate={{ rotate: 360 }}
 transition={{ duration: 150, repeat: Infinity, ease:"linear" }}
 className="absolute top-[-20%] right-[-10%] w-[1200px] h-[1200px] border-[1px] border-white/5 rounded-full pointer-events-none z-0"
 />
 <motion.div 
 animate={{ rotate: -360 }}
 transition={{ duration: 200, repeat: Infinity, ease:"linear" }}
 className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] border-[1px] border-white/10 rounded-full pointer-events-none z-0"
 />

 {/* Sidebar */}
 <div className="relative z-10 flex h-full">
 <Sidebar role={role} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
 </div>

 {/* Main Content Area */}
 <div className="relative z-10 flex-1 flex flex-col min-w-0 bg-transparent">
 <TopNav role={role} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
 <main className="flex-1 overflow-auto p-8 bg-transparent">
 <div className="max-w-7xl mx-auto h-full">
 <Outlet />
 </div>
 </main>
 </div>
 </div>
 );
};

export default MainLayout;
