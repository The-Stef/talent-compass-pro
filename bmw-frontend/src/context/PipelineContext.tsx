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
import { toast } from "sonner";

// 🔐 LocalStorage keys
const LS_KEYS = {
  employees: "bmw_raw_employees",
  roles: "bmw_raw_roles",
  pipeline: "bmw_pipeline_data",
};

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
  loadRawData: () => Promise<void>;
  runAnalysis: (params?: RunPipelineRequest) => Promise<void>;
  refreshData: () => Promise<void>;
}

const EMPTY_EXEC_SUMMARY: ExecutiveSummaryData = {
  pipelineHealth: 0,
  pipelineHealthLabel: "Not assessed",
  totalForecastedRoles: 0,
  urgentRoles: 0,
  internalReady: 0,
  externalRequired: 0,
  hybridApproach: 0,
  topRisks: [],
  hiddenTalent: [],
  analysisTimestamp: null,
  executiveSummaryText: "",
};

const PipelineContext = createContext<PipelineState | undefined>(undefined);

async function fetchRawData() {
  const [empRes, roleRes] = await Promise.all([getEmployees(), getRoles()]);

  const employees = empRes?.employees ?? empRes?.data ?? empRes ?? null;
  const roles = roleRes?.roles ?? roleRes?.data ?? roleRes ?? null;

  return { employees, roles };
}

function parsePipelineResponse(pipelineData: any, rawEmployees: any[], rawRoles: any[]) {
  const agents = pipelineData?.data?.agents ?? pipelineData?.agents ?? pipelineData ?? {};

  const pipelineRoles = agents?.role_forecast?.prioritized_roles ?? [];
  const pipelineTrajectories = agents?.employee_trajectories?.employee_trajectories ?? [];

  return {
    forecastedRoles: mapForecastedRolesFromRaw(rawRoles, pipelineRoles),
    employeeTrajectories: mapEmployeeTrajectoriesFromRaw(rawEmployees, pipelineTrajectories),
    roleMatches: mapRoleMatches(agents?.role_matches?.role_matches ?? []),
    developmentInterventions: mapDevelopmentInterventions(agents?.development_plans?.development_plans ?? []),
    executiveDecisions: mapExecutiveDecisions(agents?.final_decision?.decisions ?? []),
    executiveSummary: deriveExecutiveSummary(
      rawRoles,
      agents?.role_matches?.role_matches ?? [],
      agents?.final_decision?.decisions ?? [],
      agents?.final_decision
    ),
  };
}

export function PipelineProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    forecastedRoles: [],
    employeeTrajectories: [],
    roleMatches: [],
    developmentInterventions: [],
    executiveDecisions: [],
    executiveSummary: EMPTY_EXEC_SUMMARY,
    isLoading: false,
    isRunning: false,
    error: null,
  });

  const [rawEmployees, setRawEmployees] = useState<any[]>([]);
  const [rawRoles, setRawRoles] = useState<any[]>([]);
  const [pipelineData, setPipelineData] = useState<any>(null);

  // ✅ LOAD FROM LOCAL STORAGE ON START
  useEffect(() => {
    const storedEmployees = localStorage.getItem(LS_KEYS.employees);
    const storedRoles = localStorage.getItem(LS_KEYS.roles);
    const storedPipeline = localStorage.getItem(LS_KEYS.pipeline);

    if (storedEmployees && storedRoles) {
      const employees = JSON.parse(storedEmployees);
      const roles = JSON.parse(storedRoles);
      const pipeline = storedPipeline ? JSON.parse(storedPipeline) : null;

      setRawEmployees(employees);
      setRawRoles(roles);
      setPipelineData(pipeline);

      const parsed = parsePipelineResponse(pipeline ?? {}, employees, roles);

      setState((s) => ({
        ...s,
        ...parsed,
      }));
    }
  }, []);

  const loadRawData = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));

    try {
      const { employees, roles } = await fetchRawData();

      setRawEmployees(employees);
      setRawRoles(roles);

      // 💾 save
      localStorage.setItem(LS_KEYS.employees, JSON.stringify(employees));
      localStorage.setItem(LS_KEYS.roles, JSON.stringify(roles));

      const parsed = parsePipelineResponse(pipelineData ?? {}, employees, roles);

      setState((s) => ({ ...s, ...parsed, isLoading: false }));

      toast.success("Data loaded");
    } catch (err) {
      setState((s) => ({ ...s, isLoading: false }));
      toast.error("Failed to load data");
    }
  }, [pipelineData]);

  const runAnalysis = useCallback(async (params: RunPipelineRequest = {}) => {
    setState((s) => ({ ...s, isRunning: true }));

    try {
      const result = await runPipeline(params);

      setPipelineData(result);

      // 💾 save pipeline
      localStorage.setItem(LS_KEYS.pipeline, JSON.stringify(result));

      const parsed = parsePipelineResponse(result, rawEmployees, rawRoles);

      setState((s) => ({ ...s, ...parsed, isRunning: false }));

      toast.success("Analysis complete");
    } catch {
      setState((s) => ({ ...s, isRunning: false }));
      toast.error("Analysis failed");
    }
  }, [rawEmployees, rawRoles]);

  const refreshData = useCallback(async () => {
    await loadRawData();
  }, [loadRawData]);

  return (
    <PipelineContext.Provider
      value={{
        ...state,
        loadRawData,
        runAnalysis,
        refreshData,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipeline() {
  const ctx = useContext(PipelineContext);
  if (!ctx) throw new Error("usePipeline must be used within PipelineProvider");
  return ctx;
}