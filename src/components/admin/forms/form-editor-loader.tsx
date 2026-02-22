'use client';

import { FormEditor } from '@/components/admin/forms/form-editor';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminForm } from '@/hooks/use-form-queries';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

interface FormEditorLoaderProps {
  slug: string;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-muted-foreground text-sm">
        Formulário não encontrado.
      </p>
      <Button variant="outline" size="sm" className="mt-4" asChild>
        <Link href="/admin/forms">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Voltar para formulários
        </Link>
      </Button>
    </div>
  );
}

export function FormEditorLoader({ slug }: FormEditorLoaderProps) {
  const { data, isLoading, isError } = useAdminForm(slug);

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !data) return <ErrorState />;

  return <FormEditor defaultValues={data} />;
}
