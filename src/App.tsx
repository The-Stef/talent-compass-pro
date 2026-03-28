import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PipelineProvider } from "@/context/PipelineContext";
import Index from "./pages/Index.tsx";
import ForecastedRoles from "./pages/ForecastedRoles.tsx";
import EmployeeTrajectories from "./pages/EmployeeTrajectories.tsx";
import RoleMatching from "./pages/RoleMatching.tsx";
import DevelopmentPlans from "./pages/DevelopmentPlans.tsx";
import ExecutiveDecisions from "./pages/ExecutiveDecisions.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PipelineProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/roles" element={<ForecastedRoles />} />
            <Route path="/trajectories" element={<EmployeeTrajectories />} />
            <Route path="/matching" element={<RoleMatching />} />
            <Route path="/development" element={<DevelopmentPlans />} />
            <Route path="/decisions" element={<ExecutiveDecisions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PipelineProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
