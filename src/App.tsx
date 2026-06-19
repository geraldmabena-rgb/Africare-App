import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Sparkles, 
  Terminal, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  ShieldCheck, 
  Info, 
  Activity, 
  PlusSquare,
  Hospital,
  Droplets,
  CalendarDays,
  FileCheck2,
  Mail,
  AlertCircle,
  Stethoscope,
  Globe,
  GraduationCap,
  Download
} from 'lucide-react';
import SymptomChecker from './components/SymptomChecker';
import InfoHub from './components/InfoHub';
import QuickCallButton from './components/QuickCallButton';
import DoctorConsultation from './components/DoctorConsultation';
import AbstractModal from './components/AbstractModal';
import { downloadAbstractPDF } from './utils/downloadPdf';
import { Assessment } from './types';
import { UI_TRANSLATIONS } from './data/translations';

interface ConsoleLog {
  id: string;
  time: string;
  type: 'info' | 'success' | 'error' | 'outgoing' | 'incoming';
  title: string;
  desc: string;
}

export default function App() {
  const [assessmentHistory, setAssessmentHistory] = useState<Assessment[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [sharedAlert, setSharedAlert] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [isAbstractOpen, setIsAbstractOpen] = useState(false);

  const [language, setLanguage] = useState<'en' | 'nde' | 'sho'>(() => {
    return (localStorage.getItem('vanautano_language') as 'en' | 'nde' | 'sho') || 'en';
  });
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(() => {
    return !localStorage.getItem('vanautano_language');
  });
  const [userId] = useState<string>(() => {
    let uid = localStorage.getItem('vanautano_user_id');
    if (!uid) {
      uid = 'usr_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('vanautano_user_id', uid);
    }
    return uid;
  });

  const isNdebele = language === 'nde';
  const isShona = language === 'sho';
  const t = UI_TRANSLATIONS[language];

  // Initialize diagnostic terminal logs
  useEffect(() => {
    pushLog(
      'info',
      'AfriCare Medical Gateway Active',
      'Successfully loaded regional malaria database (SADC cohort 4.14).'
    );
    pushLog(
      'info',
      'Secure Client Trace Verified',
      'SADC regional screening credentials configured: ' + userId
    );
  }, [userId]);

  const pushLog = (
    type: 'info' | 'success' | 'error' | 'outgoing' | 'incoming',
    title: string,
    desc: string
  ) => {
    const timeString = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newLog: ConsoleLog = {
      id: Math.random().toString(36).substring(2, 9),
      time: timeString,
      type,
      title,
      desc
    };
    setLogs(prev => [newLog, ...prev].slice(0, 30));
  };

  const handleAssessmentComplete = (assessment: Assessment) => {
    setAssessmentHistory(prev => [assessment, ...prev]);
    setActiveAssessment(assessment);
    pushLog(
      'success',
      'Severity Index Calculated',
      `Identified ${assessment.severityLevel.toUpperCase()} severity level. Care plan established.`
    );
  };

  const handleShareAssessment = () => {
    if (navigator.clipboard) {
      const locationText = activeAssessment?.userCityOrRegion ? `\n- Geolocation: ${activeAssessment.userCityOrRegion}` : '';
      const durationText = activeAssessment?.symptomDuration ? `\n- Chronological Duration: ${activeAssessment.symptomDuration}` : '';
      const doctorText = activeAssessment?.doctorSignedBy ? `\n- Clinical Sign-off: Certified by Dr. ${activeAssessment.doctorSignedBy} at ${activeAssessment.doctorSignedAt}` : '';
      const doctorNotesText = activeAssessment?.doctorNotes ? `\n- Clinician Review Advise: "${activeAssessment.doctorNotes}"` : '';

      const summaryText = `AfriCare Malaria Assessment Summary:\n- Status Risk: ${
        activeAssessment?.severityLevel.toUpperCase() || 'NOT_COMPLETED'
      }${locationText}${durationText}${doctorText}${doctorNotesText}\n- Critical Warning Signs: ${
        activeAssessment?.matchedCriticalSigns.join(', ') || 'None'
      }\nVerify symptoms immediately. Please carry out a professional rapid diagnostic test. #AfriCare`;
      
      navigator.clipboard.writeText(summaryText);
      setSharedAlert(true);
      pushLog('success', 'Shared Diagnostics Summary', 'Synthesized shareable clinic text to clipboard.');
      setTimeout(() => setSharedAlert(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-950 selection:text-white flex flex-col">
      
      {/* Clinically Polished Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-900 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-5.5 h-5.5 text-white active:scale-95 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-lg tracking-tight text-emerald-950">AfriCare</span>
                <span className="text-[9px] bg-emerald-50 border border-emerald-100/50 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  {t.sadcPortal}
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-medium">{t.digitalGuide}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-5 font-mono text-[10px] text-stone-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{t.regionalCore}</span>
              </div>
              <div className="w-px h-3.5 bg-stone-200"></div>
              <div>{t.assessmentTotal}: {assessmentHistory.length}</div>
            </div>

            {/* Language Switcher Control Widget */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 border border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  localStorage.setItem('vanautano_language', 'en');
                  pushLog('info', 'Language Switched', 'Interface configured to English.');
                }}
                className={`px-2 py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('nde');
                  localStorage.setItem('vanautano_language', 'nde');
                  pushLog('info', 'Ulimi Luguquliwe', 'I-interface ilungiselelwe isiNdebele.');
                }}
                className={`px-2 py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'nde'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                NDE
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('sho');
                  localStorage.setItem('vanautano_language', 'sho');
                  pushLog('info', 'Mutauro wechiShona', 'I-interface ilungiselelwe chiShona.');
                }}
                className={`px-2 py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'sho'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                SHO
              </button>
            </div>

            {activeAssessment?.isCompleted && (
              <button
                onClick={handleShareAssessment}
                className="bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{sharedAlert ? t.copiedSummary : t.exportDiagnosis}</span>
              </button>
            )}

            <button
              id="header-science-fair-abstract-btn"
              onClick={() => {
                setIsAbstractOpen(true);
                pushLog('info', 'Opened Project Abstract', 'Accessing science fair behavioral & translational research abstract.');
              }}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-red-500"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>Science Fair Abstract</span>
            </button>

            <button
              id="header-download-abstract-pdf-btn"
              onClick={() => {
                downloadAbstractPDF();
                pushLog('success', 'Downloaded PDF Abstract', 'Science fair educational abstract downloaded in A4 PDF format.');
              }}
              className="bg-stone-50 hover:bg-stone-100 text-red-705 border-2 border-red-600 text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              title="Download Science Fair Abstract PDF"
            >
              <Download className="w-4 h-4 text-red-650" />
              <span>Download PDF</span>
            </button>

            <button
              id="header-speak-to-doctor-btn"
              onClick={() => setIsConsultOpen(true)}
              className="bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border border-emerald-800"
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t.speakWithDoctor}</span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPONENT COLUMN: Clinical Intake questionnaire - takes 7 parts of bento layout */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-serif text-emerald-950 tracking-tight leading-tight">
              {t.vectorIntakeTitle}
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed max-w-2xl">
              {t.vectorIntakeSubtitle}
            </p>
          </div>

          {/* Core Interactive Screening flow */}
          <SymptomChecker 
            onComplete={handleAssessmentComplete} 
            onLog={pushLog} 
            onReset={() => setActiveAssessment(null)} 
            onSpeakWithDoctor={() => setIsConsultOpen(true)}
            language={language}
            userId={userId}
          />
        </div>

        {/* RIGHT COMPONENT COLUMN: Info Hub, Local Care, Maps Tracker, and Console logs - takes 5 parts */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Metrics stats banner */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-stone-200 p-4 rounded-3xl text-center space-y-0.5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">{t.myRiskScore}</span>
              <p className="text-xl font-bold text-stone-900 font-serif">
                {!activeAssessment ? '--' : activeAssessment.severityLevel === 'critical' ? (isNdebele ? 'Phezulu' : isShona ? 'Kwakanyanya' : 'High') : activeAssessment.severityLevel === 'moderate' ? (isNdebele ? 'Iphakathi' : isShona ? 'Zviri Pakati' : 'Mod') : (isNdebele ? 'Phansi' : isShona ? 'Pasi' : 'Low')}
              </p>
            </div>
            
            <div className="bg-white border border-stone-200 p-4 rounded-3xl text-center space-y-0.5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">{t.dangerSignalsText}</span>
              <p className="text-xl font-bold text-stone-900 font-serif">
                {!activeAssessment ? '--' : activeAssessment.matchedCriticalSigns.length}
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-4 rounded-3xl text-center space-y-0.5">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">{t.vettedClinicsText}</span>
              <p className="text-xl font-bold text-stone-900 font-serif">
                {isNdebele ? 'Ezinhlanu (5)' : isShona ? 'Shanu (5)' : '5 Registered'}
              </p>
            </div>
          </div>

          {/* Prevention and Treatment Information Knowledge Center */}
          <InfoHub language={language} />

          {/* Virtual Tele-Consultation Shortcut Card */}
          <div id="telemedicine-consult-cta-card" className="bg-white border border-stone-200 rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-8 -mt-8 opacity-60"></div>
            
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 shadow-xs" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
                    {isNdebele ? 'Ukubonisana loDokotela' : isShona ? 'Kukurukurirana naChiremba' : 'Tele-Medical Consultation'}
                  </h4>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <p className="text-xs text-stone-500 leading-normal">
                  {isNdebele ? 'Xhumana khona-manje lodokotela labasesemthethweni se-SADC labahloli bomkhuhlane.' : isShona ? 'Taura naChiremba weSADC pamusoro pekurapa Malaria.' : 'Connect instantly with active pediatric practitioners and SADC epidemiologists. Launch real-time messaging, reserve slots, or schedule direct nursing callbacks.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsConsultOpen(true)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-bold rounded-2xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {t.consultDoctorNow}
            </button>
          </div>

          {/* Developer/User Sandbox Real-time Console Logger */}
          <div className="bg-stone-950 text-stone-100 border border-stone-900 rounded-3xl shadow-xl p-5 flex flex-col h-[230px] font-mono select-none">
            <div className="flex items-center justify-between mb-3 border-b border-stone-900 pb-2.5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500 animate-pulse" />
                <h3 className="text-[10px] font-bold tracking-wider text-stone-300 uppercase">Intake Transmission Stream</h3>
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-[9px] text-stone-500 hover:text-stone-300 transition-colors uppercase cursor-pointer"
              >
                Clear buffer
              </button>
            </div>

            <div className="flex-grow overflow-y-auto text-[10px] space-y-2 pr-1 custom-scrollbar">
              {logs.length === 0 ? (
                <p className="text-stone-605 italic text-center pt-8">Awating Diagnostic Traces...</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="flex items-start gap-2.5 leading-normal">
                    <span className="text-stone-600 shrink-0 select-none">[{log.time}]</span>
                    <span className={`shrink-0 font-bold ${
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'incoming' ? 'text-cyan-400' :
                      log.type === 'outgoing' ? 'text-amber-400' : 'text-stone-400'
                    }`}>
                      {log.type === 'error' ? '✖' :
                       log.type === 'success' ? '✔' :
                       log.type === 'incoming' ? '←' :
                       log.type === 'outgoing' ? '→' : 'i'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-white font-bold">{log.title}: </span>
                      <span className="text-stone-400 font-medium break-words">{log.desc}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </main>

      {/* Trustworthy Clinic Partner footer with details */}
      <footer className="border-t border-stone-200 bg-white px-6 py-6 mt-12 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-2 text-stone-500">
            <PlusSquare className="w-4 h-4 text-emerald-800" />
            <span className="font-bold">AFRICARE DIGITAL CLINIC TRUST</span>
            <span>·</span>
            <span>LICENSED IN SOUTHERN AFRICA ZONE</span>
          </div>
          <div className="text-stone-400 text-center md:text-right">
            <span>Integrated with WHO Global Infectious Disease Protocols · {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* Floating Emergency Action Hub */}
      <QuickCallButton isCritical={activeAssessment?.severityLevel === 'critical'} />

      {/* Telehealth Consultation Drawer/Modal */}
      <DoctorConsultation 
        isOpen={isConsultOpen} 
        onClose={() => setIsConsultOpen(false)} 
        severityLevel={activeAssessment?.severityLevel}
        onLog={pushLog}
        language={language}
      />

      {/* Science Fair Exhibit Abstract Modal */}
      <AbstractModal 
        isOpen={isAbstractOpen} 
        onClose={() => setIsAbstractOpen(false)} 
      />

      {/* First-Use Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full space-y-6 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Globe className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-900 font-serif">Choose Language / Khetha uLimi / Sarudzai Mutauro</h3>
              <p className="text-xs text-stone-400">
                Choose your preferred language to proceed with AfriCare.
                <br />
                Khetha ulimi oluthandayo ukuze usebenzise uhlelo lwe-AfriCare.
                <br />
                Sarudzai mutauro wamunoda kuti mushandise AfriCare.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  localStorage.setItem('vanautano_language', 'en');
                  setShowLanguageModal(false);
                  pushLog('success', 'Language Preset Saved', 'Preferred language set to English.');
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-emerald-950 text-white border-emerald-950 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700 font-semibold'
                }`}
              >
                <span className="block text-xs font-bold">English</span>
                <span className="text-[9px] opacity-80 block mt-0.5 leading-tight">SADC Std</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLanguage('nde');
                  localStorage.setItem('vanautano_language', 'nde');
                  setShowLanguageModal(false);
                  pushLog('success', 'Indlela Yolimi Igcinwe', 'Ulimi lwe-AfriCare luhlelwe kwisiNdebele.');
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  language === 'nde'
                    ? 'bg-emerald-950 text-white border-emerald-950 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700 font-semibold'
                }`}
              >
                <span className="block text-xs font-bold">isiNdebele</span>
                <span className="text-[9px] opacity-80 block mt-0.5 leading-tight">Matabele</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLanguage('sho');
                  localStorage.setItem('vanautano_language', 'sho');
                  setShowLanguageModal(false);
                  pushLog('success', 'Mutauro Wakachengetwa', 'Mutauro wechiShona wakasarudzwa.');
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  language === 'sho'
                    ? 'bg-emerald-950 text-white border-emerald-950 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700 font-semibold'
                }`}
              >
                <span className="block text-xs font-bold">chiShona</span>
                <span className="text-[9px] opacity-80 block mt-0.5 leading-tight">Mashona</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
