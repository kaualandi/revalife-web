import { SessionDetailContent } from '@/components/admin/sessions/session-detail-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalhe da Sessão — Revalife Admin',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminSessionDetailPage({ params }: Props) {
  const { id } = await params;
  return <SessionDetailContent id={Number(id)} />;
}
