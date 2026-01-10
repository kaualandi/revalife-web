'use client';

import { useStartSession } from '@/hooks/use-session-queries';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { ErrorMessage } from '@/components/ui/error-message';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function FormSlugPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string)?.toUpperCase() || '';

  const startSession = useStartSession();
  const store = useTreatmentFormStore();
  const sessionId = store.sessionId;
  const currentFormSlug = store.formSlug || ''; // Garantir string vazia em vez de null
  const hasHydrated = store.hasHydrated;
  const resetForm = store.resetForm;
  const setSessionId = store.setSessionId;

  const hasAttemptedStart = useRef(false);

  // Verificar se mudou o formulário
  useEffect(() => {
    if (!hasHydrated) return;

    // Se já tem sessão mas é de outro formulário, resetar
    if (sessionId && currentFormSlug && currentFormSlug !== slug) {
      console.log(
        `🔄 Mudança de formulário detectada: ${currentFormSlug} → ${slug}`
      );
      resetForm();
      setSessionId(null);
      hasAttemptedStart.current = false;
    }
  }, [sessionId, currentFormSlug, slug, hasHydrated, resetForm, setSessionId]);

  // Criar sessão automaticamente ao montar o componente
  useEffect(() => {
    console.log('🔍 useEffect executado com:', {
      sessionId,
      currentFormSlug,
      slug,
      hasHydrated,
      types: {
        sessionId: typeof sessionId,
        currentFormSlug: typeof currentFormSlug,
        slug: typeof slug,
        hasHydrated: typeof hasHydrated,
      },
    });

    // Aguardar hidratação do Zustand
    if (!hasHydrated) return;

    // Preservar query params (UTM's) no redirecionamento
    const queryString =
      typeof window !== 'undefined' ? window.location.search : '';
    const targetUrl = `/${slug}/form${queryString}`;

    // Se já tem sessão válida do mesmo formulário, redirecionar direto
    if (sessionId && currentFormSlug === slug) {
      console.log('✅ Redirecionando para:', targetUrl);
      router.push(targetUrl);
      return;
    }

    // Criar nova sessão apenas uma vez
    if (!hasAttemptedStart.current && !startSession.isPending && !sessionId) {
      console.log('🚀 Iniciando nova sessão para:', slug);
      hasAttemptedStart.current = true;
      startSession.mutate(slug, {
        onSuccess: () => {
          console.log('✅ Sessão criada, redirecionando para:', targetUrl);
          router.push(targetUrl);
        },
      });
    }
  }, [sessionId, currentFormSlug, slug, hasHydrated, startSession, router]);

  // Mostrar erro se formulário não existe (404)
  if (startSession.isError) {
    const error = startSession.error as {
      statusCode?: number;
      message?: string;
    };

    if (error.statusCode === 404) {
      return (
        <ErrorMessage
          title="Formulário não encontrado"
          message={`O formulário "${slug}" não existe ou não está disponível.`}
          onRetry={() => router.push('/')}
          retryLabel="Voltar ao início"
        />
      );
    }

    return (
      <ErrorMessage
        title="Erro ao carregar formulário"
        message="Não foi possível conectar ao servidor. Tente novamente."
        onRetry={() => {
          hasAttemptedStart.current = false;
          startSession.reset();
        }}
      />
    );
  }

  // Mostrar loading
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground text-lg">
          Iniciando formulário {slug}...
        </p>
      </div>
    </div>
  );
}
