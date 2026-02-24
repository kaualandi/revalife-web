import { AdminBottomBar } from '@/components/admin/layout/admin-bottom-bar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/layout/admin-sidebar';
import { AdminHeader } from '@/components/admin/layout/admin-header';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { ReactNode } from 'react';

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        {/* Sidebar — oculta no mobile (AppBottomBar cobre) */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        <SidebarInset className="flex min-h-dvh flex-col">
          <AdminHeader />

          <main className="flex-1 overflow-auto p-4 pb-20 md:p-6 md:pb-6">
            {children}
          </main>
        </SidebarInset>

        {/* Bottom bar — apenas mobile */}
        <AdminBottomBar />
      </SidebarProvider>
    </TooltipProvider>
  );
}
