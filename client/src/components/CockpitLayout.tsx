import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import RealTimeTelemetryMathBar from "./RealTimeTelemetryMathBar";
import HermesFloatingAgent from "./HermesFloatingAgent";
import EmergencyBanner from "./EmergencyBanner";
import HermesAutoSetupLauncher from "./HermesAutoSetupLauncher";
import {
  Activity,
  Brain,
  Pill,
  Orbit,
  Globe,
  AlertTriangle,
  Watch,
  Cpu,
  Hand,
  Menu,
  X,
  ExternalLink,
  Satellite,
  Radio,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

interface CockpitLayoutProps {
  children: ReactNode;
}

const STATIONS = [
  { id: "cockpit", label: "24/7 Crew Vitals & Hazard Workbench", path: "/app", icon: Activity },
  { id: "hermes", label: "Hermes Voice & AI Therapy", path: "/hermes", icon: Brain },
  { id: "meds", label: "Multi-Agency Meds & Shielding", path: "/space-encyclopedia", icon: Pill },
  { id: "gmat", label: "NASA GMAT R2026a IDE", path: "/gmat-orbiter", icon: Orbit },
  { id: "agencies", label: "28 Nations Space Archive", path: "/world-agencies", icon: Globe },
  { id: "emergency", label: "Emergency Flight Protocols", path: "/emergency", icon: AlertTriangle },
  { id: "watch", label: "Xiaomi Watch H1 Telemetry", path: "/xiaomi-watch", icon: Watch },
  { id: "cloud", label: "Rust Desktop & Cloud Engine", path: "/cloud-desktop", icon: Cpu },
];

export default function CockpitLayout({ children }: CockpitLayoutProps) {
  const [location] = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);

  // Mission Elapsed Time (MET) counter
  const [metSeconds, setMetSeconds] = useState(15934932); // Day 184
  useEffect(() => {
    const timer = setInterval(() => setMetSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMet = (totalSec: number) => {
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `MET ${d}d ${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  const { data: overview } = useQuery<any>({
    queryKey: ["/api/mission/overview"],
    refetchInterval: 3000,
  });

  const overrideMutation = useMutation({
    mutationFn: async (engaged: boolean) => {
      const res = await apiRequest("POST", "/api/ship/override", {
        engaged,
        authorizedBy: "Cmdr. Elena Vance",
        reason: engaged
          ? "Manual crew override engaged from flight deck HUD"
          : "Hermes Autonomous Authority restored",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mission/overview"] });
    },
  });

  const autopilot = overview?.autopilotState;
  const isTakeover = autopilot?.autonomousTakeoverActive;
  const isOverridden = autopilot?.humanOverrideEngaged;

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e0a] text-[#e3ecd8] selection:bg-[#2e3b23] selection:text-[#fbbf24]">
      <HermesAutoSetupLauncher
        forceOpen={launcherOpen}
        onClose={() => setLauncherOpen(false)}
      />

      {/* TOP REAL-TIME ASTRODYNAMICS & BIOMETRIC MATH STRIP */}
      <RealTimeTelemetryMathBar />

      {/* MISSION CONTROL HUD TOPBAR */}
      <header className="sticky top-0 z-40 bg-[#0b0e0a]/95 backdrop-blur-md border-b border-[#232d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/app">
              <div className="flex items-center gap-2.5 cursor-pointer">
                <span className="text-lg">🌻</span>
                <div className="font-mono font-bold text-sm tracking-tight text-white flex items-center gap-2">
                  <span>Sonnenblume</span>
                  <span className="text-[10px] bg-[#182213] text-[#fbbf24] border border-[#3f5231] px-1.5 py-0.2 rounded font-mono font-bold">
                    TOOL
                  </span>
                </div>
              </div>
            </Link>

            <span className="hidden xl:inline text-xs font-mono text-[#8ea873] border-l border-[#232d1a] pl-3 tabular-nums">
              {formatMet(metSeconds)}
            </span>
          </div>

          {/* Comms & Interlock Status */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="hidden md:flex items-center gap-2 bg-[#13190e] border border-[#2e3b23] px-3 py-1 rounded-xl">
              <Satellite className="w-3.5 h-3.5 text-[#84a96c]" />
              <span className="text-[#8ea873]">DSN Goldstone:</span>
              <span className="text-white font-bold">142.4 Mbps</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-[#13190e] border border-[#2e3b23] px-3 py-1 rounded-xl">
              <span
                className={`w-2 h-2 rounded-full ${
                  isTakeover && !isOverridden
                    ? "bg-[#ef4444]"
                    : isOverridden
                    ? "bg-[#fbbf24]"
                    : "bg-[#84a96c]"
                }`}
              />
              <span className="font-bold text-white">
                {isTakeover && !isOverridden
                  ? "TAKEOVER ACTIVE"
                  : isOverridden
                  ? "MANUAL STICK"
                  : "HERMES ARMED"}
              </span>
              <button
                onClick={() => overrideMutation.mutate(!isOverridden)}
                disabled={overrideMutation.isPending}
                className="bg-[#182213] hover:bg-[#24331c] text-[#fbbf24] border border-[#3f5231] px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer active:scale-[0.97] transition-colors"
              >
                {isOverridden ? "Restore AI" : "Override"}
              </button>
            </div>

            {/* EXIT TO MARKETING SITE */}
            <a
              href={typeof window !== "undefined" && window.location.hostname.includes("localhost") ? "/" : "https://sonnenblume-marketing.vercel.app"}
              className="bg-[#182213] hover:bg-[#24331c] text-[#a3c988] hover:text-white border border-[#3f5231] px-3 py-1.5 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span className="hidden sm:inline">Marketing Site ↗</span>
              <span className="sm:hidden">Exit</span>
            </a>

            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-1.5 rounded-lg border border-[#2e3b23] text-[#8ea873] hover:text-white hover:bg-[#13190e]"
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* MISSION STATION NAVIGATION BAR */}
      <nav className="bg-[#0e140d] border-b border-[#232d1a] overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="hidden lg:flex items-center gap-1 py-1.5 font-mono text-xs">
            {STATIONS.map((station) => {
              const Icon = station.icon;
              const isActive =
                location === station.path ||
                (station.path === "/app" && (location === "/cockpit" || location === "/monitor" || location === "/flight-os"));
              return (
                <Link key={station.id} href={station.path}>
                  <div
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all active:scale-[0.97] ${
                      isActive
                        ? "bg-[#28381c] text-[#fbbf24] border border-[#4d633b] font-bold shadow-sm shadow-amber-500/10"
                        : "text-[#8ea873] hover:text-[#e3ecd8] hover:bg-[#13190e] border border-transparent"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#fbbf24]" : "text-[#8ea873]"}`} />
                    <span>{station.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Station Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-[#0e140d] border-b border-[#232d1a] p-4 space-y-1 font-mono text-xs">
            {STATIONS.map((station) => {
              const Icon = station.icon;
              const isActive = location === station.path;
              return (
                <Link key={station.id} href={station.path}>
                  <div
                    onClick={() => setMobileNavOpen(false)}
                    className={`p-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer ${
                      isActive
                        ? "bg-[#28381c] text-[#fbbf24] border border-[#4d633b] font-bold"
                        : "text-[#8ea873] hover:text-white hover:bg-[#182213]"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#fbbf24]" />
                    <span>{station.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* CRITICAL WARNING BANNER IF ANOMALY DETECTED */}
      <EmergencyBanner />

      {/* OPERATIONAL APP MAIN CONTENT */}
      <main className="flex-grow bg-[#0b0e0a]">{children}</main>

      {/* FLOATING HERMES VOICE & MEDICAL AGENT */}
      <HermesFloatingAgent />

      {/* TACTICAL MISSION STATUS FOOTER */}
      <footer className="bg-[#080b07] border-t border-[#1f2817] py-4 text-xs font-mono text-[#6d845e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span>ARES-VII Bio-Astronautics OS v2.0.0</span>
            <span>•</span>
            <span>Subagents: MED-SENTINEL · RAD-GUARD · PSY-ORACLE · NAV-PILOT</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#84a96c]">All 4 Interlocks Verified</span>
            <span className="text-[#fbbf24]">Offline Autonomous Mode</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
