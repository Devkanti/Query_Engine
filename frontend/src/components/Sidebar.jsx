import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, Activity, HardDrive, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ role, isOpen, toggleSidebar }) => {
 const companyNav = [
 { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
 { name: 'Query Engine', path: '/query', icon: Database },
 { name: 'Performance', path: '/performance', icon: Activity },
 { name: 'Storage', path: '/storage', icon: HardDrive },
 ];

 const adminNav = [
 { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
 { name: 'User Audit', path: '/admin/audit', icon: Users },
 ];

 const mainNav = role === 'admin' ? adminNav : companyNav;

  return (
  <>
    {/* Mobile Overlay */}
    {isOpen && (
      <div 
        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
        onClick={toggleSidebar}
      />
    )}
    <div className={`transition-all duration-300 flex flex-col justify-between text-sm flex-shrink-0 bg-black/95 md:bg-transparent border-r border-white/5 absolute md:relative z-50 h-full ${isOpen ? 'w-64 opacity-100 left-0' : 'w-0 opacity-0 overflow-hidden border-none -left-64 md:left-0'}`}>
 <div className="w-64">
 <div className="p-6 pb-4 flex flex-col items-center">
    <img src="/logo-full.png" alt="Query Engine" className="h-20 w-auto object-contain" />
    <p className="text-[11px] text-[#eab308] font-bold mt-3 text-center">{role === 'admin' ? 'SYSTEM ADMIN' : 'ANALYTICS ENGINE'}</p>
 </div>



 <nav className="space-y-1 px-3">
 {mainNav.map((item) => {
 const Icon = item.icon;
 return (
 <NavLink
 key={item.name}
 to={item.path}
 end={item.path === '/'}
 className={({ isActive }) =>
 `relative flex items-center gap-3 px-4 py-3 rounded-[16px] transition-colors ${
 isActive
 ? 'text-black font-bold'
 : 'text-gray-400 hover:text-white hover:bg-[#111]'
 }`
 }
 >
 {({ isActive }) => (
 <>
 {isActive && (
 <motion.div
 layoutId="sidebar-active-pill"
 className="absolute inset-0 rounded-[16px] bg-[#c4f033]"
 transition={{ type: 'spring', stiffness: 300, damping: 30 }}
 />
 )}
 <span className="relative z-10 flex items-center gap-3">
 <Icon size={18} className={isActive ? 'text-black' : ''} />
 {item.name}
 </span>
 </>
 )}
 </NavLink>
 );
 })}
 </nav>
 </div>

 </div>
  </>
 );
};

export default Sidebar;
