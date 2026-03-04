'use client';

import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CorrectDataButtonProps {
  formSlug: string;
}

export function CorrectDataButton({ formSlug }: CorrectDataButtonProps) {
  const router = useRouter();
  const { setSubmissionResult, resetForm, setSessionId } =
    useTreatmentFormStore();

  const handleReset = () => {
    setSubmissionResult(null);
    resetForm();
    setSessionId(null);
    router.push(`/${formSlug}`);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleReset}
      className="text-muted-foreground gap-1 px-0"
    >
      <ChevronLeft className="h-4 w-4" />
      Corrigir dados do questionário
    </Button>
  );
}
