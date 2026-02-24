'use client';

import { useState } from 'react';
import { Suspense } from 'react';

import { SessionsOverTimeChart } from '@/components/admin/dashboard/charts/sessions-over-time-chart';
import { SessionsPerFormChart } from '@/components/admin/dashboard/charts/sessions-per-form-chart';
import { SessionStatusChart } from '@/components/admin/dashboard/charts/session-status-chart';
import { RecentSessionsTable } from '@/components/admin/dashboard/recent-sessions-table';
import { AbandonmentChart } from '@/components/admin/dashboard/charts/abandonment-chart';
import { UtmSourcesChart } from '@/components/admin/dashboard/charts/utm-sources-chart';
import { FormFunnelChart } from '@/components/admin/dashboard/charts/form-funnel-chart';
import { StatsCards } from '@/components/admin/dashboard/stats-cards';
import { DashboardFormFilter } from '@/components/admin/dashboard/dashboard-form-filter';
import { Skeleton } from '@/components/ui/skeleton';

function ChartSkeleton({ className = 'h-80' }: { className?: string }) {
  return <Skeleton className={`w-full rounded-xl ${className}`} />;
}

export function DashboardContent() {
  const [formId, setFormId] = useState<number | undefined>(undefined);

  return (
    <div className="space-y-6">
      {/* Page title + filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Visão geral das métricas da plataforma
          </p>
        </div>
        <DashboardFormFilter value={formId} onChange={setFormId} />
      </div>

      {/*  Métricas rápidas */}
      <Suspense fallback={<Skeleton className="h-28 w-full rounded-xl" />}>
        <StatsCards formId={formId} />
      </Suspense>

      {/* Status das sessões + Funil */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <SessionStatusChart formId={formId} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <FormFunnelChart formId={formId} />
        </Suspense>
      </div>

      {/* Sessões ao longo do tempo — full width */}
      <Suspense fallback={<ChartSkeleton />}>
        <SessionsOverTimeChart formId={formId} />
      </Suspense>

      {/* Sessões por formulário + Top UTMs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <SessionsPerFormChart formId={formId} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <UtmSourcesChart formId={formId} />
        </Suspense>
      </div>

      {/* Abandono vs conclusão — full width */}
      <Suspense fallback={<ChartSkeleton />}>
        <AbandonmentChart formId={formId} />
      </Suspense>

      {/* Sessões recentes */}
      <Suspense fallback={<ChartSkeleton className="h-96" />}>
        <RecentSessionsTable formId={formId} />
      </Suspense>
    </div>
  );
}
