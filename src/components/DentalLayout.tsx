import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Star, Calendar, Quote, ArrowRight, Sparkles, Wand2, BookOpen, Plus, 
  Activity, Clock, User, Phone, PhoneCall, MapPin, Search, 
  ShieldCheck, X, ChevronDown, Shield, FileText, Heart, AlertCircle, Globe
} from 'lucide-react';
import { Chatbot } from './Chatbot';

export function DentalLayout() {
  const [questionStep, setQuestionStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', time: '' });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  
  // Feature: Clinical Report Generator
  const generateClinicalReport = (patientData: { name?: string }) => {
    const doc = new jsPDF();
    
    // Dynamic Content Logic based on Focus
    const adviceMap: Record<string, { observations: string[], pathway: string[] }> = {
      'aesthetic': {
        observations: [
          "1. Tooth shade analysis indicates potential for 2-3 shades brightening.",
          "2. Minor overcrowding noted in lower anterior segment.",
          "3. Enamel integrity is high; suitable for professional bleaching."
        ],
        pathway: [
          "• Professional In-Office whitening session.",
          "• Clear Aligner structural mapping.",
          "• Post-treatment sensitivity management kit."
        ]
      },
      'restorative': {
        observations: [
          "1. Structural integrity check required for existing molars.",
          "2. Potential for implant-supported restoration in quadrant 3.",
          "3. Bone density appears optimal for titanium anchor stability."
        ],
        pathway: [
          "• 3D CBCT structural scan for precision placement.",
          "• Zirconia crown shade matching.",
          "• Bi-annual implant maintenance audit."
        ]
      },
      'emergency': {
        observations: [
          "1. Reported acute neurological response in upper right canine.",
          "2. Pulp exposure or deep decay suspected.",
          "3. Immediate triage required to prevent infection spread."
        ],
        pathway: [
          "• Emergency endodontic audit.",
          "• Immediate pain management protocol.",
          "• Structural scan to rule out fractures."
        ]
      },
      'default': {
        observations: [
          "1. Maintain 2-minute brushing cycle with soft bristles.",
          "2. Interdental flossing recommended for molar gap health.",
          "3. Professional cleaning advised within 6 months."
        ],
        pathway: [
          "• Routine cleanup and polishing.",
          "• Annual preventative screening.",
          "• Fluoride treatment for sensitivity."
        ]
      }
    };

    const currentAdvice = adviceMap[selectedFocus || 'default'] || adviceMap['default'];

    // Watermark - Premium Implementation
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(55);
    doc.text("DR. VINAY'S DENTAL CLINIC", 105, 150, { angle: 45, align: 'center' });
    
    // Header
    doc.setTextColor(20, 100, 255);
    doc.setFontSize(28);
    doc.text("CLINICAL CASE SUMMARY", 105, 30, { align: 'center' });
    
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.text("Dr. Vinay Pandere (BDS) • Gorai 1, Borivali (W), Mumbai • +91 9999999999", 105, 40, { align: 'center' });
    doc.line(20, 45, 190, 45);

    // Patient Info
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Patient Identity: ${patientData.name || 'Valued Patient'}`, 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Clinical ID: PND-00${Math.floor(Math.random() * 900) + 100}`, 20, 70);
    doc.text(`Date of Analysis: ${new Date().toLocaleDateString()}`, 20, 80);

    // Clinical Sections
    doc.setFontSize(14);
    doc.setTextColor(20, 100, 255);
    doc.text("Clinical Observations & Advice", 20, 100);
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.text(currentAdvice.observations, 20, 110);

    doc.setFontSize(14);
    doc.setTextColor(20, 100, 255);
    doc.text("Recommended Care Pathway", 20, 150);
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.text(currentAdvice.pathway, 20, 160);

    // Follow-up
    doc.setFontSize(12);
    doc.setTextColor(20, 120, 60);
    doc.text(`Next Recommended Visit: ${new Date(Date.now() + 1209600000).toLocaleDateString()} (Estimated)`, 20, 200);

    doc.save(`${patientData.name || 'Patient'}_Clinical_Report.pdf`);
  };
  
  // New States
  const [portalOpen, setPortalOpen] = useState(false);
  const [activePortalTab, setActivePortalTab] = useState<'profile' | 'history' | 'records' | 'settings'>('profile');
  const [phoneMenuOpen, setPhoneMenuOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'finance' | null>(null);
  const [reviewForm, setReviewForm] = useState({ stars: 5, text: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<'rct' | 'implant' | 'braces' | null>(null);
  const [immersiveModal, setImmersiveModal] = useState<'care-plan' | 'health-library' | 'managed-care' | 'coordination' | 'help' | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [analysisActive, setAnalysisActive] = useState(false);

  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pandere_settings');
    return saved ? JSON.parse(saved) : {
      blur: true,
      notifications: true,
      privacy: false
    };
  });

  // Feature 8/12: Patient Portal Session Persistence
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('pandere_logged_in') === 'true');
  const [dismissedLock, setDismissedLock] = useState(false);

  useEffect(() => {
    localStorage.setItem('pandere_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pandere_logged_in', isLoggedIn.toString());
  }, [isLoggedIn]);

  const CLINIC_PHONE = "+919999999999";
  const CLINIC_WHATSAPP = `https://wa.me/919999999999?text=${encodeURIComponent("Hello Dr. Pandere, I'd like to discuss a dental appointment at your Gorai clinic.")}`;

  const scrollToSection = (id: string) => {
    // Auth Guard for Scheduling
    if (id === 'booking' && !isLoggedIn) {
      setPortalOpen(true);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setPortalOpen(false);
    setPhoneMenuOpen(false);
  };

  const timeslots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '04:00 PM', '05:30 PM'];
  
  const faqs = [
    { q: "Will the treatment be painful?", a: "Not at all. We use very gentle, local numbing techniques and modern tools that make the process feel as simple as a standard filling. Your comfort is our top priority." },
    { q: "Can I use my dental insurance here?", a: "Yes, we work with over 50 major insurance providers and handle all the paperwork for you, so you can focus on your recovery." },
    { q: "How long until I see results with aligners?", a: "Most patients start seeing a beautiful change within 6 to 12 months. We'll give you a precise timeline during your first visit." },
    { q: "What if I have a sudden dental emergency?", a: "We always keep emergency slots open every day. If you're in pain, call us immediately—we'll make sure you're seen as soon as possible." },
    { q: "How long do implants actually last?", a: "With good care at home and regular check-ups with us, your implants are designed to stay strong and healthy for a lifetime." },
    { q: "Is professional cleaning really necessary every 6 months?", a: "Yes, even with great brushing, some plaque hides in hard-to-reach spots. A professional clean every 6 months keeps your gums healthy and prevents bigger issues later." },
    { q: "Do you offer easy payment plans for larger treatments?", a: "Absolutely. We offer 0% interest EMI options through Bajaj Finserv and HDFC, so you can get the care you need without financial stress." },
    { q: "Will teeth whitening damage my natural teeth?", a: "Our whitening treatments are professional-grade and completely safe for your enamel. We ensure your teeth get brighter without losing their strength." }
  ];

  const SERVICES_DATA = {
    rct: {
      title: "Root Canal Excellence",
      subtitle: "Gentle Preservation of Your Tooth",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop", 
      artifact: "root_canal_tech_macro_1776444120672.png",
      metrics: [
        { label: "Success Rate", value: "99%" },
        { label: "Duration", value: "45 Min" },
        { label: "Comfort Level", value: "Painless" }
      ],
      protocol: "We use the latest rotary tools combined with gentle ultrasonic cleaning to ensure your root canal is perfectly sterilized and pain-free. This modern approach helps your tooth heal faster and prevents future infections.",
      features: ["Painless Numbing Technique", "Precision Digital Tracking", "Bio-Friendly Fillings"]
    },
    implant: {
      title: "Premium Dental Implants",
      subtitle: "A Permanent, Natural Smile",
      image: "https://images.unsplash.com/photo-1606811841660-1b5168c5c2b4?q=80&w=1974&auto=format&fit=crop",
      artifact: "dental_implants_3d_render_1776444076846.png",
      metrics: [
        { label: "Durability", value: "Lifetime" },
        { label: "Precision", value: "Micro-level" },
        { label: "Healing Rate", value: "Rapid" }
      ],
      protocol: "Using advanced 3D imaging, we place your implants with incredible accuracy. We focus on 'Immediate Smiles', where we can often restore your confidence in just one visit while ensuring the implant stays strong and stable.",
      features: ["Highest Grade Materials", "Computer-Guided Placement", "Natural-Looking Results"]
    },
    braces: {
      title: "Clear Aligners & Braces",
      subtitle: "Discrete Smile Alignment",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop",
      artifact: "clear_aligners_aesthetic_1776444100072.png",
      metrics: [
        { label: "Patients Helped", value: "1,000+" },
        { label: "Typical Change", value: "Weekly" },
        { label: "Visibility", value: "Nearly Zero" }
      ],
      protocol: "We use our advanced prediction software to map out your perfect smile before we even start. With digital impressions, there's no need for messy molds—just a comfortable, precise path to straight teeth.",
      features: ["Invisible Aligners", "AI-Predictive Results", "Tailored Care Plans"]
    }
  };

  const testimonials = [
    { text: "I was so nervous about my root canal, but Dr. Pandere made it completely painless. He really cares about his patients.", name: "Sunita M., Gorai", stars: 5 },
    { text: "The clinic is spotless and the staff is incredibly kind. My new implants feel just like my natural teeth!", name: "Rahul S., Borivali", stars: 5 },
    { text: "Very professional and transparent about costs. The EMI options made it so easy for me to get my braces.", name: "Amit K.", stars: 5 }
  ];

  return (
    <div className="relative z-10 flex flex-col w-full px-4 lg:px-12 py-6 gap-12 lg:gap-24 min-h-screen">
      
      {/* Pinned FAB for Emergency Call - Upgraded to Phone/WhatsApp Menu */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
        {phoneMenuOpen && (
          <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-5">
            <a href={CLINIC_WHATSAPP} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full liquid-glass-strong text-white border border-white/20 flex items-center justify-center hover:scale-110 shadow-lg transition-all">
              <Phone className="w-5 h-5 text-green-400" />
            </a>
            <a href={`tel:${CLINIC_PHONE}`} className="w-12 h-12 rounded-full liquid-glass-strong text-white border border-white/20 flex items-center justify-center hover:scale-110 shadow-lg transition-all">
              <PhoneCall className="w-5 h-5" />
            </a>
          </div>
        )}
        <button 
          onClick={() => setPhoneMenuOpen(!phoneMenuOpen)}
          className={`w-14 h-14 rounded-full liquid-glass-strong text-white border border-white/20 flex items-center justify-center hover:scale-110 shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all cursor-pointer ${phoneMenuOpen ? 'rotate-45' : ''}`}
        >
          {phoneMenuOpen ? <X className="w-6 h-6" /> : <PhoneCall className="w-6 h-6 animate-pulse" />}
        </button>
      </div>

      {/* Navbar Container */}
      <nav className="sticky top-6 z-50 flex items-center justify-between liquid-glass-strong px-6 py-4 rounded-full max-w-screen-xl mx-auto w-full">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('top')}>
          <span className="font-semibold text-xl tracking-tighter text-white">Pandere Dental</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-white/80 text-sm font-medium">
          <button onClick={() => setImmersiveModal('care-plan')} className="hover:text-white transition-all hover:scale-105 relative group">
            Care Plan
            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white/40 transition-all group-hover:w-full" />
          </button>
          <button onClick={() => setImmersiveModal('health-library')} className="hover:text-white transition-all hover:scale-105 relative group">
            Health Library
            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white/40 transition-all group-hover:w-full" />
          </button>
          <button onClick={() => setImmersiveModal('managed-care')} className="hover:text-white transition-all hover:scale-105 relative group">
            Managed Care
            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white/40 transition-all group-hover:w-full" />
          </button>
          <button onClick={() => setImmersiveModal('coordination')} className="hover:text-white transition-all hover:scale-105 relative group">
            Care Coordination
            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white/40 transition-all group-hover:w-full" />
          </button>
          <button onClick={() => setImmersiveModal('help')} className="hover:text-white transition-all hover:scale-105 relative group">
            Help
            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white/40 transition-all group-hover:w-full" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Patient Portal Toggle */}
          <button 
            onClick={() => setPortalOpen(true)} 
            className="flex items-center gap-2 px-6 py-2 rounded-full liquid-glass text-white/90 font-medium hover:bg-white/10 active:scale-95 transition-all"
          >
            <User className="w-4 h-4" />
            {isLoggedIn ? 'Patient Portal' : 'Patient Login'}
          </button>

          <button 
            onClick={() => scrollToSection('booking')}
            className="liquid-glass-strong pl-5 pr-2 py-1.5 flex items-center gap-3 rounded-full hover:scale-105 active:scale-95 transition-all text-white font-medium text-sm"
          >
            Schedule
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
               <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>
      </nav>

      {/* Modal for Patient Portal - EXPANDED DASHBOARD */}
      {portalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/15 backdrop-blur-md" onClick={() => setPortalOpen(false)} />
          
          {/* Luminous Glow Base */}
          <div className="absolute w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />

          {!isLoggedIn ? (
            /* LOGIN SCREEN */
            <div className="liquid-glass-strong rounded-[3.5rem] w-full max-w-md p-10 relative z-10 animate-in zoom-in-95 shadow-2xl border border-white/20 flex flex-col gap-8 text-center">
               <button onClick={() => setPortalOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 z-20 transition-all"><X className="w-5 h-5 text-white" /></button>
               <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center mx-auto">
                 <ShieldCheck className="w-8 h-8 text-white" />
               </div>
               <div>
                 <h2 className="text-3xl font-medium text-white font-serif">Patient Login</h2>
                 <p className="text-white/40 text-[13px] mt-2 leading-relaxed">Access your clinical records and treatment history through our secure patient portal.</p>
               </div>
               
               <div className="flex flex-col gap-4 text-left">
                  <div className="flex flex-col gap-2">
                                           <label className="text-white/50 text-[10px] uppercase font-bold tracking-widest ml-4">Patient ID / Email Address</label>

                     <input 
                       type="email" 
                       placeholder="Email Address" 
                       className="liquid-glass px-6 py-4 rounded-full text-white outline-none focus:border-white/40 transition-all text-sm backdrop-blur-none"
                       value={loginEmail}
                       onChange={(e) => setLoginEmail(e.target.value)}
                     />
                  </div>
                  <div className="flex flex-col gap-2">
                                           <label className="text-white/50 text-[10px] uppercase font-bold tracking-widest ml-4">Secure Access Pin</label>

                     <input 
                       type="password" 
                       placeholder="Security Password" 
                       className="liquid-glass px-6 py-4 rounded-full text-white outline-none focus:border-white/40 transition-all text-sm backdrop-blur-none"
                       value={loginPass}
                       onChange={(e) => setLoginPass(e.target.value)}
                     />
                  </div>
               </div>

               <button 
                 onClick={() => loginEmail && loginPass && setIsLoggedIn(true)}
                 className="mt-2 liquid-glass-strong text-white py-5 rounded-full font-bold hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/10 shadow-xl"
               >
                 Authenticate Access
               </button>
               
               <div className="flex items-center justify-center gap-2 text-white/30 text-[10px] font-medium">
                  <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                  Secured by 256-bit AES Protocols
               </div>
            </div>
          ) : (
            /* DASHBOARD */
            <div className={`liquid-glass rounded-[3.5rem] w-full max-w-5xl max-h-[85vh] relative z-10 animate-in zoom-in-95 shadow-2xl border border-white/20 flex flex-col md:flex-row overflow-hidden transition-all duration-700 ${settings.blur ? 'backdrop-blur-3xl' : 'backdrop-blur-none'}`}>
              {/* Sidebar Tabs */}
              <div className="w-full md:w-72 bg-white/5 border-b md:border-b-0 md:border-r border-white/10 p-8 flex flex-col gap-2">
                 <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Activity className="w-5 h-5 text-white" /></div>
                    <h2 className="text-xl font-semibold text-white">Patient Portal</h2>
                 </div>
                 {[
                   { id: 'profile', label: 'My Identity', icon: <User className="w-4 h-4" /> },
                   { id: 'history', label: 'Clinical Timeline', icon: <Calendar className="w-4 h-4" /> },
                                       { id: 'records', label: 'Clinical Reports', icon: <FileText className="w-4 h-4" /> },

                   { id: 'settings', label: 'Portal Settings', icon: <ShieldCheck className="w-4 h-4" /> }
                 ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActivePortalTab(tab.id as 'profile' | 'history' | 'records' | 'settings')}
                     className={`flex items-center gap-4 px-5 py-4 rounded-full transition-all text-sm font-medium ${activePortalTab === tab.id ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                   >
                     {tab.icon}
                     {tab.label}
                   </button>
                 ))}
                 <button onClick={() => setIsLoggedIn(false)} className="mt-auto px-5 py-4 rounded-full text-white/40 hover:text-red-400 text-sm text-left font-medium transition-colors">Sign Out Account</button>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-8 lg:p-14 overflow-y-auto custom-scrollbar relative">
                <button onClick={() => setPortalOpen(false)} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 z-20"><X className="w-5 h-5 text-white" /></button>
                
                    { activePortalTab === 'profile' && (
                      <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4">
                         <div className="flex items-center gap-8">
                            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-white font-medium text-3xl shadow-2xl relative overflow-hidden group">
                               <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
                               RS
                            </div>
                            <div className="flex flex-col gap-1">
                               <h3 className="text-3xl font-medium text-white tracking-tight">
                                 {settings.privacy ? 'R. Sharma (Protected)' : 'Rahul Sharma'}
                               </h3>
                               <span className="text-white/40 text-sm tracking-widest font-mono">
                                 {settings.privacy ? 'ID: #MASKED-RECORDS' : 'ID: #P-8842-GORAI'}
                               </span>
                               <span className="text-green-400/80 text-[10px] uppercase font-bold tracking-widest mt-1 px-3 py-1 bg-green-400/10 rounded-full w-fit">Active Status</span>
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="liquid-glass p-6 rounded-[2rem] border border-white/5 flex flex-col gap-1">
                               <span className="text-[10px] uppercase tracking-widest text-white/30">Verified Phone</span>
                               <span className="text-white font-medium">+91 98221 XXX01</span>
                            </div>
                            <div className="liquid-glass p-6 rounded-[2rem] border border-white/5 flex flex-col gap-1">
                               <span className="text-[10px] uppercase tracking-widest text-white/30">Emergency Contact</span>
                               <span className="text-white font-medium">+91 94220 XXX68</span>
                            </div>
                            <div className="liquid-glass p-6 rounded-[2rem] border border-white/5 flex flex-col gap-1 md:col-span-2">
                               <span className="text-[10px] uppercase tracking-widest text-white/30">Primary Address</span>
                               <span className="text-white font-medium">Gorai 1, Pragati Nagar, Borivali (W), Mumbai.</span>
                            </div>
                         </div>
                      </div>
                    )}

                    { activePortalTab === 'history' && (
                      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4">
                         <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-medium text-white">Clinical Timeline</h3>
                            <button onClick={() => alert('Downloading clinical schedule...')} className="text-xs text-white/40 hover:text-white transition-colors underline">Download Schedule</button>
                         </div>
                         <div className="flex flex-col gap-4">
                            <div className="liquid-glass p-6 rounded-[2rem] border border-white/30 relative overflow-hidden">
                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
                               <div className="flex justify-between items-start mb-2 pl-2">
                                 <span className="text-white font-medium text-lg">Next: Consultation & RCT Audit</span>
                                 <span className="px-3 py-1 bg-white text-black text-[10px] uppercase font-black rounded-full shadow-lg">Confirmed</span>
                               </div>
                               <p className="text-white/60 text-sm pl-2">Tomorrow, 10:30 AM • Gorai Clinic</p>
                            </div>
                            <div className="liquid-glass p-6 rounded-[2rem] border border-white/10 opacity-50 pl-6">
                               <div className="flex justify-between items-start mb-1">
                                 <span className="text-white font-medium italic">Previous: Structural CBCT Scan</span>
                                 <span className="text-white/20 text-[10px] uppercase font-bold">Concluded</span>
                               </div>
                               <p className="text-white/40 text-xs">15 Aug 2026 • 2D / 3D Analysis Uploaded</p>
                            </div>
                         </div>
                      </div>
                    )}

                    { activePortalTab === 'records' && (
                      <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4">
                         <div className="flex flex-col gap-2">
                           <h3 className="text-3xl text-white font-serif">Clinical Reports</h3>
                           <p className="text-white/40 text-xs">Download your professional case summaries and treatment advisories.</p>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                              { title: "Personalized Care Plan", date: "April 18, 2026", size: "2.4 MB", type: 'pdf' },
                              { title: "Structural Scan Summary", date: "April 15, 2026", size: "18.5 MB", type: 'scan' }
                            ].map((doc, i) => (
                              <div key={i} className="liquid-glass p-10 rounded-[2.5rem] border border-white/5 flex flex-col gap-8 hover:bg-white/5 transition-all group relative overflow-hidden shadow-2xl">
                                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[30px] rounded-full" />
                                 <div className="flex justify-between items-start">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white"><FileText className="w-7 h-7" /></div>
                                    <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{doc.size}</span>
                                 </div>
                                 <div className="flex flex-col gap-1">
                                    <h4 className="text-2xl text-white font-medium font-serif leading-tight">{doc.title}</h4>
                                    <p className="text-white/40 text-xs">{doc.date}</p>
                                 </div>
                                 <button 
                                   onClick={() => doc.title === "Personalized Care Plan" ? generateClinicalReport({ name: 'Rahul Sharma' }) : null}
                                   className="mt-2 bg-white/5 text-white/90 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all border border-white/10 active:scale-95"
                                 >
                                   {doc.type === 'pdf' ? 'Download PDF Report' : 'Open Scan Viewer'}
                                 </button>
                                 {doc.type === 'pdf' && (
                                   <div className="absolute bottom-4 right-6 flex items-center gap-1.5 opacity-40">
                                      <ShieldCheck className="w-3 h-3 text-green-400" />
                                      <span className="text-[8px] text-white font-bold uppercase">Clinically Verified</span>
                                   </div>
                                 )}
                              </div>
                            ))}
                         </div>
                      </div>
                    )}

                {activePortalTab === 'settings' && (
                  <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4">
                     <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-medium text-white tracking-tight font-serif">Portal Settings</h3>
                        <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] uppercase font-bold tracking-widest animate-pulse">
                           Auto-Saved to Cloud
                        </div>
                     </div>
                     <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between group cursor-pointer" onClick={() => setSettings({...settings, blur: !settings.blur})}>
                           <div className="flex flex-col">
                             <span className="text-white font-medium group-hover:text-white/80 transition-colors">Interface Blur Depth</span>
                             <span className="text-white/40 text-xs">Optimize translucent layers for system speed.</span>
                           </div>
                           <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.blur ? 'bg-white' : 'bg-white/10'}`}>
                              <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.blur ? 'right-1 bg-black' : 'left-1 bg-white/40'}`} />
                           </div>
                        </div>
                        <div className="flex items-center justify-between group cursor-pointer" onClick={() => setSettings({...settings, notifications: !settings.notifications})}>
                           <div className="flex flex-col">
                             <span className="text-white font-medium group-hover:text-white/80 transition-colors">Schedule Notifications</span>
                             <span className="text-white/40 text-xs">Receive SMS & Email clinical alerts.</span>
                           </div>
                           <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.notifications ? 'bg-white' : 'bg-white/10'}`}>
                              <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.notifications ? 'right-1 bg-black' : 'left-1 bg-white/40'}`} />
                           </div>
                        </div>
                        <div className="flex items-center justify-between group cursor-pointer" onClick={() => setSettings({...settings, privacy: !settings.privacy})}>
                           <div className="flex flex-col">
                             <span className="text-white font-medium group-hover:text-white/80 transition-colors">Clinical Anonymity</span>
                             <span className="text-white/40 text-xs">Mask patient metadata in analytical logs.</span>
                           </div>
                           <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.privacy ? 'bg-white' : 'bg-white/10'}`}>
                              <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.privacy ? 'right-1 bg-black' : 'left-1 bg-white/40'}`} />
                           </div>
                        </div>
                     </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      )}

      {/* Service Detail Screens */}
      {selectedService && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 lg:p-8">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" onClick={() => setSelectedService(null)} />
           
           <div className="w-full h-full lg:h-auto lg:max-w-5xl liquid-glass lg:rounded-[3rem] relative z-10 flex flex-col lg:flex-row overflow-hidden border border-white/20 shadow-2xl animate-in fade-in zoom-in-95">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Visual Hero */}
              <div className="w-full lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                 <img 
                    src={selectedService === 'rct' ? `/root_canal_tech_macro_1776444120672.png` : 
                         selectedService === 'implant' ? `/dental_implants_3d_render_1776444076846.png` : 
                         `/clear_aligners_aesthetic_1776444100072.png`} 
                    className="w-full h-full object-cover animate-in fade-in duration-1000"
                    alt={SERVICES_DATA[selectedService].title}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>

              {/* Content Deep Dive */}
              <div className="flex-1 p-8 lg:p-16 flex flex-col gap-10 overflow-y-auto custom-scrollbar">
                 <div className="flex flex-col gap-4">
                    <span className="text-white/40 text-sm tracking-[0.2em] font-bold uppercase">{SERVICES_DATA[selectedService].subtitle}</span>
                    <h2 className="text-4xl lg:text-5xl font-medium text-white font-serif leading-tight">{SERVICES_DATA[selectedService].title}</h2>
                 </div>

                 {/* Metrics Grid */}
                 <div className="grid grid-cols-3 gap-4">
                    {SERVICES_DATA[selectedService].metrics.map((m, i) => (
                      <div key={i} className="liquid-glass p-5 rounded-2xl flex flex-col gap-1 border border-white/5">
                        <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest">{m.label}</span>
                        <span className="text-white font-medium text-lg">{m.value}</span>
                      </div>
                    ))}
                 </div>

                 <div className="flex flex-col gap-6">
                    <h3 className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em]">Clinical Protocol</h3>
                    <p className="text-white/70 text-lg leading-relaxed">{SERVICES_DATA[selectedService].protocol}</p>
                 </div>

                 <div className="flex flex-col gap-6">
                    <h3 className="text-green-400 font-bold text-xs uppercase tracking-[0.2em]">Procedural Features</h3>
                    <div className="grid grid-cols-1 gap-3">
                       {SERVICES_DATA[selectedService].features.map((f, i) => (
                         <div key={i} className="flex items-center gap-3 text-white/60">
                            <Sparkles className="w-4 h-4 text-green-400" />
                            <span className="text-sm">{f}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => { setSelectedService(null); scrollToSection('booking'); }}
                      className="flex-1 bg-white text-black py-5 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                    >
                      Integrate with Schedule
                    </button>
                    <button 
                      onClick={() => setSelectedService(null)}
                      className="px-8 py-5 rounded-2xl liquid-glass text-white font-medium hover:bg-white/10 transition-all border border-white/10"
                    >
                      Return to Suite
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Modern Legal / Finance Modals */}
      {legalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/15 backdrop-blur-md" onClick={() => setLegalModal(null)} />
          
          {/* Luminous Glow Base */}
          <div className="absolute w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[10s]" />
          
          <div className="liquid-glass-strong rounded-[2.5rem] w-full max-w-2xl relative z-10 animate-in fade-in zoom-in-95 shadow-[0_0_100px_rgba(255,255,255,0.05)] border border-white/20 overflow-hidden">
            <button onClick={() => setLegalModal(null)} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 z-50 text-white transition-all"><X className="w-5 h-5" /></button>
            
            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar p-8 lg:p-14">
              {legalModal === 'privacy' && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-medium text-white font-serif">Privacy Protocols</h2>
                  </div>
                  <p className="text-white/60 leading-relaxed">Pandere Dental Clinic is committed to protecting your clinical and structural data integrity. This policy outlines our encryption and storage standards.</p>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { title: "256-Bit Encryption", desc: "All digital records and internal database streams are protected by industrial-grade AES encryption.", icon: <Shield className="w-4 h-4" /> },
                      { title: "Strict Consent", desc: "Clinical data is only shared with insurance providers upon explicit patient consent during TPA claims.", icon: <Sparkles className="w-4 h-4" /> },
                      { title: "Absolute Access", desc: "Patients have the right to request digital copies of scans and treatment histories at any time.", icon: <FileText className="w-4 h-4" /> }
                    ].map((p, i) => (
                      <div key={i} className="liquid-glass p-6 rounded-2xl border border-white/5 flex items-start gap-5">
                         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                            {p.icon}
                         </div>
                         <div className="flex flex-col gap-2">
                            <h4 className="text-white font-medium text-lg leading-tight">{p.title}</h4>
                            <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {legalModal === 'terms' && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-medium text-white font-serif">Clinical Terms</h2>
                  </div>
                  <div className="flex flex-col gap-5">
                     <div className="liquid-glass p-8 rounded-3xl border border-white/5">
                        <h3 className="text-white font-medium mb-3">Scheduling & Cancellation</h3>
                        <p className="text-white/40 text-sm leading-relaxed">By scheduling an appointment (structural or medical), you agree to provide at least 24 hours notice for rescheduling. Emergency slots are prioritized based on clinical severity.</p>
                     </div>
                     <div className="liquid-glass p-8 rounded-3xl border border-white/5">
                        <h3 className="text-white font-medium mb-3">Patient Responsibility</h3>
                        <p className="text-white/40 text-sm leading-relaxed">While we facilitate insurance claims directly with 50+ TPAs, final responsibility for structural treatment costs remains with the patient or legal guardian.</p>
                     </div>
                  </div>
                </div>
              )}

              {legalModal === 'finance' && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-medium text-white font-serif">Managed Care & Finance</h2>
                  </div>
                  <p className="text-white/60 leading-relaxed">We provide multiple pathways to ensure high-grade dental care is structurally and financially accessible.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="liquid-glass p-8 rounded-[2rem] border border-white/5 flex flex-col gap-4 hover:bg-white/5 transition-all">
                      <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center"><Sparkles className="w-5 h-5 text-green-400" /></div>
                      <h4 className="text-white font-medium">Zero-Interest EMI</h4>
                      <p className="text-white/40 text-xs leading-relaxed">Spread your treatment costs over 6-12 months with absolute zero interest through HDFC and Bajaj Finserv.</p>
                    </div>
                    <div className="liquid-glass p-8 rounded-[2rem] border border-white/5 flex flex-col gap-4 hover:bg-white/5 transition-all">
                      <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-blue-400" /></div>
                      <h4 className="text-white font-medium">Insurance Partners</h4>
                      <p className="text-white/40 text-xs leading-relaxed">Direct cashless facility for over 50+ major TPAs including Star Health, Apollo Munich, and ICICI Lombard.</p>
                    </div>
                  </div>
                  <button 
                     onClick={() => { setLegalModal(null); scrollToSection('booking'); }} 
                     className="mt-4 liquid-glass-strong text-white py-5 rounded-2xl font-bold hover:scale-[1.02] transition-all border border-white/10 shadow-2xl"
                  >
                    Verify Structural Eligibility
                  </button>
                </div>
              )}
             </div>
           </div>
         </div>
      )}

      {/* Immersive Full-Screen Modals - The Clinical Suite */}
      {/* Immersive Full-Screen Modals - The Clinical Suite (Themed & Cleaned) */}
      {immersiveModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 lg:p-8 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/15 backdrop-blur-md" onClick={() => { setImmersiveModal(null); setAnalysisActive(false); }} />
          
          <div className="w-full h-full lg:rounded-[3.5rem] lg:max-w-5xl relative z-10 flex flex-col liquid-glass border border-white/20 shadow-2xl overflow-hidden transition-all duration-700 animate-in zoom-in-95">
            
            {/* 1 Header */}
            <div className="px-12 py-10 border-b border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group transition-all">
                     {immersiveModal === 'care-plan' && <Sparkles className="w-8 h-8 text-white/90" />}
                     {immersiveModal === 'health-library' && <BookOpen className="w-8 h-8 text-white/90" />}
                     {immersiveModal === 'managed-care' && <ShieldCheck className="w-8 h-8 text-white/90" />}
                     {immersiveModal === 'coordination' && <PhoneCall className="w-8 h-8 text-white/90" />}
                     {immersiveModal === 'help' && <Heart className="w-8 h-8 text-white/90" />}
                  </div>
                  <div className="space-y-1">
                     <h2 className="text-4xl lg:text-5xl font-medium text-white tracking-[-0.05em]">
                        {immersiveModal === 'care-plan' && <>Care <span className="font-serif italic text-white/80">Pathway</span></>}
                        {immersiveModal === 'health-library' && <>Clinical <span className="font-serif italic text-white/80">Wisdom</span></>}
                        {immersiveModal === 'managed-care' && <>Managed <span className="font-serif italic text-white/80">Finance</span></>}
                        {immersiveModal === 'coordination' && <>Care <span className="font-serif italic text-white/80">Concierge</span></>}
                        {immersiveModal === 'help' && <>Patient <span className="font-serif italic text-white/80">Support</span></>}
                     </h2>
                     <div className="flex items-center gap-3">
                        <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Integrated Gateways</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse" />
                     </div>
                  </div>
               </div>
               <button onClick={() => { setImmersiveModal(null); setAnalysisActive(false); }} className="w-14 h-14 rounded-full liquid-glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all group">
                 <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
               </button>
            </div>

            {/* 2 Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-12 lg:p-16 bg-gradient-to-b from-white/[0.02] to-transparent">
               
               {/* Care Plan Flow */}
               {immersiveModal === 'care-plan' && (
                 <div className="flex flex-col gap-14 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    {analysisActive ? (
                       <div className="flex flex-col items-center justify-center py-24 gap-10">
                          <div className="relative">
                             <div className="w-32 h-32 rounded-full border-[1px] border-white/10 border-t-white animate-spin" />
                             <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-white/50 animate-pulse" />
                          </div>
                          <div className="text-center space-y-4">
                             <h3 className="text-4xl lg:text-5xl font-medium text-white tracking-[-0.05em]">Optimizing Your <span className="font-serif italic text-white/80">Care Path</span></h3>
                             <p className="text-white/30 font-medium">Syncing clinical profiles with Gorai scheduling protocols...</p>
                          </div>
                       </div>
                    ) : (
                      <>
                        <div className="text-center max-w-3xl mx-auto mb-16">
                           <h3 className="text-4xl lg:text-5xl font-medium text-white tracking-[-0.05em] mb-6">What is our <span className="font-serif italic text-white/80">primary focus</span> today?</h3>
                           <p className="text-white/40 text-lg leading-relaxed">Choose an objective to prepare your clinical summary. This allows us to optimize your time at the clinic.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           {[
                             { id: 'aesthetic', label: 'Aesthetic Refinement', sub: 'Whitening & Alignment', icon: <Sparkles className="w-6 h-6" /> },
                             { id: 'restorative', label: 'Restorative Care', sub: 'Implants & Crowns', icon: <BookOpen className="w-6 h-6" /> },
                             { id: 'preventive', label: 'Preventive Health', sub: 'Routine Maintenance', icon: <ShieldCheck className="w-6 h-6" /> },
                             { id: 'emergency', label: 'Pain Management', sub: 'Immediate Relief', icon: <AlertCircle className="w-6 h-6" /> },
                             { id: 'child', label: 'Pediatric Care', sub: 'Gentle Focus', icon: <Heart className="w-6 h-6" /> },
                             { id: 'foundation', label: 'Gum Health', sub: 'Laser Restoration', icon: <Shield className="w-6 h-6" /> }
                           ].map((item, i) => (
                             <div key={item.id} onClick={() => { setSelectedFocus(item.id); setAnalysisActive(true); }} className="liquid-glass p-10 rounded-[3rem] border border-white/5 hover:border-white/20 transition-all cursor-pointer group shadow-xl flex flex-col gap-6" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                                   {item.icon}
                                </div>
                                <div>
                                   <h4 className="text-2xl font-medium text-white tracking-tight">{item.label}</h4>
                                   <p className="text-white/30 text-sm font-medium">{item.sub}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                      </>
                    )}
                 </div>
               )}

               {/* Health Library */}
               {immersiveModal === 'health-library' && (
                  <div className="flex flex-col gap-14 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                     <div className="flex flex-col md:flex-row gap-10 items-end justify-between border-b border-white/5 pb-10">
                        <div className="space-y-4">
                          <h3 className="text-5xl lg:text-6xl font-medium text-white tracking-[-0.05em]">Clinical Wisdom <br/> <span className="font-serif italic text-white/80">& Case Logic</span></h3>
                          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Gorai 1 Research Vault
                          </p>
                        </div>
                        <div className="flex items-center liquid-glass px-10 py-5 rounded-full w-full md:w-[450px] border border-white/10 text-white group">
                           <Search className="w-6 h-6 text-white/20 mr-4" />
                           <input type="text" placeholder="Search clinical protocols..." className="bg-transparent border-none text-white outline-none w-full text-sm font-medium" />
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          { title: "Precision Root Canals", cat: "Microsurgery", desc: "Why modern rotary tools have made treatment faster and 100% pain-free.", icon: <Sparkles className="w-6 h-6" /> },
                          { title: "The Implant Standard", cat: "Structural", desc: "Understanding titanium anchors as a lifetime solution for missing teeth.", icon: <ShieldCheck className="w-6 h-6" /> },
                          { title: "Invisible Aligner Paths", cat: "Cosmetic", desc: "How clear mapping can shift your smile without traditional metal wires.", icon: <Wand2 className="w-6 h-6" /> },
                          { title: "Gum Tissue Rejuvenation", cat: "Periodontal", desc: "Non-surgical laser protocols for restoring a healthy foundation.", icon: <Activity className="w-6 h-6" /> }
                        ].map((doc, i) => (
                          <div key={i} onClick={() => alert(`Opening protocol: ${doc.title}`)} className="liquid-glass p-12 rounded-[3rem] border border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer group shadow-2xl flex flex-col gap-8">
                             <div className="flex justify-between items-start">
                                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all shadow-inner">
                                   {doc.icon}
                                 </div>
                                <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full bg-blue-400/5 transition-all">{doc.cat}</span>
                             </div>
                             <div className="space-y-4">
                                <h4 className="text-3xl font-medium text-white tracking-tight">{doc.title}</h4>
                                <p className="text-white/40 text-base leading-relaxed line-clamp-2">{doc.desc}</p>
                             </div>
                             <button onClick={(e) => { e.stopPropagation(); alert(`View Protocol Guide for ${doc.title}`); }} className="flex items-center gap-4 text-white/60 font-black text-[10px] tracking-[0.3em] uppercase group-hover:text-white transition-all">
                                View Protocol Guide 
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                   <ArrowRight className="w-4 h-4" />
                                </div>
                             </button>
                          </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Managed Care */}
               {immersiveModal === 'managed-care' && (
                  <div className="flex flex-col gap-14 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 flex flex-col gap-10">
                           <div className="liquid-glass p-12 rounded-[3.5rem] border border-white/10 group hover:bg-white/[0.02] transition-all overflow-hidden relative shadow-2xl flex flex-col gap-12">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[80px] rounded-full group-hover:bg-green-500/10 transition-all" />
                              <div className="flex items-center justify-between relative z-10">
                                 <div className="flex items-center gap-8">
                                    <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform duration-700 shadow-inner">
                                       <ShieldCheck className="w-10 h-10 text-green-400" />
                                    </div>
                                    <div className="space-y-1">
                                       <h4 className="text-4xl font-medium text-white tracking-[-0.05em]">Cashless <span className="font-serif italic text-white/80">Network</span></h4>
                                       <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Verified Authorization</p>
                                    </div>
                                 </div>
                                 <button onClick={() => alert('Starting claim authorization...')} className="flex items-center gap-4 pl-10 pr-2 py-2 rounded-full liquid-glass text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl group/btn">
                                    Activate Claim
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all">
                                       <Plus className="w-5 h-5" />
                                    </div>
                                 </button>
                              </div>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                                 {["Star Health", "Niva Bupa", "HDFC ERGO", "Care Health", "ICICI Lombard", "Aditya Birla", "Bajaj Allianz", "United Health"].map((item) => (
                                   <div key={item} onClick={() => alert(`Verifying eligibility with ${item}...`)} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center gap-3 hover:bg-white group/item transition-all cursor-pointer">
                                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs group-hover/item:bg-black group-hover/item:text-white transition-all">{item[0]}</div>
                                      <span className="text-white/80 text-[10px] font-medium text-center group-hover/item:text-black transition-colors">{item}</span>
                                   </div>
                                 ))}
                              </div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div onClick={() => { setImmersiveModal(null); setLegalModal('finance'); }} className="liquid-glass p-12 rounded-[3rem] border border-white/5 flex flex-col gap-6 hover:bg-white/10 transition-all cursor-pointer group shadow-xl">
                                 <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10"><Heart className="w-8 h-8 text-blue-400" /></div>
                                 <h4 className="text-2xl font-medium text-white tracking-tight">Structural EMI</h4>
                                 <p className="text-white/40 text-sm leading-relaxed">0% Interest pathways for treatments above ₹15,000.</p>
                              </div>
                              <div onClick={() => alert('Initiating Direct Billing Protocol...')} className="liquid-glass p-12 rounded-[3rem] border border-white/5 flex flex-col gap-6 hover:bg-white/10 transition-all cursor-pointer group shadow-xl">
                                 <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10"><Globe className="w-8 h-8 text-white/60" /></div>
                                 <h4 className="text-2xl font-medium text-white tracking-tight">Direct Billing</h4>
                                 <p className="text-white/40 text-sm leading-relaxed">Concierge invoicing for international corporate partners.</p>
                              </div>
                           </div>
                        </div>
                        <div className="liquid-glass-strong p-12 rounded-[3.5rem] border border-white/15 shadow-2xl relative overflow-hidden h-fit flex flex-col gap-10">
                           <div className="text-center space-y-2 relative z-10">
                              <h4 className="text-3xl lg:text-4xl font-medium text-white tracking-[-0.05em]">Managed <span className="font-serif italic text-white/80">Finance</span></h4>
                              <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">Commitment Estimator</p>
                           </div>
                           <div className="space-y-8 relative z-10">
                              <div className="space-y-4">
                                 <label className="text-white/30 text-[9px] uppercase font-black tracking-widest ml-4">Est. Treatment Value</label>
                                 <div className="relative group/input">
                                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 text-2xl font-sans group-focus-within/input:text-white transition-colors">₹</span>
                                    <input type="number" defaultValue="45000" className="w-full bg-white/5 border border-white/10 focus:border-white/40 px-16 py-6 rounded-[2rem] text-white text-3xl font-medium outline-none transition-all shadow-inner tracking-tight" />
                                 </div>
                              </div>
                              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 text-center">
                                 <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-3">Monthly Recovery Path</p>
                                 <p className="text-5xl font-medium text-white tracking-tighter">₹ 3,750</p>
                              </div>
                              <button onClick={() => alert('Approval Request Sent!')} className="flex items-center justify-between pl-10 pr-2 py-2 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl w-full">
                                 Instant Approval
                                 <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-black" />
                                 </div>
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Help Center */}
               {immersiveModal === 'help' && (
                  <div className="flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-14">
                           <div className="flex flex-col gap-6">
                              <h3 className="text-5xl lg:text-6xl font-medium text-white tracking-[-0.05em]">Patient Support <br/> <span className="font-serif italic text-white/80">Direct Channels</span></h3>
                              <p className="text-white/40 leading-relaxed text-lg max-w-2xl">We understand that dental transitions require clear, humane communication. Our clinical concierge is available to handle everything.</p>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {[
                                { title: "Booking Logic", sub: "Priority Systems", icon: <Calendar className="w-6 h-6" /> },
                                { title: "Clinical Clarification", sub: "Head Concierge", icon: <Activity className="w-6 h-6" /> },
                                { title: "Managed Care", sub: "Authorization Help", icon: <ShieldCheck className="w-6 h-6" /> },
                                { title: "Portal Tech", sub: "Report Access", icon: <FileText className="w-6 h-6" /> }
                              ].map((cat, i) => (
                                <div key={i} onClick={() => alert(`Redirecting to ${cat.title}...`)} className="liquid-glass p-12 rounded-[3rem] border border-white/5 hover:bg-white/10 transition-all cursor-pointer group shadow-2xl flex flex-col gap-8">
                                   <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                                      {cat.icon}
                                   </div>
                                   <div>
                                      <h4 className="text-2xl font-medium tracking-tight text-white">{cat.title}</h4>
                                      <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">{cat.sub}</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-8">
                           <div className="liquid-glass-strong p-12 rounded-[3rem] border border-white/10 flex flex-col gap-10 shadow-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[60px] rounded-full animate-pulse" />
                              <div className="space-y-4 relative z-10">
                                 <h4 className="text-3xl font-medium text-white tracking-tight">Clinical Hotline</h4>
                                 <p className="text-white/30 text-sm">Reserved for acute trauma or post-procedural pain.</p>
                              </div>
                              <div className="flex flex-col gap-6 relative z-10">
                                 <a href={CLINIC_WHATSAPP} target="_blank" className="flex items-center justify-between pl-8 pr-2 py-2 rounded-full bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all group">
                                    <div className="flex items-center gap-6">
                                       <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 group-hover:bg-green-400 group-hover:text-white transition-all"><Phone className="w-6 h-6" /></div>
                                       <span className="text-white font-black text-[10px] uppercase tracking-widest">WhatsApp Direct</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:translate-x-3 transition-transform"><ArrowRight className="w-5 h-5 text-green-400" /></div>
                                 </a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Care Coordination */}
               {immersiveModal === 'coordination' && (
                  <div className="flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                     <div className="text-center space-y-6 mb-10 border-b border-white/5 pb-10">
                        <h3 className="text-5xl lg:text-6xl font-medium text-white tracking-[-0.05em]">Advanced Care <br/> <span className="font-serif italic text-white/80">Concierge Systems</span></h3>
                        <p className="text-white/40 leading-relaxed text-lg max-w-3xl mx-auto">Our coordination team manages clinical logistics for specialized structural cases and visitors beyond Mumbai.</p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          { title: "International Lane", sub: "Global Logistics", icon: <Globe className="w-10 h-10" /> },
                          { title: "Corporate Priority", sub: "Executive Access", icon: <Sparkles className="w-10 h-10" /> },
                          { title: "Trauma Triage", sub: "Emergency Gateway", icon: <AlertCircle className="w-10 h-10" /> },
                          { title: "Referral Conduit", sub: "Specialist Handoff", icon: <User className="w-10 h-10" /> }
                        ].map((p, i) => (
                           <div key={i} className="liquid-glass p-16 rounded-[4rem] border border-white/5 flex flex-col gap-12 hover:bg-white/[0.06] transition-all group shadow-2xl">
                              <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black group-hover:rotate-[360deg] transition-all duration-1000">
                                 {p.icon}
                              </div>
                              <div className="space-y-4">
                                 <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full bg-blue-400/5 transition-colors">{p.sub}</span>
                                 <h4 className="text-4xl font-medium text-white tracking-tight">{p.title}</h4>
                              </div>
                              <button onClick={() => window.open(CLINIC_WHATSAPP)} className="flex items-center justify-between pl-10 pr-2 py-2 rounded-full border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all w-full group/btn">
                                 Initiate Concierge Session 
                                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-black group-hover/btn:text-white transition-all"><ArrowRight className="w-6 h-6" /></div>
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

            </div>

            {/* Footer: Home Screen Pill Pattern */}
            <div className="p-10 border-t border-white/5 flex items-center justify-center backdrop-blur-3xl bg-white/[0.01]">
               <button 
                 onClick={() => { setImmersiveModal(null); setAnalysisActive(false); }} 
                 className="flex items-center gap-6 pl-12 pr-2 py-2 rounded-full liquid-glass-strong border border-white/20 text-white font-black text-[10px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.5)] group"
               >
                 Return to Primary Interface
                 <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <X className="w-6 h-6" />
                 </div>
               </button>
            </div>

          </div>
        </div>
      )}


      <div id="top" className="absolute top-0" />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 lg:py-32 liquid-glass rounded-[3rem] w-full max-w-screen-xl mx-auto px-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <h1 className="text-5xl lg:text-7xl tracking-[-0.05em] font-medium text-white max-w-4xl leading-[1.15] mb-8 z-10">
          Gentle Care for <br className="hidden md:block"/> Your Most <span className="font-serif italic text-white/80">Beautiful Smile</span>
        </h1>
        <p className="text-white/70 text-lg md:text-xl max-w-2xl mb-12 z-10">
          Dr. Pandere brings professional, pain-free dental care to Gorai. We combine a gentle touch with modern tools to keep your smile healthy and bright.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 z-10 mb-12">
           {["10,000+ Happy Patients", "Pain-Free Treatments", "Certified Dental Care"].map((pill) => (
             <div key={pill} className="liquid-glass px-6 py-3 rounded-full text-sm text-white/90 font-medium hover:bg-white/10 transition-colors shadow-lg">
               {pill}
             </div>
           ))}
        </div>

        <button 
          onClick={() => scrollToSection('booking')}
          className="liquid-glass flex items-center gap-4 pl-8 pr-2 py-2 rounded-full hover:scale-105 hover:bg-white/10 active:scale-95 transition-all z-10 shadow-2xl border border-white/10"
        >
          <span className="font-medium text-white text-lg">Schedule Appointment</span>
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
        </button>
      </section>      {/* Services Section */}
      <section id="services" className="w-full max-w-screen-xl mx-auto flex flex-col gap-8 scroll-mt-32">
        <div className="flex flex-col items-center text-center mb-8">
           <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center mb-6">
             <Sparkles className="w-6 h-6 text-white" />
           </div>
           <h2 className="text-4xl lg:text-5xl font-medium text-white tracking-tight mb-4">Our Dental Services</h2>
           <p className="text-white/60 max-w-xl">Complete custom dental care covering every stage of your smile using strictly modern tools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => setSelectedService('rct')} className="liquid-glass p-8 rounded-3xl flex flex-col gap-6 hover:bg-white/5 transition-colors group cursor-pointer shadow-xl border border-white/5 hover:border-white/20">
             <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
               <Wand2 className="w-6 h-6 text-white" />
             </div>
             <div>
                <h3 className="text-white font-medium text-xl mb-2">Root Canals</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">A gentle, painless way to save your natural teeth and get you back to feeling great.</p>
                <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 group-hover:text-white transition-colors">
                  Learn How We Care <ArrowRight className="w-3 h-3" />
                </span>
              </div>
          </div>
          
          <div onClick={() => setSelectedService('implant')} className="liquid-glass p-8 rounded-3xl flex flex-col gap-6 hover:bg-white/5 transition-colors group cursor-pointer shadow-xl border border-white/5 hover:border-white/20">
             <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
               <BookOpen className="w-6 h-6 text-white" />
             </div>
             <div>
                <h3 className="text-white font-medium text-xl mb-2">Dental Implants</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">Permanent, natural-looking replacements that feel just like your original teeth.</p>
                <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 group-hover:text-white transition-colors">
                  Learn How We Care <ArrowRight className="w-3 h-3" />
                </span>
              </div>
          </div>

          <div onClick={() => setSelectedService('braces')} className="liquid-glass p-8 rounded-3xl flex flex-col gap-6 hover:bg-white/5 transition-colors group cursor-pointer shadow-xl relative overflow-hidden border border-white/5 hover:border-white/20">
             <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
               <Plus className="w-6 h-6 text-white" />
             </div>
             <div className="relative z-10">
                <h3 className="text-white font-medium text-xl mb-2">Aligners & Braces</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">Straighten your teeth comfortably with our modern, nearly invisible clear aligners.</p>
                <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 group-hover:text-white transition-colors">
                  Learn How We Care <ArrowRight className="w-3 h-3" />
                </span>
              </div>
          </div>
        </div>
      </section>

      {/* Doctor Profile Section */}
      <section id="about" className="w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-6 scroll-mt-32">
         <div className="liquid-glass-strong p-10 rounded-[3rem] lg:w-1/3 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group min-h-[350px]">
            <img src="/doctor.png" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all group-hover:scale-105 pointer-events-none brightness-110" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
           <div className="relative z-10 mt-auto">
              <span className="text-[12px] tracking-widest uppercase text-black font-bold bg-white px-5 py-2 rounded-full shadow-lg">Dr. Vinay Pandere</span>
           </div>
         </div>
         <div className="liquid-glass p-10 rounded-[3rem] lg:w-2/3 flex flex-col justify-center shadow-xl">
            <h2 className="text-3xl lg:text-4xl font-medium text-white tracking-tight mb-6">Meet Your Dentist</h2>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              Dr. Vinay Pandere (BDS) is a dedicated professional based in Gorai, Mumbai, with years of experience providing precise, gentle, and modern dental care.
            </p>
            <p className="text-white/60 text-lg leading-relaxed">
              His structural approach prioritizes genuine patient comfort, open transparency, and rigorous attention to long-lasting results. ensuring every patient feels unconditionally confident.
            </p>
         </div>
      </section>

      {/* Booking / Schedule Form - MOVED for professional conversion after trust */}
      <section id="booking" className="w-full max-w-screen-lg mx-auto scroll-mt-32 relative">
         {(!isLoggedIn && !dismissedLock) && (
           <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-black/5 rounded-[3.5rem] flex items-center justify-center p-6 text-center">
              <div className="liquid-glass p-12 rounded-[3.5rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 max-w-md relative">
                 <button onClick={() => setDismissedLock(true)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all z-20"><X className="w-5 h-5 text-white" /></button>
                 <ShieldCheck className="w-12 h-12 text-white/40 mb-6 mx-auto" />
                 <h3 className="text-2xl font-medium text-white mb-4">Scheduling Locked</h3>
                 <p className="text-white/40 text-sm mb-8">To protect your privacy and ensure the best care, please log in to see our live schedule.</p>
                 <button 
                   onClick={() => setPortalOpen(true)}
                   className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-all text-sm w-full"
                 >
                   Verify Identity to Unlock
                 </button>
              </div>
           </div>
         )}
         <div className="liquid-glass p-8 lg:p-14 rounded-[3rem] shadow-2xl">
            <div className="flex flex-col items-center text-center mb-12">
               <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center mb-6 bg-white/10 animate-pulse">
                 <Calendar className="w-6 h-6 text-white" />
               </div>
               <h2 className="text-4xl lg:text-5xl font-medium text-white tracking-tight mb-4">Live Appointment Schedule</h2>
               <p className="text-white/60 font-medium">Verify your timeline in real time over 4 priority-based steps.</p>
            </div>
            
            <div className="liquid-glass p-8 lg:p-10 rounded-3xl min-h-[400px] flex flex-col border border-white/10">
              <div className="flex justify-between items-center mb-8">
                <span className="text-white/60 font-medium text-sm tracking-widest uppercase">Phase {questionStep} / 4</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(step => (
                    <div key={step} className={`h-2 rounded-full transition-all duration-300 ${questionStep >= step ? 'w-10 bg-white' : 'w-3 bg-white/20'}`} />
                  ))}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                {questionStep === 1 && (
                  <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95">
                    <h3 className="text-2xl lg:text-3xl text-white font-medium text-center">Are you experiencing dental pain?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button onClick={() => setQuestionStep(2)} className="liquid-glass p-6 rounded-full text-white hover:bg-white/20 transition-all font-medium text-sm">Yes, severe pain</button>
                      <button onClick={() => setQuestionStep(2)} className="liquid-glass p-6 rounded-full text-white hover:bg-white/20 transition-all font-medium text-sm">Mild sensitivity</button>
                      <button onClick={() => setQuestionStep(2)} className="liquid-glass p-6 rounded-full text-white hover:bg-white/20 transition-all font-medium text-sm">No, just routine call</button>
                    </div>
                  </div>
                )}
                
                {questionStep === 2 && (
                  <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95">
                    <h3 className="text-2xl lg:text-3xl text-white font-medium text-center">When was your last dental visit?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button onClick={() => setQuestionStep(3)} className="liquid-glass p-6 rounded-full text-white hover:bg-white/20 transition-all font-medium text-sm">Less than 6 months</button>
                      <button onClick={() => setQuestionStep(3)} className="liquid-glass p-6 rounded-full text-white hover:bg-white/20 transition-all font-medium text-sm">6-12 months ago</button>
                      <button onClick={() => setQuestionStep(3)} className="liquid-glass p-6 rounded-full text-white hover:bg-white/20 transition-all font-medium text-sm">1-3 years ago</button>
                      <button onClick={() => setQuestionStep(3)} className="liquid-glass p-6 rounded-full text-white hover:bg-white/20 transition-all font-medium text-sm">Over 3 years ago</button>
                    </div>
                  </div>
                )}

                {questionStep === 3 && (
                  <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95">
                    <h3 className="text-2xl lg:text-3xl text-white font-medium text-center">What is the priority goal?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button onClick={() => setQuestionStep(4)} className="liquid-glass p-6 rounded-full text-white hover:bg-white/20 hover:scale-[1.02] transition-all font-medium text-sm">Medical / Treatment</button>
                      <button onClick={() => setQuestionStep(4)} className="liquid-glass p-6 rounded-full text-white hover:bg-white/20 hover:scale-[1.02] transition-all font-medium text-sm">Cosmetic Improvement</button>
                      <button onClick={() => setQuestionStep(4)} className="liquid-glass p-6 rounded-full text-white hover:bg-white/20 hover:scale-[1.02] transition-all font-medium text-sm">Braces / Implants</button>
                      <button onClick={() => setQuestionStep(4)} className="liquid-glass p-6 rounded-full text-white hover:bg-white/20 hover:scale-[1.02] transition-all font-medium text-sm">General Cleaning</button>
                    </div>
                  </div>
                )}

                {questionStep === 4 && (
                  <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 max-w-xl mx-auto w-full">
                    <h3 className="text-2xl lg:text-3xl text-white font-medium text-center">Choose Date & Schedule</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      {/* Left: Inputs */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center liquid-glass rounded-full px-5 py-2 focus-within:ring-2 focus-within:ring-white/30 transition-all">
                          <User className="w-5 h-5 text-white/50 mr-4 flex-shrink-0" />
                          <input type="text" placeholder="Full Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="flex-1 w-full bg-transparent border-none text-white outline-none py-3 placeholder:text-white/40 text-sm" />
                        </div>
                        <div className="flex items-center liquid-glass rounded-full px-5 py-2 focus-within:ring-2 focus-within:ring-white/30 transition-all">
                          <Phone className="w-5 h-5 text-white/50 mr-4 flex-shrink-0" />
                          <input type="text" placeholder="Phone *" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="flex-1 w-full bg-transparent border-none text-white outline-none py-3 placeholder:text-white/40 text-sm" />
                        </div>
                        <div className="flex items-center liquid-glass rounded-full px-5 py-2 focus-within:ring-2 focus-within:ring-white/30 transition-all">
                          <Calendar className="w-5 h-5 text-white/50 mr-4 flex-shrink-0" />
                          <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="flex-1 w-full bg-transparent border-none text-white/90 outline-none py-3 text-sm focus:outline-none" style={{ colorScheme: 'dark' }} />
                        </div>
                      </div>

                      {/* Right: Time selectors */}
                      <div className="flex flex-col gap-2 bg-white/5 rounded-[2rem] p-4 border border-white/10">
                        <span className="text-xs font-semibold text-white/50 tracking-widest uppercase mb-2">Available Slots</span>
                        <div className="grid grid-cols-2 gap-2 h-[170px] overflow-y-auto pr-2 custom-scrollbar">
                           {timeslots.map(t => (
                              <button 
                                key={t} 
                                onClick={() => setFormData({...formData, time: t})}
                                className={`py-2 px-1 text-xs rounded-full transition-all border ${formData.time === t ? 'bg-white text-black font-bold border-white scale-105' : 'bg-transparent text-white border-white/10 hover:bg-white/10'}`}
                              >
                                {t}
                              </button>
                           ))}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        if (!formData.name.trim() || !formData.phone.trim() || !formData.date || !formData.time) {
                          alert('Please select a Schedule Date, Time, and provide Name/Phone.');
                           return;
                        }
                        alert(`Booked Confirmed for ${formData.date} at ${formData.time}! Check SMS for details.`);
                        setFormData({ name: '', phone: '', date: '', time: '' });
                        setTimeout(() => { setQuestionStep(1); scrollToSection('top'); }, 1000);
                      }}
                      className="bg-white hover:bg-white/90 text-black w-full py-4 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all mb-8"
                    >
                      Confirm Schedule
                    </button>

                    <div className="p-6 rounded-[2rem] liquid-glass border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">Direct Consultation</span>
                        <span className="text-white/40 text-xs">Avoid automated clashes, speak to us directly.</span>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => window.open(`tel:${CLINIC_PHONE}`)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass hover:bg-white/20 hover:scale-105 active:scale-95 text-white text-sm font-medium transition-all"
                        >
                          <Phone className="w-4 h-4" /> Call Now
                        </button>
                        <button 
                          onClick={() => window.open(CLINIC_WHATSAPP)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass hover:bg-white/20 hover:scale-105 active:scale-95 text-white text-sm font-medium transition-all border border-green-500/20"
                        >
                          <svg className="w-4 h-4 text-green-400 fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg> WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
         </div>
      </section>

      {/* Visit Module */}
      <section id="visit" className="w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-6 scroll-mt-32">
         <div className="liquid-glass p-10 rounded-[3rem] lg:w-1/2 shadow-xl flex flex-col justify-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-6">
               <MapPin className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-medium text-white tracking-tight mb-6">Visit Our Clinic</h2>
            <div className="flex flex-col gap-4 text-white/80">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                 <Clock className="w-5 h-5 text-white/50" />
                 <div className="flex flex-col">
                   <span className="text-sm font-medium text-white">Opening Hours</span>
                   <span className="text-xs text-white/50">Mon-Sat: 10:00 AM - 08:00 PM <br/> Sundays: Emergencies Only</span>
                 </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                 <Activity className="w-5 h-5 text-white/50" />
                 <div className="flex flex-col">
                   <span className="text-sm font-medium text-white">Facility Details</span>
                   <span className="text-xs text-white/50">Free Parking • Wheelchair Accessible • Free WiFi</span>
                 </div>
              </div>
            </div>
         </div>
         <div className="liquid-glass p-10 rounded-[3rem] lg:w-1/2 flex flex-col justify-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <h3 className="text-2xl font-medium text-white mb-6 z-10">Clinic Location</h3>
            <div className="flex flex-col gap-6 z-10">
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-white" /></div>
                  <p className="text-white/70 text-sm leading-relaxed">Shop No 14, Gorai 1, Bhim Nagar, Borivali West, Mumbai, Maharashtra 400091</p>
               </div>
               <div className="flex items-start gap-4 cursor-pointer hover:text-white transition-colors" onClick={() => window.open(`tel:${CLINIC_PHONE}`)}>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-white" /></div>
                  <p className="text-white/70 text-sm leading-relaxed">+91 99999 99999 (Appointment Line)</p>
               </div>
               <button onClick={() => window.open('https://maps.google.com/?q=Pandere+Dental+Gorai', '_blank')} className="mt-4 liquid-glass px-8 py-3 rounded-2xl text-white font-medium hover:scale-105 hover:bg-white/20 transition-all text-sm w-fit border border-white/10">Open in Google Maps</button>
            </div>
         </div>
      </section>

      {/* Advanced Technology Screen */}
      <section id="technology" className="w-full max-w-screen-xl mx-auto flex flex-col gap-8 scroll-mt-32">
        <div className="flex flex-col items-center text-center">
           <h2 className="text-4xl lg:text-5xl font-medium text-white tracking-tight mb-4 text-gradient bg-clip-text">Clinical Technology</h2>
           <p className="text-white/60 max-w-xl">Harnessing advanced digital systems to ensure precision and pain-free structural recovery.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {[
             { title: "Comfortable Scans", desc: "We use digital 3D scans that replace those uncomfortable traditional molds.", icon: <Activity className="w-6 h-6" /> },
             { title: "Gentle Laser Care", desc: "Our precise laser tools make gum treatments faster and much more comfortable.", icon: <Sparkles className="w-6 h-6" /> },
             { title: "Clear 3D Imaging", desc: "High-definition 3D X-rays help us plan your care with incredible accuracy.", icon: <Search className="w-6 h-6" /> },
             { title: "Smart Check-ups", desc: "Our advanced imaging helps us spot potential issues early, keeping your smile healthy.", icon: <ShieldCheck className="w-6 h-6" /> }
           ].map((tech, idx) => (
             <div key={idx} className="liquid-glass p-6 rounded-3xl flex flex-col gap-4 hover:-translate-y-1 transition-all border border-white/5">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                  {tech.icon}
                </div>
                <h4 className="text-white font-medium">{tech.title}</h4>
                <p className="text-white/40 text-xs leading-relaxed">{tech.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Insurance & Quality Block */}
      <section className="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-32">
         <div className="liquid-glass p-8 rounded-3xl flex items-center gap-6 shadow-xl cursor-pointer hover:bg-white/5 transition-all" onClick={() => setLegalModal('finance')}>
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
               <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
               <h4 className="text-white font-medium text-lg mb-1">Insurance Approved</h4>
               <p className="text-white/60 text-sm">We accept 50+ major health plans for easy coverage.</p>
            </div>
         </div>
         <div className="liquid-glass p-8 rounded-3xl flex items-center gap-6 shadow-xl cursor-pointer hover:bg-white/5 transition-all" onClick={() => setLegalModal('finance')}>
             <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Search className="w-7 h-7 text-white" />
             </div>
             <div>
                <h4 className="text-white font-medium text-lg mb-1">Transparent Pricing</h4>
                <p className="text-white/60 text-sm">Clear, upfront bills with immediate EMI / Finance options.</p>
             </div>
          </div>
       </section>

      {/* Testimonials & Review Section - MOVED DOWN */}
      <section id="testimonials" className="w-full max-w-screen-xl mx-auto flex flex-col gap-8 scroll-mt-32">
        <div className="flex flex-col items-center text-center mb-8">
           <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center mb-6">
             <Quote className="w-6 h-6 text-white" />
           </div>
           <h2 className="text-4xl lg:text-5xl font-medium text-white tracking-tight mb-4 text-gradient bg-clip-text">Clinical Success Stories</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {testimonials.map((t, idx) => (
              <div key={idx} className="liquid-glass p-8 rounded-3xl flex flex-col gap-6 shadow-xl hover:-translate-y-2 transition-transform duration-500">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-white fill-white" />)}
                </div>
                <p className="text-white/90 text-lg leading-relaxed tracking-wide font-medium flex-1">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-4 pt-6 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm">{t.name}</span>
                    <span className="text-white/40 text-xs">Verified Patient</span>
                  </div>
                </div>
              </div>
           ))}
        </div>

        <div className="liquid-glass p-10 rounded-[3rem] shadow-xl max-w-3xl mx-auto w-full border border-white/5 overflow-hidden relative">
          {!reviewSubmitted ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-medium text-white">Document Your Experience</h3>
                <p className="text-white/40 text-sm">Help others by verifying your clinical recovery journey.</p>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setReviewForm({...reviewForm, stars: s})} className={`transition-all hover:scale-110 ${reviewForm.stars >= s ? 'text-white' : 'text-white/10'}`}>
                    <Star className={`w-8 h-8 ${reviewForm.stars >= s ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
              <textarea 
                 value={reviewForm.text}
                 onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                 placeholder="Tell us about your structural recovery and clinical experience..." 
                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-white/30 transition-all resize-none h-32 text-sm"
              ></textarea>
              <button 
                onClick={() => {
                  if (!reviewForm.text.trim()) return;
                  setReviewSubmitted(true);
                  setTimeout(() => { setReviewSubmitted(false); setReviewForm({stars: 5, text: ''}); }, 4000);
                }}
                className="self-end liquid-glass-strong px-8 py-4 rounded-xl text-white font-bold hover:scale-105 active:scale-95 transition-all text-sm border border-white/5 shadow-2xl"
              >
                Submit Clinical Review
              </button>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 flex flex-col items-center justify-center py-10 text-center gap-4">
               <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-10 h-10 text-green-400" />
               </div>
               <h3 className="text-2xl font-medium text-white">Review Verified</h3>
               <p className="text-white/40 max-w-xs">Thank you, Rahul. Your structural experience has been logged and will assist other patients.</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full max-w-screen-md mx-auto scroll-mt-32">
         <div className="flex flex-col items-center text-center mb-8">
           <h2 className="text-3xl lg:text-4xl font-medium text-white tracking-tight mb-4">Patient FAQ</h2>
           <p className="text-white/60">Find quick answers to common structural and administrative questions.</p>
         </div>
         <div className="flex flex-col gap-3">
           {faqs.map((faq, idx) => (
             <div key={idx} className="liquid-glass rounded-2xl overflow-hidden shadow-xl transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
             </div>
           ))}
         </div>
      </section>



      {/* Expansive Footer */}
      <footer className="w-full max-w-screen-xl mx-auto liquid-glass px-8 py-12 rounded-[3rem] mt-auto flex flex-col gap-10 shadow-2xl relative overflow-hidden">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 z-10 border-b border-white/10 pb-10">
            <div className="flex flex-col gap-4 max-w-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-2xl text-white">Pandere Dental</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">Providing high-grade, structurally sound cosmetic and medical dentistry based deeply in Gorai.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm text-white/70">
              <div className="flex flex-col gap-3">
                 <span className="text-white font-semibold mb-1">Clinic</span>
                 <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors text-left">Services</button>
                 <button onClick={() => scrollToSection('testimonials')} className="hover:text-white transition-colors text-left">Reviews</button>
                 <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors text-left">Our Doctor</button>
              </div>
              <div className="flex flex-col gap-3">
                 <span className="text-white font-semibold mb-1">Legal</span>
                 <button onClick={() => setLegalModal('privacy')} className="hover:text-white transition-colors text-left">Privacy Policy</button>
                 <button onClick={() => setLegalModal('terms')} className="hover:text-white transition-colors text-left">Terms of Service</button>
                 <button onClick={() => setLegalModal('finance')} className="hover:text-white transition-colors text-left">Finance Plans</button>
              </div>
              <div className="flex flex-col gap-3">
                 <span className="text-white font-semibold mb-1">Contact</span>
                 <button onClick={() => window.open(`tel:${CLINIC_PHONE}`)} className="hover:text-white transition-colors text-left">+91 99999 99999</button>
                 <span>Gorai, Mumbai</span>
                 <button onClick={() => scrollToSection('booking')} className="text-white font-bold hover:underline text-left">Book Slot</button>
              </div>
            </div>
         </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 z-10">
            <span className="text-white/40 text-xs">© 2026 Pandere Dental Clinic. All Rights strictly reserved.</span>
            
            {/* Social Follow Actions */}
            <div className="flex items-center gap-3">
               {[
                 { label: 'FB', url: 'https://facebook.com/panderestals' },
                 { label: 'TW', url: 'https://twitter.com/panderestals' },
                 { label: 'IG', url: 'https://instagram.com/panderestals' },
                 { label: 'IN', url: 'https://linkedin.com/company/panderedental' }
               ].map(social => (
                 <a 
                   key={social.label} 
                   href={social.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center justify-center text-xs font-bold w-12 h-12 rounded-full liquid-glass hover:bg-white/20 transition-all hover:-translate-y-1 hover:scale-110 text-white border border-white/5 shadow-lg"
                 >
                   {social.label}
                 </a>
               ))}
            </div>
          </div>
      </footer>
      
      {/* AI Chatbot System */}
      <Chatbot />
    </div>
  );
}