import { UserDetailContent } from '@/components/admin/users/user-detail-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalhe do Usuário — Revalife Admin',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;
  return <UserDetailContent id={id} />;
}
