import { create } from 'zustand';
import type { Template, PrintInfo, ProcessingResponse } from '@/types';

interface AppState {
  templates: Template[];
  selectedTemplate: Template | null;

  prints: PrintInfo[];

  contracts: string[];
  selectedContracts: string[];
  excelFile: File | null;

  currentJob: ProcessingResponse | null;
  isProcessing: boolean;

  currentStep: number;

  setTemplates: (templates: Template[]) => void;
  setSelectedTemplate: (template: Template | null) => void;
  setPrints: (prints: PrintInfo[]) => void;
  setContracts: (contracts: string[]) => void;
  setSelectedContracts: (contracts: string[]) => void;
  toggleContractSelection: (contract: string) => void;
  selectAllContracts: () => void;
  deselectAllContracts: () => void;
  setExcelFile: (file: File | null) => void;
  setCurrentJob: (job: ProcessingResponse | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const initialState = {
  templates: [],
  selectedTemplate: null,
  prints: [],
  contracts: [],
  selectedContracts: [],
  excelFile: null,
  currentJob: null,
  isProcessing: false,
  currentStep: 0,
};

export const useStore = create<AppState>((set, get) => ({
  ...initialState,

  setTemplates: (templates) => set({ templates }),

  setSelectedTemplate: (template) => set({ selectedTemplate: template }),

  setPrints: (prints) => set({ prints }),

  setContracts: (contracts) => set({ contracts, selectedContracts: contracts }),

  setSelectedContracts: (contracts) => set({ selectedContracts: contracts }),

  toggleContractSelection: (contract) => {
    const { selectedContracts } = get();
    const isSelected = selectedContracts.includes(contract);

    if (isSelected) {
      set({ selectedContracts: selectedContracts.filter((c) => c !== contract) });
    } else {
      set({ selectedContracts: [...selectedContracts, contract] });
    }
  },

  selectAllContracts: () => {
    const { contracts } = get();
    set({ selectedContracts: [...contracts] });
  },

  deselectAllContracts: () => set({ selectedContracts: [] }),

  setExcelFile: (file) => set({ excelFile: file }),

  setCurrentJob: (job) => set({ currentJob: job }),

  setIsProcessing: (isProcessing) => set({ isProcessing }),

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

  prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

  reset: () => set(initialState),
}));
