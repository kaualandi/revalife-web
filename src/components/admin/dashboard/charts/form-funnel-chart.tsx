'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
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
import { useFunnelData } from '@/hooks/use-admin-queries';

const FUNNEL_COLORS = [
  'var(--chart-2)',
  'var(--chart-1)',
  'var(--chart-4)',
  'var(--chart-3)',
  'var(--chart-5)',
];

const chartConfig: ChartConfig = {
  count: { label: 'Sessões', color: 'var(--chart-1)' },
};

export function FormFunnelChart() {
  const { data, isLoading } = useFunnelData();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Funil de Conversão</CardTitle>
        <CardDescription>Etapas de progressão das sessões</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : !data?.length ? (
          <div className="text-muted-foreground flex h-64 items-center justify-center text-sm">
            Sem dados disponíveis
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart
                data={data}
                margin={{ top: 20, right: 4, left: -16, bottom: 0 }}
                barCategoryGap="25%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="step"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="count"
                    position="top"
                    style={{ fontSize: 11, fill: 'currentColor' }}
                  />
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
