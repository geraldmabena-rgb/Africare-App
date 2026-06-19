import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneCall, Phone, AlertTriangle, X, ChevronRight, Siren, Sparkles } from 'lucide-react';

interface QuickCallButtonProps {
  isCritical: boolean;
}

interface EmergencyProvider {
  id: string;
  name: string;
  phone: string;
  label: string;
  desc: string;
  type: string;
}

const EMERGENCY_PROVIDERS: EmergencyProvider[] = [
  {
    id: 'em-prov-vanautano',
    name: 'AfriCare Central Clinic & Lab',
    phone: '+263242701440',
    label: '+263 242 701 440',
    desc: 'Primary SADC emergency malaria testing & ACT response dispatch.',
    type: 'Clinical Hotline'
  },
  {
    id: 'em-prov-mars',
    name: 'Medical Air Rescue Service (MARS)',
    phone: '+263242771221',
    label: '+263 242 771 221',
    desc: 'Air & road emergency medical transport across Zimbabwe.',
    type: 'Emergency Ambulance'
  },
  {
    id: 'em-prov-referral',
    name: 'Chitungwiza District Referral Hospital',
    phone: '+26327021541',
    label: '+263 270 21541',
    desc: 'Severe malaria ICU, pediatric care & intravenous therapy.',
    type: 'District Referrals'
  }
];

export default function QuickCallButton({ isCritical }: QuickCallButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isCritical) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {/* Expanded Emergency Sheet Panel */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            id="emergency-quick-call-card"
            className="w-80 sm:w-96 bg-stone-900 border border-red-900/40 text-stone-100 rounded-3xl p-5 shadow-[0_20px_50px_rgba(239,68,68,0.15)] space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div id="quick-call-siren-indicator" className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 animate-pulse">
                  <Siren className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight font-sans text-red-400 tracking-wider uppercase">Critical Severity Help</h4>
                  <p className="text-[10px] text-stone-400 font-mono">IMMEDIATE HEALTH DESCH DISPATCH</p>
                </div>
              </div>
              <button
                id="close-quick-call-panel-btn"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 flex items-center justify-center transition cursor-pointer"
                title="Dismiss panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Advisory Info */}
            <div className="p-3 bg-red-950/40 border border-red-900/30 rounded-xl space-y-1">
              <div className="flex items-center gap-1 text-red-300 font-bold text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Malaria Severity Advisory Zone</span>
              </div>
              <p className="text-[10px] text-stone-300 leading-normal">
                Your assessment signals critical danger indicators (compromised consciousness, extreme weakness, high persistent fever). Do not wait. Direct clinical diagnostic testing is required immediately.
              </p>
            </div>

            {/* Emergency Hotline Listings */}
            <div className="space-y-2.5">
              {EMERGENCY_PROVIDERS.map((provider) => (
                <a
                  key={provider.id}
                  id={`dial-${provider.id}-link`}
                  href={`tel:${provider.phone}`}
                  className="block p-3 bg-stone-850/60 hover:bg-stone-850 border border-stone-800 hover:border-red-900/20 rounded-2xl group transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded-md font-mono uppercase">
                          {provider.type}
                        </span>
                      </div>
                      <h5 className="text-[11px] font-bold text-white font-sans">{provider.name}</h5>
                      <p className="text-[10px] text-stone-400 leading-snug">{provider.desc}</p>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-red-400/10 text-red-400 flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors duration-200">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-800/40 text-[10px] font-mono text-red-400 font-medium">
                    <span>Call: {provider.label}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>

            {/* Bottom Note */}
            <div className="text-[9px] text-stone-500 font-mono text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-red-500/50" />
              <span>We advise presenting this portal's results to the nurse in charge.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Trigger Button (FAB) */}
      <motion.button
        id="quick-emergency-call-fab"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2.5 px-4.5 py-3.5 bg-red-650 hover:bg-red-600 text-white rounded-full shadow-[0_10px_35px_rgba(239,68,68,0.4)] border border-red-500 font-bold transition-all relative overflow-hidden cursor-pointer"
      >
        {/* Radiant Pulse Rings */}
        <span className="absolute inset-0 bg-red-500/10 animate-ping rounded-full scale-110 pointer-events-none"></span>

        <PhoneCall className="w-4.5 h-4.5 animate-bounce shrink-0" />
        <span className="text-xs uppercase tracking-wider font-mono font-bold">Quick Call</span>

        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-100 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-100"></span>
        </span>
      </motion.button>
    </div>
  );
}
