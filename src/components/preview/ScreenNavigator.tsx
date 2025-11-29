import React from 'react';
import { ChevronRight, Home, User, ShoppingCart, Search, Settings, LogIn, Smartphone } from 'lucide-react';
import { AppType, ColorTheme } from '@/services/generator/types';

interface ScreenNavigatorProps {
  appType: AppType;
  currentScreen: string;
  onScreenChange: (screen: string) => void;
  theme: ColorTheme;
}

const screensByAppType: Record<AppType, { id: string; name: string; icon: string }[]> = {
  'food-delivery': [
    { id: 'splash', name: 'Splash', icon: '🚀' },
    { id: 'login', name: 'Login', icon: '🔐' },
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'restaurant', name: 'Restaurant', icon: '🍕' },
    { id: 'cart', name: 'Cart', icon: '🛒' },
    { id: 'profile', name: 'Profile', icon: '👤' },
  ],
  'ecommerce': [
    { id: 'splash', name: 'Splash', icon: '🚀' },
    { id: 'login', name: 'Login', icon: '🔐' },
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'product', name: 'Product', icon: '📦' },
    { id: 'cart', name: 'Cart', icon: '🛒' },
    { id: 'profile', name: 'Profile', icon: '👤' },
  ],
  'social': [
    { id: 'splash', name: 'Splash', icon: '🚀' },
    { id: 'login', name: 'Login', icon: '🔐' },
    { id: 'home', name: 'Feed', icon: '📱' },
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'messages', name: 'Messages', icon: '💬' },
  ],
  'booking': [
    { id: 'splash', name: 'Splash', icon: '🚀' },
    { id: 'login', name: 'Login', icon: '🔐' },
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'booking', name: 'Booking', icon: '📅' },
    { id: 'profile', name: 'Profile', icon: '👤' },
  ],
  'fitness': [
    { id: 'splash', name: 'Splash', icon: '🚀' },
    { id: 'login', name: 'Login', icon: '🔐' },
    { id: 'home', name: 'Dashboard', icon: '🏋️' },
    { id: 'workout', name: 'Workout', icon: '💪' },
    { id: 'profile', name: 'Profile', icon: '👤' },
  ],
  'travel': [
    { id: 'splash', name: 'Splash', icon: '🚀' },
    { id: 'login', name: 'Login', icon: '🔐' },
    { id: 'home', name: 'Explore', icon: '🌍' },
    { id: 'booking', name: 'Booking', icon: '✈️' },
    { id: 'profile', name: 'Profile', icon: '👤' },
  ],
  'education': [
    { id: 'splash', name: 'Splash', icon: '🚀' },
    { id: 'login', name: 'Login', icon: '🔐' },
    { id: 'home', name: 'Courses', icon: '📚' },
    { id: 'lesson', name: 'Lesson', icon: '📖' },
    { id: 'profile', name: 'Profile', icon: '👤' },
  ],
  'healthcare': [
    { id: 'splash', name: 'Splash', icon: '🚀' },
    { id: 'login', name: 'Login', icon: '🔐' },
    { id: 'home', name: 'Home', icon: '🏥' },
    { id: 'appointment', name: 'Appointment', icon: '📋' },
    { id: 'profile', name: 'Profile', icon: '👤' },
  ],
};

export function ScreenNavigator({ appType, currentScreen, onScreenChange, theme }: ScreenNavigatorProps) {
  const screens = screensByAppType[appType] || screensByAppType['ecommerce'];

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-3">
      <div className="flex items-center gap-2 mb-3">
        <Smartphone className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-foreground">Screens</h3>
      </div>
      
      <div className="space-y-1">
        {screens.map(screen => (
          <button
            key={screen.id}
            onClick={() => onScreenChange(screen.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
              currentScreen === screen.id 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-base">{screen.icon}</span>
            <span className="text-sm flex-1">{screen.name}</span>
            {currentScreen === screen.id && (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
