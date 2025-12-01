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
  const {
    currentStepIndex,
    previousStep,
    canProceedToNextStep,
    getCurrentProgress,
  } = useTreatmentFormStore();

  const canProceed = canProceedToNextStep();
  const progress = getCurrentProgress();
  const isFirstStep = currentStepIndex === 0;

  return (
    <div className="space-y-4">
      {/* Barra de progresso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={
              {
                width: `${progress}%`,
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={previousStep}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>
        )}

        <Button
          onClick={onContinue}
          disabled={!canProceed || isSaving}
          className={cn('gap-2', isFirstStep && 'w-full')}
          size="lg"
        >
          {isSaving ? 'Salvando...' : 'Continuar'}
        </Button>
      </div>

      {/* Mensagem de aviso */}
      <p className="text-muted-foreground text-center text-xs leading-none">
        Lembre-se: precisamos das informações corretas para indicar o melhor
        tratamento pra você
      </p>
    </div>
  );
}
