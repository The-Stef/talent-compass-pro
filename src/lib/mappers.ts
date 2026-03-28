import type {
  ForecastedRole,
  EmployeeTrajectory,
  RoleMatch,
  DevelopmentIntervention,
  ExecutiveDecision,
} from "@/data/demo-data";

// --- Utility converters ---

function toUrgencyStatus(score: number): "critical" | "high" | "medium" {
  if (score >= 90) return "critical";
  if (score >= 80) return "high";
  return "medium";
}

function mapGrowthVelocity(v: string): "accelerating" | "steady" | "plateau" {
  const map: Record<string, "accelerating" | "steady" | "plateau"> = {
    high: "accelerating",
    medium: "steady",
    low: "plateau",
  };
  return map[v?.toLowerCase()] ?? "steady";
}

function confidenceToNumber(c: string | number): number {
  if (typeof c === "number") return c;
  const map: Record<string, number> = { high: 90, medium: 75, low: 55 };
  return map[c?.toLowerCase()] ?? 70;
}

function monthsToTimeline(months: number | string): string {
  const m = typeof months === "string" ? parseInt(months, 10) : months;
  if (isNaN(m)) return String(months);
  if (m <= 3) return "Q2 2026";
  if (m <= 6) return "Q3 2026";
  if (m <= 9) return "Q4 2026";
  return "2027+";
}

function mapActionType(a: string): "internal" | "external" | "hybrid" {
  const v = a?.toLowerCase();
  if (v?.includes("internal")) return "internal";
  if (v?.includes("external")) return "external";
  if (v?.includes("hybrid")) return "hybrid";
  return "internal";
}

function mapDecision(d: string): "internal promotion" | "external hire" | "hybrid approach" {
  const v = d?.toLowerCase();
  if (v?.includes("external")) return "external hire";
  if (v?.includes("hybrid")) return "hybrid approach";
  return "internal promotion";
}

function mapPriority(p: string): "critical" | "high" | "medium" {
  const v = p?.toLowerCase();
  if (v === "critical") return "critical";
  if (v === "high") return "high";
  return "medium";
}

function mapInterventionType(t: string): "training" | "mentorship" | "rotation" | "project" | "coaching" {
  const v = t?.toLowerCase();
  if (v?.includes("mentor")) return "mentorship";
  if (v?.includes("rotat")) return "rotation";
  if (v?.includes("project")) return "project";
  if (v?.includes("coach")) return "coaching";
  return "training";
}

function mapUrgencyLabel(u: string | number): "immediate" | "Q2 2026" | "Q3 2026" | "Q4 2026" {
  if (typeof u === "number") return monthsToTimeline(u) as any;
  const v = u?.toLowerCase();
  if (v?.includes("immediate") || v?.includes("now")) return "immediate";
  if (v?.includes("q2")) return "Q2 2026";
  if (v?.includes("q3")) return "Q3 2026";
  return "Q4 2026";
}

// --- Mappers ---

export function mapForecastedRoles(raw: any[]): ForecastedRole[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r, i) => ({
    id: r.id ?? r.role_id ?? `r${i + 1}`,
    title: r.title ?? r.role_title ?? "Untitled Role",
    department: r.department ?? "",
    urgencyScore: r.urgency_score ?? r.urgencyScore ?? 0,
    openingTimeline: r.opening_timeline ?? monthsToTimeline(r.opening_in_months) ?? "",
    strategicImportance: r.strategic_importance ?? r.strategicImportance ?? "",
    keyRequirements: r.key_requirements ?? r.keyRequirements ?? [],
    riskIfUnfilled: r.risk_if_unfilled ?? r.riskIfUnfilled ?? "",
    status: r.status ?? toUrgencyStatus(r.urgency_score ?? r.urgencyScore ?? 0),
  }));
}

export function mapEmployeeTrajectories(raw: any[]): EmployeeTrajectory[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((e, i) => ({
    id: e.id ?? e.employee_id ?? `e${i + 1}`,
    name: e.name ?? e.employee_name ?? "Unknown",
    currentRole: e.current_role ?? e.currentRole ?? "",
    department: e.department ?? "",
    tenure: e.tenure ?? e.tenure_years ?? 0,
    trajectoryScore: e.trajectory_score ?? e.trajectoryScore ?? 0,
    readinessHorizon: e.readiness_horizon ?? e.readinessHorizon ?? "",
    growthVelocity: mapGrowthVelocity(e.growth_velocity ?? e.growthVelocity ?? "medium"),
    strengths: e.strengths ?? [],
    criticalGaps: e.critical_gaps ?? e.criticalGaps ?? [],
    photoSeed: i + 1,
  }));
}

export function mapRoleMatches(raw: any[]): RoleMatch[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((m, i) => ({
    roleId: m.role_id ?? m.roleId ?? `r${i + 1}`,
    roleTitle: m.role_title ?? m.roleTitle ?? "",
    department: m.department ?? "",
    recommendedAction: mapActionType(m.action_type ?? m.recommended_action ?? m.recommendedAction ?? "internal"),
    candidates: (m.candidates ?? []).map((c: any) => ({
      employeeId: c.employee_id ?? c.employeeId ?? "",
      employeeName: c.employee_name ?? c.employeeName ?? "",
      fitScore: c.fit_score ?? c.fitScore ?? 0,
      readinessTiming: c.readiness_timing ?? c.readinessTiming ?? "",
      gapSummary: c.gap_summary ?? c.gapSummary ?? "",
    })),
    externalReasoning: m.external_reasoning ?? m.externalReasoning,
    urgencyScore: m.urgency_score ?? m.urgencyScore ?? 0,
  }));
}

export function mapDevelopmentInterventions(raw: any[]): DevelopmentIntervention[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((d, i) => ({
    id: d.id ?? `d${i + 1}`,
    employeeId: d.employee_id ?? d.employeeId ?? "",
    employeeName: d.employee_name ?? d.employeeName ?? "",
    targetRole: d.target_role ?? d.targetRole ?? "",
    type: mapInterventionType(d.type ?? d.intervention_type ?? "training"),
    title: d.title ?? "",
    duration: d.duration ?? "",
    priority: mapPriority(d.priority ?? "medium"),
    gapAddressed: d.gap_addressed ?? d.gapAddressed ?? "",
    successMetrics: d.success_metrics ?? d.successMetrics ?? "",
    riskIfNotCompleted: d.risk_if_not_completed ?? d.riskIfNotCompleted ?? "",
  }));
}

export function mapExecutiveDecisions(raw: any[]): ExecutiveDecision[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((d, i) => ({
    roleId: d.role_id ?? d.roleId ?? `r${i + 1}`,
    roleTitle: d.role_title ?? d.roleTitle ?? "",
    department: d.department ?? "",
    decision: mapDecision(d.decision ?? d.action_type ?? "internal"),
    primaryCandidate: d.primary_candidate ?? d.primaryCandidate ?? undefined,
    urgency: mapUrgencyLabel(d.urgency ?? "Q3 2026"),
    confidence: confidenceToNumber(d.confidence ?? 70),
    keyRisk: d.key_risk ?? d.keyRisk ?? "",
    nextStep: d.next_step ?? d.nextStep ?? "",
  }));
}

export interface ExecutiveSummaryData {
  pipelineHealth: number;
  totalForecastedRoles: number;
  urgentRoles: number;
  internalReady: number;
  externalRequired: number;
  hybridApproach: number;
  topRisks: string[];
  hiddenTalent: string[];
  analysisTimestamp: string;
}

export function deriveExecutiveSummary(
  roles: ForecastedRole[],
  matches: RoleMatch[],
  decisions: ExecutiveDecision[]
): ExecutiveSummaryData {
  const internalCount = matches.filter((m) => m.recommendedAction === "internal").length;
  const externalCount = matches.filter((m) => m.recommendedAction === "external").length;
  const hybridCount = matches.filter((m) => m.recommendedAction === "hybrid").length;
  const urgentCount = roles.filter((r) => r.status === "critical").length;

  const avgConfidence = decisions.length
    ? Math.round(decisions.reduce((s, d) => s + d.confidence, 0) / decisions.length)
    : 0;

  const topRisks = decisions
    .filter((d) => d.keyRisk)
    .sort((a, b) => a.confidence - b.confidence)
    .slice(0, 3)
    .map((d) => `${d.roleTitle}: ${d.keyRisk}`);

  const hiddenTalent = matches
    .flatMap((m) => m.candidates)
    .filter((c) => c.fitScore >= 80)
    .slice(0, 3)
    .map((c) => `${c.employeeName} — fit score ${c.fitScore}%`);

  return {
    pipelineHealth: avgConfidence,
    totalForecastedRoles: roles.length,
    urgentRoles: urgentCount,
    internalReady: internalCount,
    externalRequired: externalCount,
    hybridApproach: hybridCount,
    topRisks: topRisks.length ? topRisks : ["No major risks identified"],
    hiddenTalent: hiddenTalent.length ? hiddenTalent : ["No hidden talent highlights"],
    analysisTimestamp: new Date().toISOString(),
  };
}
