import type { FormConfig, FormSettings } from './form.types';
import type { SessionStatus } from './api.types';

// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  twoFactorEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  id: string;
  userId: string;
  expiresAt: string;
  user: AdminUser;
}

export interface BetterAuthSessionResponse {
  session: AdminSession;
  user: AdminUser;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard stats
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminOverview {
  totalForms: number;
  totalSessions: number;
  completedSessions: number;
  completionRate: number; // percentage 0-100
  avgUtmsPerSession: number;
}

export interface SessionStatusItem {
  status: SessionStatus;
  count: number;
}

export interface SessionsOverTimeItem {
  date: string; // ISO date string YYYY-MM-DD
  count: number;
}

export interface SessionsOverTimeResponse {
  period: number;
  data: SessionsOverTimeItem[];
}

export interface SessionsPerFormItem {
  formId: number;
  formName: string;
  count: number;
}

export interface AbandonmentItem {
  formId: number;
  formName: string;
  approved: number;
  rejected: number;
  abandoned: number;
  inProgress: number;
}

export interface UtmSourceItem {
  source: string;
  count: number;
}

export interface FunnelItem {
  step: number;
  count: number;
}

export interface AdminStatsResponse {
  overview: AdminOverview;
  sessionsByStatus: SessionStatusItem[];
  conversionFunnel: FunnelItem[];
  sessionsByForm: SessionsPerFormItem[];
  topUtmSources: UtmSourceItem[];
  completionVsAbandonByForm: AbandonmentItem[];
  recentSessions: RecentSession[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Recent sessions list
// ─────────────────────────────────────────────────────────────────────────────

export interface RecentSession {
  id: number;
  status: SessionStatus;
  fullName: string | null;
  email: string | null;
  formName: string;
  formSlug: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Query params
// ─────────────────────────────────────────────────────────────────────────────

export type SessionsOverTimePeriod = 7 | 30 | 90;

// ─────────────────────────────────────────────────────────────────────────────
// Kommo
// ─────────────────────────────────────────────────────────────────────────────

export interface KommoIntegrationLookup {
  id: number;
  name: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Forms
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminFormListItem {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  gtmId: string | null;
  primaryColor: string;
  secondaryColor: string;
  isActive: boolean;
  kommoIntegrationId: number | null;
  sessionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFormDetail extends AdminFormListItem {
  fieldsSchema: FormConfig;
  settings: FormSettings;
}

export interface CreateFormDto {
  slug: string;
  name: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  gtmId?: string;
  kommoIntegrationId?: number | null;
  isActive?: boolean;
  fieldsSchema?: FormConfig;
  settings?: FormSettings;
}

export type UpdateFormDto = Partial<CreateFormDto>;

export interface DuplicateFormDto {
  newSlug: string;
  newName?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Form Lookup
// ─────────────────────────────────────────────────────────────────────────────

export interface FormLookupItem {
  id: number;
  slug: string;
  name: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Sessions — List
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminSessionListQuery {
  page?: number;
  limit?: number;
  status?: SessionStatus;
  formSlug?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  hasKommoId?: boolean;
}

export interface AdminSessionListItem {
  id: number;
  fullName: string | null;
  email: string | null;
  formName: string | null;
  formSlug: string | null;
  currentStep: number;
  kommoId: number | null;
  productUrl: string | null;
  hasUtm: boolean;
  status: SessionStatus;
  createdAt: string;
  submittedAt: string | null;
}

export interface PaginatedSessions {
  data: AdminSessionListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Sessions — Stats
// ─────────────────────────────────────────────────────────────────────────────

export interface SessionStatusCount {
  status: SessionStatus;
  count: number;
}

export interface TopForm {
  formId: number;
  formName: string;
  formSlug: string;
  count: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Sessions — Detail
// ─────────────────────────────────────────────────────────────────────────────

export interface MappedAnswer {
  questionId: string;
  questionTitle: string;
  questionType: string;
  rawValue: unknown;
  displayValue: string;
}

export interface AdminSessionDetail {
  id: number;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  currentStep: number;
  kommoId: number | null;
  productUrl: string | null;
  status: SessionStatus;
  answers: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  form: {
    id: number;
    slug: string;
    name: string;
    isActive: boolean;
    kommoIntegration: {
      name: string;
      apiUrl: string;
      pipelineId: string;
      isActive: boolean;
    } | null;
  } | null;
  utms: {
    id: number;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_term: string | null;
    tracking_id: string | null;
    ph_distinct_id: string | null;
    referring_afiliado_id: string | null;
  }[];
  webhookDeliveries: {
    id: number;
    event: string;
    status: string;
    attempts: number;
    responseStatus: number | null;
    errorMessage: string | null;
    lastAttempt: string | null;
    webhookConfig: { url: string };
  }[];
  mappedAnswers: MappedAnswer[];
}

export interface AdminSessionUpdate {
  status?: SessionStatus;
  productUrl?: string | null;
  answers?: Record<string, unknown>;
}
