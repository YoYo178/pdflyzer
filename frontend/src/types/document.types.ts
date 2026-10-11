export interface IStoredDocument {
  _id: string;

  owner: string;
  filename: string;

  pages: number;
  size: number;
  
  status: 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED';

  created_at: string;
  updated_at: string;
}

export interface IDocument {
  id: string;

  chat: string;
  stored_document: IStoredDocument;

  created_at: string;
  updated_at: string;
}
