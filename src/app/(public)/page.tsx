'use client';

import { Button } from '@/components/ui/button';
import { useFormSession } from '@/hooks/use-form-session';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const { hasExistingSession, isLoading, loadSession, createSession } =
    useFormSession();
  const { currentStepIndex, sessionId } = useTreatmentFormStore();

  // Ao clicar em continuar
  const handleContinue = async () => {
    if (!sessionId) {
      // Cria nova sessão
      await createSession();
    }
    // Redireciona para o formulário
    router.push('/treatment-approach');
  };

  // Carrega sessão existente automaticamente
  useEffect(() => {
    // const loadExistingSession = async () => {
    //   if (hasExistingSession && sessionId) {
    //     await loadSession(sessionId);

    //     // Se já tem progresso, redireciona automaticamente
    //     if (currentStepIndex > 0) {
    //       router.push('/treatment-approach');
    //     }
    //   }
    // };

    // loadExistingSession();
    handleContinue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executa apenas uma vez ao montar

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
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading
            ? hasExistingSession
              ? 'Recuperando preenchimento...'
              : 'Carregando...'
            : 'Continuar'}
        </Button>

        <p className="text-muted-foreground text-xxs mt-2 leading-none font-thin">
          Ao clicar em “Continuar”, você declara estar de acordo com os Termos
          de uso, aceita o Consentimento para Telessaúde e confirma que leu e
          compreendeu a Política de Privacidade.
        </p>
      </footer>
    </div>
  );
}
