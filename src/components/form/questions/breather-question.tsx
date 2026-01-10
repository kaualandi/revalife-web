'use client';

import type { Question } from '@/types/form.types';
import type { UseFormReturn } from 'react-hook-form';
import Image from 'next/image';

interface BreatherQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
}

export function BreatherQuestion({ question }: BreatherQuestionProps) {
  return (
    <div className="mt-16 flex flex-col items-center gap-6 text-center">
      {question.label && (
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{question.label}</h2>
          {question.description && (
            <p className="text-muted-foreground text-base">
              {question.description}
            </p>
          )}
        </div>
      )}

      {question.image && (
        <div className="relative w-full">
          <Image
            src={question.image}
            alt={question.label || 'Imagem'}
            width={424}
            height={820}
            className="h-auto w-full rounded-lg object-cover"
            priority
          />
        </div>
      )}

      {question.observation && (
        <p className="text-muted-foreground max-w-2xl text-sm">
          {question.observation}
        </p>
      )}
    </div>
  );
}
