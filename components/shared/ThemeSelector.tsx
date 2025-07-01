'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant={variant} size={size} disabled>
        <div className="h-4 w-4 animate-pulse bg-gray-300 rounded"></div>
        {showLabel && <span className="ml-2">Theme</span>}
      </Button>
    );
  }

  const getNextTheme = () => {
    if (theme === 'light') return 'dark';
    if (theme === 'dark') return 'system';
    return 'light';
  };

  const getIcon = () => {
    if (theme === 'system') return Monitor;
    if (resolvedTheme === 'dark') return Sun; // Show sun when dark (to switch to light)
    return Moon; // Show moon when light (to switch to dark)
  };

  const getLabel = () => {
    if (theme === 'system') return 'System';
    if (resolvedTheme === 'dark') return 'Light';
    return 'Dark';
  };

  const Icon = getIcon();

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={() => setTheme(getNextTheme())}
      className="relative"
      title={`Switch to ${getLabel()} theme`}
    >
      <Icon className="h-4 w-4" />
      {showLabel && (
        <span className="ml-2">
          {getLabel()}
        </span>
      )}
    </Button>
  );
}