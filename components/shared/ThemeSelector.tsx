'use client';

import { ThemeToggle } from '@/components/ui/theme-toggle';

interface ThemeSelectorProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
}

export function ThemeSelector({ 
  variant = 'ghost', 
  size = 'sm', 
  showLabel = false 
}: ThemeSelectorProps) {
  return <ThemeToggle />;
}