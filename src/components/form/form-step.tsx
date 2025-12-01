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
}

export function FormStepComponent({ step }: FormStepComponentProps) {
  const { answers, setAnswer, getVisibleQuestions, currentStepIndex } =
    useTreatmentFormStore();
  const visibleQuestions = getVisibleQuestions(currentStepIndex);

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

  // Reseta form quando muda de step
  useEffect(() => {
    const newDefaults = visibleQuestions.reduce(
      (acc, q) => {
        acc[q.id] = answers[q.id] || (q.type === 'checkbox' ? [] : '');
        return acc;
      },
      {} as Record<string, string | string[]>
    );
    form.reset(newDefaults);
  }, [currentStepIndex]);

  return (
    <Form {...form}>
      <form className="space-y-8">
        {/* Header do Step (se houver) */}
        {(step.title || step.description) && (
          <div className="space-y-2">
            {step.title && <h2 className="text-2xl font-bold">{step.title}</h2>}
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
            />
          ))}
        </div>
      </form>
    </Form>
  );
}
