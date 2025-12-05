'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Question } from '@/types/form.types';
import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
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
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [step, setStep] = useState<'year' | 'month' | 'day'>('year');
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [selectedYear, setSelectedYear] = useState<number | null>(null);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

        const maxDate = question.validation?.maxDate || new Date();
        const currentYear = maxDate.getFullYear();
        const minYear = currentYear - 120;
        const years = Array.from(
          { length: currentYear - minYear + 1 },
          (_, i) => (currentYear - i).toString()
        );

        const months = [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ];

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
        const handleDateSelect = (day: number) => {
          if (selectedYear !== null && selectedMonth !== null) {
            const date = new Date(selectedYear, selectedMonth, day);
            field.onChange(format(date, 'yyyy-MM-dd'));
            setInputValue(format(date, 'dd/MM/yyyy'));
            setIsOpen(false);
            setTimeout(() => {
              setStep('year');
              setSelectedYear(null);
              setSelectedMonth(null);
            }, 300);
          }
        };

        const getDaysInMonth = (year: number, month: number) => {
          return new Date(year, month + 1, 0).getDate();
        };

        const renderYearPicker = () => (
          <div className="space-y-3 p-3">
            <div className="text-center text-sm font-medium">
              Selecione o ano
            </div>
            <Select
              onValueChange={year => {
                setSelectedYear(parseInt(year));
                setStep('month');
              }}
              value={selectedYear?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ano de nascimento" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

        const renderMonthPicker = () => (
          <div className="space-y-3 p-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep('year')}
                className="h-7 w-7"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium">{selectedYear}</div>
              <div className="w-7" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => (
                <Button
                  key={month}
                  variant={selectedMonth === index ? 'default' : 'outline'}
                  className="h-12"
                  onClick={() => {
                    setSelectedMonth(index);
                    setStep('day');
                  }}
                >
                  {month.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        );

        const renderDayPicker = () => {
          if (selectedYear === null || selectedMonth === null) return null;

          const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
          const firstDayOfMonth = new Date(
            selectedYear,
            selectedMonth,
            1
          ).getDay();
          const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
          const emptyDays = Array.from(
            { length: firstDayOfMonth },
            (_, i) => i
          );

          return (
            <div className="space-y-3 p-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep('month')}
                  className="h-7 w-7"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  {months[selectedMonth]} {selectedYear}
                </div>
                <div className="w-7" />
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
                  <div
                    key={day}
                    className="text-muted-foreground flex h-8 items-center justify-center text-xs font-medium"
                  >
                    {day}
                  </div>
                ))}
                {emptyDays.map(i => (
                  <div key={`empty-${i}`} />
                ))}
                {days.map(day => {
                  const date = new Date(selectedYear, selectedMonth, day);
                  const isDisabled = maxDate && date > maxDate;
                  const isSelected =
                    dateValue &&
                    dateValue.getDate() === day &&
                    dateValue.getMonth() === selectedMonth &&
                    dateValue.getFullYear() === selectedYear;

                  return (
                    <Button
                      key={day}
                      variant={isSelected ? 'default' : 'ghost'}
                      className={cn('h-8 w-8 p-0', isDisabled && 'opacity-50')}
                      onClick={() => handleDateSelect(day)}
                      disabled={isDisabled}
                    >
                      {day}
                    </Button>
                  );
                })}
              </div>
            </div>
          );
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
            <FormControl>
              <InputGroup>
                <InputGroupInput
                  type="text"
                  value={displayValue}
                  onChange={handleInputChange}
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                />
                <InputGroupAddon align="inline-end">
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        type="button"
                        className={cn(
                          'rounded-full',
                          !dateValue && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      {step === 'year' && renderYearPicker()}
                      {step === 'month' && renderMonthPicker()}
                      {step === 'day' && renderDayPicker()}
                    </PopoverContent>
                  </Popover>
                </InputGroupAddon>
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
