import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

export function isValidExcelFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ['xlsx', 'xls'].includes(ext);
}

export function isValidImageFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ['png', 'jpg', 'jpeg'].includes(ext);
}

export function isValidArchiveFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ['zip', 'rar'].includes(ext);
}

export function isValidTemplateFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ext === 'docx';
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
