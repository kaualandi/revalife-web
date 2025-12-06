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
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface TelQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
}

export function TelQuestion({ question, form }: TelQuestionProps) {
  return (
    <FormField
      control={form.control}
      name={question.id}
      render={({ field }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [displayValue, setDisplayValue] = useState(
          (field.value as string) || ''
        );

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let value = e.target.value.replace(/\D/g, ''); // Remove não-dígitos

          // Aplica máscara (00) 00000-0000
          if (value.length >= 2) {
            value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
          }
          if (value.length >= 10) {
            value = value.slice(0, 10) + '-' + value.slice(10, 14);
          }

          setDisplayValue(value);
          field.onChange(value);
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
              <Input
                value={displayValue}
                onChange={handleChange}
                type="tel"
                placeholder={question.placeholder}
                maxLength={15}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
