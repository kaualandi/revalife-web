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
import { cn } from '@/lib/utils';
import type { UseFormReturn } from 'react-hook-form';
import { ChevronRight } from 'lucide-react';

interface RadioQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
  onValueChange?: (value: string) => void;
}

export function RadioQuestion({
  question,
  form,
  onValueChange,
}: RadioQuestionProps) {
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
            <div className="space-y-2">
              {question.options?.map(option => (
                <label
                  key={option.value}
                  className={cn(
                    'border-input hover:border-primary relative flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-colors',
                    field.value === option.value && 'border-primary bg-primary'
                  )}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={e => {
                      field.onChange(e.target.value);
                      onValueChange?.(e.target.value);
                    }}
                    className="sr-only"
                  />

                  <div
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-full',
                      field.value === option.value
                        ? 'bg-primary text-white'
                        : 'bg-primary/5'
                    )}
                  >
                    <ChevronRight className="size-4" />
                  </div>

                  <div
                    className={cn(
                      'flex-1 text-sm',
                      field.value === option.value && 'text-white'
                    )}
                  >
                    <div>{option.label}</div>
                    {option.description && (
                      <p className="text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
