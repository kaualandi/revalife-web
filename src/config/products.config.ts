import type { Product } from '@/schemas/product.schema';

/**
 * Configuração dos produtos disponíveis
 *
 * TODO: Futuramente, esses dados virão do backend via API
 * Para adicionar novos produtos, basta adicionar um novo objeto neste array
 * seguindo a estrutura definida no productSchema
 */
export const PRODUCTS: Product[] = [
  {
    id: 'pv4',
    title: 'Tirzepatida 20mg',
    subtitle: 'Plano Personalizado',
    pricing: {
      originalPrice: 1790,
      finalPrice: 1157.5,
      discountPercent: 10,
      installments: 12,
      installmentValue: 166.62,
      periodLabel: '', // no primeiro mês
    },
    hublaUrl: 'https://pay.hub.la/eDorhcMPsn0pFeEPHgkQ',
    hublaParams: {
      coupon: 'BEMVINDO',
      sck: 'null|null|null|null|null',
    },
    images: {
      hero: '/images/product-detail/hero-product.jpg',
      details: [
        '/images/product-detail/detail-1.jpg',
        '/images/product-detail/detail-2.jpg',
      ],
    },
  },
  {
    id: 'pv5',
    title: 'Tirzepatida 20mg',
    subtitle: 'Plano Personalizado - PV5',
    pricing: {
      originalPrice: 0,
      finalPrice: 0,
      discountPercent: 0,
      installments: 12,
      installmentValue: 0,
      periodLabel: '', // no primeiro mês
    },
    hublaUrl: 'https://pay.hub.la/eDorhcMPsn0pFeEPHgkQ',
    hublaParams: {
      coupon: 'BEMVINDO',
      sck: 'null|null|null|null|null',
    },
    images: {
      hero: '/images/product-detail/hero-product.jpg',
      details: [
        '/images/product-detail/detail-1.jpg',
        '/images/product-detail/detail-2.jpg',
      ],
    },
  },
  {
    id: 'pv6',
    title: 'Tirzepatida 20mg',
    subtitle: 'Plano Personalizado - PV6',
    pricing: {
      originalPrice: 0,
      finalPrice: 0,
      discountPercent: 0,
      installments: 12,
      installmentValue: 0,
      periodLabel: '', // no primeiro mês
    },
    hublaUrl: 'https://pay.hub.la/eDorhcMPsn0pFeEPHgkQ',
    hublaParams: {
      coupon: 'BEMVINDO',
      sck: 'null|null|null|null|null',
    },
    images: {
      hero: '/images/product-detail/hero-product.jpg',
      details: [
        '/images/product-detail/detail-1.jpg',
        '/images/product-detail/detail-2.jpg',
      ],
    },
  },
  {
    id: 'pv7',
    title: 'Tirzepatida 20mg',
    subtitle: 'Plano Personalizado - PV7',
    pricing: {
      originalPrice: 0,
      finalPrice: 0,
      discountPercent: 0,
      installments: 12,
      installmentValue: 0,
      periodLabel: '', // no primeiro mês
    },
    hublaUrl: 'https://pay.hub.la/eDorhcMPsn0pFeEPHgkQ',
    hublaParams: {
      coupon: 'BEMVINDO',
      sck: 'null|null|null|null|null',
    },
    images: {
      hero: '/images/product-detail/hero-product.jpg',
      details: [
        '/images/product-detail/detail-1.jpg',
        '/images/product-detail/detail-2.jpg',
      ],
    },
  },
  {
    id: 'pv8',
    title: 'Tirzepatida 20mg',
    subtitle: 'Plano Personalizado - PV8',
    pricing: {
      originalPrice: 0,
      finalPrice: 0,
      discountPercent: 0,
      installments: 12,
      installmentValue: 0,
      periodLabel: '', // no primeiro mês
    },
    hublaUrl: 'https://pay.hub.la/eDorhcMPsn0pFeEPHgkQ',
    hublaParams: {
      coupon: 'BEMVINDO',
      sck: 'null|null|null|null|null',
    },
    images: {
      hero: '/images/product-detail/hero-product.jpg',
      details: [
        '/images/product-detail/detail-1.jpg',
        '/images/product-detail/detail-2.jpg',
      ],
    },
  },
  {
    id: 'pv9',
    title: 'Tirzepatida 20mg',
    subtitle: 'Plano Personalizado - PV9',
    pricing: {
      originalPrice: 0,
      finalPrice: 0,
      discountPercent: 0,
      installments: 12,
      installmentValue: 0,
      periodLabel: '', // no primeiro mês
    },
    hublaUrl: 'https://pay.hub.la/eDorhcMPsn0pFeEPHgkQ',
    hublaParams: {
      coupon: 'BEMVINDO',
      sck: 'null|null|null|null|null',
    },
    images: {
      hero: '/images/product-detail/hero-product.jpg',
      details: [
        '/images/product-detail/detail-1.jpg',
        '/images/product-detail/detail-2.jpg',
      ],
    },
  },
];

/**
 * Busca um produto pelo ID
 *
 * @param productId - ID do produto
 * @returns Produto encontrado ou undefined
 *
 * TODO: Futuramente, substituir por chamada à API do backend
 */
export function getProductById(productId: string): Product | undefined {
  return PRODUCTS.find(product => product.id === productId);
}

/**
 * Retorna todos os produtos disponíveis
 *
 * @returns Array com todos os produtos
 *
 * TODO: Futuramente, substituir por chamada à API do backend
 */
export function getAllProducts(): Product[] {
  return PRODUCTS;
}

/**
 * Listagem de benefícios para a seção "O que está incluso?"
 */
export const WHAT_IS_INCLUDED: string[] = [
  'Avaliação médica por vídeo com médico credenciado, em até 48 horas, 100% online',
  'Definição do plano de tratamento individualizado, após consulta médica',
  'Plano alimentar personalizado, desenvolvido por Renato Cariani e sua equipe',
  'Acompanhamento médico e suporte durante o período do protocolo',
  'Medicamento, se prescrito, individualizado pelo médico e entregue com segurança',
];

/**
 * Listagem de conteúdo para a seção "O que você vai receber?"
 */
export const WHAT_YOU_WILL_RECEIVE: string[] = [
  'Avaliação e Suporte Médico;',
  'Medicação para o seu protocolo;',
  'Kit de Aplicação (Seringa, Agulha Easypoint e Swab de Álcool 70%);',
  'Manual de Aplicação;',
  'Treino Personalizado;',
  'Plano Alimentar.',
];
