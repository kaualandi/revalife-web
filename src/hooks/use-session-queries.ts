import type {
  UpdateSessionDto,
  SubmitSessionDto,
  ApiError,
  UtmParameters,
} from '@/types/api.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { sessionApi } from '@/services/session-service';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Query Keys para gerenciamento de cache
export const sessionKeys = {
  all: ['sessions'] as const,
  detail: (id: number | null) => [...sessionKeys.all, id] as const,
  forms: ['forms'] as const,
  formBySlug: (slug: string) => [...sessionKeys.forms, slug] as const,
};

/**
 * Hook para iniciar nova sessão
 * Cria uma nova sessão no backend e armazena o sessionId no Zustand
 */
export function useStartSession() {
  const {
    setSessionId,
    setFormSlug,
    setFormConfig,
    setLogoUrl,
    setFaviconUrl,
    setPrimaryColor,
    setSecondaryColor,
  } = useTreatmentFormStore();

  return useMutation({
    mutationFn: (formSlug: string) => sessionApi.startSession(formSlug),
    onSuccess: (data, formSlug) => {
      console.log('📦 Dados recebidos do backend:', data);

      setSessionId(data.sessionId);
      setFormSlug(formSlug);
      setFormConfig(data.formConfig);
      setLogoUrl(data.logoUrl);
      setFaviconUrl(data.faviconUrl);
      setPrimaryColor(data.primaryColor);
      setSecondaryColor(data.secondaryColor);

      console.log('✅ Sessão iniciada:', data.sessionId, 'Form:', formSlug);
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
 * Carrega dados do backend e sincroniza com o Zustand store APENAS na primeira vez
 */
export function useGetSession(sessionId: number | null) {
  const { loadFormData, formSlug: currentFormSlug } = useTreatmentFormStore();

  const query = useQuery({
    queryKey: sessionKeys.detail(sessionId),
    queryFn: () => sessionApi.getSession(sessionId as number),
    enabled: !!sessionId,
    staleTime: Infinity, // Nunca considerar stale - carregar apenas uma vez
    gcTime: Infinity, // Manter cache para sempre durante a sessão
    retry: 2,
  });

  useEffect(() => {
    // Sincronizar APENAS na primeira vez que os dados chegam (isSuccess transição)
    if (query.data && query.isSuccess && !query.isFetching) {
      // Verificar se a sessão está com status diferente de IN_PROGRESS
      if (query.data.status !== 'IN_PROGRESS') {
        console.log(
          '⚠️ Sessão não está mais ativa. Limpando e criando nova...'
        );

        // Limpar sessão do Zustand
        useTreatmentFormStore.getState().resetForm();
        useTreatmentFormStore.getState().setSessionId(null);

        toast.error('Sessão expirada', {
          description: 'Iniciando nova sessão...',
        });
        return;
      }

      // Usar formSlug do backend, ou manter o atual se não vier
      const formSlug = query.data.formSlug || currentFormSlug || '';

      loadFormData({
        currentStepIndex: query.data.currentStep,
        answers: query.data.answers,
        formConfig: query.data.formConfig,
        formSlug,
        logoUrl: query.data.logoUrl,
        faviconUrl: query.data.faviconUrl,
        primaryColor: query.data.primaryColor,
        secondaryColor: query.data.secondaryColor,
      });
      console.log(
        '✅ Sessão carregada:',
        sessionId,
        'FormSlug:',
        formSlug,
        'Step:',
        query.data.currentStep
      );

      // Extrair e enviar UTM's da URL
      const extractUtmsFromUrl = (): UtmParameters | null => {
        if (typeof window === 'undefined') return null;

        const params = new URLSearchParams(window.location.search);
        const utms: UtmParameters = {};

        const utmSource = params.get('utm_source');
        const utmMedium = params.get('utm_medium');
        const utmCampaign = params.get('utm_campaign');
        const utmContent = params.get('utm_content');
        const utmTerm = params.get('utm_term');
        const trackingId = params.get('tracking_id');
        const phDistinctId = params.get('ph_distinct_id');

        if (utmSource) utms.utm_source = utmSource;
        if (utmMedium) utms.utm_medium = utmMedium;
        if (utmCampaign) utms.utm_campaign = utmCampaign;
        if (utmContent) utms.utm_content = utmContent;
        if (utmTerm) utms.utm_term = utmTerm;
        if (trackingId) utms.tracking_id = trackingId;
        if (phDistinctId) utms.ph_distinct_id = phDistinctId;

        return Object.keys(utms).length > 0 ? utms : null;
      };

      const utms = extractUtmsFromUrl();
      if (utms && sessionId) {
        sessionApi
          .registerUtms(sessionId, utms)
          .then(() => {
            console.log("✅ UTM's registradas:", utms);

            // Remover UTM's da URL após salvar
            if (typeof window !== 'undefined') {
              const url = new URL(window.location.href);
              url.searchParams.delete('utm_source');
              url.searchParams.delete('utm_medium');
              url.searchParams.delete('utm_campaign');
              url.searchParams.delete('utm_content');
              url.searchParams.delete('utm_term');
              url.searchParams.delete('tracking_id');
              url.searchParams.delete('ph_distinct_id');

              // Atualizar URL sem reload
              window.history.replaceState({}, '', url.toString());
              console.log("✅ UTM's removidas da URL");
            }
          })
          .catch(err => console.error("❌ Erro ao registrar UTM's:", err));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.isSuccess]); // Roda apenas quando isSuccess muda (primeira vez)

  useEffect(() => {
    if (query.error) {
      const error = query.error as unknown as ApiError;
      console.error('❌ Erro ao carregar sessão:', error);

      // Limpar sessionId para forçar criação de nova sessão
      useTreatmentFormStore.getState().setSessionId(null);

      toast.error('Sessão inválida', {
        description: 'Criando nova sessão...',
      });
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
      sessionApi.updateSession(sessionId as number, data),
    onSuccess: (response, variables) => {
      // Atualizar cache local do React Query
      queryClient.setQueryData(
        sessionKeys.detail(sessionId),
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
      sessionApi.submitSession(sessionId as number, data),
    onSuccess: () => {
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
