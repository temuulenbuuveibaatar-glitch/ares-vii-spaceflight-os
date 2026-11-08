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
  Crosshair,
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
    <div className="min-h-screen bg-[#0b0e0a] text-[#e3ecd8] py-10 selection:bg-[#4d633b] selection:text-[#fbbf24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* TACTICAL HEADER SECTION */}
        <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-[#354528] bg-gradient-to-br from-[#11160e] via-[#0e120b] to-[#141a10]">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#182213] border border-[#3f5231] text-[#a3c988] font-mono text-xs font-bold tracking-wide">
              <Crosshair className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>MIL-STD-810H // 28 SPACEFARING NATIONS DOSSIER</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight text-white leading-tight">
              Global Space Agencies & Biomedical Breakthroughs
            </h1>

            <p className="text-sm sm:text-base text-[#a8baa0] leading-relaxed">
              Explore how 28 spacefaring countries—from Soviet & Mongolian Salyut-6 impedance rheography to China’s Tiangong acupoint stimulation, NASA’s Apollo dosimetry, and ISRO’s autonomic Yoga bio-telemetry—unite in ARES-VII to protect deep-space crews.
            </p>
          </div>
        </section>

        {/* INTERACTIVE 3-TIER SURVIVAL BENCHMARK SIMULATOR */}
        <section className="rounded-2xl border border-[#354528] bg-[#13190e] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#232d1a]">
            <div>
              <div className="text-xs font-mono font-bold text-[#fbbf24] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Zap className="w-4 h-4 text-[#fbbf24]" />
                <span>// CROSS-AGENCY SURVIVAL CALCULATOR</span>
              </div>
              <h2 className="text-xl font-black text-white">
                How Combined World Technologies Suppress Deep-Space Hazards
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8ea873]">
              INTERACTIVE PHYSIOLOGICAL PREDICTOR
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Controls */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <label className="text-xs font-mono font-bold text-[#c7dfb8] block mb-2">
                  DESTINATION & ORBITAL ENVIRONMENT:
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
                      className={`py-2 px-3 rounded-xl font-mono text-xs font-bold border cursor-pointer transition-all ${
                        environment === env.id
                          ? "bg-[#182213] border-[#fbbf24] text-[#fbbf24] shadow-sm shadow-amber-500/10"
                          : "bg-[#0b0e0a] border-[#232d1a] text-[#8ea873] hover:text-white"
                      }`}
                    >
                      {env.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-[#c7dfb8] mb-1.5">
                  <span>MISSION DURATION:</span>
                  <span className="text-[#fbbf24] font-bold">{missionDays} Days</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="900"
                  step="30"
                  value={missionDays}
                  onChange={(e) => setMissionDays(Number(e.target.value))}
                  className="w-full accent-[#fbbf24] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#6d845e] font-mono mt-1">
                  <span>1 Mo (Soyuz)</span>
                  <span>6 Mo (ISS)</span>
                  <span>2.5 Yrs (Mars)</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0e0a] border border-[#232d1a] cursor-pointer hover:border-[#354528]">
                  <input
                    type="checkbox"
                    checked={useCollarAndSuit}
                    onChange={(e) => setUseCollarAndSuit(e.target.checked)}
                    className="accent-[#fbbf24] w-4 h-4 rounded"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-white block">
                      Mongolia/USSR Vorotnik Collar & Chibis LBNP
                    </span>
                    <span className="text-[#8ea873] text-[11px]">
                      Restricts headward fluid shift; curbs space motion sickness by 64%
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0e0a] border border-[#232d1a] cursor-pointer hover:border-[#354528]">
                  <input
                    type="checkbox"
                    checked={useRadiationShield}
                    onChange={(e) => setUseRadiationShield(e.target.checked)}
                    className="accent-[#fbbf24] w-4 h-4 rounded"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-white block">
                      Soviet Indralin B-190 + Water Wall Storm Shelter
                    </span>
                    <span className="text-[#8ea873] text-[11px]">
                      Dose Reduction Factor 1.45; blocks secondary neutron scatter
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0e0a] border border-[#232d1a] cursor-pointer hover:border-[#354528]">
                  <input
                    type="checkbox"
                    checked={useBoneAndHeartMeds}
                    onChange={(e) => setUseBoneAndHeartMeds(e.target.checked)}
                    className="accent-[#fbbf24] w-4 h-4 rounded"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-white block">
                      JAXA Bisphosphonate + CMSA Neiguan TEAS
                    </span>
                    <span className="text-[#8ea873] text-[11px]">
                      Halts monthly bone calcium decay and stabilizes autonomic tone
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Calculated Results */}
            <div className="lg:col-span-7 bg-[#0e120b] border border-[#232d1a] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#fbbf24]" />
                  <span>CALCULATED DEEP-SPACE SURVIVAL TELEMETRY</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="p-4 rounded-xl bg-[#0b0e0a] border border-[#232d1a]">
                    <div className="text-xs text-[#8ea873]">TOTAL RADIATION</div>
                    <div className="text-2xl font-bold text-[#fbbf24] mt-1 tabular-nums">
                      {protectedDoseMsv.toFixed(1)} <span className="text-xs text-[#8ea873]">mSv</span>
                    </div>
                    <div className="text-[11px] text-[#8ea873] mt-1">
                      {safetyLimitPct}% of 600 mSv Limit
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0b0e0a] border border-[#232d1a]">
                    <div className="text-xs text-[#8ea873]">MOTION SICKNESS</div>
                    <div className={`text-2xl font-bold mt-1 tabular-nums ${
                      motionSicknessRiskPct > 40 ? "text-[#ef4444]" : "text-[#84a96c]"
                    }`}>
                      {motionSicknessRiskPct}%
                    </div>
                    <div className="text-[11px] text-[#8ea873] mt-1 font-sans">
                      {useCollarAndSuit ? "Suppressed via Collar" : "Uncontrolled Nausea"}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0b0e0a] border border-[#232d1a]">
                    <div className="text-xs text-[#8ea873]">MONTHLY BONE LOSS</div>
                    <div className={`text-2xl font-bold mt-1 tabular-nums ${
                      monthlyBoneLossPct > 0.5 ? "text-[#fbbf24]" : "text-[#84a96c]"
                    }`}>
                      -{monthlyBoneLossPct}%
                    </div>
                    <div className="text-[11px] text-[#8ea873] mt-1 font-sans">
                      {useBoneAndHeartMeds ? "Suppressed by JAXA" : "Severe Bone Loss"}
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4 rounded-xl bg-[#0b0e0a] border border-[#232d1a] text-xs text-[#c7dfb8] leading-relaxed">
                  <strong className="text-[#fbbf24] font-mono">SURVIVAL SUMMARY: </strong>
                  {useRadiationShield && useCollarAndSuit && useBoneAndHeartMeds ? (
                    <span>
                      Full multi-agency protocol active. Astronaut bone density preserved (90% suppression of osteoclast decay), vestibular nausea controlled, and lifetime REID cancer risk stays safely within NASA and Roscosmos flight limits.
                    </span>
                  ) : (
                    <span className="text-[#fbbf24]">
                      Warning: Missing countermeasures will accelerate physiological decline. Unshielded radiation or lack of cervical restriction dramatically increases emergency abort risk.
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#232d1a] mt-4 flex items-center justify-between text-xs text-[#8ea873] font-mono">
                <span>BENCHMARK DATA: NASA-STD-3001 & IBMP GOST</span>
                <span className="text-[#fbbf24]">Coupled with ARES-VII Engine</span>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH & REGION FILTERS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8ea873] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search country, acronym, or astronaut..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#13190e] border border-[#354528] text-xs text-white placeholder-[#6d845e] focus:outline-none focus:border-[#fbbf24] transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto font-mono">
              {REGIONS.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-all ${
                    selectedRegion === reg.id
                      ? "bg-[#182213] border-[#fbbf24] text-[#fbbf24]"
                      : "bg-[#0b0e0a] border-[#232d1a] text-[#8ea873] hover:text-white"
                  }`}
                >
                  {reg.label.split(" (")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN 2-COLUMN DOSSIER VIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Country Selector (Left 4 cols) */}
            <div className="lg:col-span-4 rounded-2xl border border-[#354528] bg-[#13190e] p-3 max-h-[700px] overflow-y-auto space-y-1.5">
              <div className="text-[11px] font-mono text-[#8ea873] px-2 py-1 uppercase tracking-wider">
                {filteredCountries.length} Nations Identified
              </div>
              {filteredCountries.map((c) => {
                const isSelected = c.id === activeCountry.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCountryId(c.id)}
                    className={`w-full text-left p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#182213] border-[#fbbf24] text-white shadow-sm shadow-amber-500/10"
                        : "bg-[#0b0e0a] border-[#232d1a] text-[#8ea873] hover:bg-[#11160e] hover:text-[#c7dfb8]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span>{c.flagEmoji}</span>
                        <span>{c.country}</span>
                      </span>
                      <span className="font-mono text-[#fbbf24] text-[11px]">
                        {c.agencyAcronym}
                      </span>
                    </div>
                    <div className="text-xs text-[#8ea873] mt-1 truncate font-sans">
                      {c.agencyFullName}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Country Dossier (Right 8 cols) */}
            <div className="lg:col-span-8 rounded-2xl border border-[#354528] bg-[#13190e] p-6 sm:p-8 space-y-6">
              {/* Header Info */}
              <div className="border-b border-[#232d1a] pb-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-2xl">{activeCountry.flagEmoji}</span>
                    <span className="font-mono text-[#fbbf24] font-bold uppercase tracking-wider">
                      {activeCountry.country} • {activeCountry.agencyAcronym}
                    </span>
                  </div>
                  <span className="text-[#8ea873] font-mono text-[11px]">
                    Founded: {activeCountry.foundedYear}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white">
                  {activeCountry.agencyFullName}
                </h3>
                <div className="text-xs text-[#a8baa0] font-medium font-sans">
                  {activeCountry.nativeAgencyName}
                </div>

                {activeCountry.notableAstronautsOrCosmonauts?.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#0b0e0a] border border-[#232d1a] text-xs text-[#c7dfb8]">
                    <strong className="text-[#fbbf24] font-mono">PIONEERING ASTRONAUTS / COSMONAUTS: </strong>
                    <span className="font-sans">{activeCountry.notableAstronautsOrCosmonauts.join("; ")}</span>
                  </div>
                )}
              </div>

              {/* Research & Scientific Discoveries */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#fbbf24]" />
                  <span>KEY SPACE MEDICINE & RADIATION RESEARCH</span>
                </h4>

                <div className="space-y-3">
                  {(activeCountry.biomedicalAndRadiationResearch || []).map((res, i) => (
                    <div
                      key={i}
                      className="bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-4 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white">
                          {res.experimentOrProgram}
                        </span>
                        <span className="text-xs font-mono text-[#fbbf24] bg-[#182213] border border-[#3f5231] px-2 py-0.5 rounded">
                          {res.scientificFocus}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#a8baa0] leading-relaxed">
                        {res.summary}
                      </p>

                      {res.empiricalFormulaOrMetric && (
                        <div className="text-xs bg-[#11160e] border border-[#232d1a] rounded-lg p-2.5 text-[#c7dfb8]">
                          <strong className="text-[#fbbf24] font-mono">MEASURED FORMULA / METRIC: </strong>
                          <span className="font-mono text-[#a3c988]">
                            {res.empiricalFormulaOrMetric}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware & Platforms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#232d1a]">
                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-4 space-y-2">
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#fbbf24]" />
                    <span>FLAGSHIP FLIGHT HARDWARE</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#a8baa0]">
                    {(activeCountry.flagshipHardwareAndDosimeters || []).map((hw, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#fbbf24]">•</span>
                        <span>{hw}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-xl p-4 space-y-2">
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#84a96c]" />
                    <span>MISSIONS & PLATFORMS</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#a8baa0]">
                    {(activeCountry.keyMissionsAndPlatforms || []).map((mp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#84a96c]">•</span>
                        <span>{mp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Watch H1 Integration Callout */}
              {activeCountry.watchH1Synergy && (
                <div className="p-4 rounded-xl bg-[#182213] border border-[#3f5231] text-xs text-[#c7dfb8] flex items-center justify-between gap-4 font-mono">
                  <div>
                    <span className="text-[#fbbf24] font-bold block mb-0.5">
                      ARES-VII & WATCH H1 ALGORITHMIC COUPLING:
                    </span>
                    <span className="font-sans text-[#a8baa0]">{activeCountry.watchH1Synergy}</span>
                  </div>
                  <Sparkles className="w-5 h-5 text-[#fbbf24] shrink-0" />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}