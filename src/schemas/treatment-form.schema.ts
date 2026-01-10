import { parseISO, isValid, isBefore, isAfter, isEqual } from 'date-fns';
import type { Question } from '@/types/form.types';
import { z } from 'zod';

// Schema base para validação de data
const dateSchema = z
  .string()
  .min(1, 'Data é obrigatória')
  .refine(
    value => {
      try {
        const date = parseISO(value);
        return isValid(date);
      } catch {
        return false;
      }
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
      // Validação de data mínima
      if (question.validation?.minDate) {
        const minDateStr = question.validation.minDate;
        schema = schema.refine(
          value => {
            const date = parseISO(value as string);
            const minDateParsed = parseISO(minDateStr);
            return isAfter(date, minDateParsed) || isEqual(date, minDateParsed);
          },
          {
            message:
              question.validation.message ||
              `Data deve ser posterior a ${minDateStr}`,
          }
        );
      }
      // Validação de data máxima
      if (question.validation?.maxDate) {
        const maxDateStr = question.validation.maxDate;
        schema = schema.refine(
          value => {
            const date = parseISO(value as string);
            const maxDateParsed = parseISO(maxDateStr);
            return (
              isBefore(date, maxDateParsed) || isEqual(date, maxDateParsed)
            );
          },
          {
            message:
              question.validation.message ||
              `Data deve ser anterior a ${maxDateStr}`,
          }
        );
      }
      break;

    case 'radio':
    case 'radio-image':
      schema = z.string().min(1, 'Selecione uma opção');
      break;

    case 'checkbox':
      schema = z.array(z.string());

      // Validação de mínimo de itens selecionados
      const minSelected = question.validation?.minSelected || 1;
      schema = (schema as z.ZodArray<z.ZodString>).min(
        minSelected,
        question.validation?.message ||
          `Selecione ao menos ${minSelected} opção(ões)`
      );

      // Validação de máximo de itens selecionados
      if (question.validation?.maxSelected) {
        const maxSelected = question.validation.maxSelected;
        schema = (schema as z.ZodArray<z.ZodString>).max(
          maxSelected,
          question.validation.message ||
            `Selecione no máximo ${maxSelected} opção(ões)`
        );
      }
      break;

    case 'text':
      schema = textSchema;
      if (question.validation?.minLength || question.validation?.min) {
        const minValue =
          question.validation.minLength || question.validation.min || 0;
        schema = (schema as z.ZodString).min(
          minValue,
          question.validation.message || `Mínimo de ${minValue} caracteres`
        );
      }
      if (question.validation?.maxLength || question.validation?.max) {
        const maxValue =
          question.validation.maxLength || question.validation.max || 0;
        schema = (schema as z.ZodString).max(
          maxValue,
          question.validation.message || `Máximo de ${maxValue} caracteres`
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
      if (question.validation?.minLength || question.validation?.min) {
        const minValue =
          question.validation.minLength || question.validation.min || 0;
        schema = (schema as z.ZodString).min(
          minValue,
          question.validation.message || `Mínimo de ${minValue} caracteres`
        );
      }
      if (question.validation?.maxLength || question.validation?.max) {
        const maxValue =
          question.validation.maxLength || question.validation.max || 0;
        schema = (schema as z.ZodString).max(
          maxValue,
          question.validation.message || `Máximo de ${maxValue} caracteres`
        );
      }
      break;

    case 'email':
      schema = z.string().email('E-mail inválido');
      break;

    case 'tel':
      schema = z
        .string()
        .regex(
          /^\(?([0-9]{2})\)?[-.\s]?([0-9]{4,5})[-.\s]?([0-9]{4})$/,
          'Telefone inválido'
        );
      break;

    case 'number':
    case 'integer':
      schema = z.string().refine(
        value => {
          const num = Number(value);
          return !isNaN(num);
        },
        { message: 'Número inválido' }
      );

      // Validação de valor mínimo
      if (question.validation?.min !== undefined) {
        const minValue = question.validation.min;
        schema = schema.refine(value => Number(value) >= minValue, {
          message: question.validation?.message || `Valor mínimo: ${minValue}`,
        });
      }

      // Validação de valor máximo
      if (question.validation?.max !== undefined) {
        const maxValue = question.validation.max;
        schema = schema.refine(value => Number(value) <= maxValue, {
          message: question.validation?.message || `Valor máximo: ${maxValue}`,
        });
      }

      // Validação específica para integer (sem decimais)
      if (question.type === 'integer') {
        schema = schema.refine(value => Number.isInteger(Number(value)), {
          message: 'Deve ser um número inteiro',
        });
      }
      break;

    case 'consent':
      schema = z.literal('true', {
        message: 'Você deve aceitar os termos',
      });
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
