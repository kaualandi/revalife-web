import type { GetFormBySlugResponse, Product } from '@/types/api.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || '10000',
  10
);

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

/**
 * Cliente HTTP para comunicação com a API Revalife
 * Utiliza Fetch API nativa com timeout e tratamento de erros
 */
export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, timeout = API_TIMEOUT, ...fetchOptions } = options;

  // Construir URL com query params
  const url = new URL(`${API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Headers padrão
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Criar AbortController para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Tratar erros HTTP
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

    // Tratar timeout
    if ((error as { name?: string }).name === 'AbortError') {
      throw {
        statusCode: 408,
        message: 'Tempo de requisição esgotado',
        error: 'Timeout',
      };
    }

    // Tratar erro de rede
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

/**
 * Buscar produto por slug
 */
export async function getProductBySlug(slug: string) {
  return fetchApi<Product>(`/products/slug/${slug}`);
}
/**
 * Buscar formulário por slug
 */
export async function getFormBySlug(slug: string) {
  return fetchApi<GetFormBySlugResponse>(`/forms/${slug}`);
}
