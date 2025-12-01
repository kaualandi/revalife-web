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
                      'border-input hover:border-primary flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors',
                      value.includes(option.value) &&
                        'border-primary bg-primary/5'
                    )}
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={value.includes(option.value)}
                      onChange={() => handleToggle(option.value)}
                      className="text-primary focus:ring-primary mt-1"
                    />
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
        );
      }}
    />
  );
}
