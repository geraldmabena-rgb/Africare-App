import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Calendar, 
  Video, 
  PhoneCall, 
  Check, 
  Send, 
  User, 
  UserCheck, 
  Clock, 
  Sparkles, 
  X, 
  ChevronRight, 
  AlertCircle, 
  Stethoscope, 
  Languages, 
  Activity, 
  ShieldCheck,
  Hospital,
  AlertTriangle,
  HeartPulse,
  Pill,
  MapPin,
  Truck,
  FileText
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  languages: string[];
  avatarColor: string;
  status: 'online' | 'briefly_away' | 'busy';
  bio: string;
}

interface Pharmacy {
  id: string;
  name: string;
  location: string;
  distance: string;
  phone: string;
  actStock: 'high' | 'medium' | 'critical_low';
  stockCount: number;
  leadPharmacist: string;
  hours: string;
}

interface TriPartyMessage {
  id: string;
  sender: 'user' | 'doctor' | 'pharmacist' | 'system';
  senderName: string;
  avatarColor: string;
  text: string;
  time: string;
}

const PHARMACY_NETWORK: Pharmacy[] = [
  {
    id: 'pharm-chitungwiza',
    name: 'Chitungwiza Community Dispensary & Care',
    location: 'Chitungwiza, Harare Province',
    distance: '0.4 km away',
    phone: '+263 77 412 8593',
    actStock: 'high',
    stockCount: 142,
    leadPharmacist: 'Gerald Sibanda, R.Ph.',
    hours: '24/7 Dispatch Unit'
  },
  {
    id: 'pharm-zambezi',
    name: 'Zambezi Corridor Rapid Apothecary',
    location: 'Victoria Falls Rural Outpost',
    distance: '2.1 km away',
    phone: '+263 71 839 2041',
    actStock: 'medium',
    stockCount: 58,
    leadPharmacist: 'Dr. Audrey Chimwanda, Pharm.D.',
    hours: '07:30 - 20:00 Daily'
  },
  {
    id: 'pharm-matabeleland',
    name: 'Matebeleland Frontier Drug Depot',
    location: 'Lupane Center Clinic Hub',
    distance: '1.5 km away',
    phone: '+263 73 955 1284',
    actStock: 'high',
    stockCount: 95,
    leadPharmacist: 'Thabo Khumalo, M.Pharm.',
    hours: '08:00 - 18:00 (Mon-Sat)'
  },
  {
    id: 'pharm-mutare',
    name: 'Manicaland Highlands Border Pharmacy',
    location: 'Mutare Central Sector',
    distance: '3.8 km away',
    phone: '+263 20 64829',
    actStock: 'critical_low',
    stockCount: 12,
    leadPharmacist: 'Memory Mutambara, B.Pharm.',
    hours: '08:00 - 17:00 Daily'
  }
];

const DEFAULT_TRI_PARTY_CHATS: Record<string, TriPartyMessage[]> = {
  'pharm-chitungwiza': [
    {
      id: 'tp-1',
      sender: 'doctor',
      senderName: 'Dr. Chipo Moyo',
      avatarColor: 'bg-emerald-600',
      text: 'Hello. I have pre-approved the SADC pediatric treatment pathway for the parent. Please prepare pediatric-dispersible ACT (Artemether/lumefantrine 20/120mg).',
      time: '15:15'
    },
    {
      id: 'tp-2',
      sender: 'pharmacist',
      senderName: 'Gerald Sibanda, R.Ph.',
      avatarColor: 'bg-rose-600',
      text: 'Greetings. Chitungwiza Dispensary has confirmed Dr. Moyo\'s digital protocol. We have full stock of Coartem pediatric dispersible tablets. System is ready to dispense once parent authorizes electronic dispatch.',
      time: '15:20'
    }
  ],
  'pharm-zambezi': [
    {
      id: 'tp-1',
      sender: 'doctor',
      senderName: 'Dr. Tinashe Gumbo',
      avatarColor: 'bg-cyan-600',
      text: 'Clinician clearance submitted for the infant screen. Preparing standard first-line ACT course.',
      time: '15:10'
    },
    {
      id: 'tp-2',
      sender: 'pharmacist',
      senderName: 'Dr. Audrey Chimwanda, Pharm.D.',
      avatarColor: 'bg-indigo-600',
      text: 'Victoria Falls outpost has verified. High-efficacy RDT is certified, and our microscope confirmed Plasmodium falciparum density. Standard pediatric therapeutic series available.',
      time: '15:14'
    }
  ],
  'pharm-matabeleland': [
    {
      id: 'tp-1',
      sender: 'doctor',
      senderName: 'Dr. Nyasha Ndlovu',
      avatarColor: 'bg-amber-600',
      text: 'Community health verification complete. Mother/Father has provided symptom history. Requesting ACT allocation.',
      time: '15:02'
    },
    {
      id: 'tp-2',
      sender: 'pharmacist',
      senderName: 'Thabo Khumalo, M.Pharm.',
      avatarColor: 'bg-amber-800',
      text: 'Lupane Drug Depot has allocated packet number 48-A. Please direct parent to complete electronic Rx validation so we can stamp the digital seal.',
      time: '15:05'
    }
  ],
  'pharm-mutare': [
    {
      id: 'tp-1',
      sender: 'doctor',
      senderName: 'Dr. Chipo Moyo',
      avatarColor: 'bg-emerald-600',
      text: 'Electronic health protocol submitted to Mutare frontier unit. Please confirm stocking levels.',
      time: '14:55'
    },
    {
      id: 'tp-2',
      sender: 'pharmacist',
      senderName: 'Memory Mutambara, B.Pharm.',
      avatarColor: 'bg-sky-600',
      text: 'Manicaland Border Pharmacy is online. Stock is currently critically low (12 packs remaining) but we have locked one pediatric-dose pack specifically for this digital screening instance.',
      time: '14:59'
    }
  ]
};

const T_PHARMACY = {
  en: {
    tabTitle: 'Pharmacy & Rx Co-op',
    subheading: 'Secure multi-network link between Doctor, Pharmacist, and Parent for instant pediatric dispensing.',
    sectionTitle: 'Malaria Pharmacy & Rx Dispatch Network',
    vettedApothecaries: 'AfriCare Registered SADC Pharmacies',
    stockLevel: 'ACT Stock Level',
    distance: 'Distance',
    leadPharmacist: 'Lead Pharmacist',
    hours: 'Hours',
    dispatchBtn: 'Dispatch Certified Screening & Rx Form',
    dispatchSuccess: 'Prescription Dispatched Successfully!',
    dispatchStatusLabel: 'Dispensary Lock Status',
    runnerBtn: 'Request Neighborhood Delivery Runner',
    runnerStatusLabel: 'Runner Delivery Status',
    tripartyHeader: 'Parent-Doctor-Pharmacist Secured Channel',
    quickQHeader: 'Ask Pharmacist a Dosage Question:',
    pharmacistTyping: 'Pharmacist is checking stock ratio...',
    customPlaceholder: 'Send a secure message to Doctor & Pharmacist...',
    transmit: 'Transmit',
    notCertifiedNote: 'Notice: If your screening is not yet signed off, dispatch remains active under a provisional telemedicine cover note.',
    certifiedLabel: 'Clinician Certified: Dr.',
    provisionalLabel: 'Provisional Telemedicine Cover Note',
    highStock: 'Abundant (ACTs)',
    medStock: 'Stable (ACTs)',
    lowStock: 'Critically Low',
    inStockCount: 'packs in cache',
    runnerStatusIdle: 'On standby at dispensary depot',
    runnerStatusEnroute: 'Courier dispatched - leaving dispensary',
    runnerStatusTransit: 'Transit corridor active - neighborhood courier near',
    runnerStatusDelivered: 'Delivered - Sealed ACT package with patient'
  },
  nde: {
    tabTitle: 'Isikhungo Somuthi le-Rx',
    subheading: 'Isixhumanisi esivikelekileyo phakathi koDokotela, uSolwazi womuthi (Pharmacist), loMzali ngokuthunyelwa kwemithi yomntwana.',
    sectionTitle: 'Ukuhbeba kweMalaria loMshini wokuhambisa i-Rx',
    vettedApothecaries: 'AmaKhemisi aBhalisiweyo eZimba se-SADC',
    stockLevel: 'Isidodlo se-ACT',
    distance: 'Umdlandla',
    leadPharmacist: 'USolwazi woMuthi weKhemisi',
    hours: 'Ama-Hora',
    dispatchBtn: 'Thumela caniswane le-fomu yesiqiniseko somuthi',
    dispatchSuccess: 'Isiqiniseko somuthi sithunyelwe ngokupheleleyo!',
    dispatchStatusLabel: 'Isimo sokugcina sekhemisi',
    runnerBtn: 'Cela represents ongezisela endlini',
    runnerStatusLabel: 'Isimo sizokulethwa (Runner)',
    tripartyHeader: 'Umgudu Ovikelekileyo: Umzali - uDokotela - uSolwazi woMuthi',
    quickQHeader: 'Buza Ombuzi Mayelana loMthamo womuthi (Dosage):',
    pharmacistTyping: 'Usonkhemisi uhlola umthamo...',
    customPlaceholder: 'Thumela umbiko ovikelekileyo kuDokotela loSokhemisi...',
    transmit: 'Thumela',
    notCertifiedNote: 'Inothi: Kungekazwakali ukuthi umuthi ugunyaziwe, usebenzisa uhlobo lwempumputhe lwethekhnoloji.',
    certifiedLabel: 'Kuvunyelwe nguDokotela: Dr.',
    provisionalLabel: 'Inothi lesikhashana lokwelapha',
    highStock: 'Igwele (ACTs)',
    medStock: 'Zikhona ngokulingene (ACTs)',
    lowStock: 'Ziyashodya kakhulu',
    inStockCount: 'iziphakethe',
    runnerStatusIdle: 'Umlindeli usesikhungweni',
    runnerStatusEnroute: 'Umesitshina uphumile - usuka ekhemisi',
    runnerStatusTransit: 'Uselendleleni - isithunywa sedolobho siseduze',
    runnerStatusDelivered: 'Kulethwe - Iphakethe elivaliweyo likamile'
  },
  sho: {
    tabTitle: 'Kiriniki neRembe rweRx',
    subheading: 'Kubatana kwekukurumidza pakati paChiremba, mupi wemishonga (Pharmacist) nemubereki pamusoro pekurapa Malaria.',
    sectionTitle: 'Dura reMishonga nekuendeswa kweRx yeMalaria',
    vettedApothecaries: 'Marembe eMishonga akanyoreswa neSADC',
    stockLevel: 'Huwandu hweACT mudura',
    distance: 'Ndarama/Chinhambwe',
    leadPharmacist: 'Mudzori weMishonga',
    hours: 'Nguva dzekuVhura',
    dispatchBtn: 'Tumira Mapepa eVheneko rweMalaria kune caniswane',
    dispatchSuccess: 'Pepa reRx chatumirwa zvakabudirira!',
    dispatchStatusLabel: 'Kugadzirira kweVashandi veMishonga',
    runnerBtn: 'Kumbira Mutakuri wemushonga pamba (Runner)',
    runnerStatusLabel: 'Rwendo rweMubatsiri weMishonga',
    tripartyHeader: 'Nhaurirano Yakachengetedzeka: Mubereki - Chiremba - Mudzori wemushonga',
    quickQHeader: 'Bvunzai mubvunzo pamusoro peMishonga (Dosage):',
    pharmacistTyping: 'Mupi wemishonga ari kuongorora zera revana...',
    customPlaceholder: 'Nyora shoko kuna Chiremba nemumiriri wemishonga...',
    transmit: 'Tumirai',
    notCertifiedNote: 'Yambiro: Kana chimiro chisina kusimbiswa naChiremba, unozozvitora semumiriri wechiremba kwekanguva.',
    certifiedLabel: 'Chiratidzo cheChiremba: Dr.',
    provisionalLabel: 'Gwaro rinozadzisa reChiremba',
    highStock: 'Yakawanda (ACTs)',
    medStock: 'Inokwana mudura (ACTs)',
    lowStock: 'Yadzikira zvishoma',
    inStockCount: 'mapakeji arimo',
    runnerStatusIdle: 'Mubatsiri akamirira pakiriniki',
    runnerStatusEnroute: 'Mutakuri asimuka - kubva parembe',
    runnerStatusTransit: 'Ari munzira - aswedera pedyo nemusha',
    runnerStatusDelivered: 'Zvasvitswa - Pasuru yeACT yakavharwa yasvika parembe'
  }
};

const CLINICAL_ROSTER: Doctor[] = [
  {
    id: 'doc-chipo',
    name: 'Dr. Chipo Moyo',
    title: 'Senior Epidemiologist & Pediatric Lead',
    specialty: 'Pediatric Infectious Diseases & Cerebral Malaria specialist',
    languages: ['Shona', 'English'],
    avatarColor: 'bg-emerald-600',
    status: 'online',
    bio: '14 years managing municipal pediatric epidemic control in Harare Province. Dedicated to clean vector interventions.'
  },
  {
    id: 'doc-tinashe',
    name: 'Dr. Tinashe Gumbo',
    title: 'SADC Malaria Taskforce Researcher',
    specialty: 'Artemisinin-Resistance & Diagnostic Microscopy specialist',
    languages: ['Ndebele', 'English', 'Shona'],
    avatarColor: 'bg-cyan-600',
    status: 'online',
    bio: 'Coordinating regional diagnostic testing audits across Matebeleland North & Zambezi corridors.'
  },
  {
    id: 'doc-nyasha',
    name: 'Dr. Nyasha Ndlovu',
    title: 'Family Medicine Consultant',
    specialty: 'Community preventative care & maternal malaria protection',
    languages: ['English', 'Ndebele'],
    avatarColor: 'bg-amber-600',
    status: 'briefly_away',
    bio: 'Passionate about distributing LLIN bed nets to vulnerable compound families throughout rural clinics.'
  }
];

interface Message {
  id: string;
  sender: 'user' | 'doctor';
  text: string;
  time: string;
}

interface DoctorConsultationProps {
  isOpen: boolean;
  onClose: () => void;
  severityLevel?: 'low' | 'moderate' | 'critical' | null;
  onLog: (type: 'info' | 'success' | 'error' | 'outgoing' | 'incoming', title: string, desc: string) => void;
  language?: 'en' | 'nde' | 'sho';
}

export default function DoctorConsultation({ isOpen, onClose, severityLevel, onLog, language = 'en' }: DoctorConsultationProps) {
  const [activeTab, setActiveTab] = useState<'roster' | 'chat' | 'schedule' | 'callback' | 'pharmacy'>('roster');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(CLINICAL_ROSTER[0]);
  
  // Chat state
  const [currentMessage, setCurrentMessage] = useState('');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({
    'doc-chipo': [
      { id: '1', sender: 'doctor', text: 'Hello, I am Dr. Chipo Moyo. If you have completed the symptom screening, I can review the parameters immediately. How can I assist you today?', time: '15:10' }
    ],
    'doc-tinashe': [
      { id: '1', sender: 'doctor', text: 'Dr. Gumbo here. For rapid diagnostics or microscopy advice, please state your current location coordinates or district health clinic proximity.', time: '15:08' }
    ],
    'doc-nyasha': [
      { id: '1', sender: 'doctor', text: 'Welcome to AfriCare tele-consultations. Maternal protection program updates are available. Is the patient currently pregnant or under age 5?', time: '15:05' }
    ]
  });
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Booking states
  const [bookingDate, setBookingDate] = useState('2026-06-18');
  const [bookingTime, setBookingTime] = useState('09:00');
  const [bookingType, setBookingType] = useState<'video' | 'audio'>('video');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Callback States
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  // Pharmacy state fields and tripartite chat configurations
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy>(PHARMACY_NETWORK[0]);
  const [rxDispatchState, setRxDispatchState] = useState<'idle' | 'transmitting' | 'completed'>('idle');
  const [rxProgressLog, setRxProgressLog] = useState<string>('');
  const [runnerState, setRunnerState] = useState<'idle' | 'enroute' | 'transit' | 'delivered'>('idle');
  const [triPartyChats, setTriPartyChats] = useState<Record<string, TriPartyMessage[]>>(DEFAULT_TRI_PARTY_CHATS);
  const [triPartyInput, setTriPartyInput] = useState('');
  const [isPharmacistTyping, setIsPharmacistTyping] = useState(false);
  const triPartyEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendTriPartyMessage = (text: string) => {
    if (!text.trim()) return;
    
    const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const userMsg: TriPartyMessage = {
      id: `tp-user-${Math.random().toString(36).substring(7)}`,
      sender: 'user',
      senderName: language === 'nde' ? 'Mzali (Wena)' : language === 'sho' ? 'Mubereki (Imi)' : 'Parent (You)',
      avatarColor: 'bg-stone-900',
      text: text,
      time: timeString
    };

    // Append user message
    setTriPartyChats(prev => {
      const currentList = prev[selectedPharmacy.id] || [];
      return {
        ...prev,
        [selectedPharmacy.id]: [...currentList, userMsg]
      };
    });

    setTriPartyInput('');
    setIsPharmacistTyping(true);
    onLog('outgoing', 'Tri-Party Message Transmitted', `Relaying parent feedback to ${selectedPharmacy.name} node.`);

    // Delay 1: Pharmacist response
    setTimeout(() => {
      let pharmacistText = "";
      let doctorText = "";

      const lowerText = text.toLowerCase();
      if (lowerText.includes('dosage') || lowerText.includes('mthamo') || lowerText.includes('kurapa') || lowerText.includes('how should') || lowerText.includes('many times') || lowerText.includes('dose') || lowerText.includes('limit')) {
        pharmacistText = `${selectedPharmacy.leadPharmacist}: For this pediatric suspension or dispersible ACT packet, the schedule is strict. Give exactly 1 tablet crushed or dissolved in water, twice daily (morning & night) for a total of 3 days. Complete all 6 tablets, even if the fever clears tomorrow.`;
        doctorText = `Dr. Chipo Moyo: Adhering to the entire 6-dose protocol is vital. Spacing doses exactly 12 hours apart keeps medication levels optimal inside the red blood cells, ensuring the asexual parasites are wholly eradicated.`;
      } else if (lowerText.includes('water') || lowerText.includes('dissolve') || lowerText.includes('spoon') || lowerText.includes('liquid') || lowerText.includes('kunwa')) {
        pharmacistText = `${selectedPharmacy.leadPharmacist}: Dispersible Coartem tablets dissolve smoothly in 1-2 teaspoons of clean water. Gently mix until liquefied before feeding it to the child. It has a mild cherry taste so the child will swallow it easily.`;
        doctorText = `Dr. Nyasha Ndlovu: You can also offer high-fat milk or breastfeed or give some porridge immediately after. Fatty substances significantly boost the absorption of Lumefantrine, expanding the treatment's blood clearance.`;
      } else if (lowerText.includes('vomit') || lowerText.includes('spit up') || lowerText.includes('hlanza') || lowerText.includes('kurutsa')) {
        pharmacistText = `${selectedPharmacy.leadPharmacist}: If the child vomits within 30 minutes of taking an ACT dose, you MUST repeat the entire dose immediately. Since vomiting is common, keeping a spare tablet is recommended.`;
        doctorText = `Dr. Tinashe Gumbo: Exactly. Persistent vomiting is a warning sign of severe malaria. Keep a close watch on the infant's hydration levels. If they cannot retain any oral treatment, bring them to the clinic for IV Artesunate.`;
      } else {
        pharmacistText = `${selectedPharmacy.leadPharmacist}: Received. We are checking the exact dispensation log under AfriCare certification codes. Let us know when you are heading here or if you need the courier runner.`;
        doctorText = `Dr. Chipo Moyo: Understood. Let us know immediately if you observe cold extremities, difficulty in breathing, or extreme sleepiness. Ensure baby stays hydrated.`;
      }

      const pharmMsg: TriPartyMessage = {
        id: `tp-ph-${Math.random().toString(36).substring(7)}`,
        sender: 'pharmacist',
        senderName: selectedPharmacy.leadPharmacist,
        avatarColor: 'bg-rose-600',
        text: pharmacistText,
        time: timeString
      };

      setTriPartyChats(prev => {
        const currentList = prev[selectedPharmacy.id] || [];
        return {
          ...prev,
          [selectedPharmacy.id]: [...currentList, pharmMsg]
        };
      });

      setIsPharmacistTyping(false);
      onLog('incoming', 'Pharmacist Feedback Logged', `${selectedPharmacy.leadPharmacist} replied on secured Rx line.`);

      // Delay 2: Doctor chimes in to confirm or advise
      setTimeout(() => {
        const docMsg: TriPartyMessage = {
          id: `tp-doc-${Math.random().toString(36).substring(7)}`,
          sender: 'doctor',
          senderName: selectedDoctor ? selectedDoctor.name : 'Dr. Chipo Moyo',
          avatarColor: selectedDoctor ? selectedDoctor.avatarColor : 'bg-emerald-600',
          text: doctorText,
          time: timeString
        };

        setTriPartyChats(prev => {
          const currentList = prev[selectedPharmacy.id] || [];
          return {
            ...prev,
            [selectedPharmacy.id]: [...currentList, docMsg]
          };
        });

        onLog('incoming', 'Doctor Advice Logged', `SADC clinician corroborated on tri-party channel.`);
      }, 1500);

    }, 1500);
  };

  const handleDispatchPrescription = () => {
    setRxDispatchState('transmitting');
    setRxProgressLog(language === 'nde' ? 'Ithumela imininingwane yekhemisi...' : language === 'sho' ? 'Kutumira ruzivo rwekuvhenekwa kune vanhu vemishonga...' : 'Transmitting screening credentials to secure pharmacy network...');
    onLog('outgoing', 'Rx Packet Dispatched', `Broadcasting clinical state payload to ${selectedPharmacy.name} encryption gateway.`);

    setTimeout(() => {
      setRxProgressLog(language === 'nde' ? 'Igunyaza isignesha kaDokotela weSADC...' : language === 'sho' ? 'Kuvheneka siginecha yaChiremba weSADC...' : 'Verifying and authenticating SADC licensed clinician authority digital key...');
      
      setTimeout(() => {
        setRxDispatchState('completed');
        onLog('success', 'Rx Received by Pharmacy', `${selectedPharmacy.name} has validated clinician sign-off codes and locked 1 package.`);
        
        // Push a dispatch confirmation message inside the tri-party chat history dynamically!
        const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const systemMsg: TriPartyMessage = {
          id: `tp-sys-${Math.random().toString(36).substring(7)}`,
          sender: 'system',
          senderName: 'SYSTEM / DISPENSARY AUTOMATION',
          avatarColor: 'bg-emerald-950',
          text: language === 'nde' ? `✓ ISIQUINISEKO SESILUNGISELWE: I-Prescription yamukelwe ikhemisi ${selectedPharmacy.name} phansi kwesiqinisekiso se-AfriCare.` : language === 'sho' ? `✓ MUSHONGA WAGADZIRIRWA: Pepa reRx raverengwa richiratidza kugadzirira kwemushonga mu${selectedPharmacy.name} zvichienderana neAfriCare.` : `✓ DISPENSATION LOCKED & READY: Prescription successfully matched and locked at ${selectedPharmacy.name} pickup counter. Reference code: VU-${selectedPharmacy.id.slice(-4).toUpperCase()}`,
          time: timeString
        };
        
        setTriPartyChats(prev => {
          const currentList = prev[selectedPharmacy.id] || [];
          return {
            ...prev,
            [selectedPharmacy.id]: [...currentList, systemMsg]
          };
        });
      }, 1500);
      
    }, 1500);
  };

  const handleRequestRunner = () => {
    setRunnerState('enroute');
    onLog('outgoing', 'Runner Courier Bound', `Dispatch order created for community health worker courier at ${selectedPharmacy.name}.`);

    setTimeout(() => {
      setRunnerState('transit');
      onLog('info', 'Runner Courier in Transit', 'Neighborhood runner is active on community cycle routes. High-priority ACT kit aboard.');

      setTimeout(() => {
        setRunnerState('delivered');
        onLog('success', 'ACT package Delivered', 'Verified neighborhood delivery completed. Dispersible ACT tablets hand-delivered to mother.');
        
        // Push delivery success message inside the tri-party chat dynamically!
        const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const runnerMsg: TriPartyMessage = {
          id: `tp-run-${Math.random().toString(36).substring(7)}`,
          sender: 'pharmacist',
          senderName: 'AfriCare Neighborhood Runner',
          avatarColor: 'bg-amber-600',
          text: language === 'nde' ? 'Iphakethe lakho lomuthi we-Malaria lilethwe emnyango wendlu yakho. Ngicela ugcine umntwana egula kakhulu emuthini futhi aselapheke.' : language === 'sho' ? 'Pasuru yenyu yeMalaria ACT yasvika pamba penyu muHarare. Tapota tangai kunwisa mwana mushonga zvakarongeka kuitira kukurira chirwere.' : '✓ DELIVERY COMPLETED: Sealed pediatric ACT blister-pack package hand-delivered directly to the caregiver. May the child make a swift, full recovery.',
          time: timeString
        };

        setTriPartyChats(prev => {
          const currentList = prev[selectedPharmacy.id] || [];
          return {
            ...prev,
            [selectedPharmacy.id]: [...currentList, runnerMsg]
          };
        });
      }, 3000);

    }, 2005);
  };

  useEffect(() => {
    if (triPartyEndRef.current) {
      triPartyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [triPartyChats, isPharmacistTyping, activeTab]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesMap, isTyping]);

  useEffect(() => {
    // If patient completed a diagnostic assessment, log it to Doctor's system context
    if (isOpen) {
      onLog('incoming', 'Telemedicine Portal Engaged', 'Initializing real-time digital consult sockets with Harare central response node.');
    }
  }, [isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || !selectedDoctor) return;

    const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const userMsgId = Math.random().toString(36).substring(7);
    const userMsgText = currentMessage;

    const updatedUserMsgs = [
      ...messagesMap[selectedDoctor.id],
      { id: userMsgId, sender: 'user', text: userMsgText, time: timeString }
    ] as Message[];

    setMessagesMap(prev => ({
      ...prev,
      [selectedDoctor.id]: updatedUserMsgs
    }));

    setCurrentMessage('');
    setIsTyping(true);
    onLog('outgoing', 'Telehealth Query Sent', `Transmitting client payload to ${selectedDoctor.name}.`);

    // Simulated medical diagnostic rules engine for responses
    setTimeout(() => {
      const docResponseText = getDiagnosticMedicalAdvice(userMsgText, selectedDoctor.name, severityLevel || 'low');
      const docMsgId = Math.random().toString(36).substring(7);
      
      setMessagesMap(prev => ({
        ...prev,
        [selectedDoctor.id]: [
          ...prev[selectedDoctor.id],
          { id: docMsgId, sender: 'doctor', text: docResponseText, time: timeString }
        ]
      }));

      setIsTyping(false);
      onLog('incoming', 'Response Authenticated', `Medical response signed off by ${selectedDoctor.name}.`);
    }, 1500);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientPhone.trim() || !selectedDoctor) return;

    onLog('outgoing', 'Slot Hold Requested', `Locking date ${bookingDate} at ${bookingTime} for consultation.`);
    
    setTimeout(() => {
      setBookingSuccess(true);
      onLog('success', 'Consultation Booked', `AfriCare medical slot confirmed with ${selectedDoctor.name}. Invitation PIN emailed.`);
    }, 1000);
  };

  const handleRequestCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim()) return;

    onLog('outgoing', 'Urgent Callback Queued', `Priority queue ticket spawned for $+263 contact sequence.`);

    setTimeout(() => {
      setCallbackSuccess(true);
      onLog('success', 'Urgent Callback Armed', 'A dispatcher dispatch protocol has raised this alert to high-priority triage status.');
    }, 1000);
  };

  const resetPanels = () => {
    setBookingSuccess(false);
    setCallbackSuccess(false);
    setPatientPhone('');
    setPatientNotes('');
    setCallbackPhone('');
    setRxDispatchState('idle');
    setRunnerState('idle');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Dimmed backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          id="doctor-consult-main-dialog"
          className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col md:flex-row h-[620px]"
        >
          {/* Side Bar Details: Clinical Guidelines and Direct Status */}
          <div className="w-full md:w-64 bg-stone-50 border-r border-stone-200 p-5 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-900 flex items-center justify-center text-white">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-black text-emerald-950 text-base">Clinician Link</span>
                </div>
                <p className="text-[10px] text-stone-400 font-mono">VANAUTANO TELEHEALTH SADC NET</p>
              </div>

              {/* Patient Profile Context Badge if available */}
              {severityLevel && (
                <div className={`p-3 rounded-2xl border flex items-start gap-2 ${
                  severityLevel === 'critical' ? 'bg-red-50 border-red-200' :
                  severityLevel === 'moderate' ? 'bg-amber-50 border-amber-200' :
                  'bg-emerald-50 border-emerald-200'
                }`}>
                  <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${
                    severityLevel === 'critical' ? 'text-red-700' :
                    severityLevel === 'moderate' ? 'text-amber-700' :
                    'text-emerald-700'
                  }`} />
                  <div className="text-[10px] leading-relaxed">
                    <div className="font-bold text-stone-800 uppercase">Assessment Profile</div>
                    <div className="text-stone-500 font-medium">Active screening: <span className="font-bold">{severityLevel.toUpperCase()} RISK</span> category. Shared automatically with consultant.</div>
                  </div>
                </div>
              )}

              {/* Consultation Navigation buttons */}
              <div className="space-y-1.5 pt-2">
                <button
                  onClick={() => { setActiveTab('roster'); resetPanels(); }}
                  className={`w-full p-2.5 px-3 rounded-xl text-xs font-bold text-left flex items-center gap-2 transition cursor-pointer ${
                    activeTab === 'roster' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200/60'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Choose Clinician</span>
                </button>
                <button
                  onClick={() => { setActiveTab('chat'); resetPanels(); }}
                  className={`w-full p-2.5 px-3 rounded-xl text-xs font-bold text-left flex items-center justify-between transition cursor-pointer ${
                    activeTab === 'chat' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Instant Digital Chat</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </button>
                <button
                  onClick={() => { setActiveTab('schedule'); resetPanels(); }}
                  className={`w-full p-2.5 px-3 rounded-xl text-xs font-bold text-left flex items-center gap-2 transition cursor-pointer ${
                    activeTab === 'schedule' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200/60'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Consultation</span>
                </button>
                <button
                  onClick={() => { setActiveTab('callback'); resetPanels(); }}
                  className={`w-full p-2.5 px-3 rounded-xl text-xs font-bold text-left flex items-center gap-2 transition cursor-pointer ${
                    activeTab === 'callback' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200/60'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Request Urgent Call</span>
                </button>
                <button
                  onClick={() => { setActiveTab('pharmacy'); resetPanels(); }}
                  className={`w-full p-2.5 px-3 rounded-xl text-xs font-bold text-left flex items-center justify-between transition cursor-pointer ${
                    activeTab === 'pharmacy' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2 font-sans">
                    <Pill className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{T_PHARMACY[language].tabTitle}</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0"></span>
                </button>
              </div>
            </div>

            {/* Verification Stamp */}
            <div className="border-t border-stone-200 pt-3 flex items-center gap-1.5 text-[9px] text-stone-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span>SADC Medical Practitioners Act (Cap 27:08) Compliant Link</span>
            </div>
          </div>

          {/* Main Workspace Frame */}
          <div className="flex-1 flex flex-col h-full bg-white relative">
            
            {/* Header control block */}
            <div className="p-4 px-6 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedDoctor && (
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${selectedDoctor.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                      {selectedDoctor.name.split(' ')[1]?.[0] || 'D'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 font-sans">{selectedDoctor.name}</h4>
                      <p className="text-[9px] font-mono text-emerald-800 font-semibold">{selectedDoctor.title}</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                id="close-telehealth-dialog-btn"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-850 flex items-center justify-center transition cursor-pointer"
                title="Exit Consultation Hub"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Dynamic Consultation Area */}
            <div className="flex-grow p-5 md:p-6 overflow-y-auto h-[450px]">
              
              {/* Tab 1: Clinician Roster */}
              {activeTab === 'roster' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-stone-900 font-serif">Select Your Consultation Officer</h5>
                    <p className="text-xs text-stone-500">All registered consultants currently on shift are certified in global clinical protocols regarding rapid malaria intervention.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-1">
                    {CLINICAL_ROSTER.map((doc) => {
                      const isSelected = selectedDoctor?.id === doc.id;
                      return (
                        <div
                          key={doc.id}
                          id={`clinician-roster-item-${doc.id}`}
                          onClick={() => {
                            setSelectedDoctor(doc);
                            onLog('info', 'Doctor Context Changed', `Selected ${doc.name} as primary consult examiner.`);
                          }}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition flex flex-col sm:flex-row justify-between gap-3 ${
                            isSelected 
                              ? 'border-emerald-800 bg-emerald-50/20 shadow-xs' 
                              : 'border-stone-200 hover:border-stone-400 bg-stone-50/30'
                          }`}
                        >
                          <div className="space-y-1.5 min-w-0 flex-grow">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h6 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                                <div className={`w-2.5 h-2.5 rounded-full ${doc.avatarColor}`} />
                                {doc.name}
                              </h6>
                              <span className="text-[9px] uppercase tracking-wider font-mono font-bold bg-white border border-stone-200 text-stone-500 px-1.5 py-0.5 rounded-full">
                                {doc.languages.join(' & ')}
                              </span>
                            </div>
                            <p className="text-[10px] text-stone-400 font-mono font-medium">{doc.specialty}</p>
                            <p className="text-xs text-stone-500 leading-normal">{doc.bio}</p>
                          </div>
                          
                          <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-end shrink-0 gap-1.5">
                            {doc.status === 'online' ? (
                              <span className="text-[8px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full font-sans uppercase animate-pulse">
                                Available Now
                              </span>
                            ) : (
                              <span className="text-[8px] font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full font-sans uppercase">
                                Away Briefly
                              </span>
                            )}
                            <button
                              type="button"
                              className={`text-[10px] font-bold py-1 px-3 rounded-lg transition mt-0.5 ${
                                isSelected ? 'bg-stone-950 text-white' : 'bg-white border border-stone-200 hover:border-stone-400 text-stone-700'
                              }`}
                            >
                              {isSelected ? 'Consulting Active' : 'Select Doctor'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-stone-150 flex justify-end gap-2.5">
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-850 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Start Chat With {selectedDoctor?.name.split(' ')[1]}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Digital Chat */}
              {activeTab === 'chat' && selectedDoctor && (
                <div className="flex flex-col h-[380px] justify-between">
                  {/* Messages container */}
                  <div className="flex-grow overflow-y-auto space-y-3.5 pr-2 custom-scrollbar mb-4 max-h-[300px]">
                    {messagesMap[selectedDoctor.id].map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-[85%] ${
                          m.sender === 'user' ? 'ml-auto items-end animate-fade-in' : 'mr-auto items-start animate-fade-in'
                        }`}
                      >
                        <div className={`p-3 px-4 rounded-3xl text-xs leading-relaxed font-sans ${
                          m.sender === 'user'
                            ? 'bg-stone-900 text-white rounded-br-none'
                            : 'bg-stone-100 text-stone-800 rounded-bl-none border border-stone-200/60'
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[9px] text-stone-400 font-mono mt-1 px-1">{m.time}</span>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex space-x-1.5 items-center p-3 bg-stone-100 rounded-2xl w-16 mr-auto border border-stone-200/50">
                        <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce delay-200"></span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Suggestion prompt chips helper */}
                  <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1.5 select-none no-scrollbar">
                    {getSuggestionChips(severityLevel || 'low', selectedDoctor.id).map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setCurrentMessage(chip)}
                        className="text-[10px] whitespace-nowrap bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold border border-stone-200 py-1 px-2.5 rounded-xl transition cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Chat Input form */}
                  <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-stone-150 pt-3">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder={`Type symptoms or ask ${selectedDoctor.name}...`}
                      className="flex-1 p-2.5 px-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs focus:outline-none focus:border-stone-400 focus:bg-white transition"
                    />
                    <button
                      type="submit"
                      disabled={!currentMessage.trim()}
                      className="p-2.5 px-4 bg-emerald-900 hover:bg-emerald-850 disabled:bg-stone-100 text-white disabled:text-stone-400 rounded-2xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Transmit</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 3: Booking Form */}
              {activeTab === 'schedule' && selectedDoctor && (
                <div className="space-y-4 max-w-xl mx-auto">
                  <div className="space-y-1 text-center sm:text-left">
                    <h5 className="text-sm font-bold text-stone-900 font-serif">Reserve Diagnostic Consultation</h5>
                    <p className="text-xs text-stone-500">The AfriCare regional server reserves exact time Slots matched with the regional Harare medical system gateway cluster.</p>
                  </div>

                  {bookingSuccess ? (
                    <div className="p-5 border border-emerald-100 bg-emerald-50/50 rounded-2xl text-center space-y-3.5 animate-fade-in">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                        <Check className="w-5.5 h-5.5" />
                      </div>
                      <div className="space-y-1">
                        <h6 className="text-xs font-bold text-stone-900 uppercase tracking-wide">Consultation Booked Successfully</h6>
                        <p className="text-xs text-stone-600 leading-normal">
                          Appointment scheduled with <span className="font-semibold">{selectedDoctor.name}</span> on <span className="font-semibold">{bookingDate}</span> at <span className="font-semibold">{bookingTime}</span> via {bookingType.toUpperCase()} LINK.
                        </p>
                      </div>
                      <div className="p-3 bg-white border border-emerald-100 rounded-xl max-w-xs mx-auto text-[10px] font-mono text-emerald-900 leading-snug">
                        Ref Code: <span className="font-bold">AFRICARE-77E2</span><br/>
                        A secure clinic PIN link has been bound to client contact parameters. Keep phone available.
                      </div>
                      <button
                        onClick={() => setBookingSuccess(false)}
                        className="py-1.5 px-4 bg-emerald-900 text-white rounded-xl text-xs font-bold transition cursor-pointer hover:bg-emerald-800"
                      >
                        Book Another Session
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBookAppointment} className="space-y-4 pt-1.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">Date Select</label>
                          <input
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            min="2026-06-17"
                            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-400 focus:bg-white"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">Preferred Time</label>
                          <select
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-400 focus:bg-white font-semibold"
                          >
                            <option value="09:00">09:00 AM</option>
                            <option value="10:30">10:30 AM</option>
                            <option value="11:15">11:15 AM</option>
                            <option value="13:30">01:30 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:15">04:15 PM</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">Consult Mode</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setBookingType('video')}
                              className={`flex-1 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                                bookingType === 'video' ? 'bg-stone-950 text-white border-stone-950' : 'bg-stone-50 border-stone-200 text-stone-600'
                              }`}
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Tele-Video</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setBookingType('audio')}
                              className={`flex-1 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                                bookingType === 'audio' ? 'bg-stone-950 text-white border-stone-950' : 'bg-stone-50 border-stone-200 text-stone-600'
                              }`}
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>Audio Call</span>
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">Mobile Contact Number</label>
                          <input
                            type="tel"
                            placeholder="e.g. +263 77 123 4567"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-400 focus:bg-white font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">Symptoms / Care Context (Optional)</label>
                        <textarea
                          placeholder="Please note down fever spikes, headache cycles, or mosquito nets usage history..."
                          value={patientNotes}
                          onChange={(e) => setPatientNotes(e.target.value)}
                          rows={2}
                          className="w-full p-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-400 focus:bg-white resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-emerald-900 hover:bg-emerald-850 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Confirm AfriCare Consultation Reserve Slot</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Tab 4: Immediate Callback */}
              {activeTab === 'callback' && (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="text-center space-y-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto border border-red-100 animate-pulse">
                      <PhoneCall className="w-5.5 h-5.5" />
                    </div>
                    <h5 className="text-base font-bold text-stone-900 font-serif">Request Urgent Nursing Callback</h5>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      For rapid malaria queries or unstable physical updates outside hospital hours, queue a priority emergency alert protocol below. An active triage nurse will phone you within 15 minutes.
                    </p>
                  </div>

                  {callbackSuccess ? (
                    <div className="p-4 border border-red-100 bg-red-50/50 rounded-2xl text-center space-y-3.5 animate-fade-in">
                      <div className="w-9 h-9 rounded-full bg-red-100 text-red-800 flex items-center justify-center mx-auto">
                        <UserCheck className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <h6 className="text-xs font-bold text-red-900 uppercase font-mono">Priority Queue Secured</h6>
                        <p className="text-xs text-stone-700 leading-normal font-sans">
                          A local medical dispatcher will dial <span className="font-bold underline">{callbackPhone}</span> shortly. Keep your phone line free.
                        </p>
                      </div>
                      <div className="text-[10px] text-red-800 bg-white p-2.5 rounded-xl border border-red-100 font-mono flex items-center gap-1.5 justify-center">
                        <AlertTriangle className="w-3.5 h-3.5 animate-bounce shrink-0 text-red-700" />
                        <span>If you display extreme lethargy, fits, or jaundice, seek nearest hospital!</span>
                      </div>
                      <button
                        onClick={() => { setCallbackSuccess(false); setCallbackPhone(''); }}
                        className="py-1 px-3.5 bg-red-900 hover:bg-red-800 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                      >
                        Submit Different Number
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRequestCallback} className="space-y-3.5 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">Emergency Mobile Hotline Connection</label>
                        <input
                          type="tel"
                          placeholder="e.g. +263 77 123 4567"
                          value={callbackPhone}
                          onChange={(e) => setCallbackPhone(e.target.value)}
                          className="w-full p-2.5 bg-stone-50 border border-stone-250 rounded-xl text-xs font-mono focus:outline-none focus:border-stone-400 focus:bg-white"
                          required
                        />
                      </div>

                      {severityLevel === 'critical' && (
                        <div className="p-3 bg-red-50 border border-red-100 text-[10px] text-red-900 leading-relaxed rounded-xl flex gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">CRITICAL SYSTEM ADVISORY: </span> We detected Critical Warning Signs in your assessment history. Please consider requesting immediate transport to <span className="font-semibold">Chitungwiza District Referral Hospital</span> directly rather than waiting for callbacks!
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 bg-red-650 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border border-red-500"
                      >
                        <PhoneCall className="w-4 h-4 animate-bounce" />
                        <span>Force Dispatch Urgent Call</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Tab 5: Pharmacy Rx & Tri-Party Link */}
              {activeTab === 'pharmacy' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full animate-fade-in text-sans font-sans">
                  
                  {/* Left Column: Pharmacy Selector & Dispatch Action - lg:col-span-5 */}
                  <div className="lg:col-span-5 space-y-4 overflow-y-auto pr-1 max-h-[420px] pb-4 select-none">
                    <div className="space-y-1">
                      <h5 className="text-xs font-mono uppercase tracking-wider text-rose-800 font-bold">
                        {T_PHARMACY[language].sectionTitle}
                      </h5>
                      <p className="text-[10px] text-stone-500">
                        {T_PHARMACY[language].vettedApothecaries}
                      </p>
                    </div>

                    {/* Pharmacy Cards */}
                    <div className="space-y-2.5">
                      {PHARMACY_NETWORK.map((pharm) => {
                        const isSelected = selectedPharmacy.id === pharm.id;
                        return (
                          <div
                            key={pharm.id}
                            onClick={() => {
                              setSelectedPharmacy(pharm);
                              // Reset dispatch/runner when changing pharmacy to allow fresh interaction
                              setRxDispatchState('idle');
                              setRunnerState('idle');
                              onLog('info', 'Partner Pharmacy Selected', `Switched network node to ${pharm.name}.`);
                            }}
                            className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-rose-50/20 border-rose-600 shadow-xs'
                                : 'bg-stone-50/50 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <div>
                                <h6 className="text-[11px] font-bold text-stone-900 leading-snug flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                  {pharm.name}
                                </h6>
                                <p className="text-[9px] text-stone-400 mt-0.5">{pharm.location} &bull; {pharm.distance}</p>
                              </div>
                              <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full shrink-0 ${
                                pharm.actStock === 'high' ? 'bg-emerald-100 text-emerald-800' :
                                pharm.actStock === 'medium' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {pharm.actStock === 'high' ? T_PHARMACY[language].highStock :
                                 pharm.actStock === 'medium' ? T_PHARMACY[language].medStock :
                                 T_PHARMACY[language].lowStock}
                              </span>
                            </div>

                            <div className="mt-2 grid grid-cols-2 gap-1.5 pt-2 border-t border-stone-100 text-[9px] font-mono text-stone-400">
                              <div>{T_PHARMACY[language].leadPharmacist}: <span className="font-sans font-bold text-stone-700 block text-[9px]">{pharm.leadPharmacist}</span></div>
                              <div>{T_PHARMACY[language].hours}: <span className="font-sans font-bold text-stone-700 block text-[9px]">{pharm.hours}</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Prescription Document Cover Slip Case */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider font-mono">
                          {language === 'en' ? 'Screening & Rx Reference' : 'Dokumente we-Rx'}
                        </span>
                        <span className="text-[8px] font-mono bg-stone-250 text-stone-750 px-1.5 py-0.5 rounded">
                          SADC-CODE-A2
                        </span>
                      </div>
                      
                      <div className="p-2.5 bg-white border border-stone-150 rounded-xl flex items-start gap-2">
                        <FileText className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                        <div className="text-[10px] leading-relaxed">
                          {severityLevel ? (
                            <div>
                              <div className="font-bold text-stone-800">
                                {T_PHARMACY[language].certifiedLabel} {selectedDoctor?.name || 'Chipo Moyo'}
                              </div>
                              <div className="text-stone-500 font-mono mt-0.5 text-[9px]">
                                Symptom onset: Moderate/High Risk. Pediatric dispersible ACT recommended.
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-bold text-stone-800">
                                {T_PHARMACY[language].provisionalLabel}
                              </div>
                              <div className="text-stone-500 text-[9px]">
                                {T_PHARMACY[language].notCertifiedNote}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dispatch Electronic Rx Action */}
                      {rxDispatchState === 'idle' && (
                        <button
                          type="button"
                          onClick={handleDispatchPrescription}
                          className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Pill className="w-3.5 h-3.5" />
                          <span>{T_PHARMACY[language].dispatchBtn}</span>
                        </button>
                      )}

                      {rxDispatchState === 'transmitting' && (
                        <div className="p-3 bg-amber-50/50 border border-amber-200 text-amber-900 rounded-xl text-center space-y-2 animate-pulse">
                          <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-[10px] font-mono leading-normal">{rxProgressLog}</p>
                        </div>
                      )}

                      {rxDispatchState === 'completed' && (
                        <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl space-y-1.5 font-sans">
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-850 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </div>
                            <span className="text-[10px] font-bold">{T_PHARMACY[language].dispatchSuccess}</span>
                          </div>
                          <p className="text-[9px] text-stone-500 leading-snug font-mono">
                            Ref: VU-{selectedPharmacy.id.slice(-4).toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}. Dispersible ACT package reserved at pickup counter.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Delivery runner dispatch */}
                    <div className={`p-4 bg-stone-50 rounded-2xl border border-stone-250 ${
                      rxDispatchState !== 'completed' ? 'opacity-50 select-none pointer-events-none' : ''
                    }`}>
                      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                        <h6 className="text-[11px] font-bold text-stone-900 flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{T_PHARMACY[language].runnerStatusLabel}</span>
                        </h6>
                        <span className="text-[9px] font-bold uppercase text-stone-400 font-mono tracking-wider">
                          Runner Hub
                        </span>
                      </div>

                      {runnerState === 'idle' && (
                        <div className="pt-3 space-y-1">
                          <p className="text-[10px] text-stone-500 leading-normal mb-2">
                            {language === 'en' ? 'Have an approved delivery agent carry the ACT kit from the pharmacy counter directly to your compound residence.' : 'Cela ummeleli ekhemisi alethe umuthi endlini yakho.'}
                          </p>
                          <button
                            type="button"
                            onClick={handleRequestRunner}
                            className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs animate-pulse"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>{T_PHARMACY[language].runnerBtn}</span>
                          </button>
                        </div>
                      )}

                      {runnerState !== 'idle' && (
                        <div className="pt-3 space-y-2.5">
                          {/* Progress Line */}
                          <div className="relative pt-1 font-sans">
                            <div className="flex mb-1 items-center justify-between text-[10px] font-mono text-stone-500">
                              <div>Runner: <span className="font-bold text-amber-750">
                                {runnerState === 'enroute' ? T_PHARMACY[language].runnerStatusEnroute :
                                 runnerState === 'transit' ? T_PHARMACY[language].runnerStatusTransit :
                                 T_PHARMACY[language].runnerStatusDelivered}
                              </span></div>
                            </div>
                            <div className="overflow-hidden h-1.5 text-xs flex rounded bg-stone-200">
                              <div
                                style={{
                                  width: runnerState === 'enroute' ? '33%' :
                                         runnerState === 'transit' ? '66%' : '100%'
                                }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-650 transition-all duration-500"
                              />
                            </div>
                          </div>

                          {/* Runner Status Cards */}
                          <div className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center gap-3 font-sans">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                              <Truck className="w-4 h-4 animate-bounce" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-stone-850">
                                {runnerState === 'enroute' && (language === 'en' ? 'Departing Apothecary Depot' : 'Mubatsiri anyorera')}
                                {runnerState === 'transit' && (language === 'en' ? 'Entering Neighborhood Sector' : 'Anosvika pedyo')}
                                {runnerState === 'delivered' && (language === 'en' ? 'Delivered with Patient Caregiver' : 'Mushonga wasvika')}
                              </div>
                              <p className="text-[9px] text-stone-400">
                                {runnerState === 'enroute' ? 'Active runner checking dispatch route.' :
                                 runnerState === 'transit' ? 'Runner on cycle route. Approaching compound address.' :
                                 'Sealed ACT kit received. Check instructions on dosage card.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Tri-Party Secure Chat Log - lg:col-span-7 */}
                  <div className="lg:col-span-7 flex flex-col h-[420px] bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden">
                    {/* Header */}
                    <div className="p-3.5 bg-white border-b border-stone-250 flex items-center justify-between select-none shrink-0 shadow-2xs">
                      <div>
                        <h6 className="text-[11px] font-bold text-stone-900 font-sans tracking-tight leading-none flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse inline-block" />
                          {T_PHARMACY[language].tripartyHeader}
                        </h6>
                        <p className="text-[9px] text-stone-400 font-mono mt-0.5 uppercase">
                          SADC CLINIC LINK: PARENT / DOCTOR / R.PH
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-stone-400 italic bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
                        SECURE AES-256
                      </span>
                    </div>

                    {/* Messages */}
                    <div className="flex-grow p-4 overflow-y-auto space-y-3.5 custom-scrollbar max-h-[300px]">
                      {(triPartyChats[selectedPharmacy.id] || []).map((m) => {
                        const isSystem = m.sender === 'system';
                        const isUser = m.sender === 'user';
                        const isDoctor = m.sender === 'doctor';
                        const isPharm = m.sender === 'pharmacist';

                        if (isSystem) {
                          return (
                            <div key={m.id} className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-[10px] text-emerald-950 leading-relaxed font-sans text-center max-w-md mx-auto my-1">
                              {m.text}
                            </div>
                          );
                        }

                        return (
                          <div
                            key={m.id}
                            className={`flex flex-col max-w-[85%] ${
                              isUser ? 'ml-auto items-end' : 'mr-auto items-start'
                            } animate-fade-in`}
                          >
                            <div className="flex items-baseline gap-1.5 select-none mb-1">
                              <span className={`text-[9px] font-bold ${
                                isDoctor ? 'text-emerald-800' :
                                isPharm ? 'text-rose-800' :
                                'text-stone-700'
                              }`}>
                                {m.senderName}
                              </span>
                              <span className="text-[8px] text-stone-400 uppercase tracking-widest font-mono">
                                {isDoctor ? 'MD/Clinician' : isPharm ? 'Registered Pharmacist' : 'Caregiver'}
                              </span>
                            </div>

                            <div className={`p-3 px-3.5 rounded-2xl text-[11px] leading-relaxed font-sans shadow-2xs ${
                              isUser
                                ? 'bg-stone-900 text-white rounded-tr-none'
                                : isDoctor
                                ? 'bg-emerald-50 border border-emerald-150 text-emerald-950 rounded-tl-none'
                                : 'bg-rose-50/50 border border-rose-150 text-rose-950 rounded-tl-none'
                            }`}>
                              {m.text}
                            </div>
                            <span className="text-[8px] text-stone-400 font-mono mt-0.5 px-1">{m.time}</span>
                          </div>
                        );
                      })}

                      {isPharmacistTyping && (
                        <div className="flex space-x-1.5 items-center p-3.5 bg-stone-100 border border-stone-200 rounded-2xl w-24 mr-auto">
                          <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce delay-100"></span>
                          <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce delay-200"></span>
                          <span className="text-[9px] font-mono text-stone-500 animate-pulse">Checking ...</span>
                        </div>
                      )}
                      
                      <div ref={triPartyEndRef} />
                    </div>

                    {/* Quick Question Prompts */}
                    <div className="px-3.5 pt-1.5 border-t border-stone-200 select-none shrink-0 bg-white">
                      <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        {T_PHARMACY[language].quickQHeader}
                      </p>
                      <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
                        <button
                          type="button"
                          onClick={() => handleSendTriPartyMessage("ACT Dose frequency & complete guidelines?")}
                          className="text-[9px] whitespace-nowrap bg-rose-50 hover:bg-rose-100 border border-rose-150 text-rose-700 font-bold py-1 px-2.5 rounded-xl transition cursor-pointer shrink-0"
                        >
                          {language === 'nde' ? 'Umthamo' : language === 'sho' ? 'Nguva nemishonga' : 'ACT Dosage guidelines'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendTriPartyMessage("How to dissolve and disperse these tablets in water?")}
                          className="text-[9px] whitespace-nowrap bg-rose-50 hover:bg-rose-100 border border-rose-150 text-rose-700 font-bold py-1 px-2.5 rounded-xl transition cursor-pointer shrink-0"
                        >
                          {language === 'nde' ? 'Uncibilikisa njani' : language === 'sho' ? 'Kugadzirira emvura' : 'Crushing/Dissolving technique'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendTriPartyMessage("What if the child vomits or spits up the dose?")}
                          className="text-[9px] whitespace-nowrap bg-rose-50 hover:bg-rose-100 border border-rose-150 text-rose-700 font-bold py-1 px-2.5 rounded-xl transition cursor-pointer shrink-0"
                        >
                          {language === 'nde' ? 'Hlanza muthi' : language === 'sho' ? 'Kana mwana achirutsa' : 'Vomiting & spits advice'}
                        </button>
                      </div>
                    </div>

                    {/* Chat Input form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendTriPartyMessage(triPartyInput);
                      }}
                      className="flex gap-2 border-t border-stone-200 p-2.5 bg-white shrink-0"
                    >
                      <input
                        type="text"
                        value={triPartyInput}
                        onChange={(e) => setTriPartyInput(e.target.value)}
                        placeholder={T_PHARMACY[language].customPlaceholder}
                        className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-400 focus:bg-white font-sans transition"
                      />
                      <button
                        type="submit"
                        disabled={!triPartyInput.trim()}
                        className="p-2 px-3.5 bg-rose-700 hover:bg-rose-800 disabled:bg-stone-100 text-white disabled:text-stone-400 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">{T_PHARMACY[language].transmit}</span>
                      </button>
                    </form>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simulated diagnostic helper mapping custom client text to safe WHO advice
function getDiagnosticMedicalAdvice(msg: string, docName: string, severity: 'low' | 'moderate' | 'critical'): string {
  const query = msg.toLowerCase();

  if (query.includes('fever') || query.includes('temperature') || query.includes('hot')) {
    return `${docName} says: High fever is the classic hallmark of malaria as parasites multiply in red blood cells. Please check if the fever is continuous or cyclically spikes every 48 hours. Regardless, a Rapid Diagnostic Test (RDT) should be completed at our clinic immediately before commencing ACTs.`;
  }
  if (query.includes('child') || query.includes('baby') || query.includes('under 5')) {
    return `${docName} says: Children under 5 are the highest-risk group in SADC communities because they lack partial immunity. Any child presenting with a hot fever and lack of appetite must be tested within 24 hours. Intravenous therapies are mandated if they can not swallow tablets.`;
  }
  if (query.includes('pregnant') || query.includes('pregnancy') || query.includes('mother')) {
    return `${docName} says: Malaria poses massive hazards during pregnancy, causing risk of anemia, premature labor, and infant weight deficits. WHO recommends Intermittent Preventive Treatment in Pregnancy (IPTp) starting from the second trimester. Please book a physical review.`;
  }
  if (query.includes('test') || query.includes('rdt') || query.includes('microscope')) {
    return `${docName} says: Our clinic mandates pre-testing diagnostics. Rapid Diagnostic Tests (RDTs) take only 15 minutes to confirm parasites. Traditional microscopy acts as our gold standard to determine parasite density. Never self-treat blindly.`;
  }
  if (severity === 'critical') {
    return `${docName} says: Having analyzed your screening record, your status is critical. If there is vomiting, mental confusion, or extreme pale skin, do not delay for text chats. Your relatives must contact the emergency transport service immediately for IV Artesunate treatment.`;
  }

  return `${docName} says: Thank you for describing your symptoms. This state can be resolved quickly if treated professionally. Please register for a secure diagnostic test cluster, keep hydrated, and always sleep under an LLIN net.`;
}

// Diagnostic helper chips
function getSuggestionChips(severity: 'low' | 'moderate' | 'critical' | null, docId: string): string[] {
  if (severity === 'critical') {
    return ['What emergency clinic has pediatric ICU?', 'How soon can a callback reach Harare?', 'What should I do while waiting?'];
  }
  if (docId === 'doc-tinashe') {
    return ['How does a rapid diagnostic test work?', 'Is artemisinin resistance high here?', 'Where is the Midlands health lab?'];
  }
  if (docId === 'doc-chipo') {
    return ['Why is fever cycling dangerous?', 'Can children take ACT tablets?', 'Can you review my screen profile?'];
  }
  return ['Are home remedies safe?', 'How to configure an LLIN net?', 'Do I need a blood smear test?'];
}
