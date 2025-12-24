'use client';

import { useStartSession } from '@/hooks/use-session-queries';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Home() {
  const router = useRouter();
  const startSession = useStartSession();
  const { sessionId, hasHydrated } = useTreatmentFormStore();
  const hasAttemptedStart = useRef(false);

  // Criar sessão automaticamente ao montar o componente
  useEffect(() => {
    // Aguardar hidratação do Zustand
    if (!hasHydrated) return;

    // Preservar query params (UTM's) no redirecionamento
    const queryString =
      typeof window !== 'undefined' ? window.location.search : '';
    const targetUrl = `/treatment-approach${queryString}`;

    // Se já tem sessão, redirecionar direto
    if (sessionId) {
      router.push(targetUrl);
      return;
    }

    // Criar nova sessão apenas uma vez
    if (!hasAttemptedStart.current && !startSession.isPending) {
      hasAttemptedStart.current = true;
      startSession.mutate(undefined, {
        onSuccess: () => {
          router.push(targetUrl);
        },
      });
    }
  }, [sessionId, hasHydrated, startSession, router]);

  // Mostrar loading ou erro
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {startSession.isError ? (
          <>
            <p className="text-destructive mb-2 text-lg font-medium">
              Erro ao iniciar formulário
            </p>
            <p className="text-muted-foreground mb-4 text-sm">
              Não foi possível conectar ao servidor. Tente novamente.
            </p>
            <button
              onClick={() => startSession.reset()}
              className="text-primary hover:underline"
            >
              Tentar novamente
            </button>
          </>
        ) : (
          <p className="text-muted-foreground text-lg">
            Iniciando formulário...
          </p>
        )}
      </div>
    </div>
  );
}

/* 
==============================================
TELA DE BEM-VINDO (CÓDIGO ORIGINAL SALVO)
==============================================

Para reativar a tela de boas-vindas, substitua o componente Home acima por este código 
e adicione os imports necessários (Button e Image):

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const startSession = useStartSession();
  const { sessionId } = useTreatmentFormStore();

  const handleStart = () => {
    startSession.mutate(undefined, {
      onSuccess: () => {
        router.push('/treatment-approach');
      },
    });
  };

  useEffect(() => {
    if (sessionId) {
      router.push('/treatment-approach');
    }
  }, [sessionId, router]);

  return (
    <div className="flex min-h-screen flex-col px-4 py-8">
      <header className="mb-20">
        <Image
          src="/images/logo.svg"
          alt="Revolife Plus"
          width={200}
          height={50}
          className="mx-auto"
        />

        <h1 className="text-primary mt-20 text-6xl">
          Bem vindo <br />
          Revalife+
        </h1>
      </header>

      <main className="mb-8">
        <p className="text-2xl leading-none font-thin">
          Agora, você informará ao médico seus dados de saúde, histórico clínico
          e hábitos.
        </p>
        <p className="mt-3 text-2xl leading-none font-thin">
          Essas informações serão analisadas com atenção para entender seus
          sintomas e, se for apropriado, indicar o melhor tratamento.
        </p>

        <p className="border-foreground text-muted-foreground mt-16 border-l pl-3 text-base leading-none font-thin">
          *Em alguns casos, o médico pode identificar riscos ou interações
          medicamentosas que exigem avaliação presencial. Nosso compromisso é
          com sua segurança e cuidado responsável.
        </p>
      </main>

      <footer className="mt-auto text-center">
        <Button
          size="lg"
          className="w-full"
          onClick={handleStart}
          disabled={startSession.isPending}
        >
          {startSession.isPending ? 'Iniciando...' : 'Continuar'}
        </Button>

        <p className="text-muted-foreground text-xxs mt-2 leading-none font-thin">
          Ao clicar em "Continuar", você declara estar de acordo com os Termos
          de uso, aceita o Consentimento para Telessaúde e confirma que leu e
          compreendeu a Política de Privacidade.
        </p>
      </footer>
    </div>
  );
}
*/
