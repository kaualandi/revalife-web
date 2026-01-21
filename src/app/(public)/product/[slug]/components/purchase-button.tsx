'use client';

import { Button } from '@/components/ui/button';
import type { Product } from '@/types/api.types';

interface PurchaseButtonProps {
  product: Product;
}

export function PurchaseButton({ product }: PurchaseButtonProps) {
  const handlePurchase = () => {
    // Construir URL de checkout
    const checkoutUrl = new URL(product.checkoutUrl);

    // Adicionar coupon se existir
    if (product.checkoutCoupon) {
      checkoutUrl.searchParams.set('coupon', product.checkoutCoupon);
    }

    // Adicionar checkoutParams se existirem
    if (product.checkoutParams) {
      Object.entries(product.checkoutParams).forEach(([key, value]) => {
        checkoutUrl.searchParams.set(key, String(value));
      });
    }

    // Copiar parâmetros da URL atual (UTMs, etc.)
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.forEach((value, key) => {
      // Não sobrescrever parâmetros já definidos
      if (!checkoutUrl.searchParams.has(key)) {
        checkoutUrl.searchParams.set(key, value);
      }
    });

    // Redirecionar para checkout
    window.location.href = checkoutUrl.toString();
  };

  return (
    <Button
      variant="green"
      size="lg"
      onClick={handlePurchase}
      className="w-full text-xl"
      style={{ backgroundColor: product.buttonColor }}
    >
      Comprar Agora
    </Button>
  );
}
