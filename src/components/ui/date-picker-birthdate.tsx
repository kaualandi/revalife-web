'use client';

import { Button } from '@/components/ui/button';
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
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface DatePickerBirthdateProps {
  value?: Date;
  onSelect: (date: Date) => void;
  maxDate?: Date;
}

export function DatePickerBirthdate({
  value,
  onSelect,
  maxDate = new Date(),
}: DatePickerBirthdateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'year' | 'month' | 'day'>('year');
  const [selectedYear, setSelectedYear] = useState<number | null>(
    value?.getFullYear() || null
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    value ? value.getMonth() : null
  );

  const currentYear = maxDate.getFullYear();
  const minYear = currentYear - 120; // 120 anos atrás
  const years = Array.from({ length: currentYear - minYear + 1 }, (_, i) =>
    (currentYear - i).toString()
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

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(parseInt(year));
    setStep('month');
  };

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    setStep('day');
  };

  const handleDaySelect = (day: number) => {
    if (selectedYear !== null && selectedMonth !== null) {
      const date = new Date(selectedYear, selectedMonth, day);
      onSelect(date);
      setIsOpen(false);
      // Reset para próxima abertura
      setTimeout(() => setStep('year'), 300);
    }
  };

  const handleBack = () => {
    if (step === 'month') setStep('year');
    if (step === 'day') setStep('month');
  };

  const renderYearPicker = () => (
    <div className="space-y-3 p-3">
      <div className="text-center text-sm font-medium">Selecione o ano</div>
      <Select onValueChange={handleYearSelect} value={selectedYear?.toString()}>
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
          onClick={handleBack}
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
            onClick={() => handleMonthSelect(index)}
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
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    return (
      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
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
              value &&
              value.getDate() === day &&
              value.getMonth() === selectedMonth &&
              value.getFullYear() === selectedYear;

            return (
              <Button
                key={day}
                variant={isSelected ? 'default' : 'ghost'}
                className={cn('h-8 w-8 p-0', isDisabled && 'opacity-50')}
                onClick={() => handleDaySelect(day)}
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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div>{/* Trigger será fornecido pelo componente pai */}</div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {step === 'year' && renderYearPicker()}
        {step === 'month' && renderMonthPicker()}
        {step === 'day' && renderDayPicker()}
      </PopoverContent>
    </Popover>
  );
}
