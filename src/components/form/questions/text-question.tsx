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

interface TextQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
}

export function TextQuestion({ question, form }: TextQuestionProps) {
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
              type="text"
              placeholder={question.placeholder}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
