/**
 * BMW Department Registry
 * Resolves department_id → display name.
 * Canonical source for department labels across the application.
 */

export const departments: Record<string, string> = {
  "D01": "Powertrain & E-Drive",
  "D02": "R&D — Autonomous Vehicles",
  "D03": "Neue Klasse — Electrification",
  "D04": "Digital & IT",
  "D05": "Corporate Strategy",
  "D06": "Sales & Marketing",
  "D07": "Manufacturing & Production",
  "D08": "Supply Chain & Logistics",
  "D09": "Human Resources",
  "D10": "Finance & Controlling",
  "D11": "Legal & Compliance",
  "D12": "Design & Brand",
  "D13": "Aftersales & Connected Services",
  "D14": "Motorsport & M GmbH",
  "D15": "Procurement & Supplier Quality",
};

/**
 * Resolve a department_id to a human-readable name.
 * Falls back gracefully: returns the raw id/string if not found.
 */
export function resolveDepartment(departmentId: string | undefined): string {
  if (!departmentId) return "";
  return departments[departmentId] ?? departmentId;
}
