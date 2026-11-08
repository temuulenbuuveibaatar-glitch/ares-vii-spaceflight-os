import { ReactNode, useState } from "react";
import { Link } from "wouter";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";
import EmergencyBanner from "./EmergencyBanner";
import RealTimeTelemetryMathBar from "./RealTimeTelemetryMathBar";
import HermesFloatingAgent from "./HermesFloatingAgent";
import { navigationItems } from "../data/navigationItems";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e0a] text-zinc-100">
      <RealTimeTelemetryMathBar />
      <Header toggleMobileMenu={toggleMobileMenu} />
      <Navigation isMobileMenuOpen={isMobileMenuOpen} />

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0b0e0a] text-zinc-100 border-b border-[#2e3b23] surface-enter">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navigationItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg text-sm font-medium text-[#a8baa0] hover:text-white hover:bg-[#13190e] cursor-pointer"
                >
                  {item.defaultLabel}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <EmergencyBanner />

      <main className="flex-grow bg-[#0b0e0a]">{children}</main>

      <HermesFloatingAgent />
      <Footer />
    </div>
  );
}

