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
      <div className="w-16 h-8 bg-muted rounded-full animate-pulse"></div>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
        ${isDark 
          ? 'bg-slate-800 hover:bg-slate-700' 
          : 'bg-slate-200 hover:bg-slate-300'
        }
      `}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Current: ${isDark ? 'Dark' : 'Light'} mode`}
    >
      <span
        className={`
          inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center
          ${isDark ? 'translate-x-9' : 'translate-x-1'}
        `}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-slate-600" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
      </span>
    </button>
  );
}