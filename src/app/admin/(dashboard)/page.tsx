import { DashboardContent } from '@/components/admin/dashboard/dashboard-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Revalife Admin',
};

export default function AdminDashboardPage() {
  return <DashboardContent />;
}
