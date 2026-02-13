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
  onResubmit?: () => void;
}

export function FormStepComponent({
  step,
  onAutoAdvance,
  onResubmit,
}: FormStepComponentProps) {
  const {
    answers,
    setAnswer,
    validationErrors,
    clearQuestionError,
    isInErrorCorrectionMode,
    currentStepIndex,
    removeStepFromErrorList,
    getNextStepWithError,
    goToStep,
    stepsWithErrors,
  } = useTreatmentFormStore();
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

        // Limpar erro individual ao corrigir campo
        if (validationErrors[name]) {
          clearQuestionError(name);

          // Limpar erro do react-hook-form também
          form.clearErrors(name);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setAnswer, validationErrors, clearQuestionError]);

  // Injetar erros de validação do backend no form
  useEffect(() => {
    visibleQuestions.forEach(question => {
      const errorMessage = validationErrors[question.id];
      if (errorMessage) {
        form.setError(question.id, {
          type: 'manual',
          message: errorMessage,
        });
      }
    });
  }, [validationErrors, visibleQuestions, form]);

  // Monitorar correção de todos os erros do step atual
  useEffect(() => {
    // Só executa se estiver em modo de correção e o step atual tem erros
    if (
      !isInErrorCorrectionMode ||
      !stepsWithErrors.includes(currentStepIndex)
    ) {
      return;
    }

    // Obter IDs de todas as perguntas do step atual
    const currentStepQuestionIds = visibleQuestions.map(q => q.id);

    // Verificar se há ALGUM erro de validação do backend para perguntas deste step
    const stepValidationErrors = Object.keys(validationErrors).filter(
      questionId => currentStepQuestionIds.includes(questionId)
    );

    // Se ainda há erros de validação do backend neste step, não avançar
    if (stepValidationErrors.length > 0) {
      return;
    }

    // Verificar se todos os campos obrigatórios estão preenchidos
    const allRequiredFieldsFilled = visibleQuestions.every(question => {
      if (!question.required) return true;

      const answer = answers[question.id];

      if (Array.isArray(answer)) {
        return answer.length > 0;
      }

      return answer !== undefined && answer !== '';
    });

    // Só avança se não há mais erros de validação E todos os campos obrigatórios estão preenchidos
    if (allRequiredFieldsFilled) {
      // Todos os erros deste step foram corrigidos
      removeStepFromErrorList(currentStepIndex);

      // Verificar se há próximo step com erro
      const nextStepWithError = getNextStepWithError();

      if (nextStepWithError !== null) {
        // Navegar para próximo step com erro
        setTimeout(() => {
          goToStep(nextStepWithError);
        }, 300); // Delay para feedback visual
      } else {
        // Não há mais erros, resubmeter automaticamente
        if (onResubmit) {
          setTimeout(() => {
            onResubmit();
          }, 500); // Delay maior para mostrar que tudo foi corrigido
        }
      }
    }
  }, [
    validationErrors,
    visibleQuestions,
    isInErrorCorrectionMode,
    currentStepIndex,
    stepsWithErrors,
    removeStepFromErrorList,
    getNextStepWithError,
    goToStep,
    onResubmit,
    answers,
  ]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]); // Apenas step.id - quando muda de step

  // Verifica se todas as perguntas visíveis estão respondidas
  const handleRadioSelect = () => {
    if (!onAutoAdvance) return;

    // Desabilitar auto-advance se estiver em modo de correção de erros
    if (isInErrorCorrectionMode) return;

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
