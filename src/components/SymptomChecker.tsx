import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCcw, 
  Activity, 
  MapPin, 
  AlertOctagon, 
  AlertTriangle, 
  Smile, 
  ActivitySquare,
  Sparkles, 
  Send,
  HeartPulse, 
  FileCheck,
  CheckCircle2,
  Bookmark,
  CalendarCheck2,
  Stethoscope,
  Star
} from 'lucide-react';
import { MALARIA_QUESTIONS } from '../data/questions';
import { Assessment, Option, Question } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import NearestClinicFinder from './NearestClinicFinder';

interface SymptomCheckerProps {
  onComplete: (assessment: Assessment) => void;
  onLog: (type: 'info' | 'success' | 'error' | 'outgoing' | 'incoming', title: string, desc: string) => void;
  onReset?: () => void;
  onSpeakWithDoctor?: () => void;
  language?: 'en' | 'nde' | 'sho';
  userId?: string;
}

// Regional Malaria Endemicity Registry mapping cities to clinical hazard ratings
const LOCAL_ENDEMICITY_DATA: Record<string, { level: 'Low' | 'Moderate' | 'High'; description: string; color: string; bg: string; border: string }> = {
  'harare': { level: 'Low', description: 'At-altitude zone (>1400m). Vector proliferation is structurally rare. Minimal local outbreaks.', color: 'text-emerald-700 bg-emerald-50 border-emerald-100', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  'bulawayo': { level: 'Low', description: 'Cool plateau climate. Extremely low density of Anopheles mosquitoes. Negligible transmission.', color: 'text-emerald-700 bg-emerald-50 border-emerald-100', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  'gweru': { level: 'Low', description: 'Highveld region with temperate winters. Extremely low seasonal transmission window.', color: 'text-emerald-700 bg-emerald-50 border-emerald-100', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  'mutare': { level: 'Moderate', description: 'Moderate valley risk. Transmission spikes during humid post-rain cycles (March-May).', color: 'text-amber-700 bg-amber-50 border-amber-100', bg: 'bg-amber-50', border: 'border-amber-200' },
  'victoria falls': { level: 'Moderate', description: 'Watercourse risk (Zambezi river basin). Steady annual transmission rates.', color: 'text-amber-700 bg-amber-50 border-amber-100', bg: 'bg-amber-50', border: 'border-amber-200' },
  'masvingo': { level: 'Moderate', description: 'High water volume proximity. Seasonal breeding occurs near lakes & irrigation canals.', color: 'text-amber-700 bg-amber-50 border-amber-100', bg: 'bg-amber-50', border: 'border-amber-200' },
  'kariba': { level: 'High', description: 'Hyperendemic low-altitude basin. Constant high humidity and vector lifecycle.', color: 'text-rose-700 bg-rose-50 border-rose-100', bg: 'bg-rose-50', border: 'border-rose-200' },
  'binga': { level: 'High', description: 'Hyperendemic district bordering Zambezi watercourse. Highly active transmission zone.', color: 'text-rose-700 bg-rose-50 border-rose-100', bg: 'bg-rose-50', border: 'border-rose-200' },
  'chiredzi': { level: 'High', description: 'Sugar agricultural estates with irrigation canals that yield year-round vector pools.', color: 'text-rose-700 bg-rose-50 border-rose-100', bg: 'bg-rose-50', border: 'border-rose-200' },
  'hwange': { level: 'High', description: 'SADC lowveld seasonal corridor. High vectors detected during wet seasons.', color: 'text-rose-700 bg-rose-50 border-rose-100', bg: 'bg-rose-50', border: 'border-rose-200' },
};

const getEndemicity = (city: string) => {
  const norm = city.toLowerCase().trim();
  if (!norm) return { level: 'Moderate (Default)', description: 'Please enter a city or district to load customized local endemicity reports.', color: 'text-stone-600 bg-stone-55 border-stone-100', bg: 'bg-stone-50', border: 'border-stone-200' };
  
  if (LOCAL_ENDEMICITY_DATA[norm]) {
    return LOCAL_ENDEMICITY_DATA[norm];
  }
  
  const matchedKey = Object.keys(LOCAL_ENDEMICITY_DATA).find(k => norm.includes(k) || k.includes(norm));
  if (matchedKey) {
    return LOCAL_ENDEMICITY_DATA[matchedKey];
  }
  
  return { 
    level: 'Moderate Seasonal Risk', 
    description: `Seasonal transmission occurs in warm, humid districts or near catchment marshes in ${city}. Seek clinical confirmation immediately for high-fever cycles.`, 
    color: 'text-amber-700 bg-amber-50 border-amber-100', 
    bg: 'bg-amber-50', 
    border: 'border-amber-200' 
  };
};

export default function SymptomChecker({ onComplete, onLog, onReset, onSpeakWithDoctor, language = 'en', userId }: SymptomCheckerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [severityLevel, setSeverityLevel] = useState<'low' | 'moderate' | 'critical'>('low');
  const [matchedCriticalSigns, setMatchedCriticalSigns] = useState<string[]>([]);
  
  // Feedback states
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string>('');
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackError, setFeedbackError] = useState<string>('');
  
  const isNdebele = language === 'nde';
  const isShona = language === 'sho';
  const t = UI_TRANSLATIONS[language];

  // Capturing symptom duration and onset date
  const [symptomOnsetDays, setSymptomOnsetDays] = useState<string>('3');
  const [symptomOnsetDate, setSymptomOnsetDate] = useState<string>('');

  // Capturing city/region and geographic endemicity
  const [userLocation, setUserLocation] = useState<string>('Harare');

  // Clinician Official Sign-off credentials and notes
  const [licensedDoctorName, setLicensedDoctorName] = useState<string>('');
  const [clinicalSignOffNotes, setClinicalSignOffNotes] = useState<string>('');
  const [isSignOffCertified, setIsSignOffCertified] = useState<boolean>(false);
  const [doctorCertifiedAt, setDoctorCertifiedAt] = useState<string>('');

  // AI Consultation States
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Supportive Care Checklist
  const [carePlanChecked, setCarePlanChecked] = useState<Record<string, boolean>>({
    rehydration: false,
    rest_under_net: false,
    temp_monitoring: false,
    avoid_self_medication: false
  });

  const currentQuestion = currentStep > 0 ? MALARIA_QUESTIONS[currentStep - 1] : null;

  // Answer handler
  const handleAnswerSelect = (questionId: string, value: string, isMulti: boolean = false) => {
    if (isMulti) {
      const currentSelection = (answers[questionId] as string[]) || [];
      let newSelection: string[];
      if (currentSelection.includes(value)) {
        newSelection = currentSelection.filter(item => item !== value);
      } else {
        newSelection = [...currentSelection, value];
      }
      setAnswers(prev => ({ ...prev, [questionId]: newSelection }));
      onLog('info', 'Diagnosis Selection Raised', `Updated multi-select criteria for [${questionId}]: ${newSelection.join(', ')}`);
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
      onLog('info', 'Diagnosis State Active', `Assigned parameter [${questionId}] to: "${value}"`);
    }
  };

  // Safe navigation checks
  const handleNext = () => {
    if (currentStep < MALARIA_QUESTIONS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      processSeverityAssessment();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const processSeverityAssessment = () => {
    onLog('info', 'Running Severity Classifier', 'Aggregating patient answers for Malaria severity indices.');
    
    // Check for critical warning signs first
    const criticalAnswersObj = answers['critical_signs'] as string[] || [];
    const criticalLabels: string[] = [];
    
    if (criticalAnswersObj.length > 0) {
      // Find matching labels
      const critOptionList = MALARIA_QUESTIONS.find(q => q.id === 'critical_signs')?.options || [];
      criticalAnswersObj.forEach(val => {
        const optionMatched = critOptionList.find(opt => opt.value === val);
        if (optionMatched) {
          criticalLabels.push(optionMatched.label);
        }
      });
    }

    // Standard scoring
    let symptomScore = 0;
    MALARIA_QUESTIONS.forEach(question => {
      if (question.id === 'critical_signs') return; // handle critical signs specifically
      
      const answer = answers[question.id];
      if (typeof answer === 'string') {
        const matchOption = question.options.find(opt => opt.value === answer);
        if (matchOption) {
          symptomScore += matchOption.score;
        }
      }
    });

    const hasEndemicTravel = answers['travel_risk'] === 'high_exposure' || answers['travel_risk'] === 'some_exposure';
    
    let outcome: 'low' | 'moderate' | 'critical' = 'low';
    if (criticalAnswersObj.length > 0) {
      outcome = 'critical';
    } else if (hasEndemicTravel && (answers['fever'] === 'high_fever' || symptomScore >= 5)) {
      outcome = 'moderate';
    } else if (symptomScore >= 7) {
      // No recent travel but very high symptoms, raise flag to get checked regardless
      outcome = 'moderate';
    }

    setSeverityLevel(outcome);
    setMatchedCriticalSigns(criticalLabels);
    setIsCompleted(true);
    
    const durationLabel = symptomOnsetDate 
      ? `Started on ${symptomOnsetDate} (~${symptomOnsetDays} days present)`
      : `${symptomOnsetDays} days present`;

    const assessmentId = 'triage_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    setCurrentAssessmentId(assessmentId);

    const assessmentObj: Assessment = {
      id: assessmentId,
      currentStep: MALARIA_QUESTIONS.length + 1,
      answers: {
        ...answers,
        symptom_duration_days: symptomOnsetDays,
        symptom_onset_date: symptomOnsetDate,
        user_city_region: userLocation,
        doctor_signed_by: licensedDoctorName,
        doctor_certified_at: doctorCertifiedAt,
        doctor_notes: clinicalSignOffNotes
      },
      isCompleted: true,
      severityLevel: outcome,
      matchedCriticalSigns: criticalLabels,
      symptomDuration: durationLabel,
      userCityOrRegion: userLocation,
      doctorSignedBy: licensedDoctorName,
      doctorSignedAt: doctorCertifiedAt,
      doctorNotes: clinicalSignOffNotes
    };

    onComplete(assessmentObj);
    onLog('success', 'Assessment Compiled', `Diagnosis finalized: Classified as ${outcome.toUpperCase()} hazard level for user in ${userLocation}.`);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
    setSeverityLevel('low');
    setMatchedCriticalSigns([]);
    setSymptomOnsetDays('3');
    setSymptomOnsetDate('');
    setUserLocation('Harare');
    setLicensedDoctorName('');
    setClinicalSignOffNotes('');
    setIsSignOffCertified(false);
    setDoctorCertifiedAt('');
    setAiAnalysis('');
    setChatMessages([]);
    setCarePlanChecked({
      rehydration: false,
      rest_under_net: false,
      temp_monitoring: false,
      avoid_self_medication: false
    });
    // Reset feedback
    setCurrentAssessmentId('');
    setFeedbackRating(0);
    setFeedbackComment('');
    setFeedbackSubmitting(false);
    setFeedbackSubmitted(false);
    setHoverRating(0);
    setFeedbackError('');
    onLog('info', 'Workspace Restored', 'Flushed symptom diagnostics pipeline.');
    if (onReset) onReset();
  };

  // Call the server Gemini API endpoint to retrieve clinic evaluation
  const handleRequestAiConsult = async () => {
    setAiLoading(true);
    onLog('outgoing', 'Requesting AI Consult', 'Dispatching secure client summaries to Gemini Engine.');
    
    // Construct rich text of raw answers
    let answersSummary = `Symptom Onset/Duration: ${
      symptomOnsetDate ? `Started on ${symptomOnsetDate} (~${symptomOnsetDays} days present)` : `${symptomOnsetDays} days present`
    }\n`;
    MALARIA_QUESTIONS.forEach(q => {
      const ans = answers[q.id];
      if (Array.isArray(ans)) {
        answersSummary += `- ${q.text} Answer: ${ans.join(', ') || 'No critical signs checked'}\n`;
      } else {
        const matchingLabel = q.options.find(o => o.value === ans)?.label || 'Unanswered';
        answersSummary += `- ${q.text} Answer: ${matchingLabel}\n`;
      }
    });

    const aiPrompt = `
You are the senior clinical virtual advisor for the AfriCare digital tropical health portal. 
A patient has completed our malaria warning symptom checklist. Here are their parsed details:

${answersSummary}

Calculated Automated Hazard Severity Level: ${severityLevel.toUpperCase()}
Matched Critical Danger Signs: ${matchedCriticalSigns.join(', ') || 'None'}

Please construct a comprehensive, empathetic, and professional diagnostic advisory evaluation. Keep the tone comforting, logical, authoritative but supportive. Use structured headings. 

Include the following sections to provide excellent advice:
1. **Clinical Assessment Summary**: Analyze their particular combination of symptoms (e.g. fever severity, chills, digestive issues).
2. **Immediate Level Action Plan**: Detail exactly what they must do next given their ${severityLevel} status. Underline that malaria can progress rapidly if left undnosed or untreated.
3. **Specific Malaria Facts**: Explain why fever + travel history means an immediate Rapid Diagnostic Test (RDT) is necessary, and why medication (like Artemether-Lumefantrine or ACTs) must only be taken after positive confirmation.
4. **Vanish Standing Water / Prevention Guide**: Outline 3 actionable methods they should adopt at home to prevent malaria vector proliferation (standing water clearance, insecticide-treated nets, etc.).

*VERY IMPORTANT INTEGRITY GUARANTEE*: Render a distinct clinical disclaimer at the bottom stating that this virtual check does NOT substitute for a blood-smear parasite microscopic test or professional clinical diagnosis, and that if any red flags develop, they must report to an emergency ward immediately. Always prioritize medical advice over self care. No markdown tags like \`\`\`html. Output raw beautiful text or clear markdown.
    `;

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setAiAnalysis(data.text || '');
      onLog('incoming', 'Consult Synced', 'Received clinical diagnostic assessment report from Gemini.');
      
      // Seed chat conversation
      setChatMessages([
        { sender: 'ai', text: `Hello! I have carefully examined your symptoms and marked your risk profile as ${severityLevel.toUpperCase()}. How can I further support your care or explain preventative measures for your family today?` }
      ]);
    } catch (err: any) {
      console.error(err);
      setAiAnalysis('Our digital medical communication channel experienced latency. Please ensure your GEMINI_API_KEY is configured in Secrets, or review standard care and hospital maps below.');
      onLog('error', 'AI Consult Failed', err.message || 'Network delay during evaluation.');
    } finally {
      setAiLoading(false);
    }
  };

  // Chat follow up handles
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);
    onLog('outgoing', 'AI Chat Follow-up Sent', `Payload: "${userMsg.substring(0, 30)}..."`);

    const contextPrompt = `
You are the AfriCare health virtual assistant focusing on tropical health and pediatric care.
The patient is asking a diagnostic question: "${userMsg}"

Current patient symptom risk profile status: ${severityLevel.toUpperCase()}.
History of active current symptoms: ${JSON.stringify(answers)}.

Contextual instructions:
- Provide highly descriptive, medically vetted answers about malaria transmission, mosquito species (Anopheles), testing (RDTs / Smears), the difference between simple/severe malaria, pregnancy implications, or protective bed nets.
- Be extremely encouraging but maintain safe clinical boundaries (always reference certified care centers and RDT diagnostics over purely local herbal routines).
- Provide straightforward, clear bullet points when possible. Do not output more than 2-3 short, highly informative paragraphs. Keep descriptions concise.
    `;

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: contextPrompt })
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.text || 'I apologies, I have misplaced my notes. Could you kindly restate your healthcare question?' }]);
      onLog('incoming', 'AI Chat Follow-up Synced', 'Successfully loaded assistant diagnostic explanation.');
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Network congestion detected. Please ensure secure API token configurations or seek medical screening locally.' }]);
      onLog('error', 'AI Chat Error', err.message || 'Relay timeout.');
    } finally {
      setChatLoading(false);
    }
  };

  // Submit Session Feedback to server
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError('');

    if (feedbackRating < 1 || feedbackRating > 5) {
      setFeedbackError(t.feedbackRequiredAlert);
      onLog('error', 'Feedback Submission Refused', 'A star rating must be selected.');
      return;
    }

    setFeedbackSubmitting(true);
    onLog('outgoing', 'Sending Triage Feedback', `Dispatching Session ${currentAssessmentId} metrics to SADC database.`);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          triageId: currentAssessmentId,
          userId: userId || 'anonymous_sadc',
          rating: feedbackRating,
          comment: feedbackComment,
          severityLevel,
          userCityOrRegion: userLocation
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error status ${response.status}`);
      }

      await response.json();
      setFeedbackSubmitted(true);
      onLog('success', 'Feedback Record Synced', `Triage feedback locked: Rating ${feedbackRating}/5 stars captured.`);
    } catch (err: any) {
      console.error(err);
      setFeedbackError('Failed to save feedback due to connection latency. Please try again.');
      onLog('error', 'Feedback Upload Error', err.message || 'Server connection latency.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Helper validation
  const getIsAnswered = () => {
    if (currentStep === 0) {
      return symptomOnsetDays !== '' || symptomOnsetDate !== '';
    }
    if (!currentQuestion) return false;
    const ans = answers[currentQuestion.id];
    if (currentQuestion.type === 'multi-select') {
      // Multi-select can be empty (meaning no danger signs, which is a valid choice)
      return true;
    }
    return ans !== undefined && ans !== '';
  };

  return (
    <div className="bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full min-h-[600px] transition-all">
      
      {/* Visual Navigation Header for Checker */}
      <div className="border-b border-stone-100 bg-neutral-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ActivitySquare className="w-5 h-5 text-emerald-800" />
          <div>
            <h2 className="text-sm font-bold text-stone-900 font-sans tracking-tight">
              {isNdebele ? 'Isikhungo Sokuhlola i-Malaria' : isShona ? 'Uvheneko rweMalaria' : 'Malaria Screening Hub'}
            </h2>
            <p className="text-[10px] text-stone-400 font-mono">
              VANAUTANO DIGITAL PROTOCOL · PROGRESS: {isCompleted ? (isNdebele ? 'KUGCHWALISIWE' : isShona ? 'ZVAPERA' : 'COMPLETE') : `${currentStep + 1}/${MALARIA_QUESTIONS.length + 1}`}
            </p>
          </div>
        </div>
        
        {isCompleted && (
          <button 
            onClick={handleReset}
            className="text-xs bg-stone-200/60 hover:bg-stone-200 font-semibold px-3 py-1.5 rounded-full transition-colors font-mono flex items-center gap-1 cursor-pointer text-stone-700"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>{isNdebele ? 'Qala Kabusha' : isShona ? 'Kutanga Patsva' : 'Reset Test'}</span>
          </button>
        )}
      </div>
      <div className="flex-1 p-6 relative flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            currentStep === 0 ? (
              <motion.div
                key="step-onset"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 flex-1 flex flex-col justify-between animate-fade-in"
              >
                <div className="space-y-5">
                  {/* Category Pill Tag */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {isNdebele ? 'Isikhathi sezimpawu zomzimba' : isShona ? 'Nguva yezviratidzo zvemuviri' : 'Symptom incubation chronology'}
                  </span>

                  {/* Main Question Heading */}
                  <h3 className="text-xl font-bold font-serif text-stone-900 leading-tight">
                    {t.symptomDurationLabel}
                  </h3>

                  {/* Clinical Extra Explanation Info Box */}
                  <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-2xl text-xs text-stone-500 leading-relaxed italic flex gap-2.5">
                    <span className="text-base text-emerald-700 not-italic shrink-0">✦</span>
                    <p>
                      {t.symptomDurationSub}
                    </p>
                  </div>

                  {/* Dual Duration-Selector and Date-Picker Controls */}
                  <div className="space-y-5 pt-2">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">
                        {t.approxDurationSelect}
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {['1', '2', '3', '4', '5', '7', '10', '14', '21'].map((days) => {
                          const isSelected = symptomOnsetDays === days;
                          return (
                            <button
                              key={days}
                              type="button"
                              onClick={() => {
                                setSymptomOnsetDays(days);
                                const d = new Date();
                                d.setDate(d.getDate() - parseInt(days));
                                setSymptomOnsetDate(d.toISOString().split('T')[0]);
                                onLog('info', 'Onset Duration Select', `Symptom timeline declared as: ~${days} days.`);
                              }}
                              className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-950 text-white border-emerald-950 shadow-sm'
                                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50/25'
                              }`}
                            >
                              {days} {parseInt(days) === 1 ? (isNdebele ? 'ilanga' : isShona ? 'zuva' : 'day') : (isNdebele ? 'amalanga' : isShona ? 'mazuva' : 'days')}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">
                          {t.selectExactCalendar}
                        </label>
                        {symptomOnsetDate && (
                          <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                            {isNdebele ? 'Kukhethiwe' : isShona ? 'Kwasarudzwa' : 'Selected'}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                           id="symptom_onset_datepicker"
                           type="date"
                           value={symptomOnsetDate}
                           onChange={(e) => {
                             const val = e.target.value;
                             setSymptomOnsetDate(val);
                             if (val) {
                               const diffTime = Math.abs(new Date().getTime() - new Date(val).getTime());
                               const calculatedDays = Math.min(Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24))), 45);
                               setSymptomOnsetDays(calculatedDays.toString());
                               onLog('info', 'Onset Date Calibrated', `Symptom origin set to ${val}. Auto-calculated: ~${calculatedDays} days.`);
                             }
                           }}
                           max={new Date().toISOString().split('T')[0]}
                           className="w-full p-3 bg-stone-50 border border-stone-200 hover:bg-white focus:bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-800 transition"
                        />
                      </div>
                    </div>

                    {/* Capturing City/Region with Dynamic Endemicity level */}
                    <div className="space-y-3 pt-3.5 border-t border-stone-100">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">
                          {t.patientCityLabel}
                        </label>
                        <span className="text-[10px] text-emerald-850 font-mono font-extrabold bg-emerald-50/70 border border-emerald-100 px-2 py-0.5 rounded-md">
                          {t.riskMappingActive}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-grow">
                          <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                          <input
                            type="text"
                            placeholder={isNdebele ? 'Faka ibizo ledolobho kumbe isifunda...' : isShona ? 'Nyora zita reguta kana dunhu...' : 'Enter current city or district...'}
                            value={userLocation}
                            onChange={(e) => {
                              setUserLocation(e.target.value);
                            }}
                            className="w-full pl-10 pr-3 py-3 bg-stone-50 border border-stone-200 hover:bg-white focus:bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-800 transition"
                          />
                        </div>
                      </div>
                      
                      {/* Vetted chips list */}
                      <div className="space-y-1">
                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wide">{t.quickPresetsLabel}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {['Harare', 'Bulawayo', 'Mutare', 'Kariba', 'Binga', 'Victoria Falls', 'Chiredzi'].map((city) => {
                            const isSelected = userLocation.toLowerCase().trim() === city.toLowerCase().trim();
                            return (
                              <button
                                key={city}
                                type="button"
                                onClick={() => {
                                  setUserLocation(city);
                                  onLog('info', 'Geographic Area Selected', `Active assessment region set to ${city}.`);
                                }}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-950 text-white border-emerald-950 shadow-xs'
                                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                }`}
                              >
                                {city}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Micro-panel showing local malaria endemicity details derived geographically */}
                      {userLocation && (
                        <div className={`p-4 rounded-2xl border flex items-start gap-2.5 transition-all text-xs ${getEndemicity(userLocation).color} bg-opacity-40`}>
                          <span className="text-sm font-semibold shrink-0">✦</span>
                          <div className="space-y-0.5">
                            <p className="font-bold uppercase tracking-wider text-[10px]">
                              {isNdebele ? 'Uhlobo lwenhlabathi: ' : isShona ? 'Kuwanda kweMalaria muDunhu: ' : 'Local Endemicity: '} {
                                isNdebele ? (
                                  getEndemicity(userLocation).level === 'Low' ? 'Ikhona phansi' :
                                  getEndemicity(userLocation).level === 'Moderate' ? 'Iphakathi' : 'Phezulu Kakhulu'
                                ) : isShona ? (
                                  getEndemicity(userLocation).level === 'Low' ? 'Pasi' :
                                  getEndemicity(userLocation).level === 'Moderate' ? 'Zviri Pakati' : 'Kwakanyanya'
                                ) : getEndemicity(userLocation).level
                              } {isNdebele ? 'isilinganiso' : isShona ? 'chiyero' : 'rating'}
                            </p>
                            <p className="text-[11px] leading-relaxed opacity-90 font-medium">
                              {getEndemicity(userLocation).description}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 0 Footer Action Buttons */}
                <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all text-stone-300 cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t.backBtn}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: MALARIA_QUESTIONS.length + 1 }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentStep ? 'w-5 bg-emerald-800' : 'w-1.5 bg-stone-200'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!getIsAnswered()}
                    className="px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer bg-stone-900 text-white hover:bg-stone-850 shadow-sm"
                  >
                    <span>{t.nextBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                {/* Standard Questions Block */}
                {currentQuestion && (
                  <>
                    <div className="space-y-5">
                      {/* Category Pill Tag */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        currentQuestion.category === 'severity' 
                          ? 'bg-red-50 text-red-700 border border-red-100' 
                          : currentQuestion.category === 'risk' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          currentQuestion.category === 'severity' ? 'bg-red-500' :
                          currentQuestion.category === 'risk' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}></span>
                        {isNdebele ? `inhloli ye-${currentQuestion.category}` : isShona ? `zviratidzo zve-${currentQuestion.category}` : `${currentQuestion.category} indices`}
                      </span>

                      {/* Main Question Heading */}
                      <h3 className="text-xl font-bold font-serif text-stone-900 leading-tight">
                        {isNdebele && currentQuestion.text_nde ? currentQuestion.text_nde : (isShona && currentQuestion.text_sho ? currentQuestion.text_sho : currentQuestion.text)}
                      </h3>

                      {/* Clinical Extra Explanation Info Box */}
                      <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-2xl text-xs text-stone-500 leading-relaxed italic flex gap-2.5">
                        <span className="text-base text-emerald-700 not-italic shrink-0">✦</span>
                        <p>{isNdebele && currentQuestion.info_nde ? currentQuestion.info_nde : (isShona && currentQuestion.info_sho ? currentQuestion.info_sho : currentQuestion.info)}</p>
                      </div>

                      {/* Interactive Options list */}
                      <div className="space-y-2.5 pt-2">
                        {currentQuestion.type === 'single-choice' && currentQuestion.options.map((opt) => {
                          const isSelected = answers[currentQuestion.id] === opt.value;
                          const optionLabel = isNdebele && opt.label_nde ? opt.label_nde : (isShona && opt.label_sho ? opt.label_sho : opt.label);
                          return (
                            <button
                              key={opt.value}
                              onClick={() => handleAnswerSelect(currentQuestion.id, opt.value, false)}
                              className={`w-full p-4 rounded-2xl text-left border text-sm transition-all focus:outline-none flex items-center justify-between cursor-pointer ${
                                isSelected 
                                  ? 'bg-emerald-950/5 border-emerald-800 text-emerald-900 font-semibold ring-1 ring-emerald-800/25 shadow-sm'
                                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50/50'
                              }`}
                            >
                              <span>{optionLabel}</span>
                              <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300'
                              }`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                              </div>
                            </button>
                          );
                        })}

                        {currentQuestion.type === 'multi-select' && (
                          <div className="space-y-2">
                            <p className="text-[11px] text-stone-400 font-mono uppercase mb-1">
                              {isNdebele ? 'Khetha zonke izixwayiso zengozi ezikhona:' : isShona ? 'Sarudzai zviratidzo zvenjodzi zvese zviripo:' : 'Check all applicable danger indicators:'}
                            </p>
                            {currentQuestion.options.map((opt) => {
                              const currentSelection = (answers[currentQuestion.id] as string[]) || [];
                              const isChecked = currentSelection.includes(opt.value);
                              const optionLabel = isNdebele && opt.label_nde ? opt.label_nde : (isShona && opt.label_sho ? opt.label_sho : opt.label);
                              return (
                                <button
                                  key={opt.value}
                                  onClick={() => handleAnswerSelect(currentQuestion.id, opt.value, true)}
                                  className={`w-full p-4 rounded-2xl text-left border text-xs transition-all focus:outline-none flex items-start justify-between cursor-pointer ${
                                    isChecked 
                                      ? 'bg-red-50 border-red-300 text-red-950 font-semibold ring-1 ring-red-300/30 shadow-sm'
                                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50/50'
                                  }`}
                                >
                                  <div className="pr-3 flex-1">
                                    <span className="block font-bold">{optionLabel}</span>
                                    <span className="text-[10px] text-stone-400 font-normal italic mt-0.5 block">
                                      {isNdebele ? 'Uphawu lwengozana ephezulu' : isShona ? 'Chiratidzo chenjodzi yakanyanya' : 'High Severity Vector Indicator'}
                                    </span>
                                  </div>
                                  <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                                    isChecked ? 'border-red-600 bg-red-600 text-white' : 'border-stone-300'
                                  }`}>
                                    {isChecked && <Plus className="w-3 h-3" />}
                                  </div>
                                </button>
                              );
                            })}
                            {/* Empty action trigger */}
                            {((answers[currentQuestion.id] as string[]) || []).length === 0 && (
                              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-[11px] text-emerald-850 text-center font-mono uppercase">
                                {isNdebele ? 'Akula zixwayiso zengozi ezikhethiweyo' : isShona ? 'Hapana chiratidzo chenjodzi chakasarudzwa' : 'No Danger Signs Present or Selected'}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Questionnaire Action Buttons */}
                    <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                          currentStep === 0 
                            ? 'text-stone-300 cursor-not-allowed' 
                            : 'text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer'
                        }`}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t.backBtn}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: MALARIA_QUESTIONS.length + 1 }).map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`h-1.5 rounded-full transition-all ${
                              idx === currentStep ? 'w-5 bg-emerald-800' : 'w-1.5 bg-stone-200'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!getIsAnswered()}
                        className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                          !getIsAnswered()
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                            : 'bg-stone-900 text-white hover:bg-stone-850 shadow-sm'
                        }`}
                      >
                        <span>{currentStep === MALARIA_QUESTIONS.length ? (isNdebele ? 'Hlola Ingozi' : isShona ? 'Vhenekai Mukana' : 'Analyze Risk') : t.nextBtn}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )
          ) : (
            /* COMPLETED STATE: ADVISORY REPORT & MAPS */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Severity Banner */}
              <div className={`p-6 rounded-3xl border ${
                severityLevel === 'critical' 
                  ? 'bg-red-50 border-red-200 text-red-950' 
                  : severityLevel === 'moderate'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-emerald-50 border-emerald-100 text-emerald-950'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    severityLevel === 'critical' ? 'bg-red-650 text-white' :
                    severityLevel === 'moderate' ? 'bg-amber-500 text-white' : 'bg-emerald-800 text-white'
                  }`}>
                    {severityLevel === 'critical' ? <AlertOctagon className="w-6 h-6 animate-bounce" /> :
                     severityLevel === 'moderate' ? <AlertTriangle className="w-6 h-6" /> : <Smile className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">Calculated Advisory Level</span>
                    <h3 className="text-xl font-bold font-serif">
                      {severityLevel === 'critical' ? 'EMERGENCY: Immediate Medical Attending Required' :
                       severityLevel === 'moderate' ? 'ACTION REQUIRED: Likely Malaria (Needs Rapid diagnostic)' :
                       'LOW RISK: General Care & Observation Advisory'}
                    </h3>
                    <p className="text-xs opacity-90 leading-relaxed mt-1">
                      {severityLevel === 'critical' && 'Critical physiological red flags were flagged. Malaria symptoms in high risk categories or with severe weakness must be addressed on-site at an emergency local clinic immediately. Do not sleep or wait.'}
                      {severityLevel === 'moderate' && 'You reported symptoms characteristic of malaria combined with travel risk indices. You have a low-grade or high fever. Malaria symptoms mimic common flu but require Artemisinin-based treatment. Please take a Rapid Smear Test.'}
                      {severityLevel === 'low' && 'Your clinical score is low. Standard symptoms (like mild headache) without high fever or endemic travel are unlikely to represent high malaria risk. Observe and monitor temperature cycle hourly.'}
                    </p>

                    <div className="mt-4 pt-4 border-t border-dashed border-current/20 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wide opacity-85">
                          <Stethoscope className="w-4 h-4 text-emerald-800" />
                          <span>Active Clinicians On Duty Now</span>
                        </div>
                        <div className="text-[10px] font-mono tracking-wide opacity-80">
                          ⏱ Symptom Duration: <span className="font-bold underline">{symptomOnsetDate ? `Onset ${symptomOnsetDate} (~${symptomOnsetDays} days present)` : `${symptomOnsetDays} days present`}</span>
                        </div>
                      </div>
                      {onSpeakWithDoctor && (
                        <button
                          type="button"
                          onClick={onSpeakWithDoctor}
                          className="px-4 py-1.5 bg-stone-900 hover:bg-stone-850 text-white text-[11px] font-bold rounded-xl transition cursor-pointer shrink-0 self-center sm:self-auto"
                        >
                          Consult Doctor Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Listing exact critical signs highlighted if critical */}
                {matchedCriticalSigns.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-red-200/50">
                    <p className="text-[11px] font-bold font-mono uppercase text-red-800 tracking-wide mb-1.5">Emergency Warning Biomarkers Triggered:</p>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-red-900 font-medium">
                      {matchedCriticalSigns.map((sig, i) => (
                        <li key={i}>{sig}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actionable Support Care Checklist Checklist Builder */}
              <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-emerald-800" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 font-mono">Personalized Supportive Action Plan</h4>
                </div>
                <p className="text-xs text-stone-500">Tick these vital clinical and home actions as you execute them:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  <button 
                    onClick={() => setCarePlanChecked(prev => ({ ...prev, rehydration: !prev.rehydration }))}
                    className={`p-3 rounded-2xl text-left border text-xs flex gap-3 transition-colors ${
                      carePlanChecked.rehydration 
                        ? 'bg-emerald-50 border-emerald-300 text-stone-800' 
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                      carePlanChecked.rehydration ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {carePlanChecked.rehydration && <span className="text-[10px]">✔</span>}
                    </div>
                    <div>
                      <p className="font-bold">Active Rehydration</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">Drink clean water mixed with Oral Rehydration Salts (ORS) or diluted clear broths to buffer stomach fluid loss.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setCarePlanChecked(prev => ({ ...prev, rest_under_net: !prev.rest_under_net }))}
                    className={`p-3 rounded-2xl text-left border text-xs flex gap-3 transition-colors ${
                      carePlanChecked.rest_under_net 
                        ? 'bg-emerald-50 border-emerald-300 text-stone-800' 
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                      carePlanChecked.rest_under_net ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {carePlanChecked.rest_under_net && <span className="text-[10px]">✔</span>}
                    </div>
                    <div>
                      <p className="font-bold">Rest Under Bed Net (LLIN)</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">Rest strictly under an insecticide-treated canopy to block mosquitoes from biting you and passing the parasite to others.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setCarePlanChecked(prev => ({ ...prev, temp_monitoring: !prev.temp_monitoring }))}
                    className={`p-3 rounded-2xl text-left border text-xs flex gap-3 transition-colors ${
                      carePlanChecked.temp_monitoring 
                        ? 'bg-emerald-50 border-emerald-300 text-stone-800' 
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                      carePlanChecked.temp_monitoring ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {carePlanChecked.temp_monitoring && <span className="text-[10px]">✔</span>}
                    </div>
                    <div>
                      <p className="font-bold">Hourly Temperature Logs</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">Measure body temperature regularly, noting cycles (fevers often spike in intervals of 24 to 48 hours).</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setCarePlanChecked(prev => ({ ...prev, avoid_self_medication: !prev.avoid_self_medication }))}
                    className={`p-3 rounded-2xl text-left border text-xs flex gap-3 transition-colors ${
                      carePlanChecked.avoid_self_medication 
                        ? 'bg-emerald-50 border-emerald-300 text-stone-800' 
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                      carePlanChecked.avoid_self_medication ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {carePlanChecked.avoid_self_medication && <span className="text-[10px]">✔</span>}
                    </div>
                    <div>
                      <p className="font-bold">No Blind Prophylaxis</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">Avoid taking anti-malarials blindly before taking an RDT test. Antimalarial abuse drives parasitic mutation resistance.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Nearest Vetted Clinic Locator Section */}
              <NearestClinicFinder severityLevel={severityLevel} onLog={onLog} />

              {/* INTEGRATED GEMINI ADVISOR & CONFLICT RESOLUTION MODULE */}
              <div className="border border-stone-200 rounded-3xl overflow-hidden shadow-sm flex flex-col bg-white">
                <div className="p-5 border-b border-stone-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-800" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 font-mono">Consult AfriCare Health AI Advisor</h4>
                      <p className="text-[10px] text-stone-400">Generative personalized assessment structured via Gemini</p>
                    </div>
                  </div>

                  {!aiAnalysis && (
                    <button
                      onClick={handleRequestAiConsult}
                      disabled={aiLoading}
                      className="px-4 py-2 bg-emerald-950 text-white font-bold text-xs rounded-xl hover:bg-emerald-900 transition flex items-center gap-1.5 cursor-pointer shadow-sm ml-auto sm:ml-0"
                    >
                      {aiLoading ? (
                        <>
                          <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                          <span>Analysing Profile...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate Clinical Advice</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* AI Output Result Box */}
                {aiAnalysis && (
                  <div className="p-5 space-y-5">
                    {/* Diagnostic Summary Output Box */}
                    <div className="p-5.5 bg-stone-50 border border-stone-200 rounded-2xl whitespace-pre-wrap text-stone-800 hover:bg-stone-50/80 transition-all text-xs leading-relaxed max-h-[380px] overflow-y-auto font-sans">
                      {aiAnalysis}
                    </div>

                    {/* Integrated AI Conversational Chat Box */}
                    <div id="ai-clinical-chat" className="border-t border-stone-100 pt-5 space-y-4">
                      <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <h5 className="text-[11px] font-bold uppercase tracking-widest text-stone-500 font-mono">Malaria Chat Room Advisor</h5>
                      </div>

                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {chatMessages.map((msg, i) => (
                          <div 
                            key={i} 
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-normal ${
                              msg.sender === 'user' 
                                ? 'bg-stone-900 text-white rounded-br-none' 
                                : 'bg-neutral-100 text-stone-800 rounded-bl-none border border-neutral-200'
                            }`}>
                              <p className="font-semibold text-[10px] opacity-60 uppercase tracking-wider mb-0.5">
                                {msg.sender === 'user' ? 'Your Inquiry' : 'Clinical Support Node'}
                              </p>
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                          </div>
                        ))}
                        {chatLoading && (
                          <div className="flex justify-start">
                            <div className="p-3 bg-neutral-100 border border-neutral-200 text-stone-600 rounded-2xl rounded-bl-none text-xs flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-stone-600 rounded-full animate-bounce"></span>
                              <span className="w-1.5 h-1.5 bg-stone-600 rounded-full animate-bounce delay-100"></span>
                              <span className="w-1.5 h-1.5 bg-stone-600 rounded-full animate-bounce delay-200"></span>
                              <span className="text-[10px] font-mono uppercase text-stone-400">Formulating response...</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Input Submit */}
                      <form onSubmit={handleSendChat} className="flex gap-2 bg-stone-50 border border-stone-200 rounded-xl p-1.5">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask a question (e.g., 'What are malaria prophylaxis medications?', 'How do LLIN nets work?')"
                          className="flex-grow px-3 py-2 bg-transparent text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={!chatInput.trim() || chatLoading}
                          className="p-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition disabled:opacity-40 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>

              {/* MEDICAL PRACTITIONER CLINICAL SIGN-OFF BOARD */}
              <div className="border border-stone-200 rounded-3xl overflow-hidden shadow-xs bg-white">
                <div className="p-5 border-b border-stone-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4.5 h-4.5 text-emerald-800 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 font-mono">{t.signOffTitle}</h4>
                      <p className="text-[10px] text-stone-400">{t.signOffSub}</p>
                    </div>
                  </div>
                  {isSignOffCertified && (
                    <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-850 border border-emerald-200 px-2.5 py-1 rounded-full uppercase self-start sm:self-auto">
                      {isNdebele ? '✓ Kuvunyelwe' : isShona ? '✓ Zvatenderwa' : '✓ Authenticated'}
                    </span>
                  )}
                </div>

                <div className="p-5">
                   {!isSignOffCertified ? (
                    <div className="space-y-4">
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {t.signOffDesc}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">
                            {t.clinicianNameLabel}
                          </label>
                          <input
                            type="text"
                            placeholder={t.clinicianNamePlaceholder}
                            value={licensedDoctorName}
                            onChange={(e) => setLicensedDoctorName(e.target.value)}
                            className="w-full p-2.5 bg-stone-50 border border-stone-200 hover:bg-white focus:bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-800 transition"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">
                            {t.facilityLabel}
                          </label>
                          <input
                            type="text"
                            placeholder={t.facilityPlaceholder}
                            id="doctor_facility_input"
                            defaultValue="Harare Central General Post"
                            className="w-full p-2.5 bg-stone-50 border border-stone-200 hover:bg-white focus:bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-800 transition"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">
                          {t.advisoryNotesLabel}
                        </label>
                        <textarea
                          placeholder={t.advisoryNotesPlaceholder}
                          rows={3}
                          value={clinicalSignOffNotes}
                          onChange={(e) => setClinicalSignOffNotes(e.target.value)}
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 hover:bg-white focus:bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-800 transition resize-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!licensedDoctorName.trim()) {
                            alert(t.clinicianRequiredAlert);
                            return;
                          }
                          const facilityEl = document.getElementById('doctor_facility_input') as HTMLInputElement;
                          const facility = facilityEl?.value || 'Harare Central General Post';
                          const certDate = new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                          setDoctorCertifiedAt(certDate);
                          setIsSignOffCertified(true);
                          
                          // Logging trace
                          onLog('success', 'Digital Clinical Sign-off', `Report certified by ${licensedDoctorName} for clinical intake.`);

                          // Save fully compiled object to state
                          const durationLabel = symptomOnsetDate 
                            ? `Started on ${symptomOnsetDate} (~${symptomOnsetDays} days present)`
                            : `${symptomOnsetDays} days present`;

                          const assessmentObj: Assessment = {
                            currentStep: MALARIA_QUESTIONS.length + 1,
                            answers: {
                              ...answers,
                              symptom_duration_days: symptomOnsetDays,
                              symptom_onset_date: symptomOnsetDate,
                              user_city_region: userLocation,
                              doctor_signed_by: licensedDoctorName,
                              doctor_certified_at: certDate,
                              doctor_facility: facility,
                              doctor_notes: clinicalSignOffNotes
                            },
                            isCompleted: true,
                            severityLevel,
                            matchedCriticalSigns,
                            symptomDuration: durationLabel,
                            userCityOrRegion: userLocation,
                            doctorSignedBy: licensedDoctorName,
                            doctorSignedAt: certDate,
                            doctorNotes: clinicalSignOffNotes
                          };
                          onComplete(assessmentObj);
                        }}
                        className="w-full py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-bold rounded-2xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <FileCheck className="w-4 h-4 text-emerald-400" />
                        <span>{t.signOffBtn}</span>
                      </button>
                    </div>
                  ) : (
                    /* SEALED CERTIFICATE DETAILS */
                    <div className="relative border-2 border-emerald-800/25 bg-emerald-50/10 rounded-2xl p-4.5 space-y-4 overflow-hidden">
                      {/* Diagonal watermark background stamp */}
                      <div className="absolute top-2 right-2 rotate-12 opacity-[0.03] select-none pointer-events-none">
                        <HeartPulse className="w-24 h-24 text-emerald-800" />
                      </div>

                      <div className="flex items-start gap-3.5 relative">
                        <div className="w-10 h-10 rounded-full border border-emerald-850/25 bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                          <Stethoscope className="w-5.5 h-5.5" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-emerald-900 uppercase tracking-widest block">
                            {t.clinicallyVerifiedHeader}
                          </span>
                          <h4 className="text-sm font-bold text-stone-900 italic font-serif">
                            Dr. {licensedDoctorName}
                          </h4>
                          <p className="text-[10px] text-stone-400 font-mono">
                            {isNdebele ? 'Isikhungo' : isShona ? 'Kiriniki' : 'Facility'}: { (document.getElementById('doctor_facility_input') as HTMLInputElement)?.value || 'Harare Central General Post' } &bull; {isNdebele ? 'Mhlaka' : isShona ? 'Musi wa' : 'Certified on'} {doctorCertifiedAt}
                          </p>
                        </div>
                      </div>

                      {clinicalSignOffNotes && (
                        <div className="p-3 bg-white border border-stone-150 rounded-xl text-xs italic text-stone-605 leading-relaxed font-mono">
                          <span className="font-extrabold text-emerald-800 not-italic mr-1">“</span>
                          {clinicalSignOffNotes}
                          <span className="font-extrabold text-emerald-850 not-italic ml-1">”</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-dashed border-stone-200 pt-3.5 flex-wrap gap-2 text-xs">
                        {/* Beautiful generated digital calligraphic style signature placeholder */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">{t.digitalSignatureLabel}</span>
                          <span className="font-serif italic text-emerald-800 font-black text-xs tracking-wider select-none px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                            Dr. {licensedDoctorName.replace(/^(dr\.?\s*)/i, '')} &mdash; ✓ {isNdebele ? 'Kuvaliwe' : isShona ? 'Zvakachengetwa' : 'Sealed'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsSignOffCertified(false);
                            onLog('info', 'Edit Authorization Raised', 'Unsealed clinical signature for revision.');
                          }}
                          className="text-[10px] font-mono text-stone-400 hover:text-stone-700 underline transition-all bg-transparent border-0 cursor-pointer"
                        >
                          {t.reviseSignOffBtn}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* USER TRIAGE FEEDBACK SYSTEM */}
              <div id="triage-feedback-card" className="bg-white border border-stone-200 rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-stone-900 font-serif">
                      {t.feedbackTitle}
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      {t.feedbackSubtitle}
                    </p>
                  </div>
                </div>

                {feedbackSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
                      <span className="text-xs font-bold font-mono tracking-wide uppercase">Feedback Synced & Logged</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans">
                      {t.feedbackSuccessMsg}
                    </p>
                    <div className="pt-2 border-t border-dashed border-emerald-200/50 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-stone-400 font-mono">
                      <div>SESSION: <span className="font-bold text-stone-600">{currentAssessmentId}</span></div>
                      <div>USER: <span className="font-bold text-stone-600">{userId}</span></div>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-3.5">
                    {/* Star Rating Selector Row */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono block">
                        {t.feedbackRatingLabel}
                      </label>
                      <div className="flex items-center gap-1.5 select-none">
                        {[1, 2, 3, 4, 5].map((starVal) => {
                          const isLit = (hoverRating || feedbackRating) >= starVal;
                          return (
                            <button
                              key={starVal}
                              type="button"
                              onClick={() => {
                                setFeedbackRating(starVal);
                                if (feedbackError) setFeedbackError('');
                              }}
                              onMouseEnter={() => setHoverRating(starVal)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="focus:outline-none focus:ring-2 focus:ring-emerald-900 rounded-lg p-0.5 transition"
                              title={`Rate ${starVal} Star${starVal > 1 ? 's' : ''}`}
                            >
                              <Star 
                                className={`w-7 h-7 cursor-pointer transition-all duration-100 ${
                                  isLit 
                                    ? 'text-amber-550 fill-amber-400 scale-105 filter drop-shadow-[0_1px_2px_rgba(245,158,11,0.2)]' 
                                    : 'text-stone-250 hover:text-stone-400'
                                }`} 
                              />
                            </button>
                          );
                        })}
                        {feedbackRating > 0 && (
                          <span className="text-xs font-bold text-stone-600 font-mono ml-2">
                            {feedbackRating}/5 SADC
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Comment Field Area */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono block">
                        {t.feedbackCommentLabel}
                      </label>
                      <textarea
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder={t.feedbackCommentPlaceholder}
                        disabled={feedbackSubmitting}
                        className="w-full min-h-[75px] p-3 text-xs text-stone-800 placeholder-stone-400 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-900 focus:outline-none transition disabled:opacity-60"
                      />
                    </div>

                    {feedbackError && (
                      <div className="p-2.5 bg-red-50 border border-red-100/50 rounded-xl text-[11px] text-red-800 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-650 shrink-0 mt-0.5" />
                        <span className="font-semibold">{feedbackError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={feedbackSubmitting}
                      className="w-full py-2.5 bg-emerald-950 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-emerald-900"
                    >
                      {feedbackSubmitting ? (
                        <>
                          <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                          <span>{t.feedbackSubmittingBtn}</span>
                        </>
                      ) : (
                        <>
                          <Star className="w-3.5 h-3.5 shrink-0 text-amber-300 fill-amber-300" />
                          <span>{t.feedbackSubmitBtn}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Secondary Reset / Disclaimer actions */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 border border-stone-300 rounded-xl hover:bg-stone-50 text-stone-705 font-bold text-xs transition cursor-pointer"
                >
                  {isNdebele ? 'Hlola Ingozi Entsha Yamalanga' : isShona ? 'Tanga Kuvhenekwa Kutsva kweMalaria' : 'Start New Risk Diagnostics Assessment'}
                </button>
                <p className="text-[10px] text-stone-400 leading-normal max-w-lg mx-auto mt-3">
                  {isNdebele ? (
                    'Leli-layini lihlola isimo sezimpawu zomzimba ngokwemithetho yezempilo. Amaphilisi e-paracetamol awabulali isilwanyana se-malaria egazini. Thola ukuhlolwa okusemthethweni kwamalanga ezibhedlela zethu SADC zesifunda.'
                  ) : isShona ? (
                    'Ukuvhenekwa uku kunopa ruzivo pamusoro pezviratidzo zveMalaria. Mapiritsi eparacetamol anozorodza musoro asi haauraye utachiona hweMalaria. Endai munovhenekwa mumaawa 24 anotevera.'
                  ) : (
                    'This symptoms evaluation matrix calculates baseline warning signs from clinical protocols. Over-the-counter paracetamol masks headaches but does not kill the Plasmodium parasite. Take a blood test at our SADC licensed health posts in 24 hours.'
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
