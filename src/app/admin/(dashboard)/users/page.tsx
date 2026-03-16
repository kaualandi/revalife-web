import { UsersContent } from '@/components/admin/users/users-content';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Usuários — Revalife Admin',
};

export default function AdminUsersPage() {
  return (
    <Suspense>
      <UsersContent />
    </Suspense>
  );
}
