'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type {
  AnamnesisScoringCondition,
  FormSettings,
  RedirectCondition,
} from '@/types/form.types';
import { PlusIcon, TrashIcon } from 'lucide-react';

const REDIRECT_OPERATORS = [
  { value: 'equals', label: 'Igual a' },
  { value: 'notEquals', label: 'Não igual a' },
  { value: 'contains', label: 'Contém' },
  { value: 'notContains', label: 'Não contém' },
  { value: 'in', label: 'Em' },
] as const;

interface FormSettingsPanelProps {
  value: FormSettings | undefined;
  onChange: (value: FormSettings) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function emptyScore(): AnamnesisScoringCondition {
  return { fieldName: '', values: [], points: 0 };
}

function emptyRedirect(): RedirectCondition {
  return { fieldName: '', operator: 'equals', value: '', redirectUrl: '' };
}

// ─────────────────────────────────────────────────────────────────────────────
// Anamnesis section
// ─────────────────────────────────────────────────────────────────────────────

function AnamnesisSection({
  value,
  onChange,
}: {
  value: FormSettings;
  onChange: (v: FormSettings) => void;
}) {
  const rules = value.anamnesisRules ?? { threshold: 0, scoringConditions: [] };

  function update(patch: Partial<typeof rules>) {
    onChange({ ...value, anamnesisRules: { ...rules, ...patch } });
  }

  function updateCondition(
    i: number,
    patch: Partial<AnamnesisScoringCondition>
  ) {
    const next = rules.scoringConditions.map((c, idx) =>
      idx === i ? { ...c, ...patch } : c
    );
    update({ scoringConditions: next });
  }

  function addCondition() {
    update({ scoringConditions: [...rules.scoringConditions, emptyScore()] });
  }

  function removeCondition(i: number) {
    update({
      scoringConditions: rules.scoringConditions.filter((_, idx) => idx !== i),
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Regras de Anamnese</CardTitle>
        <CardDescription>
          Define a pontuação mínima para rejeição e as condições de pontuação.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-40">
            <Label className="text-xs">Pontuação mínima p/ rejeição</Label>
            <Input
              type="number"
              className="mt-1"
              value={rules.threshold}
              onChange={e => update({ threshold: Number(e.target.value) })}
            />
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
            Condições de pontuação
          </p>
          <div className="space-y-2">
            {rules.scoringConditions.map((cond, i) => (
              <div
                key={i}
                className="bg-muted/40 grid grid-cols-[1fr_1fr_80px_auto] items-center gap-2 rounded-md p-2"
              >
                <Input
                  placeholder="Campo (fieldName)"
                  className="h-8 text-xs"
                  value={cond.fieldName}
                  onChange={e =>
                    updateCondition(i, { fieldName: e.target.value })
                  }
                />
                <Input
                  placeholder="Valores, separados por vírgula"
                  className="h-8 text-xs"
                  value={cond.values.join(', ')}
                  onChange={e =>
                    updateCondition(i, {
                      values: e.target.value
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
                <Input
                  placeholder="Pts"
                  type="number"
                  className="h-8 text-xs"
                  value={cond.points}
                  onChange={e =>
                    updateCondition(i, { points: Number(e.target.value) })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive h-8 w-8"
                  onClick={() => removeCondition(i)}
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            {rules.scoringConditions.length === 0 && (
              <p className="text-muted-foreground py-2 text-center text-xs">
                Nenhuma condição configurada.
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 h-7 text-xs"
            onClick={addCondition}
          >
            <PlusIcon className="mr-1 h-3 w-3" />
            Adicionar condição
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Redirect section
// ─────────────────────────────────────────────────────────────────────────────

function RedirectSection({
  value,
  onChange,
}: {
  value: FormSettings;
  onChange: (v: FormSettings) => void;
}) {
  const redirect = value.redirectOnSuccess ?? { conditions: [] };

  function update(patch: Partial<typeof redirect>) {
    onChange({ ...value, redirectOnSuccess: { ...redirect, ...patch } });
  }

  function updateCondition(i: number, patch: Partial<RedirectCondition>) {
    const next = redirect.conditions.map((c, idx) =>
      idx === i ? { ...c, ...patch } : c
    );
    update({ conditions: next });
  }

  function addCondition() {
    update({ conditions: [...redirect.conditions, emptyRedirect()] });
  }

  function removeCondition(i: number) {
    update({ conditions: redirect.conditions.filter((_, idx) => idx !== i) });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Redirecionamento após aprovação
        </CardTitle>
        <CardDescription>
          Redireciona o lead para URLs específicas com base nas respostas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs">URL padrão (fallback)</Label>
          <Input
            className="mt-1"
            placeholder="https://..."
            value={redirect.defaultRedirect ?? ''}
            onChange={e => update({ defaultRedirect: e.target.value })}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Suporta placeholders:{' '}
            <code className="bg-muted rounded px-1">{'{email}'}</code>,{' '}
            <code className="bg-muted rounded px-1">{'{phone}'}</code>
          </p>
        </div>

        <Separator />

        <div>
          <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
            Condições de redirecionamento
          </p>
          <div className="space-y-2">
            {redirect.conditions.map((cond, i) => (
              <div
                key={i}
                className="bg-muted/40 grid grid-cols-[1fr_130px_1fr] items-center gap-2 rounded-md p-2 lg:grid-cols-[1fr_130px_1fr_1fr_auto]"
              >
                <Input
                  placeholder="Campo (fieldName)"
                  className="h-8 text-xs"
                  value={cond.fieldName ?? ''}
                  onChange={e =>
                    updateCondition(i, { fieldName: e.target.value })
                  }
                />
                <Select
                  value={cond.operator ?? 'equals'}
                  onValueChange={v =>
                    updateCondition(i, {
                      operator: v as RedirectCondition['operator'],
                    })
                  }
                >
                  <SelectTrigger size="sm" className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REDIRECT_OPERATORS.map(({ value, label }) => (
                      <SelectItem key={value} value={value} className="text-xs">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Valor esperado"
                  className="h-8 text-xs"
                  value={String(cond.value ?? '')}
                  onChange={e => updateCondition(i, { value: e.target.value })}
                />
                <Input
                  placeholder="URL de destino"
                  className="col-span-3 h-8 text-xs lg:col-auto"
                  value={cond.redirectUrl}
                  onChange={e =>
                    updateCondition(i, { redirectUrl: e.target.value })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive h-8 w-8"
                  onClick={() => removeCondition(i)}
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            {redirect.conditions.length === 0 && (
              <p className="text-muted-foreground py-2 text-center text-xs">
                Nenhuma condição configurada.
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 h-7 text-xs"
            onClick={addCondition}
          >
            <PlusIcon className="mr-1 h-3 w-3" />
            Adicionar condição
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export function FormSettingsPanel({ value, onChange }: FormSettingsPanelProps) {
  const current = value ?? {};

  return (
    <div className="space-y-6">
      <AnamnesisSection value={current} onChange={onChange} />
      <RedirectSection value={current} onChange={onChange} />
    </div>
  );
}
