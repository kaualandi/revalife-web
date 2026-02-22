import type { BetterAuthSessionResponse } from '@/types/admin.types';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Só atua em rotas /admin/*
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Páginas de login são públicas
  const publicAdminPaths = ['/admin/login', '/admin/login/reset-password'];
  if (publicAdminPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Validar sessão junto ao backend Better Auth
  try {
    const cookieHeader = request.headers.get('cookie') ?? '';

    const response = await fetch(`${API_URL}/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Sessão inválida: HTTP ${response.status}`);
    }

    const data: BetterAuthSessionResponse | null = await response
      .json()
      .catch(() => null);

    if (!data?.session || !data?.user) {
      throw new Error('Sem sessão no retorno');
    }

    // Sessão válida — continuar
    return NextResponse.next();
  } catch (err) {
    console.log(err);
    // Redirecionar para login preservando a URL de destino
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
