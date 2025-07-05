'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Monitor, Moon, Sun, Check } from 'lucide-react';

export function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, themes } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <div className="h-4 w-4 animate-pulse bg-muted rounded"></div>
      </Button>
    );
  }

  const getIcon = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'System';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
          {getIcon(theme || 'system')}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {themes.map((availableTheme) => (
          <DropdownMenuItem
            key={availableTheme}
            onClick={() => setTheme(availableTheme)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {getIcon(availableTheme)}
              <span>{getThemeLabel(availableTheme)}</span>
            </div>
            {theme === availableTheme && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}