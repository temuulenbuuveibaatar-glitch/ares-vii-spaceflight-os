import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ShieldAlert, ArrowRight } from "lucide-react";

export default function EmergencyBanner() {
  const { data: overview } = useQuery<any>({
    queryKey: ["/api/mission/overview"],
    refetchInterval: 2500,
  });

  const autopilot = overview?.autopilotState;
  const activeAlerts = overview?.activeAlerts || [];
  const isTakeover = autopilot?.autonomousTakeoverActive;

  if (!isTakeover && activeAlerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-950/90 text-zinc-100 border-b border-red-500/40 py-2.5 px-4 surface-enter">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-semibold text-white">
            {isTakeover
              ? `Hermes Autonomous Ship Takeover: ${autopilot?.currentManeuver}`
              : `Active Space Biomedical Alert (${activeAlerts.length})`}
          </span>
          <span className="hidden md:inline text-zinc-300">
            : {autopilot?.takeoverReason || activeAlerts[0]?.title}
          </span>
        </div>
        <Link href="/hermes">
          <button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0b0e0a] font-bold px-3 py-1 rounded-lg cursor-pointer inline-flex items-center gap-1.5 active:scale-95 transition-all font-mono">
            <span>Manage Flight Control</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0b0e0a]" />
          </button>
        </Link>
      </div>
    </div>
  );
}
