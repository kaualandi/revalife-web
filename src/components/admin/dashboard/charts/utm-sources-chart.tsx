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
import { useUtmSources } from '@/hooks/use-admin-queries';

const chartConfig: ChartConfig = {
  count: { label: 'Sessões', color: 'var(--chart-3)' },
};

export function UtmSourcesChart({ formId }: { formId?: number }) {
  const { data, isLoading } = useUtmSources(formId);

  const top10 = data
    ? [...data].sort((a, b) => b.count - a.count).slice(0, 10)
    : [];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Top Fontes UTM</CardTitle>
        <CardDescription>
          Principais origens de tráfego (utm_source)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : !top10.length ? (
          <div className="text-muted-foreground flex h-64 items-center justify-center text-sm">
            Sem dados de UTM disponíveis
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart
              data={top10}
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
                dataKey="source"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={90}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {top10.map((_, i) => (
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
