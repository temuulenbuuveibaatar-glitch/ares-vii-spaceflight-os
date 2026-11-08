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
      <header className="bg-zinc-950/95 backdrop-blur-sm text-zinc-100 border-b border-zinc-800/80 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-14 gap-4">
            <Link href="/">
              <div className="flex items-center gap-2.5 cursor-pointer">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="font-semibold text-sm tracking-tight text-white">
                  ARES-VII
                </span>
                <span className="text-xs text-zinc-400 hidden sm:inline">
                  Spaceflight Health & Mission Prevention
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isTakeover && !isOverridden
                      ? "bg-red-500"
                      : isOverridden
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
                <span className="text-xs text-zinc-200 font-medium">
                  {isTakeover && !isOverridden
                    ? "Hermes Autopilot Active"
                    : isOverridden
                    ? "Manual Override"
                    : "Hermes Armed"}
                </span>
                <button
                  onClick={() => overrideMutation.mutate(!isOverridden)}
                  disabled={overrideMutation.isPending}
                  className="text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-2.5 py-0.5 rounded-md border border-zinc-700 cursor-pointer inline-flex items-center gap-1"
                >
                  <Hand className="w-3 h-3 text-orange-400" />
                  <span>
                    {overrideMutation.isPending
                      ? "Updating..."
                      : isOverridden
                      ? "Restore AI"
                      : "Override"}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-[#0b0e0a] border border-[#2d3b22] rounded-xl font-mono">
                <Link href="/">
                  <span className="flex items-center gap-1.5 bg-[#182213] hover:bg-[#24331c] text-[#a3c988] hover:text-[#fbbf24] border border-[#3f5231] px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all">
                    <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>Portal 1: Info</span>
                  </span>
                </Link>

                <Link href="/cockpit">
                  <span className="flex items-center gap-1.5 bg-[#28381c] hover:bg-[#354528] text-[#fbbf24] border border-[#4d633b] px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-sm shadow-amber-500/10">
                    <Rocket className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>Portal 2: Cockpit</span>
                  </span>
                </Link>
              </div>

              <a
                href="/ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
                download="ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
                className="hidden lg:flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs text-zinc-200 font-medium cursor-pointer"
                title="Download Complete Plain-English & Scientific Research Guide (.docx)"
              >
                <FileText className="w-3.5 h-3.5 text-orange-500" />
                <span>Research Guide (.docx)</span>
              </a>

              <button
                onClick={() => setLauncherOpen(true)}
                className="hidden md:flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs text-zinc-200 font-medium cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-orange-500" />
                <span>System Check</span>
              </button>

              <LanguageSelector />

              <button
                className="md:hidden p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-900"
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
