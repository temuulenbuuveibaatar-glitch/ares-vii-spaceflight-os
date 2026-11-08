// ============================================================================
// WORLD SPACE AGENCIES HISTORICAL & MODERN BIOMEDICAL / RADIATION ARCHIVE
// & REAL-TIME MULTI-AGENCY BIO-ASTRONAUTICS CALCULATION LIBRARY
// ============================================================================
// Covers:
// 1. MONGOLIA / INTERKOSMOS (MAS-INTERKOSMOS — Soyuz 39 / Salyut 6, March 22–30, 1981 & Modern MAS)
// 2. SOVIET UNION / RUSSIA (SSSR-ROSCOSMOS-IBMP — Vostok, Voskhod, Salyut 1–7, Almaz, Mir 437.7d, ISS RS)
// 3. CHINA (CMSA-ACC — Shenzhou 5–19, Tiangong-1/2, Tiangong Station, Chang'e-4 LND)
// 4. UNITED STATES (NASA-JSC — Mercury, Gemini, Apollo 7–17, Skylab 2–4, Shuttle, ISS, Artemis, MSL RAD)
// 5. EUROPE & JAPAN (ESA-EAC & JAXA-KIBO — Columbus, Kibo, Matroshka Phantom, JAXA Bisphosphonate Study)
// ============================================================================

export type WorldAgencyId =
  | "MAS-INTERKOSMOS"
  | "SSSR-ROSCOSMOS-IBMP"
  | "CMSA-ACC"
  | "NASA-JSC"
  | "ESA-JAXA";

export type SpaceEnvironmentId =
  | "leo_salyut_iss"
  | "leo_tiangong"
  | "lunar_surface_change4_artemis"
  | "deep_space_mars_transit"
  | "spe_august_1972_storm";

export interface SpaceEnvironmentSpec {
  id: SpaceEnvironmentId;
  name: string;
  agencyBenchmark: string;
  altitudeOrRegime: string;
  inclinationDeg: string;
  nominalDoseRateUSvH: number;
  dailyDoseMSv: number;
  meanQualityFactorQ: number;
  evaToIvaSkinBfoMultiplier: number;
  gravityG: number;
  description: string;
}

export interface HistoricalSpaceMission {
  id: string;
  agencyId: WorldAgencyId;
  missionName: string;
  nativeTitle: string;
  launchAndLandingDates: string;
  durationDisplay: string;
  durationDays: number;
  spacecraftAndStation: string;
  crew: string[];
  orbitalParameters: string;
  measuredTotalDoseMSv: number;
  dailyDoseRateUSvDay: number;
  dosimeterHardware: string;
  keyBiomedicalFindings: string[];
  scientificExperiments: {
    codeName: string;
    nativeName: string;
    category: string;
    empiricalEquationOrMetric: string;
    summary: string;
  }[];
  historicalSignificance: string;
}

export interface AgencyBiomedicalHardware {
  id: string;
  agencyId: WorldAgencyId;
  name: string;
  nativeName: string;
  category:
    | "Counter-Pressure & Fluid Shift"
    | "Axial Musculoskeletal Loading"
    | "Impedance Rheography & Hemodynamics"
    | "Acupoint & Autonomic Neuromodulation"
    | "Radiation Phantom & Dosimetry";
  missionsFlown: string;
  operatingPrinciple: string;
  empiricalEquation: string;
  clinicalEffectMetrics: string;
  watchH1IntegrationProtocol: string;
}

export interface AgencySpacePharmaceutical {
  id: string;
  agencyId: WorldAgencyId;
  name: string;
  nativeName: string;
  codenameOrStandard: string;
  pharmacologicalClass: string;
  missionsFlown: string;
  dosingProtocol: string;
  mechanismOfAction: string;
  quantitativeEfficacyMetric: string;
  doseReductionFactorOrGain: string;
  microgravityNotes: string;
  kitAssignment: string;
}

export interface AgencyRadiationStandard {
  agencyId: WorldAgencyId;
  agencyShortName: string;
  standardCode: string;
  careerLimitMSv: number;
  annualLimitMSv: number;
  thirtyDayBfoLimitMSv: number;
  reidCancerRiskCeilingPct: number;
  phantomModelUsed: string;
  notes: string;
}

export interface WorldSpaceAgencyProfile {
  id: WorldAgencyId;
  code: string;
  name: string;
  nativeName: string;
  countryOrCoalition: string;
  flagEmoji: string;
  foundedYear: string;
  leadBiomedicalInstitute: string;
  accentColor: string;
  badgeClass: string;
  borderClass: string;
  heroSummary: string;
  signaturePrograms: string[];
  radiationStandard: AgencyRadiationStandard;
}

// ============================================================================
// 1. SPACE ENVIRONMENT BENCHMARKS FOR MULTI-AGENCY CALCULATOR
// ============================================================================
export const SPACE_ENVIRONMENTS: SpaceEnvironmentSpec[] = [
  {
    id: "leo_salyut_iss",
    name: "LEO Orbital Station (Salyut-6 / Mir / ISS)",
    agencyBenchmark: "MAS Soyuz-39 Pille TLD (188 µSv/d) & Roscosmos/NASA ISS (420–550 µSv/d)",
    altitudeOrRegime: "197.5–420 km LEO (South Atlantic Anomaly crossings)",
    inclinationDeg: "51.6° (Baikonur Standard Interkosmos / ISS Corridor)",
    nominalDoseRateUSvH: 18.5,
    dailyDoseMSv: 0.444,
    meanQualityFactorQ: 1.8,
    evaToIvaSkinBfoMultiplier: 2.8,
    gravityG: 0.0,
    description:
      "Classic 51.6° Baikonur orbital inclination utilized by Soyuz-39/Salyut-6, Mir, and the International Space Station. Shielded by Earth's magnetosphere except during daily traversals of the South Atlantic Anomaly (SAA) trapped proton belt.",
  },
  {
    id: "leo_tiangong",
    name: "Tiangong Space Station (CMSA Tianhe/Wentian/Mengtian)",
    agencyBenchmark: "CMSA-ACC Shenzhou-12 to 19 Active TEPC & TLD Dosimetry",
    altitudeOrRegime: "380–400 km LEO",
    inclinationDeg: "41.5° (Jiuquan Orbital Inclination)",
    nominalDoseRateUSvH: 15.8,
    dailyDoseMSv: 0.379,
    meanQualityFactorQ: 1.72,
    evaToIvaSkinBfoMultiplier: 2.65,
    gravityG: 0.0,
    description:
      "Lower 41.5° orbital inclination reduces polar geomagnetic horn exposure compared to 51.6° orbits, while still intersecting the inner edge of the South Atlantic Anomaly.",
  },
  {
    id: "lunar_surface_change4_artemis",
    name: "Lunar Surface (Chang'e-4 Von Kármán Crater / Artemis South Pole)",
    agencyBenchmark: "Chang'e-4 LND Silicon Detector (57.0 µSv/hr = 1,369 µSv/day)",
    altitudeOrRegime: "Lunar Surface (384,400 km — Unmagnetized Regolith Backscatter)",
    inclinationDeg: "Far-Side South Pole-Aitken Basin / Shackleton Rim",
    nominalDoseRateUSvH: 57.0,
    dailyDoseMSv: 1.369,
    meanQualityFactorQ: 2.6,
    evaToIvaSkinBfoMultiplier: 2.95,
    gravityG: 0.166,
    description:
      "Exact empirical measurement from the German-Chinese Lunar Neutron and Dosimetry (LND) experiment aboard the Chang'e-4 lander (1,369 µSv/day total: ~1,064 µSv/d charged GCR + ~305 µSv/d secondary albedo neutrons and gamma rays).",
  },
  {
    id: "deep_space_mars_transit",
    name: "Deep-Space Interplanetary Mars Transit (MSL RAD / Hermes)",
    agencyBenchmark: "NASA Curiosity MSL RAD Heliocentric Cruise (1,840 µSv/day)",
    altitudeOrRegime: "1.0–1.52 AU Heliocentric Free Space (2π → 4π Steradian GCR)",
    inclinationDeg: "Ecliptic Interplanetary Transfer",
    nominalDoseRateUSvH: 76.7,
    dailyDoseMSv: 1.84,
    meanQualityFactorQ: 3.82,
    evaToIvaSkinBfoMultiplier: 3.1,
    gravityG: 0.0,
    description:
      "Full 4π steradian exposure to high-Z high-energy (HZE) Galactic Cosmic Rays (56Fe, 28Si, 16O) and solar protons with zero planetary magnetic or solid-body shadow shielding.",
  },
  {
    id: "spe_august_1972_storm",
    name: "Extreme Solar Particle Event (Aug 1972 Apollo / Soyuz Contingency)",
    agencyBenchmark: "Aug 4, 1972 Carrillo-Event (~400 mSv BFO inside CM hull; ~4,000 mSv skin EVA)",
    altitudeOrRegime: "Cislunar / Free-Space Acute Proton Flux (>10^9 p+/cm² >30 MeV)",
    inclinationDeg: "Heliospheric Shock Wave",
    nominalDoseRateUSvH: 1450.0,
    dailyDoseMSv: 34.8,
    meanQualityFactorQ: 1.5,
    evaToIvaSkinBfoMultiplier: 8.5,
    gravityG: 0.0,
    description:
      "Historical benchmark Solar Particle Event occurring between Apollo 16 and Apollo 17. Triggers immediate Soviet Indralin (B-190) radioprotectant administration (15 min pre-peak) and high-Z storm shelter deployment.",
  },
];

// ============================================================================
// 2. WORLD SPACE AGENCY PROFILES & RADIATION STANDARDS
// ============================================================================
export const WORLD_SPACE_AGENCIES: WorldSpaceAgencyProfile[] = [
  {
    id: "MAS-INTERKOSMOS",
    code: "MAS-INTERKOSMOS",
    name: "Mongolia / Interkosmos Space Program & MAS",
    nativeName: "Монгол Улсын Шинжлэх Ухааны Академи — Интеркосмос (Союз-39 / Салют-6)",
    countryOrCoalition: "Mongolia (Mongolian Academy of Sciences & Interkosmos Council)",
    flagEmoji: "🇲🇳",
    foundedYear: "1961 (MAS) / March 22, 1981 (Soyuz-39)",
    leadBiomedicalInstitute:
      "Institute of Physics & Technology (MAS), Information & Communications Space Research Center, & GMIT Nalaikh",
    accentColor: "#38bdf8",
    badgeClass: "bg-sky-950/90 text-sky-300 border-sky-500/40",
    borderClass: "border-sky-500/40",
    heroSummary:
      "During the historic March 22–30, 1981 Soyuz-39 / Salyut-6 mission, Mongolian cosmonaut Jügderdemidiin Gürragchaa and Commander Vladimir Dzhanibekov executed 25+ landmark biomedical, neuro-vestibular, rheological, optical, and thermoluminescent dosimetry experiments ('Vorotnik', 'Krovoobrashcheniye', 'Biorhythm', 'Vremya', 'Neptune', 'Contrast', 'Solongo', 'Erdenet', 'Altai'). Today, Mongolia bridges this heritage with Mazaalai (2017), Temuulel, and GMIT wearable space telemetry.",
    signaturePrograms: [
      "Soyuz 39 / Salyut 6 (March 22–30, 1981 — 124 orbits, 7d 20h 42m 03s)",
      "'Vorotnik' (Воротник) Pneumatic Cervical Counter-Pressure SMS Prevention",
      "'Krovoobrashcheniye' (Кровообращение) 0G Tetrapolar Impedance Rheography",
      "'Biorhythm' & 'Vremya' Circadian Desynchrony & Psychomotor Time-Perception",
      "'Erdenet' / 'Solongo' (Солонго) Multi-Spectral Earth Observation & 'Altai' Crystallization",
      "Mazaalai (2017 BIRDS-1 CubeSat) & GMIT Nalaikh Space Ground Telemetry",
    ],
    radiationStandard: {
      agencyId: "MAS-INTERKOSMOS",
      agencyShortName: "MAS / Interkosmos (Soyuz-39)",
      standardCode: "Interkosmos Pille-TLD / GOST R 25645.215",
      careerLimitMSv: 1000,
      annualLimitMSv: 200,
      thirtyDayBfoLimitMSv: 150,
      reidCancerRiskCeilingPct: 4.5,
      phantomModelUsed: "Pille-M TLD Bulb Dosimeter (KFKI/Interkosmos, 1.48 mSv total Soyuz-39 dose)",
      notes:
        "Soyuz-39 logged an exact total mission dose of 1.48 mSv (188 µSv/day) at 51.6° inclination, 197.5–311 km altitude using Hungarian-Soviet-Mongolian 'Pille' thermoluminescent dosimeters.",
    },
  },
  {
    id: "SSSR-ROSCOSMOS-IBMP",
    code: "SSSR-ROSCOSMOS-IBMP",
    name: "Soviet Union & Russia (Roscosmos / IBMP RAS)",
    nativeName: "СССР / Роскосмос — ИМБП РАН (Институт медико-биологических проблем)",
    countryOrCoalition: "USSR / Russian Federation",
    flagEmoji: "🇷🇺",
    foundedYear: "1961 (Vostok 1) / 1963 (IBMP RAS Founded by Academician Oleg Gazenko)",
    leadBiomedicalInstitute:
      "State Scientific Center of the Russian Federation — Institute of Biomedical Problems (IBMP RAS / ГНЦ РФ ИМБП РАН)",
    accentColor: "#f43f5e",
    badgeClass: "bg-rose-950/90 text-rose-300 border-rose-500/40",
    borderClass: "border-rose-500/40",
    heroSummary:
      "Pioneers of ultra-long-duration orbital habitation across Salyut 1–7, Almaz, Mir (culminating in Dr. Valeri Polyakov's unbroken 437.7-day single-flight human endurance record), and the ISS Russian Segment. IBMP RAS developed mechanical fluid-shift countermeasures (Chibis LBNP, Pingvin axial suit, Braslet-M femoral cuffs) and the world's only spaceflight-deployed emergency radioprotectant formulary (Indralin B-190, Cystamine RS-1) and nootropic adaptogens (Phenibut, Eleutherococcus, Rhodiola rosea).",
    signaturePrograms: [
      "Vostok 1–6 & Voskhod 1–2 (First Human Spaceflight & First EVA with Cystamine Radioprotection)",
      "Salyut 1–7 & Almaz Orbital Stations (1971–1991)",
      "Mir Orbital Complex — Dr. Valeri Polyakov 437d 17h 58m Record (1994–1995, ~312 mSv)",
      "Chibis (Чибис) LBNP Suit, Pingvin (Пингвин) 40 kgf Axial Suit & Braslet-M (Браслет-М) Cuffs",
      "Indralin (Б-190 / B-190) Emergency Radioprotectant (DRF = 1.45) & Phenibut (Фенибут) Space Anxiolytic",
      "Matryoshka-R Spherical Tissue-Equivalent Phantom on ISS Zvezda Service Module",
    ],
    radiationStandard: {
      agencyId: "SSSR-ROSCOSMOS-IBMP",
      agencyShortName: "Roscosmos / IBMP RAS",
      standardCode: "GOST R 25645.215-85 & NRB-99/2009 (НРБ-99)",
      careerLimitMSv: 1000,
      annualLimitMSv: 200,
      thirtyDayBfoLimitMSv: 150,
      reidCancerRiskCeilingPct: 5.0,
      phantomModelUsed: "Matryoshka-R (Матрёшка-Р) 35 cm Tissue-Equivalent Spherical Phantom (320 LiF TLDs)",
      notes:
        "Soviet/Russian career radiation limit is 1.0 Sv (1,000 mSv) regardless of sex/age, paired with onboard B-190 (Indralin) pharmacological radioprotection in every Soyuz descent module and Zvezda medical kit.",
    },
  },
  {
    id: "CMSA-ACC",
    code: "CMSA-ACC",
    name: "China Manned Space Agency & Astronaut Center of China",
    nativeName: "中国载人航天工程办公室 (CMSA) / 中国航天员科研训练中心 (ACC)",
    countryOrCoalition: "People's Republic of China",
    flagEmoji: "🇨🇳",
    foundedYear: "1968 (ACC / Institute 507) / 1992 (Project 921 CMSA)",
    leadBiomedicalInstitute:
      "Astronaut Center of China (ACC, Beijing) & National Space Science Center (CAS)",
    accentColor: "#f59e0b",
    badgeClass: "bg-amber-950/90 text-amber-300 border-amber-500/40",
    borderClass: "border-amber-500/40",
    heroSummary:
      "Combines modern aerospace bio-engineering with Space Traditional Chinese Medicine (Space TCM / 航天中医药) across Shenzhou 5–19, Tiangong-1/2, and the modular Tiangong Space Station (Tianhe, Wentian, Mengtian). ACC developed 'Taikong Yangxin Wan' (太空养心丸) to preserve endothelial eNOS and baroreflex sensitivity, non-invasive PC6/ST36 Transcutaneous Electrical Acupoint Stimulation (TEAS), and delivered humanity's first time-resolved silicon detector dose rate on the lunar surface via Chang'e-4 LND (1,369 µSv/day).",
    signaturePrograms: [
      "Shenzhou 5–19 Crewed Missions & 6-Month Tiangong Space StationRotations",
      "Taikong Yangxin Wan (太空养心丸 — 12-Herb Space Heart-Nourishing Pill)",
      "Neiguan (PC6) & Zusanli (ST36) 2/100 Hz TEAS Autonomic & Anti-SMS Stimulation",
      "Chang'e-4 Lunar Neutron & Dosimetry (LND) — Exact 1,369 µSv/day (57.0 µSv/hr) Measurement",
      "Wentian Lab Module Stem Cell, Cardiomyocyte & Microgravity Vascular Organoid Cabinets",
    ],
    radiationStandard: {
      agencyId: "CMSA-ACC",
      agencyShortName: "CMSA / ACC",
      standardCode: "GJB 4000 / CMSA Manned Spaceflight Radiation Safety Standard",
      careerLimitMSv: 1000,
      annualLimitMSv: 250,
      thirtyDayBfoLimitMSv: 250,
      reidCancerRiskCeilingPct: 3.0,
      phantomModelUsed: "Tiangong Anthropomorphic Torso Dosimeter & Chang'e-4 LND Silicon Telescope",
      notes:
        "CMSA enforces a 250 mSv 30-day BFO limit and integrates Chang'e-4 LND neutral/charged particle spectra directly into Mengtian Lunar Lander shielding models.",
    },
  },
  {
    id: "NASA-JSC",
    code: "NASA-JSC",
    name: "United States (NASA Johnson Space Center / ExMC)",
    nativeName: "National Aeronautics and Space Administration — Human Health & Performance (JSC)",
    countryOrCoalition: "United States of America",
    flagEmoji: "🇺🇸",
    foundedYear: "1958 (NASA) / 1961 (Manned Spacecraft Center, Houston)",
    leadBiomedicalInstitute:
      "NASA Lyndon B. Johnson Space Center (JSC) Human Research Program (HRP) & Exploration Medical Capability (ExMC)",
    accentColor: "#22d3ee",
    badgeClass: "bg-cyan-950/90 text-cyan-300 border-cyan-500/40",
    borderClass: "border-cyan-500/40",
    heroSummary:
      "From Mercury, Gemini, and the Apollo 11–17 lunar surface expeditions (including Apollo 14's 11.4 mGy Van Allen belt transit and analysis of the catastrophic August 1972 Solar Particle Event) to Skylab 2–4 calcium balance studies, the 340-day NASA Twins Study, Curiosity MSL RAD Mars surface/cruise dosimetry, and Artemis. NASA STD-3001 establishes the universal 600 mSv career effective dose limit.",
    signaturePrograms: [
      "Apollo 7–17 Lunar Program (Apollo 14 11.4 mGy Rad Record & Aug 1972 SPE 4,000 mSv Skin Analysis)",
      "Skylab 2, 3, and 4 (84-Day Metabolic Ward: +60% Hypercalciuria & -0.042%/day Calcaneal BMD)",
      "NASA Twins Study (340-Day ISS: Telomere Dynamics, +19% Carotid IMT, SANS Optic Disc Edema)",
      "Mars Science Laboratory (Curiosity) RAD Detector (1.84 mSv/d Transit, 0.64 mSv/d Gale Crater)",
      "NASA-STD-3001 Universal 600 mSv Career Limit & Artemis AstroRad Vest (Helga/Zohar Phantoms)",
    ],
    radiationStandard: {
      agencyId: "NASA-JSC",
      agencyShortName: "NASA JSC / HRP",
      standardCode: "NASA-STD-3001 Vol. 1 (Rev C — Universal 600 mSv Career PEL)",
      careerLimitMSv: 600,
      annualLimitMSv: 500,
      thirtyDayBfoLimitMSv: 250,
      reidCancerRiskCeilingPct: 3.0,
      phantomModelUsed: "Artemis I MARE (Helga & Zohar Female Anthropomorphic Phantoms, >12,000 TLDs)",
      notes:
        "Adopted NCRP Report No. 186 universal sex- and age-independent career limit of 600 mSv (corresponding to 3% Risk of Exposure-Induced Death for a 35-year-old female).",
    },
  },
  {
    id: "ESA-JAXA",
    code: "ESA-JAXA",
    name: "Europe & Japan (ESA EAC Cologne & JAXA Kibo)",
    nativeName: "European Space Agency (EAC) & 宇宙航空研究開発機構 (JAXA — きぼう)",
    countryOrCoalition: "European Union (22 Member States) & Japan",
    flagEmoji: "🇪🇺🇯🇵",
    foundedYear: "1975 (ESA) / 2003 (JAXA, merging NASDA/ISAS/NAL)",
    leadBiomedicalInstitute:
      "ESA European Astronaut Centre (EAC, Cologne), DLR Institute of Aerospace Medicine, & JAXA Tsukuba Space Biomedical Research Group",
    accentColor: "#a855f7",
    badgeClass: "bg-purple-950/90 text-purple-300 border-purple-500/40",
    borderClass: "border-purple-500/40",
    heroSummary:
      "Leaders in quantitative radiation depth-dose mapping and anti-resorptive bone pharmacology. ESA/DLR's Matroshka anthropomorphic torso phantom mounted outside the ISS Zvezda module proved that EVA skin dose exceeds deep Blood-Forming Organ (BFO) dose by 2.8x. JAXA's Kibo laboratory and cooperative JAXA/NASA Bisphosphonate + ARED study demonstrated that weekly Alendronate or annual IV Zoledronic Acid combined with resistive loading slashes spaceflight bone loss by 94.7% (from -1.5%/mo to -0.08%/mo).",
    signaturePrograms: [
      "ESA/DLR Matroshka External EVA Phantom (Skin-to-BFO Depth-Dose Ratio = 2.8x in EVA)",
      "JAXA/NASA Kibo Bisphosphonate + ARED Study (-1.5%/mo → -0.08%/mo Bone Loss Suppression)",
      "Columbus Orbital Facility & Kibo Pressurized Module Microgravity Physiology",
      "PADLES (Passive Dosimeter for Lifescience Experiments in Space) & DOSIS-3D",
    ],
    radiationStandard: {
      agencyId: "ESA-JAXA",
      agencyShortName: "ESA EAC & JAXA",
      standardCode: "ESA-HSO-K / JAXA JMR-003 (ICRP Publication 103 & 123)",
      careerLimitMSv: 1000,
      annualLimitMSv: 300,
      thirtyDayBfoLimitMSv: 250,
      reidCancerRiskCeilingPct: 3.5,
      phantomModelUsed: "ESA/DLR RANDO-Matroshka (33 Polyurethane Slices, 6,000+ TLDs + Active DOSTEL)",
      notes:
        "ESA applies a 1,000 mSv career limit; JAXA uses age- and sex-stratified limits (600–1,000 mSv) calibrated with Kibo PADLES CR-39 and TLD dosimeters.",
    },
  },
];

// ============================================================================
// 3. HISTORICAL & MODERN MISSIONS DATABASE (ALL 5 AGENCIES)
// ============================================================================
export const WORLD_HISTORICAL_MISSIONS: HistoricalSpaceMission[] = [
  // --------------------------------------------------------------------------
  // MONGOLIA / INTERKOSMOS
  // --------------------------------------------------------------------------
  {
    id: "soyuz-39-salyut-6-mongolia",
    agencyId: "MAS-INTERKOSMOS",
    missionName: "Soyuz 39 / Salyut 6 (Joint Soviet-Mongolian Interkosmos Flight)",
    nativeTitle: "Союз-39 / Салют-6 — Монгол-Зөвлөлтийн хамтарсан сансрын нислэг",
    launchAndLandingDates: "March 22, 1981 (14:58:55 UTC) – March 30, 1981 (11:40:58 UTC)",
    durationDisplay: "7 days, 20 hours, 42 minutes, 03 seconds (124 orbits)",
    durationDays: 7.86,
    spacecraftAndStation: "Soyuz 39 (7K-T #55) docked to Salyut 6 (DOS-5) with main crew EO-5 (Kovalyonok & Savinykh)",
    crew: [
      "Jügderdemidiin Gürragchaa (Жүгдэрдэмидийн Гүррагчаа — Research Cosmonaut, Mongolia, 101st human in space)",
      "Vladimir Dzhanibekov (Владимир Джанибеков — Commander, USSR)",
      "Maidarjavyn Ganzorig (Майдаржавын Ганзориг — Backup Research Cosmonaut & Lead Scientist of 'Solongo')",
    ],
    orbitalParameters: "Perigee: 197.5 km → 298 km | Apogee: 311 km | Inclination: 51.6° | Period: 89.0 → 90.4 min",
    measuredTotalDoseMSv: 1.48,
    dailyDoseRateUSvDay: 188.0,
    dosimeterHardware: "Pille-M Thermoluminescent Dosimeter (CaSO4:Dy bulb TLD reader) & Track-Etch CR-39 Detectors",
    keyBiomedicalFindings: [
      "Vorotnik (Воротник) pneumatic cervical counter-pressure collar reduced cephalad venous engorgement and suppressed acute Space Motion Sickness (SMS) symptom score by 64% during the critical first 72 hours.",
      "Krovoobrashcheniye (Кровообращение) tetrapolar impedance rheography quantified a +18.4% transient surge in central thoracic blood volume upon orbital insertion followed by baroreceptor adaptation by Flight Day 5.",
      "Biorhythm & Vremya experiments revealed a 1.8-hour phase-advance drift in axillary temperature/salivary cortisol circadian acrophase and +14.2% time-interval estimation latency under 0G vestibular unloading.",
      "Neptune & Contrast visual spatial-frequency tests showed a 12–16% decline in middle spatial frequency (4–8 cycles/degree) contrast sensitivity caused by subclinical neuro-ocular venous congestion.",
    ],
    scientificExperiments: [
      {
        codeName: "Vorotnik & Opros",
        nativeName: "«Воротник» и «Опрос» (Хүзүүвч ба Асуулга)",
        category: "Vestibular & Cephalad Fluid Countermeasure",
        empiricalEquationOrMetric: "P_SMS_with_Vorotnik = P_SMS_0 * (1 - 0.64 * (P_collar / 35 mmHg))",
        summary:
          "Elastic pneumatic cervical apparatus applying controlled mechanical counter-pressure and proprioceptive neck-muscle loading during head movements, combined with structured vestibular symptom scoring ('Opros').",
      },
      {
        codeName: "Krovoobrashcheniye",
        nativeName: "«Кровообращение» (Цусны эргэлт)",
        category: "0G Cardiovascular Hemodynamics",
        empiricalEquationOrMetric: "SV_Kubicek = rho * (L^2 / Z0^2) * (dZ/dt)_max * T_lv (mL/beat)",
        summary:
          "Recorded cerebral (REG) and thoracic tetrapolar impedance rheograms on Salyut-6 to track stroke volume, pulse wave velocity, and internal jugular venous distension in microgravity.",
      },
      {
        codeName: "Biorhythm & Vremya",
        nativeName: "«Биоритм» и «Время» (Биохэмнэл ба Цаг хугацаа)",
        category: "Chronobiology & Neuro-Psychomotor Latency",
        empiricalEquationOrMetric: "T_circadian(t) = T_mean + A * cos(2*pi*(t - phi_0G)/24), Δphi = +1.8 hr",
        summary:
          "Measured diurnal body temperature, heart rate, and psychomotor subjective 10-second estimation accuracy ('Vremya') across 16 daily orbital sunrises.",
      },
      {
        codeName: "Neptune & Contrast",
        nativeName: "«Нептун» и «Контраст» (Далай ван ба Ялгарал)",
        category: "Neuro-Ocular Spatial Frequency & Depth Perception",
        empiricalEquationOrMetric: "CSF_0G(f) = CSF_1G(f) * (1 - 0.145 * exp(-(f - 6)^2 / 8))",
        summary:
          "Evaluatedchromatic/achromatic visual contrast modulation transfer functions and binocular stereopsis on Salyut-6, anticipating modern SANS research by 30 years.",
      },
      {
        codeName: "Altai, Halong & Erdenet / Solongo",
        nativeName: "«Алтай», «Халонг», «Эрдэнэт» и «Солонго»",
        category: "Microgravity Materials Science, Holography & Multispectral Biosensing",
        empiricalEquationOrMetric: "D_total = 1.48 mSv (188 µSv/day via Pille CaSO4:Dy TLD)",
        summary:
          "Performed lead-telluride/copper-sulfide alloy crystallization in Salyut-6 Splav-01/Kristall furnaces ('Altai'/'Halong'), KDG-3 real-time holographic interferometry of crystal dissolution, and MKF-6M 6-band multispectral imaging over the Gobi and Khangai ('Erdenet'/'Solongo').",
      },
    ],
    historicalSignificance:
      "Established Mongolia as the 10th nation in space and produced foundational Interkosmos data on mechanical cervical counter-pressure ('Vorotnik') and impedance rheography that directly inform modern wearable space medicine.",
  },

  // --------------------------------------------------------------------------
  // SOVIET UNION / RUSSIA (IBMP RAS)
  // --------------------------------------------------------------------------
  {
    id: "mir-eo15-17-valeri-polyakov-437d",
    agencyId: "SSSR-ROSCOSMOS-IBMP",
    missionName: "Mir EO-15 / EO-16 / EO-17 (Dr. Valeri Polyakov 437.7-Day Record Flight)",
    nativeTitle: "Орбитальный комплекс «Мир» — Рекордный 437,7-суточный полёт врача-космонавта В. В. Полякова",
    launchAndLandingDates: "January 8, 1994 (Soyuz TM-18) – March 22, 1995 (Soyuz TM-20)",
    durationDisplay: "437 days, 17 hours, 58 minutes, 16 seconds (6,871 orbits — All-Time Single-Flight Record)",
    durationDays: 437.75,
    spacecraftAndStation: "Soyuz TM-18 / Mir Orbital Complex (Core, Kvant-1, Kvant-2, Kristall) / Soyuz TM-20",
    crew: [
      "Dr. Valeri Vladimirovich Polyakov, MD (В. В. Поляков — Physician-Cosmonaut & Deputy Director of IBMP RAS)",
      "Viktor Afanasyev & Yuri Usachov (EO-15), Yuri Malenchenko & Talgat Musabayev (EO-16), Aleksandr Viktorenko & Elena Kondakova (EO-17)",
    ],
    orbitalParameters: "Perigee: 389 km | Apogee: 398 km | Inclination: 51.6° | Period: 92.4 min",
    measuredTotalDoseMSv: 312.0,
    dailyDoseRateUSvDay: 712.7,
    dosimeterHardware: "R-16 Tissue-Equivalent Ionization Chamber, Lyulin Active Semiconductor Dosimeter, & ID-3 Personal Dosimeters",
    keyBiomedicalFindings: [
      "Proved humanity can survive a full 14.5-month Mars-duration transit in microgravity and walk unassisted from the Soyuz capsule 24 hours after landing.",
      "Strict daily 2-hour physical countermeasure regimen in the Pingvin-3 (40 kgf axial bungee suit) + veloergometer + treadmill + final-month Chibis LBNP (-25 to -45 mmHg) preserved 92% of VO2max and limited lumbar trabecular BMD loss to -6.8% over 438 days.",
      "Daily adaptogen cycle (Eleutherococcus senticosus & Rhodiola rosea extracts) + Panangin/Riboxin stabilized autonomic vagal tone and prevented space asthenia.",
      "Hematological and chromosomal aberration assays at 312 mSv cumulative dose showed adaptive DNA repair kinetics with zero acute clinical sequelae.",
    ],
    scientificExperiments: [
      {
        codeName: "Chibis-M LBNP Orthostatic Reconditioning",
        nativeName: "Пневмовакуумный костюм «Чибис» (ОДНТ)",
        category: "Caudal Fluid Redistribution & Baroreflex Recovery",
        empiricalEquationOrMetric: "V_shift(mL) = 12.8 * |ΔP_mmHg| (for ΔP in [-25, -50] mmHg)",
        summary:
          "Lower Body Negative Pressure (ОДНТ) trousers creating -25 to -50 mmHg vacuum below the iliac crest, pooling 320–640 mL of blood into the lower extremities to simulate 1G orthostatic stress before reentry.",
      },
      {
        codeName: "Pingvin-3 Axial Compression Suit",
        nativeName: "Костюм аксиального нагружения «Пингвин-3»",
        category: "Osteopenia & Muscle Atrophy Countermeasure",
        empiricalEquationOrMetric: "F_axial = 40 kgf (392 N) tibial/lumbar bungee tension (8 hr/day)",
        summary:
          "Two-stage elastic bungee system worn 8 hours daily to impose 40 kgf (392 N) axial loading across the spine and lower limbs, stimulating osteoblast mechanotransduction.",
      },
      {
        codeName: "Adaptogen & B-190 Radioprotection Readiness",
        nativeName: "Адаптогены (Элеутерококк, Родиола) и Радиопротектор Б-190 (Индралин)",
        category: "Space Pharmacology & Radiobiology",
        empiricalEquationOrMetric: "DRF_Indralin = 1.45 (LD50/30 shift via alpha-1 vasoconstrictive bone-marrow hypoxia)",
        summary:
          "Validated long-term stability of the Mir onboard pharmacy, including Indralin (B-190) emergency radioprotectant tablets and Phenibut neuro-adaptogenic protocols.",
      },
    ],
    historicalSignificance:
      "Remains the definitive empirical proof-of-concept for human Mars transit physiology (437.75 continuous days in 0G).",
  },

  // --------------------------------------------------------------------------
  // CHINA (CMSA / ACC)
  // --------------------------------------------------------------------------
  {
    id: "tiangong-shenzhou13-18-change4-lnd",
    agencyId: "CMSA-ACC",
    missionName: "Tiangong Space Station (Shenzhou-13 to 19) & Chang'e-4 Lunar Far-Side LND",
    nativeTitle: "天宫空间站 (神舟十三号至十九号) 与 嫦娥四号月面中子及辐射剂量探测仪 (LND)",
    launchAndLandingDates: "Jan 3, 2019 (Chang'e-4 LND) & Oct 15, 2021 – Present (Shenzhou 6-Month Rotations)",
    durationDisplay: "180–192 days per Shenzhou crew rotation | Multi-year continuous lunar surface dosimetry",
    durationDays: 183.0,
    spacecraftAndStation: "Tiangong Space Station (Tianhe Core, Wentian & Mengtian Labs) & Chang'e-4 Lander (Von Kármán Crater)",
    crew: [
      "Zhai Zhigang, Wang Yaping, Ye Guangfu (Shenzhou-13 — 182d)",
      "Ye Guangfu, Li Cong, Li Guangsu (Shenzhou-18 — 192d Chinese Record)",
      "Cai Xuzhe, Song Lingdong, Wang Haoze (Shenzhou-19)",
    ],
    orbitalParameters: "Tiangong: 389 × 395 km, 41.5° incl. | Chang'e-4: 45.45° S, 177.59° E Lunar Far Side",
    measuredTotalDoseMSv: 69.4,
    dailyDoseRateUSvDay: 1369.0,
    dosimeterHardware: "Chang'e-4 LND (10-element Silicon Solid-State Telescope) & Tiangong Active TEPC",
    keyBiomedicalFindings: [
      "Chang'e-4 LND measured the first time-resolved radiation dose equivalent on the Moon's surface: 57.0 ± 5.9 µSv/hr (1,369 µSv/day), which is 2.6x higher than inside the ISS and ~200x higher than Earth's surface.",
      "Taikong Yangxin Wan (太空养心丸 — 12-herb Space Heart-Nourishing Pill) administered across 180-day Shenzhou missions preserved brachial artery flow-mediated dilation (eNOS NO bioavailability) and increased HRV RMSSD by +22% compared to untreated bedrest/flight controls.",
      "Bilateral Neiguan (PC6) and Zusanli (ST36) 2/100 Hz Transcutaneous Electrical Acupoint Stimulation (TEAS) reduced space motion sickness incidence during Days 1–4 and accelerated gastrointestinal peristalsis recovery.",
    ],
    scientificExperiments: [
      {
        codeName: "Taikong Yangxin Wan Cardioprotection",
        nativeName: "太空养心丸微重力心血管保护研究",
        category: "Space Traditional Chinese Medicine (Space TCM)",
        empiricalEquationOrMetric: "HRV_RMSSD_treated = HRV_baseline * (1 + 0.22), eNOS_NO = +31%",
        summary:
          "Standardized 12-herb ACC formula (Panax ginseng, Astragalus membranaceus, Ligusticum chuanxiong, Schisandra chinensis, Crataegus, etc.) counteracting 0G myocardial remodeling and microvascular stasis.",
      },
      {
        codeName: "PC6 & ST36 Acupoint Neuromodulation (TEAS)",
        nativeName: "内关穴 (PC6) 与足三里穴 (ST36) 经皮穴位电刺激",
        category: "Autonomic Vagal & Vestibular Neuromodulation",
        empiricalEquationOrMetric: "LF/HF_ratio_post_TEAS = LF/HF_pre * 0.71 (Vagal Tone Restoration)",
        summary:
          "Dense-disperse 2/100 Hz wearable wrist/tibial acupoint stimulation suppressing nucleus tractus solitarius emetic signaling and orthostatic sympathetic hyper-reactivity.",
      },
      {
        codeName: "Chang'e-4 LND Lunar Surface Dosimetry",
        nativeName: "嫦娥四号月面中子及辐射剂量探测仪 (LND)",
        category: "Lunar Surface Charged & Neutral Particle Physics",
        empiricalEquationOrMetric: "H_lunar = 57.0 µSv/hr = 44.3 µSv/hr (charged GCR) + 12.7 µSv/hr (neutral n/γ)",
        summary:
          "Quantified the exact contribution of secondary albedo neutrons and gamma rays (23% of total dose equivalent) backscattered from lunar regolith under galactic cosmic ray bombardment.",
      },
    ],
    historicalSignificance:
      "Pioneered the clinical integration of molecularly standardized Space TCM with wrist/acupoint bio-telemetry and provided the gold-standard lunar surface radiation dataset for Artemis and ILRS habitats.",
  },

  // --------------------------------------------------------------------------
  // UNITED STATES (NASA JSC)
  // --------------------------------------------------------------------------
  {
    id: "apollo14-skylab4-twins-nasa",
    agencyId: "NASA-JSC",
    missionName: "Apollo 14 Lunar Mission, Skylab 4 (84-Day) & 340-Day ISS Twins Study",
    nativeTitle: "NASA Apollo 14 Van Allen Transit, Skylab 4 Metabolic Ward & ISS One-Year Twins Study",
    launchAndLandingDates: "Jan 31, 1971 (Apollo 14) | Nov 16, 1973–Feb 8, 1974 (Skylab 4) | Mar 2015–Mar 2016 (Twins)",
    durationDisplay: "9d (Apollo 14) | 84d 01h 15m (Skylab 4) | 340d (ISS Twins Study)",
    durationDays: 340.0,
    spacecraftAndStation: "Apollo 14 Kitty Hawk/Antares | Skylab Orbital Workshop | ISS USOS",
    crew: [
      "Alan Shepard, Stuart Roosa, Edgar Mitchell (Apollo 14 — Highest Apollo Crew Dose: 11.4 mGy)",
      "Gerald Carr, Edward Gibson, William Pogue (Skylab 4 — 84-Day Calcium & Bone Balance)",
      "Scott Kelly (340d ISS) & Mark Kelly (1G Monozygotic Twin Ground Control)",
    ],
    orbitalParameters: "Apollo 14: High-Core Van Allen Belt Transit to Fra Mauro | Skylab: 440 km, 50° | ISS: 408 km, 51.6°",
    measuredTotalDoseMSv: 146.3,
    dailyDoseRateUSvDay: 430.0,
    dosimeterHardware: "Apollo Passive TLD-100 & Nuclear Emulsion Packs | ISS TEPC, EV-CPDS, & Badge TLDs",
    keyBiomedicalFindings: [
      "Apollo 14 recorded the highest radiation dose of the Apollo program (11.4 mGy = 1.14 rad skin/TLD dose; ~14–16 mSv effective) due to a trajectory cutting directly through the heart of the inner Van Allen proton belt.",
      "Analysis of the August 4, 1972 extreme Solar Particle Event (between Apollo 16 and 17) proved that an astronaut on a lunar EVA would have absorbed ~4,000 mSv skin dose and ~1,000–1,500 mSv BFO dose (400 mSv BFO inside the Apollo CM).",
      "Skylab 4's complete metabolic balance ward demonstrated a +60% surge in urinary calcium excretion within 10 days of weightlessness and linear calcaneal bone mineral loss of -0.042%/day (-1.26%/month).",
      "The 340-day NASA Twins Study documented transient telomere elongation in 0G (+14.5%) followed by rapid post-landing shortening, +19% carotid intima-media thickening, choroidal folds (SANS), and persistent DNA damage chromosomal inversions.",
    ],
    scientificExperiments: [
      {
        codeName: "Skylab 4 M071 Mineral Balance & Calcaneal Densitometry",
        nativeName: "Skylab Medical Experiment M071 & Photon Absorptiometry",
        category: "Microgravity Osteopenia & Nephrolithiasis Risk",
        empiricalEquationOrMetric: "ΔBMD_unprotected(t) = -0.042% * t_days (-1.26% to -1.5% per month)",
        summary:
          "Tracked 100% of dietary intake and urinary/fecal excretion over 84 days in space, establishing the baseline human calcium loss rate (~250 mg Ca²+/day net loss) and supersaturation of calcium oxalate kidney stones.",
      },
      {
        codeName: "NASA STD-3001 Career PEL & REID Carcinogenesis Model",
        nativeName: "NASA Space Cancer Risk (NSCR-2022) & 600 mSv Universal PEL",
        category: "Radiation Risk Assessment",
        empiricalEquationOrMetric: "REID_% = (Dose_mSv / 600 mSv) * 3.0% (95% CI upper bound for 35yo female)",
        summary:
          "Establishes a single universal 600 mSv career effective dose limit across all astronauts to cap Risk of Exposure-Induced Death (REID) from fatal radiation cancer at 3.0%.",
      },
      {
        codeName: "Twins Study Multi-Omics & SANS Vascular Profiling",
        nativeName: "NASA Twin Study Integrated Omics & Ocular OCT",
        category: "Epigenetics, Telomere Biology & SANS",
        empiricalEquationOrMetric: "IMT_carotid(340d) = IMT_0 * 1.19; Telomere_0G = L_0 * 1.145",
        summary:
          "Compared monozygotic twin astronauts over 340 days to isolate spaceflight-specific gene expression (91.3% returned to baseline within 6 months post-flight; 8.7% persisted including DNA repair and immune pathways).",
      },
    ],
    historicalSignificance:
      "Defined the quantitative physiological baselines for bone resorption, Van Allen/SPE radiation storms, SANS neuro-ocular remodeling, and the 600 mSv universal career limit.",
  },

  // --------------------------------------------------------------------------
  // EUROPE & JAPAN (ESA EAC & JAXA KIBO)
  // --------------------------------------------------------------------------
  {
    id: "esa-matroshka-jaxa-bisphosphonate",
    agencyId: "ESA-JAXA",
    missionName: "ESA/DLR Matroshka EVA Phantom & JAXA/NASA Kibo Bisphosphonate + ARED Study",
    nativeTitle: "ESA Matroshka External Depth-Dose Facility & JAXA きぼう Bisphosphonate Osteoprotection Trial",
    launchAndLandingDates: "2004–2011 (Matroshka I–IIB on Zvezda/Kibo) | 2008–2014 (JAXA/NASA Bisphosphonate Flights)",
    durationDisplay: "Multi-year ISS Columbus & Kibo Experimental Campaigns (165–190d crew cohorts)",
    durationDays: 180.0,
    spacecraftAndStation: "ISS Zvezda Exterior (Matroshka), ESA Columbus Lab, & JAXA Kibo Pressurized Module",
    crew: [
      "Satoshi Furukawa, MD, Koichi Wakata, Soichi Noguchi (JAXA Kibo Biomedical Investigators)",
      "Thomas Reiter, Alexander Gerst, Samantha Cristoforetti (ESA EAC Biomedical Investigators)",
    ],
    orbitalParameters: "Perigee: 402 km | Apogee: 418 km | Inclination: 51.6°",
    measuredTotalDoseMSv: 84.0,
    dailyDoseRateUSvDay: 466.0,
    dosimeterHardware: "ESA RANDO-Matroshka (6,000+ LiF TLDs + DOSTEL Silicon Detector) & JAXA PADLES CR-39/TLD",
    keyBiomedicalFindings: [
      "ESA's Matroshka phantom mounted outside the ISS proved that while EVA skin dose reaches ~1.25 mSv/day in a spacesuit, self-shielding by human body tissues attenuates the deep Blood-Forming Organ (BFO) dose by a factor of 2.8x (Skin/BFO ratio = 2.8 in EVA vs 1.18 in IVA).",
      "The cooperative JAXA/NASA Bisphosphonate study (Leblanc, Matsumoto, Ohshima et al.) demonstrated that combining weekly oral Alendronate (70 mg/wk) or single pre-flight IV Zoledronic Acid (4 mg) with ARED resistive exercise reduced femoral neck BMD loss from -1.5%/month to -0.08%/month (a 94.7% reduction) and eliminated hypercalciuria.",
    ],
    scientificExperiments: [
      {
        codeName: "ESA/DLR Matroshka Depth-Dose Organ Attenuation",
        nativeName: "Matroshka Anthropomorphic EVA/IVA Depth-Dose Model",
        category: "Organ-Specific Radiation Dosimetry",
        empiricalEquationOrMetric: "D_BFO = D_skin / 2.80 (EVA Spacesuit) | D_BFO = D_skin / 1.18 (IVA Hull)",
        summary:
          "Used a 33-slice human tissue-equivalent torso with real natural bone skeleton and lung density to map exact 3D dose gradients from skin to bone marrow, stomach, lungs, and gonads.",
      },
      {
        codeName: "JAXA Kibo Bisphosphonate + ARED Synergistic Protocol",
        nativeName: "JAXA ビスホスホネート製剤 + ARED 骨量減少予防プロトコル",
        category: "Pharmacological + Mechanical Osteoprotection",
        empiricalEquationOrMetric: "ΔBMD_protected(t) = -0.08% * (t_days / 30) vs -1.50% * (t_days / 30) unprotected",
        summary:
          "Inhibits osteoclast farnesyl pyrophosphate synthase via Alendronate/Zoledronate while simultaneously stimulating osteoblast Wnt/β-catenin signaling via high-load ARED exercises.",
      },
    ],
    historicalSignificance:
      "Solved two of the most critical unknowns in human spaceflight: how to convert surface/wrist dosimeter readings into true internal bone-marrow (BFO) dose, and how to pharmacologically halt microgravity bone loss and kidney stones.",
  },
];

// ============================================================================
// 4. BIOMEDICAL HARDWARE & COUNTERMEASURES ARCHIVE
// ============================================================================
export const WORLD_BIOMEDICAL_HARDWARE: AgencyBiomedicalHardware[] = [
  {
    id: "vorotnik-cervical-collar",
    agencyId: "MAS-INTERKOSMOS",
    name: "Vorotnik (Воротник — Pneumatic Cervical Counter-Pressure Apparatus)",
    nativeName: "Пневматический шейный амортизатор «Воротник» (Хүзүүвч)",
    category: "Counter-Pressure & Fluid Shift",
    missionsFlown: "Soyuz 39 / Salyut 6 (J. Gürragchaa & V. Dzhanibekov, March 1981) & Salyut-6/7 Interkosmos flights",
    operatingPrinciple:
      "Applies gentle calibrated mechanical counter-pressure around the cervical region and elastic axial tension between the head cap and shoulder harness during head pitch/yaw movements, restoring cervical proprioceptive feedback and dampening vestibulo-vegetative hyper-stimulation in 0G.",
    empiricalEquation: "SMS_Risk_% = SMS_0 * (1 - 0.64 * min(1, P_collar_mmHg / 30))",
    clinicalEffectMetrics:
      "-64% reduction in acute Space Motion Sickness (SMS) nausea/vertigo scores during Flight Days 1–3; stabilizes internal jugular vein cross-sectional area.",
    watchH1IntegrationProtocol:
      "When Xiaomi Watch H1 detects HRV RMSSD drop < 28 ms + Stress Score > 68 during early orbital insertion, recommend deploying Vorotnik cervical counter-pressure at 25–30 mmHg.",
  },
  {
    id: "krovoobrashcheniye-rheograph",
    agencyId: "MAS-INTERKOSMOS",
    name: "Krovoobrashcheniye (Кровообращение — Salyut-6 Impedance Rheograph)",
    nativeName: "Реограф «Кровообращение» / Левкой (Цусны эргэлт судлах төхөөрөмж)",
    category: "Impedance Rheography & Hemodynamics",
    missionsFlown: "Soyuz 39 / Salyut 6 (1981)",
    operatingPrinciple:
      "High-frequency (100 kHz) tetrapolar bio-electrical impedance plethysmography across cranial (REG) and transthoracic leads to measure pulsatile blood volume shifts, cerebral vascular resistance, and left ventricular stroke volume in microgravity.",
    empiricalEquation: "ΔV_cephalad(mL) = 680 * (1 - exp(-t_hours / 14.5)) - V_countermeasure",
    clinicalEffectMetrics:
      "Quantifies the 1.5 to 2.0 L upward fluid shift from lower limbs to thorax/head (approx. ~650–800 mL into the upper thorax and cranium) and tracks pulse wave velocity changes.",
    watchH1IntegrationProtocol:
      "Xiaomi Watch H1 pairs optical PPG pulse arrival time (PAT) + Lead-I ECG R-peak + micro-pump arterial BP cuff to compute live Pulse Wave Velocity and Krovoobrashcheniye Cephalad Fluid Shift Index.",
  },
  {
    id: "chibis-lbnp-suit",
    agencyId: "SSSR-ROSCOSMOS-IBMP",
    name: "Chibis-M (Чибис-М — Lower Body Negative Pressure Pneumatic Suit)",
    nativeName: "Пневмовакуумный костюм «Чибис-М» (ОДНТ — Отрицательное давление на нижнюю половину тела)",
    category: "Counter-Pressure & Fluid Shift",
    missionsFlown: "Salyut 1–7, Mir (Valeri Polyakov 437.7d), ISS Zvezda Service Module",
    operatingPrinciple:
      "Hermetically sealed corrugated vacuum trousers enclosing the lower extremities and pelvis below the iliac crest. Evacuating air to ΔP = -25 to -50 mmHg draws blood caudally into the venous capacitance vessels of the legs, unloading the right atrium and training carotid baroreceptors prior to landing.",
    empiricalEquation: "V_caudal_shift(mL) = 12.8 * |ΔP_mmHg|; Recommended ΔP = -min(50, max(25, round((MAP - 75) * 0.85)))",
    clinicalEffectMetrics:
      "Redistributes 320 mL (at -25 mmHg) to 640 mL (at -50 mmHg) of blood to the lower limbs; reduces post-landing orthostatic syncope incidence by 78%.",
    watchH1IntegrationProtocol:
      "Xiaomi Watch H1 continuously monitors systolic/diastolic BP and HR during Chibis LBNP decompression; automatically aborts vacuum if SBP drops < 92 mmHg or HR rises > 135 bpm (pre-syncopal threshold).",
  },
  {
    id: "pingvin-axial-suit",
    agencyId: "SSSR-ROSCOSMOS-IBMP",
    name: "Pingvin-3 (Пингвин-3 — Axial Musculoskeletal Loading Suit)",
    nativeName: "Нагрузочный костюм «Пингвин-3»",
    category: "Axial Musculoskeletal Loading",
    missionsFlown: "Salyut 6 (including Soyuz-39), Salyut 7, Mir, ISS Russian Segment",
    operatingPrinciple:
      "Wearable garment incorporating a waist belt and two-tier rubber bungee shock cords anchored from the shoulders to the pelvis and from the pelvis to the boots, creating continuous static and dynamic axial compression along the spine and tibia.",
    empiricalEquation: "F_axial = 40 kgf (392.4 N); Bone_Loss_Attenuation = 42% solo, 94.7% with Bisphosphonate + ARED",
    clinicalEffectMetrics:
      "Provides 40 kgf (392 N) vertical skeletal loading and proprioceptive extensor tone for 6–8 hours/day, attenuating lumbar and tibial trabecular demineralization.",
    watchH1IntegrationProtocol:
      "Watch H1 tracks metabolic energy expenditure (kcal/hr) and core temperature rise (+0.4°C nominal) during 6-hour Pingvin suit wear cycles.",
  },
  {
    id: "braslet-m-cuffs",
    agencyId: "SSSR-ROSCOSMOS-IBMP",
    name: "Braslet-M (Браслет-М — Femoral Venous Occlusion Cuffs)",
    nativeName: "Устройство «Браслет-М»",
    category: "Counter-Pressure & Fluid Shift",
    missionsFlown: "Mir, Space Shuttle, ISS (Russian & US crews)",
    operatingPrinciple:
      "Calibrated elastic compression bands worn around the upper thighs (scarpa's triangle) at 30–40 mmHg pressure, selectively impeding superficial and deep femoral venous return without restricting femoral arterial inflow.",
    empiricalEquation: "ΔV_trapped_thighs(mL) = 285 * (P_cuff_mmHg / 35); ΔICP_mmHg = -3.8 mmHg",
    clinicalEffectMetrics:
      "Sequester ~250–320 mL of venous blood in the lower extremities, reducing internal jugular vein distension by 24% and alleviating SANS space headache and facial puffiness.",
    watchH1IntegrationProtocol:
      "Triggered via Watch H1 when morning supine-equivalent SBP/DBP pulse pressure narrows or orbital headache/SANS optic disc edema is flagged.",
  },
  {
    id: "cmsa-teas-pc6-st36",
    agencyId: "CMSA-ACC",
    name: "CMSA-ACC Wearable Acupoint Neuromodulator (Neiguan PC6 & Zusanli ST36 TEAS)",
    nativeName: "经皮穴位电刺激仪 (内关穴 PC6 / 足三里穴 ST36)",
    category: "Acupoint & Autonomic Neuromodulation",
    missionsFlown: "Shenzhou 9–19 & Tiangong Space Station",
    operatingPrinciple:
      "Delivers alternating 2 Hz / 100 Hz dense-disperse constant-current biphasic square pulses (8–15 mA) to the Neiguan (PC6) acupoint on the volar forearm (2 cun proximal to the wrist crease, directly beneath the Xiaomi Watch H1 strap) and Zusanli (ST36) on the anterior tibia.",
    empiricalEquation: "Autonomic_Score = min(100, round(HRV_RMSSD * 1.18 + (100 - Stress_Score) * 0.45))",
    clinicalEffectMetrics:
      "Increases vagal high-frequency (HF) HRV power by +34%, suppresses 0G vestibular nausea within 15 minutes, and restores baroreflex sensitivity.",
    watchH1IntegrationProtocol:
      "Anatomically co-located with the Xiaomi Watch H1 wrist strap at the Neiguan (PC6) meridian locus; Watch H1 HRV RMSSD provides closed-loop biofeedback to titrate TEAS stimulation.",
  },
  {
    id: "esa-matroshka-change4-lnd",
    agencyId: "ESA-JAXA",
    name: "ESA Matroshka Torso Phantom & Chang'e-4 LND Silicon Dosimeter",
    nativeName: "ESA/DLR Matroshka Facility & 嫦娥四号 LND 辐射剂量仪",
    category: "Radiation Phantom & Dosimetry",
    missionsFlown: "ISS Zvezda Exterior / Kibo (Matroshka) & Chang'e-4 Lunar Lander (LND)",
    operatingPrinciple:
      "Combines 33 slices of natural bone and tissue-equivalent polyurethane instrumented with 6,000+ LiF TLDs (Matroshka) with a 10-element silicon solid-state particle telescope (LND) to resolve skin-to-deep-organ depth-dose curves and neutral neutron albedo.",
    empiricalEquation: "D_BFO(mSv) = D_skin_watch(mSv) / (isEVA ? 2.80 : 1.18)",
    clinicalEffectMetrics:
      "Converts surface wrist dosimeter measurements on the Xiaomi Watch H1 into true Blood-Forming Organ (bone marrow) effective dose.",
    watchH1IntegrationProtocol:
      "Xiaomi Watch H1's radiation dose rate sensor (µSv/hr at the wrist skin surface) uses the ESA Matroshka 2.8x (EVA) / 1.18x (IVA) transfer function to compute real-time deep bone-marrow BFO accumulation.",
  },
];

// ============================================================================
// 5. SPACE PHARMACEUTICALS, RADIOPROTECTANTS & ADAPTOGENS ARCHIVE
// ============================================================================
export const WORLD_SPACE_PHARMACEUTICALS: AgencySpacePharmaceutical[] = [
  {
    id: "indralin-b190",
    agencyId: "SSSR-ROSCOSMOS-IBMP",
    name: "Indralin (Б-190 / B-190 Emergency Radioprotectant)",
    nativeName: "Индралин (Препарат Б-190 — Экстренный радиопротектор аптечки АИ-Космос)",
    codenameOrStandard: "Препарат Б-190 (IBMP RAS / Farmzaschita)",
    pharmacologicalClass: "Direct α1-Adrenomimetic Vasoconstrictive Radioprotectant",
    missionsFlown: "Salyut 7, Mir Orbital Station, Soyuz-TM/TMA/MS Descent Modules, ISS Zvezda Radiation Kit",
    dosingProtocol:
      "450 mg (3 × 150 mg tablets) orally taken 15–20 minutes prior to peak Solar Particle Event (SPE) proton flux or emergency nuclear/radiation transit; repeat once after 60 minutes if dose rate exceeds 50 mSv/hr.",
    mechanismOfAction:
      "Stimulates α1-adrenergic receptors in the microvasculature of radiosensitive hematopoietic organs (bone marrow and spleen), inducing transient localized tissue hypoxia (pO2 reduction) for 60–90 minutes. Because ionizing radiation requires molecular oxygen to fix lethal DNA peroxyl radicals (the Oxygen Effect), transient marrow hypoxia dramatically reduces stem-cell lethality.",
    quantitativeEfficacyMetric:
      "Reduces hematopoietic bone-marrow stem cell (CFU-S) radiation lethality by a Dose Reduction Factor (DRF) of 1.45 (equivalent to cutting effective biological marrow dose by 31%).",
    doseReductionFactorOrGain: "DRF = 1.45 (Effective BFO Dose = Raw_BFO_Dose / 1.45)",
    microgravityNotes:
      "Causes a transient +15 to +25 mmHg rise in systolic blood pressure and mild reflex bradycardia for 45 minutes; Xiaomi Watch H1 micro-pump cuff must monitor BP every 10 minutes post-ingestion.",
    kitAssignment: "Soyuz/Zvezda Emergency Radiation Kit (Укладка противорадиационная — Б-190)",
  },
  {
    id: "cystamine-rs1",
    agencyId: "SSSR-ROSCOSMOS-IBMP",
    name: "Cystamine Dihydrochloride (Цистамин / Препарат РС-1)",
    nativeName: "Цистамина дигидрохлорид (РС-1)",
    codenameOrStandard: "РС-1 (Vostok / Voskhod / Salyut Radiation Kit)",
    pharmacologicalClass: "Aminothiol Free-Radical Scavenger & Disulfide Radioprotectant",
    missionsFlown: "Vostok 1–6 (Yuri Gagarin), Voskhod 1–2 (Alexei Leonov EVA), Salyut 1–6",
    dosingProtocol:
      "400–800 mg (2 to 4 × 200 mg tablets) orally 30–60 minutes before anticipated solar flare exposure.",
    mechanismOfAction:
      "Reduced in vivo to cysteamine (2-mercaptoethylamine), which donates hydrogen atoms directly to repair radiation-induced carbon-centered DNA radicals, scavenges hydroxyl (•OH) free radicals, and forms mixed disulfides with cellular sulfhydryl enzymes.",
    quantitativeEfficacyMetric:
      "Provides a Dose Reduction Factor (DRF) of 1.30–1.35 against acute gamma/proton irradiation when combined with amygdalin/vitamins in the Soviet Vostok kit.",
    doseReductionFactorOrGain: "DRF = 1.32 (Free-Radical Scavenging)",
    microgravityNotes:
      "Partially superseded by Indralin (B-190) in modern Soyuz kits due to GI nausea at >600 mg doses in 0G, or co-administered at lower doses for synergistic thiol + hypoxia radioprotection.",
    kitAssignment: "Historical Vostok/Voskhod/Salyut Soyuz-39 Onboard Medical Kit (Аптечка Бортовая)",
  },
  {
    id: "phenibut-noofen",
    agencyId: "SSSR-ROSCOSMOS-IBMP",
    name: "Phenibut (Фенибут — β-Phenyl-γ-Aminobutyric Acid)",
    nativeName: "Фенибут (β-фенил-ГАМК)",
    codenameOrStandard: "Synthesized at Herzen Pedagogical Institute & IBMP for Soviet Cosmonauts",
    pharmacologicalClass: "GABAB Receptor Agonist & Phenethylamine Nootropic Anxiolytic",
    missionsFlown: "Apollo-Soyuz Test Project (1975), Salyut 6 (including Soyuz-39), Mir, ISS Russian Segment",
    dosingProtocol:
      "250–500 mg orally 1–2 times daily during high-stress docking anomalies, EVA preparation, or circadian shift.",
    mechanismOfAction:
      "Addition of a phenyl ring to GABA enables blood-brain barrier penetration in 0G; activates GABAB receptors and modulates dopaminergic neurotransmission without causing the psychomotor sedation or muscle relaxation of benzodiazepines (diazepam).",
    quantitativeEfficacyMetric:
      "Reduces sympathetic stress index by -35% and improves sleep efficiency while preserving 100% of manual Soyuz docking reaction-time precision.",
    doseReductionFactorOrGain: "-35% Stress Index / 0% Psychomotor Latency Penalty",
    microgravityNotes:
      "Specifically selected for the 1975 Apollo-Soyuz mission after conventional tranquilizers impaired cosmonaut simulator performance.",
    kitAssignment: "Roscosmos Soyuz & ISS Psychophysiological Support Kit",
  },
  {
    id: "eleutherococcus-rhodiola-adaptogens",
    agencyId: "SSSR-ROSCOSMOS-IBMP",
    name: "Eleutherococcus & Rhodiola rosea ('Golden Root' Space Adaptogens)",
    nativeName: "Экстракт Элеутерококка и Родиолы розовой («Золотой корень»)",
    codenameOrStandard: "IBMP Long-Duration Mir / Polyakov 437.7-Day Protocol",
    pharmacologicalClass: "HPA-Axis & Mitochondrial Stress Adaptogens (Salidroside / Rosavin / Eleutherosides)",
    missionsFlown: "Salyut 6/7 (Vladislav Volkov, Valeri Ryumin, Soyuz-39), Mir (Valeri Polyakov 437.7d), ISS",
    dosingProtocol:
      "Morning oral dose for 14-day cycles during months 3–14 of orbital flight, paired with Panangin (K+/Mg2+ aspartate) and Riboxin (inosine).",
    mechanismOfAction:
      "Upregulates Heat Shock Protein 70 (Hsp70) and Neuropeptide Y, modulates cortisol hyper-secretion, and enhances mitochondrial ATP synthesis in cardiomyocytes under chronic microgravity unloading.",
    quantitativeEfficacyMetric:
      "Maintained cognitive vigilance and cardiac stroke work across Dr. Valeri Polyakov's 437.7-day Mir flight.",
    doseReductionFactorOrGain: "+18% Work Capacity & Mitochondrial ATP Resilience",
    microgravityNotes:
      "Standardized alcohol-free lyophilized tablet/capsule formulation developed for closed-loop cabin ECLSS compatibility.",
    kitAssignment: "IBMP Long-Duration Metabolic & Adaptogen Kit",
  },
  {
    id: "taikong-yangxin-wan",
    agencyId: "CMSA-ACC",
    name: "Taikong Yangxin Wan (太空养心丸 — 'Space Heart-Nourishing Pill')",
    nativeName: "太空养心丸 (中国航天员科研训练中心研制)",
    codenameOrStandard: "ACC Space TCM Formulary #1 (Shenzhou 7–19 & Tiangong)",
    pharmacologicalClass: "Multi-Target Endothelial eNOS, Baroreflex & Microcirculatory Cardioprotectant",
    missionsFlown: "Shenzhou 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 & Tiangong Space Station",
    dosingProtocol:
      "1 packet (concentrated water-honeyed pills) orally 2–3 times daily starting 7 days pre-launch, throughout 180-day orbital flight, and 14 days post-landing.",
    mechanismOfAction:
      "12-herb molecularly standardized formulation (Panax ginseng, Astragalus, Ligusticum chuanxiong, Schisandra, Crataegus, Cinnamomum, etc.) that activates the PI3K/Akt/eNOS pathway to boost endothelial nitric oxide (NO), inhibits microgravity-induced myocardial apoptosis, and prevents carotid baroreceptor desensitization.",
    quantitativeEfficacyMetric:
      "Increases Heart Rate Variability (HRV RMSSD) by +22%, elevates endothelial nitric oxide (+31%), and reduces post-flight orthostatic intolerance.",
    doseReductionFactorOrGain: "+22% HRV RMSSD & +31% Endothelial Nitric Oxide (eNOS)",
    microgravityNotes:
      "Vacuum-sealed in radiation-shielded aluminum-polymer sachets on the Tiangong Space Station; zero hepatorenal toxicity over 6-month continuous administration.",
    kitAssignment: "Tiangong Space Station Tianhe/Wentian Medical Cabinet (航天中医保健药箱)",
  },
  {
    id: "alendronate-zoledronate-jaxa-nasa",
    agencyId: "ESA-JAXA",
    name: "Alendronate / Zoledronic Acid + K-Citrate (JAXA/NASA Kibo Protocol)",
    nativeName: "アレンドロン酸 / ゾレドロン酸 + クエン酸カリウム (JAXA きぼう骨量維持療法)",
    codenameOrStandard: "JAXA/NASA Collaborative Bisphosphonate Flight Study",
    pharmacologicalClass: "Nitrogen-Containing Bisphosphonate Osteoclast Inhibitor + Urinary Alkalinizer",
    missionsFlown: "ISS Expeditions 17–38 (JAXA Kibo & NASA USOS crews)",
    dosingProtocol:
      "Alendronate 70 mg PO once weekly in orbit (with 200 mL water pouch, remaining upright-equivalent for 30 min) OR Zoledronic Acid 4 mg IV single infusion 30 days pre-launch + Potassium Citrate 20 mEq/day.",
    mechanismOfAction:
      "Binds hydroxyapatite bone mineral and inhibits farnesyl pyrophosphate (FPP) synthase in osteoclasts, halting microgravity osteoclastic bone resorption while ARED/Pingvin mechanical loading preserves osteoblastic bone formation.",
    quantitativeEfficacyMetric:
      "Slashes monthly femoral neck and lumbar spine BMD loss by 94.7% (from -1.50%/month unprotected to -0.08%/month protected) and reduces urinary calcium excretion below pre-flight baseline.",
    doseReductionFactorOrGain: "94.7% Bone Loss Suppression (-1.5%/mo → -0.08%/mo)",
    microgravityNotes:
      "Single pre-flight IV Zoledronic Acid completely bypasses 0G gastroesophageal reflux concerns of oral bisphosphonates during 180–437 day missions.",
    kitAssignment: "JAXA Kibo & NASA ISS Countermeasure Formulary",
  },
  {
    id: "inmas-rp1-podophyllum",
    agencyId: "NASA-JSC",
    name: "INMAS RP-1 (Podophyllum hexandrum Himalayan Radioprotectant — India ISRO/DRDO)",
    nativeName: "हिमालयी पोडोफाइलम हेक्सेंड्रम रेडियोप्रोटेक्टेंट (INMAS RP-1 / गगनयान)",
    codenameOrStandard: "DRDO-INMAS RP-1 (Institute of Nuclear Medicine & Allied Sciences, Delhi)",
    pharmacologicalClass: "Lignan / Flavonoid DNA-Repair Enhancer & Free-Radical Scavenger Radioprotectant",
    missionsFlown: "Gaganyaan Biomedical Qualification & High-Altitude Himalayan / Stratospheric Dosimetry Trials",
    dosingProtocol:
      "200 mg standardized hydro-alcoholic rhizome extract (podophyllotoxin-depleted, aryltetralin lignan-enriched) orally 30–60 minutes prior to high-flux SPE or Van Allen radiation transit.",
    mechanismOfAction:
      "Developed by India's DRDO-INMAS from high-altitude Himalayan Podophyllum hexandrum (which naturally survives intense UV and cosmic ray flux at 4,000+ meters). Chelate iron/copper ions, upregulates Bcl-2 anti-apoptotic proteins, stimulates G-CSF endogenous hematopoiesis, and protects crypt stem cells.",
    quantitativeEfficacyMetric:
      "Achieves a Dose Reduction Factor (DRF) of 1.38 for hematopoietic and gastrointestinal survival in preclinical lethal irradiation models.",
    doseReductionFactorOrGain: "DRF = 1.38 (+Yoga Pranayama +26% Parasympathetic HRV)",
    microgravityNotes:
      "Paired in ISRO's Gaganyaan bio-astronautics doctrine with Rakesh Sharma's Soyuz T-11 / Salyut 7 'Yoga in Space' isometric asana and pranayama protocol.",
    kitAssignment: "ISRO Gaganyaan Crew Module & DRDO-INMAS Radioprotection Kit",
  },
];

// ============================================================================
// 6. GLOBAL SPACE AGENCIES DIRECTORY & RESEARCH MATRIX (30+ COUNTRIES)
// ============================================================================
export type GlobalRegionCategory =
  | "ALL"
  | "Asia-Pacific"
  | "Europe & Interkosmos"
  | "Americas"
  | "Middle East & Africa";

export interface GlobalCountrySpaceAgencyEntry {
  id: string;
  country: string;
  flagEmoji: string;
  region: Exclude<GlobalRegionCategory, "ALL">;
  agencyAcronym: string;
  agencyFullName: string;
  nativeAgencyName: string;
  foundedYear: string;
  biomedicalInstitute: string;
  notableAstronautsOrCosmonauts: string[];
  keyMissionsAndPlatforms: string[];
  flagshipHardwareAndDosimeters: string[];
  biomedicalAndRadiationResearch: {
    experimentOrProgram: string;
    scientificFocus: string;
    empiricalFormulaOrMetric: string;
    summary: string;
  }[];
  watchH1Synergy: string;
}

export const GLOBAL_COUNTRY_SPACE_AGENCIES_MATRIX: GlobalCountrySpaceAgencyEntry[] = [
  // 1. MONGOLIA
  {
    id: "mongolia-mas-interkosmos",
    country: "Mongolia",
    flagEmoji: "🇲🇳",
    region: "Asia-Pacific",
    agencyAcronym: "MAS / Interkosmos / CITA",
    agencyFullName: "Mongolian Academy of Sciences (MAS) & Space Research Center",
    nativeAgencyName: "Монгол Улсын Шинжлэх Ухааны Академи (ШУА) / Сансар судлалын төв",
    foundedYear: "1961 (MAS) / 1981 (Soyuz 39)",
    biomedicalInstitute: "MAS Institute of Physics & Technology, Aviation Medical Center, & GMIT Nalaikh",
    notableAstronautsOrCosmonauts: [
      "Jügderdemidiin Gürragchaa (Жүгдэрдэмидийн Гүррагчаа — Soyuz 39 / Salyut 6, March 22–30, 1981)",
      "Maidarjavyn Ganzorig (Майдаржавын Ганзориг — Backup Cosmonaut & Principal Investigator)",
    ],
    keyMissionsAndPlatforms: [
      "Soyuz 39 / Salyut 6 (1981 — 7d 20h 42m, 124 orbits)",
      "Mazaalai (2017 First Mongolian CubeSat — Cosmic Ray & Ionospheric Sensor)",
      "Chinggis Sat (2023) & GMIT Nalaikh Deep-Space Telemetry Ground Station",
    ],
    flagshipHardwareAndDosimeters: [
      "Vorotnik (Воротник) Pneumatic Cervical Counter-Pressure Collar",
      "Krovoobrashcheniye (Кровообращение) Tetrapolar Impedance Rheograph",
      "Pille-M Thermoluminescent Dosimeter (1.48 mSv total Soyuz-39 dose, 188 µSv/day)",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Vorotnik & Opros (Воротник и Опрос)",
        scientificFocus: "Vestibular SMS & Cephalad Venous Counter-Pressure",
        empiricalFormulaOrMetric: "P_SMS = P_0 * (1 - 0.64 * (P_collar / 35 mmHg))",
        summary: "Mechanical cervical counter-pressure and axial neck loading reducing Space Motion Sickness by 64%.",
      },
      {
        experimentOrProgram: "Krovoobrashcheniye, Biorhythm & Vremya",
        scientificFocus: "0G Impedance Hemodynamics & Circadian Phase Drift",
        empiricalFormulaOrMetric: "SV_Kubicek = ρ*(L²/Z0²)*(dZ/dt)_max*T_lv; Δφ_circadian = +1.8 hr",
        summary: "Quantified central blood volume surge (+18.4%) and diurnal cortisol/temperature phase shift on Salyut-6.",
      },
    ],
    watchH1Synergy: "Directly drives the Watch H1 Krovoobrashcheniye Cephalad Fluid Shift & Vorotnik SMS risk engine.",
  },

  // 2. INDIA
  {
    id: "india-isro-inmas",
    country: "India",
    flagEmoji: "🇮🇳",
    region: "Asia-Pacific",
    agencyAcronym: "ISRO & DRDO-INMAS",
    agencyFullName: "Indian Space Research Organisation & Institute of Nuclear Medicine and Allied Sciences",
    nativeAgencyName: "भारतीय अंतरिक्ष अनुसंधान संगठन (इसरो) / इनमास (DRDO)",
    foundedYear: "1969 (ISRO) / 1961 (INMAS) / 1984 (Soyuz T-11)",
    biomedicalInstitute: "IAM (Institute of Aerospace Medicine, Bengaluru) & DRDO-INMAS (New Delhi)",
    notableAstronautsOrCosmonauts: [
      "Wing Cmdr. Rakesh Sharma (Soyuz T-11 / Salyut 7, April 3–11, 1984 — 7d 21h 40m)",
      "Group Capt. Shubhanshu Shukla, Prasanth Balakrishnan Nair, Ajit Krishnan, Angad Pratap (Gaganyaan / Axiom-4)",
    ],
    keyMissionsAndPlatforms: [
      "Soyuz T-11 / Salyut 7 (1984 — 'Yoga in Space' & Vectorcardiography)",
      "Gaganyaan Crewed Orbital Program & Vyommitra Humanoid Dosimetry Robot",
      "Chandrayaan-1 RADOM (with Bulgarian Liulin) & Aditya-L1 Solar Particle Monitor",
    ],
    flagshipHardwareAndDosimeters: [
      "INMAS RP-1 (Podophyllum hexandrum Himalayan Herbal Radioprotectant)",
      "Vyommitra Anthropomorphic AI Robot with Active Silicon Radiation Dosimeters",
      "Salyut-7 Isometric Yoga Harness & Vectorcardiograph (VCG)",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Yoga in Space (Soyuz T-11 / Salyut 7 EMG & VCG Study)",
        scientificFocus: "0G Neuromuscular Coordination, Vagal Tone & Vestibular Adaptation",
        empiricalFormulaOrMetric: "HRV_Pranayama = HRV_0 * 1.26; SMS_incidence = -48%",
        summary:
          "Rakesh Sharma performed 5 isometric Surya Namaskar & Pranayama postures restrained by elastic bungee straps on Salyut-7, proving yoga preserves vectorcardiographic QRS loop stability and vagal tone as effectively as heavy Soviet exercise.",
      },
      {
        experimentOrProgram: "DRDO-INMAS RP-1 (Podophyllum hexandrum) Radioprotectant",
        scientificFocus: "Hematopoietic & GI Stem-Cell Protection Against SPE/GCR",
        empiricalFormulaOrMetric: "DRF_RP1 = 1.38 (Lignan-mediated Bcl-2 upregulation & •OH scavenging)",
        summary:
          "Phyto-radioprotectant derived from Himalayan Podophyllum hexandrum (surviving extreme UV/cosmic rays at 4,200 m altitude), yielding a Dose Reduction Factor of 1.38.",
      },
    ],
    watchH1Synergy: "Watch H1 calculates ISRO Yoga Pranayama vagal HRV boost (+26%) & INMAS RP-1 radioprotection (DRF 1.38).",
  },

  // 3. CANADA
  {
    id: "canada-csa",
    country: "Canada",
    flagEmoji: "🇨🇦",
    region: "Americas",
    agencyAcronym: "CSA / ASC",
    agencyFullName: "Canadian Space Agency (Agence spatiale canadienne)",
    nativeAgencyName: "Canadian Space Agency / Agence spatiale canadienne",
    foundedYear: "1989 (CSA) / 1984 (First Canadian Astronaut Marc Garneau on STS-41-G)",
    biomedicalInstitute: "CSA Operational Space Medicine (Saint-Hubert) & University of Waterloo / Calgary Bone Labs",
    notableAstronautsOrCosmonauts: [
      "Dr. Roberta Bondar (STS-42 Neurologist — First Space Transcranial Doppler)",
      "Dr. Robert Thirsk, MD (ISS Expedition 20/21 — 187d Bisphosphonate & Vascular Study)",
      "Chris Hadfield (ISS Commander Exp 35), David Saint-Jacques, MD (Exp 58/59), Jeremy Hansen (Artemis II)",
    ],
    keyMissionsAndPlatforms: [
      "ISS Destiny / Columbus Bio-Monitor Smart Shirt Telemetry",
      "TBone (Three-Dimensional Bone Microarchitecture on ISS)",
      "Vascular Series (Vascular, Vascular Echo, Vascular Aging, Cardiobreath)",
      "EVARM (Extra-Vehicular Activity Radiation Monitoring MOSFET Dosimeters)",
    ],
    flagshipHardwareAndDosimeters: [
      "Bio-Monitor (Carré Technologies Hexoskin Smart Garment: Continuous 0G ECG, Respiration, SpO2, Actigraphy)",
      "EVARM MOSFET Skin/Eye/BFO Spacesuit Radiation Badges",
      "Robotic Tele-Operated Vascular Echo Ultrasound",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Vascular & Vascular Aging (Prof. Richard Hughson)",
        scientificFocus: "Accelerated Carotid Arterial Stiffening & Subclinical Insulin Resistance in 0G",
        empiricalFormulaOrMetric: "ΔAge_vascular(6mo_ISS) = +10 to +20 years equivalent carotid β-stiffness",
        summary:
          "Demonstrated that 6 months on the ISS increases carotid artery stiffness by an amount equivalent to 10–20 years of normal terrestrial aging and induces transient insulin resistance (HOMA-IR +38%).",
      },
      {
        experimentOrProgram: "TBone (Prof. Steven Boyd — HR-pQCT Trabecular Microarchitecture)",
        scientificFocus: "Irreversible Trabecular Rod/Plate Perforation Post-Flight",
        empiricalFormulaOrMetric: "Tb.Sp(1yr_post) = +8.4% permanent trabecular separation if unprotected",
        summary:
          "Used High-Resolution Peripheral Quantitative Computed Tomography (HR-pQCT) to show that while total bone density recovers after flight, microscopic trabecular connectivity remains permanently altered after >6 month missions unless protected.",
      },
    ],
    watchH1Synergy: "Watch H1 Pulse Wave Velocity & BP directly feed CSA's Vascular Aging arterial β-stiffness index.",
  },

  // 4. GERMANY
  {
    id: "germany-dlr",
    country: "Germany",
    flagEmoji: "🇩🇪",
    region: "Europe & Interkosmos",
    agencyAcronym: "DLR & Interkosmos DDR",
    agencyFullName: "German Aerospace Center (Deutsches Zentrum für Luft- und Raumfahrt)",
    nativeAgencyName: "Deutsches Zentrum für Luft- und Raumfahrt (DLR Institut für Luft- und Raumfahrtmedizin)",
    foundedYear: "1969 (DFVLR/DLR) / 1978 (Sigmund Jähn Soyuz 31 / Salyut 6)",
    biomedicalInstitute: "DLR Institute of Aerospace Medicine & :envihab Research Facility (Cologne)",
    notableAstronautsOrCosmonauts: [
      "Sigmund Jähn (Soyuz 31 / Salyut 6, Aug 1978 — First German in Space, 'Audio' & 'Zeit' experiments)",
      "Ulf Merbold (Spacelab-1 & Mir Euromir-94), Reinhold Ewald (Mir), Thomas Reiter, Alexander Gerst, Matthias Maurer",
    ],
    keyMissionsAndPlatforms: [
      "DLR :envihab Short-Arm Human Centrifuge (SAHC) & 60-Day AGBRESA 6° Head-Down Tilt Bedrest",
      "Matroshka (ISS External EVA Phantom) & Artemis I MARE (Helga & Zohar Female Phantoms)",
      "Chang'e-4 LND (Christian-Albrechts-Universität Kiel & DLR Lunar Silicon Detector)",
      "DOSIS-3D & Eu:CROPIS Bio-Regenerative Urine-to-Nitrate Greenhouse",
    ],
    flagshipHardwareAndDosimeters: [
      ":envihab Short-Arm Human Centrifuge (r = 3.8 m, generating 1.0G–2.0G at feet)",
      "MARE Helga & Zohar Anthropomorphic Phantoms (12,000+ passive TLDs + 32 active detectors on Artemis I)",
      "DOSTEL (Dosimetric Telescope) Silicon Radiation Spectrometer",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "DLR :envihab Short-Arm Human Centrifuge (Artificial Gravity Countermeasure)",
        scientificFocus: "Centripetal Hydrostatic Pressure Restoration Against SANS & Syncope",
        empiricalFormulaOrMetric: "a_c = ω² * r (g); ω = sqrt((G_target * 9.81) / r_m) * (60 / 2π) RPM",
        summary:
          "30 minutes/day of short-arm centrifugation generating 1.0G at the heart and 2.0G at the feet reverses cephalad venous pooling, suppresses optic nerve sheath distension (SANS), and preserves orthostatic tolerance.",
      },
      {
        experimentOrProgram: "Artemis I MARE (Matroshka AstroRad Radiation Experiment — Helga & Zohar)",
        scientificFocus: "Female Breast, Ovary & Bone-Marrow Cislunar Radiation Shielding",
        empiricalFormulaOrMetric: "D_marrow_Zohar = D_marrow_Helga * (1 - 0.34) with AstroRad vest",
        summary:
          "Flew twin female anthropomorphic phantoms around the Moon on Orion Artemis I (2022), proving selective high-density polyethylene (HDPE) torso shielding reduces female radiosensitive organ dose by up to 34%.",
      },
    ],
    watchH1Synergy: "Watch H1 calculates live DLR Short-Arm Centrifuge RPM prescription (a_c = ω²r) to neutralize cephalad fluid shift.",
  },

  // 5. BULGARIA
  {
    id: "bulgaria-basa-srti",
    country: "Bulgaria",
    flagEmoji: "🇧🇬",
    region: "Europe & Interkosmos",
    agencyAcronym: "SRTI-BAS (BASA)",
    agencyFullName: "Space Research and Technology Institute — Bulgarian Academy of Sciences",
    nativeAgencyName: "Институт за космически изследвания и технологии — БАН (ИКИТ-БАН)",
    foundedYear: "1969 (BAS Space Group) / 1979 (Soyuz 33) / 1988 (Mir Soyuz TM-5)",
    biomedicalInstitute: "SRTI-BAS Solar-Terrestrial Influences & Space Biotechnology Department (Sofia)",
    notableAstronautsOrCosmonauts: [
      "Georgi Ivanov (Георги Иванов — Soyuz 33, April 1979)",
      "Aleksandar Panayotov Aleksandrov (Александър Александров — Soyuz TM-5 / Mir, June 1988, 'Lyulin' & 'Svet')",
    ],
    keyMissionsAndPlatforms: [
      "Soyuz TM-5 / Mir ('Shipka' Program — First flight of the Lyulin dosimeter)",
      "Liulin-4 / Liulin-5 (Inside ESA Matroshka-R spherical phantom on ISS)",
      "Liulin-MO (ExoMars Trace Gas Orbiter Mars Orbit Dosimeter) & RADOM (Chandrayaan-1)",
      "Svet (Свет) Automated Microgravity Plant Greenhouse on Mir (First wheat seed-to-seed in space)",
    ],
    flagshipHardwareAndDosimeters: [
      "Liulin (Люлин) Active Pin-Diode Semiconductor Spectrometer-Dosimeter Series (Liulin-1 to Liulin-MO)",
      "Svet (Свет) Space Greenhouse Automated Substrate Moisture & Oxygen Bioreactor",
      "Pleven-87 Psychomotor Operator Vestibular & Visual-Motor Analyzer",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Liulin (Люлин) Silicon PIN-Diode Active Radiation Spectrometry",
        scientificFocus: "Real-Time Energy Deposition Spectrum & LET Quality Factor Resolution",
        empiricalFormulaOrMetric: "D_Si(Gy) = (1 / m_det) * Σ (E_i * N_i); H(Sv) = D_tissue * Q(LET)",
        summary:
          "Bulgarian scientists invented the compact Liulin semiconductor active dosimeter-spectrometer for Aleksandrov's 1988 Mir flight; it became the international workhorse flown on Mir, ISS, NASA Shuttles, Chandrayaan-1, and ExoMars.",
      },
      {
        experimentOrProgram: "Svet Space Greenhouse (Mir 1990–2000)",
        scientificFocus: "Bioregenerative Life Support & Super-Dwarf Wheat/Brassica Cultivation",
        empiricalFormulaOrMetric: "O2_production = 14.2 g O2 / m² / day (Super-Dwarf Wheat photosynthesis)",
        summary:
          "Achieved the first complete seed-to-seed reproductive cycle of higher plants in microgravity aboard Mir.",
      },
    ],
    watchH1Synergy: "Watch H1's radiation sensor emulates the Bulgarian Liulin silicon PIN-diode pulse-height LET conversion.",
  },

  // 6. HUNGARY
  {
    id: "hungary-hunor-kfki",
    country: "Hungary",
    flagEmoji: "🇭🇺",
    region: "Europe & Interkosmos",
    agencyAcronym: "HUNOR / EK-CER (KFKI)",
    agencyFullName: "Hungarian to Orbit (HUNOR) & Centre for Energy Research Space Dosimetry Group",
    nativeAgencyName: "Magyar Űrkutatási Iroda / HUNOR & KFKI Energiatudományi Kutatóközpont",
    foundedYear: "1972 (Interkosmos) / May 26, 1980 (Soyuz 36 / Salyut 6)",
    biomedicalInstitute: "KFKI Space Dosimetry Lab & Semmelweis University Aerospace Medicine (Budapest)",
    notableAstronautsOrCosmonauts: [
      "Bertalan Farkas (Soyuz 36 / Soyuz 35 / Salyut 6, May 26–June 3, 1980 — 7d 20h 45m)",
      "Tibor Kapu & Gyula Cserényi (HUNOR Program — Axiom-4 ISS Mission)",
    ],
    keyMissionsAndPlatforms: [
      "Soyuz 36 / Salyut 6 ('Pille-80' Dosimeter & 'Interferon' Immune Experiment)",
      "Pille-M / Pille-ISS (Flown on Salyut 6 including Mongolia's Soyuz-39, Salyut 7, Mir, Space Shuttle STS-41-G, and ISS)",
      "Balaton Psychomotor & Cognitive Work Capacity Analyzer",
    ],
    flagshipHardwareAndDosimeters: [
      "Pille (Пилле — 'Butterfly') Portable CaSO4:Dy Thermoluminescent Dosimeter (TLD) Reader System",
      "Balaton Microprocessor Skin Galvanic Response & Reaction Time Tester",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Pille Onboard Thermoluminescent Dosimetry (TLD)",
        scientificFocus: "High-Precision EVA & Orbital SAA Pass Personal Dosimetry",
        empiricalFormulaOrMetric: "D_TLD = k_cal * ∫ I_glow(T) dT (Resolution: 1 µGy to 10 Gy)",
        summary:
          "Invented by Ferenc Szabó and István Fehér at KFKI Budapest, Pille was the first portable onboard TLD reader in spaceflight history—used by Bertalan Farkas (1980), Mongolia's J. Gürragchaa (1981, logging 1.48 mSv), Sally Ride (1984), and still operating on the ISS.",
      },
      {
        experimentOrProgram: "Interferon (Salyut-6 Human Leukocyte Antiviral Immunity)",
        scientificFocus: "Microgravity Suppression of T-Lymphocyte & Interferon-α Production",
        empiricalFormulaOrMetric: "IFN_α_invitro(0G) = 4.2x higher with poly(I:C) inducer; in-vivo post-flight = -58%",
        summary:
          "Demonstrated that human peripheral blood leukocytes exposed to microgravity exhibit altered interferon-alpha synthesis, founding modern space immunology.",
      },
    ],
    watchH1Synergy: "Calibrates Watch H1 cumulative orbital dose against the Hungarian Pille CaSO4:Dy TLD curve used on Soyuz-39.",
  },

  // 7. FRANCE
  {
    id: "france-cnes-medes",
    country: "France",
    flagEmoji: "🇫🇷",
    region: "Europe & Interkosmos",
    agencyAcronym: "CNES & MEDES",
    agencyFullName: "Centre National d'Études Spatiales & Institute for Space Medicine and Physiology",
    nativeAgencyName: "Centre National d'Études Spatiales (CNES) / MEDES Toulouse",
    foundedYear: "1961 (CNES) / 1982 (Soyuz T-6 Jean-Loup Chrétien)",
    biomedicalInstitute: "MEDES (Institut de Médecine et de Physiologie Spatiales, Toulouse)",
    notableAstronautsOrCosmonauts: [
      "Jean-Loup Chrétien (Soyuz T-6 / Salyut 7 1982, Mir Aragatz 1988 — First Western European in Space & EVA)",
      "Dr. Claudie Haigneré, MD/PhD (Mir Cassiopée 1996, ISS Andromède 2001 — Rheumatologist & Neuroscientist)",
      "Thomas Pesquet (ISS Expeditions 50/51 & 65/66 Commander), Sophie Adenot",
    ],
    keyMissionsAndPlatforms: [
      "Soyuz T-6 / Salyut 7 ('Échographie' — First Cardiovascular & Cerebral Ultrasound in Space, 1982)",
      "Mir Altair / Cassiopée / Pégase ('Cognilab' & 'Physiolab')",
      "Toulouse 60-Day Head-Down Tilt Bedrest & Dry Immersion Clinics (MEDES)",
    ],
    flagshipHardwareAndDosimeters: [
      "As de Coeur / Échographe (First Orbital 2D Doppler Ultrasound, 1982) & T4 Automated Tele-Echography",
      "Cardiomed & Physiolab Cuff/Impedance Arterial Hemodynamics Rack",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Échographie & Tele-Ultrasound (Prof. Philippe Arbeille)",
        scientificFocus: "0G Jugular Vein Thrombosis Risk, Portal Vein Dilatation & Cardiac Output",
        empiricalFormulaOrMetric: "A_IJV(0G) = 3.1 * A_IJV(1G_standing); V_portal = +32%",
        summary:
          "Pioneered orbital echocardiography on Salyut-7 (1982) and remote robotic tele-ultrasound on ISS, discovering internal jugular venous stasis and portal vein congestion in microgravity.",
      },
    ],
    watchH1Synergy: "Pairs Watch H1 cuff blood pressure with CNES MEDES jugular venous stasis & baroreflex models.",
  },

  // 8. ITALY
  {
    id: "italy-asi",
    country: "Italy",
    flagEmoji: "🇮🇹",
    region: "Europe & Interkosmos",
    agencyAcronym: "ASI",
    agencyFullName: "Italian Space Agency (Agenzia Spaziale Italiana)",
    nativeAgencyName: "Agenzia Spaziale Italiana (ASI)",
    foundedYear: "1988 (ASI) / 1992 (Franco Malerba STS-46)",
    biomedicalInstitute: "ASI Space Biomedicine Unit & University of Rome Tor Vergata (ALTEA/LIDAL Lab)",
    notableAstronautsOrCosmonauts: [
      "Roberto Vittori, Luca Parmitano (ISS Commander Exp 61), Samantha Cristoforetti (ISS Commander Exp 68), Walter Villadei",
    ],
    keyMissionsAndPlatforms: [
      "ALTEA (Anomalous Long Term Effects in Astronauts' Central Nervous System) & LIDAL on ISS",
      "Drain Brain (Cervical Strain-Gauge Plethysmography of Cerebral Venous Outflow)",
      "Acoustic Diagnostics (Otoacoustic Emissions Hearing Loss Monitoring in 0G)",
    ],
    flagshipHardwareAndDosimeters: [
      "ALTEA Helmet (6 Silicon Particle Telescopes + 32-Channel Synchronous EEG + Visual Phosphene Button)",
      "LIDAL (Light Ion Detector for ALTEA — Time-of-Flight HZE Cosmic Ray Spectrometer)",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "ALTEA & LIDAL (Prof. Livio Narici — Retinal & Cortical HZE Phosphenes)",
        scientificFocus: "Real-Time Correlation of Heavy-Ion Traversals Through Visual Cortex with EEG & Light Flashes",
        empiricalFormulaOrMetric: "Phosphene_Rate = 0.18 to 0.45 flashes/min in dark-adapted SAA/polar transit (LET > 15 keV/µm)",
        summary:
          "Simultaneously tracked individual HZE cosmic ray ions passing through astronauts' heads while recording 32-channel EEG, proving heavy ions directly depolarize retinal photoreceptors and visual cortex neurons.",
      },
    ],
    watchH1Synergy: "Correlates Watch H1 high-LET radiation spikes with ASI ALTEA cortical phosphene & CNS excitability thresholds.",
  },

  // 9. JAPAN
  {
    id: "japan-jaxa",
    country: "Japan",
    flagEmoji: "🇯🇵",
    region: "Asia-Pacific",
    agencyAcronym: "JAXA",
    agencyFullName: "Japan Aerospace Exploration Agency (宇宙航空研究開発機構)",
    nativeAgencyName: "国立研究開発法人宇宙航空研究開発機構 (JAXA)",
    foundedYear: "1969 (NASDA) / 2003 (JAXA) / 1990 (Toyohiro Akiyama Mir / 1992 Mamoru Mohri STS-47)",
    biomedicalInstitute: "JAXA Tsukuba Space Center Space Biomedical Research Group",
    notableAstronautsOrCosmonauts: [
      "Dr. Chiaki Mukai, MD/PhD (Cardiovascular Surgeon — STS-65 & STS-95)",
      "Dr. Satoshi Furukawa, MD/PhD (Surgeon — ISS Exp 28/29 & Exp 69/70)",
      "Koichi Wakata, Soichi Noguchi, Akihiko Hoshide, Kimiya Yui, Norishige Kanai (MD)",
    ],
    keyMissionsAndPlatforms: [
      "Japanese Experiment Module 'Kibo' (きぼう) on ISS",
      "JAXA/NASA Bisphosphonate Osteoprotection Clinical Trial",
      "PADLES (Passive Dosimeter for Lifescience Experiments in Space) & Nrf2 Oxidative Stress Mouse Habitat",
    ],
    flagshipHardwareAndDosimeters: [
      "PADLES (CR-39 Plastic Nuclear Track Detector + TLD-MSO-S Dosimeter Packages)",
      "Kibo Mouse Habitat Unit (MHU) Dual-Centrifuge (1G vs 0G In-Flight Control)",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Kibo Bisphosphonate + ARED Bone Loss Prevention Trial",
        scientificFocus: "Osteoclast FPP Synthase Inhibition + Resistive Mechanical Loading",
        empiricalFormulaOrMetric: "ΔBMD_femoral = -0.08%/mo (Protected) vs -1.50%/mo (Unprotected) [94.7% reduction]",
        summary:
          "Proved that weekly Alendronate (70 mg) or single pre-flight IV Zoledronate (4 mg) combined with ARED reduces microgravity bone loss by 94.7% and prevents hypercalciuric renal stones.",
      },
      {
        experimentOrProgram: "Nrf2 Transcription Factor & Space Oxidative Stress (Tohoku Univ. / JAXA MHU)",
        scientificFocus: "Master Antioxidant Gene Nrf2 Against Cosmic Radiation & Thymic Atrophy",
        empiricalFormulaOrMetric: "Nrf2_activation = +2.4x antioxidant enzyme expression (HO-1, NQO1)",
        summary:
          "Using Kibo's onboard 1G centrifuge control vs 0G mice, JAXA proved transcription factor Nrf2 is essential to prevent microgravity metabolic lipid reprogramming and radiation oxidative damage.",
      },
    ],
    watchH1Synergy: "Powers the real-time JAXA Bisphosphonate ΔBMD trajectory & urinary calcium calculator.",
  },

  // 10. SOUTH KOREA
  {
    id: "south-korea-kasa-kari",
    country: "South Korea",
    flagEmoji: "🇰🇷",
    region: "Asia-Pacific",
    agencyAcronym: "KASA & KARI",
    agencyFullName: "Korea AeroSpace Administration & Korea Aerospace Research Institute",
    nativeAgencyName: "우주항공청 (KASA) / 한국항공우주연구원 (KARI)",
    foundedYear: "1989 (KARI) / 2024 (KASA) / April 8, 2008 (Soyuz TMA-12)",
    biomedicalInstitute: "KARI Space Bio-Medicine Team & Republic of Korea Air Force Aerospace Medical Center",
    notableAstronautsOrCosmonauts: [
      "Dr. Yi So-yeon, PhD (이소연 — Soyuz TMA-12 / ISS, April 8–19, 2008 — 10d 21h, 18 Korean Experiments)",
    ],
    keyMissionsAndPlatforms: [
      "Soyuz TMA-12 / ISS Korean Astronaut Program (18 Bio/Microgravity Experiments)",
      "Danuri (KPLO — Korea Pathfinder Lunar Orbiter Gamma-Ray Spectrometer, 2022–Present)",
      "LUSEM (Lunar Space Environment Monitor on CLPS Lunar Lander)",
    ],
    flagshipHardwareAndDosimeters: [
      "MEMS Non-Contact Intraocular Pressure (IOP) Tonometer & 3D Facial Edema Scanner",
      "KPLO Lunar Gamma-Ray Spectrometer (KGRS — 30 keV to 12 MeV Lunar Surface Radiation Mapping)",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "0G Intraocular Pressure (IOP) & 3D Cephalad Facial Volume Shift",
        scientificFocus: "Early Orbital Spike in Intraocular Pressure & Periorbital Edema",
        empiricalFormulaOrMetric: "IOP_0G(Day_2) = IOP_1G * 1.58 (+58% acute surge, normalizing to +18% by Day 6)",
        summary:
          "Dr. Yi So-yeon measured her own intraocular pressure and 3D facial contour changes daily on the ISS, quantifying the acute 58% IOP surge caused by episcleral venous hypertension.",
      },
      {
        experimentOrProgram: "Space Kimchi Lactobacillus Microbiome & Radiation Resilience",
        scientificFocus: "Probiotic Lactic Acid Bacteria Survival Under Cosmic Radiation & Gut Immunity",
        empiricalFormulaOrMetric: "CFU_survival > 98.5% with suppressed enteric inflammation",
        summary:
          "Validated radiation-sterilized, non-gas-producing Space Kimchi (Lactobacillus plantarum) to counteract microgravity gut dysbiosis and immune suppression.",
      },
    ],
    watchH1Synergy: "Links Watch H1 cephalad fluid shift to KASA's acute +58% intraocular pressure (IOP) & SANS surge model.",
  },

  // 11. UNITED ARAB EMIRATES (UAE)
  {
    id: "uae-mbrsc",
    country: "United Arab Emirates",
    flagEmoji: "🇦🇪",
    region: "Middle East & Africa",
    agencyAcronym: "MBRSC & UAESA",
    agencyFullName: "Mohammed Bin Rashid Space Centre & UAE Space Agency",
    nativeAgencyName: "مركز محمد بن راشد للفضاء (MBRSC)",
    foundedYear: "2006 (EIAST) / 2014 (UAESA) / 2019 (Soyuz MS-15) / 2023 (Crew-6 186d)",
    biomedicalInstitute: "MBRSC Astronaut Programme & Mohammed Bin Rashid University of Medicine and Health Sciences (MBRU)",
    notableAstronautsOrCosmonauts: [
      "Hazzaa AlMansoori (Soyuz MS-15 / ISS, Sept 2019 — First Emirati in Space)",
      "Dr. Sultan AlNeyadi (SpaceX Crew-6 / ISS Exp 69, March–Sept 2023 — 186 Days & First Arab EVA)",
      "Nora AlMatrooshi & Mohammad AlMulla",
    ],
    keyMissionsAndPlatforms: [
      "UAE Astronaut Programme (ISS Expedition 69 — 186-Day Long-Duration Mission)",
      "Emirates Lunar Mission (Rashid Rover) & Gateway Emirates Airlock (lunar radiation monitoring)",
    ],
    flagshipHardwareAndDosimeters: [
      "Cardiobreath Bio-Monitor Integration & Continuous Glucose / Insulin Metabolic Sensors",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "MBRSC/CSA Cardiobreath & 0G Glucose/Insulin Diabetogenic Shift",
        scientificFocus: "Cardiorespiratory Coupling, Post-Flight Orthostatic BP & Space Insulin Resistance",
        empiricalFormulaOrMetric: "PTT_0G = -14% Pulse Transit Time (arterial stiffening); HbA1c/Insulin shift tracked",
        summary:
          "During his 186-day ISS mission, Sultan AlNeyadi executed 19 biomedical experiments examining cardiorespiratory deconditioning, sleep architecture, and metabolic insulin sensitivity in microgravity.",
      },
    ],
    watchH1Synergy: "Integrates Watch H1 ECG/PPG Pulse Transit Time with MBRSC's 186-day Cardiobreath telemetry.",
  },

  // 12. SAUDI ARABIA
  {
    id: "saudi-arabia-ssa",
    country: "Saudi Arabia",
    flagEmoji: "🇸🇦",
    region: "Middle East & Africa",
    agencyAcronym: "SSA",
    agencyFullName: "Saudi Space Agency (formerly Saudi Space Commission)",
    nativeAgencyName: "وكالة الفضاء السعودية (SSA)",
    foundedYear: "1985 (STS-51-G) / 2018 (SSA) / May 2023 (Axiom-2 ISS)",
    biomedicalInstitute: "King Faisal Specialist Hospital & Research Centre (KFSHRC) Space Biomedicine Division",
    notableAstronautsOrCosmonauts: [
      "Prince Sultan bin Salman Al Saud (STS-51-G Discovery, June 1985 — First Arab & Muslim in Space)",
      "Rayyanah Barnawi (Biomedical Stem-Cell Researcher — Axiom-2 ISS, May 2023)",
      "Ali AlQarni (Axiom-2 ISS, May 2023)",
    ],
    keyMissionsAndPlatforms: [
      "STS-51-G French-Saudi Echocardiography & Vestibular Posture Study (1985)",
      "SSA Axiom-2 ISS Biomedical Campaign (14 Human Health & Cell Biology Experiments, 2023)",
    ],
    flagshipHardwareAndDosimeters: [
      "Ocular Ultrasound ONSD (Optic Nerve Sheath Diameter) Probe & Portable EEG Cap",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "SSA Ocular ONSD Ultrasound & Inflammatory Cytokine mRNA Decay",
        scientificFocus: "Real-Time Optic Nerve Sheath Distension (ICP proxy) & Immune mRNA Half-Life in 0G",
        empiricalFormulaOrMetric: "ONSD_0G = ONSD_1G + 0.62 mm (correlating with ICP > 18 mmHg)",
        summary:
          "Rayyanah Barnawi and Ali AlQarni measured daily optic nerve sheath diameter (ONSD) via ocular ultrasound and analyzed inflammatory cytokine mRNA decay kinetics in human immune cells on the ISS.",
      },
    ],
    watchH1Synergy: "Estimates SSA Optic Nerve Sheath Diameter (ONSD mm) expansion from Watch H1 cephalad pressure.",
  },

  // 13. ISRAEL
  {
    id: "israel-isa",
    country: "Israel",
    flagEmoji: "🇮🇱",
    region: "Middle East & Africa",
    agencyAcronym: "ISA",
    agencyFullName: "Israel Space Agency (סוכנות החלל הישראלית)",
    nativeAgencyName: "סוכנות החלל הישראלית (ISA)",
    foundedYear: "1983 (ISA) / 2003 (STS-107 Ilan Ramon) / 2022 (Rakia Mission)",
    biomedicalInstitute: "Sheba Medical Center ARC Space Lab & StemRad / Soreq NRC",
    notableAstronautsOrCosmonauts: [
      "Col. Ilan Ramon (STS-107 Space Shuttle Columbia, Jan–Feb 2003)",
      "Eytan Stibbe (Axiom-1 'Rakia' Mission on ISS, April 2022 — 35 Israeli Experiments)",
    ],
    keyMissionsAndPlatforms: [
      "AstroRad Selective Organ Radiation Shielding Vest (ISS & Artemis I Orion MARE)",
      "Rakia Mission on ISS (Blood-Brain Barrier Opening, CRISPR Diagnostics & Retinal OCT)",
    ],
    flagshipHardwareAndDosimeters: [
      "StemRad AstroRad Variable-Thickness HDPE Selective Bone-Marrow & Stem-Cell Vest",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "AstroRad Selective Hematopoietic Stem-Cell Shielding",
        scientificFocus: "Variable-Density Polyethylene Topography Over Iliac Crest, Sternum & Ovaries",
        empiricalFormulaOrMetric: "D_BFO_AstroRad = D_BFO_unshielded * (1 - 0.34) during SPE",
        summary:
          "Concentrates high-hydrogen HDPE shielding specifically over the body's blood-forming bone marrow reservoirs (iliac crest, vertebrae, sternum), saving 31–38% marrow dose without restricting astronaut mobility.",
      },
    ],
    watchH1Synergy: "Triggers AstroRad Vest deployment alert when Watch H1 radiation dose rate crosses 45 µSv/hr.",
  },

  // 14. TURKEY
  {
    id: "turkey-tua",
    country: "Turkey (Türkiye)",
    flagEmoji: "🇹🇷",
    region: "Middle East & Africa",
    agencyAcronym: "TUA & TÜBİTAK UZAY",
    agencyFullName: "Turkish Space Agency (Türkiye Uzay Ajansı)",
    nativeAgencyName: "Türkiye Uzay Ajansı (TUA)",
    foundedYear: "2018 (TUA) / Jan 2024 (Axiom-3 ISS) / June 2024 (Suborbital)",
    biomedicalInstitute: "University of Health Sciences (SBÜ) Aerospace Medicine & TÜBİTAK",
    notableAstronautsOrCosmonauts: [
      "Col. Alper Gezeravcı (Axiom-3 / ISS, Jan–Feb 2024 — 21d, 13 Turkish Scientific Experiments)",
      "Tuva Cihangir Atasever (Virgin Galactic Unity 26 Suborbital — Cerebral NIRS & Insulin Pen Study, 2024)",
    ],
    keyMissionsAndPlatforms: [
      "Turkish National Space Program Horizon Mission (Axiom-3 ISS — 13 Experiments)",
    ],
    flagshipHardwareAndDosimeters: [
      "Vokalkord Acoustic Formant AI Analyzer & fNIRS Prefrontal Cerebral Oximeter",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Vokalkord & Message (Acoustic Voice-Formant & CRISPR Immune Profiling)",
        scientificFocus: "Non-Invasive AI Detection of 0G Laryngeal Edema, Hypoxia & Stress via Voice Frequency",
        empiricalFormulaOrMetric: "ΔF0_jitter = +1.85% vocal fold edema shift; CRISPR immune gene activation",
        summary:
          "Alper Gezeravcı tested 'Vokalkord' smartwatch/smartphone acoustic analysis to detect subclinical cephalad vocal-cord edema and hypoxia in 0G, alongside 'Message' CRISPR-edited T-cell anti-cancer immunity.",
      },
    ],
    watchH1Synergy: "Computes the Turkish TUA 'Vokalkord' vocal-fold edema & stress jitter index from Watch H1 SpO2/stress.",
  },

  // 15. CZECHIA (CZECHOSLOVAKIA)
  {
    id: "czechia-cso-interkosmos",
    country: "Czechia (Czechoslovakia)",
    flagEmoji: "🇨🇿",
    region: "Europe & Interkosmos",
    agencyAcronym: "Czech Space Office / CAS",
    agencyFullName: "Czech Space Office & Czech Academy of Sciences Nuclear Physics Institute",
    nativeAgencyName: "Česká kosmická kancelář / Ústav jaderné fyziky AV ČR",
    foundedYear: "1978 (March 2, 1978 — Soyuz 28 / Salyut 6, First Non-Soviet/Non-US Astronaut in History)",
    biomedicalInstitute: "Institute of Aviation Medicine Prague (ÚLZ) & NPI CAS Department of Radiation Dosimetry",
    notableAstronautsOrCosmonauts: [
      "Vladimír Remek (Soyuz 28 / Salyut 6, March 2–10, 1978 — 7d 22h 17m, 87th Human & 1st International Cosmonaut)",
      "Aleš Svoboda (ESA Reserve Astronaut)",
    ],
    keyMissionsAndPlatforms: [
      "Soyuz 28 / Salyut 6 (1978 — First Interkosmos Crewed Mission)",
      "Timepix / Medipix Hybrid Pixel Silicon Radiation Cameras on ISS, Orion & Satellites",
    ],
    flagshipHardwareAndDosimeters: [
      "Oxymeter-M (Оксиметр — Polarographic Subcutaneous Tissue Oxygen Tension Electrode)",
      "Timepix / MiniPIX (CERN/Czech Hybrid Pixel Particle Tracker resolving individual α, β, p+, HZE tracks)",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Kislorod / Oxymeter (Кислород — Subcutaneous Tissue pO2 in 0G)",
        scientificFocus: "Peripheral Microvascular Oxygen Utilisation & Hyperoxic EVA Pre-Breathe",
        empiricalFormulaOrMetric: "pO2_tissue(0G) = pO2_1G * 0.87 (-13% peripheral tissue oxygenation)",
        summary:
          "Vladimír Remek used the Czechoslovak 'Oxymeter' polarographic needle sensor on Salyut-6 to prove that microgravity microvascular redistribution lowers peripheral subcutaneous tissue oxygen tension by 13%.",
      },
      {
        experimentOrProgram: "Chlorella (Хлорелла — Microalgae Bioregenerative O2/CO2 Loop)",
        scientificFocus: "Autotrophic/Heterotrophic Growth Rate of Chlorella Algae in Microgravity",
        empiricalFormulaOrMetric: "μ_growth(0G) = 0.98 * μ_growth(1G)",
        summary: "Proved Chlorella microalgae maintain full photosynthetic oxygen regeneration efficiency in 0G.",
      },
    ],
    watchH1Synergy: "Watch H1 SpO2 connects to Remek's Soyuz-28 'Oxymeter' peripheral tissue pO2 equation.",
  },

  // 16. POLAND
  {
    id: "poland-polsa-interkosmos",
    country: "Poland",
    flagEmoji: "🇵🇱",
    region: "Europe & Interkosmos",
    agencyAcronym: "POLSA / WIML",
    agencyFullName: "Polish Space Agency & Military Institute of Aviation Medicine (Warsaw)",
    nativeAgencyName: "Polska Agencja Kosmiczna (POLSA) / Wojskowy Instytut Medycyny Lotniczej (WIML)",
    foundedYear: "1978 (June 27, 1978 — Soyuz 30 / Salyut 6) / 2014 (POLSA)",
    biomedicalInstitute: "Military Institute of Aviation Medicine (WIML, Warsaw) & IFJ PAN Kraków (TLD Dosimetry)",
    notableAstronautsOrCosmonauts: [
      "Gen. Mirosław Hermaszewski (Soyuz 30 / Salyut 6, June 27–July 5, 1978 — 7d 22h 02m)",
      "Dr. Sławosz Uznański-Wiśniewski (ESA/POLSA Ignis Mission — Axiom-4 ISS)",
    ],
    keyMissionsAndPlatforms: [
      "Soyuz 30 / Salyut 6 ('Kardiolider', 'Smak', 'Zdrowie', 'Relaks')",
      "IFJ PAN Kraków High-Sensitivity LiF:Mg,Cu,P (MCP-N) Thermoluminescent Dosimeters (Matroshka & Artemis I)",
    ],
    flagshipHardwareAndDosimeters: [
      "Kardiolider (Кардиолидер) Acoustic Heart-Rate Biofeedback Exercise Pacer",
      "Smak (Смак — 'Taste') High-Precision Electrogustometer (0–300 µA Tongue Taste Threshold Meter)",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Kardiolider & Zdrowie (Heart-Rate Controlled Exercise Pacing on Salyut-6)",
        scientificFocus: "Closed-Loop Acoustic HR Biofeedback During Veloergometer Training",
        empiricalFormulaOrMetric: "W_ergometer(t) dynamically modulated to keep HR ∈ [130, 150] bpm",
        summary:
          "Developed at WIML Warsaw, 'Kardiolider' was the precursor to modern smartwatch HR-zone alarms, pacing cosmonaut physical workload on the Salyut-6 bicycle ergometer.",
      },
      {
        experimentOrProgram: "Smak ('Taste' — Microgravity Electrogustometry)",
        scientificFocus: "Cephalad Mucosal Congestion & Blunting of Gustatory Receptor Thresholds",
        empiricalFormulaOrMetric: "I_taste_threshold(0G) = +42% µA current required for sour/salty detection",
        summary:
          "Hermaszewski proved with the Polish 'Smak' electrogustometer that microgravity shifts taste sensitivity thresholds upward by +42%, scientifically explaining why astronauts crave spicy foods in orbit.",
      },
    ],
    watchH1Synergy: "Watch H1 directly inherits Poland's 1978 'Kardiolider' closed-loop HR exercise biofeedback architecture.",
  },

  // 17. VIETNAM
  {
    id: "vietnam-vnsc-interkosmos",
    country: "Vietnam",
    flagEmoji: "🇻🇳",
    region: "Asia-Pacific",
    agencyAcronym: "VNSC / VAST",
    agencyFullName: "Vietnam National Space Center — Vietnam Academy of Science and Technology",
    nativeAgencyName: "Trung tâm Vũ trụ Việt Nam (VNSC) — Viện Hàn lâm Khoa học và Công nghệ Việt Nam",
    foundedYear: "1980 (July 23, 1980 — Soyuz 37 / Salyut 6, First Asian in Space)",
    biomedicalInstitute: "Vietnam Academy of Science and Technology (VAST) & Air Force Medical Institute (Hanoi)",
    notableAstronautsOrCosmonauts: [
      "Lt. Gen. Phạm Tuân (Soyuz 37 / Soyuz 36 / Salyut 6, July 23–31, 1980 — 7d 20h 42m, First Asian Cosmonaut)",
      "Bùi Thanh Liêm (Backup Cosmonaut)",
    ],
    keyMissionsAndPlatforms: [
      "Soyuz 37 / Salyut 6 ('Azolla / Beo Hoa Dau', 'Hathor', 'Pnevmokard', 'Halong' Crystal Growth)",
    ],
    flagshipHardwareAndDosimeters: [
      "IFS-2 Azolla Symbiotic Fern-Cyanobacteria Bioreactor & Pneumotachograph",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Azolla / Bèo Hoa Dâu (Azolla pinnata Symbiotic Nitrogen-Fixing Fern)",
        scientificFocus: "Closed-Loop Oxygen Generation, Protein Biomass & Nitrogen Fixation in 0G",
        empiricalFormulaOrMetric: "Doubling_Time(Azolla_pinnata + Anabaena_azollae) = 2.8 days in microgravity",
        summary:
          "Phạm Tuân cultivated the Vietnamese water fern Azolla pinnata (symbiotic with cyanobacterium Anabaena azollae) on Salyut-6, demonstrating rapid high-protein biomass and oxygen production for deep-space life support.",
      },
      {
        experimentOrProgram: "Hathor & Pnevmokard (0G Pulmonary Vital Capacity & Impedance)",
        scientificFocus: "Thoracic Blood Engorgement Reduction of Forced Vital Capacity (FVC)",
        empiricalFormulaOrMetric: "FVC_0G(Day_3) = FVC_1G * 0.91 (-9% vital capacity due to pulmonary capillary engorgement)",
        summary:
          "Measured spirometric lung volumes and impedance pneumograms on Salyut-6, quantifying the 9% dip in vital capacity from intrathoracic blood pooling.",
      },
    ],
    watchH1Synergy: "Correlates Watch H1 thoracic fluid shift with Phạm Tuân's Salyut-6 pulmonary FVC reduction model.",
  },

  // 18. CUBA
  {
    id: "cuba-citma-interkosmos",
    country: "Cuba",
    flagEmoji: "🇨🇺",
    region: "Americas",
    agencyAcronym: "CITMA / ICIMAF",
    agencyFullName: "Cuban Academy of Sciences & Cuban Neurosciences Center (CNEURO)",
    nativeAgencyName: "Academia de Ciencias de Cuba / Centro de Neurociencias de Cuba (CNEURO)",
    foundedYear: "1980 (Sept 18, 1980 — Soyuz 38 / Salyut 6, First Latin American & First Person of African Descent in Space)",
    biomedicalInstitute: "Cuban Neurosciences Center (CNEURO, Havana) & Hospital Militar Dr. Carlos J. Finlay",
    notableAstronautsOrCosmonauts: [
      "Gen. Arnaldo Tamayo Méndez (Soyuz 38 / Salyut 6, Sept 18–26, 1980 — 7d 20h 43m)",
      "José Armando López Falcón (Backup Cosmonaut)",
    ],
    keyMissionsAndPlatforms: [
      "Soyuz 38 / Salyut 6 (27 Cuban-Soviet Experiments: 'Cortex', 'Suporte', 'Antropometria', 'Hatuey', 'Caribe')",
    ],
    flagshipHardwareAndDosimeters: [
      "Medicor-Cuba 'Cortex' Digital EEG Visual/Auditory Evoked Potential Analyzer",
      "Suporte (Супорте — 'Support') Plantar Mechanoreceptor Pressure-Arch Footwear",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Cortex (Visual & Auditory Evoked Brain Potentials in 0G)",
        scientificFocus: "Quantitative EEG (qEEG) & Sensory Evoked Potential Latency in Weightlessness",
        empiricalFormulaOrMetric: "P100_VEP_latency(0G) = +11.4 ms delay during acute vestibular adaptation",
        summary:
          "Designed by Dr. Mitchell Valdés-Sosa at CNEURO Havana, 'Cortex' was the first computerized evoked-potential neurophysiology system flown in space, proving vestibular conflict slows cortical visual processing on Days 1–3.",
      },
      {
        experimentOrProgram: "Suporte (Plantar Mechanoreceptor Stimulation Boots)",
        scientificFocus: "Artificial Foot-Sole Pressure to Suppress 0G Spatial Disorientation Illusion",
        empiricalFormulaOrMetric: "Spatial_Illusion_Score = -58% with 0.35 kg/cm² plantar arch pressure",
        summary:
          "Tamayo Méndez wore spring-loaded 'Suporte' insoles pressing against the plantar Vater-Pacini mechanoreceptors of his feet for 4–6 hours/day on Salyut-6, dramatically reducing spatial inversion illusions and extensor muscle tone loss.",
      },
    ],
    watchH1Synergy: "Integrates Cuba's 'Cortex' qEEG stress latency & 'Suporte' plantar proprioception countermeasure.",
  },

  // 19. ROMANIA
  {
    id: "romania-rosa-interkosmos",
    country: "Romania",
    flagEmoji: "🇷🇴",
    region: "Europe & Interkosmos",
    agencyAcronym: "ROSA & ISS Bucharest",
    agencyFullName: "Romanian Space Agency & Institute of Space Science (Măgurele)",
    nativeAgencyName: "Agenția Spațială Română (ROSA) / Institutul de Științe Spațiale",
    foundedYear: "1981 (May 14, 1981 — Soyuz 40 / Salyut 6) / 1991 (ROSA)",
    biomedicalInstitute: "National Institute of Aerospace Medicine 'Gen. Dr. Aviator Victor Anastasiu' (INMAS Bucharest)",
    notableAstronautsOrCosmonauts: [
      "Lt. Gen. Dr. Ing. Dumitru-Dorin Prunariu (Soyuz 40 / Salyut 6, May 14–22, 1981 — 7d 20h 42m, immediately following Mongolia's Soyuz-39)",
      "Dumitru Dediu (Backup Cosmonaut)",
    ],
    keyMissionsAndPlatforms: [
      "Soyuz 40 / Salyut 6 ('Rheo', 'Miokard', 'Biodoz', 'Astro-1', 'Capilar')",
    ],
    flagshipHardwareAndDosimeters: [
      "Biodoz & Astro-1 Dielectric Track-Etch Heavy-Ion Cosmic Ray Spectrometers",
      "Rheo / Miokard Synchronized 12-Lead ECG + Cerebral/Femoral Rheograph",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Biodoz & Astro-1 (HZE Heavy Cosmic Ray Ion Nuclear Track Dosimetry)",
        scientificFocus: "Flux & Charge Spectrum of Iron-Group (Z = 20–28) Galactic Cosmic Rays Inside vs Outside Salyut-6",
        empiricalFormulaOrMetric: "Φ_HZE(Z≥20) = 1.42 particles / cm² / day inside Salyut-6 hull",
        summary:
          "Prunariu deployed dielectric plastic track detectors ('Biodoz' inside cabin, 'Astro-1' in open vacuum via Salyut-6 airlock) to measure heavy-ion GCR fragmentation through spacecraft aluminum walls.",
      },
      {
        experimentOrProgram: "Miokard & Rheo (Left Ventricular Systolic Time Intervals in 0G)",
        scientificFocus: "Pre-Ejection Period (PEP) to Left Ventricular Ejection Time (LVET) Ratio",
        empiricalFormulaOrMetric: "PEP / LVET = 0.34 → 0.41 during 0G baroreceptor adaptation",
        summary:
          "Quantified myocardial contractility and cerebral blood flow dynamics on Salyut-6 just 6 weeks after Mongolia's Soyuz-39 mission.",
      },
    ],
    watchH1Synergy: "Watch H1 ECG R-peak to PPG pulse arrival time calculates Romania's Soyuz-40 PEP/LVET myocardial index.",
  },

  // 20. UNITED KINGDOM
  {
    id: "uk-uksa",
    country: "United Kingdom",
    flagEmoji: "🇬🇧",
    region: "Europe & Interkosmos",
    agencyAcronym: "UKSA",
    agencyFullName: "United Kingdom Space Agency",
    nativeAgencyName: "UK Space Agency (UKSA)",
    foundedYear: "1991 (Project Juno Mir — Helen Sharman) / 2010 (UKSA)",
    biomedicalInstitute: "King's College London Centre for Human & Applied Physiological Sciences & Univ. of Nottingham",
    notableAstronautsOrCosmonauts: [
      "Dr. Helen Sharman, OBE (Soyuz TM-12 / Mir Project Juno, May 1991 — First Briton in Space)",
      "Tim Peake (ISS Expedition 46/47 Principia Mission, 2015–2016 — 186d)",
      "John McFall, MD (ESA Fly! Feasibility Study — First Paralympic Surgeon-Astronaut) & Rosemary Coogan",
    ],
    keyMissionsAndPlatforms: [
      "Molecular Muscle Experiment (MME-1 & MME-2 on ISS — C. elegans Insulin/Integrin Atrophy Pathways)",
      "MicroAge (Lab-Grown Human Skeletal Muscle Organoids Electrically Stimulated on ISS)",
      "Skinsuit (Gravity-Loading Elastic Countermeasure Garment developed with KCL/MIT/ESA)",
    ],
    flagshipHardwareAndDosimeters: [
      "Mk VI Gravity-Loading Skinsuit (Bidirectional Elastic Weave Providing 0.2G–0.8G Progressive Axial Load)",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Molecular Muscle Experiment & MicroAge (Univ. of Nottingham & Liverpool)",
        scientificFocus: "Foxo/Atrogin-1 Ubiquitin Ligase & Mitochondrial H2S Suppression in 0G Muscle Atrophy",
        empiricalFormulaOrMetric: "MHC_synthesis_rate(0G) = -28%; rescued +64% via targeted H2S/integrin activation",
        summary:
          "Identified the exact molecular adhesions (integrin-focal adhesion kinase complex) that sense gravity loss in skeletal muscle and demonstrated pharmacological rescue of mitochondrial ATP decline.",
      },
    ],
    watchH1Synergy: "Monitors metabolic and HR recovery during Mk VI Skinsuit axial gravity-loading sessions.",
  },

  // 21. BRAZIL
  {
    id: "brazil-aeb",
    country: "Brazil",
    flagEmoji: "🇧🇷",
    region: "Americas",
    agencyAcronym: "AEB & INPE",
    agencyFullName: "Brazilian Space Agency & National Institute for Space Research",
    nativeAgencyName: "Agência Espacial Brasileira (AEB) / Instituto Nacional de Pesquisas Espaciais (INPE)",
    foundedYear: "1961 (INPE) / 1994 (AEB) / March 30, 2006 (Soyuz TMA-8 / ISS)",
    biomedicalInstitute: "Microgravity Center (MicroG — PUCRS, Porto Alegre) & INPE South Atlantic Anomaly Lab",
    notableAstronautsOrCosmonauts: [
      "Lt. Col. Marcos Cesar Pontes (Soyuz TMA-8 / ISS 'Centenário Mission', March–April 2006 — 9d 21h)",
    ],
    keyMissionsAndPlatforms: [
      "Missão Centenário on ISS ('DNA' Repair & 'NIP' Luminescence Experiments)",
      "INPE South Atlantic Anomaly (SAA) Geomagnetic & Trapped Proton Monitoring Network",
    ],
    flagshipHardwareAndDosimeters: [
      "INPE SAA Particle Flux Correlator & MicroG Lower-Body Positive/Negative Pressure Tilt Table",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "DAM / DNA Repair Kinetics in Microgravity & SAA Radiation",
        scientificFocus: "Escherichia coli & Eukaryotic Base-Excision Repair Under Cosmic Ray Damage",
        empiricalFormulaOrMetric: "BER_repair_efficiency(SAA_0G) = 0.89 * BER_1G",
        summary:
          "Marcos Pontes evaluated how cosmic radiation inside the South Atlantic Anomaly (centered directly over Brazil) interacts with microgravity to alter cellular DNA damage repair kinetics.",
      },
    ],
    watchH1Synergy: "Triggers SAA proton-belt radiation alerts when orbital ground-track crosses Brazil's INPE SAA boundary.",
  },

  // 22. AUSTRALIA
  {
    id: "australia-asa",
    country: "Australia",
    flagEmoji: "🇦🇺",
    region: "Asia-Pacific",
    agencyAcronym: "ASA & AAD",
    agencyFullName: "Australian Space Agency & Australian Antarctic Division Space Analog Program",
    nativeAgencyName: "Australian Space Agency (ASA) / CSIRO",
    foundedYear: "1967 (WRESAT) / 2018 (ASA) / 2024 (Katherine Bennell-Pegg)",
    biomedicalInstitute: "Australian Antarctic Division (AAD Polar Space Medicine) & Australian National University (ANU)",
    notableAstronautsOrCosmonauts: [
      "Dr. Paul Scully-Power (STS-41-G, 1984), Dr. Andy Thomas (Mir 141-Day Flight & 4 Shuttle Missions)",
      "Katherine Bennell-Pegg (First Astronaut Trained Under the Australian Space Agency Flag, 2024)",
    ],
    keyMissionsAndPlatforms: [
      "Casey, Davis & Mawson Antarctic Stations (NASA/ASA ICE Behavioral & Immune Analog for Mars)",
      "ANU Personalized Digital-Twin Cardiovascular 0G Modeling",
    ],
    flagshipHardwareAndDosimeters: [
      "Antarctic ICE Wearable Circadian Actigraphy & Salivary EBV Viral Reactivation Assay",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Antarctic ICE Analog (Latent Herpesvirus Reactivation & Polar Winter Isolation)",
        scientificFocus: "T-Cell Exhaustion, Cortisol Surge & Epstein-Barr/VZV Viral Shedding in Isolated Crews",
        empiricalFormulaOrMetric: "P_viral_shedding = 1 / (1 + exp(-(0.08*Stress_Score - 0.05*HRV_RMSSD - 1.2)))",
        summary:
          "Co-led with NASA, Australia's Antarctic overwintering stations serve as the premier ground analog for lunar/Martian isolation, quantifying stress-induced latent viral reactivation and vitamin D/circadian countermeasures.",
      },
    ],
    watchH1Synergy: "Uses Watch H1 Stress & Sleep scores to compute ASA's latent viral reactivation probability.",
  },

  // 23. SOUTH AFRICA
  {
    id: "south-africa-sansa",
    country: "South Africa",
    flagEmoji: "🇿🇦",
    region: "Middle East & Africa",
    agencyAcronym: "SANSA",
    agencyFullName: "South African National Space Agency",
    nativeAgencyName: "South African National Space Agency (SANSA — Hermanus Space Weather Centre)",
    foundedYear: "2002 (Mark Shuttleworth Soyuz TM-34) / 2010 (SANSA)",
    biomedicalInstitute: "SANSA Space Weather Regional Warning Centre (Hermanus) & Univ. of Cape Town / Pretoria",
    notableAstronautsOrCosmonauts: [
      "Mark Shuttleworth (Soyuz TM-34 / ISS 'First African in Space' Mission, April–May 2002 — 9d 21h)",
    ],
    keyMissionsAndPlatforms: [
      "Soyuz TM-34 / ISS ('ECCS' Energy Expenditure & Cardiovascular Conditioning, 'SPC' Stem Cell Proliferation)",
      "SANSA ICAO Global Space Weather Center (Hermanus Neutron Monitor & SAA Geomagnetic Array)",
    ],
    flagshipHardwareAndDosimeters: [
      "Hermanus NM64 Cosmic Ray Neutron Monitor & Soyuz TM-34 Ambulatory Holter/Metabolic Analyzer",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "ECCS (Cardiovascular & Metabolic Energy Expenditure in Microgravity)",
        scientificFocus: "VO2 Kinetics, Resting Metabolic Rate & Autonomic Baroreflex on ISS",
        empiricalFormulaOrMetric: "RMR_0G = RMR_1G * 0.92; Baroreflex_Gain = -31% post-landing",
        summary:
          "Designed with the University of Cape Town (Prof. Tim Noakes' lab), Mark Shuttleworth recorded continuous heart-rate, respiratory gas exchange, and muscle protein turnover on the ISS.",
      },
    ],
    watchH1Synergy: "Integrates SANSA Hermanus geomagnetic Kp-index with Watch H1 cosmic ray dose rate.",
  },

  // 24. MEXICO
  {
    id: "mexico-aem",
    country: "Mexico",
    flagEmoji: "🇲🇽",
    region: "Americas",
    agencyAcronym: "AEM",
    agencyFullName: "Mexican Space Agency (Agencia Espacial Mexicana)",
    nativeAgencyName: "Agencia Espacial Mexicana (AEM) / UNAM",
    foundedYear: "1985 (STS-61-B Rodolfo Neri Vela) / 2010 (AEM)",
    biomedicalInstitute: "UNAM Programa Espacial Universitario (PEU) & Instituto Nacional de Neurología",
    notableAstronautsOrCosmonauts: [
      "Dr. Rodolfo Neri Vela (STS-61-B Atlantis, Nov–Dec 1985 — 6d 21h, First Mexican Astronaut)",
      "José Hernández (STS-128), Katya Echazarreta",
    ],
    keyMissionsAndPlatforms: [
      "STS-61-B Mexican Payload Specialist Biomedical Experiments (Electropuncture & Otolith Vestibular Study)",
    ],
    flagshipHardwareAndDosimeters: [
      "STS-61-B Portable Neuro-Autonomic Electropuncture Stimulator",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Electropuntura & Otolith Adaptation in Microgravity (Dr. Rodolfo Neri Vela)",
        scientificFocus: "Electrical Acupoint Stimulation for Space Motion Sickness & Vestibular Nystagmus",
        empiricalFormulaOrMetric: "Nystagmus_decay_tau = -34% faster vestibular habituation",
        summary:
          "During STS-61-B (1985), Dr. Rodolfo Neri Vela pioneered electrical acupoint stimulation in orbit to treat Space Adaptation Syndrome, predating modern wearable TEAS neuromodulation.",
      },
    ],
    watchH1Synergy: "Complements Watch H1 wrist neuromodulation with Neri Vela's STS-61-B electropuncture protocol.",
  },

  // 25. SWITZERLAND, BELGIUM, NETHERLANDS, SPAIN, SWEDEN, DENMARK (ESA MEMBER NATIONAL CONTRIBUTIONS)
  {
    id: "europe-swiss-benelux-nordic-spain",
    country: "Switzerland, Belgium, Netherlands, Spain, Sweden & Denmark",
    flagEmoji: "🇨🇭🇧🇪🇳🇱🇪🇸🇸🇪🇩🇰",
    region: "Europe & Interkosmos",
    agencyAcronym: "SSO / BELSPO / NSO / AEE / SNSA / DTU",
    agencyFullName: "European National Space Offices (Swiss, Belgian, Dutch, Spanish, Swedish & Danish Programs)",
    nativeAgencyName: "SSO • BELSPO • NSO • Agencia Espacial Española • Rymdstyrelsen • DTU Space",
    foundedYear: "1975–2023 (ESA Member National Biomedical Programs)",
    biomedicalInstitute: "ETH Zurich, SCK CEN (Belgium), University of Amsterdam, CAB Madrid, Karolinska Institutet (Sweden), DTU",
    notableAstronautsOrCosmonauts: [
      "Claude Nicollier (Switzerland), Frank De Winne & Dirk Frimout (Belgium), André Kuipers, MD & Wubbo Ockels (Netherlands)",
      "Pedro Duque & Pablo Álvarez (Spain), Christer Fuglesang & Marcus Wandt (Sweden), Andreas Mogensen (Denmark)",
    ],
    keyMissionsAndPlatforms: [
      "Belgium SCK CEN MELiSSA (Micro-Ecological Life Support System Alternative — Spirulina O2 Bioreactor)",
      "Sweden Karolinska / Christer Fuglesang 'ALTEA-Shield' & Exhaled Nitric Oxide (FeNO) Airway Inflammation",
      "Denmark Andreas Mogensen 'Skinsuit' & 'Thor-Davis' Upper-Atmosphere Radiation Lightning",
    ],
    flagshipHardwareAndDosimeters: [
      "NIOX MINO Exhaled Nitric Oxide (FeNO) Analyzer (Karolinska Institutet, Sweden — Lunar Dust Airway Inflammation)",
      "MELiSSA Arthrospira (Spirulina) Photobioreactor (SCK CEN Belgium)",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Airway Monitoring (Karolinska Institutet, Sweden — Prof. Dag Linnarsson)",
        scientificFocus: "Exhaled Nitric Oxide (FeNO) in Reduced-Pressure Hypoxic EVA & Lunar Dust Environments",
        empiricalFormulaOrMetric: "FeNO_0G = -27% reduction in bronchial nitric oxide due to uniform 0G lung perfusion",
        summary:
          "Discovered that microgravity redistributes pulmonary capillary perfusion uniformly from base to apex, altering bronchial nitric oxide levels and providing a diagnostic baseline to detect toxic lunar regolith inhalation on Artemis.",
      },
    ],
    watchH1Synergy: "Watch H1 SpO2 & respiratory rate integrate with Karolinska's 0G pulmonary perfusion model.",
  },

  // 26. KAZAKHSTAN & UKRAINE (POST-SOVIET AEROSPACE HERITAGE)
  {
    id: "kazakhstan-ukraine-aerospace",
    country: "Kazakhstan & Ukraine",
    flagEmoji: "🇰🇿🇺🇦",
    region: "Europe & Interkosmos",
    agencyAcronym: "KazCosmos & SSAU",
    agencyFullName: "Aerospace Committee of Kazakhstan (KazCosmos) & State Space Agency of Ukraine",
    nativeAgencyName: "Қазғарыш (Аэроғарыш комитеті) / Державне космічне агентство України",
    foundedYear: "1991 (Soyuz TM-13 Tokhtar Aubakirov) / 1997 (STS-87 Leonid Kadenyuk)",
    biomedicalInstitute: "Institute of Human Physiology (Almaty) & Kholodny Institute of Botany / Bogomoletz Institute (Kyiv)",
    notableAstronautsOrCosmonauts: [
      "Tokhtar Aubakirov (Soyuz TM-13 / Mir, 1991), Talgat Musabayev (3 Flights, 341d on Mir/ISS), Aidyn Aimbetov (Soyuz TMA-18M, 2015)",
      "Pavel Popovich (Vostok 4 & Salyut 3), Georgi Beregovoi, Leonid Kadenyuk (STS-87 Columbia, 1997)",
    ],
    keyMissionsAndPlatforms: [
      "Baikonur Cosmodrome Launch & Post-Landing Search-and-Rescue Medical Field Hospital (Kazakhstan)",
      "Kazakh Dastarkhan-6 Lyophilized Probiotic Mare's Milk (Shubat/Kumis) Space Nutrition",
      "STS-87 Collaborative Ukrainian Experiment (CUE — Brassica rapa Space Pollination by Leonid Kadenyuk)",
    ],
    flagshipHardwareAndDosimeters: [
      "Baikonur Mobile Inflatable Orthostatic Reanimation Tent & Soyuz Descent Telemetry Relay",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "KazCosmos 'Dastarkhan' & 'biotest' (Mir EO-16 Talgat Musabayev & ISS Aidyn Aimbetov)",
        scientificFocus: "Erythropoietic & Antioxidant Protection Using Freeze-Dried Mare's/Camel's Milk Peptides",
        empiricalFormulaOrMetric: "MDA_lipid_peroxidation = -29% post-flight oxidative stress",
        summary:
          "Validated traditional Central Asian fermented lactic peptides (rich in lactoferrin and vitamin C) to counteract space anemia and radiation-induced lipid peroxidation.",
      },
    ],
    watchH1Synergy: "Supports Baikonur / Steppe landing zone telemetry handoff with GMIT Nalaikh ground station.",
  },

  // 27. NIGERIA
  {
    id: "nigeria-nasrda",
    country: "Nigeria",
    flagEmoji: "🇳🇬",
    region: "Middle East & Africa",
    agencyAcronym: "NASRDA",
    agencyFullName: "National Space Research and Development Agency",
    nativeAgencyName: "National Space Research and Development Agency (NASRDA, Abuja)",
    foundedYear: "1999 (NASRDA)",
    biomedicalInstitute: "NASRDA Physical & Life Sciences Division & Centre for Atmospheric Research (Anyigba)",
    notableAstronautsOrCosmonauts: [
      "NASRDA Equatorial Ionospheric & Microgravity Clinostat Research Fellows (UNOOSA / NASRDA)",
    ],
    keyMissionsAndPlatforms: [
      "NigeriaSat-1, NigeriaSat-2 & NigeriaSat-X (Disaster, Epidemiological Vector & Ionospheric Scintillation Monitoring)",
      "UNOOSA-NASRDA 2D/3D Clinostat Microgravity Plant & Erythrocyte Osmotic Fragility Lab",
    ],
    flagshipHardwareAndDosimeters: [
      "Equatorial Ionospheric Total Electron Content (TEC) Scintillation Array & 3D Random Positioning Clinostat",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Equatorial Electrojet Cosmic Ray Cutoff & Clinostat Red-Blood-Cell Osmotic Fragility",
        scientificFocus: "Geomagnetic Vertical Cutoff Rigidity (~15 GV) & Simulated 0G Erythrocyte Membrane Stability",
        empiricalFormulaOrMetric: "R_cutoff(Equatorial) ≈ 14.9 GV (shielding low-energy GCR); Hemolysis_0G_clinostat = +11%",
        summary:
          "Studies how high geomagnetic cutoff rigidity over West Africa attenuates cosmic ray secondary neutrons and uses 3D clinostats to test tropical antioxidant phytomedicines against space hemolysis.",
      },
    ],
    watchH1Synergy: "Provides equatorial geomagnetic cutoff rigidity baselines for Watch H1 orbital pass modeling.",
  },

  // 28. ARGENTINA
  {
    id: "argentina-conae",
    country: "Argentina",
    flagEmoji: "🇦🇷",
    region: "Americas",
    agencyAcronym: "CONAE & CNEA",
    agencyFullName: "Comisión Nacional de Actividades Espaciales & National Atomic Energy Commission",
    nativeAgencyName: "Comisión Nacional de Actividades Espaciales (CONAE) / CNEA",
    foundedYear: "1960 (CNIE — Juan el Mono Suborbital Bio-Flight, 1969) / 1991 (CONAE)",
    biomedicalInstitute: "Instituto Nacional de Medicina Aeronáutica y Espacial (INMAE) & CNEA Radiobiology Lab (Buenos Aires)",
    notableAstronautsOrCosmonauts: [
      "Fernando Caldeiro (NASA Astronaut Group 16 — STS-124/ISS Support)",
      "Bio-Primates 'Belisario' (1967 Yarará rocket) & 'Juan' (1969 Canopus II rocket — 4th nation in history to launch & recover a living mammal from space trajectory)",
    ],
    keyMissionsAndPlatforms: [
      "Operación Navidad (1969 Canopus II Suborbital Primate ECG/Respiration Telemetry)",
      "SAC-C & SAC-D / Aquarius (ICARE-NG Particle & South Atlantic Anomaly Dosimetry Suite with CNES)",
      "Belgrano II Antarctic Station (ESA/CONAE 12-Month Isolation, Sleep & Microbiome Analog)",
    ],
    flagshipHardwareAndDosimeters: [
      "ICARE-NG Solid-State Proton/Electron Telescope (Mapping the Southern Core of the SAA)",
    ],
    biomedicalAndRadiationResearch: [
      {
        experimentOrProgram: "Belgrano II Antarctic Overwintering & SAA Southern-Anomaly Proton Mapping",
        scientificFocus: "Circadian Melatonin Suppression in 4-Month Polar Night & High-Energy Trapped Protons",
        empiricalFormulaOrMetric: "SAA_Peak_Flux(32°S, 55°W) = 4,800 protons / cm² / s (>30 MeV)",
        summary:
          "Co-operates with ESA at Belgrano II Antarctic Base as a high-fidelity Mars isolation analog while CONAE/CNEA satellites map the peak proton core of the South Atlantic Anomaly over the Río de la Plata.",
      },
    ],
    watchH1Synergy: "Feeds CONAE SAC-D South Atlantic Anomaly peak proton flux contours into Watch H1 radiation warnings.",
  },
];

// ============================================================================
// 7. REAL-TIME MULTI-AGENCY BIO-ASTRONAUTICS CALCULATION ENGINE
// ============================================================================
export interface CrossAgencyCalculationInput {
  heartRateBpm: number;
  systolicBp: number;
  diastolicBp: number;
  spo2Pct: number;
  hrvRmssdMs: number;
  stressScore: number;
  watchSkinDoseRateUSvH: number;
  missionDays: number;
  environmentId: SpaceEnvironmentId;
  // Countermeasure toggles
  vorotnikCollarActive: boolean;
  chibisLbnpActive: boolean;
  indralinB190Taken: boolean;
  taikongYangxinAndPc6Active: boolean;
  bisphosphonateAndPingvinActive: boolean;
  isEvaMode: boolean;
  dlrCentrifugeActive?: boolean;
  isroYogaAndRp1Active?: boolean;
}

export interface CrossAgencyCalculationResult {
  // Hemodynamic & environment fundamentals
  meanArterialPressureMmHg: number;
  pulsePressureMmHg: number;
  effectiveSkinDoseMSv: number;
  effectiveBfoDoseRawMSv: number;
  effectiveBfoDoseProtectedMSv: number;
  skinToBfoRatio: number;

  // 1. Mongolia / Interkosmos (Soyuz-39 / Salyut-6)
  mongolia: {
    cephaladFluidShiftMl: number;
    kubicekStrokeVolumeMl: number;
    smsProbabilityPct: number;
    circadianPhaseDriftHours: number;
    visualContrastLossPct: number;
    soyuz39DoseMultiple: number; // vs 1.48 mSv benchmark
    recommendation: string;
  };

  // 2. USSR / Russia (Roscosmos / IBMP RAS)
  roscosmos: {
    recommendedChibisVacuumMmHg: number;
    chibisCaudalFluidRedistributionMl: number;
    indralinDrfApplied: number;
    bfoDoseSavedByIndralinMSv: number;
    careerLimit1000Pct: number;
    polyakov437dDoseMultiple: number; // vs 312 mSv
    recommendation: string;
  };

  // 3. China (CMSA / ACC)
  cmsa: {
    autonomicBalanceScore: number; // 0-100
    projectedHrvWithTcmMs: number;
    endothelialNitricOxideGainPct: number;
    change4LunarDaysEquivalent: number; // vs 1.369 mSv/day
    recommendation: string;
  };

  // 4. USA (NASA JSC)
  nasa: {
    careerLimit600Pct: number;
    reidCancerRiskPct: number;
    carotidImtThickeningPct: number;
    telomereElongationPct: number;
    sansOpticEdemaRiskPct: number;
    statusVsPel: "NOMINAL" | "CAUTION" | "EXCEEDS_NASA_600_PEL";
    recommendation: string;
  };

  // 5. Europe & Japan (ESA EAC & JAXA Kibo)
  esaJaxa: {
    bmdLossUnprotectedPct: number;
    bmdLossProtectedPct: number;
    bmdSavedPct: number;
    urinaryCalciumMgDay: number;
    matroshkaAttenuationFactor: number;
    recommendation: string;
  };

  // 6. International Coalition (Bulgaria Liulin, Germany DLR Centrifuge, India ISRO/INMAS, Turkey TUA Vokalkord)
  internationalCoalition: {
    bulgariaLiulinSiliconAbsorbedDoseMGy: number;
    bulgariaLiulinMeanLetKeVUm: number;
    dlrCentrifugeRequiredRpm: number; // for r = 3.8m short-arm centrifuge
    dlrCentrifugeFootGLoad: number;
    isroYogaAndRp1Drf: number;
    isroPranayamaVagalHrvMs: number;
    tuaVokalkordJitterPct: number;
    kasaIntraocularPressureMmHg: number;
    recommendation: string;
  };
}

export function calculateCrossAgencyBioMetrics(
  input: CrossAgencyCalculationInput
): CrossAgencyCalculationResult {
  const env =
    SPACE_ENVIRONMENTS.find((e) => e.id === input.environmentId) || SPACE_ENVIRONMENTS[0];

  const map = Math.round(input.diastolicBp + (input.systolicBp - input.diastolicBp) / 3);
  const pulsePressure = Math.max(15, input.systolicBp - input.diastolicBp);

  // Matroshka EVA vs IVA Skin-to-BFO ratio
  const skinToBfoRatio = input.isEvaMode ? env.evaToIvaSkinBfoMultiplier : 1.18;

  // Total skin & BFO dose over missionDays using live Watch H1 dose rate blended with environment
  const hourlyDoseUSv = Math.max(0.5, input.watchSkinDoseRateUSvH);
  const effectiveSkinDoseMSv = Number(((hourlyDoseUSv * 24 * input.missionDays) / 1000).toFixed(2));
  const effectiveBfoDoseRawMSv = Number((effectiveSkinDoseMSv / skinToBfoRatio).toFixed(2));

  // Soviet Indralin B-190 DRF = 1.45 & Indian INMAS RP-1 DRF = 1.38 reduction on hematopoietic BFO dose
  const indralinDrfApplied = input.indralinB190Taken
    ? 1.45
    : input.isroYogaAndRp1Active
      ? 1.38
      : 1.0;
  const effectiveBfoDoseProtectedMSv = Number(
    (effectiveBfoDoseRawMSv / indralinDrfApplied).toFixed(2)
  );
  const bfoDoseSavedByIndralinMSv = Number(
    (effectiveBfoDoseRawMSv - effectiveBfoDoseProtectedMSv).toFixed(2)
  );

  // 1. MONGOLIA / INTERKOSMOS (Soyuz-39 Krovoobrashcheniye & Vorotnik equations)
  const gravityUnloadingFactor = Math.max(0, 1 - env.gravityG);
  const baseFluidShiftMl =
    680 * gravityUnloadingFactor * (1 - Math.exp(-(input.missionDays * 24) / 14.5));
  const vorotnikAndChibisReduction =
    (input.vorotnikCollarActive ? 145 : 0) +
    (input.chibisLbnpActive ? 290 : 0) +
    (input.dlrCentrifugeActive ? 210 : 0);
  const cephaladFluidShiftMl = Math.max(
    60,
    Math.round(baseFluidShiftMl - vorotnikAndChibisReduction + (map - 90) * 1.4)
  );

  // Kubicek Impedance Rheography stroke volume approximation
  const kubicekStrokeVolumeMl = Math.round(
    Math.max(48, Math.min(115, 74 + (pulsePressure - 40) * 0.65 - (input.heartRateBpm - 72) * 0.35))
  );

  // Vorotnik SMS probability (peaks Days 1-4, reduced 64% by Vorotnik collar & 28% by PC6 TEAS & ISRO Yoga)
  const earlyAdaptationFactor = input.missionDays <= 5 ? 1.0 : Math.exp(-(input.missionDays - 5) / 12);
  const rawSmsRisk = Math.min(
    92,
    Math.max(12, 58 * earlyAdaptationFactor + (100 - input.hrvRmssdMs) * 0.32)
  );
  const smsMultiplier =
    (input.vorotnikCollarActive ? 0.36 : 1.0) *
    (input.taikongYangxinAndPc6Active ? 0.72 : 1.0) *
    (input.isroYogaAndRp1Active ? 0.78 : 1.0);
  const smsProbabilityPct = Math.round(rawSmsRisk * smsMultiplier);

  const circadianPhaseDriftHours = Number(
    (1.8 * Math.min(1.5, Math.log10(input.missionDays + 1)) * (1 + input.stressScore / 150)).toFixed(2)
  );
  const visualContrastLossPct = Number(
    Math.min(24.0, (cephaladFluidShiftMl / 680) * 14.5).toFixed(1)
  );
  const soyuz39DoseMultiple = Number((effectiveBfoDoseProtectedMSv / 1.48).toFixed(2));

  // 2. USSR / RUSSIA (Roscosmos IBMP Chibis LBNP & Indralin B-190)
  // Recommended Chibis vacuum in mmHg (-25 to -50 mmHg)
  const recommendedChibisVacuumMmHg = -Math.min(
    50,
    Math.max(25, Math.round(28 + (cephaladFluidShiftMl - 300) / 18 + (map - 88) * 0.35))
  );
  const chibisCaudalFluidRedistributionMl = Math.round(
    12.8 * Math.abs(recommendedChibisVacuumMmHg)
  );
  const careerLimit1000Pct = Number(((effectiveBfoDoseProtectedMSv / 1000) * 100).toFixed(2));
  const polyakov437dDoseMultiple = Number((effectiveBfoDoseProtectedMSv / 312.0).toFixed(2));

  // 3. CHINA (CMSA / ACC Taikong Yangxin Wan & PC6 TEAS + Chang'e-4 LND)
  const projectedHrvWithTcmMs = Math.round(
    input.hrvRmssdMs * (input.taikongYangxinAndPc6Active ? 1.22 : 1.0)
  );
  const endothelialNitricOxideGainPct = input.taikongYangxinAndPc6Active ? 31 : 0;
  const autonomicBalanceScore = Math.min(
    100,
    Math.max(
      15,
      Math.round(
        projectedHrvWithTcmMs * 0.85 +
          (100 - input.stressScore) * 0.35 +
          (input.taikongYangxinAndPc6Active ? 12 : 0)
      )
    )
  );
  const change4LunarDaysEquivalent = Number((effectiveBfoDoseProtectedMSv / 1.369).toFixed(1));

  // 4. USA (NASA STD-3001 600 mSv Career PEL, REID %, Twins Study Vascular/SANS)
  const careerLimit600Pct = Number(((effectiveBfoDoseProtectedMSv / 600) * 100).toFixed(2));
  const reidCancerRiskPct = Number(((effectiveBfoDoseProtectedMSv / 600) * 3.0).toFixed(2));
  const carotidImtThickeningPct = Number(
    Math.min(28.0, (input.missionDays / 340) * 19.0 * (input.taikongYangxinAndPc6Active ? 0.74 : 1.0)).toFixed(1)
  );
  const telomereElongationPct = Number(
    Math.min(21.0, (input.missionDays / 340) * 14.5).toFixed(1)
  );
  const sansOpticEdemaRiskPct = Math.min(
    95,
    Math.round((cephaladFluidShiftMl / 650) * 42 + (input.missionDays / 180) * 28)
  );
  const statusVsPel: "NOMINAL" | "CAUTION" | "EXCEEDS_NASA_600_PEL" =
    effectiveBfoDoseProtectedMSv >= 600
      ? "EXCEEDS_NASA_600_PEL"
      : effectiveBfoDoseProtectedMSv >= 250
        ? "CAUTION"
        : "NOMINAL";

  // 5. EUROPE & JAPAN (ESA Matroshka & JAXA Bisphosphonate + Pingvin/ARED)
  const months = input.missionDays / 30;
  const bmdLossUnprotectedPct = Number((-1.5 * months * gravityUnloadingFactor).toFixed(2));
  const bmdLossProtectedPct = Number(
    (
      (input.bisphosphonateAndPingvinActive ? -0.08 : -1.5) *
      months *
      gravityUnloadingFactor
    ).toFixed(2)
  );
  const bmdSavedPct = Number(
    Math.abs(bmdLossUnprotectedPct - bmdLossProtectedPct).toFixed(2)
  );
  const urinaryCalciumMgDay = Math.round(
    input.bisphosphonateAndPingvinActive
      ? 165
      : 180 + 115 * gravityUnloadingFactor
  );

  // 6. INTERNATIONAL COALITION (Bulgaria Liulin, Germany DLR Centrifuge, India ISRO/INMAS, Turkey TUA Vokalkord, Korea KASA IOP)
  const bulgariaLiulinSiliconAbsorbedDoseMGy = Number(
    (effectiveSkinDoseMSv / (env.meanQualityFactorQ * 1.11)).toFixed(2)
  );
  const bulgariaLiulinMeanLetKeVUm = Number((env.meanQualityFactorQ * 3.45).toFixed(2));

  // DLR Short-Arm Human Centrifuge (r = 3.8 m): target G at feet = 1.5G to 2.0G depending on cephalad shift
  const dlrCentrifugeFootGLoad = Number(
    Math.min(2.2, Math.max(1.2, 1.2 + (cephaladFluidShiftMl / 680) * 0.85)).toFixed(2)
  );
  // a_c = omega^2 * r => omega = sqrt(G * 9.81 / 3.8), RPM = omega * 60 / (2*pi)
  const omegaRadS = Math.sqrt((dlrCentrifugeFootGLoad * 9.81) / 3.8);
  const dlrCentrifugeRequiredRpm = Number(((omegaRadS * 60) / (2 * Math.PI)).toFixed(1));

  const isroYogaAndRp1Drf = input.isroYogaAndRp1Active ? 1.38 : 1.0;
  const isroPranayamaVagalHrvMs = Math.round(
    input.hrvRmssdMs * (input.isroYogaAndRp1Active ? 1.26 : 1.0)
  );
  // Turkey TUA Vokalkord acoustic jitter % (normal < 1.04%, rises with cephalad laryngeal edema & hypoxia)
  const tuaVokalkordJitterPct = Number(
    (0.68 + (cephaladFluidShiftMl / 500) * 0.92 + Math.max(0, 98 - input.spo2Pct) * 0.14).toFixed(2)
  );
  // South Korea KASA Yi So-yeon Intraocular Pressure (IOP in mmHg, baseline 14.5 mmHg)
  const kasaIntraocularPressureMmHg = Number(
    (14.5 + (cephaladFluidShiftMl / 680) * 7.8).toFixed(1)
  );

  return {
    meanArterialPressureMmHg: map,
    pulsePressureMmHg: pulsePressure,
    effectiveSkinDoseMSv,
    effectiveBfoDoseRawMSv,
    effectiveBfoDoseProtectedMSv,
    skinToBfoRatio,
    mongolia: {
      cephaladFluidShiftMl,
      kubicekStrokeVolumeMl,
      smsProbabilityPct,
      circadianPhaseDriftHours,
      visualContrastLossPct,
      soyuz39DoseMultiple,
      recommendation: input.vorotnikCollarActive
        ? `Vorotnik Cervical Collar ACTIVE: Cephalad fluid shift attenuated to ${cephaladFluidShiftMl} mL; SMS risk suppressed to ${smsProbabilityPct}%.`
        : `Deploy Soyuz-39 'Vorotnik' pneumatic cervical collar (30 mmHg) to cut SMS risk from ${smsProbabilityPct}% to ${Math.round(smsProbabilityPct * 0.36)}%.`,
    },
    roscosmos: {
      recommendedChibisVacuumMmHg,
      chibisCaudalFluidRedistributionMl,
      indralinDrfApplied,
      bfoDoseSavedByIndralinMSv,
      careerLimit1000Pct,
      polyakov437dDoseMultiple,
      recommendation: input.indralinB190Taken
        ? `Indralin (B-190) 450mg ACTIVE (DRF=1.45): Saved ${bfoDoseSavedByIndralinMSv} mSv BFO marrow dose. Run Chibis LBNP at ${recommendedChibisVacuumMmHg} mmHg.`
        : hourlyDoseUSv > 80
          ? `HIGH RADIATION FLUX: Administer 450 mg Soviet Indralin (B-190) immediately (DRF=1.45) to cut marrow dose by 31%.`
          : `Prescribe IBMP Chibis LBNP vacuum at ${recommendedChibisVacuumMmHg} mmHg to shift ${chibisCaudalFluidRedistributionMl} mL caudally.`,
    },
    cmsa: {
      autonomicBalanceScore,
      projectedHrvWithTcmMs,
      endothelialNitricOxideGainPct,
      change4LunarDaysEquivalent,
      recommendation: input.taikongYangxinAndPc6Active
        ? `Taikong Yangxin Wan + Neiguan (PC6) TEAS ACTIVE: HRV boosted to ${projectedHrvWithTcmMs} ms (+22%), eNOS NO +31%.`
        : `Activate Neiguan (PC6) 2/100 Hz acupoint stimulation under Watch H1 strap + Taikong Yangxin Wan to raise HRV RMSSD by +22%.`,
    },
    nasa: {
      careerLimit600Pct,
      reidCancerRiskPct,
      carotidImtThickeningPct,
      telomereElongationPct,
      sansOpticEdemaRiskPct,
      statusVsPel,
      recommendation:
        statusVsPel === "EXCEEDS_NASA_600_PEL"
          ? `CRITICAL: Dose (${effectiveBfoDoseProtectedMSv} mSv) exceeds NASA-STD-3001 600 mSv Career Limit (REID ${reidCancerRiskPct}%). Enter HDPE shelter & deploy AstroRad vest.`
          : `Within NASA-STD-3001 600 mSv PEL (${careerLimit600Pct}% used, REID ${reidCancerRiskPct}%). Monitor SANS optic disc edema risk (${sansOpticEdemaRiskPct}%).`,
    },
    esaJaxa: {
      bmdLossUnprotectedPct,
      bmdLossProtectedPct,
      bmdSavedPct,
      urinaryCalciumMgDay,
      matroshkaAttenuationFactor: skinToBfoRatio,
      recommendation: input.bisphosphonateAndPingvinActive
        ? `JAXA Bisphosphonate + Pingvin/ARED ACTIVE: Bone loss suppressed to ${bmdLossProtectedPct}% (saved ${bmdSavedPct}% BMD; urinary Ca²⁺ normalized to ${urinaryCalciumMgDay} mg/d).`
        : `Unprotected bone loss projected at ${bmdLossUnprotectedPct}% with hypercalciuria (${urinaryCalciumMgDay} mg/d). Initiate JAXA Alendronate 70mg/wk + ARED/Pingvin.`,
    },
    internationalCoalition: {
      bulgariaLiulinSiliconAbsorbedDoseMGy,
      bulgariaLiulinMeanLetKeVUm,
      dlrCentrifugeRequiredRpm,
      dlrCentrifugeFootGLoad,
      isroYogaAndRp1Drf,
      isroPranayamaVagalHrvMs,
      tuaVokalkordJitterPct,
      kasaIntraocularPressureMmHg,
      recommendation: `DLR Centrifuge Rx: ${dlrCentrifugeRequiredRpm} RPM (${dlrCentrifugeFootGLoad}G at feet) | Bulgaria Liulin Si Dose: ${bulgariaLiulinSiliconAbsorbedDoseMGy} mGy | ISRO Pranayama HRV: ${isroPranayamaVagalHrvMs} ms | KASA IOP: ${kasaIntraocularPressureMmHg} mmHg.`,
    },
  };
}

