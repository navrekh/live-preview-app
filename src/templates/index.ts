// Template System Index

export * from './types';
export { generateFoodDeliveryTemplate } from './foodDelivery';

// Template generator factory
import { TemplateConfig, GeneratedTemplate, defaultTheme } from './types';
import { generateFoodDeliveryTemplate } from './foodDelivery';

export type AppType = 
  | 'food-delivery' 
  | 'ecommerce' 
  | 'social' 
  | 'booking' 
  | 'fitness' 
  | 'travel' 
  | 'education' 
  | 'healthcare';

export function generateAppTemplate(
  appType: AppType,
  config: Partial<TemplateConfig> & { appName: string }
): GeneratedTemplate {
  const fullConfig: TemplateConfig = {
    appName: config.appName,
    theme: { ...defaultTheme, ...config.theme },
    features: config.features || [],
    apiBaseUrl: config.apiBaseUrl || 'http://localhost:3001/api',
  };

  switch (appType) {
    case 'food-delivery':
      return generateFoodDeliveryTemplate(fullConfig);
    
    case 'ecommerce':
      // Reuse food delivery as base, customize for e-commerce
      return generateFoodDeliveryTemplate({
        ...fullConfig,
        theme: {
          ...fullConfig.theme,
          primary: '#3F51B5',
          secondary: '#FF4081',
        },
      });
    
    case 'social':
      return generateFoodDeliveryTemplate({
        ...fullConfig,
        theme: {
          ...fullConfig.theme,
          primary: '#E91E63',
          secondary: '#9C27B0',
        },
      });

    case 'booking':
      return generateFoodDeliveryTemplate({
        ...fullConfig,
        theme: {
          ...fullConfig.theme,
          primary: '#009688',
          secondary: '#FF9800',
        },
      });

    case 'fitness':
      return generateFoodDeliveryTemplate({
        ...fullConfig,
        theme: {
          ...fullConfig.theme,
          primary: '#8BC34A',
          secondary: '#FF5722',
        },
      });

    case 'travel':
      return generateFoodDeliveryTemplate({
        ...fullConfig,
        theme: {
          ...fullConfig.theme,
          primary: '#2196F3',
          secondary: '#FF9800',
        },
      });

    case 'education':
      return generateFoodDeliveryTemplate({
        ...fullConfig,
        theme: {
          ...fullConfig.theme,
          primary: '#673AB7',
          secondary: '#FF5722',
        },
      });

    case 'healthcare':
      return generateFoodDeliveryTemplate({
        ...fullConfig,
        theme: {
          ...fullConfig.theme,
          primary: '#00BCD4',
          secondary: '#4CAF50',
        },
      });

    default:
      return generateFoodDeliveryTemplate(fullConfig);
  }
}

// Helper to get all generated files as downloadable content
export function getTemplateAsZipContent(template: GeneratedTemplate): string {
  let content = '';
  
  content += '='.repeat(60) + '\n';
  content += 'README.md\n';
  content += '='.repeat(60) + '\n\n';
  content += template.readme + '\n\n';

  content += '='.repeat(60) + '\n';
  content += 'SETUP INSTRUCTIONS\n';
  content += '='.repeat(60) + '\n\n';
  template.setupInstructions.forEach((step) => {
    content += step + '\n';
  });
  content += '\n';

  for (const [path, fileContent] of Object.entries(template.files)) {
    content += '='.repeat(60) + '\n';
    content += `FILE: ${path}\n`;
    content += '='.repeat(60) + '\n\n';
    content += fileContent + '\n\n';
  }

  return content;
}
