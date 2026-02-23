'use client';

import {
  FormControl,
  FormDescription,
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
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useKommoIntegrationsLookup } from '@/hooks/use-form-queries';
import type { CreateFormValues } from '@/schemas/admin-form.schema';
import type { UseFormReturn } from 'react-hook-form';

interface FormGeneralTabProps {
  form: UseFormReturn<CreateFormValues, unknown, CreateFormValues>;
}

export function FormGeneralTab({ form }: FormGeneralTabProps) {
  const { data: kommoOptions, isLoading: kommoLoading } =
    useKommoIntegrationsLookup();

  return (
    <div className="space-y-6">
      {/* Identidade */}
      <div>
        <h3 className="text-sm font-semibold">Identidade</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Nome, slug e descrição do formulário
        </p>
        <Separator className="mt-3" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input placeholder="Revalife — Anamnese" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Slug *</FormLabel>
              <FormControl>
                <Input
                  placeholder="REVALIFE"
                  className="font-mono"
                  {...field}
                  onChange={e => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormDescription>
                Identificador único em maiúsculas. Será usado na URL pública:{' '}
                <code className="bg-muted rounded px-1 text-xs">
                  /{field.value || 'SLUG'}
                </code>
              </FormDescription>
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
                  placeholder="Descreva brevemente o propósito deste formulário..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Aparência */}
      <div>
        <h3 className="text-sm font-semibold">Aparência</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Cores, logo e favicon
        </p>
        <Separator className="mt-3" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="primaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor Primária</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    className="h-9 w-10 cursor-pointer rounded border p-0.5"
                  />
                  <Input
                    placeholder="#000000"
                    className="font-mono"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor Secundária</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    className="h-9 w-10 cursor-pointer rounded border p-0.5"
                  />
                  <Input
                    placeholder="#ffffff"
                    className="font-mono"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Logo</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="faviconUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Favicon</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Integrações */}
      <div>
        <h3 className="text-sm font-semibold">Integrações</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">GTM e Kommo CRM</p>
        <Separator className="mt-3" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="gtmId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Tag Manager ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="GTM-XXXXXXX"
                  className="font-mono"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kommoIntegrationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Integração Kommo</FormLabel>
              <FormControl>
                {kommoLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Select
                    value={
                      field.value != null ? String(field.value) : '__none__'
                    }
                    onValueChange={v =>
                      field.onChange(v === '__none__' ? null : Number(v))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma integração" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Nenhuma</SelectItem>
                      {(kommoOptions ?? []).map(opt => (
                        <SelectItem key={opt.id} value={String(opt.id)}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Status */}
      <div>
        <h3 className="text-sm font-semibold">Status</h3>
        <Separator className="mt-3" />
      </div>

      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-3">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div>
                <Label>Formulário ativo</Label>
                <p className="text-muted-foreground text-xs">
                  Quando inativo, o formulário não ficará acessível
                  publicamente.
                </p>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
