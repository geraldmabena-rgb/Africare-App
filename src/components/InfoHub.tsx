import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle, 
  Activity, 
  Trash2, 
  Droplets, 
  Home, 
  Sparkles,
  Bookmark,
  ChevronDown,
  Info
} from 'lucide-react';

interface InfoSection {
  title: string;
  desc: string;
  icon: any;
  bullets: string[];
}

interface InfoHubProps {
  language?: 'en' | 'nde' | 'sho';
}

export default function InfoHub({ language = 'en' }: InfoHubProps) {
  const [activeTab, setActiveTab] = useState<'prevention' | 'treatment' | 'myths'>('prevention');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const preventionModulesEN: InfoSection[] = [
    {
      title: 'Vector Population Control',
      desc: 'Mosquitoes breed in stagnant, shallow water reservoirs. Eliminating pools near your family compound breaks the developmental nursery.',
      icon: Droplets,
      bullets: [
        'Drain unmanaged puddles or fill muddy tracks with dry soil.',
        'Cover storage containers, laundry drums, and water tanks tightly with tight mesh covers.',
        'Clear weeds and grassy overgrowth near pathways to deny mosquitoes cool resting habitats.'
      ]
    },
    {
      title: 'Chemical Barriers (IRS)',
      desc: 'Indoor Residual Spraying (IRS) involves coating indoor structural walls with pre-approved eco-resilient insecticide layers.',
      icon: Home,
      bullets: [
        'Cooperates with local health teams to spray compound walls annually.',
        'Denies mosquitoes a flat vertical surface to rest on in active sleeping spaces.',
        'Keeps compounds secure for up to 6 months after direct professional coating.'
      ]
    },
    {
      title: 'Treated Bed Nets (LLINs)',
      desc: 'Long-Lasting Insecticide-treated Nets (LLINs) are the simplest and highest-yield medical protection asset available globally.',
      icon: ShieldCheck,
      bullets: [
        'Ensure children and pregnant mothers sleep under certified bed nets every night.',
        'Check for structural tears or holes and patch them promptly with cotton thread.',
        'Avoid hanging wet laundry or cooking assets too close to net linings to shield insecticide structures.'
      ]
    }
  ];

  const preventionModulesNDE: InfoSection[] = [
    {
      title: 'Ukunqoba Ukuphazama kweMiyane',
      desc: 'Imiyane izalela emanzini amileyo ayingenelwa moya. Ukususa amanzi amileyo eduze kwemizi kubhidliza impilo yemiyane.',
      icon: Droplets,
      bullets: [
        'Khipha amanzi amileyo loba ugcwalise inhlabathi eyomileyo.',
        'Vala zonke izitsha zamanzi, imigqomo, lo thangi ngama-net amabe makhulu.',
        'Susa ukhula lenyosi eduze lamasango kumbe emizini ukungenisa umoya.'
      ]
    },
    {
      title: 'Ukusafuza ngezikhali (IRS)',
      desc: 'Indoor Residual Spraying (IRS) kufaka phakathi ukusafuza kancane lamazonga ezindongeni zendlu ngomuthi womiyane.',
      icon: Home,
      bullets: [
        'Sebenzisana lenhloli zezempilo ukusafuza izindonga zendlu minyaka yonke.',
        'Kuvimbela imiyane ukuthi ithole indawo yokulala phakathi kwendawo yokulala.',
        'Kugcina imizi iphephile kuya kwayizinyanga eziyisithupha (6).'
      ]
    },
    {
      title: 'Ama-inetha Alomuthi (LLINs)',
      desc: 'Long-Lasting Insecticide-treated Nets (LLINs) ayindlela elula nenhle kakhulu yokuzivikela emhlabeni jikele.',
      icon: ShieldCheck,
      bullets: [
        'Qinisekisa ukuthi abantwana labomama abazithwaleyo balala ngaphansi kwenetha le mithi nsuku zonke.',
        'Hlola izimbobo uze uthunge msinyane ngentambo yekotoni.',
        'Gwema ukulengisa impahla emanzi eduze kwenetha kuze umuthi ungancibiliki.'
      ]
    }
  ];

  const preventionModulesSHO: InfoSection[] = [
    {
      title: 'Kudzora Huwandu hweMhutu',
      desc: 'Mhutu dzinovandira nekuberekera mumvura yakamira isingayerere. Kubvisa mvura iyi kunouraya mbereko yemhutu mudunhu.',
      icon: Droplets,
      bullets: [
        'Kudurura mvura yakamira kana kuzadza makomba ane dhaka nevhu rakaoma.',
        'Kuvhara midziyo yekuchengetera mvura, migodhi, nematangi emvura nemambure akasimba.',
        'Kuchenura masora nehuswa hurefu pedyo nenzira dzevanhu kudzivirira mhutu kugarapo.'
      ]
    },
    {
      title: 'Kupfapfaidza Mishonga (IRS)',
      desc: 'Kupfapfaidza mishonga mukati memba (IRS) kunosanganisira kuisa mishonga inochengetedza madziro asina kukuvadza utano.',
      icon: Home,
      bullets: [
        'Kushandira pamwe nemapazi ezvoutano mukupfapfaidza madziro mazuva ose pagore.',
        'Kudzivirira mhutu kuti dzisawane nzvimbo yekuzororera mumakamuri ekurara.',
        'Kuchengetedza dzimba kwemwedzi inosvika mitanhatu (6) mishonga yapfapfaidzwa nehunyanzvi.'
      ]
    },
    {
      title: 'Mambure ane Mushonga (LLINs)',
      desc: 'Mambure akagadzirwa ane mishonga inouraya mhutu (LLINs) ndiyo nzira iri nyore uye inoshanda zvakanyanya kudzivirira chirwere cheMalaria.',
      icon: ShieldCheck,
      bullets: [
        'Kuona kuti vana vadiki nevakadzi vane pamuviri varara mumambure ane mushonga mazuva ose.',
        'Kutarisa makomba mumambure uye kukurumidza kusonera neshinda yekotoni.',
        'Kudzivisa kusungirira nekuchengetera nhumbi dzakanyorova pedyo nemambure kuitira kudzivirira kusasika kwemushonga.'
      ]
    }
  ];

  const treatmentModulesEN: InfoSection[] = [
    {
      title: 'ACT Therapeutics',
      desc: 'Artemisinin-based Combination Therapies (ACTs) represent the gold-standard medical protocol to cure malaria.',
      icon: HeartHandshake,
      bullets: [
        'Rapidly wipes out Plasmodium parasites within the red blood cell stream.',
        'Must be finished entirely—even if fever disappears after the initial dose.',
        'Administered in precise age-weight cohorts at formal AfriCare health centers.'
      ]
    },
    {
      title: 'Diagnostic Pre-requisites',
      desc: 'AfriCare strictly mandates "Test Before Treating". Blind anti-malarial doses mask symptoms and fuel parasite mutations.',
      icon: Activity,
      bullets: [
        'Always complete a Rapid Diagnostic Test (RDT) or microscope blood-smear.',
        'Fever resembles other pathogens (Dengue, Typhoid, Viral infections). Only tests discern causes.',
        'Access testing kits for free at any pre-vetted provincial dispensary.'
      ]
    }
  ];

  const treatmentModulesNDE: InfoSection[] = [
    {
      title: 'Izigaba zomuthi ze-ACT',
      desc: 'Artemisinin-based Combination Therapies (ACTs) zimelele indlela eqondileyo nenhle kakhulu emhlabeni yokwelapha i-malaria.',
      icon: HeartHandshake,
      bullets: [
        'Ibulala izilwanyana zomkhuhlane we-malaria egazini msinyane kakhulu.',
        'Kumele uqede muthi wonke — noma nxa umkhuhlane usunqumfile.',
        'Inikwa ngokweminyaka lobunzima bomzimba ezibhedlela ze-AfriCare.'
      ]
    },
    {
      title: 'Uhlolo ngaphambi kokwelatshwa',
      desc: 'I-AfriCare iqinisekisa umthetho wokuthi "Hlola ngaphambi kokunika umuthi". Ukusebenzisa umuthi ungahlolwanga kubangela imiyane ukuba lamandla okungabulala umuthi.',
      icon: Activity,
      bullets: [
        'Hlola ngama-RDT kumbe micro-scope isikhathi sonke.',
        'Umkhuhlane we-malaria uyafana lemikhuhlane eminingi (Dengue, Typhoid). Hlola isikhathi sonke.',
        'Thola ama-kit okuhlola mahhala ezibhedlela zethu zesifunda.'
      ]
    }
  ];

  const treatmentModulesSHO: InfoSection[] = [
    {
      title: 'Kurapa neACT Tablets',
      desc: 'Mishonga yeACT (Artemisinin-Combination Therapies) ndiyo nzira inoshanda uye inokurudzirwa padanho repamusoro mukurapa Malaria.',
      icon: HeartHandshake,
      bullets: [
        'Kukurumidza kuuraya zvipembenene zvePlasmodia zvinoderedza masero matsvuku muropa.',
        'Pedza mishonga yese zvizere—kunyangwe kupisa kwemuviri kukapera mazuva ekutanga.',
        'Mishonga inovhenekwa nekuiswa zvichienderana nezera nehuremu hwenyu mumakiriniki eAfriCare.'
      ]
    },
    {
      title: 'Kuvhenekwa Nguva Dzose',
      desc: 'AfriCare inotsigira kutevedzera chirongwa che "Vhenekwa Usati Warapwa". Kunwa mishonga usina kuvhenekwa kunoita kuti utachiona hudzidzire kurwisa mishonga.',
      icon: Activity,
      bullets: [
        'Nguva dzose vhenekwa neRapid Diagnostic Test (RDT) kana vheneko yeropa nerubatsiro rwemicroscope.',
        'Kupisa kwemuviri kunofana nezvimwe zvirwere (seTyphoid kana fivha yemusoro). Kuvhenekwa chete kunovimbisa izvo.',
        'Midziyo yekuvhenekesa iyi inowanikwa pachena pasina muripo mumakiriniki akazvinyoresa.'
      ]
    }
  ];

  const malariaFAQsEN = [
    {
      question: 'Is malaria contagious from person to person?',
      answer: 'No. Malaria cannot be transmitted directly between humans like a cold or flu. It requires the female Anopheles mosquito vector to bite an infected donor, incubate the parasite, and subsequently inject it into another person\'s bloodstream.'
    },
    {
      question: 'Can drinking herbal infusions or lemon juice cure malaria?',
      answer: 'Absolutely not. While herbal teas can support hydration, they do not kill the Plasmodium parasite. Malaria is a severe blood infection that requires highly specialized Artemisinin tablets. Delaying specific pharmaceutical treatment to rely on home remedies can lead to dangerous organ dysfunction or brain infection (cerebral malaria).'
    },
    {
      question: 'Does malaria only occur during the rainy season?',
      answer: 'While mosquito populations surge dramatically during wet months due to abundant breeding puddles, malaria transmission occurs year-round in hot tropical environments. Guarding bedroom compounds under LLIN nets and spraying walls should remain continuous habits.'
    },
    {
      question: 'Why are pregnant women and young kids at higher risk?',
      answer: 'Pregnancy naturally dampens the woman\'s immune system, allowing malaria to multiply rapidly, which can cause severe maternal anemia and low infant birth weight. Children under five have not yet built up partial immunity to the parasite, leaving them sensitive to severe neurological and systemic complications.'
    }
  ];

  const malariaFAQsNDE = [
    {
      question: 'Umkhuhlane we-malaria uyathelelana emntwini uya komunye?',
      answer: 'Hayi. Malaria ayithelelani phakathi kwabantu njengomkhuhlane wemvula. Idinga umwane we-female Anopheles ukuba ulume umuntu olesifo, uvuselele isilwanyane sakhona, uze ube usujindela egazini lomunye umuntu.'
    },
    {
      question: 'Ukulungisa umuthi womkhuhlane wasekhaya kumbe ijusi kalamula kuyayelapha i-malaria?',
      answer: 'Hayi khona. Imithi yesintu isekela amanzi emzimbeni, kodwa ayingqobi isilwanyane sayo i-Plasmodium. Malaria isifo segazi esidinga amaphilisi ancedisayo e-Artemisinin. Ukulawula imithi yasekhaya kungabangela ingozi enkulu njengomkhuhlane we-malaria obhebha ebuchopheni (cerebral malaria).'
    },
    {
      question: 'I-malaria yenzeka ngesikhathi sezulu sezimvula kuphela?',
      answer: 'Nakhona izibalo zemiyane ziphakama ngesikhathi sezulu samanzi amaningi, ukuthela kwe-malaria kwenzeka unyaka wonke ezindaweni ezitshisayo. Hlala ulala ngaphansi kwenetha yomethi we-LLIN uphinde usafuze izindonga uze ukwenze kube ngumkhuba wempilo yakho yonke.'
    },
    {
      question: 'Kungani omama abazithwaleyo labantwana abancane basengozini ephezulu?',
      answer: 'Ukuzithwala kunciphisa amandla omzimba womama okulwa lezifo, okubangela i-malaria ukuba ikhule msinyane emzimbeni wabo; lokhu kudala ukusilela kwegazi komama lowoxhakeko lomntwana. Abantwana abangaphansi kweminyaka emihlanu (5) bona abakaziphaphamisi amandla emizimbeni yabo ukulwa lesi sithole.'
    }
  ];

  const malariaFAQsSHO = [
    {
      question: 'Malaria inotapukira kubva kumunhu kuenda kune mumwe zvakananga here?',
      answer: 'Aiwa. Malaria haitapuriranwe pakati pevanhu sefuruwenza. Inoda mhutu yehadzi inonzi Anopheles inoruma munhu ane chirwere, yotakura utachiona, yozoisa muropa remumwe munhu.'
    },
    {
      question: 'Kunwa makwenzi kana muto wemamon inorapa Malaria?',
      answer: 'Aiwa, zvachose haidaro. Mapisarema kana makwenzi anobatsira kapa muviri mvura, asi haauraye utachiona hwePlasmodium. Malaria inoda mapiritsi chaiwo eACT. Kunonoka kurapwa kunogona kukonzera rufu kana kukanganisa uropi.'
    },
    {
      question: 'Malaria inowanikwa panguva yekunaya kwemvura chete here?',
      answer: 'Kunyangwe huwandu hwemhutu huchiwanda panguva yekunaya kwemvura nekuda kwemadziva akamira, kupararira kweMalaria kunogona kuitika gore rese munzvimbo dzinopisa. Ramba uchishandisa mambure mazuva ose.'
    },
    {
      question: 'Sei vakadzi vane pamuviri nevana vadiki vari panjodzi huru?',
      answer: 'Kuva nepamuviri kunoderedza simba remuviri remadzimai kudzivirira zvirwere, zvichiita kuti Malaria iande nekukasira zvichisvitsa pakushomeka kweropa. Vana vari pasi pemakore 5 havana masimba ekuzvidzivirira akasimba, saka vakanyanya kutadza kukurira dambudziko iri.'
    }
  ];

  const isNdebele = language === 'nde';
  const isShona = language === 'sho';
  const preventionModules = isNdebele ? preventionModulesNDE : isShona ? preventionModulesSHO : preventionModulesEN;
  const treatmentModules = isNdebele ? treatmentModulesNDE : isShona ? treatmentModulesSHO : treatmentModulesEN;
  const malariaFAQs = isNdebele ? malariaFAQsNDE : isShona ? malariaFAQsSHO : malariaFAQsEN;

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
        <BookOpen className="w-5 h-5 text-emerald-800" />
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-sans tracking-tight">
            {isNdebele ? 'Isikhungo Solwazi lwe-Malaria' : isShona ? 'Nzvimbo dzoRuzivo rweMalaria' : 'Malaria Prevention & Care Info Hub'}
          </h3>
          <p className="text-[10px] text-stone-400 font-mono">
            {isNdebele ? 'IVANAUTANO KNOWLEDGE DIRECTORY CORE' : isShona ? 'VANA UTANO ruzivo rwechirwere madzinde' : 'VANAUTANO COMMUNITY MEDICAL KNOWLEDGE ENGINE'}
          </p>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl">
        <button
          onClick={() => setActiveTab('prevention')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'prevention' 
              ? 'bg-stone-900 text-white shadow-xs' 
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {isNdebele ? 'Ukuvimbela' : isShona ? 'Kudzivirira' : 'Prevention'}
        </button>
        <button
          onClick={() => setActiveTab('treatment')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'treatment' 
              ? 'bg-stone-900 text-white shadow-xs' 
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {isNdebele ? 'Ukwelapha' : isShona ? 'Kukurapa' : 'Treatment'}
        </button>
        <button
          onClick={() => setActiveTab('myths')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'myths' 
              ? 'bg-stone-900 text-white shadow-xs' 
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {isNdebele ? 'Manga vs Eqinisweni' : isShona ? 'Nhema vs Chokwadi' : 'Myths vs Facts'}
        </button>
      </div>

      <div className="min-h-[285px]">
        {activeTab === 'prevention' && (
          <div className="space-y-4">
            {preventionModules.map((mod, i) => {
              const IconComp = mod.icon;
              return (
                <div key={i} className="p-4 bg-stone-50 border border-stone-100 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-850 flex items-center justify-center">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-stone-850">{mod.title}</h4>
                  </div>
                  <p className="text-xs text-stone-500 leading-normal">{mod.desc}</p>
                  <ul className="list-disc pl-5 text-[11px] text-stone-600 space-y-1 pt-1 font-sans">
                    {mod.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'treatment' && (
          <div className="space-y-4">
            {treatmentModules.map((mod, i) => {
              const IconComp = mod.icon;
              return (
                <div key={i} className="p-4 bg-stone-50 border border-stone-100 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-850 flex items-center justify-center">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-stone-850">{mod.title}</h4>
                  </div>
                  <p className="text-xs text-stone-500 leading-normal">{mod.desc}</p>
                  <ul className="list-disc pl-5 text-[11px] text-stone-600 space-y-1 pt-1 font-sans">
                    {mod.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Warn box */}
            <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex gap-2.5 items-start">
              <Info className="w-4.5 h-4.5 text-red-700 shrink-0 mt-0.5" />
              <div className="text-[11px] text-red-900 leading-normal">
                {isNdebele ? (
                  <span>
                    <span className="font-bold">UKUXWAYISA OKUBALULEKILEYO:</span> WHO ivimbela ukusetyenziswa komuthi owodwa we Artemisinin omunye ube ungasetshenziswa. Kwelapha kumele kuhlanganise iziga ezimbili lomuthi (Combination Therapy) khona sizovimbela izilwanyana ukuba lamandla.
                  </span>
                ) : isShona ? (
                  <span>
                    <span className="font-bold">YAMBIRO YAKANIKIDZWA:</span> Sangano reWHO rinorambidza kushandisa murapa weArtemisinin koga usina kuhlanganiswa nemumwe mupanda wemushonga. Kurapa kunofanira kubatanidza mishonga miviri (Combination Therapy) kuitira kudzivisa utachiona kuzojaira mishonga.
                  </span>
                ) : (
                  <span>
                    <span className="font-bold">CRITICAL ADVISORY:</span> Artemisinin monotherapies are strictly banned by the WHO. Treatment must always combine two distinct medication actions (Combination Therapy) to protect drug longevity.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'myths' && (
          <div className="space-y-2.5">
            {malariaFAQs.map((faq, index) => {
              const isExpanded = expandedFAQ === index;
              return (
                <div 
                  key={index} 
                  className="border border-stone-100 rounded-2xl overflow-hidden transition-all bg-stone-50/50"
                >
                  <button
                    onClick={() => setExpandedFAQ(isExpanded ? null : index)}
                    className="w-full p-3 px-4 flex items-center justify-between text-left focus:outline-none cursor-pointer hover:bg-stone-50 transition"
                  >
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-800 shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-stone-100/50 text-xs text-stone-500 leading-relaxed bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-stone-100 bg-emerald-950/5 p-4 rounded-2xl flex items-start gap-3">
        <Sparkles className="w-4.5 h-4.5 text-emerald-800 shrink-0 mt-0.5 animate-pulse" />
        <div className="text-[11px] text-emerald-950 leading-relaxed font-sans">
          {isNdebele ? (
            <span>
              <span className="font-bold">Vikela iZimbabwe lamaLungu esifunda seSADC:</span> AfriCare ihambisa amanethi alomuthi wephepheleko njalo ithumela imizamo yokufundisa ruri ezindaweni zemaphandleni. Thumela leli-link kubakini ukubapha amandla.
            </span>
          ) : isShona ? (
            <span>
              <span className="font-bold">Dzivirirai muZimbabwe nematunhu akapoteredza eSADC:</span> AfriCare inogovera mambure ane mishonga uye inodzidzisa munharaunda dzekumaruwa. Goverai dundutso iri kuitira kuchengetedza hama dzenyu.
            </span>
          ) : (
            <span>
              <span className="font-bold">Protect Zimbabwe & SADC Communities:</span> AfriCare distributes insecticide-treated nets and conducts educational outreach across rural areas. Share this screening links to empower relatives.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
