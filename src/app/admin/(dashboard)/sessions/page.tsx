import { SessionsContent } from '@/components/admin/sessions/sessions-content';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sessões — Revalife Admin',
};

export default function AdminSessionsPage() {
  return (
    <Suspense>
      <SessionsContent />
    </Suspense>
  );
}
