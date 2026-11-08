import { useState } from "react";
import { Link } from "wouter";
import {
  spaceEmergencyProtocols,
  type SpaceEmergencyProtocol,
} from "../data/spaceProtocols";
import {
  Watch,
  Bot,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Pill,
  Search,
  Globe,
  ArrowUpRight,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Contingencies (12)" },
  { id: "radiation", label: "Radiation & SPE" },
  { id: "life_support", label: "Depressurization & ECLSS" },
  { id: "cardiovascular", label: "0G Cardiac & Thrombosis" },
  { id: "neuro_ocular", label: "SANS & Intracranial" },
  { id: "behavioral", label: "Isolation & Circadian" },
  { id: "trauma_eva", label: "EVA Suit & DCS" },
];

export default function EmergencyProtocols() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSpaceId, setExpandedSpaceId] = useState<string | null>(
    "microgravity-cpr"
  );

  const filteredSpace = spaceEmergencyProtocols.filter((p) => {
    const matchesCat =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.codeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-10 bg-[#0b0e0a] text-[#e3ecd8] min-h-screen selection:bg-[#2e3b23] selection:text-[#fbbf24]">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#232d1a] pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#fbbf24]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
              <span>
                NASA-STD-3001 · ROSCOSMOS IBMP · CMSA · INTERKOSMOS MONGOLIA · ESA · JAXA
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans">
              Microgravity & Deep-Space Emergency Procedures
            </h1>
            <p className="text-sm text-[#a8baa0] leading-relaxed">
              Step-by-step clinical and flight checklists paired with Xiaomi
              Watch H1 biomarker thresholds and Hermes autonomous ship actions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0 font-mono text-xs">
            <Link href="/world-agencies">
              <button className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-colors shadow-sm shadow-amber-500/10">
                <Globe className="w-4 h-4 text-[#0b0e0a]" />
                <span>28 Space Agencies Archive</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/space-encyclopedia">
              <button className="bg-[#13190e] hover:bg-[#1a2313] text-[#c7dfb8] border border-[#2e3b23] px-3.5 py-2.5 rounded-xl font-medium inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-colors">
                <Pill className="w-4 h-4 text-[#fbbf24]" />
                <span>0G Pharmacology</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8ea873] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search procedure (0G CPR, depressurization, SPE storm shelter, EVA helmet water, SANS, jugular thrombosis)..."
              className="w-full bg-[#13190e] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#2e3b23] focus:outline-none focus:border-[#fbbf24]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs font-mono">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer border transition-colors active:scale-[0.97] ${
                  selectedCategory === cat.id
                    ? "bg-[#28381c] text-[#fbbf24] border-[#4d633b] font-bold shadow-sm shadow-amber-500/10"
                    : "bg-[#13190e] text-[#8ea873] border-[#2e3b23] hover:border-[#3f5231] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Protocols List — Rule 14 Concentric Cards */}
        <div className="space-y-3">
          {filteredSpace.map((proto: SpaceEmergencyProtocol) => {
            const isExpanded = expandedSpaceId === proto.id;
            return (
              <div key={proto.id} className="card-outer">
                <div className="card-inner overflow-hidden">
                  <div
                    onClick={() =>
                      setExpandedSpaceId(isExpanded ? null : proto.id)
                    }
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#13190e]/60"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono text-[#fbbf24] font-medium">
                          {proto.codeName}
                        </span>
                        <span className="text-zinc-500">·</span>
                        <span className="text-[#8ea873] capitalize">
                          {proto.category.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {proto.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#8ea873]">
                        {proto.shortDescription}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 self-end sm:self-center text-xs font-medium text-[#fbbf24] shrink-0">
                      <span>{isExpanded ? "Hide" : "View Procedure"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-6 pt-4 border-t border-[#2e3b23]/80 space-y-5 bg-[#0b0e0a] surface-enter">
                      {/* Space Physiological Mechanism */}
                      <div className="bg-[#13190e]/60 p-4 rounded-lg border border-[#2e3b23]/90 space-y-1">
                        <div className="text-xs font-semibold text-[#fbbf24]">
                          Spaceflight Pathophysiology
                        </div>
                        <p className="text-xs sm:text-sm text-[#a8baa0] leading-relaxed">
                          {proto.spaceMechanism}
                        </p>
                      </div>

                      {/* Xiaomi Watch H1 Triggers & Hermes AI Automated Response */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-[#13190e]/60 p-4 rounded-lg border border-[#2e3b23]/90 space-y-2.5">
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <Watch className="w-4 h-4 text-[#fbbf24]" />
                            <span>Xiaomi Watch H1 Biomarker Triggers</span>
                          </div>
                          <div className="space-y-2">
                            {proto.watchTriggers.map((trig, i) => (
                              <div
                                key={i}
                                className="text-xs bg-[#0b0e0a] p-3 rounded-md border border-[#2e3b23]/80"
                              >
                                <div className="font-semibold text-white">
                                  {trig.metric}:{" "}
                                  <span className="font-mono text-[#fbbf24]">
                                    {trig.threshold}
                                  </span>
                                </div>
                                <div className="text-xs text-[#8ea873] mt-0.5">
                                  {trig.sensorSource} — {trig.clinicalMeaning}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#13190e]/60 p-4 rounded-lg border border-[#2e3b23]/90 space-y-2.5">
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <Bot className="w-4 h-4 text-[#fbbf24]" />
                            <span>Hermes Autonomous Ship Actions</span>
                          </div>
                          <div className="space-y-2">
                            {proto.hermesAutomatedActions.map((act, i) => (
                              <div
                                key={i}
                                className="text-xs bg-[#0b0e0a] p-3 rounded-md border border-[#2e3b23]/80"
                              >
                                <div className="font-mono font-semibold text-[#fbbf24]">
                                  [{act.subsystem}] {act.actionCode} (
                                  {act.executionLatencyMs}ms)
                                </div>
                                <div className="text-xs text-[#a8baa0] mt-0.5">
                                  {act.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Step-by-Step Clinical & Operational Checklist */}
                      <div className="space-y-2.5">
                        <div className="text-xs font-semibold text-white">
                          Step-by-Step Astronaut Execution Checklist
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {proto.stepByStepGuide.map((step) => (
                            <div
                              key={step.stepNumber}
                              className="bg-[#13190e]/60 p-3.5 rounded-lg border border-[#2e3b23]/90 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#fbbf24]">
                                  {step.stepNumber}. {step.phase}
                                </span>
                                {step.timeTarget && (
                                  <span className="font-mono text-[11px] text-[#8ea873]">
                                    {step.timeTarget}
                                  </span>
                                )}
                              </div>
                              <div className="font-medium text-white">
                                {step.action}
                              </div>
                              <p className="text-[#8ea873] text-xs leading-relaxed">
                                {step.clinicalDetail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Medications & Contraindications */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-[#13190e]/60 p-4 rounded-lg border border-[#2e3b23]/90 space-y-2">
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <Pill className="w-4 h-4 text-[#fbbf24]" />
                            <span>Space Medical Kit Countermeasures</span>
                          </div>
                          <div className="space-y-1.5 text-xs">
                            {proto.medicationsRequired.map((med, idx) => (
                              <div
                                key={idx}
                                className="bg-[#0b0e0a] p-2.5 rounded-md border border-[#2e3b23]/80"
                              >
                                <span className="font-medium text-white">
                                  {med.name}
                                </span>{" "}
                                —{" "}
                                <span className="text-[#fbbf24] font-mono">
                                  {med.dosage} ({med.route})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#13190e]/60 p-4 rounded-lg border border-red-500/30 space-y-2">
                          <div className="text-xs font-semibold text-red-400 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Microgravity Contraindications</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-[#a8baa0]">
                            {proto.doNotDo.map((warn, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-red-400">•</span>
                                <span>{warn}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

