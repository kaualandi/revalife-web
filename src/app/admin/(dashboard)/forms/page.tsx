import { FormsList } from '@/components/admin/forms/forms-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Formulários — Revalife Admin',
};

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function AdminFormsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Formulários</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Gerencie todos os formulários da plataforma
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/forms/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Formulário
          </Link>
        </Button>
      </div>

      <Suspense fallback={<ListSkeleton />}>
        <FormsList />
      </Suspense>
    </div>
  );
}
