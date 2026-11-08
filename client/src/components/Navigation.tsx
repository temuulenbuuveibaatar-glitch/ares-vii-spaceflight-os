import { Link, useLocation } from "wouter";
import { navigationItems } from "../data/navigationItems";

interface NavigationProps {
  isMobileMenuOpen: boolean;
}

export default function Navigation({ isMobileMenuOpen }: NavigationProps) {
  const [location] = useLocation();

  return (
    <nav className="bg-zinc-950 text-zinc-400 border-b border-zinc-800/80">
      <div className="container mx-auto px-4">
        <div className="hidden md:flex items-center h-11 gap-1 overflow-x-auto">
          {navigationItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent"
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
