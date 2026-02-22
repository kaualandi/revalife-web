import {
  getAdminForms,
  getAdminFormBySlug,
  createAdminForm,
  updateAdminForm,
  deleteAdminForm,
  duplicateAdminForm,
} from '@/lib/api-admin';
import type {
  CreateFormDto,
  UpdateFormDto,
  DuplicateFormDto,
} from '@/types/admin.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const STALE = 5 * 60 * 1000; // 5 min

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

export function useAdminForms() {
  return useQuery({
    queryKey: ['admin', 'forms'],
    queryFn: getAdminForms,
    staleTime: STALE,
    retry: 1,
  });
}

export function useAdminForm(slug: string) {
  return useQuery({
    queryKey: ['admin', 'forms', slug],
    queryFn: () => getAdminFormBySlug(slug),
    enabled: !!slug,
    staleTime: STALE,
    retry: 1,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

export function useCreateForm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFormDto) => createAdminForm(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'forms'] });
    },
  });
}

export function useUpdateForm(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateFormDto) => updateAdminForm(slug, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'forms'] });
      qc.invalidateQueries({ queryKey: ['admin', 'forms', slug] });
    },
  });
}

export function useDeleteForm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => deleteAdminForm(slug),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'forms'] });
    },
  });
}

export function useDuplicateForm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: DuplicateFormDto }) =>
      duplicateAdminForm(slug, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'forms'] });
    },
  });
}
