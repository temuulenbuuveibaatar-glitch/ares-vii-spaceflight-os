import { ReactNode } from "react";
import { Link } from "wouter";
import { Rocket, FileText, Sparkles, ExternalLink, ShieldCheck, Globe, Activity } from "lucide-react";

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e0a] text-[#e3ecd8] selection:bg-[#2e3b23] selection:text-[#fbbf24]">
      {/* STANDALONE PRESENTATION HEADER */}
      <header className="sticky top-0 z-50 bg-[#0b0e0a]/90 backdrop-blur-md border-b border-[#232d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-xl bg-[#182213] border border-[#3f5231] flex items-center justify-center text-[#fbbf24] shadow-sm shadow-amber-500/10 group-hover:border-[#fbbf24] transition-colors">
                <Sparkles className="w-4 h-4 text-[#fbbf24]" />
              </div>
              <div>
                <div className="font-bold font-mono text-sm tracking-tight text-white flex items-center gap-2">
                  <span>ARES-VII</span>
                  <span className="text-[10px] bg-[#243319] text-[#a3c988] border border-[#3f5231] px-1.5 py-0.2 rounded font-mono font-bold">
                    WINNER SPEC
                  </span>
                </div>
                <div className="text-[11px] text-[#8ea873] hidden sm:block">
                  NASA Space Apps Challenge 2026 Global Showcase
                </div>
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-medium text-[#8ea873]">
            <a href="#why-it-matters" className="hover:text-white transition-colors">
              Why It Matters
            </a>
            <a href="#four-hazards" className="hover:text-white transition-colors">
              The 4 Hazards
            </a>
            <a href="#who-its-for" className="hover:text-white transition-colors">
              Who It's For
            </a>
            <a href="#real-flight-data" className="hover:text-white transition-colors">
              Real Flight Data
            </a>
            <a href="#seo-verification" className="hover:text-white transition-colors">
              SEO & Evidence
            </a>
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <a
              href="/ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              download="ARES-VII_Complete_Space_Health_and_Mission_Research_Guide.docx"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#13190e] hover:bg-[#1a2313] text-[#c7dfb8] border border-[#2e3b23] px-3.5 py-2 rounded-xl transition-colors active:scale-[0.97]"
              title="Download 53.5 KB Plain-English & Scientific Research Handbook (.docx)"
            >
              <FileText className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>Research (.docx)</span>
            </a>

            <Link href="/app">
              <button className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0b0e0a] font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-500/10 active:scale-[0.97] transition-all">
                <Rocket className="w-3.5 h-3.5 text-[#0b0e0a]" />
                <span>LAUNCH OPERATIONAL OS</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* MARKETING PAGE BODY */}
      <main className="flex-grow">{children}</main>

      {/* STANDALONE PRESENTATION FOOTER */}
      <footer className="border-t border-[#232d1a] bg-[#070906] py-14 text-xs font-mono text-[#8ea873]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#1a2313]">
            <div className="space-y-2 max-w-lg">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#fbbf24]" />
                <span>ARES-VII Spaceflight Health & Mission Prevention OS</span>
              </div>
              <p className="text-[#a8baa0] font-sans leading-relaxed text-xs">
                Built to solve the critical gap in long-duration human space exploration: autonomous, real-time clinical evaluation, delay-tolerant Earth synchronization, and zero-G trajectory-coupled G-load ceilings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/app">
                <button className="bg-[#182213] hover:bg-[#28381c] text-[#fbbf24] border border-[#3f5231] px-4 py-2 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors active:scale-[0.97]">
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Open 24/7 Flight Cockpit</span>
                </button>
              </Link>
              <a
                href="https://github.com/temuulenbuuveibaatar-glitch/ares-vii-spaceflight-os"
                target="_blank"
                rel="noreferrer"
                className="bg-[#13190e] hover:bg-[#1a2313] text-[#c7dfb8] border border-[#2e3b23] px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition-colors active:scale-[0.97]"
              >
                <Globe className="w-3.5 h-3.5 text-[#84a96c]" />
                <span>GitHub Source</span>
                <ExternalLink className="w-3 h-3 text-[#6d845e]" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#6d845e]">
            <div>
              NASA Space Apps Challenge 2026 // Global Bio-Astronautics Showcase // MIT License
            </div>
            <div className="flex items-center gap-4">
              <span>NASA-STD-3001</span>
              <span>•</span>
              <span>MIL-STD-810H</span>
              <span>•</span>
              <span>28 Nations Coalition</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
