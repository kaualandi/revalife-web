'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AdminUserListQuery, UserRole } from '@/types/admin.types';
import { XIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const ROLE_OPTIONS: { value: UserRole | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos os perfis' },
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'CLIENT', label: 'CLIENT' },
];

interface UsersFilterProps {
  value: AdminUserListQuery;
  onChange: (query: AdminUserListQuery) => void;
}

export function UsersFilter({ value, onChange }: UsersFilterProps) {
  const [searchInput, setSearchInput] = useState(value.search ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

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

  function handleRole(v: string) {
    onChange({
      ...value,
      role: v === 'ALL' ? undefined : (v as UserRole),
      page: 1,
    });
  }

  function clearAll() {
    setSearchInput('');
    onChange({ page: 1, limit: value.limit });
  }

  const hasFilters = !!(value.search || value.role);

  return (
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

      <Select value={value.role ?? 'ALL'} onValueChange={handleRole}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Perfil" />
        </SelectTrigger>
        <SelectContent>
          {ROLE_OPTIONS.map(o => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
  );
}
