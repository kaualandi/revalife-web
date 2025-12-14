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

interface CheckboxQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
}

export function CheckboxQuestion({ question, form }: CheckboxQuestionProps) {
  return (
    <FormField
      control={form.control}
      name={question.id}
      render={({ field }) => {
        const value = (field.value as string[]) || [];

        const handleToggle = (optionValue: string) => {
          const newValue = value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];
          field.onChange(newValue);
        };

        return (
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
                      'border-input hover:border-primary relative flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors',
                      value.includes(option.value) &&
                        'border-primary bg-primary'
                    )}
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={value.includes(option.value)}
                      onChange={() => handleToggle(option.value)}
                      className="sr-only"
                    />

                    <div
                      className={cn(
                        'bg-primary/5 flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors'
                      )}
                    >
                      {value.includes(option.value) && (
                        <svg
                          className="h-3 w-3 text-white"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    <div
                      className={cn(
                        'flex-1 text-sm',
                        value.includes(option.value) && 'text-white'
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

            {question.observation && (
              <div className="content rounded bg-zinc-100 p-4 text-sm text-zinc-700 italic">
                <p>{question.observation}</p>
              </div>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
