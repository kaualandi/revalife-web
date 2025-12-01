import type { Question } from '@/types/form.types';
import { z } from 'zod';


// Schema base para validação de data
const dateSchema = z
  .string()
  .min(1, 'Data é obrigatória')
  .refine(
    value => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
    { message: 'Data inválida' }
  );

// Schema base para validação de texto
const textSchema = z.string().min(1, 'Campo obrigatório');

// Gera schema Zod dinamicamente baseado em uma pergunta
export const generateQuestionSchema = (question: Question) => {
  let schema: z.ZodTypeAny;

  switch (question.type) {
    case 'date':
      schema = dateSchema;
      if (question.validation?.maxDate) {
        const maxDate = question.validation.maxDate;
        schema = schema.refine(
          value => {
            const date = new Date(value as string);
            return date <= maxDate;
          },
          { message: question.validation.message || 'Data inválida' }
        );
      }
      break;

    case 'radio':
    case 'select':
    case 'radio-image':
      schema = z.string().min(1, 'Selecione uma opção');
      break;

    case 'checkbox':
      schema = z.array(z.string()).min(1, 'Selecione ao menos uma opção');
      break;

    case 'text':
      schema = textSchema;
      if (question.validation?.min) {
        schema = (schema as z.ZodString).min(
          question.validation.min,
          question.validation.message ||
            `Mínimo de ${question.validation.min} caracteres`
        );
      }
      if (question.validation?.max) {
        schema = (schema as z.ZodString).max(
          question.validation.max,
          question.validation.message ||
            `Máximo de ${question.validation.max} caracteres`
        );
      }
      if (question.validation?.pattern) {
        schema = (schema as z.ZodString).regex(
          new RegExp(question.validation.pattern),
          question.validation.message || 'Formato inválido'
        );
      }
      break;

    case 'textarea':
      schema = textSchema;
      if (question.validation?.min) {
        schema = (schema as z.ZodString).min(
          question.validation.min,
          question.validation.message ||
            `Mínimo de ${question.validation.min} caracteres`
        );
      }
      break;

    default:
      schema = z.string();
  }

  // Torna opcional se não for required
  if (!question.required) {
    schema = schema.optional();
  }

  return schema;
};

// Gera schema completo para o formulário baseado em perguntas visíveis
export const generateFormSchema = (questions: Question[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  questions.forEach(question => {
    schemaObject[question.id] = generateQuestionSchema(question);
  });

  return z.object(schemaObject);
};

// Tipo inferido do schema de tratamento
export type TreatmentFormData = z.infer<ReturnType<typeof generateFormSchema>>;
