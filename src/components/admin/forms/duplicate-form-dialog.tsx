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
import { useDuplicateForm } from '@/hooks/use-form-queries';
import {
  duplicateFormSchema,
  type DuplicateFormValues,
} from '@/schemas/admin-form.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface DuplicateFormDialogProps {
  slug: string;
  open: boolean;
  onClose: () => void;
}

export function DuplicateFormDialog({
  slug,
  open,
  onClose,
}: DuplicateFormDialogProps) {
  const router = useRouter();
  const { mutate, isPending } = useDuplicateForm();

  const form = useForm<DuplicateFormValues>({
    resolver: zodResolver(duplicateFormSchema),
    defaultValues: {
      newSlug: '',
      newName: '',
    },
  });

  function handleClose() {
    form.reset();
    onClose();
  }

  function onSubmit(values: DuplicateFormValues) {
    mutate(
      {
        slug,
        data: {
          newSlug: values.newSlug,
          newName: values.newName || undefined,
        },
      },
      {
        onSuccess: newForm => {
          toast.success(`Formulário duplicado com sucesso!`);
          handleClose();
          router.push(`/admin/forms/${newForm.slug}`);
        },
        onError: () => {
          toast.error(
            'Erro ao duplicar o formulário. Verifique se o slug já existe.'
          );
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Duplicar formulário</DialogTitle>
          <DialogDescription>
            Informe os dados para o novo formulário. O slug deve ser único e em
            letras maiúsculas.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Novo Slug *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MINHA-COPIA"
                      {...field}
                      onChange={e =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Apenas maiúsculas, números e hífens (ex: REVALIFE-COPIA)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Revalife — Cópia" {...field} />
                  </FormControl>
                  <FormDescription>
                    Se vazio, será gerado automaticamente.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Duplicando...' : 'Duplicar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
