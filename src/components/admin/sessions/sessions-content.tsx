'use client';

import { SessionsFilter } from '@/components/admin/sessions/sessions-filter';
import { SessionsList } from '@/components/admin/sessions/sessions-list';
import type { AdminSessionListQuery } from '@/types/admin.types';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const DEFAULT_LIMIT = 20;

export function SessionsContent() {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState<AdminSessionListQuery>(() => ({
    page: 1,
    limit: DEFAULT_LIMIT,
    formSlug: searchParams.get('formSlug') ?? undefined,
  }));

  function handleFilterChange(q: AdminSessionListQuery) {
    setQuery({ ...q, page: 1, limit: DEFAULT_LIMIT });
  }

  function handlePageChange(page: number) {
    setQuery(prev => ({ ...prev, page }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sessões</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Gerencie todas as sessões de formulários da plataforma
        </p>
      </div>

      {/* Filters */}
      <SessionsFilter value={query} onChange={handleFilterChange} />

      {/* Table */}
      <SessionsList query={query} onPageChange={handlePageChange} />
    </div>
  );
}
