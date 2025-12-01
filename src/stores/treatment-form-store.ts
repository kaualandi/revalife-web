import type { FormAnswers, Question, QuestionCondition, } from '@/types/form.types';
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
      if (Array.isArray(answer)) {
        return Array.isArray(condition.value)
          ? condition.value.some(v => answer.includes(v))
          : answer.includes(condition.value as string);
      }
      return false;

    case 'notContains':
      if (Array.isArray(answer)) {
        return Array.isArray(condition.value)
          ? !condition.value.some(v => answer.includes(v))
          : !answer.includes(condition.value as string);
      }
      return true;

    default:
      return false;
  }
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
        loadFormData: data =>
          set({
            currentStepIndex: data.currentStepIndex,
            answers: data.answers,
          }),

        // Definir resposta de uma pergunta
        setAnswer: (questionId, value) =>
          set(state => ({
            answers: {
              ...state.answers,
              [questionId]: value,
            },
          })),

        // Avançar para próximo step
        nextStep: () =>
          set(state => {
            const maxStep = treatmentFormConfig.steps.length - 1;
            return {
              currentStepIndex: Math.min(state.currentStepIndex + 1, maxStep),
            };
          }),

        // Voltar para step anterior
        previousStep: () =>
          set(state => ({
            currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
          })),

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
          if (!question.showWhen || question.showWhen.length === 0) {
            return true; // Sem condições = sempre visível
          }

          const { answers } = get();

          // Todas as condições devem ser atendidas (AND logic)
          return question.showWhen.every(condition =>
            checkCondition(condition, answers)
          );
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
