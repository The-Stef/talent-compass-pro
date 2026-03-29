import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PipelineProvider } from "@/context/PipelineContext";

import Index from "./pages/Index";
import ForecastedRoles from "./pages/ForecastedRoles";
import EmployeeTrajectories from "./pages/EmployeeTrajectories";
import RoleMatching from "./pages/RoleMatching";
import DevelopmentPlans from "./pages/DevelopmentPlans";
import ExecutiveDecisions from "./pages/ExecutiveDecisions";
import DataManagement from "./pages/DataManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PipelineProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/roles" element={<ForecastedRoles />} />
            <Route path="/trajectories" element={<EmployeeTrajectories />} />
            <Route path="/matching" element={<RoleMatching />} />
            <Route path="/development" element={<DevelopmentPlans />} />
            <Route path="/decisions" element={<ExecutiveDecisions />} />
            <Route path="/manage-data" element={<DataManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PipelineProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
