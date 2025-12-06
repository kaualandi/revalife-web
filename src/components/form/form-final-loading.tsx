'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FormFinalLoadingProps {
  onComplete: () => void;
}

export function FormFinalLoading({ onComplete }: FormFinalLoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Atualiza o progresso de 0 a 100% em 2 segundos
    const duration = 2000; // 2 segundos
    const intervalTime = 20; // Atualiza a cada 20ms (50x por segundo)
    const increment = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          // Aguarda um pouco depois de chegar a 100% antes de completar
          setTimeout(() => onComplete(), 200);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Título */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold tracking-tight"
        >
          CARREGANDO
        </motion.h1>

        {/* Mensagens */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <p className="text-xl font-semibold text-muted-foreground">
            Estamos prontos para encontrar o plano mais adequado para você.
          </p>

          <p className="text-lg text-muted-foreground">
            Com suas respostas, o médico já consegue direcionar o caminho mais
            seguro, inteligente e realista para seu tratamento.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto w-full max-w-md space-y-2"
        >
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {Math.round(progress)}%
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
