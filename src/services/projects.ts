// Projects Service - AWS Backend
// These functions are ready to connect to your AWS Lambda / API Gateway

import api from './api';

export interface ProjectTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  appType: 'food-delivery' | 'ecommerce' | 'social' | 'booking' | 'fitness' | 'travel' | 'education' | 'healthcare';
  status: 'draft' | 'building' | 'completed' | 'failed';
  progress?: number;
  currentStep?: string;
  theme: ProjectTheme;
  features: string[];
  framework: 'react-native' | 'flutter';
  createdAt: string;
  updatedAt: string;
  // Download URLs
  reactNativeCodeUrl?: string;
  backendCodeUrl?: string;
  completePackageUrl?: string;
  // Preview
  snackUrl?: string;
  previewUrl?: string;
  // Store publishing
  apkUrl?: string;
  ipaUrl?: string;
}

export interface CreateProjectData {
  prompt: string;
  name?: string;
  appType?: string;
  framework?: 'react-native' | 'flutter';
}

export interface BuildStatus {
  projectId: string;
  step: string;
  progress: number;
  status: 'pending' | 'active' | 'completed' | 'failed';
  message?: string;
}

const APP_TYPE_LABELS: Record<string, string> = {
  'food-delivery': 'Food Delivery',
  'ecommerce': 'E-commerce',
  'social': 'Social Media',
  'booking': 'Booking',
  'fitness': 'Fitness',
  'travel': 'Travel',
  'education': 'Education',
  'healthcare': 'Healthcare',
};

const APP_TYPE_ICONS: Record<string, string> = {
  'food-delivery': '🍔',
  'ecommerce': '🛒',
  'social': '💬',
  'booking': '📅',
  'fitness': '💪',
  'travel': '✈️',
  'education': '📚',
  'healthcare': '🏥',
};

export function getAppTypeLabel(appType: string): string {
  return APP_TYPE_LABELS[appType] || appType;
}

export function getAppTypeIcon(appType: string): string {
  return APP_TYPE_ICONS[appType] || '📱';
}

// Get all user projects
export async function getProjects(): Promise<Project[]> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://appdev.co.in/api/apps', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.apps || [];
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  }
  
  // Return mock data for UI development when API is unavailable
  return [
    {
      id: '1',
      name: 'FoodieGo',
      description: 'Food delivery app with real-time tracking',
      appType: 'food-delivery',
      status: 'completed',
      theme: { primary: '#FF5722', secondary: '#FFC107', accent: '#4CAF50' },
      features: ['login', 'payment', 'maps', 'notifications'],
      framework: 'react-native',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      snackUrl: 'https://snack.expo.dev/@example/foodiego',
    },
    {
      id: '2',
      name: 'ShopNow',
      description: 'E-commerce marketplace with cart',
      appType: 'ecommerce',
      status: 'building',
      progress: 65,
      currentStep: 'Generating backend APIs...',
      theme: { primary: '#3F51B5', secondary: '#FF4081', accent: '#00BCD4' },
      features: ['login', 'payment', 'search', 'favorites'],
      framework: 'react-native',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'FitTrack',
      description: 'Fitness tracking with workout plans',
      appType: 'fitness',
      status: 'completed',
      theme: { primary: '#8BC34A', secondary: '#FF5722', accent: '#00BCD4' },
      features: ['login', 'analytics', 'notifications'],
      framework: 'react-native',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString(),
      snackUrl: 'https://snack.expo.dev/@example/fittrack',
    },
  ];
}

// Get single project
export async function getProject(id: string): Promise<Project | null> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://appdev.co.in/api/apps/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.app || null;
    }
  } catch (error) {
    console.error('Failed to fetch project:', error);
  }
  
  return null;
}

// Create new project from prompt
export async function createProject(data: CreateProjectData): Promise<Project> {
  const token = localStorage.getItem('token');
  const response = await fetch('https://appdev.co.in/api/apps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to create project');
  }
  
  return result.app;
}

// Get build status (for polling during generation)
export async function getBuildStatus(projectId: string): Promise<BuildStatus> {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://appdev.co.in/api/apps/${projectId}/status`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to get build status');
  }
  
  return result.status;
}

// Download React Native code
export async function downloadReactNativeCode(projectId: string): Promise<string> {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://appdev.co.in/api/apps/${projectId}/download/react-native`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to get download URL');
  }
  
  return result.url;
}

// Download Backend code
export async function downloadBackendCode(projectId: string): Promise<string> {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://appdev.co.in/api/apps/${projectId}/download/backend`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to get download URL');
  }
  
  return result.url;
}

// Download complete package
export async function downloadCompletePackage(projectId: string): Promise<string> {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://appdev.co.in/api/apps/${projectId}/download/complete`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to get download URL');
  }
  
  return result.url;
}

// Download APK
export async function downloadApk(projectId: string): Promise<string> {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://appdev.co.in/api/apps/${projectId}/download/apk`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to get download URL');
  }
  
  return result.url;
}

// Download IPA
export async function downloadIpa(projectId: string): Promise<string> {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://appdev.co.in/api/apps/${projectId}/download/ipa`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to get download URL');
  }
  
  return result.url;
}

// Publish to Play Store
export async function publishToPlayStore(projectId: string): Promise<void> {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://appdev.co.in/api/apps/${projectId}/publish/playstore`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to publish to Play Store');
  }
}

// Publish to App Store
export async function publishToAppStore(projectId: string): Promise<void> {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://appdev.co.in/api/apps/${projectId}/publish/appstore`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to publish to App Store');
  }
}

// Delete project
export async function deleteProject(id: string): Promise<void> {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://appdev.co.in/api/apps/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to delete project');
  }
}