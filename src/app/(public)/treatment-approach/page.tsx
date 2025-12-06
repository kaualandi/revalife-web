'use client';

import { FormStepComponent } from '@/components/form/form-step';
import { FormNavigation } from '@/components/form/form-navigation';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { useFormAutoSave } from '@/hooks/use-form-autosave';
import { useFormSession } from '@/hooks/use-form-session';
import { treatmentFormConfig } from '@/config/treatment-form.config';
import type { FormAnswers } from '@/types/form.types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function TreatmentApproachPage() {
  const router = useRouter();
  const {
    currentStepIndex,
    answers,
    nextStep,
    previousStep,
    setIsSubmitting,
    sessionId,
  } = useTreatmentFormStore();
  const { initializeSession, isLoading: isLoadingSession } = useFormSession();
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const currentStep = treatmentFormConfig.steps[currentStepIndex];
  const isLastStep = currentStepIndex === treatmentFormConfig.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Inicializa/carrega sessão ao montar componente
  useEffect(() => {
    const init = async () => {
      // Se não tem sessionId, redireciona para home
      if (!sessionId) {
        router.push('/');
        return;
      }

      // Carrega dados da sessão
      await initializeSession();
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função de save para o backend
  const handleSave = async (formAnswers: FormAnswers) => {
    if (!sessionId) return;

    // TODO: Implementar chamada real para o backend
    // eslint-disable-next-line no-console
    console.log('Auto-saving:', { sessionId, answers: formAnswers });

    // Simulando chamada API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Exemplo de chamada real:
    // await fetch(`/api/treatment-form/session/${sessionId}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     currentStepIndex,
    //     answers: formAnswers,
    //   }),
    // });
  };

  // Hook de auto-save com debounce
  const { isSaving, saveNow } = useFormAutoSave({
    answers,
    onSave: handleSave,
    delay: 2000, // 2 segundos após parar de digitar
    enabled: !!sessionId, // Só salva se tem sessionId
  });

  // Função ao clicar em Continuar
  const handleContinue = () => {
    // Trigger save em background (não await)
    saveNow();

    if (isLastStep) {
      // Submete o formulário final
      setIsSubmitting(true);

      // TODO: Implementar submit final
      console.log('Submitting final form:', { sessionId, answers });

      // Exemplo:
      // fetch(`/api/treatment-form/session/${sessionId}/submit`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ answers }),
      // })
      //   .then(() => router.push('/next-page'))
      //   .finally(() => setIsSubmitting(false));
    } else {
      // Avança para próximo step
      setDirection('forward');
      nextStep();
    }
  };

  // Função para auto-advance ao selecionar radio
  const handleAutoAdvance = () => {
    // Salva em background
    saveNow();

    // Delay visual antes de avançar
    setTimeout(() => {
      if (!isLastStep) {
        setDirection('forward');
        nextStep();
      }
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

  return (
    <div className="flex min-h-screen flex-col px-4 pt-16 pb-8">
      <header className="mb-12 flex items-center justify-between">
        <Image
          src="/images/logo.svg"
          alt="Revolife Plus"
          width={150}
          height={30}
        />
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePreviousStep}
            className="gap-2"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>
        )}
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
