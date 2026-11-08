import { Link } from "wouter";
import { ShieldCheck, Lock, EyeOff, Server, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
  const isLocal = typeof window !== "undefined" && window.location.hostname.includes("localhost");
  const toolUrl = isLocal ? "/app" : "https://sonnenblume-tool.vercel.app";

  return (
    <div className="min-h-screen bg-[#0b0e0a] text-[#e3ecd8] py-16 px-4 selection:bg-[#2e3b23] selection:text-[#fbbf24]">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* TOP BREADCRUMB */}
        <div>
          <Link href="/">
            <button className="text-sm font-bold text-[#84a96c] hover:text-[#fbbf24] inline-flex items-center gap-2 cursor-pointer transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sonnenblume Overview</span>
            </button>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#182213] border border-[#2e3b23] text-[#fbbf24] font-mono text-xs font-bold mb-4">
            <Lock className="w-4 h-4 text-[#fbbf24]" />
            <span>SPACEFLIGHT CREW PRIVACY CHARTER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Sonnenblume Privacy & Crew Dignity Policy
          </h1>

          <p className="mt-4 text-lg text-[#c7dfb8] leading-relaxed">
            Astronauts avoid mental health apps because mission control monitors their private answers. Sonnenblume guarantees absolute, air-gapped on-device confidentiality.
          </p>
        </div>

        {/* 4 CORE PRIVACY PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1 */}
          <div className="bg-[#13190e] border border-[#2e3b23] rounded-2xl p-7 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#182213] border border-[#3f5231] flex items-center justify-center text-[#fbbf24]">
              <EyeOff className="w-6 h-6 text-[#fbbf24]" />
            </div>
            <h2 className="text-xl font-bold text-white">
              1. Zero Ground Surveillance
            </h2>
            <p className="text-base text-[#a8baa0] leading-relaxed">
              Your voice journal, stress sentiment, and mental therapy conversations with Hermes AI are processed 100% on-device. Audio recordings are never transmitted to Mission Control or stored on Earth.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#13190e] border border-[#2e3b23] rounded-2xl p-7 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#182213] border border-[#3f5231] flex items-center justify-center text-[#84a96c]">
              <Lock className="w-6 h-6 text-[#84a96c]" />
            </div>
            <h2 className="text-xl font-bold text-white">
              2. Encrypted Offline Storage
            </h2>
            <p className="text-base text-[#a8baa0] leading-relaxed">
              All personal biometrics from the Xiaomi Watch H1 and clinical history are stored in an encrypted SQLite / IndexedDB vault inside the spacecraft. Earth flight surgeons only receive anonymized operational readiness scores.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#13190e] border border-[#2e3b23] rounded-2xl p-7 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#182213] border border-[#3f5231] flex items-center justify-center text-[#fbbf24]">
              <Server className="w-6 h-6 text-[#fbbf24]" />
            </div>
            <h2 className="text-xl font-bold text-white">
              3. No Cloud Trackers or Ad Cookies
            </h2>
            <p className="text-base text-[#a8baa0] leading-relaxed">
              Sonnenblume has zero commercial analytics, zero advertising cookies, and zero third-party telemetry beacons. The system operates entirely air-gapped on deep-space exploration computers.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-[#13190e] border border-[#2e3b23] rounded-2xl p-7 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#182213] border border-[#3f5231] flex items-center justify-center text-[#84a96c]">
              <ShieldCheck className="w-6 h-6 text-[#84a96c]" />
            </div>
            <h2 className="text-xl font-bold text-white">
              4. Complete Crew Data Shredding
            </h2>
            <p className="text-base text-[#a8baa0] leading-relaxed">
              Any astronaut can securely erase their private therapy notes and personal voice journal at any time with a single tap. Once wiped, the cryptographic key is destroyed permanently.
            </p>
          </div>
        </div>

        {/* SUMMARY TABLE */}
        <div className="bg-[#13190e] border border-[#2e3b23] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white">
            What Mission Control Sees vs. What Stays Private
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#232d1a] text-[#8ea873] font-mono text-xs">
                  <th className="pb-3 font-bold uppercase">Data Category</th>
                  <th className="pb-3 font-bold uppercase">Sent to Houston / Ground Control?</th>
                  <th className="pb-3 font-bold uppercase">Crew Protection Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232d1a] text-base">
                <tr>
                  <td className="py-4 font-bold text-white">Hermes Voice Therapy & Mental Health Journal</td>
                  <td className="py-4 text-[#ef4444] font-semibold">NEVER (Zero Transmission)</td>
                  <td className="py-4 text-[#84a96c] font-semibold">100% On-Device Encrypted</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-white">Heart Rate, SpO2 & Blood Pressure</td>
                  <td className="py-4 text-[#fbbf24] font-semibold">Aggregated Summary Only</td>
                  <td className="py-4 text-[#84a96c] font-semibold">De-identified Telemetry</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-white">Life-Threatening Emergency Alarms</td>
                  <td className="py-4 text-[#84a96c] font-semibold">Instant Emergency Broadcast</td>
                  <td className="py-4 text-[#fbbf24] font-semibold">Life-Support Override</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-white">Radiation Dose & Space Weather</td>
                  <td className="py-4 text-[#84a96c] font-semibold">Downlinked for Fleet Safety</td>
                  <td className="py-4 text-[#84a96c] font-semibold">Public Science Log</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM ACTION */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#182213] to-[#11160e] border border-[#3f5231] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white">
              Ready to Explore Sonnenblume?
            </h3>
            <p className="text-base text-[#a8baa0] mt-1">
              Launch the live spaceflight health monitoring cockpit now.
            </p>
          </div>

          <a
            href={toolUrl}
            className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#0b0e0a] font-bold text-base px-8 py-4 rounded-xl cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-center shrink-0"
          >
            Launch Sonnenblume Tool ↗
          </a>
        </div>
      </div>
    </div>
  );
}
