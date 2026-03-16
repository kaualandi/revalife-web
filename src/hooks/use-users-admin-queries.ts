import {
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  setUserFormPermissions,
} from '@/lib/api-admin';
import type {
  AdminUserListQuery,
  AdminCreateUserDto,
  AdminUpdateUserDto,
} from '@/types/admin.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const STALE = 2 * 60 * 1000; // 2 min

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

export function useAdminUsers(query: AdminUserListQuery = {}) {
  return useQuery({
    queryKey: ['admin', 'users', query],
    queryFn: () => getAdminUsers(query),
    staleTime: STALE,
    retry: 1,
  });
}

export function useAdminUserDetail(id: string) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => getAdminUserById(id),
    enabled: !!id,
    staleTime: STALE,
    retry: 1,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

export function useCreateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminCreateUserDto) => createAdminUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useUpdateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminUpdateUserDto }) =>
      updateAdminUser(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      qc.invalidateQueries({ queryKey: ['admin', 'users', id] });
    },
  });
}

export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useSetUserFormPermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formIds }: { id: string; formIds: number[] }) =>
      setUserFormPermissions(id, formIds),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      qc.invalidateQueries({ queryKey: ['admin', 'users', id] });
    },
  });
}
