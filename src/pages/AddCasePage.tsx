/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scale, MapPin, User, FileText, Calendar, ArrowLeft, Plus, CloudUpload, ShieldCheck, X, Edit } from 'lucide-react';
import { motion } from 'motion/react';

export default function AddCasePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    surveyNumber: '',
    ownerName: '',
    fatherName: '',
    village: '',
    taluk: '',
    district: '',
    caseNumber: '',
    courtName: '',
    caseType: '',
    filingDate: '',
    nextHearingDate: '',
    caseStatus: 'Pending',
    advocateName: '',
    remarks: ''
  });
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        data.append(key, val as string | Blob);
      }
    });
    if (file) data.append('document', file);

    try {
      const res = await fetch('/api/litigation', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 shadow-2xl shadow-blue-500/5 bg-white rounded-3xl border-4 border-white mb-20 relative overflow-hidden">
      {/* Form Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-12 -mt-12 transition-all group-hover:scale-110 -z-1" />

      <div className="mb-10 flex items-center justify-between">
        <div>
          <Link to="/admin" className="text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors inline-flex items-center space-x-2 group mb-4">
             <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
             <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">Create Record</h1>
          <p className="text-gray-400 font-medium">Add a new litigation case to the verified database.</p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-emerald-100">
           <ShieldCheck className="h-5 w-5" />
           <span>Secure Entry</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Section 1: Land Details */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Land & Location Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Survey Number *</label>
              <input required type="text" name="surveyNumber" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" placeholder="e.g. 102/4B" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Village *</label>
              <input required type="text" name="village" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" placeholder="Village Name" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Taluk *</label>
              <input required type="text" name="taluk" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" placeholder="Taluk Name" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">District *</label>
              <input required type="text" name="district" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" placeholder="District Name" />
            </div>
          </div>
        </section>

        {/* Section 2: Owner Details */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
            <User className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Ownership Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name of Owner *</label>
              <input required type="text" name="ownerName" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" placeholder="Enter Full Name" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Father's / Guardian's Name *</label>
              <input required type="text" name="fatherName" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" placeholder="Guardian Name" />
            </div>
          </div>
        </section>

        {/* Section 3: Legal Details */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
            <Scale className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Litigation Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Case Number</label>
              <input type="text" name="caseNumber" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" placeholder="Case Ref No." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Case Type</label>
              <input type="text" name="caseType" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" placeholder="Civil, Partition, etc." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Court Name</label>
              <input type="text" name="courtName" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" placeholder="Court Authority" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Advocate Name</label>
              <input type="text" name="advocateName" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" placeholder="Full Name" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Filing Date</label>
              <input type="date" name="filingDate" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Next Hearing Date</label>
              <input type="date" name="nextHearingDate" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Case Status *</label>
              <select required name="caseStatus" onChange={handleInputChange} value={formData.caseStatus} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Upload Document (PDF/Image)</label>
              <label className="w-full px-5 py-4 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-2xl outline-none transition-all flex items-center justify-center space-x-2 cursor-pointer group">
                  <CloudUpload className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                  <span className="text-sm font-bold text-gray-500 group-hover:text-blue-600">{file ? file.name : 'Choose File'}</span>
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Remarks / Note</label>
            <textarea name="remarks" onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 h-32" placeholder="Additional details..."></textarea>
          </div>
        </section>

        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg tracking-tight hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Creating Record...' : 'Publish Official Record'}
          </button>
          <Link
            to="/admin"
            className="px-10 py-5 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
