'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Switch } from '@/components/ui/switch';
import { useFormsLookup } from '@/hooks/use-admin-queries';
import { exportAdminSessions } from '@/lib/api-admin';
import type { AdminSessionListQuery } from '@/types/admin.types';
import type { SessionStatus } from '@/types/api.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, DownloadIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const STATUS_OPTIONS: { value: SessionStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos os status' },
  { value: 'IN_PROGRESS', label: 'Em progresso' },
  { value: 'APPROVED', label: 'Aprovada' },
  { value: 'REJECTED', label: 'Reprovada' },
  { value: 'ABANDONED', label: 'Abandonada' },
  { value: 'ERROR', label: 'Erro' },
];

interface SessionsFilterProps {
  value: AdminSessionListQuery;
  onChange: (query: AdminSessionListQuery) => void;
}

export function SessionsFilter({ value, onChange }: SessionsFilterProps) {
  const { data: forms, isLoading: formsLoading } = useFormsLookup();
  const [searchInput, setSearchInput] = useState(value.search ?? '');
  const [exporting, setExporting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // sync external search reset
  useEffect(() => {
    if (!value.search && searchInput) setSearchInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.search]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSearchInput(v);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange({ ...value, search: v || undefined, page: 1 });
      }, 400);
    },
    [onChange, value]
  );

  function handleStatus(v: string) {
    onChange({
      ...value,
      status: v === 'ALL' ? undefined : (v as SessionStatus),
      page: 1,
    });
  }

  function handleForm(v: string) {
    onChange({ ...value, formSlug: v === 'ALL' ? undefined : v, page: 1 });
  }

  function handleStartDate(date: Date | undefined) {
    onChange({
      ...value,
      startDate: date?.toISOString() ?? undefined,
      page: 1,
    });
  }

  function handleEndDate(date: Date | undefined) {
    onChange({ ...value, endDate: date?.toISOString() ?? undefined, page: 1 });
  }

  function handleKommoToggle(checked: boolean) {
    onChange({ ...value, hasKommoId: checked || undefined, page: 1 });
  }

  function clearAll() {
    setSearchInput('');
    onChange({ page: 1, limit: value.limit });
  }

  async function handleExport() {
    setExporting(true);
    try {
      await exportAdminSessions(value);
    } catch {
      toast.error('Erro ao exportar sessões.');
    } finally {
      setExporting(false);
    }
  }

  const hasFilters = !!(
    value.search ||
    value.status ||
    value.formSlug ||
    value.startDate ||
    value.endDate ||
    value.hasKommoId
  );

  const startDate = value.startDate ? new Date(value.startDate) : undefined;
  const endDate = value.endDate ? new Date(value.endDate) : undefined;

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: search + status + form + export */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <Input
            placeholder="Buscar por nome ou e-mail…"
            value={searchInput}
            onChange={handleSearchChange}
            className="pr-8"
          />
          {searchInput && (
            <button
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
              onClick={() => {
                setSearchInput('');
                onChange({ ...value, search: undefined, page: 1 });
              }}
              type="button"
              aria-label="Limpar busca"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Select value={value.status ?? 'ALL'} onValueChange={handleStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={value.formSlug ?? 'ALL'}
          onValueChange={handleForm}
          disabled={formsLoading}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Formulário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os formulários</SelectItem>
            {forms?.map(f => (
              <SelectItem key={f.id} value={f.slug}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={exporting}
          className="gap-2"
        >
          <DownloadIcon className="h-4 w-4" />
          {exporting ? 'Exportando…' : 'Exportar XLSX'}
        </Button>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-muted-foreground gap-1"
          >
            <XIcon className="h-3.5 w-3.5" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Row 2: date range + kommo toggle */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Start date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-44 justify-start gap-2 font-normal"
            >
              <CalendarIcon className="text-muted-foreground h-4 w-4" />
              {startDate ? (
                format(startDate, 'd MMM yyyy', { locale: ptBR })
              ) : (
                <span className="text-muted-foreground">Data inicial</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDate}
              disabled={date => (endDate ? date > endDate : false)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground text-sm">até</span>

        {/* End date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-44 justify-start gap-2 font-normal"
            >
              <CalendarIcon className="text-muted-foreground h-4 w-4" />
              {endDate ? (
                format(endDate, 'd MMM yyyy', { locale: ptBR })
              ) : (
                <span className="text-muted-foreground">Data final</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDate}
              disabled={date => (startDate ? date < startDate : false)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(startDate || endDate) && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-1"
            onClick={() =>
              onChange({
                ...value,
                startDate: undefined,
                endDate: undefined,
                page: 1,
              })
            }
          >
            <XIcon className="h-3.5 w-3.5" />
            Limpar datas
          </Button>
        )}

        {/* Kommo toggle */}
        <div className="ml-auto flex items-center gap-2">
          <Switch
            id="hasKommo"
            checked={!!value.hasKommoId}
            onCheckedChange={handleKommoToggle}
          />
          <Label htmlFor="hasKommo" className="cursor-pointer text-sm">
            Apenas com Kommo
          </Label>
        </div>
      </div>
    </div>
  );
}
