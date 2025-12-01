'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Question } from '@/types/form.types';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface DateQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
}

export function DateQuestion({ question, form }: DateQuestionProps) {
  return (
    <FormField
      control={form.control}
      name={question.id}
      render={({ field }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [inputValue, setInputValue] = useState(
          (field.value as string) || ''
        );
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isOpen, setIsOpen] = useState(false);

        // Converte string ISO para Date
        const dateValue = field.value
          ? parse(field.value as string, 'yyyy-MM-dd', new Date())
          : undefined;

        // Handler para input manual com máscara
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let value = e.target.value.replace(/\D/g, ''); // Remove não-dígitos

          // Aplica máscara DD/MM/YYYY
          if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
          }
          if (value.length >= 5) {
            value = value.slice(0, 5) + '/' + value.slice(5, 9);
          }

          setInputValue(value);

          // Valida e converte formato DD/MM/YYYY para ISO quando completo
          if (value.length === 10) {
            try {
              const parsed = parse(value, 'dd/MM/yyyy', new Date());
              if (!isNaN(parsed.getTime())) {
                field.onChange(format(parsed, 'yyyy-MM-dd'));
              }
            } catch {
              // Ignora erro de parsing
            }
          }
        };

        // Handler para seleção no calendário
        const handleSelect = (date: Date | undefined) => {
          if (date) {
            field.onChange(format(date, 'yyyy-MM-dd'));
            setInputValue(format(date, 'dd/MM/yyyy'));
            setIsOpen(false);
          }
        };

        // Formata valor para exibição
        const displayValue =
          inputValue || (dateValue ? format(dateValue, 'dd/MM/yyyy') : '');

        return (
          <FormItem>
            <FormLabel className="text-base font-medium">
              {question.label}
            </FormLabel>
            {question.description && (
              <FormDescription>{question.description}</FormDescription>
            )}
            <div className="flex gap-2">
              <FormControl>
                <Input
                  type="text"
                  value={displayValue}
                  onChange={handleInputChange}
                  placeholder="DD/MM/AAAA"
                  className="max-w-[200px]"
                  maxLength={10}
                />
              </FormControl>

              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      'justify-start text-left font-normal',
                      !dateValue && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={handleSelect}
                    locale={ptBR}
                    disabled={date =>
                      question.validation?.maxDate
                        ? date > question.validation.maxDate
                        : false
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
