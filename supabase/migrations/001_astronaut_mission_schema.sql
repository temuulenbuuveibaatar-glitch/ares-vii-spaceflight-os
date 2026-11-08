-- =============================================================================
-- NASA HACKATHON: ARES-VII DEEP SPACE MISSION & HERMES AUTONOMOUS AI SCHEMA
-- Supabase PostgreSQL Migration 001
-- Supports: Xiaomi Watch H1 Bio-Telemetry, Hermes 4-Subagent Engine,
--           Autonomous Ship Takeover & Manual Override, NASA DSN Earth Comms
-- =============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ASTRONAUTS TABLE
CREATE TABLE IF NOT EXISTS public.astronauts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  callsign TEXT NOT NULL,
  blood_type TEXT NOT NULL DEFAULT 'O+',
  cumulative_radiation_msv DOUBLE PRECISION NOT NULL DEFAULT 42.5,
  mental_health_score DOUBLE PRECISION NOT NULL DEFAULT 92.0,
  bone_density_t_score DOUBLE PRECISION NOT NULL DEFAULT -0.4,
  status TEXT NOT NULL DEFAULT 'NOMINAL' CHECK (status IN ('NOMINAL', 'ELEVATED_STRESS', 'MEDICAL_ALERT', 'CRITICAL', 'EVA_ACTIVE')),
  watch_device_id TEXT NOT NULL,
  watch_connected BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. XIAOMI WATCH H1 TELEMETRY TABLE
CREATE TABLE IF NOT EXISTS public.xiaomi_watch_telemetry (
  id TEXT PRIMARY KEY,
  astronaut_id TEXT NOT NULL REFERENCES public.astronauts(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  heart_rate INTEGER NOT NULL,
  spo2 DOUBLE PRECISION NOT NULL,
  blood_pressure_sys INTEGER NOT NULL,
  blood_pressure_dia INTEGER NOT NULL,
  hrv_ms DOUBLE PRECISION NOT NULL,
  skin_temp_c DOUBLE PRECISION NOT NULL,
  stress_index DOUBLE PRECISION NOT NULL,
  sleep_quality_score DOUBLE PRECISION NOT NULL,
  radiation_dose_rate_usv_hr DOUBLE PRECISION NOT NULL,
  eva_suit_pressure_kpa DOUBLE PRECISION NOT NULL DEFAULT 29.6,
  cabin_co2_mmhg DOUBLE PRECISION NOT NULL DEFAULT 2.8,
  ecg_rhythm TEXT NOT NULL DEFAULT 'NORMAL_SINUS' CHECK (ecg_rhythm IN ('NORMAL_SINUS', 'SINUS_TACHYCARDIA', 'SINUS_BRADYCARDIA', 'ATRIAL_FIBRILLATION', 'PVC_ECTOPIC', 'VTACH_ALERT')),
  anomaly_detected BOOLEAN NOT NULL DEFAULT false,
  anomaly_severity TEXT NOT NULL DEFAULT 'NONE' CHECK (anomaly_severity IN ('NONE', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
  anomaly_reasons JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_xiaomi_telemetry_astronaut_ts
  ON public.xiaomi_watch_telemetry (astronaut_id, timestamp DESC);

-- 3. ANOMALY ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.anomaly_alerts (
  id TEXT PRIMARY KEY,
  astronaut_id TEXT NOT NULL REFERENCES public.astronauts(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  category TEXT NOT NULL CHECK (category IN ('MEDICAL', 'RADIATION', 'PSYCHOLOGICAL', 'NAVIGATION', 'LIFE_SUPPORT')),
  severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  metrics_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  hermes_action_taken TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_anomaly_alerts_ts
  ON public.anomaly_alerts (timestamp DESC);

-- 4. HERMES SUBAGENT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.hermes_subagent_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  subagent_id TEXT NOT NULL CHECK (subagent_id IN ('MED-SENTINEL', 'RAD-GUARD', 'PSY-ORACLE', 'NAV-PILOT', 'HERMES-CORE')),
  subagent_name TEXT NOT NULL,
  task_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'EXECUTING', 'COMPLETED', 'STANDBY', 'ALERT_TRIGGERED', 'OVERRIDDEN')),
  analysis TEXT NOT NULL,
  action_executed TEXT NOT NULL,
  confidence DOUBLE PRECISION NOT NULL DEFAULT 0.98
);

CREATE INDEX IF NOT EXISTS idx_hermes_subagent_logs_ts
  ON public.hermes_subagent_logs (timestamp DESC);

-- 5. SHIP AUTOPILOT STATE TABLE
CREATE TABLE IF NOT EXISTS public.ship_autopilot_state (
  id TEXT PRIMARY KEY,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  mode TEXT NOT NULL CHECK (mode IN ('NOMINAL_TRANSIT', 'HERMES_AUTONOMOUS_TAKEOVER', 'EVASIVE_MANEUVER', 'EMERGENCY_EARTH_RETURN', 'STORM_SHELTER_ATTITUDE', 'HUMAN_MANUAL_CONTROL')),
  autonomous_takeover_active BOOLEAN NOT NULL DEFAULT false,
  takeover_reason TEXT,
  current_maneuver TEXT NOT NULL DEFAULT 'DEEP_SPACE_CRUISE_INSERTION',
  target_destination TEXT NOT NULL DEFAULT 'MARS_TRANSIT_CORRIDOR_SECTOR_4',
  delta_v_m_s DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  burn_duration_sec DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  estimated_return_hours DOUBLE PRECISION NOT NULL DEFAULT 412.0,
  max_g_load DOUBLE PRECISION NOT NULL DEFAULT 0.15,
  attitude_pitch DOUBLE PRECISION NOT NULL DEFAULT 2.4,
  attitude_yaw DOUBLE PRECISION NOT NULL DEFAULT -0.8,
  attitude_roll DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  radiation_shield_orientation TEXT NOT NULL DEFAULT 'NOMINAL_FORWARD_CONE',
  propulsion_status TEXT NOT NULL DEFAULT 'STANDBY_NOMINAL' CHECK (propulsion_status IN ('STANDBY_NOMINAL', 'WARMING_REACTOR', 'ACTIVE_BURN', 'COAST_PHASE', 'MANUAL_THROTTLE')),
  human_override_engaged BOOLEAN NOT NULL DEFAULT false,
  override_authorized_by TEXT,
  override_timestamp TIMESTAMPTZ,
  dsn_station TEXT NOT NULL DEFAULT 'GOLDSTONE_DS14',
  earth_comm_status TEXT NOT NULL DEFAULT 'CONNECTED' CHECK (earth_comm_status IN ('CONNECTED', 'HIGH_LATENCY', 'SOLAR_BLACKOUT', 'EMERGENCY_BEACON')),
  signal_latency_sec DOUBLE PRECISION NOT NULL DEFAULT 184.2,
  uplink_kbps DOUBLE PRECISION NOT NULL DEFAULT 1240.0
);

-- 6. EARTH DSN COMMUNICATION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.earth_comm_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  direction TEXT NOT NULL CHECK (direction IN ('DOWNLINK_TO_EARTH', 'UPLINK_FROM_EARTH', 'HERMES_AUTO_BEACON')),
  sender TEXT NOT NULL,
  station TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('ROUTINE', 'TELEMETRY_SYNC', 'URGENT_MEDICAL', 'PRIORITY_0_MAYDAY')),
  message TEXT NOT NULL,
  telemetry_attached BOOLEAN NOT NULL DEFAULT false,
  acknowledged BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_earth_comm_logs_ts
  ON public.earth_comm_logs (timestamp DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) FOR HACKATHON DEMO & REALTIME SYNC
-- =============================================================================
ALTER TABLE public.astronauts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xiaomi_watch_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hermes_subagent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ship_autopilot_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earth_comm_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read/write on astronauts" ON public.astronauts;
CREATE POLICY "Allow public read/write on astronauts" ON public.astronauts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on xiaomi_watch_telemetry" ON public.xiaomi_watch_telemetry;
CREATE POLICY "Allow public read/write on xiaomi_watch_telemetry" ON public.xiaomi_watch_telemetry FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on anomaly_alerts" ON public.anomaly_alerts;
CREATE POLICY "Allow public read/write on anomaly_alerts" ON public.anomaly_alerts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on hermes_subagent_logs" ON public.hermes_subagent_logs;
CREATE POLICY "Allow public read/write on hermes_subagent_logs" ON public.hermes_subagent_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on ship_autopilot_state" ON public.ship_autopilot_state;
CREATE POLICY "Allow public read/write on ship_autopilot_state" ON public.ship_autopilot_state FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write on earth_comm_logs" ON public.earth_comm_logs;
CREATE POLICY "Allow public read/write on earth_comm_logs" ON public.earth_comm_logs FOR ALL USING (true) WITH CHECK (true);

-- =============================================================================
-- INITIAL SEED DATA FOR ARES-VII CREW & SHIP AUTOPILOT
-- =============================================================================
INSERT INTO public.astronauts (
  id, name, role, callsign, blood_type, cumulative_radiation_msv,
  mental_health_score, bone_density_t_score, status, watch_device_id, watch_connected
) VALUES
  ('astro-1', 'Cmdr. Elena Vance', 'Mission Commander', 'VALKYRIE-1', 'O-', 48.2, 94.0, -0.3, 'NOMINAL', 'XIAOMI-H1-884A', true),
  ('astro-2', 'Dr. Temuulen B.', 'Flight Surgeon & Payload Specialist', 'NOMAD-2', 'A+', 44.7, 91.5, -0.2, 'NOMINAL', 'XIAOMI-H1-912B', true),
  ('astro-3', 'Kenji Sato', 'EVA & Propulsion Specialist', 'RONIN-3', 'B+', 56.4, 88.0, -0.5, 'NOMINAL', 'XIAOMI-H1-309C', true),
  ('astro-4', 'Sofia Lindqvist', 'Guidance & Navigation Pilot', 'AURORA-4', 'AB+', 41.9, 93.0, -0.3, 'NOMINAL', 'XIAOMI-H1-741D', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ship_autopilot_state (
  id, mode, autonomous_takeover_active, takeover_reason, current_maneuver,
  target_destination, delta_v_m_s, burn_duration_sec, estimated_return_hours,
  max_g_load, attitude_pitch, attitude_yaw, attitude_roll,
  radiation_shield_orientation, propulsion_status, human_override_engaged,
  dsn_station, earth_comm_status, signal_latency_sec, uplink_kbps
) VALUES (
  'ares-vii-autopilot', 'NOMINAL_TRANSIT', false, NULL, 'CIS-LUNAR_DEEP_SPACE_CRUISE',
  'MARS_TRANSIT_CORRIDOR_SECTOR_4', 0.0, 0.0, 412.0,
  0.15, 2.4, -0.8, 0.0,
  'NOMINAL_FORWARD_CONE', 'STANDBY_NOMINAL', false,
  'GOLDSTONE_DS14', 'CONNECTED', 184.2, 1240.0
) ON CONFLICT (id) DO NOTHING;
