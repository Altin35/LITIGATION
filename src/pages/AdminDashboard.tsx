/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  ChevronRight, 
  AlertCircle,
  FileText,
  SortAsc,
  Calendar
} from 'lucide-react';
import { LitigationRecord } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const [records, setRecords] = useState<LitigationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/litigation');
      const data = await res.json();
      setRecords(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure? This will permanently remove this record.')) return;
    try {
      await fetch(`/api/litigation/${id}`, { method: 'DELETE' });
      setRecords(records.filter(r => r.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const districts = ['All', ...new Set(records.map(r => r.district))];

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || record.caseStatus === statusFilter;
    const matchesDistrict = districtFilter === 'All' || record.district === districtFilter;
    return matchesSearch && matchesStatus && matchesDistrict;
  }).sort((a,b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  const statusColors = {
    'Pending': 'bg-red-50 text-red-600 border-red-200',
    'In Progress': 'bg-amber-50 text-amber-600 border-amber-200',
    'Closed': 'bg-emerald-50 text-emerald-600 border-emerald-200'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">Management Console</h1>
           <p className="text-gray-400 font-medium">Manage all registered land litigation records and documents.</p>
        </div>
        <Link to="/add-record" className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black tracking-tight hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
           <Plus className="h-5 w-5" />
           <span>New record entry</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Records', val: records.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Cases', val: records.filter(r => r.caseStatus === 'Pending').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Recently Added', val: records.filter(r => new Date(r.createdDate).getTime() > Date.now() - 86400000).length, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center space-x-4 shadow-sm">
             <div className={`${stat.bg} p-4 rounded-2xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
             </div>
             <div>
                <div className="text-2xl font-black text-gray-900">{stat.val}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
             </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 flex flex-wrap items-center gap-4 shadow-sm italic font-serif">
         <div className="relative flex-1 min-w-[300px] font-sans not-italic">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by survey or owner name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-900"
            />
         </div>
         <div className="flex items-center space-x-3">
            <Filter className="h-4 w-4 text-gray-300" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-bold text-gray-600 text-xs uppercase tracking-widest cursor-pointer hover:bg-white hover:border-blue-100 transition-all font-sans not-italic"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <select 
              value={districtFilter} 
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-bold text-gray-600 text-xs uppercase tracking-widest cursor-pointer hover:bg-white hover:border-blue-100 transition-all font-sans not-italic"
            >
              {districts.map(d => <option key={d} value={d}>{d === 'All' ? 'All Districts' : d}</option>)}
            </select>
         </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-blue-500/5 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 italic font-serif">
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans not-italic">Survey Number</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans not-italic">Land Owner</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans not-italic">District</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans not-italic">Filing Date</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans not-italic">Status</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans not-italic text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50 font-medium text-gray-600">
                  {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                       <td className="px-8 py-6 font-black text-gray-900">{record.surveyNumber}</td>
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-2">
                             <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black">{record.ownerName.charAt(0).toUpperCase()}</div>
                             <span>{record.ownerName}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">{record.district}</td>
                       <td className="px-8 py-6 text-sm">{record.filingDate ? new Date(record.filingDate).toLocaleDateString() : 'N/A'}</td>
                       <td className="px-8 py-6">
                          <div className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${statusColors[record.caseStatus]}`}>
                             {record.caseStatus}
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Link to={`/record/${record.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all" title="View"><Eye className="h-4 w-4" /></Link>
                             <Link to={`/update/${record.id}`} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all" title="Edit"><Edit className="h-4 w-4" /></Link>
                             <button onClick={() => handleDelete(record.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all" title="Delete"><Trash2 className="h-4 w-4" /></button>
                          </div>
                       </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center italic font-serif text-gray-400">
                         No records found matching your current filter criteria.
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
