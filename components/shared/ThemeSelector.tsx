'use client';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ThemeSelector as ThemeSelectorDropdown } from '@/components/ui/theme-selector';

interface ThemeSelectorProps {
  variant?: 'toggle' | 'dropdown';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
}

export function ThemeSelector({ 
  variant = 'toggle', 
  size = 'sm', 
  showLabel = false 
}: ThemeSelectorProps) {
  if (variant === 'dropdown') {
    return <ThemeSelectorDropdown />;
  }
  
  return <ThemeToggle />;
}