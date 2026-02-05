'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Grid,
  List
} from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/layout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Badge, 
  FileDropzone 
} from '@/components/ui';
import { 
  listPrints, 
  uploadPrints, 
  deletePrint, 
  clearAllPrints,
  getPrintUrl 
} from '@/lib/api';
import { cn, formatBytes } from '@/lib/utils';
import type { PrintInfo, PrintUploadResponse } from '@/types';

export default function PrintsPage() {
  const [prints, setPrints] = useState<PrintInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadResult, setUploadResult] = useState<PrintUploadResponse | null>(null);

  const loadPrints = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await listPrints();
      setPrints(data.prints);
    } catch (error) {
      toast.error('Erro ao carregar prints');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrints();
  }, [loadPrints]);

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      const result = await uploadPrints(files);
      setUploadResult(result);
      
      if (result.sucesso) {
        toast.success(result.mensagem);
        setShowUpload(false);
        setUploadResult(null);
        loadPrints();
      } else if (result.total_aceitos > 0) {
        toast.warning(result.mensagem);
        loadPrints();
      } else {
        toast.error(result.mensagem);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar prints');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (contractNumber: string) => {
    if (!confirm(`Deseja excluir o print do contrato ${contractNumber}?`)) return;

    try {
      await deletePrint(contractNumber);
      toast.success('Print excluído');
      loadPrints();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir print');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Deseja excluir TODOS os prints? Esta ação não pode ser desfeita.')) return;

    try {
      await clearAllPrints();
      toast.success('Todos os prints foram excluídos');
      loadPrints();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao limpar prints');
    }
  };

  const filteredPrints = prints.filter(p =>
    p.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header 
        title="Prints" 
        description="Gerencie as imagens das cláusulas contratuais"
      />

      <div className="p-8">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input
                type="text"
                placeholder="Buscar por número do contrato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white border border-primary-200 rounded-xl text-sm placeholder:text-primary-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-primary-100 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-primary-200'
                )}
              >
                <Grid className="w-4 h-4 text-primary-600" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-primary-200'
                )}
              >
                <List className="w-4 h-4 text-primary-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={loadPrints} disabled={isLoading}>
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
              Atualizar
            </Button>
            {prints.length > 0 && (
              <Button variant="outline" onClick={handleClearAll}>
                <Trash2 className="w-4 h-4" />
                Limpar Todos
              </Button>
            )}
            <Button variant="primary" onClick={() => setShowUpload(true)}>
              <Upload className="w-4 h-4" />
              Upload Prints
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <Card variant="elevated" className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-primary-500">Total de Prints</p>
                <p className="text-2xl font-bold text-primary-900">{prints.length}</p>
              </div>
            </div>
          </Card>
          <Card variant="elevated" className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-primary-500">Armazenamento</p>
                <p className="text-2xl font-bold text-primary-900">
                  {formatBytes(prints.reduce((acc, p) => acc + p.size_bytes, 0))}
                </p>
              </div>
            </div>
          </Card>
          <Card variant="elevated" className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-primary-500">Formatos</p>
                <p className="text-2xl font-bold text-primary-900">PNG, JPG, ZIP</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => { setShowUpload(false); setUploadResult(null); }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-soft-lg w-full max-w-lg"
              >
                <CardHeader className="border-b border-primary-100">
                  <CardTitle>Upload de Prints</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
                    <h4 className="font-medium text-accent-800 mb-2">📋 Instruções</h4>
                    <ul className="text-sm text-accent-700 space-y-1">
                      <li>• O nome do arquivo deve ser o número do contrato</li>
                      <li>• Formatos aceitos: <strong>.png</strong>, <strong>.jpg</strong>, <strong>.jpeg</strong></li>
                      <li>• Você pode enviar um <strong>.zip</strong> com múltiplas imagens</li>
                      <li>• Exemplo: <code className="bg-accent-100 px-1 rounded">61796.png</code></li>
                    </ul>
                  </div>

                  <FileDropzone
                    onFilesSelected={handleUpload}
                    accept={{
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                      'application/zip': ['.zip'],
                      'application/x-rar-compressed': ['.rar'],
                    }}
                    multiple
                    maxFiles={50}
                    label="Arraste as imagens ou ZIP aqui"
                    description="PNG, JPG, JPEG ou arquivo ZIP"
                    disabled={isUploading}
                  />

                  {isUploading && (
                    <div className="flex items-center justify-center gap-3 py-4">
                      <div className="w-5 h-5 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-primary-600">Enviando prints...</span>
                    </div>
                  )}

                  {uploadResult && (
                    <div className={cn(
                      'rounded-xl p-4',
                      uploadResult.sucesso ? 'bg-success-50 border border-success-200' : 'bg-error-50 border border-error-200'
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        {uploadResult.sucesso ? (
                          <CheckCircle className="w-5 h-5 text-success-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-error-600" />
                        )}
                        <span className={cn(
                          'font-medium',
                          uploadResult.sucesso ? 'text-success-800' : 'text-error-800'
                        )}>
                          {uploadResult.mensagem}
                        </span>
                      </div>
                      
                      {uploadResult.rejeitados.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <p className="text-sm font-medium text-error-700">Arquivos rejeitados:</p>
                          {uploadResult.rejeitados.slice(0, 5).map((r, i) => (
                            <p key={i} className="text-xs text-error-600">
                              • {r.filename}: {r.reason}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => { setShowUpload(false); setUploadResult(null); }}
                    >
                      Fechar
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prints List */}
        {isLoading ? (
          <div className={cn(
            viewMode === 'grid' ? 'grid grid-cols-6 gap-4' : 'space-y-2'
          )}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className={cn(
                'animate-pulse',
                viewMode === 'grid' 
                  ? 'aspect-square bg-primary-100 rounded-xl' 
                  : 'h-16 bg-primary-100 rounded-xl'
              )} />
            ))}
          </div>
        ) : filteredPrints.length === 0 ? (
          <Card variant="bordered" className="p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-primary-900">
              {searchTerm ? 'Nenhum print encontrado' : 'Nenhum print cadastrado'}
            </h3>
            <p className="text-primary-500 mt-2 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? 'Tente buscar com outros termos' 
                : 'Faça upload das imagens das cláusulas contratuais para incluí-las nos documentos gerados.'
              }
            </p>
            {!searchTerm && (
              <Button variant="secondary" onClick={() => setShowUpload(true)}>
                <Upload className="w-4 h-4" />
                Upload Prints
              </Button>
            )}
          </Card>
        ) : viewMode === 'grid' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-6 gap-4"
          >
            {filteredPrints.map((print, index) => (
              <motion.div
                key={print.filename}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className="group relative aspect-square bg-white rounded-xl border border-primary-200 overflow-hidden hover:shadow-soft transition-all"
              >
                <img
                  src={getPrintUrl(print.contract_number)}
                  alt={print.contract_number}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMiI+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSIzIiByeD0iMiIvPjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIi8+PHBhdGggZD0ibTIxIDE1LTMuMDg2LTMuMDg2YTIgMiAwIDAgMC0yLjgyOCAwTDYgMjEiLz48L3N2Zz4=';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-medium text-sm truncate">
                      {print.contract_number}
                    </p>
                    <p className="text-white/70 text-xs">
                      {formatBytes(print.size_bytes)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(print.contract_number)}
                    className="absolute top-2 right-2 p-1.5 bg-error-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-600"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {filteredPrints.map((print, index) => (
              <motion.div
                key={print.filename}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card variant="bordered" className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={getPrintUrl(print.contract_number)}
                        alt={print.contract_number}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary-900">
                        Contrato {print.contract_number}
                      </p>
                      <p className="text-sm text-primary-500">
                        {print.filename} • {formatBytes(print.size_bytes)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(print.contract_number)}
                      className="p-2 hover:bg-error-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-error-500" />
                    </button>
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
