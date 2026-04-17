/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scale, ShieldCheck, Lock, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage({ setIsAdmin }: { setIsAdmin: (val: boolean) => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple simulated admin password
    setTimeout(() => {
      if (password === 'admin123') {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      } else {
        setError(true);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[40px] p-10 border-4 border-white shadow-2xl shadow-blue-500/10 relative overflow-hidden"
      >
        {/* Login Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 -z-1" />
        
        <div className="flex flex-col items-center text-center mb-10">
          <Link to="/" className="mb-6 bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-600/20">
             <Scale className="h-8 w-8 text-white" />
          </Link>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Admin Portal</h1>
          <p className="text-gray-400 font-medium">Verify credentials for administrative access.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Access Key</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className={`w-full px-6 py-5 pr-14 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-black text-gray-900 ${
                  error ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-transparent focus:border-blue-500 focus:bg-white'
                }`}
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest border border-red-100 flex items-center space-x-2"
            >
               <Lock className="h-4 w-4" />
               <span>Invalid credentials. Try again.</span>
            </motion.div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg tracking-tight hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300" />
                </div>
              ) : 'Authenticate Access'}
            </button>
          </div>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-50 text-center">
           <Link to="/" className="inline-flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Public Search
           </Link>
        </div>
      </motion.div>

      <div className="mt-8 flex items-center space-x-2 text-gray-400">
         <ShieldCheck className="h-4 w-4" />
         <span className="text-[10px] uppercase font-bold tracking-widest">Enterprise Security Active</span>
      </div>
    </div>
  );
}
