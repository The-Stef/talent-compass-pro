/**
 * Mappers — Transform raw backend + pipeline output → display types.
 *
 * Design principles:
 *   1. Raw input = stable facts (employee profiles, role definitions)
 *   2. Pipeline output = AI-generated analysis (scores, matches, plans)
 *   3. Display = UI-friendly (readable labels, resolved departments, badges)
 *
 * Mappers derive display fields in the frontend. They handle:
 *   - snake_case → camelCase conversion
 *   - Categorical → numeric/label conversion
 *   - department_id → department name resolution
 *   - Backward compatibility with old and new backend schemas
 *   - Safe fallbacks: missing fields never blank the UI
 */

import type {
  ForecastedRole,
  EmployeeTrajectory,
  RoleMatch,
  DevelopmentIntervention,
  ExecutiveDecision,
  ExecutiveSummaryData,
} from "@/types/display";
import { resolveDepartment } from "@/data/departments";

// ═══════════════════════════════════════════════════════════════
// Display derivation utilities
// ═══════════════════════════════════════════════════════════════

function toUrgencyStatus(score: number): "critical" | "high" | "medium" {
  if (score >= 90) return "critical";
  if (score >= 80) return "high";
  return "medium";
}

function monthsToTimeline(months: number | string | undefined): string {
  if (months == null) return "";
  const m = typeof months === "string" ? parseInt(months, 10) : months;
  if (isNaN(m)) return String(months);
  if (m <= 3) return "Q2 2026";
  if (m <= 6) return "Q3 2026";
  if (m <= 9) return "Q4 2026";
  return "2027+";
}

function monthsToReadiness(months: number | string | undefined): string {
  if (months == null) return "";
  const m = typeof months === "string" ? parseInt(months, 10) : months;
  if (isNaN(m)) return String(months);
  if (m <= 3) return "0–3 months";
  if (m <= 6) return "3–6 months";
  if (m <= 12) return "6–12 months";
  if (m <= 18) return "12–18 months";
  return `${m}+ months`;
}

function mapGrowthVelocity(v: string): "accelerating" | "steady" | "plateau" {
  const map: Record<string, "accelerating" | "steady" | "plateau"> = {
    high: "accelerating",
    medium: "steady",
    low: "plateau",
    accelerating: "accelerating",
    steady: "steady",
    plateau: "plateau",
  };
  return map[v?.toLowerCase()] ?? "steady";
}

function confidenceToNumber(c: string | number): number {
  if (typeof c === "number") return c;
  const map: Record<string, number> = { high: 90, medium: 75, low: 55 };
  return map[c?.toLowerCase()] ?? 70;
}

function mapActionType(a: string): "internal" | "external" | "hybrid" {
  const v = a?.toLowerCase() ?? "";
  if (v === "internal" || v === "external" || v === "hybrid") return v;
  if (v.includes("external") && v.includes("internal")) return "hybrid";
  if (v.includes("hybrid") || v.includes("develop")) return "hybrid";
  if (v.includes("external")) return "external";
  if (v.includes("internal")) return "internal";
  return "internal";
}

function mapDecision(d: string): "internal promotion" | "external hire" | "hybrid approach" {
  const v = d?.toLowerCase() ?? "";
  if (v.includes("external") && !v.includes("internal") && !v.includes("develop")) return "external hire";
  if (v.includes("hybrid") || (v.includes("internal") && v.includes("external")) || v.includes("develop")) return "hybrid approach";
  return "internal promotion";
}

function mapPriority(p: string): "critical" | "high" | "medium" {
  const v = p?.toLowerCase();
  if (v === "critical") return "critical";
  if (v === "high") return "high";
  return "medium";
}

function mapInterventionType(t: string): "training" | "mentorship" | "rotation" | "project" | "coaching" {
  const v = t?.toLowerCase() ?? "";
  if (v.includes("mentor")) return "mentorship";
  if (v.includes("rotat")) return "rotation";
  if (v.includes("assignment") || v.includes("project") || v.includes("shadow")) return "project";
  if (v.includes("coach")) return "coaching";
  if (v.includes("exposure")) return "training";
  return "training";
}

function mapUrgencyLabel(u: string | number): "immediate" | "Q2 2026" | "Q3 2026" | "Q4 2026" {
  if (typeof u === "number") return monthsToTimeline(u) as any;
  const v = u?.toLowerCase() ?? "";
  if (v.includes("immediate") || v.includes("now")) return "immediate";
  if (v.includes("q2") || v.includes("1-month") || v.includes("3-month")) return "Q2 2026";
  if (v.includes("q3") || v.includes("6-month")) return "Q3 2026";
  return "Q4 2026";
}

function pipelineHealthToNumber(health: string | number | undefined): number {
  if (typeof health === "number") return health;
  if (typeof health === "string") {
    const v = health.toLowerCase();
    if (v === "strong") return 85;
    if (v === "moderate") return 65;
    if (v === "at-risk" || v === "at_risk") return 40;
  }
  return 0;
}

function pipelineHealthToLabel(health: string | number | undefined): string {
  if (typeof health === "string") return health;
  if (typeof health === "number") {
    if (health >= 80) return "strong";
    if (health >= 50) return "moderate";
    return "at-risk";
  }
  return "moderate";
}

// ═══════════════════════════════════════════════════════════════
// Mappers: Pipeline output → Display types
// ═══════════════════════════════════════════════════════════════

export function mapForecastedRoles(raw: any[]): ForecastedRole[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r, i) => ({
    id: r.role_id ?? r.id ?? `r${i + 1}`,
    title: r.title ?? r.role_title ?? "Untitled Role",
    department: r.department ?? resolveDepartment(r.department_id) ?? "",
    urgencyScore: r.urgency_score ?? r.urgencyScore ?? 0,
    openingTimeline: r.opening_timeline ?? r.openingTimeline ?? monthsToTimeline(r.opening_in_months),
    strategicImportance: r.strategic_importance ?? r.strategicImportance ?? "",
    keyRequirements: r.key_requirements_summary ?? r.key_requirements ?? r.keyRequirements ?? [],
    riskIfUnfilled: r.risk_if_unfilled ?? r.riskIfUnfilled ?? "",
    status: r.status ?? toUrgencyStatus(r.urgency_score ?? r.urgencyScore ?? 0),
  }));
}

export function mapEmployeeTrajectories(raw: any[]): EmployeeTrajectory[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((e, i) => ({
    id: e.employee_id ?? e.id ?? `e${i + 1}`,
    name: e.name ?? e.employee_name ?? "Unknown",
    currentRole: e.current_role ?? e.currentRole ?? "",
    department: e.department ?? resolveDepartment(e.department_id) ?? "",
    tenure: e.tenure ?? e.tenure_years ?? 0,
    trajectoryScore: e.trajectory_score ?? e.trajectoryScore ?? 0,
    readinessHorizon: e.readiness_horizon ?? e.readinessHorizon ?? monthsToReadiness(e.readiness_horizon_months),
    growthVelocity: mapGrowthVelocity(e.growth_velocity ?? e.growthVelocity ?? "medium"),
    strengths: e.key_strengths ?? e.strengths ?? [],
    criticalGaps: e.critical_gaps ?? e.criticalGaps ?? [],
    photoSeed: i + 1,
  }));
}

export function mapRoleMatches(raw: any[]): RoleMatch[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((m, i) => ({
    roleId: m.role_id ?? m.roleId ?? `r${i + 1}`,
    roleTitle: m.role_title ?? m.roleTitle ?? "",
    department: m.department ?? resolveDepartment(m.department_id) ?? "",
    // recommendation is the primary signal — do NOT overwrite with external_hire_needed
    recommendedAction: mapActionType(m.recommendation ?? m.recommended_action ?? m.recommendedAction ?? "internal"),
    candidates: (m.top_candidates ?? m.candidates ?? []).map((c: any) => ({
      employeeId: c.employee_id ?? c.employeeId ?? "",
      employeeName: c.name ?? c.employee_name ?? c.employeeName ?? "",
      fitScore: c.fit_score ?? c.fitScore ?? 0,
      readinessTiming: c.readiness_timing ?? c.readinessTiming ?? monthsToReadiness(c.will_be_ready_in_months),
      gapSummary: c.gap_summary ?? c.gapSummary ?? (Array.isArray(c.gaps_to_close) ? c.gaps_to_close.join("; ") : (c.gaps_to_close ?? "")),
    })),
    externalReasoning: m.external_hire_reasoning ?? m.externalReasoning,
    // Preserve external_hire_needed as a separate flag
    externalHireNeeded: m.external_hire_needed ?? false,
    urgencyScore: m.urgency_score ?? m.urgencyScore ?? 0,
  }));
}

export function mapDevelopmentInterventions(raw: any[]): DevelopmentIntervention[] {
  if (!Array.isArray(raw)) return [];
  const results: DevelopmentIntervention[] = [];

  for (const plan of raw) {
    const employeeId = plan.employee_id ?? plan.employeeId ?? "";
    const employeeName = plan.employee_name ?? plan.employeeName ?? "";
    const targetRole = plan.target_role_title ?? plan.target_role ?? plan.targetRole ?? "";
    const successMetrics = plan.success_metrics ?? plan.successMetrics ?? [];
    const riskIfNotDone = plan.risk_if_not_done ?? plan.riskIfNotCompleted ?? "";

    const interventions = plan.interventions ?? [];

    if (Array.isArray(interventions) && interventions.length > 0) {
      // Nested structure: flatten each intervention into a display card
      for (let j = 0; j < interventions.length; j++) {
        const d = interventions[j];
        results.push({
          id: `${employeeId}-${j}`,
          employeeId,
          employeeName,
          targetRole,
          type: mapInterventionType(d.type ?? d.intervention_type ?? "training"),
          title: d.title ?? "",
          duration: d.duration_months ? `${d.duration_months} months` : (d.duration ?? ""),
          priority: mapPriority(d.priority ?? "medium"),
          gapAddressed: d.gap_addressed ?? d.gapAddressed ?? "",
          successMetrics: Array.isArray(successMetrics) ? successMetrics.join("; ") : String(successMetrics),
          riskIfNotCompleted: riskIfNotDone,
        });
      }
    } else {
      // Flat structure (legacy/demo): single card per plan
      results.push({
        id: plan.id ?? `d${results.length + 1}`,
        employeeId,
        employeeName,
        targetRole,
        type: mapInterventionType(plan.type ?? plan.intervention_type ?? "training"),
        title: plan.title ?? "",
        duration: plan.duration ?? "",
        priority: mapPriority(plan.priority ?? "medium"),
        gapAddressed: plan.gap_addressed ?? plan.gapAddressed ?? "",
        successMetrics: Array.isArray(successMetrics) ? successMetrics.join("; ") : String(successMetrics),
        riskIfNotCompleted: riskIfNotDone,
      });
    }
  }

  return results;
}

export function mapExecutiveDecisions(raw: any[]): ExecutiveDecision[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((d, i) => ({
    roleId: d.role_id ?? d.roleId ?? `r${i + 1}`,
    roleTitle: d.role_title ?? d.roleTitle ?? "",
    department: d.department ?? resolveDepartment(d.department_id) ?? "",
    decision: mapDecision(d.action_type ?? d.decision ?? "internal"),
    primaryCandidate: d.primary_candidate ?? d.primaryCandidate ?? undefined,
    urgency: mapUrgencyLabel(d.urgency ?? "Q3 2026"),
    confidence: confidenceToNumber(d.confidence ?? 70),
    keyRisk: d.key_risk ?? d.keyRisk ?? "",
    nextStep: d.next_step ?? d.nextStep ?? "",
  }));
}

export function deriveExecutiveSummary(
  roles: ForecastedRole[],
  matches: RoleMatch[],
  decisions: ExecutiveDecision[],
  backendSummary?: {
    pipeline_health?: string | number;
    executive_summary?: string;
    org_risks?: string[];
    top_hidden_talent?: any[];
  }
): ExecutiveSummaryData {
  const internalCount = matches.filter((m) => m.recommendedAction === "internal").length;
  const externalCount = matches.filter((m) => m.recommendedAction === "external").length;
  const hybridCount = matches.filter((m) => m.recommendedAction === "hybrid").length;
  const urgentCount = roles.filter((r) => r.status === "critical").length;

  const healthRaw = backendSummary?.pipeline_health;
  const pipelineHealth = pipelineHealthToNumber(healthRaw);
  const pipelineHealthLabel = pipelineHealthToLabel(healthRaw);

  const topRisks = backendSummary?.org_risks && backendSummary.org_risks.length > 0
    ? backendSummary.org_risks.slice(0, 3)
    : decisions
        .filter((d) => d.keyRisk)
        .sort((a, b) => a.confidence - b.confidence)
        .slice(0, 3)
        .map((d) => `${d.roleTitle}: ${d.keyRisk}`);

  const hiddenTalent = backendSummary?.top_hidden_talent && backendSummary.top_hidden_talent.length > 0
    ? backendSummary.top_hidden_talent.slice(0, 3).map((t: any) => `${t.name} — ${t.insight}`)
    : matches
        .flatMap((m) => m.candidates)
        .filter((c) => c.fitScore >= 80)
        .slice(0, 3)
        .map((c) => `${c.employeeName} — fit score ${c.fitScore}%`);

  return {
    pipelineHealth,
    pipelineHealthLabel,
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
