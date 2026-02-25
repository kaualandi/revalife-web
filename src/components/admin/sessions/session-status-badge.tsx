import type { SessionStatus } from '@/types/api.types';

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  IN_PROGRESS: 'Em progresso',
  APPROVED: 'Aprovada',
  REJECTED: 'Reprovada',
  COMPLETED: 'Concluída',
  ABANDONED: 'Abandonada',
  ERROR: 'Erro',
};

const STATUS_CLASS: Record<SessionStatus, string> = {
  IN_PROGRESS:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  APPROVED:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  ABANDONED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  ERROR:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

interface SessionStatusBadgeProps {
  status: SessionStatus;
  className?: string;
}

export function SessionStatusBadge({
  status,
  className = '',
}: SessionStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[status] ?? ''} ${className}`}
    >
      {SESSION_STATUS_LABELS[status] ?? status}
    </span>
  );
}
