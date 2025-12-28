import { devtools } from 'zustand/middleware';
import { create } from 'zustand';


/**
 * Store para gerenciar o acesso autorizado aos produtos
 *
 * IMPORTANTE: Este store NÃO usa persist para evitar adulteração no localStorage.
 * O acesso ao produto deve ser validado durante a sessão atual apenas.
 */
interface ProductAccessState {
  authorizedProductId: string | null;
  sessionId: string | null;

  /**
   * Autoriza o acesso a um produto específico
   * Deve ser chamado quando o usuário completa o formulário e é redirecionado
   */
  authorizeProduct: (productId: string, sessionId: string) => void;

  /**
   * Verifica se o usuário tem acesso ao produto
   */
  hasAccessToProduct: (productId: string) => boolean;

  /**
   * Remove a autorização (útil para testes ou logout)
   */
  clearAccess: () => void;
}

export const useProductAccessStore = create<ProductAccessState>()(
  devtools(
    (set, get) => ({
      authorizedProductId: null,
      sessionId: null,

      authorizeProduct: (productId, sessionId) => {
        set({
          authorizedProductId: productId,
          sessionId,
        });
      },

      hasAccessToProduct: productId => {
        const state = get();
        return (
          state.authorizedProductId === productId && state.sessionId !== null
        );
      },

      clearAccess: () => {
        set({
          authorizedProductId: null,
          sessionId: null,
        });
      },
    }),
    { name: 'ProductAccessStore' }
  )
);
