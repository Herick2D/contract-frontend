'use client';

import { useCallback, useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export function FileDropzone({
  onFilesSelected,
  accept,
  maxFiles = 1,
  maxSize = 50 * 1024 * 1024, // 50MB
  multiple = false,
  label = 'Arraste arquivos aqui',
  description = 'ou clique para selecionar',
  className,
  disabled = false,
}: FileDropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);
      
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(f => {
          if (f.errors[0]?.code === 'file-too-large') {
            return `${f.file.name}: arquivo muito grande`;
          }
          if (f.errors[0]?.code === 'file-invalid-type') {
            return `${f.file.name}: tipo não permitido`;
          }
          return `${f.file.name}: erro desconhecido`;
        });
        setError(errors.join(', '));
        return;
      }

      setFiles(acceptedFiles);
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple,
    disabled,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-accent-500 bg-accent-50'
            : 'border-primary-200 hover:border-primary-400 hover:bg-primary-50',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-error-300 bg-error-50'
        )}
      >
        <input {...getInputProps()} />
        
        <motion.div
          initial={false}
          animate={{ scale: isDragActive ? 1.05 : 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-200',
              isDragActive ? 'bg-accent-100 text-accent-600' : 'bg-primary-100 text-primary-500'
            )}
          >
            <Upload className="w-6 h-6" />
          </div>
          
          <div>
            <p className="text-primary-900 font-medium">{label}</p>
            <p className="text-sm text-primary-500 mt-1">{description}</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-error-600 text-sm bg-error-50 p-3 rounded-xl"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 bg-success-50 rounded-xl border border-success-200"
              >
                <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center">
                  <File className="w-5 h-5 text-success-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-primary-500">{formatBytes(file.size)}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1 hover:bg-primary-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-primary-500" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
