// Preview Types

import { AppType, ColorTheme, FeatureType } from '@/services/generator/types';

export interface PreviewScreen {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<ScreenProps>;
}

export interface ScreenProps {
  theme: ColorTheme;
  appName: string;
  onNavigate: (screenId: string) => void;
  features: FeatureType[];
  isDarkMode?: boolean;
}

export interface AppPreviewProps {
  appType: AppType;
  appName: string;
  theme: ColorTheme;
  features: FeatureType[];
  currentScreen: string;
  onScreenChange: (screen: string) => void;
  isGenerating?: boolean;
}

export interface PreviewSettings {
  isDarkMode: boolean;
  showPayment: boolean;
  language: 'en' | 'hi';
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  time: string;
  priceRange: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image?: string;
  category: string;
}

export interface Post {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
}
