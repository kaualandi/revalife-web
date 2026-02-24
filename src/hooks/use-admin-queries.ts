import {
  getAdminStats,
  getFormsLookup,
  getSessionsOverTime,
} from '@/lib/api-admin';
import type { SessionsOverTimePeriod } from '@/types/admin.types';
import { useQuery } from '@tanstack/react-query';

const STALE = 5 * 60 * 1000; // 5 min

/** Base hook — fetches everything from /admin/stats in one request */
export function useAdminStats(formId?: number) {
  return useQuery({
    queryKey: ['admin', 'stats', formId],
    queryFn: () => getAdminStats(formId),
    staleTime: STALE,
    retry: 1,
  });
}

export function useAdminOverview(formId?: number) {
  const q = useAdminStats(formId);
  return { ...q, data: q.data?.overview };
}

export function useSessionStatus(formId?: number) {
  const q = useAdminStats(formId);
  return { ...q, data: q.data?.sessionsByStatus };
}

export function useSessionsPerForm(formId?: number) {
  const q = useAdminStats(formId);
  return { ...q, data: q.data?.sessionsByForm };
}

export function useAbandonmentPerForm(formId?: number) {
  const q = useAdminStats(formId);
  return { ...q, data: q.data?.completionVsAbandonByForm };
}

export function useUtmSources(formId?: number) {
  const q = useAdminStats(formId);
  return { ...q, data: q.data?.topUtmSources };
}

export function useFunnelData(formId?: number) {
  const q = useAdminStats(formId);
  return { ...q, data: q.data?.conversionFunnel };
}

export function useRecentSessions(formId?: number) {
  const q = useAdminStats(formId);
  return { ...q, data: q.data?.recentSessions };
}

export function useSessionsOverTime(
  period: SessionsOverTimePeriod = 30,
  formId?: number
) {
  return useQuery({
    queryKey: ['admin', 'sessions-over-time', period, formId],
    queryFn: () => getSessionsOverTime(period, formId),
    staleTime: STALE,
    retry: 1,
  });
}

export function useFormsLookup() {
  return useQuery({
    queryKey: ['admin', 'forms-lookup'],
    queryFn: getFormsLookup,
    staleTime: 10 * 60 * 1000, // 10 min
    retry: 1,
  });
}
