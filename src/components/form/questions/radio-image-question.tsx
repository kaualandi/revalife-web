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
import Image from 'next/image';
import type { UseFormReturn } from 'react-hook-form';
import { ChevronRight } from 'lucide-react';

interface RadioImageQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
  onValueChange?: (value: string) => void;
}

export function RadioImageQuestion({
  question,
  form,
  onValueChange,
}: RadioImageQuestionProps) {
  const cols = question.grid?.cols || 2;
  const imageSize = question.grid?.imageSize || 'md';

  const imageSizeClasses = {
    sm: 'h-24',
    md: 'h-40',
    lg: 'h-56',
  };

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
            <div
              className={cn(
                'grid gap-4',
                cols === 2 && 'grid-cols-2',
                cols === 3 && 'grid-cols-3',
                cols === 4 && 'grid-cols-2 md:grid-cols-4'
              )}
            >
              {question.options?.map(option => (
                <label
                  key={option.value}
                  className={cn(
                    'border-input hover:border-primary group relative flex cursor-pointer flex-col gap-3 rounded-md border p-2 transition-colors',
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

                  {option.image && (
                    <div
                      className={cn(
                        'relative w-full overflow-hidden rounded',
                        imageSizeClasses[imageSize]
                      )}
                    >
                      <Image
                        src={option.image}
                        alt={option.label}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={cn(
                      'flex items-center gap-2 text-sm',
                      field.value === option.value && 'text-white'
                    )}
                  >
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
                    <div className="">{option.label}</div>
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
