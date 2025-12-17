import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { treatmentFormConfig } from '@/config/treatment-form.config';
import { useEffect, useRef } from 'react';

import { useUpdateSession } from './use-session-queries';

/**
 * Hook para auto-save com debounce
 * Salva automaticamente as respostas do formulário após 2 segundos de inatividade
 *
 * @param enabled - Se o auto-save está ativo (default: true)
 * @param delay - Delay em ms antes de salvar (default: 2000ms)
 * @returns Estado do auto-save (isSaving, lastSaved, saveNow)
 */
export function useAutoSave(enabled = true, delay = 2000) {
  const { currentStepIndex, answers, sessionId } = useTreatmentFormStore();
  const updateSession = useUpdateSession();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const previousAnswersRef = useRef<typeof answers>(answers);
  const currentStepRef = useRef(currentStepIndex);

  // Manter ref atualizada com o step atual
  useEffect(() => {
    currentStepRef.current = currentStepIndex;
  }, [currentStepIndex]);

  useEffect(() => {
    // Não executar se não estiver habilitado ou sem sessionId
    if (!enabled || !sessionId) return;

    // Verificar se houve mudança nas respostas
    const hasChanged =
      JSON.stringify(answers) !== JSON.stringify(previousAnswersRef.current);

    if (!hasChanged) return;

    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Criar novo timeout para salvar
    timeoutRef.current = setTimeout(() => {
      // Salvar sempre o PRÓXIMO step (current + 1)
      // Indica que o usuário completou o step atual
      const currentStep = currentStepRef.current;
      const totalSteps = treatmentFormConfig.steps.length;
      const stepToSave = Math.min(currentStep + 1, totalSteps - 1);

      console.log('💾 Iniciando auto-save...', {
        currentStep,
        savingAs: stepToSave,
        fields: Object.keys(answers).length,
      });

      updateSession.mutate({
        currentStep: stepToSave,
        answers,
      });

      previousAnswersRef.current = answers;
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [answers, enabled, sessionId, delay, updateSession]);

  /**
   * Força salvamento imediato (sem debounce)
   * Útil para salvar antes de navegar ou submeter
   */
  const saveNow = () => {
    if (!sessionId) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Salvar sempre o PRÓXIMO step (current + 1)
    const currentStep = currentStepRef.current;
    const totalSteps = treatmentFormConfig.steps.length;
    const stepToSave = Math.min(currentStep + 1, totalSteps - 1);

    console.log('💾 Salvamento imediato', {
      currentStep,
      savingAs: stepToSave,
    });

    updateSession.mutate({
      currentStep: stepToSave,
      answers,
    });

    previousAnswersRef.current = answers;
  };

  return {
    isSaving: updateSession.isPending,
    lastSaved: updateSession.data?.updatedAt,
    saveNow,
  };
}
