// Modern Color Palettes for 2024-2025 based on industry research
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
  // Default TMS Theme
  {
    id: 'default',
    name: 'TMS Blue',
    description: 'Professional blue theme for business applications',
    category: 'Business',
    ring: '#3b82f6',
    colors: {
      primary: '#3b82f6',
      primaryForeground: '#ffffff',
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
      ring: '#3b82f6',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
    },
  },

  // Warm & Comforting - 2025 Trend
  {
    id: 'mocha-mousse',
    name: 'Mocha Mousse',
    description: 'Pantone 2025 inspired warm, comforting earth tones',
    category: 'Earth',
    ring: '#A67C52',
    colors: {
      primary: '#A67C52',
      primaryForeground: '#ffffff',
      secondary: '#F4F1EC',
      secondaryForeground: '#2D1810',
      accent: '#E6D7C7',
      accentForeground: '#2D1810',
      background: '#FEFCFA',
      foreground: '#2D1810',
      muted: '#F4F1EC',
      mutedForeground: '#8B7355',
      card: '#ffffff',
      cardForeground: '#2D1810',
      border: '#E6D7C7',
      input: '#E6D7C7',
      ring: '#A67C52',
      destructive: '#C84A3D',
      destructiveForeground: '#ffffff',
    },
  },

  // Cinnamon Slate - Benjamin Moore 2025
  {
    id: 'cinnamon-slate',
    name: 'Cinnamon Slate',
    description: 'Benjamin Moore 2025 sophisticated earthy palette',
    category: 'Earth',
    ring: '#7A6B5D',
    colors: {
      primary: '#7A6B5D',
      primaryForeground: '#ffffff',
      secondary: '#F0EDE9',
      secondaryForeground: '#2B2520',
      accent: '#E4DDD6',
      accentForeground: '#2B2520',
      background: '#FDFCFB',
      foreground: '#2B2520',
      muted: '#F0EDE9',
      mutedForeground: '#6B5D52',
      card: '#ffffff',
      cardForeground: '#2B2520',
      border: '#E4DDD6',
      input: '#E4DDD6',
      ring: '#7A6B5D',
      destructive: '#B8504A',
      destructiveForeground: '#ffffff',
    },
  },

  // Rumors Red - Behr 2025
  {
    id: 'rumors-red',
    name: 'Rumors Red',
    description: 'Luxurious dark red with sophisticated neutrals',
    category: 'Bold',
    ring: '#8B2635',
    colors: {
      primary: '#8B2635',
      primaryForeground: '#ffffff',
      secondary: '#F5F2F3',
      secondaryForeground: '#1A0E11',
      accent: '#F0E8EA',
      accentForeground: '#1A0E11',
      background: '#FEFEFE',
      foreground: '#1A0E11',
      muted: '#F5F2F3',
      mutedForeground: '#6B5458',
      card: '#ffffff',
      cardForeground: '#1A0E11',
      border: '#F0E8EA',
      input: '#F0E8EA',
      ring: '#8B2635',
      destructive: '#DC2626',
      destructiveForeground: '#ffffff',
    },
  },

  // Canary Yellow - Dulux 2025
  {
    id: 'canary-yellow',
    name: 'Canary Bright',
    description: 'Energetic yellow with balanced neutrals',
    category: 'Vibrant',
    ring: '#F1C232',
    colors: {
      primary: '#F1C232',
      primaryForeground: '#1C1917',
      secondary: '#FEFDF6',
      secondaryForeground: '#1C1917',
      accent: '#FEF9E6',
      accentForeground: '#1C1917',
      background: '#FFFFFE',
      foreground: '#1C1917',
      muted: '#FEFDF6',
      mutedForeground: '#78716C',
      card: '#ffffff',
      cardForeground: '#1C1917',
      border: '#FEF9E6',
      input: '#FEF9E6',
      ring: '#F1C232',
      destructive: '#EF4444',
      destructiveForeground: '#ffffff',
    },
  },

  // Ocean Depths - Nature Inspired
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    description: 'Deep ocean blues with natural greens',
    category: 'Nature',
    ring: '#0891B2',
    colors: {
      primary: '#0891B2',
      primaryForeground: '#ffffff',
      secondary: '#F0F9FF',
      secondaryForeground: '#0C4A6E',
      accent: '#E0F2FE',
      accentForeground: '#0C4A6E',
      background: '#FEFEFE',
      foreground: '#0C4A6E',
      muted: '#F0F9FF',
      mutedForeground: '#0369A1',
      card: '#ffffff',
      cardForeground: '#0C4A6E',
      border: '#E0F2FE',
      input: '#E0F2FE',
      ring: '#0891B2',
      destructive: '#DC2626',
      destructiveForeground: '#ffffff',
    },
  },

  // Forest Zen - Nature Inspired
  {
    id: 'forest-zen',
    name: 'Forest Zen',
    description: 'Calming forest greens with earthy accents',
    category: 'Nature',
    ring: '#059669',
    colors: {
      primary: '#059669',
      primaryForeground: '#ffffff',
      secondary: '#F0FDF4',
      secondaryForeground: '#14532D',
      accent: '#DCFCE7',
      accentForeground: '#14532D',
      background: '#FEFFFE',
      foreground: '#14532D',
      muted: '#F0FDF4',
      mutedForeground: '#16A34A',
      card: '#ffffff',
      cardForeground: '#14532D',
      border: '#DCFCE7',
      input: '#DCFCE7',
      ring: '#059669',
      destructive: '#DC2626',
      destructiveForeground: '#ffffff',
    },
  },

  // Liquid Gradient - Modern Trend
  {
    id: 'liquid-gradient',
    name: 'Liquid Dreams',
    description: 'Gradient-inspired purples and pinks',
    category: 'Gradient',
    ring: '#8B5CF6',
    colors: {
      primary: '#8B5CF6',
      primaryForeground: '#ffffff',
      secondary: '#FAF5FF',
      secondaryForeground: '#581C87',
      accent: '#F3E8FF',
      accentForeground: '#581C87',
      background: '#FEFEFE',
      foreground: '#581C87',
      muted: '#FAF5FF',
      mutedForeground: '#7C3AED',
      card: '#ffffff',
      cardForeground: '#581C87',
      border: '#F3E8FF',
      input: '#F3E8FF',
      ring: '#8B5CF6',
      destructive: '#DC2626',
      destructiveForeground: '#ffffff',
    },
  },

  // Chrome Metallic - Futuristic
  {
    id: 'chrome-metallic',
    name: 'Chrome Edge',
    description: 'Sleek metallic with futuristic dark mode',
    category: 'Metallic',
    ring: '#71717A',
    colors: {
      primary: '#71717A',
      primaryForeground: '#ffffff',
      secondary: '#F4F4F5',
      secondaryForeground: '#18181B',
      accent: '#E4E4E7',
      accentForeground: '#18181B',
      background: '#FAFAFA',
      foreground: '#18181B',
      muted: '#F4F4F5',
      mutedForeground: '#52525B',
      card: '#ffffff',
      cardForeground: '#18181B',
      border: '#E4E4E7',
      input: '#E4E4E7',
      ring: '#71717A',
      destructive: '#EF4444',
      destructiveForeground: '#ffffff',
    },
  },

  // Dark Mode - Chrome
  {
    id: 'dark-chrome',
    name: 'Dark Chrome',
    description: 'Premium dark mode with metallic accents',
    category: 'Dark',
    ring: '#A1A1AA',
    colors: {
      primary: '#A1A1AA',
      primaryForeground: '#09090B',
      secondary: '#27272A',
      secondaryForeground: '#FAFAFA',
      accent: '#3F3F46',
      accentForeground: '#FAFAFA',
      background: '#09090B',
      foreground: '#FAFAFA',
      muted: '#27272A',
      mutedForeground: '#A1A1AA',
      card: '#18181B',
      cardForeground: '#FAFAFA',
      border: '#3F3F46',
      input: '#3F3F46',
      ring: '#A1A1AA',
      destructive: '#F87171',
      destructiveForeground: '#09090B',
    },
  },

  // Coral Sunset - Vibrant Accent
  {
    id: 'coral-sunset',
    name: 'Coral Sunset',
    description: 'Warm coral with complementary neutrals',
    category: 'Vibrant',
    ring: '#FB7185',
    colors: {
      primary: '#FB7185',
      primaryForeground: '#ffffff',
      secondary: '#FFF1F2',
      secondaryForeground: '#881337',
      accent: '#FFE4E6',
      accentForeground: '#881337',
      background: '#FFFFFE',
      foreground: '#881337',
      muted: '#FFF1F2',
      mutedForeground: '#BE185D',
      card: '#ffffff',
      cardForeground: '#881337',
      border: '#FFE4E6',
      input: '#FFE4E6',
      ring: '#FB7185',
      destructive: '#DC2626',
      destructiveForeground: '#ffffff',
    },
  },

  // Retro Wave - 80s Nostalgia
  {
    id: 'retro-wave',
    name: 'Retro Wave',
    description: '80s inspired neon with dark backgrounds',
    category: 'Retro',
    ring: '#EC4899',
    colors: {
      primary: '#EC4899',
      primaryForeground: '#ffffff',
      secondary: '#1E293B',
      secondaryForeground: '#F8FAFC',
      accent: '#312E81',
      accentForeground: '#F8FAFC',
      background: '#0F172A',
      foreground: '#F8FAFC',
      muted: '#1E293B',
      mutedForeground: '#94A3B8',
      card: '#1E293B',
      cardForeground: '#F8FAFC',
      border: '#334155',
      input: '#334155',
      ring: '#EC4899',
      destructive: '#F87171',
      destructiveForeground: '#0F172A',
    },
  },
];