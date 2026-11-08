import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function RealTimeTelemetryMathBar() {
  const { data: liveSpace, isLoading } = useQuery<any>({
    queryKey: ["/api/space-data/live"],
    refetchInterval: 10000,
  });

  const { data: overview } = useQuery<any>({
    queryKey: ["/api/mission/overview"],
    refetchInterval: 3000,
  });

  const iss = liveSpace?.iss;
  const wind = liveSpace?.solarWind;
  const rad = liveSpace?.radiation;
  const autopilot = overview?.autopilotState;
  const latestTelemetry = overview?.recentTelemetry?.[0];

  const hr = latestTelemetry?.heartRate ?? 72;
  const spo2 = latestTelemetry?.spo2 ?? 98.2;
  const bpSys = latestTelemetry?.bloodPressureSys ?? 118;
  const bpDia = latestTelemetry?.bloodPressureDia ?? 76;
  const mapMmHg = Math.round(bpDia + (bpSys - bpDia) / 3);

  return (
    <div className="bg-[#080b07] text-[#8ea873] border-b border-[#1f2817] text-xs font-mono">
      <div className="container mx-auto px-4 h-9 flex items-center justify-between gap-6 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-2 text-[#c7dfb8] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
            <span>Telemetry Link</span>
          </span>
          <span>
            ISS{" "}
            <strong className="font-mono text-white tabular-nums">
              {isLoading && !iss
                ? "Syncing..."
                : iss
                ? `${iss.altitudeKm} km · ${iss.velocityKms} km/s`
                : "418.4 km · 7.662 km/s"}
            </strong>
          </span>
          <span>
            Solar Wind{" "}
            <strong className="font-mono text-white tabular-nums">
              {wind?.speedKmS ?? 412.5} km/s
            </strong>
          </span>
          <span>
            GOES ≥10MeV{" "}
            <strong className="font-mono text-[#fbbf24] tabular-nums">
              {rad?.goesProtonFlux10MeV ?? 0.24} PFU
            </strong>{" "}
            <span className="font-mono text-[#6d845e] tabular-nums">
              (Kp {rad?.planetaryKpIndex ?? 2.33})
            </span>
          </span>
        </div>

        <div className="flex items-center gap-5">
          <span>
            LEO Dose{" "}
            <strong className="font-mono text-white tabular-nums">
              {rad?.estimatedLeoDoseRateUsvHr ?? 18.4} µSv/h
            </strong>
          </span>
          <span>
            Watch H1{" "}
            <strong className="font-mono text-[#a3c988] tabular-nums">
              {hr} bpm · {spo2}% · MAP {mapMmHg}
            </strong>
          </span>
          <Link href="/gmat-orbiter">
            <span className="text-[#fbbf24] hover:text-[#fde68a] font-bold cursor-pointer transition-colors active:scale-[0.97]">
              GMAT Cap <span className="font-mono tabular-nums">{autopilot?.dynamicCardioGCap ?? 2.6}G</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
