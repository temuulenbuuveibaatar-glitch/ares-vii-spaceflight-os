import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  Astronaut,
  XiaomiWatchTelemetry,
  AnomalyAlert,
  HermesSubagentLog,
  ShipAutopilotState,
  EarthCommLog,
  SupabaseConfigStatus,
} from "@shared/schema";

class SupabaseMissionManager {
  private client: SupabaseClient | null = null;
  private supabaseUrl: string | null = null;
  private supabaseKey: string | null = null;
  private connected = false;
  private tablesReady = false;
  private lastSyncAt: string | null = null;
  private statusMessage =
    "Operating in Resilient Onboard Memory Mode (Configure Supabase URL & Key to enable live cloud sync).";

  constructor() {
    const envUrl =
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
    const envKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      "";

    if (envUrl && envKey) {
      this.initClient(envUrl, envKey);
    }
  }

  private initClient(url: string, key: string) {
    try {
      this.supabaseUrl = url.trim();
      this.supabaseKey = key.trim();
      this.client = createClient(this.supabaseUrl, this.supabaseKey, {
        auth: { persistSession: false },
      });
      this.statusMessage =
        "Supabase client initialized. Ready to verify schema & sync telemetry.";
    } catch (err: any) {
      this.client = null;
      this.connected = false;
      this.statusMessage = `Supabase initialization failed: ${err?.message || "Invalid credentials"}`;
    }
  }

  public async configureSupabase(
    url: string,
    key: string,
  ): Promise<SupabaseConfigStatus> {
    this.initClient(url, key);
    await this.verifyConnection();
    return this.getStatus();
  }

  public async verifyConnection(): Promise<boolean> {
    if (!this.client) {
      this.connected = false;
      this.tablesReady = false;
      return false;
    }

    try {
      const { error } = await this.client
        .from("astronauts")
        .select("id")
        .limit(1);

      if (error) {
        // Connected to Supabase instance, but migration 001 might not be applied yet
        if (
          error.code === "42P01" ||
          error.message.includes("does not exist") ||
          error.message.includes("schema cache")
        ) {
          this.connected = true;
          this.tablesReady = false;
          this.statusMessage =
            "Connected to Supabase endpoint, but tables not found. Run supabase/migrations/001_astronaut_mission_schema.sql in Supabase SQL Editor.";
          return true;
        }
        this.connected = false;
        this.tablesReady = false;
        this.statusMessage = `Supabase query error: ${error.message}`;
        return false;
      }

      this.connected = true;
      this.tablesReady = true;
      this.lastSyncAt = new Date().toISOString();
      this.statusMessage =
        "Supabase Cloud Telemetry & Hermes DB active and synchronized.";
      return true;
    } catch (err: any) {
      this.connected = false;
      this.tablesReady = false;
      this.statusMessage = `Supabase network unreachable: ${err?.message || "Unknown error"}`;
      return false;
    }
  }

  public getStatus(): SupabaseConfigStatus {
    return {
      configured: Boolean(this.client && this.supabaseUrl),
      connected: this.connected,
      url: this.supabaseUrl
        ? this.supabaseUrl.replace(/^(https?:\/\/[^.]+).*$/, "$1.supabase.co")
        : null,
      mode:
        this.connected && this.tablesReady
          ? "SUPABASE_CLOUD_SYNC"
          : "LOCAL_RESILIENT_MEMORY",
      lastSyncAt: this.lastSyncAt,
      tablesReady: this.tablesReady,
      message: this.statusMessage,
    };
  }

  public async syncAstronaut(astronaut: Astronaut): Promise<void> {
    if (!this.client) return;
    try {
      const { error } = await this.client.from("astronauts").upsert({
        id: astronaut.id,
        name: astronaut.name,
        role: astronaut.role,
        callsign: astronaut.callsign,
        blood_type: astronaut.bloodType,
        cumulative_radiation_msv: astronaut.cumulativeRadiationMsv,
        mental_health_score: astronaut.mentalHealthScore,
        bone_density_t_score: astronaut.boneDensityTScore,
        status: astronaut.status,
        watch_device_id: astronaut.watchDeviceId,
        watch_connected: astronaut.watchConnected,
        updated_at: astronaut.updatedAt,
      });
      if (!error) {
        this.connected = true;
        this.tablesReady = true;
        this.lastSyncAt = new Date().toISOString();
      }
    } catch {
      // Fail-safe fallback during deep-space comm blackout
    }
  }

  public async syncTelemetry(record: XiaomiWatchTelemetry): Promise<void> {
    if (!this.client) return;
    try {
      const { error } = await this.client
        .from("xiaomi_watch_telemetry")
        .upsert({
          id: record.id,
          astronaut_id: record.astronautId,
          timestamp: record.timestamp,
          heart_rate: record.heartRate,
          spo2: record.spo2,
          blood_pressure_sys: record.bloodPressureSys,
          blood_pressure_dia: record.bloodPressureDia,
          hrv_ms: record.hrvMs,
          skin_temp_c: record.skinTempC,
          stress_index: record.stressIndex,
          sleep_quality_score: record.sleepQualityScore,
          radiation_dose_rate_usv_hr: record.radiationDoseRateUsvHr,
          eva_suit_pressure_kpa: record.evaSuitPressureKpa,
          cabin_co2_mmhg: record.cabinCo2Mmhg,
          ecg_rhythm: record.ecgRhythm,
          anomaly_detected: record.anomalyDetected,
          anomaly_severity: record.anomalySeverity,
          anomaly_reasons: record.anomalyReasons,
        });
      if (!error) {
        this.connected = true;
        this.tablesReady = true;
        this.lastSyncAt = new Date().toISOString();
      }
    } catch {
      // Resilient fallback
    }
  }

  public async syncAlert(alert: AnomalyAlert): Promise<void> {
    if (!this.client) return;
    try {
      const { error } = await this.client.from("anomaly_alerts").upsert({
        id: alert.id,
        astronaut_id: alert.astronautId,
        timestamp: alert.timestamp,
        category: alert.category,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        metrics_snapshot: alert.metricsSnapshot,
        hermes_action_taken: alert.hermesActionTaken,
        resolved: alert.resolved,
      });
      if (!error) {
        this.lastSyncAt = new Date().toISOString();
      }
    } catch {
      // Resilient fallback
    }
  }

  public async syncSubagentLog(log: HermesSubagentLog): Promise<void> {
    if (!this.client) return;
    try {
      const { error } = await this.client.from("hermes_subagent_logs").upsert({
        id: log.id,
        timestamp: log.timestamp,
        subagent_id: log.subagentId,
        subagent_name: log.subagentName,
        task_type: log.taskType,
        status: log.status,
        analysis: log.analysis,
        action_executed: log.actionExecuted,
        confidence: log.confidence,
      });
      if (!error) {
        this.lastSyncAt = new Date().toISOString();
      }
    } catch {
      // Resilient fallback
    }
  }

  public async syncAutopilotState(state: ShipAutopilotState): Promise<void> {
    if (!this.client) return;
    try {
      const { error } = await this.client.from("ship_autopilot_state").upsert({
        id: state.id,
        updated_at: state.updatedAt,
        mode: state.mode,
        autonomous_takeover_active: state.autonomousTakeoverActive,
        takeover_reason: state.takeoverReason,
        current_maneuver: state.currentManeuver,
        target_destination: state.targetDestination,
        delta_v_m_s: state.deltaVMetersPerSec,
        burn_duration_sec: state.burnDurationSec,
        estimated_return_hours: state.estimatedReturnHours,
        max_g_load: state.maxGLoad,
        attitude_pitch: state.attitudePitch,
        attitude_yaw: state.attitudeYaw,
        attitude_roll: state.attitudeRoll,
        radiation_shield_orientation: state.radiationShieldOrientation,
        propulsion_status: state.propulsionStatus,
        human_override_engaged: state.humanOverrideEngaged,
        override_authorized_by: state.overrideAuthorizedBy,
        override_timestamp: state.overrideTimestamp,
        dsn_station: state.dsnStation,
        earth_comm_status: state.earthCommStatus,
        signal_latency_sec: state.signalLatencySec,
        uplink_kbps: state.uplinkKbps,
      });
      if (!error) {
        this.lastSyncAt = new Date().toISOString();
      }
    } catch {
      // Resilient fallback
    }
  }

  public async syncEarthComm(comm: EarthCommLog): Promise<void> {
    if (!this.client) return;
    try {
      const { error } = await this.client.from("earth_comm_logs").upsert({
        id: comm.id,
        timestamp: comm.timestamp,
        direction: comm.direction,
        sender: comm.sender,
        station: comm.station,
        priority: comm.priority,
        message: comm.message,
        telemetry_attached: comm.telemetryAttached,
        acknowledged: comm.acknowledged,
      });
      if (!error) {
        this.lastSyncAt = new Date().toISOString();
      }
    } catch {
      // Resilient fallback
    }
  }

  public async syncAllSeedData(payload: {
    astronauts: Astronaut[];
    autopilotState: ShipAutopilotState;
    recentTelemetry: XiaomiWatchTelemetry[];
    alerts: AnomalyAlert[];
    subagentLogs: HermesSubagentLog[];
    earthComms: EarthCommLog[];
  }): Promise<SupabaseConfigStatus> {
    const ok = await this.verifyConnection();
    if (!ok || !this.tablesReady) {
      return this.getStatus();
    }

    for (const a of payload.astronauts) {
      await this.syncAstronaut(a);
    }
    await this.syncAutopilotState(payload.autopilotState);
    for (const t of payload.recentTelemetry.slice(0, 15)) {
      await this.syncTelemetry(t);
    }
    for (const al of payload.alerts.slice(0, 10)) {
      await this.syncAlert(al);
    }
    for (const log of payload.subagentLogs.slice(0, 10)) {
      await this.syncSubagentLog(log);
    }
    for (const comm of payload.earthComms.slice(0, 10)) {
      await this.syncEarthComm(comm);
    }

    return this.getStatus();
  }
}

export const supabaseManager = new SupabaseMissionManager();
