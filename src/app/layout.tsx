import './globals.css';

import { QueryProvider } from '@/providers/query-provider';
import { Archivo } from 'next/font/google';
import type { Metadata } from 'next';
import Script from 'next/script';

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Revalife+',
  description: 'Dê inicio à sua consulta gratuita com a Revalife+',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${archivo.variable} font-sans antialiased`}>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src="https://load.stape.protocoloemagreser.com.br/d03kprnxtdki.js?"+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','az0y=AA9ZMywjXz0iIDAsIjkoVh9WVlpJSBYeVBsWGwwBER8FBAEZGQkAFRoOFlobAR9eCxk%3D');
            `,
          }}
        />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
