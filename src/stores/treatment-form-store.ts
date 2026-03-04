import type {
  FormAnswers,
  Question,
  QuestionCondition,
  QuestionConditionGroup,
  ApiFormConfig,
} from '@/types/form.types';
import { devtools, persist } from 'zustand/middleware';
import type { FormMetadata } from '@/types/api.types';
import { create } from 'zustand';

interface TreatmentFormState {
  // Estado
  sessionId: number | null;
  formMetadata: FormMetadata | null;
  formConfig: ApiFormConfig | null;
  currentStepIndex: number;
  answers: FormAnswers;
  isSubmitting: boolean;
  isLoading: boolean;
  hasHydrated: boolean;

  // Resultado da submissão (persistido para retorno do usuário)
  submissionResult: {
    status: 'APPROVED' | 'REJECTED';
    productUrl?: string;
  } | null;

  // Validação de erros do backend
  validationErrors: Record<string, string>;
  stepsWithErrors: number[];
  isInErrorCorrectionMode: boolean;

  // Ações
  setSessionId: (sessionId: number | null) => void;
  setFormMetadata: (formMetadata: FormMetadata | null) => void;
  setFormConfig: (formConfig: ApiFormConfig | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setAnswer: (questionId: string, value: string | string[]) => void;
  clearStepAnswers: (stepIndex: number) => void;
  loadFormData: (data: {
    currentStepIndex: number;
    answers: FormAnswers;
    formMetadata: FormMetadata;
    formConfig: ApiFormConfig;
  }) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;
  resetForm: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;

  setSubmissionResult: (
    result: { status: 'APPROVED' | 'REJECTED'; productUrl?: string } | null
  ) => void;

  // Ações de validação
  setValidationErrors: (
    errors: Array<{ questionId: string; message: string }>
  ) => void;
  clearValidationErrors: () => void;
  clearQuestionError: (questionId: string) => void;
  removeStepFromErrorList: (stepIndex: number) => void;
  getNextStepWithError: () => number | null;

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
        formMetadata: null,
        formConfig: null,
        currentStepIndex: 0,
        answers: {},
        isSubmitting: false,
        isLoading: false,
        hasHydrated: false,

        // Resultado da submissão
        submissionResult: null,

        // Estado de validação
        validationErrors: {},
        stepsWithErrors: [],
        isInErrorCorrectionMode: false,

        // Definir session ID
        setSessionId: sessionId => set({ sessionId }),

        // Definir form metadata
        setFormMetadata: formMetadata => set({ formMetadata }),

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
            formMetadata: data.formMetadata,
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

        // Limpar respostas de uma etapa específica
        clearStepAnswers: stepIndex => {
          const { formConfig, answers } = get();
          if (!formConfig) return;

          const step = formConfig.steps[stepIndex];
          if (!step) return;

          const newAnswers = { ...answers };
          step.questions.forEach(question => {
            delete newAnswers[question.id];
          });

          set({ answers: newAnswers });
        },

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
            formMetadata: null,
            submissionResult: null,
          })),

        // Definir resultado da submissão
        setSubmissionResult: result => set({ submissionResult: result }),

        // Definir estado de submissão
        setIsSubmitting: isSubmitting => set({ isSubmitting }),

        // Definir estado de loading
        setIsLoading: isLoading => set({ isLoading }),

        // Definir erros de validação do backend
        setValidationErrors: errors => {
          const { formConfig } = get();
          if (!formConfig) return;

          // Mapear erros para Record<questionId, message>
          const validationErrors: Record<string, string> = {};
          errors.forEach(err => {
            validationErrors[err.questionId] = err.message;
          });

          // Identificar steps que contêm os questionIds com erro
          const stepsWithErrors: number[] = [];
          formConfig.steps.forEach((step, index) => {
            const hasError = step.questions.some(
              q => validationErrors[q.id] !== undefined
            );
            if (hasError) {
              stepsWithErrors.push(index);
            }
          });

          set({
            validationErrors,
            stepsWithErrors: stepsWithErrors.sort((a, b) => a - b),
            isInErrorCorrectionMode: true,
          });
        },

        // Limpar todos os erros de validação
        clearValidationErrors: () =>
          set({
            validationErrors: {},
            stepsWithErrors: [],
            isInErrorCorrectionMode: false,
          }),

        // Limpar erro de uma pergunta específica
        clearQuestionError: questionId => {
          const { validationErrors } = get();
          const newErrors = { ...validationErrors };
          delete newErrors[questionId];
          set({ validationErrors: newErrors });
        },

        // Remover step da lista de erros
        removeStepFromErrorList: stepIndex => {
          const { stepsWithErrors } = get();
          const newStepsWithErrors = stepsWithErrors.filter(
            idx => idx !== stepIndex
          );
          set({ stepsWithErrors: newStepsWithErrors });
        },

        // Obter próximo step com erro
        getNextStepWithError: () => {
          const { stepsWithErrors, currentStepIndex } = get();
          const nextError = stepsWithErrors.find(idx => idx > currentStepIndex);
          return nextError !== undefined ? nextError : null;
        },

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
        name: 'treatment-form',
        // Persiste apenas sessionId e formMetadata.slug
        partialize: state => ({
          sessionId: state.sessionId,
          formMetadata: state.formMetadata
            ? { slug: state.formMetadata.slug }
            : null,
          submissionResult: state.submissionResult,
        }),
        onRehydrateStorage: () => state => {
          state?.setHasHydrated(true);
        },
      }
    )
  )
);
