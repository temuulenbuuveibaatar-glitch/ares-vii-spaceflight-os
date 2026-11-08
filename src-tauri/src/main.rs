// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::f64::consts::PI;

const MU_EARTH_KM3_S2: f64 = 398_600.4418;
const R_EARTH_KM: f64 = 6_378.137;
const J2_EARTH: f64 = 1.08262668e-3;
const G0_M_S2: f64 = 9.80665;
const ISP_SEC: f64 = 450.0;
const SHIP_MASS_KG: f64 = 42_000.0;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct StateVectorJ2000 {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub vx: f64,
    pub vy: f64,
    pub vz: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct XiaomiWatchVitals {
    pub heart_rate: f64,
    pub spo2: f64,
    pub bp_sys: f64,
    pub bp_dia: f64,
    pub hrv_ms: f64,
    pub radiation_usv_hr: f64,
    pub stress_index: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RustSimulationResult {
    pub next_state: StateVectorJ2000,
    pub orbital_velocity_km_s: f64,
    pub distance_to_earth_km: f64,
    pub semi_major_axis_km: f64,
    pub eccentricity: f64,
    pub inclination_deg: f64,
    pub medical_max_g_load: f64,
    pub mean_arterial_pressure: f64,
    pub abort_delta_v_m_s: f64,
    pub propellant_burn_kg: f64,
    pub autonomous_takeover_recommended: bool,
    pub takeover_reason: String,
    pub compute_latency_microseconds: u64,
}

/// Computes 3D gravitational + Earth J2 oblateness + Hermes autonomous thrust acceleration in J2000 (km/s^2)
#[inline(always)]
fn compute_acceleration_j2(s: &StateVectorJ2000, thrust_km_s2: [f64; 3]) -> [f64; 3] {
    let r2 = s.x * s.x + s.y * s.y + s.z * s.z;
    let r = r2.sqrt();
    let r3 = r2 * r;
    let r5 = r2 * r3;

    let mut ax = -MU_EARTH_KM3_S2 * s.x / r3;
    let mut ay = -MU_EARTH_KM3_S2 * s.y / r3;
    let mut az = -MU_EARTH_KM3_S2 * s.z / r3;

    let z2 = s.z * s.z;
    let j2_factor = 1.5 * J2_EARTH * MU_EARTH_KM3_S2 * R_EARTH_KM * R_EARTH_KM / r5;
    ax += j2_factor * s.x * (5.0 * z2 / r2 - 1.0) + thrust_km_s2[0];
    ay += j2_factor * s.y * (5.0 * z2 / r2 - 1.0) + thrust_km_s2[1];
    az += j2_factor * s.z * (5.0 * z2 / r2 - 3.0) + thrust_km_s2[2];

    [ax, ay, az]
}

/// High-precision 4th-Order Runge-Kutta (RK4) propagator in native Rust
#[tauri::command]
fn rust_propagate_and_evaluate(
    state: StateVectorJ2000,
    dt_sec: f64,
    vitals: XiaomiWatchVitals,
    human_override: bool,
) -> RustSimulationResult {
    let start = std::time::Instant::now();

    // 1. Evaluate Xiaomi Watch H1 Biometrics & Radiation in zero-allocation Rust
    let map_mmhg = vitals.bp_dia + (vitals.bp_sys - vitals.bp_dia) / 3.0;
    let cardio_critical = vitals.heart_rate > 160.0
        || vitals.heart_rate < 42.0
        || vitals.spo2 < 88.0
        || map_mmhg < 65.0;
    let radiation_critical = vitals.radiation_usv_hr > 400.0;
    let psych_critical = vitals.stress_index > 90.0 && vitals.hrv_ms < 18.0;

    let autonomous_takeover_recommended =
        !human_override && (cardio_critical || radiation_critical || psych_critical);

    let takeover_reason = if human_override {
        "HUMAN MANUAL OVERRIDE ENGAGED — Crew retains direct stick control".to_string()
    } else if cardio_critical {
        format!(
            "MED-SENTINEL CRITICAL: HR {:.0} BPM, SpO2 {:.1}%, MAP {:.0} mmHg — Executing Medically-Capped Fast Earth Return",
            vitals.heart_rate, vitals.spo2, map_mmhg
        )
    } else if radiation_critical {
        format!(
            "RAD-GUARD CRITICAL: SPE Flux {:.1} uSv/h — Aligning Aft Water-Wall Shield & Aborting",
            vitals.radiation_usv_hr
        )
    } else if psych_critical {
        "PSY-ORACLE ALERT: Severe Crew Cognitive/Stress Anomaly — Engaging Safe Autopilot Hold"
            .to_string()
    } else {
        "NOMINAL — All 4 Hermes Subagents Monitoring".to_string()
    };

    // Dynamically cap G-load to protect cardiovascularly compromised crew
    let medical_max_g_load = if cardio_critical { 1.65 } else { 3.20 };

    // Compute thrust vector if autonomous takeover is active
    let v_mag_init = (state.vx * state.vx + state.vy * state.vy + state.vz * state.vz).sqrt();
    let thrust_km_s2 = if autonomous_takeover_recommended && v_mag_init > 0.0 {
        let accel_km_s2 = (medical_max_g_load * G0_M_S2) / 1000.0 * 0.15;
        [
            (-state.vx / v_mag_init) * accel_km_s2,
            (-state.vy / v_mag_init) * accel_km_s2,
            (-state.vz / v_mag_init) * accel_km_s2,
        ]
    } else {
        [0.0, 0.0, 0.0]
    };

    // 2. RK4 Integration Step
    let [ax1, ay1, az1] = compute_acceleration_j2(&state, thrust_km_s2);
    let s2 = StateVectorJ2000 {
        x: state.x + 0.5 * dt_sec * state.vx,
        y: state.y + 0.5 * dt_sec * state.vy,
        z: state.z + 0.5 * dt_sec * state.vz,
        vx: state.vx + 0.5 * dt_sec * ax1,
        vy: state.vy + 0.5 * dt_sec * ay1,
        vz: state.vz + 0.5 * dt_sec * az1,
    };

    let [ax2, ay2, az2] = compute_acceleration_j2(&s2, thrust_km_s2);
    let s3 = StateVectorJ2000 {
        x: state.x + 0.5 * dt_sec * s2.vx,
        y: state.y + 0.5 * dt_sec * s2.vy,
        z: state.z + 0.5 * dt_sec * s2.vz,
        vx: state.vx + 0.5 * dt_sec * ax2,
        vy: state.vy + 0.5 * dt_sec * ay2,
        vz: state.vz + 0.5 * dt_sec * az2,
    };

    let [ax3, ay3, az3] = compute_acceleration_j2(&s3, thrust_km_s2);
    let s4 = StateVectorJ2000 {
        x: state.x + dt_sec * s3.vx,
        y: state.y + dt_sec * s3.vy,
        z: state.z + dt_sec * s3.vz,
        vx: state.vx + dt_sec * ax3,
        vy: state.vy + dt_sec * ay3,
        vz: state.vz + dt_sec * az3,
    };

    let [ax4, ay4, az4] = compute_acceleration_j2(&s4, thrust_km_s2);

    let next_state = StateVectorJ2000 {
        x: state.x + (dt_sec / 6.0) * (state.vx + 2.0 * s2.vx + 2.0 * s3.vx + s4.vx),
        y: state.y + (dt_sec / 6.0) * (state.vy + 2.0 * s2.vy + 2.0 * s3.vy + s4.vy),
        z: state.z + (dt_sec / 6.0) * (state.vz + 2.0 * s2.vz + 2.0 * s3.vz + s4.vz),
        vx: state.vx + (dt_sec / 6.0) * (ax1 + 2.0 * ax2 + 2.0 * ax3 + ax4),
        vy: state.vy + (dt_sec / 6.0) * (ay1 + 2.0 * ay2 + 2.0 * ay3 + ay4),
        vz: state.vz + (dt_sec / 6.0) * (az1 + 2.0 * az2 + 2.0 * az3 + az4),
    };

    // 3. Keplerian Elements & Tsiolkovsky Propellant Requirement
    let r_mag = (next_state.x * next_state.x
        + next_state.y * next_state.y
        + next_state.z * next_state.z)
        .sqrt();
    let v_mag = (next_state.vx * next_state.vx
        + next_state.vy * next_state.vy
        + next_state.vz * next_state.vz)
        .sqrt();

    let hx = next_state.y * next_state.vz - next_state.z * next_state.vy;
    let hy = next_state.z * next_state.vx - next_state.x * next_state.vz;
    let hz = next_state.x * next_state.vy - next_state.y * next_state.vx;
    let h_mag = (hx * hx + hy * hy + hz * hz).sqrt();

    let specific_energy = 0.5 * v_mag * v_mag - MU_EARTH_KM3_S2 / r_mag;
    let semi_major_axis_km = -MU_EARTH_KM3_S2 / (2.0 * specific_energy);

    let r_dot_v = next_state.x * next_state.vx
        + next_state.y * next_state.vy
        + next_state.z * next_state.vz;
    let ex = ((v_mag * v_mag - MU_EARTH_KM3_S2 / r_mag) * next_state.x - r_dot_v * next_state.vx)
        / MU_EARTH_KM3_S2;
    let ey = ((v_mag * v_mag - MU_EARTH_KM3_S2 / r_mag) * next_state.y - r_dot_v * next_state.vy)
        / MU_EARTH_KM3_S2;
    let ez = ((v_mag * v_mag - MU_EARTH_KM3_S2 / r_mag) * next_state.z - r_dot_v * next_state.vz)
        / MU_EARTH_KM3_S2;
    let eccentricity = (ex * ex + ey * ey + ez * ez).sqrt();
    let inclination_deg = (hz / h_mag).clamp(-1.0, 1.0).acos() * 180.0 / PI;

    let abort_delta_v_m_s = if autonomous_takeover_recommended {
        3140.0
    } else {
        845.0
    };
    let propellant_burn_kg =
        SHIP_MASS_KG * (1.0 - (-abort_delta_v_m_s / (ISP_SEC * G0_M_S2)).exp());

    let elapsed_us = start.elapsed().as_micros() as u64;

    RustSimulationResult {
        next_state,
        orbital_velocity_km_s: v_mag,
        distance_to_earth_km: r_mag,
        semi_major_axis_km,
        eccentricity,
        inclination_deg,
        medical_max_g_load,
        mean_arterial_pressure: map_mmhg,
        abort_delta_v_m_s,
        propellant_burn_kg,
        autonomous_takeover_recommended,
        takeover_reason,
        compute_latency_microseconds: elapsed_us.max(1),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![rust_propagate_and_evaluate])
        .run(tauri::generate_context!())
        .expect("error while running ARES-VII Hermes Tauri application");
}
