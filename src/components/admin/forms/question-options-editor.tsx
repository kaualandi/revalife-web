'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { QuestionOption } from '@/types/form.types';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVerticalIcon, PlusIcon, TrashIcon } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Single option row with drag handle
// ─────────────────────────────────────────────────────────────────────────────

function OptionRow({
  option,
  showImageField,
  onChange,
  onRemove,
}: {
  option: QuestionOption;
  showImageField: boolean;
  onChange: (o: QuestionOption) => void;
  onRemove: () => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={option}
      dragListener={false}
      dragControls={controls}
      className="bg-muted/40 flex items-center gap-2 rounded-md p-2"
    >
      <button
        aria-label="Re-ordernar opção"
        type="button"
        className="text-muted-foreground cursor-grab touch-none"
        onPointerDown={e => controls.start(e)}
      >
        <GripVerticalIcon className="h-4 w-4" />
      </button>

      <Input
        className="h-8 text-xs"
        placeholder="value"
        value={option.value}
        onChange={e => onChange({ ...option, value: e.target.value })}
      />
      <Input
        className="h-8 text-xs"
        placeholder="Label visível"
        value={option.label}
        onChange={e => onChange({ ...option, label: e.target.value })}
      />
      {showImageField && (
        <Input
          className="h-8 text-xs"
          placeholder="URL da imagem"
          value={option.image ?? ''}
          onChange={e =>
            onChange({ ...option, image: e.target.value || undefined })
          }
        />
      )}
      <Input
        className="h-8 text-xs"
        placeholder="Descrição (opcional)"
        value={option.description ?? ''}
        onChange={e =>
          onChange({ ...option, description: e.target.value || undefined })
        }
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive h-8 w-8 shrink-0"
        onClick={onRemove}
      >
        <TrashIcon className="h-3.5 w-3.5" />
      </Button>
    </Reorder.Item>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

interface QuestionOptionsEditorProps {
  value: QuestionOption[];
  onChange: (options: QuestionOption[]) => void;
  showImageField?: boolean;
}

export function QuestionOptionsEditor({
  value,
  onChange,
  showImageField = false,
}: QuestionOptionsEditorProps) {
  function updateOption(i: number, opt: QuestionOption) {
    onChange(value.map((o, idx) => (idx === i ? opt : o)));
  }

  function removeOption(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function addOption() {
    onChange([...value, { value: '', label: '' }]);
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div
          className={`text-muted-foreground mb-1 grid gap-2 px-2 text-xs font-medium ${showImageField ? 'grid-cols-[24px_1fr_1fr_1fr_1fr_32px]' : 'grid-cols-[24px_1fr_1fr_1fr_32px]'}`}
        >
          <span />
          <span>Value</span>
          <span>Label</span>
          {showImageField && <span>Imagem</span>}
          <span>Descrição</span>
          <span />
        </div>
      )}

      <Reorder.Group
        axis="y"
        values={value}
        onReorder={onChange}
        className="space-y-2"
      >
        {value.map((opt, i) => (
          <OptionRow
            key={opt.value || i}
            option={opt}
            showImageField={showImageField}
            onChange={o => updateOption(i, o)}
            onRemove={() => removeOption(i)}
          />
        ))}
      </Reorder.Group>

      {value.length === 0 && (
        <p className="text-muted-foreground py-2 text-center text-xs italic">
          Nenhuma opção. Clique em adicionar.
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-xs"
        onClick={addOption}
      >
        <PlusIcon className="mr-1 h-3 w-3" />
        Adicionar opção
      </Button>
    </div>
  );
}
