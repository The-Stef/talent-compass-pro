const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const detail =
      typeof body === "object" && body && "detail" in body
        ? String((body as any).detail)
        : typeof body === "string"
        ? body
        : `Request failed with ${res.status}`;
    throw new Error(detail);
  }

  return body as T;
}

export type RunPipelineRequest = {
  scenario?: string;
  filter_department?: string;
  filter_employee_id?: string;
};

export async function getEmployees() {
  return request<{ employees: any[] }>("/api/data/employees");
}

export async function getRoles() {
  return request<{ roles: any[] }>("/api/data/roles");
}

export async function getLastPipeline() {
  return request<any>("/api/pipeline/last");
}

export async function runPipeline(payload: RunPipelineRequest = {}) {
  return request<any>("/api/pipeline/run", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function addEmployee(employee: any) {
  return request<any>("/api/data/employees", {
    method: "POST",
    body: JSON.stringify(employee),
  });
}

export async function deleteEmployee(employeeId: string) {
  return request<any>(`/api/data/employees/${employeeId}`, {
    method: "DELETE",
  });
}

export async function addRole(role: any) {
  return request<any>("/api/data/roles", {
    method: "POST",
    body: JSON.stringify(role),
  });
}

export async function deleteRole(roleId: string) {
  return request<any>(`/api/data/roles/${roleId}`, {
    method: "DELETE",
  });
}

export { BASE_URL };