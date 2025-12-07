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

interface IntegerQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
}

export function IntegerQuestion({ question, form }: IntegerQuestionProps) {
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
              onChange={e => {
                // Remove tudo que não seja número
                const value = e.target.value.replace(/\D/g, '');
                field.onChange(value);
              }}
              type="text"
              inputMode="numeric"
              placeholder={question.placeholder}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
