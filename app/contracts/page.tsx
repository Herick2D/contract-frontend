'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSpreadsheet,
  FileText,
  Check,
  Download,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/layout';
import { Card, CardContent, Button, Badge, FileDropzone, Stepper } from '@/components/ui';
import {
  listTemplates,
  listContracts,
  processContracts,
  getDownloadUrl,
  downloadFile,
} from '@/lib/api';
import { cn, truncate } from '@/lib/utils';
import type { Template, ProcessingResponse } from '@/types';

const steps = [
  { id: 0, title: 'Template', description: 'Selecione o modelo' },
  { id: 1, title: 'Excel', description: 'Envie a planilha' },
  { id: 2, title: 'Contratos', description: 'Selecione quais' },
  { id: 3, title: 'Processar', description: 'Gerar documentos' },
];

export default function ContractsPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [contracts, setContracts] = useState<string[]>([]);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResponse | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await listTemplates();
        setTemplates(data.filter((t) => t.status === 'active'));
      } catch (error) {
        toast.error('Erro ao carregar templates');
      }
    }
    load();
  }, []);

  const loadContracts = useCallback(async () => {
    if (!excelFile) return;

    try {
      setIsLoading(true);
      const data = await listContracts(excelFile);
      if (data.sucesso) {
        setContracts(data.contratos);
        setSelectedContracts(data.contratos);
        setCurrentStep(2);
      } else {
        toast.error(data.mensagem || 'Erro ao ler planilha');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar contratos');
    } finally {
      setIsLoading(false);
    }
  }, [excelFile]);

  const handleProcess = async () => {
    if (!selectedTemplate || !excelFile || selectedContracts.length === 0) {
      toast.error('Selecione o template, Excel e pelo menos um contrato');
      return;
    }

    try {
      setIsProcessing(true);
      setCurrentStep(3);

      const response = await processContracts(
        selectedTemplate.id,
        excelFile,
        selectedContracts.length === contracts.length ? undefined : selectedContracts
      );

      setResult(response);

      if (response.sucessos > 0) {
        toast.success(`${response.sucessos} contrato(s) processado(s) com sucesso!`);
      }
      if (response.falhas > 0) {
        toast.warning(`${response.falhas} contrato(s) com falha`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar contratos');
      setCurrentStep(2);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedTemplate(null);
    setExcelFile(null);
    setContracts([]);
    setSelectedContracts([]);
    setResult(null);
  };

  const toggleContract = (contract: string) => {
    setSelectedContracts((prev) =>
      prev.includes(contract) ? prev.filter((c) => c !== contract) : [...prev, contract]
    );
  };

  const selectAll = () => setSelectedContracts([...contracts]);
  const deselectAll = () => setSelectedContracts([]);

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!selectedTemplate;
      case 1:
        return !!excelFile;
      case 2:
        return selectedContracts.length > 0;
      default:
        return false;
    }
  };

  return (
    <>
      <Header
        title="Processar Contratos"
        description="Gere documentos automaticamente a partir do Excel"
      />

      <div className="p-8">
        <Card variant="elevated" className="p-6 mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </Card>

        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
                Selecione o Template
              </h2>
              <p className="text-neutral-700 dark:text-gray-200 mb-6 text-sm">
                Escolha o modelo Word que será usado para gerar os documentos
              </p>

              {templates.length === 0 ? (
                <Card variant="default" className="p-8 text-center bg-neutral-50 dark:bg-gray-800">
                  <AlertCircle className="w-12 h-12 text-neutral-600 dark:text-gray-300 mx-auto mb-4" />
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wide">
                    Nenhum template disponível
                  </h3>
                  <p className="text-sm text-neutral-700 dark:text-gray-200 mt-2">
                    Você precisa cadastrar um template primeiro
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      variant="default"
                      className={cn(
                        'p-5 cursor-pointer transition-all duration-200 bg-neutral-50',
                        selectedTemplate?.id === template.id
                          ? 'border-2 border-warm-500 bg-neutral-100 dark:border-warm-500 dark:bg-gray-800'
                          : 'hover:border-neutral-500 dark:hover:border-gray-600 dark:bg-gray-800'
                      )}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            'w-14 h-14 rounded-lg flex items-center justify-center',
                            selectedTemplate?.id === template.id
                              ? 'bg-warm-500 text-neutral-900'
                              : 'bg-neutral-200 text-neutral-700 dark:bg-gray-700 dark:text-gray-200'
                          )}
                        >
                          <FileText className="w-7 h-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-neutral-900 dark:text-white truncate uppercase tracking-wide text-sm">
                            {template.name}
                          </h4>
                          <p className="text-xs text-neutral-700 dark:text-gray-200 truncate mt-1">
                            {template.filename}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-gray-300 mt-1 font-semibold">
                            {template.placeholders.length} placeholders
                          </p>
                        </div>
                        {selectedTemplate?.id === template.id && (
                          <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-gray-200 flex items-center justify-center">
                            <Check className="w-5 h-5 text-warm-500 dark:text-gray-900" />
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Upload da Planilha
              </h2>
              <p className="text-gray-500 dark:text-gray-200 mb-6">
                Envie o arquivo Excel com os dados dos contratos
              </p>

              <Card variant="bordered" className="p-6">
                <FileDropzone
                  onFilesSelected={(files) => setExcelFile(files[0] || null)}
                  accept={{
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                    'application/vnd.ms-excel': ['.xls'],
                  }}
                  label="Arraste a planilha Excel aqui"
                  description=".xlsx ou .xls"
                />

                {excelFile && (
                  <div className="mt-6 p-4 bg-success-50 rounded-xl border border-success-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success-600" />
                      <div>
                        <p className="font-medium text-success-800">{excelFile.name}</p>
                        <p className="text-sm text-success-600">Arquivo selecionado</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Selecione os Contratos
                  </h2>
                  <p className="text-gray-500 dark:text-gray-200">
                    {selectedContracts.length} de {contracts.length} selecionados
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={deselectAll}>
                    Desmarcar todos
                  </Button>
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    Selecionar todos
                  </Button>
                </div>
              </div>

              <Card variant="bordered" className="p-4 max-h-[400px] overflow-y-auto">
                <div className="grid grid-cols-6 gap-2">
                  {contracts.map((contract) => {
                    const isSelected = selectedContracts.includes(contract);
                    return (
                      <button
                        key={contract}
                        onClick={() => toggleContract(contract)}
                        className={cn(
                          'p-3 rounded-xl text-sm font-medium transition-all duration-200',
                          isSelected
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                        )}
                      >
                        {contract}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {isProcessing ? (
                <Card variant="bordered" className="p-12 text-center">
                  <Loader2 className="w-16 h-16 text-gray-600 dark:text-gray-300 mx-auto mb-6 animate-spin" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Processando contratos...
                  </h3>
                  <p className="text-gray-500 dark:text-gray-200 mt-2">
                    Aguarde enquanto os documentos são gerados
                  </p>
                </Card>
              ) : result ? (
                <div className="space-y-6">
                  <Card variant="elevated" className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Processamento Concluído
                        </h3>
                        <p className="text-gray-500 dark:text-gray-200">Job ID: {result.job_id}</p>
                      </div>
                      <Badge
                        variant={result.status === 'completed' ? 'success' : 'error'}
                        size="md"
                      >
                        {result.status === 'completed' ? 'Concluído' : 'Falhou'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-sm text-gray-500 dark:text-gray-200">Total</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {result.total_contratos}
                        </p>
                      </div>
                      <div className="p-4 bg-success-50 rounded-xl">
                        <p className="text-sm text-success-600">Sucesso</p>
                        <p className="text-2xl font-bold text-success-700">{result.sucessos}</p>
                      </div>
                      <div className="p-4 bg-error-50 rounded-xl">
                        <p className="text-sm text-error-600">Falhas</p>
                        <p className="text-2xl font-bold text-error-700">{result.falhas}</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-sm text-gray-600 dark:text-gray-200">Processados</p>
                        <p className="text-2xl font-bold text-gray-700 dark:text-white">
                          {result.processados}
                        </p>
                      </div>
                    </div>

                    {result.download_url && result.sucessos > 0 && (
                      <div className="mt-6 flex justify-center">
                        <Button
                          variant="secondary"
                          size="lg"
                          onClick={() => {
                            toast.info('Iniciando download...');
                            downloadFile(result.job_id)
                              .then(() => {
                                toast.success('Download concluído!');
                              })
                              .catch(() => {
                                toast.error('Erro no download. Tentando abrir em nova aba...');
                                window.open(getDownloadUrl(result.job_id), '_blank');
                              });
                          }}
                        >
                          <Download className="w-5 h-5" />
                          Baixar Documentos (ZIP)
                        </Button>
                      </div>
                    )}
                  </Card>

                  {result.resultados.length > 0 && (
                    <Card variant="bordered" className="p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Detalhes do Processamento
                      </h4>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {result.resultados.map((r, i) => (
                          <div
                            key={i}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-xl',
                              r.sucesso ? 'bg-success-50' : 'bg-error-50'
                            )}
                          >
                            {r.sucesso ? (
                              <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p
                                className={cn(
                                  'font-medium',
                                  r.sucesso ? 'text-success-800' : 'text-error-800'
                                )}
                              >
                                Contrato {r.contrato}
                              </p>
                              <p
                                className={cn(
                                  'text-sm truncate',
                                  r.sucesso ? 'text-success-600' : 'text-error-600'
                                )}
                              >
                                {r.sucesso ? r.arquivo : r.mensagem}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  <div className="flex justify-center">
                    <Button variant="outline" onClick={handleReset}>
                      <RefreshCw className="w-4 h-4" />
                      Processar Novamente
                    </Button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {currentStep < 3 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>

            {currentStep === 1 ? (
              <Button
                variant="primary"
                onClick={loadContracts}
                disabled={!canProceed()}
                isLoading={isLoading}
              >
                Carregar Contratos
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : currentStep === 2 ? (
              <Button variant="secondary" onClick={handleProcess} disabled={!canProceed()}>
                Processar {selectedContracts.length} Contrato(s)
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
