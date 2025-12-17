import type {
  UpdateSessionDto,
  SubmitSessionDto,
  ApiError,
} from '@/types/api.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { sessionApi } from '@/services/session-service';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Query Keys para gerenciamento de cache
export const sessionKeys = {
  all: ['sessions'] as const,
  detail: (id: string) => [...sessionKeys.all, id] as const,
};

/**
 * Hook para iniciar nova sessão
 * Cria uma nova sessão no backend e armazena o sessionId no Zustand
 */
export function useStartSession() {
  const { setSessionId } = useTreatmentFormStore();

  return useMutation({
    mutationFn: sessionApi.startSession,
    onSuccess: data => {
      setSessionId(data.sessionId);
      console.log('✅ Sessão iniciada:', data.sessionId);
    },
    onError: (error: ApiError) => {
      const message = Array.isArray(error.message)
        ? error.message.join(', ')
        : error.message || 'Não foi possível iniciar o formulário';

      toast.error('Erro ao iniciar', {
        description: message,
      });
      console.error('❌ Erro ao iniciar sessão:', error);
    },
  });
}

/**
 * Hook para buscar sessão existente
 * Carrega dados do backend e sincroniza com o Zustand store
 */
export function useGetSession(sessionId: string | null) {
  const { loadFormData } = useTreatmentFormStore();

  const query = useQuery({
    queryKey: sessionKeys.detail(sessionId || ''),
    queryFn: () => sessionApi.getSession(sessionId || ''),
    enabled: !!sessionId,
    staleTime: 30000, // 30 segundos
    retry: 2,
  });

  useEffect(() => {
    if (query.data) {
      // Sincronizar dados do backend com o store local
      loadFormData({
        currentStepIndex: query.data.currentStep,
        answers: query.data.answers,
      });
      console.log('✅ Sessão carregada:', sessionId);
    }
  }, [query.data, loadFormData, sessionId]);

  useEffect(() => {
    if (query.error) {
      const error = query.error as unknown as ApiError;
      console.error('❌ Erro ao carregar sessão:', error);

      // Se a sessão não existe, limpar sessionId
      if (error.statusCode === 404) {
        useTreatmentFormStore.getState().setSessionId(null);
      }
    }
  }, [query.error]);

  return query;
}

/**
 * Hook para atualizar sessão (auto-save)
 * Envia atualizações incrementais para o backend
 */
export function useUpdateSession() {
  const queryClient = useQueryClient();
  const { sessionId } = useTreatmentFormStore();

  return useMutation({
    mutationFn: (data: UpdateSessionDto) =>
      sessionApi.updateSession(sessionId || '', data),
    onSuccess: (response, variables) => {
      // Atualizar cache local do React Query
      queryClient.setQueryData(
        sessionKeys.detail(sessionId || ''),
        (
          old:
            | {
                currentStep?: number;
                answers?: Record<string, unknown>;
                updatedAt?: string;
              }
            | undefined
        ) => ({
          ...old,
          currentStep: variables.currentStep,
          answers: { ...old?.answers, ...variables.answers },
          updatedAt: response.updatedAt,
        })
      );

      console.log('💾 Auto-save concluído');
    },
    onError: (error: ApiError) => {
      console.error('❌ Erro no auto-save:', error);

      // Não mostrar toast para erros de auto-save (não bloqueia usuário)
      // Apenas logar no console
    },
  });
}

/**
 * Hook para submeter formulário completo
 * Envia todas as respostas e marca a sessão como concluída
 */
export function useSubmitSession() {
  const { sessionId } = useTreatmentFormStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitSessionDto) =>
      sessionApi.submitSession(sessionId || '', data),
    onSuccess: () => {
      toast.success('Formulário enviado!', {
        description: 'Suas respostas foram salvas com sucesso',
      });

      // Invalidar cache da sessão
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });

      console.log('✅ Formulário submetido com sucesso');
    },
    onError: (error: ApiError) => {
      const message = Array.isArray(error.message)
        ? error.message.join(', ')
        : error.message || 'Erro ao enviar formulário';

      toast.error('Erro ao enviar', {
        description: message,
      });

      console.error('❌ Erro ao submeter formulário:', error);
    },
  });
}
