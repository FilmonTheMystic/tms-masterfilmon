'use client';

import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useThemeManager } from '@/lib/hooks/useThemeManager';

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
  const { currentTheme, changeTheme, isLoading } = useThemeManager();

  if (isLoading) {
    return (
      <Button variant={variant} size={size} disabled>
        <Sun className="h-4 w-4" />
        {showLabel && <span className="ml-2">Theme</span>}
      </Button>
    );
  }

  const isDark = currentTheme.id === 'dark';
  
  const toggleTheme = () => {
    changeTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={toggleTheme}
      className="relative"
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {showLabel && (
        <span className="ml-2">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </Button>
  );
}