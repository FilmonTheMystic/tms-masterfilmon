'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/lib/firebase/auth';

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
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
    border: string;
    card: string;
    cardForeground: string;
    destructive: string;
    destructiveForeground: string;
  };
}

// Three professional color palettes for property management
export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'professional-blue',
    name: 'Professional Blue',
    description: 'Classic blue theme with clean whites - perfect for corporate property management',
    colors: {
      primary: '#189de4',
      primaryForeground: '#ffffff',
      secondary: '#52b7e9',
      secondaryForeground: '#ffffff',
      accent: '#146ca4',
      accentForeground: '#ffffff',
      background: '#ffffff',
      foreground: '#242444',
      muted: '#f8f9fa',
      mutedForeground: '#6c7293',
      border: '#e5e7eb',
      card: '#ffffff',
      cardForeground: '#242444',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
    },
  },
  {
    id: 'nature-green',
    name: 'Nature Green',
    description: 'Fresh green palette with warm accents - ideal for sustainable property management',
    colors: {
      primary: '#3bb873',
      primaryForeground: '#ffffff',
      secondary: '#5b9c7a',
      secondaryForeground: '#ffffff',
      accent: '#24ac54',
      accentForeground: '#ffffff',
      background: '#ffffff',
      foreground: '#345454',
      muted: '#f4e8c4',
      mutedForeground: '#5b9c7a',
      border: '#a4d7bb',
      card: '#ffffff',
      cardForeground: '#345454',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
    },
  },
  {
    id: 'sophisticated-brown',
    name: 'Sophisticated Brown',
    description: 'Warm brown and beige tones - sophisticated and trustworthy for premium properties',
    colors: {
      primary: '#8d6e63',
      primaryForeground: '#ffffff',
      secondary: '#a1887f',
      secondaryForeground: '#ffffff',
      accent: '#6d4c41',
      accentForeground: '#ffffff',
      background: '#ffffff',
      foreground: '#3e2723',
      muted: '#d7ccc8',
      mutedForeground: '#6d4c41',
      border: '#d7ccc8',
      card: '#ffffff',
      cardForeground: '#3e2723',
      destructive: '#d32f2f',
      destructiveForeground: '#ffffff',
    },
  },
];

export interface ThemeState {
  currentPalette: ColorPalette;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_PALETTE = COLOR_PALETTES[0]; // Professional Blue as default
const THEME_STORAGE_KEY = 'tms-theme-palette';

export function useTheme(): ThemeState & {
  setPalette: (paletteId: string) => Promise<void>;
  applyPalette: (palette: ColorPalette) => void;
} {
  const [state, setState] = useState<ThemeState>({
    currentPalette: DEFAULT_PALETTE,
    isLoading: true,
    error: null,
  });

  // Apply CSS custom properties to document root
  const applyPalette = (palette: ColorPalette) => {
    const root = document.documentElement;
    
    Object.entries(palette.colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case for CSS variables
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVar}`, value);
    });
    
    // Store in localStorage for persistence
    localStorage.setItem(THEME_STORAGE_KEY, palette.id);
  };

  // Load saved theme on initialization
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Check localStorage first
        const savedPaletteId = localStorage.getItem(THEME_STORAGE_KEY);
        let selectedPalette = DEFAULT_PALETTE;
        
        if (savedPaletteId) {
          const palette = COLOR_PALETTES.find(p => p.id === savedPaletteId);
          if (palette) {
            selectedPalette = palette;
          }
        }
        
        // TODO: In the future, load user's theme preference from Firebase
        // const user = await authService.getCurrentUserData();
        // if (user?.themePreference) {
        //   const palette = COLOR_PALETTES.find(p => p.id === user.themePreference);
        //   if (palette) selectedPalette = palette;
        // }
        
        applyPalette(selectedPalette);
        setState({
          currentPalette: selectedPalette,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Failed to load theme:', error);
        setState({
          currentPalette: DEFAULT_PALETTE,
          isLoading: false,
          error: 'Failed to load theme preferences',
        });
      }
    };

    loadSavedTheme();
  }, []);

  const setPalette = async (paletteId: string): Promise<void> => {
    try {
      const palette = COLOR_PALETTES.find(p => p.id === paletteId);
      if (!palette) {
        throw new Error(`Theme palette '${paletteId}' not found`);
      }
      
      applyPalette(palette);
      setState(prev => ({
        ...prev,
        currentPalette: palette,
        error: null,
      }));
      
      // TODO: Save to user preferences in Firebase
      // const user = await authService.getCurrentUserData();
      // if (user) {
      //   await authService.updateUserProfile(user.id, {
      //     themePreference: paletteId,
      //   });
      // }
    } catch (error) {
      console.error('Failed to set theme palette:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to apply theme palette',
      }));
    }
  };

  return {
    ...state,
    setPalette,
    applyPalette,
  };
}

// Helper function to get all available palettes
export const getAvailablePalettes = (): ColorPalette[] => COLOR_PALETTES;
