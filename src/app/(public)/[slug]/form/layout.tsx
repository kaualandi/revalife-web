import { getFormBySlug } from '@/lib/api-client';
import type { Metadata } from 'next';

interface FormLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: FormLayoutProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const form = await getFormBySlug(slug.toUpperCase());

    return {
      title: form.name || 'Formulário',
      description: form.description || 'Preencha o formulário para continuar',
      ...(form.faviconUrl && {
        icons: {
          icon: form.faviconUrl,
        },
      }),
    };
  } catch {
    return {
      title: 'Formulário',
      description: 'Preencha o formulário para continuar',
    };
  }
}

export default function FormLayout({ children }: FormLayoutProps) {
  return <>{children}</>;
}
