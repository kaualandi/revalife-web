'use client';

import {
  SessionStatusBadge,
  SESSION_STATUS_LABELS,
} from '@/components/admin/sessions/session-status-badge';
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
  useAdminSessionDetail,
  useDeleteAdminSession,
  useUpdateAdminSession,
} from '@/hooks/use-sessions-admin-queries';
import type {
  AdminSessionDetail,
  AdminSessionUpdate,
} from '@/types/admin.types';
import type { SessionStatus } from '@/types/api.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatId(id: number) {
  return `#${String(id).padStart(5, '0')}`;
}

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

// ─── Edit Status Dialog ───────────────────────────────────────────────────────

const STATUS_OPTIONS: SessionStatus[] = [
  'IN_PROGRESS',
  'APPROVED',
  'REJECTED',
  'ABANDONED',
  'ERROR',
];

function EditStatusDialog({
  sessionId,
  currentStatus,
  open,
  onClose,
}: {
  sessionId: number;
  currentStatus: SessionStatus;
  open: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<SessionStatus>(currentStatus);
  const { mutate, isPending } = useUpdateAdminSession();

  function handleSave() {
    mutate(
      { id: sessionId, data: { status } },
      {
        onSuccess: () => {
          toast.success('Status atualizado com sucesso.');
          onClose();
        },
        onError: () => {
          toast.error('Erro ao atualizar o status.');
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Alterar status</DialogTitle>
          <DialogDescription>
            Selecione o novo status para esta sessão.
          </DialogDescription>
        </DialogHeader>
        <Select
          value={status}
          onValueChange={v => setStatus(v as SessionStatus)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(s => (
              <SelectItem key={s} value={s}>
                {SESSION_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || status === currentStatus}
          >
            {isPending ? 'Salvando…' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Product URL Dialog ──────────────────────────────────────────────────

function EditProductUrlDialog({
  sessionId,
  currentUrl,
  open,
  onClose,
}: {
  sessionId: number;
  currentUrl: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(currentUrl ?? '');
  const { mutate, isPending } = useUpdateAdminSession();

  function handleSave() {
    const data: AdminSessionUpdate = { productUrl: url || null };
    mutate(
      { id: sessionId, data },
      {
        onSuccess: () => {
          toast.success('Product URL atualizada.');
          onClose();
        },
        onError: () => {
          toast.error('Erro ao atualizar a Product URL.');
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Product URL</DialogTitle>
          <DialogDescription>
            URL do produto recomendado para esta sessão.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="productUrl">URL</Label>
          <Input
            id="productUrl"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? 'Salvando…' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Session Dialog ────────────────────────────────────────────────────

function DeleteSessionDialog({
  sessionId,
  open,
  onClose,
  onDeleted,
}: {
  sessionId: number;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [confirmation, setConfirmation] = useState('');
  const { mutate, isPending } = useDeleteAdminSession();

  function handleDelete() {
    mutate(sessionId, {
      onSuccess: () => {
        toast.success(`Sessão ${formatId(sessionId)} excluída.`);
        onDeleted();
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir sessão</DialogTitle>
          <DialogDescription>
            Esta ação é <strong>irreversível</strong>. UTMs e webhooks
            associados serão deletados em cascata. Para confirmar, digite{' '}
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
            {isPending ? 'Excluindo…' : 'Excluir sessão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Section 2 — Tabs ─────────────────────────────────────────────────────────

function AnswersTab({ session }: { session: AdminSessionDetail }) {
  const hasMapped = session.mappedAnswers.length > 0;

  if (!hasMapped) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Sem respostas mapeadas. Exibindo JSON bruto como fallback.
        </p>
        <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs leading-relaxed">
          {JSON.stringify(session.answers, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="border-border rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pergunta</TableHead>
            <TableHead className="w-32">Tipo</TableHead>
            <TableHead>Resposta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {session.mappedAnswers.map(a => (
            <TableRow key={a.questionId}>
              <TableCell className="text-sm font-medium">
                {a.questionTitle}
              </TableCell>
              <TableCell>
                <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                  {a.questionType}
                </span>
              </TableCell>
              <TableCell className="text-sm">{a.displayValue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function UtmTab({ session }: { session: AdminSessionDetail }) {
  const utm = session.utms[0];
  if (!utm) {
    return (
      <p className="text-muted-foreground py-4 text-sm">
        Nenhum dado UTM registrado nesta sessão.
      </p>
    );
  }

  const fields: [string, string | null | undefined][] = [
    ['utm_source', utm.utm_source],
    ['utm_medium', utm.utm_medium],
    ['utm_campaign', utm.utm_campaign],
    ['utm_content', utm.utm_content],
    ['utm_term', utm.utm_term],
    ['tracking_id', utm.tracking_id],
    ['ph_distinct_id', utm.ph_distinct_id],
    ['referring_afiliado_id', utm.referring_afiliado_id],
  ];

  const nonNull = fields.filter(([, v]) => v !== null && v !== undefined);

  if (nonNull.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-sm">
        Todos os campos UTM são nulos.
      </p>
    );
  }

  return (
    <div className="border-border rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">Campo</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nonNull.map(([k, v]) => (
            <TableRow key={k}>
              <TableCell>
                <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                  {k}
                </span>
              </TableCell>
              <TableCell className="text-sm">{v}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function WebhooksTab({ session }: { session: AdminSessionDetail }) {
  if (session.webhookDeliveries.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-sm">
        Nenhuma entrega de webhook registrada.
      </p>
    );
  }

  return (
    <div className="border-border overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24 text-center">Tentativas</TableHead>
            <TableHead className="w-24 text-center">HTTP</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Última tentativa</TableHead>
            <TableHead>Erro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {session.webhookDeliveries.map(d => (
            <TableRow
              key={d.id}
              className={
                d.status === 'failed' ? 'bg-red-50 dark:bg-red-900/10' : ''
              }
            >
              <TableCell className="font-mono text-xs">{d.event}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    d.status === 'failed'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : d.status === 'success'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {d.status}
                </span>
              </TableCell>
              <TableCell className="text-center text-sm">
                {d.attempts}
              </TableCell>
              <TableCell className="text-center font-mono text-xs">
                {d.responseStatus ?? '—'}
              </TableCell>
              <TableCell>
                <a
                  href={d.webhookConfig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-xs items-center gap-1 truncate text-xs text-blue-600 hover:underline dark:text-blue-400"
                >
                  {d.webhookConfig.url}
                  <ExternalLinkIcon className="h-3 w-3 flex-none" />
                </a>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {formatDate(d.lastAttempt)}
              </TableCell>
              <TableCell>
                {d.errorMessage ? (
                  <span className="block max-w-xs truncate text-xs text-red-600 dark:text-red-400">
                    {d.errorMessage}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RawJsonTab({ session }: { session: AdminSessionDetail }) {
  return (
    <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs leading-relaxed">
      {JSON.stringify(session.answers, null, 2)}
    </pre>
  );
}

// ─── Summary Section ──────────────────────────────────────────────────────────

function SummarySection({ session }: { session: AdminSessionDetail }) {
  const kommoUrl =
    session.kommoId && session.form?.kommoIntegration?.apiUrl
      ? `${session.form.kommoIntegration.apiUrl}/leads/detail/${session.kommoId}`
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Resumo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailRow label="Nome">
            {session.fullName ?? (
              <span className="text-muted-foreground italic">Anônimo</span>
            )}
          </DetailRow>
          <DetailRow label="E-mail">
            {session.email ?? <span className="text-muted-foreground">—</span>}
          </DetailRow>
          <DetailRow label="Telefone">
            {session.phone ?? <span className="text-muted-foreground">—</span>}
          </DetailRow>
          <DetailRow label="Status">
            <SessionStatusBadge status={session.status} />
          </DetailRow>
          <DetailRow label="Etapa atual">{session.currentStep}</DetailRow>
          <DetailRow label="Formulário">
            {session.form ? (
              <span>
                {session.form.name}{' '}
                <span className="text-muted-foreground font-mono text-xs">
                  ({session.form.slug})
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </DetailRow>
          <DetailRow label="Kommo ID">
            {kommoUrl ? (
              <a
                href={kommoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
              >
                {session.kommoId} <ExternalLinkIcon className="h-3 w-3" />
              </a>
            ) : session.kommoId ? (
              String(session.kommoId)
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </DetailRow>
          <DetailRow label="Product URL">
            {session.productUrl ? (
              <a
                href={session.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                {session.productUrl}{' '}
                <ExternalLinkIcon className="h-3 w-3 flex-none" />
              </a>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </DetailRow>
          <DetailRow label="IP">
            {session.ipAddress ?? (
              <span className="text-muted-foreground">—</span>
            )}
          </DetailRow>
          <DetailRow label="User Agent">
            <span
              className="text-muted-foreground line-clamp-2 text-xs"
              title={session.userAgent ?? ''}
            >
              {session.userAgent ?? '—'}
            </span>
          </DetailRow>
          <DetailRow label="Criado em">
            {formatDate(session.createdAt)}
          </DetailRow>
          <DetailRow label="Submetido em">
            {formatDate(session.submittedAt)}
          </DetailRow>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Actions Panel ────────────────────────────────────────────────────────────

function ActionsPanel({ session }: { session: AdminSessionDetail }) {
  const router = useRouter();
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [editUrlOpen, setEditUrlOpen] = useState(false);
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
            onClick={() => setEditStatusOpen(true)}
          >
            <PencilIcon className="h-4 w-4" />
            Alterar status
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => setEditUrlOpen(true)}
          >
            <ExternalLinkIcon className="h-4 w-4" />
            Editar Product URL
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start gap-2"
            onClick={() => setDeleteOpen(true)}
          >
            <TrashIcon className="h-4 w-4" />
            Excluir sessão
          </Button>
        </CardContent>
      </Card>

      <EditStatusDialog
        sessionId={session.id}
        currentStatus={session.status}
        open={editStatusOpen}
        onClose={() => setEditStatusOpen(false)}
      />
      <EditProductUrlDialog
        sessionId={session.id}
        currentUrl={session.productUrl}
        open={editUrlOpen}
        onClose={() => setEditUrlOpen(false)}
      />
      <DeleteSessionDialog
        sessionId={session.id}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => router.push('/admin/sessions')}
      />
    </>
  );
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-52 w-full rounded-xl" />
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function SessionDetailContent({ id }: { id: number }) {
  const { data: session, isLoading, isError } = useAdminSessionDetail(id);

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
          <Link href="/admin/sessions">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {session ? `Sessão ${formatId(session.id)}` : 'Detalhe da Sessão'}
          </h1>
          {session && (
            <p className="text-muted-foreground mt-0.5 text-sm">
              {session.fullName ?? session.email ?? 'Anônimo'} —{' '}
              {session.form?.name ?? 'Formulário removido'}
            </p>
          )}
        </div>
      </div>

      {isLoading && <LoadingSkeleton />}

      {isError && (
        <div className="border-border text-muted-foreground rounded-md border p-8 text-center">
          Erro ao carregar a sessão. Verifique se ela ainda existe.
        </div>
      )}

      {session && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          {/* Left: summary + tabs */}
          <div className="space-y-6">
            <SummarySection session={session} />

            <Tabs defaultValue="answers">
              <TabsList className="w-full">
                <TabsTrigger value="answers">Respostas</TabsTrigger>
                <TabsTrigger value="utms">UTMs</TabsTrigger>
                <TabsTrigger value="webhooks">
                  Webhooks
                  {session.webhookDeliveries.some(
                    d => d.status === 'failed'
                  ) && (
                    <span className="ml-1.5 inline-flex h-2 w-2 rounded-full bg-red-500" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="raw">Raw JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="answers" className="mt-4">
                <AnswersTab session={session} />
              </TabsContent>
              <TabsContent value="utms" className="mt-4">
                <UtmTab session={session} />
              </TabsContent>
              <TabsContent value="webhooks" className="mt-4">
                <WebhooksTab session={session} />
              </TabsContent>
              <TabsContent value="raw" className="mt-4">
                <RawJsonTab session={session} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: actions */}
          <ActionsPanel session={session} />
        </div>
      )}
    </div>
  );
}
