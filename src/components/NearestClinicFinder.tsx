import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Compass, 
  Radio, 
  Navigation, 
  Activity, 
  Phone, 
  Clock, 
  ChevronRight, 
  Share2, 
  Siren, 
  Gauge, 
  Car, 
  FlameKindling,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Map,
  RotateCcw
} from 'lucide-react';

interface NearestClinicFinderProps {
  severityLevel: 'low' | 'moderate' | 'critical';
  onLog: (type: 'info' | 'success' | 'error' | 'outgoing' | 'incoming', title: string, desc: string) => void;
}

interface MockClinic {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  phone: string;
  hours: string;
  service: string;
  hasICU: boolean;
  canHandleCritical: boolean;
}

const EXTENDED_CLINICS: MockClinic[] = [
  { 
    id: 'clinic-1', 
    name: 'AfriCare Central Clinic & Lab', 
    region: 'Harare Metropolitan', 
    latitude: -17.8150, 
    longitude: 31.0450, 
    phone: '+263 242 701 440', 
    hours: '24/7 Care & Rapid Testing', 
    service: 'Full diagnostic microscopy, RDT testing, ACT therapy replenishment',
    hasICU: false,
    canHandleCritical: true
  },
  { 
    id: 'clinic-2', 
    name: 'Chitungwiza District Referral Hospital', 
    region: 'Mashonaland East', 
    latitude: -18.0080, 
    longitude: 31.0620, 
    phone: '+263 270 21541', 
    hours: '24 Hours Emergency Intake', 
    service: 'Severe malaria management, pediatric ICU, intravenous artesunate, high-volume resuscitation',
    hasICU: true,
    canHandleCritical: true
  },
  { 
    id: 'clinic-3', 
    name: 'Zambezi River Basin Health Post', 
    region: 'Matebeleland North', 
    latitude: -17.9150, 
    longitude: 25.8450, 
    phone: '+263 13 44820', 
    hours: '08:00 - 17:00 Daily', 
    service: 'Rapid diagnostic screening (RDT), community primary support & net distribution',
    hasICU: false,
    canHandleCritical: false
  },
  { 
    id: 'clinic-4', 
    name: 'Mutare Foothills Treatment Centre', 
    region: 'Manicaland Province', 
    latitude: -18.9620, 
    longitude: 32.6500, 
    phone: '+263 20 64223', 
    hours: '07:30 - 18:30 Daily', 
    service: 'Rapid tests, mosquito net distribution, preventative prophylaxis counseling',
    hasICU: false,
    canHandleCritical: false
  },
  { 
    id: 'clinic-5', 
    name: 'Gweru Provincial Health Lab', 
    region: 'Midlands Province', 
    latitude: -19.4520, 
    longitude: 29.8050, 
    phone: '+263 54 222401', 
    hours: '08:00 - 16:30 Mon-Fri', 
    service: 'Accredited parasite blood-smear microscopy & secondary clinical analysis',
    hasICU: false,
    canHandleCritical: true
  },
  {
    id: 'clinic-6',
    name: 'Ruwa Community Health Post',
    region: 'Mashonaland East',
    latitude: -17.8890,
    longitude: 31.2450,
    phone: '+263 273 21356',
    hours: '08:00 - 16:00 Daily',
    service: 'General rural triage, child under-5 monitoring, preventative mosquito treatment',
    hasICU: false,
    canHandleCritical: false
  },
  {
    id: 'clinic-7',
    name: 'Bulawayo Memorial Clinic',
    region: 'Matabeleland South',
    latitude: -20.1500,
    longitude: 28.5800,
    phone: '+263 9 72011',
    hours: '24 Hours Emergency Service',
    service: 'Advanced tertiary level anti-malarial infusions, clinical trial research protocols',
    hasICU: true,
    canHandleCritical: true
  }
];

interface LocationPreset {
  name: string;
  lat: number;
  lng: number;
  desc: string;
}

const LOCATION_PRESETS: LocationPreset[] = [
  { name: 'Harare CBD (Central)', lat: -17.8292, lng: 31.0522, desc: 'Metropolitan Core District' },
  { name: 'Chitungwiza Residential Block', lat: -18.0124, lng: 31.0815, desc: 'High-density Residential Zone' },
  { name: 'Mutare Foothills Sector', lat: -18.9740, lng: 32.6680, desc: 'Eastern Mountainous Outskirts' },
  { name: 'Victoria Falls Rural Post', lat: -17.9244, lng: 25.8572, desc: 'West Border Trans-frontier Zone' },
  { name: 'Gweru Industrial Area', lat: -19.4604, lng: 29.8143, desc: 'Industrial Midlands Plateau' }
];

type TransitMode = 'car' | 'ambulance' | 'walking';

const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <span class="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-emerald-400 opacity-60"></span>
        <div class="relative w-4.5 h-4.5 rounded-full bg-emerald-750 border-2 border-white flex items-center justify-center text-white shadow-md">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const createClinicIcon = (isCriticalCare: boolean, isSelected: boolean) => {
  const colorClass = isSelected ? 'bg-amber-500 font-sans' : isCriticalCare ? 'bg-red-650' : 'bg-emerald-950';
  const borderClass = isSelected ? 'border-amber-100 ring-2 ring-amber-400' : 'border-stone-100';
  const sizeClass = isSelected ? 'w-8 h-8 rounded-2xl' : 'w-6.5 h-6.5 rounded-xl';
  const iconSizeVal = isSelected ? 32 : 26;
  const shadowClass = isSelected ? 'shadow-lg' : 'shadow-sm';
  return L.divIcon({
    className: 'custom-clinic-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <span class="absolute inline-flex h-[18px] w-[18px] animate-pulse rounded-full ${isCriticalCare ? 'bg-red-300' : 'bg-emerald-100'} opacity-40"></span>
        <div class="relative ${sizeClass} ${colorClass} ${shadowClass} text-white flex items-center justify-center border-2 ${borderClass} transition-transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </div>
      </div>
    `,
    iconSize: [iconSizeVal, iconSizeVal],
    iconAnchor: [iconSizeVal / 2, iconSizeVal / 2],
    popupAnchor: [0, -10]
  });
};

export default function NearestClinicFinder({ severityLevel, onLog }: NearestClinicFinderProps) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customLat, setCustomLat] = useState<number>(-17.8292);
  const [customLng, setCustomLng] = useState<number>(31.0522);
  const [isAdvancedGeo, setIsAdvancedGeo] = useState(false);
  const [isSearchingGPS, setIsSearchingGPS] = useState(false);
  const [transitMode, setTransitMode] = useState<TransitMode>('car');
  const [simulationAlert, setSimulationAlert] = useState<string | null>(null);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);

  // Reference hooks for the Leaflet DOM node and the leaflet objects
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const routeLineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Active coordinates used for sorting calculations
  const activeLat = isAdvancedGeo ? customLat : LOCATION_PRESETS[selectedPresetIndex].lat;
  const activeLng = isAdvancedGeo ? customLng : LOCATION_PRESETS[selectedPresetIndex].lng;

  // Haversine formula to compute geodesic distances in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Trigger simulated hardware location search
  const handleAutoDetectGPS = () => {
    setIsSearchingGPS(true);
    onLog('outgoing', 'GPS Query Initiated', 'Requesting high-accuracy simulated satellite SADC coordinate lock...');
    
    setTimeout(() => {
      // Pick a random preset to simulate real response
      const randomIndex = Math.floor(Math.random() * LOCATION_PRESETS.length);
      setSelectedPresetIndex(randomIndex);
      setIsAdvancedGeo(false);
      setIsSearchingGPS(false);
      setSelectedClinicId(null); // Clear selected route overlay
      onLog('success', 'Satellite Lock Established', `Coordinated found. Nearest sector identified as ${LOCATION_PRESETS[randomIndex].name}.`);
    }, 1200);
  };

  // Sync preset changes
  const handlePresetChange = (index: number) => {
    setSelectedPresetIndex(index);
    setCustomLat(LOCATION_PRESETS[index].lat);
    setCustomLng(LOCATION_PRESETS[index].lng);
    setSelectedClinicId(null); // Clear selected route overlay
    onLog('info', 'Mock Location Registered', `User position simulated to ${LOCATION_PRESETS[index].name} (${LOCATION_PRESETS[index].lat.toFixed(4)}°S, ${LOCATION_PRESETS[index].lng.toFixed(4)}°E).`);
  };

  // Sort clinics based on active lat/lng and return Top 3 closest; memoized to prevent re-renders
  const rankedClinics = React.useMemo(() => {
    return EXTENDED_CLINICS.map(clinic => {
      const distanceKm = calculateDistance(activeLat, activeLng, clinic.latitude, clinic.longitude);
      
      // Calculate transit speed: Ambulance (75km/h), Car (50km/h), Walking (4.5km/h)
      let speedKmh = 50;
      if (transitMode === 'ambulance') speedKmh = 75;
      if (transitMode === 'walking') speedKmh = 4.5;

      const travelTimeMinutes = Math.round((distanceKm / speedKmh) * 60);

      return {
        ...clinic,
        distanceKm,
        travelTimeMinutes
      };
    })
    .sort((a, b) => {
      // If critical severity level, prioritize clinics that can handle critical cases, then sort by distance
      if (severityLevel === 'critical') {
        if (a.canHandleCritical && !b.canHandleCritical) return -1;
        if (!a.canHandleCritical && b.canHandleCritical) return 1;
      }
      return a.distanceKm - b.distanceKm;
    })
    .slice(0, 3);
  }, [activeLat, activeLng, transitMode, severityLevel]);

  // Leaflet Map Initialization Hook
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false
      }).setView([activeLat, activeLng], 9);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync Map Markers overlay, custom pins, and route drawings
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old clinic markers
    Object.keys(markersRef.current).forEach((clinicId) => {
      markersRef.current[clinicId].remove();
    });
    markersRef.current = {};

    // Clear user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    // Add high-accuracy user marker
    const userMarker = L.marker([activeLat, activeLng], {
      icon: createUserIcon()
    }).addTo(map).bindPopup('<b>Your Current Coordinates</b><br/>Simulated Center.');
    userMarkerRef.current = userMarker;

    // Generate clinic pins
    rankedClinics.forEach((clinic) => {
      const isSelected = clinic.id === selectedClinicId;
      const marker = L.marker([clinic.latitude, clinic.longitude], {
        icon: createClinicIcon(clinic.canHandleCritical, isSelected)
      }).addTo(map).bindPopup(`
        <div class="p-1 font-sans text-xs" style="min-width: 155px;">
          <h5 class="font-bold text-stone-900 leading-tight">${clinic.name}</h5>
          <p class="text-[10px] text-stone-500 mt-1 leading-normal">${clinic.service}</p>
          <div class="h-px bg-stone-100 my-1.5"></div>
          <div class="flex justify-between items-center text-[10px] text-stone-600 font-mono">
            <span>${clinic.distanceKm.toFixed(1)} km away</span>
            <span class="font-bold text-emerald-800">${clinic.travelTimeMinutes} mins</span>
          </div>
        </div>
      `);
      markersRef.current[clinic.id] = marker;
    });

    // Handle polyline route overlay
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    if (selectedClinicId) {
      const clinic = rankedClinics.find(c => c.id === selectedClinicId);
      if (clinic) {
        const routeColor = clinic.canHandleCritical ? '#dc2626' : '#059669';
        const polyline = L.polyline(
          [[activeLat, activeLng], [clinic.latitude, clinic.longitude]],
          {
            color: routeColor,
            weight: 3.5,
            dashArray: '6, 6',
            opacity: 0.9
          }
        ).addTo(map);
        routeLineRef.current = polyline;

        // Animate focus flyTo to view user and clinic
        const bounds = L.latLngBounds([[activeLat, activeLng], [clinic.latitude, clinic.longitude]]);
        map.flyToBounds(bounds.pad(0.25), { duration: 1.2 });

        // Trigger popup opening for the targeted clinic
        setTimeout(() => {
          if (markersRef.current[selectedClinicId]) {
            markersRef.current[selectedClinicId].openPopup();
          }
        }, 1250);
      }
    } else {
      // Auto-fit bounds to encompass all active coordinates
      const points: L.LatLngExpression[] = [[activeLat, activeLng]];
      rankedClinics.forEach(c => points.push([c.latitude, c.longitude]));
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds.pad(0.18));
    }
  }, [activeLat, activeLng, rankedClinics, selectedClinicId]);

  // Trigger simulated route mapping
  const handleRouteMap = (clinicId: string, clinicName: string, distance: number, etaMin: number) => {
    setSelectedClinicId(clinicId);
    const routeCode = Math.random().toString(36).substring(3, 8).toUpperCase();
    onLog('success', 'Simulation Map Rendered', `Acquired active route trail ${routeCode} to ${clinicName}. Distance: ${distance.toFixed(1)} km, Mode: ${transitMode.toUpperCase()}.`);
    setSimulationAlert(`Mapping active vector trail to ${clinicName}. Simulated GPS path locked on coordinate cluster. Distance is ${distance.toFixed(1)} km, estimated transit time: ${etaMin} minutes.`);
    setTimeout(() => setSimulationAlert(null), 6000);
  };

  return (
    <div id="vetted-clinic-locator-widget" className="border border-stone-200 rounded-3xl p-6 bg-white space-y-5 shadow-sm">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Compass className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 font-mono">Nearest Vetted Clinic Locator</h4>
            <p className="text-[10px] text-stone-400">Mock location-guided satellite SADC clinic tracking engine</p>
          </div>
        </div>

        {/* GPS Button */}
        <button
          onClick={handleAutoDetectGPS}
          disabled={isSearchingGPS}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
            isSearchingGPS 
              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
              : 'bg-emerald-950/5 text-emerald-900 border-emerald-900/10 hover:bg-emerald-950 hover:text-white'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${isSearchingGPS ? 'animate-pulse' : 'animate-ping'}`} />
          <span>{isSearchingGPS ? 'Acquiring GPS Signal...' : 'Auto-Detect Mock Local GPS'}</span>
        </button>
      </div>

      {/* Simulator Control Area */}
      <div className="bg-stone-50 border border-stone-100 p-4.5 rounded-2xl space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wide font-mono">Set Simulated Location</span>
          <button
            onClick={() => setIsAdvancedGeo(!isAdvancedGeo)}
            className="text-[10px] text-emerald-800 hover:text-emerald-950 font-semibold cursor-pointer underline decoration-dotted"
          >
            {isAdvancedGeo ? 'Use Simple Presets' : 'Advanced Geolocation Tuning'}
          </button>
        </div>

        {!isAdvancedGeo ? (
          /* Simple Selection Presets */
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {LOCATION_PRESETS.map((p, idx) => {
              const isActive = !isAdvancedGeo && idx === selectedPresetIndex;
              return (
                <button
                  key={p.name}
                  onClick={() => handlePresetChange(idx)}
                  className={`p-2 rounded-xl text-[10px] font-bold text-left flex flex-col justify-between transition cursor-pointer border ${
                    isActive
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <span className="truncate w-full block">{p.name.split(' ')[0]}</span>
                  <span className={`text-[8px] mt-0.5 block font-mono ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                    {p.lat.toFixed(1)}°, {p.lng.toFixed(1)}°
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          /* Advanced Coordinates Tuning Options */
          <div className="space-y-3 p-1.5 bg-white border border-stone-150 rounded-xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-stone-500">
                  <span>SADC Latitude</span>
                  <span className="font-bold text-stone-800">{customLat.toFixed(4)}°S</span>
                </div>
                <input
                  type="range"
                  min="-22.5"
                  max="-15.5"
                  step="0.001"
                  value={customLat}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setCustomLat(v);
                    onLog('info', 'GPS Coordinate Tweak', `Lat slider configured to ${v.toFixed(4)}°S.`);
                  }}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-stone-500">
                  <span>SADC Longitude</span>
                  <span className="font-bold text-stone-800">{customLng.toFixed(4)}°E</span>
                </div>
                <input
                  type="range"
                  min="25.0"
                  max="33.5"
                  step="0.001"
                  value={customLng}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setCustomLng(v);
                    onLog('info', 'GPS Coordinate Tweak', `Lng slider configured to ${v.toFixed(4)}°E.`);
                  }}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
                />
              </div>
            </div>
            <div className="flex justify-between text-[9px] font-mono text-stone-400 border-t border-stone-100 pt-2 px-1">
              <span>SADC Geofenced limits: 15°S to 22.5°S</span>
              <span>25°E to 33.5°E</span>
            </div>
          </div>
        )}

        {/* Transit Speed Selector */}
        <div className="flex items-center justify-between border-t border-stone-150 pt-3">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide font-mono">Transit Mode</span>
          <div className="flex gap-1 bg-white p-0.5 border border-stone-200 rounded-lg">
            <button
              onClick={() => {
                setTransitMode('car');
                onLog('info', 'Transit Configured', 'Car mode speed factor applied (50 km/h).');
              }}
              className={`p-1.5 px-3 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                transitMode === 'car' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-850'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Car</span>
            </button>
            <button
              onClick={() => {
                setTransitMode('ambulance');
                onLog('info', 'Transit Configured', 'Emergency responder speed factor applied (75 km/h).');
              }}
              className={`p-1.5 px-3 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                transitMode === 'ambulance' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-850'
              }`}
            >
              <Siren className="w-3.5 h-3.5 text-red-400" />
              <span>Ambulance</span>
            </button>
            <button
              onClick={() => {
                setTransitMode('walking');
                onLog('info', 'Transit Configured', 'Walking transit speed applied (4.5 km/h).');
              }}
              className={`p-1.5 px-3 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                transitMode === 'walking' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-850'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Walking</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advisory warning for critical priority */}
      {severityLevel === 'critical' && (
        <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl flex gap-3 items-start">
          <Siren className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="text-[11px] text-red-950 leading-relaxed font-sans">
            <span className="font-bold">CRITICAL EMERGENCY TRIAGE:</span> Clinics with specialized severe malaria response capabilities (children units, IV therapy, ICU beds) have been prioritized in ranking. High-speed emergency transit is highly recommended.
          </div>
        </div>
      )}

      {/* Routed Simulation Notification Feedback Banner */}
      {simulationAlert && (
        <div className="p-3 bg-emerald-950 text-emerald-100 rounded-2xl border border-emerald-900 text-[11px] flex items-start gap-2 animate-fade-in font-sans leading-relaxed">
          <Navigation className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
          <div>{simulationAlert}</div>
        </div>
      )}

      {/* GEOSPATIAL MAP PANEL (LEAFLET INTEGRATION) */}
      <div id="geospatial-clinic-map-container" className="space-y-2.5">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-800">
              <Map className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wide font-mono">
              Live Regional Dispatch Map Overlay
            </span>
          </div>
          {selectedClinicId && (
            <button
              onClick={() => setSelectedClinicId(null)}
              className="text-[9px] font-mono font-bold text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Full Area View</span>
            </button>
          )}
        </div>

        <div className="relative w-full h-[320px] rounded-[24px] border border-stone-200 overflow-hidden shadow-sm z-10">
          <div 
            ref={mapContainerRef} 
            className="w-full h-full"
            style={{ minHeight: '320px' }}
          />
          
          {/* Floating map status badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-stone-200/80 p-2.5 rounded-2xl shadow-md z-[1000] pointer-events-none max-w-[200px] space-y-1">
            <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-800 uppercase tracking-wider">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Active Sentinel GPS</span>
            </div>
            <p className="text-[10px] text-stone-500 font-sans leading-normal">
              Centered on <span className="font-semibold text-stone-800 font-mono text-[9px]">{activeLat.toFixed(3)}°S, {activeLng.toFixed(3)}°E</span>. Top 3 nearest response hubs aligned.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-[9px] text-stone-400 font-mono px-1">
          <span>💡 Tip: Click on a marker to lock dispatch coordinates.</span>
          <span>Zoom: Dynamic • Tile: OSM Standard</span>
        </div>
      </div>

      {/* Map Result Cards sorted by Distance */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-[10px] text-stone-400 uppercase tracking-wider font-mono px-1">
          <span>Target Destination (Sorted Closest)</span>
          <span>EST. TIMIE ({transitMode.toUpperCase()})</span>
        </div>

        {rankedClinics.map((clinic, idx) => {
          // Check suitability highlight
          const isHighlyRecommended = severityLevel === 'critical' && clinic.canHandleCritical;
          const isActiveRoute = clinic.id === selectedClinicId;
          
          return (
            <div 
              key={clinic.id} 
              id={`clinic-card-${clinic.id}`}
              className={`p-4 border rounded-2xl flex flex-col md:flex-row justify-between gap-3.5 transition-all bg-white relative overflow-hidden ${
                isActiveRoute
                  ? 'border-amber-500 ring-2 ring-amber-300 bg-amber-50/5 shadow-[0_4px_16px_rgba(245,158,11,0.06)] scale-[1.01]'
                  : isHighlyRecommended 
                    ? 'border-red-500/40 bg-gradient-to-br from-red-50/10 to-transparent shadow-[0_4px_12px_rgba(239,68,68,0.04)] hover:border-red-500/60' 
                    : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="space-y-2 max-w-[75%]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-stone-900 text-[13px] tracking-tight">{clinic.name}</span>
                  {isHighlyRecommended && (
                    <span className="px-2 py-0.5 text-[8px] bg-red-500 text-white font-bold rounded-full font-sans uppercase animate-pulse">
                      Critical Care Vetted
                    </span>
                  )}
                  {clinic.hasICU && (
                    <span className="px-2 py-0.5 text-[8px] bg-slate-900 text-slate-100 font-bold rounded-full font-sans uppercase">
                      ICU Facility
                    </span>
                  )}
                  {isActiveRoute && (
                    <span className="px-2 py-0.5 text-[8px] bg-amber-500 text-white font-bold rounded-full font-sans uppercase">
                      Active Map Trail
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-stone-500 leading-normal">{clinic.service}</p>
                
                <div className="flex items-center gap-4 text-[10px] text-stone-400 font-mono flex-wrap pt-0.5">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {clinic.phone}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {clinic.hours}</span>
                </div>
              </div>

              {/* Action Column */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-stone-100 pt-3 md:pt-0 shrink-0 select-none">
                <div className="text-right">
                  <p className="text-xs font-bold text-stone-900 font-mono tracking-tight flex items-center gap-1 justify-end">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{clinic.distanceKm.toFixed(1)} km away</span>
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                    ETA: <span className="font-bold text-stone-800">{clinic.travelTimeMinutes} mins</span>
                  </p>
                </div>

                <div className="flex gap-1 w-full justify-end">
                  <a 
                    href={`tel:${clinic.phone.replace(/\s+/g, '')}`}
                    className="p-2 px-2.5 bg-stone-50 border border-stone-200 hover:border-stone-400 rounded-xl text-[10px] font-bold text-stone-700 transition flex items-center gap-1"
                    title="Initiate phone routing"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <button
                    onClick={() => handleRouteMap(clinic.id, clinic.name, clinic.distanceKm, clinic.travelTimeMinutes)}
                    className={`p-2 px-3 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shadow-xs ${
                      isActiveRoute 
                        ? 'bg-amber-500 hover:bg-amber-650 text-white' 
                        : 'bg-stone-900 hover:bg-stone-850 text-white'
                    }`}
                  >
                    <Navigation className="w-3 h-3" />
                    <span>{isActiveRoute ? 'Active Route' : 'Map Route'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer disclaimer */}
      <div className="pt-2 flex items-center gap-1.5 text-[9px] text-stone-400 justify-center font-mono">
        <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
        <span>AfriCare clinics continuously update diagnostic kit inventories twice daily.</span>
      </div>
    </div>
  );
}
