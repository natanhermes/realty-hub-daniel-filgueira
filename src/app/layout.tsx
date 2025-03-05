import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "Daniel Filgueira",
  description: "Encontre seu imóvel ideal com Daniel Filgueira - Corretor de imóveis especializado em ajudar você a realizar o sonho da casa própria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
