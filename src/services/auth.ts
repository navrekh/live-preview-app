// Authentication Service - AWS Cognito / Custom Auth Backend
// These functions are ready to connect to your AWS authentication service

import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SecurityQuestion {
  question: string;
  answer: string;
}

// Sign up new user
export async function signUp(data: SignUpData): Promise<AuthResponse | null> {
  // TODO: Connect to AWS Cognito or custom auth endpoint
  // const response = await api.post<AuthResponse>('/auth/signup', data);
  // if (response.data) {
  //   localStorage.setItem('auth_token', response.data.token);
  //   return response.data;
  // }
  // throw new Error(response.error || 'Sign up failed');
  
  console.log('Sign up called with:', data);
  throw new Error('AWS backend not connected. Implement /auth/signup endpoint.');
}

// Sign in existing user
export async function signIn(data: SignInData): Promise<AuthResponse | null> {
  // TODO: Connect to AWS Cognito or custom auth endpoint
  // const response = await api.post<AuthResponse>('/auth/signin', data);
  // if (response.data) {
  //   localStorage.setItem('auth_token', response.data.token);
  //   return response.data;
  // }
  // throw new Error(response.error || 'Sign in failed');
  
  console.log('Sign in called with:', data);
  throw new Error('AWS backend not connected. Implement /auth/signin endpoint.');
}

// Sign out user
export async function signOut(): Promise<void> {
  localStorage.removeItem('auth_token');
  // TODO: Call AWS endpoint to invalidate token if needed
  // await api.post('/auth/signout', {});
}

// Request password reset
export async function forgotPassword(email: string): Promise<void> {
  // TODO: Connect to AWS Cognito or custom endpoint
  // await api.post('/auth/forgot-password', { email });
  
  console.log('Forgot password called for:', email);
  throw new Error('AWS backend not connected. Implement /auth/forgot-password endpoint.');
}

// Reset password with token
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  // TODO: Connect to AWS endpoint
  // await api.post('/auth/reset-password', { token, newPassword });
  
  console.log('Reset password called');
  throw new Error('AWS backend not connected. Implement /auth/reset-password endpoint.');
}

// Set up security questions
export async function setSecurityQuestions(questions: SecurityQuestion[]): Promise<void> {
  // TODO: Connect to AWS endpoint
  // await api.post('/auth/security-questions', { questions });
  
  console.log('Security questions called with:', questions);
  throw new Error('AWS backend not connected. Implement /auth/security-questions endpoint.');
}

// Verify security question answer
export async function verifySecurityQuestion(
  email: string,
  questionIndex: number,
  answer: string
): Promise<boolean> {
  // TODO: Connect to AWS endpoint
  // const response = await api.post<{ valid: boolean }>('/auth/verify-security', {
  //   email,
  //   questionIndex,
  //   answer,
  // });
  // return response.data?.valid || false;
  
  console.log('Verify security question called');
  throw new Error('AWS backend not connected. Implement /auth/verify-security endpoint.');
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  // TODO: Connect to AWS endpoint
  // const response = await api.get<User>('/auth/me');
  // return response.data || null;
  
  return null;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}
