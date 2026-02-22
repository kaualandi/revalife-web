'use client';

import { QuestionOptionsEditor } from '@/components/admin/forms/question-options-editor';
import { ShowWhenEditor } from '@/components/admin/forms/show-when-editor';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type {
  Question,
  QuestionCondition,
  QuestionConditionGroup,
  QuestionOption,
  QuestionType,
  QuestionValidation,
} from '@/types/form.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'email', label: 'E-mail' },
  { value: 'tel', label: 'Telefone' },
  { value: 'cpf', label: 'CPF' },
  { value: 'number', label: 'Número' },
  { value: 'integer', label: 'Inteiro' },
  { value: 'textarea', label: 'Área de texto' },
  { value: 'date', label: 'Data' },
  { value: 'radio', label: 'Múltipla escolha' },
  { value: 'radio-image', label: 'Múltipla escolha c/ imagem' },
  { value: 'checkbox', label: 'Caixas de seleção' },
  { value: 'consent', label: 'Consentimento' },
  { value: 'breather', label: 'Tela de respiro' },
];

const OPTION_TYPES: QuestionType[] = ['radio', 'radio-image', 'checkbox'];
const GRID_TYPES: QuestionType[] = ['radio', 'radio-image'];
const TEXT_VALIDATION_TYPES: QuestionType[] = [
  'text',
  'email',
  'tel',
  'cpf',
  'textarea',
];
const NUMBER_VALIDATION_TYPES: QuestionType[] = ['number', 'integer'];

// ─────────────────────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────────────────────

const questionSchema = z.object({
  id: z
    .string()
    .min(1, 'ID obrigatório')
    .regex(/^[a-z0-9-]+$/, 'Apenas minúsculas, números e hífens'),
  type: z.enum([
    'text',
    'email',
    'tel',
    'cpf',
    'number',
    'integer',
    'textarea',
    'date',
    'radio',
    'radio-image',
    'checkbox',
    'consent',
    'breather',
  ] as const),
  label: z.string().optional(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  observation: z.string().optional(),
  image: z.string().optional(),
  // Complex fields managed as opaque values
  options: z.custom<QuestionOption[]>().optional(),
  validation: z.custom<QuestionValidation>().optional(),
  grid: z.custom<Question['grid']>().optional(),
  showWhen: z.custom<QuestionCondition | QuestionConditionGroup>().optional(),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Section helpers
// ─────────────────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold">{children}</h4>
      <Separator className="mt-2" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

interface QuestionDialogProps {
  question: Question | null;
  isNew: boolean;
  open: boolean;
  onClose: () => void;
  onSave: (q: Question) => void;
  allQuestionIds: string[];
}

export function QuestionDialog({
  question,
  isNew,
  open,
  onClose,
  onSave,
  allQuestionIds,
}: QuestionDialogProps) {
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      id: '',
      type: 'text',
      label: '',
      description: '',
      placeholder: '',
      required: false,
      observation: '',
      image: '',
      options: [],
      validation: {},
      grid: undefined,
      showWhen: undefined,
    },
  });

  const currentType = useWatch({ control: form.control, name: 'type' });
  const options = useWatch({ control: form.control, name: 'options' }) ?? [];
  const validation =
    useWatch({ control: form.control, name: 'validation' }) ?? {};
  const grid = useWatch({ control: form.control, name: 'grid' });
  const showWhen = useWatch({ control: form.control, name: 'showWhen' });

  // Sync form when question prop changes
  useEffect(() => {
    if (!open) return;
    form.reset(
      question
        ? {
            id: question.id,
            type: question.type,
            label: question.label ?? '',
            description: question.description ?? '',
            placeholder: question.placeholder ?? '',
            required: question.required ?? false,
            observation: question.observation ?? '',
            image: question.image ?? '',
            options: question.options ?? [],
            validation: question.validation ?? {},
            grid: question.grid,
            showWhen: question.showWhen,
          }
        : {
            id: '',
            type: 'text',
            label: '',
            description: '',
            placeholder: '',
            required: false,
            observation: '',
            image: '',
            options: [],
            validation: {},
            grid: undefined,
            showWhen: undefined,
          }
    );
  }, [open, question]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(values: QuestionFormValues) {
    const q: Question = {
      id: values.id,
      type: values.type,
      ...(values.label && { label: values.label }),
      ...(values.description && { description: values.description }),
      ...(values.placeholder && { placeholder: values.placeholder }),
      ...(values.required !== undefined && { required: values.required }),
      ...(values.observation && { observation: values.observation }),
      ...(values.image && { image: values.image }),
      ...(OPTION_TYPES.includes(values.type) &&
        (values.options ?? []).length > 0 && { options: values.options }),
      ...(Object.keys(values.validation ?? {}).length > 0 && {
        validation: values.validation,
      }),
      ...(values.grid && { grid: values.grid }),
      ...(values.showWhen && { showWhen: values.showWhen }),
    };
    onSave(q);
    onClose();
  }

  // Filtered IDs for showWhen (exclude self)
  const otherQuestionIds = allQuestionIds.filter(id => id !== question?.id);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-2xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <DialogHeader className="border-b p-6 pb-4">
              <DialogTitle>
                {isNew ? 'Nova pergunta' : `Editando: ${question?.id}`}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {/* ── Básico ── */}
              <SectionTitle>Básico</SectionTitle>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="nome-do-campo"
                          className="font-mono"
                          disabled={!isNew}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {QUESTION_TYPES.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Label (texto da pergunta)</FormLabel>
                      <FormControl>
                        <Input placeholder="Qual o seu nome?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Texto auxiliar abaixo do label..."
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {currentType !== 'breather' && currentType !== 'consent' && (
                  <FormField
                    control={form.control}
                    name="placeholder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placeholder</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite aqui..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="observation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observação</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Texto de apoio adicional"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {currentType === 'breather' && (
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>URL da imagem</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="required"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Switch
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label>Obrigatório</Label>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* ── Opções ── */}
              {OPTION_TYPES.includes(currentType) && (
                <>
                  <SectionTitle>Opções</SectionTitle>
                  <QuestionOptionsEditor
                    value={options}
                    onChange={v => form.setValue('options', v)}
                    showImageField={currentType === 'radio-image'}
                  />
                </>
              )}

              {/* ── Validação ── */}
              {(TEXT_VALIDATION_TYPES.includes(currentType) ||
                NUMBER_VALIDATION_TYPES.includes(currentType) ||
                currentType === 'date' ||
                currentType === 'checkbox') && (
                <>
                  <SectionTitle>Validação</SectionTitle>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {TEXT_VALIDATION_TYPES.includes(currentType) && (
                      <>
                        <div>
                          <Label className="text-xs">
                            Mínimo de caracteres
                          </Label>
                          <Input
                            type="number"
                            className="mt-1 h-8 text-xs"
                            value={validation.minLength ?? ''}
                            onChange={e =>
                              form.setValue('validation', {
                                ...validation,
                                minLength: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">
                            Máximo de caracteres
                          </Label>
                          <Input
                            type="number"
                            className="mt-1 h-8 text-xs"
                            value={validation.maxLength ?? ''}
                            onChange={e =>
                              form.setValue('validation', {
                                ...validation,
                                maxLength: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <Label className="text-xs">Regex (pattern)</Label>
                          <Input
                            className="mt-1 h-8 font-mono text-xs"
                            placeholder="^\d+$"
                            value={validation.pattern ?? ''}
                            onChange={e =>
                              form.setValue('validation', {
                                ...validation,
                                pattern: e.target.value || undefined,
                              })
                            }
                          />
                        </div>
                      </>
                    )}

                    {NUMBER_VALIDATION_TYPES.includes(currentType) && (
                      <>
                        <div>
                          <Label className="text-xs">Valor mínimo</Label>
                          <Input
                            type="number"
                            className="mt-1 h-8 text-xs"
                            value={validation.min ?? ''}
                            onChange={e =>
                              form.setValue('validation', {
                                ...validation,
                                min: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Valor máximo</Label>
                          <Input
                            type="number"
                            className="mt-1 h-8 text-xs"
                            value={validation.max ?? ''}
                            onChange={e =>
                              form.setValue('validation', {
                                ...validation,
                                max: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                          />
                        </div>
                      </>
                    )}

                    {currentType === 'date' && (
                      <>
                        <div>
                          <Label className="text-xs">Data mínima</Label>
                          <Input
                            type="date"
                            className="mt-1 h-8 text-xs"
                            value={validation.minDate ?? ''}
                            onChange={e =>
                              form.setValue('validation', {
                                ...validation,
                                minDate: e.target.value || undefined,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Data máxima</Label>
                          <Input
                            type="date"
                            className="mt-1 h-8 text-xs"
                            value={validation.maxDate ?? ''}
                            onChange={e =>
                              form.setValue('validation', {
                                ...validation,
                                maxDate: e.target.value || undefined,
                              })
                            }
                          />
                        </div>
                      </>
                    )}

                    {currentType === 'checkbox' && (
                      <>
                        <div>
                          <Label className="text-xs">Mín. selecionados</Label>
                          <Input
                            type="number"
                            className="mt-1 h-8 text-xs"
                            value={validation.minSelected ?? ''}
                            onChange={e =>
                              form.setValue('validation', {
                                ...validation,
                                minSelected: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Máx. selecionados</Label>
                          <Input
                            type="number"
                            className="mt-1 h-8 text-xs"
                            value={validation.maxSelected ?? ''}
                            onChange={e =>
                              form.setValue('validation', {
                                ...validation,
                                maxSelected: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                          />
                        </div>
                      </>
                    )}

                    <div className="col-span-full">
                      <Label className="text-xs">
                        Mensagem de erro personalizada
                      </Label>
                      <Input
                        className="mt-1 h-8 text-xs"
                        placeholder="Campo inválido"
                        value={validation.message ?? ''}
                        onChange={e =>
                          form.setValue('validation', {
                            ...validation,
                            message: e.target.value || undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ── Grid ── */}
              {GRID_TYPES.includes(currentType) && (
                <>
                  <SectionTitle>Grid de opções</SectionTitle>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Colunas</Label>
                      <Input
                        type="number"
                        className="mt-1 h-8 text-xs"
                        placeholder="2"
                        value={grid?.cols ?? ''}
                        onChange={e =>
                          form.setValue('grid', {
                            ...grid,
                            cols: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </div>
                    {currentType === 'radio-image' && (
                      <div>
                        <Label className="text-xs">Tamanho da imagem</Label>
                        <Select
                          value={grid?.imageSize ?? ''}
                          onValueChange={v =>
                            form.setValue('grid', {
                              ...grid,
                              imageSize: v as 'sm' | 'md' | 'lg',
                            })
                          }
                        >
                          <SelectTrigger size="sm" className="mt-1 text-xs">
                            <SelectValue placeholder="Padrão" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sm" className="text-xs">
                              Pequena
                            </SelectItem>
                            <SelectItem value="md" className="text-xs">
                              Média
                            </SelectItem>
                            <SelectItem value="lg" className="text-xs">
                              Grande
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── showWhen ── */}
              <SectionTitle>Exibição condicional</SectionTitle>
              <ShowWhenEditor
                value={showWhen}
                onChange={v => form.setValue('showWhen', v)}
                allQuestionIds={otherQuestionIds}
              />
            </div>

            <DialogFooter className="border-t p-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar pergunta</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
