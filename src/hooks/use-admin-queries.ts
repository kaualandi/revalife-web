import { getAdminStats, getSessionsOverTime } from '@/lib/api-admin';
import type { SessionsOverTimePeriod } from '@/types/admin.types';
import { useQuery } from '@tanstack/react-query';


const STALE = 5 * 60 * 1000; // 5 min

/** Base hook — fetches everything from /admin/stats in one request */
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStats,
    staleTime: STALE,
    retry: 1,
  });
}

export function useAdminOverview() {
  const q = useAdminStats();
  return { ...q, data: q.data?.overview };
}

export function useSessionStatus() {
  const q = useAdminStats();
  return { ...q, data: q.data?.sessionsByStatus };
}

export function useSessionsPerForm() {
  const q = useAdminStats();
  return { ...q, data: q.data?.sessionsByForm };
}

export function useAbandonmentPerForm() {
  const q = useAdminStats();
  return { ...q, data: q.data?.completionVsAbandonByForm };
}

export function useUtmSources() {
  const q = useAdminStats();
  return { ...q, data: q.data?.topUtmSources };
}

export function useFunnelData() {
  const q = useAdminStats();
  return { ...q, data: q.data?.conversionFunnel };
}

export function useRecentSessions() {
  const q = useAdminStats();
  return { ...q, data: q.data?.recentSessions };
}

export function useSessionsOverTime(period: SessionsOverTimePeriod = 30) {
  return useQuery({
    queryKey: ['admin', 'sessions-over-time', period],
    queryFn: () => getSessionsOverTime(period),
    staleTime: STALE,
    retry: 1,
  });
}
