'use client';

import { SessionStatusBadge } from '@/components/admin/sessions/session-status-badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useAdminSessions,
  useDeleteAdminSession,
} from '@/hooks/use-sessions-admin-queries';
import type {
  AdminSessionListItem,
  AdminSessionListQuery,
} from '@/types/admin.types';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CheckIcon,
  ExternalLinkIcon,
  EyeIcon,
  MinusIcon,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatId(id: number) {
  return `#${String(id).padStart(5, '0')}`;
}

function formatDate(iso: string) {
  return formatDistanceToNow(new Date(iso), { locale: ptBR, addSuffix: true });
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────

function DeleteSessionDialog({
  session,
  open,
  onClose,
}: {
  session: AdminSessionListItem;
  open: boolean;
  onClose: () => void;
}) {
  const [confirmation, setConfirmation] = useState('');
  const { mutate, isPending } = useDeleteAdminSession();

  function handleDelete() {
    mutate(session.id, {
      onSuccess: () => {
        toast.success(`Sessão ${formatId(session.id)} excluída.`);
        onClose();
        setConfirmation('');
      },
      onError: () => {
        toast.error('Erro ao excluir a sessão.');
      },
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={v => {
        if (!v) {
          setConfirmation('');
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir sessão</DialogTitle>
          <DialogDescription>
            Esta ação é <strong>irreversível</strong>. UTMs e webhooks
            associados serão deletados em cascata. Para confirmar, digite{' '}
            <code className="bg-muted rounded px-1 font-mono text-sm">
              DELETE
            </code>{' '}
            abaixo.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={confirmation}
          onChange={e => setConfirmation(e.target.value)}
          placeholder="Digite DELETE para confirmar"
          className="font-mono"
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setConfirmation('');
              onClose();
            }}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || confirmation !== 'DELETE'}
          >
            {isPending ? 'Excluindo…' : 'Excluir sessão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Row actions ──────────────────────────────────────────────────────────────

function RowActions({ session }: { session: AdminSessionListItem }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/admin/sessions/${session.id}`}>
                <EyeIcon className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ver detalhe</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive h-8 w-8"
              onClick={() => setDeleteOpen(true)}
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Excluir sessão</TooltipContent>
        </Tooltip>
      </div>

      <DeleteSessionDialog
        session={session}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}

// ─── Desktop Table ────────────────────────────────────────────────────────────

function DesktopTable({ sessions }: { sessions: AdminSessionListItem[] }) {
  return (
    <div className="border-border hidden rounded-md border md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">ID</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Formulário</TableHead>
            <TableHead className="w-16 text-center">Etapa</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Kommo</TableHead>
            <TableHead className="w-16 text-center">UTM</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Criado há</TableHead>
            <TableHead className="w-20 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map(s => (
            <TableRow key={s.id}>
              <TableCell className="text-muted-foreground font-mono text-xs">
                {formatId(s.id)}
              </TableCell>

              {/* Lead */}
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">
                    {s.fullName ?? (
                      <span className="text-muted-foreground italic">
                        Anônimo
                      </span>
                    )}
                  </span>
                  {s.email && (
                    <span className="text-muted-foreground text-xs">
                      {s.email}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Formulário */}
              <TableCell>
                {s.formName ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{s.formName}</span>
                    {s.formSlug && (
                      <span className="text-muted-foreground font-mono text-xs">
                        {s.formSlug}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Etapa */}
              <TableCell className="text-center text-sm">
                {s.currentStep}
              </TableCell>

              {/* Status */}
              <TableCell>
                <SessionStatusBadge status={s.status} />
              </TableCell>

              {/* Kommo */}
              <TableCell>
                {s.kommoId ? (
                  <span className="font-mono text-xs">{s.kommoId}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* UTM */}
              <TableCell className="text-center">
                {s.hasUtm ? (
                  <CheckIcon className="mx-auto h-4 w-4 text-green-500" />
                ) : (
                  <MinusIcon className="text-muted-foreground mx-auto h-4 w-4" />
                )}
              </TableCell>

              {/* Produto */}
              <TableCell>
                {s.productUrl ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <a
                          href={s.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Abrir produto"
                        >
                          <ExternalLinkIcon className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{s.productUrl}</TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Criado há */}
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-muted-foreground cursor-default text-sm">
                      {formatDate(s.createdAt)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {format(new Date(s.createdAt), "d MMM yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </TooltipContent>
                </Tooltip>
              </TableCell>

              {/* Ações */}
              <TableCell>
                <RowActions session={s} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Mobile Cards ─────────────────────────────────────────────────────────────

function MobileCards({ sessions }: { sessions: AdminSessionListItem[] }) {
  return (
    <div className="grid gap-3 md:hidden">
      {sessions.map(s => (
        <div
          key={s.id}
          className="border-border bg-card flex flex-col gap-3 rounded-lg border p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-sm font-medium">
                {s.fullName ?? (
                  <span className="text-muted-foreground italic">Anônimo</span>
                )}
              </span>
              {s.email && (
                <span className="text-muted-foreground truncate text-xs">
                  {s.email}
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <SessionStatusBadge status={s.status} />
            </div>
          </div>

          <div className="text-muted-foreground grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-foreground font-medium">Formulário:</span>{' '}
              {s.formName ?? '—'}
            </div>
            <div>
              <span className="text-foreground font-medium">Etapa:</span>{' '}
              {s.currentStep}
            </div>
            <div>
              <span className="text-foreground font-medium">Kommo:</span>{' '}
              {s.kommoId ?? '—'}
            </div>
            <div>
              <span className="text-foreground font-medium">UTM:</span>{' '}
              {s.hasUtm ? '✓' : '—'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">
              {formatDate(s.createdAt)}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/sessions/${s.id}`}>
                  <EyeIcon className="mr-1 h-3.5 w-3.5" /> Ver
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="border-border rounded-md border">
      <div className="space-y-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
          >
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationBarProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}

function PaginationBar({
  page,
  totalPages,
  total,
  limit,
  onPage,
}: PaginationBarProps) {
  const from = total > 0 ? (page - 1) * limit + 1 : 0;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">
        Mostrando{' '}
        <strong>
          {from}–{to}
        </strong>{' '}
        de <strong>{total}</strong>
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
        >
          Anterior
        </Button>
        <span className="text-muted-foreground">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}

// ─── Main SessionsList ────────────────────────────────────────────────────────

interface SessionsListProps {
  query: AdminSessionListQuery;
  onPageChange: (page: number) => void;
}

export function SessionsList({ query, onPageChange }: SessionsListProps) {
  const { data, isLoading, isError } = useAdminSessions(query);

  if (isLoading) return <LoadingSkeleton />;

  if (isError || !data) {
    return (
      <div className="border-border text-muted-foreground rounded-md border p-8 text-center">
        Erro ao carregar sessões. Tente novamente.
      </div>
    );
  }

  if (data.data.length === 0) {
    return (
      <div className="border-border text-muted-foreground rounded-md border p-8 text-center">
        Nenhuma sessão encontrada com os filtros aplicados.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DesktopTable sessions={data.data} />
      <MobileCards sessions={data.data} />
      {data.meta.totalPages > 1 && (
        <PaginationBar
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          total={data.meta.total}
          limit={data.meta.limit}
          onPage={onPageChange}
        />
      )}
    </div>
  );
}
