import './globals.css';

import { GoogleTagManager } from '@next/third-parties/google';
import { QueryProvider } from '@/providers/query-provider';
import { Archivo } from 'next/font/google';
import type { Metadata } from 'next';

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
        <GoogleTagManager gtmId="GTM-KT4952TW" />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
