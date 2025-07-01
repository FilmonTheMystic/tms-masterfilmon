// Clean, professional themes based on modern design systems
export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  category: string;
  ring: string; // Color for the dropdown ring
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    card: string;
    cardForeground: string;
    border: string;
    input: string;
    ring: string;
    destructive: string;
    destructiveForeground: string;
  };
}

export const colorPalettes: ColorPalette[] = [
  // Light Theme - Based on shadcn/ui and Vercel design system
  {
    id: 'light',
    name: 'Light',
    description: 'Clean light theme with excellent readability and modern aesthetics',
    category: 'System',
    ring: '#2563eb',
    colors: {
      primary: '#2563eb',
      primaryForeground: '#f8fafc',
      secondary: '#f1f5f9',
      secondaryForeground: '#0f172a',
      accent: '#f1f5f9',
      accentForeground: '#0f172a',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      card: '#ffffff',
      cardForeground: '#0f172a',
      border: '#e2e8f0',
      input: '#e2e8f0',
      ring: '#2563eb',
      destructive: '#dc2626',
      destructiveForeground: '#f8fafc',
    },
  },

  // Dark Theme - Based on shadcn/ui and Vercel design system
  {
    id: 'dark',
    name: 'Dark',
    description: 'Professional dark theme optimized for reduced eye strain',
    category: 'System',
    ring: '#3b82f6',
    colors: {
      primary: '#3b82f6',
      primaryForeground: '#f8fafc',
      secondary: '#1e293b',
      secondaryForeground: '#f8fafc',
      accent: '#1e293b',
      accentForeground: '#f8fafc',
      background: '#020617',
      foreground: '#f8fafc',
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
      card: '#020617',
      cardForeground: '#f8fafc',
      border: '#1e293b',
      input: '#1e293b',
      ring: '#3b82f6',
      destructive: '#dc2626',
      destructiveForeground: '#f8fafc',
    },
  },

  // System Theme - Auto-adapts based on user preference
  {
    id: 'system',
    name: 'System',
    description: 'Automatically adapts to your system preference (light/dark)',
    category: 'System',
    ring: '#2563eb',
    colors: {
      primary: '#2563eb',
      primaryForeground: '#f8fafc',
      secondary: '#f1f5f9',
      secondaryForeground: '#0f172a',
      accent: '#f1f5f9',
      accentForeground: '#0f172a',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      card: '#ffffff',
      cardForeground: '#0f172a',
      border: '#e2e8f0',
      input: '#e2e8f0',
      ring: '#2563eb',
      destructive: '#dc2626',
      destructiveForeground: '#f8fafc',
    },
  },
];