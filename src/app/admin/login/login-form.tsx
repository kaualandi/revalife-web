'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

import { GoogleIcon } from '@/components/ui/icons';

import { authClient } from '@/lib/api-admin';
import {
  loginSchema,
  magicLinkSchema,
  passwordResetRequestSchema,
  type LoginFormValues,
  type MagicLinkFormValues,
  type PasswordResetRequestValues,
} from '@/schemas/admin-auth.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TwoFactorDialog } from './two-factor-dialog';

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  // ── OAuth error handling (search param) ────────────────────
  const errorHandled = useRef(false);
  useEffect(() => {
    if (errorHandled.current) return;
    const error = searchParams.get('error');
    if (!error) return;

    errorHandled.current = true;

    const messages: Record<string, string> = {
      signup_disabled:
        'Cadastro desativado. Entre em contato com o administrador.',
      unable_to_create_user:
        'Não foi possível criar o usuário. Entre em contato com o administrador.',
      user_not_found: 'Usuário não encontrado.',
      access_denied: 'Acesso negado.',
    };

    toast.error(messages[error] ?? 'Erro ao realizar login. Tente novamente.');
  }, [searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // ── Email / Password form ─────────────────────────────────────
  const {
    register: regLogin,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors, isSubmitting: isLoginLoading },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onLogin = async (values: LoginFormValues) => {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      if (error.status === 403 || error.code === 'TWO_FACTOR_REQUIRED') {
        setTwoFactorOpen(true);
        return;
      }
      toast.error(error.message || 'Credenciais inválidas');
      return;
    }

    toast.success('Bem-vindo!');
    router.push(callbackUrl);
  };

  // ── Magic Link form ───────────────────────────────────────────
  const {
    register: regMagic,
    handleSubmit: handleMagic,
    formState: { errors: magicErrors, isSubmitting: isMagicLoading },
  } = useForm<MagicLinkFormValues>({ resolver: zodResolver(magicLinkSchema) });

  const onMagicLink = async (values: MagicLinkFormValues) => {
    const { error } = await authClient.signIn.magicLink({
      email: values.email,
      callbackURL: `${window.location.origin}${callbackUrl}`,
    });

    if (error) {
      toast.error(error.message || 'Erro ao enviar magic link');
      return;
    }

    setMagicLinkSent(true);
  };

  // ── Google OAuth ──────────────────────────────────────────────
  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}${callbackUrl}`,
    });
  };

  // ── Forgot Password form ──────────────────────────────────────
  const {
    register: regForgot,
    handleSubmit: handleForgot,
    formState: { errors: forgotErrors, isSubmitting: isForgotLoading },
  } = useForm<PasswordResetRequestValues>({
    resolver: zodResolver(passwordResetRequestSchema),
  });

  const onForgotPassword = async (values: PasswordResetRequestValues) => {
    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: `${window.location.origin}/admin/login/reset-password`,
    });

    if (error) {
      toast.error(error.message || 'Erro ao solicitar redefinição');
      return;
    }

    setForgotSent(true);
  };

  return (
    <>
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="mb-6 grid grid-cols-2">
          <TabsTrigger value="email">Email e Senha</TabsTrigger>
          <TabsTrigger value="magic">Magic Link</TabsTrigger>
        </TabsList>

        {/* ── Email / Password ── */}
        <TabsContent value="email">
          <form onSubmit={handleLogin(onLogin)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  className="pl-9"
                  autoComplete="email"
                  {...regLogin('email')}
                />
              </div>
              {loginErrors.email && (
                <p className="text-destructive text-xs">
                  {loginErrors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pr-9 pl-9"
                  autoComplete="current-password"
                  {...regLogin('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {loginErrors.password && (
                <p className="text-destructive text-xs">
                  {loginErrors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-muted-foreground hover:text-primary text-xs transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={isLoginLoading}>
              {isLoginLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Entrar
            </Button>
          </form>
        </TabsContent>

        {/* ── Magic Link ── */}
        <TabsContent value="magic">
          {magicLinkSent ? (
            <div className="space-y-2 py-6 text-center">
              <div className="mb-3 text-4xl">📬</div>
              <p className="font-medium">Verifique seu email</p>
              <p className="text-muted-foreground text-sm">
                Enviamos um link de acesso para o seu email. Ele expira em 15
                minutos.
              </p>
              <button
                type="button"
                onClick={() => setMagicLinkSent(false)}
                className="text-muted-foreground hover:text-primary mx-auto mt-2 block text-xs transition-colors"
              >
                Enviar novamente
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagic(onMagicLink)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="magic-email">Email</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="magic-email"
                    type="email"
                    placeholder="admin@exemplo.com"
                    className="pl-9"
                    autoComplete="email"
                    {...regMagic('email')}
                  />
                </div>
                {magicErrors.email && (
                  <p className="text-destructive text-xs">
                    {magicErrors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isMagicLoading}
              >
                {isMagicLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Enviar Magic Link
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Divider + Google ── */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="border-border w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card text-muted-foreground px-2">
              ou continue com
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="mt-4 w-full"
          type="button"
          onClick={handleGoogle}
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>

      {/* ── Forgot Password Dialog ── */}
      <Dialog
        open={forgotOpen}
        onOpenChange={v => {
          setForgotOpen(v);
          if (!v) setForgotSent(false);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Redefinir senha</DialogTitle>
            <DialogDescription>
              {forgotSent
                ? 'Verifique seu email para continuar a redefinição.'
                : 'Informe o email da sua conta.'}
            </DialogDescription>
          </DialogHeader>

          {!forgotSent ? (
            <form
              onSubmit={handleForgot(onForgotPassword)}
              className="mt-2 space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  {...regForgot('email')}
                />
                {forgotErrors.email && (
                  <p className="text-destructive text-xs">
                    {forgotErrors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isForgotLoading}
              >
                {isForgotLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Enviar link de redefinição
              </Button>
            </form>
          ) : (
            <div className="space-y-1 py-4 text-center">
              <div className="mb-2 text-3xl">📧</div>
              <p className="text-muted-foreground text-sm">
                Se o email estiver cadastrado, você receberá as instruções em
                breve.
              </p>
              <Button
                variant="ghost"
                className="mt-2"
                onClick={() => {
                  setForgotOpen(false);
                  setForgotSent(false);
                }}
              >
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── 2FA Dialog ── */}
      <TwoFactorDialog
        open={twoFactorOpen}
        onOpenChange={setTwoFactorOpen}
        onVerified={() => {
          setTwoFactorOpen(false);
          window.location.href = callbackUrl;
        }}
      />
    </>
  );
}
