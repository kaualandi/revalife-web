'use client';

import { useProductAccessStore } from '@/stores/product-access-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProductAccessValidatorProps {
  productId: string;
}

/**
 * Componente que valida se o usuário tem acesso ao produto
 *
 * Verifica em memória (não no localStorage) se o usuário foi autorizado
 * a acessar este produto específico. Se não tiver acesso, redireciona
 * para a página inicial.
 */
export function ProductAccessValidator({
  productId,
}: ProductAccessValidatorProps) {
  const router = useRouter();
  const hasAccessToProduct = useProductAccessStore(state =>
    state.hasAccessToProduct(productId)
  );

  useEffect(() => {
    // Validação de acesso ao produto
    if (!hasAccessToProduct) {
      console.warn(`Acesso não autorizado ao produto: ${productId}`);
      router.push('/');
    }
  }, [hasAccessToProduct, productId, router]);

  // Este componente não renderiza nada, apenas valida o acesso
  return null;
}
