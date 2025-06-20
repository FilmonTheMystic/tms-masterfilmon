'use client';

import { useEffect, useState } from 'react';
import { colorPalettes, type ColorPalette } from '@/lib/themes/palettes';

export function useThemeManager() {
  const [currentTheme, setCurrentTheme] = useState<ColorPalette>(colorPalettes[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('tms-theme');
    if (savedThemeId) {
      const savedTheme = colorPalettes.find(theme => theme.id === savedThemeId);
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
    }
    setIsLoading(false);
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    if (isLoading) return;

    const root = document.documentElement;
    const colors = currentTheme.colors;

    // Apply CSS custom properties as OKLCH for Tailwind 4
    root.style.setProperty('--primary', convertToOKLCH(colors.primary));
    root.style.setProperty('--primary-foreground', convertToOKLCH(colors.primaryForeground));
    root.style.setProperty('--secondary', convertToOKLCH(colors.secondary));
    root.style.setProperty('--secondary-foreground', convertToOKLCH(colors.secondaryForeground));
    root.style.setProperty('--accent', convertToOKLCH(colors.accent));
    root.style.setProperty('--accent-foreground', convertToOKLCH(colors.accentForeground));
    root.style.setProperty('--background', convertToOKLCH(colors.background));
    root.style.setProperty('--foreground', convertToOKLCH(colors.foreground));
    root.style.setProperty('--muted', convertToOKLCH(colors.muted));
    root.style.setProperty('--muted-foreground', convertToOKLCH(colors.mutedForeground));
    root.style.setProperty('--card', convertToOKLCH(colors.card));
    root.style.setProperty('--card-foreground', convertToOKLCH(colors.cardForeground));
    root.style.setProperty('--border', convertToOKLCH(colors.border));
    root.style.setProperty('--input', convertToOKLCH(colors.input));
    root.style.setProperty('--ring', convertToOKLCH(colors.ring));
    root.style.setProperty('--destructive', convertToOKLCH(colors.destructive));
    root.style.setProperty('--destructive-foreground', convertToOKLCH(colors.destructiveForeground));

    // Store hex values for direct CSS usage
    root.style.setProperty('--primary-hex', colors.primary);
    root.style.setProperty('--secondary-hex', colors.secondary);
    root.style.setProperty('--accent-hex', colors.accent);
    root.style.setProperty('--background-hex', colors.background);
    root.style.setProperty('--foreground-hex', colors.foreground);
  }, [currentTheme, isLoading]);

  const changeTheme = (themeId: string) => {
    const newTheme = colorPalettes.find(theme => theme.id === themeId);
    if (newTheme) {
      setCurrentTheme(newTheme);
      localStorage.setItem('tms-theme', themeId);
    }
  };

  const getThemesByCategory = () => {
    const categories = Array.from(new Set(colorPalettes.map(theme => theme.category)));
    return categories.map(category => ({
      category,
      themes: colorPalettes.filter(theme => theme.category === category),
    }));
  };

  return {
    currentTheme,
    changeTheme,
    colorPalettes,
    getThemesByCategory,
    isLoading,
  };
}

// Helper function to convert hex to OKLCH for Tailwind 4
function convertToOKLCH(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Simple approximation - in production you might want to use a proper OKLCH conversion library
  // For now, we'll use a simplified approach that works well with common colors
  
  // Convert to linear RGB first
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const rLin = toLinear(r);
  const gLin = toLinear(g);
  const bLin = toLinear(b);
  
  // Calculate lightness (simplified)
  const lightness = 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
  
  // Calculate chroma (simplified)
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = (max - min) * 0.5;
  
  // Calculate hue (simplified)
  let hue = 0;
  if (chroma > 0) {
    if (max === r) {
      hue = ((g - b) / (max - min)) % 6;
    } else if (max === g) {
      hue = (b - r) / (max - min) + 2;
    } else {
      hue = (r - g) / (max - min) + 4;
    }
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`;
}