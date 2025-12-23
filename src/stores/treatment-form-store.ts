import type {
  FormAnswers,
  Question,
  QuestionCondition,
  QuestionConditionGroup,
} from '@/types/form.types';
import { treatmentFormConfig } from '@/config/treatment-form.config';
import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand';

interface TreatmentFormState {
  // Estado
  sessionId: string | null;
  currentStepIndex: number;
  answers: FormAnswers;
  isSubmitting: boolean;
  isLoading: boolean;

  // Ações
  setSessionId: (sessionId: string | null) => void;
  setAnswer: (questionId: string, value: string | string[]) => void;
  loadFormData: (data: {
    currentStepIndex: number;
    answers: FormAnswers;
  }) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;
  resetForm: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;

  // Helpers
  getVisibleQuestions: (stepIndex: number) => Question[];
  isQuestionVisible: (question: Question) => boolean;
  isStepVisible: (stepIndex: number) => boolean;
  canProceedToNextStep: () => boolean;
  getCurrentProgress: () => number;
}

// Verifica se uma condição é atendida
const checkCondition = (
  condition: QuestionCondition,
  answers: FormAnswers
): boolean => {
  const answer = answers[condition.questionId];

  if (!answer) return false;

  switch (condition.operator) {
    case 'equals':
      return answer === condition.value;

    case 'notEquals':
      return answer !== condition.value;

    case 'contains':
      return Array.isArray(answer) && answer.includes(condition.value);

    case 'notContains':
      return Array.isArray(answer) && !answer.includes(condition.value);

    default:
      return false;
  }
};

// Verifica grupo de condições (AND/OR logic)
const checkConditionGroup = (
  group: QuestionConditionGroup,
  answers: FormAnswers
): boolean => {
  // Se tem 'all', todas as condições devem ser verdadeiras (AND)
  if (group.all) {
    return group.all.every(cond => checkCondition(cond, answers));
  }

  // Se tem 'any', pelo menos uma condição deve ser verdadeira (OR)
  if (group.any) {
    return group.any.some(cond => checkCondition(cond, answers));
  }

  return false;
};

export const useTreatmentFormStore = create<TreatmentFormState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        sessionId: null,
        currentStepIndex: 0,
        answers: {},
        isSubmitting: false,
        isLoading: false,

        // Definir session ID
        setSessionId: sessionId => set({ sessionId }),

        // Carregar dados do formulário do backend
        loadFormData: data => {
          console.log('📥 Carregando dados da sessão:', data);
          set({
            currentStepIndex: data.currentStepIndex,
            answers: data.answers,
          });
        },

        // Definir resposta de uma pergunta
        setAnswer: (questionId, value) =>
          set(state => ({
            answers: {
              ...state.answers,
              [questionId]: value,
            },
          })),

        // Avançar para próximo step (pula steps invisíveis)
        nextStep: () =>
          set(state => {
            const maxStep = treatmentFormConfig.steps.length - 1;
            let nextIndex = state.currentStepIndex + 1;

            // Pula steps invisíveis
            while (nextIndex <= maxStep) {
              const step = treatmentFormConfig.steps[nextIndex];
              if (!step.showWhen) break; // Sem condição = sempre visível

              const { answers } = get();
              // Verifica se é QuestionConditionGroup ou QuestionCondition
              const isVisible =
                'all' in step.showWhen || 'any' in step.showWhen
                  ? checkConditionGroup(
                      step.showWhen as QuestionConditionGroup,
                      answers
                    )
                  : checkCondition(step.showWhen as QuestionCondition, answers);

              if (isVisible) break;
              nextIndex++;
            }

            // Se passou do último step, mantém no step atual (não avança)
            if (nextIndex > maxStep) {
              return { currentStepIndex: state.currentStepIndex };
            }

            return {
              currentStepIndex: nextIndex,
            };
          }),

        // Voltar para step anterior (pula steps invisíveis)
        previousStep: () =>
          set(state => {
            let prevIndex = state.currentStepIndex - 1;

            // Pula steps invisíveis
            while (prevIndex >= 0) {
              const step = treatmentFormConfig.steps[prevIndex];
              if (!step.showWhen) break; // Sem condição = sempre visível

              const { answers } = get();
              // Verifica se é QuestionConditionGroup ou QuestionCondition
              const isVisible =
                'all' in step.showWhen || 'any' in step.showWhen
                  ? checkConditionGroup(
                      step.showWhen as QuestionConditionGroup,
                      answers
                    )
                  : checkCondition(step.showWhen as QuestionCondition, answers);

              if (isVisible) break;
              prevIndex--;
            }

            return {
              currentStepIndex: Math.max(prevIndex, 0),
            };
          }),

        // Ir para step específico
        goToStep: stepIndex =>
          set(() => ({
            currentStepIndex: Math.max(
              0,
              Math.min(stepIndex, treatmentFormConfig.steps.length - 1)
            ),
          })),

        // Resetar formulário
        resetForm: () =>
          set(() => ({
            currentStepIndex: 0,
            answers: {},
            isSubmitting: false,
          })),

        // Definir estado de submissão
        setIsSubmitting: isSubmitting => set({ isSubmitting }),

        // Definir estado de loading
        setIsLoading: isLoading => set({ isLoading }),

        // Verifica se uma pergunta deve ser exibida
        isQuestionVisible: question => {
          if (!question.showWhen) {
            return true; // Sem condições = sempre visível
          }

          const { answers } = get();

          // Se for QuestionConditionGroup (tem 'all' ou 'any')
          if ('all' in question.showWhen || 'any' in question.showWhen) {
            return checkConditionGroup(
              question.showWhen as QuestionConditionGroup,
              answers
            );
          }

          // Se for QuestionCondition simples
          return checkCondition(
            question.showWhen as QuestionCondition,
            answers
          );
        },

        // Verifica se um step deve ser exibido
        isStepVisible: stepIndex => {
          const step = treatmentFormConfig.steps[stepIndex];
          if (!step || !step.showWhen) {
            return true; // Sem condições = sempre visível
          }

          const { answers } = get();

          // Se for QuestionConditionGroup (tem 'all' ou 'any')
          if ('all' in step.showWhen || 'any' in step.showWhen) {
            return checkConditionGroup(
              step.showWhen as QuestionConditionGroup,
              answers
            );
          }

          // Se for QuestionCondition simples
          return checkCondition(step.showWhen as QuestionCondition, answers);
        },

        // Retorna perguntas visíveis de um step
        getVisibleQuestions: stepIndex => {
          const step = treatmentFormConfig.steps[stepIndex];
          if (!step) return [];

          const { isQuestionVisible } = get();
          return step.questions.filter(isQuestionVisible);
        },

        // Verifica se pode avançar para próximo step
        canProceedToNextStep: () => {
          const { currentStepIndex, answers, getVisibleQuestions } = get();
          const visibleQuestions = getVisibleQuestions(currentStepIndex);

          // Verifica se todas as perguntas obrigatórias foram respondidas
          return visibleQuestions.every(question => {
            if (!question.required) return true;

            const answer = answers[question.id];

            if (Array.isArray(answer)) {
              return answer.length > 0;
            }

            return answer !== undefined && answer !== '';
          });
        },

        // Retorna progresso atual (0-100)
        getCurrentProgress: () => {
          const { currentStepIndex } = get();
          const totalSteps = treatmentFormConfig.steps.length;
          return ((currentStepIndex + 1) / totalSteps) * 100;
        },
      }),
      {
        name: 'treatment-form-storage',
        // Persiste apenas sessionId
        partialize: state => ({
          sessionId: state.sessionId,
        }),
      }
    )
  )
);
