'use client';

import { FormStepComponent } from '@/components/form/form-step';
import { FormNavigation } from '@/components/form/form-navigation';
import { FormFinalLoading } from '@/components/form/form-final-loading';
import { FormFinalMessage } from '@/components/form/form-final-message';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useGetSession, useSubmitSession } from '@/hooks/use-session-queries';
import { treatmentFormConfig } from '@/config/treatment-form.config';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function TreatmentApproachPage() {
  const router = useRouter();
  const { currentStepIndex, answers, nextStep, previousStep, sessionId } =
    useTreatmentFormStore();

  // Carregar sessão do backend
  const { isLoading: isLoadingSession, isError: isErrorSession } =
    useGetSession(sessionId);

  // Auto-save com debounce de 2s
  const { isSaving, saveNow } = useAutoSave(!!sessionId);

  // Submit do formulário
  const submitSession = useSubmitSession();

  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [showFinalLoading, setShowFinalLoading] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const currentStep = treatmentFormConfig.steps[currentStepIndex];
  const isLastStep = currentStepIndex === treatmentFormConfig.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Redirecionar para home se não tem sessão ou se deu erro
  useEffect(() => {
    if ((!sessionId && !isLoadingSession) || isErrorSession) {
      router.push('/');
    }
  }, [sessionId, isLoadingSession, isErrorSession, router]);

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
          onSuccess: () => {
            // Loading já está mostrando, aguardar conclusão
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

  // Função chamada quando o loading final termina
  const handleFinalLoadingComplete = useCallback(() => {
    // Desativar loading e mostrar mensagem final
    setShowFinalLoading(false);
    setShowFinalMessage(true);
  }, []);

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

  // Mostra loading enquanto carrega sessão
  if (isLoadingSession || !sessionId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  // Mostra tela de loading final após submeter
  if (showFinalLoading) {
    return <FormFinalLoading onComplete={handleFinalLoadingComplete} />;
  }

  // Mostra mensagem final após loading
  if (showFinalMessage) {
    return <FormFinalMessage />;
  }

  return (
    <div className="flex min-h-screen flex-col px-3 pt-3 pb-3">
      <header className="relative mb-14 flex items-center justify-center gap-4">
        {!isFirstStep && (
          <Button
            type="button"
            variant="ghost"
            onClick={handlePreviousStep}
            size="icon"
            className="absolute left-0 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <Image
          src="/images/logo.svg"
          alt="Revolife Plus"
          className="w-24"
          width={150}
          height={15}
        />
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
