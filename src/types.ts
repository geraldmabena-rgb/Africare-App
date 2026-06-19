export interface Option {
  label: string;
  label_nde?: string; // Ndebele translation
  label_sho?: string; // Shona translation
  value: string;
  score: number; // custom diagnostic weights
  isCritical?: boolean; // flags critical severity
}

export interface Question {
  id: string;
  category: 'symptom' | 'severity' | 'risk';
  text: string;
  text_nde?: string; // Ndebele translation
  text_sho?: string; // Shona translation
  info: string;
  info_nde?: string; // Ndebele translation
  info_sho?: string; // Shona translation
  type: 'boolean' | 'single-choice' | 'multi-select';
  options: Option[];
}

export interface Assessment {
  id?: string;
  currentStep: number;
  answers: Record<string, string | string[]>;
  isCompleted: boolean;
  severityLevel: 'low' | 'moderate' | 'critical';
  matchedCriticalSigns: string[];
  symptomDuration?: string;
  userCityOrRegion?: string;
  doctorSignedBy?: string;
  doctorSignedAt?: string;
  doctorNotes?: string;
}

export interface Clinic {
  name: string;
  region: string;
  distance: string;
  phone: string;
  hours: string;
  services: string[];
}
