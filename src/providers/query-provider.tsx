'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        toastOptions={{
          success: {
            style: {
              border: '1px solid rgba(76, 175, 80, 0.20)',
              background: '#EDF7ED)',
              color: '#4CAF50',
            },
          },
          error: {
            style: {
              background: 'rgb(245, 170, 183)',
              color: '#EE163E',
            },
          },
        }}
        position="top-right"
      />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
