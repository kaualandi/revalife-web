'use client';

import { ErrorMessage } from '@/components/ui/error-message';

export default function Home() {
  return (
    <ErrorMessage
      title="Formulário não encontrado"
      message="Para acessar o formulário, você precisa usar um link específico. Por favor, verifique o link que você recebeu ou entre em contato com o suporte."
    />
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
    <div className="flex min-h-dvh flex-col px-4 py-8">
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
