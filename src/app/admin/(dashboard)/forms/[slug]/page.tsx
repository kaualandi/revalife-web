import { FormEditorLoader } from '@/components/admin/forms/form-editor-loader';
import type { Metadata } from 'next';

interface EditFormPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EditFormPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Editar ${slug} — Revalife Admin`,
  };
}

export default async function EditFormPage({ params }: EditFormPageProps) {
  const { slug } = await params;
  return <FormEditorLoader slug={slug} />;
}
