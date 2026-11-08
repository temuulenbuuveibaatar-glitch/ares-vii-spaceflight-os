import { useState, useEffect } from "react";
import { CheckCircle2, Cpu, Watch, Orbit, Database, Globe, Bot, X } from "lucide-react";

interface SetupStep {
  id: string;
  title: string;
  detail: string;
  icon: any;
}

const SETUP_STEPS: SetupStep[] = [
  {
    id: "hermes-core",
    title: "HERMES Root AI & 4 Autonomous Subagents",
    detail:
      "MED-SENTINEL, RAD-GUARD, PSY-ORACLE, and NAV-PILOT online with Human Manual Override interlock.",
    icon: Bot,
  },
  {
    id: "live-space-feeds",
    title: "NOAA SWPC Solar Proton Flux & NORAD 25544 ISS Telemetry",
    detail:
      "Connected to live GOES ≥10 MeV proton flux, DSCOVR solar wind, planetary Kp index, and live ISS orbital ephemeris.",
    icon: Globe,
  },
  {
    id: "rust-gmat-orbiter",
    title: "Rust RK4/RK89 Core, NASA GMAT & Orbiter Simulator Bridge",
    detail:
      "EarthMJ2000Eq state vectors, J2 harmonic perturbation solver, and Orbiter Lua autopilot bridge ready.",
    icon: Orbit,
  },
  {
    id: "xiaomi-watch-h1",
    title: "Xiaomi Watch H1 Bio-Sensors & Radiation Dosimetry",
    detail:
      "Web Bluetooth GATT (0x180D/0x2A37), 25Hz Lead-I ECG oscilloscope, and dynamic cardiovascular G-load limiter ready.",
    icon: Watch,
  },
  {
    id: "supabase-cloud",
    title: "Supabase Telemetry Database & Multi-OS Runtime",
    detail:
      "PostgreSQL schema, 28+ World Space Agencies archive, and historical mission incident intelligence verified.",
    icon: Database,
  },
];

export default function HermesAutoSetupLauncher({
  forceOpen,
  onClose,
}: {
  forceOpen?: boolean;
  onClose?: () => void;
}) {
  const [visible, setVisible] = useState<boolean>(Boolean(forceOpen));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setVisible(true);
      setCurrentStepIndex(0);
    } else {
      setVisible(false);
    }
  }, [forceOpen]);

  useEffect(() => {
    if (!visible) return;
    if (currentStepIndex < SETUP_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((i) => i + 1);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [visible, currentStepIndex]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="surface-enter max-w-xl w-full bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-zinc-100">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-zinc-300" />
            <h2 className="text-sm font-semibold text-white">
              ARES-VII System Diagnostics & Tool Verification
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2.5">
          {SETUP_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStepIndex;
            return (
              <div
                key={step.id}
                className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/90 flex items-start gap-3"
              >
                <div className="mt-0.5 text-zinc-300">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-white">
                      {step.title}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {isDone ? "VERIFIED" : "CHECKING"}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 py-3 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="bg-zinc-100 hover:bg-white text-zinc-950 font-medium px-4 py-1.5 rounded-md text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
