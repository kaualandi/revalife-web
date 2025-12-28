'use client';

import { Button } from '@/components/ui/button';
import type { getProductById } from '@/config/products.config';

interface PurchaseButtonProps {
  product: NonNullable<ReturnType<typeof getProductById>>;
}

export function PurchaseButton({ product }: PurchaseButtonProps) {
  const handlePurchase = () => {
    // TODO: Obter dados do usuário do store para preencher os parâmetros
    // const user = useUserStore.getState().user;

    // Por enquanto, usar valores de exemplo
    const email = 'user@example.com';
    const phone = '5511999999999';

    const url = new URL(product.hublaUrl);
    url.searchParams.set('coupon', product.hublaParams.coupon);
    url.searchParams.set('email', email);
    url.searchParams.set('phone', phone);
    url.searchParams.set('sck', product.hublaParams.sck);

    window.location.href = url.toString();
  };

  return (
    <Button
      variant="green"
      size="lg"
      onClick={handlePurchase}
      className="w-full text-xl"
    >
      Comprar Agora
    </Button>
  );
}
