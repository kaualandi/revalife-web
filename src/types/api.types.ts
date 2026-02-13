import type { FormAnswers, ApiFormConfig } from './form.types';


// Status da sessão
export type SessionStatus =
  | 'IN_PROGRESS'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'ABANDONED'
  | 'ERROR';

// Metadados do formulário
export interface FormMetadata {
  slug: string;
  name: string;
  description?: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  gtmId: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
}

// DTO para iniciar sessão (agora com formSlug)
export interface StartSessionDto {
  formSlug: string;
}

// Resposta ao iniciar sessão (agora inclui formConfig e totalSteps)
export interface StartSessionResponse {
  sessionId: number;
  status: SessionStatus;
  createdAt: string;
  formConfig: ApiFormConfig;
  form: FormMetadata;
}

// Resposta ao buscar sessão (agora inclui formConfig e totalSteps)
export interface GetSessionResponse {
  sessionId: number;
  status: SessionStatus;
  currentStep: number;
  answers: FormAnswers;
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;
  formConfig: ApiFormConfig;
  form: FormMetadata;
}

// Resposta ao listar formulários
export interface GetFormsResponse {
  slug: string;
  name: string;
  description?: string;
  isActive: boolean;
}

// Resposta ao buscar formulário por slug
export interface GetFormBySlugResponse {
  slug: string;
  name: string;
  description?: string;
  isActive: boolean;
  faviconUrl: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  formConfig?: ApiFormConfig;
}

// DTO para atualizar sessão (auto-save)
export interface UpdateSessionDto {
  currentStep: number;
  answers: Partial<FormAnswers>;
}

// Resposta ao atualizar sessão
export interface UpdateSessionResponse {
  id: number;
  status: SessionStatus;
  currentStep: number;
  updatedAt: string;
}

// DTO para submeter formulário
export interface SubmitSessionDto {
  answers: FormAnswers;
}

// Status de aprovação
export type ApprovalStatus = 'APPROVED' | 'REJECTED';

// UTM parameters
export interface UtmParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  tracking_id?: string;
  ph_distinct_id?: string;
  referring_afiliado_id?: string;
}

// Resposta ao submeter formulário
export interface SubmitSessionResponse {
  id: number;
  status: ApprovalStatus;
  submittedAt: string;
  message: string;
  productUrl?: string; // URL do produto (apenas se APPROVED)
  leadId?: number;
  latestUtm?: UtmParameters; // UTM's mais recentes (apenas se APPROVED)
}

// Erro de validação

// Product types based on Prisma schema
export interface Product {
  id: number;
  slug: string;
  formId: number;
  isActive: boolean;

  // Form relacionado
  form: {
    id: number;
    slug: string;
    name: string;
    faviconUrl: string | null;
    logoUrl: string | null;
    gtmId: string | null;
  };

  // Informações básicas
  title: string;
  subtitle: string;

  // Preços
  originalPrice: number;
  finalPrice: number;
  discountPercent: number;
  installments: number;
  installmentValue: number;
  periodLabel: string | null;

  // Checkout
  checkoutUrl: string;
  checkoutCoupon: string | null;
  checkoutParams: Record<string, string | number | boolean> | null;

  // Imagens
  heroImage1Url: string;
  heroImage2Url: string;
  includedImageUrl: string;

  // Médico
  doctorName: string | null;
  doctorCrm: string | null;
  doctorVideoUrl: string | null;

  // Cores/Estilo
  highlightColor: string;
  highlightTextColor: string;
  priceColor: string;
  buttonColor: string;

  // Conteúdo
  whatIsIncluded: string[];
  whatYouWillReceive: string[];
  disclaimers: {
    consultation: string;
    prescription: string;
    medication: string;
    medicationNote: string;
  };
  planInfo: {
    title: string;
    description: string;
    continuity: string;
  };
  nextSteps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  footerDisclaimers: string[];

  // Badges/Tags
  showSuggestedBadge: boolean;

  // SEO/Meta
  metaTitle: string | null;
  metaDescription: string | null;

  // Order
  displayOrder: number;

  createdAt: string;
  updatedAt: string;
}
export interface ValidationError {
  questionId: string;
  message: string;
}

// Erro da API
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: ValidationError[] | string; // Array de erros de validação ou string de erro genérico
  timestamp?: string;
  path?: string;
}
