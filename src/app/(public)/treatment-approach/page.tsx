'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';

export default function TreatmentApproachPage() {
  const router = useRouter();
  const { formSlug } = useTreatmentFormStore();

  useEffect(() => {
    // Redireciona para a nova estrutura de rotas
    const slug = formSlug || 'REVALIFE'; // Fallback para REVALIFE se não tiver formSlug
    const queryString =
      typeof window !== 'undefined' ? window.location.search : '';
    router.push(`/${slug}/form${queryString}`);
  }, [formSlug, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>
  );
}
