import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./contexts/LanguageContext";
import { queryClient } from "./lib/queryClient";
import MarketingLayout from "./components/MarketingLayout";
import CockpitLayout from "./components/CockpitLayout";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import HermesCommand from "./pages/HermesCommand";
import WorldSpaceAgenciesHub from "./pages/WorldSpaceAgenciesHub";
import XiaomiWatchHub from "./pages/XiaomiWatchHub";
import SpaceRadiationAndMeds from "./pages/SpaceRadiationAndMeds";
import GmatOrbiterBridge from "./pages/GmatOrbiterBridge";
import CloudAndDesktopHub from "./pages/CloudAndDesktopHub";
import EmergencyProtocols from "./pages/EmergencyProtocols";
import Intro from "./pages/Intro";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function RootDispatcher() {
  const isToolHost =
    typeof window !== "undefined" &&
    window.location.hostname.toLowerCase().includes("tool");

  if (isToolHost) {
    return (
      <CockpitLayout>
        <Home />
      </CockpitLayout>
    );
  }

  return (
    <MarketingLayout>
      <Intro />
    </MarketingLayout>
  );
}

function Router() {
  return (
    <Switch>
      {/* ROOT ROUTE: DYNAMIC DISPATCH BY HOSTNAME */}
      <Route path="/" component={RootDispatcher} />

      {/* MARKETING PORTAL (sonnenblume-marketing.vercel.app) */}
      <Route path="/intro">
        <MarketingLayout>
          <Intro />
        </MarketingLayout>
      </Route>
      <Route path="/info">
        <MarketingLayout>
          <Intro />
        </MarketingLayout>
      </Route>
      <Route path="/demo">
        <MarketingLayout>
          <Intro />
        </MarketingLayout>
      </Route>
      <Route path="/marketing">
        <MarketingLayout>
          <Intro />
        </MarketingLayout>
      </Route>
      <Route path="/privacy">
        <MarketingLayout>
          <PrivacyPolicy />
        </MarketingLayout>
      </Route>

      {/* SITE 2: 24/7 OPERATIONAL SPACEFLIGHT HEALTH OS & FLIGHT COCKPIT */}
      <Route path="/app">
        <CockpitLayout>
          <Home />
        </CockpitLayout>
      </Route>
      <Route path="/cockpit">
        <CockpitLayout>
          <Home />
        </CockpitLayout>
      </Route>
      <Route path="/flight-os">
        <CockpitLayout>
          <Home />
        </CockpitLayout>
      </Route>
      <Route path="/monitor">
        <CockpitLayout>
          <Home />
        </CockpitLayout>
      </Route>

      {/* OPERATIONAL FLIGHT STATIONS */}
      <Route path="/hermes">
        <CockpitLayout>
          <HermesCommand />
        </CockpitLayout>
      </Route>
      <Route path="/world-agencies">
        <CockpitLayout>
          <WorldSpaceAgenciesHub />
        </CockpitLayout>
      </Route>
      <Route path="/gmat-orbiter">
        <CockpitLayout>
          <GmatOrbiterBridge />
        </CockpitLayout>
      </Route>
      <Route path="/xiaomi-watch">
        <CockpitLayout>
          <XiaomiWatchHub />
        </CockpitLayout>
      </Route>
      <Route path="/space-encyclopedia">
        <CockpitLayout>
          <SpaceRadiationAndMeds />
        </CockpitLayout>
      </Route>
      <Route path="/cloud-desktop">
        <CockpitLayout>
          <CloudAndDesktopHub />
        </CockpitLayout>
      </Route>
      <Route path="/emergency">
        <CockpitLayout>
          <EmergencyProtocols />
        </CockpitLayout>
      </Route>

      <Route>
        <CockpitLayout>
          <NotFound />
        </CockpitLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
