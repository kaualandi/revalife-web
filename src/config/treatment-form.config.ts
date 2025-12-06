import type { FormConfig } from '@/types/form.types';


// Configuração completa do formulário de tratamento médico
export const treatmentFormConfig: FormConfig = {
  steps: [
    // STEP 1: Meta de peso
    {
      id: 'weight-goal',
      title: 'Vamos começar!',
      description: 'Qual é seu objetivo de peso?',
      questions: [
        {
          id: 'weight-goal',
          type: 'radio',
          label: 'Quanto você gostaria de perder?',
          required: true,
          options: [
            { value: '5-10kg', label: '5 a 10 kg' },
            { value: '10-20kg', label: '10 a 20 kg' },
            { value: '20-30kg', label: '20 a 30 kg' },
            { value: 'more-30kg', label: 'Mais de 30 kg' },
          ],
        },
      ],
    },

    // STEP 2: Motivação
    {
      id: 'motivation',
      title: 'Sua motivação',
      description: 'O que te motiva a começar essa jornada?',
      questions: [
        {
          id: 'motivation',
          type: 'radio',
          label: 'Qual é sua principal motivação?',
          required: true,
          options: [
            { value: 'health', label: 'Melhorar minha saúde' },
            { value: 'self-esteem', label: 'Aumentar minha autoestima' },
            { value: 'clothes', label: 'Vestir roupas que eu gosto' },
            { value: 'medical', label: 'Recomendação médica' },
            { value: 'quality-life', label: 'Qualidade de vida' },
            { value: 'other', label: 'Outro motivo' },
          ],
        },
      ],
    },

    // STEP 3: Tentativas anteriores
    {
      id: 'previous-treatments',
      title: 'Histórico de tratamentos',
      questions: [
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
          showWhen: {
            questionId: 'has-tried-before',
            operator: 'equals',
            value: 'yes',
          },
          options: [
            { value: 'diet', label: 'Dieta restritiva' },
            { value: 'gym', label: 'Academia/Exercícios' },
            { value: 'supplements', label: 'Suplementos' },
            { value: 'medication', label: 'Medicação para emagrecimento' },
            { value: 'surgery', label: 'Cirurgia bariátrica' },
            { value: 'nutritionist', label: 'Acompanhamento nutricional' },
          ],
        },
      ],
    },

    // STEP 4: Informações biológicas
    {
      id: 'biological-info',
      title: 'Informações pessoais',
      description: 'Precisamos conhecer você melhor',
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
          id: 'biological-sex',
          type: 'radio',
          label: 'Sexo biológico',
          required: true,
          options: [
            { value: 'male', label: 'Masculino' },
            { value: 'female', label: 'Feminino' },
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
          id: 'body-type',
          type: 'radio-image',
          label: 'Qual imagem representa melhor seu corpo atual?',
          required: true,
          grid: {
            cols: 2,
            imageSize: 'lg',
          },
          options: [
            {
              value: 'ectomorph',
              label: 'Ectomorfo',
              image: '/images/body-types/ectomorph.svg',
            },
            {
              value: 'mesomorph',
              label: 'Mesomorfo',
              image: '/images/body-types/mesomorph.svg',
            },
            {
              value: 'endomorph',
              label: 'Endomorfo',
              image: '/images/body-types/endomorph.svg',
            },
            {
              value: 'combined',
              label: 'Combinado',
              image: '/images/body-types/combined.svg',
            },
          ],
        },
      ],
    },

    // STEP 6: Informações de contato
    {
      id: 'contact-info',
      title: 'Dados de contato',
      description: 'Para entrarmos em contato com você',
      questions: [
        {
          id: 'full-name',
          type: 'text',
          label: 'Nome completo',
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
          label: 'Telefone/WhatsApp',
          placeholder: '(00) 00000-0000',
          required: true,
        },
      ],
    },

    // STEP 7: Métricas corporais
    {
      id: 'body-metrics',
      title: 'Suas medidas',
      questions: [
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
          type: 'number',
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
      title: 'Condições de saúde',
      description: 'Informações importantes sobre sua saúde',
      questions: [
        {
          id: 'has-health-conditions',
          type: 'radio',
          label: 'Você tem alguma condição de saúde diagnosticada?',
          required: true,
          options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
          ],
        },
        {
          id: 'health-conditions',
          type: 'checkbox',
          label: 'Quais condições de saúde você possui?',
          required: true,
          showWhen: {
            questionId: 'has-health-conditions',
            operator: 'equals',
            value: 'yes',
          },
          options: [
            { value: 'diabetes-type1', label: 'Diabetes Tipo 1' },
            { value: 'diabetes-type2', label: 'Diabetes Tipo 2' },
            { value: 'hypertension', label: 'Hipertensão' },
            { value: 'thyroid', label: 'Problemas de tireoide' },
            { value: 'heart-disease', label: 'Doença cardíaca' },
            { value: 'cholesterol', label: 'Colesterol alto' },
            { value: 'pcos', label: 'Síndrome dos ovários policísticos (SOP)' },
            { value: 'depression', label: 'Depressão' },
            { value: 'anxiety', label: 'Ansiedade' },
            { value: 'other', label: 'Outra condição' },
          ],
        },
        {
          id: 'health-conditions-other',
          type: 'textarea',
          label: 'Descreva sua(s) outra(s) condição(ões)',
          placeholder: 'Digite aqui...',
          required: true,
          showWhen: {
            all: [
              {
                questionId: 'has-health-conditions',
                operator: 'equals',
                value: 'yes',
              },
              {
                questionId: 'health-conditions',
                operator: 'contains',
                value: 'other',
              },
            ],
          },
        },
      ],
    },

    // STEP 9: Uso de medicamentos
    {
      id: 'medications',
      title: 'Medicamentos',
      questions: [
        {
          id: 'uses-medication',
          type: 'radio',
          label: 'Você usa algum medicamento regularmente?',
          required: true,
          options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
          ],
        },
        {
          id: 'medication-list',
          type: 'textarea',
          label: 'Liste os medicamentos que você usa',
          placeholder: 'Ex: Losartana 50mg - 1x ao dia',
          required: true,
          showWhen: {
            questionId: 'uses-medication',
            operator: 'equals',
            value: 'yes',
          },
          validation: {
            minLength: 5,
            message: 'Por favor, descreva os medicamentos',
          },
        },
      ],
    },

    // STEP 10: Alergias
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

    // STEP 11: Histórico familiar
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

    // STEP 12: Cirurgias e procedimentos
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

    // STEP 13: Histórico com GLP-1 - Tirzepatida
    {
      id: 'tirzepatide-history',
      title: 'Medicamentos GLP-1',
      description: 'Tirzepatida (Mounjaro)',
      questions: [
        {
          id: 'used-tirzepatide',
          type: 'radio',
          label: 'Você já usou Tirzepatida (Mounjaro)?',
          required: true,
          options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
          ],
        },
        {
          id: 'tirzepatide-dosage',
          type: 'radio',
          label: 'Qual foi a dose máxima que você usou?',
          required: true,
          showWhen: {
            questionId: 'used-tirzepatide',
            operator: 'equals',
            value: 'yes',
          },
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
        {
          id: 'tirzepatide-side-effects',
          type: 'checkbox',
          label: 'Você teve algum efeito colateral?',
          required: false,
          showWhen: {
            questionId: 'used-tirzepatide',
            operator: 'equals',
            value: 'yes',
          },
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

    // STEP 14: Histórico com GLP-1 - Semaglutida
    {
      id: 'semaglutide-history',
      title: 'Medicamentos GLP-1',
      description: 'Semaglutida (Ozempic/Wegovy)',
      questions: [
        {
          id: 'used-semaglutide',
          type: 'radio',
          label: 'Você já usou Semaglutida (Ozempic/Wegovy)?',
          required: true,
          options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
          ],
        },
        {
          id: 'semaglutide-dosage',
          type: 'radio',
          label: 'Qual foi a dose máxima que você usou?',
          required: true,
          showWhen: {
            questionId: 'used-semaglutide',
            operator: 'equals',
            value: 'yes',
          },
          options: [
            { value: '0.25mg', label: '0,25 mg' },
            { value: '0.5mg', label: '0,5 mg' },
            { value: '1mg', label: '1 mg' },
            { value: '1.7mg', label: '1,7 mg' },
            { value: '2.4mg', label: '2,4 mg' },
            { value: 'not-sure', label: 'Não tenho certeza' },
          ],
        },
        {
          id: 'semaglutide-side-effects',
          type: 'checkbox',
          label: 'Você teve algum efeito colateral?',
          required: false,
          showWhen: {
            questionId: 'used-semaglutide',
            operator: 'equals',
            value: 'yes',
          },
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

    // STEP 15: Estilo de vida - Atividade física
    {
      id: 'physical-activity',
      title: 'Estilo de vida',
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
        {
          id: 'exercise-types',
          type: 'checkbox',
          label: 'Que tipos de exercício você pratica?',
          required: false,
          showWhen: {
            questionId: 'exercise-frequency',
            operator: 'notEquals',
            value: 'sedentary',
          },
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

    // STEP 16: Hábitos alimentares
    {
      id: 'eating-habits',
      title: 'Hábitos alimentares',
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

    // STEP 17: Sono e estresse
    {
      id: 'sleep-stress',
      title: 'Sono e bem-estar',
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

    // STEP 18: Gravidez (apenas para mulheres)
    {
      id: 'pregnancy',
      title: 'Gravidez e amamentação',
      questions: [
        {
          id: 'is-pregnant',
          type: 'radio',
          label: 'Você está grávida?',
          required: true,
          showWhen: {
            questionId: 'biological-sex',
            operator: 'equals',
            value: 'female',
          },
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
          showWhen: {
            questionId: 'biological-sex',
            operator: 'equals',
            value: 'female',
          },
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
            all: [
              {
                questionId: 'biological-sex',
                operator: 'equals',
                value: 'female',
              },
              {
                questionId: 'is-pregnant',
                operator: 'equals',
                value: 'no',
              },
            ],
          },
          options: [
            { value: 'yes', label: 'Sim' },
            { value: 'no', label: 'Não' },
            { value: 'maybe', label: 'Talvez' },
          ],
        },
      ],
    },

    // STEP 19: Observações finais
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
        {
          id: 'consent',
          type: 'checkbox',
          label: 'Termos e consentimento',
          required: true,
          options: [
            {
              value: 'privacy',
              label:
                'Li e concordo com a Política de Privacidade e Termos de Uso',
            },
            {
              value: 'telehealth',
              label: 'Concordo em receber atendimento via telemedicina',
            },
            {
              value: 'contact',
              label: 'Autorizo contato via WhatsApp, e-mail e telefone',
            },
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
