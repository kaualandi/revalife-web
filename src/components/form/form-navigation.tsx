'use client';

import { Button } from '@/components/ui/button';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';

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
    </div>
  );
}
