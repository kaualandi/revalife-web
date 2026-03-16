'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/api-admin';

const baseItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
    adminOnly: false,
  },
  {
    label: 'Formulários',
    href: '/admin/forms',
    icon: FileText,
    exact: false,
    adminOnly: false,
  },
  {
    label: 'Sessões',
    href: '/admin/sessions',
    icon: Users,
    exact: false,
    adminOnly: false,
  },
  {
    label: 'Usuários',
    href: '/admin/users',
    icon: UserCog,
    exact: false,
    adminOnly: true,
  },
  {
    label: 'Config.',
    href: '/admin/settings',
    icon: Settings,
    exact: false,
    adminOnly: false,
  },
];

export function AdminBottomBar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  const items = baseItems.filter(
    item => !item.adminOnly || isAdmin || isPending
  );

  return (
    <nav className="border-border bg-background/95 fixed right-0 bottom-0 left-0 z-50 flex h-16 items-stretch border-t backdrop-blur-sm md:hidden">
      {items.map(({ label, href, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'text-xxs! flex flex-1 flex-col items-center justify-center gap-0.5 font-medium transition-colors',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5 transition-transform',
                isActive && 'scale-110'
              )}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
