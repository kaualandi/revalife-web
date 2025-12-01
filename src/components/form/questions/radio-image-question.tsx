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

interface RadioImageQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
}

export function RadioImageQuestion({
  question,
  form,
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
                    'border-input hover:border-primary group relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border p-4 transition-colors',
                    field.value === option.value &&
                      'border-primary bg-primary/5'
                  )}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={e => field.onChange(e.target.value)}
                    className="sr-only"
                  />

                  {option.image && (
                    <div
                      className={cn(
                        'relative w-full overflow-hidden rounded-md',
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

                  <div className="text-center">
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <p className="text-muted-foreground mt-1 text-sm">
                        {option.description}
                      </p>
                    )}
                  </div>

                  <div
                    className={cn(
                      'border-primary absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white',
                      field.value === option.value
                        ? 'bg-primary border-primary'
                        : 'bg-white'
                    )}
                  >
                    {field.value === option.value && (
                      <div className="h-2 w-2 rounded-full bg-white" />
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
