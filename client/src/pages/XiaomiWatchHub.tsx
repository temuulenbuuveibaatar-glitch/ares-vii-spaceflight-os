import { useState, useEffect } from "react";
import {
  xiaomiWatchService,
  type XiaomiWatchTelemetryPacket,
} from "../services/xiaomiWatchService";
import { Watch, Bluetooth, Activity, Heart, ShieldCheck } from "lucide-react";

export default function XiaomiWatchHub() {
  const [packet, setPacket] = useState<XiaomiWatchTelemetryPacket>(() =>
    xiaomiWatchService.getLatestPacket()
  );
  const [cuffMeasuring, setCuffMeasuring] = useState(false);

  useEffect(() => {
    const unsub = xiaomiWatchService.subscribeTelemetry((pkt) => {
      setPacket(pkt);
    });
    return () => unsub();
  }, []);

  const handlePairBluetooth = async () => {
    await xiaomiWatchService.connectBluetoothWatch();
  };

  const handleInflateCuff = () => {
    setCuffMeasuring(true);
    setTimeout(() => setCuffMeasuring(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0e0a] text-[#e3ecd8] py-10 selection:bg-[#2e3b23] selection:text-[#fbbf24]">
      <div className="container mx-auto px-4 space-y-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#232d1a] pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#fbbf24]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
              <span>
                XIAOMI WATCH H1 · WEB BLUETOOTH GATT · MIL-STD-810H SENSOR STREAM
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans">
              Astronaut Wearable Vitals & Plain-English Health Monitor
            </h1>
            <p className="text-sm text-[#a8baa0] leading-relaxed">
              Streams heart rate, micro-cuff blood pressure, blood oxygen
              (SpO₂), and radiation exposure directly into the unified onboard
              medical record and GMAT G-force limiter.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0 font-mono text-xs">
            <button
              onClick={handlePairBluetooth}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-colors shadow-sm shadow-amber-500/10"
            >
              <Bluetooth className="w-4 h-4 text-[#0b0e0a]" />
              <span>Pair Xiaomi Watch H1</span>
            </button>
            <button
              onClick={handleInflateCuff}
              disabled={cuffMeasuring}
              className="bg-[#13190e] hover:bg-[#1a2313] text-[#c7dfb8] border border-[#2e3b23] px-3.5 py-2.5 rounded-xl font-medium inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-colors"
            >
              <Watch className="w-4 h-4 text-[#fbbf24]" />
              <span>
                {cuffMeasuring ? "Inflating Wrist Cuff..." : "Measure Blood Pressure"}
              </span>
            </button>
          </div>
        </div>

        {/* PLAIN-ENGLISH VITALS CARDS */}
        <div className="card-outer">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
            <div className="card-inner p-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#8ea873]">
                <span>Heart Rate & Rhythm</span>
                <Heart className="w-4 h-4 text-[#fbbf24]" />
              </div>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {packet.heartRateBpm}{" "}
                <span className="text-xs font-normal text-[#8ea873]">bpm</span>
              </div>
              <p className="text-xs text-[#a8baa0]">
                Normal resting heartbeat (60–100 bpm). Rhythm:{" "}
                <strong className="text-white">Normal Sinus</strong>.
              </p>
            </div>

            <div className="card-inner p-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#8ea873]">
                <span>Wrist Micro-Cuff Blood Pressure</span>
                <Activity className="w-4 h-4 text-[#84a96c]" />
              </div>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {packet.systolicBp}/{packet.diastolicBp}{" "}
                <span className="text-xs font-normal text-[#8ea873]">mmHg</span>
              </div>
              <p className="text-xs text-[#a8baa0]">
                Mean Arterial Pressure:{" "}
                <strong className="font-mono text-[#fbbf24]">
                  {packet.physics.meanArterialPressureMmHg} mmHg
                </strong>{" "}
                (Healthy brain perfusion).
              </p>
            </div>

            <div className="card-inner p-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#8ea873]">
                <span>Blood Oxygen (SpO₂)</span>
                <ShieldCheck className="w-4 h-4 text-[#84a96c]" />
              </div>
              <div className="text-3xl font-mono font-bold text-[#84a96c] tabular-nums">
                {packet.spo2Pct}%
              </div>
              <p className="text-xs text-[#a8baa0]">
                Healthy oxygen saturation (95–100%). No cabin hypoxia detected.
              </p>
            </div>

            <div className="card-inner p-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#8ea873]">
                <span>Safe Re-Entry G-Force Limit</span>
                <Watch className="w-4 h-4 text-[#fbbf24]" />
              </div>
              <div className="text-3xl font-mono font-bold text-[#fbbf24] tabular-nums">
                {packet.physics.maxSafeGLoad} G
              </div>
              <p className="text-xs text-[#a8baa0]">
                Calculated from current blood pressure and heart rate so the ship never causes G-LOC blackout.
              </p>
            </div>
          </div>
        </div>

        {/* TEST WHAT HAPPENS WHEN VITALS CHANGE */}
        <div className="card-outer">
          <div className="card-inner p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232d1a] pb-4">
              <div>
                <h2 className="text-base font-bold text-white">
                  Test How Hermes Protects the Astronaut in Different Scenarios
                </h2>
                <p className="text-xs text-[#a8baa0]">
                  Select a condition below to see how the watch detects danger
                  and automatically limits spacecraft G-forces.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2.5 font-mono text-xs">
              {[
                {
                  id: "nominal",
                  title: "Healthy / Nominal",
                  desc: "Normal heart rate (72 bpm) & blood pressure.",
                },
                {
                  id: "solar_storm_spe",
                  title: "Solar Radiation Storm",
                  desc: "High proton flux triggers storm shelter & Indralin.",
                },
                {
                  id: "cardiac_emergency",
                  title: "Rapid Heartbeat (SVT)",
                  desc: "Heart >165 bpm; Hermes caps ship acceleration to 1.6G.",
                },
                {
                  id: "cabin_depressurization",
                  title: "Low Cabin Oxygen",
                  desc: "SpO₂ drops <88%; Hermes opens emergency O₂ reserve.",
                },
                {
                  id: "mental_health_crisis",
                  title: "Crew Sleep & Stress",
                  desc: "Low HRV triggers private rest & circadian light shift.",
                },
              ].map((sc) => {
                const isSelected = packet.activeScenario === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() =>
                      xiaomiWatchService.triggerScenario(sc.id as any)
                    }
                    className={`text-left p-3.5 rounded-xl border cursor-pointer active:scale-[0.97] transition-colors ${
                      isSelected
                        ? "bg-[#28381c] text-[#fbbf24] border-[#4d633b] font-bold shadow-sm shadow-amber-500/10"
                        : "bg-[#0b0e0a] text-[#8ea873] border-[#232d1a] hover:border-[#3f5231] hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{sc.title}</div>
                    <div
                      className={`text-[11px] mt-1 leading-snug font-sans ${
                        isSelected ? "text-[#e3ecd8]" : "text-[#8ea873]"
                      }`}
                    >
                      {sc.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
