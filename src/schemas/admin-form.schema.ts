import { z } from 'zod';

const slugRegex = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

export const createFormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug obrigatório')
    .regex(
      slugRegex,
      'Apenas letras maiúsculas, números e hífens (ex: MINHA-FORMA)'
    ),
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().optional(),
  primaryColor: z.string().min(1, 'Cor primária obrigatória'),
  secondaryColor: z.string().min(1, 'Cor secundária obrigatória'),
  logoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  faviconUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  gtmId: z.string().optional(),
  kommoIntegrationId: z
    .number({ error: 'Deve ser um número' })
    .int()
    .positive()
    .optional()
    .nullable(),
  isActive: z.boolean(),
});

export const updateFormSchema = createFormSchema.partial();

export const duplicateFormSchema = z.object({
  newSlug: z
    .string()
    .min(1, 'Slug obrigatório')
    .regex(
      slugRegex,
      'Apenas letras maiúsculas, números e hífens (ex: MINHA-COPIA)'
    ),
  newName: z.string().optional(),
});

export type CreateFormValues = z.infer<typeof createFormSchema>;
export type UpdateFormValues = z.infer<typeof updateFormSchema>;
export type DuplicateFormValues = z.infer<typeof duplicateFormSchema>;
