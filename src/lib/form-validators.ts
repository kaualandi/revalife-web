import type { Question, QuestionValidation } from '@/types/form.types';

/**
 * Valida email
 */
export function validateEmail(value: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'E-mail inválido';
  }
  return null;
}

/**
 * Valida telefone
 */
export function validatePhone(value: string): string | null {
  const phoneRegex = /^\(?([0-9]{2})\)?[-.\s]?([0-9]{4,5})[-.\s]?([0-9]{4})$/;
  if (!phoneRegex.test(value)) {
    return 'Telefone inválido. Use o formato (11) 99999-9999';
  }
  return null;
}

/**
 * Valida texto
 */
export function validateText(
  value: string,
  validation?: QuestionValidation
): string | null {
  if (validation?.minLength && value.length < validation.minLength) {
    return `Mínimo de ${validation.minLength} caracteres`;
  }
  if (validation?.maxLength && value.length > validation.maxLength) {
    return `Máximo de ${validation.maxLength} caracteres`;
  }
  if (validation?.pattern) {
    const regex = new RegExp(validation.pattern);
    if (!regex.test(value)) {
      return validation.message || 'Formato inválido';
    }
  }
  return null;
}

/**
 * Valida número
 */
export function validateNumber(
  value: number,
  validation?: QuestionValidation
): string | null {
  if (validation?.min !== undefined && value < validation.min) {
    return `Valor mínimo: ${validation.min}`;
  }
  if (validation?.max !== undefined && value > validation.max) {
    return `Valor máximo: ${validation.max}`;
  }
  return null;
}

/**
 * Valida data
 */
export function validateDate(
  value: string,
  validation?: QuestionValidation
): string | null {
  const date = new Date(value);

  if (validation?.minDate) {
    const minDate = new Date(validation.minDate);
    if (date < minDate) {
      return `Data mínima: ${minDate.toLocaleDateString('pt-BR')}`;
    }
  }

  if (validation?.maxDate) {
    const maxDate = new Date(validation.maxDate);
    if (date > maxDate) {
      return `Data máxima: ${maxDate.toLocaleDateString('pt-BR')}`;
    }
  }

  return null;
}

/**
 * Valida checkbox (múltipla seleção)
 */
export function validateCheckbox(
  values: string[],
  validation?: QuestionValidation
): string | null {
  if (validation?.minSelected && values.length < validation.minSelected) {
    return `Selecione pelo menos ${validation.minSelected} opção(ões)`;
  }
  if (validation?.maxSelected && values.length > validation.maxSelected) {
    return `Selecione no máximo ${validation.maxSelected} opção(ões)`;
  }
  return null;
}

/**
 * Valida uma questão baseada no tipo e validações
 */
export function validateQuestion(
  question: Question,
  value: unknown
): string | null {
  // Campo obrigatório
  if (question.required && !value) {
    return 'Campo obrigatório';
  }

  if (!value) return null; // Não valida campos vazios não obrigatórios

  // Validação por tipo
  switch (question.type) {
    case 'email':
      return validateEmail(value as string);

    case 'tel':
      return validatePhone(value as string);

    case 'text':
    case 'textarea':
      return validateText(value as string, question.validation);

    case 'number':
    case 'integer':
      return validateNumber(Number(value), question.validation);

    case 'date':
      return validateDate(value as string, question.validation);

    case 'checkbox':
      return validateCheckbox(value as string[], question.validation);

    default:
      return null;
  }
}
