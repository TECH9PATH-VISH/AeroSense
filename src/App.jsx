import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  MapPin,
  RefreshCw,
  Wind,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Sparkles,
  MessageSquare,
  X,
  Send,
  Thermometer,
  Droplets,
  Clock,
  Compass,
  CheckCircle2,
  Bot,
  User,
  Sliders,
  ArrowUpRight,
  TrendingUp,
  Info,
  Copy,
  Check,
  Split,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  CloudRain,
  CloudFog,
  CloudSun,
  Navigation,
  Bell,
  Route,
  Flower2,
  Download,
  AirVent,
  Waves,
  PersonStanding,
  Heart,
  Baby,
  Layers,
  Globe
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
  Cell
} from 'recharts';

// --- STRICT AQI CLASSIFICATION & COLOR SYSTEM ---
const getAQIDetails = (aqi) => {
  const num = Number(aqi) || 0;
  if (num <= 50) {
    return {
      tier: 'good',
      label: 'Good',
      color: '#10B981', // Emerald Green
      textClass: 'text-emerald-400',
      borderClass: 'border-emerald-500/30',
      bgGlowClass: 'glass-glow-green',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      ringColor: '#10B981',
      statusDesc: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
      audioFreq: 528,
      icon: ShieldCheck,
      profileAdvice: {
        general: [
          { title: 'Outdoor Exercise', desc: 'Perfect time for a jog, cycling, or outdoor sports.', safe: true },
          { title: 'Home Ventilation', desc: 'Open windows to circulate crisp, clean outdoor air.', safe: true },
          { title: 'Mask Requirement', desc: 'No protective face mask is needed today.', safe: true },
        ],
        asthma: [
          { title: 'Respiratory Safety', desc: 'Air is clean and non-irritating. Normal outdoor routine safe.', safe: true },
          { title: 'Medication', desc: 'Standard baseline routine; low environmental trigger risk.', safe: true },
        ],
        athlete: [
          { title: 'High-Intensity Cardio', desc: 'Ideal conditions for long-distance running and endurance training.', safe: true },
          { title: 'VO2 Max Potential', desc: 'Maximum lung oxygen delivery with zero particulate drag.', safe: true },
        ],
        child: [
          { title: 'Outdoor Recess', desc: 'Safe for unrestricted playground sports and physical activity.', safe: true },
          { title: 'Stroller Walking', desc: 'Ground-level air is crisp and unpolluted.', safe: true },
        ],
        senior: [
          { title: 'Cardiovascular Risk', desc: 'Zero pollution-induced cardiovascular strain today.', safe: true },
          { title: 'Walking Routine', desc: 'Excellent time for morning and evening walks.', safe: true },
        ],
      },
    };
  } else if (num <= 100) {
    return {
      tier: 'moderate',
      label: 'Moderate',
      color: '#FBBF24', // Amber Yellow
      textClass: 'text-amber-400',
      borderClass: 'border-amber-500/30',
      bgGlowClass: 'glass-glow-yellow',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      ringColor: '#FBBF24',
      statusDesc: 'Air quality is acceptable; however, unusually sensitive individuals may experience minor irritation.',
      audioFreq: 440,
      icon: ShieldCheck,
      profileAdvice: {
        general: [
          { title: 'Outdoor Exercise', desc: 'Safe for most; sensitive individuals should take light breathers.', safe: true },
          { title: 'Home Ventilation', desc: 'Good ventilation conditions during midday hours.', safe: true },
          { title: 'Mask Requirement', desc: 'Not required for healthy individuals; optional in dense traffic.', safe: true },
        ],
        asthma: [
          { title: 'Respiratory Alert', desc: 'Carry rescue inhaler. Watch for airway tightness near diesel traffic.', safe: false },
          { title: 'Outdoor Cardio', desc: 'Take periodic breaks if you notice slight coughing.', safe: false },
        ],
        athlete: [
          { title: 'Cardio Training', desc: 'Outdoor running is safe. Avoid highways during rush hour.', safe: true },
          { title: 'Recovery', desc: 'Hydrate well to flush mucosal surfaces.', safe: true },
        ],
        child: [
          { title: 'Outdoor Play', desc: 'Safe for normal play; monitor asthmatic children closely.', safe: true },
          { title: 'Hydration', desc: 'Encourage frequent water breaks during sports.', safe: true },
        ],
        senior: [
          { title: 'Cardiovascular Load', desc: 'Safe for light to moderate outdoor walks.', safe: true },
          { title: 'Breathing Comfort', desc: 'Avoid walking right along busy roads during rush hours.', safe: true },
        ],
      },
    };
  } else if (num <= 150) {
    return {
      tier: 'unhealthy-sensitive',
      label: 'Unhealthy for Sensitive Groups',
      color: '#F97316', // Orange
      textClass: 'text-orange-400',
      borderClass: 'border-orange-500/30',
      bgGlowClass: 'glass-glow-orange',
      badgeBg: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      ringColor: '#F97316',
      statusDesc: 'Members of sensitive groups may experience health effects. General public is less likely to be affected.',
      audioFreq: 370,
      icon: AlertTriangle,
      profileAdvice: {
        general: [
          { title: 'Outdoor Exercise', desc: 'Reduce prolonged or heavy exertion. Take frequent breathers.', safe: false },
          { title: 'Home Ventilation', desc: 'Close windows during rush hours to prevent particulate ingress.', safe: false },
          { title: 'Mask Requirement', desc: 'Sensitive individuals should wear an N95 respirator outdoors.', safe: false },
        ],
        asthma: [
          { title: 'High Danger Warning', desc: 'Keep fast-acting bronchodilator within immediate reach at all times.', safe: false },
          { title: 'Outdoor Exposure', desc: 'Limit outdoor stay to under 20 minutes.', safe: false },
        ],
        athlete: [
          { title: 'Workout Modification', desc: 'Switch heavy tempo workouts and HIIT indoors to a gym.', safe: false },
          { title: 'Lung Strain', desc: 'High ventilatory volume will pull fine PM2.5 deep into alveoli.', safe: false },
        ],
        child: [
          { title: 'Playground Notice', desc: 'Limit prolonged outdoor playground sports for young children.', safe: false },
          { title: 'School Recess', desc: 'Recommend indoor physical activity.', safe: false },
        ],
        senior: [
          { title: 'Heart & Lung Care', desc: 'Rest indoors with closed windows. Avoid strenuous yard work.', safe: false },
          { title: 'Indoor Air', desc: 'Run indoor HEPA filtration unit in bedrooms.', safe: false },
        ],
      },
    };
  } else if (num <= 200) {
    return {
      tier: 'unhealthy',
      label: 'Unhealthy',
      color: '#EF4444', // Red
      textClass: 'text-red-400',
      borderClass: 'border-red-500/30',
      bgGlowClass: 'glass-glow-red',
      badgeBg: 'bg-red-500/15 text-red-300 border-red-500/30',
      ringColor: '#EF4444',
      statusDesc: 'Everyone may begin to experience adverse health effects; sensitive groups may experience serious impairment.',
      audioFreq: 290,
      icon: AlertTriangle,
      profileAdvice: {
        general: [
          { title: 'Outdoor Exercise', desc: 'Avoid all outdoor cardio and intense sports. Move workouts indoors.', safe: false },
          { title: 'Home Ventilation', desc: 'Keep windows and doors firmly shut throughout the day.', safe: false },
          { title: 'Mask Requirement', desc: 'Wear a well-fitted N95 or KN95 mask whenever outside.', safe: false },
        ],
        asthma: [
          { title: 'Critical Warning', desc: 'Stay indoors in air-filtered environment. High asthma flare risk.', safe: false },
          { title: 'Emergency Prep', desc: 'Review asthma action plan; consult physician if wheezing begins.', safe: false },
        ],
        athlete: [
          { title: 'Strict Indoor Protocol', desc: 'Zero outdoor training. Inhaling this air degrades cardiovascular recovery.', safe: false },
          { title: 'Indoor Alternative', desc: 'Treadmill or stationary bike in a HEPA-purified facility.', safe: false },
        ],
        child: [
          { title: 'Mandatory Indoor Recess', desc: 'Children must not participate in outdoor sports or running.', safe: false },
          { title: 'School Criteria', desc: 'Verify air filtration inside classroom facilities.', safe: false },
        ],
        senior: [
          { title: 'Cardiovascular Alert', desc: 'Elevated risk of ischemic heart events and blood pressure spikes.', safe: false },
          { title: 'Remain Indoors', desc: 'Avoid leaving home unless medically necessary.', safe: false },
        ],
      },
    };
  } else if (num <= 300) {
    return {
      tier: 'very-unhealthy',
      label: 'Very Unhealthy',
      color: '#8B5CF6', // Purple
      textClass: 'text-purple-400',
      borderClass: 'border-purple-500/30',
      bgGlowClass: 'glass-glow-purple',
      badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      ringColor: '#8B5CF6',
      statusDesc: 'Health alert: Risk of serious health effects is significantly increased for everyone. General population should limit exposure.',
      audioFreq: 220,
      icon: ShieldAlert,
      profileAdvice: {
        general: [
          { title: 'Outdoor Activity', desc: 'Cancel all outdoor plans and events. Strictly stay indoors.', safe: false },
          { title: 'Home Ventilation', desc: 'Do NOT open windows. Seal drafts and turn AC to recirculate.', safe: false },
          { title: 'Mask Requirement', desc: 'Mandatory high-grade N95 / FFP2 respirator for any departure.', safe: false },
        ],
        asthma: [
          { title: 'Severe Health Hazard', desc: 'Stay sealed in clean room with HEPA filtration.', safe: false },
          { title: 'Immediate Action', desc: 'Seek medical attention if inhaler does not resolve breathing distress.', safe: false },
        ],
        athlete: [
          { title: 'Absolute Workout Ban', desc: 'Do not exercise outdoors under any circumstances.', safe: false },
          { title: 'Indoor Rest', desc: 'Focus on light mobility and active rest indoors.', safe: false },
        ],
        child: [
          { title: 'Total Play Ban', desc: 'Cancel all outdoor schooling, sports, and transit exposure.', safe: false },
          { title: 'Home Sealing', desc: 'Maintain sealed windows and purified indoor atmosphere.', safe: false },
        ],
        senior: [
          { title: 'Emergency Health Warning', desc: 'Extreme strain on heart and respiratory systems. Stay indoors.', safe: false },
          { title: 'Air Filtration', desc: 'Continuous maximum air purification required.', safe: false },
        ],
      },
    };
  } else {
    return {
      tier: 'hazardous',
      label: 'Hazardous',
      color: '#881337', // Maroon / Rose-900
      textClass: 'text-rose-400',
      borderClass: 'border-rose-700/50',
      bgGlowClass: 'glass-glow-maroon',
      badgeBg: 'bg-rose-950/70 text-rose-200 border-rose-600/40',
      ringColor: '#9F1239',
      statusDesc: 'Health warning of emergency conditions: Serious risk of respiratory and cardiovascular impairment for the entire population.',
      audioFreq: 160,
      icon: ShieldAlert,
      profileAdvice: {
        general: [
          { title: 'Emergency Notice', desc: 'Remain indoors in a sealed room. Complete ban on outdoor activities.', safe: false },
          { title: 'Aura & Ventilation', desc: 'Seal doors/windows with damp towels or tape if drafty.', safe: false },
          { title: 'Respirator Level', desc: 'Wear N95/N99 respirator with airtight seal for emergency egress only.', safe: false },
        ],
        asthma: [
          { title: 'Severe Medical Emergency', desc: 'Strict isolation in sealed HEPA environment. Immediate medical intervention if symptomatic.', safe: false },
        ],
        athlete: [
          { title: 'Complete Activity Halt', desc: 'Physical exertion in this atmosphere causes severe acute lung injury.', safe: false },
        ],
        child: [
          { title: 'Crisis Advisory', desc: 'Total quarantine indoors with air purification.', safe: false },
        ],
        senior: [
          { title: 'Critical Risk', desc: 'High risk of acute cardiopulmonary episodes. Keep emergency numbers ready.', safe: false },
        ],
      },
    };
  }
};

// --- DYNAMIC METEOROLOGICAL BACKDROP ENGINE ---
const getMeteorologicalBackdrop = (hour, humidity, aqi) => {
  // Dawn: 5 to 7
  if (hour >= 5 && hour < 8) {
    return {
      type: 'dawn',
      title: 'Dawn Twilight',
      icon: Sun,
      gradient: 'from-amber-950/40 via-purple-950/30 to-[#030712]',
      tagColor: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
      desc: 'Cool morning radiative cooling; low surface wind inversion.',
    };
  }
  // Dusk: 18 to 20
  if (hour >= 18 && hour < 21) {
    return {
      type: 'dusk',
      title: 'Golden Sunset',
      icon: CloudSun,
      gradient: 'from-rose-950/40 via-amber-950/20 to-[#030712]',
      tagColor: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
      desc: 'Evening sunset twilight; photochemical ozone reaction declining.',
    };
  }
  // Night: 21 to 4
  if (hour >= 21 || hour < 5) {
    return {
      type: 'night',
      title: 'Starry Obsidian Night',
      icon: Moon,
      gradient: 'from-indigo-950/40 via-slate-950/60 to-[#030712]',
      tagColor: 'text-indigo-300 border-indigo-500/30 bg-indigo-500/10',
      desc: 'Nocturnal boundary layer lowering; surface particles concentrate.',
    };
  }
  // High Humidity / Fog or Rain
  if (humidity >= 80) {
    return {
      type: 'fog',
      title: 'Misty Overcast Haze',
      icon: CloudFog,
      gradient: 'from-slate-900/60 via-cyan-950/30 to-[#030712]',
      tagColor: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
      desc: 'High relative humidity encapsulating particulate aerosols.',
    };
  }
  // Default Daytime Clear
  return {
    type: 'day-clear',
    title: 'Solar Radiance Day',
    icon: Sun,
    gradient: 'from-sky-950/40 via-blue-950/20 to-[#030712]',
    tagColor: 'text-sky-300 border-sky-500/30 bg-sky-500/10',
    desc: 'Direct solar insolation promoting thermal air column dispersal.',
  };
};

// --- REALISTIC FALLBACK DATA GENERATOR ---
const generateFallbackData = (cityName, baseAqi = 68) => {
  const city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  const now = new Date();
  
  let hash = 0;
  for (let i = 0; i < city.length; i++) hash = city.charCodeAt(i) + ((hash << 5) - hash);
  const normalizedHash = Math.abs(hash);
  
  const aqiVal = baseAqi || (35 + (normalizedHash % 170));
  const pm25 = Math.round(aqiVal * 0.42 + (normalizedHash % 8));
  const pm10 = Math.round(aqiVal * 0.65 + (normalizedHash % 15));
  const no2 = Math.round(18 + (normalizedHash % 25));
  const so2 = Math.round(6 + (normalizedHash % 12));
  const o3 = Math.round(28 + (normalizedHash % 30));
  const co = +(0.4 + (normalizedHash % 8) * 0.1).toFixed(1);

  // 7-day history
  const history = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const variance = Math.sin(i + normalizedHash) * 22;
    const dayAqi = Math.max(15, Math.min(380, Math.round(aqiVal + variance)));
    history.push({
      day: i === 0 ? 'Today' : dayName,
      fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      aqi: dayAqi,
      pm25: Math.round(dayAqi * 0.45),
      pm10: Math.round(dayAqi * 0.68),
    });
  }

  // 24-hour diurnal simulation
  const hourlyForecast = [];
  const currentHour = now.getHours();
  for (let h = 0; h < 24; h += 2) {
    const cycle = Math.sin(((h - 8) / 12) * Math.PI) * 18 + Math.cos(((h - 18) / 6) * Math.PI) * 12;
    const hAqi = Math.max(18, Math.min(420, Math.round(aqiVal + cycle)));
    const hourLabel = `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'AM' : 'PM'}`;
    hourlyForecast.push({
      hour: hourLabel,
      hour24: h,
      aqi: hAqi,
      isCurrent: Math.abs(h - currentHour) < 2,
    });
  }

  return {
    city: { name: `${city}, Intelligence Station` },
    aqi: aqiVal,
    time: { s: now.toISOString().replace('T', ' ').substring(0, 19) },
    iaqi: {
      pm25: { v: pm25 },
      pm10: { v: pm10 },
      no2: { v: no2 },
      so2: { v: so2 },
      o3: { v: o3 },
      co: { v: co },
      t: { v: 19 + (normalizedHash % 12) },
      h: { v: 52 + (normalizedHash % 28) },
      w: { v: +(2.1 + (normalizedHash % 4) * 0.8).toFixed(1) },
      p: { v: 1014 + (normalizedHash % 8) },
    },
    forecastHistory: history,
    hourlyForecast,
    isMock: true,
  };
};

// --- POLLUTANT METADATA CONFIGURATION ---
const POLLUTANT_CONFIG = [
  {
    key: 'pm25',
    name: 'PM2.5',
    sub: 'Fine Inhalable Particulate (≤2.5 µm)',
    unit: 'µg/m³',
    safeLimit: 15,
    maxBenchmark: 150,
    formula: 'PM₂.₅',
    sources: 'Vehicle combustion, power plants, forest fires, agricultural burning.',
    healthEffects: 'Penetrates deep into alveolar air sacs and bloodstream; linked to cardiac arrhythmias, asthma exacerbation, and reduced lung capacity.',
    advice: 'Use sealed N95/FFP2 masks outdoors; run HEPA air purifiers inside.',
  },
  {
    key: 'pm10',
    name: 'PM10',
    sub: 'Coarse Particulates (≤10 µm)',
    unit: 'µg/m³',
    safeLimit: 45,
    maxBenchmark: 250,
    formula: 'PM₁₀',
    sources: 'Road dust, construction sites, mining, windblown soil, pollen.',
    healthEffects: 'Causes severe eye, nose, and throat irritation; aggravates bronchitis and chronic lung conditions.',
    advice: 'Rinse eyes with saline; keep windows shut on windy and dusty days.',
  },
  {
    key: 'no2',
    name: 'Nitrogen Dioxide',
    sub: 'Reactive Nitrogen Gas',
    unit: 'ppb',
    safeLimit: 25,
    maxBenchmark: 120,
    formula: 'NO₂',
    sources: 'Automobile engines, power stations, gas stoves, heaters.',
    healthEffects: 'Inflames mucosal lining of lungs, lowers immunity to respiratory infections.',
    advice: 'Avoid walking adjacent to heavy highway traffic; use kitchen exhaust hoods.',
  },
  {
    key: 'o3',
    name: 'Ground Ozone',
    sub: 'Photochemical Smog',
    unit: 'ppb',
    safeLimit: 50,
    maxBenchmark: 180,
    formula: 'O₃',
    sources: 'Chemical reactions between sunlight and VOCs / nitrogen oxides in hot weather.',
    healthEffects: 'Strong pulmonary oxidizer; causes chest tightness, shortness of breath, and asthma triggers.',
    advice: 'Postpone outdoor strenuous workouts to early morning or after sunset.',
  },
  {
    key: 'so2',
    name: 'Sulfur Dioxide',
    sub: 'Sulfuric Combustion Byproduct',
    unit: 'ppb',
    safeLimit: 20,
    maxBenchmark: 100,
    formula: 'SO₂',
    sources: 'Coal and heavy oil power generation, oil refineries, metal smelting.',
    healthEffects: 'Triggers bronchospasms in asthmatics within 10–15 minutes of exposure.',
    advice: 'Sensitive individuals should limit outdoor exposure in heavy industrial zones.',
  },
  {
    key: 'co',
    name: 'Carbon Monoxide',
    sub: 'Incomplete Carbon Combustion',
    unit: 'ppm',
    safeLimit: 4,
    maxBenchmark: 20,
    formula: 'CO',
    sources: 'Vehicle exhaust in congested spaces, poorly ventilated gas appliances, furnaces.',
    healthEffects: 'Binds with hemoglobin to form carboxyhemoglobin, inhibiting oxygen transfer to organs.',
    advice: 'Ensure adequate fresh air in enclosed parking garages and test domestic CO alarms.',
  },
];

const getPollutantStatus = (val, safeLimit) => {
  if (val === undefined || val === null) return { label: 'N/A', style: 'bg-slate-800 text-slate-400' };
  const ratio = val / safeLimit;
  if (ratio <= 1.0) return { label: 'Optimal', style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' };
  if (ratio <= 1.8) return { label: 'Moderate', style: 'bg-amber-500/15 text-amber-400 border-amber-500/20' };
  if (ratio <= 3.0) return { label: 'Elevated', style: 'bg-orange-500/15 text-orange-400 border-orange-500/20' };
  return { label: 'High Alert', style: 'bg-red-500/15 text-red-400 border-red-500/20' };
};

// --- CUSTOM RECHARTS TOOLTIPS ---
const CustomChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const aqiDetail = getAQIDetails(d.aqi);
    return (
      <div className="glass-panel p-3 rounded-xl shadow-2xl border border-white/10 text-xs backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 mb-2 pb-1 border-b border-white/10">
          <span className="font-semibold text-slate-300">{d.day} ({d.fullDate})</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${aqiDetail.badgeBg}`}>
            {aqiDetail.label}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black" style={{ color: aqiDetail.color }}>{d.aqi}</span>
          <span className="text-slate-400">AQI Index</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
          <div>PM2.5: <span className="text-slate-200 font-mono font-medium">{d.pm25} µg/m³</span></div>
          <div>PM10: <span className="text-slate-200 font-mono font-medium">{d.pm10} µg/m³</span></div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomHourlyTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const aqiDetail = getAQIDetails(d.aqi);
    return (
      <div className="glass-panel p-2.5 rounded-xl shadow-2xl border border-white/10 text-xs backdrop-blur-md">
        <div className="font-semibold text-slate-300 mb-1">{d.hour}</div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-black" style={{ color: aqiDetail.color }}>{d.aqi}</span>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${aqiDetail.badgeBg}`}>
            {aqiDetail.label}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// --- NUMBER COUNT-UP HOOK ---
const useCountUp = (target, duration = 800) => {
  const [val, setVal] = useState(target);
  useEffect(() => {
    let start = val;
    let startTime = performance.now();
    let frameId;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(start + (target - start) * ease));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target]);

  return val;
};

// --- CIRCULAR PROGRESS GAUGE COMPONENT ---
const CircularAQIGauge = ({ aqi, color, size = 240, strokeWidth = 16 }) => {
  const animatedAqi = useCountUp(aqi, 700);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedAqi = Math.min(Math.max(animatedAqi, 0), 500);
  const strokeDashoffset = circumference - (clampedAqi / 500) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800/80"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
          style={{
            filter: `drop-shadow(0 0 12px ${color}66)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-0.5">
          Live Air Index
        </span>
        <span
          className="text-6xl md:text-7xl font-black tracking-tight transition-colors duration-500 font-sans"
          style={{ color }}
        >
          {animatedAqi}
        </span>
        <span className="text-xs font-mono text-slate-400 mt-1">
          Scale: 0 – 500
        </span>
      </div>
    </div>
  );
};

// --- SYNTHESIZED WEB AUDIO TELEMETRY CHIME ---
const playAtmosphericChime = (frequency = 440) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.debug('Audio context not allowed yet:', e);
  }
};

// --- INTERACTIVE WIND PARTICLE CANVAS ---
const WindParticleCanvas = ({ windSpeed = 3, aqiColor = '#10B981', enabled = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = Math.min(Math.max(Math.round(windSpeed * 12), 25), 85);
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: 12 + Math.random() * 22,
      speed: (windSpeed * 0.8 + 1) * (0.8 + Math.random() * 0.6),
      alpha: 0.12 + Math.random() * 0.25,
      width: 1 + Math.random() * 1.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = aqiColor;

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.lineWidth = p.width;
        ctx.globalAlpha = p.alpha;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.len, p.y);
        ctx.stroke();

        p.x += p.speed;
        if (p.x > canvas.width) {
          p.x = -p.len;
          p.y = Math.random() * canvas.height;
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [windSpeed, aqiColor, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-1000"
    />
  );
};

// --- GLOBAL STATIONS DATABASE FOR RADAR MAP ---
const GLOBAL_RADAR_STATIONS = [
  { city: 'London', lat: 51.5, lng: -0.12, aqi: 42, temp: 18, country: 'UK' },
  { city: 'Tokyo', lat: 35.6, lng: 139.6, aqi: 28, temp: 16, country: 'Japan' },
  { city: 'Paris', lat: 48.8, lng: 2.35, aqi: 74, temp: 20, country: 'France' },
  { city: 'New York', lat: 40.7, lng: -74.0, aqi: 92, temp: 22, country: 'USA' },
  { city: 'Beijing', lat: 39.9, lng: 116.4, aqi: 168, temp: 14, country: 'China' },
  { city: 'New Delhi', lat: 28.6, lng: 77.2, aqi: 315, temp: 28, country: 'India' },
  { city: 'Sydney', lat: -33.8, lng: 151.2, aqi: 22, temp: 24, country: 'Australia' },
  { city: 'Sao Paulo', lat: -23.5, lng: -46.6, aqi: 85, temp: 23, country: 'Brazil' },
  { city: 'Cairo', lat: 30.0, lng: 31.2, aqi: 154, temp: 29, country: 'Egypt' },
  { city: 'Berlin', lat: 52.5, lng: 13.4, aqi: 38, temp: 17, country: 'Germany' },
];

// --- MAIN APPLICATION COMPONENT ---
export default function AeroSenseApp() {
  const [city, setCity] = useState('London');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'radar' | 'route' | 'pollen'
  const [searchInput, setSearchInput] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedPollutant, setSelectedPollutant] = useState(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [windStreamsEnabled, setWindStreamsEnabled] = useState(true);
  const [tempUnit, setTempUnit] = useState('C');
  const [userProfile, setUserProfile] = useState('general');

  // Modals
  const [indoorModalOpen, setIndoorModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareCityName, setCompareCityName] = useState('New Delhi');
  const [compareData, setCompareData] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState(100);

  // Route Planner State
  const [routeStart, setRouteStart] = useState('Westminster Bridge');
  const [routeEnd, setRouteEnd] = useState('Hyde Park Green Gate');
  const [selectedRoute, setSelectedRoute] = useState('clean'); // 'clean' | 'direct'

  // AI Chatbot State
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi! I am your AeroSense AI Assistant. I analyze current atmospheric pollutants and give you tailored health precautions. What would you like to know?',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  const popularCities = ['London', 'New York', 'Tokyo', 'Paris', 'Delhi', 'Beijing', 'Los Angeles'];

  const fetchAirQuality = async (targetCity) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.waqi.info/feed/${encodeURIComponent(targetCity)}/?token=demo`);
      const json = await response.json();

      if (json && json.status === 'ok' && json.data) {
        const apiData = json.data;
        const currentAqi = apiData.aqi || 50;
        const fallback = generateFallbackData(targetCity, currentAqi);
        
        setData({
          city: apiData.city || { name: targetCity },
          aqi: currentAqi,
          time: apiData.time || { s: new Date().toLocaleString() },
          iaqi: {
            pm25: apiData.iaqi?.pm25 || fallback.iaqi.pm25,
            pm10: apiData.iaqi?.pm10 || fallback.iaqi.pm10,
            no2: apiData.iaqi?.no2 || fallback.iaqi.no2,
            so2: apiData.iaqi?.so2 || fallback.iaqi.so2,
            o3: apiData.iaqi?.o3 || fallback.iaqi.o3,
            co: apiData.iaqi?.co || fallback.iaqi.co,
            t: apiData.iaqi?.t || fallback.iaqi.t,
            h: apiData.iaqi?.h || fallback.iaqi.h,
            w: apiData.iaqi?.w || fallback.iaqi.w,
            p: apiData.iaqi?.p || fallback.iaqi.p,
          },
          forecastHistory: fallback.forecastHistory,
          hourlyForecast: fallback.hourlyForecast,
          isMock: false,
        });

        if (soundEnabled) {
          const info = getAQIDetails(currentAqi);
          playAtmosphericChime(info.audioFreq);
        }
      } else {
        const fallback = generateFallbackData(targetCity);
        setData(fallback);
      }
    } catch {
      setData(generateFallbackData(targetCity));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirQuality(city);
  }, [city]);

  // Comparison logic
  const fetchCompareData = async (targetCity) => {
    setCompareLoading(true);
    try {
      const res = await fetch(`https://api.waqi.info/feed/${encodeURIComponent(targetCity)}/?token=demo`);
      const json = await res.json();
      if (json && json.status === 'ok' && json.data) {
        const currentAqi = json.data.aqi || 60;
        const fallback = generateFallbackData(targetCity, currentAqi);
        setCompareData({
          name: json.data.city?.name || targetCity,
          aqi: currentAqi,
          pm25: json.data.iaqi?.pm25?.v || fallback.iaqi.pm25.v,
          pm10: json.data.iaqi?.pm10?.v || fallback.iaqi.pm10.v,
          no2: json.data.iaqi?.no2?.v || fallback.iaqi.no2.v,
        });
      } else {
        const fb = generateFallbackData(targetCity);
        setCompareData({
          name: fb.city.name,
          aqi: fb.aqi,
          pm25: fb.iaqi.pm25.v,
          pm10: fb.iaqi.pm10.v,
          no2: fb.iaqi.no2.v,
        });
      }
    } catch {
      const fb = generateFallbackData(targetCity);
      setCompareData({
        name: fb.city.name,
        aqi: fb.aqi,
        pm25: fb.iaqi.pm25.v,
        pm10: fb.iaqi.pm10.v,
        no2: fb.iaqi.no2.v,
      });
    } finally {
      setCompareLoading(false);
    }
  };

  const handleOpenCompare = () => {
    setCompareModalOpen(true);
    fetchCompareData(compareCityName);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setCity(searchInput.trim());
    setSearchInput('');
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geoQuery = `geo:${position.coords.latitude.toFixed(2)};${position.coords.longitude.toFixed(2)}`;
          setCity('Local Station');
          fetchAirQuality(geoQuery);
          setIsLocating(false);
        },
        () => {
          setCity('London');
          setIsLocating(false);
        },
        { timeout: 6000 }
      );
    } else {
      setCity('London');
      setIsLocating(false);
    }
  };

  const aqiInfo = useMemo(() => {
    return getAQIDetails(data?.aqi || 0);
  }, [data?.aqi]);

  // Meteorological sky backdrop based on time and humidity
  const weatherBackdrop = useMemo(() => {
    const rawHour = new Date().getHours();
    const hum = data?.iaqi?.h?.v ?? 55;
    return getMeteorologicalBackdrop(rawHour, hum, data?.aqi || 50);
  }, [data?.time, data?.iaqi?.h, data?.aqi]);

  const activeRecommendations = useMemo(() => {
    const adviceObj = aqiInfo.profileAdvice || {};
    return adviceObj[userProfile] || adviceObj.general || [];
  }, [aqiInfo, userProfile]);

  const bestWorkoutHour = useMemo(() => {
    if (!data?.hourlyForecast) return null;
    const sorted = [...data.hourlyForecast].sort((a, b) => a.aqi - b.aqi);
    return sorted[0];
  }, [data?.hourlyForecast]);

  const displayTemp = useMemo(() => {
    const rawC = data?.iaqi?.t?.v ?? 19;
    if (tempUnit === 'F') {
      return `${Math.round((rawC * 9) / 5 + 32)}°F`;
    }
    return `${rawC}°C`;
  }, [data?.iaqi?.t, tempUnit]);

  // Export Graphic Card
  const handleExportCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1000);
    bgGrad.addColorStop(0, '#020617');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1000);

    const glowGrad = ctx.createRadialGradient(400, 420, 10, 400, 420, 260);
    glowGrad.addColorStop(0, `${aqiInfo.color}40`);
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(100, 150, 600, 600);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText('AeroSense Air Intelligence', 50, 80);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText(`Station: ${data?.city?.name || city}`, 50, 120);

    ctx.lineWidth = 22;
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(400, 420, 150, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = aqiInfo.color;
    ctx.beginPath();
    ctx.arc(400, 420, 150, -Math.PI / 2, -Math.PI / 2 + (Math.min(data?.aqi || 50, 500) / 500) * 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = aqiInfo.color;
    ctx.font = 'bold 96px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${data?.aqi || 50}`, 400, 440);

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText(aqiInfo.label.toUpperCase(), 400, 485);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#334155';
    ctx.roundRect?.(50, 680, 700, 240, 24) || ctx.fillRect(50, 680, 700, 240);
    ctx.fill();

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText('Concentrations (WHO Standard)', 80, 730);

    ctx.font = '20px Inter, sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(`PM2.5: ${data?.iaqi?.pm25?.v || '—'} µg/m³`, 80, 780);
    ctx.fillText(`PM10: ${data?.iaqi?.pm10?.v || '—'} µg/m³`, 80, 820);
    ctx.fillText(`NO2: ${data?.iaqi?.no2?.v || '—'} ppb`, 80, 860);

    ctx.fillText(`Temperature: ${displayTemp}`, 440, 780);
    ctx.fillText(`Humidity: ${data?.iaqi?.h?.v || '—'}%`, 440, 820);
    ctx.fillText(`Wind: ${data?.iaqi?.w?.v || '—'} m/s`, 440, 860);

    const link = document.createElement('a');
    link.download = `AeroSense_${city}_AQI.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyReport = () => {
    if (!data) return;
    const text = `AeroSense Air Quality Report: ${data.city?.name || city}
AQI: ${data.aqi} (${aqiInfo.label})
Status: ${aqiInfo.statusDesc}
PM2.5: ${data.iaqi?.pm25?.v || 'N/A'} µg/m³
PM10: ${data.iaqi?.pm10?.v || 'N/A'} µg/m³
NO2: ${data.iaqi?.no2?.v || 'N/A'} ppb
Timestamp: ${data.time?.s || 'Now'}
Generated by AeroSense Intelligence Platform`;
    navigator.clipboard?.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  useEffect(() => {
    if (isAiOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, isAiOpen, isTyping]);

  const handleSendAiMessage = (customText) => {
    const textToSend = typeof customText === 'string' ? customText : chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const q = textToSend.toLowerCase();
      const currentAqi = data?.aqi || 50;
      let reply = '';

      if (q.includes('jog') || q.includes('run') || q.includes('exercise') || q.includes('walk') || q.includes('outside')) {
        if (currentAqi <= 50) {
          reply = `With an AQI of ${currentAqi} (${aqiInfo.label}) in ${data?.city?.name || city}, outdoor exercise is completely safe and encouraged! Enjoy your workout.`;
        } else if (currentAqi <= 100) {
          reply = `Current AQI is ${currentAqi} (Moderate). Outdoor cardio is safe for the majority of people. If you have asthma, take light breaks.`;
        } else if (currentAqi <= 150) {
          reply = `AQI is ${currentAqi} (Unhealthy for Sensitive Groups). It is advisable to reduce intense outdoor cardio. Best time to exercise is around ${bestWorkoutHour?.hour || 'afternoon'} when particulates dip.`;
        } else {
          reply = `Warning: With an elevated AQI of ${currentAqi} (${aqiInfo.label}), outdoor workouts are strictly discouraged! Inhaling high volumes of polluted air causes deep bronchial inflammation. Exercise indoors with a HEPA air cleaner.`;
        }
      } else if (q.includes('mask') || q.includes('n95') || q.includes('respirator')) {
        if (currentAqi <= 100) {
          reply = `At AQI ${currentAqi}, standard masks are not mandatory for healthy individuals unless you are walking right beside heavy traffic.`;
        } else {
          reply = `Yes! With AQI at ${currentAqi} (${aqiInfo.label}), wear a certified N95 or KN95 respirator with a tight seal. Cloth and surgical masks do not filter fine PM2.5 particulates.`;
        }
      } else if (q.includes('pm2.5') || q.includes('pm25')) {
        const pmVal = data?.iaqi?.pm25?.v || 'elevated';
        reply = `PM2.5 in ${data?.city?.name || city} is currently ${pmVal} µg/m³. These microscopic particles penetrate alveoli directly into your bloodstream. Safe WHO limit is 15 µg/m³.`;
      } else if (q.includes('pollen') || q.includes('allergy') || q.includes('hay fever')) {
        reply = `Allergen Telemetry for ${data?.city?.name || city}: Tree Pollen is Moderate, Grass Pollen is Low, and Mold Spores are elevated due to ${data?.iaqi?.h?.v || 55}% humidity. Take antihistamines before outdoor runs.`;
      } else if (q.includes('window') || q.includes('ventilate') || q.includes('purifier')) {
        if (currentAqi <= 80) {
          reply = `It is a great time to open windows and let clean air refresh your home. Good ventilation prevents indoor CO2 accumulation.`;
        } else {
          reply = `Keep your windows shut. Run a True HEPA air purifier on medium-high speed and turn AC to internal recirculation mode.`;
        }
      } else {
        reply = `Currently in ${data?.city?.name || city}, the overall Air Quality Index is ${currentAqi} (${aqiInfo.label}). Primary pollutant monitored is PM2.5 at ${data?.iaqi?.pm25?.v || 'N/A'} µg/m³. ${aqiInfo.statusDesc}`;
      }

      setAiMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const WeatherIcon = weatherBackdrop.icon;

  return (
    <div className={`min-h-screen text-slate-100 relative bg-gradient-to-b ${weatherBackdrop.gradient} transition-colors duration-1000 font-sans`}>
      {/* Live Atmospheric Wind Particles */}
      <WindParticleCanvas
        windSpeed={data?.iaqi?.w?.v ?? 3}
        aqiColor={aqiInfo.color}
        enabled={windStreamsEnabled}
      />

      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-5 right-5 z-50 glass-panel px-4 py-2.5 rounded-2xl border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-400" />
          Air Quality Report copied to clipboard!
        </div>
      )}

      {/* Dynamic Ambient Background Glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[520px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 opacity-30 z-0"
        style={{
          background: `radial-gradient(circle, ${aqiInfo.color} 0%, transparent 70%)`,
        }}
      />
      <div className="fixed -bottom-40 right-10 w-[600px] h-[400px] rounded-full blur-[160px] pointer-events-none opacity-20 z-0 bg-cyan-600" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* --- 1. HEADER & NAVIGATION --- */}
        <header className="glass-panel rounded-2xl px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-white/10">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-300 border"
                style={{
                  backgroundColor: `${aqiInfo.color}20`,
                  borderColor: `${aqiInfo.color}60`,
                }}
              >
                <Wind className="w-5 h-5" style={{ color: aqiInfo.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                    Aero<span style={{ color: aqiInfo.color }}>Sense</span>
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-cyan-500/30">
                    Live WAQI
                  </span>
                </div>
                <p className="text-xs text-slate-400">Atmospheric Quality Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={() => setNotifDrawerOpen(true)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-white/10 relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
              </button>
              <button
                onClick={() => setIndoorModalOpen(true)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-white/10"
                title="Indoor Purifier"
              >
                <AirVent className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                onClick={handleExportCard}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-white/10"
                title="Export Image"
              >
                <Download className="w-4 h-4 text-cyan-400" />
              </button>
              <button
                onClick={handleLocateMe}
                disabled={isLocating}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/10"
                title="Locate Me"
              >
                <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce text-cyan-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search Bar & City Shortcuts */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative w-full sm:w-60">
              <input
                type="text"
                placeholder="Search city (e.g., Tokyo, Paris)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-900/90 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-20 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition flex items-center gap-1"
              >
                Find
              </button>
            </form>

            <button
              onClick={() => setIndoorModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-emerald-300 hover:text-white transition shadow-sm"
              title="Indoor HEPA Purifier Comparison"
            >
              <AirVent className="w-4 h-4 text-emerald-400" />
              <span>Indoor HEPA</span>
            </button>

            <button
              onClick={() => setNotifDrawerOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-amber-300 hover:text-white transition relative shadow-sm"
              title="Alerts & Thresholds"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Alerts</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            <button
              onClick={handleExportCard}
              className="hidden md:flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-cyan-300 hover:text-white transition shadow-sm"
              title="Export Graphic Card as PNG"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export</span>
            </button>

            <button
              onClick={() => setTempUnit((u) => (u === 'C' ? 'F' : 'C'))}
              className="hidden md:flex items-center gap-1 px-2.5 py-2.5 rounded-xl text-xs font-mono font-medium bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition"
              title="Toggle Celsius / Fahrenheit"
            >
              <span>°{tempUnit}</span>
            </button>

            <button
              onClick={() => setWindStreamsEnabled((prev) => !prev)}
              className={`hidden md:flex items-center justify-center p-2.5 rounded-xl border transition ${
                windStreamsEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-400'
              }`}
              title={windStreamsEnabled ? 'Wind streams active' : 'Wind streams muted'}
            >
              <Waves className="w-4 h-4" />
            </button>

            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className="hidden md:flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition shadow-sm"
            >
              <MapPin className={`w-4 h-4 text-cyan-400 ${isLocating ? 'animate-bounce' : ''}`} />
              <span>{isLocating ? 'Detecting...' : 'Locate'}</span>
            </button>

            <button
              onClick={handleOpenCompare}
              className="hidden md:flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition"
              title="Compare with another city"
            >
              <Split className="w-4 h-4 text-cyan-400" />
              <span>Compare</span>
            </button>

            <button
              onClick={() => {
                const nextState = !soundEnabled;
                setSoundEnabled(nextState);
                if (nextState) playAtmosphericChime(aqiInfo.audioFreq);
              }}
              className={`hidden md:flex items-center justify-center p-2.5 rounded-xl border transition ${
                soundEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-400'
              }`}
              title={soundEnabled ? 'Acoustic alerts enabled' : 'Enable acoustic alerts'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={handleCopyReport}
              className="hidden md:flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition"
              title="Copy Summary Report"
            >
              <Copy className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => fetchAirQuality(city)}
              disabled={loading}
              className="hidden md:flex items-center justify-center p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </header>

        {/* --- VIEW SWITCHER TABS & METEOROLOGICAL SKY PILL --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/80 border border-white/10 text-xs">
            {[
              { id: 'dashboard', label: 'Overview Dashboard', icon: Layers },
              { id: 'radar', label: 'Global Radar Map', icon: Globe },
              { id: 'route', label: 'Clean Route Planner', icon: Route },
              { id: 'pollen', label: 'Allergens & Pollen', icon: Flower2 },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Meteorological Sky Backdrop Indicator */}
          <div className={`px-3.5 py-1.5 rounded-xl border text-xs flex items-center gap-2 shadow-sm ${weatherBackdrop.tagColor}`}>
            <WeatherIcon className="w-4 h-4 animate-pulse" />
            <div>
              <span className="font-bold">{weatherBackdrop.title}</span>
              <span className="hidden md:inline text-[11px] opacity-80"> — {weatherBackdrop.desc}</span>
            </div>
          </div>
        </div>

        {/* Quick City Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> Presets:
          </span>
          {popularCities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-3 py-1 rounded-lg shrink-0 transition-all duration-200 border text-xs font-medium ${
                city.toLowerCase() === c.toLowerCase()
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/50 text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 glass-panel p-8 rounded-3xl h-80 flex flex-col justify-center items-center gap-4">
              <div className="w-44 h-44 rounded-full border-4 border-slate-800/80 border-t-cyan-500 animate-spin" />
              <div className="h-4 bg-slate-800 rounded w-48 mt-2" />
            </div>
            <div className="glass-panel p-8 rounded-3xl h-80 bg-slate-900/60" />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD VIEW */}
        {/* ============================================================== */}
        {!loading && data && activeTab === 'dashboard' && (
          <>
            {/* Station Status Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: aqiInfo.color }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2.5 w-2.5"
                    style={{ backgroundColor: aqiInfo.color }}
                  />
                </span>
                <span className="font-semibold text-slate-200 text-sm">{data.city?.name || city}</span>
                {data.isMock && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Station Simulation Mode
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Updated: <span className="text-slate-300">{data.time?.s || 'Just now'}</span>
                </span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => setTempUnit((u) => (u === 'C' ? 'F' : 'C'))}>
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  {displayTemp}
                </span>
                {data.iaqi?.h && (
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    {data.iaqi.h.v}%
                  </span>
                )}
                {data.iaqi?.w && (
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-emerald-400" />
                    {data.iaqi.w.v} m/s
                  </span>
                )}
              </div>
            </div>

            {/* Main Live AQI Gauge & Health Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Primary Circular Gauge Card */}
              <div
                className={`lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-700 border ${aqiInfo.borderClass} ${aqiInfo.bgGlowClass}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${aqiInfo.color}25` }}>
                      <aqiInfo.icon className="w-5 h-5" style={{ color: aqiInfo.color }} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white tracking-tight">Real-Time Atmosphere Index</h2>
                      <p className="text-xs text-slate-400">World Air Quality Standard (WAQI / EPA)</p>
                    </div>
                  </div>

                  <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${aqiInfo.badgeBg}`}>
                    {aqiInfo.label}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4 my-2">
                  <CircularAQIGauge aqi={data.aqi} color={aqiInfo.color} size={240} strokeWidth={18} />

                  <div className="max-w-xs space-y-3 text-center sm:text-left">
                    <div className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-slate-800/80 text-slate-300 border border-white/5">
                      Hazard Rating
                    </div>
                    <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${aqiInfo.textClass}`}>
                      {aqiInfo.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {aqiInfo.statusDesc}
                    </p>
                    <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-400">
                      <div>Dominant: <span className="text-slate-100 font-bold">PM2.5</span></div>
                      <div>•</div>
                      <div>Risk: <span className="text-slate-100 font-bold uppercase">{aqiInfo.tier}</span></div>
                    </div>
                  </div>
                </div>

                {/* AQI Range Spectrum Bar */}
                <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span className="text-emerald-400">0 Good</span>
                    <span className="text-amber-400">51 Moderate</span>
                    <span className="text-orange-400">101 Sensitive</span>
                    <span className="text-red-400">151 Unhealthy</span>
                    <span className="text-purple-400">201 Very</span>
                    <span className="text-rose-400">300+ Haz</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden flex p-0.5 gap-0.5">
                    <div className="h-full flex-1 bg-emerald-500 rounded-l-full" />
                    <div className="h-full flex-1 bg-amber-400" />
                    <div className="h-full flex-1 bg-orange-500" />
                    <div className="h-full flex-1 bg-red-500" />
                    <div className="h-full flex-1 bg-purple-500" />
                    <div className="h-full flex-1 bg-rose-900 rounded-r-full" />
                  </div>
                </div>
              </div>

              {/* Health Recommendations Matrix */}
              <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white tracking-tight">Health Recommendations</h2>
                        <p className="text-xs text-slate-400">Tailored to your personal vulnerability profile</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      Dynamic Tier
                    </span>
                  </div>

                  {/* Profile Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
                    {[
                      { id: 'general', label: 'General', icon: PersonStanding },
                      { id: 'asthma', label: 'Asthma/Lung', icon: Heart },
                      { id: 'athlete', label: 'Athlete', icon: Activity },
                      { id: 'child', label: 'Child', icon: Baby },
                      { id: 'senior', label: 'Senior 65+', icon: ShieldCheck },
                    ].map((p) => {
                      const Icon = p.icon;
                      const active = userProfile === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setUserProfile(p.id)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 shrink-0 transition ${
                            active
                              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                              : 'bg-slate-900/90 text-slate-400 hover:text-white border border-white/5'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{p.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Adaptive Recommendations List */}
                  <div className="space-y-2.5 mt-2">
                    {activeRecommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all flex items-start gap-3 group"
                      >
                        <div
                          className={`mt-0.5 p-1.5 rounded-xl shrink-0 transition-colors ${
                            rec.safe
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {rec.safe ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition">
                              {rec.title}
                            </h4>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                rec.safe ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-300'
                              }`}
                            >
                              {rec.safe ? 'Clear' : 'Precaution'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                            {rec.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Exercise Window Alert */}
                {bestWorkoutHour && (
                  <div className="mt-4 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-cyan-200 font-semibold block">Optimal Exercise Window:</span>
                        <span className="text-slate-300">Around {bestWorkoutHour.hour} (AQI ~{bestWorkoutHour.aqi})</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsAiOpen(true);
                        handleSendAiMessage('When is the best time of day for outdoor activities today?');
                      }}
                      className="shrink-0 text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
                    >
                      Tips <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 24-Hour Diurnal Timeline */}
            {data.hourlyForecast && (
              <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white tracking-tight">Today's Hourly AQI Progression</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Diurnal Cycle Forecast</span>
                </div>
                <div className="h-28 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.hourlyForecast} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="hour" stroke="#64748B" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                      <Tooltip content={<CustomHourlyTooltip />} />
                      <Bar dataKey="aqi" radius={[4, 4, 0, 0]}>
                        {data.hourlyForecast.map((entry, idx) => {
                          const info = getAQIDetails(entry.aqi);
                          return (
                            <Cell
                              key={`cell-${idx}`}
                              fill={info.color}
                              fillOpacity={entry.isCurrent ? 1 : 0.65}
                              stroke={entry.isCurrent ? '#FFFFFF' : 'none'}
                              strokeWidth={entry.isCurrent ? 2 : 0}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Pollutant Metric Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Concentration Breakdown
                  </h3>
                  <p className="text-xs text-slate-400">Click any card below for deep scientific insights & emission sources</p>
                </div>
                <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
                  WHO 24h Threshold Standard
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
                {POLLUTANT_CONFIG.map((pollutant) => {
                  const val = data.iaqi?.[pollutant.key]?.v;
                  const status = getPollutantStatus(val, pollutant.safeLimit);
                  const progressPct = val !== undefined
                    ? Math.min(Math.round((val / pollutant.maxBenchmark) * 100), 100)
                    : 15;

                  return (
                    <div
                      key={pollutant.key}
                      onClick={() => setSelectedPollutant({ ...pollutant, currentVal: val, status })}
                      className="glass-panel rounded-2xl p-4 flex flex-col justify-between border border-white/5 hover:border-cyan-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg cursor-pointer"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-2">
                          <div>
                            <span className="text-sm font-black font-mono tracking-tight text-white group-hover:text-cyan-300 transition flex items-center gap-1">
                              {pollutant.formula}
                              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                            </span>
                            <div className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">
                              {pollutant.name}
                            </div>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.style}`}>
                            {status.label}
                          </span>
                        </div>

                        <div className="my-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight font-sans">
                            {val !== undefined ? val : '—'}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {pollutant.unit}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2 border-t border-white/5">
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${progressPct}%`,
                              backgroundColor:
                                progressPct > 70 ? '#EF4444' : progressPct > 40 ? '#FBBF24' : '#10B981',
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-slate-500">
                          <span>0</span>
                          <span>Safe: {pollutant.safeLimit}</span>
                          <span>{pollutant.maxBenchmark}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7-Day Historical Trend */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white tracking-tight">
                      7-Day Historical Pollution Trend
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Multi-day atmospheric evolution and peak particulate patterns
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: aqiInfo.color }}
                    />
                    <span className="text-slate-300">AQI Trajectory</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-emerald-400 border border-dashed border-emerald-400" />
                    <span className="text-slate-400">Safe Target (50)</span>
                  </div>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.forecastHistory}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="aqiColorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={aqiInfo.color} stopOpacity={0.45} />
                        <stop offset="95%" stopColor={aqiInfo.color} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                      dy={6}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                      domain={[0, 'dataMax + 40']}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <ReferenceLine
                      y={50}
                      stroke="#10B981"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Safe Cap (50)',
                        fill: '#10B981',
                        fontSize: 10,
                        position: 'insideTopLeft',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="aqi"
                      stroke={aqiInfo.color}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#aqiColorGradient)"
                      activeDot={{ r: 6, fill: aqiInfo.color, stroke: '#FFFFFF', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  Historical telemetry compiled from WAQI surveillance nodes.
                </span>
                <span className="font-mono text-slate-300">
                  Weekly Avg AQI:{' '}
                  <strong className="text-white">
                    {Math.round(
                      data.forecastHistory.reduce((acc, curr) => acc + curr.aqi, 0) /
                        data.forecastHistory.length
                    )}
                  </strong>
                </span>
              </div>
            </div>
          </>
        )}

        {/* ============================================================== */}
        {/* TAB 2: GLOBAL RADAR / STATION MAP VIEW */}
        {/* ============================================================== */}
        {activeTab === 'radar' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                  <h3 className="text-lg font-black text-white">Global Atmospheric Radar Surveillance</h3>
                </div>
                <p className="text-xs text-slate-400">Real-time worldwide sensor network telemetry & smoke plume drift</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                10 Active World Nodes
              </span>
            </div>

            {/* Interactive World Grid Radar Representation */}
            <div className="relative w-full h-96 rounded-2xl bg-slate-950 border border-white/10 overflow-hidden flex items-center justify-center">
              {/* Radar Grid Circles */}
              <div className="absolute w-[450px] h-[450px] rounded-full border border-cyan-500/15 animate-ping-slow pointer-events-none" />
              <div className="absolute w-[320px] h-[320px] rounded-full border border-cyan-500/20 pointer-events-none" />
              <div className="absolute w-[180px] h-[180px] rounded-full border border-cyan-500/25 pointer-events-none" />
              <div className="absolute w-full h-[1px] bg-cyan-500/10 pointer-events-none" />
              <div className="absolute h-full w-[1px] bg-cyan-500/10 pointer-events-none" />

              {/* Station Markers */}
              {GLOBAL_RADAR_STATIONS.map((st) => {
                const info = getAQIDetails(st.aqi);
                // Convert lat/lng to visual coordinates
                const leftPct = ((st.lng + 180) / 360) * 88 + 6;
                const topPct = ((-st.lat + 90) / 180) * 80 + 10;
                const isCurrent = city.toLowerCase().includes(st.city.toLowerCase());

                return (
                  <button
                    key={st.city}
                    onClick={() => {
                      setCity(st.city);
                      setActiveTab('dashboard');
                    }}
                    className={`absolute p-2 rounded-2xl flex items-center gap-2 transition-all duration-300 group hover:scale-110 z-10 ${
                      isCurrent
                        ? 'bg-slate-900 border-2 border-white shadow-2xl scale-105'
                        : 'bg-slate-900/90 border border-white/10 hover:border-cyan-400'
                    }`}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: info.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        {st.city}
                        <span className="text-[10px] text-slate-400 font-mono">({st.country})</span>
                      </div>
                      <div className="text-[10px] font-mono font-semibold" style={{ color: info.color }}>
                        {st.aqi} AQI • {info.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cleanest Station: <strong>Sydney (AQI 22)</strong></span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Hazard Zone: <strong>New Delhi (AQI 315)</strong></span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>Click any station above to teleport dashboard telemetry.</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CLEAN AIR ROUTE PLANNER VIEW */}
        {/* ============================================================== */}
        {activeTab === 'route' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-black text-white">Clean Air Running & Commute Route Planner</h3>
                </div>
                <p className="text-xs text-slate-400">Algorithmic navigation prioritizing tree canopies over diesel traffic corridors</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                72% Cleaner Air Route Available
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">Starting Location (Origin)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={routeStart}
                    onChange={(e) => setRouteStart(e.target.value)}
                    className="w-full bg-slate-900 text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                  <MapPin className="w-4 h-4 text-cyan-400 absolute right-3 top-3" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">Destination (Finish)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={routeEnd}
                    onChange={(e) => setRouteEnd(e.target.value)}
                    className="w-full bg-slate-900 text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                </div>
              </div>
            </div>

            {/* Route Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Eco-Canopy Route */}
              <div
                onClick={() => setSelectedRoute('clean')}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  selectedRoute === 'clean'
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-xl scale-[1.01]'
                    : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Recommended: Green Canopy Route
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                    AQI 24 (Optimal)
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">Through Waterfront & Secondary Park Corridors</h4>
                <div className="grid grid-cols-3 gap-2 my-3 text-xs font-mono text-slate-300">
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <strong>4.8 km</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Est. Time</span>
                    <strong>28 mins</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                    <span className="text-[10px] block">PM2.5 Exposure</span>
                    <strong>12 µg/m³</strong>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Route runs through tree-shaded paths and avoids major vehicle intersections. 68% lower cumulative particulate inhalation.
                </p>
              </div>

              {/* Option B: Direct Highway Route */}
              <div
                onClick={() => setSelectedRoute('direct')}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  selectedRoute === 'direct'
                    ? 'bg-rose-950/40 border-rose-500/60 shadow-xl scale-[1.01]'
                    : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Arterial Highway Route (Direct)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold font-mono">
                    AQI 98 (Moderate Smog)
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">Along Central Boulevard & Bus Corridors</h4>
                <div className="grid grid-cols-3 gap-2 my-3 text-xs font-mono text-slate-300">
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <strong>4.2 km</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Est. Time</span>
                    <strong>24 mins</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300">
                    <span className="text-[10px] block">PM2.5 Exposure</span>
                    <strong>48 µg/m³</strong>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fastest distance but exposes respiratory system to direct diesel combustion, brake dust, and nitrogen dioxide plumes.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs">
              <span className="text-cyan-200">
                Want AI assistance configuring a customized marathon training or bicycle commute path?
              </span>
              <button
                onClick={() => {
                  setIsAiOpen(true);
                  handleSendAiMessage('Can you optimize a clean air running route for me avoiding high traffic zones?');
                }}
                className="text-cyan-400 font-bold hover:text-cyan-300"
              >
                Ask Route Assistant &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: POLLEN & ALLERGENS FORECAST VIEW */}
        {/* ============================================================== */}
        {activeTab === 'pollen' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <Flower2 className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-black text-white">Botanical Pollen & Biological Allergen Index</h3>
                </div>
                <p className="text-xs text-slate-400">Daily spore dispersion, pollen count, and seasonal allergic rhinitis risk</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                {city} Bio-Telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Tree Pollen', species: 'Birch, Oak, Alder', val: 'Low (12 gr/m³)', level: 'Safe', color: 'text-emerald-400', bar: '25%', badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' },
                { name: 'Grass Pollen', species: 'Timothy, Kentucky Blue', val: 'Moderate (48 gr/m³)', level: 'Caution', color: 'text-amber-400', bar: '52%', badge: 'bg-amber-500/15 border-amber-500/30 text-amber-300' },
                { name: 'Weed & Ragweed', species: 'Ambrosia, Mugwort', val: 'Minimal (4 gr/m³)', level: 'Optimal', color: 'text-emerald-400', bar: '10%', badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' },
                { name: 'Mold Spores', species: 'Alternaria, Cladosporium', val: 'Elevated (180 sp/m³)', level: 'High', color: 'text-orange-400', bar: '78%', badge: 'bg-orange-500/15 border-orange-500/30 text-orange-300' },
              ].map((pollen, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-white">{pollen.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${pollen.badge}`}>
                        {pollen.level}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{pollen.species}</span>
                    <div className={`text-xl font-black mt-3 ${pollen.color}`}>{pollen.val}</div>
                  </div>
                  <div className="mt-4 pt-2 border-t border-white/5 space-y-1">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: pollen.bar }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1">Allergy Medical Advisory:</strong>
              Mold spore counts are elevated today due to high atmospheric humidity ({data?.iaqi?.h?.v ?? 55}%). Sensitive individuals prone to allergic asthma or sinus congestion should rinse nasal passages with saline after returning indoors and keep bedroom windows closed during morning hours.
            </div>
          </div>
        )}

        <footer className="pt-6 pb-12 text-center text-xs text-slate-400 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">AeroSense Intelligence System</span>
            <span>•</span>
            <span>Powered by World Air Quality Index (WAQI)</span>
          </div>
          <div className="text-slate-400">
            Real-time environmental monitoring & particulate analytics.
          </div>
        </footer>
      </div>

      {/* --- PROACTIVE NOTIFICATION CENTER DRAWER --- */}
      {notifDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-7 border border-amber-500/30 shadow-2xl relative">
            <button
              onClick={() => setNotifDrawerOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Smart Air Alert Notification Center</h3>
                <p className="text-xs text-slate-400">Automated proactive threshold triggers & warnings</p>
              </div>
            </div>

            {/* Threshold Slider */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-300 font-semibold">Custom Alert Trigger Threshold:</span>
                <span className="text-amber-400 font-black font-mono">AQI &gt; {alertThreshold}</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="25"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>50 (Good)</span>
                <span>100 (Moderate)</span>
                <span>150 (Sensitive)</span>
                <span>200 (Unhealthy)</span>
              </div>
            </div>

            {/* Notification Activity Log */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 block">Optimal Running Window Opening</strong>
                  <span className="text-slate-400">PM2.5 dips to clean levels around {bestWorkoutHour?.hour || 'afternoon'}.</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block">Morning Inversion Warning</strong>
                  <span className="text-slate-400">Vehicular combustion particulates peak between 8:00 AM and 10:00 AM.</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start gap-2.5">
                <Wind className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cyan-300 block">Wind Velocity Telemetry</strong>
                  <span className="text-slate-400">Current surface wind at {data?.iaqi?.w?.v ?? 3} m/s helping disperse stagnant aerosols.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Notifications registered! You will receive native alerts whenever ${city} AQI exceeds ${alertThreshold}.`);
                setNotifDrawerOpen(false);
              }}
              className="w-full mt-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              Save Alert Preferences
            </button>
          </div>
        </div>
      )}

      {/* --- INDOOR HEPA PURIFIER COMPARATOR MODAL --- */}
      {indoorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative">
            <button
              onClick={() => setIndoorModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <AirVent className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Indoor vs Outdoor Air Quality (Smart HEPA)</h3>
                <p className="text-xs text-slate-400">Simulated IoT Air Filtration System Efficiency</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-400">Outdoor Air ({city})</span>
                <div className="text-3xl font-black mt-1" style={{ color: aqiInfo.color }}>{data?.aqi || 50}</div>
                <span className="text-xs text-slate-400 font-mono">PM2.5: {data?.iaqi?.pm25?.v || 14} µg/m³</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Indoor HEPA Purified</span>
                <div className="text-3xl font-black text-emerald-400 mt-1">12</div>
                <span className="text-xs text-emerald-300 font-mono">PM2.5: 2.1 µg/m³ (91% Clean)</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-bold block">Particulate Filter Efficiency</span>
                  <span className="text-slate-400">H13 True HEPA Mechanical Filtration</span>
                </div>
                <span className="text-sm font-black text-emerald-400 font-mono">99.97%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-bold block">Filter Lifespan Status</span>
                  <span className="text-slate-400">Est. 120 days remaining</span>
                </div>
                <span className="text-sm font-black text-cyan-400 font-mono">78%</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIndoorModalOpen(false);
                setIsAiOpen(true);
                handleSendAiMessage('What are the best indoor air purifiers and settings for high pollution days?');
              }}
              className="w-full mt-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Bot className="w-4 h-4" /> Ask AI For Purification Advice
            </button>
          </div>
        </div>
      )}

      {/* --- CITY COMPARISON MODAL --- */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative">
            <button
              onClick={() => setCompareModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Split className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Atmospheric Comparison Engine</h3>
                <p className="text-xs text-slate-400">Compare air telemetry side-by-side between international stations</p>
              </div>
            </div>

            {/* City Selection Form */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Target comparison city (e.g., Delhi, Paris, Tokyo)..."
                value={compareCityName}
                onChange={(e) => setCompareCityName(e.target.value)}
                className="flex-1 bg-slate-900 text-xs text-slate-100 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
              <button
                onClick={() => fetchCompareData(compareCityName)}
                disabled={compareLoading}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                {compareLoading ? 'Comparing...' : 'Compare'}
              </button>
            </div>

            {compareData && data && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Station A (Current) */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Current Station</span>
                    <h4 className="text-base font-bold text-white truncate mt-0.5">{data.city?.name || city}</h4>
                    <div className="flex items-baseline gap-2 my-3">
                      <span className="text-4xl font-black" style={{ color: aqiInfo.color }}>{data.aqi}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${aqiInfo.badgeBg}`}>
                        {aqiInfo.label}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>PM2.5:</span>
                      <strong className="text-slate-200">{data.iaqi?.pm25?.v || '—'} µg/m³</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>PM10:</span>
                      <strong className="text-slate-200">{data.iaqi?.pm10?.v || '—'} µg/m³</strong>
                    </div>
                  </div>
                </div>

                {/* Station B (Comparison) */}
                {(() => {
                  const compInfo = getAQIDetails(compareData.aqi);
                  const diff = compareData.aqi - data.aqi;
                  const pct = Math.round((Math.abs(diff) / Math.max(data.aqi, 1)) * 100);

                  return (
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Comparison Station</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              diff > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {diff > 0 ? `+${pct}% more polluted` : `-${pct}% cleaner`}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white truncate mt-0.5">{compareData.name}</h4>
                        <div className="flex items-baseline gap-2 my-3">
                          <span className="text-4xl font-black" style={{ color: compInfo.color }}>{compareData.aqi}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${compInfo.badgeBg}`}>
                            {compInfo.label}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span>PM2.5:</span>
                          <strong className="text-slate-200">{compareData.pm25} µg/m³</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>PM10:</span>
                          <strong className="text-slate-200">{compareData.pm10} µg/m³</strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- POLLUTANT DEEP DIVE MODAL --- */}
      {selectedPollutant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-7 border border-white/15 shadow-2xl relative">
            <button
              onClick={() => setSelectedPollutant(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-black text-lg font-mono">
                {selectedPollutant.formula}
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{selectedPollutant.name}</h3>
                <p className="text-xs text-slate-400">{selectedPollutant.sub}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/5">
                <span className="text-[11px] text-slate-400 block mb-1">Current Concentration</span>
                <span className="text-2xl font-black text-white">{selectedPollutant.currentVal ?? '—'}</span>
                <span className="text-xs font-mono text-slate-400 ml-1">{selectedPollutant.unit}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/5">
                <span className="text-[11px] text-slate-400 block mb-1">WHO Safe Limit</span>
                <span className="text-2xl font-black text-emerald-400">{selectedPollutant.safeLimit}</span>
                <span className="text-xs font-mono text-slate-400 ml-1">{selectedPollutant.unit}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
                <strong className="text-slate-200 block mb-1">Primary Emission Sources:</strong>
                <p className="text-slate-400">{selectedPollutant.sources}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5">
                <strong className="text-slate-200 block mb-1">Physiological & Health Impact:</strong>
                <p className="text-slate-400">{selectedPollutant.healthEffects}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                <strong className="block mb-1 text-cyan-200">Recommended Action:</strong>
                <p>{selectedPollutant.advice}</p>
              </div>
            </div>

            <button
              onClick={() => {
                const pollutantName = selectedPollutant.name;
                setSelectedPollutant(null);
                setIsAiOpen(true);
                handleSendAiMessage(`Tell me more about how to protect against high ${pollutantName} levels.`);
              }}
              className="w-full mt-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Bot className="w-4 h-4" /> Ask AI Assistant About This Compound
            </button>
          </div>
        </div>
      )}

      {/* --- 5. AI AQI ASSISTANT (FAB & CHATBOT PANEL) --- */}
      <button
        onClick={() => setIsAiOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center border border-cyan-300/40"
        style={{
          boxShadow: '0 10px 30px -5px rgba(6, 182, 212, 0.5)',
        }}
        aria-label="Open AI Air Quality Assistant"
      >
        {isAiOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <div className="relative">
            <Bot className="w-6 h-6 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
          </div>
        )}
      </button>

      {isAiOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[600px] h-[520px] rounded-3xl glass-panel shadow-2xl border border-white/15 backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Air Quality Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                </h4>
                <p className="text-[11px] text-slate-400">Contextual to {city} (AQI {data?.aqi || '—'})</p>
              </div>
            </div>
            <button
              onClick={() => setIsAiOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-900/90 text-slate-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-9">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                <span className="text-[11px] text-slate-400">Analyzing atmospheric factors...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-slate-900/60 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              'Can I run outside?',
              'Allergen forecast',
              'Best workout window today',
              'Should I wear an N95?',
              'Explain PM2.5',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendAiMessage(chip)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] shrink-0 border border-white/10 transition"
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendAiMessage();
            }}
            className="p-3 bg-slate-900 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about air safety..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-950 text-xs text-slate-100 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
