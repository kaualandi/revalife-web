'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Formulários', href: '/admin/forms', icon: FileText, exact: false },
  { label: 'Sessões', href: '/admin/sessions', icon: Users, exact: false },
  {
    label: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
    exact: false,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader className="border-sidebar-border border-b">
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-1',
            isCollapsed && 'justify-center px-0'
          )}
        >
          <Image
            src="/images/logo-icon.png"
            width={96}
            height={96}
            alt="Logo Revalife"
            className="size-8 flex-none rounded-lg"
          />
          {!isCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="line-clamp-1 text-sm font-semibold">
                Revalife
              </span>
              <span className="text-xxs text-muted-foreground line-clamp-1">
                Painel Admin
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Nav items */}
      <SidebarContent className="mx-2 mt-2">
        <SidebarMenu>
          {navItems.map(({ label, href, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
                  <Link href={href}>
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
