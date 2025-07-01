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
  // 🌊 AURORA GLASSMORPHISM - Ethereal Blues with Glassmorphic Depth
  {
    id: 'aurora-glass',
    name: 'Aurora Glass',
    description: '2025 Ethereal glassmorphism with aurora-inspired blues and cosmic depth',
    category: 'Glassmorphic',
    ring: '#0EA5E9',
    colors: {
      primary: '#0EA5E9',
      primaryForeground: '#ffffff',
      secondary: 'rgba(240, 249, 255, 0.8)',
      secondaryForeground: '#0C4A6E',
      accent: 'rgba(224, 242, 254, 0.9)',
      accentForeground: '#0C4A6E',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      foreground: '#0C4A6E',
      muted: 'rgba(240, 249, 255, 0.6)',
      mutedForeground: '#0369A1',
      card: 'rgba(255, 255, 255, 0.85)',
      cardForeground: '#0C4A6E',
      border: 'rgba(224, 242, 254, 0.5)',
      input: 'rgba(224, 242, 254, 0.7)',
      ring: '#0EA5E9',
      destructive: '#EF4444',
      destructiveForeground: '#ffffff',
    },
  },

  // 🌃 CYBERPUNK NEON - Electric City Vibes
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    description: 'Electric cyberpunk with neon pinks, blues, and deep space blacks',
    category: 'Cyberpunk',
    ring: '#FF007A',
    colors: {
      primary: '#FF007A',
      primaryForeground: '#ffffff',
      secondary: '#1B1B2A',
      secondaryForeground: '#00BFFF',
      accent: '#8C1BFF',
      accentForeground: '#ffffff',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1B1B2A 50%, #0a0a0f 100%)',
      foreground: '#00BFFF',
      muted: 'rgba(27, 27, 42, 0.8)',
      mutedForeground: '#00FFB3',
      card: 'rgba(27, 27, 42, 0.9)',
      cardForeground: '#00BFFF',
      border: 'rgba(255, 0, 122, 0.3)',
      input: 'rgba(27, 27, 42, 0.8)',
      ring: '#FF007A',
      destructive: '#FF6F61',
      destructiveForeground: '#ffffff',
    },
  },

  // 🍃 MOCHA NEUMORPHISM - Pantone 2025 with Soft Shadows
  {
    id: 'mocha-neuro',
    name: 'Mocha Neuro',
    description: 'Pantone 2025 Mocha Mousse with neumorphic depth and tactile shadows',
    category: 'Neumorphic',
    ring: '#A67C52',
    colors: {
      primary: '#A67C52',
      primaryForeground: '#ffffff',
      secondary: '#F4F1EC',
      secondaryForeground: '#2D1810',
      accent: '#E6D7C7',
      accentForeground: '#2D1810',
      background: 'linear-gradient(135deg, #FEFCFA 0%, #F4F1EC 100%)',
      foreground: '#2D1810',
      muted: '#F4F1EC',
      mutedForeground: '#8B7355',
      card: '#F4F1EC',
      cardForeground: '#2D1810',
      border: '#E6D7C7',
      input: '#E6D7C7',
      ring: '#A67C52',
      destructive: '#C84A3D',
      destructiveForeground: '#ffffff',
    },
  },

  // 🔥 BURNT ORANGE MAXIMALISM - Bold 2025 Statement
  {
    id: 'burnt-maximalism',
    name: 'Burnt Maximalism',
    description: '2025 burnt orange maximalism with rich textures and bold contrasts',
    category: 'Maximalist',
    ring: '#EA580C',
    colors: {
      primary: '#EA580C',
      primaryForeground: '#ffffff',
      secondary: '#FFF7ED',
      secondaryForeground: '#9A3412',
      accent: '#FFEDD5',
      accentForeground: '#9A3412',
      background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FED7AA 100%)',
      foreground: '#9A3412',
      muted: '#FFEDD5',
      mutedForeground: '#C2410C',
      card: 'rgba(255, 255, 255, 0.9)',
      cardForeground: '#9A3412',
      border: '#FED7AA',
      input: '#FED7AA',
      ring: '#EA580C',
      destructive: '#DC2626',
      destructiveForeground: '#ffffff',
    },
  },

  // 🌌 COSMIC DARK MATTER - Deep Space Luxury
  {
    id: 'cosmic-dark',
    name: 'Cosmic Dark Matter',
    description: 'Luxurious deep space theme with cosmic purples and stellar accents',
    category: 'Cosmic',
    ring: '#8B5CF6',
    colors: {
      primary: '#8B5CF6',
      primaryForeground: '#ffffff',
      secondary: '#1E1B4B',
      secondaryForeground: '#E0E7FF',
      accent: '#312E81',
      accentForeground: '#E0E7FF',
      background: 'linear-gradient(135deg, #0C0A1B 0%, #1E1B4B 50%, #312E81 100%)',
      foreground: '#E0E7FF',
      muted: 'rgba(30, 27, 75, 0.8)',
      mutedForeground: '#A5B4FC',
      card: 'rgba(30, 27, 75, 0.9)',
      cardForeground: '#E0E7FF',
      border: 'rgba(139, 92, 246, 0.3)',
      input: 'rgba(30, 27, 75, 0.8)',
      ring: '#8B5CF6',
      destructive: '#F87171',
      destructiveForeground: '#1E1B4B',
    },
  },
];