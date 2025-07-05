// app/layout.tsx - Root Layout with Theme System

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeScript } from '@/components/theme-script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TMS - Tenant Management System',
  description: 'Professional property and tenant management solution',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ThemeScript />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <div id="root">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
