import { FormEditor } from '@/components/admin/forms/form-editor';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Novo Formulário — Revalife Admin',
};

export default function NewFormPage() {
  return <FormEditor />;
}
