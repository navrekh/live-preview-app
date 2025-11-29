import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Palette, 
  Type, 
  Layers, 
  RefreshCw,
  Plus,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AppType, FeatureType, ColorTheme } from '@/services/generator/types';

interface CustomizationPanelProps {
  appName: string;
  onAppNameChange: (name: string) => void;
  theme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => void;
  features: FeatureType[];
  onFeaturesChange: (features: FeatureType[]) => void;
  screens: string[];
  onScreensChange: (screens: string[]) => void;
  appType: AppType;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const availableFeatures: { id: FeatureType; label: string; description: string }[] = [
  { id: 'login', label: 'Authentication', description: 'Login, signup, password reset' },
  { id: 'payment', label: 'Payments', description: 'Razorpay integration' },
  { id: 'maps', label: 'Maps', description: 'Google Maps integration' },
  { id: 'notifications', label: 'Push Notifications', description: 'Firebase notifications' },
  { id: 'chat', label: 'In-app Chat', description: 'Real-time messaging' },
  { id: 'social-share', label: 'Social Sharing', description: 'Share to social platforms' },
  { id: 'analytics', label: 'Analytics', description: 'Usage tracking' },
  { id: 'search', label: 'Search', description: 'Full-text search' },
  { id: 'favorites', label: 'Favorites', description: 'Wishlist/bookmarks' },
  { id: 'reviews', label: 'Reviews', description: 'Ratings and reviews' },
];

const screensByAppType: Record<AppType, string[]> = {
  'food-delivery': ['Splash', 'Login', 'Home', 'Restaurant', 'Menu', 'Cart', 'Checkout', 'Orders', 'Tracking', 'Profile'],
  'ecommerce': ['Splash', 'Login', 'Home', 'Categories', 'Product', 'Cart', 'Checkout', 'Orders', 'Wishlist', 'Profile'],
  'social': ['Splash', 'Login', 'Feed', 'Profile', 'Messages', 'Notifications', 'Search', 'CreatePost', 'Settings'],
  'booking': ['Splash', 'Login', 'Home', 'Search', 'Details', 'Booking', 'Confirm', 'MyBookings', 'Profile'],
  'fitness': ['Splash', 'Login', 'Dashboard', 'Workouts', 'Exercise', 'Progress', 'Goals', 'Profile'],
  'travel': ['Splash', 'Login', 'Explore', 'Destination', 'Hotels', 'Flights', 'Booking', 'Trips', 'Profile'],
  'education': ['Splash', 'Login', 'Dashboard', 'Courses', 'Lesson', 'Quiz', 'Progress', 'Certificates', 'Profile'],
  'healthcare': ['Splash', 'Login', 'Home', 'Doctors', 'Appointment', 'Consultation', 'Records', 'Pharmacy', 'Profile'],
};

const presetThemes = [
  { name: 'Blue', primary: '#3F51B5', secondary: '#FF4081', accent: '#00BCD4' },
  { name: 'Orange', primary: '#FF5722', secondary: '#FFC107', accent: '#4CAF50' },
  { name: 'Purple', primary: '#9C27B0', secondary: '#E91E63', accent: '#03A9F4' },
  { name: 'Green', primary: '#4CAF50', secondary: '#FF9800', accent: '#2196F3' },
  { name: 'Teal', primary: '#009688', secondary: '#FF5722', accent: '#673AB7' },
];

export function CustomizationPanel({
  appName,
  onAppNameChange,
  theme,
  onThemeChange,
  features,
  onFeaturesChange,
  screens,
  onScreensChange,
  appType,
  onRegenerate,
  isRegenerating,
}: CustomizationPanelProps) {
  const [openSections, setOpenSections] = useState({
    branding: true,
    colors: false,
    features: false,
    screens: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFeature = (feature: FeatureType) => {
    if (features.includes(feature)) {
      onFeaturesChange(features.filter(f => f !== feature));
    } else {
      onFeaturesChange([...features, feature]);
    }
  };

  const toggleScreen = (screen: string) => {
    if (screens.includes(screen)) {
      onScreensChange(screens.filter(s => s !== screen));
    } else {
      onScreensChange([...screens, screen]);
    }
  };

  const availableScreens = screensByAppType[appType] || screensByAppType['food-delivery'];

  return (
    <div className="w-72 border-l border-border/50 bg-card/30 flex flex-col">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">Customize App</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Modify settings and regenerate
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {/* Branding Section */}
          <Collapsible open={openSections.branding} onOpenChange={() => toggleSection('branding')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Branding</span>
              </div>
              {openSections.branding ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 space-y-3">
              <div>
                <Label htmlFor="appName" className="text-xs text-muted-foreground">App Name</Label>
                <Input
                  id="appName"
                  value={appName}
                  onChange={(e) => onAppNameChange(e.target.value)}
                  className="mt-1 h-9"
                  placeholder="MyApp"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Colors Section */}
          <Collapsible open={openSections.colors} onOpenChange={() => toggleSection('colors')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Colors</span>
              </div>
              {openSections.colors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 space-y-3">
              {/* Preset Themes */}
              <div className="flex flex-wrap gap-2">
                {presetThemes.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => onThemeChange({
                      primary: preset.primary,
                      secondary: preset.secondary,
                      accent: preset.accent,
                    })}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      theme.primary === preset.primary ? 'border-foreground scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: preset.primary }}
                    title={preset.name}
                  />
                ))}
              </div>

              {/* Custom Colors */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.primary}
                    onChange={(e) => onThemeChange({ ...theme, primary: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.secondary}
                    onChange={(e) => onThemeChange({ ...theme, secondary: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">Secondary</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.accent}
                    onChange={(e) => onThemeChange({ ...theme, accent: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">Accent</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Features Section */}
          <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Features</span>
                <span className="text-xs text-muted-foreground">({features.length})</span>
              </div>
              {openSections.features ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 space-y-2">
              {availableFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                  <Switch
                    checked={features.includes(feature.id)}
                    onCheckedChange={() => toggleFeature(feature.id)}
                    className="ml-2"
                  />
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Screens Section */}
          <Collapsible open={openSections.screens} onOpenChange={() => toggleSection('screens')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Screens</span>
                <span className="text-xs text-muted-foreground">({screens.length})</span>
              </div>
              {openSections.screens ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              <div className="flex flex-wrap gap-2">
                {availableScreens.map((screen) => (
                  <button
                    key={screen}
                    onClick={() => toggleScreen(screen)}
                    className={`px-2 py-1 rounded-full text-xs transition-colors ${
                      screens.includes(screen)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {screens.includes(screen) ? (
                      <span className="flex items-center gap-1">
                        {screen}
                        <X className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Plus className="w-3 h-3" />
                        {screen}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      {/* Regenerate Button */}
      <div className="p-4 border-t border-border/50">
        <Button
          variant="gradient"
          className="w-full gap-2"
          onClick={onRegenerate}
          disabled={isRegenerating}
        >
          <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate App'}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Uses 20 credits
        </p>
      </div>
    </div>
  );
}
