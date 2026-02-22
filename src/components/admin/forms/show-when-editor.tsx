'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type {
  QuestionCondition,
  QuestionConditionGroup,
} from '@/types/form.types';
import { PlusIcon, TrashIcon } from 'lucide-react';

const OPERATORS = [
  { value: 'equals', label: 'Igual a' },
  { value: 'notEquals', label: 'Não igual a' },
  { value: 'contains', label: 'Contém' },
  { value: 'notContains', label: 'Não contém' },
] as const;

type Operator = QuestionCondition['operator'];

function isGroup(
  v: QuestionCondition | QuestionConditionGroup
): v is QuestionConditionGroup {
  return 'all' in v || 'any' in v;
}

function emptyCondition(): QuestionCondition {
  return { questionId: '', operator: 'equals', value: '' };
}

// ─────────────────────────────────────────────────────────────────────────────
// Single condition row
// ─────────────────────────────────────────────────────────────────────────────

function ConditionRow({
  cond,
  allQuestionIds,
  onChange,
  onRemove,
}: {
  cond: QuestionCondition;
  allQuestionIds: string[];
  onChange: (c: QuestionCondition) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="bg-muted/40 grid grid-cols-[1fr_120px_1fr_auto] items-center gap-2 rounded-md p-2">
      <Select
        value={cond.questionId}
        onValueChange={v => onChange({ ...cond, questionId: v })}
      >
        <SelectTrigger size="sm" className="h-8 w-full text-xs">
          <SelectValue placeholder="ID da pergunta" />
        </SelectTrigger>
        <SelectContent>
          {allQuestionIds.length === 0 && (
            <SelectItem value="__none" disabled className="text-xs">
              Nenhuma pergunta disponível
            </SelectItem>
          )}
          {allQuestionIds.map(id => (
            <SelectItem key={id} value={id} className="font-mono text-xs">
              {id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={cond.operator}
        onValueChange={v => onChange({ ...cond, operator: v as Operator })}
      >
        <SelectTrigger size="sm" className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPERATORS.map(({ value, label }) => (
            <SelectItem key={value} value={value} className="text-xs">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        className="h-8 text-xs"
        placeholder="Valor esperado"
        value={cond.value}
        onChange={e => onChange({ ...cond, value: e.target.value })}
      />

      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive h-8 w-8"
          onClick={onRemove}
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

interface ShowWhenEditorProps {
  value: QuestionCondition | QuestionConditionGroup | undefined;
  onChange: (v: QuestionCondition | QuestionConditionGroup | undefined) => void;
  allQuestionIds: string[];
}

export function ShowWhenEditor({
  value,
  onChange,
  allQuestionIds,
}: ShowWhenEditorProps) {
  const hasCondition = value !== undefined;
  const groupMode = value !== undefined && isGroup(value);

  // Determine current conditions list for group mode
  const groupLogic: 'all' | 'any' =
    value && isGroup(value) && value.any ? 'any' : 'all';
  const groupConditions: QuestionCondition[] =
    value && isGroup(value) ? (value.all ?? value.any ?? []) : [];

  // Toggle condition on/off
  function toggleEnabled(enabled: boolean) {
    if (!enabled) {
      onChange(undefined);
    } else {
      onChange(emptyCondition());
    }
  }

  // Toggle simple ↔ group mode
  function toggleGroupMode(toGroup: boolean) {
    if (toGroup) {
      const existing = value && !isGroup(value) ? value : emptyCondition();
      onChange({ all: [existing] });
    } else {
      const first = groupConditions[0] ?? emptyCondition();
      onChange(first);
    }
  }

  // Update simple condition
  function updateSimple(c: QuestionCondition) {
    onChange(c);
  }

  // Update group
  function updateGroup(logic: 'all' | 'any', conditions: QuestionCondition[]) {
    if (logic === 'all') onChange({ all: conditions });
    else onChange({ any: conditions });
  }

  function updateGroupCondition(i: number, c: QuestionCondition) {
    const next = groupConditions.map((x, idx) => (idx === i ? c : x));
    updateGroup(groupLogic, next);
  }

  function addGroupCondition() {
    updateGroup(groupLogic, [...groupConditions, emptyCondition()]);
  }

  function removeGroupCondition(i: number) {
    updateGroup(
      groupLogic,
      groupConditions.filter((_, idx) => idx !== i)
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Switch checked={hasCondition} onCheckedChange={toggleEnabled} />
        <Label className="text-sm">Exibir condicionalmente</Label>
      </div>

      {hasCondition && (
        <>
          <div className="flex items-center gap-3">
            <Switch checked={groupMode} onCheckedChange={toggleGroupMode} />
            <Label className="text-muted-foreground text-sm">
              Modo grupo (múltiplas condições)
            </Label>
          </div>

          {!groupMode && !isGroup(value) && (
            <ConditionRow
              cond={value as QuestionCondition}
              allQuestionIds={allQuestionIds}
              onChange={updateSimple}
            />
          )}

          {groupMode && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Lógica:</span>
                <Select
                  value={groupLogic}
                  onValueChange={v =>
                    updateGroup(v as 'all' | 'any', groupConditions)
                  }
                >
                  <SelectTrigger size="sm" className="h-7 w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">
                      Todas (AND)
                    </SelectItem>
                    <SelectItem value="any" className="text-xs">
                      Qualquer (OR)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {groupConditions.map((cond, i) => (
                <ConditionRow
                  key={i}
                  cond={cond}
                  allQuestionIds={allQuestionIds}
                  onChange={c => updateGroupCondition(i, c)}
                  onRemove={() => removeGroupCondition(i)}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={addGroupCondition}
              >
                <PlusIcon className="mr-1 h-3 w-3" />
                Adicionar condição
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
