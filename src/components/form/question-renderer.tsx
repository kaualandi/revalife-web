'use client';

import type { Question } from '@/types/form.types';
import type { UseFormReturn } from 'react-hook-form';
import { RadioQuestion } from './questions/radio-question';
import { RadioImageQuestion } from './questions/radio-image-question';
import { DateQuestion } from './questions/date-question';
import { TextareaQuestion } from './questions/textarea-question';
import { CheckboxQuestion } from './questions/checkbox-question';
import { TextQuestion } from './questions/text-question';
import { EmailQuestion } from './questions/email-question';
import { TelQuestion } from './questions/tel-question';
import { NumberQuestion } from './questions/number-question';
import { IntegerQuestion } from './questions/integer-question';
import { ConsentQuestion } from './questions/consent-question';
import { BreatherQuestion } from './questions/breather-question';
import { CpfQuestion } from './questions/cpf-question';

interface QuestionRendererProps {
  question: Question;
  form: UseFormReturn<Record<string, unknown>>;
  onRadioSelect?: () => void;
}

export function QuestionRenderer({
  question,
  form,
  onRadioSelect,
}: QuestionRendererProps) {
  switch (question.type) {
    case 'date':
      return <DateQuestion question={question} form={form} />;

    case 'radio':
      return (
        <RadioQuestion
          question={question}
          form={form}
          onValueChange={onRadioSelect}
        />
      );

    case 'radio-image':
      return (
        <RadioImageQuestion
          question={question}
          form={form}
          onValueChange={onRadioSelect}
        />
      );

    case 'checkbox':
      return <CheckboxQuestion question={question} form={form} />;

    case 'consent':
      return (
        <ConsentQuestion
          question={question}
          form={form}
          onValueChange={onRadioSelect}
        />
      );

    case 'text':
      return <TextQuestion question={question} form={form} />;

    case 'email':
      return <EmailQuestion question={question} form={form} />;

    case 'tel':
      return <TelQuestion question={question} form={form} />;

    case 'cpf':
      return <CpfQuestion question={question} form={form} />;

    case 'number':
      return <NumberQuestion question={question} form={form} />;

    case 'integer':
      return <IntegerQuestion question={question} form={form} />;

    case 'textarea':
      return <TextareaQuestion question={question} form={form} />;

    case 'breather':
      return <BreatherQuestion question={question} form={form} />;

    default:
      return null;
  }
}
