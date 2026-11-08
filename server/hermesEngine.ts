import type {
  Astronaut,
  XiaomiWatchTelemetry,
  InsertXiaomiTelemetry,
  AnomalyAlert,
  HermesSubagentLog,
  ShipAutopilotState,
  EarthCommLog,
  AnomalySeverity,
  AstronautStatus,
} from "@shared/schema";

export interface TelemetryEvaluationResult {
  telemetry: XiaomiWatchTelemetry;
  updatedAstronaut: Astronaut;
  newAlerts: AnomalyAlert[];
  newSubagentLogs: HermesSubagentLog[];
  updatedAutopilot: ShipAutopilotState;
  autoEarthComm: EarthCommLog | null;
}

export interface OrbitalReturnSolution {
  maneuverName: string;
  targetDestination: string;
  deltaVMetersPerSec: number;
  burnDurationSec: number;
  estimatedReturnHours: number;
  maxGLoad: number;
  attitudePitch: number;
  attitudeYaw: number;
  attitudeRoll: number;
  radiationShieldOrientation: string;
  propulsionStatus: ShipAutopilotState["propulsionStatus"];
  mode: ShipAutopilotState["mode"];
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const MISSION_LAUNCH_EPOCH_MS = Date.now() - 142 * 3600 * 1000 - 18 * 60 * 1000;
const SPEED_OF_LIGHT_KM_S = 299792.458;

/**
 * Formats Mission Elapsed Time (MET) as T+DDD:HH:MM:SS
 */
export function formatMissionElapsedTime(nowMs = Date.now()): string {
  const elapsedSec = Math.max(0, Math.floor((nowMs - MISSION_LAUNCH_EPOCH_MS) / 1000));
  const days = Math.floor(elapsedSec / 86400);
  const hours = Math.floor((elapsedSec % 86400) / 3600);
  const mins = Math.floor((elapsedSec % 3600) / 60);
  const secs = elapsedSec % 60;
  return `T+${String(days).padStart(3, "0")}:${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Formats Berlin & European Mission Ground Time (UTC+1 CET)
 */
export function formatGroundLocalTime(now = new Date()): string {
  const cetMs = now.getTime() + 1 * 3600 * 1000;
  const d = new Date(cetMs);
  return `${d.toISOString().replace("T", " ").slice(0, 19)} CET (Berlin Mission Hub)`;
}

/**
 * Computes dynamic cardiovascular G-load tolerance limit from live Xiaomi Watch H1 vitals
 */
export function computeDynamicCardioGCap(
  telemetryList: XiaomiWatchTelemetry[],
): number {
  if (!telemetryList.length) return 2.45;
  let minCap = 2.6;
  for (const t of telemetryList) {
    // Reduce safe G-load if tachycardia, bradycardia, hypoxia, or hypertension is present
    let cap = 2.6;
    if (t.heartRate > 155 || t.heartRate < 45 || t.ecgRhythm === "VTACH_ALERT") {
      cap = Math.min(cap, 1.45);
    } else if (t.heartRate > 125) {
      cap = Math.min(cap, 1.85);
    }
    if (t.spo2 < 89) {
      cap = Math.min(cap, 1.35);
    } else if (t.spo2 < 94) {
      cap = Math.min(cap, 1.75);
    }
    if (t.bloodPressureSys > 165 || t.bloodPressureSys < 90) {
      cap = Math.min(cap, 1.55);
    }
    if (cap < minCap) minCap = cap;
  }
  return Number(minCap.toFixed(2));
}

/**
 * Real-Time Physics & Orbital Mechanics Tick (executed continuously every second)
 * Evaluates Vis-Viva orbital velocity, Earth distance, light-time latency d(t)/c,
 * Tsiolkovsky rocket propellant burn, radiation shielding attenuation, and Berlin/UTC clocks.
 */
export function computeRealTimePhysicsTick(
  state: ShipAutopilotState,
  astronauts: Astronaut[],
  latestTelemetry: Record<string, XiaomiWatchTelemetry>,
  dtSeconds = 1.0,
): {
  updatedAutopilot: ShipAutopilotState;
  updatedAstronauts: Astronaut[];
} {
  const now = new Date();
  const nowIso = now.toISOString();
  const g0 = 9.80665;
  const isp = 910; // s (Nuclear Thermal / VASIMR hybrid)

  const telemetryArray = Object.values(latestTelemetry);
  const dynamicGCap = computeDynamicCardioGCap(telemetryArray);

  // Current distance to Earth in km (baseline ~55,221,771 km -> ~184.2 s light time)
  const prevDistanceKm =
    state.distanceToEarthKm ?? state.signalLatencySec * SPEED_OF_LIGHT_KM_S;

  // Determine radial velocity relative to Earth (km/s) using Vis-Viva / transfer state
  let orbitalVelocityKmS = state.orbitalVelocityKmS ?? 28.42;
  let radialVelocityKmS = 14.85; // outbound cruise in nominal transit
  if (state.mode === "EMERGENCY_EARTH_RETURN") {
    orbitalVelocityKmS = 39.68; // High-energy hyperbolic return velocity
    radialVelocityKmS = -38.4; // Inbound toward Earth Entry Interface
  } else if (state.mode === "EVASIVE_MANEUVER") {
    orbitalVelocityKmS = 29.15;
    radialVelocityKmS = 12.1;
  } else if (state.mode === "STORM_SHELTER_ATTITUDE") {
    orbitalVelocityKmS = 28.1;
    radialVelocityKmS = 14.2;
  }

  // Add subtle real-time orbital micro-perturbation from solar gravity gradient
  const microPerturb = Math.sin(now.getTime() / 5000) * 0.015;
  orbitalVelocityKmS = Number((orbitalVelocityKmS + microPerturb).toFixed(3));

  const newDistanceKm = Math.max(
    400,
    Number((prevDistanceKm + radialVelocityKmS * dtSeconds).toFixed(2)),
  );
  const newSignalLatencySec = Number(
    (newDistanceKm / SPEED_OF_LIGHT_KM_S).toFixed(3),
  );

  // Tsiolkovsky propellant burn & burn countdown if active
  let burnDurationSec = state.burnDurationSec;
  let propellantMassKg = state.propellantMassKg ?? 44200;
  let propulsionStatus = state.propulsionStatus;

  if (state.propulsionStatus === "ACTIVE_BURN" && burnDurationSec > 0) {
    const thrustN = Math.min(420000, dynamicGCap * g0 * 118000);
    const massFlowRateKgS = thrustN / (isp * g0); // dm/dt = F / (Isp * g0)
    propellantMassKg = Math.max(
      4000,
      Number((propellantMassKg - massFlowRateKgS * dtSeconds).toFixed(1)),
    );
    burnDurationSec = Math.max(0, Number((burnDurationSec - dtSeconds).toFixed(0)));
    if (burnDurationSec === 0) {
      propulsionStatus = "COAST_PHASE";
    }
  }

  // Update Estimated Return Hours if returning to Earth
  let estimatedReturnHours = state.estimatedReturnHours;
  if (state.mode === "EMERGENCY_EARTH_RETURN") {
    estimatedReturnHours = Math.max(
      1.0,
      Number((estimatedReturnHours - dtSeconds / 3600).toFixed(3)),
    );
  }

  // Shielding attenuation percentage based on posture
  const shieldAttenuationPct = state.radiationShieldOrientation.includes(
    "WATER_WALL",
  )
    ? 78.5
    : state.radiationShieldOrientation.includes("AFT_HEATSHIELD")
      ? 64.0
      : 32.0;

  // Integrate real-time radiation dose (uSv/hr -> mSv) for each astronaut
  const updatedAstronauts = astronauts.map((astro) => {
    const t = latestTelemetry[astro.id];
    const rawRateUsvHr = t?.radiationDoseRateUsvHr ?? 18.4;
    const effectiveRateUsvHr = rawRateUsvHr * (1 - shieldAttenuationPct / 100);
    const doseIncrementMsv = (effectiveRateUsvHr / 1000) * (dtSeconds / 3600);
    return {
      ...astro,
      cumulativeRadiationMsv: Number(
        (astro.cumulativeRadiationMsv + doseIncrementMsv).toFixed(4),
      ),
    };
  });

  const updatedAutopilot: ShipAutopilotState = {
    ...state,
    updatedAt: nowIso,
    burnDurationSec,
    estimatedReturnHours,
    propulsionStatus,
    maxGLoad:
      state.mode === "EMERGENCY_EARTH_RETURN"
        ? Math.min(state.maxGLoad, dynamicGCap)
        : state.maxGLoad,
    signalLatencySec: newSignalLatencySec,
    distanceToEarthKm: newDistanceKm,
    orbitalVelocityKmS,
    propellantMassKg,
    shieldAttenuationPct,
    dynamicCardioGCap: dynamicGCap,
    utcTimestamp: nowIso,
    groundLocalTime: formatGroundLocalTime(now),
    missionElapsedTime: formatMissionElapsedTime(now.getTime()),
    groundStationStatus:
      "BERLIN_MISSION_HUB (52.52°N, 13.40°E) • S/X-BAND TELEMETRY LOCKED",
  };

  return {
    updatedAutopilot,
    updatedAstronauts,
  };
}

/**
 * Computes realistic orbital transfer & Lambert fast-return parameters for Sonnenblume
 * Spacecraft dry+wet mass: 118,000 kg, Nuclear Thermal / VASIMR hybrid thrust: 420 kN, Isp: 910 s
 */
export function calculateOrbitalManeuver(
  maneuverType:
    | "evasive_burn"
    | "fast_earth_return"
    | "storm_shelter_attitude"
    | "nominal_orbit",
  cardiacSafeGCap = false,
): OrbitalReturnSolution {
  const g0 = 9.80665;
  const isp = 910; // Nuclear Thermal Propulsion Isp (seconds)
  const shipMassKg = 118000;
  const maxThrustN = cardiacSafeGCap ? 175000 : 420000;

  if (maneuverType === "fast_earth_return") {
    // High-energy hyperbolic abort return trajectory to Earth Entry Interface (EEI)
    const deltaV = cardiacSafeGCap ? 1840.5 : 2380.0; // m/s
    const massRatio = Math.exp(-deltaV / (isp * g0));
    const propellantMass = shipMassKg * (1 - massRatio);
    const massFlowRate = maxThrustN / (isp * g0);
    const burnDurationSec = Math.round(propellantMass / massFlowRate);
    const maxGLoad = Number(
      ((maxThrustN / (shipMassKg * massRatio)) / g0).toFixed(2),
    );
    const estimatedReturnHours = cardiacSafeGCap ? 148.5 : 116.2;

    return {
      maneuverName: cardiacSafeGCap
        ? "CARDIAC_SAFE_LOW_G_EARTH_ABORT_BURN"
        : "HIGH_ENERGY_FAST_EARTH_RETURN_LAMBERT",
      targetDestination: "EARTH_ENTRY_INTERFACE_PACIFIC_CORRIDOR",
      deltaVMetersPerSec: deltaV,
      burnDurationSec,
      estimatedReturnHours,
      maxGLoad: Math.min(maxGLoad, cardiacSafeGCap ? 1.65 : 2.45),
      attitudePitch: -18.4,
      attitudeYaw: 142.0,
      attitudeRoll: 0.0,
      radiationShieldOrientation: "AFT_HEATSHIELD_MAX_PROTECTION",
      propulsionStatus: "ACTIVE_BURN",
      mode: "EMERGENCY_EARTH_RETURN",
    };
  }

  if (maneuverType === "evasive_burn") {
    const deltaV = 342.8;
    const burnDurationSec = 94;
    return {
      maneuverName: "DEBRIS_CONJUNCTION_EVASIVE_INCLINATION_TRIM",
      targetDestination: "SAFE_INCLINATION_OFFSET_+14KM",
      deltaVMetersPerSec: deltaV,
      burnDurationSec,
      estimatedReturnHours: 398.0,
      maxGLoad: 0.85,
      attitudePitch: 24.5,
      attitudeYaw: -31.2,
      attitudeRoll: 12.0,
      radiationShieldOrientation: "WHIPPLE_BUMPER_FORWARD_VECTOR",
      propulsionStatus: "ACTIVE_BURN",
      mode: "EVASIVE_MANEUVER",
    };
  }

  if (maneuverType === "storm_shelter_attitude") {
    return {
      maneuverName: "SOLAR_PARTICLE_EVENT_TAIL_TO_SUN_SHIELD_LOCK",
      targetDestination: "MARS_TRANSIT_CORRIDOR_STORM_HOLD",
      deltaVMetersPerSec: 48.2,
      burnDurationSec: 18,
      estimatedReturnHours: 412.0,
      maxGLoad: 0.22,
      attitudePitch: 0.0,
      attitudeYaw: 180.0,
      attitudeRoll: 45.0,
      radiationShieldOrientation:
        "AFT_PROPELLANT_WATER_WALL_TO_SUN +_MAG_DEFLECTOR_100PCT",
      propulsionStatus: "COAST_PHASE",
      mode: "STORM_SHELTER_ATTITUDE",
    };
  }

  // Nominal orbit
  return {
    maneuverName: "CIS-LUNAR_DEEP_SPACE_CRUISE",
    targetDestination: "MARS_TRANSIT_CORRIDOR_SECTOR_4",
    deltaVMetersPerSec: 0.0,
    burnDurationSec: 0,
    estimatedReturnHours: 412.0,
    maxGLoad: 0.15,
    attitudePitch: 2.4,
    attitudeYaw: -0.8,
    attitudeRoll: 0.0,
    radiationShieldOrientation: "NOMINAL_FORWARD_CONE",
    propulsionStatus: "STANDBY_NOMINAL",
    mode: "NOMINAL_TRANSIT",
  };
}

/**
 * Evaluates a Xiaomi Watch H1 telemetry packet across all 4 Hermes subagents
 * and triggers autonomous ship takeover if critical anomalies occur and human override is not engaged.
 */
export function evaluateTelemetryPacket(
  input: InsertXiaomiTelemetry,
  astronaut: Astronaut,
  currentAutopilot: ShipAutopilotState,
): TelemetryEvaluationResult {
  const now = new Date().toISOString();
  const reasons: string[] = [];
  let maxSeverity: AnomalySeverity = "NONE";
  const newAlerts: AnomalyAlert[] = [];
  const newSubagentLogs: HermesSubagentLog[] = [];

  const escalate = (current: AnomalySeverity, next: AnomalySeverity): AnomalySeverity => {
    const order: AnomalySeverity[] = [
      "NONE",
      "LOW",
      "MODERATE",
      "HIGH",
      "CRITICAL",
    ];
    return order.indexOf(next) > order.indexOf(current) ? next : current;
  };

  // =========================================================================
  // 1. SUBAGENT: MED-SENTINEL (Cardiovascular, Hypoxia, Life Support & Suit)
  // =========================================================================
  let medAnomaly = false;
  let cardiacCritical = false;
  let lifeSupportCritical = false;

  if (
    input.heartRate >= 165 ||
    input.heartRate <= 42 ||
    input.ecgRhythm === "VTACH_ALERT" ||
    input.ecgRhythm === "ATRIAL_FIBRILLATION"
  ) {
    maxSeverity = escalate(maxSeverity, "CRITICAL");
    medAnomaly = true;
    cardiacCritical = true;
    const reason = `Acute Cardiac Emergency on Xiaomi Watch H1: HR ${input.heartRate} BPM, ECG ${input.ecgRhythm}, BP ${input.bloodPressureSys}/${input.bloodPressureDia} mmHg`;
    reasons.push(reason);

    newAlerts.push({
      id: makeId("alert-med"),
      astronautId: astronaut.id,
      timestamp: now,
      category: "MEDICAL",
      severity: "CRITICAL",
      title: `CRITICAL CARDIAC ARRHYTHMIA (${astronaut.callsign})`,
      description: `${astronaut.name}'s Xiaomi Watch H1 detected ${input.ecgRhythm} at ${input.heartRate} BPM with BP ${input.bloodPressureSys}/${input.bloodPressureDia} mmHg and SpO2 ${input.spo2}%. Immediate autonomous medical stabilization & low-G abort required.`,
      metricsSnapshot: {
        heartRate: input.heartRate,
        spo2: input.spo2,
        ecgRhythm: input.ecgRhythm,
        bp: `${input.bloodPressureSys}/${input.bloodPressureDia}`,
      },
      hermesActionTaken:
        "MED-SENTINEL deployed automated cabin 100% O2 enrichment, alerted Flight Surgeon, and instructed NAV-PILOT to initiate Low-G (<=1.65G) Fast Earth Return.",
      resolved: false,
    });
  } else if (input.heartRate > 125 || input.heartRate < 50) {
    maxSeverity = escalate(maxSeverity, "MODERATE");
    medAnomaly = true;
    reasons.push(
      `Cardiovascular deviation: Heart Rate ${input.heartRate} BPM (${input.ecgRhythm})`,
    );
  }

  if (input.spo2 < 88 || input.evaSuitPressureKpa < 22.0 || input.cabinCo2Mmhg > 6.0) {
    maxSeverity = escalate(maxSeverity, "CRITICAL");
    medAnomaly = true;
    lifeSupportCritical = true;
    const reason = `Hypoxia / Barotrauma Emergency: SpO2 ${input.spo2}%, Suit Pressure ${input.evaSuitPressureKpa} kPa, Cabin CO2 ${input.cabinCo2Mmhg} mmHg`;
    reasons.push(reason);

    newAlerts.push({
      id: makeId("alert-eclss"),
      astronautId: astronaut.id,
      timestamp: now,
      category: "LIFE_SUPPORT",
      severity: "CRITICAL",
      title: `CABIN / SUIT DEPRESSURIZATION & HYPOXIA (${astronaut.callsign})`,
      description: `Xiaomi Watch H1 SpO2 dropped to ${input.spo2}% with suit pressure ${input.evaSuitPressureKpa} kPa and CO2 ${input.cabinCo2Mmhg} mmHg.`,
      metricsSnapshot: {
        spo2: input.spo2,
        evaSuitPressureKpa: input.evaSuitPressureKpa,
        cabinCo2Mmhg: input.cabinCo2Mmhg,
      },
      hermesActionTaken:
        "Sealed Bulkhead Sector B, activated Emergency N2/O2 High-Flow Repressurization + LiOH CO2 Scrubbers at 200%, and triggered Emergency Earth Return.",
      resolved: false,
    });
  } else if (input.spo2 < 93) {
    maxSeverity = escalate(maxSeverity, "HIGH");
    medAnomaly = true;
    reasons.push(`Mild Hypoxia warning: SpO2 ${input.spo2}%`);
  }

  newSubagentLogs.push({
    id: makeId("sub-med"),
    timestamp: now,
    subagentId: "MED-SENTINEL",
    subagentName: "MED-SENTINEL (Bio-Telemetry & ECLSS)",
    taskType: medAnomaly ? "EMERGENCY_BIOMED_INTERVENTION" : "CONTINUOUS_PPG_ECG_SCAN",
    status: medAnomaly ? "ALERT_TRIGGERED" : "ACTIVE",
    analysis: medAnomaly
      ? `Detected abnormal vitals on ${astronaut.name} (${astronaut.watchDeviceId}): HR ${input.heartRate} bpm, SpO2 ${input.spo2}%, BP ${input.bloodPressureSys}/${input.bloodPressureDia}, ECG ${input.ecgRhythm}.`
      : `Xiaomi Watch H1 PPG/ECG stream nominal for ${astronaut.callsign}: HR ${input.heartRate} bpm, SpO2 ${input.spo2}%, HRV ${input.hrvMs} ms.`,
    actionExecuted: medAnomaly
      ? "Activated medical O2 mix, logged telemetry snapshot to Supabase, and signaled NAV-PILOT for G-load limiting."
      : "Archived baseline cardiovascular telemetry packet.",
    confidence: 0.99,
  });

  // =========================================================================
  // 2. SUBAGENT: RAD-GUARD (Space Radiation Dosimetry & Shielding)
  // =========================================================================
  let radEmergency = false;
  if (input.radiationDoseRateUsvHr >= 400) {
    maxSeverity = escalate(maxSeverity, "CRITICAL");
    radEmergency = true;
    const reason = `Severe Solar Particle Event (SPE / X-Class Flare): ${input.radiationDoseRateUsvHr} uSv/hr detected`;
    reasons.push(reason);

    newAlerts.push({
      id: makeId("alert-rad"),
      astronautId: astronaut.id,
      timestamp: now,
      category: "RADIATION",
      severity: "CRITICAL",
      title: `EXTREME SOLAR RADIATION STORM (${input.radiationDoseRateUsvHr} uSv/hr)`,
      description: `Dosimeter spiked to ${input.radiationDoseRateUsvHr} uSv/hr (nominal < 35 uSv/hr). Unshielded exposure risks Acute Radiation Syndrome (ARS).`,
      metricsSnapshot: {
        radiationDoseRateUsvHr: input.radiationDoseRateUsvHr,
        cumulativeRadiationMsv: astronaut.cumulativeRadiationMsv,
      },
      hermesActionTaken:
        "RAD-GUARD commanded 180-deg Tail-to-Sun attitude slewing, energized 12-Tesla Magnetic Toroid Deflector, pumped potable water into Storm Shelter walls, and ordered crew to Core Hab.",
      resolved: false,
    });
  } else if (input.radiationDoseRateUsvHr >= 100) {
    maxSeverity = escalate(maxSeverity, "HIGH");
    reasons.push(
      `Elevated Cosmic/Solar Radiation Flux: ${input.radiationDoseRateUsvHr} uSv/hr`,
    );
  }

  newSubagentLogs.push({
    id: makeId("sub-rad"),
    timestamp: now,
    subagentId: "RAD-GUARD",
    subagentName: "RAD-GUARD (Dosimetry & Mag-Shielding)",
    taskType: radEmergency ? "SPE_STORM_SHIELD_PROTOCOL" : "DOSIMETRY_INTEGRATION",
    status: radEmergency ? "ALERT_TRIGGERED" : "ACTIVE",
    analysis: `Current flux: ${input.radiationDoseRateUsvHr} uSv/hr. ${astronaut.callsign} cumulative mission dose: ${astronaut.cumulativeRadiationMsv.toFixed(2)} mSv.`,
    actionExecuted: radEmergency
      ? "Engaged aft water-wall mass shielding + superconducting magnetic deflector array; requested NAV-PILOT attitude lock."
      : "Maintaining nominal forward Whipple & polyethylene shielding.",
    confidence: 0.98,
  });

  // =========================================================================
  // 3. SUBAGENT: PSY-ORACLE (Neuro-Cognitive, HRV Stress & Circadian Health)
  // =========================================================================
  let psyCrisis = false;
  if (input.stressIndex >= 84 || (input.hrvMs <= 22 && input.sleepQualityScore < 45)) {
    maxSeverity = escalate(maxSeverity, "HIGH");
    psyCrisis = true;
    const reason = `Acute Neuro-Cognitive Stress & Autonomic Exhaustion: Stress ${input.stressIndex}/100, HRV ${input.hrvMs} ms, Sleep ${input.sleepQualityScore}%`;
    reasons.push(reason);

    newAlerts.push({
      id: makeId("alert-psy"),
      astronautId: astronaut.id,
      timestamp: now,
      category: "PSYCHOLOGICAL",
      severity: input.stressIndex >= 90 ? "CRITICAL" : "HIGH",
      title: `COGNITIVE FATIGUE & AUTONOMIC STRESS ALERT (${astronaut.callsign})`,
      description: `Xiaomi Watch H1 HRV dropped to ${input.hrvMs} ms with Stress Index ${input.stressIndex}/100 and Sleep Quality ${input.sleepQualityScore}%. High risk of pilot error during critical operations.`,
      metricsSnapshot: {
        stressIndex: input.stressIndex,
        hrvMs: input.hrvMs,
        sleepQualityScore: input.sleepQualityScore,
      },
      hermesActionTaken:
        "PSY-ORACLE reallocated manual flight tasks to Hermes Autopilot, shifted habitat LEDs to 480nm/650nm calming spectrum, and initiated 40Hz vagal-nerve acoustic therapy.",
      resolved: false,
    });
  }

  newSubagentLogs.push({
    id: makeId("sub-psy"),
    timestamp: now,
    subagentId: "PSY-ORACLE",
    subagentName: "PSY-ORACLE (Cognitive & Behavioral AI)",
    taskType: psyCrisis ? "NEURO_STRESS_COUNTERMEASURE" : "HRV_CIRCADIAN_MONITORING",
    status: psyCrisis ? "ALERT_TRIGGERED" : "ACTIVE",
    analysis: `Stress Index ${input.stressIndex}/100, HRV ${input.hrvMs} ms, Sleep Score ${input.sleepQualityScore}%.`,
    actionExecuted: psyCrisis
      ? "Transferred high-cognitive checklist items to autonomous execution and started guided vagal resonance countermeasure."
      : "Crew cognitive readiness verified at optimal deep-space baseline.",
    confidence: 0.96,
  });

  // =========================================================================
  // 4. SUBAGENT: NAV-PILOT (Autonomous Ship Takeover, Trajectory & Earth DSN)
  // =========================================================================
  let updatedAutopilot: ShipAutopilotState = {
    ...currentAutopilot,
    updatedAt: now,
  };
  let autoEarthComm: EarthCommLog | null = null;

  const requiresTakeover =
    cardiacCritical ||
    lifeSupportCritical ||
    radEmergency ||
    input.stressIndex >= 92;

  if (requiresTakeover) {
    if (!currentAutopilot.humanOverrideEngaged) {
      // Autonomous Ship Takeover by Hermes!
      const maneuverChoice =
        cardiacCritical || lifeSupportCritical
          ? "fast_earth_return"
          : radEmergency
            ? "storm_shelter_attitude"
            : "fast_earth_return";

      const orbitalSolution = calculateOrbitalManeuver(
        maneuverChoice,
        cardiacCritical,
      );

      const takeoverReason =
        cardiacCritical || lifeSupportCritical
          ? `CRITICAL BIO-MEDICAL EMERGENCY (${astronaut.name}: HR ${input.heartRate} BPM, SpO2 ${input.spo2}%, ${input.ecgRhythm})`
          : radEmergency
            ? `EXTREME SOLAR PARTICLE STORM (${input.radiationDoseRateUsvHr} uSv/hr)`
            : `CREW COGNITIVE INCAPACITATION RISK (Stress ${input.stressIndex}/100, HRV ${input.hrvMs} ms)`;

      updatedAutopilot = {
        ...currentAutopilot,
        updatedAt: now,
        mode:
          maneuverChoice === "fast_earth_return"
            ? "EMERGENCY_EARTH_RETURN"
            : "HERMES_AUTONOMOUS_TAKEOVER",
        autonomousTakeoverActive: true,
        takeoverReason,
        currentManeuver: orbitalSolution.maneuverName,
        targetDestination: orbitalSolution.targetDestination,
        deltaVMetersPerSec: orbitalSolution.deltaVMetersPerSec,
        burnDurationSec: orbitalSolution.burnDurationSec,
        estimatedReturnHours: orbitalSolution.estimatedReturnHours,
        maxGLoad: orbitalSolution.maxGLoad,
        attitudePitch: orbitalSolution.attitudePitch,
        attitudeYaw: orbitalSolution.attitudeYaw,
        attitudeRoll: orbitalSolution.attitudeRoll,
        radiationShieldOrientation: orbitalSolution.radiationShieldOrientation,
        propulsionStatus: orbitalSolution.propulsionStatus,
        earthCommStatus: "EMERGENCY_BEACON",
      };

      newSubagentLogs.push({
        id: makeId("sub-nav"),
        timestamp: now,
        subagentId: "NAV-PILOT",
        subagentName: "NAV-PILOT (Autonomous Flight & Trajectory)",
        taskType: "AUTONOMOUS_SHIP_TAKEOVER_EXECUTION",
        status: "EXECUTING",
        analysis: `Crew threat threshold exceeded (${takeoverReason}). Computed ${orbitalSolution.maneuverName}: dV=${orbitalSolution.deltaVMetersPerSec} m/s, Burn=${orbitalSolution.burnDurationSec}s, Peak G=${orbitalSolution.maxGLoad}G, ETA=${orbitalSolution.estimatedReturnHours}h.`,
        actionExecuted: `Engaged Full Hermes Flight Control. Executing ${orbitalSolution.maneuverName} toward ${orbitalSolution.targetDestination} and broadcasting Priority-0 Mayday to NASA DSN (${currentAutopilot.dsnStation}).`,
        confidence: 0.99,
      });

      autoEarthComm = {
        id: makeId("comm-mayday"),
        timestamp: now,
        direction: "HERMES_AUTO_BEACON",
        sender: "HERMES-AI-AUTOPILOT",
        station: currentAutopilot.dsnStation,
        priority: "PRIORITY_0_MAYDAY",
        message: `[PRIORITY-0 AUTONOMOUS MAYDAY] Sonnenblume Hermes AI has assumed flight control. Reason: ${takeoverReason}. Executing ${orbitalSolution.maneuverName} (dV=${orbitalSolution.deltaVMetersPerSec} m/s, MaxG=${orbitalSolution.maxGLoad}G, Earth Return ETA=${orbitalSolution.estimatedReturnHours} hrs). Xiaomi Watch H1 telemetry packet attached.`,
        telemetryAttached: true,
        acknowledged: true,
      };
    } else {
      // Human Override is currently engaged -> Log recommendation without overriding human pilot
      newSubagentLogs.push({
        id: makeId("sub-nav"),
        timestamp: now,
        subagentId: "NAV-PILOT",
        subagentName: "NAV-PILOT (Autonomous Flight & Trajectory)",
        taskType: "TRAJECTORY_ADVISORY_ONLY",
        status: "OVERRIDDEN",
        analysis: `Critical anomaly detected (${reasons.join("; ")}), but Human Manual Override is engaged by ${currentAutopilot.overrideAuthorizedBy}.`,
        actionExecuted:
          "Pre-computed Fast Earth Return Lambert solution (dV=1840.5 m/s) on standby; awaiting human pilot authorization.",
        confidence: 0.99,
      });
    }
  } else {
    newSubagentLogs.push({
      id: makeId("sub-nav"),
      timestamp: now,
      subagentId: "NAV-PILOT",
      subagentName: "NAV-PILOT (Autonomous Flight & Trajectory)",
      taskType: "ORBITAL_STATE_VECTOR_TRACKING",
      status: "ACTIVE",
      analysis:
        "Trajectory state vector nominal. Star tracker & IMU residuals < 0.002 deg. DSN Goldstone carrier lock stable.",
      actionExecuted: "Maintaining deep-space cruise attitude and collision watch.",
      confidence: 0.99,
    });
  }

  // Update Astronaut record
  const incrementalDoseMsv = (input.radiationDoseRateUsvHr / 1000) * (1 / 60); // 1-min sample equivalent
  const mentalDelta =
    input.stressIndex > 75 ? -2.4 : input.stressIndex < 35 ? 0.5 : 0;
  const updatedMentalScore = Math.max(
    15,
    Math.min(100, Number((astronaut.mentalHealthScore + mentalDelta).toFixed(1))),
  );

  let newStatus: AstronautStatus = "NOMINAL";
  if (maxSeverity === "CRITICAL") {
    newStatus = "CRITICAL";
  } else if (maxSeverity === "HIGH") {
    newStatus = "MEDICAL_ALERT";
  } else if (maxSeverity === "MODERATE" || input.stressIndex > 65) {
    newStatus = "ELEVATED_STRESS";
  }

  const updatedAstronaut: Astronaut = {
    ...astronaut,
    cumulativeRadiationMsv: Number(
      (astronaut.cumulativeRadiationMsv + incrementalDoseMsv).toFixed(3),
    ),
    mentalHealthScore: updatedMentalScore,
    status: newStatus,
    watchConnected: true,
    updatedAt: now,
  };

  const telemetryRecord: XiaomiWatchTelemetry = {
    id: makeId("xwt"),
    astronautId: astronaut.id,
    timestamp: now,
    heartRate: Math.round(input.heartRate),
    spo2: Number(input.spo2.toFixed(1)),
    bloodPressureSys: Math.round(input.bloodPressureSys),
    bloodPressureDia: Math.round(input.bloodPressureDia),
    hrvMs: Number(input.hrvMs.toFixed(1)),
    skinTempC: Number(input.skinTempC.toFixed(2)),
    stressIndex: Number(input.stressIndex.toFixed(1)),
    sleepQualityScore: Number((input.sleepQualityScore ?? 84).toFixed(1)),
    radiationDoseRateUsvHr: Number(input.radiationDoseRateUsvHr.toFixed(2)),
    evaSuitPressureKpa: Number((input.evaSuitPressureKpa ?? 29.6).toFixed(2)),
    cabinCo2Mmhg: Number((input.cabinCo2Mmhg ?? 2.8).toFixed(2)),
    ecgRhythm: input.ecgRhythm ?? "NORMAL_SINUS",
    anomalyDetected: maxSeverity !== "NONE",
    anomalySeverity: maxSeverity,
    anomalyReasons: reasons,
  };

  return {
    telemetry: telemetryRecord,
    updatedAstronaut,
    newAlerts,
    newSubagentLogs,
    updatedAutopilot,
    autoEarthComm,
  };
}

/**
 * Generates realistic Xiaomi Watch H1 telemetry packets for the 6 mission simulation scenarios
 */
export function buildScenarioTelemetry(
  scenario:
    | "nominal"
    | "solar_storm_spe"
    | "cardiac_emergency"
    | "cabin_depressurization"
    | "mental_health_crisis"
    | "debris_collision_threat",
  astronautId: string,
): InsertXiaomiTelemetry {
  switch (scenario) {
    case "solar_storm_spe":
      return {
        astronautId,
        heartRate: 118,
        spo2: 96.4,
        bloodPressureSys: 142,
        bloodPressureDia: 90,
        hrvMs: 34.0,
        skinTempC: 37.1,
        stressIndex: 76.0,
        sleepQualityScore: 72.0,
        radiationDoseRateUsvHr: 685.4, // Extreme X-Class Solar Particle Event!
        evaSuitPressureKpa: 29.6,
        cabinCo2Mmhg: 3.1,
        ecgRhythm: "SINUS_TACHYCARDIA",
      };

    case "cardiac_emergency":
      return {
        astronautId,
        heartRate: 178,
        spo2: 86.5,
        bloodPressureSys: 176,
        bloodPressureDia: 112,
        hrvMs: 14.2,
        skinTempC: 37.9,
        stressIndex: 94.0,
        sleepQualityScore: 58.0,
        radiationDoseRateUsvHr: 24.5,
        evaSuitPressureKpa: 29.6,
        cabinCo2Mmhg: 3.2,
        ecgRhythm: "VTACH_ALERT",
      };

    case "cabin_depressurization":
      return {
        astronautId,
        heartRate: 152,
        spo2: 83.2,
        bloodPressureSys: 148,
        bloodPressureDia: 95,
        hrvMs: 19.5,
        skinTempC: 36.1,
        stressIndex: 91.0,
        sleepQualityScore: 70.0,
        radiationDoseRateUsvHr: 28.0,
        evaSuitPressureKpa: 18.4, // Critical pressure loss!
        cabinCo2Mmhg: 7.4, // Elevated CO2!
        ecgRhythm: "SINUS_TACHYCARDIA",
      };

    case "mental_health_crisis":
      return {
        astronautId,
        heartRate: 114,
        spo2: 97.1,
        bloodPressureSys: 146,
        bloodPressureDia: 94,
        hrvMs: 16.8,
        skinTempC: 37.3,
        stressIndex: 93.5,
        sleepQualityScore: 31.0,
        radiationDoseRateUsvHr: 22.1,
        evaSuitPressureKpa: 29.6,
        cabinCo2Mmhg: 3.4,
        ecgRhythm: "PVC_ECTOPIC",
      };

    case "debris_collision_threat":
      return {
        astronautId,
        heartRate: 128,
        spo2: 96.8,
        bloodPressureSys: 138,
        bloodPressureDia: 88,
        hrvMs: 38.0,
        skinTempC: 36.9,
        stressIndex: 74.0,
        sleepQualityScore: 80.0,
        radiationDoseRateUsvHr: 26.4,
        evaSuitPressureKpa: 29.6,
        cabinCo2Mmhg: 2.9,
        ecgRhythm: "SINUS_TACHYCARDIA",
      };

    case "nominal":
    default:
      return {
        astronautId,
        heartRate: 68 + Math.round((Math.random() - 0.5) * 6),
        spo2: Number((98.4 + (Math.random() - 0.5) * 0.8).toFixed(1)),
        bloodPressureSys: 118 + Math.round((Math.random() - 0.5) * 4),
        bloodPressureDia: 76 + Math.round((Math.random() - 0.5) * 4),
        hrvMs: Number((64.0 + (Math.random() - 0.5) * 6).toFixed(1)),
        skinTempC: 36.6,
        stressIndex: 22.5,
        sleepQualityScore: 89.0,
        radiationDoseRateUsvHr: 18.4,
        evaSuitPressureKpa: 29.6,
        cabinCo2Mmhg: 2.6,
        ecgRhythm: "NORMAL_SINUS",
      };
  }
}

/**
 * Interactive Hermes AI Agent Command & Diagnostic Handler
 * Has full read/write awareness of astronauts, Xiaomi Watch H1 streams, orbital mechanics, and ship systems.
 */
export function processHermesNaturalCommand(params: {
  prompt: string;
  language: "en" | "mn";
  astronauts: Astronaut[];
  latestTelemetry: Record<string, XiaomiWatchTelemetry>;
  autopilot: ShipAutopilotState;
}): {
  reply: string;
  delegatedSubagents: string[];
  recommendedManeuver?:
    | "evasive_burn"
    | "fast_earth_return"
    | "storm_shelter_attitude"
    | "nominal_orbit";
  toggleOverride?: boolean;
  subagentLog: HermesSubagentLog;
} {
  const { prompt, language, astronauts, latestTelemetry, autopilot } = params;
  const q = prompt.toLowerCase();
  const isMn = language === "mn" || /[а-яөүё]/i.test(prompt);

  const commander = astronauts[0];
  const cmdrTel = commander ? latestTelemetry[commander.id] : undefined;

  let recommendedManeuver:
    | "evasive_burn"
    | "fast_earth_return"
    | "storm_shelter_attitude"
    | "nominal_orbit"
    | undefined;
  let toggleOverride: boolean | undefined;
  const delegatedSubagents: string[] = ["HERMES-CORE"];

  if (
    q.includes("return") ||
    q.includes("abort") ||
    q.includes("earth") ||
    q.includes("буцах") ||
    q.includes("дэлхий")
  ) {
    recommendedManeuver = "fast_earth_return";
    delegatedSubagents.push("NAV-PILOT", "MED-SENTINEL");
  } else if (
    q.includes("evasive") ||
    q.includes("debris") ||
    q.includes("avoid") ||
    q.includes("тойрох") ||
    q.includes("мөргөлдөөн")
  ) {
    recommendedManeuver = "evasive_burn";
    delegatedSubagents.push("NAV-PILOT");
  } else if (
    q.includes("storm") ||
    q.includes("radiation") ||
    q.includes("shield") ||
    q.includes("цацраг") ||
    q.includes("шуурга")
  ) {
    recommendedManeuver = "storm_shelter_attitude";
    delegatedSubagents.push("RAD-GUARD", "NAV-PILOT");
  } else if (
    q.includes("nominal") ||
    q.includes("resume cruise") ||
    q.includes("энгийн")
  ) {
    recommendedManeuver = "nominal_orbit";
    delegatedSubagents.push("NAV-PILOT");
  }

  if (
    q.includes("manual override") ||
    q.includes("human control") ||
    q.includes("гар удирдлага")
  ) {
    toggleOverride = true;
    delegatedSubagents.push("NAV-PILOT");
  } else if (
    q.includes("autonomous") ||
    q.includes("hermes control") ||
    q.includes("автомат удирдлага")
  ) {
    toggleOverride = false;
    delegatedSubagents.push("NAV-PILOT");
  }

  if (
    q.includes("heart") ||
    q.includes("vital") ||
    q.includes("watch") ||
    q.includes("medical") ||
    q.includes("зүрх") ||
    q.includes("эрүүл")
  ) {
    if (!delegatedSubagents.includes("MED-SENTINEL")) {
      delegatedSubagents.push("MED-SENTINEL");
    }
  }

  if (
    q.includes("stress") ||
    q.includes("mental") ||
    q.includes("sleep") ||
    q.includes("сэтгэл") ||
    q.includes("нойр")
  ) {
    if (!delegatedSubagents.includes("PSY-ORACLE")) {
      delegatedSubagents.push("PSY-ORACLE");
    }
  }

  const crewSummaryEn = astronauts
    .map((a) => {
      const t = latestTelemetry[a.id];
      return `${a.callsign} (${a.name}): Status=${a.status}, HR=${t?.heartRate ?? 70}bpm, SpO2=${t?.spo2 ?? 98}%, Dose=${t?.radiationDoseRateUsvHr ?? 18}uSv/h, Stress=${t?.stressIndex ?? 22}/100`;
    })
    .join(" | ");

  let reply = "";
  if (isMn) {
    if (recommendedManeuver === "fast_earth_return") {
      reply = `[HERMES AI УДИРДЛАГА]: Дэлхий рүү хамгийн хурдан буцах Ламберт траекторийг (dV = 1840.5 м/с, G-ачаалал <= 1.65G, Буцах хугацаа = 148.5 цаг) идэвхжүүллээ. Xiaomi Watch H1-ийн био-мэдээллийг NASA Хьюстон төв рүү (Goldstone DS-14) дамжуулж байна. Багийн төлөв: ${cmdrTel ? `Зүрхний цохилт ${cmdrTel.heartRate} BPM, SpO2 ${cmdrTel.spo2}%` : "Хэвийн"}.`;
    } else if (recommendedManeuver === "storm_shelter_attitude") {
      reply = `[HERMES RAD-GUARD & NAV-PILOT]: Нарны титмийн цацрагийн шуурганаас хамгаалах горим идэвхжлээ. Хөлгийн хойд усан хаалтыг Нар руу чиглүүлж (Yaw 180°), 12-Тесла соронзон бамбайг 100% чадлаар ажиллуулж байна.`;
    } else if (recommendedManeuver === "evasive_burn") {
      reply = `[HERMES NAV-PILOT]: Сансрын хог хаягдлаас зайлсхийх маневр (dV = 342.8 м/с, +14 км орбитын хазайлт) амжилттай хийгдлээ.`;
    } else if (toggleOverride === true) {
      reply = `[HERMES AI]: Гар удирдлагын горим (Human Manual Override) идэвхжлээ. Хөлгийн удирдлагыг багийн ахлагчид шилжүүллээ. Био-телеметрийн хяналт хэвийн үргэлжилнэ.`;
    } else {
      reply = `[HERMES БҮРЭН ОНОШИЛГОО]: Sonnenblume хөлгийн горим: ${autopilot.mode}. ${crewSummaryEn}. Бүх 4 дэд агент (MED-SENTINEL, RAD-GUARD, PSY-ORACLE, NAV-PILOT) Xiaomi Watch H1-ийн мэдээллийг бодит хугацаанд хянаж байна.`;
    }
  } else {
    if (recommendedManeuver === "fast_earth_return") {
      reply = `[HERMES CORE -> NAV-PILOT & MED-SENTINEL]: Executing High-Energy Fast Earth Return trajectory (Lambert solution: dV = 1,840.5 m/s, G-load capped at 1.65G for crew cardiovascular protection, Earth Entry Interface ETA = 148.5 hrs). Priority-0 medical telemetry from Xiaomi Watch H1 transmitted to NASA Houston via ${autopilot.dsnStation}.`;
    } else if (recommendedManeuver === "storm_shelter_attitude") {
      reply = `[HERMES CORE -> RAD-GUARD & NAV-PILOT]: Solar Particle Event shield posture engaged. Slewing spacecraft 180 deg Tail-to-Sun, routing potable water into aft storm-shelter bulkhead, and energizing 12-Tesla superconducting magnetic deflector. Crew radiation flux attenuated by 78%.`;
    } else if (recommendedManeuver === "evasive_burn") {
      reply = `[HERMES CORE -> NAV-PILOT]: Executed Debris Conjunction Evasive Burn (dV = 342.8 m/s, +14 km inclination separation). Miss distance verified > 48.5 km. Spacecraft integrity 100%.`;
    } else if (toggleOverride === true) {
      reply = `[HERMES CORE]: Human Manual Override acknowledged. Autonomous thrusters safed and flight authority transferred to Commander Elena Vance. Hermes subagents remain in active bio-monitoring advisory mode.`;
    } else {
      reply = `[HERMES FULL DIAGNOSTIC REPORT]: Ship Mode: ${autopilot.mode} (${autopilot.currentManeuver}). Crew Telemetry via Xiaomi Watch H1: ${crewSummaryEn}. All 4 Subagents (MED-SENTINEL, RAD-GUARD, PSY-ORACLE, NAV-PILOT) online with full ship & life-support authority.`;
    }
  }

  const subagentLog: HermesSubagentLog = {
    id: makeId("sub-cmd"),
    timestamp: new Date().toISOString(),
    subagentId: "HERMES-CORE",
    subagentName: "HERMES-CORE (Executive Ship & Bio-AI)",
    taskType: "DIRECT_COMMAND_SYNTHESIS",
    status: "COMPLETED",
    analysis: `Processed command "${prompt.slice(0, 80)}" via [${delegatedSubagents.join(", ")}].`,
    actionExecuted: reply.slice(0, 180),
    confidence: 0.99,
  };

  return {
    reply,
    delegatedSubagents,
    recommendedManeuver,
    toggleOverride,
    subagentLog,
  };
}
