import type {
  Template,
  TemplateListResponse,
  PrintListResponse,
  PrintUploadResponse,
  ContractListResponse,
  ProcessingResponse,
  PendenciasResponse,
  HealthResponse,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Erro desconhecido" }));
    throw new ApiError(response.status, error.detail || "Erro na requisição");
  }
  return response.json();
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE}/health`);
  return handleResponse<HealthResponse>(response);
}

export async function listTemplates(): Promise<Template[]> {
  console.log("Fetching templates from:", `${API_BASE}/api/v1/templates/`);
  const response = await fetch(`${API_BASE}/api/v1/templates/`);
  console.log("Response status:", response.status);
  const data = await handleResponse<TemplateListResponse>(response);
  console.log("Templates data:", data);
  return data.templates;
}

export async function getTemplate(id: string): Promise<Template> {
  const response = await fetch(`${API_BASE}/api/v1/templates/${id}`);
  return handleResponse<Template>(response);
}

export async function uploadTemplate(
  name: string,
  description: string,
  file: File,
): Promise<Template> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/v1/templates/`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<Template>(response);
}

export async function updateTemplate(
  id: string,
  data: { name?: string; description?: string; status?: "active" | "inactive" },
): Promise<Template> {
  const response = await fetch(`${API_BASE}/api/v1/templates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Template>(response);
}

export async function deleteTemplate(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/v1/templates/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Erro ao deletar" }));
    throw new ApiError(response.status, error.detail);
  }
}

export function getTemplateDownloadUrl(id: string): string {
  return `${API_BASE}/api/v1/templates/${id}/download`;
}

export async function listPrints(): Promise<PrintListResponse> {
  const response = await fetch(`${API_BASE}/api/v1/prints/`);
  return handleResponse<PrintListResponse>(response);
}

export async function uploadPrints(
  files: File[],
): Promise<PrintUploadResponse> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${API_BASE}/api/v1/prints/upload`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<PrintUploadResponse>(response);
}

export function getPrintUrl(contractNumber: string): string {
  return `${API_BASE}/api/v1/prints/${contractNumber}`;
}

export async function deletePrint(contractNumber: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/v1/prints/${contractNumber}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Erro ao deletar" }));
    throw new ApiError(response.status, error.detail);
  }
}

export async function clearAllPrints(): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/api/v1/prints/`, {
    method: "DELETE",
  });
  return handleResponse<{ message: string }>(response);
}

export async function listContracts(file: File): Promise<ContractListResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/v1/contracts/list`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<ContractListResponse>(response);
}

export async function verifyPendencias(
  file: File,
): Promise<PendenciasResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/v1/contracts/pendencias`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<PendenciasResponse>(response);
}

export async function processContracts(
  templateId: string,
  file: File,
  contratos?: string[],
): Promise<ProcessingResponse> {
  const formData = new FormData();
  formData.append("template_id", templateId);
  formData.append("file", file);

  if (contratos && contratos.length > 0) {
    formData.append("contratos", contratos.join(","));
  }

  const response = await fetch(`${API_BASE}/api/v1/contracts/process`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<ProcessingResponse>(response);
}

export async function getJobStatus(jobId: string): Promise<ProcessingResponse> {
  const response = await fetch(`${API_BASE}/api/v1/contracts/job/${jobId}`);
  return handleResponse<ProcessingResponse>(response);
}

export function getDownloadUrl(jobId: string): string {
  return `${API_BASE}/api/v1/contracts/download/${jobId}`;
}

export async function deleteJob(jobId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/v1/contracts/job/${jobId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Erro ao deletar" }));
    throw new ApiError(response.status, error.detail);
  }
}

export { ApiError };
