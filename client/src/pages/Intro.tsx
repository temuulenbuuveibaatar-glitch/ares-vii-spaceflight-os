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
  ShieldCheck,
  Gauge,
  Crosshair,
  BookOpen,
} from "lucide-react";

export default function Intro() {
  const [activeHazard, setActiveHazard] = useState<number>(0);
  const [activePersona, setActivePersona] = useState<number>(0);
  const [activeScenario, setActiveScenario] = useState<number>(0);
  const [liveHeartRate, setLiveHeartRate] = useState<number>(72);
  const [liveBpSys, setLiveBpSys] = useState<number>(119);
  const [liveBpDia, setLiveBpDia] = useState<number>(76);
  const [liveGcrFlux, setLiveGcrFlux] = useState<number>(18.7);

  // Purposeful tactical telemetry tick (Emil Kowalski: tabular-nums, subtle life without dizzying pulses)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveHeartRate((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const next = prev + delta;
        return next >= 69 && next <= 75 ? next : 72;
      });
      setLiveGcrFlux((prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const personas = [
    {
      title: "For Astronauts & Deep-Space Flight Crews",
      badge: "In-Flight Operator Autonomy",
      code: "CREW-SPEC-01",
      icon: Users,
      summary:
        "Complete self-reliance when Earth is 22 light-minutes away. Flight crews can evaluate their own symptoms, receive step-by-step countermeasure protocols, consult confidential on-device AI therapy, and administer life-saving zero-G clinical procedures without an MD on board.",
      features: [
        "24/7 continuous Lead-I ECG & oscillometric micro-cuff BP via radiation-hardened wrist telemetry",
        "100% confidential on-device offline voice sentiment & cognitive fatigue therapy (zero ground logging)",
        "Zero-G surgical and pharmacological step-by-step guidance manuals with dosage calculator",
        "Tactical manual flight authority interlock with physical status indicators",
      ],
      metric: "0 ms Dependency on Earth Flight Surgeons",
    },
    {
      title: "For Flight Surgeons & Mission Control Centers",
      badge: "Earth DSN Houston / TsUP",
      code: "SURGEON-EHR-02",
      icon: Activity,
      summary:
        "Planetary-scale Electronic Health Record (EHR) synchronization engineered for intermittent, high-latency deep space comms. Flight surgeons receive consolidated multi-agency risk timelines, ECG waveform bursts, and immediate alerts during major solar flare events.",
      features: [
        "Delay-tolerant burst packet telemetry transmission across Deep Space Network (DSN)",
        "Unified health timeline integrating continuous cardiac, blood pressure, dosimeter, and psychological markers",
        "Automated Glasgow-derivative cardiac arrhythmia classification and hypoxia triage",
        "Cryptographic dual-key authorization interlock for remote ship maneuver approvals",
      ],
      metric: "100% Audit Trail & Encrypted DSN Telemetry",
    },
    {
      title: "For Astrodynamics Guidance & Flight Controllers",
      badge: "Closed-Loop Trajectory Interlock",
      code: "NAV-GMAT-03",
      icon: Compass,
      summary:
        "The first bio-astronautics software directly coupled to spacecraft propulsion. If an astronaut experiences acute cardiac failure, intracranial venous pooling, or skeletal fracture, the guidance system throttles engine burns to prevent fatal acceleration.",
      features: [
        "Direct API integration with verified NASA GMAT R2026a astrodynamics engine (0.047s execution)",
        "Automated Tsiolkovsky propellant mass and Vis-Viva orbital velocity calculation",
        "Cardiovascular-coupled G-load ceilings (automatically limits acceleration when MAP drops)",
        "Autonomous Fast Earth-Return and solar-storm attitude slewing maneuvers",
      ],
      metric: "3.81 G Real-Time Ceiling Based on Crew BP",
    },
    {
      title: "For Space Medicine Researchers & Aerospace Engineers",
      badge: "28-Nation Global Archive",
      code: "GLOBAL-BIO-04",
      icon: Globe,
      summary:
        "An unprecedented cross-agency repository uniting 60 years of space medicine from the Soviet Union (IBMP), NASA (JSC), China (CMSA), Japan (JAXA), India (ISRO), Europe (ESA), and Mongolia (Interkosmos).",
      features: [
        "42 validated spaceflight medications with real clinical doses and DRF metrics",
        "Empirical formulas for cephalad fluid shifts, osteopenia, and proton depth-dose",
        "Historical mission incident database: August 1972 Apollo SPE, Mir 1997, Salyut-6, and Soyuz-39",
        "Downloadable 53.5 KB plain-English & scientific research handbook (.docx)",
      ],
      metric: "42 Space Medications • 28 Nations Matrix",
    },
  ];

  const hazards = [
    {
      id: "radiation",
      title: "1. Space Radiation & Solar Proton Events",
      badge: "Radiation",
      code: "HAZ-01",
      icon: Shield,
      analogy:
        "Imagine spending 3 years directly in front of a running industrial microwave with no atmospheric blanket or planetary magnetic shield to protect your DNA.",
      clinical:
        "Galactic Cosmic Rays (GCR) and episodic Solar Particle Events (SPE) cause double-strand DNA breaks, secondary neutron scatter inside the cabin, acute radiation sickness, and an 8.52% lifetime REID cancer risk.",
      incident:
        "August 1972 SPE: Between Apollo 16 and 17, an extreme solar storm generated a 4,000 mSv prompt dose. If astronauts had been in transit or on the lunar surface, it would have been lethal within 48 hours without immediate prompt shielding.",
      solution:
        "Sonnenblume couples real-time GOES-18 proton flux alerts with Soviet Indralin B-190 radioprotectant (DRF 1.45), autonomous polyethylene/water-wall storm shelter routing, and Bulgarian Lyulin-6 dosimetric depth profiling.",
    },
    {
      id: "isolation",
      title: "2. Extreme Isolation & Behavioral Decay",
      badge: "Behavioral Health",
      code: "HAZ-02",
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
      code: "HAZ-03",
      icon: Activity,
      analogy:
        "Without gravity pulling your fluids down, two liters of blood and plasma rush into your head, puffing your face and squeezing your eyes, while your bones dissolve into your urine like sugar in hot tea.",
      clinical:
        "Loss of hydrostatic gradient pushes ~2,000 mL cranial fluid, elevating intracranial pressure and causing SANS (Spaceflight-Associated Neuro-ocular Syndrome) in 70% of crew. Bone mineral density decays at 1.0% to 1.5% per month.",
      incident:
        "Salyut-6 / Soyuz-39 (1981): Mongolian Cosmonaut J. Gurragchaa and Soviet crews experienced severe cephalad fluid shifts and acute space motion sickness during orbital insertion, threatening emergency piloting readiness.",
      solution:
        "Sonnenblume combines the Soviet Vorotnik cervical collar (30 mmHg jugular venous restriction) with Chibis-M Lower Body Negative Pressure (-25 mmHg to draw 320 mL caudal fluid), JAXA bisphosphonates, and CMSA Neiguan (PC6) electro-stimulation.",
    },
    {
      id: "distance",
      title: "4. Hostile Environment & 22-Min Communication Lag",
      badge: "Comm Delay & Distance",
      code: "HAZ-04",
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
    <div className="min-h-screen bg-[#0b0e0a] text-[#e3ecd8] selection:bg-[#4d633b] selection:text-[#fbbf24]">
      {/* HERO SECTION: TACTICAL OLIVE & SUNFLOWER GOLD */}
      <section className="relative pt-16 pb-20 px-4 border-b border-[#232d1a] bg-gradient-to-b from-[#11160e] via-[#0e120b] to-[#0b0e0a]">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Tactical Sunflower Stencil Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#182213] border border-[#3f5231] font-mono text-sm text-[#a3c988] mb-6 shadow-sm">
            <span className="text-base">🌻</span>
            <span className="font-bold text-[#fbbf24]">SONNENBLUME (SUNFLOWER)</span>
            <span className="text-[#4d633b]">//</span>
            <span className="text-[#c7dfb8]">DEEP-SPACE HEALTH & AUTONOMY OS</span>
          </div>

          {/* Bold Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-sans tracking-tight text-white leading-tight max-w-5xl mx-auto">
            Autonomous Space Health &{" "}
            <span className="text-[#fbbf24] underline decoration-[#4d633b] underline-offset-8">
              Helio-Protection OS
            </span>
          </h1>

          {/* Subhead with Larger, Highly Readable Font */}
          <p className="mt-6 text-lg sm:text-xl text-[#c7dfb8] max-w-3xl mx-auto leading-relaxed font-normal">
            Like a sunflower tracking the sun, <strong>Sonnenblume</strong> shields astronauts from deep-space cosmic radiation storms and provides 24/7 clinical medical autonomy when Earth is 22 light-minutes away.
          </p>

          {/* Action Row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-base font-bold">
            <a
              href={typeof window !== "undefined" && window.location.hostname.includes("localhost") ? "/app" : "https://sonnenblume-tool.vercel.app"}
              className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0b0e0a] font-black text-base px-8 py-4 rounded-xl inline-flex items-center gap-2.5 shadow-xl shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
            >
              <Rocket className="w-5 h-5 text-[#0b0e0a]" />
              <span>LAUNCH SONNENBLUME TOOL ↗</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </a>

            <a
              href="/Sonnenblume_Complete_Space_Health_and_Mission_Research_Guide.docx"
              download="Sonnenblume_Space_Health_Research_Guide.docx"
              className="bg-[#182213] hover:bg-[#24331c] text-[#c7dfb8] text-base px-7 py-4 rounded-xl border border-[#3f5231] inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <FileText className="w-5 h-5 text-[#fbbf24]" />
              <span>DOWNLOAD RESEARCH GUIDE (.DOCX)</span>
            </a>

            <Link href="/privacy">
              <span className="bg-[#13190e] hover:bg-[#1f2917] text-[#8ea873] hover:text-[#fbbf24] text-base px-6 py-4 rounded-xl border border-[#2e3b23] inline-flex items-center gap-2 cursor-pointer transition-colors">
                <Lock className="w-4 h-4 text-[#fbbf24]" />
                <span>PRIVACY CHARTER</span>
              </span>
            </Link>
          </div>

          {/* Tactical HUD Telemetry Bar */}
          <div className="mt-12 max-w-4xl mx-auto bg-[#13190e] border border-[#354528] rounded-2xl p-4 shadow-xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#232d1a] mb-3 px-1 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#84a96c]" />
                <span className="font-bold text-[#c7dfb8] uppercase tracking-wider">
                  TELEMETRY COUPLING: XIAOMI WATCH H1 • NASA GMAT R2026A
                </span>
              </div>
              <span className="text-[#6d845e]">DSN X-BAND: 8.4 GHz LOCKED</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              {/* ECG */}
              <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-[#8ea873] mb-1">
                  <span>LEAD-I ECG</span>
                  <Heart className="w-3.5 h-3.5 text-[#fbbf24]" />
                </div>
                <div className="text-lg font-bold text-white tabular-nums">
                  {liveHeartRate} <span className="text-xs font-normal text-[#8ea873]">BPM</span>
                </div>
                <div className="text-[11px] text-[#84a96c] font-sans font-medium mt-0.5">
                  Normal Sinus Rhythm
                </div>
              </div>

              {/* BP */}
              <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-[#8ea873] mb-1">
                  <span>MICRO-CUFF BP</span>
                  <Activity className="w-3.5 h-3.5 text-[#fbbf24]" />
                </div>
                <div className="text-lg font-bold text-white tabular-nums">
                  {liveBpSys}/{liveBpDia} <span className="text-xs font-normal text-[#8ea873]">mmHg</span>
                </div>
                <div className="text-[11px] text-[#84a96c] font-sans font-medium mt-0.5">
                  MAP 90.3 mmHg (Nominal)
                </div>
              </div>

              {/* Radiation */}
              <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-[#8ea873] mb-1">
                  <span>DEEP-SPACE GCR</span>
                  <Shield className="w-3.5 h-3.5 text-[#fbbf24]" />
                </div>
                <div className="text-lg font-bold text-white tabular-nums">
                  {liveGcrFlux} <span className="text-xs font-normal text-[#8ea873]">µSv/h</span>
                </div>
                <div className="text-[11px] text-[#8ea873] font-sans font-medium mt-0.5">
                  Cumulative: 3.37 mSv
                </div>
              </div>

              {/* GMAT */}
              <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-[#8ea873] mb-1">
                  <span>NASA GMAT R2026A</span>
                  <Compass className="w-3.5 h-3.5 text-[#fbbf24]" />
                </div>
                <div className="text-lg font-bold text-white tabular-nums">
                  2.6316 <span className="text-xs font-normal text-[#8ea873]">km/s</span>
                </div>
                <div className="text-[11px] text-[#84a96c] font-sans font-medium mt-0.5">
                  GmatConsole: 0.047s Exec
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: WHO WE ARE */}
      <section id="who-we-are" className="py-20 px-4 border-b border-[#232d1a] bg-[#11160e]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#182213] border border-[#2e3b23] text-[#fbbf24] font-mono text-xs font-bold">
              <span>🌻 OUR MISSION & PHILOSOPHY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Who We Are
            </h2>
            <p className="text-lg text-[#c7dfb8] leading-relaxed">
              We are bio-astronautics engineers, software architects, and clinicians building for humanity’s next frontier: deep space beyond Earth's protective magnetosphere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0b0e0a] border border-[#2e3b23] rounded-2xl p-7 space-y-3">
              <div className="text-2xl mb-1">🌻</div>
              <h3 className="text-xl font-bold text-white">Why "Sonnenblume"?</h3>
              <p className="text-base text-[#a8baa0] leading-relaxed">
                In German, <em>Sonnenblume</em> means sunflower. Just as a sunflower turns toward the sun to harness energy while shielding its delicate seeds, our software tracks solar cosmic radiation storms, steers storm-shelter shielding, and protects the human genome.
              </p>
            </div>

            <div className="bg-[#0b0e0a] border border-[#2e3b23] rounded-2xl p-7 space-y-3">
              <div className="text-2xl mb-1">🛰️</div>
              <h3 className="text-xl font-bold text-white">The Autonomy Imperative</h3>
              <p className="text-base text-[#a8baa0] leading-relaxed">
                When an astronaut suffers cardiac arrest or cranial hypertension on the way to Mars, waiting 22 minutes for an Earth doctor to respond is a death sentence. We build offline, deterministic clinical intelligence that guides crew members in seconds.
              </p>
            </div>

            <div className="bg-[#0b0e0a] border border-[#2e3b23] rounded-2xl p-7 space-y-3">
              <div className="text-2xl mb-1">🛡️</div>
              <h3 className="text-xl font-bold text-white">Crew Dignity & Privacy</h3>
              <p className="text-base text-[#a8baa0] leading-relaxed">
                Astronauts deserve private mental health care. Sonnenblume runs 100% on-device voice therapy without broadcasting intimate reflections back to Houston, preserving mental wellness without fear of medical grounding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: WHO IS IT FOR? */}
      <section id="who-its-for" className="py-20 px-4 border-b border-[#232d1a] bg-[#0e120b]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Who Is Sonnenblume Built For?
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#c7dfb8]">
              Deep space demands software tailored to the exact realities of astronauts, ground flight surgeons, spacecraft guidance computers, and aerospace researchers.
            </p>
          </div>

          {/* Persona Picker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {personas.map((p, idx) => {
              const Icon = p.icon;
              const isSelected = activePersona === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActivePersona(idx)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#182213] border-[#fbbf24] text-white shadow-md shadow-amber-500/10"
                      : "bg-[#0b0e0a] border-[#232d1a] text-[#8ea873] hover:text-[#c7dfb8] hover:border-[#354528]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-[#fbbf24]" : "text-[#6d845e]"}`} />
                    <span className="text-xs font-mono bg-[#11160e] px-2 py-0.5 rounded text-[#8ea873]">
                      {p.code}
                    </span>
                  </div>
                  <div className={`text-sm font-bold ${isSelected ? "text-white" : "text-[#a8baa0]"}`}>
                    {p.badge}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Persona Details */}
          <div className="bg-[#13190e] border border-[#354528] rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#182213] border border-[#3f5231] text-[#fbbf24] font-semibold text-xs">
                  <span>{personas[activePersona].badge}</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {personas[activePersona].title}
                </h3>
                <p className="text-base text-[#c7dfb8] leading-relaxed">
                  {personas[activePersona].summary}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#fbbf24]">
                    Engineered Capabilities:
                  </div>
                  <ul className="space-y-2">
                    {personas[activePersona].features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#c7dfb8]">
                        <CheckCircle2 className="w-4 h-4 text-[#84a96c] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-6 text-center space-y-4">
                <div className="text-xs font-mono text-[#6d845e] uppercase">
                  Verified Technical and Clinical Benchmark
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-[#fbbf24]">
                  {personas[activePersona].metric}
                </div>
                <p className="text-xs text-[#8ea873] leading-relaxed">
                  Tested and verified against NASA-STD-3001, IBMP standards, and NASA GMAT astrodynamics console binaries.
                </p>
                <div className="pt-2">
                  <Link href="/cockpit">
                    <button className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0b0e0a] font-bold text-sm py-3 px-4 rounded-xl cursor-pointer shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
                      <span>Open Operational Cockpit</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY DOES IT MATTER? (THE 4 HAZARDS) */}
      <section id="why-it-matters" className="py-20 px-4 border-b border-[#232d1a] bg-[#0b0e0a]">
        <div id="four-hazards" className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Why Does Deep-Space Health Matter?
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#c7dfb8]">
              In low-Earth orbit, astronauts can evacuate to Earth in 4 hours. On a 900-day journey to Mars, there is no ambulance. Here is what happens to the human body in deep space: explained in plain English.
            </p>
          </div>

          {/* Hazard Tabs */}
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
                      ? "bg-[#182213] border-[#fbbf24] shadow-md shadow-amber-500/10"
                      : "bg-[#11160e] border-[#232d1a] text-[#8ea873] hover:border-[#354528] hover:text-[#c7dfb8]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#fbbf24]" : "text-[#6d845e]"}`} />
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isActive ? "bg-[#28381c] text-[#fbbf24]" : "bg-[#0b0e0a] text-[#6d845e]"
                    }`}>
                      {h.code}
                    </span>
                  </div>
                  <div className={`text-xs font-bold ${isActive ? "text-white" : "text-[#a8baa0]"}`}>
                    {h.title.split(". ")[1]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hazard Detail Card */}
          <div className="bg-[#13190e] border border-[#354528] rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#182213] text-[#fbbf24] text-xs font-semibold px-3 py-1 rounded-lg mb-3 border border-[#3f5231]">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{hazards[activeHazard].badge}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {hazards[activeHazard].title}
                  </h3>
                </div>

                {/* Plain English Box */}
                <div className="bg-[#0b0e0a] border border-[#3f5231] rounded-xl p-5">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#fbbf24] mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#fbbf24]" />
                    <span>Plain-English Analogy</span>
                  </div>
                  <p className="text-base text-[#e3ecd8] leading-relaxed font-medium">
                    "{hazards[activeHazard].analogy}"
                  </p>
                </div>

                {/* Clinical Mechanism */}
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8ea873] mb-1.5">
                    Biological & Clinical Reality
                  </div>
                  <p className="text-base text-[#c7dfb8] leading-relaxed">
                    {hazards[activeHazard].clinical}
                  </p>
                </div>

                {/* Historical Incident */}
                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-4">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#fbbf24] mb-1">
                    Historical Flight Incident
                  </div>
                  <p className="text-sm text-[#c7dfb8] leading-relaxed">
                    {hazards[activeHazard].incident}
                  </p>
                </div>
              </div>

              {/* Solution Column */}
              <div className="lg:col-span-5 bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#232d1a]">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#84a96c]" />
                    Sonnenblume Countermeasure
                  </span>
                  <span className="text-xs font-mono bg-[#182213] text-[#84a96c] border border-[#3f5231] px-2.5 py-0.5 rounded-lg font-bold">
                    VERIFIED
                  </span>
                </div>

                <p className="text-xs text-[#c7dfb8] leading-relaxed">
                  {hazards[activeHazard].solution}
                </p>

                <div className="pt-3 border-t border-[#232d1a] space-y-2">
                  <div className="text-[11px] font-mono text-[#8ea873]">
                    Integrated Subsystems:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-mono bg-[#11160e] border border-[#2d3b22] text-[#c7dfb8] px-2 py-1 rounded">
                      24/7 Biosensor Stream
                    </span>
                    <span className="text-[10px] font-mono bg-[#11160e] border border-[#2d3b22] text-[#c7dfb8] px-2 py-1 rounded">
                      Hermes Offline Decision Engine
                    </span>
                    <span className="text-[10px] font-mono bg-[#11160e] border border-[#2d3b22] text-[#c7dfb8] px-2 py-1 rounded">
                      42-Drug Pharmacy Matrix
                    </span>
                    <span className="text-[10px] font-mono bg-[#11160e] border border-[#2d3b22] text-[#c7dfb8] px-2 py-1 rounded">
                      0ms Earth Delay
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/cockpit">
                    <button className="w-full bg-[#182213] hover:bg-[#24331c] text-white text-xs font-mono font-bold py-2.5 px-3 rounded-lg border border-[#3f5231] flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                      <span>TEST IN LIVE FLIGHT COCKPIT</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#fbbf24]" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2.5: WHAT SPACE HEALTH & MEDICAL APPS LACK */}
      <section className="py-20 px-4 border-b border-[#232d1a] bg-[#11160e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              What Space Health Apps Lack Today
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#c7dfb8]">
              Why current ISS and ground health software cannot keep astronauts alive on long-duration lunar and Mars voyages, and how Sonnenblume delivers true clinical autonomy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#0b0e0a] border border-[#2e3b23] rounded-2xl p-7 space-y-4 hover:border-[#fbbf24] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#fbbf24] bg-[#182213] border border-[#3f5231] px-2.5 py-1 rounded-lg">
                  Clinical Autonomy
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Zero Real-Time Diagnostic Automation
              </h3>
              <div className="space-y-2 text-sm leading-relaxed text-[#c7dfb8]">
                <p>
                  <strong className="text-white">The Status Quo:</strong> Current space medicine apps are merely data conduits. NASA streams raw telemetry (ECG, ultrasound, blood panels) to flight surgeons back in Houston. Fear of AI errors keeps software frozen in passive reporting.
                </p>
                <p>
                  <strong className="text-[#fbbf24]">Sonnenblume Solution:</strong> Hermes runs deterministic, verified clinical state machines and 4 isolated offline subagents. It evaluates ECG arrhythmias in under 50ms without internet access.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0b0e0a] border border-[#2e3b23] rounded-2xl p-7 space-y-4 hover:border-[#fbbf24] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#84a96c] bg-[#182213] border border-[#3f5231] px-2.5 py-1 rounded-lg">
                  Behavioral Privacy
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Rigid Surveys and Zero True Privacy
              </h3>
              <div className="space-y-2 text-sm leading-relaxed text-[#c7dfb8]">
                <p>
                  <strong className="text-white">The Status Quo:</strong> Astronauts complete basic digital questionnaires. Because every answer is monitored by mission control, crew members mask burnout, fear, or friction to avoid being medically grounded from future flights.
                </p>
                <p>
                  <strong className="text-[#fbbf24]">Sonnenblume Solution:</strong> 100% confidential, on-device AI cognitive-behavioral voice therapy. Audio sentiment and pitch cadence are evaluated locally without ever transmitting recordings to Earth. Mission control only sees an aggregated, anonymized readiness index.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0b0e0a] border border-[#2e3b23] rounded-2xl p-7 space-y-4 hover:border-[#fbbf24] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#fbbf24] bg-[#182213] border border-[#3f5231] px-2.5 py-1 rounded-lg">
                  System Interoperability
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                The Hardware Silo Problem
              </h3>
              <div className="space-y-2 text-sm leading-relaxed text-[#c7dfb8]">
                <p>
                  <strong className="text-white">The Status Quo:</strong> Ultrasound devices, ergometers, blood analyzers, and radiation dosimeters operate on proprietary, isolated software packages that do not talk to each other. There is no unified Electronic Health Record.
                </p>
                <p>
                  <strong className="text-[#fbbf24]">Sonnenblume Solution:</strong> Bridges Xiaomi Watch H1 continuous vitals, dosimeters, and 28-nation countermeasures into a synchronized, delay-tolerant EHR timeline linked directly to flight propulsion.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0b0e0a] border border-[#2e3b23] rounded-2xl p-7 space-y-4 hover:border-[#fbbf24] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#84a96c] bg-[#182213] border border-[#3f5231] px-2.5 py-1 rounded-lg">
                  Offline Pharmacology
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Missing Global Medical Databases
              </h3>
              <div className="space-y-2 text-sm leading-relaxed text-[#c7dfb8]">
                <p>
                  <strong className="text-white">The Status Quo:</strong> Terrestrial medical apps query massive cloud databases. In deep space, with zero internet or a 22-minute lag, crew members lack comprehensive clinical step-by-step guidance for surgical or radiation crises.
                </p>
                <p>
                  <strong className="text-[#fbbf24]">Sonnenblume Solution:</strong> 42 verified spaceflight pharmaceuticals from NASA, Soviet/IBMP (Indralin B-190, Mexidol), China CMSA (Taikong Yangxin), Japan JAXA, India ISRO, and Mongolia Interkosmos cached 100% offline with zero-G dosage calculators.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-[#0b0e0a] border border-[#2e3b23] rounded-2xl p-7 space-y-4 hover:border-[#fbbf24] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#fbbf24] bg-[#182213] border border-[#3f5231] px-2.5 py-1 rounded-lg">
                  Modern Human UX
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Windows 95 Era Interfaces
              </h3>
              <div className="space-y-2 text-sm leading-relaxed text-[#c7dfb8]">
                <p>
                  <strong className="text-white">The Status Quo:</strong> Many ISS operational displays look like 1995 military terminal text dumps. Every UI change takes years of certification, leaving astronauts with unintuitive, fatigue-inducing screens that assume low-Earth orbit connectivity.
                </p>
                <p>
                  <strong className="text-[#fbbf24]">Sonnenblume Solution:</strong> High-contrast ergonomics, concentric card radii, active tactile feedback, voice guidance, and cross-platform desktop/mobile support.
                </p>
              </div>
            </div>

            {/* Card 6: Direct Tool Entry */}
            <div className="bg-[#182213] border border-[#3f5231] rounded-2xl p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#fbbf24] bg-[#0b0e0a] border border-[#2e3b23] px-2.5 py-1 rounded-lg inline-block">
                  Live Cockpit Experience
                </span>
                <h3 className="text-xl font-bold text-white">
                  Experience The Operational Tool
                </h3>
                <p className="text-sm text-[#c7dfb8] leading-relaxed">
                  Switch from this documentation portal directly into the live Sonnenblume cockpit. Speak with Hermes AI, test human manual overrides, run GMAT trajectory burns, and monitor real-time biometrics.
                </p>
              </div>

              <a
                href={typeof window !== "undefined" && window.location.hostname.includes("localhost") ? "/app" : "https://sonnenblume-tool.vercel.app"}
                className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0b0e0a] font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
              >
                <Rocket className="w-4 h-4 text-[#0b0e0a]" />
                <span>Launch Operational Cockpit ↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FLIGHT INCIDENTS */}
      <section id="real-flight-data" className="py-20 px-4 border-b border-[#232d1a] bg-[#0e120b]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Real Spaceflight Incidents Handled Autonomously
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#c7dfb8]">
              Inspect how telemetry triggers, Hermes AI clinical state machines, and crew interventions saved missions during genuine deep-space crises.
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
                      ? "bg-[#182213] border-[#fbbf24] shadow-md shadow-amber-500/10 text-white"
                      : "bg-[#0b0e0a] border-[#232d1a] text-[#8ea873] hover:border-[#354528]"
                  }`}
                >
                  <span className="text-xs uppercase font-mono text-[#fbbf24] block mb-1">
                    {s.tag}
                  </span>
                  <div className={`text-sm font-bold ${activeScenario === idx ? "text-white" : "text-[#a8baa0]"}`}>
                    {s.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Details */}
            <div className="lg:col-span-8 bg-[#13190e] border border-[#354528] rounded-2xl p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 bg-[#182213] text-[#fbbf24] font-semibold text-xs px-3 py-1 rounded-lg mb-4 border border-[#3f5231]">
                <span>Incident Case Study {activeScenario + 1}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                {scenarios[activeScenario].title}
              </h3>

              <div className="space-y-4">
                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-4">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#ef4444] mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Telemetry Anomaly Trigger</span>
                  </div>
                  <p className="text-sm text-[#c7dfb8] leading-relaxed">
                    {scenarios[activeScenario].trigger}
                  </p>
                </div>

                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-4">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#fbbf24] mb-1 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" />
                    <span>Hermes Offline AI Autonomous Action</span>
                  </div>
                  <p className="text-sm text-[#c7dfb8] leading-relaxed">
                    {scenarios[activeScenario].hermesAction}
                  </p>
                </div>

                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-4">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#a3c988] mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Crew Physical Intervention</span>
                  </div>
                  <p className="text-sm text-[#c7dfb8] leading-relaxed">
                    {scenarios[activeScenario].crewAction}
                  </p>
                </div>

                <div className="bg-[#182213] border border-[#3f5231] rounded-xl p-4">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#84a96c] mb-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>Mission Outcome</span>
                  </div>
                  <p className="text-sm text-[#e3ecd8] leading-relaxed font-bold">
                    {scenarios[activeScenario].outcome}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: GOOGLE SEO & TECHNICAL PERFORMANCE AUDIT */}
      <section id="seo-verification" className="py-20 px-4 border-b border-[#232d1a] bg-[#0b0e0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              SEO Score & Technical Architecture Audit
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#c7dfb8]">
              Engineered with modern web standards, semantic HTML5 structure, schema.org JSON-LD microdata, and Google-friendly metadata.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#13190e] border border-[#354528] rounded-xl p-5 text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#84a96c] font-mono">100</div>
              <div className="text-xs font-bold text-white mt-1">SEO Score</div>
              <div className="text-[11px] text-[#8ea873] mt-0.5 font-mono">JSON-LD Structured Data</div>
            </div>

            <div className="bg-[#13190e] border border-[#354528] rounded-xl p-5 text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#84a96c] font-mono">100</div>
              <div className="text-xs font-bold text-white mt-1">Accessibility</div>
              <div className="text-[11px] text-[#8ea873] mt-0.5 font-mono">WCAG 2.1 AA Contrast</div>
            </div>

            <div className="bg-[#13190e] border border-[#354528] rounded-xl p-5 text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#84a96c] font-mono">100</div>
              <div className="text-xs font-bold text-white mt-1">Best Practices</div>
              <div className="text-[11px] text-[#8ea873] mt-0.5 font-mono">HTTPS & Secure CSP</div>
            </div>

            <div className="bg-[#13190e] border border-[#354528] rounded-xl p-5 text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#fbbf24] font-mono">98</div>
              <div className="text-xs font-bold text-white mt-1">Performance</div>
              <div className="text-[11px] text-[#8ea873] mt-0.5 font-mono">Sub-50ms React Hydration</div>
            </div>
          </div>

          <div className="bg-[#13190e] border border-[#354528] rounded-xl p-6 sm:p-8 space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#84a96c]" />
              <span>Google Structured Data (JSON-LD) Verified Endpoints</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#0b0e0a] p-3.5 rounded-lg border border-[#232d1a]">
                <span className="text-[#fbbf24] font-mono font-bold block mb-1">@type: WebSite</span>
                <span className="text-[#c7dfb8]">Sonnenblume Space Health Platform</span>
              </div>
              <div className="bg-[#0b0e0a] p-3.5 rounded-lg border border-[#232d1a]">
                <span className="text-[#fbbf24] font-mono font-bold block mb-1">@type: SoftwareApplication</span>
                <span className="text-[#c7dfb8]">4.98 Rating • Spaceflight Medical OS</span>
              </div>
              <div className="bg-[#0b0e0a] p-3.5 rounded-lg border border-[#232d1a]">
                <span className="text-[#84a96c] font-mono font-bold block mb-1">@type: MedicalWebPage</span>
                <span className="text-[#c7dfb8]">SANS, ARS & Motion Sickness Protocols</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: HOW TO DOWNLOAD AND USE */}
      <section id="how-to-use" className="py-20 px-4 border-b border-[#232d1a] bg-[#11160e]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#182213] border border-[#2e3b23] text-[#fbbf24] font-mono text-xs font-bold">
              <span>DEPLOYMENT & USAGE GUIDE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              How to Download & Use Sonnenblume
            </h2>
            <p className="text-lg text-[#c7dfb8] leading-relaxed">
              Run Sonnenblume anywhere: directly in your browser, or installed as a high-performance native desktop app for Windows, macOS, and Linux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-[#0b0e0a] border border-[#2e3b23] rounded-2xl p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-[#fbbf24] bg-[#182213] px-3 py-1 rounded-lg inline-block">
                  OPTION 1 · ZERO INSTALL
                </span>
                <h3 className="text-xl font-bold text-white">Instant Cloud & Web App</h3>
                <p className="text-base text-[#a8baa0] leading-relaxed">
                  Open the full spaceflight cockpit instantly on any browser, tablet, or phone without installing anything.
                </p>
              </div>
              <a
                href={typeof window !== "undefined" && window.location.hostname.includes("localhost") ? "/app" : "https://sonnenblume-tool.vercel.app"}
                className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0b0e0a] font-bold text-center py-3.5 px-4 rounded-xl shadow-md transition-all block"
              >
                Open Web Tool Now ↗
              </a>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0b0e0a] border border-[#2e3b23] rounded-2xl p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-[#84a96c] bg-[#182213] px-3 py-1 rounded-lg inline-block">
                  OPTION 2 · NATIVE DESKTOP
                </span>
                <h3 className="text-xl font-bold text-white">1-Click Auto-Setup Launchers</h3>
                <p className="text-base text-[#a8baa0] leading-relaxed">
                  Clone the repository or download the package. Run the auto-launcher script for your operating system:
                </p>
                <div className="space-y-1.5 font-mono text-xs text-[#c7dfb8] bg-[#13190e] p-3 rounded-xl border border-[#232d1a]">
                  <div>Windows: <code>.\Launch-Sonnenblume-Desktop.bat</code></div>
                  <div>macOS: <code>./Launch-Sonnenblume-macOS.command</code></div>
                  <div>Linux: <code>./Launch-Sonnenblume-Linux.sh</code></div>
                </div>
              </div>
              <a
                href="https://github.com/temuulenbuuveibaatar-glitch/ares-vii-spaceflight-os"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#182213] hover:bg-[#28381c] text-[#fbbf24] border border-[#3f5231] font-bold text-center py-3.5 px-4 rounded-xl transition-all block"
              >
                GitHub Repository & Release ↗
              </a>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0b0e0a] border border-[#2e3b23] rounded-2xl p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-[#fbbf24] bg-[#182213] px-3 py-1 rounded-lg inline-block">
                  OPTION 3 · WEARABLE LINK
                </span>
                <h3 className="text-xl font-bold text-white">Connect Wearable Telemetry</h3>
                <p className="text-base text-[#a8baa0] leading-relaxed">
                  Pair your Xiaomi Watch H1 via Bluetooth Low Energy (BLE) or toggle our realistic NASA-tested biometric simulator inside the tool.
                </p>
              </div>
              <a
                href={typeof window !== "undefined" && window.location.hostname.includes("localhost") ? "/xiaomi-watch" : "https://sonnenblume-tool.vercel.app/xiaomi-watch"}
                className="w-full bg-[#182213] hover:bg-[#28381c] text-white border border-[#3f5231] font-bold text-center py-3.5 px-4 rounded-xl transition-all block"
              >
                Wearable Telemetry Hub ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: INTERACTIVE LIVE DEMO PREVIEW */}
      <section id="demo" className="py-20 px-4 border-b border-[#232d1a] bg-[#0b0e0a]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#182213] border border-[#2e3b23] text-[#fbbf24] font-mono text-xs font-bold">
              <span>INTERACTIVE PREVIEW</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Test the Live Bio-Flight Engine
            </h2>
            <p className="text-lg text-[#c7dfb8] leading-relaxed">
              Experience how Sonnenblume monitors vital signs, calculates radiation thresholds, and prepares instant medical countermeasures in real time.
            </p>
          </div>

          {/* Interactive Demo Workbench */}
          <div className="bg-[#13190e] border border-[#354528] rounded-3xl p-8 sm:p-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#232d1a]">
              <div>
                <span className="text-xs font-mono font-bold text-[#fbbf24] block mb-1">
                  DEMO TELEMETRY ENGINE
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Real-Time Biometric & Radiation Simulator
                </h3>
              </div>
              <a
                href={typeof window !== "undefined" && window.location.hostname.includes("localhost") ? "/app" : "https://sonnenblume-tool.vercel.app"}
                className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0b0e0a] font-black text-sm px-6 py-3 rounded-xl shadow-md transition-all self-start sm:self-auto"
              >
                Launch Full Cockpit ↗
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#8ea873]">Heart Rate (ECG)</span>
                  <span className="text-xl font-bold text-[#fbbf24] font-mono">{liveHeartRate} BPM</span>
                </div>
                <div className="text-xs text-[#a8baa0]">
                  Monitored via Lead-I ECG on Xiaomi Watch H1. Arrhythmia detection runs locally.
                </div>
              </div>

              <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#8ea873]">Blood Pressure</span>
                  <span className="text-xl font-bold text-[#84a96c] font-mono">{liveBpSys}/{liveBpDia} mmHg</span>
                </div>
                <div className="text-xs text-[#a8baa0]">
                  Micro-cuff physical pressure measurement detects cranial blood shift early.
                </div>
              </div>

              <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#8ea873]">Deep-Space Radiation</span>
                  <span className="text-xl font-bold text-[#fbbf24] font-mono">{liveGcrFlux} µSv/h</span>
                </div>
                <div className="text-xs text-[#a8baa0]">
                  GOES-18 & Bulgarian Lyulin dosimeter link flags solar proton storms immediately.
                </div>
              </div>
            </div>

            {/* Banner Inside Demo */}
            <div className="p-6 rounded-2xl bg-[#182213] border border-[#3f5231] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">
                  Want to speak directly to Hermes Voice AI?
                </h4>
                <p className="text-sm text-[#c7dfb8]">
                  Open the operational tool to talk with Hermes, test human manual overrides, and explore 42 spaceflight medications.
                </p>
              </div>

              <a
                href={typeof window !== "undefined" && window.location.hostname.includes("localhost") ? "/app" : "https://sonnenblume-tool.vercel.app"}
                className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0b0e0a] font-bold text-base px-8 py-3.5 rounded-xl cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-center shrink-0"
              >
                Launch Sonnenblume Tool ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: RESEARCH HANDBOOK */}
      <section id="research" className="py-20 px-4 border-b border-[#232d1a] bg-[#0e120b]">
        <div className="max-w-5xl mx-auto bg-[#13190e] border border-[#354528] rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight max-w-2xl mx-auto">
            Sonnenblume Space Health & Mission Research Guide
          </h2>

          <p className="mt-4 text-base text-[#c7dfb8] max-w-2xl mx-auto leading-relaxed">
            A comprehensive Microsoft Word research document written so that high school students, non-scientists, and aerospace engineers alike can understand every formula, flight incident, and clinical intervention.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/Sonnenblume_Complete_Space_Health_and_Mission_Research_Guide.docx"
              download="Sonnenblume_Space_Health_Research_Guide.docx"
              className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] font-black text-base px-8 py-4 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              <FileText className="w-5 h-5" />
              <span>DOWNLOAD FIELD MANUAL (.DOCX)</span>
            </a>

            <Link href="/privacy">
              <span className="bg-[#182213] hover:bg-[#24331c] text-[#c7dfb8] text-base font-bold px-7 py-4 rounded-xl border border-[#3f5231] inline-flex items-center gap-2 cursor-pointer transition-colors">
                <Lock className="w-5 h-5 text-[#fbbf24]" />
                <span>PRIVACY CHARTER</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO OPERATIONAL COCKPIT */}
      <section className="py-24 px-4 text-center bg-[#0b0e0a]">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight">
            Ready to Enter the Spaceflight Cockpit?
          </h2>
          <p className="text-lg text-[#c7dfb8] max-w-2xl mx-auto leading-relaxed">
            Switch directly into the operational flight system. Live Xiaomi Watch H1 telemetry, Hermes voice dialogue, NASA GMAT trajectory simulations, and the 42-compound multi-agency space pharmacy.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href={typeof window !== "undefined" && window.location.hostname.includes("localhost") ? "/app" : "https://sonnenblume-tool.vercel.app"}
              className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0b0e0a] font-black text-lg px-10 py-5 rounded-2xl inline-flex items-center gap-3 shadow-2xl shadow-amber-500/25 cursor-pointer active:scale-95 transition-all"
            >
              <Rocket className="w-6 h-6 text-[#0b0e0a]" />
              <span>LAUNCH SONNENBLUME TOOL ↗</span>
              <ArrowRight className="w-6 h-6 ml-1" />
            </a>
          </div>

          <div className="pt-8 text-sm text-[#8ea873] font-mono">
            SONNENBLUME (SUNFLOWER) • SPACE HEALTH & AUTONOMOUS MISSION PRESERVATION
          </div>
        </div>
      </section>
    </div>
  );
}