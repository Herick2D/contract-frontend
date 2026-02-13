'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Trash2, Download, MoreVertical, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  FileDropzone,
} from '@/components/ui';
import { listTemplates, uploadTemplate, deleteTemplate, getTemplateDownloadUrl } from '@/lib/api';
import { cn, formatDate, truncate } from '@/lib/utils';
import type { Template } from '@/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadTemplates = useCallback(async () => {
    try {
      console.log('Iniciando carregamento de templates...');
      setIsLoading(true);
      const data = await listTemplates();
      console.log('Templates recebidos:', data);
      setTemplates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Erro ao carregar templates:', error);
      toast.error('Erro ao carregar templates');
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleUpload = async () => {
    if (!selectedFile || !templateName) {
      toast.error('Preencha o nome e selecione um arquivo');
      return;
    }

    try {
      setIsUploading(true);
      await uploadTemplate(templateName, templateDescription, selectedFile);
      toast.success('Template enviado com sucesso!');
      setShowUpload(false);
      setTemplateName('');
      setTemplateDescription('');
      setSelectedFile(null);
      loadTemplates();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar template');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir o template "${name}"?`)) return;

    try {
      await deleteTemplate(id);
      toast.success('Template excluído');
      loadTemplates();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir template');
    }
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <Header title="Templates" description="Gerencie seus modelos de documentos Word" />

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-neutral-100 dark:bg-slate-800 border border-neutral-400 dark:border-slate-700 rounded-lg text-sm placeholder:text-neutral-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-warm-500 dark:focus:border-slate-600 focus:ring-1 focus:ring-warm-500 dark:focus:ring-slate-800 transition-all text-neutral-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={loadTemplates} disabled={isLoading}>
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
              Atualizar
            </Button>
            <Button variant="primary" onClick={() => setShowUpload(true)}>
              <Plus className="w-4 h-4" />
              Novo Template
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowUpload(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-100 dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-lg border border-neutral-400 dark:border-slate-700"
              >
                <CardHeader className="border-b border-neutral-300 dark:border-slate-700">
                  <CardTitle>Novo Template</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-900 dark:text-white mb-2 uppercase tracking-wide">
                      Nome do Template *
                    </label>
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Ex: Inicial Arbitral Despejo"
                      className="w-full h-11 px-4 bg-neutral-100 dark:bg-slate-800 border border-neutral-400 dark:border-slate-700 rounded-lg text-sm placeholder:text-neutral-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-warm-500 dark:focus:border-slate-600 focus:ring-1 focus:ring-warm-500 dark:focus:ring-slate-800 transition-all text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-900 dark:text-white mb-2 uppercase tracking-wide">
                      Descrição
                    </label>
                    <textarea
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                      placeholder="Descrição opcional do template..."
                      rows={3}
                      className="w-full px-4 py-3 bg-neutral-100 dark:bg-slate-800 border border-neutral-400 dark:border-slate-700 rounded-lg text-sm placeholder:text-neutral-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-warm-500 dark:focus:border-slate-600 focus:ring-1 focus:ring-warm-500 dark:focus:ring-slate-800 transition-all resize-none text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-900 dark:text-white mb-2 uppercase tracking-wide">
                      Arquivo Word *
                    </label>
                    <FileDropzone
                      onFilesSelected={(files) => setSelectedFile(files[0] || null)}
                      accept={{
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
                          '.docx',
                        ],
                      }}
                      label="Arraste o arquivo .docx aqui"
                      description="ou clique para selecionar"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={() => setShowUpload(false)}>
                      Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleUpload} disabled={isUploading}>
                      {isUploading ? (
                        'Enviando...'
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Salvar
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="bordered" className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-20 bg-gray-50 dark:bg-slate-800 rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <Card variant="bordered" className="p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {searchTerm ? 'Nenhum template encontrado' : 'Nenhum template cadastrado'}
            </h3>
            <p className="text-gray-500 dark:text-gray-200 mt-2 mb-6 max-w-md mx-auto">
              {searchTerm
                ? 'Tente buscar com outros termos'
                : 'Faça upload de um modelo Word (.docx) para começar a gerar contratos automaticamente.'}
            </p>
            {!searchTerm && (
              <Button variant="secondary" onClick={() => setShowUpload(true)}>
                <Plus className="w-4 h-4" />
                Adicionar Template
              </Button>
            )}
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-6"
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="elevated" className="p-6 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-slate-400 truncate">
                        {template.filename}
                      </p>
                    </div>
                    <Badge variant={template.status === 'active' ? 'success' : 'default'}>
                      {template.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>

                  {template.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
                      {truncate(template.description, 100)}
                    </p>
                  )}

                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 mb-4 flex-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">
                      Placeholders encontrados ({template.placeholders.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {template.placeholders.slice(0, 6).map((placeholder, i) => (
                        <span
                          key={i}
                          className="text-xs bg-neutral-100 dark:bg-slate-700 px-2 py-1 rounded-md text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700"
                        >
                          {truncate(placeholder, 30)}
                        </span>
                      ))}
                      {template.placeholders.length > 6 && (
                        <span className="text-xs text-gray-400 dark:text-slate-400 px-2 py-1">
                          +{template.placeholders.length - 6} mais
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                    <span className="text-xs text-gray-400 dark:text-slate-400">
                      {formatDate(template.created_at)}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={getTemplateDownloadUrl(template.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                      </a>
                      <button
                        onClick={() => handleDelete(template.id, template.name)}
                        className="p-2 hover:bg-error-100 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4 text-error-500" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
