'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { Question } from '@/types/form.types';
import type { UseFormReturn } from 'react-hook-form';

interface TextareaQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
}

export function TextareaQuestion({ question, form }: TextareaQuestionProps) {
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
            <Textarea
              {...field}
              value={(field.value as string) || ''}
              placeholder={question.placeholder}
              rows={6}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
