'use client';

import { QuestionDialog } from '@/components/admin/forms/question-dialog';
import { StepSheet } from '@/components/admin/forms/step-sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { FormConfig, FormStep, Question } from '@/types/form.types';
import { Reorder, useDragControls } from 'framer-motion';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  GripVerticalIcon,
  PencilIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const QUESTION_TYPE_LABELS: Record<string, string> = {
  text: 'Texto',
  email: 'E-mail',
  tel: 'Tel',
  cpf: 'CPF',
  number: 'Número',
  integer: 'Inteiro',
  textarea: 'Textarea',
  date: 'Data',
  radio: 'Radio',
  'radio-image': 'Radio-img',
  checkbox: 'Checkbox',
  consent: 'Consent',
  breather: 'Breather',
};

// ─────────────────────────────────────────────────────────────────────────────
// Question row (draggable)
// ─────────────────────────────────────────────────────────────────────────────

const QuestionRow = memo(function QuestionRow({
  question,
  stepId,
  onEdit,
  onDelete,
}: {
  question: Question;
  stepId: string;
  onEdit: (stepId: string, q: Question) => void;
  onDelete: (stepId: string, id: string) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={question}
      dragListener={false}
      dragControls={controls}
      className="bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1.5"
    >
      <button
        type="button"
        className="text-muted-foreground cursor-grab touch-none"
        onPointerDown={e => controls.start(e)}
      >
        <GripVerticalIcon className="h-3.5 w-3.5" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Badge variant="outline" className="text-xxs shrink-0 font-mono">
          {QUESTION_TYPE_LABELS[question.type] ?? question.type}
        </Badge>
        <span className="truncate text-xs font-medium">
          {question.label || question.id}
        </span>
        {question.required && (
          <span className="text-destructive shrink-0 text-xs">*</span>
        )}
        {question.showWhen && (
          <Badge variant="secondary" className="text-xxs shrink-0">
            cond.
          </Badge>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onEdit(stepId, question)}
        >
          <PencilIcon className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive h-6 w-6"
          onClick={() => onDelete(stepId, question.id)}
        >
          <TrashIcon className="h-3 w-3" />
        </Button>
      </div>
    </Reorder.Item>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Step card (draggable)
// ─────────────────────────────────────────────────────────────────────────────

const StepCard = memo(function StepCard({
  step,
  onEditStep,
  onDeleteStep,
  onEditQuestion,
  onDeleteQuestion,
  onAddQuestion,
  onReorderQuestions,
}: {
  step: FormStep;
  onEditStep: (step: FormStep) => void;
  onDeleteStep: (stepId: string) => void;
  onEditQuestion: (stepId: string, q: Question) => void;
  onDeleteQuestion: (stepId: string, questionId: string) => void;
  onAddQuestion: (stepId: string) => void;
  onReorderQuestions: (stepId: string, questions: Question[]) => void;
}) {
  const controls = useDragControls();
  const [open, setOpen] = useState(true);

  return (
    <Reorder.Item
      value={step}
      dragListener={false}
      dragControls={controls}
      className="list-none"
    >
      <Card className="overflow-hidden">
        <CardHeader className="gap-0 p-0">
          <div className="flex items-center gap-1 px-3">
            {/* Drag handle */}
            <button
              aria-label="Re-ordenar step"
              type="button"
              className="text-muted-foreground cursor-grab touch-none p-0.5"
              onPointerDown={e => controls.start(e)}
            >
              <GripVerticalIcon className="h-4 w-4" />
            </button>

            {/* Collapse toggle */}
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
              onClick={() => setOpen(v => !v)}
            >
              {open ? (
                <ChevronDownIcon className="text-muted-foreground h-4 w-4 shrink-0" />
              ) : (
                <ChevronRightIcon className="text-muted-foreground h-4 w-4 shrink-0" />
              )}
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                {step.title || 'Step sem título'}
              </span>
              <span className="text-muted-foreground shrink-0 font-mono text-xs">
                #{step.id}
              </span>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {step.questions.length}
              </Badge>
              {step.showWhen && (
                <Badge variant="outline" className="text-xxs shrink-0">
                  cond.
                </Badge>
              )}
            </button>

            {/* Step actions */}
            <div className="ml-1 flex shrink-0 items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onEditStep(step)}
              >
                <PencilIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive h-7 w-7"
                onClick={() => onDeleteStep(step.id)}
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {open && (
          <CardContent className="px-3 pt-0">
            <Reorder.Group
              axis="y"
              values={step.questions}
              onReorder={qs => onReorderQuestions(step.id, qs)}
              className="space-y-1.5"
            >
              {step.questions.map(q => (
                <QuestionRow
                  key={q.id}
                  question={q}
                  stepId={step.id}
                  onEdit={onEditQuestion}
                  onDelete={onDeleteQuestion}
                />
              ))}
            </Reorder.Group>

            {step.questions.length === 0 && (
              <p className="text-muted-foreground py-2 text-center text-xs italic">
                Nenhuma pergunta neste step.
              </p>
            )}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 h-7 text-xs"
              onClick={() => onAddQuestion(step.id)}
            >
              <PlusIcon className="mr-1 h-3 w-3" />
              Adicionar pergunta
            </Button>
          </CardContent>
        )}
      </Card>
    </Reorder.Item>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

interface FormSchemaBuilderProps {
  value: FormConfig | undefined;
  onChange: (config: FormConfig) => void;
}

export function FormSchemaBuilder({ value, onChange }: FormSchemaBuilderProps) {
  const steps = value?.steps ?? [];

  // Keep a ref so callbacks never go stale without needing deps on `steps`
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  const allQuestionIds = useMemo(
    () => steps.flatMap(s => s.questions.map(q => q.id)),
    [steps]
  );

  // ── Step sheet state ──
  const [stepSheetOpen, setStepSheetOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<FormStep | null>(null);
  const [isNewStep, setIsNewStep] = useState(false);

  // ── Question dialog state ──
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingInStepId, setEditingInStepId] = useState<string | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);

  // Keep mutable refs for dialog-time flags so saveStep/saveQuestion can be stable
  const isNewStepRef = useRef(isNewStep);
  isNewStepRef.current = isNewStep;
  const isNewQuestionRef = useRef(isNewQuestion);
  isNewQuestionRef.current = isNewQuestion;
  const editingInStepIdRef = useRef(editingInStepId);
  editingInStepIdRef.current = editingInStepId;

  // ── Config updater ──
  const updateConfig = useCallback(
    (newSteps: FormStep[]) => onChange({ steps: newSteps }),
    [onChange]
  );

  // ── Step operations (all stable via stepsRef) ──
  const openNewStep = useCallback(() => {
    setEditingStep(null);
    setIsNewStep(true);
    setStepSheetOpen(true);
  }, []);

  const openEditStep = useCallback((step: FormStep) => {
    setEditingStep(step);
    setIsNewStep(false);
    setStepSheetOpen(true);
  }, []);

  const saveStep = useCallback(
    (saved: FormStep) => {
      if (isNewStepRef.current) {
        updateConfig([...stepsRef.current, saved]);
      } else {
        updateConfig(
          stepsRef.current.map(s =>
            s.id === saved.id ? { ...saved, questions: s.questions } : s
          )
        );
      }
    },
    [updateConfig]
  );

  const deleteStep = useCallback(
    (stepId: string) =>
      updateConfig(stepsRef.current.filter(s => s.id !== stepId)),
    [updateConfig]
  );

  const reorderSteps = useCallback(
    (newSteps: FormStep[]) => updateConfig(newSteps),
    [updateConfig]
  );

  // ── Question operations (all stable via stepsRef) ──
  const openNewQuestion = useCallback((stepId: string) => {
    setEditingQuestion(null);
    setEditingInStepId(stepId);
    setIsNewQuestion(true);
    setQuestionDialogOpen(true);
  }, []);

  const openEditQuestion = useCallback((stepId: string, question: Question) => {
    setEditingQuestion(question);
    setEditingInStepId(stepId);
    setIsNewQuestion(false);
    setQuestionDialogOpen(true);
  }, []);

  const saveQuestion = useCallback(
    (saved: Question) => {
      const stepId = editingInStepIdRef.current;
      if (!stepId) return;
      updateConfig(
        stepsRef.current.map(s => {
          if (s.id !== stepId) return s;
          if (isNewQuestionRef.current) {
            return { ...s, questions: [...s.questions, saved] };
          }
          return {
            ...s,
            questions: s.questions.map(q => (q.id === saved.id ? saved : q)),
          };
        })
      );
    },
    [updateConfig]
  );

  const deleteQuestion = useCallback(
    (stepId: string, questionId: string) =>
      updateConfig(
        stepsRef.current.map(s =>
          s.id === stepId
            ? { ...s, questions: s.questions.filter(q => q.id !== questionId) }
            : s
        )
      ),
    [updateConfig]
  );

  const reorderQuestions = useCallback(
    (stepId: string, questions: Question[]) =>
      updateConfig(
        stepsRef.current.map(s => (s.id === stepId ? { ...s, questions } : s))
      ),
    [updateConfig]
  );

  const closeStepSheet = useCallback(() => setStepSheetOpen(false), []);
  const closeQuestionDialog = useCallback(
    () => setQuestionDialogOpen(false),
    []
  );

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {steps.length} step{steps.length !== 1 ? 's' : ''} ·{' '}
            {allQuestionIds.length} pergunta
            {allQuestionIds.length !== 1 ? 's' : ''}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openNewStep}
          >
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Adicionar step
          </Button>
        </div>

        {steps.length === 0 ? (
          <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <p className="text-muted-foreground text-sm">
              Nenhum step configurado.
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 text-xs"
              onClick={openNewStep}
            >
              <PlusIcon className="mr-1 h-3 w-3" />
              Criar primeiro step
            </Button>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={steps}
            onReorder={reorderSteps}
            className="space-y-3"
          >
            {steps.map(step => (
              <StepCard
                key={step.id}
                step={step}
                onEditStep={openEditStep}
                onDeleteStep={deleteStep}
                onEditQuestion={openEditQuestion}
                onDeleteQuestion={deleteQuestion}
                onAddQuestion={openNewQuestion}
                onReorderQuestions={reorderQuestions}
              />
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Step Sheet */}
      <StepSheet
        step={editingStep}
        isNew={isNewStep}
        open={stepSheetOpen}
        onClose={closeStepSheet}
        onSave={saveStep}
        allQuestionIds={allQuestionIds}
      />

      {/* Question Dialog */}
      <QuestionDialog
        question={editingQuestion}
        isNew={isNewQuestion}
        open={questionDialogOpen}
        onClose={closeQuestionDialog}
        onSave={saveQuestion}
        allQuestionIds={allQuestionIds}
      />
    </>
  );
}
