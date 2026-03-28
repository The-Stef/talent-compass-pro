/**
 * Display Types — UI-friendly shapes consumed by page components.
 * These are derived in the frontend from raw input + pipeline output.
 * They contain readable labels, resolved department names, badges, etc.
 */

export interface ForecastedRole {
  id: string;
  title: string;
  department: string;
  urgencyScore: number;
  openingTimeline: string;
  strategicImportance: string;
  keyRequirements: string[];
  riskIfUnfilled: string;
  status: "critical" | "high" | "medium";
}

export interface EmployeeTrajectory {
  id: string;
  name: string;
  currentRole: string;
  department: string;
  tenure: number;
  trajectoryScore: number;
  readinessHorizon: string;
  growthVelocity: "accelerating" | "steady" | "plateau";
  strengths: string[];
  criticalGaps: string[];
  photoSeed: number;
}

export interface RoleMatchCandidate {
  employeeId: string;
  employeeName: string;
  fitScore: number;
  readinessTiming: string;
  gapSummary: string;
}

export interface RoleMatch {
  roleId: string;
  roleTitle: string;
  department: string;
  recommendedAction: "internal" | "external" | "hybrid";
  candidates: RoleMatchCandidate[];
  externalReasoning?: string;
  externalHireNeeded?: boolean;
  urgencyScore: number;
}

export interface DevelopmentIntervention {
  id: string;
  employeeId: string;
  employeeName: string;
  targetRole: string;
  type: "training" | "mentorship" | "rotation" | "project" | "coaching";
  title: string;
  duration: string;
  priority: "critical" | "high" | "medium";
  gapAddressed: string;
  successMetrics: string;
  riskIfNotCompleted: string;
}

export interface ExecutiveDecision {
  roleId: string;
  roleTitle: string;
  department: string;
  decision: "internal promotion" | "external hire" | "hybrid approach";
  primaryCandidate?: string;
  urgency: "immediate" | "Q2 2026" | "Q3 2026" | "Q4 2026";
  confidence: number;
  keyRisk: string;
  nextStep: string;
}

export interface ExecutiveSummaryData {
  pipelineHealth: number;
  pipelineHealthLabel: string;
  totalForecastedRoles: number;
  urgentRoles: number;
  internalReady: number;
  externalRequired: number;
  hybridApproach: number;
  topRisks: string[];
  hiddenTalent: string[];
  analysisTimestamp: string;
}
