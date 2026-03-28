const BASE_URL = "http://localhost:8000";

export interface RunPipelineRequest {
  scenario?: string;
  filter_department?: string;
  filter_employee_id?: string;
}

export async function runPipeline(params: RunPipelineRequest = {}) {
  const res = await fetch(`${BASE_URL}/api/pipeline/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Pipeline run failed: ${res.statusText}`);
  return res.json();
}

export async function getLastPipeline() {
  const res = await fetch(`${BASE_URL}/api/pipeline/last`);
  if (!res.ok) throw new Error(`Failed to fetch last pipeline: ${res.statusText}`);
  return res.json();
}

export async function getEmployees() {
  const res = await fetch(`${BASE_URL}/api/data/employees`);
  if (!res.ok) throw new Error(`Failed to fetch employees: ${res.statusText}`);
  return res.json();
}

export async function getRoles() {
  const res = await fetch(`${BASE_URL}/api/data/roles`);
  if (!res.ok) throw new Error(`Failed to fetch roles: ${res.statusText}`);
  return res.json();
}
