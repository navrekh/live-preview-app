// App Generation Types

export type AppType = 
  | 'food-delivery' 
  | 'ecommerce' 
  | 'social' 
  | 'booking' 
  | 'fitness' 
  | 'travel' 
  | 'education' 
  | 'healthcare';

export type FeatureType = 
  | 'login' 
  | 'payment' 
  | 'maps' 
  | 'notifications' 
  | 'chat' 
  | 'camera' 
  | 'analytics'
  | 'search'
  | 'favorites'
  | 'reviews'
  | 'social-share';

export type Framework = 'react-native' | 'flutter';

export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background?: string;
  text?: string;
}

export interface AppRequirements {
  name: string;
  type: AppType;
  framework: Framework;
  features: FeatureType[];
  colorTheme: ColorTheme;
  screens: string[];
  description?: string;
}

export interface FeatureConfig {
  required: boolean;
  screens?: string[];
  integration?: string;
  dependencies?: string[];
}

export interface BackendConfig {
  models: string[];
  endpoints: string[];
  middleware?: string[];
}

export interface AppTemplate {
  type: AppType;
  name: string;
  description: string;
  screens: string[];
  features: Record<string, FeatureConfig>;
  backend: BackendConfig;
  defaultTheme: ColorTheme;
}

export interface GeneratedApp {
  reactNativeCode: string;
  flutterCode?: string;
  backendCode: string;
  databaseSchema: string;
  previewUrl: string;
  files: GeneratedFile[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'component' | 'screen' | 'service' | 'config' | 'model' | 'backend';
}

export interface GenerationProgress {
  step: string;
  progress: number;
  message: string;
}
