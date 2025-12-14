'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { Question } from '@/types/form.types';
import type { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface ConsentQuestionProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
  onValueChange?: () => void;
}

export function ConsentQuestion({
  question,
  form,
  onValueChange,
}: ConsentQuestionProps) {
  const handleValueChange = (value: string) => {
    form.setValue(question.id, value);
    onValueChange?.();
  };

  return (
    <FormField
      control={form.control}
      name={question.id}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormControl>
            <RadioGroup
              onValueChange={handleValueChange}
              value={field.value as string}
              className="flex flex-col space-y-3"
            >
              <div
                className={cn(
                  'border-input hover:bg-primary/5 flex items-center space-x-3 rounded border p-4 transition-colors',
                  field.value === 'accepted' &&
                    'border-primary bg-primary hover:bg-primary/90 text-white'
                )}
              >
                <RadioGroupItem value="accepted" id="consent-accepted" />
                <Label
                  htmlFor="consent-accepted"
                  className="cursor-pointer text-xs leading-none"
                >
                  Eu concordo que li e aceito os Termos de Uso, os Termos de
                  Consulta Médica, o Termo de Consentimento Livre, o documento
                  de Uso e Divulgação de Informações Médicas, a Política de
                  Privacidade e a Política de Reembolso, e que tenho mais de 18
                  anos.
                </Label>
              </div>
            </RadioGroup>
          </FormControl>

          <p className="text-muted-foreground text-xs leading-relaxed">
            <span className="leading-snug">
              Ao clicar em &ldquo;Continuar&rdquo;, você declara que tem mais de
              18 anos, aceita o Consentimento para Telessaúde, confirma que leu
              e está de acordo com os
            </span>
            <br />
            <a
              href="https://revalifemed.com/pages/termos-de-uso"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
            >
              Termos de Uso
            </a>
            ,{' '}
            <a
              href="https://revalifemed.com/pages/termos-de-consulta-medica-e-uso-da-plataforma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
            >
              Termos de Consulta Médica
            </a>
            ,<br />
            <a
              href="https://revalifemed.com/pages/termo-de-consentimento-livre-e-esclarecido-e-autorizacao-para-telemedicina-e-tratamento-de-dados"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
            >
              Termo de Consentimento Livre e o Documento de Uso
            </a>
            ,<br />
            <a
              href="https://revalifemed.com/pages/autorizacao-de-uso-e-divulgacao-de-informacoes-medicas-e-consentimento-para-telesaude"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
            >
              Divulgação de Informações Médicas
            </a>{' '}
            e{' '}
            <a
              href="https://revalifemed.com/pages/politica-de-reembolso"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
            >
              Política de Reembolso
            </a>
            .
          </p>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
