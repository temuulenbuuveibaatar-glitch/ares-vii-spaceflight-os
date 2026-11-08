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
    <div className="py-10 bg-zinc-950 text-zinc-100 min-h-screen">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header — Rule 9, 10, 11, 16 */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-zinc-800/80 pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-orange-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>
                NASA-STD-3001 · Roscosmos IBMP · CMSA · Interkosmos Mongolia ·
                ESA · JAXA
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
              Microgravity & Deep-Space Emergency Procedures
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Step-by-step clinical and flight checklists paired with Xiaomi
              Watch H1 biomarker thresholds and Hermes autonomous ship actions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link href="/world-agencies">
              <button className="bg-orange-500 hover:bg-orange-400 text-zinc-950 px-4 py-2.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer">
                <Globe className="w-4 h-4" />
                <span>28 Space Agencies Archive</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/space-encyclopedia">
              <button className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 px-3.5 py-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer">
                <Pill className="w-4 h-4 text-orange-500" />
                <span>0G Pharmacology</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search procedure (0G CPR, depressurization, SPE storm shelter, EVA helmet water, SANS, jugular thrombosis)..."
              className="w-full bg-zinc-900 text-zinc-100 text-sm pl-10 pr-4 py-2.5 rounded-lg border border-zinc-800 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer border ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-zinc-950 border-orange-500"
                    : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white"
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
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/60"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono text-orange-400 font-medium">
                          {proto.codeName}
                        </span>
                        <span className="text-zinc-500">·</span>
                        <span className="text-zinc-400 capitalize">
                          {proto.category.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {proto.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        {proto.shortDescription}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 self-end sm:self-center text-xs font-medium text-orange-400 shrink-0">
                      <span>{isExpanded ? "Hide" : "View Procedure"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-6 pt-4 border-t border-zinc-800/80 space-y-5 bg-zinc-950 surface-enter">
                      {/* Space Physiological Mechanism */}
                      <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-800/90 space-y-1">
                        <div className="text-xs font-semibold text-orange-400">
                          Spaceflight Pathophysiology
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {proto.spaceMechanism}
                        </p>
                      </div>

                      {/* Xiaomi Watch H1 Triggers & Hermes AI Automated Response */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-800/90 space-y-2.5">
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <Watch className="w-4 h-4 text-orange-500" />
                            <span>Xiaomi Watch H1 Biomarker Triggers</span>
                          </div>
                          <div className="space-y-2">
                            {proto.watchTriggers.map((trig, i) => (
                              <div
                                key={i}
                                className="text-xs bg-zinc-950 p-3 rounded-md border border-zinc-800/80"
                              >
                                <div className="font-semibold text-white">
                                  {trig.metric}:{" "}
                                  <span className="font-mono text-orange-400">
                                    {trig.threshold}
                                  </span>
                                </div>
                                <div className="text-xs text-zinc-400 mt-0.5">
                                  {trig.sensorSource} — {trig.clinicalMeaning}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-800/90 space-y-2.5">
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <Bot className="w-4 h-4 text-orange-500" />
                            <span>Hermes Autonomous Ship Actions</span>
                          </div>
                          <div className="space-y-2">
                            {proto.hermesAutomatedActions.map((act, i) => (
                              <div
                                key={i}
                                className="text-xs bg-zinc-950 p-3 rounded-md border border-zinc-800/80"
                              >
                                <div className="font-mono font-semibold text-orange-400">
                                  [{act.subsystem}] {act.actionCode} (
                                  {act.executionLatencyMs}ms)
                                </div>
                                <div className="text-xs text-zinc-300 mt-0.5">
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
                              className="bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-800/90 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-orange-400">
                                  {step.stepNumber}. {step.phase}
                                </span>
                                {step.timeTarget && (
                                  <span className="font-mono text-[11px] text-zinc-400">
                                    {step.timeTarget}
                                  </span>
                                )}
                              </div>
                              <div className="font-medium text-white">
                                {step.action}
                              </div>
                              <p className="text-zinc-400 text-xs leading-relaxed">
                                {step.clinicalDetail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Medications & Contraindications */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-800/90 space-y-2">
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <Pill className="w-4 h-4 text-orange-500" />
                            <span>Space Medical Kit Countermeasures</span>
                          </div>
                          <div className="space-y-1.5 text-xs">
                            {proto.medicationsRequired.map((med, idx) => (
                              <div
                                key={idx}
                                className="bg-zinc-950 p-2.5 rounded-md border border-zinc-800/80"
                              >
                                <span className="font-medium text-white">
                                  {med.name}
                                </span>{" "}
                                —{" "}
                                <span className="text-orange-400 font-mono">
                                  {med.dosage} ({med.route})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 p-4 rounded-lg border border-red-500/30 space-y-2">
                          <div className="text-xs font-semibold text-red-400 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Microgravity Contraindications</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-zinc-300">
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
