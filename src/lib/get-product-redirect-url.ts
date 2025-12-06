import type { FormAnswers } from '@/types/form.types';


// Mapeamento de dosagem de Tirzepatida para o produto
const tirzepatidaDosageMap: Record<string, string> = {
  '2.5mg': '2.5mg',
  '5mg': '5mg',
  '7.5mg': '7.5mg',
  '10mg': '10mg',
  '12.5mg': '12.5mg',
  '15mg': '15mg',
  'not-sure': '30mg', // Dose padrão para quando não tem certeza
};

// Mapeamento de dosagem de Semaglutida para o produto
const semaglutidaDosageMap: Record<string, string> = {
  '0.25mg': '20mg',
  '0.5mg': '20mg',
  '1mg': '20mg',
  '1.7mg': '20mg',
  '2.4mg': '20mg',
  'not-sure': '20mg',
};

/**
 * Gera a URL do produto com base nas respostas do formulário
 *
 * Regras:
 * 1. Se usou Semaglutida (used-semaglutide = yes) → 20mg
 * 2. Se usou Tirzepatida (used-tirzepatide = yes) → dosagem baseada em tirzepatide-dosage
 * 3. Caso contrário → 30mg (dose padrão)
 */
export function getProductRedirectUrl(answers: FormAnswers): string {
  const baseUrl =
    'https://revalifemed.com/products/protocolo-de-emagrecimento-revalife-tirzepatida';

  // Pega email e telefone das respostas
  const email = (answers.email as string) || '';
  const phone = (answers.phone as string) || '';

  // Determina a dosagem baseada nas respostas
  let dosage = '30mg'; // Dose padrão

  // Verifica se usou Semaglutida
  if (answers['used-semaglutide'] === 'yes') {
    const semaglutideDosage = answers['semaglutide-dosage'] as string;
    dosage = semaglutidaDosageMap[semaglutideDosage] || '20mg';
  }
  // Se não usou Semaglutida, verifica se usou Tirzepatida
  else if (answers['used-tirzepatide'] === 'yes') {
    const tirzepatideDosage = answers['tirzepatide-dosage'] as string;
    dosage = tirzepatidaDosageMap[tirzepatideDosage] || '30mg';
  }

  // Monta a URL final
  const url = `${baseUrl}-${dosage}-1/?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;

  return url;
}
