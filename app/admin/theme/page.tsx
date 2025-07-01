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
import { useTheme } from '@/lib/hooks/useTheme';
import { colorPalettes, type ColorPalette } from '@/lib/themes/palettes';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useToast } from '@/lib/hooks/use-toast';

function ColorPreviewCard({ palette, isActive, onSelect, onPreview }: {
  palette: ColorPalette;
  isActive: boolean;
  onSelect: () => void;
  onPreview: () => void;
}) {
  // Helper to get category emoji
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'System': return '⚙️';
      default: return '🎨';
    }
  };

  return (
    <Card className={`
      group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] overflow-hidden
      ${isActive ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-lg'}
    `}>
      {/* Background Gradient Preview */}
      <div 
        className="h-20 w-full relative overflow-hidden"
        style={{ 
          background: palette.colors.background.includes('gradient') 
            ? palette.colors.background 
            : `linear-gradient(135deg, ${palette.colors.primary}, ${palette.colors.accent})`
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-2 right-2">
          {isActive && (
            <Badge className="bg-white/90 text-green-800 shadow-lg">
              <Check className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-white/80 text-gray-800 text-xs">
            {getCategoryEmoji(palette.category)} {palette.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {palette.name}
          </CardTitle>
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: palette.colors.primary }}
          />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{palette.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Enhanced Color Swatches */}
        <div className="grid grid-cols-6 gap-1.5">
          {[
            { key: 'primary', label: 'Primary', color: palette.colors.primary },
            { key: 'secondary', label: 'Secondary', color: palette.colors.secondary },
            { key: 'accent', label: 'Accent', color: palette.colors.accent },
            { key: 'muted', label: 'Muted', color: palette.colors.muted },
            { key: 'card', label: 'Card', color: palette.colors.card },
            { key: 'background', label: 'BG', color: palette.colors.background }
          ].map(({ key, label, color }) => (
            <div key={key} className="space-y-1 group/swatch">
              <div 
                className="w-full h-10 rounded-lg border-2 border-white shadow-sm transition-transform group-hover/swatch:scale-110"
                style={{ 
                  background: color.includes('gradient') || color.includes('rgba') 
                    ? color 
                    : color
                }}
                title={`${label}: ${color}`}
              />
              <div className="text-[10px] text-center font-medium text-gray-600">{label}</div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Sample UI Preview */}
        <div 
          className="p-4 rounded-xl border-2 shadow-inner overflow-hidden relative"
          style={{ 
            background: palette.colors.background.includes('gradient') 
              ? palette.colors.background 
              : palette.colors.background,
            borderColor: palette.colors.border 
          }}
        >
          {/* Glassmorphic effect for certain themes */}
          {palette.category === 'Glassmorphic' && (
            <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
          )}
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: palette.colors.primary, 
                  color: palette.colors.primaryForeground 
                }}
              >
                Primary Action
              </div>
              <div 
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all hover:shadow-sm"
                style={{ 
                  borderColor: palette.colors.border,
                  color: palette.colors.foreground,
                  backgroundColor: 'transparent'
                }}
              >
                Secondary
              </div>
            </div>
            <div 
              className="text-sm p-3 rounded-lg shadow-sm"
              style={{ 
                backgroundColor: palette.colors.card.includes('rgba') 
                  ? palette.colors.card 
                  : palette.colors.card,
                color: palette.colors.cardForeground,
                border: `1px solid ${palette.colors.border}`
              }}
            >
              <div className="font-medium mb-1">Sample Component</div>
              <div className="text-xs opacity-75">Experience the theme's visual impact</div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={onPreview}
            variant="outline" 
            size="sm" 
            className="flex-1 transition-all hover:scale-105"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={onSelect}
            variant={isActive ? "secondary" : "default"}
            size="sm" 
            className="flex-1 transition-all hover:scale-105"
            disabled={isActive}
            style={!isActive ? {
              backgroundColor: palette.colors.primary,
              color: palette.colors.primaryForeground
            } : undefined}
          >
            {isActive ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Applied
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Apply Theme
              </>
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
        description: `The ${colorPalettes.find(p => p.id === paletteId)?.name} theme has been applied to the entire application.`,
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
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <Palette className="h-6 w-6" />
              Theme Settings
            </h1>
            <p className="text-muted-foreground">
              Choose from clean, professional themes designed for optimal usability
            </p>
          </div>
          
          <div className="hidden lg:flex flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Preview
            </Button>
          </div>
        </div>
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              Available Themes
            </h2>
            <p className="text-muted-foreground mt-1">
              Clean, professional themes for optimal readability and usability
            </p>
          </div>
          <Badge variant="secondary" className="hidden sm:block">
            {colorPalettes.length} Themes
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {colorPalettes.map((palette) => (
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
