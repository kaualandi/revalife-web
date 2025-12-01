'use client';

import type { Question } from '@/types/form.types';
import type { UseFormReturn } from 'react-hook-form';
import { RadioQuestion } from './questions/radio-question';
import { RadioImageQuestion } from './questions/radio-image-question';
import { DateQuestion } from './questions/date-question';
import { TextareaQuestion } from './questions/textarea-question';
import { CheckboxQuestion } from './questions/checkbox-question';

interface QuestionRendererProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
}

export function QuestionRenderer({ question, form }: QuestionRendererProps) {
  switch (question.type) {
    case 'date':
      return <DateQuestion question={question} form={form} />;

    case 'radio':
      return <RadioQuestion question={question} form={form} />;

    case 'radio-image':
      return <RadioImageQuestion question={question} form={form} />;

    case 'checkbox':
      return <CheckboxQuestion question={question} form={form} />;

    case 'textarea':
      return <TextareaQuestion question={question} form={form} />;

    default:
      return null;
  }
}
