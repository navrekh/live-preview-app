import React, { useState, useMemo } from 'react';
import { AppPreviewProps, PreviewSettings as Settings } from './types';
import { PhoneFrame } from './PhoneFrame';
import { ScreenNavigator } from './ScreenNavigator';
import { PreviewSettings } from './PreviewSettings';
import { ColorTheme } from '@/services/generator/types';

// Import screens
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { FoodHomeScreen } from './screens/food/FoodHomeScreen';
import { RestaurantScreen } from './screens/food/RestaurantScreen';
import { CartScreen } from './screens/food/CartScreen';
import { ProfileScreen } from './screens/food/ProfileScreen';
import { EcommerceHomeScreen } from './screens/ecommerce/EcommerceHomeScreen';
import { SocialFeedScreen } from './screens/social/SocialFeedScreen';

interface ExtendedAppPreviewProps extends AppPreviewProps {
  showNavigator?: boolean;
  showSettings?: boolean;
}

export function AppPreview({
  appType,
  appName,
  theme: initialTheme,
  features,
  currentScreen,
  onScreenChange,
  isGenerating,
  showNavigator = true,
  showSettings = true,
}: ExtendedAppPreviewProps) {
  const [settings, setSettings] = useState<Settings>({
    isDarkMode: false,
    showPayment: true,
    language: 'en',
  });
  const [theme, setTheme] = useState<ColorTheme>(initialTheme);

  // Get the appropriate screen component based on app type and current screen
  const ScreenComponent = useMemo(() => {
    const screenProps = {
      theme,
      appName,
      onNavigate: onScreenChange,
      features,
      isDarkMode: settings.isDarkMode,
    };

    // Common screens
    if (currentScreen === 'splash') {
      return <SplashScreen {...screenProps} />;
    }
    if (currentScreen === 'login' || currentScreen === 'signup') {
      return <LoginScreen {...screenProps} />;
    }

    // App-specific screens
    switch (appType) {
      case 'food-delivery':
        switch (currentScreen) {
          case 'home':
            return <FoodHomeScreen {...screenProps} />;
          case 'restaurant':
            return <RestaurantScreen {...screenProps} />;
          case 'cart':
            return <CartScreen {...screenProps} />;
          case 'profile':
            return <ProfileScreen {...screenProps} />;
          default:
            return <FoodHomeScreen {...screenProps} />;
        }

      case 'ecommerce':
        switch (currentScreen) {
          case 'home':
          case 'product':
          case 'cart':
          case 'profile':
            return <EcommerceHomeScreen {...screenProps} />;
          default:
            return <EcommerceHomeScreen {...screenProps} />;
        }

      case 'social':
        switch (currentScreen) {
          case 'home':
          case 'profile':
          case 'messages':
            return <SocialFeedScreen {...screenProps} />;
          default:
            return <SocialFeedScreen {...screenProps} />;
        }

      default:
        // Generic fallback - show based on app type
        switch (appType) {
          case 'booking':
          case 'healthcare':
            return <FoodHomeScreen {...screenProps} />;
          case 'fitness':
          case 'travel':
          case 'education':
            return <EcommerceHomeScreen {...screenProps} />;
          default:
            return <FoodHomeScreen {...screenProps} />;
        }
    }
  }, [appType, currentScreen, theme, appName, onScreenChange, features, settings.isDarkMode]);

  return (
    <div className="flex gap-4 items-start">
      {/* Phone Preview */}
      <div className="flex-shrink-0">
        <PhoneFrame isGenerating={isGenerating}>
          {ScreenComponent}
        </PhoneFrame>
      </div>

      {/* Side Panel */}
      {(showNavigator || showSettings) && (
        <div className="w-48 space-y-4 hidden lg:block">
          {showNavigator && (
            <ScreenNavigator
              appType={appType}
              currentScreen={currentScreen}
              onScreenChange={onScreenChange}
              theme={theme}
            />
          )}
          
          {showSettings && (
            <PreviewSettings
              isDarkMode={settings.isDarkMode}
              onDarkModeChange={(value) => setSettings(prev => ({ ...prev, isDarkMode: value }))}
              showPayment={settings.showPayment}
              onShowPaymentChange={(value) => setSettings(prev => ({ ...prev, showPayment: value }))}
              theme={theme}
              onThemeChange={setTheme}
              features={features}
            />
          )}
        </div>
      )}
    </div>
  );
}
