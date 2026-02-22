import { GoogleTagManager } from '@next/third-parties/google';
import { ErrorMessage } from '@/components/ui/error-message';
import { Separator } from '@/components/ui/separator';
import { getProductBySlug } from '@/lib/api-client';
import type { Product } from '@/types/api.types';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import Image from 'next/image';

import { PurchaseButton } from './components/purchase-button';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    return {
      title: product.metaTitle || `${product.title} - ${product.subtitle}`,
      description:
        product.metaDescription ||
        `Tratamento personalizado com ${product.title}. Acompanhamento médico online e suporte completo.`,
      ...(product.form.faviconUrl && {
        icons: {
          icon: product.form.faviconUrl,
        },
      }),
    };
  } catch {
    return {
      title: 'Produto não encontrado',
      description: 'O produto que você está procurando não existe.',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product;
  let error;

  try {
    product = await getProductBySlug(slug);
  } catch (err: unknown) {
    error = err;
  }

  if (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode;

    if (statusCode === 404) {
      return (
        <ErrorMessage
          title="Produto não encontrado"
          message="O produto que você está procurando não existe ou foi removido."
        />
      );
    }

    return (
      <ErrorMessage
        title="Erro ao carregar produto"
        message="Ocorreu um erro ao carregar as informações do produto. Por favor, tente novamente mais tarde."
      />
    );
  }

  if (!product) {
    return (
      <ErrorMessage
        title="Produto não encontrado"
        message="O produto que você está procurando não existe."
      />
    );
  }

  console.log({ product });

  return (
    <div className="min-h-screen bg-white">
      <ProductPageContent product={product} />
      {product.form.gtmId && <GoogleTagManager gtmId={product.form.gtmId} />}
    </div>
  );
}

function ProductPageContent({ product }: { product: Product }) {
  return (
    <div className="min-h-screen space-y-6 px-3 pt-3 pb-3">
      {/* Header Images */}
      <section className="space-y-4">
        {product.showSuggestedBadge && (
          <div className="flex justify-center">
            <Button
              variant="green"
              size="sm"
              className="px-8"
              style={{
                backgroundColor: product.highlightColor,
                color: product.highlightTextColor,
              }}
            >
              Sugerido pra você
            </Button>
          </div>
        )}

        <Image
          src={product.heroImage1Url}
          alt={product.title}
          width={424}
          height={180}
          className="w-full"
          priority
        />
        <Image
          src={product.heroImage2Url}
          alt={product.title}
          width={424}
          height={180}
          className="w-full"
          priority
        />
      </section>

      {/* Card de sugestão */}
      <section>
        <div className="mb-4 rounded-lg bg-gray-100 p-4">
          <div
            className="mb-6 inline-block rounded-full px-8 py-2 text-sm font-medium"
            style={{
              backgroundColor: product.highlightColor,
              color: product.highlightTextColor,
            }}
          >
            Sugestão de tratamento
          </div>

          <h1 className="mb-1 text-2xl font-bold">{product.planInfo.title}</h1>

          <p className="mb-6 text-xl text-gray-700">
            {product.title} - {product.subtitle}
          </p>

          {product.disclaimers.consultation && (
            <p className="mb-4 text-sm text-gray-600">
              {product.disclaimers.consultation}
            </p>
          )}
        </div>

        {product.disclaimers.prescription && (
          <p className="text-sm text-gray-800">
            <b>Esta não é uma prescrição.</b> {product.disclaimers.prescription}
          </p>
        )}
      </section>

      <Separator />

      {/* O que está incluso */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 uppercase">
          O que está incluso no programa?
        </h2>

        <ul className="mt-4 space-y-4">
          {product.whatIsIncluded.map((item, index) => (
            <li key={'included-' + index} className="flex items-center gap-3">
              <div
                className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full"
                style={{ backgroundColor: product.highlightColor }}
              >
                <Check
                  className="size-4"
                  style={{ color: product.highlightTextColor }}
                />
              </div>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        {product.disclaimers.medication && (
          <div className="mt-8">
            <h3 className="mb-2 text-xl font-bold text-gray-900 uppercase">
              Medicamento
            </h3>
            <p className="mb-4 text-gray-700">
              {product.disclaimers.medication}
            </p>
            {product.disclaimers.medicationNote && (
              <p className="text-sm text-gray-600">
                {product.disclaimers.medicationNote}
              </p>
            )}
          </div>
        )}
      </section>

      <Separator />

      {/* Seção de compra */}
      <section>
        {product.discountPercent > 0 && (
          <p className="text-sm" style={{ color: product.priceColor }}>
            {product.discountPercent}% off na primeira compra
          </p>
        )}

        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          {product.planInfo.title}
        </h2>

        {product.planInfo.description && (
          <p className="mb-4 text-gray-600">{product.planInfo.description}</p>
        )}
        {product.planInfo.continuity && (
          <p className="text-sm text-gray-600">{product.planInfo.continuity}</p>
        )}

        {product.finalPrice > 0 && (
          <div className="my-6">
            {product.originalPrice > 0 && (
              <p className="text-sm text-gray-500">
                de{' '}
                <span className="line-through">
                  R${product.originalPrice.toFixed(2)}
                </span>
              </p>
            )}
            <p
              className="text-5xl font-bold"
              style={{ color: product.priceColor }}
            >
              R${product.finalPrice.toFixed(2).replace('.', ',')}
            </p>
            {product.installmentValue > 0 ? (
              <p className="text-gray-600">
                ou {product.installments}x de R$
                {product.installmentValue.toFixed(2).replace('.', ',')}
              </p>
            ) : (
              <p className="text-gray-600">Em até {product.installments}x</p>
            )}
            {product.periodLabel && (
              <p className="text-sm font-medium text-gray-700">
                {product.periodLabel}
              </p>
            )}
          </div>
        )}

        <PurchaseButton product={product} />
      </section>

      <Separator />

      {/* O que você vai receber */}
      <section>
        <Image
          src={product.includedImageUrl}
          alt="O que está incluído no tratamento"
          width={424}
          height={180}
          className="mb-4 w-full"
        />

        <div className="px-4">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            O QUE VOCÊ VAI RECEBER COM O SEU TRATAMENTO?
          </h2>

          <ul className="space-y-4">
            {product.whatYouWillReceive.map((item, index) => (
              <li key={'receive-' + index} className="flex items-center gap-3">
                <div
                  className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full"
                  style={{ backgroundColor: product.highlightColor }}
                >
                  <Check
                    className="size-4"
                    style={{ color: product.highlightTextColor }}
                  />
                </div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Separator />

      {/* Vídeo Section */}
      {product.doctorVideoUrl && (
        <section>
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-900">
            <iframe
              width="100%"
              height="100%"
              src={product.doctorVideoUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
          {(product.doctorName || product.doctorCrm) && (
            <p className="mt-1 text-center text-xs text-gray-600">
              {product.doctorName && <b>{product.doctorName}</b>}
              {product.doctorName && product.doctorCrm && ' - '}
              {product.doctorCrm}
            </p>
          )}
        </section>
      )}

      <Separator />

      {/* Próximos Passos */}
      {product.nextSteps && product.nextSteps.length > 0 && (
        <section className="mb-12">
          <div>
            <h2 className="mb-8 text-3xl font-bold text-gray-900 uppercase">
              Próximos passos
            </h2>

            <p className="mb-8 text-gray-700">
              O Protocolo EmagreSer coordena todas as etapas da sua jornada, com
              acompanhamento profissional e foco em segurança, de forma simples
              e sem burocracia.
            </p>

            <div className="grid gap-8">
              {product.nextSteps.map((step, index) => (
                <div key={`step-${index}`} className="text-center">
                  <div
                    className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: product.highlightColor }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: product.highlightTextColor }}
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>

            {product.footerDisclaimers &&
              product.footerDisclaimers.length > 0 && (
                <div className="mt-8 space-y-2">
                  {product.footerDisclaimers.map((disclaimer, index) => (
                    <p key={index} className="text-xs text-gray-600">
                      {disclaimer}
                    </p>
                  ))}
                </div>
              )}
          </div>
        </section>
      )}
    </div>
  );
}
