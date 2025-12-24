import type {
  StartSessionResponse,
  GetSessionResponse,
  UpdateSessionDto,
  UpdateSessionResponse,
  SubmitSessionDto,
  SubmitSessionResponse,
  UtmParameters,
} from '@/types/api.types';
import { fetchApi } from '@/lib/api-client';

/**
 * Serviço para comunicação com a API de sessões
 */
export const sessionApi = {
  /**
   * Inicia uma nova sessão do formulário
   * @returns Promise com sessionId e dados da sessão criada
   */
  startSession: () => fetchApi<StartSessionResponse>('/sessions/start'),

  /**
   * Busca uma sessão existente por ID
   * @param sessionId - UUID da sessão
   * @returns Promise com dados completos da sessão
   */
  getSession: (sessionId: string) =>
    fetchApi<GetSessionResponse>(`/sessions/${sessionId}`),

  /**
   * Atualiza uma sessão (auto-save)
   * @param sessionId - UUID da sessão
   * @param data - Dados a serem atualizados (currentStep e answers)
   * @returns Promise com confirmação da atualização
   */
  updateSession: (sessionId: string, data: UpdateSessionDto) =>
    fetchApi<UpdateSessionResponse>(`/sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Submete o formulário completo
   * @param sessionId - UUID da sessão
   * @param data - Respostas completas do formulário
   * @returns Promise com confirmação de submissão
   */
  submitSession: (sessionId: string, data: SubmitSessionDto) =>
    fetchApi<SubmitSessionResponse>(`/sessions/${sessionId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Registra UTM parameters da sessão
   * @param sessionId - UUID da sessão
   * @param utms - Parâmetros UTM da URL
   * @returns Promise com confirmação do registro
   */
  registerUtms: (sessionId: string, utms: UtmParameters) =>
    fetchApi<void>(`/sessions/${sessionId}/utms`, {
      method: 'POST',
      body: JSON.stringify(utms),
    }),
};
