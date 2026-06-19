export interface TranslationSet {
  // App Header & Layout
  sadcPortal: string;
  digitalGuide: string;
  regionalCore: string;
  assessmentTotal: string;
  exportDiagnosis: string;
  copiedSummary: string;
  speakWithDoctor: string;
  vectorIntakeTitle: string;
  vectorIntakeSubtitle: string;
  
  // Dashboard Status Metrics
  myRiskScore: string;
  dangerSignalsText: string;
  vettedClinicsText: string;
  activeCliniciansTitle: string;
  activeCliniciansCount: string;
  consultDoctorNow: string;

  // Clinic Tracker Words
  preVettedTitle: string;
  nearYouDesc: string;
  directionLabel: string;
  distanceLabel: string;
  hoursLabel: string;
  serviceLabel: string;
  callCenterText: string;
  emergencyDirectLine: string;

  // Symptom Checker Form
  symptomDurationLabel: string;
  symptomDurationSub: string;
  approxDurationSelect: string;
  daysOption: string;
  selectExactCalendar: string;
  patientCityLabel: string;
  riskMappingActive: string;
  quickPresetsLabel: string;
  backBtn: string;
  nextBtn: string;
  analyzeRiskBtn: string;
  dangerGroupWarningTitle: string;
  dangerGroupWarningDesc: string;
  feverNoteAlert: string;
  noDangerSignsSelected: string;

  // Sign-off section
  signOffTitle: string;
  signOffSub: string;
  signOffDesc: string;
  clinicianNameLabel: string;
  clinicianNamePlaceholder: string;
  facilityLabel: string;
  facilityPlaceholder: string;
  advisoryNotesLabel: string;
  advisoryNotesPlaceholder: string;
  signOffBtn: string;
  clinicallyVerifiedHeader: string;
  digitalSignatureLabel: string;
  reviseSignOffBtn: string;
  clinicianRequiredAlert: string;

  // Feedback Translation Keys
  feedbackTitle: string;
  feedbackSubtitle: string;
  feedbackRatingLabel: string;
  feedbackCommentLabel: string;
  feedbackCommentPlaceholder: string;
  feedbackSubmitBtn: string;
  feedbackSubmittingBtn: string;
  feedbackSuccessMsg: string;
  feedbackRequiredAlert: string;
}

export const UI_TRANSLATIONS: Record<'en' | 'nde' | 'sho', TranslationSet> = {
  en: {
    sadcPortal: 'SADC Portal',
    digitalGuide: 'Digital Malaria Screening & Preventative Care Guide',
    regionalCore: 'REGIONAL CORE: HARARE',
    assessmentTotal: 'ASSESSMENT TOTAL',
    exportDiagnosis: 'Export Diagnosis',
    copiedSummary: 'Copied summary!',
    speakWithDoctor: 'Speak with a Doctor',
    vectorIntakeTitle: 'Anopheles Vector Intake',
    vectorIntakeSubtitle: 'Answer targeted diagnostic queries mapped from international clinical guidelines. This diagnostic module assesses clinical criteria to gauge malaria severity hazard levels, instantly loading home-care support, pre-vetted dispensary routes, and Generates AI analysis.',
    myRiskScore: 'My Risk Score',
    dangerSignalsText: 'Danger Signals',
    vettedClinicsText: 'Vetted Clinics',
    activeCliniciansTitle: 'Active Clinicians On Duty Now',
    activeCliniciansCount: '4 active paediatricians/epidemiologists online',
    consultDoctorNow: 'Consult Doctor Now',
    preVettedTitle: 'Pre-Vetted Malaria Treatment Hubs',
    nearYouDesc: 'Locate certified SADC clinical support spots and primary pharmacies equipped with rapid testing (RDT) vectors and initial Artemisinin combo (ACT) therapy stocks.',
    directionLabel: 'Get Routing',
    distanceLabel: 'Distance',
    hoursLabel: 'Hours',
    serviceLabel: 'Core Service',
    callCenterText: 'SADC Emergency Vector Call Centre',
    emergencyDirectLine: 'Direct Nurse Hotline (Toll-Free)',
    symptomDurationLabel: 'How long has the patient been suffering from active or lingering symptoms?',
    symptomDurationSub: 'Identifying symptom duration is clinically vital. Malaria progression that exceeds 72 hours without Artemisinin combination therapy heavily elevates risks of cerebral complications or systemic respiratory distress.',
    approxDurationSelect: '1. Choose Approximate Duration',
    daysOption: 'days present',
    selectExactCalendar: '2. Or Specify Exact Calendar Onset Date',
    patientCityLabel: '3. Patient Current City or Region',
    riskMappingActive: 'Risk Mapping Active',
    quickPresetsLabel: 'Quick Regional Presets:',
    backBtn: 'Back',
    nextBtn: 'Next',
    analyzeRiskBtn: 'Analyze Risk & Compile Assessment',
    dangerGroupWarningTitle: 'VULNERABLE PROTOCOL INITIATED',
    dangerGroupWarningDesc: 'Patient matches high-priority pediatric or gestation cohort. Clinical triage guidelines advise hospital screening immediately even if current body temperature reads normal.',
    feverNoteAlert: 'CLINICAL ADVISORY NOTE',
    noDangerSignsSelected: 'No critical acute danger indicators checked yet.',
    signOffTitle: 'Clinician Review & Sign-Off Block',
    signOffSub: 'Secure electronic sign-off verification & treatment lock',
    signOffDesc: 'Are you a licensed practitioner, nurse, or community health worker? You can review these diagnostic summaries, type your clinical notes, and electronically authorize this assessment.',
    clinicianNameLabel: 'Licensed Clinician Name / Credentials',
    clinicianNamePlaceholder: 'e Dr. Nyasha Moyo, MD',
    facilityLabel: 'SADC Facility Association',
    facilityPlaceholder: 'e.g. Harare Central General Post',
    advisoryNotesLabel: 'Clinical Advisory Notes & Directives',
    advisoryNotesPlaceholder: 'Type specific care suggestions, RDT directives, or mosquito netting advise for tracking history...',
    signOffBtn: 'Sign Off & Certify Clinical Report',
    clinicallyVerifiedHeader: 'CLINICALLY VERIFIED SUMMARY STATEMENT',
    digitalSignatureLabel: 'Digital Signature:',
    reviseSignOffBtn: 'Revise Certification',
    clinicianRequiredAlert: 'Please enter your clinician name to certify.',
    feedbackTitle: 'Rate Your Triage Session',
    feedbackSubtitle: 'Your feedback directly supports SADC coordinators in refining digital screening and local care support pathways.',
    feedbackRatingLabel: 'Star Rating (1 to 5):',
    feedbackCommentLabel: 'Comments or Clinical Observations (Optional):',
    feedbackCommentPlaceholder: 'Enter any feedback, clinic routing clarity, or specific observation details here...',
    feedbackSubmitBtn: 'Submit Session Feedback',
    feedbackSubmittingBtn: 'Uploading Feedback...',
    feedbackSuccessMsg: 'Thank you! Your feedback has been securely logged on our server for clinical analysis.',
    feedbackRequiredAlert: 'Please select a star rating before submitting.'
  },
  nde: {
    sadcPortal: 'Isizinda se-SADC',
    digitalGuide: 'Uhlolo lwe-Malaria leNdlela zokuVimbela nge-Digital',
    regionalCore: 'UMBHAHANE WEBHASIN: HARARE',
    assessmentTotal: 'INGQIKITHI YOHLOLO',
    exportDiagnosis: 'Thumela Umbiko',
    copiedSummary: 'Kukopishwe emshineni!',
    speakWithDoctor: 'Khuluma loDokotela',
    vectorIntakeTitle: 'Uhlolo lwe-Anopheles Vector',
    vectorIntakeSubtitle: 'Phendula imibuzo eklanyiweyo evela kumanyathelo ezifundo zamazwe ngamazwe. Lolu hlelo luhlola izibonakaliso zomzimba ukukala izingozi zokugula ezilomkhuhlane we-malaria, lunikeze usizo lwasekhaya, imithi, kanye lemininingwane evela ku-AI.',
    myRiskScore: 'Isilinganiso sethuba',
    dangerSignalsText: 'Izixwayiso Zengozi',
    vettedClinicsText: 'Izibhedlela Ezihlolwayo',
    activeCliniciansTitle: 'Odokotela Abakhona Okwamanje',
    activeCliniciansCount: 'Odokotela labasesemthethweni abane (4) abakhona okwamanje ku-intanethi',
    consultDoctorNow: 'Xoxisana loDokotela Manje',
    preVettedTitle: 'Izikhungo Ze-Malaria Ezihlolwe-Kwelatshwa',
    nearYouDesc: 'Thola isikhungo sempilo se-SADC kumbe ikhemisi elile-Rapid Diagnostic Tests (RDT) lomuthi we-Artemisinin (ACT).',
    directionLabel: 'Thola Indlela',
    distanceLabel: 'Ibanga',
    hoursLabel: 'Amahora',
    serviceLabel: 'Umsamo Obalulekile',
    callCenterText: 'Isikhungo Se-Emergency Malaria SADC',
    emergencyDirectLine: 'Inombolo Yomunesi (Mahhala)',
    symptomDurationLabel: 'Umguli usehlupheke okwesikhathi esingakanani yilezi zimpawu?',
    symptomDurationSub: 'Ukubona ubude besikhathi somkhuhlane kubalulekile kakhulu ekwelapheni. Ukugula okundlula amahora angama-72 kungenamithi kuthela amathuba amakhulu emikhuhlane ebuchopheni kumbe ukuphefumula nzima.',
    approxDurationSelect: '1. Khetha Isikhathi Esisondelayo',
    daysOption: 'amalanga ekhona',
    selectExactCalendar: '2. Kumbe Uveze Ilanga Lokuqala Ngqo lekhalenda',
    patientCityLabel: '3. Idolobho kumbe Indawo yomguli amanji',
    riskMappingActive: 'Uhlolo lwe-Geographic lumisiwe',
    quickPresetsLabel: 'Izindawo ezisheshayo zesifunda:',
    backBtn: 'Emuva',
    nextBtn: 'Phambili',
    analyzeRiskBtn: 'Hlola Ingozi & Gcwalisa Umbiko wonke',
    dangerGroupWarningTitle: 'UMTHETHO WABANTU LABASESENGOZINI ULUNGISELELWE',
    dangerGroupWarningDesc: 'Umguli ungena kulabo abazithwaleyo kumbe abantwana abancane. Imiyalelo sezempilo ithi aye emtholampilo msinyane ngitsho loba umzimba wakhe ungatshisi kakhulu.',
    feverNoteAlert: 'ISIXWAYISO SEZEMPILO KUDOKOTELA',
    noDangerSignsSelected: 'Akula zixwayiso zengozi ezikhethiweyo okwamanje.',
    signOffTitle: 'Ibhodi Yokuhlola lokuSayina kukaDokotela',
    signOffSub: 'Ukuqinisekisa okusemthethweni lokusayina kukadokotela we-electronic',
    signOffDesc: 'Uyilizwe elisemthethweni lezempilo, unesi, kumbe isisebenzi sezempilo kazulu? Ungahlola imibiko leyo, ubhale phansi, uphinde uqinisekise lolu hlolo.',
    clinicianNameLabel: 'Ibhizo laloDokotela loMsebenzi wakhe',
    clinicianNamePlaceholder: 'Isib. Dr. Nyasha Moyo, MD',
    facilityLabel: 'Isikhungo sezempilo se-SADC',
    facilityPlaceholder: 'Isib. Harare Central General Post',
    advisoryNotesLabel: 'Imicabango loKubandakanya kukadokotela',
    advisoryNotesPlaceholder: 'Bhala phansi izeluleko zokwelapha, ukusafuza inetha kumbe umuthi womguli...',
    signOffBtn: 'Sayina uphinde waqinisekise umbiko lo',
    clinicallyVerifiedHeader: 'UMBIKO OHLOLIWE NJALO OSEMTHETHWENI',
    digitalSignatureLabel: 'Isisayino se-Digital:',
    reviseSignOffBtn: 'Guqulula ukusayina',
    clinicianRequiredAlert: 'Sicela ufake ibizo lakho likadokotela kuze uqinisekise.',
    feedbackTitle: 'Maka Uhlolo Lwakho Lomkhuhlane',
    feedbackSubtitle: 'Izeluleko zakho zisiza abaxhumanisi be-SADC ukuthuthukisa izibonakaliso zomzimba lokuphucula impilo yabantu.',
    feedbackRatingLabel: 'Izinkanyezi Zempendulo (1 kusiya 5):',
    feedbackCommentLabel: 'Imibono kumbe Okuphawuliweyo Okukhethayo (Optional):',
    feedbackCommentPlaceholder: 'Faka noma imiphi imibono, ukucaca kwendlela, kumbe imininingwane emayelana nohlolo...',
    feedbackSubmitBtn: 'Thumela Impendulo',
    feedbackSubmittingBtn: 'Ilayisha Impendulo...',
    feedbackSuccessMsg: 'Siyabonga! Impendulo yakho igcinwe ngokuphephile kuseva yethu ukuze ihlolwe ngodokotela.',
    feedbackRequiredAlert: 'Sicela ukhethe isibalo sezinkanyezi ngaphambi kokuthumela.'
  },
  sho: {
    sadcPortal: 'SADC Portal',
    digitalGuide: 'Gwaro rekuvheneka nekuvharira Malaria reDigital',
    regionalCore: 'DZIMBARE REKUDUNHU: HARARE',
    assessmentTotal: 'ZVAKAONGORORWA ZVOSE',
    exportDiagnosis: 'Utura Mhedzisiro',
    copiedSummary: 'Mhedzisiro Yakopwa!',
    speakWithDoctor: 'Taura naChiremba',
    vectorIntakeTitle: 'Uvheneki hweUmhutu weAnopheles',
    vectorIntakeSubtitle: 'Mhinduro kumibvunzo yetsvakurudzo inobva pamaitiro ekiriniki epasi rese. Chirongwa chekuvheneka ichi chinotarisa zviratidzo zvekurwara kuti chione huwandu hwenjodzi yeMalaria, ichibva yakupa ruzivo rwekurapa pamba, makiriniki akatenderwa, nekuongorora kweAI.',
    myRiskScore: 'Chiyero Chekupinda Munjodzi',
    dangerSignalsText: 'Zviratidzo Zvenjodzi',
    vettedClinicsText: 'Makiriniki Akatenderwa',
    activeCliniciansTitle: 'Chiremba neVanamukoti Vari Pabasa Izvezvi',
    activeCliniciansCount: 'Chiremba nevanamazvikokota veMalaria vana (4) vari paIndaneti izvezvi',
    consultDoctorNow: 'Taura naChiremba Izvezvi',
    preVettedTitle: 'Zvikamu Zvakatenderwa zveKurapa Malaria',
    nearYouDesc: 'Tsvaga nzvimbo dzekurapa dzeSADC dzakatenderwa neshopu dzemishonga dzine miedzo yekukurumidza yeMalaria (RDT) nemishonga yekutanga yeArtemisinin combo (ACT).',
    directionLabel: 'Tsvaga Nzira',
    distanceLabel: 'Chinhambwe',
    hoursLabel: 'Maawa ekushanda',
    serviceLabel: 'Basa Guru',
    callCenterText: 'Musha wekufonera weSADC weMalaria weKukurumidza',
    emergencyDirectLine: 'Nharembozha yeMukoti yeKukurumidza (Yemahara)',
    symptomDurationLabel: 'Munyoro ave nenguva yakareba sei aine zviratidzo izvi?',
    symptomDurationSub: 'Kuziva kureba kwezviratidzo kune pfungwa yakakura kwazvo mune zvehutano. Malaria ikaramba iripo kweinopfuura maawa makumi manomwe nemaviri (72) pasina kurapwa nemushonga weArtemisinin, inogona kukanganisa pfungwa nemapapu.',
    approxDurationSelect: '1. Sarudza Nguva Inofungidzirwa',
    daysOption: 'mazuva aripo',
    selectExactCalendar: '2. Kana Kuti Sarudza Zuva Kwarakarorwa muKarendari',
    patientCityLabel: '3. Guta kana Dunhu reMurwere Izvezvi',
    riskMappingActive: 'Kutarisa Migwagwa neNzvimbo Kwasimbiswa',
    quickPresetsLabel: 'Kusarudza Dunhu Kwekukurumidza:',
    backBtn: 'Kudzoka',
    nextBtn: 'Mberi',
    analyzeRiskBtn: 'Ongorora Njodzi & Gadzira Mhedzisiro',
    dangerGroupWarningTitle: 'RUZIVO KWEVANODINGA RUBATSIRO RWAKASIMBA RWAZARURWA',
    dangerGroupWarningDesc: 'Murwere mwana mudiki kana mukadzi akazvitakura. Mitemo yekiriniki inoti anofanira kuenda kuchipatara kukurumidza kunyangwe muviri usingapisi zvakanyanya.',
    feverNoteAlert: 'YAMBIRO YEKURAPA KWEKIRINIKI',
    noDangerSignsSelected: 'Hapana chiratidzo chenjodzi yakasimba chinosarudzwa parizvino.',
    signOffTitle: 'Chikamu chekuongorora neKusimbisa kwaChiremba',
    signOffSub: 'Kuchengetedza kusimbisa mhedzisiro wekurapa nedigital',
    signOffDesc: 'Iwe uri chiremba akanyoreswa, mukoti, kanamushandi wehutano wemunharaunda? Unogona kudzokorora mhedzisiro idzi, kunyora maonero ako ekiriniki kusanganisira nekusimbisa ongororo iyi nedigital.',
    clinicianNameLabel: 'Zita Guru raChiremba / Zvitifiketi zvowo',
    clinicianNamePlaceholder: 'Semuenzaniso: Dr. Nyasha Moyo, MD',
    facilityLabel: 'SADC Facility Association',
    facilityPlaceholder: 'Semuenzaniso: Chiremba weHarare Central Hospital',
    advisoryNotesLabel: 'Clinical Advisory Notes & Directives',
    advisoryNotesPlaceholder: 'Nyora mazano ekurapa, mishonga, kana dambudziko rekuve nemambure kudzivirira...',
    signOffBtn: 'Simbisa neKupa Mapepa ehutano ayo Akasimbiswa',
    clinicallyVerifiedHeader: 'MHEDZISIRO YEMARAPIRWO AKASIMBISWA NEKIRINIKI',
    digitalSignatureLabel: 'Kusaina Kwedigital:',
    reviseSignOffBtn: 'Kugadziridza Kusaina',
    clinicianRequiredAlert: 'Ndokumbira upfeve zita raChiremba kuti usimbise.',
    feedbackTitle: 'Nyora pfungwa pamusoro peUvheneki hwenyu',
    feedbackSubtitle: 'Zvamunotaura zvinobatsira vakurunguri veSADC pakugadzirisa hwaro hwematanho ekuvheneka nekurapa kune vari pedyo nemi.',
    feedbackRatingLabel: 'Star Rating (1 to 5):',
    feedbackCommentLabel: 'Comments or Clinical Observations (Optional):',
    feedbackCommentPlaceholder: 'Enter any feedback, clinic routing clarity, or specific observation details here...',
    feedbackSubmitBtn: 'Tumira Mhinduro yeChirongwa',
    feedbackSubmittingBtn: 'Kutumira Mhinduro parizvino...',
    feedbackSuccessMsg: 'Maita basa! Mhinduro yenyu yakachengetedzwa zvakanaka kwazvo kuseva yedu kuti iongororwe muzveutano.',
    feedbackRequiredAlert: 'Ndokumbirausarudze nhamba yenyeredzi usati watumira.'
  }
};
