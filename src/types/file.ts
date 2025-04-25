export type FileLanguage = 'python' | 'text' | 'csv';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: FileLanguage;
  content?: string;
  children?: FileItem[];
}