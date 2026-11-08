import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#0b0e0a] text-[#8ea873] border-t border-[#232d1a] py-10 text-xs">
      <div className="container mx-auto px-4 space-y-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm font-mono">
              <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
              <span>SONNENBLUME SPACE HEALTH OS</span>
            </div>
            <p className="text-[#8ea873] leading-relaxed">
              Real-time space weather, historical mission failure analysis,
              28-nation biomedical countermeasures, Xiaomi Watch H1 telemetry,
              and NASA GMAT / Orbiter flight simulation.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-[#c7dfb8] font-mono text-xs">CORE FLIGHT STATIONS</div>
            <ul className="space-y-1.5 text-[#8ea873]">
              <li>
                <Link href="/app">
                  <span className="hover:text-white cursor-pointer">
                    Mission Cockpit & Telemetry
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/world-agencies">
                  <span className="hover:text-white cursor-pointer">
                    28 World Space Agencies Archive
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/gmat-orbiter">
                  <span className="hover:text-white cursor-pointer">
                    NASA GMAT & Orbiter Simulator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/xiaomi-watch">
                  <span className="hover:text-white cursor-pointer">
                    Xiaomi Watch H1 Telemetry
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-[#c7dfb8] font-mono text-xs">AGENCY STANDARDS</div>
            <ul className="space-y-1.5 text-[#8ea873]">
              <li>NASA-STD-3001 (Apollo, Skylab, ISS, Artemis)</li>
              <li>USSR / Roscosmos IBMP (Salyut, Mir, Chibis, Indralin)</li>
              <li>Mongolia Interkosmos (Soyuz-39 / Salyut-6 J. Gürragchaa)</li>
              <li>China CMSA / ACC (Tiangong, Shenzhou, Chang'e-4 LND)</li>
              <li>ESA Matroshka & JAXA Kibo Countermeasures</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-[#c7dfb8] font-mono text-xs">RUNTIME STACK</div>
            <ul className="space-y-1.5 text-[#8ea873]">
              <li>NOAA SWPC & NORAD 25544 Live Orbital Feeds</li>
              <li>GMAT R2026a & Orbiter 2016/2024 Native Export</li>
              <li>Rust 64-bit RK4/J2 Propagator & Tauri Desktop</li>
              <li>Supabase PostgreSQL & Xiaomi Watch H1 BLE</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1a2313] flex flex-wrap items-center justify-between gap-4 text-[#556947] font-mono text-[11px]">
          <span>Sonnenblume Spaceflight Health & Mission Preservation</span>
          <span>Tactical Olive & Flight Amber · Emil Kowalski 20 UI Polish Rules</span>
        </div>
      </div>
    </footer>
  );
}
