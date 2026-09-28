import ThemeProvider from '@/lib/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

interface IProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export default function Providers({ children }: IProviderProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
