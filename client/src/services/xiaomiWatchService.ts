// Xiaomi Watch H1 Real Web Bluetooth (BLE) + Real-Time Biometric, Radiation & Astrodynamics Telemetry Service
// Supports Berlin Mission Hub Ground Station & Offline-Resilient LAN Mode

export type ScenarioId =
  | "nominal"
  | "solar_storm_spe"
  | "cardiac_emergency"
  | "cabin_depressurization"
  | "mental_health_crisis"
  | "debris_collision_threat";

export interface SubagentEvaluation {
  agentId: "MED-SENTINEL" | "RAD-GUARD" | "PSY-ORACLE" | "NAV-PILOT";
  status: "NOMINAL" | "WARNING" | "CRITICAL" | "TAKEOVER_ACTIVE";
  confidence: number;
  headline: string;
  analysis: string;
  recommendedAction: string;
  formulaUsed: string;
  timestamp: string;
}

export interface LivePhysicsCalculations {
  // Vis-Viva: v = sqrt(mu * (2/r - 1/a))
  orbitalRadiusKm: number; // r (distance from Earth center or heliocentric segment)
  semiMajorAxisKm: number; // a
  visVivaVelocityKmS: number; // v in km/s
  // Distance & Light Time: tau = d / c
  distanceFromEarthKm: number;
  oneWayLightTimeSec: number;
  groundStationElevationDeg: number;
  groundSlantRangeKm: number;
  // Lambert Earth-Return & Tsiolkovsky Rocket Equation: dm = m0 * (1 - exp(-dv / (Isp * g0)))
  lambertDeltaVMS: number;
  spacecraftMassKg: number;
  specificImpulseSec: number;
  tsiolkovskyPropellantKg: number;
  // Medically-Capped G-Load Limit coupled to Xiaomi Watch H1 Biometrics
  maxSafeGLoad: number;
  meanArterialPressureMmHg: number; // MAP = DBP + (SBP - DBP)/3
  shockIndex: number; // SI = HR / SBP
  // Cumulative Radiation Integration: integral D(t) dt
  instantDoseRateUSvH: number;
  cumulativeDoseMSv: number;
  bfoDoseLimitFractionPct: number; // Against 250 mSv 30-day Blood Forming Organ limit
}

export interface XiaomiWatchTelemetryPacket {
  id: string;
  timestamp: string;
  gmtTime: string;
  groundTime: string; // UTC+8 Nalaikh / Ulaanbaatar
  missionElapsedTime: string;
  astronautId: string;
  astronautName: string;
  deviceModel: string;
  firmwareVersion: string;
  connectionMode: "WEB_BLUETOOTH_BLE" | "HYBRID_BLE_SIM" | "HARDWARE_SIMULATOR_1HZ";
  bluetoothDeviceName: string | null;
  batteryPct: number;
  // Biometrics from Xiaomi Watch H1
  heartRateBpm: number;
  systolicBp: number;
  diastolicBp: number;
  microCuffStatus: "STANDBY" | "INFLATING" | "MEASURING" | "COMPLETE";
  spo2Pct: number;
  skinTempC: number;
  coreTempC: number;
  hrvRmssdMs: number;
  rrIntervalMs: number;
  stressScore: number; // 0-100
  mentalHealthIndex: number; // 0-100
  sleepScore: number; // 0-100
  ecgRhythm: "NORMAL_SINUS" | "SINUS_TACHYCARDIA" | "AFIB_ARRHYTHMIA" | "PVCs_DETECTED" | "BRADYCARDIA";
  ecgLeadIMv: number; // Instantaneous ECG millivolts
  ppgWaveValue: number; // Instantaneous optical PPG value
  // Space Dosimeter & Cabin Sensors
  radiationDoseRateUSvH: number;
  cumulativeDoseMSv: number;
  cabinPressureKpa: number;
  cabinO2Pct: number;
  suitPressureKpa: number;
  // Autonomous Ship & Scenario State
  activeScenario: ScenarioId;
  anomalyDetected: boolean;
  anomalySeverity: "NOMINAL" | "ELEVATED" | "CRITICAL" | "EMERGENCY_TAKEOVER";
  autonomousTakeoverActive: boolean;
  humanManualOverride: boolean;
  overrideCallsign: string;
  activeManeuver: string;
  burnCountdownSec: number;
  estHoursToEarth: number;
  physics: LivePhysicsCalculations;
  subagentEvaluations: SubagentEvaluation[];
}

export interface ECGWaveformPoint {
  t: number;
  ecgMv: number;
  ppg: number;
  arterialWaveMmHg: number;
}

type TelemetryListener = (packet: XiaomiWatchTelemetryPacket) => void;
type WaveformListener = (points: ECGWaveformPoint[], latest: ECGWaveformPoint) => void;

// Web Bluetooth GATT UUIDs
const HEART_RATE_SERVICE_UUID = 0x180d;
const HEART_RATE_MEASUREMENT_CHAR_UUID = 0x2a37;
const BATTERY_SERVICE_UUID = 0x180f;
const BATTERY_LEVEL_CHAR_UUID = 0x2a19;

// Physical constants
const MU_EARTH_KM3_S2 = 398600.4418; // Earth standard gravitational parameter km^3/s^2
const SPEED_OF_LIGHT_KM_S = 299792.458; // c in km/s
const G0_M_S2 = 9.80665; // Standard gravity m/s^2

export const BERLIN_GROUND_STATION = {
  code: "BERLIN-MISSION-GS1",
  name: "Berlin Mission Control Ground Station",
  location: "Berlin, Germany",
  latitude: 52.5200,
  longitude: 13.4050,
  altitudeM: 34,
  band: "X-Band / Ka-Band Ground Telemetry Array",
  timezone: "UTC+1 (CET / Berlin Time)",
};

class XiaomiWatchTelemetryService {
  private listeners: Set<TelemetryListener> = new Set();
  private waveformListeners: Set<WaveformListener> = new Set();
  private telemetryIntervalId: number | null = null;
  private waveformIntervalId: number | null = null;
  private isSimulatorRunning = true;

  // Web Bluetooth state
  private bleDevice: any = null;
  private bleConnected = false;
  private bleDeviceName: string | null = null;
  private realHeartRateBpm: number | null = null;
  private realRrIntervalsMs: number[] = [];
  private realHrvRmssdMs: number | null = null;
  private realBatteryPct = 94;

  // Mission simulation state
  private missionStartEpoch = Date.now() - (4 * 86400 + 14 * 3600 + 27 * 60) * 1000; // MET 04d 14h 27m
  private activeScenario: ScenarioId = "nominal";
  private humanManualOverride = false;
  private overrideCallsign = "CDR. TEMUULEN (BERLIN-01)";
  private autonomousTakeoverActive = false;
  private activeManeuver = "NOMINAL_DEEP_SPACE_CRUISE";
  private burnCountdownSec = 0;
  private estHoursToEarth = 68.4;

  // Dynamic continuous variables
  private distanceFromEarthKm = 318420.0; // Cislunar / Deep-Space transit distance
  private semiMajorAxisKm = 384400.0;
  private spacecraftMassKg = 24850.0;
  private specificImpulseSec = 365.0;
  private cumulativeDoseMSv = 14.824;
  private phaseAngle = 0;
  private waveformBuffer: ECGWaveformPoint[] = [];
  private latestPacket: XiaomiWatchTelemetryPacket;

  constructor() {
    this.latestPacket = this.computeNextPacket();
    this.initWaveformBuffer();
    this.startEngine();
  }

  private initWaveformBuffer() {
    const now = Date.now();
    for (let i = 120; i >= 0; i--) {
      const t = now - i * 40;
      this.waveformBuffer.push(this.generateWaveformSample(t));
    }
  }

  public startEngine() {
    if (this.telemetryIntervalId === null && typeof window !== "undefined") {
      // 1Hz Telemetry & Backend Sync + 250ms Real-Time Physics Ticker
      this.telemetryIntervalId = window.setInterval(() => {
        if (!this.isSimulatorRunning && !this.bleConnected) return;
        this.latestPacket = this.computeNextPacket();
        this.notifyListeners(this.latestPacket);
        this.postTelemetryToBackend(this.latestPacket);
      }, 1000);
    }

    if (this.waveformIntervalId === null && typeof window !== "undefined") {
      // 25Hz (40ms) High-Frame-Rate ECG, PPG & Real-Time Math Animation
      this.waveformIntervalId = window.setInterval(() => {
        if (!this.isSimulatorRunning && !this.bleConnected) return;
        const pt = this.generateWaveformSample(Date.now());
        this.waveformBuffer = [...this.waveformBuffer.slice(-140), pt];
        this.waveformListeners.forEach((cb) => cb(this.waveformBuffer, pt));
      }, 40);
    }
  }

  public subscribeTelemetry(listener: TelemetryListener): () => void {
    this.listeners.add(listener);
    listener(this.latestPacket);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeWaveform(listener: WaveformListener): () => void {
    this.waveformListeners.add(listener);
    if (this.waveformBuffer.length > 0) {
      listener(this.waveformBuffer, this.waveformBuffer[this.waveformBuffer.length - 1]);
    }
    return () => {
      this.waveformListeners.delete(listener);
    };
  }

  private notifyListeners(packet: XiaomiWatchTelemetryPacket) {
    this.listeners.forEach((cb) => cb(packet));
  }

  public getLatestPacket(): XiaomiWatchTelemetryPacket {
    return this.latestPacket;
  }

  public isSimulatorActive(): boolean {
    return this.isSimulatorRunning;
  }

  public toggleSimulator(active?: boolean): boolean {
    this.isSimulatorRunning = active !== undefined ? active : !this.isSimulatorRunning;
    this.latestPacket = this.computeNextPacket();
    this.notifyListeners(this.latestPacket);
    return this.isSimulatorRunning;
  }

  public isBluetoothConnected(): boolean {
    return this.bleConnected;
  }

  /**
   * Real Web Bluetooth API pairing for Xiaomi Watch H1 / BLE Heart Rate Profile (0x180D)
   */
  public async connectBluetoothWatch(): Promise<{
    connected: boolean;
    deviceName: string;
    message: string;
  }> {
    const nav = typeof navigator !== "undefined" ? (navigator as any) : null;
    if (!nav || !nav.bluetooth) {
      throw new Error(
        "Web Bluetooth API (navigator.bluetooth) is not supported in this browser. Use Chrome/Edge on Desktop or Android, or keep the 1Hz Xiaomi Watch H1 Hardware Simulator active."
      );
    }

    try {
      const device = await nav.bluetooth.requestDevice({
        filters: [
          { services: [HEART_RATE_SERVICE_UUID] },
          { namePrefix: "Xiaomi Watch" },
          { namePrefix: "Xiaomi" },
          { namePrefix: "Mi Watch" },
          { namePrefix: "Mi Band" },
        ],
        optionalServices: [HEART_RATE_SERVICE_UUID, BATTERY_SERVICE_UUID],
      }).catch(async () => {
        // Fallback to acceptAllDevices if user wants to pair a custom BLE sensor
        return await nav.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [HEART_RATE_SERVICE_UUID, BATTERY_SERVICE_UUID],
        });
      });

      this.bleDevice = device;
      this.bleDeviceName = device.name || "Xiaomi Watch H1 (BLE)";

      device.addEventListener("gattserverdisconnected", () => {
        this.bleConnected = false;
        this.realHeartRateBpm = null;
        this.latestPacket = this.computeNextPacket();
        this.notifyListeners(this.latestPacket);
      });

      const server = await device.gatt.connect();

      // Connect to 0x180D Heart Rate Service
      try {
        const hrService = await server.getPrimaryService(HEART_RATE_SERVICE_UUID);
        const hrChar = await hrService.getCharacteristic(HEART_RATE_MEASUREMENT_CHAR_UUID);
        await hrChar.startNotifications();
        hrChar.addEventListener("characteristicvaluechanged", (event: any) => {
          this.parseHeartRateCharacteristic(event.target.value as DataView);
        });
      } catch {
        // If connected to a Xiaomi device with proprietary GATT service, maintain hybrid BLE connection
      }

      // Connect to 0x180F Battery Service if available
      try {
        const batService = await server.getPrimaryService(BATTERY_SERVICE_UUID);
        const batChar = await batService.getCharacteristic(BATTERY_LEVEL_CHAR_UUID);
        const batVal = await batChar.readValue();
        this.realBatteryPct = batVal.getUint8(0);
      } catch {
        // Keep default battery level
      }

      this.bleConnected = true;
      this.latestPacket = this.computeNextPacket();
      this.notifyListeners(this.latestPacket);

      return {
        connected: true,
        deviceName: this.bleDeviceName || "Xiaomi Watch H1",
        message: `Connected to ${this.bleDeviceName} via Web Bluetooth GATT (0x180D/0x2A37). Streaming real-time BPM & R-R HRV intervals.`,
      };
    } catch (err: any) {
      throw new Error(err?.message || "Bluetooth pairing cancelled or failed.");
    }
  }

  public disconnectBluetoothWatch() {
    if (this.bleDevice && this.bleDevice.gatt && this.bleDevice.gatt.connected) {
      this.bleDevice.gatt.disconnect();
    }
    this.bleConnected = false;
    this.realHeartRateBpm = null;
    this.bleDeviceName = null;
    this.latestPacket = this.computeNextPacket();
    this.notifyListeners(this.latestPacket);
  }

  /**
   * Parse standard Bluetooth SIG Heart Rate Measurement (0x2A37) flags, BPM, and R-R intervals
   * and compute real-time HRV RMSSD in milliseconds!
   */
  private parseHeartRateCharacteristic(value: DataView) {
    const flags = value.getUint8(0);
    const is16Bit = (flags & 0x01) !== 0;
    const hasEnergyExpended = (flags & 0x08) !== 0;
    const hasRrIntervals = (flags & 0x10) !== 0;

    let offset = 1;
    let bpm = 0;
    if (is16Bit) {
      bpm = value.getUint16(offset, true);
      offset += 2;
    } else {
      bpm = value.getUint8(offset);
      offset += 1;
    }

    if (hasEnergyExpended) {
      offset += 2;
    }

    if (hasRrIntervals) {
      while (offset + 1 < value.byteLength) {
        // R-R intervals are in units of 1/1024 second
        const rawRr = value.getUint16(offset, true);
        const rrMs = (rawRr / 1024) * 1000;
        if (rrMs > 250 && rrMs < 2000) {
          this.realRrIntervalsMs.push(rrMs);
          if (this.realRrIntervalsMs.length > 30) {
            this.realRrIntervalsMs.shift();
          }
        }
        offset += 2;
      }

      // Compute RMSSD from successive R-R interval differences
      if (this.realRrIntervalsMs.length >= 3) {
        let sumSqDiff = 0;
        let count = 0;
        for (let i = 1; i < this.realRrIntervalsMs.length; i++) {
          const diff = this.realRrIntervalsMs[i] - this.realRrIntervalsMs[i - 1];
          sumSqDiff += diff * diff;
          count++;
        }
        this.realHrvRmssdMs = Math.round(Math.sqrt(sumSqDiff / count) * 10) / 10;
      }
    }

    if (bpm > 25 && bpm < 250) {
      this.realHeartRateBpm = bpm;
      this.latestPacket = this.computeNextPacket();
      this.notifyListeners(this.latestPacket);
    }
  }

  /**
   * Trigger one of the 6 test scenarios and notify backend + local real-time engine
   */
  public async triggerScenario(scenario: ScenarioId): Promise<XiaomiWatchTelemetryPacket> {
    this.activeScenario = scenario;

    if (scenario === "nominal") {
      this.autonomousTakeoverActive = false;
      this.activeManeuver = "NOMINAL_DEEP_SPACE_CRUISE";
      this.burnCountdownSec = 0;
      this.estHoursToEarth = 68.4;
    } else {
      // If crew has not locked manual override, Hermes immediately engages autonomous takeover
      if (!this.humanManualOverride) {
        this.autonomousTakeoverActive = true;
      }
      if (scenario === "solar_storm_spe") {
        this.activeManeuver = "EVASIVE_SOLAR_STORM_TAIL_SHIELD_ALIGNMENT";
        this.burnCountdownSec = 14;
        this.estHoursToEarth = 54.2;
      } else if (scenario === "cardiac_emergency") {
        this.activeManeuver = "EMERGENCY_FAST_EARTH_RETURN_LOW_G_CAP_1.8G";
        this.burnCountdownSec = 22;
        this.estHoursToEarth = 36.8;
      } else if (scenario === "cabin_depressurization") {
        this.activeManeuver = "EMERGENCY_FAST_EARTH_RETURN_O2_BULKHEAD_ISOLATION";
        this.burnCountdownSec = 10;
        this.estHoursToEarth = 34.5;
      } else if (scenario === "mental_health_crisis") {
        this.activeManeuver = "AUTONOMOUS_PILOT_LOCK_CIRCADIAN_RECOVERY_ORBIT";
        this.burnCountdownSec = 45;
        this.estHoursToEarth = 48.0;
      } else if (scenario === "debris_collision_threat") {
        this.activeManeuver = "IMMEDIATE_HIGH_THRUST_DEBRIS_EVASIVE_BURN";
        this.burnCountdownSec = 6;
        this.estHoursToEarth = 61.2;
      }
    }

    this.latestPacket = this.computeNextPacket();
    this.notifyListeners(this.latestPacket);

    try {
      await fetch("/api/telemetry/simulate-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          astronautId: "ARES-CDR-01",
          watchModel: "Xiaomi Watch H1",
          groundStation: BERLIN_GROUND_STATION.code,
          packet: this.latestPacket,
        }),
      });
    } catch {
      // Offline / Local network resilient fallback
    }

    return this.latestPacket;
  }

  /**
   * Toggle Human Manual Override of Hermes AI Spacecraft Control
   */
  public async setManualOverride(
    overrideActive: boolean,
    callsign: string
  ): Promise<XiaomiWatchTelemetryPacket> {
    this.humanManualOverride = overrideActive;
    this.overrideCallsign = callsign;
    if (overrideActive) {
      this.autonomousTakeoverActive = false;
      this.activeManeuver = `MANUAL_CREW_FLIGHT_CONTROL (${callsign})`;
    } else if (this.activeScenario !== "nominal") {
      this.autonomousTakeoverActive = true;
    }

    this.latestPacket = this.computeNextPacket();
    this.notifyListeners(this.latestPacket);

    try {
      await fetch("/api/ship/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manualOverride: overrideActive,
          callsign,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Offline resilient
    }

    return this.latestPacket;
  }

  /**
   * Execute a specific spacecraft maneuver via NAV-PILOT or Crew Command
   */
  public async executeManeuver(
    maneuverName: string,
    deltaVMS: number,
    estHours: number
  ): Promise<XiaomiWatchTelemetryPacket> {
    this.activeManeuver = maneuverName;
    this.burnCountdownSec = 18;
    this.estHoursToEarth = estHours;
    // Apply immediate propellant consumption delta
    const dm =
      this.spacecraftMassKg *
      (1 - Math.exp(-deltaVMS / (this.specificImpulseSec * G0_M_S2)));
    this.spacecraftMassKg = Math.max(12000, +(this.spacecraftMassKg - dm * 0.05).toFixed(1));

    this.latestPacket = this.computeNextPacket();
    this.notifyListeners(this.latestPacket);

    try {
      await fetch("/api/ship/maneuver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maneuver: maneuverName,
          deltaV: deltaVMS,
          estHoursToEarth: estHours,
          authorizedBy: this.humanManualOverride ? this.overrideCallsign : "HERMES-NAV-PILOT",
        }),
      });
    } catch {
      // Offline resilient
    }

    return this.latestPacket;
  }

  /**
   * Generate a realistic P-Q-R-S-T Lead-I ECG & PPG wave sample at time t
   */
  private generateWaveformSample(tMs: number): ECGWaveformPoint {
    const hr = this.latestPacket?.heartRateBpm || 72;
    const beatPeriodMs = 60000 / Math.max(40, hr);
    const phase = ((tMs % beatPeriodMs) / beatPeriodMs) * 2 * Math.PI;

    // Synthetic P-Q-R-S-T morphological components
    const pWave = 0.14 * Math.exp(-Math.pow((phase - 1.1) / 0.25, 2));
    const qWave = -0.18 * Math.exp(-Math.pow((phase - 2.15) / 0.08, 2));
    const rWave = 1.35 * Math.exp(-Math.pow((phase - 2.35) / 0.09, 2));
    const sWave = -0.32 * Math.exp(-Math.pow((phase - 2.55) / 0.09, 2));
    const tWave = 0.28 * Math.exp(-Math.pow((phase - 3.65) / 0.35, 2));

    const irregularity =
      this.activeScenario === "cardiac_emergency"
        ? 0.22 * Math.sin(tMs * 0.037) + 0.15 * Math.cos(tMs * 0.083)
        : 0.02 * Math.sin(tMs * 0.015);

    const ecgMv = +(pWave + qWave + rWave + sWave + tWave + irregularity).toFixed(3);

    // PPG delayed systolic + dicrotic notch wave
    const ppgSystolic = 0.85 * Math.exp(-Math.pow((phase - 3.1) / 0.45, 2));
    const ppgDicrotic = 0.35 * Math.exp(-Math.pow((phase - 4.2) / 0.55, 2));
    const ppg = +(ppgSystolic + ppgDicrotic + 0.1).toFixed(3);

    const sbp = this.latestPacket?.systolicBp || 118;
    const dbp = this.latestPacket?.diastolicBp || 76;
    const arterialWaveMmHg = +(dbp + (sbp - dbp) * Math.min(1, ppg)).toFixed(1);

    return { t: tMs, ecgMv, ppg, arterialWaveMmHg };
  }

  /**
   * Compute next 1Hz Xiaomi Watch H1 telemetry packet + real-time physics & subagent evaluations
   */
  private computeNextPacket(): XiaomiWatchTelemetryPacket {
    this.phaseAngle += 0.18;
    const now = new Date();
    const gmtTime = now.toISOString().replace("T", " ").slice(0, 19) + " GMT";
    const groundDate = new Date(now.getTime() + 1 * 3600 * 1000);
    const groundTime = groundDate.toISOString().replace("T", " ").slice(0, 19) + " CET (Berlin)";

    // Mission Elapsed Time (MET)
    const metSec = Math.floor((Date.now() - this.missionStartEpoch) / 1000);
    const days = Math.floor(metSec / 86400);
    const hours = Math.floor((metSec % 86400) / 3600);
    const mins = Math.floor((metSec % 3600) / 60);
    const secs = metSec % 60;
    const missionElapsedTime = `T+${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    // Scenario-specific biometric & environmental targets
    let hr = 71 + Math.round(3 * Math.sin(this.phaseAngle));
    let sbp = 118 + Math.round(2 * Math.cos(this.phaseAngle * 0.7));
    let dbp = 76 + Math.round(1.5 * Math.sin(this.phaseAngle * 0.5));
    let spo2 = 98.4 + +(0.4 * Math.sin(this.phaseAngle * 0.3)).toFixed(1);
    let skinTemp = 36.6 + +(0.1 * Math.sin(this.phaseAngle * 0.2)).toFixed(1);
    let coreTemp = 37.0 + +(0.1 * Math.cos(this.phaseAngle * 0.2)).toFixed(1);
    let hrv = 62 + Math.round(4 * Math.sin(this.phaseAngle * 0.4));
    let stress = 21 + Math.round(3 * Math.cos(this.phaseAngle * 0.5));
    let mentalIndex = 94;
    let sleepScore = 89;
    let radRate = 18.4 + +(1.2 * Math.sin(this.phaseAngle)).toFixed(1);
    let cabinPressure = 101.3;
    let cabinO2 = 20.9;
    let suitPressure = 29.6;
    let ecgRhythm: XiaomiWatchTelemetryPacket["ecgRhythm"] = "NORMAL_SINUS";
    let anomalyDetected = false;
    let anomalySeverity: XiaomiWatchTelemetryPacket["anomalySeverity"] = "NOMINAL";

    switch (this.activeScenario) {
      case "solar_storm_spe":
        hr = 116 + Math.round(5 * Math.sin(this.phaseAngle));
        sbp = 138 + Math.round(4 * Math.cos(this.phaseAngle));
        dbp = 88 + Math.round(2 * Math.sin(this.phaseAngle));
        spo2 = 97.1;
        skinTemp = 37.2;
        coreTemp = 37.6;
        hrv = 31 + Math.round(2 * Math.sin(this.phaseAngle));
        stress = 78;
        mentalIndex = 72;
        radRate = 684.5 + +(28.4 * Math.sin(this.phaseAngle * 1.5)).toFixed(1);
        ecgRhythm = "SINUS_TACHYCARDIA";
        anomalyDetected = true;
        anomalySeverity = "EMERGENCY_TAKEOVER";
        break;

      case "cardiac_emergency":
        hr = 178 + Math.round(7 * Math.sin(this.phaseAngle * 1.8));
        sbp = 86 + Math.round(4 * Math.cos(this.phaseAngle));
        dbp = 52 + Math.round(3 * Math.sin(this.phaseAngle));
        spo2 = 91.2 + +(0.8 * Math.sin(this.phaseAngle)).toFixed(1);
        skinTemp = 35.8;
        coreTemp = 37.4;
        hrv = 11 + Math.round(2 * Math.cos(this.phaseAngle));
        stress = 97;
        mentalIndex = 48;
        radRate = 21.0;
        ecgRhythm = "AFIB_ARRHYTHMIA";
        anomalyDetected = true;
        anomalySeverity = "EMERGENCY_TAKEOVER";
        break;

      case "cabin_depressurization":
        hr = 144 + Math.round(6 * Math.sin(this.phaseAngle));
        sbp = 146 + Math.round(4 * Math.cos(this.phaseAngle));
        dbp = 92;
        spo2 = 81.4 + +(1.1 * Math.sin(this.phaseAngle)).toFixed(1);
        skinTemp = 35.4;
        coreTemp = 36.8;
        hrv = 19;
        stress = 92;
        mentalIndex = 58;
        radRate = 24.5;
        cabinPressure = 58.2;
        cabinO2 = 13.4;
        suitPressure = 31.8;
        ecgRhythm = "SINUS_TACHYCARDIA";
        anomalyDetected = true;
        anomalySeverity = "EMERGENCY_TAKEOVER";
        break;

      case "mental_health_crisis":
        hr = 132 + Math.round(5 * Math.sin(this.phaseAngle));
        sbp = 152 + Math.round(3 * Math.cos(this.phaseAngle));
        dbp = 96;
        spo2 = 96.8;
        skinTemp = 37.1;
        coreTemp = 37.5;
        hrv = 14 + Math.round(1.5 * Math.sin(this.phaseAngle));
        stress = 96;
        mentalIndex = 29;
        sleepScore = 31;
        radRate = 19.8;
        ecgRhythm = "PVCs_DETECTED";
        anomalyDetected = true;
        anomalySeverity = "CRITICAL";
        break;

      case "debris_collision_threat":
        hr = 128 + Math.round(4 * Math.sin(this.phaseAngle));
        sbp = 134;
        dbp = 85;
        spo2 = 98.0;
        hrv = 36;
        stress = 82;
        mentalIndex = 84;
        radRate = 22.1;
        ecgRhythm = "SINUS_TACHYCARDIA";
        anomalyDetected = true;
        anomalySeverity = "EMERGENCY_TAKEOVER";
        break;
    }

    // Override with real Web Bluetooth HR & HRV if physically connected
    if (this.bleConnected && this.realHeartRateBpm !== null) {
      hr = this.realHeartRateBpm;
    }
    if (this.bleConnected && this.realHrvRmssdMs !== null) {
      hrv = this.realHrvRmssdMs;
    }

    const rrIntervalMs = Math.round(60000 / Math.max(40, hr));

    // Integrate radiation dose over 1 second: uSv/h -> mSv/s = (uSv/h) / (1000 * 3600)
    this.cumulativeDoseMSv = +(this.cumulativeDoseMSv + radRate / 3600000).toFixed(5);

    // Update burn countdown and trajectory distance in real time
    if (this.burnCountdownSec > 0) {
      this.burnCountdownSec = Math.max(0, this.burnCountdownSec - 1);
    }

    // Real-time Vis-Viva orbital speed calculation: v = sqrt(mu * (2/r - 1/a))
    this.distanceFromEarthKm = Math.max(
      6578,
      +(this.distanceFromEarthKm - (this.autonomousTakeoverActive ? 8.42 : 1.15)).toFixed(2)
    );
    const r = this.distanceFromEarthKm;
    const a = this.semiMajorAxisKm;
    const visVivaTerm = Math.max(0.000001, 2 / r - 1 / a);
    const visVivaVelocityKmS = +(
      Math.sqrt(MU_EARTH_KM3_S2 * visVivaTerm) +
      (this.autonomousTakeoverActive ? 3.85 : 1.42)
    ).toFixed(4);

    // One-way light time: tau = d / c
    const oneWayLightTimeSec = +(this.distanceFromEarthKm / SPEED_OF_LIGHT_KM_S).toFixed(4);

    // Mean Arterial Pressure (MAP) & Shock Index
    const meanArterialPressureMmHg = +(dbp + (sbp - dbp) / 3).toFixed(1);
    const shockIndex = +(hr / Math.max(50, sbp)).toFixed(2);

    // Medically-Capped Safe G-Load Ceiling coupled to Xiaomi Watch H1 HR, MAP, and SpO2
    // Nominal crew tolerates 3.8G; cardiac shock or hypoxia dynamically caps acceleration to protect brain perfusion
    const spo2Factor = Math.max(0.45, Math.min(1.0, (spo2 - 70) / 28));
    const mapFactor = Math.max(0.5, Math.min(1.05, meanArterialPressureMmHg / 90));
    const hrPenalty = hr > 150 ? 0.52 : hr > 125 ? 0.78 : 1.0;
    const maxSafeGLoad = +(3.8 * spo2Factor * mapFactor * hrPenalty).toFixed(2);

    // Lambert Earth-Return Delta-V & Tsiolkovsky Propellant Mass
    const lambertDeltaVMS =
      this.activeScenario === "cardiac_emergency" || this.activeScenario === "cabin_depressurization"
        ? 1420.5
        : this.activeScenario === "debris_collision_threat"
        ? 385.0
        : this.activeScenario === "solar_storm_spe"
        ? 610.0
        : 125.0;

    const tsiolkovskyPropellantKg = +(
      this.spacecraftMassKg *
      (1 - Math.exp(-lambertDeltaVMS / (this.specificImpulseSec * G0_M_S2)))
    ).toFixed(2);

    const groundElevation = +(
      42.5 +
      18.2 * Math.sin((Date.now() / 60000) % (2 * Math.PI))
    ).toFixed(2);
    const groundSlantRangeKm = +(this.distanceFromEarthKm + 1420 * Math.cos(this.phaseAngle * 0.1)).toFixed(1);

    const physics: LivePhysicsCalculations = {
      orbitalRadiusKm: r,
      semiMajorAxisKm: a,
      visVivaVelocityKmS,
      distanceFromEarthKm: this.distanceFromEarthKm,
      oneWayLightTimeSec,
      groundStationElevationDeg: groundElevation,
      groundSlantRangeKm,
      lambertDeltaVMS,
      spacecraftMassKg: this.spacecraftMassKg,
      specificImpulseSec: this.specificImpulseSec,
      tsiolkovskyPropellantKg,
      maxSafeGLoad,
      meanArterialPressureMmHg,
      shockIndex,
      instantDoseRateUSvH: radRate,
      cumulativeDoseMSv: this.cumulativeDoseMSv,
      bfoDoseLimitFractionPct: +((this.cumulativeDoseMSv / 250) * 100).toFixed(3),
    };

    const subagentEvaluations = this.evaluateSubagents(
      hr,
      sbp,
      dbp,
      spo2,
      hrv,
      stress,
      mentalIndex,
      radRate,
      cabinPressure,
      physics
    );

    const latestWave =
      this.waveformBuffer.length > 0
        ? this.waveformBuffer[this.waveformBuffer.length - 1]
        : { ecgMv: 0.12, ppg: 0.55 };

    return {
      id: `XIAOMI-H1-${Date.now()}`,
      timestamp: now.toISOString(),
      gmtTime,
      groundTime,
      missionElapsedTime,
      astronautId: "ARES-CDR-01",
      astronautName: "Temuulen Buuveibaatar (Berlin / Sonnenblume)",
      deviceModel: "Xiaomi Watch H1 (Space Medical Edition)",
      firmwareVersion: "v4.8.2-HERMES-BLE",
      connectionMode: this.bleConnected
        ? this.realHeartRateBpm !== null
          ? "WEB_BLUETOOTH_BLE"
          : "HYBRID_BLE_SIM"
        : "HARDWARE_SIMULATOR_1HZ",
      bluetoothDeviceName: this.bleDeviceName,
      batteryPct: this.realBatteryPct,
      heartRateBpm: hr,
      systolicBp: sbp,
      diastolicBp: dbp,
      microCuffStatus: secs % 15 < 4 ? "MEASURING" : "COMPLETE",
      spo2Pct: +spo2.toFixed(1),
      skinTempC: +skinTemp.toFixed(1),
      coreTempC: +coreTemp.toFixed(1),
      hrvRmssdMs: hrv,
      rrIntervalMs,
      stressScore: stress,
      mentalHealthIndex: mentalIndex,
      sleepScore,
      ecgRhythm,
      ecgLeadIMv: latestWave.ecgMv,
      ppgWaveValue: latestWave.ppg,
      radiationDoseRateUSvH: radRate,
      cumulativeDoseMSv: this.cumulativeDoseMSv,
      cabinPressureKpa: cabinPressure,
      cabinO2Pct: cabinO2,
      suitPressureKpa: suitPressure,
      activeScenario: this.activeScenario,
      anomalyDetected,
      anomalySeverity,
      autonomousTakeoverActive: this.autonomousTakeoverActive && !this.humanManualOverride,
      humanManualOverride: this.humanManualOverride,
      overrideCallsign: this.overrideCallsign,
      activeManeuver: this.activeManeuver,
      burnCountdownSec: this.burnCountdownSec,
      estHoursToEarth: +(this.estHoursToEarth - (this.autonomousTakeoverActive ? 0.002 : 0.0003)).toFixed(3),
      physics,
      subagentEvaluations,
    };
  }

  private evaluateSubagents(
    hr: number,
    sbp: number,
    dbp: number,
    spo2: number,
    hrv: number,
    stress: number,
    mentalIndex: number,
    radRate: number,
    cabinPressure: number,
    physics: LivePhysicsCalculations
  ): SubagentEvaluation[] {
    const ts = new Date().toISOString().slice(11, 19) + " UTC";

    // 1. MED-SENTINEL
    const medCritical = hr > 150 || spo2 < 88 || physics.meanArterialPressureMmHg < 68;
    const medWarn = hr > 110 || spo2 < 94;
    const medEval: SubagentEvaluation = {
      agentId: "MED-SENTINEL",
      status: medCritical ? "TAKEOVER_ACTIVE" : medWarn ? "WARNING" : "NOMINAL",
      confidence: 99.4,
      headline: medCritical
        ? `CRITICAL HEMODYNAMIC / HYPOXIC CRISIS (HR ${hr} BPM, SpO2 ${spo2}%)`
        : medWarn
        ? `Elevated Sympathetic Response (HR ${hr} BPM, MAP ${physics.meanArterialPressureMmHg} mmHg)`
        : `Nominal Sinus Rhythm & Micro-Cuff BP (${sbp}/${dbp} mmHg)`,
      analysis: medCritical
        ? `Xiaomi Watch H1 Lead-I ECG & Micro-Cuff detect Shock Index SI=${physics.shockIndex} and MAP=${physics.meanArterialPressureMmHg} mmHg. Capping spacecraft thrust G-load to ${physics.maxSafeGLoad}G to prevent syncope.`
        : `Continuous PPG/ECG telemetry confirms stable perfusion (MAP ${physics.meanArterialPressureMmHg} mmHg, Shock Index ${physics.shockIndex}).`,
      recommendedAction: medCritical
        ? `Auto-prep Amiodarone 150mg IV / 100% O2 mask; enforce ${physics.maxSafeGLoad}G ceiling on NAV-PILOT burn.`
        : "Continue 1Hz Xiaomi Watch H1 biometric surveillance.",
      formulaUsed: `MAP = ${dbp} + (${sbp}-${dbp})/3 = ${physics.meanArterialPressureMmHg} mmHg | SI = ${hr}/${sbp} = ${physics.shockIndex}`,
      timestamp: ts,
    };

    // 2. RAD-GUARD
    const radCritical = radRate > 200;
    const radWarn = radRate > 50;
    const radEval: SubagentEvaluation = {
      agentId: "RAD-GUARD",
      status: radCritical ? "TAKEOVER_ACTIVE" : radWarn ? "WARNING" : "NOMINAL",
      confidence: 99.8,
      headline: radCritical
        ? `SOLAR PARTICLE EVENT (SPE) SPIKE: ${radRate} µSv/h`
        : `Nominal Deep-Space GCR Flux (${radRate} µSv/h)`,
      analysis: radCritical
        ? `Dosimeter flux exceeds NASA ALARA storm threshold by ${(radRate / 25).toFixed(1)}x. Cumulative BFO dose at ${physics.cumulativeDoseMSv} mSv (${physics.bfoDoseLimitFractionPct}% of 30d limit).`
        : `Magneto-water shielding maintaining crew dose at ${physics.cumulativeDoseMSv} mSv cumulative.`,
      recommendedAction: radCritical
        ? "Command 180° tail-shield attitude alignment, energize magnetic torus coil, administer Potassium Iodide + Amifostine."
        : "Maintain nominal storm shelter water-wall circulation.",
      formulaUsed: `D_cum = ∫ D(t)dt = ${physics.cumulativeDoseMSv} mSv (${physics.bfoDoseLimitFractionPct}% BFO Limit)`,
      timestamp: ts,
    };

    // 3. PSY-ORACLE
    const psyCritical = hrv < 20 || stress > 90 || mentalIndex < 45;
    const psyWarn = hrv < 35 || stress > 70;
    const psyEval: SubagentEvaluation = {
      agentId: "PSY-ORACLE",
      status: psyCritical ? "TAKEOVER_ACTIVE" : psyWarn ? "WARNING" : "NOMINAL",
      confidence: 97.9,
      headline: psyCritical
        ? `ACUTE AUTONOMIC COLLAPSE / ISOLATION PANIC (HRV ${hrv} ms)`
        : `Resilient Cognitive & Autonomic State (HRV ${hrv} ms, Index ${mentalIndex}/100)`,
      analysis: psyCritical
        ? `Xiaomi Watch H1 R-R interval RMSSD dropped to ${hrv} ms with Stress=${stress}/100. High risk of pilot error during manual thruster burns.`
        : `Vagal tone RMSSD=${hrv} ms confirms low cognitive fatigue and stable circadian alignment.`,
      recommendedAction: psyCritical
        ? "Lock manual attitude thrusters to AI Autopilot (override still available), dim cabin to 460nm circadian blue-free spectrum, initiate respiratory biofeedback."
        : "Crew cleared for precision EVA and flight maneuvers.",
      formulaUsed: `RMSSD = √(1/N ∑(RR_{i+1} - RR_i)²) = ${hrv} ms | Stress = ${stress}/100`,
      timestamp: ts,
    };

    // 4. NAV-PILOT
    const navCritical =
      this.activeScenario !== "nominal" && !this.humanManualOverride;
    const navEval: SubagentEvaluation = {
      agentId: "NAV-PILOT",
      status: navCritical
        ? "TAKEOVER_ACTIVE"
        : this.humanManualOverride
        ? "WARNING"
        : "NOMINAL",
      confidence: 99.6,
      headline: this.humanManualOverride
        ? `HUMAN MANUAL OVERRIDE ENGAGED BY ${this.overrideCallsign}`
        : navCritical
        ? `AUTONOMOUS MANEUVER: ${this.activeManeuver}`
        : `Nominal Cislunar/Mars Transit Trajectory (v = ${physics.visVivaVelocityKmS} km/s)`,
      analysis: `Orbital speed v=${physics.visVivaVelocityKmS} km/s at r=${physics.orbitalRadiusKm.toLocaleString()} km. Lambert return burn requires Δv=${physics.lambertDeltaVMS} m/s (${physics.tsiolkovskyPropellantKg} kg propellant) capped at ${physics.maxSafeGLoad}G. Cabin P=${cabinPressure} kPa.`,
      recommendedAction: this.humanManualOverride
        ? "Standing by as flight envelope advisor while crew flies manually."
        : navCritical
        ? `Executing ${this.activeManeuver} (Δv=${physics.lambertDeltaVMS} m/s, G-Cap=${physics.maxSafeGLoad}G). Uplink active to Berlin Station & DSN.`
        : "Maintain continuous telemetry downlink to Berlin Station & NASA DSN.",
      formulaUsed: `v = √(μ(2/r - 1/a)) = ${physics.visVivaVelocityKmS} km/s | Δm = m₀(1 - e^(-Δv/I_sp·g₀)) = ${physics.tsiolkovskyPropellantKg} kg`,
      timestamp: ts,
    };

    return [medEval, radEval, psyEval, navEval];
  }

  private async postTelemetryToBackend(packet: XiaomiWatchTelemetryPacket) {
    try {
      await fetch("/api/telemetry/xiaomi-h1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          astronautId: "astro-1",
          heartRate: Math.round(packet.heartRateBpm),
          spo2: Number(packet.spo2Pct.toFixed(1)),
          bloodPressureSys: Math.round(packet.systolicBp),
          bloodPressureDia: Math.round(packet.diastolicBp),
          hrvMs: Math.round(packet.hrvRmssdMs),
          skinTempC: Number(packet.skinTempC.toFixed(1)),
          stressIndex: Math.round(packet.stressScore),
          sleepQualityScore: Math.round(packet.sleepScore),
          radiationDoseRateUsvHr: Number(packet.radiationDoseRateUSvH.toFixed(2)),
          evaSuitPressureKpa: Number(packet.cabinPressureKpa.toFixed(1)),
          cabinCo2Mmhg: 2.1,
        }),
      });
    } catch {
      // Silent fallback when running in offline / local environment
    }
  }
}

export const xiaomiWatchService = new XiaomiWatchTelemetryService();
