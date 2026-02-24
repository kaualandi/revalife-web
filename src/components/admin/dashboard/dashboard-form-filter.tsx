'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormsLookup } from '@/hooks/use-admin-queries';

interface DashboardFormFilterProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export function DashboardFormFilter({
  value,
  onChange,
}: DashboardFormFilterProps) {
  const { data: forms, isLoading } = useFormsLookup();

  return (
    <Select
      value={value !== undefined ? String(value) : 'all'}
      onValueChange={v => onChange(v === 'all' ? undefined : Number(v))}
      disabled={isLoading}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Todos os formulários" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        {forms?.map(form => (
          <SelectItem key={form.id} value={String(form.id)}>
            {form.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
