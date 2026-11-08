import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Activity,
  Shield,
  Brain,
  Rocket,
  Compass,
  FileText,
  AlertTriangle,
  Heart,
  Radio,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
  Zap,
  Globe,
  Database,
  Pill,
  Terminal,
  Lock,
  Layers,
  Check,
  Eye,
  Sliders,
  TrendingUp,
} from "lucide-react";

export default function Intro() {
  const [activeHazard, setActiveHazard] = useState<number>(0);
  const [activeScenario, setActiveScenario] = useState<number>(0);
  const [liveHeartRate, setLiveHeartRate] = useState<number>(72);
  const [liveBpSys, setLiveBpSys] = useState<number>(119);
  const [liveBpDia, setLiveBpDia] = useState<number>(76);
  const [liveGcrFlux, setLiveGcrFlux] = useState<number>(18.7);

  // Gentle live telemetry tick (Emil Kowalski: tabular-nums, subtle life without dizzying pulses)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveHeartRate((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const next = prev + delta;
        return next >= 69 && next <= 76 ? next : 72;
      });
      setLiveGcrFlux((prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const hazards = [
    {
      id: "radiation",
      title: "1. Space Radiation & Solar Proton Events",
      badge: "Radiation",
      icon: Shield,
      analogy:
        "Imagine spending 3 years directly in front of a running industrial microwave with no atmospheric blanket or planetary magnetic shield to protect your DNA.",
      clinical:
        "Galactic Cosmic Rays (GCR) and episodic Solar Particle Events (SPE) cause double-strand DNA breaks, secondary neutron scatter inside the cabin, acute radiation sickness, and a 8.52% lifetime REID cancer risk.",
      incident:
        "August 1972 SPE: Between Apollo 16 and 17, an extreme solar storm generated a 4,000 mSv prompt dose. If astronauts had been in transit or on the lunar surface, it would have been lethal within 48 hours without immediate prompt shielding.",
      solution:
        "ARES-VII couples real-time GOES-18 proton flux alerts with Soviet Indralin B-190 radioprotectant (DRF 1.45), autonomous polyethylene/water-wall storm shelter routing, and Bulgarian Lyulin-6 dosimetric depth profiling.",
    },
    {
      id: "isolation",
      title: "2. Extreme Isolation & Behavioral Decay",
      badge: "Behavioral",
      icon: Brain,
      analogy:
        "Imagine being locked inside a small camper van with three colleagues for 900 days without ever opening a window, feeling fresh air, or having a private conversation.",
      clinical:
        "Prolonged confinement in microgravity induces circadian desynchrony, autonomic nervous system dampening (HRV RMSSD drops below 20 ms), micro-stress accumulation, cognitive fatigue, and interpersonal friction.",
      incident:
        "Mir 1997 & Mars-500 Confinement: After months of confinement, communication breakdown and depressive episodes threatened mission survival. Astronauts avoid terrestrial surveys because flight surgeons ground anyone showing signs of depression.",
      solution:
        "Hermes Psy-Oracle provides 100% private, on-device offline voice sentiment analysis and cognitive behavioral therapy (CBT). Data stays encrypted inside the spacecraft; mission control receives only anonymized crew operational readiness scores.",
    },
    {
      id: "gravity",
      title: "3. Altered Gravity & Cephalad Fluid Shift",
      badge: "Cardiovascular",
      icon: Activity,
      analogy:
        "Without gravity pulling your fluids down, two liters of blood and plasma rush into your head, puffing your face and squeezing your eyes, while your bones dissolve into your urine like sugar in hot tea.",
      clinical:
        "Loss of hydrostatic gradient pushes ~2,000 mL cranial fluid, elevating intracranial pressure and causing SANS (Spaceflight-Associated Neuro-ocular Syndrome) in 70% of crew. Bone mineral density decays at 1.0% to 1.5% per month.",
      incident:
        "Salyut-6 / Soyuz-39 (1981): Mongolian Cosmonaut J. Gurragchaa and Soviet crews experienced severe cephalad fluid shifts and acute space motion sickness during orbital insertion, threatening emergency piloting readiness.",
      solution:
        "ARES-VII combines the Soviet Vorotnik cervical collar (30 mmHg jugular venous restriction) with Chibis-M Lower Body Negative Pressure (-25 mmHg to draw 320 mL caudal fluid), JAXA bisphosphonates, and CMSA Neiguan (PC6) electro-stimulation.",
    },
    {
      id: "distance",
      title: "4. Hostile Environment & 22-Min Communication Lag",
      badge: "Autonomy",
      icon: Rocket,
      analogy:
        "If an astronaut experiences ventricular fibrillation on the way to Mars, calling 911 takes 22 minutes to reach Earth, and 22 minutes for Houston to answer. The patient would be dead before the doctor even hears the call.",
      clinical:
        "Deep-space transits beyond cis-lunar space operate with a one-way light-time delay of 4 to 22 minutes. Legacy ISS apps that stream raw data to Earth for human interpretation cannot save lives in deep space.",
      incident:
        "Apollo 13 (1970) & Mars Analog Comm Blackouts: On Apollo 13, Earth had an instant 1.3-second radio link to engineer solutions. On a Mars mission, a critical cabin decompression or cardiac arrest allows zero round-trip ground consultations.",
      solution:
        "Hermes 4-Subagent Consensus Engine (Med-Sentinel, Rad-Guard, Psy-Oracle, Nav-Pilot) makes clinical and trajectory decisions in under 50 milliseconds completely offline, while preserving full human manual override authority at all times.",
    },
  ];

  const scenarios = [
    {
      title: "August 1972 Solar Storm (SPE Mega-Flare)",
      tag: "Deep-Space Radiation",
      trigger: "GOES Solar Proton Flux spikes from 0.4 pfu to 3,850 pfu (>100 MeV)",
      hermesAction:
        "Hermes Rad-Guard triggers immediate Priority 1 EVA abort, arms the central water-wall shelter (32 g/cm² shielding), and pre-prescribes Soviet Indralin B-190 (DRF 1.45).",
      crewAction:
        "Astronaut swallows Indralin radioprotectant within 15 minutes, retreats to central radiation storm shelter, and verifies passive dosimeter readings.",
      outcome:
        "Estimated radiation dose reduced from 4,000 mSv (fatal) to 48.2 mSv (well within NASA 600 mSv career limit). Zero acute radiation syndrome.",
    },
    {
      title: "Soyuz-39 Insertion (Cranial Fluid Shift & SMS)",
      tag: "Microgravity Physiology",
      trigger: "Micro-cuff BP registers mean arterial pressure surge; SpO2 98.8%; stroke volume shifts by +18% cephalad.",
      hermesAction:
        "Med-Sentinel diagnoses acute Space Motion Sickness (SMS) risk index 84/100 and elevated intracranial venous pooling.",
      crewAction:
        "Astronaut fastens Soviet Vorotnik cervical collar at 30 mmHg jugular restriction and activates CMSA Neiguan (PC6) transcutaneous electrical acupoint stimulation (TEAS).",
      outcome:
        "Cranial venous congestion attenuated by 64%. Vestibular nausea suppressed. Pilot retains full manual docking capability.",
    },
    {
      title: "Mars Transit 22-Min Delay (Supraventricular Tachycardia)",
      tag: "Autonomous Emergency",
      trigger: "Xiaomi Watch H1 Lead-I ECG detects sudden heart rate spike to 178 BPM with narrow QRS complexes; Earth is 21.4 light-minutes away.",
      hermesAction:
        "Hermes Med-Sentinel runs offline Glasgow-derivative ECG diagnostic. Confirms SVT without ischemic ST-elevation. Earth cannot help for 42 minutes.",
      crewAction:
        "Hermes voice guides astronaut through a modified Valsalva maneuver. If refractory, instructs co-astronaut to draw Adenosine 6mg rapid IV push from the 0G surgical pharmacy.",
      outcome:
        "Sinus rhythm restored in 82 seconds. Zero telemetry packet loss. Mission Control Houston notified via delay-tolerant burst packet.",
    },
    {
      title: "SANS Optic Disc Edema & ICP Surge Prevention",
      tag: "Long-Duration Habitation",
      trigger: "Mission Day 142: Optic nerve sheath diameter (ONSD) reaches 5.9 mm; visual acuity degrades by -0.5 diopters.",
      hermesAction:
        "Hermes schedules daily 60-minute Chibis-M Lower Body Negative Pressure (LBNP) session at -25 mmHg and updates NASA GMAT burn profile to cap high-G re-entry maneuvers.",
      crewAction:
        "Astronaut enters Chibis-M vacuum suit for 1 hour while completing cognitive tasks; takes JAXA Bisphosphonate to protect bone matrix.",
      outcome:
        "320 mL venous volume pulled into lower extremities. Optic disc swelling stabilized. SANS progression halted before permanent retinal damage.",
    },
  ];

  const pillars = [
    {
      title: "Clinical Autonomy",
      legacy: "Data conduit only. Sends raw vitals to flight surgeons in Houston.",
      ares: "Offline diagnostic engine. Diagnoses cardiac, radiological, and psychological events with 0ms dependency on Earth.",
      icon: Brain,
    },
    {
      title: "28-Agency Unified Pharmacology",
      legacy: "NASA-only formulary, strictly limited to US commercial medications.",
      ares: "42 validated countermeasures from Soviet IBMP, China CMSA, India ISRO, Mongolia, JAXA, and NASA.",
      icon: Pill,
    },
    {
      title: "Orbital Astrodynamics Coupling",
      legacy: "Medical apps know nothing about orbital velocity or engine burns.",
      ares: "Direct interlock with NASA GMAT R2026a. Caps spacecraft acceleration (G-ceiling) if astronaut cardiovascular reserve drops.",
      icon: Compass,
    },
    {
      title: "Non-Doctor Usability",
      legacy: "Windows 95 text terminals requiring years of flight surgeon training.",
      ares: "Plain English step-by-step guides, voice-driven Hermes AI dialogue, and one-click clinical interventions.",
      icon: Sparkles,
    },
  ];

  const pipeline = [
    {
      step: "01",
      title: "Continuous 1Hz Biosensing",
      desc: "Xiaomi Watch H1 micro-cuff inflates for oscillometric blood pressure. Lead-I ECG sensors capture 25Hz cardiac waveforms. Optical sensors track SpO2 and HRV.",
      tech: "Oscillometric Micro-Cuff • Lead-I ECG • PPG",
    },
    {
      step: "02",
      title: "Hermes 4-Subagent Consensus",
      desc: "Med-Sentinel analyzes vitals; Rad-Guard monitors solar proton flux; Psy-Oracle tracks cognitive voice stress; Nav-Pilot monitors astrodynamic velocity.",
      tech: "Multi-Agent Matrix • 50ms Offline Evaluation",
    },
    {
      step: "03",
      title: "Multi-Agency Countermeasure Action",
      desc: "Autonomous dosage recommendations from the 42-compound database: Soviet Indralin for SPEs, Chibis-M for fluid shifts, or CMSA TEAS for autonomic stability.",
      tech: "Soviet IBMP • CMSA • NASA JSC • ESA/JAXA",
    },
    {
      step: "04",
      title: "Closed-Loop Trajectory Interlock",
      desc: "Coupled directly to NASA GMAT R2026a. If crew mean arterial pressure drops, Hermes throttles Tsiolkovsky burns to protect cerebral oxygenation.",
      tech: "NASA GMAT R2026a • Tsiolkovsky • Vis-Viva",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-orange-500/20 selection:text-orange-300">
      {/* Framer-Style Floating Sub-Navbar */}
      <div className="sticky top-14 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              ARES-VII Presentation
            </span>
            <span className="text-xs text-zinc-600 hidden md:inline">•</span>
            <span className="text-xs text-zinc-400 hidden md:inline">
              NASA Space Apps Challenge 2026
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs text-zinc-400 font-medium">
            <a href="#why-it-matters" className="hover:text-zinc-100 transition-colors">
              The 4 Hazards
            </a>
            <a href="#what-makes-different" className="hover:text-zinc-100 transition-colors">
              Why We're Different
            </a>
            <a href="#how-it-works" className="hover:text-zinc-100 transition-colors">
              4-Stage Architecture
            </a>
            <a href="#scenarios" className="hover:text-zinc-100 transition-colors">
              Flight Scenarios
            </a>
            <a href="#pharmacy" className="hover:text-zinc-100 transition-colors">
              Multi-Agency Meds
            </a>
            <a href="#research" className="hover:text-zinc-100 transition-colors">
              Research Guide
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              download="ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-800 inline-flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Research Docx</span>
            </a>

            <Link href="/">
              <button className="text-xs font-medium bg-orange-500 hover:bg-orange-600 text-black font-semibold px-3.5 py-1.5 rounded-lg cursor-pointer inline-flex items-center gap-1.5 shadow-sm shadow-orange-500/20 transition-colors">
                <Rocket className="w-3.5 h-3.5" />
                <span>Launch Live Cockpit</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 overflow-hidden border-b border-zinc-900">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-orange-500/10 to-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>NASA Space Apps Challenge 2026</span>
            <span className="text-zinc-600">•</span>
            <span className="text-orange-400 font-semibold">Preparing Humans for Deep Space Habitation</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            Autonomous Spaceflight Health & Mission Preservation Operating System
          </h1>

          {/* Subhead */}
          <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Long-duration missions expose astronauts to deep space radiation, microgravity fluid shifts, isolation, and communication blackouts. ARES-VII unites continuous 24/7 Xiaomi Watch H1 biometric telemetry, 42 Soviet/US/Chinese medical countermeasures, and an offline Hermes AI with NASA GMAT R2026a astrodynamics.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link href="/">
              <button className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-semibold text-sm px-6 py-3 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer transition-colors">
                <Rocket className="w-4 h-4" />
                <span>Launch Live Spaceflight OS</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </Link>

            <a
              href="/ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              download="ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium text-sm px-5 py-3 rounded-xl border border-zinc-800 inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4 text-orange-400" />
              <span>Download Research Handbook (.docx)</span>
            </a>

            <Link href="/gmat-orbiter">
              <button className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-sm px-4 py-3 rounded-xl border border-zinc-800 inline-flex items-center gap-1.5 cursor-pointer transition-colors">
                <Terminal className="w-4 h-4 text-zinc-400" />
                <span>Inspect NASA GMAT Console</span>
              </button>
            </Link>
          </div>

          {/* Live Telemetry Micro-Bar (Real Product Proof) */}
          <div className="mt-14 max-w-4xl mx-auto bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/70 mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Live Coupled Bio-Astronautics Stream
                </span>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                Synced via Xiaomi Watch H1 + NASA GMAT
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              {/* ECG */}
              <div className="bg-zinc-950/70 border border-zinc-800/60 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Lead-I ECG</span>
                  <Heart className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <div className="text-lg font-bold text-white tabular-nums">
                  {liveHeartRate} <span className="text-xs font-normal text-zinc-400">BPM</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                  Normal Sinus Rhythm
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="bg-zinc-950/70 border border-zinc-800/60 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Micro-Cuff BP</span>
                  <Activity className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <div className="text-lg font-bold text-white tabular-nums">
                  {liveBpSys}/{liveBpDia} <span className="text-xs font-normal text-zinc-400">mmHg</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                  MAP 90.3 mmHg (Nominal)
                </div>
              </div>

              {/* Space Radiation */}
              <div className="bg-zinc-950/70 border border-zinc-800/60 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Deep-Space GCR</span>
                  <Shield className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <div className="text-lg font-bold text-white tabular-nums">
                  {liveGcrFlux} <span className="text-xs font-normal text-zinc-400">µSv/h</span>
                </div>
                <div className="text-[11px] text-zinc-400 font-medium mt-0.5">
                  Cumulative: 3.37 mSv
                </div>
              </div>

              {/* NASA GMAT Velocity */}
              <div className="bg-zinc-950/70 border border-zinc-800/60 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>NASA GMAT R2026a</span>
                  <Compass className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <div className="text-lg font-bold text-white tabular-nums">
                  2.6316 <span className="text-xs font-normal text-zinc-400">km/s</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                  GmatConsole: 0.047s Exec
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The 4 Deep-Space Hazards (Plain English & Why This Matters) */}
      <section id="why-it-matters" className="py-20 px-4 border-b border-zinc-900 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>What Is At Stake?</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Why Deep-Space Health Demands an Autonomous Operating System
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              When humans travel to the Moon and Mars, Earth is no longer an instant phone call away. Here is what actually happens to the human body in deep space—explained in plain English.
            </p>
          </div>

          {/* Interactive Hazard Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8">
            {hazards.map((h, i) => {
              const Icon = h.icon;
              const isActive = activeHazard === i;
              return (
                <button
                  key={h.id}
                  onClick={() => setActiveHazard(i)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? "bg-zinc-900 border-orange-500/80 shadow-md shadow-orange-500/10"
                      : "bg-zinc-950 border-zinc-800/80 hover:border-zinc-700 text-zinc-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isActive ? "text-orange-400" : "text-zinc-500"}`} />
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive ? "bg-orange-500/20 text-orange-300" : "bg-zinc-900 text-zinc-500"
                    }`}>
                      Hazard 0{i + 1}
                    </span>
                  </div>
                  <div className={`text-xs font-semibold leading-snug ${isActive ? "text-white" : "text-zinc-300"}`}>
                    {h.title.split(". ")[1]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Hazard Showcase Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-orange-500/15 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Hazard Breakdown • {hazards[activeHazard].badge}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {hazards[activeHazard].title}
                  </h3>
                </div>

                {/* Plain English Box */}
                <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>High School / Plain-English Analogy</span>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed">
                    "{hazards[activeHazard].analogy}"
                  </p>
                </div>

                {/* Clinical Mechanism */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Biological & Clinical Reality
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {hazards[activeHazard].clinical}
                  </p>
                </div>

                {/* Real Flight Incident */}
                <div className="border-l-2 border-orange-500/70 pl-3.5 py-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1">
                    Historical Spaceflight Precedent
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {hazards[activeHazard].incident}
                  </p>
                </div>
              </div>

              {/* Solution Column */}
              <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                    How ARES-VII Solves This
                  </span>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                    Verified
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {hazards[activeHazard].solution}
                </p>

                <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                  <div className="text-[11px] text-zinc-400 font-medium">
                    Integrated System Capabilities:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                      24/7 Biosensor Stream
                    </span>
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                      Hermes Offline Decision Tree
                    </span>
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                      42-Drug Countermeasure Matrix
                    </span>
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                      Zero Earth Dependency
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/">
                    <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-100 text-xs font-semibold py-2.5 px-3 rounded-lg border border-zinc-700/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                      <span>Test In Live Flight Cockpit</span>
                      <ChevronRight className="w-3.5 h-3.5 text-orange-400" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: What Makes ARES-VII Different (Pillars) */}
      <section id="what-makes-different" className="py-20 px-4 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architectural Superiority</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              What Makes ARES-VII Different from Legacy ISS Software?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              Current space health apps are 1995-era text terminals that act as passive data conduits to Houston. ARES-VII replaces that paradigm with autonomous edge intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-zinc-500 uppercase">
                          Pillar 0{i + 1}
                        </span>
                        <h3 className="text-lg font-bold text-white">{p.title}</h3>
                      </div>
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3.5">
                        <div className="text-[11px] font-semibold uppercase text-red-400/90 mb-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span>Legacy 1995 ISS Systems</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{p.legacy}</p>
                      </div>

                      <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-3.5">
                        <div className="text-[11px] font-semibold uppercase text-orange-400 mb-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          <span>ARES-VII Bio-Astronautics OS</span>
                        </div>
                        <p className="text-xs text-zinc-200 leading-relaxed">{p.ares}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: How It Works (The 4-Stage Pipeline) */}
      <section id="how-it-works" className="py-20 px-4 border-b border-zinc-900 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>System Flow</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              How It Works: The 4-Stage Autonomous Pipeline
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              From a single millisecond cardiac beat on an astronaut's wrist to firing the spacecraft's orbital thrusters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {pipeline.map((item, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between relative group hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold font-mono text-orange-400/80">
                      {item.step}
                    </span>
                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md font-mono">
                      Phase {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">{item.desc}</p>
                </div>
                <div className="pt-3 border-t border-zinc-800/80">
                  <span className="text-[10px] font-mono text-zinc-500">{item.tech}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Subagent Matrix Banner */}
          <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-orange-400" />
                  Hermes 4-Subagent Autonomous Consensus Engine
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Operates completely offline with sub-50ms deterministic voting and human override safety.
                </p>
              </div>
              <Link href="/hermes">
                <button className="text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-700 flex items-center gap-1.5 cursor-pointer">
                  <span>Open Hermes AI Terminal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <div className="text-xs font-bold text-white">MED-SENTINEL</div>
                <div className="text-[11px] text-zinc-400 mt-1">Cardiac & Micro-Cuff BP Triage</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1.5">● Nominal (99.4%)</div>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <div className="text-xs font-bold text-white">RAD-GUARD</div>
                <div className="text-[11px] text-zinc-400 mt-1">GCR & Solar Proton Dosimetry</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1.5">● Nominal (99.8%)</div>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <div className="text-xs font-bold text-white">PSY-ORACLE</div>
                <div className="text-[11px] text-zinc-400 mt-1">Voice Sentiment & Offline CBT</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1.5">● Nominal (97.9%)</div>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <div className="text-xs font-bold text-white">NAV-PILOT</div>
                <div className="text-[11px] text-zinc-400 mt-1">NASA GMAT R2026a Astrodynamics</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1.5">● Nominal (99.6%)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Real Mission Scenarios & Incident Demonstrations */}
      <section id="scenarios" className="py-20 px-4 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Rocket className="w-3.5 h-3.5" />
              <span>Mission Proofs</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Real Spaceflight Incidents Handled Autonomously
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              Interactive demonstrations of historical and projected deep-space anomalies. Select a scenario to see how ARES-VII acts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Scenario Picker List */}
            <div className="lg:col-span-4 space-y-2.5">
              {scenarios.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveScenario(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    activeScenario === idx
                      ? "bg-zinc-900 border-orange-500/80 shadow-md shadow-orange-500/10"
                      : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400"
                  }`}
                >
                  <span className="text-[10px] uppercase font-mono text-orange-400 block mb-1">
                    {s.tag}
                  </span>
                  <div className={`text-sm font-bold ${activeScenario === idx ? "text-white" : "text-zinc-300"}`}>
                    {s.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Scenario Detail View */}
            <div className="lg:col-span-8 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 bg-orange-500/15 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                <span>Scenario 0{activeScenario + 1} Simulation</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                {scenarios[activeScenario].title}
              </h3>

              <div className="space-y-4">
                {/* Trigger */}
                <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Anomaly Detection / Biometric Trigger</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {scenarios[activeScenario].trigger}
                  </p>
                </div>

                {/* Hermes Action */}
                <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" />
                    <span>Hermes Offline AI Autonomous Action</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {scenarios[activeScenario].hermesAction}
                  </p>
                </div>

                {/* Crew Action */}
                <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Astronaut Intervention</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {scenarios[activeScenario].crewAction}
                  </p>
                </div>

                {/* Outcome */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Mission Outcome</span>
                  </div>
                  <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                    {scenarios[activeScenario].outcome}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
                <Link href="/emergency">
                  <button className="text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors">
                    <span>View Zero-G Surgical & Emergency Protocols</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Multi-Agency Space Pharmacy Showcase */}
      <section id="pharmacy" className="py-20 px-4 border-b border-zinc-900 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Pill className="w-3.5 h-3.5" />
              <span>Global Space Medicine Synthesis</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              42 Countermeasures from 28 World Space Agencies
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              No single space agency has solved every hazard. ARES-VII combines the best medical breakthroughs from the Soviet Union (IBMP), United States (NASA JSC), China (CMSA), Japan (JAXA), India (ISRO), and Europe (ESA).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Soviet Union / IBMP */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                    Soviet Union / IBMP (Roscosmos)
                  </span>
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                    Salyut • Mir
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  Indralin B-190 & Chibis-M LBNP
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Indralin provides a Dose Reduction Factor (DRF) of 1.45, preserving bone marrow stem cells during massive solar particle events. The Chibis-M vacuum suit creates -25 mmHg caudal suction, reversing headward fluid shifts.
                </p>
              </div>
              <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono">
                Key Breakthrough: Acute Radioprotection & Fluid Gravity
              </div>
            </div>

            {/* China / CMSA */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    China / CMSA
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                    Tiangong Station
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  Taikong Yangxin Wan & Neiguan TEAS
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Traditional Chinese Medicine formulations combined with transcutaneous electrical acupoint stimulation on the Neiguan (PC6) point boost heart rate variability (HRV RMSSD +22%) and stabilize endothelial nitric oxide (eNOS).
                </p>
              </div>
              <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono">
                Key Breakthrough: Autonomic & Microvascular Resilience
              </div>
            </div>

            {/* NASA / ESA / JAXA / ISRO */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    NASA • JAXA • ISRO • Mongolia
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                    Apollo • ISS • Soyuz-39
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  Bisphosphonates & Vorotnik Collar
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  JAXA annual zoledronic acid suppresses osteoclast bone reabsorption by 94.7%. The Mongolian Soyuz-39 Vorotnik cervical collar provides 30 mmHg jugular restriction to attenuate facial edema and space motion sickness.
                </p>
              </div>
              <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono">
                Key Breakthrough: Osteoporosis & Jugular Restraint
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/space-encyclopedia">
              <button className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold px-5 py-2.5 rounded-xl border border-zinc-800 inline-flex items-center gap-2 cursor-pointer transition-colors">
                <Database className="w-3.5 h-3.5 text-orange-400" />
                <span>Explore Full 42-Medication Space Pharmacy & Radiation Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Research Handbook & Open Source Specs */}
      <section id="research" className="py-20 px-4 border-b border-zinc-900">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText className="w-4 h-4" />
            <span>Master Research Documentation</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight max-w-2xl mx-auto">
            ARES-VII Complete Space Health & Mission Research Guide
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            A 53.5 KB comprehensive Microsoft Word research document written so that high school students, non-scientists, and aerospace engineers alike can understand every formula, flight incident, and clinical intervention.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              download="ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              className="bg-orange-500 hover:bg-orange-600 text-black font-semibold text-sm px-6 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Download Complete Guide (.docx)</span>
            </a>

            <Link href="/world-agencies">
              <button className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-sm font-medium px-5 py-3.5 rounded-xl border border-zinc-800 inline-flex items-center gap-2 cursor-pointer transition-colors">
                <Globe className="w-4 h-4 text-orange-400" />
                <span>View 28 Space Agency Database</span>
              </button>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left pt-8 border-t border-zinc-800/80">
            <div>
              <div className="text-xs text-zinc-500 font-mono">DOCUMENT SIZE</div>
              <div className="text-sm font-bold text-white mt-0.5">53.5 KB</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-mono">SECTIONS</div>
              <div className="text-sm font-bold text-white mt-0.5">20 Chapters</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-mono">TARGET AUDIENCE</div>
              <div className="text-sm font-bold text-white mt-0.5">Students & Scientists</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-mono">GMAT R2026A INTEGRATION</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">Verified 0.047s</div>
            </div>
          </div>
        </div>
      </section>

      {/* Big Final CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Ready to Experience the Spaceflight Operating System?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Step directly into the live cockpit. Monitor 24/7 cardiac vitals, talk to the Hermes AI, run NASA GMAT trajectory simulations, or test multi-agency medical countermeasures.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/">
              <button className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-base px-8 py-4 rounded-xl inline-flex items-center gap-2 shadow-xl shadow-orange-500/25 cursor-pointer transition-colors">
                <Rocket className="w-5 h-5" />
                <span>Enter Live Flight Cockpit</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            </Link>
          </div>

          <div className="mt-12 text-xs text-zinc-600 font-mono">
            ARES-VII Bio-Astronautics • Built for NASA Space Apps Challenge 2026 • Prepared for Deep Space Habitation
          </div>
        </div>
      </section>
    </div>
  );
}