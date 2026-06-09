import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield, Building2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const LoginView = () => {
  const [activeTab, setActiveTab] = useState('company'); // 'company' or 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = (activeTab === 'company' && isRegistering) ? '/register' : '/login';
      const payload = activeTab === 'admin' ? { username: 'admin', password } : { username, password };
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        if (activeTab === 'company' && isRegistering) {
          toast.success('Account created successfully');
          setIsRegistering(false);
          setPassword('');
        } else {
          const data = await res.json();
          toast.success('Successfully logged in');
          if (data.role === 'admin') {
            sessionStorage.setItem('admin_token', data.token);
            navigate('/admin/dashboard');
          } else {
            sessionStorage.setItem('company_token', data.token);
            sessionStorage.setItem('company_name', data.company);
            navigate('/query');
          }
        }
      } else {
        if (res.status === 409) {
          setError('Username already exists');
          toast.error('Username already exists');
        } else {
          const msg = (activeTab === 'company' && isRegistering) ? 'Registration failed' : 'Invalid credentials';
          setError(msg);
          toast.error(msg);
        }
      }
    } catch {
      setError('Invalid credentials');
      toast.error('Network error. Check connection.');
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setUsername('');
    setPassword('');
    setIsRegistering(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#030303] items-center justify-center font-sans overflow-hidden relative">

      {/* Admin Toggle (Top Right) */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
        <button
          onClick={() => switchTab(activeTab === 'admin' ? 'company' : 'admin')}
          className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.08] transition-all text-xs md:text-sm font-bold text-gray-400 hover:text-white backdrop-blur-md shadow-2xl"
        >
          {activeTab === 'admin' ? 'Company Login' : 'Admin Access'}
        </button>
      </div>

      {/* Animated Dot Pattern Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 2px, transparent 2px)',
            backgroundSize: '32px 32px',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 85%)',
            maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 85%)'
          }}
        />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] mx-4 sm:mx-auto bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-[0_0_80px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden"
      >

        {/* Subtle Top Highlight */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Header Section */}
        <div className="pt-8 pb-4 md:pt-12 md:pb-6 px-6 md:px-10 text-center relative z-10 flex flex-col items-center">
          <motion.div
            key={activeTab}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center mb-4 md:mb-6"
          >
            <img src="/logo-full.png" alt="Query Engine" className="h-16 md:h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
          </motion.div>
          <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">Sign in to your account</p>
        </div>

        {/* Removed Tab Toggle */}

        {/* Form Container */}
        <div className="p-6 md:p-10 relative z-10">
          <AnimatePresence mode="wait">
            <motion.form
              key={activeTab + isRegistering}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleAuth}
              className="space-y-5"
            >

              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium p-3 rounded-xl text-center">
                  {error}
                </motion.div>
              )}

              {activeTab === 'company' && (
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-2">Company Name</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder-gray-600"
                      placeholder="Company Name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-2">{activeTab === 'admin' ? 'Access Key' : 'Password'}</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder-gray-600"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className={`w-full py-3.5 mt-4 rounded-xl font-medium text-sm transition-all flex justify-center items-center gap-2 ${activeTab === 'company'
                    ? 'bg-white text-black hover:bg-gray-100 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                  }`}
              >
                {activeTab === 'admin' ? 'Authorize Admin' : (isRegistering ? 'Create Workspace' : 'Sign In')}
              </motion.button>

              {activeTab === 'company' && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-xs text-gray-500 hover:text-white transition-colors"
                  >
                    {isRegistering ? 'Already registered? Sign in' : "Don't have an account? Sign up"}
                  </button>
                </div>
              )}

            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>

 {/* Made By Badge */}
 <div 
 className="relative mt-8 md:mt-0 md:absolute md:bottom-8 md:right-8 z-50"
 onMouseEnter={() => setIsTeamOpen(true)}
 onMouseLeave={() => setIsTeamOpen(false)}
 >
   
 {/* Expandable Team List Wrapper */}
 <div className={`absolute bottom-full left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 pb-4 transition-all duration-400 ease-out z-50 w-[280px] md:w-72 max-w-[90vw] ${isTeamOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
 <div className="w-full bg-[#030303]/90 backdrop-blur-3xl border border-white/10 rounded-[24px] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
 <div className="flex items-center justify-center mb-4 border-b border-white/10 pb-3">
 <span className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] text-center">Project Team</span>
 </div>

 <div className="flex flex-col gap-1">
 {/* Agrima */}
 <a href="https://github.com/workagrimag186-max" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors group/link">
 <div className="flex items-center gap-3">
 <img src="https://github.com/workagrimag186-max.png" alt="Agrima" className="w-8 h-8 rounded-full object-cover border border-white/20 group-hover/link:border-white/50 transition-colors bg-[#111]" />
 <div className="flex flex-col">
 <span className="text-[13px] text-white font-bold group-hover/link:text-gray-300 transition-colors">Agrima Gupta</span>
 <span className="text-[10px] text-gray-400 font-medium">Lead Developer</span>
 </div>
 </div>
 <svg className="w-4 h-4 text-gray-500 group-hover/link:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
 </a>

 {/* Devkanti */}
 <a href="https://devkantisarkar.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors group/link">
 <div className="flex items-center gap-3">
 <img src="https://github.com/Devkanti.png" alt="Devkanti" className="w-8 h-8 rounded-full object-cover border border-white/20 group-hover/link:border-white/50 transition-colors bg-[#111]" />
 <div className="flex flex-col">
 <span className="text-[13px] text-white font-bold group-hover/link:text-gray-300 transition-colors">Devkanti Sarkar</span>
 <span className="text-[10px] text-gray-400 font-medium">Backend Developer</span>
 </div>
 </div>
 <svg className="w-4 h-4 text-gray-500 group-hover/link:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
 </a>

 {/* Mohar */}
 <a href="https://mohargorai.github.io/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors group/link">
 <div className="flex items-center gap-3">
 <img src="https://github.com/mohargorai.png" alt="Mohar" className="w-8 h-8 rounded-full object-cover border border-white/20 group-hover/link:border-white/50 transition-colors bg-[#111]" />
 <div className="flex flex-col">
 <span className="text-[13px] text-white font-bold group-hover/link:text-gray-300 transition-colors">Mohar Gorai</span>
 <span className="text-[10px] text-gray-400 font-medium">Frontend Developer</span>
 </div>
 </div>
 <svg className="w-4 h-4 text-gray-500 group-hover/link:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
 </a>
 </div>
 </div>
 </div>

 {/* The Main Pill */}
 <div 
 onClick={() => setIsTeamOpen(!isTeamOpen)}
 className="flex items-center gap-4 px-2 py-2 pr-6 rounded-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 hover:bg-white/[0.06] active:bg-white/[0.08] transition-all shadow-2xl cursor-pointer relative overflow-hidden"
 >
 {/* Overlapping Avatars */}
 <div className="flex items-center -space-x-3 ml-1">
 <img src="https://github.com/workagrimag186-max.png" alt="Agrima" className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] object-cover relative z-30 bg-[#111]" />
 <img src="https://github.com/Devkanti.png" alt="Devkanti" className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] object-cover relative z-20 bg-[#111]" />
 <img src="https://github.com/mohargorai.png" alt="Mohar" className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] object-cover relative z-10 bg-[#111]" />
 </div>
 
 <div className="flex flex-col justify-center text-left">
 <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-tight mb-[2px]">Developed By</span>
 <span className="text-[13px] text-white font-bold leading-tight tracking-wide">Project Team</span>
 </div>
 </div>
 </div>
 </div>
  );
};

export default LoginView;
