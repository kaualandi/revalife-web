// Tipos base para o sistema de formulário

export type QuestionType =
  | 'date'
  | 'radio'
  | 'radio-image'
  | 'select'
  | 'checkbox'
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'textarea';

// Condição para exibir uma pergunta baseada em respostas anteriores
export interface QuestionCondition {
  questionId: string; // ID da pergunta que será verificada
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains';
  value: string; // Valor esperado
}

// Grupo de condições com lógica AND/OR
export interface QuestionConditionGroup {
  all?: QuestionCondition[]; // AND logic - todas devem ser verdadeiras
  any?: QuestionCondition[]; // OR logic - pelo menos uma deve ser verdadeira
}

// Opção para perguntas de múltipla escolha
export interface QuestionOption {
  value: string;
  label: string;
  image?: string; // Para radio-image
  description?: string; // Descrição adicional
}

// Configuração base de uma pergunta
export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: QuestionOption[]; // Para radio, select, checkbox
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    minDate?: Date;
    maxDate?: Date;
    pattern?: string;
    message?: string;
  };
  showWhen?: QuestionCondition | QuestionConditionGroup; // Condições para exibir a pergunta
  grid?: {
    cols?: number; // Para layout de opções em grid
    imageSize?: 'sm' | 'md' | 'lg'; // Para radio-image
  };
}

// Um step pode ter múltiplas perguntas
export interface FormStep {
  id: string;
  title?: string;
  description?: string;
  questions: Question[];
  showWhen?: QuestionCondition | QuestionConditionGroup; // Condições para exibir o step inteiro
}

// Configuração completa do formulário
export interface FormConfig {
  steps: FormStep[];
}

// Tipo para as respostas do formulário
export type FormAnswers = Record<string, string | string[]>;
