import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./contexts/LanguageContext";
import { queryClient } from "./lib/queryClient";
import Layout from "./components/Layout";
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

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/intro" component={Intro} />
        <Route path="/hermes" component={HermesCommand} />
        <Route path="/world-agencies" component={WorldSpaceAgenciesHub} />
        <Route path="/gmat-orbiter" component={GmatOrbiterBridge} />
        <Route path="/xiaomi-watch" component={XiaomiWatchHub} />
        <Route path="/space-encyclopedia" component={SpaceRadiationAndMeds} />
        <Route path="/cloud-desktop" component={CloudAndDesktopHub} />
        <Route path="/emergency" component={EmergencyProtocols} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
