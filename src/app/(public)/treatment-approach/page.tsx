'use client';

import { FormStepComponent } from '@/components/form/form-step';
import { FormNavigation } from '@/components/form/form-navigation';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { useFormAutoSave } from '@/hooks/use-form-autosave';
import { useFormSession } from '@/hooks/use-form-session';
import { treatmentFormConfig } from '@/config/treatment-form.config';
import type { FormAnswers } from '@/types/form.types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function TreatmentApproachPage() {
  const router = useRouter();
  const { currentStepIndex, answers, nextStep, setIsSubmitting, sessionId } =
    useTreatmentFormStore();
  const { initializeSession, isLoading: isLoadingSession } = useFormSession();

  const currentStep = treatmentFormConfig.steps[currentStepIndex];
  const isLastStep = currentStepIndex === treatmentFormConfig.steps.length - 1;

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
  const handleContinue = async () => {
    // Salva imediatamente antes de continuar
    await saveNow();

    if (isLastStep) {
      // Submete o formulário final
      setIsSubmitting(true);

      try {
        // TODO: Implementar submit final
        console.log('Submitting final form:', { sessionId, answers });

        // Exemplo:
        // await fetch(`/api/treatment-form/session/${sessionId}/submit`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ answers }),
        // });

        // Redirecionar para próxima página
        // router.push('/next-page');
      } catch (error) {
        console.error('Erro ao submeter:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Avança para próximo step
      nextStep();
    }
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
      <header className="mb-12">
        <Image
          src="/images/logo.svg"
          alt="Revolife Plus"
          width={150}
          height={30}
        />
      </header>

      <main className="mb-8 flex-1">
        {currentStep && <FormStepComponent step={currentStep} />}
      </main>

      <footer className="mt-auto">
        <FormNavigation onContinue={handleContinue} isSaving={isSaving} />
      </footer>
    </div>
  );
}
