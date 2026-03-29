/**
 * Raw Input Types — Stable HR facts stored in the backend.
 * These are NOT analytical outputs. They represent the ground truth
 * about employees and roles before any pipeline processing.
 */

export interface RawEmployee {
  id: string;
  name: string;
  current_role: string;
  department_id: string;
  level: string; // e.g. "Senior Director", "VP", "Director"
  tenure_years: number;
  location: string;
  mobility: "global" | "regional" | "local";
  people_scope: number; // number of direct + indirect reports
  budget_scope_eur_millions: number;
  performance_ratings: PerformanceRating[];
  skills: string[];
  leadership_traits: string[];
  critical_experiences: string[];
  development_history: string[];
  career_aspiration: string;
  readiness_gaps: string[];
  manager_assessment: ManagerAssessment;
}

export interface PerformanceRating {
  year: number;
  rating: "exceptional" | "exceeds" | "meets" | "developing";
}

export interface ManagerAssessment {
  overall: "ready_now" | "ready_1_year" | "ready_2_years" | "developing";
  strengths: string[];
  development_areas: string[];
  recommendation: string;
}

export interface RawRole {
  id: string;
  title: string;
  department_id: string;
  level: string;
  location: string;
  mobility_requirement: "global" | "regional" | "local";
  opening_in_months: number;
  reason: string; // e.g. "retirement", "new position", "expansion"
  priority: "critical" | "high" | "medium";
  required_skills: string[];
  required_leadership_traits: string[];
  must_have_experiences: string[];
  team_scope: number;
  budget_scope_eur_millions: number;
  context: string; // strategic context for why this role matters
}
