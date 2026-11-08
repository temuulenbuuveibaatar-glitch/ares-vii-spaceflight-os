import { Link, useLocation } from "wouter";
import { navigationItems } from "../data/navigationItems";

interface NavigationProps {
  isMobileMenuOpen: boolean;
}

export default function Navigation({ isMobileMenuOpen }: NavigationProps) {
  const [location] = useLocation();

  return (
    <nav className="bg-[#0b0e0a] text-[#8ea873] border-b border-[#232d1a]">
      <div className="container mx-auto px-4">
        <div className="hidden md:flex items-center h-11 gap-1 overflow-x-auto">
          {navigationItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors active:scale-[0.97] ${
                    isActive
                      ? "bg-[#182213] text-[#fbbf24] border border-[#3f5231] font-bold shadow-sm shadow-amber-500/10"
                      : "text-[#8ea873] hover:text-[#e3ecd8] hover:bg-[#13190e] border border-transparent"
                  }`}
                >
                  {item.defaultLabel}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
