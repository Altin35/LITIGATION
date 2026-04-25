import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  Search,
  ChevronDown,
  Building,
  MapPin,
  Calendar,
  AlertCircle,
  Globe,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Dummy Data
const TN_DATA = {
  "Thoothukudi": {
    "Tuticorin": ["Mullakadu", "Mappillaiyurani", "Threspuram"],
    "Srivaikuntam": ["Alwarthirunagari", "Eral"]
  },
  "Tirunelveli": {
    "Palayamkottai": ["Melapalayam", "Maharajanagar"],
    "Ambasamudram": ["Kallidaikurichi", "Vikramasingapuram"]
  },
  "Madurai": {
    "Madurai North": ["Anna Nagar", "K.K Nagar"],
    "Madurai South": ["Tirunagar", "Villapuram"]
  },
  "Trichy": {
    "Srirangam": ["Thiruvanaikoil", "Srirangam East"],
    "Lalgudi": ["Pullambadi", "Kattur"],
    "Manapparai": ["Vaiyampatti", "Samayapuram"]
  }
};

type DistrictKeys = keyof typeof TN_DATA;

export default function ECDownloadPage({ isDark }: { isDark: boolean }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    state: 'Tamil Nadu',
    district: '',
    taluk: '',
    area: '',
    surveyNumber: '',
    fromDate: '',
    toDate: ''
  });

  const [taluks, setTaluks] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [litigationFound, setLitigationFound] = useState<any[]>([]);

  // Update Taluks when District changes
  useEffect(() => {
    if (formData.district) {
      const districtData = TN_DATA[formData.district as DistrictKeys];
      setTaluks(Object.keys(districtData));
      setFormData(prev => ({ ...prev, taluk: '', area: '' }));
    } else {
      setTaluks([]);
      setAreas([]);
    }
  }, [formData.district]);

  // Update Areas when Taluk changes
  useEffect(() => {
    if (formData.district && formData.taluk) {
      const districtData = TN_DATA[formData.district as DistrictKeys];
      const talukData = (districtData as any)[formData.taluk];
      setAreas(talukData || []);
      setFormData(prev => ({ ...prev, area: '' }));
    } else {
      setAreas([]);
    }
  }, [formData.district, formData.taluk]);

  // Check litigation when survey number changes
  useEffect(() => {
    const checkStatus = async () => {
      if (formData.surveyNumber.length > 2) {
        try {
          const res = await fetch(`/api/litigation/search?query=${encodeURIComponent(formData.surveyNumber)}`);
          const data = await res.json();
          setLitigationFound(data.filter((r: any) => r.surveyNumber.toLowerCase() === formData.surveyNumber.toLowerCase()));
        } catch (error) {
          console.error('Litigation check failed:', error);
        }
      } else {
        setLitigationFound([]);
      }
    };
    const timer = setTimeout(checkStatus, 500);
    return () => clearTimeout(timer);
  }, [formData.surveyNumber]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = () => {
    if (!formData.district || !formData.taluk || !formData.area || !formData.surveyNumber || !formData.fromDate || !formData.toDate) {
      alert("Please fill all required fields.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Government of Tamil Nadu', 105, 15, { align: 'center' });
      doc.setFontSize(14);
      doc.text('Registration Department', 105, 22, { align: 'center' });
      doc.setFontSize(18);
      doc.setTextColor(0, 51, 153); // Professional Blue
      doc.text('Encumbrance Certificate', 105, 32, { align: 'center' });

      // Line separator
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 38, 190, 38);

      // Details Section
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('Property Details:', 20, 48);
      doc.setFont('helvetica', 'normal');
      
      const leftColX = 20;
      const rightColX = 110;
      
      doc.text(`State: ${formData.state}`, leftColX, 56);
      doc.text(`District: ${formData.district}`, leftColX, 62);
      doc.text(`Taluk: ${formData.taluk}`, leftColX, 68);
      doc.text(`Village / Area: ${formData.area}`, rightColX, 56);
      doc.text(`Survey Number: ${formData.surveyNumber}`, rightColX, 62);
      doc.text(`Period: ${formData.fromDate} to ${formData.toDate}`, rightColX, 68);

      // 1. Litigation Status Section (NEW)
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Judicial and Litigation Status:', 20, 80);
      
      const isLitigationActive = litigationFound.some(r => r.caseStatus !== 'Closed');
      
      doc.setDrawColor(isLitigationActive ? 220 : 0, isLitigationActive ? 38 : 128, isLitigationActive ? 38 : 0);
      doc.setFillColor(isLitigationActive ? 254 : 240, isLitigationActive ? 242 : 253, isLitigationActive ? 242 : 244);
      doc.rect(20, 84, 170, 15, 'F');
      doc.rect(20, 84, 170, 15, 'S');

      doc.setFontSize(11);
      doc.setTextColor(isLitigationActive ? 185 : 0, isLitigationActive ? 28 : 100, isLitigationActive ? 28 : 0);
      const statusMessage = isLitigationActive ? 'ALERT: ACTIVE LITIGATION FOUND' : 'NO ACTIVE LITIGATION PENDING';
      doc.text(statusMessage, 105, 93, { align: 'center' });
      
      // Owner Box
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('Current Registered Owner:', 20, 110);
      
      doc.setDrawColor(0, 51, 153);
      doc.setFillColor(248, 250, 252);
      doc.rect(20, 114, 170, 25, 'F');
      doc.rect(20, 114, 170, 25, 'S');

      doc.setFont('helvetica', 'normal');
      doc.text(`Owner Name: P. Sankaranarayanan`, 25, 122);
      doc.text(`Father/Husband Name: Perumal`, 25, 128);
      doc.text(`Property Type: Residential Land`, 110, 122);
      doc.text(`Total Extent: 2600.00 Sq.Ft`, 110, 128);

      // 2. Succession of Ownership Table (NEW - Owner History)
      doc.setFont('helvetica', 'bold');
      doc.text('Succession of Ownership (Owner History):', 20, 150);
      
      autoTable(doc, {
        startY: 154,
        head: [['Year', 'Transaction Type', 'Transferor (Seller)', 'Transferee (Buyer)', 'Doc Number']],
        body: [
          ['2012', 'Sale Deed', 'Arumugam', 'P. Sankaranarayanan', '1244/2012'],
          ['1998', 'Inheritance', 'Self', 'Arumugam', '901/1998'],
          ['1985', 'Sale Deed', 'Government of TN', 'Self', '55/1985'],
        ],
        headStyles: { fillColor: [0, 51, 153] },
        theme: 'striped',
        margin: { left: 20, right: 20 }
      });

      // 3. Encumbrance / Transaction Table
      let currentY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFont('helvetica', 'bold');
      doc.text('Detailed Encumbrance & Entries:', 20, currentY);
      
      const transactionRows = litigationFound.map((r, i) => [
        (i + 1).toString(),
        r.caseNumber || 'N/A',
        new Date(r.createdDate).getFullYear().toString(),
        'Judicial Entry',
        r.advocateName || 'System',
        `LITIGATION: ${r.caseStatus} - ${r.judgeName || 'Pending'}`
      ]);

      if (transactionRows.length === 0) {
        transactionRows.push(['-', '-', '-', 'NIL', '-', 'No registered encumbrances found for this period.']);
      }
      
      autoTable(doc, {
        startY: currentY + 4,
        head: [['Sl.No', 'Ref ID', 'Year', 'Type', 'Party Name', 'Details']],
        body: transactionRows,
        headStyles: { fillColor: [71, 85, 105] },
        theme: 'grid',
        margin: { left: 20, right: 20 }
      });

      // Footer
      const finalY = (doc as any).lastAutoTable.finalY + 25;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Note: This is a computer-generated Encumbrance Certificate obtained from the centralized Land Records Managed System (LRMS).', 105, finalY, { align: 'center' });
      doc.text('Digitally Signed by: Sub-Registrar Authority, Tamil Nadu', 105, finalY + 5, { align: 'center' });

      // Save
      doc.save(`EC_${formData.surveyNumber}_${Date.now()}.pdf`);
      
      setIsGenerating(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
          <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight sm:text-4xl">
          Official EC Retrieval Portal
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 font-medium">
          Digital Encumbrance Certificate with Owner History & Litigation Check
        </p>
      </div>

      <AnimatePresence>
        {litigationFound.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[2rem] flex flex-col md:flex-row items-center gap-6"
          >
            <div className="p-4 bg-red-100 dark:bg-red-800/50 rounded-2xl">
              <Scale className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-red-900 dark:text-red-300">Active Litigation Detected</h3>
              <p className="text-red-700 dark:text-red-400/80 font-medium text-sm leading-relaxed">
                This land (Survey: {formData.surveyNumber}) is currently listed in our litigation database with {litigationFound.length} active case(s). The EC will include full judicial details.
              </p>
            </div>
            <button 
              onClick={() => navigate(`/record/${litigationFound[0].id}`)}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all text-xs uppercase tracking-widest"
            >
              View Case
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl p-8 lg:p-12 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* State - Read Only */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Globe className="h-3 w-3" /> State
            </label>
            <div className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white font-semibold">
              Tamil Nadu
            </div>
          </div>

          {/* District */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="h-3 w-3" /> District
            </label>
            <div className="relative">
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full pl-5 pr-12 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none transition-all"
              >
                <option value="">Select District</option>
                {Object.keys(TN_DATA).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Taluk */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Building className="h-3 w-3" /> Taluk
            </label>
            <div className="relative">
              <select
                name="taluk"
                value={formData.taluk}
                onChange={handleInputChange}
                disabled={!formData.district}
                className="w-full pl-5 pr-12 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Taluk</option>
                {taluks.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Area / Village */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="h-3 w-3" /> Area / Village
            </label>
            <div className="relative">
              <select
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                disabled={!formData.taluk}
                className="w-full pl-5 pr-12 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Area</option>
                {areas.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Survey Number */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Search className="h-3 w-3" /> Survey Number
            </label>
            <input
              type="text"
              name="surveyNumber"
              value={formData.surveyNumber}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. 244/1A, 112/5"
            />
          </div>

          {/* From Date */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="h-3 w-3" /> From Date
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* To Date */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="h-3 w-3" /> To Date
            </label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="w-full mt-12 py-5 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait group"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Activity className="h-6 w-6" />
              </motion.div>
              <span>Generating EC Document...</span>
            </>
          ) : (
            <>
              <Download className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
              <span>Generate & Download EC</span>
            </>
          )}
        </button>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-700 dark:text-emerald-400"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-bold">EC Document generated and downloaded successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Info Section */}
      <div className="mt-16 grid md:grid-cols-2 gap-8">
        <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/50">
          <div className="flex items-center gap-4 mb-4">
            <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">Security Protocol</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
            All Encumbrance Certificates generated through this portal are digitally signed and verifiable under the Tamil Nadu Information Technology Rules.
          </p>
        </div>
        <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] border border-amber-100 dark:border-amber-800/50">
          <div className="flex items-center gap-4 mb-4">
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">Legal Disclaimer</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
            This computer-generated document is for information purposes. For certified hard copies, please visit your jurisdictional Sub-Registrar Office.
          </p>
        </div>
      </div>
    </div>
  );
}

// Sub-components used in icon layout
function Activity({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
