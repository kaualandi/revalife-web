import { SessionsOverTimeChart } from '@/components/admin/dashboard/charts/sessions-over-time-chart';
import { SessionsPerFormChart } from '@/components/admin/dashboard/charts/sessions-per-form-chart';
import { SessionStatusChart } from '@/components/admin/dashboard/charts/session-status-chart';
import { RecentSessionsTable } from '@/components/admin/dashboard/recent-sessions-table';
import { AbandonmentChart } from '@/components/admin/dashboard/charts/abandonment-chart';
import { UtmSourcesChart } from '@/components/admin/dashboard/charts/utm-sources-chart';
import { FormFunnelChart } from '@/components/admin/dashboard/charts/form-funnel-chart';
import { StatsCards } from '@/components/admin/dashboard/stats-cards';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard — Revalife Admin',
};

function ChartSkeleton({ className = 'h-80' }: { className?: string }) {
  return <Skeleton className={`w-full rounded-xl ${className}`} />;
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Visão geral das métricas da plataforma
        </p>
      </div>

      {/*  Métricas rápidas */}
      <Suspense fallback={<Skeleton className="h-28 w-full rounded-xl" />}>
        <StatsCards />
      </Suspense>

      {/* Status das sessões + Funil */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <SessionStatusChart />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <FormFunnelChart />
        </Suspense>
      </div>

      {/* Sessões ao longo do tempo — full width */}
      <Suspense fallback={<ChartSkeleton />}>
        <SessionsOverTimeChart />
      </Suspense>

      {/* Sessões por formulário + Top UTMs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <SessionsPerFormChart />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <UtmSourcesChart />
        </Suspense>
      </div>

      {/* Abandono vs conclusão — full width */}
      <Suspense fallback={<ChartSkeleton />}>
        <AbandonmentChart />
      </Suspense>

      {/* Sessões recentes */}
      <Suspense fallback={<ChartSkeleton className="h-96" />}>
        <RecentSessionsTable />
      </Suspense>
    </div>
  );
}
