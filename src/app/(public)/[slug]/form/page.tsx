'use client';

import { FormNavigation } from '@/components/form/form-navigation';
import { FormStepComponent } from '@/components/form/form-step';
import { FormFinalLoading } from '@/components/form/form-final-loading';
import { FormFinalMessage } from '@/components/form/form-final-message';
import { useGetSession, useSubmitSession } from '@/hooks/use-session-queries';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { useAutoSave } from '@/hooks/use-auto-save';
import { ErrorMessage } from '@/components/ui/error-message';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';

export default function TreatmentFormPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string)?.toUpperCase() || '';

  const {
    sessionId,
    formConfig,
    logoUrl,
    formSlug: currentFormSlug,
    currentStepIndex,
    answers,
    nextStep,
    previousStep,
  } = useTreatmentFormStore();

  const sessionQuery = useGetSession(sessionId);
  const submitSession = useSubmitSession();

  // Auto-save com debounce de 2s
  const { isSaving, saveNow } = useAutoSave(!!sessionId);

  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [showFinalLoading, setShowFinalLoading] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Verificar se sessão existe e é do formulário correto
  useEffect(() => {
    if (!sessionId || currentFormSlug !== slug) {
      router.push(`/${slug}`);
    }
  }, [sessionId, currentFormSlug, slug, router]);

  // Se não tem formConfig ainda, aguardar
  if (!formConfig || sessionQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando formulário...</p>
      </div>
    );
  }

  // Erro ao carregar sessão
  if (sessionQuery.isError) {
    return (
      <ErrorMessage
        title="Erro ao carregar sessão"
        message="Não foi possível carregar seus dados. Tente novamente."
        onRetry={() => router.push(`/${slug}`)}
        retryLabel="Reiniciar"
      />
    );
  }

  const currentStep = formConfig.steps[currentStepIndex];

  // Verifica se o step atual é o último step visível
  const isLastVisibleStep = () => {
    const { isStepVisible } = useTreatmentFormStore.getState();

    // Verifica se há algum step visível após o atual
    for (let i = currentStepIndex + 1; i < formConfig.steps.length; i++) {
      if (isStepVisible(i)) {
        return false; // Existe um próximo step visível
      }
    }
    return true; // Não há próximos steps visíveis
  };

  const isLastStep = isLastVisibleStep();
  const isFirstStep = currentStepIndex === 0;

  // Função ao clicar em Continuar
  const handleContinue = () => {
    if (isLastStep) {
      // Salvar antes de submeter
      saveNow();

      // Mostrar loading final
      setShowFinalLoading(true);

      // Submeter formulário para o backend
      submitSession.mutate(
        { answers },
        {
          onSuccess: data => {
            // Processar resposta baseada no status
            if (data.status === 'APPROVED' && data.productUrl) {
              // Concatenar UTM's na productUrl se existirem
              let finalUrl = data.productUrl;

              if (data.latestUtm) {
                const url = new URL(data.productUrl);
                const utms = data.latestUtm;

                if (utms.utm_source)
                  url.searchParams.set('utm_source', utms.utm_source);
                if (utms.utm_medium)
                  url.searchParams.set('utm_medium', utms.utm_medium);
                if (utms.utm_campaign)
                  url.searchParams.set('utm_campaign', utms.utm_campaign);
                if (utms.utm_content)
                  url.searchParams.set('utm_content', utms.utm_content);
                if (utms.utm_term)
                  url.searchParams.set('utm_term', utms.utm_term);

                finalUrl = url.toString();
                console.log("✅ URL com UTM's:", finalUrl);
              }

              // Redirecionar para URL do produto (mesma aba)
              window.location.href = finalUrl;
            } else if (data.status === 'REJECTED') {
              // Mostrar mensagem de rejeição
              setShowFinalLoading(false);
              setShowFinalMessage(true);
            }
          },
          onError: () => {
            // Em caso de erro, voltar para o formulário
            setShowFinalLoading(false);
          },
        }
      );
    } else {
      // Avançar para próximo step (sem salvar - o auto-save vai fazer isso)
      setDirection('forward');
      nextStep();
    }
  };

  // Função para auto-advance ao selecionar radio
  const handleAutoAdvance = () => {
    // Previne múltiplos avanços simultâneos
    if (isAdvancing) return;

    setIsAdvancing(true);

    // Salva em background
    saveNow();

    // Delay visual antes de avançar
    setTimeout(() => {
      if (!isLastStep) {
        setDirection('forward');
        nextStep();
      }
      // Libera o lock após o avanço
      setTimeout(() => setIsAdvancing(false), 100);
    }, 300);
  };

  // Função para voltar step
  const handlePreviousStep = () => {
    setDirection('backward');
    previousStep();
  };

  // Mostrar tela de loading final
  if (showFinalLoading) {
    return <FormFinalLoading />;
  }

  // Mostrar mensagem final
  if (showFinalMessage) {
    return <FormFinalMessage />;
  }

  console.log({ logoUrl });

  return (
    <div className="flex min-h-screen flex-col px-3 pt-3 pb-3">
      <header className="relative mb-14 flex min-h-9 items-center justify-between gap-4">
        <div className="flex-1">
          {!isFirstStep && (
            <Button
              type="button"
              variant="ghost"
              onClick={handlePreviousStep}
              size="icon"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>
        {logoUrl && (
          <Image
            src={logoUrl}
            alt={formConfig.name || 'Logo'}
            className="w-24 flex-1"
            width={150}
            height={15}
          />
        )}
        <div className="flex-1" />
      </header>

      <main className="mb-8 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {currentStep && (
            <motion.div
              key={currentStepIndex}
              initial={{
                opacity: 0,
                x: direction === 'forward' ? 50 : -50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: direction === 'forward' ? -50 : 50,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
            >
              <FormStepComponent
                step={currentStep}
                onAutoAdvance={handleAutoAdvance}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto">
        <FormNavigation onContinue={handleContinue} isSaving={isSaving} />
      </footer>
    </div>
  );
}
