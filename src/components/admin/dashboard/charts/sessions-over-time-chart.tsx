'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useSessionsOverTime } from '@/hooks/use-admin-queries';
import type { SessionsOverTimePeriod } from '@/types/admin.types';

const chartConfig: ChartConfig = {
  count: { label: 'Sessões', color: 'var(--chart-1)' },
};

const PERIODS: { value: SessionsOverTimePeriod; label: string }[] = [
  { value: 7, label: '7 dias' },
  { value: 30, label: '30 dias' },
  { value: 90, label: '90 dias' },
];

export function SessionsOverTimeChart() {
  const [period, setPeriod] = useState<SessionsOverTimePeriod>(30);
  const { data, isLoading } = useSessionsOverTime(period);

  const formatted = data?.data?.map(d => ({
    ...d,
    dateLabel: format(parseISO(d.date), 'd MMM', { locale: ptBR }),
  }));

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Sessões ao Longo do Tempo</CardTitle>
          <CardDescription>Novas sessões por dia no período</CardDescription>
        </div>
        <Tabs
          value={String(period)}
          onValueChange={v => setPeriod(Number(v) as SessionsOverTimePeriod)}
        >
          <TabsList className="h-8">
            {PERIODS.map(p => (
              <TabsTrigger
                key={p.value}
                value={String(p.value)}
                className="h-7 px-2.5 text-xs"
              >
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : !formatted?.length ? (
          <div className="text-muted-foreground flex h-64 items-center justify-center text-sm">
            Sem dados disponíveis
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <AreaChart
              data={formatted}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#colorCount)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
