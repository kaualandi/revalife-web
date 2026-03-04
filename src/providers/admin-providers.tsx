'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authClient } from '@/lib/api-admin';

export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

/**
 * Envolve as páginas do dashboard que exigem autenticação.
 * Se a sessão expirar no cliente, redireciona automaticamente para o login.
 */
export function AdminSessionGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      const loginUrl = `/admin/login?callbackUrl=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    }
  }, [session, isPending, router, pathname]);

  // Enquanto verifica ou sessão válida, renderiza normalmente
  if (isPending || session) return <>{children}</>;

  // Sessão ausente — aguarda o redirect sem renderizar o conteúdo
  return null;
}
