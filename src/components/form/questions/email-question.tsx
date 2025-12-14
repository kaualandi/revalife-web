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

interface EmailQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
}

export function EmailQuestion({ question, form }: EmailQuestionProps) {
  return (
    <FormField
      control={form.control}
      name={question.id}
      render={({ field }) => (
        <FormItem className="gap-1">
          <FormLabel className="text-sm">{question.label}</FormLabel>
          {question.description && (
            <FormDescription>{question.description}</FormDescription>
          )}

          <FormControl>
            <Input
              {...field}
              value={(field.value as string) || ''}
              type="email"
              placeholder={question.placeholder}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
