/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Scale, 
  FileText, 
  Calendar, 
  Clock, 
  Download, 
  Edit, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { LitigationRecord } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';

export default function CaseDetailPage({ isAdmin }: { isAdmin: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<LitigationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await fetch('/api/litigation');
        const data = await res.json();
        const found = data.find((r: any) => r.id === id);
        setRecord(found);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this official record? This action is permanent.')) return;
    try {
      const res = await fetch(`/api/litigation/${id}`, { method: 'DELETE' });
      if (res.ok) {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-48 space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Loading Verified Record</span>
    </div>
  );

  if (!record) return (
    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 italic font-serif">
      <h2 className="text-3xl font-black text-gray-900 mb-4 font-sans uppercase">Record Not Found</h2>
      <Link to="/" className="text-blue-600 font-bold font-sans underline underline-offset-4">Return to Search</Link>
    </div>
  );

  const statusColors = {
    'Pending': 'bg-red-50 text-red-600 border-red-200',
    'In Progress': 'bg-amber-50 text-amber-600 border-amber-200',
    'Closed': 'bg-emerald-50 text-emerald-600 border-emerald-200'
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <Link to={isAdmin ? "/admin" : "/"} className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 mb-4 group transition-all">
             <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             <span>{isAdmin ? 'Back to Dashboard' : 'Back to Search'}</span>
          </Link>
          <div className="flex items-center space-x-3">
             <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Case Details</h1>
             <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${statusColors[record.caseStatus]}`}>
               {record.caseStatus}
             </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center space-x-3">
            <Link to={`/update/${id}`} className="inline-flex items-center px-6 py-3 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm">
               <Edit className="h-4 w-4 mr-2" />
               <span>Update</span>
            </Link>
            <button onClick={handleDelete} className="inline-flex items-center px-6 py-3 bg-red-50 text-red-600 border-2 border-red-100 rounded-2xl font-bold hover:bg-red-100 transition-all">
               <Trash2 className="h-4 w-4 mr-2" />
               <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Land Identity */}
          <div className="bg-white rounded-[40px] p-10 border-4 border-white shadow-2xl shadow-blue-500/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-bl-full -mr-16 -mt-16 group transition-all -z-1" />
             <div className="flex items-center space-x-3 mb-10">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                   <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Land Record</span>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Identity & Location</h2>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                <DetailRow label="Survey Number" value={record.surveyNumber} isBold />
                <DetailRow label="Village" value={record.village} />
                <DetailRow label="Taluk" value={record.taluk} />
                <DetailRow label="District" value={record.district} />
                <DetailRow label="Land Owner Name" value={record.ownerName} />
                <DetailRow label="Father / Guardian" value={record.fatherName} />
             </div>
          </div>

          {/* Section: Court Case */}
          <div className="bg-white rounded-[40px] p-10 border-4 border-white shadow-2xl shadow-blue-500/5">
             <div className="flex items-center space-x-3 mb-10">
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-600/20">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <div>
                   <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">Legal Record</span>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Court Proceedings</h2>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                <DetailRow label="Case Number" value={record.caseNumber || 'N/A'} isBold />
                <DetailRow label="Court Name" value={record.courtName || 'N/A'} />
                <DetailRow label="Case Type" value={record.caseType || 'N/A'} />
                <DetailRow label="Advocate Name" value={record.advocateName || 'N/A'} />
                <DetailRow label="Filing Date" value={record.filingDate ? new Date(record.filingDate).toLocaleDateString() : 'N/A'} />
                <DetailRow label="Next Hearing" value={record.nextHearingDate ? new Date(record.nextHearingDate).toLocaleDateString() : 'N/A'} isAccent />
             </div>
          </div>

          {/* Remarks */}
          <div className="bg-white rounded-[40px] p-10 border-4 border-white shadow-2xl shadow-blue-500/5 italic font-serif leading-relaxed">
             <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-4 font-sans not-italic">Official Remarks</div>
             <p className="text-gray-700 text-lg">"{record.remarks || 'No detailed remarks provided for this record.'}"</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Sidebar Card */}
          <div className="bg-white rounded-[40px] p-8 border-4 border-white shadow-2xl shadow-blue-500/10">
             <div className="flex items-center justify-between mb-8">
               <div className="bg-amber-100 p-3 rounded-2xl">
                 <FileText className="h-6 w-6 text-amber-600" />
               </div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Asset</span>
             </div>
             <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Case Document</h3>
             {record.documentUrl ? (
               <div className="space-y-4">
                 <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center">
                    <img src={record.documentUrl} alt="Snippet" className="max-h-32 rounded-lg grayscale shadow-sm opacity-50" />
                 </div>
                 <a 
                   href={record.documentUrl} 
                   target="_blank" 
                   rel="noreferrer"
                   className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-4 rounded-2xl font-black tracking-tight hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                 >
                   <Download className="h-5 w-5" />
                   <span>Download Document</span>
                 </a>
               </div>
             ) : (
               <div className="text-center py-8 px-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                  <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Document Linked</p>
               </div>
             )}
          </div>

          {/* Timeline Sidebar Card */}
          <div className="bg-white rounded-[40px] p-8 border-4 border-white shadow-2xl shadow-blue-500/10">
             <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Timeline History</h3>
             <div className="relative pl-8 space-y-10">
                <div className="absolute left-[3px] top-2 bottom-6 w-0.5 bg-gray-100" />
                
                <TimelineItem title="Registration" date={new Date(record.createdDate).toLocaleDateString()} isDone />
                <TimelineItem title="Filing Date" date={record.filingDate ? new Date(record.filingDate).toLocaleDateString() : 'Pending'} isDone={!!record.filingDate} />
                <TimelineItem title="Next Hearing" date={record.nextHearingDate ? new Date(record.nextHearingDate).toLocaleDateString() : 'Unscheduled'} isPulse={!!record.nextHearingDate} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, isBold = false, isAccent = false }: { label: string, value: string, isBold?: boolean, isAccent?: boolean }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <div className={`text-lg transition-colors ${isBold ? 'font-black text-gray-900' : 'font-medium text-gray-600'} ${isAccent ? 'text-blue-600' : ''}`}>
        {value}
      </div>
    </div>
  );
}

function TimelineItem({ title, date, isDone = false, isPulse = false }: { title: string, date: string, isDone?: boolean, isPulse?: boolean }) {
  return (
    <div className="relative">
      <div className={`absolute -left-[32px] top-1.5 w-4 h-4 rounded-full border-4 border-white ring-2 z-10 ${isDone ? 'bg-emerald-500 ring-emerald-100' : 'bg-gray-200 ring-gray-50'}`} />
      {isPulse && <div className="absolute -left-[32px] top-1.5 w-4 h-4 rounded-full bg-blue-500 animate-ping opacity-50" />}
      <div>
        <div className="text-sm font-black text-gray-900 leading-none mb-1">{title}</div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{date}</div>
      </div>
    </div>
  );
}
