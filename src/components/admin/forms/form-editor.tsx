'use client';

import { FormGeneralTab } from '@/components/admin/forms/form-general-tab';
import { FormSchemaBuilder } from '@/components/admin/forms/form-schema-builder';
import { FormSettingsPanel } from '@/components/admin/forms/form-settings-panel';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateForm, useUpdateForm } from '@/hooks/use-form-queries';
import {
  createFormSchema,
  type CreateFormValues,
} from '@/schemas/admin-form.schema';
import type { AdminFormDetail } from '@/types/admin.types';
import type { FormConfig, FormSettings } from '@/types/form.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, SaveIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Resolver } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormEditorProps {
  defaultValues?: AdminFormDetail;
}

export function FormEditor({ defaultValues }: FormEditorProps) {
  const isEditing = !!defaultValues;
  const router = useRouter();

  const [fieldsSchema, setFieldsSchema] = useState<FormConfig | undefined>(
    defaultValues?.fieldsSchema
  );
  const [settings, setSettings] = useState<FormSettings | undefined>(
    defaultValues?.settings
  );

  const createForm = useCreateForm();
  const updateForm = useUpdateForm(defaultValues?.slug ?? '');

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema) as Resolver<CreateFormValues>,
    defaultValues: defaultValues
      ? {
          slug: defaultValues.slug,
          name: defaultValues.name,
          description: defaultValues.description ?? '',
          primaryColor: defaultValues.primaryColor,
          secondaryColor: defaultValues.secondaryColor,
          logoUrl: defaultValues.logoUrl ?? '',
          faviconUrl: defaultValues.faviconUrl ?? '',
          gtmId: defaultValues.gtmId ?? '',
          kommoIntegrationId: defaultValues.kommoIntegrationId ?? null,
          isActive: defaultValues.isActive,
        }
      : {
          slug: '',
          name: '',
          description: '',
          primaryColor: '#000000',
          secondaryColor: '#ffffff',
          logoUrl: '',
          faviconUrl: '',
          gtmId: '',
          kommoIntegrationId: null,
          isActive: true,
        },
  });

  const isPending = createForm.isPending || updateForm.isPending;

  function onSubmit(values: CreateFormValues) {
    const payload = {
      ...values,
      logoUrl: values.logoUrl || undefined,
      faviconUrl: values.faviconUrl || undefined,
      gtmId: values.gtmId || undefined,
      kommoIntegrationId: values.kommoIntegrationId ?? null,
      fieldsSchema,
      settings,
    };

    if (isEditing) {
      updateForm.mutate(payload, {
        onSuccess: () => {
          toast.success('Formulário atualizado com sucesso!');
        },
        onError: () => {
          toast.error('Erro ao atualizar o formulário.');
        },
      });
    } else {
      createForm.mutate(payload, {
        onSuccess: () => {
          toast.success('Formulário criado com sucesso!');
          router.push('/admin/forms');
        },
        onError: () => {
          toast.error(
            'Erro ao criar o formulário. Verifique se o slug já existe.'
          );
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              asChild
            >
              <Link href="/admin/forms">
                <ArrowLeftIcon className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditing ? defaultValues.name : 'Novo Formulário'}
              </h1>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {isEditing
                  ? `Editando slug: ${defaultValues.slug}`
                  : 'Preencha as informações do novo formulário'}
              </p>
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="shrink-0">
            <SaveIcon className="mr-2 h-4 w-4" />
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="schema">Schema do Formulário</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <FormGeneralTab form={form} />
          </TabsContent>

          <TabsContent value="schema" className="mt-6">
            <FormSchemaBuilder
              value={fieldsSchema}
              onChange={setFieldsSchema}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <FormSettingsPanel value={settings} onChange={setSettings} />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
