export interface IDocument {
  id: string;
  filename: string;
  size: number;
  status: 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED';

  pages: number; // TODO: add in backend
}