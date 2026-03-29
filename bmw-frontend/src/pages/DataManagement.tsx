import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { usePipeline } from "@/context/PipelineContext";
import { addEmployee, deleteEmployee, addRole, deleteRole } from "@/lib/api";

const EMPLOYEE_TEMPLATE = `{
  "id": "e9",
  "name": "New Employee",
  "current_role": "Example Role",
  "department_id": "d1",
  "level": "manager",
  "tenure_years": 1,
  "location": "Munich, DE",
  "mobility": "open to relocation",
  "people_scope": 5,
  "budget_scope_eur_millions": 1,
  "performance_ratings": [4.0, 4.2],
  "skills": ["skill 1", "skill 2"],
  "leadership_traits": ["trait 1", "trait 2"],
  "critical_experiences": ["experience 1"],
  "development_history": ["program 1"],
  "career_aspiration": "Director within 2 years",
  "readiness_gaps": ["gap 1"],
  "manager_assessment": "Strong performer with growth potential."
}`;

const ROLE_TEMPLATE = `{
  "id": "r6",
  "title": "New Role",
  "department_id": "d1",
  "level": "director",
  "location": "Munich, DE",
  "mobility_requirement": "open to relocation",
  "opening_in_months": 6,
  "reason": "New strategic need",
  "priority": "high",
  "required_skills": ["skill 1", "skill 2"],
  "required_leadership_traits": ["trait 1", "trait 2"],
  "must_have_experiences": ["experience 1"],
  "team_scope": 50,
  "budget_scope_eur_millions": 10,
  "context": "Context for the role."
}`;

export default function DataManagement() {
  const {
    employeeTrajectories,
    forecastedRoles,
    loadRawData,
    refreshData,
    isLoading,
  } = usePipeline();

  const [employeeJson, setEmployeeJson] = useState(EMPLOYEE_TEMPLATE);
  const [roleJson, setRoleJson] = useState(ROLE_TEMPLATE);
  const [submittingEmployee, setSubmittingEmployee] = useState(false);
  const [submittingRole, setSubmittingRole] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sortedEmployees = useMemo(
    () => [...employeeTrajectories].sort((a, b) => a.name.localeCompare(b.name)),
    [employeeTrajectories]
  );

  const sortedRoles = useMemo(
    () => [...forecastedRoles].sort((a, b) => a.title.localeCompare(b.title)),
    [forecastedRoles]
  );

  const handleAddEmployee = async () => {
    try {
      setSubmittingEmployee(true);
      const parsed = JSON.parse(employeeJson);
      await addEmployee(parsed);
      await loadRawData();
      setEmployeeJson(EMPLOYEE_TEMPLATE);
    } catch (err: any) {
      alert(err?.message ?? "Failed to add employee");
    } finally {
      setSubmittingEmployee(false);
    }
  };

  const handleAddRole = async () => {
    try {
      setSubmittingRole(true);
      const parsed = JSON.parse(roleJson);
      await addRole(parsed);
      await loadRawData();
      setRoleJson(ROLE_TEMPLATE);
    } catch (err: any) {
      alert(err?.message ?? "Failed to add role");
    } finally {
      setSubmittingRole(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteEmployee(id);
      await loadRawData();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete employee");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteRole(id);
      await loadRawData();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete role");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Manage Data</h1>
            <p className="text-muted-foreground mt-1">Add or remove employees and roles stored in the JSON dataset.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadRawData}
              disabled={isLoading}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load Current Data"}
            </button>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50"
            >
              Refresh Latest View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Add Employee</h2>
            <p className="text-sm text-muted-foreground">
              Paste a full employee JSON object. Make sure the <code>id</code> is unique.
            </p>
            <textarea
              value={employeeJson}
              onChange={(e) => setEmployeeJson(e.target.value)}
              className="w-full min-h-[380px] rounded-lg border border-border bg-background p-3 text-sm font-mono"
            />
            <button
              onClick={handleAddEmployee}
              disabled={submittingEmployee}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {submittingEmployee ? "Adding..." : "Add Employee"}
            </button>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Add Role</h2>
            <p className="text-sm text-muted-foreground">
              Paste a full role JSON object. Make sure the <code>id</code> is unique.
            </p>
            <textarea
              value={roleJson}
              onChange={(e) => setRoleJson(e.target.value)}
              className="w-full min-h-[380px] rounded-lg border border-border bg-background p-3 text-sm font-mono"
            />
            <button
              onClick={handleAddRole}
              disabled={submittingRole}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {submittingRole ? "Adding..." : "Add Role"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Employees</h2>
            {sortedEmployees.length === 0 ? (
              <p className="text-sm text-muted-foreground">No employee data loaded yet.</p>
            ) : (
              <div className="space-y-3">
                {sortedEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
                    <div className="min-w-0">
                      <div className="font-medium text-foreground">{employee.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {employee.currentRole} · {employee.department}
                      </div>
                      <div className="text-xs text-muted-foreground">{employee.id}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      disabled={deletingId === employee.id}
                      className="rounded-lg border border-destructive/30 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                      {deletingId === employee.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Forecasted Roles</h2>
            {sortedRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No role data loaded yet.</p>
            ) : (
              <div className="space-y-3">
                {sortedRoles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
                    <div className="min-w-0">
                      <div className="font-medium text-foreground">{role.title}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {role.department} · {role.openingTimeline}
                      </div>
                      <div className="text-xs text-muted-foreground">{role.id}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      disabled={deletingId === role.id}
                      className="rounded-lg border border-destructive/30 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                      {deletingId === role.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}