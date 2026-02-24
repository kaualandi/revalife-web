'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';

export function FormFinalMessage() {
  const { formMetadata } = useTreatmentFormStore();

  const primaryColor = formMetadata?.primaryColor || '#000000';
  const secondaryColor = formMetadata?.secondaryColor || '#000000';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-dvh flex-col items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-2xl space-y-8">
        {/* Ícone de sucesso */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle2
            className="h-20 w-20"
            style={{ color: secondaryColor }}
          />
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold tracking-tight"
          style={{ color: primaryColor }}
        >
          Agora é com a gente!
        </motion.h1>

        {/* Conteúdo principal */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <p className="text-muted-foreground">
            Recebemos seus dados e nossa equipe médica já está avaliando
            cuidadosamente o seu perfil.
          </p>

          <p className="font-bold" style={{ color: secondaryColor }}>
            Em breve, entraremos em contato para informar se o seu tratamento
            foi aprovado, precisa de ajustes ou não se enquadra nos critérios
            clínicos da {formMetadata?.name || 'Revalife+'}.
          </p>

          <p className="text-muted-foreground text-base">
            <span className="font-bold" style={{ color: primaryColor }}>
              Agradecemos pela confiança em compartilhar suas informações
            </span>
            , cada detalhe é analisado com responsabilidade, seguindo protocolos
            médicos e regulatórios.
          </p>
        </motion.div>

        {/* Aviso importante */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-950"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-500" />
            <p className="text-left text-sm leading-relaxed text-yellow-800 dark:text-yellow-200">
              Enquanto isso, fique tranquilo: estamos cuidando de tudo para
              garantir a sua segurança e oferecer a melhor experiência possível.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
