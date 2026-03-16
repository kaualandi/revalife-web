'use client';

import { Badge } from '@/components/ui/badge';
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
  useAdminUsers,
  useDeleteAdminUser,
} from '@/hooks/use-users-admin-queries';
import { authClient } from '@/lib/api-admin';
import type {
  AdminUserListItem,
  AdminUserListQuery,
} from '@/types/admin.types';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2Icon, CircleIcon, EyeIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return formatDistanceToNow(new Date(iso), { locale: ptBR, addSuffix: true });
}

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>{role}</Badge>
  );
}

function PermissionsCount({
  count,
  role,
}: {
  count: number | null;
  role: string;
}) {
  if (role === 'ADMIN') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-sm">∞</span>
        </TooltipTrigger>
        <TooltipContent>Acesso total</TooltipContent>
      </Tooltip>
    );
  }
  return <span className="text-sm">{count}</span>;
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────

function DeleteUserDialog({
  user,
  open,
  onClose,
}: {
  user: AdminUserListItem;
  open: boolean;
  onClose: () => void;
}) {
  const [confirmation, setConfirmation] = useState('');
  const { mutate, isPending } = useDeleteAdminUser();

  function handleDelete() {
    mutate(user.id, {
      onSuccess: () => {
        toast.success(`Usuário ${user.name} excluído.`);
        onClose();
        setConfirmation('');
      },
      onError: (err: unknown) => {
        const msg =
          (err as { message?: string })?.message ?? 'Erro ao excluir usuário.';
        toast.error(msg);
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
          <DialogTitle>Excluir usuário</DialogTitle>
          <DialogDescription>
            Esta ação é <strong>irreversível</strong>. Para confirmar, digite{' '}
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
            {isPending ? 'Excluindo…' : 'Excluir usuário'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Row Actions ──────────────────────────────────────────────────────────────

function RowActions({ user }: { user: AdminUserListItem }) {
  const { data: session } = authClient.useSession();
  const isSelf = session?.user?.id === user.id;
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/admin/users/${user.id}`}>
                <EyeIcon className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ver detalhe</TooltipContent>
        </Tooltip>

        {!isSelf && (
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
            <TooltipContent>Excluir usuário</TooltipContent>
          </Tooltip>
        )}
      </div>

      {!isSelf && (
        <DeleteUserDialog
          user={user}
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
        />
      )}
    </>
  );
}

// ─── Desktop Table ────────────────────────────────────────────────────────────

function DesktopTable({ users }: { users: AdminUserListItem[] }) {
  return (
    <div className="border-border hidden rounded-md border md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead className="w-28">Perfil</TableHead>
            <TableHead className="w-28 text-center">Verificado</TableHead>
            <TableHead className="w-28 text-center">Formulários</TableHead>
            <TableHead>Criado há</TableHead>
            <TableHead className="w-20 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(u => (
            <TableRow key={u.id}>
              <TableCell className="font-medium">{u.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {u.email}
              </TableCell>
              <TableCell>
                <RoleBadge role={u.role} />
              </TableCell>
              <TableCell className="text-center">
                {u.emailVerified ? (
                  <CheckCircle2Icon className="mx-auto h-4 w-4 text-green-500" />
                ) : (
                  <CircleIcon className="text-muted-foreground mx-auto h-4 w-4" />
                )}
              </TableCell>
              <TableCell className="text-center">
                <PermissionsCount
                  count={u.formPermissionsCount}
                  role={u.role}
                />
              </TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-muted-foreground cursor-default text-sm">
                      {formatDate(u.createdAt)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {format(new Date(u.createdAt), "d MMM yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <RowActions user={u} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Mobile Cards ─────────────────────────────────────────────────────────────

function MobileCards({ users }: { users: AdminUserListItem[] }) {
  return (
    <div className="grid gap-3 md:hidden">
      {users.map(u => (
        <div
          key={u.id}
          className="border-border bg-card flex flex-col gap-3 rounded-lg border p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-sm font-medium">{u.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {u.email}
              </span>
            </div>
            <RoleBadge role={u.role} />
          </div>

          <div className="text-muted-foreground grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-foreground font-medium">Verificado:</span>{' '}
              {u.emailVerified ? 'Sim' : 'Não'}
            </div>
            <div>
              <span className="text-foreground font-medium">Formulários:</span>{' '}
              {u.formPermissionsCount === null ? '∞' : u.formPermissionsCount}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">
              {formatDate(u.createdAt)}
            </span>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/users/${u.id}`}>
                <EyeIcon className="mr-1 h-3.5 w-3.5" /> Ver
              </Link>
            </Button>
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
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-24" />
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

// ─── Main UsersList ───────────────────────────────────────────────────────────

interface UsersListProps {
  query: AdminUserListQuery;
  onPageChange: (page: number) => void;
}

export function UsersList({ query, onPageChange }: UsersListProps) {
  const { data, isLoading, isError } = useAdminUsers(query);

  if (isLoading) return <LoadingSkeleton />;

  if (isError || !data) {
    return (
      <div className="border-border text-muted-foreground rounded-md border p-8 text-center">
        Erro ao carregar usuários. Tente novamente.
      </div>
    );
  }

  if (data.data.length === 0) {
    return (
      <div className="border-border text-muted-foreground rounded-md border p-8 text-center">
        Nenhum usuário encontrado com os filtros aplicados.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DesktopTable users={data.data} />
      <MobileCards users={data.data} />
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
