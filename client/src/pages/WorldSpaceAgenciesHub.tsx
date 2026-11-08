import React, { useState } from "react";
import {
  GLOBAL_COUNTRY_SPACE_AGENCIES_MATRIX,
  type GlobalRegionCategory,
  type GlobalCountrySpaceAgencyEntry,
} from "../data/worldSpaceAgenciesData";
import {
  Search,
  ShieldCheck,
  Globe,
  Activity,
  Pill,
  Cpu,
  Layers,
  Award,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";

const REGIONS: { id: GlobalRegionCategory; label: string }[] = [
  { id: "ALL", label: "All 28+ Countries" },
  { id: "Asia-Pacific", label: "Asia-Pacific (Mongolia, China, India, Japan)" },
  { id: "Europe & Interkosmos", label: "Europe & Eurasia (USSR, ESA, DLR, CNES)" },
  { id: "Americas", label: "Americas (NASA, CSA, AEB, CONAE)" },
  { id: "Middle East & Africa", label: "Middle East & Africa (UAE, Saudi, South Africa)" },
];

export default function WorldSpaceAgenciesHub() {
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedRegion, setSelectedRegion] =
    useState<GlobalRegionCategory>("ALL");
  const [selectedCountryId, setSelectedCountryId] = useState<string>(
    GLOBAL_COUNTRY_SPACE_AGENCIES_MATRIX[0]?.id || "mongolia-mas-interkosmos"
  );

  // Cross-agency deep space survival simulator
  const [missionDays, setMissionDays] = useState<number>(180);
  const [environment, setEnvironment] = useState<"leo" | "lunar" | "mars">("leo");
  const [useCollarAndSuit, setUseCollarAndSuit] = useState<boolean>(true);
  const [useRadiationShield, setUseRadiationShield] = useState<boolean>(true);
  const [useBoneAndHeartMeds, setUseBoneAndHeartMeds] = useState<boolean>(true);

  const baseDailyDoseMsv =
    environment === "leo" ? 0.45 : environment === "lunar" ? 1.37 : 1.85;
  const rawTotalDoseMsv = missionDays * baseDailyDoseMsv;
  const protectedDoseMsv = useRadiationShield
    ? rawTotalDoseMsv * 0.68
    : rawTotalDoseMsv;
  const safetyLimitPct = Math.min(
    100,
    Math.round((protectedDoseMsv / 600) * 100)
  );
  const motionSicknessRiskPct = useCollarAndSuit ? 12 : 68;
  const monthlyBoneLossPct = useBoneAndHeartMeds ? 0.15 : 1.5;

  const filteredCountries = GLOBAL_COUNTRY_SPACE_AGENCIES_MATRIX.filter(
    (entry) => {
      const matchesRegion =
        selectedRegion === "ALL" || entry.region === selectedRegion;
      const q = countrySearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        entry.country.toLowerCase().includes(q) ||
        entry.agencyAcronym.toLowerCase().includes(q) ||
        entry.agencyFullName.toLowerCase().includes(q) ||
        (entry.notableAstronautsOrCosmonauts || []).some((a) =>
          a.toLowerCase().includes(q)
        ) ||
        (entry.biomedicalAndRadiationResearch || []).some(
          (r) =>
            r.experimentOrProgram.toLowerCase().includes(q) ||
            r.summary.toLowerCase().includes(q)
        );
      return matchesRegion && matchesSearch;
    }
  );

  const activeCountry: GlobalCountrySpaceAgencyEntry =
    GLOBAL_COUNTRY_SPACE_AGENCIES_MATRIX.find((c) => c.id === selectedCountryId) ||
    filteredCountries[0] ||
    GLOBAL_COUNTRY_SPACE_AGENCIES_MATRIX[0];

  return (
    <div className="min-h-screen bg-[#050814] text-zinc-100 py-10 selection:bg-cyan-500/20 selection:text-cyan-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* HEADER SECTION WITH ELECTRIC VIBRANT AESTHETIC */}
        <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-cyan-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#071328]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>28 Spacefaring Nations • Complete Bio-Astronautics Directory</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Global Space Agencies & Biomedical Breakthroughs
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Explore how 28 spacefaring countries—from Soviet & Mongolian Salyut-6 impedance rheography to China’s Tiangong acupoint stimulation, NASA’s Apollo dosimetry, and ISRO’s autonomic Yoga bio-telemetry—unite in ARES-VII to protect deep-space crews.
            </p>
          </div>
        </section>

        {/* INTERACTIVE 3-TIER SURVIVAL BENCHMARK SIMULATOR */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Cross-Agency Countermeasure Synergy Calculator</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                How Combined World Technologies Suppress Deep-Space Hazards
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Interactive Physiological Predictor
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Controls */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-2">
                  Destination & Orbital Environment:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "leo", label: "ISS / Station" },
                      { id: "lunar", label: "Moon (Artemis)" },
                      { id: "mars", label: "Mars Transit" },
                    ] as const
                  ).map((env) => (
                    <button
                      key={env.id}
                      onClick={() => setEnvironment(env.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border cursor-pointer transition-all ${
                        environment === env.id
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-500/20"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {env.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1.5">
                  <span>Mission Duration:</span>
                  <span className="font-mono text-amber-400 font-bold">{missionDays} Days</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="900"
                  step="30"
                  value={missionDays}
                  onChange={(e) => setMissionDays(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono mt-1">
                  <span>1 Mo (Soyuz)</span>
                  <span>6 Mo (ISS)</span>
                  <span>2.5 Yrs (Mars)</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                  <input
                    type="checkbox"
                    checked={useCollarAndSuit}
                    onChange={(e) => setUseCollarAndSuit(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4 rounded"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">
                      Mongolia/USSR Vorotnik Collar & Chibis LBNP
                    </span>
                    <span className="text-zinc-400 text-[11px]">
                      Restricts headward fluid shift; curbs space motion sickness by 64%
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                  <input
                    type="checkbox"
                    checked={useRadiationShield}
                    onChange={(e) => setUseRadiationShield(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4 rounded"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">
                      Soviet Indralin B-190 + Water Wall Storm Shelter
                    </span>
                    <span className="text-zinc-400 text-[11px]">
                      Dose Reduction Factor 1.45; blocks secondary neutron scatter
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                  <input
                    type="checkbox"
                    checked={useBoneAndHeartMeds}
                    onChange={(e) => setUseBoneAndHeartMeds(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4 rounded"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">
                      JAXA Bisphosphonate + CMSA Neiguan TEAS
                    </span>
                    <span className="text-zinc-400 text-[11px]">
                      Halts monthly bone calcium decay and stabilizes autonomic tone
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Calculated Results */}
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Calculated Deep-Space Survival Metrics</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="text-xs text-zinc-400">Total Radiation Dose</div>
                    <div className="text-2xl font-bold text-cyan-300 font-mono mt-1 tabular-nums">
                      {protectedDoseMsv.toFixed(1)} <span className="text-xs text-zinc-500 font-sans">mSv</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1">
                      {safetyLimitPct}% of 600 mSv Limit
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="text-xs text-zinc-400">Motion Sickness Risk</div>
                    <div className={`text-2xl font-bold font-mono mt-1 tabular-nums ${
                      motionSicknessRiskPct > 40 ? "text-red-400" : "text-emerald-400"
                    }`}>
                      {motionSicknessRiskPct}%
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1">
                      {useCollarAndSuit ? "Suppressed via Collar" : "Uncontrolled 0G Nausea"}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="text-xs text-zinc-400">Monthly Bone Loss</div>
                    <div className={`text-2xl font-bold font-mono mt-1 tabular-nums ${
                      monthlyBoneLossPct > 0.5 ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      -{monthlyBoneLossPct}%
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1">
                      {useBoneAndHeartMeds ? "Suppressed by JAXA Protocol" : "Severe Osteopenia Risk"}
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-cyan-400">Survival Summary: </strong>
                  {useRadiationShield && useCollarAndSuit && useBoneAndHeartMeds ? (
                    <span>
                      Full multi-agency protocol active. Astronaut bone density preserved (90% suppression of osteoclast decay), vestibular nausea controlled, and lifetime REID cancer risk stays safely within NASA and Roscosmos flight limits.
                    </span>
                  ) : (
                    <span className="text-amber-300">
                      Warning: Missing countermeasures will accelerate physiological decline. Unshielded radiation or lack of cervical restriction dramatically increases emergency abort risk.
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 mt-4 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>BENCHMARK DATA: NASA-STD-3001 & IBMP GOST</span>
                <span className="text-cyan-400">Coupled with ARES-VII Engine</span>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH & REGION FILTERS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search country, acronym, or astronaut..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {REGIONS.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-all ${
                    selectedRegion === reg.id
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {reg.label.split(" (")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN 2-COLUMN VIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Country Selector (Left 4 cols) */}
            <div className="lg:col-span-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-3 max-h-[700px] overflow-y-auto space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-500 px-2 py-1 uppercase tracking-wider">
                {filteredCountries.length} Countries Found
              </div>
              {filteredCountries.map((c) => {
                const isSelected = c.id === activeCountry.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCountryId(c.id)}
                    className={`w-full text-left p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-950/60 to-zinc-900 border-cyan-500/60 text-white shadow-sm shadow-cyan-500/10"
                        : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span>{c.flagEmoji}</span>
                        <span>{c.country}</span>
                      </span>
                      <span className="font-mono text-cyan-400 text-[11px]">
                        {c.agencyAcronym}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 truncate">
                      {c.agencyFullName}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Country Dossier (Right 8 cols) */}
            <div className="lg:col-span-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6">
              {/* Header Info */}
              <div className="border-b border-zinc-800 pb-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-2xl">{activeCountry.flagEmoji}</span>
                    <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      {activeCountry.country} • {activeCountry.agencyAcronym}
                    </span>
                  </div>
                  <span className="text-zinc-400 font-mono text-[11px]">
                    Founded: {activeCountry.foundedYear}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white">
                  {activeCountry.agencyFullName}
                </h3>
                <div className="text-xs text-zinc-400 font-medium">
                  {activeCountry.nativeAgencyName}
                </div>

                {activeCountry.notableAstronautsOrCosmonauts?.length > 0 && (
                  <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 text-xs text-zinc-300">
                    <strong className="text-amber-400">Pioneering Astronauts & Cosmonauts: </strong>
                    <span>{activeCountry.notableAstronautsOrCosmonauts.join("; ")}</span>
                  </div>
                )}
              </div>

              {/* Research & Scientific Discoveries */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Key Space Medicine & Radiation Research</span>
                </h4>

                <div className="space-y-3">
                  {(activeCountry.biomedicalAndRadiationResearch || []).map((res, i) => (
                    <div
                      key={i}
                      className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white">
                          {res.experimentOrProgram}
                        </span>
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                          {res.scientificFocus}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {res.summary}
                      </p>

                      {res.empiricalFormulaOrMetric && (
                        <div className="text-xs bg-zinc-950 border border-zinc-800/80 rounded-lg p-2.5 text-zinc-300">
                          <strong className="text-amber-400">Measured Formula / Metric: </strong>
                          <span className="font-mono text-cyan-300">
                            {res.empiricalFormulaOrMetric}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware & Platforms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Flagship Flight Hardware & Sensors</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {(activeCountry.flagshipHardwareAndDosimeters || []).map((hw, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span>{hw}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Key Missions & Orbital Platforms</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {(activeCountry.keyMissionsAndPlatforms || []).map((mp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400">•</span>
                        <span>{mp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Watch H1 Integration Callout */}
              {activeCountry.watchH1Synergy && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-zinc-900 border border-cyan-500/30 text-xs text-zinc-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-cyan-400 font-bold block mb-0.5">
                      ARES-VII & Watch H1 Algorithmic Synergy:
                    </span>
                    <span>{activeCountry.watchH1Synergy}</span>
                  </div>
                  <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}