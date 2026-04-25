/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Scale, 
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  FileText,
  Activity,
  Globe,
  Database,
  Gavel,
  History
} from 'lucide-react';
import { motion } from 'motion/react';
import { LitigationRecord } from '../types.ts';

export default function HomePage({ isDark }: { isDark: boolean }) {
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState<LitigationRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/litigation');
        const data = await res.json();
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const activeCases = records.filter(r => r.caseStatus === 'Pending' || r.caseStatus === 'In Progress').length;
  const closedCases = records.filter(r => r.caseStatus === 'Closed').length;
  const districts = new Set(records.map(r => r.district.trim().toLowerCase())).size;

  const lastUpdated = records.reduce((latest, r) => {
    const dates = [new Date(r.createdDate)];
    if (r.updatedDate) dates.push(new Date(r.updatedDate));
    const max = Math.max(...dates.map(d => d.getTime()));
    return max > latest ? max : latest;
  }, 0);

  const lastUpdatedStr = lastUpdated > 0 
    ? new Date(lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'System Operational';

  const stats = [
    { label: 'Active Litigation', val: activeCases, icon: Activity, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Verified Jurisdictions', val: districts, icon: Globe, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Closed Files', val: closedCases, icon: Database, color: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="flex flex-col space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-8 lg:pt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full mb-8 border border-blue-100 dark:border-blue-800">
              <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">Authorized Registry Access</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1] flex flex-col">
              <span>National Land</span>
              <span className="flex items-center gap-4 flex-wrap">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Litigation Tracking</span>
                <motion.div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-400"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Tracking Active</span>
                </motion.div>
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl mb-12 leading-relaxed font-medium">
              A professional-grade centralized system for monitoring property disputes, judicial proceedings, and verified land owner records with real-time accuracy.
            </p>

            <form onSubmit={handleSearch} className="relative group max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-16 pr-44 py-6 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-3xl text-xl font-semibold shadow-2xl shadow-blue-500/5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700"
                placeholder="Search Survey Number..."
              />
              <button
                type="submit"
                className="absolute right-3 top-3 bottom-3 px-10 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20"
              >
                <span>Search</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </form>
          </motion.div>

          {/* Graphical Stats Column */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2, duration: 0.6 }}
             className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group">
                <div className={`p-4 rounded-2xl ${stat.color} bg-gray-50 dark:bg-gray-800/50 w-fit mb-6 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">
                  {stat.val.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            ))}
            <div className="bg-blue-600 dark:bg-blue-500 p-8 rounded-[2rem] text-white flex flex-col justify-between">
              <div className="text-xs font-bold uppercase tracking-widest opacity-60">Status</div>
              <div>
                <div className="text-lg font-bold mb-1">System Operational</div>
                <div className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Last Sync: {lastUpdatedStr}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EC Download Promotion Section */}
      <section className="relative overflow-hidden group">
        <div className={`absolute inset-0 bg-blue-600 rounded-[3rem] transition-transform duration-500 group-hover:scale-[1.01]`} />
        <div className="relative p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 text-white">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full mb-6 border border-white/20">
              <span className="text-[10px] font-bold uppercase tracking-widest">New Feature</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-tight">
              Instant Encumbrance <br /> Certificate Retrieval
            </h2>
            <p className="text-lg opacity-80 font-medium mb-8">
              Download digitally signed EC documents for any property in Tamil Nadu. Our system cross-references national registration archives for instant generation.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/ec-download')}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-all flex items-center space-x-2 shadow-xl shadow-black/10"
              >
                <span>Access EC Portal</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="hidden lg:block relative">
             <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <FileText className="h-24 w-24 opacity-40 mb-4" />
                <div className="h-2 w-32 bg-white/20 rounded-full mb-2" />
                <div className="h-2 w-24 bg-white/20 rounded-full mb-2" />
                <div className="h-2 w-16 bg-white/20 rounded-full" />
             </div>
             <div className="absolute -top-4 -right-4 bg-emerald-500 p-4 rounded-full shadow-lg animate-bounce">
                <ShieldCheck className="h-6 w-6" />
             </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-white dark:bg-gray-900 rounded-[3rem] p-12 lg:p-20 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-4xl mb-16">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-4">Core Protocol</h2>
          <p className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight">
            Designed for legislative transparency and accurate property history tracking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: 'Judicial Sync',
              desc: 'Direct integration with session court calendars for hearing date synchronization.',
              icon: Gavel
            },
            {
              title: 'Digital Archives',
              desc: 'Access full document history including sub-division survey maps and ownership logs.',
              icon: History
            },
            {
              title: 'District Scoping',
              desc: 'Granular search across villages, taluks, and districts within national jurisdictions.',
              icon: MapPin
            }
          ].map(feature => (
            <div key={feature.title} className="space-y-4">
              <div className="text-blue-600 dark:text-blue-400">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Authority Bar */}
      <section className="flex flex-wrap justify-between items-center gap-8 opacity-40 dark:opacity-20 grayscale border-y border-gray-200 dark:border-gray-800 py-12">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="h-6 w-6" />
          <span className="font-bold uppercase tracking-widest text-sm text-gray-900 dark:text-white">Revenue Authority Verified</span>
        </div>
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6" />
          <span className="font-bold uppercase tracking-widest text-sm text-gray-900 dark:text-white">Secure Infrastructure</span>
        </div>
        <div className="flex items-center space-x-3">
          <Scale className="h-6 w-6" />
          <span className="font-bold uppercase tracking-widest text-sm text-gray-900 dark:text-white">Judicial Act Compliant</span>
        </div>
      </section>
    </div>
  );
}
