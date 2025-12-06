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
                    'border-input hover:border-primary relative flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors',
                    field.value === option.value &&
                      'border-primary bg-primary/5'
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
                      'border-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 bg-white',
                      field.value === option.value
                        ? 'bg-primary border-primary'
                        : 'bg-white'
                    )}
                  >
                    {field.value === option.value && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <p className="text-muted-foreground mt-1 text-sm">
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
