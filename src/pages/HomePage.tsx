/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Scale, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { LitigationRecord } from '../types.ts';

export default function HomePage() {
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
    ? new Date(lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : 'None';

  const stats = [
    { label: 'Active Cases', val: activeCases > 0 ? activeCases : '0', color: 'text-blue-600' },
    { label: 'Verified Districts', val: districts > 0 ? districts : '0', color: 'text-indigo-600' },
    { label: 'Resolved Disputes', val: closedCases > 0 ? closedCases : '0', color: 'text-emerald-600' },
    { label: 'Last Registry Update', val: lastUpdatedStr, color: 'text-amber-600' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section with Grid Background */}
      <div className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32 lg:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.50),white)]" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center space-x-2 bg-blue-600/10 px-3 py-1 rounded-full ring-1 ring-inset ring-blue-600/20 mb-8">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Public Safety & Transparency</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-8 leading-[1.1]">
                National Land <br />
                <span className="text-blue-600">Litigation Database</span>
              </h1>
              <p className="text-lg leading-8 text-gray-600 mb-12 max-w-xl font-medium">
                Our secure, centralized registry provides real-time access to land dispute statuses, court proceedings, and verified ownership metadata across all jurisdictions.
              </p>
            </motion.div>

            {/* Search Box */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              onSubmit={handleSearch} 
              className="relative max-w-xl group mb-16"
            >
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full pl-14 pr-32 py-5 bg-white border-2 border-gray-100 rounded-2xl text-base font-semibold shadow-2xl shadow-blue-500/5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                placeholder="Search by Survey Number (e.g. 244/B)"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-2.5 bottom-2.5 px-8 bg-blue-600 text-white text-sm font-black rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20 uppercase tracking-tight"
              >
                Search Registry
              </button>
            </motion.form>

            {/* Micro Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={stat.label}>
                  <div className={`text-2xl font-black ${stat.color} mb-1 tracking-tight`}>{stat.val}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Steps Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-20">
            <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-widest">Protocol</h2>
            <p className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Standard Verification Procedure</p>
            <p className="mt-6 text-lg leading-8 text-gray-600 font-medium italic font-serif">
              Our system ensures full legislative compliance through a three-step transparency model.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                { 
                  name: 'Survey Mapping', 
                  description: 'Every record is mapped to official revenue survey numbers as per district land records.',
                  icon: MapPin,
                  color: 'bg-blue-600'
                },
                { 
                  name: 'Judicial Sync', 
                  description: 'Status updates are synchronized with relevant session and district court hearing calendars.',
                  icon: Scale,
                  color: 'bg-indigo-600'
                },
                { 
                  name: 'Audit Trail', 
                  description: 'Complete change logs and document history for every land litigation record in our system.',
                  icon: ShieldAlert,
                  color: 'bg-emerald-600'
                },
              ].map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-lg font-black leading-7 text-gray-900">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                      <feature.icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 font-medium">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Modern Professional Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Scale className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-black tracking-tight text-gray-900">LandRegistry</span>
              </div>
              <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
                The authoritative national repository for land litigation records, providing transparency and security for property transactions and legal verification.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Resources</h3>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Security Protocol</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Contact</h3>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Support Center</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Legal Dept</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">API Documentation</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} National Land Litigation Tracking System. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
