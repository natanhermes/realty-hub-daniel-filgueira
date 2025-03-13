import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

import { QueryProvider } from './query-provider';
import Image from 'next/image';
import logo from './assets/logo-gray-dark.png';


const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
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
      <body className={`${geistSans.variable}  antialiased max-w-[1440px] mx-auto`}>
        <QueryProvider>
          {children}
          <footer className="mt-12 border-t border-gray-300 pt-10">
            <Image src={logo} width={140} height={100} alt="Logotipo" className="mx-auto" />
            <p className="text-muted-foreground text-center">
              © 2025 Daniel Filgueira. Todos os direitos reservados.
            </p>
          </footer>
        </QueryProvider>
        <Toaster richColors position="top-right" duration={3000} closeButton />
      </body>
    </html>
  );
}
