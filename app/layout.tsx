import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

import { Poppins } from 'next/font/google'

import { QueryProvider } from './query-provider';

const poppins = Poppins({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const bombalurina = localFont({
  src: './fonts/bombalurina.ttf',
  variable: '--font-bombalurina',
  weight: '100 400 500 600 700 800 900',
});

export const metadata: Metadata = {
  title: 'Daniel Filgueira',
  description:
    'Encontre o imóvel dos seus sonhos com facilidade e segurança.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-BR">
      <body className={`${bombalurina.variable} ${poppins.className} font-normal antialiased`}>
        <QueryProvider>

          {children}
        </QueryProvider>
        <Toaster richColors position="top-right" duration={3000} closeButton />
      </body>
    </html>
  );
}
