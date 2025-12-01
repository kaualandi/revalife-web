import type { FormAnswers } from '@/types/form.types';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';


interface UseFormAutoSaveOptions {
  answers: FormAnswers;
  onSave: (answers: FormAnswers) => Promise<void>;
  delay?: number; // Delay em ms antes de salvar (default: 2000ms)
  enabled?: boolean; // Permite desabilitar auto-save
}

// Hook para auto-save do formulário com debounce
export function useFormAutoSave({
  answers,
  onSave,
  delay = 2000,
  enabled = true,
}: UseFormAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousAnswersRef = useRef<FormAnswers>(answers);

  // Mutation para salvar
  const saveMutation = useMutation({
    mutationFn: onSave,
    onError: error => {
      console.error('Erro ao salvar formulário:', error);
    },
  });

  useEffect(() => {
    if (!enabled) return;

    // Verifica se houve mudança nas respostas
    const hasChanged =
      JSON.stringify(answers) !== JSON.stringify(previousAnswersRef.current);

    if (!hasChanged) return;

    // Limpa timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Cria novo timeout para salvar
    timeoutRef.current = setTimeout(() => {
      saveMutation.mutate(answers);
      previousAnswersRef.current = answers;
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [answers, enabled, delay, saveMutation]);

  // Força save imediato (útil ao clicar em "Continuar")
  const saveNow = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await saveMutation.mutateAsync(answers);
    previousAnswersRef.current = answers;
  };

  return {
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
    saveNow,
  };
}
