import type { FormConfig } from '@/types/form.types';


// Configuração completa do formulário de tratamento médico
export const treatmentFormConfig: FormConfig = {
  steps: [
    // STEP 1: Meta de peso
    {
      id: 'weight-goal',
      title: 'Quantos quilos você gostaria de perder?',
      questions: [
        {
          id: 'weight-goal',
          type: 'radio',
          required: true,
          options: [
            { value: '<5kg', label: 'Menos de 5 kg' },
            { value: '5-10kg', label: 'Entre 5 e 10 kg' },
            { value: '10-20kg', label: 'Entre 10 e 20 kg' },
            { value: '>20kg', label: 'Mais de 20 kg' },
            { value: 'not-sure', label: 'Ainda não tenho um número definido' },
          ],
        },
      ],
    },

    // STEP 2: Motivação
    {
      id: 'motivation',
      title: 'O que está te motivando a começar essa jornada de emagrecimento?',
      questions: [
        {
          id: 'motivation',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'health', label: 'Melhorar minha saúde e bem-estar' },
            {
              value: 'self-esteem',
              label: 'Sentir mais confiança e autoestima',
            },
            { value: 'energy', label: 'Ter mais energia e disposição' },
            { value: 'event', label: 'Me preparar para um evento específico' },
            { value: 'discomfort', label: 'Reduzir desconfortos físicos' },
            { value: 'other', label: 'Outro motivo' },
          ],
        },
      ],
    },

    // STEP 3: Tentativas anteriores
    {
      id: 'previous-treatments',
      title: 'Você já tentou outros tratamentos pra emagrecer antes?',
      questions: [
        {
          id: 'previous-methods',
          type: 'checkbox',
          required: true,
          options: [
            {
              value: 'restrictive-diet',
              label:
                'Dietas restritivas (low carb, cetogênica, jejum intermitente)',
            },
            {
              value: 'prescribed-medication',
              label: 'Medicamentos prescritos por médico',
            },
            { value: 'supplements-teas', label: 'Fórmulas manipuladas e chás' },
            {
              value: 'nutritional-program',
              label: 'Programas de acompanhamento nutricional',
            },
            {
              value: 'bariatric-surgery',
              label: 'Cirurgia bariátrica ou procedimentos estéticos invasivos',
            },
            { value: 'none', label: 'Nunca fiz tratamento específico' },
          ],
        },
      ],
    },

    // STEP 4: Informações biológicas
    // {
    //   id: 'biological-info',
    //   title: 'Qual é seu sexo biológico?',
    //   description: 'Precisamos conhecer você melhor',
    //   questions: [
    //     {
    //       id: 'birthdate',
    //       type: 'date',
    //       label: 'Data de nascimento',
    //       placeholder: 'DD/MM/AAAA',
    //       required: true,
    //       validation: {
    //         maxDate: new Date(),
    //         message: 'Data inválida',
    //       },
    //     },
    //     {
    //       id: 'biological-sex',
    //       type: 'radio',
    //       label: 'Sexo biológico',
    //       required: true,
    //       options: [
    //         { value: 'male', label: 'Masculino' },
    //         { value: 'female', label: 'Feminino' },
    //       ],
    //     },
    //   ],
    // },

    // STEP 4: Sexo biológico
    {
      id: 'biological-info',
      title: 'Qual é seu sexo biológico?',
      questions: [
        {
          id: 'biological-sex',
          type: 'radio',
          required: true,
          options: [
            { value: 'female', label: 'Feminino' },
            { value: 'male', label: 'Masculino' },
          ],
        },
      ],
    },

    // STEP 5: Tipo corporal
    {
      id: 'body-type',
      title: 'Seu tipo corporal',
      questions: [
        {
          id: 'body-type-male',
          type: 'radio-image',
          label:
            'Qual dessas imagens representa melhor o seu corpo atualmente?',
          required: true,
          showWhen: {
            questionId: 'biological-sex',
            operator: 'equals',
            value: 'male',
          },
          grid: {
            cols: 2,
            imageSize: 'lg',
          },
          options: [
            {
              value: 'thin',
              label: 'Magro',
              image: '/images/body-types/male/thin.png',
            },
            {
              value: 'medium',
              label: 'Corpo médio',
              image: '/images/body-types/male/medium.png',
            },
            {
              value: 'large',
              label: 'Corpo grande',
              image: '/images/body-types/male/large.png',
            },
            {
              value: 'overweight',
              label: 'Com sobrepeso',
              image: '/images/body-types/male/overweight.png',
            },
          ],
        },
        {
          id: 'body-type-female',
          type: 'radio-image',
          label: 'Qual imagem representa melhor seu corpo atual?',
          required: true,
          showWhen: {
            questionId: 'biological-sex',
            operator: 'equals',
            value: 'female',
          },
          grid: {
            cols: 2,
            imageSize: 'lg',
          },
          options: [
            {
              value: 'thin',
              label: 'Magra',
              image: '/images/body-types/female/thin.png',
            },
            {
              value: 'medium',
              label: 'Corpo médio',
              image: '/images/body-types/female/medium.png',
            },
            {
              value: 'large',
              label: 'Corpo grande',
              image: '/images/body-types/female/large.png',
            },
            {
              value: 'overweight',
              label: 'Com sobrepeso',
              image: '/images/body-types/female/overweight.png',
            },
          ],
        },
      ],
    },

    // STEP 6: Informações de contato
    {
      id: 'contact-info',
      title: 'Como posso te chamar e qual o melhor jeito de falarmos com você?',
      questions: [
        {
          id: 'full-name',
          type: 'text',
          label: 'Nome',
          placeholder: 'Digite seu nome completo',
          required: true,
          validation: {
            minLength: 3,
            message: 'Nome muito curto',
          },
        },
        {
          id: 'email',
          type: 'email',
          label: 'E-mail',
          placeholder: 'seu@email.com',
          required: true,
        },
        {
          id: 'phone',
          type: 'tel',
          label: 'Celular',
          placeholder: '(00) 00000-0000',
          required: true,
        },
        {
          id: 'consent',
          type: 'consent',
          label: 'Termos e consentimento',
          required: true,
        },
      ],
    },

    // STEP 7: Métricas corporais
    {
      id: 'body-metrics',
      title:
        'Pra começar da forma certa, precisamos entender como está o seu corpo hoje, vamos lá?',
      questions: [
        {
          id: 'birthdate',
          type: 'date',
          label: 'Data de nascimento',
          placeholder: 'DD/MM/AAAA',
          required: true,
          validation: {
            maxDate: new Date(),
            message: 'Data inválida',
          },
        },
        {
          id: 'current-weight',
          type: 'number',
          label: 'Peso atual (kg)',
          placeholder: '70',
          required: true,
          validation: {
            min: 30,
            max: 300,
            message: 'Peso inválido',
          },
        },
        {
          id: 'height',
          type: 'integer',
          label: 'Altura (cm)',
          placeholder: '170',
          required: true,
          validation: {
            min: 100,
            max: 250,
            message: 'Altura inválida',
          },
        },
      ],
    },

    // STEP 8: Condições de saúde
    {
      id: 'health-conditions',
      title: 'Você já foi diagnosticado(a) com alguma dessas condições?',
      questions: [
        {
          id: 'health-conditions',
          type: 'checkbox',
          required: true,
          options: [
            { value: 'diabetes', label: 'Diabetes' },
            { value: 'hypothyroidism', label: 'Hipotireoidismo' },
            { value: 'hypertension', label: 'Hipertensão' },
            { value: 'heart-disease', label: 'Doença cardíaca' },
            { value: 'pancreatitis', label: 'Pancreatite' },
            { value: 'cancer', label: 'Câncer ativo ou recente' },
            { value: 'gastrointestinal', label: 'Doenças gastrointestinais' },
            { value: 'none', label: 'Nenhuma das anteriores' },
          ],
          observation:
            'Isso nos ajuda a identificar cuidado extra onde for necessário.',
        },
      ],
    },

    // STEP 9: Uso de medicamentos
    {
      id: 'medications',
      title: 'Você utiliza algum medicamento de uso regular atualmente?',
      questions: [
        {
          id: 'uses-medication',
          type: 'radio',
          required: true,
          options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
          ],
        },
      ],
    },

    // STEP 10: Tipos de medicamentos
    {
      id: 'medication-types',
      title: 'Quais desses tipos de medicamentos você usa com mais frequência?',
      showWhen: {
        questionId: 'uses-medication',
        operator: 'equals',
        value: 'yes',
      },
      questions: [
        {
          id: 'medication-types',
          type: 'checkbox',
          required: true,
          options: [
            {
              value: 'antidepressants',
              label: 'Antidepressivos (remédios para depressão/ansiedade)',
            },
            {
              value: 'antidiabetics',
              label: 'Antidiabéticos (metformina/insulina/ou similares)',
            },
            { value: 'contraceptives', label: 'Anticoncepcionais' },
            {
              value: 'antihypertensives',
              label: 'Anti-hipertensivos (pressão)',
            },
            { value: 'thyroid-hormone', label: 'Hormônio da tireoide' },
            { value: 'corticosteroids', label: 'Corticoides' },
            { value: 'none', label: 'Nenhum destes' },
          ],
        },
      ],
    },

    // STEP 11: Lista de medicamentos
    {
      id: 'medication-list-step',
      title: 'Me conte, quais medicamentos fazem parte da sua rotina.',
      showWhen: {
        all: [
          {
            questionId: 'uses-medication',
            operator: 'equals',
            value: 'yes',
          },
          {
            questionId: 'medication-types',
            operator: 'contains',
            value: 'none',
          },
        ],
      },
      questions: [
        {
          id: 'medication-list',
          type: 'textarea',
          label: 'Nome, dose e motivo do uso.',
          placeholder: 'Ex: Losartana 50mg - 1x ao dia',
          required: true,
          validation: {
            minLength: 5,
            message: 'Por favor, descreva os medicamentos',
          },
        },
      ],
    },

    // STEP 12: Alergias
    {
      id: 'allergies',
      title: 'Alergias',
      questions: [
        {
          id: 'has-allergies',
          type: 'radio',
          label: 'Você tem alguma alergia a medicamentos?',
          required: true,
          options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
            { value: 'not-sure', label: 'Não tenho certeza' },
          ],
        },
        {
          id: 'allergy-list',
          type: 'textarea',
          label: 'Liste suas alergias',
          placeholder: 'Ex: Penicilina, dipirona...',
          required: true,
          showWhen: {
            questionId: 'has-allergies',
            operator: 'equals',
            value: 'yes',
          },
        },
      ],
    },

    // STEP 13: Histórico familiar
    {
      id: 'family-history',
      title: 'Histórico familiar',
      questions: [
        {
          id: 'family-health-conditions',
          type: 'checkbox',
          label: 'Alguém na sua família tem ou teve alguma dessas condições?',
          required: false,
          options: [
            { value: 'diabetes', label: 'Diabetes' },
            { value: 'obesity', label: 'Obesidade' },
            { value: 'heart-disease', label: 'Doença cardíaca' },
            { value: 'hypertension', label: 'Hipertensão' },
            { value: 'cancer', label: 'Câncer' },
            { value: 'thyroid', label: 'Problemas de tireoide' },
            { value: 'none', label: 'Nenhuma das opções' },
          ],
        },
      ],
    },

    // STEP 14: Cirurgias e procedimentos
    {
      id: 'procedures',
      title: 'Cirurgias e procedimentos',
      questions: [
        {
          id: 'had-surgeries',
          type: 'radio',
          label: 'Você já fez alguma cirurgia?',
          required: true,
          options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
          ],
        },
        {
          id: 'surgery-list',
          type: 'textarea',
          label: 'Descreva as cirurgias realizadas e quando',
          placeholder: 'Ex: Apendicite em 2015',
          required: true,
          showWhen: {
            questionId: 'had-surgeries',
            operator: 'equals',
            value: 'yes',
          },
        },
      ],
    },

    // STEP 15: Histórico com medicações GLP-1
    {
      id: 'glp1-history',
      title: 'Medicamentos GLP-1',
      description:
        'Você já fez uso de alguma dessas medicações em outro momento?\n\nSaber disso ajuda nos a entender como seu corpo pode responder ao tratamento:',
      questions: [
        {
          id: 'glp1-medication',
          type: 'radio',
          label: 'Selecione a medicação que você já usou',
          required: true,
          options: [
            { value: 'tirzepatide', label: 'Tirzepatida (Mounjaro)' },
            { value: 'semaglutide', label: 'Semaglutida (Wegovy ou Ozempic)' },
            { value: 'none', label: 'Não, nunca usei' },
          ],
        },
      ],
    },

    // STEP 16: Tirzepatida - Dosagem
    {
      id: 'tirzepatide-dosage-step',
      title: 'Medicamentos GLP-1',
      description: 'Tirzepatida (Mounjaro)',
      showWhen: {
        questionId: 'glp1-medication',
        operator: 'equals',
        value: 'tirzepatide',
      },
      questions: [
        {
          id: 'tirzepatide-dosage',
          type: 'radio',
          label: 'Qual foi a dose máxima que você usou?',
          required: true,
          options: [
            { value: '2.5mg', label: '2,5 mg' },
            { value: '5mg', label: '5 mg' },
            { value: '7.5mg', label: '7,5 mg' },
            { value: '10mg', label: '10 mg' },
            { value: '12.5mg', label: '12,5 mg' },
            { value: '15mg', label: '15 mg' },
            { value: 'not-sure', label: 'Não tenho certeza' },
          ],
        },
      ],
    },

    // STEP 17: Tirzepatida - Efeitos colaterais
    {
      id: 'tirzepatide-side-effects-step',
      title: 'Medicamentos GLP-1',
      description: 'Tirzepatida (Mounjaro)',
      showWhen: {
        questionId: 'glp1-medication',
        operator: 'equals',
        value: 'tirzepatide',
      },
      questions: [
        {
          id: 'tirzepatide-side-effects',
          type: 'checkbox',
          label: 'Você teve algum efeito colateral?',
          required: false,
          options: [
            { value: 'nausea', label: 'Náusea' },
            { value: 'vomiting', label: 'Vômito' },
            { value: 'diarrhea', label: 'Diarreia' },
            { value: 'constipation', label: 'Constipação' },
            { value: 'fatigue', label: 'Fadiga' },
            { value: 'headache', label: 'Dor de cabeça' },
            { value: 'none', label: 'Nenhum efeito colateral' },
            { value: 'other', label: 'Outro' },
          ],
        },
      ],
    },

    // STEP 18: Semaglutida - Dosagem
    {
      id: 'semaglutide-dosage-step',
      title: 'Medicamentos GLP-1',
      description: 'Semaglutida (Ozempic/Wegovy)',
      showWhen: {
        questionId: 'glp1-medication',
        operator: 'equals',
        value: 'semaglutide',
      },
      questions: [
        {
          id: 'semaglutide-dosage',
          type: 'radio',
          label: 'Qual foi a dose máxima que você usou?',
          required: true,
          options: [
            { value: '0.25mg', label: '0,25 mg' },
            { value: '0.5mg', label: '0,5 mg' },
            { value: '1mg', label: '1 mg' },
            { value: '1.7mg', label: '1,7 mg' },
            { value: '2.4mg', label: '2,4 mg' },
            { value: 'not-sure', label: 'Não tenho certeza' },
          ],
        },
      ],
    },

    // STEP 19: Semaglutida - Efeitos colaterais
    {
      id: 'semaglutide-side-effects-step',
      title: 'Medicamentos GLP-1',
      description: 'Semaglutida (Ozempic/Wegovy)',
      showWhen: {
        questionId: 'glp1-medication',
        operator: 'equals',
        value: 'semaglutide',
      },
      questions: [
        {
          id: 'semaglutide-side-effects',
          type: 'checkbox',
          label: 'Você teve algum efeito colateral?',
          required: false,
          options: [
            { value: 'nausea', label: 'Náusea' },
            { value: 'vomiting', label: 'Vômito' },
            { value: 'diarrhea', label: 'Diarreia' },
            { value: 'constipation', label: 'Constipação' },
            { value: 'fatigue', label: 'Fadiga' },
            { value: 'headache', label: 'Dor de cabeça' },
            { value: 'none', label: 'Nenhum efeito colateral' },
            { value: 'other', label: 'Outro' },
          ],
        },
      ],
    },

    // STEP 20: Frequência de exercícios
    {
      id: 'exercise-frequency',
      title: 'Atividade física',
      questions: [
        {
          id: 'exercise-frequency',
          type: 'radio',
          label: 'Com que frequência você pratica exercícios físicos?',
          required: true,
          options: [
            { value: 'sedentary', label: 'Sedentário (não pratico)' },
            { value: '1-2-week', label: '1-2 vezes por semana' },
            { value: '3-4-week', label: '3-4 vezes por semana' },
            { value: '5-plus-week', label: '5 ou mais vezes por semana' },
            { value: 'daily', label: 'Diariamente' },
          ],
        },
      ],
    },

    // STEP 21: Tipos de exercício
    {
      id: 'exercise-types',
      title: 'Tipos de exercício',
      showWhen: {
        questionId: 'exercise-frequency',
        operator: 'notEquals',
        value: 'sedentary',
      },
      questions: [
        {
          id: 'exercise-types',
          type: 'checkbox',
          label: 'Que tipos de exercício você pratica?',
          required: false,
          options: [
            { value: 'walking', label: 'Caminhada' },
            { value: 'running', label: 'Corrida' },
            { value: 'gym', label: 'Musculação' },
            { value: 'cycling', label: 'Ciclismo' },
            { value: 'swimming', label: 'Natação' },
            { value: 'sports', label: 'Esportes' },
            { value: 'yoga', label: 'Yoga/Pilates' },
            { value: 'other', label: 'Outro' },
          ],
        },
      ],
    },

    // STEP 22: Refeições diárias
    {
      id: 'meals-frequency',
      title: 'Refeições diárias',
      questions: [
        {
          id: 'meals-per-day',
          type: 'radio',
          label: 'Quantas refeições você faz por dia?',
          required: true,
          options: [
            { value: '1-2', label: '1 a 2 refeições' },
            { value: '3', label: '3 refeições' },
            { value: '4-5', label: '4 a 5 refeições' },
            { value: '6-plus', label: '6 ou mais refeições' },
          ],
        },
      ],
    },

    // STEP 23: Restrições alimentares
    {
      id: 'diet-restrictions',
      title: 'Restrições alimentares',
      questions: [
        {
          id: 'diet-restrictions',
          type: 'checkbox',
          label: 'Você segue alguma restrição alimentar?',
          required: false,
          options: [
            { value: 'vegetarian', label: 'Vegetariano' },
            { value: 'vegan', label: 'Vegano' },
            { value: 'gluten-free', label: 'Sem glúten' },
            { value: 'lactose-free', label: 'Sem lactose' },
            { value: 'low-carb', label: 'Low carb' },
            { value: 'keto', label: 'Cetogênica' },
            { value: 'none', label: 'Nenhuma restrição' },
            { value: 'other', label: 'Outra' },
          ],
        },
      ],
    },

    // STEP 24: Sono
    {
      id: 'sleep',
      title: 'Sono',
      questions: [
        {
          id: 'sleep-hours',
          type: 'radio',
          label: 'Quantas horas você dorme por noite em média?',
          required: true,
          options: [
            { value: 'less-4', label: 'Menos de 4 horas' },
            { value: '4-6', label: '4 a 6 horas' },
            { value: '6-8', label: '6 a 8 horas' },
            { value: '8-plus', label: 'Mais de 8 horas' },
          ],
        },
      ],
    },

    // STEP 25: Estresse
    {
      id: 'stress',
      title: 'Nível de estresse',
      questions: [
        {
          id: 'stress-level',
          type: 'radio',
          label: 'Como você avalia seu nível de estresse?',
          required: true,
          options: [
            { value: 'low', label: 'Baixo' },
            { value: 'moderate', label: 'Moderado' },
            { value: 'high', label: 'Alto' },
            { value: 'very-high', label: 'Muito alto' },
          ],
        },
      ],
    },

    // STEP 26: Gravidez (apenas para mulheres)
    {
      id: 'pregnancy',
      title: 'Gravidez e amamentação',
      showWhen: {
        questionId: 'biological-sex',
        operator: 'equals',
        value: 'female',
      },
      questions: [
        {
          id: 'is-pregnant',
          type: 'radio',
          label: 'Você está grávida?',
          required: true,
          options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
            { value: 'not-sure', label: 'Não tenho certeza' },
          ],
        },
        {
          id: 'is-breastfeeding',
          type: 'radio',
          label: 'Você está amamentando?',
          required: true,
          options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
          ],
        },
        {
          id: 'plans-pregnancy',
          type: 'radio',
          label: 'Você planeja engravidar nos próximos 12 meses?',
          required: true,
          showWhen: {
            questionId: 'is-pregnant',
            operator: 'equals',
            value: 'no',
          },
          options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
            { value: 'maybe', label: 'Talvez' },
          ],
        },
      ],
    },

    // STEP 27: Observações finais
    {
      id: 'final-observations',
      title: 'Quase lá!',
      questions: [
        {
          id: 'additional-info',
          type: 'textarea',
          label:
            'Há algo mais que você gostaria que soubéssemos sobre sua saúde ou objetivos?',
          placeholder: 'Escreva aqui qualquer informação adicional...',
          required: false,
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
