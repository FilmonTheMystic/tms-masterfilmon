'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Palette, Check } from 'lucide-react';
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
  const { currentTheme, changeTheme, getThemesByCategory, isLoading } = useThemeManager();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <Button variant={variant} size={size} disabled>
        <Palette className="h-4 w-4" />
        {showLabel && <span className="ml-2">Theme</span>}
      </Button>
    );
  }

  const themeCategories = getThemesByCategory();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="relative">
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: currentTheme.ring }}
          />
          {showLabel && <span className="ml-2">Theme</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Choose Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {themeCategories.map((category) => (
          <div key={category.category}>
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">
              {category.category}
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {category.themes.map((theme) => (
                <DropdownMenuItem
                  key={theme.id}
                  onClick={() => {
                    changeTheme(theme.id);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    {/* Color Ring */}
                    <div className="relative">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: theme.ring }}
                      />
                      {currentTheme.id === theme.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white drop-shadow-sm" />
                        </div>
                      )}
                    </div>
                    
                    {/* Theme Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{theme.name}</span>
                        {currentTheme.id === theme.id && (
                          <Badge variant="secondary" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Color Preview */}
                  <div className="flex gap-1">
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </div>
        ))}

        <div className="p-2">
          <div className="text-xs text-muted-foreground text-center">
            {themeCategories.reduce((acc, cat) => acc + cat.themes.length, 0)} themes available
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}