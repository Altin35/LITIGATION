/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Scale, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <ShieldAlert className="h-4 w-4" />
            <span>Official Land Records Portal</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-6 leading-[1.1]">
            Track Land Litigation <br />
            <span className="text-blue-600 italic font-serif">by Survey Number</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium">
            Search the comprehensive database of land dispute cases, court hearings, and ownership records across all districts.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-16 pr-32 py-6 bg-white border-2 border-gray-100 rounded-3xl text-lg font-medium shadow-xl shadow-blue-500/5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
              placeholder="Enter Survey Number (e.g. 124/A)"
            />
            <button
              type="submit"
              className="absolute right-3 top-3 bottom-3 px-8 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
            >
              Search
            </button>
          </form>

          {/* District Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Active Cases', val: '2.4k+', color: 'text-blue-600' },
              { label: 'Districts Covered', val: '32', color: 'text-indigo-600' },
              { label: 'Closed Cases', val: '1.8k+', color: 'text-emerald-600' },
              { label: 'Last Updated', val: 'Today', color: 'text-amber-600' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className={`text-2xl font-black ${stat.color} mb-1`}>{stat.val}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Info Sections */}
      <div className="w-full bg-white border-y border-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Locational Search</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              Find cases specific to your Village, Taluk, or District by entering the precise Survey Number.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center">
              <Scale className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Legal Transparency</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              Access case numbers, court names, and next hearing dates directly from our public verified database.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center">
              <Search className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Document Access</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              View and download officially uploaded documents related to specific litigation for full due diligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
