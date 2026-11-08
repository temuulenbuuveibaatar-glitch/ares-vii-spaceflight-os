import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ============================================================================
// SONNENBLUME DEEP SPACE MISSION & HERMES AI AUTONOMOUS SYSTEM SCHEMAS
// ============================================================================

export type AstronautStatus =
  | "NOMINAL"
  | "ELEVATED_STRESS"
  | "MEDICAL_ALERT"
  | "CRITICAL"
  | "EVA_ACTIVE";

export type EcgRhythmType =
  | "NORMAL_SINUS"
  | "SINUS_TACHYCARDIA"
  | "SINUS_BRADYCARDIA"
  | "ATRIAL_FIBRILLATION"
  | "PVC_ECTOPIC"
  | "VTACH_ALERT";

export type AnomalySeverity = "NONE" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type AlertCategory =
  | "MEDICAL"
  | "RADIATION"
  | "PSYCHOLOGICAL"
  | "NAVIGATION"
  | "LIFE_SUPPORT";

export type HermesSubagentId =
  | "MED-SENTINEL"
  | "RAD-GUARD"
  | "PSY-ORACLE"
  | "NAV-PILOT"
  | "HERMES-CORE";

export type ShipAutopilotMode =
  | "NOMINAL_TRANSIT"
  | "HERMES_AUTONOMOUS_TAKEOVER"
  | "EVASIVE_MANEUVER"
  | "EMERGENCY_EARTH_RETURN"
  | "STORM_SHELTER_ATTITUDE"
  | "HUMAN_MANUAL_CONTROL";

export type PropulsionStatus =
  | "STANDBY_NOMINAL"
  | "WARMING_REACTOR"
  | "ACTIVE_BURN"
  | "COAST_PHASE"
  | "MANUAL_THROTTLE";

export type EarthCommStatus =
  | "CONNECTED"
  | "HIGH_LATENCY"
  | "SOLAR_BLACKOUT"
  | "EMERGENCY_BEACON";

export interface Astronaut {
  id: string;
  name: string;
  role: string;
  callsign: string;
  bloodType: string;
  cumulativeRadiationMsv: number;
  mentalHealthScore: number;
  boneDensityTScore: number;
  status: AstronautStatus;
  watchDeviceId: string;
  watchConnected: boolean;
  updatedAt: string;
}

export interface XiaomiWatchTelemetry {
  id: string;
  astronautId: string;
  timestamp: string;
  heartRate: number;
  spo2: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  hrvMs: number;
  skinTempC: number;
  stressIndex: number;
  sleepQualityScore: number;
  radiationDoseRateUsvHr: number;
  evaSuitPressureKpa: number;
  cabinCo2Mmhg: number;
  ecgRhythm: EcgRhythmType;
  anomalyDetected: boolean;
  anomalySeverity: AnomalySeverity;
  anomalyReasons: string[];
}

export const insertXiaomiTelemetrySchema = z.object({
  astronautId: z.string().min(1),
  heartRate: z.number().min(20).max(260),
  spo2: z.number().min(50).max(100),
  bloodPressureSys: z.number().min(50).max(260),
  bloodPressureDia: z.number().min(30).max(180),
  hrvMs: z.number().min(1).max(250),
  skinTempC: z.number().min(30).max(43),
  stressIndex: z.number().min(0).max(100),
  sleepQualityScore: z.number().min(0).max(100).optional().default(82),
  radiationDoseRateUsvHr: z.number().min(0).max(50000),
  evaSuitPressureKpa: z.number().min(0).max(120).optional().default(29.6),
  cabinCo2Mmhg: z.number().min(0).max(50).optional().default(2.8),
  ecgRhythm: z
    .enum([
      "NORMAL_SINUS",
      "SINUS_TACHYCARDIA",
      "SINUS_BRADYCARDIA",
      "ATRIAL_FIBRILLATION",
      "PVC_ECTOPIC",
      "VTACH_ALERT",
    ])
    .optional()
    .default("NORMAL_SINUS"),
});

export type InsertXiaomiTelemetry = z.infer<typeof insertXiaomiTelemetrySchema>;

export interface AnomalyAlert {
  id: string;
  astronautId: string;
  timestamp: string;
  category: AlertCategory;
  severity: Exclude<AnomalySeverity, "NONE">;
  title: string;
  description: string;
  metricsSnapshot: Record<string, number | string>;
  hermesActionTaken: string;
  resolved: boolean;
}

export interface HermesSubagentLog {
  id: string;
  timestamp: string;
  subagentId: HermesSubagentId;
  subagentName: string;
  taskType: string;
  status:
    | "ACTIVE"
    | "EXECUTING"
    | "COMPLETED"
    | "STANDBY"
    | "ALERT_TRIGGERED"
    | "OVERRIDDEN";
  analysis: string;
  actionExecuted: string;
  confidence: number;
}

export interface ShipAutopilotState {
  id: string;
  updatedAt: string;
  mode: ShipAutopilotMode;
  autonomousTakeoverActive: boolean;
  takeoverReason: string | null;
  currentManeuver: string;
  targetDestination: string;
  deltaVMetersPerSec: number;
  burnDurationSec: number;
  estimatedReturnHours: number;
  maxGLoad: number;
  attitudePitch: number;
  attitudeYaw: number;
  attitudeRoll: number;
  radiationShieldOrientation: string;
  propulsionStatus: PropulsionStatus;
  humanOverrideEngaged: boolean;
  overrideAuthorizedBy: string | null;
  overrideTimestamp: string | null;
  dsnStation: string;
  earthCommStatus: EarthCommStatus;
  signalLatencySec: number;
  uplinkKbps: number;
  // Real-Time Physics & GMIT Ground Station Synchronization Telemetry
  distanceToEarthKm?: number;
  orbitalVelocityKmS?: number;
  propellantMassKg?: number;
  shieldAttenuationPct?: number;
  dynamicCardioGCap?: number;
  utcTimestamp?: string;
  gmitLocalTime?: string;
  missionElapsedTime?: string;
  gmitStationStatus?: string;
}

export interface EarthCommLog {
  id: string;
  timestamp: string;
  direction: "DOWNLINK_TO_EARTH" | "UPLINK_FROM_EARTH" | "HERMES_AUTO_BEACON";
  sender: string;
  station: string;
  priority: "ROUTINE" | "TELEMETRY_SYNC" | "URGENT_MEDICAL" | "PRIORITY_0_MAYDAY";
  message: string;
  telemetryAttached: boolean;
  acknowledged: boolean;
}

export interface SupabaseConfigStatus {
  configured: boolean;
  connected: boolean;
  url: string | null;
  mode: "SUPABASE_CLOUD_SYNC" | "LOCAL_RESILIENT_MEMORY";
  lastSyncAt: string | null;
  tablesReady: boolean;
  message: string;
}

export const hermesCommandSchema = z.object({
  prompt: z.string().min(1),
  astronautId: z.string().optional(),
  language: z.enum(["en", "mn"]).optional().default("en"),
});

export type HermesCommandRequest = z.infer<typeof hermesCommandSchema>;

export const simulateScenarioSchema = z.object({
  scenario: z.enum([
    "nominal",
    "solar_storm_spe",
    "cardiac_emergency",
    "cabin_depressurization",
    "mental_health_crisis",
    "debris_collision_threat",
  ]),
  astronautId: z.string().optional().default("astro-1"),
});

export type SimulateScenarioRequest = z.infer<typeof simulateScenarioSchema>;

export const humanOverrideSchema = z.object({
  engaged: z.boolean(),
  authorizedBy: z.string().min(1).default("Cmdr. Elena Vance"),
  reason: z.string().optional(),
});

export type HumanOverrideRequest = z.infer<typeof humanOverrideSchema>;

export const shipManeuverSchema = z.object({
  maneuver: z.enum([
    "evasive_burn",
    "fast_earth_return",
    "storm_shelter_attitude",
    "nominal_orbit",
  ]),
  triggeredBy: z.string().optional().default("CREW_COMMAND"),
});

export type ShipManeuverRequest = z.infer<typeof shipManeuverSchema>;

export const earthCommSendSchema = z.object({
  sender: z.string().min(1).default("Cmdr. Elena Vance"),
  priority: z
    .enum(["ROUTINE", "TELEMETRY_SYNC", "URGENT_MEDICAL", "PRIORITY_0_MAYDAY"])
    .default("TELEMETRY_SYNC"),
  message: z.string().min(1),
  attachTelemetry: z.boolean().optional().default(true),
});

export type EarthCommSendRequest = z.infer<typeof earthCommSendSchema>;

export const supabaseConfigSchema = z.object({
  url: z.string().url(),
  anonKey: z.string().min(10),
});

export interface MissionOverviewResponse {
  astronauts: Astronaut[];
  latestTelemetryByAstronaut: Record<string, XiaomiWatchTelemetry>;
  recentTelemetry: XiaomiWatchTelemetry[];
  activeAlerts: AnomalyAlert[];
  subagentLogs: HermesSubagentLog[];
  autopilotState: ShipAutopilotState;
  earthCommLogs: EarthCommLog[];
  supabaseStatus: SupabaseConfigStatus;
}
