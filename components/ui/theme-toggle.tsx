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
      <div className="w-20 h-8 bg-slate-200 rounded-full animate-pulse"></div>
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
        return <Sun className="h-3.5 w-3.5 text-amber-500" />;
      case 'dark':
        return <Moon className="h-3.5 w-3.5 text-slate-300" />;
      case 'system':
        return <Monitor className="h-3.5 w-3.5 text-blue-500" />;
      default:
        return <Monitor className="h-3.5 w-3.5 text-blue-500" />;
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
      <span
        className={`
          inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center
          ${getIconPosition()}
        `}
      >
        {getThemeIcon()}
      </span>
      
      {/* Theme indicators */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <div className={`w-1 h-1 rounded-full transition-opacity ${theme === 'light' ? 'opacity-0' : 'opacity-30'} bg-amber-400`} />
        <div className={`w-1 h-1 rounded-full transition-opacity ${theme === 'dark' ? 'opacity-0' : 'opacity-30'} bg-slate-400`} />
        <div className={`w-1 h-1 rounded-full transition-opacity ${theme === 'system' ? 'opacity-0' : 'opacity-30'} bg-blue-400`} />
      </div>
    </button>
  );
}