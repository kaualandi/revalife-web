// Tipos base para o sistema de formulário

export type QuestionType =
  | 'date'
  | 'radio'
  | 'radio-image'
  | 'checkbox'
  | 'consent'
  | 'text'
  | 'email'
  | 'tel'
  | 'cpf'
  | 'number'
  | 'integer'
  | 'textarea'
  | 'breather';

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

// Validação estendida com campos do backend
export interface QuestionValidation {
  // Para text/textarea
  minLength?: number;
  maxLength?: number;
  pattern?: string;

  // Para number/integer
  min?: number;
  max?: number;

  // Para date
  minDate?: string; // ISO format
  maxDate?: string; // ISO format

  // Para checkbox
  minSelected?: number;
  maxSelected?: number;

  message?: string;
}

// Configuração base de uma pergunta
export interface Question {
  id: string;
  type: QuestionType;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  observation?: string; // Texto de observação adicional
  image?: string; // URL da imagem (para breather)
  options?: QuestionOption[]; // Para radio, select, checkbox
  validation?: QuestionValidation;
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

// Metadata de um formulário
export interface FormMetadata {
  slug: string;
  name: string;
  description?: string;
  isActive: boolean;
}

// Configuração completa do formulário da API
export interface ApiFormConfig {
  slug?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  steps: FormStep[];
}

// Tipo para as respostas do formulário
export type FormAnswers = Record<string, string | string[]>;
