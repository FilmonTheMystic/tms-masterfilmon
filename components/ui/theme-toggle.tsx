'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-20 h-8 bg-muted rounded-full animate-pulse"></div>
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-3 w-3 text-amber-500" />;
      case 'dark':
        return <Moon className="h-3 w-3 text-slate-300" />;
      case 'system':
        return <Monitor className="h-3 w-3 text-blue-500" />;
      default:
        return <Monitor className="h-3 w-3 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (theme) {
      case 'light':
        return 'bg-amber-100 hover:bg-amber-200';
      case 'dark':
        return 'bg-slate-800 hover:bg-slate-700';
      case 'system':
        return 'bg-blue-100 hover:bg-blue-200';
      default:
        return 'bg-slate-200 hover:bg-slate-300';
    }
  };

  const getIconPosition = () => {
    switch (theme) {
      case 'light':
        return 'translate-x-1';
      case 'dark':
        return 'translate-x-7';
      case 'system':
        return 'translate-x-13';
      default:
        return 'translate-x-13';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={`
        relative inline-flex h-8 w-20 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
        ${getBackgroundColor()}
      `}
      role="switch"
      aria-checked={resolvedTheme === 'dark'}
      aria-label={`Current theme: ${theme}. Click to cycle themes`}
      title={`Current: ${theme?.charAt(0).toUpperCase() + theme?.slice(1)} mode`}
    >
      <div
        className={`
          relative h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out
          ${getIconPosition()}
        `}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {getThemeIcon()}
        </div>
      </div>
    </button>
  );
}