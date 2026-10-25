import { useEffect } from 'react';
import { toast } from 'sonner';

export const useErrorToast = (error: string | undefined) => {
  useEffect(() => {
    if (!error) return;

    toast.error(error);
  }, [error]);
};
