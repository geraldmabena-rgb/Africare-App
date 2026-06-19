import { Question } from '../types';

export const MALARIA_QUESTIONS: Question[] = [
  {
    id: 'fever',
    category: 'symptom',
    text: 'Are you currently experiencing an elevated body temperature or active fever?',
    text_nde: 'Uke wezwa umzimba wakho utshisa kakhulu kumbe ulesikhuhlane esilomkhuhlane otshisayo lamanje?',
    text_sho: 'Uri kunzwa kupisa kwemuviri kwakanyanya kana kuti fivha panguva ino?',
    info: 'A high, fluctuating temperature (>37.5°C/99.5°F) is the single most common symptom of malaria infection, often occurring in cyclical spikes.',
    info_nde: 'Ukutshisa komzimba okuphezulu kakhulu (>37.5°C) yisibonakaliso esivame kakhulu somkhuhlane we-malaria, esivame ukubuya ngokhetho zikhathi ezithile.',
    info_sho: 'Kupisa kwemuviri kwakanyanya (kudarika 37.5°C) ndicho chiratidzo chinonyanyozivikanwa cheMalaria.',
    type: 'single-choice',
    options: [
      { label: 'Yes, high or fluctuating fever', label_nde: 'Ehe, umkhuhlane otshisayo kakhulu kumbe oguquguqukayo', label_sho: 'Ehe, kupisa kwakanyanya kana kuchichinjachinja', value: 'high_fever', score: 3 },
      { label: 'Yes, mild or low-grade hotness', label_nde: 'Ehe, ukutshisa komzimba okulula', label_sho: 'Ehe, kupisa kushoma', value: 'mild_fever', score: 2 },
      { label: 'No fever', label_nde: 'Hayi, akula mkhuhlane otshisayo', label_sho: 'Aiwa, hapana fivha', value: 'none', score: 0 }
    ]
  },
  {
    id: 'chills',
    category: 'symptom',
    text: 'Have you experienced severe chills, rigors, or uncontrollable shivering?',
    text_nde: 'Uke waqhaqhazela ngomkhuhlane wamakhaza amakhulu kumbe ukungcangcazela okungabambekiyo?',
    text_sho: 'Uri kunzwa kubvunda nemuviri zvakanyanya kana kutonhora kusingadzoreki?',
    info: 'Malaria fever spikes are typically preceded by intense cold stages with shivering (chills/rigors), followed by a hot sweating stage as the temperature drops.',
    info_nde: 'Umkhuhlane otshisayo we-malaria uvame ukuqalisa ngokugodola kakhulu lokuqhaqhazela, kulandele isigaba sokujuluka umzimba usubanda.',
    info_sho: 'Kupisa kweMalaria kunowanzotanga nekutonhora nekubvunda zvakanyanya, kwozoteverwa nekubuda dikita muviri paunotanga kuderera kupisa.',
    type: 'single-choice',
    options: [
      { label: 'Yes, frequent severe shaking chills', label_nde: 'Ehe, ukuqhaqhazela kakhulu kwamakhaza njalonjalo', label_sho: 'Ehe, kubvunda nekutonhora zvakanyanya ruzhinji rwezvenguva', value: 'severe_chills', score: 3 },
      { label: 'Yes, mild sensitivity to cold', label_nde: 'Ehe, ukugodolanyana okulula', label_sho: 'Ehe, kutonhorwa zvishoma', value: 'mild_chills', score: 1 },
      { label: 'No chills', label_nde: 'Hayi, akula kuqhaqhazela kumbe makhaza', label_sho: 'Aiwa, hapana kutonhora', value: 'none', score: 0 }
    ]
  },
  {
    id: 'headache',
    category: 'symptom',
    text: 'Are you experiencing a moderate to severe headache?',
    text_nde: 'Uhlutshelwa yizinhloko ezibuhlungu kakhulu kumbe ezisemaphakathi?',
    text_sho: 'Uri kurwadziwa nemusoro zviri pakati nepakati kana zvakanyanya?',
    info: 'Headaches associated with malaria often feel throbbing and pervasive, triggered by the body\'s intense immune response to multiplying parasites.',
    info_nde: 'Ukubuhlungu kwekhanda le-malaria kuvame ukutswina lokutshaya kakhulu, kubangelwa yindlela umzimba olwa ngayo lezinanakazane.',
    info_sho: 'Kutsinha nemusoro kuri mune zveMalaria kunowanzonzwika sekuvhara nekuvhura nemusoro kwakanyanya.',
    type: 'single-choice',
    options: [
      { label: 'Yes, intense throbbing headache', label_nde: 'Ehe, ikhanda elibuhlungu kakhulu elitswinayo', label_sho: 'Ehe, kurwadziwa nemusoro kwakanyanya', value: 'severe_headache', score: 2 },
      { label: 'Yes, mild or dull headache', label_nde: 'Ehe, ikhanda elibuhlungu kancane', label_sho: 'Ehe, kurwadziwa nemusoro zvishoma', value: 'mild_headache', score: 1 },
      { label: 'No headache', label_nde: 'Hayi, akula khanda elibuhlungu', label_sho: 'Aiwa, hapana kurwadziwa nemusoro', value: 'none', score: 0 }
    ]
  },
  {
    id: 'body_aches',
    category: 'symptom',
    text: 'Do you have deep muscle, joint, or generalised body aches?',
    text_nde: 'Ulezinhlungu ezijulileyo ezicubwini zenyama, emalungwini, kumbe emzimbeni wonke?',
    text_sho: 'Une marwadzo akadzika emhasuru, majoini, kana kurwadziwa nemuviri wese?',
    info: 'Sufferers frequently report severe fatigue paired with deep muscular pain or joint stiffness, similar to flu, but often more debilitating.',
    info_nde: 'Abagulayo bavame ukubika ukukhathala okukhulu kanye lobuhlungu emalungwini, okufana lomkhuhlane wemvula kodwa wona ubuhlungu bakhona budlulele.',
    info_sho: 'Varwere vanowanzotaura nezvekuneta kwakanyanya pamwe chete nemarwadzo akadzika emhasuru kana kuoma kwemajoini.',
    type: 'single-choice',
    options: [
      { label: 'Yes, severe musculoskeletal pain & fatigue', label_nde: 'Ehe, ukukhathala kakhulu lobuhlungu emalungwini lenyameni', label_sho: 'Ehe, marwadzo akanyanya emhasuru nekuneta', value: 'severe_aches', score: 2 },
      { label: 'Yes, mild stiffness or tiredness', label_nde: 'Ehe, ukuqina kumbe ukukhathalanyana okulula', label_sho: 'Ehe, kuoma kana kuneta kushoma', value: 'mild_aches', score: 1 },
      { label: 'No aches', label_nde: 'Hayi, akula zinhlungu emzimbeni', label_sho: 'Aiwa, hapana marwadzo', value: 'none', score: 0 }
    ]
  },
  {
    id: 'nausea',
    category: 'symptom',
    text: 'Are you experiencing nausea, vomiting, or stomach upset?',
    text_nde: 'Ulezizwe lofuna ukuhlanza, udidizeleka, kumbe isisu esigitshelweyo/esibuhlungu?',
    text_sho: 'Uri kunzwa kuda kurutsa, kurutsa kwacho, kana kushushikana mudumbu?',
    info: 'Malaria can trigger stomach irritation, loss of appetite, vomiting, and diarrhea. This is especially common in children and can quickly lead to dangerous dehydration.',
    info_nde: 'I-malaria ingabangela isisu esigitshelweyo, ukulahlekelwa yisifiso sokudla, ukuhlanza, lesihudo. Lokhu kuvame kakhulu ebantwaneni njalo kulesandla sokuqeda amanzi emzimbeni.',
    info_sho: 'Malaria inogona kukonzera kusvotwa mudumbu, kusada kudya, kurutsa, kana manyoka.',
    type: 'single-choice',
    options: [
      { label: 'Yes, nausea with active vomiting/diarrhea', label_nde: 'Ehe, isicanucanu lokuhlanza kumbe isihudo esibhubhayo', label_sho: 'Ehe, kuda kurutsa pamwe nekutovanza kana manyoka', value: 'active_gi', score: 2 },
      { label: 'Mild nausea/loss of appetite only', label_nde: 'Isicanucanu esilula kumbe ukungafisi ukudla kuphela', label_sho: 'Kusvotwa kushoma kana kusada kudya chete', value: 'mild_gi', score: 1 },
      { label: 'No digestive symptoms', label_nde: 'Hayi, isisu singakhathazeki', label_sho: 'Aiwa, hapana zviratidzo mudumbu', value: 'none', score: 0 }
    ]
  },
  {
    id: 'critical_signs',
    category: 'severity',
    text: 'Do you or the patient have any of these urgent danger signs?',
    text_nde: 'Wena kumbe umguli ulezibonakaliso eziyisixwayiso zengozi enkulu ezilandelayo?',
    text_sho: 'Iwe kana munhu arikurwara mune chimwe chezviratidzo zvenjodzi zvekukasira izvi?',
    info: 'WARNING: The presence of even one of these signs suggests severe malaria. If selected, please suspend self-evaluation and locate an emergency clinical ward immediately.',
    info_nde: 'UXWAYISO: Ukuba lesibonakaliso ngitsho sibe sinye kulezi kutshengisa umkhuhlane we-malaria oyingozi kakhulu. Uma sikhethiwe, sicela ume lokhu ucinge isibhedlela msinyane.',
    info_sho: 'YAMBIRO: Kuve neimwe chete yezviratidzo izvi kunoratidza Malaria yakanyanya. Ndokumbirawo ushudze tsvakurudzo uende kuchipatara kwekukurumidza.',
    type: 'multi-select',
    options: [
      { label: 'Extreme weakness (Unable to sit up, stand, or walk without assistance)', label_nde: 'Ubuthaka obudluleleko (Uhluleka ukuhlala, ukuma kumbe ukuhamba ungasizwanga)', label_sho: 'Kuneta kwakanyanya (Kutadza kugara, kumira, kana kufamba usina kubatsirwa)', value: 'extreme_weakness', score: 10, isCritical: true },
      { label: 'Altered consciousness (Severe confusion, delirium, sleepiness, or convulsions)', label_nde: 'Ukulahlekelwa ngqondo kube yingozi (Ukudideka kabuhlungu, ukungazwisisi, ubuthongo obukhulu, kumbe ukuquleka)', label_sho: 'Kutaura nekufunga zvisinganzwisisike (Kuvhiringika kwepfungwa, kurara ruzhinji kana kuquleka)', value: 'altered_mental', score: 10, isCritical: true },
      { label: 'Respiratory distress (Difficulty breathing, rapid chest movements, or severe panting)', label_nde: 'Ukuhlupheka ekuphefumuleni (Ubunzima bokuphefumula, isifuba esitshaya msinyane kakhulu)', label_sho: 'Kutadza kufema zvakanaka (Kutadza kufema, kufemera pamusoro kana kufemesa)', value: 'difficulty_breathing', score: 10, isCritical: true },
      { label: 'Persistent vomiting (Inability to retain any liquids, oral medication, or food)', label_nde: 'Ukuhlanza okungapheliyo (Ukuhluleka ukubamba amanzi, amaphilisi kumbe ukudla)', label_sho: 'Kurutsa kusingaperi (Kutadza kumedza mvura, mishonga, kana chikafu)', value: 'persistent_vomiting', score: 10, isCritical: true },
      { label: 'Signs of jaundice or internal bleeding (Yellow eyes/skin, or extremely dark/cola-colored urine)', label_nde: 'Izibonakaliso ze-jaundice kumbe ukopha (Amehlo aphuzi kakhulu, kumbe umchapo omnyama ofana le-cola)', label_sho: 'Zviratidzo zveJaundice kana kubuda ropa mukati (Maziso/ganda reyero, kana weti yakasviba zvakanyanya)', value: 'jaundice_dark_urine', score: 10, isCritical: true }
    ]
  },
  {
    id: 'travel_risk',
    category: 'risk',
    text: 'Have you been in a malaria-endemic region in the past 4-6 weeks?',
    text_nde: 'Uke wavakashela kumbe ukuhlala ezindaweni ezilomkhuhlane we-malaria emavikini ama-4 kuya kwayi-6 adlulileyo?',
    text_sho: 'Wakasvika kudunhu rine Malaria yakanyanya mumavhiki mana kana matanhatu (4-6) adfuura?',
    info: 'The incubation period for malaria is typically 7 to 30 days. Travel or residing in high-risk tropical areas significantly increases probability.',
    info_nde: 'Isikhathi sokufekela kwe-malaria sivame emalangeni ayi-7 kuya kwayi-30. Ukuhlala kumbe ukuya ezindaweni ezilengozi kuphakamisa amathuba kakhulu.',
    info_sho: 'Nguva yekuratidza zviratidzo zveMalaria inowanzotanga kubva pamazuva 7 kusvika kune 30.',
    type: 'single-choice',
    options: [
      { label: 'Yes, I live in or recently visited a high-malaria zone', label_nde: 'Ehe, ngihlala kumbe ngisanda kuvakasha endaweni ye-malaria ephezulu', label_sho: 'Ehe, ndinogara kana nguva pfupi yadarika ndakashanyira nzvimbo ine Malaria yakanyanya', value: 'high_exposure', score: 5 },
      { label: 'Yes, but I consistently used insect repellent, nets, or prophylaxis', label_nde: 'Ehe, kodwa ngasebenzisa inetha, amafutha okuxosha imiyane kumbe amaphilisi', label_sho: 'Ehe, asi ndakashandisa mambure nemishonga kudzivirira', value: 'some_exposure', score: 2 },
      { label: 'No travel to malaria zones', label_nde: 'Hayi, angiyanga ezindaweni ezilomkhuhlane we-malaria', label_sho: 'Aiwa, handina kuenda kunzvimbo ine Malaria', value: 'no_exposure', score: 0 }
    ]
  },
  {
    id: 'mosquito_exposure',
    category: 'risk',
    text: 'Have you been exposed to mosquito bites or stayed near stagnant water without an insect net?',
    text_nde: 'Uke walunywa ngemiyane kumbe ukuhlala eduze lamanzi amileyo ungalali ngaphansi kwenetha yomiyane?',
    text_sho: 'Wakarumwa nemhutu kana kugara pedyo nemvura yakamira usina mambure ekudzivirira?',
    info: 'Malaria is contracted via the bite of an infected female Anopheles mosquito. Sleeping without a Long-Lasting Insecticidal Net (LLIN) or living near standing water (breeding sites) greatly elevates the transmission risk.',
    info_nde: 'Umkhuhlane we-malaria utholakala ngokulunywa ngumiyane wensikazi we-Anopheles olesifo. Ukulala ungalanga ngetha elomuthi kumbe ukuhlala eduze lamanzi amileyo kwenza ube sengozini enkulu.',
    info_sho: 'Malaria inouya nekuda kwekurumwa neAnopheles mhutu yehadzi ine chirwere. Kurara usina mambure ane mushonga kunowedzera mukana wekubatwa nechirwere.',
    type: 'single-choice',
    options: [
      { label: 'Yes, frequent bites or sleeping without a net', label_nde: 'Ehe, ukulunywa njalonjale kumbe ukulala ngaphandle kwenetha', label_sho: 'Ehe, kurunwa nemhutu ruzhinji rwezvenguva kana kurara usina mambure', value: 'high_exposure_bites', score: 4 },
      { label: 'Yes, but I sleep under a treated net and use repellent', label_nde: 'Ehe, kodwa ngilala ngaphansi kwenetha njalo ngisebenzisa imithi yokuxosha emiyane', label_sho: 'Ehe, asi ndinorara mumambure ane mushonga zvakare', value: 'safe_exposure', score: 1 },
      { label: 'No known bites or stagnant water nearby', label_nde: 'Hayi, akula kulunywa loba manzi amileyo eduze', label_sho: 'Aiwa, hapana mhutu kana mvura yakamira', value: 'no_exposure_bites', score: 0 }
    ]
  },
  {
    id: 'risk_demographic',
    category: 'risk',
    text: 'Does the patient belong to any of these high-priority groups?',
    text_nde: 'Umguli ungena kukunye kwala maqembu asengozini ephezulu yomkhuhlane?',
    text_sho: 'Muguli uyu ari muboka ripi pane asengozini?',
    info: 'Malaria progresses extremely fast in vulnerable people. Pregnant women, infants under 5, and adults with low immunity require immediately aggressive diagnostic protocols.',
    info_nde: 'I-malaria ikhula msinyane kakhulu kubantu ababuthakathaka. Owasifazane okhulelweyo, abantwana abangaphansi kweminyaka emihlanu (5) badinga ukuhlolwa okusheshayo.',
    info_sho: 'Malaria inokura nekukasira kune vanotambura zvakanyanya semadzimai akazvitakura nevana vari pasi pemakore 5.',
    type: 'single-choice',
    options: [
      { label: 'Pregnant woman', label_nde: 'Owasifazane okhulelweyo', label_sho: 'Mukadzi akazvitakura', value: 'pregnant', score: 4 },
      { label: 'Child under 5 years of age', label_nde: 'Umtwana ongaphansi kweminyaka emihlanu (5)', label_sho: 'Mwana ari pasi pemakore 5', value: 'child', score: 4 },
      { label: 'No, adult with standard risk profile', label_nde: 'Hayi, ngumuntu omdala olesimo esijwayelekileyo', label_sho: 'Aiwa, munhu mukuru ane mamiriro akajairika', value: 'standard_adult', score: 1 }
    ]
  }
];

export const PRE_VETTED_CLINICS: { name: string; region: string; distance: string; phone: string; hours: string; service: string }[] = [
  { name: 'AfriCare Central Clinic & Lab', region: 'Harare Metropolitan', distance: '1.2 km', phone: '+263 242 701 440', hours: '24/7 Care & Rapid Testing', service: 'Full diagnostic microscopy, RDT testing, ACT therapy replenishment' },
  { name: 'Zambezi River Basin Health Post', region: 'Matebeleland North', distance: '4.8 km', phone: '+263 13 44820', hours: '08:00 - 17:00 Daily', service: 'Rapid diagnostic screening (RDT) & community primary support' },
  { name: 'Chitungwiza District Referral Hospital', region: 'Mashonaland East', distance: '7.5 km', phone: '+263 270 21541', hours: '24 Hours Emergency', service: 'Severe malaria management, pediatric ICU, intravenous artesunate' },
  { name: 'Mutare Foothills Treatment Centre', region: 'Manicaland Province', distance: '12.0 km', phone: '+263 20 64223', hours: '07:30 - 18:30 Daily', service: 'Rapid tests, mosquito net distribution, preventative prophylaxis counseling' },
  { name: 'Gweru Provincial Health Lab', region: 'Midlands Province', distance: '15.2 km', phone: '+263 54 222401', hours: '08:00 - 16:30 Mon-Fri', service: 'Accredited parasite blood-smear microscopy & PCR secondary analysis' }
];
