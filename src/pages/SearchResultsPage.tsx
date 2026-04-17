/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight, MapPin, Scale, ArrowLeft, Filter, Calendar } from 'lucide-react';
import { LitigationRecord } from '../types.ts';
import { motion } from 'motion/react';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [records, setRecords] = useState<LitigationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Closed'>('All');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/litigation/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setRecords(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const filteredRecords = filter === 'All' 
    ? records 
    : records.filter(r => r.caseStatus === filter);

  const statusColors = {
    'Pending': 'bg-red-50 text-red-600 border-red-200',
    'In Progress': 'bg-amber-50 text-amber-600 border-amber-200',
    'Closed': 'bg-emerald-50 text-emerald-600 border-emerald-200'
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Search Header */}
      <div className="mb-12">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 mb-6 group transition-all">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">
          Search Results <br />
          <span className="text-gray-400 text-lg font-medium">Matching Survey No: "{query}"</span>
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 py-6 border-y border-gray-100 italic font-serif">
          <div className="text-gray-500 font-medium tracking-tight">
            Found <span className="text-gray-900 font-bold font-sans">{filteredRecords.length}</span> verified record(s)
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mr-2 flex items-center">
              <Filter className="h-4 w-4 mr-1" /> Filter Status:
            </span>
            {['All', 'Pending', 'In Progress', 'Closed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  filter === s 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24 space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-0" />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150" />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-300" />
        </div>
      ) : filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-3xl p-6 border-4 border-white shadow-2xl shadow-blue-600/5 hover:border-blue-50 transition-all cursor-pointer relative overflow-hidden"
              onClick={() => window.location.href = `/record/${record.id}`}
            >
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[100px] -mr-12 -mt-12 transition-all group-hover:scale-110" />
              <div className="absolute top-6 right-6">
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statusColors[record.caseStatus]}`}>
                  {record.caseStatus}
                </div>
              </div>

              <div className="mb-6 space-y-1">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Survey Number</div>
                <div className="text-2xl font-black text-gray-900 tracking-tight leading-none">{record.surveyNumber}</div>
              </div>

              <div className="space-y-4 font-medium mb-8">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-0.5">Location</div>
                    <div className="text-gray-700 text-sm truncate">{record.village}, {record.district}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                    <Scale className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-0.5">Case Number</div>
                    <div className="text-gray-700 text-sm font-bold">{record.caseNumber || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                     {record.ownerName.charAt(0).toUpperCase()}
                   </div>
                   <div className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-[120px]">
                     {record.ownerName}
                   </div>
                </div>
                <div className="p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border-4 border-dashed border-gray-100">
           <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
             <Search className="h-10 w-10 text-gray-300" />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2">No Records Found</h2>
           <p className="text-gray-500 font-medium">We couldn't find any litigation matching "{query}". <br /> Please verify the survey number and try again.</p>
           <Link to="/" className="inline-block mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95">
             Start New Search
           </Link>
        </div>
      )}
    </div>
  );
}
