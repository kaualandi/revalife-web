import { z } from 'zod';


export const loginSchema = z.object({
  email: z.string().min(1, 'Email obrigatório').email('Email inválido'),
  password: z.string().min(5, 'Senha deve ter ao menos 6 caracteres'),
});

export const magicLinkSchema = z.object({
  email: z.string().min(1, 'Email obrigatório').email('Email inválido'),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().min(1, 'Email obrigatório').email('Email inválido'),
});

export const passwordResetConfirmSchema = z
  .object({
    password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a senha'),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, 'Código deve ter 6 dígitos')
    .regex(/^\d{6}$/, 'Apenas números'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;
export type PasswordResetRequestValues = z.infer<
  typeof passwordResetRequestSchema
>;
export type PasswordResetConfirmValues = z.infer<
  typeof passwordResetConfirmSchema
>;
export type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;
