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
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group';
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
import { IMaskInput } from 'react-imask';

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

        // Converte valor do campo para formato display
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [localValue, setLocalValue] = useState(() => {
          if (!field.value || typeof field.value !== 'string') return '';

          // Se já está no formato DD/MM/YYYY, retorna direto
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(field.value)) {
            return field.value;
          }

          // Se está no formato yyyy-MM-dd, converte
          if (/^\d{4}-\d{2}-\d{2}$/.test(field.value)) {
            try {
              const parsed = parse(field.value, 'yyyy-MM-dd', new Date());
              if (!isNaN(parsed.getTime())) {
                return format(parsed, 'dd/MM/yyyy');
              }
            } catch {
              return '';
            }
          }

          return '';
        });

        // Handler para seleção no calendário
        const handleDateSelect = (day: number) => {
          if (selectedYear !== null && selectedMonth !== null) {
            const date = new Date(selectedYear, selectedMonth, day);
            const isoDate = format(date, 'yyyy-MM-dd');
            const displayDate = format(date, 'dd/MM/yyyy');

            field.onChange(isoDate);
            setLocalValue(displayDate);
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
                  const currentDate = field.value
                    ? parse(field.value as string, 'yyyy-MM-dd', new Date())
                    : null;
                  const isSelected =
                    currentDate &&
                    currentDate.getDate() === day &&
                    currentDate.getMonth() === selectedMonth &&
                    currentDate.getFullYear() === selectedYear;

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

        return (
          <FormItem>
            <FormLabel className="text-base font-medium">
              {question.label}
            </FormLabel>
            {question.description && (
              <FormDescription>{question.description}</FormDescription>
            )}
            <FormControl className="h-16">
              <InputGroup>
                <IMaskInput
                  mask="00/00/0000"
                  inputMode="numeric"
                  unmask={false}
                  value={localValue}
                  onAccept={(value: string) => {
                    setLocalValue(value);

                    // Valida e converte formato DD/MM/YYYY para ISO quando completo
                    if (value.length === 10) {
                      try {
                        const parsed = parse(value, 'dd/MM/yyyy', new Date());
                        if (!isNaN(parsed.getTime())) {
                          field.onChange(format(parsed, 'yyyy-MM-dd'));
                          return;
                        }
                      } catch {
                        // Ignora erro de parsing
                      }
                    }
                  }}
                  inputRef={field.ref}
                  placeholder="DD/MM/AAAA"
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-16 w-full min-w-0 bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  style={{ borderRadius: '0.375rem 0 0 0.375rem' }}
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
                          !field.value && 'text-muted-foreground'
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
