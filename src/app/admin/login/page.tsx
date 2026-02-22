import type { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';

import { LoginForm } from './login-form';


export const metadata: Metadata = {
  title: 'Login — Revalife Admin',
  description: 'Painel administrativo Revalife',
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-800 p-4">
      {/* Glow decorativo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="bg-primary/10 absolute -top-40 -right-40 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo / Marca */}
        <div className="mb-8 text-center">
          <Image
            src="/images/logo-icon.png"
            width={144}
            height={144}
            alt="Logo Revalife"
            className="mx-auto mb-4 size-12 rounded-2xl"
          />
          <h1 className="text-2xl font-bold text-white">Revalife Admin</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Acesse o painel administrativo
          </p>
        </div>

        {/* Card de login */}
        <div className="bg-card rounded-2xl border border-neutral-800 p-6 shadow-2xl">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
