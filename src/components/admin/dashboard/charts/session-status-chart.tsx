'use client';

import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useSessionStatus } from '@/hooks/use-admin-queries';
import type { SessionStatus } from '@/types/api.types';

const STATUS_LABELS: Record<SessionStatus, string> = {
  IN_PROGRESS: 'Em progresso',
  COMPLETED: 'Concluídas',
  APPROVED: 'Aprovadas',
  REJECTED: 'Reprovadas',
  ABANDONED: 'Abandonadas',
  ERROR: 'Com erro',
};

const STATUS_COLORS: Record<SessionStatus, string> = {
  IN_PROGRESS: 'var(--chart-4)',
  COMPLETED: 'var(--chart-2)',
  APPROVED: 'var(--chart-1)',
  REJECTED: 'var(--destructive)',
  ABANDONED: 'var(--chart-5)',
  ERROR: 'var(--chart-3)',
};

const chartConfig: ChartConfig = {
  IN_PROGRESS: {
    label: STATUS_LABELS.IN_PROGRESS,
    color: STATUS_COLORS.IN_PROGRESS,
  },
  COMPLETED: { label: STATUS_LABELS.COMPLETED, color: STATUS_COLORS.COMPLETED },
  APPROVED: { label: STATUS_LABELS.APPROVED, color: STATUS_COLORS.APPROVED },
  REJECTED: { label: STATUS_LABELS.REJECTED, color: STATUS_COLORS.REJECTED },
  ABANDONED: { label: STATUS_LABELS.ABANDONED, color: STATUS_COLORS.ABANDONED },
  ERROR: { label: STATUS_LABELS.ERROR, color: STATUS_COLORS.ERROR },
};

export function SessionStatusChart() {
  const { data, isLoading } = useSessionStatus();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Status das Sessões</CardTitle>
        <CardDescription>Distribuição por status atual</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : !data?.length ? (
          <div className="text-muted-foreground flex h-64 items-center justify-center text-sm">
            Sem dados disponíveis
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <PieChart>
              <Tooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={2}
              >
                {data.map(entry => (
                  <Cell
                    key={entry.status}
                    fill={
                      STATUS_COLORS[entry.status as SessionStatus] ??
                      'var(--muted)'
                    }
                    name={
                      STATUS_LABELS[entry.status as SessionStatus] ??
                      entry.status
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}

        {/* Legend */}
        {data?.length ? (
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1">
            {data.map(entry => (
              <li
                key={entry.status}
                className="flex items-center gap-2 text-xs"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    background: STATUS_COLORS[entry.status as SessionStatus],
                  }}
                />
                <span className="text-muted-foreground truncate">
                  {STATUS_LABELS[entry.status as SessionStatus] ?? entry.status}
                </span>
                <span className="ml-auto font-medium">{entry.count}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
