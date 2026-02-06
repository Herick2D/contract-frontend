

export interface Template {
  id: string;
  name: string;
  description: string;
  filename: string;
  file_path: string;
  status: "active" | "inactive";
  placeholders: string[];
  created_at: string;
  updated_at: string;
}

export interface TemplateListResponse {
  total: number;
  templates: Template[];
}

export interface PrintInfo {
  filename: string;
  contract_number: string;
  size_bytes: number;
}

export interface PrintListResponse {
  total: number;
  prints: PrintInfo[];
}

export interface PrintUploadResponse {
  sucesso: boolean;
  total_enviados: number;
  total_aceitos: number;
  total_rejeitados: number;
  aceitos: string[];
  rejeitados: Array<{
    filename: string;
    reason: string;
  }>;
  mensagem: string;
}

export interface ContractListResponse {
  sucesso: boolean;
  total: number;
  contratos: string[];
  mensagem: string;
}

export interface ContractResult {
  contrato: string;
  sucesso: boolean;
  arquivo: string | null;
  mensagem: string;
  dados: Record<string, unknown>;
}

export interface ProcessingResponse {
  job_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  total_contratos: number;
  processados: number;
  sucessos: number;
  falhas: number;
  resultados: ContractResult[];
  download_url: string | null;
  created_at: string;
  completed_at: string | null;
  mensagem: string;
}

export interface PendenciaItem {
  contrato: string;
  campo: string;
  descricao: string;
  observacao: string;
}

export interface PendenciasResponse {
  sucesso: boolean;
  total_contratos: number;
  contratos_completos: number;
  contratos_pendentes: number;
  pendencias: PendenciaItem[];
  mensagem: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}


export interface AppState {

  templates: Template[];
  selectedTemplate: Template | null;


  prints: PrintInfo[];


  contracts: string[];
  selectedContracts: string[];


  currentJob: ProcessingResponse | null;
  isProcessing: boolean;


  setTemplates: (templates: Template[]) => void;
  setSelectedTemplate: (template: Template | null) => void;
  setPrints: (prints: PrintInfo[]) => void;
  setContracts: (contracts: string[]) => void;
  setSelectedContracts: (contracts: string[]) => void;
  setCurrentJob: (job: ProcessingResponse | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  reset: () => void;
}
