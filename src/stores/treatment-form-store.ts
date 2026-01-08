import type {
  FormAnswers,
  Question,
  QuestionCondition,
  QuestionConditionGroup,
  ApiFormConfig,
} from '@/types/form.types';
import { devtools, persist } from 'zustand/middleware';
import { create } from 'zustand';

interface TreatmentFormState {
  // Estado
  sessionId: number | null;
  formSlug: string | null;
  formConfig: ApiFormConfig | null;
  currentStepIndex: number;
  answers: FormAnswers;
  isSubmitting: boolean;
  isLoading: boolean;
  hasHydrated: boolean;

  // Ações
  setSessionId: (sessionId: number | null) => void;
  setFormSlug: (formSlug: string | null) => void;
  setFormConfig: (formConfig: ApiFormConfig | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setAnswer: (questionId: string, value: string | string[]) => void;
  loadFormData: (data: {
    currentStepIndex: number;
    answers: FormAnswers;
    formConfig: ApiFormConfig;
    formSlug: string;
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
  getTotalSteps: () => number;
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
        formSlug: null,
        formConfig: null,
        currentStepIndex: 0,
        answers: {},
        isSubmitting: false,
        isLoading: false,
        hasHydrated: false,

        // Definir session ID
        setSessionId: sessionId => set({ sessionId }),

        // Definir form slug
        setFormSlug: formSlug => set({ formSlug }),

        // Definir form config
        setFormConfig: formConfig => set({ formConfig }),

        setHasHydrated: hasHydrated => set({ hasHydrated }),

        // Carregar dados do formulário do backend
        loadFormData: data => {
          console.log('📥 Carregando dados da sessão:', data);
          set({
            currentStepIndex: data.currentStepIndex,
            answers: data.answers,
            formConfig: data.formConfig,
            formSlug: data.formSlug,
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
            const { formConfig } = get();
            if (!formConfig) return state;

            const maxStep = formConfig.steps.length - 1;
            let nextIndex = state.currentStepIndex + 1;

            // Pula steps invisíveis
            while (nextIndex <= maxStep) {
              const step = formConfig.steps[nextIndex];
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
            const { formConfig } = get();
            if (!formConfig) return state;

            let prevIndex = state.currentStepIndex - 1;

            // Pula steps invisíveis
            while (prevIndex >= 0) {
              const step = formConfig.steps[prevIndex];
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
              currentStepIndex: Math.max(0, prevIndex),
            };
          }),

        // Ir para um step específico
        goToStep: stepIndex =>
          set(() => {
            const { formConfig } = get();
            if (!formConfig) return {};

            return {
              currentStepIndex: Math.max(
                0,
                Math.min(stepIndex, formConfig.steps.length - 1)
              ),
            };
          }),

        // Resetar formulário
        resetForm: () =>
          set(() => ({
            currentStepIndex: 0,
            answers: {},
            isSubmitting: false,
            formConfig: null,
            formSlug: null,
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
          const { formConfig } = get();
          if (!formConfig) return false;

          const step = formConfig.steps[stepIndex];
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
          const { formConfig } = get();
          if (!formConfig) return [];

          const step = formConfig.steps[stepIndex];
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
            if (!question.required) {
              return true; // Pergunta não obrigatória
            }

            const answer = answers[question.id];

            if (Array.isArray(answer)) {
              return answer.length > 0;
            }

            return answer !== undefined && answer !== '';
          });
        },

        // Retorna progresso atual (0-100)
        getCurrentProgress: () => {
          const { formConfig, currentStepIndex } = get();
          if (!formConfig) return 0;

          const totalSteps = formConfig.steps.length;
          return ((currentStepIndex + 1) / totalSteps) * 100;
        },

        // Retorna total de steps
        getTotalSteps: () => {
          const { formConfig } = get();
          return formConfig?.steps.length ?? 0;
        },
      }),
      {
        name: 'treatment-form-storage',
        // Persiste apenas sessionId e formSlug
        partialize: state => ({
          sessionId: state.sessionId,
          formSlug: state.formSlug,
        }),
        onRehydrateStorage: () => state => {
          state?.setHasHydrated(true);
        },
      }
    )
  )
);
