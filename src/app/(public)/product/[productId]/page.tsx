import {
  getProductById,
  WHAT_IS_INCLUDED,
  WHAT_YOU_WILL_RECEIVE,
} from '@/config/products.config';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { Check } from 'lucide-react';
import Image from 'next/image';

// import { ProductAccessValidator } from './components/product-access-validator';
import { PurchaseButton } from './components/purchase-button';

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = getProductById(productId);

  if (!product) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* <ProductAccessValidator productId={productId} /> */}
      <ProductPageContent product={product} />
    </div>
  );
}

function ProductPageContent({
  product,
}: {
  product: NonNullable<ReturnType<typeof getProductById>>;
}) {
  return (
    <div className="min-h-screen space-y-6 px-3 pt-3 pb-3">
      {/* Header Images */}
      <section className="space-y-4">
        <div className="flex justify-center">
          <Button variant="green" size="sm" className="px-8">
            Sugerido pra você
          </Button>
        </div>

        <Image
          src="/images/product-detail/header-1.webp"
          alt={product.title}
          width={424}
          height={180}
          className="w-full"
          priority
        />
        <Image
          src="/images/product-detail/header-2.webp"
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
          <div className="bg-product-green mb-6 inline-block rounded-full px-8 py-2 text-sm font-medium">
            Sugestão de tratamento
          </div>

          <h1 className="mb-1 text-2xl font-bold">
            Plano de Tratamento — 1º Mês
          </h1>

          <p className="mb-6 text-xl text-gray-700">
            {product.title} - {product.subtitle}
          </p>

          <p className="mb-4 text-sm text-gray-600">
            Atenção: A consulta médica será definida após consulta por vídeo com
            médico credenciado.
          </p>
        </div>

        <p className="text-sm text-gray-800">
          <b>Esta não é uma prescrição.</b> O tratamento, incluindo definição de
          medicamentos, dose e duração, será definido após consulta médica, caso
          haja indicação clínica.
        </p>
      </section>

      <Separator />

      {/* O que está incluso */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 uppercase">
          O que está incluso no programa?
        </h2>

        <p className="mb-4 text-gray-700">
          O que você recebe no Protocolo EmagreSer:
        </p>

        <ul className="space-y-4">
          {WHAT_IS_INCLUDED.map((item, index) => (
            <li key={'included-' + index} className="flex items-center gap-3">
              <div className="bg-product-green mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full">
                <Check className="size-4" />
              </div>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <h3 className="mb-2 text-xl font-bold text-gray-900 uppercase">
            Medicamento
          </h3>
          <p className="mb-4 text-gray-700">
            O uso de medicamento não é obrigatório e só será definido após a
            consulta médica, caso haja indicação clínica.
          </p>
          <p className="text-sm text-gray-600">
            *Quando prescrito, o medicamento faz parte do tratamento dentro do
            período contratado.
          </p>
        </div>
      </section>

      <Separator />

      {/* Seção de compra */}
      <section>
        {product.pricing.discountPercent > 0 && (
          <p className="text-primary-green text-sm">
            {product.pricing.discountPercent}% off na primeira compra
          </p>
        )}

        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Plano de Tratamento 1º Mês
        </h2>

        <p className="mb-4 text-gray-600">
          Este valor refere-se ao primeiro ciclo do tratamento, com duração
          aproximada de 6 semanas.
        </p>
        <p className="text-sm text-gray-600">
          A continuidade do tratamento ocorre de forma mensal, sempre com
          acompanhamento médico.
        </p>

        <div className="my-6">
          {product.pricing.originalPrice > 0 && (
            <p className="text-sm text-gray-500">
              de{' '}
              <span className="line-through">
                R${product.pricing.originalPrice.toFixed(2)}
              </span>
            </p>
          )}
          <p className="text-5xl font-bold text-green-600">
            R${product.pricing.finalPrice.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-gray-600">
            ou {product.pricing.installments}x de R$
            {product.pricing.installmentValue.toFixed(2).replace('.', ',')}
          </p>
          {product.pricing.periodLabel && (
            <p className="text-sm font-medium text-gray-700">
              {product.pricing.periodLabel}
            </p>
          )}
        </div>

        <PurchaseButton product={product} />
      </section>

      <Separator />

      {/* O que você vai receber */}
      <section>
        <Image
          src="/images/product-detail/included.webp"
          alt="Mão segurando frasco e mão segurando caixa"
          width={424}
          height={180}
          className="mb-4 w-full"
        />

        <div className="px-4">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            O QUE VOCÊ VAI RECEBER COM O SEU TRATAMENTO?
          </h2>

          <ul className="space-y-4">
            {WHAT_YOU_WILL_RECEIVE.map((item, index) => (
              <li key={'receive-' + index} className="flex items-center gap-3">
                <div className="bg-product-green mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full">
                  <Check className="size-4" />
                </div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Separator />

      {/* Vídeo Section */}
      <section>
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-900">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/tLoNgD3dCvs?si=tPkuSH9cc_Q6R-oj"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0"
          />
        </div>
        <p className="mt-1 text-center text-xs text-gray-600">
          <b>Dr. Thiago Manesco</b> - CRM-170481/SP
        </p>
      </section>

      <Separator />

      {/* Próximos Passos */}
      <section className="mb-12">
        <div>
          <h2 className="mb-8 text-3xl font-bold text-gray-900 uppercase">
            Próximos passos
          </h2>

          <p className="mb-8 text-gray-700">
            O Protocolo EmagreSer coordena todas as etapas da sua jornada, com
            acompanhamento profissional e foco em segurança, de forma simples e
            sem burocracia.
          </p>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C4F547]">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">QUESTIONÁRIO</h3>
              <p className="text-sm text-gray-600">
                Você já preencheu ou está preenchendo
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C4F547]">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">PAGAMENTO</h3>
              <p className="text-sm text-gray-600">Efetue o pagamento</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C4F547]">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">CONSULTA MÉDICA</h3>
              <p className="text-sm text-gray-600">
                Agende sua consulta e efetue sua consulta médica
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C4F547]">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">
                RECEBA SEU MEDICAMENTO
              </h3>
              <p className="text-sm text-gray-600">
                Chegará na sua residência em até 5 dias úteis
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs text-gray-600">
              *Caso o médico parceiro aprove sua prescrição, a Revalife+ realiza
              a intermediação da compra junto a uma farmácia credenciada, com a
              devida retenção da receita médica. *Este material tem caráter
              informativo e não substitui a prescrição médica. O seu tratamento
              será acompanhado pela Revalife e a prescrição será realizada por
              um profissional médico credenciado.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
