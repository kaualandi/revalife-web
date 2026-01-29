'use client';

import { Button } from '@/components/ui/button';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';

interface FormNavigationProps {
  onContinue: () => void;
  isSaving?: boolean;
}

export function FormNavigation({ onContinue, isSaving }: FormNavigationProps) {
  const { canProceedToNextStep, getVisibleQuestions, currentStepIndex } =
    useTreatmentFormStore();

  const canProceed = canProceedToNextStep();
  const visibleQuestions = getVisibleQuestions(currentStepIndex);

  // Tipos de perguntas que disparam auto-advance
  const autoAdvanceTypes = ['radio', 'radio-image', 'consent'];

  // Verifica se todas as perguntas visíveis são do tipo auto-advance
  const allQuestionsAutoAdvance = visibleQuestions.every(q =>
    autoAdvanceTypes.includes(q.type)
  );

  // Se todas as perguntas são auto-advance, não mostra o botão
  if (allQuestionsAutoAdvance && visibleQuestions.length > 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Botão Continuar */}
      <Button
        onClick={onContinue}
        disabled={!canProceed || isSaving}
        className="w-full"
        size="lg"
      >
        Continuar
      </Button>
    </div>
  );
}
