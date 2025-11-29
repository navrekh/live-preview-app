// Projects Service - AWS Backend
// These functions are ready to connect to your AWS Lambda / API Gateway

import api from './api';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'building' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  apkUrl?: string;
  ipaUrl?: string;
  previewUrl?: string;
}

export interface CreateProjectData {
  prompt: string;
  name?: string;
}

export interface BuildStatus {
  projectId: string;
  step: string;
  progress: number;
  status: 'pending' | 'active' | 'completed' | 'failed';
  message?: string;
}

// Get all user projects
export async function getProjects(): Promise<Project[]> {
  // TODO: Connect to AWS endpoint
  // const response = await api.get<Project[]>('/projects');
  // return response.data || [];
  
  console.log('Get projects called');
  // Return mock data for UI development
  return [
    {
      id: '1',
      name: 'E-commerce App',
      description: 'Shopping app with payments',
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Fitness Tracker',
      description: 'Track workouts and progress',
      status: 'building',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

// Get single project
export async function getProject(id: string): Promise<Project | null> {
  // TODO: Connect to AWS endpoint
  // const response = await api.get<Project>(`/projects/${id}`);
  // return response.data || null;
  
  console.log('Get project called:', id);
  return null;
}

// Create new project from prompt
export async function createProject(data: CreateProjectData): Promise<Project> {
  // TODO: Connect to AWS Lambda for AI processing
  // const response = await api.post<Project>('/projects', data);
  // if (response.data) return response.data;
  // throw new Error(response.error || 'Failed to create project');
  
  console.log('Create project called with:', data);
  throw new Error('AWS backend not connected. Implement /projects endpoint.');
}

// Get build status (for polling during generation)
export async function getBuildStatus(projectId: string): Promise<BuildStatus> {
  // TODO: Connect to AWS endpoint or WebSocket
  // const response = await api.get<BuildStatus>(`/projects/${projectId}/status`);
  // if (response.data) return response.data;
  // throw new Error(response.error || 'Failed to get build status');
  
  console.log('Get build status called:', projectId);
  throw new Error('AWS backend not connected. Implement /projects/:id/status endpoint.');
}

// Download APK
export async function downloadApk(projectId: string): Promise<string> {
  // TODO: Connect to AWS S3 presigned URL endpoint
  // const response = await api.get<{ url: string }>(`/projects/${projectId}/download/apk`);
  // if (response.data) return response.data.url;
  // throw new Error(response.error || 'Failed to get download URL');
  
  console.log('Download APK called:', projectId);
  throw new Error('AWS backend not connected. Implement /projects/:id/download/apk endpoint.');
}

// Download IPA
export async function downloadIpa(projectId: string): Promise<string> {
  // TODO: Connect to AWS S3 presigned URL endpoint
  // const response = await api.get<{ url: string }>(`/projects/${projectId}/download/ipa`);
  // if (response.data) return response.data.url;
  // throw new Error(response.error || 'Failed to get download URL');
  
  console.log('Download IPA called:', projectId);
  throw new Error('AWS backend not connected. Implement /projects/:id/download/ipa endpoint.');
}

// Publish to Play Store
export async function publishToPlayStore(projectId: string): Promise<void> {
  // TODO: Connect to AWS endpoint that handles Play Store API
  // await api.post(`/projects/${projectId}/publish/playstore`, {});
  
  console.log('Publish to Play Store called:', projectId);
  throw new Error('AWS backend not connected. Implement /projects/:id/publish/playstore endpoint.');
}

// Publish to App Store
export async function publishToAppStore(projectId: string): Promise<void> {
  // TODO: Connect to AWS endpoint that handles App Store Connect API
  // await api.post(`/projects/${projectId}/publish/appstore`, {});
  
  console.log('Publish to App Store called:', projectId);
  throw new Error('AWS backend not connected. Implement /projects/:id/publish/appstore endpoint.');
}

// Delete project
export async function deleteProject(id: string): Promise<void> {
  // TODO: Connect to AWS endpoint
  // await api.delete(`/projects/${id}`);
  
  console.log('Delete project called:', id);
  throw new Error('AWS backend not connected. Implement DELETE /projects/:id endpoint.');
}
