'use client';

import { DuplicateFormDialog } from '@/components/admin/forms/duplicate-form-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useDeleteForm } from '@/hooks/use-form-queries';
import { useAdminForms } from '@/hooks/use-form-queries';
import type { AdminFormListItem } from '@/types/admin.types';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CopyIcon,
  ExternalLinkIcon,
  PencilIcon,
  TagIcon,
  TrashIcon,
  Users2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function ColorSwatches({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: primary }}
          />
        </TooltipTrigger>
        <TooltipContent>{primary}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: secondary }}
          />
        </TooltipTrigger>
        <TooltipContent>{secondary}</TooltipContent>
      </Tooltip>
    </div>
  );
}

function FormAvatar({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl: string | null;
}) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
  return (
    <Avatar className="size-8 bg-white">
      <AvatarImage
        src={logoUrl ?? undefined}
        alt={name}
        className="object-contain"
      />
      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
    </Avatar>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
      Ativo
    </Badge>
  ) : (
    <Badge variant="secondary">Inativo</Badge>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete confirmation dialog
// ─────────────────────────────────────────────────────────────────────────────

function DeleteDialog({
  form,
  open,
  onClose,
}: {
  form: AdminFormListItem;
  open: boolean;
  onClose: () => void;
}) {
  const { mutate, isPending } = useDeleteForm();

  function handleDelete() {
    mutate(form.slug, {
      onSuccess: () => {
        toast.success(`Formulário "${form.name}" desativado.`);
        onClose();
      },
      onError: () => {
        toast.error('Erro ao desativar o formulário.');
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desativar formulário</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja desativar <strong>{form.name}</strong>? O
            formulário ficará inativo mas seus dados serão preservados.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Desativando...' : 'Desativar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Row actions
// ─────────────────────────────────────────────────────────────────────────────

function RowActions({ form }: { form: AdminFormListItem }) {
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a
                aria-label={`Visualizar formulário ${form.name}`}
                href={`/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Visualizar ao vivo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/admin/forms/${form.slug}`}>
                <PencilIcon className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Editar</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setDuplicateOpen(true)}
            >
              <CopyIcon className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Duplicar</TooltipContent>
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
          <TooltipContent>Desativar</TooltipContent>
        </Tooltip>
      </div>

      <DuplicateFormDialog
        slug={form.slug}
        open={duplicateOpen}
        onClose={() => setDuplicateOpen(false)}
      />
      <DeleteDialog
        form={form}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop table
// ─────────────────────────────────────────────────────────────────────────────

function DesktopTable({ forms }: { forms: AdminFormListItem[] }) {
  return (
    <div className="hidden md:block">
      <div className="border-border rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Formulário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cores</TableHead>
              <TableHead>GTM</TableHead>
              <TableHead>
                <span className="flex items-center gap-1">
                  <Users2Icon className="h-3.5 w-3.5" /> Sessões
                </span>
              </TableHead>
              <TableHead>Criado há</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map(form => (
              <TableRow key={form.id}>
                <TableCell>
                  <FormAvatar name={form.name} logoUrl={form.logoUrl} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{form.name}</span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {form.slug}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge isActive={form.isActive} />
                </TableCell>
                <TableCell>
                  <ColorSwatches
                    primary={form.primaryColor}
                    secondary={form.secondaryColor}
                  />
                </TableCell>
                <TableCell>
                  {form.gtmId ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TagIcon className="text-muted-foreground h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>{form.gtmId}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <Link href={`/admin/sessions?formSlug=${form.slug}`}>
                          <Users2Icon className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {form.sessionsCount.toLocaleString('pt-BR')} sessões
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-muted-foreground cursor-default text-sm">
                        {formatDistanceToNow(new Date(form.createdAt), {
                          locale: ptBR,
                          addSuffix: true,
                        })}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {format(
                        new Date(form.createdAt),
                        "d MMM yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-right">
                  <RowActions form={form} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile cards
// ─────────────────────────────────────────────────────────────────────────────

function MobileCards({ forms }: { forms: AdminFormListItem[] }) {
  return (
    <div className="grid gap-3 md:hidden">
      {forms.map(form => (
        <Card key={form.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <FormAvatar name={form.name} logoUrl={form.logoUrl} />
                <div>
                  <CardTitle className="text-base">{form.name}</CardTitle>
                  <CardDescription className="font-mono text-xs">
                    {form.slug}
                  </CardDescription>
                </div>
              </div>
              <StatusBadge isActive={form.isActive} />
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <Link
                  href={`/admin/sessions?formSlug=${form.slug}`}
                  className="text-muted-foreground flex items-center gap-1 hover:underline"
                >
                  <Users2Icon className="h-3.5 w-3.5" />
                  {form.sessionsCount.toLocaleString('pt-BR')} sessões
                </Link>
                <ColorSwatches
                  primary={form.primaryColor}
                  secondary={form.secondaryColor}
                />
                {form.gtmId && (
                  <TagIcon className="text-muted-foreground h-4 w-4" />
                )}
              </div>
              <RowActions form={form} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading skeleton
// ─────────────────────────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <p className="text-muted-foreground text-sm">
        Nenhum formulário encontrado.
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        Clique em <strong>Novo Formulário</strong> para começar.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export function FormsList() {
  const { data, isLoading } = useAdminForms();

  if (isLoading) return <LoadingSkeleton />;
  if (!data?.length) return <EmptyState />;

  return (
    <>
      <DesktopTable forms={data} />
      <MobileCards forms={data} />
    </>
  );
}
