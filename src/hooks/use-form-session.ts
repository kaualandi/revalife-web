import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import type { FormAnswers } from '@/types/form.types';
import { useMutation } from '@tanstack/react-query';


interface SessionResponse {
  sessionId: string;
  currentStepIndex: number;
  answers: FormAnswers;
}

// Hook para gerenciar sessão do formulário
export function useFormSession() {
  const { sessionId, setSessionId, loadFormData, setIsLoading, resetForm } =
    useTreatmentFormStore();

  // Mutation para criar nova sessão
  const createSessionMutation = useMutation({
    mutationFn: async (): Promise<{ sessionId: string }> => {
      // TODO: Implementar chamada real
      // const response = await fetch('/api/treatment-form/session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      // });

      // if (!response.ok) {
      //   throw new Error('Erro ao criar sessão');
      // }

      // return response.json();
      return { sessionId: '123' };
    },
    onSuccess: data => {
      setSessionId(data.sessionId);
    },
  });

  // Mutation para carregar sessão existente
  const loadSessionMutation = useMutation({
    mutationFn: async (id: string): Promise<SessionResponse> => {
      console.log(id);
      // TODO: Implementar chamada real
      // const response = await fetch(`/api/treatment-form/session/${id}`);

      // if (!response.ok) {
      // throw new Error('Erro ao carregar sessão');
      // }

      // return response.json();
      return {
        sessionId: '123',
        answers: {
          'weight-goal': '5-10kg',
          motivation: ['self-esteem', 'event'],
          'previous-methods': ['prescribed-medication', 'bariatric-surgery'],
          'biological-sex': 'male',
          'body-type-male': 'medium',
          'full-name': 'Kauã Landi Fernando',
          email: 'kaualandi@hotmail.com',
          phone: '(21) 99922-2644',
          consent: 'accepted',
          height: '184',
          birthdate: '2005-10-02',
          'current-weight': '74',
          'health-conditions': ['hypertension', 'heart-disease'],
          'uses-medication': 'yes',
          'medication-types': ['none', 'thyroid-hormone'],
          'medication-list': 'adasd',
          'family-health-conditions': ['men2'],
        },
        currentStepIndex: 13,
      } as SessionResponse;
    },
    onSuccess: data => {
      setSessionId(data.sessionId);
      loadFormData({
        currentStepIndex: data.currentStepIndex,
        answers: data.answers,
      });
    },
  });

  // Cria nova sessão
  const createSession = async () => {
    setIsLoading(true);
    try {
      await createSessionMutation.mutateAsync();
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega sessão existente
  const loadSession = async (id: string) => {
    setIsLoading(true);
    try {
      await loadSessionMutation.mutateAsync(id);
    } catch (error) {
      // Se falhar ao carregar, limpa e cria nova sessão
      console.error('Erro ao carregar sessão:', error);
      resetForm();
      await createSession();
    } finally {
      setIsLoading(false);
    }
  };

  // Inicializa ou recupera sessão automaticamente
  const initializeSession = async () => {
    if (sessionId) {
      await loadSession(sessionId);
    } else {
      await createSession();
    }
  };

  return {
    sessionId,
    isLoading:
      useTreatmentFormStore(state => state.isLoading) ||
      createSessionMutation.isPending ||
      loadSessionMutation.isPending,
    createSession,
    loadSession,
    initializeSession,
    hasExistingSession: !!sessionId,
  };
}
