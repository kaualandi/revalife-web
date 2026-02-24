import type {
  AdminStatsResponse,
  SessionsOverTimeResponse,
  SessionsOverTimePeriod,
  AdminFormListItem,
  AdminFormDetail,
  CreateFormDto,
  UpdateFormDto,
  DuplicateFormDto,
  KommoIntegrationLookup,
  FormLookupItem,
} from '@/types/admin.types';
import { twoFactorClient } from 'better-auth/client/plugins';
import { magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

// ─────────────────────────────────────────────────────────────────────────────
// Better Auth Client
// Aponta para o backend Better Auth em {API_URL}/auth/*
// ─────────────────────────────────────────────────────────────────────────────

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  basePath: '/auth',
  fetchOptions: {
    credentials: 'include', // obrigatório para cookies cross-origin
  },
  plugins: [magicLinkClient(), twoFactorClient()],
});

// ─────────────────────────────────────────────────────────────────────────────
// HTTP helper para rotas admin autenticadas
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || '10000',
  10
);

interface AdminFetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  timeout?: number;
}

export async function fetchAdmin<T>(
  endpoint: string,
  options: AdminFetchOptions = {}
): Promise<T> {
  const { params, timeout = API_TIMEOUT, ...fetchOptions } = options;

  const url = new URL(`${API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers,
      credentials: 'include', // envia cookies de sessão do Better Auth
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        statusCode: response.status,
        message: response.statusText || 'Erro desconhecido',
        error: 'HTTP Error',
      }));
      throw error;
    }

    return response.json();
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if ((error as { name?: string }).name === 'AbortError') {
      throw {
        statusCode: 408,
        message: 'Tempo de requisição esgotado',
        error: 'Timeout',
      };
    }
    if (error instanceof TypeError) {
      throw {
        statusCode: 0,
        message: 'Erro de conexão com o servidor',
        error: 'Network Error',
      };
    }
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin stats API
// ─────────────────────────────────────────────────────────────────────────────

/** Todas as métricas do dashboard em uma única requisição */
export function getAdminStats(formId?: number) {
  return fetchAdmin<AdminStatsResponse>('/admin/stats', {
    params: { formId },
  });
}

/** Sessões ao longo do tempo */
export function getSessionsOverTime(
  period: SessionsOverTimePeriod = 30,
  formId?: number
) {
  return fetchAdmin<SessionsOverTimeResponse>(
    '/admin/stats/sessions-over-time',
    {
      params: { period, formId },
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Forms API
// ─────────────────────────────────────────────────────────────────────────────

/** Lista todos os formulários (ativos + inativos) com sessionsCount */
export function getAdminForms() {
  return fetchAdmin<AdminFormListItem[]>('/admin/forms');
}

/** Detalhes completos de um formulário incluindo fieldsSchema e settings */
export function getAdminFormBySlug(slug: string) {
  return fetchAdmin<AdminFormDetail>(`/admin/forms/${slug}`);
}

/** Criar novo formulário */
export function createAdminForm(data: CreateFormDto) {
  return fetchAdmin<AdminFormDetail>('/admin/forms', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Atualização parcial de um formulário */
export function updateAdminForm(slug: string, data: UpdateFormDto) {
  return fetchAdmin<AdminFormDetail>(`/admin/forms/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/** Soft delete (isActive=false) */
export function deleteAdminForm(slug: string) {
  return fetchAdmin<void>(`/admin/forms/${slug}`, {
    method: 'DELETE',
  });
}

/** Duplicar formulário com Kommo + mapeamentos */
export function duplicateAdminForm(slug: string, data: DuplicateFormDto) {
  return fetchAdmin<AdminFormDetail>(`/admin/forms/${slug}/duplicate`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Kommo Integrations API
// ─────────────────────────────────────────────────────────────────────────────

/** Lookup de integrações Kommo disponíveis */
export function getKommoIntegrationsLookup() {
  return fetchAdmin<KommoIntegrationLookup[]>(
    '/admin/kommo-integrations/lookup'
  );
}

/** Lookup de formulários (id, slug, name) */
export function getFormsLookup() {
  return fetchAdmin<FormLookupItem[]>('/admin/forms/lookup');
}
