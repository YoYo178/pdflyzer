export interface IDocument {
  _id: string;
  filename: string;
  size: number;
  status: 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED';
  pages: number;
}