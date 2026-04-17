/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  Scale, 
  Search, 
  Plus, 
  LogOut, 
  LogIn, 
  ChevronRight, 
  FileText, 
  MapPin, 
  User, 
  Calendar, 
  Trash2, 
  Edit,
  ArrowLeft,
  X,
  Menu,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LitigationRecord } from './types.ts';

// Pages
import HomePage from './pages/HomePage.tsx';
import SearchResultsPage from './pages/SearchResultsPage.tsx';
import AddCasePage from './pages/AddCasePage.tsx';
import CaseDetailPage from './pages/CaseDetailPage.tsx';
import UpdateCasePage from './pages/UpdateCasePage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import LoginPage from './pages/LoginPage.tsx';

function Layout({ children, isAdmin, setIsAdmin }: { children: React.ReactNode, isAdmin: boolean, setIsAdmin: (val: boolean) => void }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-gray-900 leading-none block">LITIGATION</span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-0.5">TRACKING SYSTEM</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Home</Link>
              {isAdmin ? (
                <>
                  <Link to="/admin" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Dashboard</Link>
                  <Link to="/add-record" className="inline-flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm">
                    <Plus className="h-4 w-4" />
                    <span>New Record</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="inline-flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="inline-flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <LogIn className="h-4 w-4" />
                  <span className="text-sm font-medium underline underline-offset-4">Admin Access</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/" className="block px-3 py-4 text-base font-medium text-gray-700 border-b border-gray-50 hover:bg-gray-50">Home</Link>
                {isAdmin ? (
                  <>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/admin" className="block px-3 py-4 text-base font-medium text-gray-700 border-b border-gray-50 hover:bg-gray-50">Dashboard</Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/add-record" className="block px-3 py-4 text-base font-medium text-gray-700 border-b border-gray-50 hover:bg-gray-50">New Record</Link>
                    <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="w-full text-left px-3 py-4 text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
                  </>
                ) : (
                  <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50">Admin Login</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Scale className="h-5 w-5 opacity-50 text-blue-600" />
              <span className="font-semibold tracking-tight text-gray-600">LRMS &copy; 2026</span>
              <span className="opacity-50 text-[10px] tracking-widest hidden sm:inline">| LAND RECORDS MANAGEMENT SYSTEM</span>
            </div>
            <div className="flex space-x-6 font-medium">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Help Center</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Legal Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Layout isAdmin={isAdmin} setIsAdmin={setIsAdmin}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/record/:id" element={<CaseDetailPage isAdmin={isAdmin} />} />
          <Route path="/add-record" element={isAdmin ? <AddCasePage /> : <LoginPage setIsAdmin={setIsAdmin} />} />
          <Route path="/update/:id" element={isAdmin ? <UpdateCasePage /> : <LoginPage setIsAdmin={setIsAdmin} />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <LoginPage setIsAdmin={setIsAdmin} />} />
          <Route path="/login" element={<LoginPage setIsAdmin={setIsAdmin} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

