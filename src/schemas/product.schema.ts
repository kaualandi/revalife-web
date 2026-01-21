import { z } from 'zod';

export const productPricingSchema = z.object({
  originalPrice: z.number(),
  finalPrice: z.number(),
  discountPercent: z.number(),
  installments: z.number(),
  installmentValue: z.number(),
  periodLabel: z.string(),
});

export const productSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  pricing: productPricingSchema,
  hublaUrl: z.string(),
  hublaParams: z.object({
    coupon: z.string(),
    sck: z.string(),
  }),
  images: z.object({
    hero: z.string(),
    details: z.array(z.string()),
  }),
});

export const productsConfigSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;
export type ProductPricing = z.infer<typeof productPricingSchema>;
