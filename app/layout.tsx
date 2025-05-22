import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

import { Montserrat } from 'next/font/google'

import { QueryProvider } from './query-provider';

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const bombalurina = localFont({
  src: './fonts/bombalurina.ttf',
  variable: '--font-bombalurina',
  weight: '100 400 500 600 700 800 900',
});

export const metadata = {
  title: 'Filgueira Imobiliária',
  description: 'Encontre o imóvel dos seus sonhos com facilidade e segurança.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-BR">
      <body className={`${bombalurina.variable} ${montserrat.className} font-normal antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster richColors position="top-right" duration={1000} closeButton />
      </body>
    </html>
  );
}
