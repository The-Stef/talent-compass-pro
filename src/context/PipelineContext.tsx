import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getLastPipeline, runPipeline, getEmployees, getRoles, type RunPipelineRequest } from "@/lib/api";
import {
  mapForecastedRolesFromRaw,
  mapEmployeeTrajectoriesFromRaw,
  mapRoleMatches,
  mapDevelopmentInterventions,
  mapExecutiveDecisions,
  deriveExecutiveSummary,
} from "@/lib/mappers";
import type {
  ForecastedRole,
  EmployeeTrajectory,
  RoleMatch,
  DevelopmentIntervention,
  ExecutiveDecision,
  ExecutiveSummaryData,
} from "@/types/display";
import {
  rawEmployees as demoRawEmployees,
  rawRoles as demoRawRoles,
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

/**
 * Fetch raw data (employees + roles) from the backend.
 * Returns null arrays on failure — callers should fall back gracefully.
 */
async function fetchRawData(): Promise<{ employees: any[] | null; roles: any[] | null }> {
  try {
    const [empRes, roleRes] = await Promise.all([getEmployees(), getRoles()]);
    return {
      employees: Array.isArray(empRes) ? empRes : (empRes?.data ?? empRes?.employees ?? null),
      roles: Array.isArray(roleRes) ? roleRes : (roleRes?.data ?? roleRes?.roles ?? roleRes?.forecasted_roles ?? null),
    };
  } catch {
    return { employees: null, roles: null };
  }
}

/**
 * Parse pipeline API response + raw data into display types.
 *
 * KEY PRINCIPLE:
 *   - Forecasted Roles: raw roles = source of truth, pipeline enriches (urgency, importance)
 *   - Employee Trajectories: raw employees = source of truth, pipeline enriches (scores, velocity)
 *   - Matching, Development, Decisions: pipeline output is the primary source
 */
function parsePipelineResponse(
  pipelineData: any,
  rawEmployees: any[] | null,
  rawRoles: any[] | null
): Omit<PipelineState, "isLoading" | "isRunning" | "error" | "isUsingDemoData" | "runAnalysis" | "refreshData"> {
  const agents = pipelineData?.data?.agents ?? pipelineData?.agents ?? pipelineData;

  const roleForecast = agents?.role_forecast ?? {};
  const trajectories = agents?.employee_trajectories ?? {};
  const matches = agents?.role_matches ?? {};
  const devPlans = agents?.development_plans ?? {};
  const finalDecision = agents?.final_decision ?? {};

  // Pipeline enrichment arrays
  const pipelineRoles = roleForecast?.prioritized_roles ?? roleForecast?.roles ?? roleForecast?.forecasted_roles ?? roleForecast?.data ?? [];
  const pipelineTrajectories = trajectories?.employee_trajectories ?? trajectories?.employees ?? trajectories?.trajectories ?? trajectories?.data ?? [];

  // Forecasted Roles: raw data first, pipeline enriches
  const forecastedRoles = rawRoles && rawRoles.length > 0
    ? mapForecastedRolesFromRaw(rawRoles, pipelineRoles)
    : mapForecastedRolesFromRaw(pipelineRoles); // fallback: use pipeline as raw if no raw data

  // Employee Trajectories: raw data first, pipeline enriches
  const employeeTrajectories = rawEmployees && rawEmployees.length > 0
    ? mapEmployeeTrajectoriesFromRaw(rawEmployees, pipelineTrajectories)
    : mapEmployeeTrajectoriesFromRaw(pipelineTrajectories); // fallback

  // These are purely pipeline-generated — no raw equivalent
  const roleMatches = mapRoleMatches(
    matches?.role_matches ?? matches?.matches ?? matches?.data ?? []
  );

  const developmentInterventions = mapDevelopmentInterventions(
    devPlans?.development_plans ?? devPlans?.interventions ?? devPlans?.plans ?? devPlans?.data ?? []
  );

  const executiveDecisions = mapExecutiveDecisions(
    finalDecision?.decisions ?? finalDecision?.recommendations ?? finalDecision?.data ?? []
  );

  const executiveSummary = deriveExecutiveSummary(forecastedRoles, roleMatches, executiveDecisions, {
    pipeline_health: finalDecision?.pipeline_health ?? matches?.overall_pipeline_health,
    executive_summary: finalDecision?.executive_summary,
    org_risks: finalDecision?.org_risks,
    top_hidden_talent: finalDecision?.top_hidden_talent,
  });

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
      // Fetch raw data and pipeline output in parallel
      const [pipelineResponse, rawData] = await Promise.all([
        getLastPipeline().catch(() => null),
        fetchRawData(),
      ]);

      if (!pipelineResponse || (pipelineResponse?.success === false && !pipelineResponse?.data)) {
        // No pipeline data — if we have raw data, show it without enrichment
        if (rawData.roles?.length || rawData.employees?.length) {
          const parsed = parsePipelineResponse({}, rawData.employees, rawData.roles);
          setState((s) => ({ ...s, ...parsed, isLoading: false, isUsingDemoData: false }));
        } else {
          setState((s) => ({ ...s, isLoading: false, isUsingDemoData: true }));
        }
        return;
      }

      const parsed = parsePipelineResponse(pipelineResponse, rawData.employees, rawData.roles);
      const hasData = parsed.forecastedRoles.length > 0 || parsed.executiveDecisions.length > 0;
      if (hasData) {
        setState((s) => ({ ...s, ...parsed, isLoading: false, isUsingDemoData: false }));
      } else {
        setState((s) => ({ ...s, isLoading: false, isUsingDemoData: true }));
      }
    } catch {
      setState((s) => ({ ...s, isLoading: false, isUsingDemoData: true }));
    }
  }, []);

  const runAnalysis = useCallback(async (params: RunPipelineRequest = {}) => {
    setState((s) => ({ ...s, isRunning: true, error: null }));
    try {
      // Fetch raw data in parallel with running pipeline
      const [pipelineResponse, rawData] = await Promise.all([
        runPipeline(params),
        fetchRawData(),
      ]);

      const parsed = parsePipelineResponse(pipelineResponse, rawData.employees, rawData.roles);
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
