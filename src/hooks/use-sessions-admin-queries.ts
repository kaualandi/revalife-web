import {
  getAdminSessions,
  getAdminSessionById,
  updateAdminSession,
  deleteAdminSession,
} from '@/lib/api-admin';
import type {
  AdminSessionListQuery,
  AdminSessionUpdate,
} from '@/types/admin.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const STALE = 2 * 60 * 1000; // 2 min

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

export function useAdminSessions(query: AdminSessionListQuery = {}) {
  return useQuery({
    queryKey: ['admin', 'sessions', query],
    queryFn: () => getAdminSessions(query),
    staleTime: STALE,
    retry: 1,
  });
}

export function useAdminSessionDetail(id: number) {
  return useQuery({
    queryKey: ['admin', 'sessions', id],
    queryFn: () => getAdminSessionById(id),
    enabled: !!id,
    staleTime: STALE,
    retry: 1,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

export function useUpdateAdminSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdminSessionUpdate }) =>
      updateAdminSession(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'sessions'] });
      qc.invalidateQueries({ queryKey: ['admin', 'sessions', id] });
    },
  });
}

export function useDeleteAdminSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminSession(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'sessions'] });
    },
  });
}
