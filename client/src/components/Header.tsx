import { useState } from "react";
import { Link } from "wouter";
import LanguageSelector from "./LanguageSelector";
import HermesAutoSetupLauncher from "./HermesAutoSetupLauncher";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Cpu, Hand, Menu, FileText, Sparkles, Rocket } from "lucide-react";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export default function Header({ toggleMobileMenu }: HeaderProps) {
  const [launcherOpen, setLauncherOpen] = useState(false);

  const { data: overview } = useQuery<any>({
    queryKey: ["/api/mission/overview"],
    refetchInterval: 3000,
  });

  const overrideMutation = useMutation({
    mutationFn: async (engaged: boolean) => {
      const res = await apiRequest("POST", "/api/ship/override", {
        engaged,
        authorizedBy: "Cmdr. Elena Vance",
        reason: engaged
          ? "Manual crew override engaged"
          : "Hermes Autonomous Authority restored",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mission/overview"] });
    },
  });

  const autopilot = overview?.autopilotState;
  const isTakeover = autopilot?.autonomousTakeoverActive;
  const isOverridden = autopilot?.humanOverrideEngaged;

  return (
    <>
      <HermesAutoSetupLauncher
        forceOpen={launcherOpen}
        onClose={() => setLauncherOpen(false)}
      />
      <header className="bg-[#0b0e0a]/95 backdrop-blur-md text-[#e3ecd8] border-b border-[#232d1a] sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-14 gap-4">
            <Link href="/">
              <div className="flex items-center gap-2.5 cursor-pointer">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
                <span className="font-bold text-sm tracking-tight text-white font-mono">
                  ARES-VII
                </span>
                <span className="text-xs text-[#8ea873] hidden sm:inline">
                  Deep-Space Astronaut Health OS
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 bg-[#13190e] border border-[#2e3b23] px-3 py-1.5 rounded-xl">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isTakeover && !isOverridden
                      ? "bg-[#ef4444]"
                      : isOverridden
                      ? "bg-[#fbbf24]"
                      : "bg-[#84a96c]"
                  }`}
                />
                <span className="text-xs text-[#e3ecd8] font-medium font-mono">
                  {isTakeover && !isOverridden
                    ? "Autopilot Active"
                    : isOverridden
                    ? "Manual Override"
                    : "Hermes Armed"}
                </span>
                <button
                  onClick={() => overrideMutation.mutate(!isOverridden)}
                  disabled={overrideMutation.isPending}
                  className="text-xs font-semibold bg-[#1c2615] hover:bg-[#28381c] text-[#fbbf24] px-2.5 py-0.5 rounded-md border border-[#3f5231] cursor-pointer inline-flex items-center gap-1 active:scale-[0.97]"
                >
                  <Hand className="w-3 h-3 text-[#fbbf24]" />
                  <span>
                    {overrideMutation.isPending
                      ? "Updating..."
                      : isOverridden
                      ? "Restore AI"
                      : "Override"}
                  </span>
                </button>
              </div>

              {/* DUAL PORTAL NAVIGATION PILL */}
              <div className="flex items-center gap-1 p-1 bg-[#0b0e0a] border border-[#2e3b23] rounded-xl font-mono text-xs">
                <Link href="/">
                  <span className="flex items-center gap-1.5 bg-[#182213] hover:bg-[#24331c] text-[#a3c988] hover:text-[#fbbf24] border border-[#3f5231] px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors active:scale-[0.97]">
                    <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>Portal 1: Info</span>
                  </span>
                </Link>

                <Link href="/cockpit">
                  <span className="flex items-center gap-1.5 bg-[#28381c] hover:bg-[#354528] text-[#fbbf24] border border-[#4d633b] px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors shadow-sm shadow-amber-500/10 active:scale-[0.97]">
                    <Rocket className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>Portal 2: Cockpit</span>
                  </span>
                </Link>
              </div>

              <a
                href="/ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
                download="ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
                className="hidden lg:flex items-center gap-1.5 bg-[#13190e] hover:bg-[#1a2313] border border-[#2e3b23] px-3 py-1.5 rounded-xl text-xs text-[#c7dfb8] font-medium cursor-pointer transition-colors active:scale-[0.97]"
                title="Download Complete Plain-English & Scientific Research Guide (.docx)"
              >
                <FileText className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span>Research (.docx)</span>
              </a>

              <button
                onClick={() => setLauncherOpen(true)}
                className="hidden md:flex items-center gap-1.5 bg-[#13190e] hover:bg-[#1a2313] border border-[#2e3b23] px-3 py-1.5 rounded-xl text-xs text-[#c7dfb8] font-medium cursor-pointer transition-colors active:scale-[0.97]"
              >
                <Cpu className="w-3.5 h-3.5 text-[#84a96c]" />
                <span>System Check</span>
              </button>

              <LanguageSelector />

              <button
                className="md:hidden p-1.5 text-[#8ea873] hover:text-white rounded-lg hover:bg-[#1a2313]"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
