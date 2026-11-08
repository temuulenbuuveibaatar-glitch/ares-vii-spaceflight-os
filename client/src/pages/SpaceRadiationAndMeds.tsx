import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  spaceMedicationsDatabase,
  spaceMedicationCategories,
  type SpaceMedication,
} from "../data/spaceMedicationsAndRadiation";
import {
  WORLD_SPACE_PHARMACEUTICALS,
  type AgencySpacePharmaceutical,
} from "../data/worldSpaceAgenciesData";
import {
  Search,
  Atom,
  Pill,
  CheckCircle2,
  ShieldAlert,
  Syringe,
  Radio,
} from "lucide-react";

export type AgencyOriginFilter =
  | "ALL"
  | "USSR_RUSSIA"
  | "NASA_USA"
  | "CHINA_CMSA"
  | "MONGOLIA_INTERKOSMOS"
  | "ESA_JAXA"
  | "INDIA_ISRO";

export interface UnifiedSpaceDrug {
  id: string;
  name: string;
  nativeOrGenericName: string;
  agencyFilter: Exclude<AgencyOriginFilter, "ALL">;
  agencyBadge: string;
  countryFlag: string;
  category: string;
  categoryLabel: string;
  missionsFlown: string;
  dosage: string;
  route: string;
  spaceIndication: string;
  microgravityEffects: string;
  efficacyMetric: string;
  kitLocation: string;
  remainingUnits: number;
}

// Additional Soviet Union (USSR / IBMP), Mongolian (Interkosmos), Chinese (CMSA), Indian (ISRO), and European/Japanese Space Drugs
const EXTRA_AGENCY_MEDICATIONS: UnifiedSpaceDrug[] = [
  {
    id: "ussr-mexidol-emoxypine",
    name: "Mexidol / Emoxypine Succinate (Мексидол • АИ-Космос)",
    nativeOrGenericName: "2-Ethyl-6-methyl-3-hydroxypyridine Succinate (IBMP RAS)",
    agencyFilter: "USSR_RUSSIA",
    agencyBadge: "Soviet Union / Russia (IBMP RAS)",
    countryFlag: "🇷🇺",
    category: "radioprotectant_ars",
    categoryLabel: "Radioprotectants & ARS Countermeasures",
    missionsFlown: "Mir Orbital Station, Soyuz-TM/MS, ISS Zvezda Medical Kit",
    dosage: "125–250 mg PO 3 times daily (or 100 mg IV/IM in acute hypoxia or cosmic radiation surge)",
    route: "Oral Tablet / Ampoule",
    spaceIndication:
      "Membrane-protective antihypoxant and radioprotective free-radical scavenger used by Soviet/Russian cosmonauts during solar proton events, cabin depressurization hypoxia, and extreme orbital workload.",
    microgravityEffects:
      "Succinate moiety directly fuels mitochondrial Complex II (succinate dehydrogenase) under low-oxygen or high-radiation conditions in 0G, preserving cerebral ATP and inhibiting lipid peroxidation.",
    efficacyMetric: "+38% Hypoxic Survival & -42% Lipid Peroxidation under GCR Flux",
    kitLocation: "Soyuz/Zvezda Бортовая Аптечка (Onboard Kit #1)",
    remainingUnits: 24,
  },
  {
    id: "ussr-panangin-riboxin",
    name: "Panangin & Riboxin (Панангин + Рибоксин • Myocardial Metabolic Protocol)",
    nativeOrGenericName: "Potassium & Magnesium Aspartate + Inosine (Purine Nucleoside)",
    agencyFilter: "USSR_RUSSIA",
    agencyFilterLabel: "USSR",
    agencyBadge: "Soviet Union / Russia (Salyut & Mir)",
    countryFlag: "🇷🇺",
    category: "cardiovascular_acls",
    categoryLabel: "0G Cardiovascular, ACLS & Anticoagulation",
    missionsFlown: "Salyut 6 (Soyuz-39), Salyut 7, Mir (Polyakov 437.7d), ISS Russian Segment",
    dosage: "Panangin 2 tablets TID + Riboxin 200 mg TID for 30-day orbital cycles prior to Chibis LBNP and reentry",
    route: "Oral Tablet",
    spaceIndication:
      "Prevents microgravity myocardial atrophy, hypokalemic/hypomagnesemic cardiac arrhythmias, and T-wave flattening caused by 0G fluid-electrolyte loss and stress catecholamines.",
    microgravityEffects:
      "Aspartate carrier actively transports K+ and Mg2+ across the cardiomyocyte sarcolemma while Inosine (Riboxin) elevates myocardial ATP and 2,3-BPG synthesis during cephalad fluid redistribution.",
    efficacyMetric: "-71% Extrasystolic Arrhythmia Incidence on Long-Duration Mir Flights",
    kitLocation: "Mir / Zvezda Cardiological Prevention Locker",
    remainingUnits: 60,
  } as any,
  {
    id: "ussr-piracetam-nootropil",
    name: "Piracetam / Fonturacetam (Пирацетам / Фенотропил • Cosmonaut Nootropic)",
    nativeOrGenericName: "2-Oxo-1-pyrrolidine Acetamide & 4-Phenylpiracetam (IBMP)",
    agencyFilter: "USSR_RUSSIA",
    agencyBadge: "Soviet Union / Russia (IBMP RAS)",
    countryFlag: "🇷🇺",
    category: "behavioral_circadian",
    categoryLabel: "Circadian, Sleep & Deep-Space Behavioral",
    missionsFlown: "Salyut 6/7, Mir EO-1 to EO-28, Soyuz-TMA/MS, ISS Zvezda",
    dosage: "Fonturacetam 100 mg PO once in the morning prior to manual docking or contingency EVA",
    route: "Oral Tablet",
    spaceIndication:
      "Counteracts acute space asthenia, sensorimotor fatigue, and cold/hypoxic stress during emergency Soyuz manual rendezvous or extended 8-hour EVAs.",
    microgravityEffects:
      "Modulates AMPA glutamate and nicotinic acetylcholine receptors in the cerebral cortex without inducing cardiovascular tachycardia or post-dose crash in microgravity.",
    efficacyMetric: "+24% Manual Docking Tracking Accuracy under 36-Hour Sleep Deprivation",
    kitLocation: "Soyuz Descent Module Psychophysiological Kit",
    remainingUnits: 18,
  },
  {
    id: "mongolia-chacargana-salidroside",
    name: "Chacargana & Altai Rhodiola ('Чацаргана ба Алтайн Алтан Гагнуур' • Soyuz-39 Bio-Shield)",
    nativeOrGenericName: "Hippophae rhamnoides Flavonoid-Tocopherol Oil + Salidroside Adaptogen",
    agencyFilter: "MONGOLIA_INTERKOSMOS",
    agencyBadge: "Mongolia / Interkosmos (MAS Soyuz-39)",
    countryFlag: "🇲🇳",
    category: "radioprotectant_ars",
    categoryLabel: "Radioprotectants & ARS Countermeasures",
    missionsFlown: "Soyuz 39 / Salyut 6 (1981 J. Gürragchaa) & MAS Space Biomedicine",
    dosage: "500 mg lyophilized sea-buckthorn polyphenol/carotenoid capsule + 150 mg Altai Rhodiola extract PO BID",
    route: "Oral Capsule / Lyophilized Extract",
    spaceIndication:
      "Developed by the Mongolian Academy of Sciences (MAS) for Interkosmos cosmonauts: protects mucosal membranes, vascular endothelium, and hematopoietic cells against cosmic radiation oxidative stress while preventing high-altitude/0G fatigue.",
    microgravityEffects:
      "High-concentration quercetin, isorhamnetin, and α/γ-tocopherols quench singlet oxygen and peroxyl radicals generated by South Atlantic Anomaly proton traversals; Salidroside stabilizes HPA-axis cortisol rhythm.",
    efficacyMetric: "+29% Endogenous SOD/Catalase Activity & 1.48 mSv Zero-Symptom Soyuz-39 Flight",
    kitLocation: "MAS Interkosmos Heritage & Bio-Nutraceutical Kit",
    remainingUnits: 32,
  },
  {
    id: "china-space-tcm-shenzhou-buqi",
    name: "Shenzhou Space Buqi & Danhong Formula (神舟补气活血方 • CMSA Antithrombotic)",
    nativeOrGenericName: "Salvia miltiorrhiza (Danshen) & Carthamus tinctorius + Astragalus",
    agencyFilter: "CHINA_CMSA",
    agencyBadge: "China (CMSA / ACC Tiangong)",
    countryFlag: "🇨🇳",
    category: "cardiovascular_acls",
    categoryLabel: "0G Cardiovascular, ACLS & Anticoagulation",
    missionsFlown: "Shenzhou 12–19 & Tiangong Space Station 180-Day Expeditions",
    dosage: "2 capsules PO twice daily during months 2–6 of orbital flight",
    route: "Oral Capsule",
    spaceIndication:
      "Prevents microgravity internal jugular vein (IJV) blood stasis, hypercoagulability, and microvascular sludging caused by cephalad fluid shift.",
    microgravityEffects:
      "Tanshinone IIA and salvianolic acid B inhibit platelet P-selectin expression and preserve glycocalyx integrity in the internal jugular and retinal veins without systemic bleeding risk.",
    efficacyMetric: "-34% Whole-Blood Viscosity & Improved Jugular Venous Outflow Velocity",
    kitLocation: "Tiangong Wentian Space TCM Medical Cabinet",
    remainingUnits: 40,
  },
];

function buildUnifiedMedicationDatabase(): UnifiedSpaceDrug[] {
  const fromWorldAgencies: UnifiedSpaceDrug[] = WORLD_SPACE_PHARMACEUTICALS.map(
    (p: AgencySpacePharmaceutical) => {
      let agencyFilter: Exclude<AgencyOriginFilter, "ALL"> = "USSR_RUSSIA";
      let agencyBadge = "Soviet Union / Russia (IBMP RAS)";
      let countryFlag = "🇷🇺";
      let category = "radioprotectant_ars";
      let categoryLabel = "Radioprotectants & ARS Countermeasures";

      if (p.id === "inmas-rp1-podophyllum") {
        agencyFilter = "INDIA_ISRO";
        agencyBadge = "India (ISRO / DRDO-INMAS)";
        countryFlag = "🇮🇳";
        category = "radioprotectant_ars";
      } else if (p.agencyId === "CMSA-ACC") {
        agencyFilter = "CHINA_CMSA";
        agencyBadge = "China (CMSA / ACC)";
        countryFlag = "🇨🇳";
        category = "cardiovascular_acls";
        categoryLabel = "0G Cardiovascular, ACLS & Anticoagulation";
      } else if (p.agencyId === "ESA-JAXA") {
        agencyFilter = "ESA_JAXA";
        agencyBadge = "Japan JAXA & Europe ESA";
        countryFlag = "🇯🇵🇪🇺";
        category = "bone_calcium";
        categoryLabel = "Osteoclast Inhibition & Renal Stone Prevention";
      } else if (p.id === "phenibut-noofen" || p.id === "eleutherococcus-rhodiola-adaptogens") {
        category = "behavioral_circadian";
        categoryLabel = "Circadian, Sleep & Deep-Space Behavioral";
      }

      return {
        id: `world-${p.id}`,
        name: p.name,
        nativeOrGenericName: `${p.nativeName} · ${p.pharmacologicalClass}`,
        agencyFilter,
        agencyBadge,
        countryFlag,
        category,
        categoryLabel,
        missionsFlown: p.missionsFlown,
        dosage: p.dosingProtocol,
        route: "Oral Tablet / Space Sachet",
        spaceIndication: p.mechanismOfAction,
        microgravityEffects: p.microgravityNotes,
        efficacyMetric: p.doseReductionFactorOrGain,
        kitLocation: p.kitAssignment,
        remainingUnits: 20,
      };
    }
  );

  const fromNasaFormulary: UnifiedSpaceDrug[] = spaceMedicationsDatabase.map(
    (m: SpaceMedication) => ({
      id: m.id,
      name: m.name,
      nativeOrGenericName: m.genericName,
      agencyFilter: "NASA_USA",
      agencyBadge: "NASA (ISS / Artemis Deep-Space Formulary)",
      countryFlag: "🇺🇸",
      category: m.category,
      categoryLabel: m.categoryLabel,
      missionsFlown: "Apollo, Skylab, Space Shuttle, ISS USOS, Artemis Orion",
      dosage: m.dosage,
      route: m.route,
      spaceIndication: m.spaceIndication,
      microgravityEffects: m.microgravityPharmacokinetics,
      efficacyMetric: m.radiationStabilityRating,
      kitLocation: m.kitLocation,
      remainingUnits: 15,
    })
  );

  return [...fromWorldAgencies, ...EXTRA_AGENCY_MEDICATIONS, ...fromNasaFormulary];
}

const ALL_UNIFIED_MEDICATIONS = buildUnifiedMedicationDatabase();

const AGENCY_FILTER_TABS: {
  id: AgencyOriginFilter;
  label: string;
  flag: string;
}[] = [
  { id: "ALL", label: "All Space Agencies", flag: "🌍" },
  { id: "USSR_RUSSIA", label: "Soviet Union / Russia (IBMP)", flag: "🇷🇺" },
  { id: "NASA_USA", label: "NASA (USA)", flag: "🇺🇸" },
  { id: "CHINA_CMSA", label: "China (CMSA / Space TCM)", flag: "🇨🇳" },
  { id: "MONGOLIA_INTERKOSMOS", label: "Mongolia (MAS / Soyuz-39)", flag: "🇲🇳" },
  { id: "ESA_JAXA", label: "Europe & Japan (ESA / JAXA)", flag: "🇪🇺🇯🇵" },
  { id: "INDIA_ISRO", label: "India (ISRO / DRDO-INMAS)", flag: "🇮🇳" },
];

export default function SpaceRadiationAndMeds() {
  const { data: overview } = useQuery<any>({
    queryKey: ["/api/mission/overview"],
    refetchInterval: 4000,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgency, setSelectedAgency] =
    useState<AgencyOriginFilter>("ALL");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [shieldingGcm2, setShieldingGcm2] = useState(20);
  const [stormHours, setStormHours] = useState(12);
  const [selectedCrewMember, setSelectedCrewMember] = useState(
    "Cmdr. Elena Vance"
  );

  const [inventoryCounts, setInventoryCounts] = useState<Record<string, number>>(
    () => {
      const init: Record<string, number> = {};
      ALL_UNIFIED_MEDICATIONS.forEach((d) => {
        init[d.id] = d.remainingUnits;
      });
      return init;
    }
  );

  const [administeredLog, setAdministeredLog] = useState<
    Array<{
      id: string;
      time: string;
      crewMember: string;
      drugName: string;
      agencyBadge: string;
      dose: string;
      notifiedEarth: boolean;
    }>
  >([
    {
      id: "init-1",
      time: "14:05 UTC",
      crewMember: "Cmdr. Elena Vance",
      drugName: "Indralin (Б-190 / B-190 Emergency Radioprotectant)",
      agencyBadge: "Soviet Union / Russia (IBMP RAS)",
      dose: "450 mg PO prophylactic solar storm dose (DRF 1.45)",
      notifiedEarth: true,
    },
  ]);

  // Dispatch medication log to Earth Mission Control + Hermes AI
  const notifyEarthMutation = useMutation({
    mutationFn: async (payload: {
      crewMember: string;
      drugName: string;
      agencyBadge: string;
      dose: string;
    }) => {
      const res = await apiRequest("POST", "/api/earth-comm/send", {
        sender: "Sonnenblume Automated Pharmacy & EHR",
        priority: "HIGH",
        message: `[MEDICATION ADMINISTERED] ${payload.crewMember} received ${payload.drugName} (${payload.agencyBadge}) : Dose: ${payload.dose}. Logged to 24/7 Astronaut EHR & synced to Hermes MED-SENTINEL.`,
        attachTelemetry: true,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mission/overview"] });
    },
  });

  const handleAdministerDose = (med: UnifiedSpaceDrug) => {
    setInventoryCounts((prev) => ({
      ...prev,
      [med.id]: Math.max(0, (prev[med.id] ?? med.remainingUnits) - 1),
    }));

    const newEntry = {
      id: `${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      crewMember: selectedCrewMember,
      drugName: med.name,
      agencyBadge: med.agencyBadge,
      dose: med.dosage,
      notifiedEarth: true,
    };

    setAdministeredLog((prev) => [newEntry, ...prev]);

    notifyEarthMutation.mutate({
      crewMember: selectedCrewMember,
      drugName: med.name,
      agencyBadge: med.agencyBadge,
      dose: med.dosage,
    });
  };

  // Plain-English shielding calculation
  const unshieldedDoseMsv = stormHours * 42;
  const shieldedDoseMsv = Math.round(
    unshieldedDoseMsv * Math.exp(-shieldingGcm2 / 28)
  );

  const filteredMeds = ALL_UNIFIED_MEDICATIONS.filter((m) => {
    const matchesAgency =
      selectedAgency === "ALL" || m.agencyFilter === selectedAgency;
    const matchesCat =
      selectedCategory === "all" || m.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.nativeOrGenericName.toLowerCase().includes(q) ||
      m.spaceIndication.toLowerCase().includes(q) ||
      m.agencyBadge.toLowerCase().includes(q);
    return matchesAgency && matchesCat && matchesSearch;
  });

  const astronauts = overview?.astronauts || [
    { name: "Cmdr. Elena Vance" },
    { name: "Dr. Aris Thorne" },
    { name: "Batbayar Ganzorig" },
    { name: "Lt. Kenji Sato" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0e0a] text-[#e3ecd8] py-10 selection:bg-[#2e3b23] selection:text-[#fbbf24]">
      <div className="container mx-auto px-4 space-y-10">
        {/* HEADER */}
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#232d1a] pb-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#fbbf24]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                <span>
                  MULTI-AGENCY SPACE PHARMACY · USSR/IBMP · NASA · CMSA · MAS · JAXA · ISRO
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans">
                Global Space Agency Medication Formulary & Radiation Shielding
              </h1>
              <p className="text-sm text-[#a8baa0] leading-relaxed">
                Complete offline space pharmacology database across every spacefaring
                nation: including Soviet Union / Russian IBMP radioprotectants
                (Indralin B-190, Cystamine RS-1, Phenibut, Mexidol, Panangin),
                China Space TCM (Taikong Yangxin Wan), Mongolia Interkosmos
                adaptogens, India DRDO-INMAS RP-1, JAXA Bisphosphonates, and
                NASA ISS/Artemis medical kits. Administer doses directly into the
                24/7 Astronaut EHR with instant Earth Mission Control notification.
              </p>
            </div>

            {/* Active Crew Selector for Medication Administration */}
            <div className="bg-[#13190e] border border-[#2e3b23] rounded-xl p-3.5 space-y-1.5 shrink-0 font-mono text-xs">
              <div className="text-[11px] text-[#8ea873] font-bold">
                Active Astronaut for Dose Administration
              </div>
              <select
                value={selectedCrewMember}
                onChange={(e) => setSelectedCrewMember(e.target.value)}
                className="w-full bg-[#0b0e0a] text-white text-xs font-semibold px-3 py-2 rounded-lg border border-[#232d1a] focus:outline-none focus:border-[#fbbf24]"
              >
                {astronauts.map((a: any, i: number) => (
                  <option key={i} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* LIVE MEDICATION ADMINISTRATION LOG & EARTH SYNC */}
          <div className="card-outer">
            <div className="card-inner p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#232d1a] pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Syringe className="w-4 h-4 text-[#fbbf24]" />
                  <span>
                    24/7 Crew Medication Administration Log (Auto-Synced to Hermes AI & Earth DSN)
                  </span>
                </div>
                <span className="text-xs font-mono text-[#84a96c] inline-flex items-center gap-1.5 font-bold">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Mission Control Telemetry Uplink Active</span>
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {administeredLog.slice(0, 3).map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#fbbf24]">
                      <span>{entry.crewMember}</span>
                      <span>{entry.time}</span>
                    </div>
                    <div className="font-semibold text-white truncate">
                      {entry.drugName}
                    </div>
                    <div className="text-[#8ea873] text-[11px] truncate">
                      {entry.agencyBadge} · {entry.dose}
                    </div>
                    <div className="text-[11px] text-[#84a96c] flex items-center gap-1 pt-0.5 font-mono">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Logged to EHR & Downlinked</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MULTI-AGENCY MEDICATION DIRECTORY */}
        <section className="space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#fbbf24]" />
                <span>
                  Multi-Agency Space Medications ({filteredMeds.length} Drugs Available Onboard)
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#a8baa0]">
                Filter by space agency (including Soviet Union/USSR, China,
                Mongolia, India, Europe/Japan, and NASA) or clinical category.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-[#8ea873] absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Indralin, Phenibut, USSR, radiation..."
                className="w-full bg-[#13190e] text-white text-xs pl-9 pr-3 py-2 rounded-xl border border-[#2e3b23] focus:outline-none focus:border-[#fbbf24]"
              />
            </div>
          </div>

          {/* AGENCY FILTER TABS */}
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {AGENCY_FILTER_TABS.map((tab) => {
              const isSelected = selectedAgency === tab.id;
              const count =
                tab.id === "ALL"
                  ? ALL_UNIFIED_MEDICATIONS.length
                  : ALL_UNIFIED_MEDICATIONS.filter(
                      (m) => m.agencyFilter === tab.id
                    ).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedAgency(tab.id)}
                  className={`px-3 py-1.5 rounded-lg border cursor-pointer inline-flex items-center gap-1.5 transition-colors active:scale-[0.97] ${
                    isSelected
                      ? "bg-[#28381c] text-[#fbbf24] border-[#4d633b] font-bold shadow-sm shadow-amber-500/10"
                      : "bg-[#13190e] text-[#8ea873] border-[#2e3b23] hover:border-[#3f5231] hover:text-white"
                  }`}
                >
                  <span>{tab.flag}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`font-mono text-[11px] px-1.5 py-0.2 rounded ${
                      isSelected
                        ? "bg-[#0b0e0a] text-[#fbbf24]"
                        : "bg-[#0b0e0a] text-[#8ea873]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CLINICAL CATEGORY FILTER TABS */}
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {spaceMedicationCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md border cursor-pointer transition-colors active:scale-[0.97] ${
                    isSelected
                      ? "bg-[#182213] text-[#fbbf24] border-[#3f5231] font-bold"
                      : "bg-[#0b0e0a] text-[#8ea873] border-[#232d1a] hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* MEDICATION CARDS */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredMeds.map((med) => {
              const remaining =
                inventoryCounts[med.id] ?? med.remainingUnits;
              return (
                <div key={med.id} className="card-outer">
                  <div className="card-inner p-5 space-y-3.5 h-full flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#fbbf24] bg-[#182213] border border-[#3f5231] px-2.5 py-1 rounded-md font-mono">
                          <span>{med.countryFlag}</span>
                          <span>{med.agencyBadge}</span>
                        </span>
                        <span className="text-xs font-mono text-[#8ea873] tabular-nums">
                          Stock: {remaining} doses
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">
                          {med.name}
                        </h3>
                        <div className="text-xs text-[#8ea873] mt-0.5">
                          {med.nativeOrGenericName}
                        </div>
                      </div>

                      <div className="text-xs text-[#8ea873] font-mono">
                        Missions Flown:{" "}
                        <span className="text-white">{med.missionsFlown}</span>
                      </div>

                      <p className="text-xs text-[#a8baa0] leading-relaxed">
                        <strong className="text-white">
                          Spaceflight Indication & Mechanism:
                        </strong>{" "}
                        {med.spaceIndication}
                      </p>

                      <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[#fbbf24]">
                            Dosage ({med.kitLocation})
                          </span>
                          <span className="font-mono text-[11px] text-[#8ea873]">
                            {med.efficacyMetric}
                          </span>
                        </div>
                        <div className="text-white font-mono leading-relaxed">
                          {med.dosage}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-[#232d1a]">
                      <div className="text-xs text-[#8ea873] leading-relaxed">
                        <strong className="text-white">
                          0G Pharmacokinetics:{" "}
                        </strong>
                        {med.microgravityEffects}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 font-mono">
                        <span className="text-[11px] text-[#8ea873]">
                          Route: {med.route}
                        </span>
                        <button
                          onClick={() => handleAdministerDose(med)}
                          disabled={remaining <= 0}
                          className="bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-40 text-[#0b0e0a] font-bold px-3.5 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-colors"
                        >
                          <Syringe className="w-3.5 h-3.5 text-[#0b0e0a]" />
                          <span>
                            Administer to {selectedCrewMember.split(" ").pop()}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SOLAR STORM SHELTER SHIELDING CALCULATOR */}
        <section className="card-outer">
          <div className="card-inner p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#232d1a] pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Atom className="w-4 h-4 text-[#fbbf24]" />
                  <span>
                    Solar Storm Shelter Shielding Calculator (Paired with B-190 Radioprotectant)
                  </span>
                </h2>
                <p className="text-xs text-[#a8baa0]">
                  Adjust water-wall thickness to see how much solar storm
                  radiation is blocked before reaching the astronaut.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#c7dfb8]">
                      Water / Polyethylene Wall Thickness
                    </span>
                    <span className="font-bold text-[#fbbf24] tabular-nums">
                      {shieldingGcm2} g/cm²
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={60}
                    value={shieldingGcm2}
                    onChange={(e) => setShieldingGcm2(Number(e.target.value))}
                    className="w-full accent-[#fbbf24] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6d845e] font-mono">
                    <span>2 g/cm² (Spacesuit)</span>
                    <span>20 g/cm² (Cabin wall)</span>
                    <span>50 g/cm² (Water Storm Shelter)</span>
                  </div>
                </div>

                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#c7dfb8]">Solar Storm Duration</span>
                    <span className="font-bold text-[#fbbf24] tabular-nums">
                      {stormHours} Hours
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={48}
                    value={stormHours}
                    onChange={(e) => setStormHours(Number(e.target.value))}
                    className="w-full accent-[#fbbf24] cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-4 space-y-1.5">
                  <div className="text-xs text-[#8ea873]">
                    Unprotected Outside Dose
                  </div>
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {unshieldedDoseMsv} mSv
                  </div>
                  <div className="text-xs text-[#ef4444] font-sans">
                    Without shelter, causes acute radiation sickness.
                  </div>
                </div>

                <div className="bg-[#0b0e0a] border border-[#232d1a] rounded-lg p-4 space-y-1.5">
                  <div className="text-xs text-[#8ea873]">
                    Protected Dose Inside Shelter
                  </div>
                  <div className="text-2xl font-bold text-[#fbbf24] tabular-nums">
                    {shieldedDoseMsv} mSv
                  </div>
                  <div className="text-xs text-[#8ea873] font-sans">
                    With Soviet Indralin B-190 (DRF 1.45), effective marrow dose
                    drops to{" "}
                    <strong className="font-mono text-white">
                      {Math.round(shieldedDoseMsv / 1.45)} mSv
                    </strong>
                    .
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
