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
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <RealTimeTelemetryMathBar />
      <Header toggleMobileMenu={toggleMobileMenu} />
      <Navigation isMobileMenuOpen={isMobileMenuOpen} />

      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 text-zinc-100 border-b border-zinc-800 surface-enter">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navigationItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 cursor-pointer"
                >
                  {item.defaultLabel}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <EmergencyBanner />

      <main className="flex-grow bg-zinc-950">{children}</main>

      <HermesFloatingAgent />
      <Footer />
    </div>
  );
}
