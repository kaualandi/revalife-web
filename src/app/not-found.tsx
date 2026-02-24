import { BackButton } from '@/components/ui/back-button';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '404 — Página não encontrada | Revalife',
};

export default function NotFoundPage() {
  return (
    <main className="dark flex min-h-dvh items-center justify-center bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-800 p-4">
      {/* Glow decorativo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="bg-primary/10 absolute -top-40 -right-40 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center text-center">
        {/* Logo */}
        <Image
          src="/images/logo-icon.png"
          width={144}
          height={144}
          alt="Logo Revalife"
          className="mb-4 size-12 rounded-2xl"
        />

        <p className="mb-1 text-sm font-medium tracking-widest text-neutral-500 uppercase">
          Revalife
        </p>

        {/* Número 404 */}
        <h1 className="text-primary/80 mt-4 text-8xl font-extrabold tracking-tight select-none">
          404
        </h1>

        {/* Linha divisória */}
        <div className="bg-primary/20 my-6 h-px w-16 rounded-full" />

        {/* Mensagem */}
        <h2 className="mb-2 text-xl font-semibold text-white">
          Essa página sumiu no ar
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
          Parece que o endereço que você acessou não existe mais, nunca existiu,
          ou foi movido para outro lugar. Sem drama, você pode voltar e seguir
          em frente.
        </p>

        {/* Botão voltar */}
        <BackButton className="mt-8" />
      </div>
    </main>
  );
}
