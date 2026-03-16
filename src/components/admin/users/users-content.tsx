'use client';

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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateAdminUser } from '@/hooks/use-users-admin-queries';
import { useFormsLookup } from '@/hooks/use-admin-queries';
import type { AdminUserListQuery, UserRole } from '@/types/admin.types';
import { MailIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UsersFilter } from './users-filter';
import { UsersList } from './users-list';

const DEFAULT_LIMIT = 20;

// ─── Create User Dialog ───────────────────────────────────────────────────────

function CreateUserDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: forms, isLoading: formsLoading } = useFormsLookup();
  const { mutate, isPending } = useCreateAdminUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('CLIENT');
  const [selectedFormIds, setSelectedFormIds] = useState<number[]>([]);

  function resetForm() {
    setName('');
    setEmail('');
    setRole('CLIENT');
    setSelectedFormIds([]);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function toggleForm(id: number) {
    setSelectedFormIds(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }

  function handleSubmit() {
    if (!name.trim() || !email.trim()) return;
    mutate(
      {
        name: name.trim(),
        email: email.trim(),
        role,
        formIds: role === 'CLIENT' ? selectedFormIds : undefined,
      },
      {
        onSuccess: () => {
          toast.success(`Usuário ${name.trim()} criado com sucesso.`);
          handleClose();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { message?: string })?.message ?? 'Erro ao criar usuário.';
          toast.error(msg);
        },
      }
    );
  }

  const canSubmit =
    name.trim().length > 0 && email.trim().length > 0 && !isPending;

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo usuário</DialogTitle>
          <DialogDescription>
            Crie uma conta para outro colaborador ou cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cu-name">Nome completo</Label>
            <Input
              id="cu-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Maria Souza"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cu-email">E-mail</Label>
            <Input
              id="cu-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="maria@revalife.com.br"
            />
          </div>

          <div className="bg-muted/50 text-muted-foreground flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm">
            <MailIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Um e-mail será enviado para o usuário definir a própria senha.
            </span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cu-role">Perfil</Label>
            <Select
              value={role}
              onValueChange={v => {
                setRole(v as UserRole);
                if (v === 'ADMIN') setSelectedFormIds([]);
              }}
            >
              <SelectTrigger id="cu-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLIENT">CLIENT</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === 'CLIENT' && (
            <div className="space-y-1.5">
              <Label>
                Permissões de formulários{' '}
                <span className="text-muted-foreground font-normal">
                  (opcional)
                </span>
              </Label>
              {formsLoading ? (
                <p className="text-muted-foreground text-sm">
                  Carregando formulários…
                </p>
              ) : !forms?.length ? (
                <p className="text-muted-foreground text-sm">
                  Nenhum formulário disponível.
                </p>
              ) : (
                <div className="border-border max-h-36 space-y-1 overflow-y-auto rounded-md border p-2">
                  {forms.map(f => (
                    <label
                      key={f.id}
                      className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFormIds.includes(f.id)}
                        onChange={() => toggleForm(f.id)}
                        className="accent-primary"
                      />
                      {f.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isPending ? 'Criando…' : 'Criar usuário'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

export function UsersContent() {
  const [query, setQuery] = useState<AdminUserListQuery>({
    page: 1,
    limit: DEFAULT_LIMIT,
  });
  const [createOpen, setCreateOpen] = useState(false);

  function handleFilterChange(q: AdminUserListQuery) {
    setQuery({ ...q, page: 1, limit: DEFAULT_LIMIT });
  }

  function handlePageChange(page: number) {
    setQuery(prev => ({ ...prev, page }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Gerencie os usuários da plataforma e suas permissões
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="shrink-0 gap-2">
          <PlusIcon className="h-4 w-4" />
          Novo usuário
        </Button>
      </div>

      {/* Filters */}
      <UsersFilter value={query} onChange={handleFilterChange} />

      {/* Table */}
      <UsersList query={query} onPageChange={handlePageChange} />

      {/* Create dialog */}
      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
