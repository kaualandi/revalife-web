'use client';

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type {
  FormStep,
  QuestionCondition,
  QuestionConditionGroup,
} from '@/types/form.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const stepSchema = z.object({
  id: z
    .string()
    .min(1, 'ID obrigatório')
    .regex(/^[a-z0-9-]+$/, 'Apenas minúsculas, números e hífens'),
  title: z.string().optional(),
  description: z.string().optional(),
  showWhen: z.custom<QuestionCondition | QuestionConditionGroup>().optional(),
});

type StepFormValues = z.infer<typeof stepSchema>;

interface StepDialogProps {
  step: FormStep | null;
  isNew: boolean;
  open: boolean;
  onClose: () => void;
  onSave: (s: FormStep) => void;
  allQuestionIds: string[];
}

export function StepSheet({
  step,
  isNew,
  open,
  onClose,
  onSave,
  allQuestionIds,
}: StepDialogProps) {
  const form = useForm<StepFormValues>({
    resolver: zodResolver(stepSchema),
    defaultValues: { id: '', title: '', description: '', showWhen: undefined },
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      step
        ? {
            id: step.id,
            title: step.title ?? '',
            description: step.description ?? '',
            showWhen: step.showWhen,
          }
        : { id: '', title: '', description: '', showWhen: undefined }
    );
  }, [open, step]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(values: StepFormValues) {
    const s: FormStep = {
      id: values.id,
      ...(values.title && { title: values.title }),
      ...(values.description && { description: values.description }),
      questions: step?.questions ?? [],
      ...(values.showWhen && { showWhen: values.showWhen }),
    };
    onSave(s);
    onClose();
  }

  const showWhenValue = useWatch({ control: form.control, name: 'showWhen' });

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <DialogHeader className="border-b p-6 pb-4">
              <DialogTitle>
                {isNew ? 'Novo step' : `Editando step: ${step?.id}`}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="meu-step"
                        className="font-mono"
                        disabled={!isNew}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Identificador único, apenas minúsculas e hífens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Qual o seu objetivo?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Texto auxiliar exibido abaixo do título..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h4 className="text-sm font-semibold">Exibição condicional</h4>
                <Separator className="mt-2 mb-3" />
                <ShowWhenEditor
                  value={showWhenValue}
                  onChange={v => form.setValue('showWhen', v)}
                  allQuestionIds={allQuestionIds}
                />
              </div>
            </div>

            <DialogFooter className="border-t p-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar step</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
