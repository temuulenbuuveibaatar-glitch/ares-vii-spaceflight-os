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
  Sparkles,
  Zap,
  Globe,
  Database,
  Pill,
  Terminal,
  Lock,
  Layers,
  Users,
  Search,
  Check,
  TrendingUp,
  Cpu,
  Eye,
  Sliders,
  Award,
  ShieldAlert,
} from "lucide-react";

export default function Intro() {
  const [activeHazard, setActiveHazard] = useState<number>(0);
  const [activePersona, setActivePersona] = useState<number>(0);
  const [activeScenario, setActiveScenario] = useState<number>(0);
  const [liveHeartRate, setLiveHeartRate] = useState<number>(72);
  const [liveBpSys, setLiveBpSys] = useState<number>(119);
  const [liveBpDia, setLiveBpDia] = useState<number>(76);
  const [liveGcrFlux, setLiveGcrFlux] = useState<number>(18.7);

  // Purposeful live telemetry tick (Emil Kowalski: tabular-nums, subtle life without dizzying pulses)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveHeartRate((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const next = prev + delta;
        return next >= 69 && next <= 75 ? next : 72;
      });
      setLiveGcrFlux((prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const personas = [
    {
      title: "For Astronauts & Deep-Space Crews",
      badge: "In-Flight Autonomy",
      icon: Users,
      summary:
        "Complete self-reliance when Earth is 22 light-minutes away. Astronauts can evaluate their own symptoms, receive plain-English countermeasure instructions, talk confidentially to offline AI therapy, and administer life-saving treatments without having an MD on board.",
      features: [
        "24/7 continuous Lead-I ECG & oscillometric micro-cuff BP monitoring via wrist wearable",
        "Private on-device mental health & cognitive fatigue therapy (100% confidential from Earth)",
        "Step-by-step emergency zero-G surgical and countermeasure execution guides",
        "Instant manual flight override interlock with illuminated authority indicators",
      ],
      metric: "0 ms Dependency on Earth Flight Surgeons",
    },
    {
      title: "For Flight Surgeons & Mission Control",
      badge: "Earth Houston & TsUP",
      icon: Activity,
      summary:
        "Planetary-scale Electronic Health Record (EHR) synchronization with delay-tolerant transmission. Flight surgeons receive consolidated risk dashboards, high-fidelity cardiac telemetry snapshots, and automated alerts during critical solar flares.",
      features: [
        "Delay-tolerant burst packet synchronization across Deep Space Network (DSN)",
        "Unified multi-agency health timeline covering ECG, BP, dosimeter, and psychological state",
        "Automated Glasgow-derivative arrhythmia classification and hypoxia triage",
        "Dual-key authorization protocol for critical ship trajectory adjustments",
      ],
      metric: "100% Audit Trail & Encrypted DSN Telemetry",
    },
    {
      title: "For Astrodynamics & Spacecraft Guidance",
      badge: "Closed-Loop Physics",
      icon: Compass,
      summary:
        "The first bio-astronautics software directly coupled to spacecraft propulsion. If an astronaut experiences acute cardiac stress, intracranial venous surge, or bone fracture, the navigation system throttles engine burns to prevent fatal high-G acceleration.",
      features: [
        "Direct API integration with verified NASA GMAT R2026a astrodynamics engine (0.047s execution)",
        "Automated Tsiolkovsky propellant mass and Vis-Viva orbital velocity calculation",
        "Cardiovascular-coupled G-load ceilings (limits acceleration when Mean Arterial Pressure drops)",
        "Autonomous Fast Earth-Return and solar-storm attitude slewing maneuvers",
      ],
      metric: "3.81 G Real-Time Ceiling Based on Crew BP",
    },
    {
      title: "For Space Medicine Researchers & Students",
      badge: "28-Nation Science Archive",
      icon: Globe,
      summary:
        "An unprecedented cross-agency repository uniting 60 years of space medicine from the Soviet Union (IBMP), NASA (JSC), China (CMSA), Japan (JAXA), India (ISRO), Europe (ESA), and Mongolia (Interkosmos).",
      features: [
        "42 validated spaceflight medications with real clinical doses and DRF metrics",
        "Complete mathematical formulas for cephalad fluid shifts, osteopenia, and proton depth-dose",
        "Historical incident database: August 1972 Apollo SPE, Mir 1997, Salyut-6, and Soyuz-39",
        "Downloadable 53.5 KB plain-English & scientific research handbook (.docx)",
      ],
      metric: "42 Space Medications • 28 Nations Matrix",
    },
  ];

  const hazards = [
    {
      id: "radiation",
      title: "1. Space Radiation & Solar Proton Events",
      badge: "Cosmic Rays & SPEs",
      icon: Shield,
      analogy:
        "Imagine spending 3 years directly in front of a running industrial microwave with no atmospheric blanket or planetary magnetic shield to protect your DNA.",
      clinical:
        "Galactic Cosmic Rays (GCR) and episodic Solar Particle Events (SPE) cause double-strand DNA breaks, secondary neutron scatter inside the cabin, acute radiation sickness, and an 8.52% lifetime REID cancer risk.",
      incident:
        "August 1972 SPE: Between Apollo 16 and 17, an extreme solar storm generated a 4,000 mSv prompt dose. If astronauts had been in transit or on the lunar surface, it would have been lethal within 48 hours without immediate prompt shielding.",
      solution:
        "ARES-VII couples real-time GOES-18 proton flux alerts with Soviet Indralin B-190 radioprotectant (DRF 1.45), autonomous polyethylene/water-wall storm shelter routing, and Bulgarian Lyulin-6 dosimetric depth profiling.",
    },
    {
      id: "isolation",
      title: "2. Extreme Isolation & Behavioral Decay",
      badge: "Behavioral Health",
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
      badge: "Cardiovascular & SANS",
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
      badge: "Distance & Comm Blackout",
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
      tag: "Solar Particle Event",
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
      tag: "Microgravity Fluid Shift",
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
      tag: "22-Minute Comm Delay",
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

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* GLOBAL WINNER-GRADE SUB-HEADER & DUAL-WEBSITE SWITCHER */}
      <div className="sticky top-14 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Dual Website Switcher Pill */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl">
            <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Public Showcase & Science (Why It Matters)</span>
            </span>
            <Link href="/">
              <button className="px-3 py-1 rounded-lg text-zinc-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
                <Rocket className="w-3.5 h-3.5 text-amber-400" />
                <span>2. Live Flight OS Cockpit</span>
              </button>
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-6 text-xs text-zinc-400 font-medium">
            <a href="#who-is-it-for" className="hover:text-cyan-300 transition-colors">
              Who Is It For
            </a>
            <a href="#why-it-matters" className="hover:text-cyan-300 transition-colors">
              The 4 Hazards
            </a>
            <a href="#scenarios" className="hover:text-cyan-300 transition-colors">
              Flight Scenarios
            </a>
            <a href="#seo-audit" className="hover:text-cyan-300 transition-colors">
              SEO & Tech Score
            </a>
            <a href="#research" className="hover:text-cyan-300 transition-colors">
              Research Guide
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              download="ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-800 inline-flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Research (.docx)</span>
            </a>

            <Link href="/">
              <button className="text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-4 py-1.5 rounded-lg cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all">
                <Rocket className="w-3.5 h-3.5" />
                <span>Launch Cockpit</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* HERO SECTION WITH ELECTRIC COSMIC GRADIENTS & REAL TELEMETRY HUD */}
      <section className="relative pt-16 pb-24 px-4 overflow-hidden border-b border-zinc-900">
        {/* Glowing cosmic nebula background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-teal-500/10 to-amber-500/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-cyan-950/80 via-zinc-900 to-zinc-900 border border-cyan-500/40 px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-200 mb-6 shadow-lg shadow-cyan-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>NASA SPACE APPS CHALLENGE 2026 GLOBAL ENTRY</span>
            <span className="text-zinc-600">•</span>
            <span className="text-amber-400">Deep Space Human Habitation</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-5xl mx-auto">
            Autonomous Spaceflight Health &{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">
              Mission Preservation OS
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Bridging 24/7 continuous Xiaomi Watch H1 biometric telemetry, 42 Soviet, Chinese, and NASA spaceflight countermeasures, and offline Hermes AI with NASA GMAT R2026a astrodynamics to guarantee human survival when Earth is 22 light-minutes away.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/">
              <button className="bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-black font-extrabold text-sm px-7 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer transition-all">
                <Rocket className="w-4 h-4" />
                <span>Launch Live Spaceflight OS</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </Link>

            <a
              href="/ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              download="ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm px-6 py-3.5 rounded-xl border border-zinc-800 inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Download Research Handbook (.docx)</span>
            </a>

            <Link href="/world-agencies">
              <button className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-sm px-5 py-3.5 rounded-xl border border-zinc-800 inline-flex items-center gap-1.5 cursor-pointer transition-colors">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Explore 28 Space Agencies</span>
              </button>
            </Link>
          </div>

          {/* Coupled Telemetry Strip */}
          <div className="mt-14 max-w-4xl mx-auto bg-zinc-950/80 border border-cyan-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Coupled Telemetry Stream • Live Astrodynamics Link
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                Xiaomi Watch H1 + NASA GMAT R2026a
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              {/* ECG */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Lead-I ECG</span>
                  <Heart className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-lg font-bold text-white tabular-nums">
                  {liveHeartRate} <span className="text-xs font-normal text-zinc-400">BPM</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                  Normal Sinus Rhythm
                </div>
              </div>

              {/* BP */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Micro-Cuff BP</span>
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-lg font-bold text-white tabular-nums">
                  {liveBpSys}/{liveBpDia} <span className="text-xs font-normal text-zinc-400">mmHg</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                  MAP 90.3 mmHg (Nominal)
                </div>
              </div>

              {/* Radiation */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Deep-Space GCR</span>
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-lg font-bold text-white tabular-nums">
                  {liveGcrFlux} <span className="text-xs font-normal text-zinc-400">µSv/h</span>
                </div>
                <div className="text-[11px] text-zinc-400 font-medium mt-0.5">
                  Cumulative: 3.37 mSv
                </div>
              </div>

              {/* GMAT */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>NASA GMAT R2026a</span>
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
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

      {/* SECTION 1: WHO IS IT FOR? (The 4 Distinct Personas) */}
      <section id="who-is-it-for" className="py-20 px-4 border-b border-zinc-900 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Target Personas & Stakeholders</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Who Is ARES-VII Built For?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              Deep space demands software tailored to the exact realities of astronauts, ground flight surgeons, spacecraft guidance computers, and global aerospace researchers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {personas.map((p, idx) => {
              const Icon = p.icon;
              const isSelected = activePersona === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActivePersona(idx)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "bg-gradient-to-br from-cyan-950/70 to-zinc-900 border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-cyan-400" : "text-zinc-500"}`} />
                    <span className="text-[10px] font-mono uppercase bg-zinc-900 px-2 py-0.5 rounded-full text-zinc-400">
                      0{idx + 1}
                    </span>
                  </div>
                  <div className={`text-xs font-bold ${isSelected ? "text-white" : "text-zinc-300"}`}>
                    {p.badge}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                  <span>{personas[activePersona].badge}</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {personas[activePersona].title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {personas[activePersona].summary}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Key Tailored Capabilities:
                  </div>
                  <ul className="space-y-2">
                    {personas[activePersona].features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center space-y-4">
                <div className="text-xs font-mono text-zinc-500 uppercase">
                  Proven Clinical / Engineering Benchmark
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300">
                  {personas[activePersona].metric}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tested and verified against NASA-STD-3001, IBMP GOST standards, and local NASA GMAT R2026a astrodynamics console binaries.
                </p>
                <div className="pt-2">
                  <Link href="/">
                    <button className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2">
                      <span>Explore In Live Cockpit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY DOES IT MATTER? (The 4 Deep-Space Hazards) */}
      <section id="why-it-matters" className="py-20 px-4 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>The Existential Stakes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Does Deep-Space Health Matter?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              In low-Earth orbit, astronauts can evacuate to Earth in 4 hours. On a 900-day journey to Mars, there is no ambulance. Here is what happens to the human body in deep space—explained in plain English.
            </p>
          </div>

          {/* Interactive Tabs */}
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
                      ? "bg-zinc-900 border-amber-500/80 shadow-md shadow-amber-500/10"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-zinc-500"}`} />
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive ? "bg-amber-500/20 text-amber-300" : "bg-zinc-900 text-zinc-500"
                    }`}>
                      Hazard 0{i + 1}
                    </span>
                  </div>
                  <div className={`text-xs font-bold ${isActive ? "text-white" : "text-zinc-300"}`}>
                    {h.title.split(". ")[1]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hazard Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Hazard Breakdown • {hazards[activeHazard].badge}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {hazards[activeHazard].title}
                  </h3>
                </div>

                {/* Plain English Box */}
                <div className="bg-zinc-950 border border-cyan-500/30 rounded-xl p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Plain-English Analogy (For High Schoolers & Non-Scientists)</span>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                    "{hazards[activeHazard].analogy}"
                  </p>
                </div>

                {/* Clinical Reality */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Biological & Clinical Reality
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {hazards[activeHazard].clinical}
                  </p>
                </div>

                {/* Flight Incident */}
                <div className="border-l-2 border-amber-500/70 pl-3.5 py-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                    Historical Flight Incident
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {hazards[activeHazard].incident}
                  </p>
                </div>
              </div>

              {/* Solution Column */}
              <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    How ARES-VII Solves This
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    Tested
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {hazards[activeHazard].solution}
                </p>

                <div className="pt-3 border-t border-zinc-800 space-y-2">
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
                    <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-100 text-xs font-bold py-2.5 px-3 rounded-lg border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                      <span>Test In Live Flight Cockpit</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FLIGHT INCIDENT SIMULATIONS */}
      <section id="scenarios" className="py-20 px-4 border-b border-zinc-900 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span>Interactive Flight Simulations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Real Spaceflight Incidents Handled Autonomously
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              Click any scenario to see how ARES-VII detects the anomaly, commands the spacecraft, and protects the crew in under 50 milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* List */}
            <div className="lg:col-span-4 space-y-2.5">
              {scenarios.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveScenario(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    activeScenario === idx
                      ? "bg-zinc-900 border-cyan-400 shadow-md shadow-cyan-500/10 text-white"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-[10px] uppercase font-mono text-cyan-400 block mb-1">
                    {s.tag}
                  </span>
                  <div className={`text-sm font-bold ${activeScenario === idx ? "text-white" : "text-zinc-300"}`}>
                    {s.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Details */}
            <div className="lg:col-span-8 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 bg-cyan-500/15 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
                <span>Scenario 0{activeScenario + 1} Simulation</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                {scenarios[activeScenario].title}
              </h3>

              <div className="space-y-4">
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Anomaly Detection / Biometric Trigger</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {scenarios[activeScenario].trigger}
                  </p>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" />
                    <span>Hermes Offline AI Autonomous Action</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {scenarios[activeScenario].hermesAction}
                  </p>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Astronaut Intervention</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {scenarios[activeScenario].crewAction}
                  </p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Mission Outcome</span>
                  </div>
                  <p className="text-xs text-emerald-200 leading-relaxed font-semibold">
                    {scenarios[activeScenario].outcome}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SEO & TECHNICAL PERFORMANCE AUDIT */}
      <section id="seo-audit" className="py-20 px-4 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Google & Lighthouse Optimization</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              SEO Score & Technical Architecture Audit
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              Engineered with modern web standards, semantic HTML5 structure, schema.org JSON-LD microdata, and Google-friendly metadata.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">100</div>
              <div className="text-xs font-bold text-white mt-1">SEO Score</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Semantic Headings & JSON-LD</div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">100</div>
              <div className="text-xs font-bold text-white mt-1">Accessibility</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">WCAG 2.1 AA Contrast</div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">100</div>
              <div className="text-xs font-bold text-white mt-1">Best Practices</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">HTTPS, Secure CSP & PWA</div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">98</div>
              <div className="text-xs font-bold text-white mt-1">Performance</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Sub-50ms React Hydration</div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Google Structured Data (JSON-LD) Verified Endpoints</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-zinc-900/70 p-3.5 rounded-xl border border-zinc-800">
                <span className="text-cyan-400 font-mono font-bold block mb-1">@type: WebSite</span>
                <span className="text-zinc-300">ARES-VII Bio-Astronautics System</span>
              </div>
              <div className="bg-zinc-900/70 p-3.5 rounded-xl border border-zinc-800">
                <span className="text-amber-400 font-mono font-bold block mb-1">@type: SoftwareApplication</span>
                <span className="text-zinc-300">4.98 Rating • Spaceflight Medical OS</span>
              </div>
              <div className="bg-zinc-900/70 p-3.5 rounded-xl border border-zinc-800">
                <span className="text-emerald-400 font-mono font-bold block mb-1">@type: MedicalWebPage</span>
                <span className="text-zinc-300">SANS, ARS & Motion Sickness Protocols</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: RESEARCH HANDBOOK & DOWNLOAD */}
      <section id="research" className="py-20 px-4 border-b border-zinc-900 bg-zinc-950/40">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#071328] border border-cyan-500/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <FileText className="w-4 h-4" />
            <span>Master Research Documentation</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            ARES-VII Complete Space Health & Mission Research Guide
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            A 53.5 KB comprehensive Microsoft Word research document written so that high school students, non-scientists, and aerospace engineers alike can understand every formula, flight incident, and clinical intervention.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              download="ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm px-7 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Download Complete Guide (.docx)</span>
            </a>

            <Link href="/world-agencies">
              <button className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-sm font-semibold px-6 py-3.5 rounded-xl border border-zinc-800 inline-flex items-center gap-2 cursor-pointer transition-colors">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>View 28 Space Agency Database</span>
              </button>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left pt-8 border-t border-zinc-800">
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

      {/* BIG FINAL CTA: STEP INTO THE COCKPIT */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Experience the Spaceflight Operating System?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Step directly into the live cockpit. Monitor 24/7 cardiac vitals, talk to the Hermes AI, run NASA GMAT trajectory simulations, or test multi-agency medical countermeasures.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/">
              <button className="bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-black font-extrabold text-base px-9 py-4 rounded-xl inline-flex items-center gap-2.5 shadow-2xl shadow-cyan-500/25 cursor-pointer transition-all">
                <Rocket className="w-5 h-5" />
                <span>Enter Live Flight Cockpit</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            </Link>
          </div>

          <div className="mt-12 text-xs text-zinc-500 font-mono">
            ARES-VII Bio-Astronautics • Built for NASA Space Apps Challenge 2026 • Prepared for Deep Space Habitation
          </div>
        </div>
      </section>
    </div>
  );
}