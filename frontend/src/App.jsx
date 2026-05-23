import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import LoadingScreen from './components/LoadingScreen';
import MainLayout from './components/MainLayout';
import QueryEngineView from './views/QueryEngineView';
import DashboardView from './views/DashboardView';
import PerformanceView from './views/PerformanceView';
import AdminDashboardView from './views/AdminDashboardView';
import UserAuditView from './views/UserAuditView';
import StorageView from './views/StorageView';
import LoginView from './views/LoginView';
import axios from 'axios';

axios.interceptors.request.use(config => {
  const company = sessionStorage.getItem('company_name');
  if (company) {
    config.headers['X-Company-ID'] = company;
  }
  return config;
});

const AdminRoute = ({ children }) => {
 const token = sessionStorage.getItem('admin_token');
 if (!token) return <Navigate to="/login" replace />;
 return children;
};

const CompanyRoute = ({ children }) => {
 const token = sessionStorage.getItem('company_token');
 if (!token) return <Navigate to="/login" replace />;
 return children;
};

function App() {
 const [isLoading, setIsLoading] = useState(true);

 return (
 <>
 <Toaster 
   position="bottom-left" 
   toastOptions={{ 
     className: 'backdrop-blur-xl',
     style: { 
       background: 'rgba(10, 10, 10, 0.85)', 
       color: '#fff', 
       border: '1px solid rgba(255,255,255,0.08)', 
       borderRadius: '16px',
       padding: '14px 20px',
       boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
       fontSize: '13px',
       fontWeight: '600',
       letterSpacing: '0.02em',
     },
     success: {
       iconTheme: { primary: '#c4f033', secondary: '#050505' },
       style: { border: '1px solid rgba(196,240,51,0.2)', boxShadow: '0 0 30px rgba(196,240,51,0.1)' }
     },
     error: {
       iconTheme: { primary: '#ef4444', secondary: '#050505' },
       style: { border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 0 30px rgba(239,68,68,0.1)' }
     }
   }} 
 />
 <AnimatePresence mode="wait">
 {isLoading && <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />}
 </AnimatePresence>
 
 {!isLoading && (
 <Router>
 <Routes>
 {/* Public Routes */}
 <Route path="/login" element={<LoginView />} />
 
 {/* Company Routes */}
 <Route path="/" element={<CompanyRoute><MainLayout role="company" /></CompanyRoute>}>
 <Route index element={<Navigate to="dashboard" replace />} />
 <Route path="dashboard" element={<DashboardView />} />
 <Route path="/query" element={<QueryEngineView />} />
 <Route path="/performance" element={<PerformanceView />} />
 <Route path="/storage" element={<StorageView />} />
 </Route>

 {/* Admin Routes */}
 <Route path="/admin" element={<AdminRoute><MainLayout role="admin" /></AdminRoute>}>
 <Route index element={<Navigate to="dashboard" replace />} />
 <Route path="dashboard" element={<AdminDashboardView />} />
 <Route path="audit" element={<UserAuditView />} />
 </Route>
 
 <Route path="*" element={<Navigate to="/" replace />} />
 </Routes>
 </Router>
 )}
 </>
 );
}

export default App;
