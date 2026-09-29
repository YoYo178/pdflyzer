import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

interface IProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export default function Providers({ children }: IProviderProps) {
  return (
    <ThemeProvider attribute='class'>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
