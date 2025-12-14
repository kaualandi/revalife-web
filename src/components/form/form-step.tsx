'use client';

import type { FormStep } from '@/types/form.types';
import { useTreatmentFormStore } from '@/stores/treatment-form-store';
import { QuestionRenderer } from './question-renderer';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateFormSchema } from '@/schemas/treatment-form.schema';
import { useEffect } from 'react';

interface FormStepComponentProps {
  step: FormStep;
  onAutoAdvance?: () => void;
}

export function FormStepComponent({
  step,
  onAutoAdvance,
}: FormStepComponentProps) {
  const { answers, setAnswer, currentStepIndex } = useTreatmentFormStore();
  console.log(currentStepIndex);

  // Filtra perguntas visíveis baseado nas condições
  const visibleQuestions = step.questions.filter(q => {
    if (!q.showWhen) return true;

    // Verifica condições usando o store
    const store = useTreatmentFormStore.getState();
    return store.isQuestionVisible(q);
  });

  // Gera schema dinamicamente baseado nas perguntas visíveis
  const schema = generateFormSchema(visibleQuestions);

  // Inicializa form com valores atuais
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: visibleQuestions.reduce(
      (acc, q) => {
        acc[q.id] = answers[q.id] || (q.type === 'checkbox' ? [] : '');
        return acc;
      },
      {} as Record<string, string | string[]>
    ),
    mode: 'onChange',
  });

  // Sincroniza mudanças do form com o store
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name && values[name] !== undefined) {
        setAnswer(name, values[name] as string | string[]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setAnswer]);

  // Reseta form quando muda de step (usando step.id para evitar flicker)
  useEffect(() => {
    const newDefaults = visibleQuestions.reduce(
      (acc, q) => {
        acc[q.id] = answers[q.id] || (q.type === 'checkbox' ? [] : '');
        return acc;
      },
      {} as Record<string, string | string[]>
    );
    form.reset(newDefaults);
  }, [step.id]); // Usa step.id ao invés de currentStepIndex

  // Verifica se todas as perguntas visíveis estão respondidas
  const handleRadioSelect = () => {
    if (!onAutoAdvance) return;

    // Aguarda um delay para o estado ser atualizado e perguntas condicionais aparecerem
    setTimeout(() => {
      // Recalcula as perguntas visíveis após a mudança
      const updatedVisibleQuestions = step.questions.filter(q => {
        if (!q.showWhen) return true;
        const store = useTreatmentFormStore.getState();
        return store.isQuestionVisible(q);
      });

      const formValues = form.getValues();

      const allAnswered = updatedVisibleQuestions.every(q => {
        const answer = formValues[q.id];
        if (!q.required) return true;
        if (q.type === 'checkbox') {
          return Array.isArray(answer) && answer.length > 0;
        }
        return answer !== undefined && answer !== '';
      });

      // Só chama onAutoAdvance se todas estiverem respondidas
      if (allAnswered) {
        onAutoAdvance();
      }
    }, 200);
  };

  return (
    <Form {...form}>
      <form className="space-y-3">
        {/* Header do Step (se houver) */}
        {(step.title || step.description) && (
          <div className="space-y-2">
            {step.title && (
              <h2 className="text-2xl leading-none">{step.title}</h2>
            )}
            {step.description && (
              <p className="text-muted-foreground">{step.description}</p>
            )}
          </div>
        )}

        {/* Renderiza perguntas visíveis */}
        <div className="space-y-6">
          {visibleQuestions.map(question => (
            <QuestionRenderer
              key={question.id}
              question={question}
              form={form}
              onRadioSelect={
                question.type === 'radio' || question.type === 'radio-image'
                  ? handleRadioSelect
                  : undefined
              }
            />
          ))}
        </div>

        <p className="text-muted-foreground text-xxs leading-none">
          Lembre-se: precisamos das informações corretas para indicar o melhor
          tratamento pra você
        </p>
      </form>
    </Form>
  );
}
