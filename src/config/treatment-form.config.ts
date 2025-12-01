import type { FormConfig } from '@/types/form.types';


// Configuração completa do formulário de tratamento
export const treatmentFormConfig: FormConfig = {
  steps: [
    // STEP 1: Informações Básicas (2 perguntas no mesmo step)
    {
      id: 'basic-info',
      title: 'Vamos começar com o básico',
      description: 'Precisamos de algumas informações importantes sobre você',
      questions: [
        {
          id: 'birthdate',
          type: 'date',
          label: 'Data de nascimento',
          placeholder: 'DD/MM/AAAA',
          required: true,
          validation: {
            maxDate: new Date(), // Não pode ser futuro
            message: 'Data inválida',
          },
        },
        {
          id: 'biological-sex',
          type: 'radio',
          label: 'Qual o seu sexo biológico?',
          required: true,
          options: [
            { value: 'male', label: 'Masculino' },
            { value: 'female', label: 'Feminino' },
          ],
        },
      ],
    },

    // STEP 2: Tipo Corporal (radio com imagem)
    {
      id: 'body-type',
      questions: [
        {
          id: 'current-body-type',
          type: 'radio-image',
          label:
            'Qual dessas imagens representa melhor o seu corpo atualmente?',
          required: true,
          grid: {
            cols: 2,
            imageSize: 'lg',
          },
          options: [
            {
              value: 'type-1',
              label: 'Tipo 1',
              image: '/images/body-types/type-1.svg',
            },
            {
              value: 'type-2',
              label: 'Tipo 2',
              image: '/images/body-types/type-2.svg',
            },
            {
              value: 'type-3',
              label: 'Tipo 3',
              image: '/images/body-types/type-3.svg',
            },
            {
              value: 'type-4',
              label: 'Tipo 4',
              image: '/images/body-types/type-4.svg',
            },
          ],
        },
      ],
    },

    // STEP 3: Motivação (radio normal)
    {
      id: 'motivation',
      questions: [
        {
          id: 'weight-loss-motivation',
          type: 'radio',
          label:
            'Agora me conta, o que está te motivando a começar essa jornada de emagrecimento?',
          required: true,
          options: [
            {
              value: 'health',
              label: 'Melhorar minha saúde',
              description: 'Prevenir doenças e ter mais qualidade de vida',
            },
            {
              value: 'self-esteem',
              label: 'Aumentar minha autoestima',
              description: 'Me sentir melhor comigo mesmo(a)',
            },
            {
              value: 'clothes',
              label: 'Vestir roupas que eu gosto',
              description: 'Ter mais opções de estilo',
            },
            {
              value: 'medical',
              label: 'Recomendação médica',
              description: 'Orientação profissional de saúde',
            },
            {
              value: 'other',
              label: 'Outro motivo',
            },
          ],
        },
      ],
    },

    // STEP 4: Exemplo de pergunta condicional
    {
      id: 'conditional-example',
      questions: [
        {
          id: 'motivation-details',
          type: 'textarea',
          label: 'Conte-nos mais sobre sua motivação',
          placeholder: 'Escreva aqui...',
          required: true,
          // Só aparece se escolheu "Outro motivo"
          showWhen: [
            {
              questionId: 'weight-loss-motivation',
              operator: 'equals',
              value: 'other',
            },
          ],
        },
        {
          id: 'has-tried-before',
          type: 'radio',
          label: 'Você já tentou emagrecer antes?',
          required: true,
          options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
          ],
        },
        {
          id: 'previous-methods',
          type: 'checkbox',
          label: 'Quais métodos você já tentou?',
          required: true,
          // Só aparece se respondeu "Sim" na pergunta anterior
          showWhen: [
            {
              questionId: 'has-tried-before',
              operator: 'equals',
              value: 'yes',
            },
          ],
          options: [
            { value: 'diet', label: 'Dieta restritiva' },
            { value: 'gym', label: 'Academia' },
            { value: 'supplements', label: 'Suplementos' },
            { value: 'medication', label: 'Medicação' },
            { value: 'surgery', label: 'Cirurgia bariátrica' },
          ],
        },
      ],
    },
  ],
};

// Helper para pegar um step pelo ID
export const getStepById = (stepId: string) => {
  return treatmentFormConfig.steps.find(step => step.id === stepId);
};

// Helper para pegar uma pergunta pelo ID
export const getQuestionById = (questionId: string) => {
  for (const step of treatmentFormConfig.steps) {
    const question = step.questions.find(q => q.id === questionId);
    if (question) return question;
  }
  return null;
};
