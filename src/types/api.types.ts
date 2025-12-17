import type { FormAnswers } from './form.types';

// Status da sessão
export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'ERROR';

// Resposta ao iniciar sessão
export interface StartSessionResponse {
  sessionId: string;
  createdAt: string;
  status: SessionStatus;
}

// Resposta ao buscar sessão
export interface GetSessionResponse {
  sessionId: string;
  status: SessionStatus;
  currentStep: number;
  answers: FormAnswers;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

// DTO para atualizar sessão (auto-save)
export interface UpdateSessionDto {
  currentStep: number;
  answers: Partial<FormAnswers>;
}

// Resposta ao atualizar sessão
export interface UpdateSessionResponse {
  sessionId: string;
  status: SessionStatus;
  currentStep: number;
  updatedAt: string;
}

// DTO para submeter formulário
export interface SubmitSessionDto {
  answers: FormAnswers;
}

// Resposta ao submeter formulário
export interface SubmitSessionResponse {
  sessionId: string;
  status: SessionStatus;
  submittedAt: string;
  message: string;
}

// Erro da API
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp?: string;
  path?: string;
}
