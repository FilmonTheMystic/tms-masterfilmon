'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Palette, 
  Sun,
  Moon,
  Monitor,
  Info,
  CheckCircle
} from 'lucide-react';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useToast } from '@/lib/hooks/use-toast';

function ThemeCard({ 
  theme, 
  icon: Icon, 
  description, 
  isActive, 
  onSelect 
}: {
  theme: string;
  icon: any;
  description: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <Card className={`
      cursor-pointer transition-all duration-300 hover:shadow-lg
      ${isActive ? 'ring-2 ring-primary shadow-md' : ''}
    `}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`
              p-3 rounded-lg
              ${theme === 'light' ? 'bg-yellow-100 text-yellow-600' : ''}
              ${theme === 'dark' ? 'bg-slate-100 text-slate-600' : ''}
              ${theme === 'system' ? 'bg-blue-100 text-blue-600' : ''}
            `}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold capitalize">{theme}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          {isActive && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </div>
        
        {/* Theme Preview */}
        <div className={`
          p-4 rounded-lg border-2 transition-all
          ${theme === 'light' ? 'bg-white border-gray-200' : ''}
          ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : ''}
          ${theme === 'system' ? 'bg-gradient-to-r from-white to-slate-900 border-gray-300' : ''}
        `}>
          <div className={`
            text-sm
            ${theme === 'light' ? 'text-gray-900' : ''}
            ${theme === 'dark' ? 'text-white' : ''}
            ${theme === 'system' ? 'text-gray-900' : ''}
          `}>
            {theme === 'system' ? 'Adapts to OS setting' : `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme preview`}
          </div>
        </div>
        
        <Button 
          onClick={onSelect}
          variant={isActive ? "secondary" : "default"}
          className="w-full mt-4"
          disabled={isActive}
        >
          {isActive ? 'Currently Active' : `Switch to ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AdminThemePage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { isSuperAdmin } = useAdminAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Redirect if not super admin
  if (!isSuperAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
        <Alert variant="destructive">
          <AlertDescription>
            Only super administrators can access theme settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    
    toast({
      title: 'Theme Changed Successfully!',
      description: `Switched to ${newTheme} theme. The entire application will now use this theme.`,
    });
  };
  
  const themes = [
    {
      id: 'light',
      name: 'Light',
      description: 'Clean and bright theme perfect for daytime use',
      icon: Sun,
    },
    {
      id: 'dark', 
      name: 'Dark',
      description: 'Easy on the eyes for low-light environments',
      icon: Moon,
    },
    {
      id: 'system',
      name: 'System',
      description: 'Automatically matches your operating system preference',
      icon: Monitor,
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <Palette className="h-6 w-6" />
              Theme Settings
            </h1>
            <p className="text-muted-foreground">
              Choose between light, dark, or system theme for optimal usability
            </p>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>System-wide Setting:</strong> Theme changes affect the entire application for all users. 
          The system theme automatically follows your operating system preference.
        </AlertDescription>
      </Alert>

      {/* Current Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Currently Active Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {theme === 'light' && <Sun className="h-6 w-6 text-yellow-600" />}
              {theme === 'dark' && <Moon className="h-6 w-6 text-slate-600" />}
              {theme === 'system' && <Monitor className="h-6 w-6 text-blue-600" />}
              <div>
                <div className="font-semibold capitalize">{theme}</div>
                <div className="text-sm text-muted-foreground">
                  {theme === 'system' 
                    ? `Currently showing ${resolvedTheme} (follows system)`
                    : themes.find(t => t.id === theme)?.description
                  }
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Themes */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              Available Themes
            </h2>
            <p className="text-muted-foreground mt-1">
              Choose the theme that works best for you
            </p>
          </div>
          <Badge variant="secondary" className="hidden sm:block">
            {themes.length} Options
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((themeOption) => (
            <ThemeCard
              key={themeOption.id}
              theme={themeOption.id}
              icon={themeOption.icon}
              description={themeOption.description}
              isActive={theme === themeOption.id}
              onSelect={() => handleThemeChange(themeOption.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
