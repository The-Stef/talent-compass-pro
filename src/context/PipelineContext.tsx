import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getLastPipeline, runPipeline, type RunPipelineRequest } from "@/lib/api";
import {
  mapForecastedRoles,
  mapEmployeeTrajectories,
  mapRoleMatches,
  mapDevelopmentInterventions,
  mapExecutiveDecisions,
  deriveExecutiveSummary,
  type ExecutiveSummaryData,
} from "@/lib/mappers";
import type {
  ForecastedRole,
  EmployeeTrajectory,
  RoleMatch,
  DevelopmentIntervention,
  ExecutiveDecision,
} from "@/data/demo-data";
import {
  forecastedRoles as demoRoles,
  employeeTrajectories as demoTrajectories,
  roleMatches as demoMatches,
  developmentInterventions as demoInterventions,
  executiveDecisions as demoDecisions,
  executiveSummary as demoSummary,
} from "@/data/demo-data";
import { toast } from "sonner";

interface PipelineState {
  forecastedRoles: ForecastedRole[];
  employeeTrajectories: EmployeeTrajectory[];
  roleMatches: RoleMatch[];
  developmentInterventions: DevelopmentIntervention[];
  executiveDecisions: ExecutiveDecision[];
  executiveSummary: ExecutiveSummaryData;
  isLoading: boolean;
  isRunning: boolean;
  error: string | null;
  isUsingDemoData: boolean;
  runAnalysis: (params?: RunPipelineRequest) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PipelineContext = createContext<PipelineState | undefined>(undefined);

function parsePipelineResponse(data: any): Omit<PipelineState, "isLoading" | "isRunning" | "error" | "isUsingDemoData" | "runAnalysis" | "refreshData"> {
  const agents = data?.data?.agents ?? data?.agents ?? data;

  const roleForecast = agents?.role_forecast ?? agents?.roleForecast ?? {};
  const trajectories = agents?.employee_trajectories ?? agents?.employeeTrajectories ?? {};
  const matches = agents?.role_matches ?? agents?.roleMatches ?? {};
  const devPlans = agents?.development_plans ?? agents?.developmentPlans ?? {};
  const finalDecision = agents?.final_decision ?? agents?.finalDecision ?? {};

  const forecastedRoles = mapForecastedRoles(
    roleForecast?.roles ?? roleForecast?.forecasted_roles ?? roleForecast?.data ?? []
  );
  const employeeTrajectories = mapEmployeeTrajectories(
    trajectories?.employees ?? trajectories?.trajectories ?? trajectories?.data ?? []
  );
  const roleMatches = mapRoleMatches(
    matches?.matches ?? matches?.role_matches ?? matches?.data ?? []
  );
  const developmentInterventions = mapDevelopmentInterventions(
    devPlans?.interventions ?? devPlans?.plans ?? devPlans?.data ?? []
  );
  const executiveDecisions = mapExecutiveDecisions(
    finalDecision?.decisions ?? finalDecision?.recommendations ?? finalDecision?.data ?? []
  );

  const executiveSummary = deriveExecutiveSummary(forecastedRoles, roleMatches, executiveDecisions);

  // Override with backend summary fields if present
  const backendSummary = finalDecision?.summary ?? finalDecision?.executive_summary ?? {};
  if (backendSummary.pipeline_health != null) executiveSummary.pipelineHealth = backendSummary.pipeline_health;
  if (backendSummary.top_risks) executiveSummary.topRisks = backendSummary.top_risks;
  if (backendSummary.hidden_talent) executiveSummary.hiddenTalent = backendSummary.hidden_talent;

  return { forecastedRoles, employeeTrajectories, roleMatches, developmentInterventions, executiveDecisions, executiveSummary };
}

export function PipelineProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    forecastedRoles: ForecastedRole[];
    employeeTrajectories: EmployeeTrajectory[];
    roleMatches: RoleMatch[];
    developmentInterventions: DevelopmentIntervention[];
    executiveDecisions: ExecutiveDecision[];
    executiveSummary: ExecutiveSummaryData;
    isLoading: boolean;
    isRunning: boolean;
    error: string | null;
    isUsingDemoData: boolean;
  }>({
    forecastedRoles: demoRoles,
    employeeTrajectories: demoTrajectories,
    roleMatches: demoMatches,
    developmentInterventions: demoInterventions,
    executiveDecisions: demoDecisions,
    executiveSummary: demoSummary,
    isLoading: true,
    isRunning: false,
    error: null,
    isUsingDemoData: true,
  });

  const loadLastPipeline = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const response = await getLastPipeline();
      if (response?.success === false && !response?.data) {
        // No previous results — keep demo data
        setState((s) => ({ ...s, isLoading: false, isUsingDemoData: true }));
        return;
      }
      const parsed = parsePipelineResponse(response);
      const hasData = parsed.forecastedRoles.length > 0 || parsed.executiveDecisions.length > 0;
      if (hasData) {
        setState((s) => ({ ...s, ...parsed, isLoading: false, isUsingDemoData: false }));
      } else {
        setState((s) => ({ ...s, isLoading: false, isUsingDemoData: true }));
      }
    } catch {
      // Backend unavailable — silently fall back to demo data
      setState((s) => ({ ...s, isLoading: false, isUsingDemoData: true }));
    }
  }, []);

  const runAnalysis = useCallback(async (params: RunPipelineRequest = {}) => {
    setState((s) => ({ ...s, isRunning: true, error: null }));
    try {
      const response = await runPipeline(params);
      const parsed = parsePipelineResponse(response);
      setState((s) => ({ ...s, ...parsed, isRunning: false, isUsingDemoData: false }));
      toast.success("Analysis complete — data updated across all views");
    } catch (err: any) {
      const msg = err?.message ?? "Failed to run analysis";
      setState((s) => ({ ...s, isRunning: false, error: msg }));
      toast.error("Analysis failed", { description: msg });
    }
  }, []);

  useEffect(() => {
    loadLastPipeline();
  }, [loadLastPipeline]);

  return (
    <PipelineContext.Provider value={{ ...state, runAnalysis, refreshData: loadLastPipeline }}>
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipeline() {
  const ctx = useContext(PipelineContext);
  if (!ctx) throw new Error("usePipeline must be used within PipelineProvider");
  return ctx;
}
