import { useState } from "react";
import {
  GLOBAL_COUNTRY_SPACE_AGENCIES_MATRIX,
  type GlobalRegionCategory,
} from "../data/worldSpaceAgenciesData";
import { Search, ShieldCheck, Globe, Activity, Pill, Cpu } from "lucide-react";

const REGIONS: { id: GlobalRegionCategory; label: string }[] = [
  { id: "ALL", label: "All 28+ Countries" },
  { id: "EURASIA_SOVIET_INTERKOSMOS", label: "USSR / Russia / Mongolia / Interkosmos" },
  { id: "AMERICAS", label: "Americas (NASA / CSA / AEB)" },
  { id: "EUROPE_ESA", label: "Europe (ESA / DLR / CNES / ASI)" },
  { id: "ASIA_PACIFIC", label: "Asia-Pacific (CMSA / JAXA / ISRO / KASA)" },
  { id: "MIDDLE_EAST_AFRICA", label: "Middle East & Africa (UAE / SSA / ISA)" },
];

export default function WorldSpaceAgenciesHub() {
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedRegion, setSelectedRegion] =
    useState<GlobalRegionCategory>("ALL");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("MN");

  // Simple, plain-English cross-agency survival simulator
  const [missionDays, setMissionDays] = useState<number>(180);
  const [environment, setEnvironment] = useState<"leo" | "lunar" | "mars">(
    "leo"
  );
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
        entry.notableAstronautsOrCosmonauts.some((a) =>
          a.toLowerCase().includes(q)
        ) ||
        entry.biomedicalAndRadiationResearch.some(
          (r) =>
            r.experimentOrProgram.toLowerCase().includes(q) ||
            r.summary.toLowerCase().includes(q)
        );
      return matchesRegion && matchesSearch;
    }
  );

  const activeCountry =
    GLOBAL_COUNTRY_SPACE_AGENCIES_MATRIX.find(
      (c) => c.countryCode === selectedCountryCode
    ) ||
    filteredCountries[0] ||
    GLOBAL_COUNTRY_SPACE_AGENCIES_MATRIX[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10">
      <div className="container mx-auto px-4 space-y-12">
        {/* HEADER */}
        <section className="space-y-6">
          <div className="border-b border-zinc-800/80 pb-6 space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-orange-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>28 Spacefaring Nations · Plain-English Research Archive</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
              Every Space Agency’s Medical & Survival Research Explained Simply
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Explore what every country discovered in space—from Mongolia’s
              Soyuz-39 fluid-shift collar and Soviet Mir radiation shields to
              NASA, China CMSA, ESA, JAXA, and India ISRO—written in clear,
              human language.
            </p>
          </div>

          {/* PLAIN-ENGLISH COUNTERMEASURE SIMULATOR */}
          <div className="card-outer">
            <div className="card-inner p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Plain-English Astronaut Protection Calculator
                  </h2>
                  <p className="text-xs text-zinc-400">
                    See how combining inventions from different countries keeps
                    an astronaut safe on a mission.
                  </p>
                </div>
                <div className="flex gap-1.5 text-xs">
                  {[
                    { id: "leo", label: "Low Earth Orbit (ISS / Salyut)" },
                    { id: "lunar", label: "Moon Surface (Chang'e-4)" },
                    { id: "mars", label: "Deep Space / Mars Transit" },
                  ].map((env) => (
                    <button
                      key={env.id}
                      onClick={() => setEnvironment(env.id as any)}
                      className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer ${
                        environment === env.id
                          ? "bg-orange-500 text-zinc-950 border-orange-500"
                          : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white"
                      }`}
                    >
                      {env.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-6 items-center">
                {/* Left 6 Cols: Simple Controls */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300 font-medium">
                        Mission Duration
                      </span>
                      <span className="font-mono font-semibold text-orange-400 tabular-nums">
                        {missionDays} Days
                      </span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={500}
                      value={missionDays}
                      onChange={(e) => setMissionDays(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>8 days (Soyuz-39)</span>
                      <span>180 days (ISS/Tiangong)</span>
                      <span>438 days (Mir Record)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-start gap-3 p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useCollarAndSuit}
                        onChange={(e) => setUseCollarAndSuit(e.target.checked)}
                        className="mt-1 accent-orange-500"
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-white">
                          Mongolia & Soviet Pressure Suit («Vorotnik» & «Chibis»)
                        </div>
                        <div className="text-zinc-400 mt-0.5">
                          Gentle neck & lower-body vacuum suit that stops blood
                          from rushing to the head in zero gravity, preventing
                          headaches, dizziness, and vision damage.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useRadiationShield}
                        onChange={(e) =>
                          setUseRadiationShield(e.target.checked)
                        }
                        className="mt-1 accent-orange-500"
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-white">
                          Water-Wall Shelter & Radioprotectant («Indralin B-190»)
                        </div>
                        <div className="text-zinc-400 mt-0.5">
                          Uses spacecraft water tanks to block solar protons and
                          emergency radiation medicine developed by IBMP & INMAS
                          to cut radiation damage by 32%.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useBoneAndHeartMeds}
                        onChange={(e) =>
                          setUseBoneAndHeartMeds(e.target.checked)
                        }
                        className="mt-1 accent-orange-500"
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-white">
                          NASA/JAXA Bone Protection & CMSA Heart Support
                        </div>
                        <div className="text-zinc-400 mt-0.5">
                          Combines resistive exercise + bisphosphonate therapy
                          with cardiac autonomic stabilization so bones and
                          heart stay strong for landing.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Right 6 Cols: Plain-English Results */}
                <div className="lg:col-span-6 grid sm:grid-cols-2 gap-3">
                  <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-4 space-y-1.5">
                    <div className="text-xs text-zinc-400">
                      Total Mission Radiation
                    </div>
                    <div className="text-2xl font-mono font-semibold text-white tabular-nums">
                      {protectedDoseMsv.toFixed(1)} mSv
                    </div>
                    <div className="text-xs text-zinc-400">
                      Uses{" "}
                      <strong className="font-mono text-orange-400">
                        {safetyLimitPct}%
                      </strong>{" "}
                      of NASA’s 600 mSv career safe limit.
                    </div>
                  </div>

                  <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-4 space-y-1.5">
                    <div className="text-xs text-zinc-400">
                      Space Dizziness & Head Pressure Risk
                    </div>
                    <div className="text-2xl font-mono font-semibold text-white tabular-nums">
                      {motionSicknessRiskPct}%
                    </div>
                    <div className="text-xs text-zinc-400">
                      {useCollarAndSuit
                        ? "Reduced by 56% using Soyuz-39 / Chibis cuffs."
                        : "High risk of head congestion & nausea without cuffs."}
                    </div>
                  </div>

                  <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-4 space-y-1.5">
                    <div className="text-xs text-zinc-400">
                      Bone Strength Loss Per Month
                    </div>
                    <div className="text-2xl font-mono font-semibold text-white tabular-nums">
                      -{monthlyBoneLossPct.toFixed(2)}%
                    </div>
                    <div className="text-xs text-zinc-400">
                      {useBoneAndHeartMeds
                        ? "90% of bone mass preserved (JAXA/NASA protocol)."
                        : "Unprotected astronauts lose 1.5% bone every month."}
                    </div>
                  </div>

                  <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-4 space-y-1.5">
                    <div className="text-xs text-zinc-400">
                      Safe Landing G-Force Limit
                    </div>
                    <div className="text-2xl font-mono font-semibold text-orange-400 tabular-nums">
                      {useBoneAndHeartMeds && useCollarAndSuit
                        ? "3.8 G"
                        : "2.1 G"}
                    </div>
                    <div className="text-xs text-zinc-400">
                      Maximum safe re-entry acceleration without blacking out.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DIRECTORY OF ALL 28+ COUNTRIES AND THEIR RESEARCH */}
        <section className="space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                National Space Agencies Directory ({filteredCountries.length}{" "}
                Countries)
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Select any country to read its missions, astronauts, hardware,
                and medical discoveries.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder="Search country, astronaut, or mission..."
                className="w-full bg-zinc-900 text-zinc-100 text-xs pl-9 pr-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {REGIONS.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer ${
                  selectedRegion === reg.id
                    ? "bg-orange-500 text-zinc-950 border-orange-500"
                    : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white"
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left 4 Cols: Clean Country Selector */}
            <div className="lg:col-span-4 card-outer max-h-[680px] overflow-y-auto space-y-1.5">
              {filteredCountries.map((c) => {
                const isSelected = c.countryCode === activeCountry.countryCode;
                return (
                  <button
                    key={c.countryCode}
                    onClick={() => setSelectedCountryCode(c.countryCode)}
                    className={`w-full text-left p-3.5 rounded-[10px] border cursor-pointer ${
                      isSelected
                        ? "bg-zinc-900 border-orange-500/60 text-white"
                        : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">
                        {c.country}
                      </span>
                      <span className="font-mono text-orange-400">
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

            {/* Right 8 Cols: Selected Country Details */}
            <div className="lg:col-span-8 card-outer">
              <div className="card-inner p-6 sm:p-8 space-y-6">
                <div className="border-b border-zinc-800/80 pb-5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                    <span className="font-mono text-orange-400 font-medium">
                      {activeCountry.countryCode} · Established{" "}
                      {activeCountry.establishedYear} · First Flight{" "}
                      {activeCountry.firstHumanOrBioFlightYear}
                    </span>
                    <span>{activeCountry.nativeAgencyName}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    {activeCountry.country} — {activeCountry.agencyFullName} (
                    {activeCountry.agencyAcronym})
                  </h3>
                  <p className="text-xs text-zinc-300">
                    <strong>Key Astronauts / Cosmonauts:</strong>{" "}
                    {activeCountry.notableAstronautsOrCosmonauts.join(", ")}
                  </p>
                </div>

                {/* Research & Discoveries */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    <span>
                      Space Medicine & Radiation Research From{" "}
                      {activeCountry.country}
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {activeCountry.biomedicalAndRadiationResearch.map(
                      (res, i) => (
                        <div
                          key={i}
                          className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-white">
                              {res.experimentOrProgram}
                            </span>
                            <span className="text-xs font-mono text-orange-400">
                              {res.missionOrFacility}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                            {res.summary}
                          </p>
                          <div className="text-xs bg-zinc-950 border border-zinc-800/80 rounded-md p-2.5 text-zinc-300">
                            <strong className="text-orange-400">
                              Measured Result / Formula:{" "}
                            </strong>
                            <span className="font-mono">
                              {res.quantitativeModelOrMetric}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Hardware & Countermeasures */}
                <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/80">
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 space-y-2">
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-orange-500" />
                      <span>Spaceflight Hardware & Dosimeters</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {activeCountry.flagshipHardwareAndDosimeters.map(
                        (hw, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span>{hw}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 space-y-2">
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-orange-500" />
                      <span>Operational Medical Countermeasures</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {activeCountry.emergencyAndMedicalCountermeasures.map(
                        (cm, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span>{cm}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
