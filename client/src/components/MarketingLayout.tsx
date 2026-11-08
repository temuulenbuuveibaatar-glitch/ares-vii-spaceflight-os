import { ReactNode } from "react";
import { Link } from "wouter";
import { Rocket, FileText, Lock, Globe, ArrowRight } from "lucide-react";

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const isLocal = typeof window !== "undefined" && window.location.hostname.includes("localhost");
  const toolUrl = isLocal ? "/app" : "https://sonnenblume-tool.vercel.app";

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e0a] text-[#e3ecd8] selection:bg-[#2e3b23] selection:text-[#fbbf24]">
      {/* SONNENBLUME HEADER */}
      <header className="sticky top-0 z-50 bg-[#0b0e0a]/95 backdrop-blur-md border-b border-[#232d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-3.5 cursor-pointer group">
              <div className="w-10 h-10 rounded-2xl bg-[#182213] border border-[#3f5231] flex items-center justify-center text-2xl shadow-sm shadow-amber-500/10 group-hover:border-[#fbbf24] transition-colors">
                🌻
              </div>
              <div>
                <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
                  <span>Sonnenblume</span>
                  <span className="text-xs bg-[#243319] text-[#fbbf24] border border-[#3f5231] px-2 py-0.5 rounded-lg font-mono font-bold">
                    HEALTH OS
                  </span>
                </div>
                <div className="text-xs text-[#8ea873] hidden sm:block font-medium">
                  Autonomous Spaceflight Health & Helio-Protection
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation Links with Readable Typography */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#c7dfb8]">
            <a href="#who-we-are" className="hover:text-[#fbbf24] transition-colors">
              Who We Are
            </a>
            <a href="#who-its-for" className="hover:text-[#fbbf24] transition-colors">
              Who It's For
            </a>
            <a href="#how-to-use" className="hover:text-[#fbbf24] transition-colors">
              How to Use
            </a>
            <a href="#demo" className="hover:text-[#fbbf24] transition-colors">
              Live Demo
            </a>
            <Link href="/privacy">
              <span className="hover:text-[#fbbf24] transition-colors cursor-pointer flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span>Privacy</span>
              </span>
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <a
              href="/Sonnenblume_Complete_Space_Health_and_Mission_Research_Guide.docx"
              download="Sonnenblume_Space_Health_Research_Guide.docx"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#13190e] hover:bg-[#1a2313] text-[#c7dfb8] border border-[#2e3b23] px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors active:scale-95"
            >
              <FileText className="w-4 h-4 text-[#fbbf24]" />
              <span>Research (.docx)</span>
            </a>

            <a
              href={toolUrl}
              className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0b0e0a] font-black text-sm px-5 py-2.5 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Rocket className="w-4 h-4 text-[#0b0e0a]" />
              <span>Launch Tool ↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* MARKETING BODY */}
      <main className="flex-grow">{children}</main>

      {/* FOOTER */}
      <footer className="border-t border-[#232d1a] bg-[#070906] py-14 text-sm text-[#8ea873]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#1a2313]">
            <div className="space-y-2 max-w-xl">
              <div className="font-bold text-white text-base flex items-center gap-2">
                <span>🌻 Sonnenblume Spaceflight Health OS</span>
              </div>
              <p className="text-[#a8baa0] leading-relaxed text-sm">
                Named after the German word for Sunflower (following the sun and shielding crews from solar radiation). Built for 24/7 crew autonomy during 22-minute communication blackouts to Mars.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/privacy">
                <span className="text-[#8ea873] hover:text-white cursor-pointer font-medium">
                  Privacy Policy
                </span>
              </Link>
              <a
                href={toolUrl}
                className="bg-[#182213] hover:bg-[#28381c] text-[#fbbf24] border border-[#3f5231] px-5 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 cursor-pointer transition-colors active:scale-95"
              >
                <Rocket className="w-4 h-4" />
                <span>Open Operational Cockpit</span>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#556947]">
            <span>Sonnenblume (Sunflower) · Space Health & Autonomous Mission Preservation</span>
            <span>Tactical Olive & Sunflower Gold · Zero Tracking Cookies</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
