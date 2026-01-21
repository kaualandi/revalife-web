import type {
  StartSessionResponse,
  GetSessionResponse,
  UpdateSessionDto,
  UpdateSessionResponse,
  SubmitSessionDto,
  SubmitSessionResponse,
  UtmParameters,
  GetFormsResponse,
  GetFormBySlugResponse,
} from '@/types/api.types';
import { fetchApi } from '@/lib/api-client';

/**
 * Serviço para comunicação com a API de sessões e formulários
 */
export const sessionApi = {
  /**
   * Lista todos os formulários disponíveis
   * @returns Promise com lista de formulários
   */
  getForms: () => fetchApi<GetFormsResponse[]>('/forms'),

  /**
   * Busca configuração de um formulário específico
   * @param formSlug - Slug do formulário (REVALIFE, TEST1, etc.)
   * @returns Promise com configuração completa do formulário
   */
  getFormConfig: (formSlug: string) =>
    fetchApi<GetFormBySlugResponse>(`/forms/${formSlug}`),

  /**
   * Inicia uma nova sessão do formulário
   * @param formSlug - Slug do formulário a ser iniciado
   * @returns Promise com sessionId e dados da sessão criada
   */
  startSession: (formSlug: string) =>
    fetchApi<StartSessionResponse>(`/sessions/start?formSlug=${formSlug}`),

  /**
   * Busca uma sessão existente por ID
   * @param sessionId - ID numérico da sessão
   * @returns Promise com dados completos da sessão incluindo formConfig
   */
  getSession: (sessionId: number) =>
    fetchApi<GetSessionResponse>(`/sessions/${sessionId}`),

  /**
   * Atualiza uma sessão (auto-save)
   * @param sessionId - ID numérico da sessão
   * @param data - Dados a serem atualizados (currentStep e answers)
   * @returns Promise com confirmação da atualização
   */
  updateSession: (sessionId: number, data: UpdateSessionDto) =>
    fetchApi<UpdateSessionResponse>(`/sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Submete o formulário completo
   * @param sessionId - ID numérico da sessão
   * @param data - Respostas completas do formulário
   * @returns Promise com confirmação de submissão (APPROVED ou REJECTED)
   */
  submitSession: (sessionId: number, data: SubmitSessionDto) =>
    fetchApi<SubmitSessionResponse>(`/sessions/${sessionId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Registra UTM parameters da sessão
   * @param sessionId - ID numérico da sessão
   * @param utms - Parâmetros UTM da URL
   * @returns Promise com confirmação do registro
   */
  registerUtms: (sessionId: number, utms: UtmParameters) =>
    fetchApi<void>(`/sessions/${sessionId}/utms`, {
      method: 'POST',
      body: JSON.stringify(utms),
    }),
};
