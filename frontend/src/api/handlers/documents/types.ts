import type { IDocument } from '@/types/document.types';

export type TGetDocumentsResponse = IDocument[];

export interface IUploadDocumentsRequest {
  chatId: string;
  files: File[];
}
export type TUploadDocumentsResponse = void;

export interface IDeleteDocumentRequest {
  chatId: string;
  documentId: string;
}
export type IDeleteDocumentResponse = void;
