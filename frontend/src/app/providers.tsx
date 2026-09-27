import ThemeProvider from '@/lib/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

interface ProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export default function Providers({ children }: ProviderProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
