'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      className={cn(
        'border-neutral-700 bg-neutral-800/60 text-neutral-200 hover:bg-neutral-700 hover:text-white',
        className
      )}
    >
      <ArrowLeft className="mr-2 size-4" />
      Voltar
    </Button>
  );
}
