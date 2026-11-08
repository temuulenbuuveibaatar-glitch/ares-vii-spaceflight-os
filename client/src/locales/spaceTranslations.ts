import { useLanguage } from "../contexts/LanguageContext";

export type SpaceLanguageCode = "en" | "mn" | "ru" | "zh" | "ja" | "de" | "es" | "ko";

export interface SpaceLanguageOption {
  code: SpaceLanguageCode;
  name: string;
  nativeName: string;
  agency: string;
}

export const SPACE_LANGUAGES: SpaceLanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", agency: "NASA / ESA" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол", agency: "MARSA / МҮСХ" },
  { code: "ru", name: "Russian", nativeName: "Русский", agency: "ROSCOSMOS" },
  { code: "zh", name: "Chinese", nativeName: "中文", agency: "CMSA / CNSA" },
  { code: "ja", name: "Japanese", nativeName: "日本語", agency: "JAXA" },
  { code: "de", name: "German", nativeName: "Deutsch", agency: "DLR / ESA" },
  { code: "es", name: "Spanish", nativeName: "Español", agency: "AEE / ESA" },
  { code: "ko", name: "Korean", nativeName: "한국어", agency: "KASA / KARI" },
];

export interface SpaceTranslationDictionary {
  // Navigation Bar Items
  nav: {
    missionControl: string;
    xiaomiWatch: string;
    hermesCommand: string;
    emergencyProtocols: string;
    radiationProtocols: string;
    medications: string;
    symptomChecker: string;
    treatmentGuidelines: string;
    earthComms: string;
    evaSafety: string;
    home: string;
  };
  // Header & Mission Status
  header: {
    title: string;
    subtitle: string;
    missionClock: string;
    shipStatusNominal: string;
    shipStatusTakeover: string;
    shipStatusManualOverride: string;
    supabaseConnected: string;
    supabaseLocal: string;
  };
  // Mission Control Dashboard Headers
  dashboard: {
    title: string;
    subtitle: string;
    crewBiometricsTitle: string;
    spaceEnvironmentTitle: string;
    hermesAutonomyTitle: string;
    activeAlertsTitle: string;
    quickActionsTitle: string;
    missionElapsedTime: string;
    distanceFromEarth: string;
    lightTimeLatency: string;
    hullShieldingStatus: string;
  };
  // Xiaomi Watch H1 Telemetry Hub
  watch: {
    pageTitle: string;
    pageSubtitle: string;
    deviceModel: string;
    heartRate: string;
    spo2: string;
    bloodPressure: string;
    skinTemp: string;
    hrvStress: string;
    mentalHealthIndex: string;
    radiationDoseRate: string;
    cumulativeDose: string;
    sleepQuality: string;
    batteryLevel: string;
    connectBluetooth: string;
    disconnectBluetooth: string;
    bluetoothConnected: string;
    bluetoothStandby: string;
    simulatorActive: string;
    toggleSimulator: string;
    webhookBridgeTitle: string;
    ecgOscilloscopeTitle: string;
    ppgWaveformTitle: string;
    multiMetricTrendTitle: string;
    simulateAnomaliesTitle: string;
    simulateAnomaliesSubtitle: string;
    scenarioNominal: string;
    scenarioSolarStorm: string;
    scenarioCardiac: string;
    scenarioHypoxia: string;
    scenarioMentalCrisis: string;
    scenarioDebrisThreat: string;
    subagentInspectionTitle: string;
    microCuffActive: string;
  };
  // Hermes Autonomous AI Agent & Flight Control
  hermes: {
    pageTitle: string;
    pageSubtitle: string;
    autonomousTakeoverAlert: string;
    autonomousTakeoverSub: string;
    manualOverrideActiveAlert: string;
    manualOverrideButtonEngage: string;
    manualOverrideButtonResume: string;
    manualOverrideStatusAutonomous: string;
    manualOverrideStatusHuman: string;
    selectCrewCallsign: string;
    overrideConfirmNote: string;
    evasiveManeuver: string;
    fastestSafeEarthReturn: string;
    solarStormShieldAlign: string;
    nominalOrbitCruise: string;
    deltaVRequired: string;
    burnCountdown: string;
    gLoadLimit: string;
    estHoursToEarth: string;
    subagentsMatrixTitle: string;
    medSentinelName: string;
    medSentinelRole: string;
    radGuardName: string;
    radGuardRole: string;
    psyOracleName: string;
    psyOracleRole: string;
    navPilotName: string;
    navPilotRole: string;
    dsnCommsTitle: string;
    dsnActiveStation: string;
    dsnOneWayLatency: string;
    dsnSendToHouston: string;
    terminalTitle: string;
    terminalPlaceholder: string;
    terminalSend: string;
    supabaseModalTitle: string;
    supabaseModalDesc: string;
    supabaseSaveBtn: string;
  };
  // Space Radiation & Medications Headers
  medical: {
    spaceRadiationHeader: string;
    spaceRadiationSubtitle: string;
    medicationsHeader: string;
    medicationsSubtitle: string;
    countermeasureKit: string;
    radioprotectant: string;
    cardiacEmergencyKit: string;
    psychotropicSupport: string;
  };
}

export const spaceTranslations: Record<SpaceLanguageCode, SpaceTranslationDictionary> = {
  en: {
    nav: {
      missionControl: "Mission Control",
      xiaomiWatch: "Xiaomi Watch H1 Lab",
      hermesCommand: "Hermes AI & Ship Control",
      emergencyProtocols: "EVA & Flight Emergencies",
      radiationProtocols: "Radiation & Bio-Shield",
      medications: "Space Pharmacy",
      symptomChecker: "AI Triage & Diagnostics",
      treatmentGuidelines: "Micro-G Surgery & Care",
      earthComms: "DSN Houston Comms",
      evaSafety: "Fire & Cabin Life Support",
      home: "Command Deck",
    },
    header: {
      title: "HERMES • Sonnenblume DEEP SPACE MEDICAL & AUTONOMOUS FLIGHT SYSTEM",
      subtitle: "Xiaomi Watch H1 Telemetry • Autonomous Spacecraft Control • Multi-Subagent Triage",
      missionClock: "MET",
      shipStatusNominal: "AUTONOMOUS FLIGHT: NOMINAL",
      shipStatusTakeover: "ALERT: HERMES AI EMERGENCY SHIP TAKEOVER",
      shipStatusManualOverride: "CREW MANUAL FLIGHT OVERRIDE ACTIVE",
      supabaseConnected: "SUPABASE CLOUD SYNC: ONLINE",
      supabaseLocal: "TELEMETRY BUFFER: LOCAL + READY",
    },
    dashboard: {
      title: "Sonnenblume Deep Space Medical & Flight Command",
      subtitle: "Real-Time Xiaomi Watch H1 Biometrics, Radiation Dosimetry & Hermes AI Autonomous Navigation",
      crewBiometricsTitle: "Xiaomi Watch H1 Crew Biometrics",
      spaceEnvironmentTitle: "Deep Space Radiation & Cabin Telemetry",
      hermesAutonomyTitle: "Hermes AI Subagent Consensus",
      activeAlertsTitle: "Active Mission Anomalies & Countermeasures",
      quickActionsTitle: "Emergency Flight & Medical Protocols",
      missionElapsedTime: "Mission Elapsed Time",
      distanceFromEarth: "Distance from Earth",
      lightTimeLatency: "DSN One-Way Light Time",
      hullShieldingStatus: "Magneto-Water Storm Shelter",
    },
    watch: {
      pageTitle: "Xiaomi Watch H1 Biometric & Anomaly Testing Lab",
      pageSubtitle: "Medical-Grade Wearable ECG, Micro-Pump Cuff BP, SpO2, HRV & Personal Radiation Dosimeter",
      deviceModel: "Xiaomi Watch H1 (Space-Grade Medical Firmware v4.8)",
      heartRate: "Heart Rate (ECG/PPG)",
      spo2: "Blood Oxygen (SpO2)",
      bloodPressure: "Blood Pressure (Micro-Cuff)",
      skinTemp: "Core/Skin Temperature",
      hrvStress: "HRV (RMSSD) & Autonomic Stress",
      mentalHealthIndex: "Mental Health & Cognitive Index",
      radiationDoseRate: "Personal Radiation Dose Rate",
      cumulativeDose: "Mission Cumulative Dose",
      sleepQuality: "Circadian & REM Recovery",
      batteryLevel: "Watch Battery",
      connectBluetooth: "Pair Real Xiaomi Watch H1 via Bluetooth BLE",
      disconnectBluetooth: "Disconnect Bluetooth Watch",
      bluetoothConnected: "LIVE BLE STREAM ACTIVE",
      bluetoothStandby: "BLE STANDBY (SIMULATOR RUNNING)",
      simulatorActive: "1Hz Hardware Telemetry Simulator",
      toggleSimulator: "Toggle Live Telemetry Stream",
      webhookBridgeTitle: "Xiaomi Mi Fitness / Gadgetbridge HTTP Webhook Endpoint",
      ecgOscilloscopeTitle: "Real-Time Lead-I ECG & Photoplethysmography (PPG) Oscilloscope",
      ppgWaveformTitle: "Optical PPG Pulse Wave & Micro-Cuff Arterial Pressure",
      multiMetricTrendTitle: "Multi-Metric Biometric & Radiation Telemetry Trend",
      simulateAnomaliesTitle: "Mission Anomaly Injector & Hermes AI Response Lab",
      simulateAnomaliesSubtitle: "Inject extreme deep-space emergencies into the Xiaomi Watch H1 stream to test Hermes AI detection & ship takeover",
      scenarioNominal: "Nominal EVA / Orbit Baseline",
      scenarioSolarStorm: "Solar Particle Event (SPE > 650 µSv/h)",
      scenarioCardiac: "Cardiac Arrhythmia / Tachycardia Crisis",
      scenarioHypoxia: "Cabin Depressurization / Hypoxia",
      scenarioMentalCrisis: "Acute Isolation Panic & Sleep Deprivation",
      scenarioDebrisThreat: "Orbital Debris Swarm Threat (Evasive Burn)",
      subagentInspectionTitle: "Hermes Subagent Real-Time Telemetry Inspection Feed",
      microCuffActive: "Micro-pump airbag cuff pressurized",
    },
    hermes: {
      pageTitle: "Hermes Full-Access Autonomous AI & Ship Flight Control",
      pageSubtitle: "4-Subagent Medical/Flight Matrix, Autonomous Trajectory Takeover, DSN Houston Comms & Human Manual Override",
      autonomousTakeoverAlert: "AUTONOMOUS SHIP TAKEOVER ACTIVE • CREW IN DANGER",
      autonomousTakeoverSub: "Hermes AI has assumed full attitude, propulsion, and life-support authority to protect incapacitated crew.",
      manualOverrideActiveAlert: "HUMAN MANUAL OVERRIDE ENGAGED • CREW IN DIRECT COMMAND",
      manualOverrideButtonEngage: "ENGAGE HUMAN MANUAL OVERRIDE",
      manualOverrideButtonResume: "RESUME HERMES AUTONOMOUS AUTHORITY",
      manualOverrideStatusAutonomous: "AI AUTOPILOT AUTHORITY: FULL ACCESS",
      manualOverrideStatusHuman: "HUMAN PILOT AUTHORITY: LOCKED TO CREW",
      selectCrewCallsign: "Authorizing Crew Member",
      overrideConfirmNote: "Any conscious astronaut can override Hermes AI propulsion & trajectory control at any time.",
      evasiveManeuver: "Evasive Debris Avoidance Burn",
      fastestSafeEarthReturn: "Fastest Safe Earth Return (Lambert Burn)",
      solarStormShieldAlign: "Solar Storm Tail-First Shield Orientation",
      nominalOrbitCruise: "Nominal Deep Space Cruise Attitude",
      deltaVRequired: "Calculated Delta-V",
      burnCountdown: "Thruster Ignition Countdown",
      gLoadLimit: "Medically Capped G-Load Limit",
      estHoursToEarth: "Est. Time to Earth Entry Interface",
      subagentsMatrixTitle: "Hermes 4-Subagent Autonomous Consensus Matrix",
      medSentinelName: "MED-SENTINEL",
      medSentinelRole: "Xiaomi Watch H1 Bio-Med & Cardiac Triage",
      radGuardName: "RAD-GUARD",
      radGuardRole: "Solar Particle Dosimetry & Magnetic Shielding",
      psyOracleName: "PSY-ORACLE",
      psyOracleRole: "HRV Behavioral Health & Cognitive Fatigue",
      navPilotName: "NAV-PILOT",
      navPilotRole: "Astrodynamics, Evasive Burn & Earth Return",
      dsnCommsTitle: "NASA Deep Space Network (DSN) Continuous Earth Uplink",
      dsnActiveStation: "Active DSN Complex",
      dsnOneWayLatency: "One-Way Light Time Latency",
      dsnSendToHouston: "Transmit Priority Telemetry Packet to Houston CAPCOM",
      terminalTitle: "Hermes Full-Access Ship & Medical Command Terminal",
      terminalPlaceholder: "Command Hermes AI (e.g., 'Analyze Xiaomi H1 ECG', 'Calculate fastest safe return under 2.2G')...",
      terminalSend: "Execute Command",
      supabaseModalTitle: "Supabase Live Mission Telemetry Database",
      supabaseModalDesc: "Connect your Supabase project to persist Xiaomi Watch H1 biometrics, Hermes takeover logs, and DSN transmissions.",
      supabaseSaveBtn: "Connect & Sync Supabase",
    },
    medical: {
      spaceRadiationHeader: "Deep Space Radiation Dosimetry & SPE Countermeasures",
      spaceRadiationSubtitle: "Real-Time Solar Particle Event Monitoring, Organ Dose Limits & Radioprotectant Protocols",
      medicationsHeader: "Spacecraft Autonomous Pharmacy & Countermeasure Formulary",
      medicationsSubtitle: "Microgravity-Stable Injectables, Radioprotectants, Antiarrhythmics & Behavioral Therapeutics",
      countermeasureKit: "ISS / Artemis Advanced ALS Medical Pack",
      radioprotectant: "Potassium Iodide / Amifostine / Filgrastim G-CSF",
      cardiacEmergencyKit: "Amiodarone / Epinephrine / Auto-Defibrillator",
      psychotropicSupport: "Modafinil / Melatonin / Intranasal Midazolam",
    },
  },
  mn: {
    nav: {
      missionControl: "Удирдлагын Төв",
      xiaomiWatch: "Xiaomi Watch H1 Лаб",
      hermesCommand: "Hermes AI & Хөлгийн Удирдлага",
      emergencyProtocols: "Сансрын Ослын Протокол",
      radiationProtocols: "Цацрагийн Хамгаалалт",
      medications: "Сансрын Эмийн Сан",
      symptomChecker: "AI Оношилгоо",
      treatmentGuidelines: "Жингүйдлийн Эмчилгээ",
      earthComms: "Дэлхийтэй Харилцах (DSN)",
      evaSafety: "Амьдрал Тэтгэх Систем",
      home: "Үндсэн Самбар",
    },
    header: {
      title: "HERMES // АРЕС-VII ГҮН САНСРЫН ЭМНЭЛЭГ БА АВТОНОМИТ НИСЛЭГИЙН СИСТЕМ",
      subtitle: "Xiaomi Watch H1 Телеметр • Хөлгийн Автомат Удирдлага • Олон Агенттай AI Оношилгоо",
      missionClock: "Нислэгийн Цаг",
      shipStatusNominal: "АВТОМАТ НИСЛЭГ: ХЭВИЙН",
      shipStatusTakeover: "АНХААР: HERMES AI ХӨЛГИЙН УДИРДЛАГЫГ АВЛАА",
      shipStatusManualOverride: "НИСГЭГЧИЙН ГАР УДИРДЛАГА ИДЭВХТЭЙ",
      supabaseConnected: "SUPABASE ҮҮЛЭН СИНК: ХОЛБОГДСОН",
      supabaseLocal: "ТЕЛЕМЕТР: ДОТООД САнах ОЙД БЭЛЭН",
    },
    dashboard: {
      title: "АРЕС-VII Гүн Сансрын Эмнэлэг ба Нислэгийн Удирдлага",
      subtitle: "Xiaomi Watch H1 биометр, цацрагийн тун хэмжигч ба Hermes AI автономит навигаци",
      crewBiometricsTitle: "Xiaomi Watch H1 Багийн Биометр",
      spaceEnvironmentTitle: "Сансрын Цацраг ба Бүхээгийн Орчин",
      hermesAutonomyTitle: "Hermes AI Дэд Агентуудын Шийдвэр",
      activeAlertsTitle: "Идэвхтэй Гажиг ба Хариу Арга Хэмжээ",
      quickActionsTitle: "Яаралтай Нислэг ба Эмнэлгийн Протокол",
      missionElapsedTime: "Нислэгийн Үргэлжилсэн Хугацаа",
      distanceFromEarth: "Дэлхийгээс Алслагдсан Зай",
      lightTimeLatency: "Дохио Дамжих Хугацаа",
      hullShieldingStatus: "Соронзон-Усан Цацрагийн Хаалт",
    },
    watch: {
      pageTitle: "Xiaomi Watch H1 Биометр ба Гажиг Турших Лаборатори",
      pageSubtitle: "Эмнэлгийн Зэрэглэлийн Зүрхний Бичлэг (ECG), Хийн Шахуургат Даралт, SpO2, HRV ба Цацраг Хэмжигч",
      deviceModel: "Xiaomi Watch H1 (Сансрын Эмнэлгийн Програм v4.8)",
      heartRate: "Зүрхний Цохилт (ECG/PPG)",
      spo2: "Цусны Хүчилтөрөгч (SpO2)",
      bloodPressure: "Цусны Даралт (Бичил Манжет)",
      skinTemp: "Арьсны Температур",
      hrvStress: "Зүрхний Хэмнэл (HRV) & Стресс",
      mentalHealthIndex: "Сэтгэцийн Эрүүл Мэндийн Индекс",
      radiationDoseRate: "Цацрагийн Тунгийн Хурд",
      cumulativeDose: "Хуримтлагдсан Цацрагийн Тун",
      sleepQuality: "Нойр ба Сэргэлтийн Индекс",
      batteryLevel: "Цагны Цэнэг",
      connectBluetooth: "Бодит Xiaomi Watch H1-ийг Bluetooth BLE-ээр Холбох",
      disconnectBluetooth: "Bluetooth Холболт Салгах",
      bluetoothConnected: "ШУУД BLE ДАМЖУУЛАЛТ ИДЭВХТЭЙ",
      bluetoothStandby: "BLE ХҮЛЭЭЛТИЙН ГОРИМ (СИМУЛЯТОР АЖИЛЛАЖ БАЙНА)",
      simulatorActive: "1Hz Техник Хангамжийн Телеметр Симулятор",
      toggleSimulator: "Шууд Телеметрийн Урсгал Асаах/Унтраах",
      webhookBridgeTitle: "Xiaomi Mi Fitness / Gadgetbridge Webhook Холбоос",
      ecgOscilloscopeTitle: "Бодит Хугацааны ECG ба Фотоплетизмографи (PPG) Осциллограф",
      ppgWaveformTitle: "Оптик Пульс ба Артерийн Даралтын Долгион",
      multiMetricTrendTitle: "Олон Үзүүлэлттэй Биометр ба Цацрагийн График",
      simulateAnomaliesTitle: "Сансрын Осол Турших ба Hermes AI Шалгах Самбар",
      simulateAnomaliesSubtitle: "Xiaomi Watch H1 руу онцгой байдлын өгөгдөл илгээж Hermes AI хэрхэн хөлгийг удирдахыг шалгана уу",
      scenarioNominal: "Хэвийн Нислэг / Орбитын Суурь Төлөв",
      scenarioSolarStorm: "Нарны Шуурга (Цацраг > 650 µSv/h)",
      scenarioCardiac: "Зүрхний Хэм Алдагдал / Тахикарди Хямрал",
      scenarioHypoxia: "Бүхээгийн Даралт Уналт / Хүчилтөрөгчийн Дутагдал",
      scenarioMentalCrisis: "Ганцаардлын Паник ба Нойрны Хомсдол",
      scenarioDebrisThreat: "Сансрын Хог Хаягдлын Мөргөлдөх Аюул",
      subagentInspectionTitle: "Hermes Дэд Агентуудын Шууд Хяналтын Мэдээлэл",
      microCuffActive: "Бичил хийн манжет даралт хэмжиж байна",
    },
    hermes: {
      pageTitle: "Hermes Бүрэн Эрхт Автономит AI & Хөлгийн Удирдлагын Төв",
      pageSubtitle: "4 Дэд Агент, Автомат Траектор Шилжүүлэлт, Дэлхийтэй Харилцах DSN ба Хүний Гар Удирдлага",
      autonomousTakeoverAlert: "ХӨЛГИЙН АВТОНОМИТ УДИРДЛАГА ИДЭВХЖЛЭЭ • БАГ АЮУЛД БАЙНА",
      autonomousTakeoverSub: "Hermes AI багийн амь насыг хамгаалахын тулд хөдөлгүүр, чиглэл ба амьдрал тэтгэх системийг бүрэн удирдлагадаа авлаа.",
      manualOverrideActiveAlert: "ХҮНИЙ ГАР УДИРДЛАГА ИДЭВХТЭЙ • БАГ ХӨЛГИЙГ ШУУД УДИРДАЖ БАЙНА",
      manualOverrideButtonEngage: "ХҮНИЙ ГАР УДИРДЛАГАД ШИЛЖҮҮЛЭХ (OVERRIDE)",
      manualOverrideButtonResume: "HERMES AI АВТОМАТ УДИРДЛАГЫГ СЭРГЭЭХ",
      manualOverrideStatusAutonomous: "AI АВТОПИЛОТЫН ЭРХ: БҮРЭН ЭРХТЭЙ",
      manualOverrideStatusHuman: "НИСГЭГЧИЙН ЭРХ: ГАР УДИРДЛАГАД ТҮГЖИГДСЭН",
      selectCrewCallsign: "Зөвшөөрөл Олгох Нисгэгч",
      overrideConfirmNote: "Ухаантай байгаа аль ч сансрын нисгэгч Hermes AI-ийн удирдлагыг хэзээ ч цуцалж гар удирдлагад шилжүүлэх боломжтой.",
      evasiveManeuver: "Мөргөлдөөнөөс Зайлсхийх Маневр",
      fastestSafeEarthReturn: "Дэлхий рүү Хамгийн Хурдан Аюулгүй Буцах Траектор",
      solarStormShieldAlign: "Нарны Шуурганы Хаалт Чиглүүлэлт",
      nominalOrbitCruise: "Хэвийн Аяллын Чиглэл",
      deltaVRequired: "Шаардлагатай Хурдны Өөрчлөлт (Delta-V)",
      burnCountdown: "Хөдөлгүүр Асах Тооллого",
      gLoadLimit: "Эмнэлгийн Хязгаарласан Хурдатгал (G-Load)",
      estHoursToEarth: "Дэлхийд Ойртох Тооцоолсон Хугацаа",
      subagentsMatrixTitle: "Hermes 4 Дэд Агентын Автономит Матриц",
      medSentinelName: "MED-SENTINEL",
      medSentinelRole: "Xiaomi Watch H1 Био-Эмнэлэг & Зүрхний Хяналт",
      radGuardName: "RAD-GUARD",
      radGuardRole: "Цацрагийн Тун & Соронзон Хаалт",
      psyOracleName: "PSY-ORACLE",
      psyOracleRole: "HRV Сэтгэл Зүй & Танин Мэдэхүйн Ядаргаа",
      navPilotName: "NAV-PILOT",
      navPilotRole: "Астродинамик, Бултах Маневр & Дэлхий рүү Буцах",
      dsnCommsTitle: "NASA Гүн Сансрын Сүлжээ (DSN) Дэлхийтэй Харилцах Суваг",
      dsnActiveStation: "Идэвхтэй DSN Станц",
      dsnOneWayLatency: "Дохионы Нэг Талын Хоцрогдол",
      dsnSendToHouston: "Хьюстон Төв рүү Яаралтай Мэдээ Илгээх",
      terminalTitle: "Hermes Бүрэн Эрхт Хөлөг ба Эмнэлгийн Терминал",
      terminalPlaceholder: "Hermes AI-д тушаал өгөх (ж.нь: 'Xiaomi H1 зүрхний бичлэг шинжил', 'Дэлхий рүү буцах зам тооцоол')...",
      terminalSend: "Тушаал Гүйцэтгэх",
      supabaseModalTitle: "Supabase Үүлэн Телеметрийн Өгөгдлийн Сан",
      supabaseModalDesc: "Xiaomi Watch H1 биометр болон Hermes AI шийдвэрүүдийг Supabase санд шууд хадгалах.",
      supabaseSaveBtn: "Supabase Холбох & Хадгалах",
    },
    medical: {
      spaceRadiationHeader: "Гүн Сансрын Цацрагийн Хяналт ба Хамгаалах Протокол",
      spaceRadiationSubtitle: "Нарны Эгэл Бөөмсийн Шуурга, Эрхтний Тунгийн Хязгаар ба Цацрагийн Эсрэг Эмчилгээ",
      medicationsHeader: "Хөлгийн Автономит Эмийн Сан ба Тарилгын Жагсаалт",
      medicationsSubtitle: "Жингүйдэлд Тогтвортой Тарилга, Цацрагаас Хамгаалах Бэлдмэл, Зүрхний Хэм Засагч",
      countermeasureKit: "ОУСС / Артемис Яаралтай Тусламжийн Багц",
      radioprotectant: "Калийн Иодид / Амифостин / Филграстим G-CSF",
      cardiacEmergencyKit: "Амиодарон / Эпинефрин / Автомат Дефибриллятор",
      psychotropicSupport: "Модафинил / Мелатонин / Мидазолам",
    },
  },
  ru: {
    nav: {
      missionControl: "ЦУП Миссии",
      xiaomiWatch: "Лаборатория Xiaomi Watch H1",
      hermesCommand: "ИИ Hermes и Управление Кораблём",
      emergencyProtocols: "Аварийные Протоколы ВКД",
      radiationProtocols: "Радиационная Защита",
      medications: "Бортовая Аптека",
      symptomChecker: "ИИ-Триаж и Диагностика",
      treatmentGuidelines: "Хирургия в Невесомости",
      earthComms: "Дальняя Связь DSN",
      evaSafety: "СЖО и Пожарная Безопасность",
      home: "Командная Палуба",
    },
    header: {
      title: "HERMES // АРЕС-VII МЕДИЦИНСКАЯ И АВТОНОМНАЯ НАВИГАЦИОННАЯ СИСТЕМА",
      subtitle: "Телеметрия Xiaomi Watch H1 • Автономное Управление Кораблём • Мультиагентный ИИ",
      missionClock: "ПВМ",
      shipStatusNominal: "АВТОНОМНЫЙ ПОЛЁТ: ШТАТНО",
      shipStatusTakeover: "ТРЕВОГА: ПЕРЕХВАТ УПРАВЛЕНИЯ КОРАБЛЁМ ИИ HERMES",
      shipStatusManualOverride: "РУЧНОЕ УПРАВЛЕНИЕ ЭКИПАЖЕМ АКТИВНО",
      supabaseConnected: "ОБЛАКО SUPABASE: ПОДКЛЮЧЕНО",
      supabaseLocal: "БУФЕР ТЕЛЕМЕТРИИ: ЛОКАЛЬНЫЙ",
    },
    dashboard: {
      title: "Центр Управления Полётом и Медициной АРЕС-VII",
      subtitle: "Биометрия Xiaomi Watch H1 в реальном времени, дозиметрия и автономная навигация ИИ Hermes",
      crewBiometricsTitle: "Биометрия Экипажа Xiaomi Watch H1",
      spaceEnvironmentTitle: "Радиационный Фон и Среда Отсека",
      hermesAutonomyTitle: "Консенсус Субагентов ИИ Hermes",
      activeAlertsTitle: "Активные Аномалии и Контрмеры",
      quickActionsTitle: "Экстренные Протоколы Полёта и Медицины",
      missionElapsedTime: "Полётное Время Миссии",
      distanceFromEarth: "Расстояние от Земли",
      lightTimeLatency: "Задержка Сигнала DSN",
      hullShieldingStatus: "Водно-Магнитный Радиационный Щит",
    },
    watch: {
      pageTitle: "Лаборатория Биометрии и Аномалий Xiaomi Watch H1",
      pageSubtitle: "Медицинская ЭКГ, Микрокомпрессорная Манжета АД, SpO2, ВСР и Индивидуальный Дозиметр",
      deviceModel: "Xiaomi Watch H1 (Космическая Мед-Прошивка v4.8)",
      heartRate: "Пульс (ЭКГ / ФПГ)",
      spo2: "Сатурация Кислорода (SpO2)",
      bloodPressure: "Артериальное Давление (Манжета)",
      skinTemp: "Температура Кожи/Тела",
      hrvStress: "ВСР (RMSSD) и Уровень Стресса",
      mentalHealthIndex: "Индекс Когнитивного и Психического Здоровья",
      radiationDoseRate: "Мощность Дозы Радиации",
      cumulativeDose: "Накопленная Доза за Миссию",
      sleepQuality: "Циркадный Ритм и Сон",
      batteryLevel: "Заряд Часов",
      connectBluetooth: "Подключить Xiaomi Watch H1 по Bluetooth BLE",
      disconnectBluetooth: "Отключить Часы Bluetooth",
      bluetoothConnected: "ПРЯМОЙ ПОТОК BLE АКТИВЕН",
      bluetoothStandby: "ОЖИДАНИЕ BLE (РАБОТАЕТ СИМУЛЯТОР)",
      simulatorActive: "Аппаратный Симулятор Телеметрии 1 Гц",
      toggleSimulator: "Переключить Поток Телеметрии",
      webhookBridgeTitle: "Webhook-мост Xiaomi Mi Fitness / Gadgetbridge",
      ecgOscilloscopeTitle: "Осциллограф ЭКГ (I отведение) и Фотоплетизмографии (ФПГ)",
      ppgWaveformTitle: "Пульсовая Волна ФПГ и Давление в Микроманжете",
      multiMetricTrendTitle: "Многопараметрический График Биометрии и Радиации",
      simulateAnomaliesTitle: "Инжектор Космических Аномалий и Тест ИИ Hermes",
      simulateAnomaliesSubtitle: "Смоделируйте критические нештатные ситуации в потоке Xiaomi Watch H1 для проверки реакции ИИ Hermes",
      scenarioNominal: "Штатный Режим ВКД / Орбита",
      scenarioSolarStorm: "Солнечный Протонный Шторм (> 650 мкЗв/ч)",
      scenarioCardiac: "Сердечная Аритмия / Тахикардия",
      scenarioHypoxia: "Разгерметизация Отсека / Гипоксия",
      scenarioMentalCrisis: "Острая Паника Изоляции и Депривация Сна",
      scenarioDebrisThreat: "Рой Орбитальных Обломков (Манёвр Уклонения)",
      subagentInspectionTitle: "Лента Анализа Телеметрии Субагентами Hermes",
      microCuffActive: "Микрокомпрессорная манжета накачана",
    },
    hermes: {
      pageTitle: "Центр Автономного ИИ Hermes и Управления Космическим Кораблём",
      pageSubtitle: "Матрица 4 Субагентов, Автономный Возврат на Землю, Связь DSN и Ручной Перехват Управления",
      autonomousTakeoverAlert: "АКТИВЕН АВТОНОМНЫЙ ПЕРЕХВАТ УПРАВЛЕНИЯ КОРАБЛЁМ • ЭКИПАЖ В ОПАСНОСТИ",
      autonomousTakeoverSub: "ИИ Hermes принял полное управление ориентацией, двигателями и СЖО для спасения экипажа.",
      manualOverrideActiveAlert: "ВКЛЮЧЕНО РУЧНОЕ УПРАВЛЕНИЕ • КОРАБЛЬ ПОД КОНТРОЛЕМ ЭКИПАЖА",
      manualOverrideButtonEngage: "ВКЛЮЧИТЬ РУЧНОЕ УПРАВЛЕНИЕ ЭКИПАЖА (OVERRIDE)",
      manualOverrideButtonResume: "ВЕРНУТЬ АВТОНОМНОЕ УПРАВЛЕНИЕ ИИ HERMES",
      manualOverrideStatusAutonomous: "АВТОПИЛОТ ИИ: ПОЛНЫЙ ДОСТУП",
      manualOverrideStatusHuman: "ПРИОРИТЕТ ЧЕЛОВЕКА: РУЧНОЙ КОНТРОЛЬ",
      selectCrewCallsign: "Авторизующий Космонавт",
      overrideConfirmNote: "Любой член экипажа в сознании может в любой момент отключить автопилот Hermes и взять управление на себя.",
      evasiveManeuver: "Манёвр Уклонения от Обломков",
      fastestSafeEarthReturn: "Быстрейший Безопасный Возврат к Земле (Импульс Ламберта)",
      solarStormShieldAlign: "Ориентация Кормовым Радиационным Щитом к Солнцу",
      nominalOrbitCruise: "Штатная Ориентация Межпланетного Перелёта",
      deltaVRequired: "Расчётная Характеристическая Скорость (Delta-V)",
      burnCountdown: "Отсчёт до Включения Маршевого Двигателя",
      gLoadLimit: "Медицинский Лимит Перегрузки (G)",
      estHoursToEarth: "Расчётное Время до Входа в Атмосферу Земли",
      subagentsMatrixTitle: "Матрица Консенсуса 4 Автономных Субагентов Hermes",
      medSentinelName: "MED-SENTINEL",
      medSentinelRole: "Биомедицина Xiaomi Watch H1 и Кардио-Триаж",
      radGuardName: "RAD-GUARD",
      radGuardRole: "Дозиметрия и Магнитно-Водяная Защита",
      psyOracleName: "PSY-ORACLE",
      psyOracleRole: "ВСР Психология и Когнитивная Усталость",
      navPilotName: "NAV-PILOT",
      navPilotRole: "Астродинамика, Манёвры и Возврат к Земле",
      dsnCommsTitle: "Дальняя Космическая Связь NASA DSN с Землёй",
      dsnActiveStation: "Активный Комплекс DSN",
      dsnOneWayLatency: "Односторонняя Задержка Сигнала",
      dsnSendToHouston: "Отправить Приоритетный Пакет Телеметрии в ЦУП",
      terminalTitle: "Терминал Полного Доступа ИИ Hermes",
      terminalPlaceholder: "Введите команду для ИИ Hermes (напр. 'Анализ ЭКГ Xiaomi H1', 'Расчёт возврата при 2.2G')...",
      terminalSend: "Выполнить",
      supabaseModalTitle: "Облачная База Телеметрии Supabase",
      supabaseModalDesc: "Подключите проект Supabase для сохранения биометрии Xiaomi Watch H1 и журналов управления кораблём.",
      supabaseSaveBtn: "Подключить и Синхронизировать",
    },
    medical: {
      spaceRadiationHeader: "Дозиметрия Глубокого Космоса и Противолучевые Протоколы",
      spaceRadiationSubtitle: "Мониторинг Солнечных Вспышек, Дозовые Пределы Органов и Радиопротекторы",
      medicationsHeader: "Автономная Бортовая Аптека и Реестр Препаратов",
      medicationsSubtitle: "Инъекционные Препараты для Невесомости, Радиопротекторы, Антиаритмики и Нейропротекторы",
      countermeasureKit: "Укладка Экстренной Реанимации МКС / Артемида",
      radioprotectant: "Йодид Калия / Амифостин / Филграстим",
      cardiacEmergencyKit: "Амиодарон / Эпинефрин / Авто-Дефибриллятор",
      psychotropicSupport: "Модафинил / Мелатонин / Мидазолам",
    },
  },
  zh: {
    nav: {
      missionControl: "任务控制中心",
      xiaomiWatch: "Xiaomi Watch H1 遥测实验室",
      hermesCommand: "Hermes AI 与飞船控制",
      emergencyProtocols: "出舱与飞行应急协议",
      radiationProtocols: "空间辐射与生物防护",
      medications: "太空药房",
      symptomChecker: "AI 医疗分诊",
      treatmentGuidelines: "微重力医疗指南",
      earthComms: "深空网 (DSN) 地球通信",
      evaSafety: "舱内环控与消防安全",
      home: "主控甲板",
    },
    header: {
      title: "HERMES // 阿瑞斯-VII 深空医疗与自主飞行控制系统",
      subtitle: "Xiaomi Watch H1 医疗遥测 • 飞船自主接管 • 多智能体协同分诊",
      missionClock: "任务历时",
      shipStatusNominal: "自主飞行状态：正常",
      shipStatusTakeover: "警报：HERMES AI 已紧急接管飞船控制权",
      shipStatusManualOverride: "航天员手动优先接管已激活",
      supabaseConnected: "SUPABASE 云端同步：在线",
      supabaseLocal: "遥测缓存：本地就绪",
    },
    dashboard: {
      title: "阿瑞斯-VII 深空医疗与飞行指挥中心",
      subtitle: "实时 Xiaomi Watch H1 生命体征、辐射剂量监测与 Hermes AI 自主导航",
      crewBiometricsTitle: "Xiaomi Watch H1 乘组生命体征",
      spaceEnvironmentTitle: "深空辐射与座舱环境遥测",
      hermesAutonomyTitle: "Hermes AI 子智能体协同决策",
      activeAlertsTitle: "当前异常警报与对抗措施",
      quickActionsTitle: "紧急飞行与医疗处置协议",
      missionElapsedTime: "任务已执行时间",
      distanceFromEarth: "距地球距离",
      lightTimeLatency: "DSN 单向光行时延迟",
      hullShieldingStatus: "磁水复合风暴屏蔽舱",
    },
    watch: {
      pageTitle: "Xiaomi Watch H1 生物遥测与异常注入实验室",
      pageSubtitle: "医疗级可穿戴单导联 ECG、微型气泵袖带血压、SpO2、HRV 与个人辐射剂量计",
      deviceModel: "Xiaomi Watch H1（宇航医疗固件 v4.8）",
      heartRate: "心率 (ECG/PPG)",
      spo2: "血氧饱和度 (SpO2)",
      bloodPressure: "微型气囊袖带血压",
      skinTemp: "核心/皮肤温度",
      hrvStress: "心率变异性 (HRV) 与自主神经压力",
      mentalHealthIndex: "心理健康与认知指数",
      radiationDoseRate: "个人辐射剂量率",
      cumulativeDose: "任务累计辐射剂量",
      sleepQuality: "昼夜节律与睡眠恢复",
      batteryLevel: "手表电量",
      connectBluetooth: "通过蓝牙 BLE 配对真实 Xiaomi Watch H1",
      disconnectBluetooth: "断开蓝牙手表连接",
      bluetoothConnected: "实时 BLE 数据流已激活",
      bluetoothStandby: "BLE 待机（硬件模拟器运行中）",
      simulatorActive: "1Hz 硬件级遥测模拟器",
      toggleSimulator: "切换实时遥测数据流",
      webhookBridgeTitle: "小米运动健康 / Gadgetbridge HTTP Webhook 桥接",
      ecgOscilloscopeTitle: "实时 I 导联心电图 (ECG) 与光电容积脉搏波 (PPG) 示波器",
      ppgWaveformTitle: "光学 PPG 脉搏波与微型气泵动脉压力曲线",
      multiMetricTrendTitle: "多维生命体征与空间辐射趋势图",
      simulateAnomaliesTitle: "深空异常注入器与 Hermes AI 响应测试台",
      simulateAnomaliesSubtitle: "向 Xiaomi Watch H1 数据流注入极端深空险情，验证 Hermes AI 实时诊断与飞船自主接管能力",
      scenarioNominal: "正常出舱 / 轨道基线状态",
      scenarioSolarStorm: "太阳质子事件 (SPE 辐射飙升 > 650 µSv/h)",
      scenarioCardiac: "心律失常 / 室性心动过速危象",
      scenarioHypoxia: "座舱失压 / 急性缺氧症",
      scenarioMentalCrisis: "急性幽闭恐慌与重度睡眠剥夺",
      scenarioDebrisThreat: "轨道碎片群碰撞威胁（紧急规避点火）",
      subagentInspectionTitle: "Hermes 四大子智能体实时遥测巡检日志",
      microCuffActive: "微型气泵气囊袖带加压测量中",
    },
    hermes: {
      pageTitle: "Hermes 全权限自主 AI 与飞船飞行控制中心",
      pageSubtitle: "四大医疗/飞行子智能体矩阵、自主轨道接管、深空网通信与航天员手动优先接管",
      autonomousTakeoverAlert: "飞船自主接管已激活 •• 乘组处于高危状态",
      autonomousTakeoverSub: "Hermes AI 已全面接管姿态、推进与环控生保系统，以保护失能或受威胁的航天员。",
      manualOverrideActiveAlert: "人工手动接管已启用 •• 乘组直接控制飞船",
      manualOverrideButtonEngage: "启用航天员手动接管 (MANUAL OVERRIDE)",
      manualOverrideButtonResume: "恢复 HERMES AI 自主飞行控制权",
      manualOverrideStatusAutonomous: "AI 自动驾驶权限：全权限接管",
      manualOverrideStatusHuman: "人工飞行权限：锁定为乘组手动控制",
      selectCrewCallsign: "授权接管航天员呼号",
      overrideConfirmNote: "任何意识清醒的航天员均可随时中断 Hermes AI 推进与轨道指令并夺回手动控制权。",
      evasiveManeuver: "空间碎片紧急规避点火",
      fastestSafeEarthReturn: "最快安全返回地球轨道（兰伯特变轨点火）",
      solarStormShieldAlign: "太阳风暴尾部防护盾定向姿态",
      nominalOrbitCruise: "深空巡航标准姿态",
      deltaVRequired: "所需速度增量 (Delta-V)",
      burnCountdown: "推进器点火倒计时",
      gLoadLimit: "医疗受限最大过载 (G-Load)",
      estHoursToEarth: "预计抵达地球再入走廊时间",
      subagentsMatrixTitle: "Hermes 四大子智能体自主协同矩阵",
      medSentinelName: "MED-SENTINEL (医疗哨兵)",
      medSentinelRole: "Xiaomi Watch H1 生物医学与心脏急救分诊",
      radGuardName: "RAD-GUARD (辐射卫士)",
      radGuardRole: "太阳质子剂量监测与电磁水盾防护",
      psyOracleName: "PSY-ORACLE (心理先知)",
      psyOracleRole: "HRV 行为健康与认知疲劳评估",
      navPilotName: "NAV-PILOT (领航飞行员)",
      navPilotRole: "天体动力学、规避机动与快速返地导航",
      dsnCommsTitle: "NASA 深空网 (DSN) 持续对地通信链路",
      dsnActiveStation: "当前工作深空站",
      dsnOneWayLatency: "单向光行时延迟",
      dsnSendToHouston: "向休斯顿航医与地面控制中心发送高优遥测包",
      terminalTitle: "Hermes 全权限飞船与医疗指令终端",
      terminalPlaceholder: "向 Hermes AI 下达指令（例如：'分析 Xiaomi H1 心电波形'、'计算 2.2G 过载限制下最快返地轨道'）...",
      terminalSend: "执行指令",
      supabaseModalTitle: "Supabase 实时任务遥测云数据库",
      supabaseModalDesc: "配置您的 Supabase 项目密钥，将 Xiaomi Watch H1 生物遥测与飞船自主接管记录实时同步至云端。",
      supabaseSaveBtn: "连接并同步 Supabase",
    },
    medical: {
      spaceRadiationHeader: "深空辐射剂量监测与太阳风暴医学对抗",
      spaceRadiationSubtitle: "实时太阳质子事件监测、器官剂量限值与抗辐射药物规程",
      medicationsHeader: "飞船自主药房与微重力对抗药物处方集",
      medicationsSubtitle: "微重力稳定注射剂、抗辐射保护剂、抗心律失常药与神经行为支持药物",
      countermeasureKit: "国际空间站 / 阿尔忒弥斯高级生命支持医疗包",
      radioprotectant: "碘化钾 / 氨磷汀 / 非格司亭 (G-CSF)",
      cardiacEmergencyKit: "胺碘酮 / 肾上腺素 / 自动体外除颤仪",
      psychotropicSupport: "莫达非尼 / 褪黑素 / 鼻用咪达唑仑",
    },
  },
  ja: {
    nav: {
      missionControl: "ミッション管制",
      xiaomiWatch: "Xiaomi Watch H1 ラボ",
      hermesCommand: "Hermes AI・宇宙船制御",
      emergencyProtocols: "船外活動・緊急プロトコル",
      radiationProtocols: "宇宙放射線・防護",
      medications: "船内薬局",
      symptomChecker: "AI トリアージ診断",
      treatmentGuidelines: "微小重力医療ガイド",
      earthComms: "DSN 地球通信",
      evaSafety: "生命維持・火災安全",
      home: "コマンドデッキ",
    },
    header: {
      title: "HERMES // アレスVII 深宇宙医療・自律航行システム",
      subtitle: "Xiaomi Watch H1 テレメトリ • 宇宙船自律制御 • マルチサブエージェント診断",
      missionClock: "経過時間",
      shipStatusNominal: "自律航行ステータス：正常",
      shipStatusTakeover: "警告：HERMES AI 緊急宇宙船テイクオーバー発動中",
      shipStatusManualOverride: "クルー手動オーバーライド有効",
      supabaseConnected: "SUPABASE クラウド同期：オンライン",
      supabaseLocal: "テレメトリバッファ：ローカル稼働中",
    },
    dashboard: {
      title: "アレスVII 深宇宙医療・フライトコマンド",
      subtitle: "リアルタイム Xiaomi Watch H1 生体情報、放射線量計および Hermes AI 自律航法",
      crewBiometricsTitle: "Xiaomi Watch H1 クルー生体テレメトリ",
      spaceEnvironmentTitle: "深宇宙放射線・船内環境データ",
      hermesAutonomyTitle: "Hermes AI サブエージェント合意形成",
      activeAlertsTitle: "アクティブ異常アラート＆対抗措置",
      quickActionsTitle: "緊急航行・医療プロトコル",
      missionElapsedTime: "ミッション経過時間 (MET)",
      distanceFromEarth: "地球からの距離",
      lightTimeLatency: "DSN 片道通信遅延",
      hullShieldingStatus: "磁気・水複合ストームシェルター",
    },
    watch: {
      pageTitle: "Xiaomi Watch H1 生体テレメトリ＆異常テストラボ",
      pageSubtitle: "医療グレード ECG、マイクロポンプ式カフ血圧、SpO2、HRV、個人用放射線量計",
      deviceModel: "Xiaomi Watch H1（宇宙医療ファームウェア v4.8）",
      heartRate: "心拍数 (ECG/PPG)",
      spo2: "血中酸素飽和度 (SpO2)",
      bloodPressure: "血圧（マイクロカフ）",
      skinTemp: "深部・皮膚温度",
      hrvStress: "心拍変動 (HRV) ＆自律神経ストレス",
      mentalHealthIndex: "メンタルヘルス・認知指数",
      radiationDoseRate: "空間放射線量率",
      cumulativeDose: "ミッション累積被曝量",
      sleepQuality: "概日リズム・睡眠回復スコア",
      batteryLevel: "ウォッチ残量",
      connectBluetooth: "実機 Xiaomi Watch H1 を Bluetooth BLE でペアリング",
      disconnectBluetooth: "Bluetooth 接続を解除",
      bluetoothConnected: "リアルタイム BLE ストリーム接続中",
      bluetoothStandby: "BLE 待機中（ハードウェアシミュレータ稼働）",
      simulatorActive: "1Hz ハードウェアテレメトリシミュレータ",
      toggleSimulator: "ライブテレメトリ配信切替",
      webhookBridgeTitle: "Xiaomi Mi Fitness / Gadgetbridge Webhook ブリッジ",
      ecgOscilloscopeTitle: "リアルタイム第I誘導 ECG ＆ 光電容積脈波 (PPG) オシロスコープ",
      ppgWaveformTitle: "光学式 PPG 脈波＆マイクロカフ動脈圧波形",
      multiMetricTrendTitle: "マルチメトリック生体＆放射線トレンド",
      simulateAnomaliesTitle: "ミッション異常インジェクター＆ Hermes AI 応答ラボ",
      simulateAnomaliesSubtitle: "Xiaomi Watch H1 ストリームに深宇宙の緊急事態を注入し、Hermes AI の自律判断と船体制御を検証します",
      scenarioNominal: "通常 EVA / 軌道ベースライン",
      scenarioSolarStorm: "太陽粒子イベント (SPE 放射線急増 > 650 µSv/h)",
      scenarioCardiac: "不整脈・頻脈クライシス (HR 178 BPM)",
      scenarioHypoxia: "船内減圧・低酸素症 (SpO2 81%)",
      scenarioMentalCrisis: "急性隔離パニック＆睡眠剥奪 (HRV 14ms)",
      scenarioDebrisThreat: "スペースデブリ群接近（緊急回避噴射）",
      subagentInspectionTitle: "Hermes サブエージェント・リアルタイム評価フィード",
      microCuffActive: "マイクロポンプ式エアバッグカフ加圧中",
    },
    hermes: {
      pageTitle: "Hermes フルアクセス自律 AI ＆ 宇宙船フライトコントロールセンター",
      pageSubtitle: "4サブエージェントマトリクス、自律軌道テイクオーバー、DSN地球通信、人間による手動オーバーライド",
      autonomousTakeoverAlert: "宇宙船自律テイクオーバー発動中 • クルー危険状態",
      autonomousTakeoverSub: "Hermes AI は行動不能または危険に晒されたクルーを保護するため、姿勢・推進・生命維持の完全制御権を掌握しました。",
      manualOverrideActiveAlert: "人間による手動オーバーライド有効 • クルー直接操縦中",
      manualOverrideButtonEngage: "人間による手動オーバーライドを発動 (MANUAL OVERRIDE)",
      manualOverrideButtonResume: "HERMES AI 自律制御権限を再開",
      manualOverrideStatusAutonomous: "AI オートパイロット権限：フルアクセス",
      manualOverrideStatusHuman: "有人パイロット権限：クルー手動ロック",
      selectCrewCallsign: "承認クルーコールサイン",
      overrideConfirmNote: "意識のある宇宙飛行士はいつでも Hermes AI の推進・軌道制御をオーバーライドして手動操縦に切り替えられます。",
      evasiveManeuver: "デブリ衝突回避噴射",
      fastestSafeEarthReturn: "最速安全地球帰還軌道（ランバート噴射）",
      solarStormShieldAlign: "太陽嵐シールド姿勢制御",
      nominalOrbitCruise: "通常深宇宙巡航姿勢",
      deltaVRequired: "必要デルタV (Δv)",
      burnCountdown: "スラスター噴射カウントダウン",
      gLoadLimit: "医療制限Gロード上限",
      estHoursToEarth: "地球再突入までの推定時間",
      subagentsMatrixTitle: "Hermes 4サブエージェント自律合意マトリクス",
      medSentinelName: "MED-SENTINEL",
      medSentinelRole: "Xiaomi Watch H1 生体医療＆心臓トリアージ",
      radGuardName: "RAD-GUARD",
      radGuardRole: "太陽粒子線量測定＆磁気シールド制御",
      psyOracleName: "PSY-ORACLE",
      psyOracleRole: "HRV メンタルヘルス＆認知疲労解析",
      navPilotName: "NAV-PILOT",
      navPilotRole: "軌道力学・回避マニューバ＆地球帰還航法",
      dsnCommsTitle: "NASA 深宇宙ネットワーク (DSN) 常時地球アップリンク",
      dsnActiveStation: "稼働中 DSN 局",
      dsnOneWayLatency: "片道光速通信遅延",
      dsnSendToHouston: "ヒューストン管制官・航空医官へ優先パケット送信",
      terminalTitle: "Hermes フルアクセス宇宙船＆医療コマンドターミナル",
      terminalPlaceholder: "Hermes AI に指示（例：「Xiaomi H1 ECGを解析」「2.2G以下での最速地球帰還を計算」）...",
      terminalSend: "コマンド実行",
      supabaseModalTitle: "Supabase リアルタイムテレメトリデータベース",
      supabaseModalDesc: "Supabase URL と Anon Key を設定し、Xiaomi Watch H1 の生体データと船体制御ログをクラウド同期します。",
      supabaseSaveBtn: "Supabase に接続・同期",
    },
    medical: {
      spaceRadiationHeader: "深宇宙放射線ドシメトリ＆太陽粒子イベント対抗措置",
      spaceRadiationSubtitle: "リアルタイム SPE 監視、臓器別線量限度および放射線防護剤プロトコル",
      medicationsHeader: "宇宙船自律薬局＆微小重力医薬品フォーミュラリー",
      medicationsSubtitle: "微小重力安定注射剤、放射線防護剤、抗不整脈薬、メンタルヘルス治療薬",
      countermeasureKit: "ISS / アルテミス高度救命医療キット",
      radioprotectant: "ヨウ化カリウム / アミホスチン / フィルグラスチム",
      cardiacEmergencyKit: "アミオダロン / エピネフリン / 自動除細動器",
      psychotropicSupport: "モダフィニル / メラトニン / 点鼻ミダゾラム",
    },
  },
  de: {
    nav: {
      missionControl: "Missionskontrolle",
      xiaomiWatch: "Xiaomi Watch H1 Labor",
      hermesCommand: "Hermes KI & Schiffssteuerung",
      emergencyProtocols: "EVA & Notfallprotokolle",
      radiationProtocols: "Strahlenschutz & Bio-Schild",
      medications: "Weltraum-Apotheke",
      symptomChecker: "KI-Triage & Diagnose",
      treatmentGuidelines: "Mikrogravitations-Medizin",
      earthComms: "DSN Erdkommunikation",
      evaSafety: "Kabinen-Lebenserhaltung",
      home: "Kommandodeck",
    },
    header: {
      title: "HERMES • Sonnenblume DEEP-SPACE MEDIZIN- & AUTONOMES FLUGSYSTEM",
      subtitle: "Xiaomi Watch H1 Telemetrie • Autonome Raumschiffsteuerung • Multi-Subagenten-Triage",
      missionClock: "MET",
      shipStatusNominal: "AUTONOMER FLUG: NOMINAL",
      shipStatusTakeover: "ALARM: HERMES KI NOTFALL-SCHIFFSÜBERNAHME",
      shipStatusManualOverride: "MANUELLE CREW-ÜBERSTEUERUNG AKTIV",
      supabaseConnected: "SUPABASE CLOUD-SYNC: ONLINE",
      supabaseLocal: "TELEMETRIE-PUFFER: LOKAL BEREIT",
    },
    dashboard: {
      title: "Sonnenblume Deep-Space Medizin- & Flugkommando",
      subtitle: "Echtzeit Xiaomi Watch H1 Biometrie, Strahlendosimetrie & Autonome Hermes KI-Navigation",
      crewBiometricsTitle: "Xiaomi Watch H1 Crew-Biometrie",
      spaceEnvironmentTitle: "Weltraumstrahlung & Kabinentelemetrie",
      hermesAutonomyTitle: "Hermes KI-Subagenten-Konsens",
      activeAlertsTitle: "Aktive Missionsanomalien & Gegenmaßnahmen",
      quickActionsTitle: "Notfall-Flug- & Medizinprotokolle",
      missionElapsedTime: "Verstrichene Missionszeit",
      distanceFromEarth: "Entfernung zur Erde",
      lightTimeLatency: "DSN Einweg-Lichtlaufzeit",
      hullShieldingStatus: "Magnet-Wasser-Sturmschutzraum",
    },
    watch: {
      pageTitle: "Xiaomi Watch H1 Biometrie- & Anomalie-Testlabor",
      pageSubtitle: "Medizinisches Wearable-EKG, Mikropumpen-Manschetten-Blutdruck, SpO2, HRV & Strahlendosimeter",
      deviceModel: "Xiaomi Watch H1 (Raumfahrt-Medizin-Firmware v4.8)",
      heartRate: "Herzfrequenz (EKG/PPG)",
      spo2: "Blutsauerstoff (SpO2)",
      bloodPressure: "Blutdruck (Mikro-Manschette)",
      skinTemp: "Kern-/Hauttemperatur",
      hrvStress: "HRV (RMSSD) & Autonomer Stress",
      mentalHealthIndex: "Mentale Gesundheit & Kognitionsindex",
      radiationDoseRate: "Persönliche Strahlendosisleistung",
      cumulativeDose: "Kumulative Missionsdosis",
      sleepQuality: "Zirkadiane & REM-Erholung",
      batteryLevel: "Uhr-Akkustand",
      connectBluetooth: "Echte Xiaomi Watch H1 über Bluetooth BLE koppeln",
      disconnectBluetooth: "Bluetooth-Uhr trennen",
      bluetoothConnected: "LIVE-BLE-STREAM AKTIV",
      bluetoothStandby: "BLE STANDBY (SIMULATOR LÄUFT)",
      simulatorActive: "1Hz Hardware-Telemetrie-Simulator",
      toggleSimulator: "Live-Telemetrie-Stream umschalten",
      webhookBridgeTitle: "Xiaomi Mi Fitness / Gadgetbridge HTTP-Webhook-Brücke",
      ecgOscilloscopeTitle: "Echtzeit-Kanal-I-EKG & Photoplethysmographie (PPG) Oszilloskop",
      ppgWaveformTitle: "Optische PPG-Pulswelle & Mikromanschetten-Arteriendruck",
      multiMetricTrendTitle: "Multimetrischer Biometrie- & Strahlungstrend",
      simulateAnomaliesTitle: "Missionsanomalie-Injektor & Hermes KI-Reaktionslabor",
      simulateAnomaliesSubtitle: "Injizieren Sie Weltraum-Notfälle in den Xiaomi Watch H1-Stream, um die Hermes KI-Schiffsübernahme zu testen",
      scenarioNominal: "Nominale EVA / Orbit-Basislinie",
      scenarioSolarStorm: "Solares Partikelereignis (SPE > 650 µSv/h)",
      scenarioCardiac: "Herzrhythmusstörung / Tachykardie-Krise",
      scenarioHypoxia: "Kabinendruckabfall / Hypoxie (SpO2 81%)",
      scenarioMentalCrisis: "Akute Isolationspanik & Schlafentzug",
      scenarioDebrisThreat: "Weltraumschrott-Kollisionsgefahr (Ausweichmanöver)",
      subagentInspectionTitle: "Hermes Subagenten Echtzeit-Telemetrie-Prüfprotokoll",
      microCuffActive: "Mikropumpen-Airbag-Manschette unter Druck",
    },
    hermes: {
      pageTitle: "Hermes Vollzugriffs-KI & Raumschiff-Flugleitzentrale",
      pageSubtitle: "4-Subagenten-Matrix, Autonome Flugbahnübernahme, DSN-Erdfunk & Manuelle Crew-Übersteuerung",
      autonomousTakeoverAlert: "AUTONOME SCHIFFSÜBERNAHME AKTIV • CREW IN GEFAHR",
      autonomousTakeoverSub: "Hermes KI hat die volle Kontrolle über Lage, Antrieb und Lebenserhaltung übernommen, um die Crew zu schützen.",
      manualOverrideActiveAlert: "MANUELLE ÜBERSTEUERUNG AKTIV • CREW HAT DIREKTES KOMMANDO",
      manualOverrideButtonEngage: "MANUELLE CREW-ÜBERSTEUERUNG AKTIVIEREN",
      manualOverrideButtonResume: "AUTONOME HERMES KI-KONTROLLE WIEDERAUFNEHMEN",
      manualOverrideStatusAutonomous: "KI-AUTOPILOT-AUTORITÄT: VOLLZUGRIFF",
      manualOverrideStatusHuman: "PILOTEN-AUTORITÄT: MANUELL DURCH CREW GESPERRT",
      selectCrewCallsign: "Autorisierendes Crew-Mitglied",
      overrideConfirmNote: "Jeder bei Bewusstsein befindliche Astronaut kann die Hermes KI jederzeit manuell übersteuern.",
      evasiveManeuver: "Trümmer-Ausweichmanöver-Zündung",
      fastestSafeEarthReturn: "Schnellste sichere Erdrückkehr (Lambert-Burn)",
      solarStormShieldAlign: "Sonnensturm-Heckschutzschild-Ausrichtung",
      nominalOrbitCruise: "Nominale Deep-Space-Reisefluglage",
      deltaVRequired: "Berechnetes Delta-V",
      burnCountdown: "Triebwerkszündungs-Countdown",
      gLoadLimit: "Medizinisch begrenztes G-Last-Limit",
      estHoursToEarth: "Geschätzte Zeit bis Erdeintritt",
      subagentsMatrixTitle: "Hermes 4-Subagenten-Konsensmatrix",
      medSentinelName: "MED-SENTINEL",
      medSentinelRole: "Xiaomi Watch H1 Bio-Med & Kardio-Triage",
      radGuardName: "RAD-GUARD",
      radGuardRole: "Strahlendosimetrie & Magnetschild",
      psyOracleName: "PSY-ORACLE",
      psyOracleRole: "HRV-Verhaltensgesundheit & Kognitive Ermüdung",
      navPilotName: "NAV-PILOT",
      navPilotRole: "Astrodynamik, Ausweichmanöver & Erdrückkehr",
      dsnCommsTitle: "NASA Deep Space Network (DSN) Kontinuierlicher Erd-Uplink",
      dsnActiveStation: "Aktiver DSN-Komplex",
      dsnOneWayLatency: "Einweg-Lichtlaufzeit-Latenz",
      dsnSendToHouston: "Prioritäts-Telemetriepaket an Houston CAPCOM senden",
      terminalTitle: "Hermes Vollzugriffs-Schiffs- & Medizinterminal",
      terminalPlaceholder: "Befehl an Hermes KI eingeben (z. B. 'Analysiere Xiaomi H1 EKG', 'Schnellste Rückkehr unter 2.2G')...",
      terminalSend: "Befehl ausführen",
      supabaseModalTitle: "Supabase Live-Missionstelemetrie-Datenbank",
      supabaseModalDesc: "Verbinden Sie Ihr Supabase-Projekt, um Xiaomi Watch H1-Biometrie und Hermes-Logs in Echtzeit zu speichern.",
      supabaseSaveBtn: "Supabase verbinden & synchronisieren",
    },
    medical: {
      spaceRadiationHeader: "Deep-Space-Strahlendosimetrie & SPE-Gegenmaßnahmen",
      spaceRadiationSubtitle: "Echtzeit-Überwachung solarer Partikelereignisse, Organdosisgrenzwerte & Radioprotektoren",
      medicationsHeader: "Autonome Bordapotheke & Gegenmaßnahmen-Kompendium",
      medicationsSubtitle: "Mikrogravitationsstabile Injektabilia, Radioprotektoren, Antiarrhythmika & Psychopharmaka",
      countermeasureKit: "ISS / Artemis Erweitertes ALS-Medizinpaket",
      radioprotectant: "Kaliumiodid / Amifostin / Filgrastim G-CSF",
      cardiacEmergencyKit: "Amiodaron / Epinephrin / Auto-Defibrillator",
      psychotropicSupport: "Modafinil / Melatonin / Intranasales Midazolam",
    },
  },
  es: {
    nav: {
      missionControl: "Control de Misión",
      xiaomiWatch: "Laboratorio Xiaomi Watch H1",
      hermesCommand: "IA Hermes y Control de Nave",
      emergencyProtocols: "Protocolos EVA y Emergencias",
      radiationProtocols: "Radiación y Bio-Escudo",
      medications: "Farmacia Espacial",
      symptomChecker: "Triaje y Diagnóstico IA",
      treatmentGuidelines: "Medicina en Microgravedad",
      earthComms: "Comunicaciones DSN Tierra",
      evaSafety: "Soporte Vital y Seguridad",
      home: "Cubierta de Mando",
    },
    header: {
      title: "HERMES // SISTEMA MÉDICO Y DE VUELO AUTÓNOMO DE ESPACIO PROFUNDO Sonnenblume",
      subtitle: "Telemetría Xiaomi Watch H1 • Control Autónomo de Nave • Triaje Multi-Subagente",
      missionClock: "MET",
      shipStatusNominal: "VUELO AUTÓNOMO: NOMINAL",
      shipStatusTakeover: "ALERTA: TOMA DE CONTROL DE EMERGENCIA POR IA HERMES",
      shipStatusManualOverride: "ANULACIÓN MANUAL HUMANA ACTIVA",
      supabaseConnected: "SINCRONIZACIÓN SUPABASE: EN LÍNEA",
      supabaseLocal: "BÚFER DE TELEMETRÍA: LOCAL LISTO",
    },
    dashboard: {
      title: "Comando Médico y de Vuelo de Espacio Profundo Sonnenblume",
      subtitle: "Biometría Xiaomi Watch H1 en Tiempo Real, Dosimetría de Radiación y Navegación Autónoma Hermes",
      crewBiometricsTitle: "Biometría de Tripulación Xiaomi Watch H1",
      spaceEnvironmentTitle: "Radiación de Espacio Profundo y Cabina",
      hermesAutonomyTitle: "Consenso de Subagentes IA Hermes",
      activeAlertsTitle: "Anomalías Activas y Contramedidas",
      quickActionsTitle: "Protocolos de Vuelo y Medicina de Emergencia",
      missionElapsedTime: "Tiempo Transcurrido de Misión",
      distanceFromEarth: "Distancia desde la Tierra",
      lightTimeLatency: "Latencia de Luz Unidireccional DSN",
      hullShieldingStatus: "Refugio Magnético-Agua contra Tormentas",
    },
    watch: {
      pageTitle: "Laboratorio Biométrico y de Anomalías Xiaomi Watch H1",
      pageSubtitle: "ECG Portátil de Grado Médico, Presión Arterial por Microbomba, SpO2, VFC y Dosímetro Personal",
      deviceModel: "Xiaomi Watch H1 (Firmware Médico Espacial v4.8)",
      heartRate: "Frecuencia Cardíaca (ECG/PPG)",
      spo2: "Oxígeno en Sangre (SpO2)",
      bloodPressure: "Presión Arterial (Micro-Manguito)",
      skinTemp: "Temperatura Corporal/Cutánea",
      hrvStress: "VFC (RMSSD) y Estrés Autonómico",
      mentalHealthIndex: "Índice de Salud Mental y Cognitiva",
      radiationDoseRate: "Tasa de Dosis de Radiación Personal",
      cumulativeDose: "Dosis Acumulada de la Misión",
      sleepQuality: "Recuperación Circadiana y REM",
      batteryLevel: "Batería del Reloj",
      connectBluetooth: "Vincular Xiaomi Watch H1 Real vía Bluetooth BLE",
      disconnectBluetooth: "Desconectar Reloj Bluetooth",
      bluetoothConnected: "FLUJO BLE EN VIVO ACTIVO",
      bluetoothStandby: "BLE EN ESPERA (SIMULADOR ACTIVO)",
      simulatorActive: "Simulador de Telemetría por Hardware 1Hz",
      toggleSimulator: "Alternar Flujo de Telemetría en Vivo",
      webhookBridgeTitle: "Puente Webhook HTTP Xiaomi Mi Fitness / Gadgetbridge",
      ecgOscilloscopeTitle: "Osciloscopio ECG Derivación-I y Fotopletismografía (PPG) en Tiempo Real",
      ppgWaveformTitle: "Onda de Pulso Óptica PPG y Presión Arterial por Micro-Manguito",
      multiMetricTrendTitle: "Tendencia Multimétrica de Biometría y Radiación",
      simulateAnomaliesTitle: "Inyector de Anomalías y Laboratorio de Respuesta IA Hermes",
      simulateAnomaliesSubtitle: "Inyecte emergencias extremas del espacio profundo en el Xiaomi Watch H1 para probar la toma de control de la nave por Hermes",
      scenarioNominal: "Línea Base Nominal EVA / Órbita",
      scenarioSolarStorm: "Evento de Partículas Solares (SPE > 650 µSv/h)",
      scenarioCardiac: "Arritmia Cardíaca / Crisis de Taquicardia",
      scenarioHypoxia: "Despresurización de Cabina / Hipoxia",
      scenarioMentalCrisis: "Pánico Agudo por Aislamiento y Privación de Sueño",
      scenarioDebrisThreat: "Amenaza de Enjambre de Escombros (Maniobra Evasiva)",
      subagentInspectionTitle: "Canal de Inspección de Telemetría en Tiempo Real de Subagentes Hermes",
      microCuffActive: "Manguito con bolsa de aire por microbomba presurizado",
    },
    hermes: {
      pageTitle: "Centro de Control de Vuelo y IA Autónoma de Acceso Total Hermes",
      pageSubtitle: "Matriz de 4 Subagentes, Toma de Control de Trayectoria, Enlace DSN Houston y Anulación Manual Humana",
      autonomousTakeoverAlert: "TOMA DE CONTROL AUTÓNOMA DE LA NAVE ACTIVA • TRIPULACIÓN EN PELIGRO",
      autonomousTakeoverSub: "La IA Hermes ha asumido la autoridad total de actitud, propulsión y soporte vital para proteger a la tripulación incapacitada.",
      manualOverrideActiveAlert: "ANULACIÓN MANUAL HUMANA ACTIVADA • TRIPULACIÓN AL MANDO DIRECTO",
      manualOverrideButtonEngage: "ACTIVAR ANULACIÓN MANUAL HUMANA (OVERRIDE)",
      manualOverrideButtonResume: "REANUDAR AUTORIDAD AUTÓNOMA DE IA HERMES",
      manualOverrideStatusAutonomous: "AUTORIDAD DE PILOTO AUTOMÁTICO IA: ACCESO TOTAL",
      manualOverrideStatusHuman: "AUTORIDAD DE PILOTO HUMANO: BLOQUEADO A TRIPULACIÓN",
      selectCrewCallsign: "Tripulante Autorizador",
      overrideConfirmNote: "Cualquier astronauta consciente puede anular el control de propulsión y trayectoria de Hermes en cualquier momento.",
      evasiveManeuver: "Encendido Evasivo de Escombros Orbitales",
      fastestSafeEarthReturn: "Retorno Seguro Más Rápido a la Tierra (Encendido Lambert)",
      solarStormShieldAlign: "Orientación de Escudo de Popa contra Tormenta Solar",
      nominalOrbitCruise: "Actitud de Crucero Nominal de Espacio Profundo",
      deltaVRequired: "Delta-V Calculado",
      burnCountdown: "Cuenta Regresiva de Ignición",
      gLoadLimit: "Límite de Carga G Médicamente Restringido",
      estHoursToEarth: "Tiempo Est. hasta Entrada Terrestre",
      subagentsMatrixTitle: "Matriz de Consenso Autónomo de 4 Subagentes Hermes",
      medSentinelName: "MED-SENTINEL",
      medSentinelRole: "Bio-Medicina Xiaomi Watch H1 y Triaje Cardíaco",
      radGuardName: "RAD-GUARD",
      radGuardRole: "Dosimetría Solar y Blindaje Magnético",
      psyOracleName: "PSY-ORACLE",
      psyOracleRole: "Salud Conductual VFC y Fatiga Cognitiva",
      navPilotName: "NAV-PILOT",
      navPilotRole: "Astrodinámica, Maniobra Evasiva y Retorno a la Tierra",
      dsnCommsTitle: "Enlace Continuo con la Tierra vía Red del Espacio Profundo (DSN)",
      dsnActiveStation: "Complejo DSN Activo",
      dsnOneWayLatency: "Latencia Unidireccional de Luz",
      dsnSendToHouston: "Transmitir Paquete de Telemetría Prioritario a Houston CAPCOM",
      terminalTitle: "Terminal de Comando Médico y de Nave de Acceso Total Hermes",
      terminalPlaceholder: "Ordene a la IA Hermes (ej., 'Analizar ECG Xiaomi H1', 'Calcular retorno más rápido bajo 2.2G')...",
      terminalSend: "Ejecutar Comando",
      supabaseModalTitle: "Base de Datos de Telemetría en Vivo Supabase",
      supabaseModalDesc: "Conecte su proyecto Supabase para sincronizar la biometría del Xiaomi Watch H1 y los registros de Hermes.",
      supabaseSaveBtn: "Conectar y Sincronizar Supabase",
    },
    medical: {
      spaceRadiationHeader: "Dosimetría de Radiación en Espacio Profundo y Contramedidas SPE",
      spaceRadiationSubtitle: "Monitoreo en Tiempo Real de Eventos de Partículas Solares, Límites por Órgano y Radioprotectores",
      medicationsHeader: "Farmacia Autónoma Espacial y Formulario de Contramedidas",
      medicationsSubtitle: "Inyectables Estables en Microgravedad, Radioprotectores, Antiarrítmicos y Terapéutica Conductual",
      countermeasureKit: "Botiquín Médico Avanzado ALS EEI / Artemisa",
      radioprotectant: "Yoduro de Potasio / Amifostina / Filgrastim G-CSF",
      cardiacEmergencyKit: "Amiodarona / Epinefrina / Desfibrilador Automático",
      psychotropicSupport: "Modafinilo / Melatonina / Midazolam Intranasal",
    },
  },
  ko: {
    nav: {
      missionControl: "임무 관제 센터",
      xiaomiWatch: "Xiaomi Watch H1 랩",
      hermesCommand: "Hermes AI 및 우주선 제어",
      emergencyProtocols: "선외활동 및 비상 프로토콜",
      radiationProtocols: "우주 방사선 및 생체 차폐",
      medications: "우주 약국",
      symptomChecker: "AI 중증도 분류 및 진단",
      treatmentGuidelines: "미세중력 치료 지침",
      earthComms: "심우주 통신망 (DSN)",
      evaSafety: "생명유지 및 화재 안전",
      home: "커맨드 데크",
    },
    header: {
      title: "HERMES // 아레스-VII 심우주 의료 및 자율 비행 제어 시스템",
      subtitle: "Xiaomi Watch H1 원격측정 • 자율 우주선 제어 • 다중 서브에이전트 협진",
      missionClock: "임무 경과 시간",
      shipStatusNominal: "자율 비행 상태: 정상",
      shipStatusTakeover: "경고: HERMES AI 우주선 비상 통제권 인수 활성화",
      shipStatusManualOverride: "승무원 수동 제어권 우선(OVERRIDE) 활성",
      supabaseConnected: "SUPABASE 클라우드 동기화: 온라인",
      supabaseLocal: "원격측정 버퍼: 로컬 준비 완료",
    },
    dashboard: {
      title: "아레스-VII 심우주 의료 및 비행 지휘 본부",
      subtitle: "실시간 Xiaomi Watch H1 생체 신호, 방사선량 측정 및 Hermes AI 자율 항법",
      crewBiometricsTitle: "Xiaomi Watch H1 승무원 생체 신호",
      spaceEnvironmentTitle: "심우주 방사선 및 선내 환경 텔레메트리",
      hermesAutonomyTitle: "Hermes AI 서브에이전트 합의 알고리즘",
      activeAlertsTitle: "활성 임무 이상 징후 및 대응 조치",
      quickActionsTitle: "비상 비행 및 의료 프로토콜",
      missionElapsedTime: "임무 경과 시간 (MET)",
      distanceFromEarth: "지구로부터의 거리",
      lightTimeLatency: "DSN 편도 광속 지연 시간",
      hullShieldingStatus: "자기-수막 복합 태양폭풍 대피소",
    },
    watch: {
      pageTitle: "Xiaomi Watch H1 생체 신호 및 이상 징후 테스트 랩",
      pageSubtitle: "의료 등급 웨어러블 ECG, 마이크로 펌프 커프 혈압, SpO2, HRV 및 개인 방사선 선량계",
      deviceModel: "Xiaomi Watch H1 (우주 의료용 펌웨어 v4.8)",
      heartRate: "심박수 (ECG/PPG)",
      spo2: "혈중 산소 포화도 (SpO2)",
      bloodPressure: "혈압 (마이크로 에어백 커프)",
      skinTemp: "심부/피부 온도",
      hrvStress: "심박변이도 (HRV) 및 자율신경 스트레스",
      mentalHealthIndex: "정신 건강 및 인지 지수",
      radiationDoseRate: "개인 방사선 선량률",
      cumulativeDose: "임무 누적 피폭 선량",
      sleepQuality: "일주기 리듬 및 수면 회복도",
      batteryLevel: "워치 배터리",
      connectBluetooth: "Bluetooth BLE로 실제 Xiaomi Watch H1 페어링",
      disconnectBluetooth: "Bluetooth 워치 연결 해제",
      bluetoothConnected: "실시간 BLE 스트림 연결됨",
      bluetoothStandby: "BLE 대기 중 (하드웨어 시뮬레이터 작동 중)",
      simulatorActive: "1Hz 하드웨어 원격측정 시뮬레이터",
      toggleSimulator: "실시간 텔레메트리 스트림 전환",
      webhookBridgeTitle: "Xiaomi Mi Fitness / Gadgetbridge HTTP 웹훅 브리지",
      ecgOscilloscopeTitle: "실시간 리드-I 심전도(ECG) 및 광전용적맥파(PPG) 오실로스코프",
      ppgWaveformTitle: "광학 PPG 맥파 및 마이크로 커프 동맥압 파형",
      multiMetricTrendTitle: "다중 생체 신호 및 우주 방사선 추세 차트",
      simulateAnomaliesTitle: "임무 이상 징후 주입기 및 Hermes AI 반응 실험실",
      simulateAnomaliesSubtitle: "Xiaomi Watch H1 스트림에 극한 심우주 응급 상황을 주입하여 Hermes AI의 감지 및 우주선 자율 통제권 인수를 테스트합니다",
      scenarioNominal: "정상 선외활동(EVA) / 궤도 기준선",
      scenarioSolarStorm: "태양 입자 이벤트 (SPE 방사선 급증 > 650 µSv/h)",
      scenarioCardiac: "심장 부정맥 / 빈맥 위기 (HR 178 BPM)",
      scenarioHypoxia: "선내 감압 / 저산소증 (SpO2 81%)",
      scenarioMentalCrisis: "급성 고립 공황 및 수면 박탈 (HRV 14ms)",
      scenarioDebrisThreat: "궤도 우주 파편군 충돌 위협 (긴급 회피 기동)",
      subagentInspectionTitle: "Hermes 서브에이전트 실시간 원격측정 정밀 분석 피드",
      microCuffActive: "마이크로 펌프 에어백 커프 가압 측정 중",
    },
    hermes: {
      pageTitle: "Hermes 전권 자율 AI 및 우주선 비행 관제 센터",
      pageSubtitle: "4대 서브에이전트 매트릭스, 자율 궤도 통제권 인수, DSN 지구 통신 및 승무원 수동 오버라이드",
      autonomousTakeoverAlert: "우주선 자율 통제권 인수 활성화 • 승무원 위험 상태",
      autonomousTakeoverSub: "Hermes AI가 행동 불능 또는 위험에 처한 승무원을 보호하기 위해 자세, 추진 및 생명유지 장치의 전권을 인수했습니다.",
      manualOverrideActiveAlert: "인간 수동 제어권(MANUAL OVERRIDE) 활성화 • 승무원 직접 조종 중",
      manualOverrideButtonEngage: "승무원 수동 제어권 발동 (ENGAGE MANUAL OVERRIDE)",
      manualOverrideButtonResume: "HERMES AI 자율 통제 권한 복귀",
      manualOverrideStatusAutonomous: "AI 자동항법 권한: 전체 접근 활성화",
      manualOverrideStatusHuman: "인간 조종사 권한: 승무원 수동 잠금",
      selectCrewCallsign: "승인 우주비행사 콜사인",
      overrideConfirmNote: "의식이 있는 모든 우주비행사는 언제든지 Hermes AI의 추진 및 궤도 제어권을 즉시 수동으로 회수할 수 있습니다.",
      evasiveManeuver: "우주 파편 충돌 회피 점화",
      fastestSafeEarthReturn: "최단 시간 안전 지구 귀환 궤도 (람베르트 점화)",
      solarStormShieldAlign: "태양폭풍 후미 차폐막 자세 정렬",
      nominalOrbitCruise: "정상 심우주 순항 자세",
      deltaVRequired: "필요 속도 증분 (Delta-V)",
      burnCountdown: "추진기 점화 카운트다운",
      gLoadLimit: "의료 제한 최대 중력가속도 (G-Load)",
      estHoursToEarth: "지구 대기권 진입까지 예상 시간",
      subagentsMatrixTitle: "Hermes 4대 서브에이전트 자율 합의 매트릭스",
      medSentinelName: "MED-SENTINEL",
      medSentinelRole: "Xiaomi Watch H1 생체의료 및 심장 응급 분류",
      radGuardName: "RAD-GUARD",
      radGuardRole: "태양 입자 선량 측정 및 자기 차폐 제어",
      psyOracleName: "PSY-ORACLE",
      psyOracleRole: "HRV 정신 건강 및 인지 피로도 분석",
      navPilotName: "NAV-PILOT",
      navPilotRole: "천체역학, 회피 기동 및 지구 귀환 항법",
      dsnCommsTitle: "NASA 심우주 통신망 (DSN) 상시 지구 업링크",
      dsnActiveStation: "활성 DSN 기지국",
      dsnOneWayLatency: "편도 광속 지연 시간",
      dsnSendToHouston: "휴스턴 비행군의관 및 CAPCOM에 우선 텔레메트리 전송",
      terminalTitle: "Hermes 전권 우주선 및 의료 명령 터미널",
      terminalPlaceholder: "Hermes AI에게 명령 입력 (예: 'Xiaomi H1 ECG 분석', '2.2G 이하 최단 지구 귀환 궤도 계산')...",
      terminalSend: "명령 실행",
      supabaseModalTitle: "Supabase 실시간 임무 텔레메트리 데이터베이스",
      supabaseModalDesc: "Supabase 프로젝트를 연결하여 Xiaomi Watch H1 생체 신호와 우주선 통제 로그를 실시간 동기화합니다.",
      supabaseSaveBtn: "Supabase 연결 및 동기화",
    },
    medical: {
      spaceRadiationHeader: "심우주 방사선 선량 측정 및 태양 입자 이벤트(SPE) 대응책",
      spaceRadiationSubtitle: "실시간 태양 입자 이벤트 모니터링, 장기별 선량 한도 및 방사선 방호제 프로토콜",
      medicationsHeader: "우주선 자율 약국 및 미세중력 의약품 처방집",
      medicationsSubtitle: "미세중력 안정 주사제, 방사선 방호제, 항부정맥제 및 신경행동 치료제",
      countermeasureKit: "ISS / 아르테미스 고급 전문소생술(ALS) 의료 키트",
      radioprotectant: "요오드화칼륨 / 아미포스틴 / 필그라스팀 G-CSF",
      cardiacEmergencyKit: "아미오다론 / 에피네프린 / 자동제세동기",
      psychotropicSupport: "모다피닐 / 멜라토닌 / 비강 미다졸람",
    },
  },
};

export function resolveSpaceLanguageCode(code?: string): SpaceLanguageCode {
  if (!code) return "en";
  const normalized = code.toLowerCase().slice(0, 2) as SpaceLanguageCode;
  if (normalized in spaceTranslations) {
    return normalized;
  }
  return "en";
}

export function useSpaceTranslation() {
  const { language, setLanguage } = useLanguage();
  const langCode = resolveSpaceLanguageCode(language?.code);
  const dict = spaceTranslations[langCode] || spaceTranslations.en;

  /**
   * Look up a translation by dot-path (e.g. "watch.heartRate" or "hermes.medSentinelName")
   * with automatic fallback to English or a provided fallback string.
   */
  const t = (path: string, fallback?: string): string => {
    const parts = path.split(".");
    let current: unknown = dict;
    for (const part of parts) {
      if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[part];
      } else {
        current = undefined;
        break;
      }
    }
    if (typeof current === "string") return current;

    // Fallback to English dictionary
    let enCurrent: unknown = spaceTranslations.en;
    for (const part of parts) {
      if (enCurrent && typeof enCurrent === "object" && part in (enCurrent as Record<string, unknown>)) {
        enCurrent = (enCurrent as Record<string, unknown>)[part];
      } else {
        enCurrent = undefined;
        break;
      }
    }
    if (typeof enCurrent === "string") return enCurrent;
    return fallback ?? path;
  };

  return {
    t,
    dict,
    lang: langCode,
    language,
    setLanguage,
    languages: SPACE_LANGUAGES,
  };
}
