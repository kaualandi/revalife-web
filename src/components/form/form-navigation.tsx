'use client';

import { Button } from '@/components/ui/button';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import type {
  QuestionCondition,
  QuestionConditionGroup,
} from '@/types/form.types';

interface FormNavigationProps {
  onContinue: () => void;
  isSaving?: boolean;
}

export function FormNavigation({ onContinue, isSaving }: FormNavigationProps) {
  const {
    canProceedToNextStep,
    getVisibleQuestions,
    currentStepIndex,
    formConfig,
    isStepVisible,
  } = useTreatmentFormStore();

  const canProceed = canProceedToNextStep();
  const visibleQuestions = getVisibleQuestions(currentStepIndex);

  // Verifica se há próximos steps com condições que dependem das respostas da etapa atual
  const hasConditionalNextSteps = () => {
    if (!formConfig) return false;

    const currentQuestionIds = visibleQuestions.map(q => q.id);

    // Verifica todos os steps após o atual
    for (let i = currentStepIndex + 1; i < formConfig.steps.length; i++) {
      const step = formConfig.steps[i];

      // Se o step tem showWhen
      if (step.showWhen) {
        // Verifica se alguma condição depende de perguntas do step atual
        const checkConditionDependency = (
          condition: QuestionCondition | QuestionConditionGroup
        ): boolean => {
          if ('questionId' in condition) {
            return currentQuestionIds.includes(condition.questionId);
          }
          if ('all' in condition && condition.all) {
            return condition.all.some((c: QuestionCondition) =>
              checkConditionDependency(c)
            );
          }
          if ('any' in condition && condition.any) {
            return condition.any.some((c: QuestionCondition) =>
              checkConditionDependency(c)
            );
          }
          return false;
        };

        if (checkConditionDependency(step.showWhen)) {
          return true; // Há um step condicional que depende da resposta atual
        }
      }
    }

    return false;
  };

  // Verifica se é o último step visível
  const isLastVisibleStep = () => {
    if (!formConfig) return false;

    // Verifica se há algum step visível após o atual
    for (let i = currentStepIndex + 1; i < formConfig.steps.length; i++) {
      if (isStepVisible(i)) {
        return false; // Existe um próximo step visível
      }
    }
    return true; // Não há próximos steps visíveis
  };

  const isLastStep = isLastVisibleStep();
  const hasConditionalSteps = hasConditionalNextSteps();

  // Tipos de perguntas que disparam auto-advance
  const autoAdvanceTypes = ['radio', 'radio-image', 'consent'];

  // Verifica se todas as perguntas visíveis são do tipo auto-advance
  const allQuestionsAutoAdvance = visibleQuestions.every(q =>
    autoAdvanceTypes.includes(q.type)
  );

  // Sempre mostra o botão se:
  // 1. É o último passo OU
  // 2. Há steps condicionais que dependem das respostas atuais OU
  // 3. Nem todas as perguntas são auto-advance
  if (
    !allQuestionsAutoAdvance ||
    visibleQuestions.length === 0 ||
    isLastStep ||
    hasConditionalSteps
  ) {
    // Mostra o botão
  } else {
    // Esconde o botão (apenas se todas são auto-advance E não é o último E não há condicionais)
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
