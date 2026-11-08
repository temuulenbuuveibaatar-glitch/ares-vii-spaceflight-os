import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  HISTORICAL_MISSION_INCIDENTS,
  type HistoricalMissionIncident,
} from "../data/historicalMissionIncidents";
import { xiaomiWatchService } from "../services/xiaomiWatchService";
import {
  ArrowUpRight,
  ShieldCheck,
  Orbit,
  Watch,
  Globe,
  RefreshCw,
  AlertTriangle,
  Bot,
  Activity,
  HeartPulse,
  Radio,
  Satellite,
  Brain,
  CheckCircle2,
  Stethoscope,
  Pill,
  Sparkles,
} from "lucide-react";

const CATEGORY_TABS = [
  { id: "ALL", label: "All Missions" },
  { id: "DEPRESSURIZATION", label: "Depressurization" },
  { id: "RADIATION_SPE", label: "Solar Radiation" },
  { id: "CARDIOVASCULAR_0G", label: "0G Cardiovascular" },
  { id: "FIRE_TOXIC_ATMOSPHERE", label: "Cabin Fire & CO₂" },
  { id: "EVA_SUIT_EMERGENCY", label: "EVA Suit" },
  { id: "BALLISTIC_REENTRY_TRAUMA", label: "Ballistic Re-Entry" },
];

interface SelfCheckSymptom {
  id: string;
  hazardDomain: string;
  label: string;
  clinicalMeaning: string;
  countermeasureAction: string;
  recommendedMedication: string;
  shipAndEarthAction: string;
}

const ASTRONAUT_SELF_CHECK_SYMPTOMS: SelfCheckSymptom[] = [
  {
    id: "sym-dizziness",
    hazardDomain: "Altered Gravity & Cardiovascular",
    label: "Lightheadedness, Facial Puffiness, or Palpitations",
    clinicalMeaning:
      "Cephalad fluid shift (+18% thoracic volume) or baroreceptor deconditioning with transient orthostatic hypotension / arrhythmia.",
    countermeasureAction:
      "Inflate Soyuz-39 'Vorotnik' cervical collar (30 mmHg) or enter Soviet 'Chibis-M' LBNP trousers (-35 mmHg) for 30 minutes.",
    recommendedMedication:
      "China CMSA Taikong Yangxin Wan (1 packet PO) or Soviet Panangin + Riboxin metabolic protocol.",
    shipAndEarthAction:
      "Hermes AI caps spacecraft thruster maneuvers at <= 2.2G and transmits live 12-lead ECG + cuff BP packet to Houston & Berlin Mission Control.",
  },
  {
    id: "sym-vision-headache",
    hazardDomain: "Altered Gravity & Neuro-Ocular (SANS)",
    label: "Blurred Near Vision, Phosphenes, or Throbbing Orbital Headache",
    clinicalMeaning:
      "Spaceflight-Associated Neuro-Ocular Syndrome (SANS) from venous congestion and elevated intracranial pressure (ICP), or cabin CO₂ > 3.5 mmHg.",
    countermeasureAction:
      "Apply Russian 'Braslet-M' femoral thigh cuffs (35 mmHg) to pool 285 mL blood in legs; boost cabin LiOH/CDRA CO₂ scrubber to maximum.",
    recommendedMedication:
      "Acetazolamide (Diamox) 250 mg PO BID to lower CSF production and intraocular/intracranial pressure.",
    shipAndEarthAction:
      "Hermes AI increases cabin O₂/N₂ circulation fan speed by +30% and alerts Mission Control Flight Surgeon with fundus/OCT log.",
  },
  {
    id: "sym-radiation-nausea",
    hazardDomain: "Space Radiation & Immune Changes",
    label: "Fatigue, Metallic Taste, or Nausea During Solar Proton Alert",
    clinicalMeaning:
      "Prodromal acute radiation oxidative stress or South Atlantic Anomaly / Solar Particle Event (SPE) hematopoietic exposure.",
    countermeasureAction:
      "Relocate immediately to aft 50 g/cm² Water-Wall Storm Shelter and don HDPE AstroRad torso vest.",
    recommendedMedication:
      "Soviet Indralin (B-190) 450 mg PO immediately (DRF 1.45) + Ondansetron 8 mg ODT + Filgrastim G-CSF if dose > 1.5 Gy.",
    shipAndEarthAction:
      "Hermes NAV-PILOT slews spacecraft tail-to-Sun (180° yaw) to place engines & water tanks between solar protons and crew; sends PRIORITY-1 alert to DSN.",
  },
  {
    id: "sym-bone-renal",
    hazardDomain: "Bone Loss & Hypercalciuria",
    label: "Lower Back Ache, Flank Pain, or Cloudy/Concentrated Urine",
    clinicalMeaning:
      "Unloading-induced osteoclastic calcium mobilization (-1.5%/mo BMD loss) increasing risk of calcium oxalate kidney stones in 0G.",
    countermeasureAction:
      "Drink 500 mL pressurized water pouch immediately; perform 90 min ARED resistive loading or wear Soviet 'Pingvin-3' 40 kgf axial suit.",
    recommendedMedication:
      "JAXA/NASA Alendronate 70 mg weekly + Potassium Citrate 20 mEq PO to alkalinize urine and inhibit stone crystallization.",
    shipAndEarthAction:
      "Hermes logs hydration & urinary calcium index to 24/7 EHR and schedules ultrasound bladder/renal scan with Earth telemetry sync.",
  },
  {
    id: "sym-isolation-sleep",
    hazardDomain: "Isolation, Confinement & Behavioral Health",
    label: "Insomnia, Crew Friction, Brain Fog, or Confinement Anxiety",
    clinicalMeaning:
      "Circadian phase drift (+1.8h per Soyuz-39 Biorhythm study) and HPA-axis cortisol elevation from long-duration confinement.",
    countermeasureAction:
      "Launch Hermes Voice CBT Therapy & 4-7-8 Autonomic Breathing session; switch cabin LEDs to 480nm blue-depleted evening spectrum.",
    recommendedMedication:
      "Soviet Phenibut 250 mg PO (zero sedation latency penalty) or Mongolian Altai Rhodiola / Eleutherococcus adaptogen.",
    shipAndEarthAction:
      "Stored 100% privately in On-Device Encrypted Psychological Vault while anonymized readiness status is updated on ship board.",
  },
];

export default function Home() {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    HISTORICAL_MISSION_INCIDENTS[0].id
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // 24/7 Astronaut Self-Evaluation & Action Tool State
  const [selectedCrewId, setSelectedCrewId] = useState<string>("astro-1");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    "sym-dizziness",
  ]);
  const [selfEvalSubmittedAt, setSelfEvalSubmittedAt] = useState<string | null>(
    null
  );

  // Live 25Hz ECG Waveform from Xiaomi Watch H1 Service
  const [ecgPoints, setEcgPoints] = useState<number[]>(() =>
    Array(60).fill(0)
  );

  useEffect(() => {
    const unsub = xiaomiWatchService.subscribeWaveform((_buf, sample) => {
      if (sample && typeof sample.ecgMv === "number") {
        setEcgPoints((prev) => [...prev.slice(-59), sample.ecgMv]);
      }
    });
    return () => unsub();
  }, []);

  const {
    data: liveSpace,
    isFetching: isRefreshingSpace,
    refetch: refetchLiveSpace,
  } = useQuery<any>({
    queryKey: ["/api/space-data/live"],
    refetchInterval: 10000,
  });

  const { data: overview, isLoading: isLoadingOverview } = useQuery<any>({
    queryKey: ["/api/mission/overview"],
    refetchInterval: 2500,
  });

  const overrideMutation = useMutation({
    mutationFn: async (engaged: boolean) => {
      const res = await apiRequest("POST", "/api/ship/override", {
        engaged,
        authorizedBy: "Cmdr. Elena Vance",
        reason: engaged
          ? "Manual crew override engaged"
          : "Hermes Autonomous Authority restored",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mission/overview"] });
    },
  });

  // Execute Self-Evaluation Countermeasure & Notify Both Hermes AI + Earth Mission Control Immediately
  const actOnHealthMutation = useMutation({
    mutationFn: async () => {
      const matched = ASTRONAUT_SELF_CHECK_SYMPTOMS.filter((s) =>
        selectedSymptoms.includes(s.id)
      );
      const summary = matched.map((m) => m.label).join("; ");
      const actions = matched.map((m) => m.countermeasureAction).join(" | ");

      // 1. Notify Earth Mission Control + Satellite Relays immediately
      await apiRequest("POST", "/api/earth-comm/send", {
        sender: "24/7 Astronaut Self-Evaluation & Watchdog",
        priority: "EMERGENCY",
        message: `[IMMEDIATE CREW HEALTH EVALUATION] Indicators reported: ${summary}. Countermeasures initiated: ${actions}. Ship AI & Mission Control synchronized.`,
        attachTelemetry: true,
      });

      // 2. Trigger Hermes AI autonomous protection
      const res = await apiRequest("POST", "/api/hermes/command", {
        prompt: `Astronaut self-evaluation triggered for: ${summary}. Stabilize cabin, lock safe G-load, and confirm Earth uplink.`,
      });
      return res.json();
    },
    onSuccess: () => {
      setSelfEvalSubmittedAt(new Date().toLocaleTimeString());
      queryClient.invalidateQueries({ queryKey: ["/api/mission/overview"] });
    },
  });

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const astronauts = overview?.astronauts || [];
  const latestMap = overview?.latestTelemetryByAstronaut || {};
  const autopilot = overview?.autopilotState;
  const activeCrew =
    astronauts.find((a: any) => a.id === selectedCrewId) || astronauts[0];
  const activeTele = activeCrew ? latestMap[activeCrew.id] : null;

  const filteredIncidents = HISTORICAL_MISSION_INCIDENTS.filter(
    (inc) => categoryFilter === "ALL" || inc.category === categoryFilter
  );

  const activeIncident: HistoricalMissionIncident =
    HISTORICAL_MISSION_INCIDENTS.find((i) => i.id === selectedIncidentId) ||
    HISTORICAL_MISSION_INCIDENTS[0];

  const activeSymptomObjects = ASTRONAUT_SELF_CHECK_SYMPTOMS.filter((s) =>
    selectedSymptoms.includes(s.id)
  );

  return (
    <div className="bg-[#0b0e0a] text-[#e3ecd8] min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-10">
        {/* TACTICAL PORTAL 1 LINK BANNER */}
        <div className="bg-[#13190e] border border-[#354528] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#182213] text-[#fbbf24] border border-[#3f5231] rounded-xl">
              <Sparkles className="w-5 h-5 text-[#fbbf24]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>PORTAL 1: MISSION & SCIENCE SPECIFICATION</span>
                <span className="text-[10px] bg-[#243319] text-[#a3c988] border border-[#3f5231] px-2 py-0.5 rounded font-mono">TACTICAL SPEC</span>
              </div>
              <p className="text-xs text-[#a8baa0] font-sans mt-0.5">
                Who is it for? Why does it matter? 4 deep-space hazards in plain English, real Apollo/Salyut flight data, and research handbook.
              </p>
            </div>
          </div>
          <Link href="/">
            <button className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] font-bold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors active:scale-[0.97]">
              <span>EXPLORE PORTAL 1 SPEC</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* HERO SECTION + ALWAYS-ON EARTH & SATELLITE CONNECTIVITY WATCHDOG */}
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#232d1a] pb-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#fbbf24]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                <span>
                  PORTAL 2: 24/7 ASTRONAUT HEALTH MONITOR & AUTONOMOUS ACTION CENTER
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans">
                Operational Spaceflight Health Cockpit & Emergency Interlock
              </h1>
              <p className="text-sm text-[#a8baa0] leading-relaxed">
                Long-duration missions expose astronauts to space radiation,
                isolation and confinement, altered gravity, bone loss, and
                hostile closed environments. Sonnenblume continuously monitors
                biometrics 24/7, empowers astronauts to evaluate and act on
                health changes themselves, and keeps the spacecraft linked to
                Earth and relay satellites at all times so both Ship AI and
                Mission Control know immediately if anything goes wrong.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link href="/hermes">
                <button className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-500/10 active:scale-[0.97]">
                  <Brain className="w-4 h-4 text-[#0b0e0a]" />
                  <span>AI Therapy & Voice Guide</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/space-encyclopedia">
                <button className="bg-[#13190e] hover:bg-[#1c2615] text-[#c7dfb8] border border-[#2e3b23] px-3.5 py-2.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97]">
                  <Pill className="w-4 h-4 text-[#fbbf24]" />
                  <span>Multi-Agency Meds</span>
                </button>
              </Link>
              <Link href="/gmat-orbiter">
                <button className="bg-[#13190e] hover:bg-[#1c2615] text-[#c7dfb8] border border-[#2e3b23] px-3.5 py-2.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97]">
                  <Orbit className="w-4 h-4 text-[#84a96c]" />
                  <span>NASA GMAT R2026a</span>
                </button>
              </Link>
              <a
                href="/Sonnenblume_Complete_Space_Health_and_Mission_Research_Guide.docx"
                download="Sonnenblume_Space_Health_Research_Guide.docx"
                className="bg-[#13190e] hover:bg-[#1c2615] text-[#c7dfb8] border border-[#2e3b23] px-3.5 py-2.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
              >
                <ArrowUpRight className="w-4 h-4 text-[#fbbf24]" />
                <span>Research (.docx)</span>
              </a>
            </div>
          </div>

          {/* 24/7 CONTINUOUS EARTH & SATELLITE CONNECTIVITY WATCHDOG BAR */}
          <div className="card-outer">
            <div className="card-inner p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#232d1a] pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                  <Satellite className="w-4 h-4 text-[#fbbf24]" />
                  <span>
                    COMMUNICATION WATCHDOG: SPACECRAFT ↔ SATELLITE ↔ EARTH DSN
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-[#84a96c] inline-flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#84a96c]" />
                    <span>ALL LINKS LOCKED (0% PACKET LOSS)</span>
                  </span>
                  <span className="text-[#8ea873] tabular-nums">
                    Auto-Alert Latency: 1.28s
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs font-mono">
                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between text-[#8ea873]">
                    <span>NASA DSN Goldstone</span>
                    <span className="text-[#84a96c] font-bold">LOCKED</span>
                  </div>
                  <div className="font-semibold text-white tabular-nums">
                    X/Ka-Band · 142.4 Mbps
                  </div>
                  <div className="text-[11px] text-[#8ea873] font-sans">
                     Houston Flight Surgeon Live Stream
                  </div>
                </div>

                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between text-[#8ea873]">
                    <span>TDRS-M & Lunar Relay</span>
                    <span className="text-[#84a96c] font-bold">ACTIVE</span>
                  </div>
                  <div className="font-semibold text-white tabular-nums">
                    S-Band Omni · 99.98%
                  </div>
                  <div className="text-[11px] text-[#8ea873] font-sans">
                    Zero-Blackout Orbital Handover
                  </div>
                </div>

                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between text-[#8ea873]">
                    <span>Berlin Mission Hub</span>
                    <span className="text-[#84a96c] font-bold">ONLINE</span>
                  </div>
                  <div className="font-semibold text-white tabular-nums">
                    47.77°N, 107.25°E
                  </div>
                  <div className="text-[11px] text-[#8ea873] font-sans">
                    Asian Hemisphere Biomedical Backup
                  </div>
                </div>

                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between text-[#8ea873]">
                    <span>NOAA GOES Proton Flux</span>
                    <button
                      onClick={() => refetchLiveSpace()}
                      className="text-[#8ea873] hover:text-white cursor-pointer active:scale-[0.97]"
                      title="Refresh live NOAA & ISS feed"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${
                          isRefreshingSpace ? "animate-spin text-[#fbbf24]" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <div className="font-semibold text-[#fbbf24] tabular-nums">
                    {liveSpace?.radiation?.estimatedLeoDoseRateUsvHr ?? 18.4}{" "}
                    µSv/h ({liveSpace?.radiation?.goesProtonFlux10MeV ?? 0.24}{" "}
                    PFU)
                  </div>
                  <div className="text-[11px] text-[#8ea873] font-sans">
                    Solar Wind:{" "}
                    {liveSpace?.solarWind?.speedKmS ?? 412.5} km/s
                  </div>
                </div>

                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#8ea873]">
                    <span>Hermes Ship AI</span>
                    <span
                      className={`font-semibold ${
                        autopilot?.humanOverrideEngaged
                          ? "text-[#fbbf24]"
                          : "text-[#84a96c]"
                      }`}
                    >
                      {autopilot?.humanOverrideEngaged ? "MANUAL" : "ARMED"}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      overrideMutation.mutate(!autopilot?.humanOverrideEngaged)
                    }
                    disabled={overrideMutation.isPending}
                    className="w-full bg-[#182213] hover:bg-[#24331c] text-[#fbbf24] border border-[#3f5231] py-1.5 rounded-md text-xs font-bold cursor-pointer mt-1 active:scale-[0.97] transition-colors"
                  >
                    {autopilot?.humanOverrideEngaged
                      ? "Restore Hermes AI"
                      : "Engage Manual Override"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE CHALLENGE MODULE: 24/7 ASTRONAUT HEALTH INDICATOR MONITOR & SELF-EVALUATION WORKBENCH */}
        <section className="space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#fbbf24]" />
                <span>
                  24/7 Astronaut Health Evaluation & Autonomous Action Center
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#a8baa0]">
                Monitors the 5 long-duration spaceflight hazards in real time
                and enables astronauts to evaluate their own symptoms and trigger
                immediate medical + spacecraft countermeasures.
              </p>
            </div>

            {/* Select Active Crew Member */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {astronauts.map((astro: any) => {
                const isSelected = astro.id === (activeCrew?.id || "astro-1");
                return (
                  <button
                    key={astro.id}
                    onClick={() => setSelectedCrewId(astro.id)}
                    className={`px-3 py-1.5 rounded-lg border cursor-pointer active:scale-[0.97] transition-colors ${
                      isSelected
                        ? "bg-[#28381c] text-[#fbbf24] border-[#4d633b] font-bold shadow-sm shadow-amber-500/10"
                        : "bg-[#13190e] text-[#8ea873] border-[#2e3b23] hover:text-white hover:bg-[#1a2313]"
                    }`}
                  >
                    {astro.name} ({astro.callsign})
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5 LONG-DURATION SPACEFLIGHT HAZARD INDICATORS + LIVE 25HZ ECG */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left 5 Cols: Real-Time Biometric Oscilloscope & 5 Hazard Indicators */}
            <div className="lg:col-span-5 card-outer">
              <div className="card-inner p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#232d1a] pb-3">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-[#fbbf24]" />
                      <span>
                        {activeCrew?.name || "Cmdr. Elena Vance"} · 24/7 Vitals
                      </span>
                    </div>
                    <div className="text-xs text-[#8ea873]">
                      Xiaomi Watch H1 25Hz Lead-I ECG + Micro-Pump Cuff BP
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#fbbf24] tabular-nums">
                    {activeTele?.heartRate ?? 72} BPM ·{" "}
                    {activeTele?.bloodPressureSys ?? 118}/
                    {activeTele?.bloodPressureDia ?? 76}
                  </span>
                </div>

                {/* Live 25Hz ECG Waveform */}
                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-[11px] text-[#8ea873]">
                    <span>LIVE 25HZ ECG TRACE (mV)</span>
                    <span className="text-[#84a96c] font-bold">
                      SpO₂ {activeTele?.spo2 ?? 98.4}% · HRV{" "}
                      {activeTele?.hrvMs ?? 58} ms
                    </span>
                  </div>
                  <svg viewBox="0 0 300 64" className="w-full h-14">
                    <polyline
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="1.8"
                      points={ecgPoints
                        .map((v, idx) => {
                          const x = (idx / 59) * 300;
                          const y = 32 - v * 22;
                          return `${x.toFixed(1)},${y.toFixed(1)}`;
                        })
                        .join(" ")}
                    />
                  </svg>
                </div>

                {/* The 5 Long-Duration Spaceflight Hazard Domains */}
                <div className="space-y-2 text-xs">
                  <div className="text-[11px] font-mono font-bold text-[#8ea873] uppercase tracking-wider">
                    5 Long-Duration Spaceflight Hazard Indicators
                  </div>

                  <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">
                        1. Space Radiation & Immune Status
                      </div>
                      <div className="text-[11px] text-[#8ea873]">
                        Cumulative Dose vs NASA 600 mSv / IBMP 1,000 mSv Limit
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#fbbf24] tabular-nums">
                      {activeCrew?.cumulativeRadiationMsv ?? 42.8} mSv
                    </span>
                  </div>

                  <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">
                        2. Isolation, Confinement & Behavioral
                      </div>
                      <div className="text-[11px] text-[#8ea873]">
                        Autonomic Stress Index & Sleep Readiness
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#84a96c] tabular-nums">
                      {activeCrew?.mentalHealthScore ?? 94}% Ready
                    </span>
                  </div>

                  <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">
                        3. Altered Gravity & Cardiovascular
                      </div>
                      <div className="text-[11px] text-[#8ea873]">
                        Cephalad Fluid Shift & Safe G-Load Ceiling
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white tabular-nums">
                      Max {(autopilot?.maxGLoad ?? 2.8).toFixed(2)}G
                    </span>
                  </div>

                  <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">
                        4. Bone Mineral Loss & Renal Stone Risk
                      </div>
                      <div className="text-[11px] text-[#8ea873]">
                        DEXA Trabecular T-Score (JAXA Bisphosphonate Active)
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white tabular-nums">
                      T-Score {activeCrew?.boneDensityTScore ?? -0.4}
                    </span>
                  </div>

                  <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">
                        5. Hostile Closed Environment (Cabin ECLSS)
                      </div>
                      <div className="text-[11px] text-[#8ea873]">
                        Cabin Pressure, O₂ Partial Pressure & CO₂ Scrubbing
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#84a96c] tabular-nums">
                      101.3 kPa · CO₂ 2.1 mmHg
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Interactive Astronaut Self-Evaluation & Action Plan */}
            <div className="lg:col-span-7 card-outer">
              <div className="card-inner p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#232d1a] pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Spot & Evaluate Changes in Yourself (Interactive Crew Self-Check)
                    </h3>
                    <p className="text-xs text-[#a8baa0]">
                      Select any health indicators or symptoms you notice below
                      to generate your immediate clinical action plan and alert
                      Hermes AI + Earth Mission Control.
                    </p>
                  </div>
                  {selfEvalSubmittedAt && (
                    <span className="text-xs font-mono text-[#84a96c] inline-flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Dispatched at {selfEvalSubmittedAt}</span>
                    </span>
                  )}
                </div>

                {/* Symptom Checkboxes */}
                <div className="space-y-2">
                  {ASTRONAUT_SELF_CHECK_SYMPTOMS.map((sym) => {
                    const checked = selectedSymptoms.includes(sym.id);
                    return (
                      <div
                        key={sym.id}
                        onClick={() => toggleSymptom(sym.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer flex items-start justify-between gap-3 transition-colors active:scale-[0.98] ${
                          checked
                            ? "bg-[#182213] border-[#4d633b] text-white shadow-sm shadow-amber-500/10"
                            : "bg-[#0b0e0a] border-[#232d1a] text-[#8ea873] hover:bg-[#13190e] hover:text-[#e3ecd8]"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="text-[11px] font-mono font-bold text-[#fbbf24]">
                            {sym.hazardDomain}
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-white">
                            {sym.label}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="mt-1 accent-[#fbbf24] w-4 h-4 rounded cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Generated Action Plan for Selected Indicators */}
                {activeSymptomObjects.length > 0 && (
                  <div className="bg-[#13190e] border border-[#2e3b23] rounded-xl p-4 space-y-3">
                    <div className="text-xs font-mono font-bold text-[#fbbf24] uppercase tracking-wider">
                      Autonomous Clinical Evaluation & Prescribed Action Plan
                    </div>
                    <div className="space-y-3">
                      {activeSymptomObjects.map((item) => (
                        <div
                          key={item.id}
                          className="border-b border-[#232d1a] last:border-b-0 pb-3 last:pb-0 space-y-1.5 text-xs"
                        >
                          <div className="font-semibold text-white">
                            • {item.label}
                          </div>
                          <div className="text-[#a8baa0]">
                            <strong className="text-white">
                              What It Means:
                            </strong>{" "}
                            {item.clinicalMeaning}
                          </div>
                          <div className="text-[#a8baa0]">
                            <strong className="text-[#fbbf24]">
                              What You Should Do Now:
                            </strong>{" "}
                            {item.countermeasureAction}
                          </div>
                          <div className="text-[#a8baa0]">
                            <strong className="text-[#84a96c]">
                              Onboard Medication:
                            </strong>{" "}
                            {item.recommendedMedication}
                          </div>
                          <div className="text-[#8ea873] font-mono text-[11px]">
                            Ship AI & Earth Link: {item.shipAndEarthAction}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => actOnHealthMutation.mutate()}
                      disabled={actOnHealthMutation.isPending}
                      className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] font-bold py-2.5 rounded-xl text-xs inline-flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] transition-colors"
                    >
                      <Radio className="w-4 h-4 text-[#0b0e0a]" />
                      <span>
                        {actOnHealthMutation.isPending
                          ? "Executing Countermeasures & Alerting Earth..."
                          : "Execute Countermeasures & Notify Ship AI + Mission Control Now"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* HISTORICAL SPACE MISSION INCIDENTS & CREW SURVIVAL PROTOCOLS */}
        <section className="space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Historical Space Mission Incidents & Crew Survival Protocols
              </h2>
              <p className="text-xs sm:text-sm text-[#a8baa0]">
                Select any mission below to inspect the exact physical cause,
                measured flight telemetry, and how astronauts prevent or survive
                it today.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {CATEGORY_TABS.map((tab) => {
                const isActive = categoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors active:scale-[0.97] ${
                      isActive
                        ? "bg-[#28381c] text-[#fbbf24] border-[#4d633b] font-bold shadow-sm shadow-amber-500/10"
                        : "bg-[#13190e] text-[#8ea873] border-[#2e3b23] hover:border-[#3f5231] hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left 4 Columns: Clean Mission List */}
            <div className="lg:col-span-4 card-outer space-y-1.5">
              {filteredIncidents.map((inc) => {
                const isSelected = inc.id === activeIncident.id;
                return (
                  <button
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`w-full text-left p-4 rounded-[10px] border cursor-pointer transition-colors active:scale-[0.98] ${
                      isSelected
                        ? "bg-[#182213] border-[#4d633b] text-white shadow-sm shadow-amber-500/10"
                        : "bg-[#0b0e0a] border-[#232d1a] text-[#8ea873] hover:bg-[#13190e] hover:text-[#e3ecd8]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1 font-mono">
                      <span className="text-[#fbbf24] font-bold">
                        {inc.countryCode} · {inc.date}
                      </span>
                      <span className="text-[11px] text-[#8ea873]">
                        {inc.agency.split("(")[0].trim()}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white leading-snug">
                      {inc.missionName}
                    </div>
                    <div className="text-xs text-[#8ea873] mt-1.5 truncate">
                      {inc.crew.join(", ")}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right 8 Columns: Incident Analysis & Prevention Workbench */}
            <div className="lg:col-span-8 card-outer">
              <div className="card-inner p-6 sm:p-8 space-y-8">
                <div className="border-b border-[#232d1a] pb-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#8ea873] font-mono">
                    <span className="font-bold text-[#fbbf24]">
                      {activeIncident.agency} · {activeIncident.date}
                    </span>
                    <span>Crew: {activeIncident.crew.join(", ")}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {activeIncident.missionName}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    {activeIncident.measuredMetrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 font-mono"
                      >
                        <div className="text-[11px] text-[#8ea873]">
                          {m.label}
                        </div>
                        <div className="text-sm font-bold text-white mt-0.5 tabular-nums">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#fbbf24]" />
                      <span>What Happened to the Mission</span>
                    </h4>
                    <p className="text-sm text-[#a8baa0] leading-relaxed">
                      {activeIncident.whatHappened}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Orbit className="w-4 h-4 text-[#84a96c]" />
                      <span>Physical & Physiological Root Cause</span>
                    </h4>
                    <p className="text-sm text-[#a8baa0] leading-relaxed">
                      {activeIncident.scientificMechanism}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-[#232d1a]">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#84a96c]" />
                    <span>
                      How Astronauts Prevent & Survive This Scenario Today
                    </span>
                  </h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-4 space-y-2.5">
                      <div className="text-xs font-mono font-bold text-[#fbbf24]">
                        Engineering & In-Orbit Prevention
                      </div>
                      <ul className="space-y-2 text-xs text-[#e3ecd8] leading-relaxed">
                        {activeIncident.howToPreventAndSurvive.beforeMissionOrInOrbit.map(
                          (item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#fbbf24] font-mono mt-0.5">
                                {i + 1}.
                              </span>
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-4 space-y-2.5">
                      <div className="text-xs font-mono font-bold text-[#fbbf24]">
                        Immediate Crew Survival Checklist
                      </div>
                      <ul className="space-y-2 text-xs text-[#e3ecd8] leading-relaxed">
                        {activeIncident.howToPreventAndSurvive.immediateEmergencyActions.map(
                          (item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#fbbf24] font-mono mt-0.5">
                                {i + 1}.
                              </span>
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
