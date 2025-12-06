'use client';

import { Button } from '@/components/ui/button';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormNavigationProps {
  onContinue: () => void;
  isSaving?: boolean;
}

export function FormNavigation({ onContinue, isSaving }: FormNavigationProps) {
  const { canProceedToNextStep } = useTreatmentFormStore();

  const canProceed = canProceedToNextStep();

  return (
    <div className="space-y-4">
      {/* Botão Continuar */}
      <Button
        onClick={onContinue}
        disabled={!canProceed || isSaving}
        className="w-full"
        size="lg"
      >
        Continuar
      </Button>

      {/* Mensagem de aviso */}
      <p className="text-muted-foreground text-center text-xs leading-none">
        Lembre-se: precisamos das informações corretas para indicar o melhor
        tratamento pra você
      </p>
    </div>
  );
}
