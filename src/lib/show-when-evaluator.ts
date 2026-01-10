import type {
  QuestionCondition,
  QuestionConditionGroup,
  FormAnswers,
} from '@/types/form.types';

/**
 * Avalia uma única condição
 */
function evaluateCondition(
  condition: QuestionCondition,
  answers: FormAnswers
): boolean {
  const actualValue = answers[condition.questionId];

  switch (condition.operator) {
    case 'equals':
      return actualValue === condition.value;

    case 'notEquals':
      return actualValue !== condition.value;

    case 'contains':
      if (Array.isArray(actualValue)) {
        return actualValue.includes(condition.value);
      }
      return String(actualValue).includes(String(condition.value));

    case 'notContains':
      if (Array.isArray(actualValue)) {
        return !actualValue.includes(condition.value);
      }
      return !String(actualValue).includes(String(condition.value));

    default:
      return false;
  }
}

/**
 * Avalia um grupo de condições (AND/OR)
 * Suporta a estrutura do backend: { type: 'all' | 'any', conditions: [...] }
 * E também a estrutura legada: { all: [...] } ou { any: [...] }
 */
export function evaluateShowWhen(
  showWhen: QuestionCondition | QuestionConditionGroup | undefined,
  answers: FormAnswers
): boolean {
  if (!showWhen) return true; // Sem condição = sempre mostra

  // Se for uma condição simples (QuestionCondition)
  if ('questionId' in showWhen) {
    return evaluateCondition(showWhen, answers);
  }

  // Se for um grupo de condições (QuestionConditionGroup)
  // Formato legado: { all: [...] } ou { any: [...] }
  if ('all' in showWhen && showWhen.all) {
    return showWhen.all.every(condition =>
      evaluateCondition(condition, answers)
    );
  }

  if ('any' in showWhen && showWhen.any) {
    return showWhen.any.some(condition =>
      evaluateCondition(condition, answers)
    );
  }

  return false;
}
