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
    await xiaomiWatchService.connectRealWebBluetoothWatch();
  };

  const handleInflateCuff = () => {
    setCuffMeasuring(true);
    xiaomiWatchService.triggerManualMicroCuffMeasurement();
    setTimeout(() => setCuffMeasuring(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10">
      <div className="container mx-auto px-4 space-y-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-zinc-800/80 pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-orange-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>
                Xiaomi Watch H1 · Web Bluetooth GATT · Unified EHR Stream
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
              Astronaut Wearable Vitals & Plain-English Health Monitor
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Streams heart rate, micro-cuff blood pressure, blood oxygen
              (SpO₂), and radiation exposure directly into the unified onboard
              medical record and GMAT G-force limiter.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={handlePairBluetooth}
              className="bg-orange-500 hover:bg-orange-400 text-zinc-950 font-semibold px-4 py-2.5 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Bluetooth className="w-4 h-4" />
              <span>Pair Xiaomi Watch H1</span>
            </button>
            <button
              onClick={handleInflateCuff}
              disabled={cuffMeasuring}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 px-3.5 py-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Watch className="w-4 h-4 text-orange-500" />
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
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Heart Rate & Rhythm</span>
                <Heart className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-mono font-semibold text-white tabular-nums">
                {packet.heartRateBpm}{" "}
                <span className="text-xs font-normal text-zinc-400">bpm</span>
              </div>
              <p className="text-xs text-zinc-400">
                Normal resting heartbeat (60–100 bpm). Rhythm:{" "}
                <strong className="text-zinc-200">Normal Sinus</strong>.
              </p>
            </div>

            <div className="card-inner p-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Wrist Micro-Cuff Blood Pressure</span>
                <Activity className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-mono font-semibold text-white tabular-nums">
                {packet.systolicBp}/{packet.diastolicBp}{" "}
                <span className="text-xs font-normal text-zinc-400">mmHg</span>
              </div>
              <p className="text-xs text-zinc-400">
                Mean Arterial Pressure:{" "}
                <strong className="font-mono text-zinc-200">
                  {packet.mapMmHg} mmHg
                </strong>{" "}
                (Healthy brain perfusion).
              </p>
            </div>

            <div className="card-inner p-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Blood Oxygen (SpO₂)</span>
                <ShieldCheck className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-mono font-semibold text-white tabular-nums">
                {packet.spo2Pct}%
              </div>
              <p className="text-xs text-zinc-400">
                Healthy oxygen saturation (95–100%). No cabin hypoxia detected.
              </p>
            </div>

            <div className="card-inner p-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Safe Re-Entry G-Force Limit</span>
                <Watch className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-mono font-semibold text-orange-400 tabular-nums">
                {packet.physics.maxSafeGLoad} G
              </div>
              <p className="text-xs text-zinc-400">
                Calculated from your current blood pressure and heart rate so
                the ship never causes G-LOC blackout.
              </p>
            </div>
          </div>
        </div>

        {/* TEST WHAT HAPPENS WHEN VITALS CHANGE */}
        <div className="card-outer">
          <div className="card-inner p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Test How Hermes Protects the Astronaut in Different Scenarios
                </h2>
                <p className="text-xs text-zinc-400">
                  Select a condition below to see how the watch detects danger
                  and automatically limits spacecraft G-forces.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {[
                {
                  id: "nominal",
                  title: "Healthy / Nominal",
                  desc: "Normal heart rate (72 bpm) & blood pressure.",
                },
                {
                  id: "solar_storm",
                  title: "Solar Radiation Storm",
                  desc: "High proton flux triggers storm shelter & Indralin.",
                },
                {
                  id: "cardiac_arrhythmia",
                  title: "Rapid Heartbeat (SVT)",
                  desc: "Heart >165 bpm; Hermes caps ship acceleration to 1.6G.",
                },
                {
                  id: "cabin_hypoxia",
                  title: "Low Cabin Oxygen",
                  desc: "SpO₂ drops <88%; Hermes opens emergency O₂ reserve.",
                },
                {
                  id: "psychological_fatigue",
                  title: "Crew Sleep & Stress",
                  desc: "Low HRV triggers private rest & circadian light shift.",
                },
              ].map((sc) => {
                const isSelected = packet.activeScenario === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() =>
                      xiaomiWatchService.triggerEmergencyScenario(sc.id as any)
                    }
                    className={`text-left p-3.5 rounded-lg border cursor-pointer ${
                      isSelected
                        ? "bg-orange-500 text-zinc-950 border-orange-500 font-medium"
                        : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-semibold">{sc.title}</div>
                    <div
                      className={`text-[11px] mt-1 leading-snug ${
                        isSelected ? "text-zinc-900" : "text-zinc-400"
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
