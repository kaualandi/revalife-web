'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useRecentSessions } from '@/hooks/use-admin-queries';
import type { SessionStatus } from '@/types/api.types';
import type { RecentSession } from '@/types/admin.types';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const STATUS_LABELS: Record<SessionStatus, string> = {
  IN_PROGRESS: 'Em progresso',
  COMPLETED: 'Concluída',
  APPROVED: 'Aprovada',
  REJECTED: 'Reprovada',
  ABANDONED: 'Abandonada',
  ERROR: 'Erro',
};

const STATUS_CLASS: Record<SessionStatus, string> = {
  IN_PROGRESS:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  APPROVED:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  ABANDONED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  ERROR:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

function StatusBadge({ status }: { status: SessionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[status] ?? ''}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function formatDate(iso: string) {
  return format(new Date(iso), "d MMM yyyy 'às' HH:mm", { locale: ptBR });
}

function formatId(id: number) {
  return `#${String(id).padStart(4, '0')}`;
}

// ─── Desktop Table ────────────────────────────────────────────────────────────
function DesktopTable({ sessions }: { sessions: RecentSession[] }) {
  return (
    <div className="border-border hidden rounded-md border md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Formulário</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map(s => (
            <TableRow key={s.id}>
              <TableCell className="text-muted-foreground font-mono text-xs">
                {formatId(s.id)}
              </TableCell>
              <TableCell className="text-sm">
                {s.fullName ?? <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="text-sm">
                {s.email ?? <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="font-medium">{s.formName}</TableCell>
              <TableCell>
                <StatusBadge status={s.status as SessionStatus} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(s.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Mobile Cards ─────────────────────────────────────────────────────────────
function MobileCards({ sessions }: { sessions: RecentSession[] }) {
  return (
    <div className="grid gap-3 md:hidden">
      {sessions.map(s => (
        <div
          key={s.id}
          className="border-border bg-card flex flex-col gap-2 rounded-lg border p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{s.formName}</span>
            <StatusBadge status={s.status as SessionStatus} />
          </div>
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span className="font-mono">{formatId(s.id)}</span>
            <span>{s.fullName ?? '—'}</span>
          </div>
          <p className="text-muted-foreground text-xs">
            {formatDate(s.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton Rows ────────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function RecentSessionsTable({ formId }: { formId?: number }) {
  const { data, isLoading } = useRecentSessions(formId);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Sessões Recentes</CardTitle>
          <CardDescription>
            Últimas sessões registradas no sistema
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" className="shrink-0">
          Ver todos
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : !data?.length ? (
          <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
            Nenhuma sessão encontrada
          </div>
        ) : (
          <>
            <DesktopTable sessions={data} />
            <MobileCards sessions={data} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
