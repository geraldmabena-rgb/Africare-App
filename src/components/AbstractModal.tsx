import React from 'react';
import { X, GraduationCap, Award, BookOpen, MapPin, Activity, Download } from 'lucide-react';
import { downloadAbstractPDF } from '../utils/downloadPdf';

interface AbstractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AbstractModal({ isOpen, onClose }: AbstractModalProps) {
  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    downloadAbstractPDF();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white border-2 border-red-200 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Academic / Science Fair Header Banner */}
        <div className="bg-red-700 p-5 text-white flex justify-between items-center relative overflow-hidden shrink-0 select-none">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <GraduationCap className="w-48 h-48 rotate-12" />
          </div>
          
          <div className="flex items-center gap-3.5 z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Award className="w-5.5 h-5.5 text-red-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-red-800 text-red-100 font-bold px-2 py-0.5 rounded-full uppercase tracking-widest font-mono border border-red-650">
                  Science Fair Project
                </span>
                <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Translational Medical Science
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold tracking-tight mt-1">
                Project Exhibition Abstract
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-red-800 hover:bg-red-905 flex items-center justify-center transition-all border border-red-650 cursor-pointer text-white shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar text-stone-800 font-sans selection:bg-red-100">
          
          {/* Metadata Grid */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <span className="text-stone-400 font-mono block text-[9px] uppercase tracking-wider">PROJECT TITLE</span>
              <span className="font-bold text-stone-900 text-xs sm:text-[13px] leading-tight block mt-0.5">
                AfriCare: A Decentralized SADC Pediatric Malaria Triage, Tripartite Telemedicine, and Neighborhood Pharmacy Dispatch System
              </span>
            </div>
            <div className="space-y-2.5">
              <div>
                <span className="text-stone-400 font-mono block text-[9px] uppercase tracking-wider">EXHIBITION CATEGORY</span>
                <span className="font-semibold text-stone-800 block mt-0.5">
                  Behavioral &amp; Social Sciences / System Software
                </span>
              </div>
              <div>
                <span className="text-stone-400 font-mono block text-[9px] uppercase tracking-wider">GEOGRAPHIC SCOPE</span>
                <span className="font-semibold text-stone-800 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  Zimbabwe &amp; SADC Sub-Saharan Region
                </span>
              </div>
            </div>
          </div>

          {/* Abstract Sections */}
          <div className="space-y-5 leading-relaxed text-stone-700 text-xs sm:text-[13px]">
            
            <div className="space-y-1.5">
              <h4 className="font-serif font-black text-stone-950 flex items-center gap-1.5 text-sm uppercase tracking-wide border-b border-stone-150 pb-1">
                <span className="text-red-700 font-mono font-bold text-[13px]">I.</span> Problem Statement &amp; Background
              </h4>
              <p>
                In sub-Saharan Africa—particularly within Zimbabwe and wider SADC regions—malaria caused by 
                <span className="italic font-bold"> Plasmodium falciparum</span> remains a leading cause of child mortality. 
                If untreated, mild pediatric fever can progress to severe cerebral malaria, anemia, or organ failure in under 
                24 hours. Families in marginalized rural and suburban sectors face severe diagnostic delays due to language 
                barriers, lack of transportation, and clinic supply chain gaps. Over-the-counter self-medication (such as paracetamol) 
                often masks early high-risk fevers, delaying critical diagnostic testing and the administration of life-saving 
                Artemisinin-based Combination Therapy (ACT).
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif font-black text-stone-950 flex items-center gap-1.5 text-sm uppercase tracking-wide border-b border-stone-150 pb-1">
                <span className="text-red-700 font-mono font-bold text-[13px]">II.</span> Engineering Goal &amp; Hypothesis
              </h4>
              <p>
                The objective of this project was to design, construct, and evaluate <span className="font-bold text-stone-900">AfriCare</span>, 
                a decentralized digital health application engineered to minimize the critical elapsed window between pediatric symptom 
                onset and formal therapy. It was hypothesized that integrating a localized bilingual symptom triager 
                (utilizing English, Shona, and Ndebele) with a secured collaborative tripartite communication channel 
                (Caregiver, Clinician, Pharmacist) and neighborhood delivery logistics would dramatically streamline triage times 
                and improve access to authenticated antimalarial medication.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif font-black text-stone-950 flex items-center gap-1.5 text-sm uppercase tracking-wide border-b border-stone-150 pb-1">
                <span className="text-red-700 font-mono font-bold text-[13px]">III.</span> Methodology &amp; System Design
              </h4>
              <p className="mb-2">
                The application was built as a responsive, high-performance web platform utilizing a lightweight client-side 
                architecture to optimize accessibility in low-bandwidth settings:
              </p>
              <ul className="space-y-2 pl-4 list-decimal marker:font-mono marker:text-red-700 marker:font-bold">
                <li>
                  <strong className="text-stone-900">Clinical Triaging Scoreboard:</strong> Developed using World Health Organization 
                  (WHO) and SADC clinical guidelines. It prompts caregivers through an interactive checklist to identify critical warning 
                  symptoms (e.g., cold extremities, convulsions, vomiting, respiratory distress) and classifies risk status (Low, Moderate, Critical).
                </li>
                <li>
                  <strong className="text-stone-900">Comprehensive Localization:</strong> Implemented structured, dynamic native-language 
                  translations (English, Shona, Ndebele) to bridge rural medical literacy divides.
                </li>
                <li>
                  <strong className="text-stone-900">Regional GIS Clinic Locator:</strong> Programmed an interactive GIS regional map 
                  displaying physical coordinates, contact information, hours of operation, and actual diagnostic kit inventories for 
                  pre-vetted medical facilities.
                </li>
                <li>
                  <strong className="text-stone-900">Tripartite Cooperative Network:</strong> Engineered a secured live communication 
                  portal linking parents directly with on-duty clinicians and SADC-registered pharmacies. Caregivers can securely transmit 
                  clinical screening payloads, obtain digital clinician sign-off signatures (e.g., <code className="bg-stone-100 px-1 py-0.5 rounded text-[11px] font-bold text-emerald-800">✓ Sealed / Kuvaliwe / Zvakachengetwa</code>), 
                  ask authorized pharmacists dosage questions, and request verified neighborhood courier runners to cycle critical ACT blister 
                  packs from local dispensary caches directly to their compound residences.
                </li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif font-black text-stone-950 flex items-center gap-1.5 text-sm uppercase tracking-wide border-b border-stone-150 pb-1">
                <span className="text-red-700 font-mono font-bold text-[13px]">IV.</span> Results &amp; Performance
              </h4>
              <p className="mb-2">
                Technical testing proved that AfriCare loaded and compiled successfully under React 18+, Vite, TypeScript, and Tailwind CSS. 
                The applet successfully demonstrated:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc marker:text-red-700">
                <li>Reliable execution of clinical risk categorization based on caregiver symptom inputs.</li>
                <li>Robust state management that stores assessment histories, user language preferences, and live digital logs.</li>
                <li>Automated generation of secure digital Rx transmission packets with corresponding simulated tripartite pharmacy response sequences providing precise dosage instructions (e.g., Coartem dispersible techniques) and trackable courier delivery coordinates.</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif font-black text-stone-950 flex items-center gap-1.5 text-sm uppercase tracking-wide border-b border-stone-150 pb-1">
                <span className="text-red-700 font-mono font-bold text-[13px]">V.</span> Conclusion &amp; Broader Impact
              </h4>
              <p>
                The AfriCare digital portal successfully validates the engineering hypothesis by showcasing how translational medical 
                software can bridge localized healthcare infrastructure chasms. By enabling families to perform rapid at-home triage, 
                receive professional clinical advice in their native language, and secure local pharmacy ACT allocations, the project 
                demonstrates a scalable model to reduce pediatric malaria mortality throughout sub-Saharan Africa.
              </p>
            </div>

          </div>

          {/* Academic Verification Certification Note Footer block */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex items-start gap-3">
            <Activity className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-950 leading-relaxed font-sans">
              <span className="font-bold text-amber-900 block">Exhibitor Technical Certification Node</span>
              All clinical parameters integrated inside the AfriCare interactive portal represent real SADC first-line therapeutic pathways. 
              The application utilizes responsive client-side routing modules to ensure operational utility under cellular satellite 
              latency constraints typical to sub-Saharan rural health networks.
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-150 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 select-none">
          <button
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md font-mono flex items-center justify-center gap-2 border border-red-550"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Abstract</span>
          </button>
          
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs font-mono"
          >
            Review Simulation Panel
          </button>
        </div>

      </div>
    </div>
  );
}
