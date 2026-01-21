import './globals.css';

import { QueryProvider } from '@/providers/query-provider';
import { Archivo } from 'next/font/google';

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${archivo.variable} font-sans antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
