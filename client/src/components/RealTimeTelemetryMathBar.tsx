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
    <div className="bg-zinc-950 text-zinc-400 border-b border-zinc-900 text-xs">
      <div className="container mx-auto px-4 h-9 flex items-center justify-between gap-6 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-2 text-zinc-200 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>Live Space Feed</span>
          </span>
          <span>
            ISS{" "}
            <strong className="font-mono text-zinc-100">
              {isLoading && !iss
                ? "Syncing..."
                : iss
                ? `${iss.altitudeKm} km · ${iss.velocityKms} km/s`
                : "418.4 km · 7.662 km/s"}
            </strong>
          </span>
          <span>
            Solar Wind{" "}
            <strong className="font-mono text-zinc-100">
              {wind?.speedKmS ?? 412.5} km/s
            </strong>
          </span>
          <span>
            GOES ≥10MeV{" "}
            <strong className="font-mono text-zinc-100">
              {rad?.goesProtonFlux10MeV ?? 0.24} PFU
            </strong>{" "}
            <span className="font-mono text-zinc-400">
              (Kp {rad?.planetaryKpIndex ?? 2.33})
            </span>
          </span>
        </div>

        <div className="flex items-center gap-5">
          <span>
            LEO Dose{" "}
            <strong className="font-mono text-zinc-100">
              {rad?.estimatedLeoDoseRateUsvHr ?? 18.4} µSv/h
            </strong>
          </span>
          <span>
            Watch H1{" "}
            <strong className="font-mono text-zinc-100">
              {hr} bpm · {spo2}% · MAP {mapMmHg}
            </strong>
          </span>
          <Link href="/gmat-orbiter">
            <span className="text-orange-400 hover:text-orange-300 font-medium cursor-pointer">
              GMAT Cap <span className="font-mono">{autopilot?.dynamicCardioGCap ?? 2.6}G</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
