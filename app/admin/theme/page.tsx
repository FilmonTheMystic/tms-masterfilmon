'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Palette, 
  Check, 
  Eye, 
  RefreshCw,
  Info,
  Sparkles
} from 'lucide-react';
import { useTheme, COLOR_PALETTES, type ColorPalette } from '@/lib/hooks/useTheme';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useToast } from '@/lib/hooks/use-toast';

function ColorPreviewCard({ palette, isActive, onSelect, onPreview }: {
  palette: ColorPalette;
  isActive: boolean;
  onSelect: () => void;
  onPreview: () => void;
}) {
  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${
      isActive ? 'ring-2 ring-blue-500' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{palette.name}</CardTitle>
          {isActive && (
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{palette.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Color Swatches */}
        <div className="grid grid-cols-5 gap-2">
          <div className="space-y-1">
            <div 
              className="w-full h-8 rounded border"
              style={{ backgroundColor: palette.colors.primary }}
              title="Primary"
            />
            <div className="text-xs text-center">Primary</div>
          </div>
          <div className="space-y-1">
            <div 
              className="w-full h-8 rounded border"
              style={{ backgroundColor: palette.colors.secondary }}
              title="Secondary"
            />
            <div className="text-xs text-center">Secondary</div>
          </div>
          <div className="space-y-1">
            <div 
              className="w-full h-8 rounded border"
              style={{ backgroundColor: palette.colors.accent }}
              title="Accent"
            />
            <div className="text-xs text-center">Accent</div>
          </div>
          <div className="space-y-1">
            <div 
              className="w-full h-8 rounded border"
              style={{ backgroundColor: palette.colors.muted }}
              title="Muted"
            />
            <div className="text-xs text-center">Muted</div>
          </div>
          <div className="space-y-1">
            <div 
              className="w-full h-8 rounded border"
              style={{ backgroundColor: palette.colors.background }}
              title="Background"
            />
            <div className="text-xs text-center">Background</div>
          </div>
        </div>
        
        {/* Sample UI Elements */}
        <div className="p-3 rounded border" style={{ backgroundColor: palette.colors.background }}>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ 
                backgroundColor: palette.colors.primary, 
                color: palette.colors.primaryForeground 
              }}
            >
              Primary Button
            </div>
            <div 
              className="px-2 py-1 rounded text-xs font-medium border"
              style={{ 
                borderColor: palette.colors.border,
                color: palette.colors.foreground
              }}
            >
              Outline Button
            </div>
          </div>
          <div 
            className="text-sm p-2 rounded"
            style={{ 
              backgroundColor: palette.colors.card,
              color: palette.colors.cardForeground,
              border: `1px solid ${palette.colors.border}`
            }}
          >
            Sample card content with this color scheme
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={onPreview}
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={onSelect}
            variant={isActive ? "secondary" : "default"}
            size="sm" 
            className="flex-1"
            disabled={isActive}
          >
            {isActive ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Applied
              </>
            ) : (
              'Apply Theme'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminThemePage() {
  const { currentPalette, setPalette, isLoading } = useTheme();
  const { isSuperAdmin } = useAdminAuth();
  const { toast } = useToast();
  const [applyingTheme, setApplyingTheme] = useState<string | null>(null);
  
  // Redirect if not super admin
  if (!isSuperAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <Alert variant="destructive">
          <AlertDescription>
            Only super administrators can access theme settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const handleApplyTheme = async (paletteId: string) => {
    if (paletteId === currentPalette.id) return;
    
    try {
      setApplyingTheme(paletteId);
      await setPalette(paletteId);
      
      toast({
        title: 'Theme Applied Successfully!',
        description: `The ${COLOR_PALETTES.find(p => p.id === paletteId)?.name} theme has been applied to the entire application.`,
      });
    } catch (error) {
      console.error('Failed to apply theme:', error);
      toast({
        title: 'Failed to Apply Theme',
        description: 'There was an error applying the theme. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setApplyingTheme(null);
    }
  };
  
  const handlePreviewTheme = (palette: ColorPalette) => {
    // Temporarily apply the theme for preview
    const root = document.documentElement;
    const originalValues: Record<string, string> = {};
    
    // Store original values
    Object.keys(palette.colors).forEach(key => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      originalValues[cssVar] = root.style.getPropertyValue(`--${cssVar}`);
    });
    
    // Apply preview colors
    Object.entries(palette.colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVar}`, value);
    });
    
    toast({
      title: 'Preview Mode',
      description: `Previewing ${palette.name} theme. Refresh the page to return to your current theme.`,
    });
    
    // Revert after 10 seconds
    setTimeout(() => {
      Object.entries(originalValues).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(`--${key}`, value);
        } else {
          root.style.removeProperty(`--${key}`);
        }
      });
    }, 10000);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Palette className="h-6 w-6" />
            Theme Settings
          </h1>
          <p className="text-muted-foreground">
            Customize the appearance of the entire tenant management system
          </p>
        </div>
        
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Preview
        </Button>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Super Admin Only:</strong> Theme changes will be applied system-wide and affect all users. 
          Use the preview feature to test themes before applying them permanently.
        </AlertDescription>
      </Alert>

      {/* Current Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Currently Active Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {Object.entries(currentPalette.colors)
                .slice(0, 5)
                .map(([key, color]) => (
                  <div
                    key={key}
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: color }}
                    title={key}
                  />
                ))
              }
            </div>
            <div>
              <div className="font-semibold">{currentPalette.name}</div>
              <div className="text-sm text-muted-foreground">
                {currentPalette.description}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Themes */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Color Palettes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLOR_PALETTES.map((palette) => (
            <ColorPreviewCard
              key={palette.id}
              palette={palette}
              isActive={palette.id === currentPalette.id}
              onSelect={() => handleApplyTheme(palette.id)}
              onPreview={() => handlePreviewTheme(palette)}
            />
          ))}
        </div>
      </div>

      {/* Loading State */}
      {(isLoading || applyingTheme) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {applyingTheme ? 'Applying Theme...' : 'Loading Theme...'}
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                Please wait while we update the application theme.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
