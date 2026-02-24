'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
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
import { useSessionsPerForm } from '@/hooks/use-admin-queries';

const chartConfig: ChartConfig = {
  count: { label: 'Sessões', color: 'var(--chart-2)' },
};

export function SessionsPerFormChart({ formId }: { formId?: number }) {
  const { data, isLoading } = useSessionsPerForm(formId);

  const sorted = data ? [...data].sort((a, b) => b.count - a.count) : [];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Sessões por Formulário</CardTitle>
        <CardDescription>
          Total de sessões iniciadas por formulário
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : !sorted.length ? (
          <div className="text-muted-foreground flex h-64 items-center justify-center text-sm">
            Sem dados disponíveis
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart
              data={sorted}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="formName"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={110}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {sorted.map((_, i) => (
                  <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
