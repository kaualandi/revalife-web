'use client';

import {
  FileText,
  Users,
  TrendingUp,
  BarChart2,
  TrendingDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminOverview } from '@/hooks/use-admin-queries';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  loading,
}: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-1 h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-md">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            {trend === 'up' && (
              <TrendingUp className="h-3 w-3 text-green-500" />
            )}
            {trend === 'down' && (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsCards({ formId }: { formId?: number }) {
  const { data, isLoading } = useAdminOverview(formId);

  const completionRate = data?.completionRate ?? 0;
  const completionTrend = completionRate >= 50 ? 'up' : 'down';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        loading={isLoading}
        title="Total de Formulários"
        value={data?.totalForms ?? '—'}
        icon={<FileText className="h-4 w-4" />}
        description="Formulários ativos"
      />
      <StatCard
        loading={isLoading}
        title="Total de Sessões"
        value={data?.totalSessions ?? '—'}
        icon={<Users className="h-4 w-4" />}
        description={
          data ? `${data.totalSessions} sessões registradas` : undefined
        }
      />
      <StatCard
        loading={isLoading}
        title="Taxa de Conclusão"
        value={data ? `${completionRate.toFixed(1)}%` : '—'}
        icon={<TrendingUp className="h-4 w-4" />}
        trend={data ? completionTrend : undefined}
        description={
          data
            ? `${data.completedSessions}/${data.totalSessions} sessões concluídas`
            : undefined
        }
      />
      <StatCard
        loading={isLoading}
        title="Média UTMs / Sessão"
        value={data ? data.avgUtmsPerSession.toFixed(1) : '—'}
        icon={<BarChart2 className="h-4 w-4" />}
        description="Canais de origem rastreados"
      />
    </div>
  );
}
