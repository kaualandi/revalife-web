'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, ShieldCheck } from 'lucide-react';

import { authClient } from '@/lib/api-admin';
import {
  twoFactorSchema,
  type TwoFactorFormValues,
} from '@/schemas/admin-auth.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TwoFactorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export function TwoFactorDialog({
  open,
  onOpenChange,
  onVerified,
}: TwoFactorDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TwoFactorFormValues>({ resolver: zodResolver(twoFactorSchema) });

  const onSubmit = async (values: TwoFactorFormValues) => {
    const { error } = await authClient.twoFactor.verifyTotp({
      code: values.code,
    });

    if (error) {
      toast.error(error.message || 'Código inválido');
      return;
    }

    reset();
    onVerified();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={v => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="text-primary h-5 w-5" />
            Verificação em dois fatores
          </DialogTitle>
          <DialogDescription>
            Insira o código de 6 dígitos do seu aplicativo autenticador.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="totp-code">Código TOTP</Label>
            <Input
              id="totp-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="text-center font-mono text-xl tracking-widest"
              autoComplete="one-time-code"
              {...register('code')}
            />
            {errors.code && (
              <p className="text-destructive text-xs">{errors.code.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-4 w-4" />
            )}
            Verificar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
