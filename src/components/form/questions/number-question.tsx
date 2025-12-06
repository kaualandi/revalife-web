'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Question } from '@/types/form.types';
import type { UseFormReturn } from 'react-hook-form';

interface NumberQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
}

export function NumberQuestion({ question, form }: NumberQuestionProps) {
  return (
    <FormField
      control={form.control}
      name={question.id}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium">
            {question.label}
          </FormLabel>
          {question.description && (
            <FormDescription>{question.description}</FormDescription>
          )}

          <FormControl>
            <Input
              {...field}
              value={(field.value as string) || ''}
              type="number"
              placeholder={question.placeholder}
              min={question.validation?.min}
              max={question.validation?.max}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
