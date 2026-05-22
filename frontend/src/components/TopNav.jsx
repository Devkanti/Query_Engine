import { LogOut, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const TopNav = ({ role, toggleSidebar }) => {
 const location = useLocation();
 const navigate = useNavigate();

 const getPageTitle = () => {
 switch (location.pathname) {
 case '/dashboard': return 'Dashboard';
 case '/query': return 'Query Engine';
 case '/storage': return 'Storage & Datasets';
 case '/performance': return 'Performance Benchmarks';
 case '/admin/dashboard': return 'Admin Dashboard';
 default: return 'Query Engine';
 }
 };

 const handleLogout = () => {
    if (role === 'admin') {
      sessionStorage.removeItem('admin_token');
    } else {
      sessionStorage.removeItem('company_token');
      sessionStorage.removeItem('company_name');
    }
    toast.success('Successfully logged out');
    navigate('/login');
 };

 return (
 <header className="h-16 flex items-center justify-between px-6 text-sm flex-shrink-0 bg-transparent border-b border-white/5">
 <div className="flex items-center gap-6">
 <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
 <Menu size={20} />
 </button>
 <h2 className="text-xl font-bold text-white tracking-tight">{getPageTitle()}</h2>
 </div>

 <div className="flex items-center gap-6">
 <button 
 onClick={handleLogout}
 className="flex items-center gap-2 bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 px-4 py-1.5 rounded-full text-red-400 transition-colors font-bold text-[10px]"
 >
 <LogOut size={14} />
 <span>Logout</span>
 </button>
 </div>
 </header>
 );
};

export default TopNav;
