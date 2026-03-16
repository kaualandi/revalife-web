'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useAdminUserDetail,
  useDeleteAdminUser,
  useSetUserFormPermissions,
  useUpdateAdminUser,
} from '@/hooks/use-users-admin-queries';
import { useFormsLookup } from '@/hooks/use-admin-queries';
import type {
  AdminUserDetail,
  AdminUpdateUserDto,
  UserRole,
} from '@/types/admin.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { authClient } from '@/lib/api-admin';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CircleIcon,
  KeyRoundIcon,
  PencilIcon,
  ShieldIcon,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return format(new Date(iso), "d MMM yyyy 'às' HH:mm", { locale: ptBR });
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>{role}</Badge>
  );
}

// ─── Edit User Dialog ─────────────────────────────────────────────────────────

function EditUserDialog({
  user,
  open,
  onClose,
}: {
  user: AdminUserDetail;
  open: boolean;
  onClose: () => void;
}) {
  const { mutate, isPending } = useUpdateAdminUser();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<UserRole>(user.role);

  useEffect(() => {
    if (open) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [open, user]);

  function handleSave() {
    const data: AdminUpdateUserDto = {};
    if (name !== user.name) data.name = name;
    if (email !== user.email) data.email = email;
    if (role !== user.role) data.role = role;

    mutate(
      { id: user.id, data },
      {
        onSuccess: () => {
          toast.success('Usuário atualizado com sucesso.');
          onClose();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { message?: string })?.message ??
            'Erro ao atualizar usuário.';
          toast.error(msg);
        },
      }
    );
  }

  const hasChanges =
    name !== user.name || email !== user.email || role !== user.role;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar usuário</DialogTitle>
          <DialogDescription>Atualize os dados do usuário.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="eu-name">Nome completo</Label>
            <Input
              id="eu-name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="eu-email">E-mail</Label>
            <Input
              id="eu-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="eu-role">Perfil</Label>
            <Select value={role} onValueChange={v => setRole(v as UserRole)}>
              <SelectTrigger id="eu-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLIENT">CLIENT</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isPending || !hasChanges}>
            {isPending ? 'Salvando…' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Form Permissions Dialog ──────────────────────────────────────────────────

function FormPermissionsDialog({
  user,
  open,
  onClose,
}: {
  user: AdminUserDetail;
  open: boolean;
  onClose: () => void;
}) {
  const { data: forms, isLoading: formsLoading } = useFormsLookup();
  const { mutate, isPending } = useSetUserFormPermissions();
  const [selectedIds, setSelectedIds] = useState<number[]>(
    user.formPermissions.map(p => p.formId)
  );

  useEffect(() => {
    if (open) {
      setSelectedIds(user.formPermissions.map(p => p.formId));
    }
  }, [open, user]);

  function toggleForm(id: number) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }

  function handleSave() {
    mutate(
      { id: user.id, formIds: selectedIds },
      {
        onSuccess: () => {
          toast.success('Permissões de formulários atualizadas.');
          onClose();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { message?: string })?.message ??
            'Erro ao atualizar permissões.';
          toast.error(msg);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Permissões de formulários</DialogTitle>
          <DialogDescription>
            Selecione os formulários que <strong>{user.name}</strong> pode
            acessar. Esta ação substitui todas as permissões anteriores.
          </DialogDescription>
        </DialogHeader>

        {formsLoading ? (
          <p className="text-muted-foreground text-sm">
            Carregando formulários…
          </p>
        ) : !forms?.length ? (
          <p className="text-muted-foreground text-sm">
            Nenhum formulário disponível.
          </p>
        ) : (
          <div className="border-border max-h-64 space-y-1 overflow-y-auto rounded-md border p-2">
            {forms.map(f => (
              <label
                key={f.id}
                className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(f.id)}
                  onChange={() => toggleForm(f.id)}
                  className="accent-primary"
                />
                <span className="flex-1">{f.name}</span>
                <span className="text-muted-foreground font-mono text-xs">
                  {f.slug}
                </span>
              </label>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isPending || formsLoading}>
            {isPending ? 'Salvando…' : 'Salvar permissões'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete User Dialog ───────────────────────────────────────────────────────

function DeleteUserDialog({
  user,
  open,
  onClose,
  onDeleted,
}: {
  user: AdminUserDetail;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [confirmation, setConfirmation] = useState('');
  const { mutate, isPending } = useDeleteAdminUser();

  function handleDelete() {
    mutate(user.id, {
      onSuccess: () => {
        toast.success(`Usuário ${user.name} excluído.`);
        onDeleted();
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir usuário</DialogTitle>
          <DialogDescription>
            Esta ação é <strong>irreversível</strong>. Para confirmar, digite{' '}
            <code className="bg-muted rounded px-1 font-mono text-sm">
              DELETE
            </code>
            .
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

// ─── Summary Section ──────────────────────────────────────────────────────────

function SummarySection({ user }: { user: AdminUserDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Resumo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailRow label="Nome">{user.name}</DetailRow>
          <DetailRow label="E-mail">{user.email}</DetailRow>
          <DetailRow label="Perfil">
            <RoleBadge role={user.role} />
          </DetailRow>
          <DetailRow label="E-mail verificado">
            {user.emailVerified ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2Icon className="h-4 w-4" /> Verificado
              </span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-1">
                <CircleIcon className="h-4 w-4" /> Não verificado
              </span>
            )}
          </DetailRow>
          <DetailRow label="Criado em">{formatDate(user.createdAt)}</DetailRow>
          <DetailRow label="Atualizado em">
            {formatDate(user.updatedAt)}
          </DetailRow>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Permissions Tab ──────────────────────────────────────────────────────────

function PermissionsTab({ user }: { user: AdminUserDetail }) {
  if (user.role === 'ADMIN') {
    return (
      <div className="text-muted-foreground py-4 text-sm">
        Usuários ADMIN têm acesso total a todos os formulários. As permissões
        individuais são ignoradas.
      </div>
    );
  }

  if (user.formPermissions.length === 0) {
    return (
      <div className="text-muted-foreground py-4 text-sm">
        Nenhuma permissão de formulário atribuída. O usuário não tem acesso a
        nenhum formulário.
      </div>
    );
  }

  return (
    <div className="border-border rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Formulário</TableHead>
            <TableHead className="w-40">Slug</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user.formPermissions.map(p => (
            <TableRow key={p.formId}>
              <TableCell className="font-medium">{p.formName}</TableCell>
              <TableCell>
                <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                  {p.formSlug}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Actions Panel ────────────────────────────────────────────────────────────

function ActionsPanel({ user }: { user: AdminUserDetail }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isSelf = session?.user?.id === user.id;
  const [editOpen, setEditOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ações</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => setEditOpen(true)}
          >
            <PencilIcon className="h-4 w-4" />
            Editar dados
          </Button>
          {user.role === 'CLIENT' && (
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setPermissionsOpen(true)}
            >
              <ShieldIcon className="h-4 w-4" />
              Permissões de formulários
            </Button>
          )}
          {!isSelf && (
            <Button
              variant="destructive"
              className="w-full justify-start gap-2"
              onClick={() => setDeleteOpen(true)}
            >
              <TrashIcon className="h-4 w-4" />
              Excluir usuário
            </Button>
          )}
        </CardContent>
      </Card>

      <EditUserDialog
        user={user}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
      <FormPermissionsDialog
        user={user}
        open={permissionsOpen}
        onClose={() => setPermissionsOpen(false)}
      />
      <DeleteUserDialog
        user={user}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => router.push('/admin/users')}
      />
    </>
  );
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function UserDetailContent({ id }: { id: string }) {
  const { data: user, isLoading, isError } = useAdminUserDetail(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          asChild
        >
          <Link href="/admin/users">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {user ? user.name : 'Detalhe do Usuário'}
          </h1>
          {user && (
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-sm">
              {user.email}
              <span className="text-muted-foreground">·</span>
              <KeyRoundIcon className="h-3 w-3" />
              <span className="font-mono text-xs">{user.id}</span>
            </p>
          )}
        </div>
      </div>

      {isLoading && <LoadingSkeleton />}

      {isError && (
        <div className="border-border text-muted-foreground rounded-md border p-8 text-center">
          Erro ao carregar usuário. Verifique se ele ainda existe.
        </div>
      )}

      {user && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          {/* Left: summary + tabs */}
          <div className="space-y-6">
            <SummarySection user={user} />

            <Tabs defaultValue="permissions">
              <TabsList className="w-full">
                <TabsTrigger value="permissions">
                  Permissões
                  {user.role === 'CLIENT' && (
                    <span className="bg-primary/15 text-primary ml-1.5 rounded-full px-1.5 text-xs">
                      {user.formPermissions.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="permissions" className="mt-4">
                <PermissionsTab user={user} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: actions */}
          <ActionsPanel user={user} />
        </div>
      )}
    </div>
  );
}
