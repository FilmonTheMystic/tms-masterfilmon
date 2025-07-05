'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

interface CustomThemeProviderProps extends Omit<ThemeProviderProps, 'children'> {
  children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      themes={['light', 'dark', 'system']}
      disableTransitionOnChange={false}
      enableColorScheme={true}
      storageKey="tms-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}