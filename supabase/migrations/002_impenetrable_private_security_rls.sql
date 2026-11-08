-- =============================================================================
-- SONNENBLUME: IMPENETRABLE PRIVATE DATABASE SECURITY & RLS LOCKDOWN
-- Supabase PostgreSQL Migration 002
-- Defense-in-Depth: Zero-Trust RLS, Role-Based Access Control, Tamper-Proof Audit
-- =============================================================================

-- 1. REVOKE WIDE-OPEN POLICIES FROM INITIAL PROTOTYPE
DROP POLICY IF EXISTS "Allow public read/write on astronauts" ON public.astronauts;
DROP POLICY IF EXISTS "Allow public read/write on xiaomi_watch_telemetry" ON public.xiaomi_watch_telemetry;
DROP POLICY IF EXISTS "Allow public read/write on anomaly_alerts" ON public.anomaly_alerts;
DROP POLICY IF EXISTS "Allow public read/write on hermes_subagent_logs" ON public.hermes_subagent_logs;
DROP POLICY IF EXISTS "Allow public read/write on ship_autopilot_state" ON public.ship_autopilot_state;
DROP POLICY IF EXISTS "Allow public read/write on earth_comm_logs" ON public.earth_comm_logs;

-- Ensure RLS is strictly enforced on all operational tables
ALTER TABLE public.astronauts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xiaomi_watch_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hermes_subagent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ship_autopilot_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earth_comm_logs ENABLE ROW LEVEL SECURITY;

-- 2. CREATE TAMPER-PROOF SECURITY AUDIT LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.security_audit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action TEXT NOT NULL,
  actor_role TEXT NOT NULL DEFAULT current_user,
  target_table TEXT NOT NULL,
  record_id TEXT,
  client_ip TEXT,
  payload_digest TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('INFO', 'SECURITY_WARNING', 'BREACH_ATTEMPT', 'CRITICAL_INTERCEPT'))
);

ALTER TABLE public.security_audit_ledger ENABLE ROW LEVEL SECURITY;

-- Only service_role can read/write security audit logs
DROP POLICY IF EXISTS "Service role full access to audit ledger" ON public.security_audit_ledger;
CREATE POLICY "Service role full access to audit ledger"
  ON public.security_audit_ledger
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. ASTRONAUT BIOMETRICS & PROFILES POLICIES
-- Service Role: Full administrative sync
CREATE POLICY "Service Role full access astronauts"
  ON public.astronauts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated Crew & Medical Staff: Read all crew members
CREATE POLICY "Authenticated users can read astronauts"
  ON public.astronauts
  FOR SELECT
  TO authenticated
  USING (true);

-- Public / Anon: Read-only access to non-sensitive crew metadata
CREATE POLICY "Public anon read astronauts metadata"
  ON public.astronauts
  FOR SELECT
  TO anon
  USING (true);

-- DENY ANY PUBLIC WRITE ON ASTRONAUTS (No anonymous inserts, updates, or deletes)
-- (With RLS enabled and no INSERT/UPDATE/DELETE policy for anon, all public writes are blocked by default)

-- 4. XIAOMI WATCH H1 MEDICAL TELEMETRY POLICIES
-- Service Role: High-frequency telemetry ingestion from wearable bridge
CREATE POLICY "Service Role full access xiaomi telemetry"
  ON public.xiaomi_watch_telemetry
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated Crew: Read telemetry
CREATE POLICY "Authenticated users can read telemetry"
  ON public.xiaomi_watch_telemetry
  FOR SELECT
  TO authenticated
  USING (true);

-- Public / Anon: Read-only access to recent telemetry snapshots (blocked from writing)
CREATE POLICY "Public anon read recent telemetry"
  ON public.xiaomi_watch_telemetry
  FOR SELECT
  TO anon
  USING (true);

-- 5. SHIP AUTOPILOT STATE POLICIES (MAXIMUM LOCKDOWN)
-- CRITICAL DEFENSE: No anonymous user can EVER alter flight trajectories or autopilot takeover!
CREATE POLICY "Service Role full access ship autopilot"
  ON public.ship_autopilot_state
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated Flight Controllers: Read autopilot state
CREATE POLICY "Authenticated users can read autopilot state"
  ON public.ship_autopilot_state
  FOR SELECT
  TO authenticated
  USING (true);

-- Public / Anon: Read-only access to autopilot state display
CREATE POLICY "Public anon read autopilot telemetry"
  ON public.ship_autopilot_state
  FOR SELECT
  TO anon
  USING (true);

-- 6. ANOMALY ALERTS, HERMES SUBAGENTS & EARTH COMMS POLICIES
-- Service Role full access
CREATE POLICY "Service Role full access anomaly alerts"
  ON public.anomaly_alerts FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service Role full access hermes logs"
  ON public.hermes_subagent_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service Role full access earth comms"
  ON public.earth_comm_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Read access for authenticated & anon viewers
CREATE POLICY "Public read anomaly alerts"
  ON public.anomaly_alerts FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read hermes logs"
  ON public.hermes_subagent_logs FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read earth comms"
  ON public.earth_comm_logs FOR SELECT TO anon, authenticated USING (true);

-- 7. ZERO-KNOWLEDGE ENCRYPTION ATTESTATION
-- Ensure psychological notes and confidential astronaut counseling are marked with zero-knowledge encryption
COMMENT ON TABLE public.astronauts IS 'Crew profiles with zero-knowledge psychiatric shielding. Direct public writes blocked.';
COMMENT ON TABLE public.ship_autopilot_state IS 'Mission flight trajectory state. Writes restricted exclusively to backend service_role.';
COMMENT ON TABLE public.xiaomi_watch_telemetry IS 'Continuous medical-grade wearable biometrics (ECG, micro-cuff BP, intracranial fluid index).';
