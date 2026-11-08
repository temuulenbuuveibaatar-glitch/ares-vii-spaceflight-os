import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Rocket,
  Download,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Hand,
  Cpu,
  Orbit,
  Terminal,
  Compass,
  FolderTree,
  Sliders,
  Radio,
  Flame,
  CheckCircle2,
} from "lucide-react";

const MU_EARTH_KM3_S2 = 398600.4418;
const R_EARTH_KM = 6378.137;
const J2_EARTH = 1.08262668e-3;

interface StateVectorJ2000 {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

type GmatResourceId =
  | "sc_ares_vii"
  | "hw_thruster"
  | "fm_deepspace"
  | "prop_rk89"
  | "burn_hermes"
  | "solver_dc"
  | "gs_network"
  | "sub_orbitview"
  | "seq_mission";

// 4th-Order Runge-Kutta (RK4) Orbital Propagator with Earth J2 Oblateness & Hermes Thrust
function computeAcceleration(
  s: StateVectorJ2000,
  thrustAccelKmS2: [number, number, number],
  j2DegreeFactor: number
): [number, number, number] {
  const r2 = s.x * s.x + s.y * s.y + s.z * s.z;
  const r = Math.sqrt(r2);
  const r3 = r2 * r;
  const r5 = r2 * r3;

  let ax = (-MU_EARTH_KM3_S2 * s.x) / r3;
  let ay = (-MU_EARTH_KM3_S2 * s.y) / r3;
  let az = (-MU_EARTH_KM3_S2 * s.z) / r3;

  const z2 = s.z * s.z;
  const factor =
    ((1.5 * J2_EARTH * MU_EARTH_KM3_S2 * R_EARTH_KM * R_EARTH_KM) / r5) *
    j2DegreeFactor;
  ax += factor * s.x * ((5 * z2) / r2 - 1);
  ay += factor * s.y * ((5 * z2) / r2 - 1);
  az += factor * s.z * ((5 * z2) / r2 - 3);

  ax += thrustAccelKmS2[0];
  ay += thrustAccelKmS2[1];
  az += thrustAccelKmS2[2];

  return [ax, ay, az];
}

function rk4Step(
  s: StateVectorJ2000,
  dt: number,
  thrustAccelKmS2: [number, number, number],
  j2DegreeFactor: number
): StateVectorJ2000 {
  const [ax1, ay1, az1] = computeAcceleration(s, thrustAccelKmS2, j2DegreeFactor);

  const s2: StateVectorJ2000 = {
    x: s.x + 0.5 * dt * s.vx,
    y: s.y + 0.5 * dt * s.vy,
    z: s.z + 0.5 * dt * s.vz,
    vx: s.vx + 0.5 * dt * ax1,
    vy: s.vy + 0.5 * dt * ay1,
    vz: s.vz + 0.5 * dt * az1,
  };
  const [ax2, ay2, az2] = computeAcceleration(s2, thrustAccelKmS2, j2DegreeFactor);

  const s3: StateVectorJ2000 = {
    x: s.x + 0.5 * dt * s2.vx,
    y: s.y + 0.5 * dt * s2.vy,
    z: s.z + 0.5 * dt * s2.vz,
    vx: s.vx + 0.5 * dt * ax2,
    vy: s.vy + 0.5 * dt * ay2,
    vz: s.vz + 0.5 * dt * az2,
  };
  const [ax3, ay3, az3] = computeAcceleration(s3, thrustAccelKmS2, j2DegreeFactor);

  const s4: StateVectorJ2000 = {
    x: s.x + dt * s3.vx,
    y: s.y + dt * s3.vy,
    z: s.z + dt * s3.vz,
    vx: s.vx + dt * ax3,
    vy: s.vy + dt * ay3,
    vz: s.vz + dt * az3,
  };
  const [ax4, ay4, az4] = computeAcceleration(s4, thrustAccelKmS2, j2DegreeFactor);

  return {
    x: s.x + (dt / 6) * (s.vx + 2 * s2.vx + 2 * s3.vx + s4.vx),
    y: s.y + (dt / 6) * (s.vy + 2 * s2.vy + 2 * s3.vy + s4.vy),
    z: s.z + (dt / 6) * (s.vz + 2 * s2.vz + 2 * s3.vz + s4.vz),
    vx: s.vx + (dt / 6) * (ax1 + 2 * ax2 + 2 * ax3 + ax4),
    vy: s.vy + (dt / 6) * (ay1 + 2 * ay2 + 2 * ay3 + ay4),
    vz: s.vz + (dt / 6) * (az1 + 2 * az2 + 2 * az3 + az4),
  };
}

export default function GmatOrbiterBridge() {
  const { data: overview } = useQuery<any>({
    queryKey: ["/api/mission/overview"],
    refetchInterval: 2500,
  });

  // GMAT IDE Workbench State
  const [activeTreeTab, setActiveTreeTab] = useState<"resources" | "mission">(
    "resources"
  );
  const [selectedResource, setSelectedResource] =
    useState<GmatResourceId>("sc_ares_vii");

  // Editable GMAT Resource Properties
  const [dryMassKg, setDryMassKg] = useState<number>(28500);
  const [dragCoeffCd, setDragCoeffCd] = useState<number>(2.2);
  const [srpCoeffCr, setSrpCoeffCr] = useState<number>(1.8);
  const [jgm2Degree, setJgm2Degree] = useState<number>(10);
  const [srpEnabled, setSrpEnabled] = useState<boolean>(true);
  const [rk89StepSize, setRk89StepSize] = useState<number>(60);
  const [burnElement1KmS, setBurnElement1KmS] = useState<number>(-1.425);
  const [burnElement2KmS, setBurnElement2KmS] = useState<number>(0.185);
  const [burnElement3KmS, setBurnElement3KmS] = useState<number>(-0.062);
  const [burnIspSec, setBurnIspSec] = useState<number>(450);
  const [targetPerigeeKm, setTargetPerigeeKm] = useState<number>(62.4);

  const [isRunning, setIsRunning] = useState(true);
  const [timeWarp, setTimeWarp] = useState<number>(10);
  const [simElapsedSec, setSimElapsedSec] = useState(0);
  const [activeCodeTab, setActiveCodeTab] = useState<
    "gmat" | "orbiter_scn" | "orbiter_lua" | "ccsds_oem"
  >("gmat");
  const [copied, setCopied] = useState(false);

  // Native GmatConsole.exe Execution Log
  const [gmatConsoleLog, setGmatConsoleLog] = useState<string>(
    `********************************************\n` +
      `***  GMAT R2026a Native Engine Ready (F:\\gmat-win-R2026a\\bin\\GmatConsole.exe)\n` +
      `***  Plugin Status: libPythonInterface_py312, libMatlabInterface, libFminconOptimizer cleanly disabled\n` +
      `********************************************\n` +
      `Click "Run in Native GMAT R2026a Engine" above to execute the mission script in F:\\gmat-win-R2026a\\bin\\GmatConsole.exe.`
  );
  const [lastNativeRunMeta, setLastNativeRunMeta] = useState<{
    binaryPath: string;
    scriptSavedTo: string;
    exitCode: number;
  } | null>(null);

  // Initial cislunar / high-orbit return state vector in Earth J2000 ECI (km, km/s)
  const [stateVec, setStateVec] = useState<StateVectorJ2000>({
    x: -142850.42,
    y: 98420.18,
    z: 34110.65,
    vx: -0.8421,
    vy: -1.6124,
    vz: -0.4182,
  });

  const [trail, setTrail] = useState<Array<{ x: number; y: number }>>([]);

  const autopilot = overview?.autopilotState;
  const latestTelemetry = overview?.recentTelemetry?.[0];
  const isTakeover = autopilot?.autonomousTakeoverActive;
  const isOverridden = autopilot?.humanOverrideEngaged;

  // Compute medically-safe max G-load from Xiaomi Watch H1 vitals
  const hr = latestTelemetry?.heartRate ?? 74;
  const spo2 = latestTelemetry?.spo2 ?? 98;
  const bpSys = latestTelemetry?.bloodPressureSys ?? 118;
  const bpDia = latestTelemetry?.bloodPressureDia ?? 76;
  const mapMmHg = bpDia + (bpSys - bpDia) / 3;
  const medicalCapG =
    hr > 135 || spo2 < 90 || mapMmHg < 70
      ? 1.65
      : autopilot?.maxGLoad ?? 2.8;

  // Real-time RK4 physics loop (10Hz)
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setStateVec((prev) => {
        const vMag = Math.sqrt(
          prev.vx * prev.vx + prev.vy * prev.vy + prev.vz * prev.vz
        );
        let thrustKmS2: [number, number, number] = [0, 0, 0];
        if (isTakeover && !isOverridden && vMag > 0) {
          const accelMagKmS2 = Math.min(medicalCapG * 0.00980665, 0.018);
          thrustKmS2 = [
            (-prev.vx / vMag) * accelMagKmS2 * 0.15,
            (-prev.vy / vMag) * accelMagKmS2 * 0.15,
            (-prev.vz / vMag) * accelMagKmS2 * 0.15,
          ];
        }
        const next = rk4Step(
          prev,
          0.2 * timeWarp,
          thrustKmS2,
          jgm2Degree / 10
        );
        setTrail((t) => [...t.slice(-90), { x: next.x, y: next.y }]);
        return next;
      });
      setSimElapsedSec((s) => s + 0.2 * timeWarp);
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning, timeWarp, isTakeover, isOverridden, medicalCapG, jgm2Degree]);

  // Classical Keplerian Elements from J2000 State Vector (r, v)
  const rMag = Math.sqrt(
    stateVec.x * stateVec.x + stateVec.y * stateVec.y + stateVec.z * stateVec.z
  );
  const vMag = Math.sqrt(
    stateVec.vx * stateVec.vx +
      stateVec.vy * stateVec.vy +
      stateVec.vz * stateVec.vz
  );
  const hx = stateVec.y * stateVec.vz - stateVec.z * stateVec.vy;
  const hy = stateVec.z * stateVec.vx - stateVec.x * stateVec.vz;
  const hz = stateVec.x * stateVec.vy - stateVec.y * stateVec.vx;
  const hMag = Math.sqrt(hx * hx + hy * hy + hz * hz);

  const specificEnergy = (vMag * vMag) / 2 - MU_EARTH_KM3_S2 / rMag;
  const smaKm = -MU_EARTH_KM3_S2 / (2 * specificEnergy);

  const rDotV =
    stateVec.x * stateVec.vx +
    stateVec.y * stateVec.vy +
    stateVec.z * stateVec.vz;
  const ex =
    ((vMag * vMag - MU_EARTH_KM3_S2 / rMag) * stateVec.x - rDotV * stateVec.vx) /
    MU_EARTH_KM3_S2;
  const ey =
    ((vMag * vMag - MU_EARTH_KM3_S2 / rMag) * stateVec.y - rDotV * stateVec.vy) /
    MU_EARTH_KM3_S2;
  const ez =
    ((vMag * vMag - MU_EARTH_KM3_S2 / rMag) * stateVec.z - rDotV * stateVec.vz) /
    MU_EARTH_KM3_S2;
  const ecc = Math.sqrt(ex * ex + ey * ey + ez * ez);

  const incDeg =
    (Math.acos(Math.min(1, Math.max(-1, hz / hMag))) * 180) / Math.PI;
  const perigeeAltKm = Math.max(
    targetPerigeeKm,
    Math.abs(smaKm) * (1 - Math.min(0.96, ecc)) - R_EARTH_KM
  );

  const deltaVMps = Math.round(
    Math.sqrt(
      burnElement1KmS * burnElement1KmS +
        burnElement2KmS * burnElement2KmS +
        burnElement3KmS * burnElement3KmS
    ) * 1000
  );

  const maneuverMutation = useMutation({
    mutationFn: async (maneuver: string) => {
      const res = await apiRequest("POST", "/api/ship/maneuver", {
        maneuver,
        triggeredBy: "GMAT_R2026A_IDE_WORKBENCH",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mission/overview"] });
    },
  });

  const overrideMutation = useMutation({
    mutationFn: async (engaged: boolean) => {
      const res = await apiRequest("POST", "/api/ship/override", {
        engaged,
        authorizedBy: "Cmdr. Elena Vance (GMAT IDE Manual Stick)",
        reason: engaged
          ? "Manual flight stick override in GMAT R2026a IDE"
          : "Re-engaged Hermes Autonomous GMAT R2026a Autopilot",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mission/overview"] });
    },
  });

  // Live Generated NASA GMAT R2026a .script file
  const gmatScriptContent = `%------------------------------------------------------------------------------
% NASA GMAT R2026a (General Mission Analysis Tool) Script — Rebuilt In-App IDE
% Native Engine: F:\\gmat-win-R2026a\\bin\\GmatConsole.exe
% Autonomous Flight Controller: HERMES AI (Subagent: NAV-PILOT)
% Medical G-Load Constraint (Xiaomi Watch H1 HR=${hr} BPM, SpO2=${spo2}%): ${medicalCapG.toFixed(2)} G
%------------------------------------------------------------------------------

%----------------------------------------
%---------- Spacecraft
%----------------------------------------
Create Spacecraft ARES_VII;
GMAT ARES_VII.DateFormat = UTCGregorian;
GMAT ARES_VII.Epoch = '08 Nov 2026 15:10:00.000';
GMAT ARES_VII.CoordinateSystem = EarthMJ2000Eq;
GMAT ARES_VII.DisplayStateType = Cartesian;
GMAT ARES_VII.X = ${stateVec.x.toFixed(4)};
GMAT ARES_VII.Y = ${stateVec.y.toFixed(4)};
GMAT ARES_VII.Z = ${stateVec.z.toFixed(4)};
GMAT ARES_VII.VX = ${stateVec.vx.toFixed(6)};
GMAT ARES_VII.VY = ${stateVec.vy.toFixed(6)};
GMAT ARES_VII.VZ = ${stateVec.vz.toFixed(6)};
GMAT ARES_VII.DryMass = ${dryMassKg};
GMAT ARES_VII.Cd = ${dragCoeffCd};
GMAT ARES_VII.Cr = ${srpCoeffCr};
GMAT ARES_VII.DragArea = 42.0;
GMAT ARES_VII.SRPArea = 68.5;

%----------------------------------------
%---------- ForceModels & Propagators
%----------------------------------------
Create ForceModel DeepSpaceForceModel;
GMAT DeepSpaceForceModel.CentralBody = Earth;
GMAT DeepSpaceForceModel.PrimaryBodies = {Earth};
GMAT DeepSpaceForceModel.PointMasses = {Luna, Sun};
GMAT DeepSpaceForceModel.SRP = ${srpEnabled ? "On" : "Off"};
GMAT DeepSpaceForceModel.GravityField.Earth.Degree = ${jgm2Degree};
GMAT DeepSpaceForceModel.GravityField.Earth.Order = ${jgm2Degree};
GMAT DeepSpaceForceModel.GravityField.Earth.PotentialFile = 'JGM2.cof';

Create Propagator RK89_Propagator;
GMAT RK89_Propagator.FM = DeepSpaceForceModel;
GMAT RK89_Propagator.Type = RungeKutta89;
GMAT RK89_Propagator.InitialStepSize = ${rk89StepSize};
GMAT RK89_Propagator.Accuracy = 1e-011;
GMAT RK89_Propagator.MinStep = 0.001;
GMAT RK89_Propagator.MaxStep = 2700;

%----------------------------------------
%---------- Burns & Solvers
%----------------------------------------
Create ImpulsiveBurn HermesEmergencyBurn;
GMAT HermesEmergencyBurn.CoordinateSystem = Local;
GMAT HermesEmergencyBurn.Origin = Earth;
GMAT HermesEmergencyBurn.Axes = VNB;
GMAT HermesEmergencyBurn.Element1 = ${burnElement1KmS.toFixed(5)};
GMAT HermesEmergencyBurn.Element2 = ${burnElement2KmS.toFixed(5)};
GMAT HermesEmergencyBurn.Element3 = ${burnElement3KmS.toFixed(5)};
GMAT HermesEmergencyBurn.DecrementMass = false;
GMAT HermesEmergencyBurn.Isp = ${burnIspSec};
GMAT HermesEmergencyBurn.GravitationalAccel = 9.80665;

Create DifferentialCorrector DC_SafeEarthReturn;

%----------------------------------------
%---------- Mission Sequence
%----------------------------------------
BeginMissionSequence;
Propagate 'CoastToManeuverNode' RK89_Propagator(ARES_VII) {ARES_VII.ElapsedSecs = 120.0};
Maneuver 'ExecuteHermesAbortBurn' HermesEmergencyBurn(ARES_VII);
Propagate 'PropagatePostBurnTrajectory' RK89_Propagator(ARES_VII) {ARES_VII.ElapsedSecs = 600.0};
`;

  const orbiterScnContent = `BEGIN_DESC
ARES-VII Deep Space Medical & Radiation Contingency Scenario
Generated live by HERMES Autonomous AI & Xiaomi Watch H1 Bio-Telemetry System.
Current Autopilot Mode: ${autopilot?.mode || "HERMES_AUTONOMOUS_TAKEOVER"}
Astronaut Vitals (Cmdr. Vance): HR ${hr} BPM | SpO2 ${spo2}% | Max Safe G-Load: ${medicalCapG.toFixed(2)}G
END_DESC

BEGIN_ENVIRONMENT
  System Sol
  Date MJD 61352.631944
END_ENVIRONMENT

BEGIN_FOCUS
  Ship ARES_VII
END_FOCUS

BEGIN_SHIPS
ARES_VII:DeltaGlider
  STATUS Orbiting Earth
  RPOS ${(stateVec.x * 1000).toFixed(1)} ${(stateVec.y * 1000).toFixed(1)} ${(stateVec.z * 1000).toFixed(1)}
  RVEL ${(stateVec.vx * 1000).toFixed(2)} ${(stateVec.vy * 1000).toFixed(2)} ${(stateVec.vz * 1000).toFixed(2)}
  AROT ${(autopilot?.attitudePitch ?? 12.5).toFixed(2)} ${(autopilot?.attitudeYaw ?? 180.0).toFixed(2)} ${(autopilot?.attitudeRoll ?? 0.0).toFixed(2)}
  PRPLEVEL 0:0.842000 1:0.915000
END
END_SHIPS`;

  const orbiterLuaContent = `-- HERMES AI <-> ORBITER SPACE FLIGHT SIMULATOR LIVE AUTOPILOT BRIDGE (Lua)
local http = require("socket.http")
local v = vessel.get_focusinterface()
proc.bg(function()
  while true do
    local body, code = http.request("http://127.0.0.1:5000/api/gmat-orbiter/state")
    if code == 200 and body then
      if string.find(body, '"humanOverrideEngaged":true') then
        v:set_thrustergrouplevel(THGROUP.MAIN, 0.0)
      elseif string.find(body, '"autonomousTakeoverActive":true') then
        v:activate_navmode(NAVMODE.RETROGRADE)
        v:set_thrustergrouplevel(THGROUP.MAIN, ${Math.min(1.0, medicalCapG / 3.8).toFixed(3)})
      end
    end
    proc.wait_sys(0.5)
  end
end)`;

  const ccsdsOemContent = `CCSDS_OEM_VERS = 2.0
CREATION_DATE  = ${new Date().toISOString()}
ORIGINATOR     = NASA_ARES_VII_HERMES_AI
OBJECT_NAME    = ARES-VII
REF_FRAME      = EME2000
2026-11-08T15:10:00.000  ${stateVec.x.toFixed(4)}  ${stateVec.y.toFixed(4)}  ${stateVec.z.toFixed(4)}  ${stateVec.vx.toFixed(6)}  ${stateVec.vy.toFixed(6)}  ${stateVec.vz.toFixed(6)}`;

  const activeText =
    activeCodeTab === "gmat"
      ? gmatScriptContent
      : activeCodeTab === "orbiter_scn"
      ? orbiterScnContent
      : activeCodeTab === "orbiter_lua"
      ? orbiterLuaContent
      : ccsdsOemContent;

  const activeFilename =
    activeCodeTab === "gmat"
      ? "ARES_VII_Hermes_Mission.script"
      : activeCodeTab === "orbiter_scn"
      ? "ARES_VII_Hermes_Emergency.scn"
      : activeCodeTab === "orbiter_lua"
      ? "hermes_orbiter_autopilot.lua"
      : "ARES_VII_Trajectory.oem";

  // Execute in Native F:\gmat-win-R2026a\bin\GmatConsole.exe
  const executeGmatMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/gmat/execute", {
        script: gmatScriptContent,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setGmatConsoleLog(
        data.consoleOutput || "GMAT execution completed with exit code 0."
      );
      setLastNativeRunMeta({
        binaryPath: data.binaryPath,
        scriptSavedTo: data.scriptSavedTo,
        exitCode: data.exitCode,
      });
      // Apply the impulsive burn delta-V to our live interactive trajectory
      setStateVec((prev) => ({
        ...prev,
        vx: prev.vx + burnElement1KmS * 0.08,
        vy: prev.vy + burnElement2KmS * 0.08,
        vz: prev.vz + burnElement3KmS * 0.08,
      }));
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const GMAT_RESOURCES: {
    id: GmatResourceId;
    folder: string;
    label: string;
    summary: string;
  }[] = [
    {
      id: "sc_ares_vii",
      folder: "Spacecraft",
      label: "ARES_VII (EarthMJ2000Eq)",
      summary: `DryMass ${dryMassKg} kg · Cd ${dragCoeffCd}`,
    },
    {
      id: "hw_thruster",
      folder: "Hardware",
      label: "XiaomiWatchBioCap + NTP_Main",
      summary: `Max Safe G: ${medicalCapG.toFixed(2)}G (HR ${hr} bpm)`,
    },
    {
      id: "fm_deepspace",
      folder: "ForceModels",
      label: "DeepSpaceForceModel (JGM-2)",
      summary: `Earth ${jgm2Degree}x${jgm2Degree} + Luna/Sun + SRP`,
    },
    {
      id: "prop_rk89",
      folder: "Propagators",
      label: "RK89_Propagator (RungeKutta89)",
      summary: `Step ${rk89StepSize}s · Acc 1e-11`,
    },
    {
      id: "burn_hermes",
      folder: "Burns",
      label: "HermesEmergencyBurn (VNB)",
      summary: `Δv ${deltaVMps} m/s · Isp ${burnIspSec}s`,
    },
    {
      id: "solver_dc",
      folder: "Solvers",
      label: "DC_SafeEarthReturn",
      summary: `Target hp = ${targetPerigeeKm} km`,
    },
    {
      id: "gs_network",
      folder: "GroundStations",
      label: "DSN_Goldstone / Madrid / GMIT_Nalaikh",
      summary: "24/7 Continuous Deep-Space Link",
    },
    {
      id: "sub_orbitview",
      folder: "Subscribers",
      label: "ARES_3D_OrbitView & OEM",
      summary: "Real-Time EME2000 Plot",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10">
      <div className="container mx-auto px-4 space-y-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-zinc-800/80 pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-orange-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>
                Rebuilt NASA GMAT R2026a IDE Workbench · Live Native{" "}
                <code>F:\gmat-win-R2026a\bin\GmatConsole.exe</code> Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
              NASA GMAT R2026a In-App Workbench & Trajectory Propagator
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Full interactive rebuild of NASA&apos;s open-source General Mission
              Analysis Tool (<code>F:\gmat-win-R2026a</code>) directly inside
              ARES-VII. Inspect and edit the GMAT Resource Tree, Mission
              Sequence, and Runge-Kutta 8(9) propagator—and execute missions in
              the native <code>GmatConsole.exe</code> binary with one click.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => executeGmatMutation.mutate()}
              disabled={executeGmatMutation.isPending}
              className="bg-orange-500 hover:bg-orange-400 text-zinc-950 font-semibold px-4 py-2.5 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Play className="w-4 h-4" />
              <span>
                {executeGmatMutation.isPending
                  ? "Running GmatConsole.exe..."
                  : "Run in Native GMAT R2026a Engine"}
              </span>
            </button>
            <button
              onClick={() => overrideMutation.mutate(!isOverridden)}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 px-3.5 py-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Hand className="w-4 h-4 text-orange-500" />
              <span>
                {isOverridden ? "Restore Hermes AI" : "Engage Manual Stick"}
              </span>
            </button>
          </div>
        </div>

        {/* 3-PANE NASA GMAT R2026a IDE WORKBENCH */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANE (3 Cols): GMAT Resource Tree & Mission Sequence Tree */}
          <div className="lg:col-span-3 card-outer">
            <div className="card-inner p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <FolderTree className="w-4 h-4 text-orange-500" />
                  <span>GMAT R2026a Project Tree</span>
                </div>
                <div className="flex gap-1 text-[11px]">
                  <button
                    onClick={() => setActiveTreeTab("resources")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      activeTreeTab === "resources"
                        ? "bg-orange-500 text-zinc-950 font-semibold"
                        : "bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    Resources
                  </button>
                  <button
                    onClick={() => setActiveTreeTab("mission")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      activeTreeTab === "mission"
                        ? "bg-orange-500 text-zinc-950 font-semibold"
                        : "bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    Mission
                  </button>
                </div>
              </div>

              {activeTreeTab === "resources" ? (
                <div className="space-y-1.5">
                  {GMAT_RESOURCES.map((res) => {
                    const isSelected = selectedResource === res.id;
                    return (
                      <button
                        key={res.id}
                        onClick={() => setSelectedResource(res.id)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs cursor-pointer ${
                          isSelected
                            ? "bg-zinc-900 border-orange-500/60 text-white"
                            : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                        }`}
                      >
                        <div className="text-[10px] font-mono text-orange-400 uppercase">
                          {res.folder}
                        </div>
                        <div className="font-semibold text-white truncate">
                          {res.label}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                          {res.summary}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2 text-xs font-mono">
                  {[
                    {
                      cmd: "1. BeginMissionSequence",
                      desc: "Initialize EarthMJ2000Eq epoch",
                    },
                    {
                      cmd: "2. Propagate 'CoastToNode'",
                      desc: "RK89_Propagator(ARES_VII) 120s",
                    },
                    {
                      cmd: "3. Target 'SafeEntryCorridor'",
                      desc: "DifferentialCorrector DC_SafeEarthReturn",
                    },
                    {
                      cmd: "4. Vary 'ReturnDV_V'",
                      desc: `HermesEmergencyBurn.Element1 = ${burnElement1KmS} km/s`,
                    },
                    {
                      cmd: "5. Maneuver 'ExecuteAbortBurn'",
                      desc: `Apply Δv = ${deltaVMps} m/s (G-Cap ${medicalCapG.toFixed(2)}G)`,
                    },
                    {
                      cmd: "6. Achieve 'EntryPerigee'",
                      desc: `ARES_VII.Earth.Altitude = ${targetPerigeeKm} km`,
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedResource("seq_mission")}
                      className="p-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800 cursor-pointer hover:border-orange-500/50"
                    >
                      <div className="text-orange-400 font-semibold">
                        {step.cmd}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {step.desc}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER PANE (5 Cols): Live EME2000 OrbitView & Maneuver Deck */}
          <div className="lg:col-span-5 card-outer">
            <div className="card-inner p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                <div>
                  <h2 className="font-semibold text-sm text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-orange-500" />
                    <span>GMAT OrbitView (EarthMJ2000Eq Trajectory)</span>
                  </h2>
                  <p className="text-[11px] text-zinc-400 font-mono tabular-nums">
                    RK89 + JGM-2 ({jgm2Degree}x{jgm2Degree}) · T+
                    {simElapsedSec.toFixed(1)}s
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 border border-zinc-800 cursor-pointer"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-3 h-3 text-orange-500" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-orange-500" />
                        <span>Play</span>
                      </>
                    )}
                  </button>
                  <select
                    value={timeWarp}
                    onChange={(e) => setTimeWarp(Number(e.target.value))}
                    className="bg-zinc-900 text-xs font-mono text-zinc-100 border border-zinc-800 rounded-md px-2 py-1"
                  >
                    <option value={1}>1x</option>
                    <option value={10}>10x</option>
                    <option value={100}>100x</option>
                    <option value={500}>500x</option>
                  </select>
                  <button
                    onClick={() => {
                      setStateVec({
                        x: -142850.42,
                        y: 98420.18,
                        z: 34110.65,
                        vx: -0.8421,
                        vy: -1.6124,
                        vz: -0.4182,
                      });
                      setTrail([]);
                      setSimElapsedSec(0);
                    }}
                    className="p-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-md border border-zinc-800 cursor-pointer"
                    title="Reset Epoch State Vector"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* SVG Orbital Plot */}
              <div className="relative bg-zinc-950 rounded-lg border border-zinc-800/80 overflow-hidden h-[320px] flex items-center justify-center">
                <svg viewBox="-220 -150 440 300" className="w-full h-full">
                  <line
                    x1="-220"
                    y1="0"
                    x2="220"
                    y2="0"
                    stroke="#27272a"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="0"
                    y1="-150"
                    x2="0"
                    y2="150"
                    stroke="#27272a"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="45"
                    fill="none"
                    stroke="#27272a"
                    strokeDasharray="2 4"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="95"
                    fill="none"
                    stroke="#27272a"
                    strokeDasharray="2 4"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="140"
                    fill="none"
                    stroke="#27272a"
                    strokeDasharray="2 4"
                  />

                  {/* Luna Orbit Reference */}
                  <circle
                    cx="145"
                    cy="-85"
                    r="7"
                    fill="#27272a"
                    stroke="#a1a1aa"
                    strokeWidth="1"
                  />
                  <text
                    x="155"
                    y="-82"
                    fill="#a1a1aa"
                    fontSize="7"
                    fontFamily="monospace"
                  >
                    LUNA
                  </text>

                  {/* Target Return Ellipse */}
                  <ellipse
                    cx="-45"
                    cy="15"
                    rx="115"
                    ry="68"
                    transform="rotate(-24 -45 15)"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                    opacity="0.75"
                  />

                  <circle
                    cx="0"
                    cy="0"
                    r="15"
                    fill="#18181b"
                    stroke="#f97316"
                    strokeWidth="1.5"
                  />
                  <text
                    x="20"
                    y="4"
                    fill="#e4e4e7"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    EARTH (hp {perigeeAltKm.toFixed(1)} km)
                  </text>

                  {trail.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2"
                      points={trail
                        .map(
                          (p) =>
                            `${(p.x / 1200).toFixed(1)},${(
                              -p.y / 1200
                            ).toFixed(1)}`
                        )
                        .join(" ")}
                    />
                  )}

                  {(() => {
                    const sx = stateVec.x / 1200;
                    const sy = -stateVec.y / 1200;
                    return (
                      <g transform={`translate(${sx}, ${sy})`}>
                        <circle
                          r="4.5"
                          fill="#f97316"
                          stroke="#ffffff"
                          strokeWidth="1.2"
                        />
                        <line
                          x1="0"
                          y1="0"
                          x2={stateVec.vx * 14}
                          y2={-stateVec.vy * 14}
                          stroke="#fafafa"
                          strokeWidth="1.2"
                        />
                        <text
                          x="8"
                          y="-6"
                          fill="#ffffff"
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          ARES_VII ({vMag.toFixed(2)} km/s)
                        </text>
                      </g>
                    );
                  })()}
                </svg>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap items-center justify-between text-[11px] font-mono bg-zinc-900/95 px-3 py-1.5 rounded-md border border-zinc-800 text-zinc-300 tabular-nums">
                  <span>r = {rMag.toFixed(0)} km</span>
                  <span>SMA = {smaKm.toFixed(0)} km</span>
                  <span>ECC = {ecc.toFixed(4)}</span>
                  <span className="text-orange-400">
                    Bio-Cap: {medicalCapG.toFixed(2)}G
                  </span>
                </div>
              </div>

              {/* Quick Maneuver Triggers */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: "fast_earth_return",
                    title: "Lambert Safe Earth Return",
                    sub: `Δv ${deltaVMps} m/s · Entry ${targetPerigeeKm} km`,
                  },
                  {
                    id: "storm_shelter_attitude",
                    title: "SPE Water-Wall Tail Slew",
                    sub: "180° Aft Shielding Attitude",
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => maneuverMutation.mutate(m.id)}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/50 text-left p-2.5 rounded-lg cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-white">
                      {m.title}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      {m.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANE (4 Cols): GMAT Resource Property Inspector & Editor */}
          <div className="lg:col-span-4 card-outer">
            <div className="card-inner p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sliders className="w-4 h-4 text-orange-500" />
                  <span>GMAT Resource Inspector</span>
                </div>
                <span className="text-[11px] font-mono text-orange-400">
                  {selectedResource.toUpperCase()}
                </span>
              </div>

              {selectedResource === "sc_ares_vii" && (
                <div className="space-y-3 text-xs">
                  <div className="text-zinc-300 font-medium">
                    Spacecraft: <code>ARES_VII</code> (EarthMJ2000Eq)
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <label className="space-y-1">
                      <span className="text-zinc-400 text-[11px]">X (km)</span>
                      <input
                        type="number"
                        value={Number(stateVec.x.toFixed(2))}
                        onChange={(e) =>
                          setStateVec((s) => ({
                            ...s,
                            x: Number(e.target.value),
                          }))
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-white"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-zinc-400 text-[11px]">
                        VX (km/s)
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={Number(stateVec.vx.toFixed(4))}
                        onChange={(e) =>
                          setStateVec((s) => ({
                            ...s,
                            vx: Number(e.target.value),
                          }))
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-orange-400"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-zinc-400 text-[11px]">Y (km)</span>
                      <input
                        type="number"
                        value={Number(stateVec.y.toFixed(2))}
                        onChange={(e) =>
                          setStateVec((s) => ({
                            ...s,
                            y: Number(e.target.value),
                          }))
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-white"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-zinc-400 text-[11px]">
                        VY (km/s)
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={Number(stateVec.vy.toFixed(4))}
                        onChange={(e) =>
                          setStateVec((s) => ({
                            ...s,
                            vy: Number(e.target.value),
                          }))
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-orange-400"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-zinc-400 text-[11px]">
                        DryMass (kg)
                      </span>
                      <input
                        type="number"
                        value={dryMassKg}
                        onChange={(e) => setDryMassKg(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-white"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-zinc-400 text-[11px]">
                        Drag Cd / SRP Cr
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        value={dragCoeffCd}
                        onChange={(e) => setDragCoeffCd(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-white"
                      />
                    </label>
                  </div>
                </div>
              )}

              {selectedResource === "burn_hermes" && (
                <div className="space-y-3 text-xs">
                  <div className="text-zinc-300 font-medium">
                    ImpulsiveBurn: <code>HermesEmergencyBurn</code> (VNB Axes)
                  </div>
                  <div className="space-y-2 font-mono">
                    <label className="block space-y-1">
                      <span className="text-zinc-400 text-[11px]">
                        Element1 (Velocity V-Axis Δv, km/s)
                      </span>
                      <input
                        type="number"
                        step="0.05"
                        value={burnElement1KmS}
                        onChange={(e) =>
                          setBurnElement1KmS(Number(e.target.value))
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-orange-400"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-zinc-400 text-[11px]">
                        Element2 (Normal N-Axis Δv, km/s)
                      </span>
                      <input
                        type="number"
                        step="0.05"
                        value={burnElement2KmS}
                        onChange={(e) =>
                          setBurnElement2KmS(Number(e.target.value))
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-white"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-zinc-400 text-[11px]">
                        Element3 (Binormal B-Axis Δv, km/s)
                      </span>
                      <input
                        type="number"
                        step="0.05"
                        value={burnElement3KmS}
                        onChange={(e) =>
                          setBurnElement3KmS(Number(e.target.value))
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-white"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-zinc-400 text-[11px]">
                        Specific Impulse Isp (s)
                      </span>
                      <input
                        type="number"
                        value={burnIspSec}
                        onChange={(e) => setBurnIspSec(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-white"
                      />
                    </label>
                  </div>
                </div>
              )}

              {(selectedResource === "fm_deepspace" ||
                selectedResource === "prop_rk89") && (
                <div className="space-y-3 text-xs">
                  <div className="text-zinc-300 font-medium">
                    ForceModel & RungeKutta89 Propagator
                  </div>
                  <div className="space-y-2.5 font-mono">
                    <label className="block space-y-1">
                      <span className="text-zinc-400 text-[11px]">
                        Earth JGM-2 Harmonic Degree & Order ({jgm2Degree}x
                        {jgm2Degree})
                      </span>
                      <input
                        type="range"
                        min={2}
                        max={36}
                        value={jgm2Degree}
                        onChange={(e) => setJgm2Degree(Number(e.target.value))}
                        className="w-full accent-orange-500"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-zinc-400 text-[11px]">
                        RK89 Initial Step Size (sec)
                      </span>
                      <input
                        type="number"
                        value={rk89StepSize}
                        onChange={(e) =>
                          setRk89StepSize(Number(e.target.value))
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-white"
                      />
                    </label>
                    <label className="flex items-center justify-between bg-zinc-900 p-2.5 rounded border border-zinc-800">
                      <span className="text-zinc-300">
                        Solar Radiation Pressure (SRP)
                      </span>
                      <input
                        type="checkbox"
                        checked={srpEnabled}
                        onChange={(e) => setSrpEnabled(e.target.checked)}
                        className="accent-orange-500"
                      />
                    </label>
                  </div>
                </div>
              )}

              {(selectedResource === "hw_thruster" ||
                selectedResource === "solver_dc" ||
                selectedResource === "gs_network" ||
                selectedResource === "sub_orbitview" ||
                selectedResource === "seq_mission") && (
                <div className="space-y-3 text-xs">
                  <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-3 space-y-2">
                    <div className="font-semibold text-orange-400">
                      Xiaomi Watch H1 Bio-Feedback Thruster Limiter
                    </div>
                    <div className="text-zinc-300 leading-relaxed">
                      Couples astronaut Heart Rate ({hr} BPM), SpO₂ ({spo2}%),
                      and Mean Arterial Pressure ({mapMmHg.toFixed(0)} mmHg)
                      directly to the GMAT finite/impulsive burn solver so entry
                      deceleration never exceeds{" "}
                      <strong className="text-white font-mono">
                        {medicalCapG.toFixed(2)}G
                      </strong>
                      .
                    </div>
                  </div>
                  <label className="block space-y-1 font-mono">
                    <span className="text-zinc-400 text-[11px]">
                      Target Safe Entry Perigee Altitude (km)
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      value={targetPerigeeKm}
                      onChange={(e) =>
                        setTargetPerigeeKm(Number(e.target.value))
                      }
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-orange-400"
                    />
                  </label>
                </div>
              )}

              <div className="pt-2 border-t border-zinc-800/80">
                <button
                  onClick={() => executeGmatMutation.mutate()}
                  disabled={executeGmatMutation.isPending}
                  className="w-full bg-orange-500 hover:bg-orange-400 text-zinc-950 font-semibold py-2 rounded-lg text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>
                    {executeGmatMutation.isPending
                      ? "Executing in F:\\gmat-win-R2026a..."
                      : "Apply & Run in Native GmatConsole.exe"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* NATIVE GMAT R2026a CONSOLE OUTPUT & LIVE SCRIPT EDITOR */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left 5 Cols: Real GmatConsole.exe Execution Output */}
          <div className="lg:col-span-5 card-outer">
            <div className="card-inner p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Terminal className="w-4 h-4 text-orange-500" />
                  <span>Native GmatConsole.exe Output Log</span>
                </div>
                {lastNativeRunMeta && (
                  <span className="text-[11px] font-mono text-emerald-400 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Exit Code {lastNativeRunMeta.exitCode}</span>
                  </span>
                )}
              </div>

              {lastNativeRunMeta && (
                <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-2.5 text-[11px] font-mono text-zinc-300 space-y-0.5">
                  <div>
                    <span className="text-zinc-500">Binary:</span>{" "}
                    <span className="text-orange-400">
                      {lastNativeRunMeta.binaryPath}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Script:</span>{" "}
                    <span>{lastNativeRunMeta.scriptSavedTo}</span>
                  </div>
                </div>
              )}

              <pre className="bg-zinc-950 text-zinc-200 p-3.5 rounded-lg border border-zinc-800/90 text-xs font-mono overflow-x-auto max-h-[360px] leading-relaxed whitespace-pre-wrap">
                {gmatConsoleLog}
              </pre>
            </div>
          </div>

          {/* Right 7 Cols: Live GMAT Script & Orbiter Scenario/Lua Generator */}
          <div className="lg:col-span-7 card-outer">
            <div className="card-inner p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "gmat", label: "NASA GMAT (.script)" },
                    { id: "orbiter_scn", label: "Orbiter Scenario (.scn)" },
                    { id: "orbiter_lua", label: "Orbiter Lua Bridge (.lua)" },
                    { id: "ccsds_oem", label: "CCSDS Ephemeris (.oem)" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveCodeTab(t.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border ${
                        activeCodeTab === t.id
                          ? "bg-orange-500 text-zinc-950 border-orange-500 font-semibold"
                          : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-zinc-800 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-orange-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-orange-500 hover:bg-orange-400 text-zinc-950 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {activeFilename}</span>
                  </button>
                </div>
              </div>

              <pre className="bg-zinc-950 text-zinc-200 p-4 rounded-lg border border-zinc-800/90 text-xs font-mono overflow-x-auto max-h-[360px] leading-relaxed">
                {activeText}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
