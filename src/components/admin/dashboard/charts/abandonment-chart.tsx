'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useAbandonmentPerForm } from '@/hooks/use-admin-queries';

const chartConfig: ChartConfig = {
  approved: { label: 'Aprovadas', color: 'var(--chart-1)' },
  rejected: { label: 'Reprovadas', color: 'var(--destructive)' },
  abandoned: { label: 'Abandonadas', color: 'var(--chart-5)' },
  inProgress: { label: 'Em progresso', color: 'var(--chart-4)' },
};

export function AbandonmentChart() {
  const { data, isLoading } = useAbandonmentPerForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conclusão vs Abandono por Formulário</CardTitle>
        <CardDescription>
          Compare aprovações, conclusões, reprovações e abandonos em cada
          formulário
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-72 w-full rounded-lg" />
        ) : !data?.length ? (
          <div className="text-muted-foreground flex h-72 items-center justify-center text-sm">
            Sem dados disponíveis
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <BarChart
              data={data}
              margin={{ top: 0, right: 4, left: -16, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="formName"
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
              <Legend content={<ChartLegendContent />} />
              <Bar
                dataKey="approved"
                stackId="a"
                fill="var(--chart-1)"
                radius={[0, 0, 0, 0]}
              />
              <Bar dataKey="inProgress" stackId="a" fill="var(--chart-4)" />
              <Bar dataKey="rejected" stackId="a" fill="var(--destructive)" />
              <Bar
                dataKey="abandoned"
                stackId="a"
                fill="var(--chart-5)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
