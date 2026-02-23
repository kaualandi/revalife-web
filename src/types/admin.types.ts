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
