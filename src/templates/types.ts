// Template Types

export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  card: string;
  border: string;
}

export interface TemplateConfig {
  appName: string;
  theme: ColorTheme;
  features: string[];
  apiBaseUrl: string;
}

export interface GeneratedTemplate {
  files: Record<string, string>;
  readme: string;
  setupInstructions: string[];
}

export const defaultTheme: ColorTheme = {
  primary: '#FF5722',
  secondary: '#FFC107',
  accent: '#4CAF50',
  background: '#F5F5F5',
  text: '#212121',
  card: '#FFFFFF',
  border: '#E0E0E0',
};

export function sanitizeAppName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
}

export function pascalCase(str: string): string {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^(\w)/, (_, c) => c.toUpperCase());
}
