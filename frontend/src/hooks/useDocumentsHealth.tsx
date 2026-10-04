import type { IDocument } from '@/types/document.types';
import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconLoader2,
} from '@tabler/icons-react';
import { useMemo } from 'react';

interface IDocumentsHealthProps {
  documents: IDocument[];
}

type TDocumentStatus = 'READY' | 'PROCESSING' | 'QUEUED' | 'FAILED';
type TDocumentHealth = 'HEALTHY' | 'QUEUED' | 'PROCESSING' | 'WARN' | 'DANGER';

export const useDocumentsHealth = ({ documents }: IDocumentsHealthProps) => {
  const documentsCount = useMemo(() => {
    return documents.reduce(
      (acc, val) => {
        const state = val.status;

        if (!acc?.[state]) acc[state] = 1;
        else acc[state]++;

        return acc;
      },
      {} as Record<TDocumentStatus, number>,
    );
  }, [documents]);

  let documentsHealth: TDocumentHealth | null = null;

  // All documents have been parsed
  if (documentsCount.READY === documents.length) {
    documentsHealth = 'HEALTHY';
  }

  // At least one of the documents are in queue to be processed
  if (documentsCount.QUEUED > 0) {
    documentsHealth = 'QUEUED';
  }

  // At least one of the documents are being processed
  if (documentsCount.PROCESSING > 0) {
    documentsHealth = 'PROCESSING';
  }

  // At least one of the documents failed processing
  if (documentsCount.FAILED > 0 && documentsCount.FAILED < documents.length) {
    documentsHealth = 'WARN';
  }

  // All of the documents have failed processing
  if (documentsCount.FAILED === documents.length) {
    documentsHealth = 'DANGER';
  }

  // Prepare render JSX for the status icon according to the documents health status
  let render = null;
  switch (documentsHealth) {
    case 'HEALTHY':
      render = (
        <IconCircleCheck
          title={'All of your documents have been parsed successfully!'}
          className='size-4 text-green-600'
        />
      );
      break;
    case 'QUEUED':
      render = (
        <IconClock
          title={'One or more documents are pending to be processed'}
          className='size-4 text-blue-600'
        />
      );
      break;
    case 'PROCESSING':
      render = (
        <IconLoader2
          title={'Your document(s) are being parsed'}
          className='animate-spin size-4 text-blue-600'
        />
      );
      break;
    case 'WARN':
      render = (
        <IconAlertCircle
          title={'Some of your documents failed to parse!'}
          className='size-4 text-yellow-600'
        />
      );
      break;
    case 'DANGER':
      render = (
        <IconCircleX
          title={'None of your documents were parsed.'}
          className='size-4 text-red-600'
        />
      );
      break;
    default:
      break;
  }

  return {
    render,
    documentsHealth,

    failedDocumentsLength: documentsCount.FAILED,
    processingDocumentsLength: documentsCount.PROCESSING,
    queuedDocumentsLength: documentsCount.QUEUED,
    readyDocumentsLength: documentsCount.READY,
  };
};
