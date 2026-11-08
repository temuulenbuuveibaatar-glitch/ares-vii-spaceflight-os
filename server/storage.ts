import {
  type User,
  type InsertUser,
  type Astronaut,
  type XiaomiWatchTelemetry,
  type InsertXiaomiTelemetry,
  type AnomalyAlert,
  type HermesSubagentLog,
  type ShipAutopilotState,
  type EarthCommLog,
  type MissionOverviewResponse,
} from "@shared/schema";
import {
  evaluateTelemetryPacket,
  calculateOrbitalManeuver,
  buildScenarioTelemetry,
  computeRealTimePhysicsTick,
  formatGmitLocalTime,
  formatMissionElapsedTime,
} from "./hermesEngine";
import { supabaseManager } from "./supabase";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // ARES-VII Mission & Hermes Autonomous System methods
  getMissionOverview(): Promise<MissionOverviewResponse>;
  getAstronauts(): Promise<Astronaut[]>;
  getAstronaut(id: string): Promise<Astronaut | undefined>;
  ingestXiaomiTelemetry(input: InsertXiaomiTelemetry): Promise<{
    telemetry: XiaomiWatchTelemetry;
    astronaut: Astronaut;
    newAlerts: AnomalyAlert[];
    newSubagentLogs: HermesSubagentLog[];
    autopilotState: ShipAutopilotState;
  }>;
  triggerScenario(
    scenario:
      | "nominal"
      | "solar_storm_spe"
      | "cardiac_emergency"
      | "cabin_depressurization"
      | "mental_health_crisis"
      | "debris_collision_threat",
    astronautId?: string,
  ): Promise<MissionOverviewResponse>;
  setHumanOverride(
    engaged: boolean,
    authorizedBy: string,
    reason?: string,
  ): Promise<ShipAutopilotState>;
  executeShipManeuver(
    maneuver:
      | "evasive_burn"
      | "fast_earth_return"
      | "storm_shelter_attitude"
      | "nominal_orbit",
    triggeredBy?: string,
  ): Promise<ShipAutopilotState>;
  addSubagentLog(log: HermesSubagentLog): Promise<void>;
  sendEarthComm(params: {
    sender: string;
    priority:
      | "ROUTINE"
      | "TELEMETRY_SYNC"
      | "URGENT_MEDICAL"
      | "PRIORITY_0_MAYDAY";
    message: string;
    attachTelemetry?: boolean;
  }): Promise<{ downlink: EarthCommLog; uplinkReply: EarthCommLog }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  private astronauts: Map<string, Astronaut>;
  private telemetryHistory: XiaomiWatchTelemetry[];
  private alerts: AnomalyAlert[];
  private subagentLogs: HermesSubagentLog[];
  private autopilotState: ShipAutopilotState;
  private earthCommLogs: EarthCommLog[];
  private realTimeTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.users = new Map();
    this.currentId = 1;

    this.astronauts = new Map();
    this.telemetryHistory = [];
    this.alerts = [];
    this.subagentLogs = [];
    this.earthCommLogs = [];

    const now = new Date();
    const nowIso = now.toISOString();

    // 1. Seed 4 Astronauts on ARES-VII Deep Space Mission
    const initialAstronauts: Astronaut[] = [
      {
        id: "astro-1",
        name: "Cmdr. Elena Vance",
        role: "Mission Commander",
        callsign: "VALKYRIE-1",
        bloodType: "O-",
        cumulativeRadiationMsv: 48.21,
        mentalHealthScore: 94.0,
        boneDensityTScore: -0.3,
        status: "NOMINAL",
        watchDeviceId: "XIAOMI-H1-884A",
        watchConnected: true,
        updatedAt: nowIso,
      },
      {
        id: "astro-2",
        name: "Dr. Temuulen B.",
        role: "Flight Surgeon & GMIT Payload Specialist",
        callsign: "NOMAD-2",
        bloodType: "A+",
        cumulativeRadiationMsv: 44.72,
        mentalHealthScore: 92.5,
        boneDensityTScore: -0.2,
        status: "NOMINAL",
        watchDeviceId: "XIAOMI-H1-912B",
        watchConnected: true,
        updatedAt: nowIso,
      },
      {
        id: "astro-3",
        name: "Kenji Sato",
        role: "EVA & Nuclear Propulsion Specialist",
        callsign: "RONIN-3",
        bloodType: "B+",
        cumulativeRadiationMsv: 56.41,
        mentalHealthScore: 89.0,
        boneDensityTScore: -0.5,
        status: "NOMINAL",
        watchDeviceId: "XIAOMI-H1-309C",
        watchConnected: true,
        updatedAt: nowIso,
      },
      {
        id: "astro-4",
        name: "Sofia Lindqvist",
        role: "Guidance, Navigation & Control Pilot",
        callsign: "AURORA-4",
        bloodType: "AB+",
        cumulativeRadiationMsv: 41.94,
        mentalHealthScore: 93.0,
        boneDensityTScore: -0.3,
        status: "NOMINAL",
        watchDeviceId: "XIAOMI-H1-741D",
        watchConnected: true,
        updatedAt: nowIso,
      },
    ];

    for (const a of initialAstronauts) {
      this.astronauts.set(a.id, a);
    }

    // 2. Seed initial Xiaomi Watch H1 telemetry history (last 8 intervals)
    for (let i = 7; i >= 0; i--) {
      const ts = new Date(now.getTime() - i * 15000).toISOString();
      initialAstronauts.forEach((astro, idx) => {
        const baseHr = 66 + idx * 3 + Math.round(Math.sin(i + idx) * 3);
        const baseHrv = 68 - idx * 4 + Number((Math.cos(i) * 2.5).toFixed(1));
        this.telemetryHistory.unshift({
          id: `seed-xwt-${astro.id}-${i}`,
          astronautId: astro.id,
          timestamp: ts,
          heartRate: baseHr,
          spo2: Number((98.6 - idx * 0.2).toFixed(1)),
          bloodPressureSys: 116 + idx * 2,
          bloodPressureDia: 75 + idx,
          hrvMs: baseHrv,
          skinTempC: Number((36.55 + idx * 0.05).toFixed(2)),
          stressIndex: Number((21.0 + idx * 2.5).toFixed(1)),
          sleepQualityScore: 90 - idx * 2,
          radiationDoseRateUsvHr: Number((18.2 + Math.sin(i) * 1.4).toFixed(2)),
          evaSuitPressureKpa: 29.6,
          cabinCo2Mmhg: 2.6,
          ecgRhythm: "NORMAL_SINUS",
          anomalyDetected: false,
          anomalySeverity: "NONE",
          anomalyReasons: [],
        });
      });
    }

    // 3. Seed Ship Autopilot State with Real-Time Orbital & GMIT Ground Station fields
    this.autopilotState = {
      id: "ares-vii-autopilot",
      updatedAt: nowIso,
      mode: "NOMINAL_TRANSIT",
      autonomousTakeoverActive: false,
      takeoverReason: null,
      currentManeuver: "CIS-LUNAR_DEEP_SPACE_CRUISE",
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
      humanOverrideEngaged: false,
      overrideAuthorizedBy: null,
      overrideTimestamp: null,
      dsnStation: "GOLDSTONE_DS14 + GMIT_NALAIKH_MN",
      earthCommStatus: "CONNECTED",
      signalLatencySec: 184.2,
      uplinkKbps: 1240.0,
      distanceToEarthKm: 55221771.0,
      orbitalVelocityKmS: 28.42,
      propellantMassKg: 44200.0,
      shieldAttenuationPct: 32.0,
      dynamicCardioGCap: 2.45,
      utcTimestamp: nowIso,
      gmitLocalTime: formatGmitLocalTime(now),
      missionElapsedTime: formatMissionElapsedTime(now.getTime()),
      gmitStationStatus:
        "GMIT_NALAIKH_MN (47.78°N, 107.26°E) — S/X-BAND TELEMETRY LOCKED",
    };

    // 4. Seed Hermes 4 Subagent Logs
    this.subagentLogs = [
      {
        id: "seed-sub-1",
        timestamp: nowIso,
        subagentId: "MED-SENTINEL",
        subagentName: "MED-SENTINEL (Bio-Telemetry & ECLSS)",
        taskType: "XIAOMI_H1_BLE_STREAM_LOCK",
        status: "ACTIVE",
        analysis:
          "Receiving 128Hz ECG + dual-wavelength PPG SpO2/HRV telemetry from 4 crew Xiaomi Watch H1 devices. All cardiovascular baselines nominal.",
        actionExecuted:
          "Dynamic G-load limit calibrated at 2.45G; continuous Supabase cloud replication standing by.",
        confidence: 0.99,
      },
      {
        id: "seed-sub-2",
        timestamp: nowIso,
        subagentId: "RAD-GUARD",
        subagentName: "RAD-GUARD (Dosimetry & Mag-Shielding)",
        taskType: "HELIOSPHERIC_PROTON_FLUX_WATCH",
        status: "ACTIVE",
        analysis:
          "Galactic Cosmic Ray (GCR) background at 18.4 uSv/hr. Aft water-wall storm shelter pressurized and 12-Tesla magnetic toroid ready for instant trigger.",
        actionExecuted:
          "Real-time dose integrator running at 1 Hz; crew cumulative dose well below NASA 600 mSv career limit.",
        confidence: 0.98,
      },
      {
        id: "seed-sub-3",
        timestamp: nowIso,
        subagentId: "PSY-ORACLE",
        subagentName: "PSY-ORACLE (Cognitive & Behavioral AI)",
        taskType: "AUTONOMIC_HRV_CIRCADIAN_AUDIT",
        status: "ACTIVE",
        analysis:
          "Crew mean HRV 64.5 ms, Stress Index 22.8/100, Sleep Quality 88%. Zero isolation-induced cognitive drift detected.",
        actionExecuted:
          "Synchronized habitat SLA-LED circadian cycle with GMT/GMIT mission schedule.",
        confidence: 0.97,
      },
      {
        id: "seed-sub-4",
        timestamp: nowIso,
        subagentId: "NAV-PILOT",
        subagentName: "NAV-PILOT (Autonomous Flight & Trajectory)",
        taskType: "REALTIME_VIS_VIVA_LAMBERT_SOLVER",
        status: "ACTIVE",
        analysis:
          "Orbital velocity v(t) = 28.42 km/s at r = 55.22M km from Earth. Continuous Lambert abort solution pre-computed in background.",
        actionExecuted:
          "Autonomous Ship Takeover armed (triggers automatically if crew vitals or radiation exceed critical safety thresholds while Human Override is off).",
        confidence: 0.99,
      },
    ];

    // 5. Seed Earth DSN & GMIT Ground Station Comm Logs
    this.earthCommLogs = [
      {
        id: "seed-comm-1",
        timestamp: new Date(now.getTime() - 120000).toISOString(),
        direction: "UPLINK_FROM_EARTH",
        sender: "HOUSTON MCC & GMIT NALAIKH GROUND STATION (47.78°N, 107.26°E)",
        station: "GOLDSTONE_DS14 + GMIT_NALAIKH_MN",
        priority: "TELEMETRY_SYNC",
        message:
          "ARES-VII, copy nominal Xiaomi Watch H1 bio-telemetry across all 4 crewmembers. GMIT Nalaikh Ground Station (UTC+8) and NASA Goldstone DS-14 have full carrier lock. Hermes Autonomous Flight Takeover authority verified.",
        telemetryAttached: true,
        acknowledged: true,
      },
      {
        id: "seed-comm-2",
        timestamp: new Date(now.getTime() - 45000).toISOString(),
        direction: "DOWNLINK_TO_EARTH",
        sender: "Dr. Temuulen B. (NOMAD-2)",
        station: "GMIT_NALAIKH_MN (47.78°N, 107.26°E)",
        priority: "ROUTINE",
        message:
          "Houston & GMIT Nalaikh Mission Control, Xiaomi Watch H1 real-time ECG/SpO2/Radiation stream is locked into Hermes AI. All 4 subagents green.",
        telemetryAttached: true,
        acknowledged: true,
      },
    ];

    // Start 1-second continuous real-time physics & bio-telemetry loop
    this.startRealTimePhysicsLoop();
  }

  private startRealTimePhysicsLoop() {
    if (this.realTimeTimer) clearInterval(this.realTimeTimer);
    this.realTimeTimer = setInterval(() => {
      const latestByAstro = this.getLatestTelemetryMap();
      const astronautsList = Array.from(this.astronauts.values());
      const { updatedAutopilot, updatedAstronauts } = computeRealTimePhysicsTick(
        this.autopilotState,
        astronautsList,
        latestByAstro,
        1.0,
      );
      this.autopilotState = updatedAutopilot;
      for (const a of updatedAstronauts) {
        this.astronauts.set(a.id, a);
      }

      // Every 5 seconds, add subtle physiological micro-variation to connected Xiaomi Watch H1 vitals
      // if no critical emergency is active, so live charts & telemetry pulse organically in real time
      const nowSec = Math.floor(Date.now() / 1000);
      if (nowSec % 5 === 0) {
        for (const a of updatedAstronauts) {
          const prev = latestByAstro[a.id];
          if (prev && !prev.anomalyDetected) {
            const jitterHr = Math.max(
              54,
              Math.min(95, prev.heartRate + Math.round((Math.random() - 0.5) * 2)),
            );
            const jitterSpo2 = Math.max(
              96.5,
              Math.min(
                99.8,
                Number((prev.spo2 + (Math.random() - 0.5) * 0.2).toFixed(1)),
              ),
            );
            const jitterRad = Math.max(
              15.2,
              Number(
                (prev.radiationDoseRateUsvHr + (Math.random() - 0.5) * 0.6).toFixed(2),
              ),
            );
            const updatedPacket: XiaomiWatchTelemetry = {
              ...prev,
              id: `live-xwt-${a.id}-${Date.now()}`,
              timestamp: new Date().toISOString(),
              heartRate: jitterHr,
              spo2: jitterSpo2,
              radiationDoseRateUsvHr: jitterRad,
            };
            this.telemetryHistory.unshift(updatedPacket);
            if (this.telemetryHistory.length > 120) {
              this.telemetryHistory.length = 120;
            }
          }
        }
      }
    }, 1000);
  }

  private getLatestTelemetryMap(): Record<string, XiaomiWatchTelemetry> {
    const latest: Record<string, XiaomiWatchTelemetry> = {};
    for (const t of this.telemetryHistory) {
      if (!latest[t.astronautId]) {
        latest[t.astronautId] = t;
      }
    }
    return latest;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAstronauts(): Promise<Astronaut[]> {
    return Array.from(this.astronauts.values());
  }

  async getAstronaut(id: string): Promise<Astronaut | undefined> {
    return this.astronauts.get(id);
  }

  async getMissionOverview(): Promise<MissionOverviewResponse> {
    const astronauts = Array.from(this.astronauts.values());
    const latestTelemetryByAstronaut = this.getLatestTelemetryMap();
    return {
      astronauts,
      latestTelemetryByAstronaut,
      recentTelemetry: this.telemetryHistory.slice(0, 40),
      activeAlerts: this.alerts.slice(0, 25),
      subagentLogs: this.subagentLogs.slice(0, 30),
      autopilotState: this.autopilotState,
      earthCommLogs: this.earthCommLogs.slice(0, 25),
      supabaseStatus: supabaseManager.getStatus(),
    };
  }

  async ingestXiaomiTelemetry(input: InsertXiaomiTelemetry) {
    const astronaut =
      this.astronauts.get(input.astronautId) ||
      Array.from(this.astronauts.values())[0];

    const evalResult = evaluateTelemetryPacket(
      input,
      astronaut,
      this.autopilotState,
    );

    // Update in-memory stores
    this.astronauts.set(evalResult.updatedAstronaut.id, evalResult.updatedAstronaut);
    this.telemetryHistory.unshift(evalResult.telemetry);
    if (this.telemetryHistory.length > 120) {
      this.telemetryHistory.length = 120;
    }

    for (const al of evalResult.newAlerts) {
      this.alerts.unshift(al);
    }
    for (const log of evalResult.newSubagentLogs) {
      this.subagentLogs.unshift(log);
    }
    if (this.subagentLogs.length > 80) {
      this.subagentLogs.length = 80;
    }

    this.autopilotState = evalResult.updatedAutopilot;

    if (evalResult.autoEarthComm) {
      this.earthCommLogs.unshift(evalResult.autoEarthComm);
    }

    // Non-blocking sync to Supabase if configured
    void supabaseManager.syncAstronaut(evalResult.updatedAstronaut);
    void supabaseManager.syncTelemetry(evalResult.telemetry);
    void supabaseManager.syncAutopilotState(this.autopilotState);
    for (const al of evalResult.newAlerts) {
      void supabaseManager.syncAlert(al);
    }
    for (const log of evalResult.newSubagentLogs) {
      void supabaseManager.syncSubagentLog(log);
    }
    if (evalResult.autoEarthComm) {
      void supabaseManager.syncEarthComm(evalResult.autoEarthComm);
    }

    return {
      telemetry: evalResult.telemetry,
      astronaut: evalResult.updatedAstronaut,
      newAlerts: evalResult.newAlerts,
      newSubagentLogs: evalResult.newSubagentLogs,
      autopilotState: this.autopilotState,
    };
  }

  async triggerScenario(
    scenario:
      | "nominal"
      | "solar_storm_spe"
      | "cardiac_emergency"
      | "cabin_depressurization"
      | "mental_health_crisis"
      | "debris_collision_threat",
    astronautId = "astro-1",
  ): Promise<MissionOverviewResponse> {
    if (scenario === "nominal") {
      // Reset all astronauts and ship to nominal state
      const nowIso = new Date().toISOString();
      for (const [id, a] of this.astronauts.entries()) {
        const resetAstro: Astronaut = {
          ...a,
          status: "NOMINAL",
          mentalHealthScore: Math.max(90, a.mentalHealthScore),
          updatedAt: nowIso,
        };
        this.astronauts.set(id, resetAstro);
        const nominalPacket = buildScenarioTelemetry("nominal", id);
        await this.ingestXiaomiTelemetry(nominalPacket);
      }
      this.alerts = this.alerts.map((al) => ({ ...al, resolved: true }));
      await this.executeShipManeuver("nominal_orbit", "HERMES_NOMINAL_RESTORE");
      return this.getMissionOverview();
    }

    if (scenario === "debris_collision_threat") {
      const packet = buildScenarioTelemetry("debris_collision_threat", astronautId);
      await this.ingestXiaomiTelemetry(packet);
      if (!this.autopilotState.humanOverrideEngaged) {
        await this.executeShipManeuver(
          "evasive_burn",
          "HERMES_NAV_PILOT_DEBRIS_GUARD",
        );
      }
      return this.getMissionOverview();
    }

    const packet = buildScenarioTelemetry(scenario, astronautId);
    await this.ingestXiaomiTelemetry(packet);
    return this.getMissionOverview();
  }

  async setHumanOverride(
    engaged: boolean,
    authorizedBy: string,
    reason?: string,
  ): Promise<ShipAutopilotState> {
    const nowIso = new Date().toISOString();

    if (engaged) {
      this.autopilotState = {
        ...this.autopilotState,
        updatedAt: nowIso,
        mode: "HUMAN_MANUAL_CONTROL",
        autonomousTakeoverActive: false,
        propulsionStatus: "MANUAL_THROTTLE",
        humanOverrideEngaged: true,
        overrideAuthorizedBy: authorizedBy,
        overrideTimestamp: nowIso,
      };
    } else {
      this.autopilotState = {
        ...this.autopilotState,
        updatedAt: nowIso,
        mode: "NOMINAL_TRANSIT",
        humanOverrideEngaged: false,
        overrideAuthorizedBy: null,
        overrideTimestamp: null,
        propulsionStatus: "STANDBY_NOMINAL",
      };
    }

    const log: HermesSubagentLog = {
      id: `sub-override-${Date.now()}`,
      timestamp: nowIso,
      subagentId: "NAV-PILOT",
      subagentName: "NAV-PILOT (Autonomous Flight & Trajectory)",
      taskType: engaged
        ? "HUMAN_MANUAL_OVERRIDE_ENGAGED"
        : "AUTONOMOUS_AUTHORITY_RESTORED",
      status: engaged ? "OVERRIDDEN" : "ACTIVE",
      analysis: engaged
        ? `Manual flight control asserted by ${authorizedBy}. Reason: ${reason || "Commander manual helm takeover"}.`
        : `Human Override disengaged by ${authorizedBy}. Hermes autonomous flight & takeover protection re-armed.`,
      actionExecuted: engaged
        ? "Transferred attitude & throttle buses to crew deck; Hermes subagents remaining in continuous bio-advisory mode."
        : "Resumed autonomous orbital state vector control.",
      confidence: 1.0,
    };

    this.subagentLogs.unshift(log);
    void supabaseManager.syncAutopilotState(this.autopilotState);
    void supabaseManager.syncSubagentLog(log);

    return this.autopilotState;
  }

  async executeShipManeuver(
    maneuver:
      | "evasive_burn"
      | "fast_earth_return"
      | "storm_shelter_attitude"
      | "nominal_orbit",
    triggeredBy = "CREW_COMMAND",
  ): Promise<ShipAutopilotState> {
    const nowIso = new Date().toISOString();
    const anyCardiacAlert = Array.from(this.astronauts.values()).some(
      (a) => a.status === "CRITICAL",
    );
    const sol = calculateOrbitalManeuver(maneuver, anyCardiacAlert);

    this.autopilotState = {
      ...this.autopilotState,
      updatedAt: nowIso,
      mode: sol.mode,
      autonomousTakeoverActive:
        maneuver !== "nominal_orbit" && !this.autopilotState.humanOverrideEngaged,
      takeoverReason:
        maneuver === "nominal_orbit"
          ? null
          : `Maneuver (${sol.maneuverName}) triggered by ${triggeredBy}`,
      currentManeuver: sol.maneuverName,
      targetDestination: sol.targetDestination,
      deltaVMetersPerSec: sol.deltaVMetersPerSec,
      burnDurationSec: sol.burnDurationSec,
      estimatedReturnHours: sol.estimatedReturnHours,
      maxGLoad: sol.maxGLoad,
      attitudePitch: sol.attitudePitch,
      attitudeYaw: sol.attitudeYaw,
      attitudeRoll: sol.attitudeRoll,
      radiationShieldOrientation: sol.radiationShieldOrientation,
      propulsionStatus: sol.propulsionStatus,
    };

    const log: HermesSubagentLog = {
      id: `sub-maneuver-${Date.now()}`,
      timestamp: nowIso,
      subagentId: "NAV-PILOT",
      subagentName: "NAV-PILOT (Autonomous Flight & Trajectory)",
      taskType: `MANEUVER_${maneuver.toUpperCase()}`,
      status: "EXECUTING",
      analysis: `Initiated ${sol.maneuverName} (${triggeredBy}): dV=${sol.deltaVMetersPerSec} m/s, Burn=${sol.burnDurationSec}s, Peak G=${sol.maxGLoad}G, Return ETA=${sol.estimatedReturnHours}h.`,
      actionExecuted: `Set attitude [${sol.attitudePitch}°, ${sol.attitudeYaw}°, ${sol.attitudeRoll}°] and shield posture ${sol.radiationShieldOrientation}.`,
      confidence: 0.99,
    };

    this.subagentLogs.unshift(log);
    void supabaseManager.syncAutopilotState(this.autopilotState);
    void supabaseManager.syncSubagentLog(log);

    return this.autopilotState;
  }

  async addSubagentLog(log: HermesSubagentLog): Promise<void> {
    this.subagentLogs.unshift(log);
    void supabaseManager.syncSubagentLog(log);
  }

  async sendEarthComm(params: {
    sender: string;
    priority:
      | "ROUTINE"
      | "TELEMETRY_SYNC"
      | "URGENT_MEDICAL"
      | "PRIORITY_0_MAYDAY";
    message: string;
    attachTelemetry?: boolean;
  }): Promise<{ downlink: EarthCommLog; uplinkReply: EarthCommLog }> {
    const now = new Date();
    const downlink: EarthCommLog = {
      id: `comm-down-${Date.now()}`,
      timestamp: now.toISOString(),
      direction: "DOWNLINK_TO_EARTH",
      sender: params.sender,
      station: this.autopilotState.dsnStation,
      priority: params.priority,
      message: params.message,
      telemetryAttached: params.attachTelemetry ?? true,
      acknowledged: true,
    };

    const uplinkReply: EarthCommLog = {
      id: `comm-up-${Date.now() + 1}`,
      timestamp: new Date(now.getTime() + 1200).toISOString(),
      direction: "UPLINK_FROM_EARTH",
      sender: "HOUSTON FLIGHT SURGEON & GMIT NALAIKH CONTROL",
      station: "GOLDSTONE_DS14 + GMIT_NALAIKH_MN (47.78°N, 107.26°E)",
      priority: params.priority,
      message:
        params.priority === "PRIORITY_0_MAYDAY" ||
        params.priority === "URGENT_MEDICAL"
          ? `[ACK PRIORITY-0] ARES-VII, Houston Flight Surgeon & GMIT Nalaikh Station copy your emergency telemetry packet (one-way light latency ${this.autopilotState.signalLatencySec}s). We concur with Hermes MED-SENTINEL & NAV-PILOT Fast Earth Return trajectory (ETA ${this.autopilotState.estimatedReturnHours}h). Recovery forces alerted.`
          : `[ACK TELEMETRY] ARES-VII, Houston & GMIT Nalaikh Ground Station copy message and Xiaomi Watch H1 biometric frame. Orbital state vector and crew dosimetry verified nominal.`,
      telemetryAttached: false,
      acknowledged: true,
    };

    this.earthCommLogs.unshift(uplinkReply);
    this.earthCommLogs.unshift(downlink);

    void supabaseManager.syncEarthComm(downlink);
    void supabaseManager.syncEarthComm(uplinkReply);

    return { downlink, uplinkReply };
  }
}

export const storage = new MemStorage();
