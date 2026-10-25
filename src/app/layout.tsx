import type { Metadata } from 'next';
import { Outfit, Architects_Daughter } from 'next/font/google';
import './globals.css';
import { memoriesConfig } from '@/config/memories.config';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const architectsDaughter = Architects_Daughter({
  subsets: ['latin'],
  variable: '--font-architects-daughter',
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  title: memoriesConfig.meta.title,
  description: memoriesConfig.meta.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${architectsDaughter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-text-ink font-sans bg-paper selection:bg-accent-pink/30 selection:text-text-ink">
        {children}
      </body>
    </html>
  );
}
