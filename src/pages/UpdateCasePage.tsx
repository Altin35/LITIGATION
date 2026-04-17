/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Scale, MapPin, User, FileText, Calendar, ArrowLeft, Plus, CloudUpload, ShieldCheck, X, Edit } from 'lucide-react';
import { LitigationRecord } from '../types.ts';
import { motion } from 'motion/react';

export default function UpdateCasePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<LitigationRecord>>({});
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await fetch('/api/litigation');
        const data = await res.json();
        const found = data.find((r: any) => r.id === id);
        if (found) {
          setFormData(found);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        data.append(key, val as string | Blob);
      }
    });
    if (file) data.append('document', file);

    try {
      const res = await fetch(`/api/litigation/${id}`, {
        method: 'PUT',
        body: data
      });
      if (res.ok) {
        navigate(`/record/${id}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 shadow-2xl shadow-blue-500/5 bg-white rounded-3xl border-4 border-white mb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-12 -mt-12 transition-all group-hover:scale-110 -z-1" />

      <div className="mb-10 flex items-center justify-between">
        <div>
          <Link to={`/record/${id}`} className="text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors inline-flex items-center space-x-2 group mb-4">
             <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
             <span>Back to Case</span>
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">Update Record</h1>
          <p className="text-gray-400 font-medium">Modify existing litigation metadata for survey {formData.surveyNumber}.</p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-blue-100">
           <Edit className="h-5 w-5" />
           <span>System Editor</span>
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
              <input required type="text" name="surveyNumber" value={formData.surveyNumber || ''} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Village *</label>
              <input required type="text" name="village" value={formData.village || ''} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Taluk *</label>
              <input required type="text" name="taluk" value={formData.taluk || ''} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">District *</label>
              <input required type="text" name="district" value={formData.district || ''} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" />
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
              <input required type="text" name="ownerName" value={formData.ownerName || ''} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Father's / Guardian's Name *</label>
              <input required type="text" name="fatherName" value={formData.fatherName || ''} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" />
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
              <input type="text" name="caseNumber" value={formData.caseNumber || ''} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" />
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
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Filing Date</label>
              <input type="date" name="filingDate" value={formData.filingDate || ''} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Next Hearing Date</label>
              <input type="date" name="nextHearingDate" value={formData.nextHearingDate || ''} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Remarks / Note</label>
            <textarea name="remarks" value={formData.remarks || ''} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 h-32"></textarea>
          </div>
        </section>

        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg tracking-tight hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-600/20 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Record'}
          </button>
          <Link
            to={`/record/${id}`}
            className="px-10 py-5 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
