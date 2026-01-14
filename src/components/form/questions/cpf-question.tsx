'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Question } from '@/types/form.types';
import type { UseFormReturn } from 'react-hook-form';
import { IMaskInput } from 'react-imask';

interface CpfQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
}

export function CpfQuestion({ question, form }: CpfQuestionProps) {
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
            <IMaskInput
              mask="000.000.000-00"
              unmask={false}
              value={(field.value as string) || ''}
              onAccept={(value: string) => field.onChange(value)}
              inputRef={field.ref}
              placeholder={question.placeholder}
              className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-16 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
