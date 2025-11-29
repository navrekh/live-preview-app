// Common types for the AppDev application

// User & Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

// Projects
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  prompt: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  apkUrl?: string;
  ipaUrl?: string;
  previewUrl?: string;
  thumbnail?: string;
}

export type ProjectStatus = "draft" | "building" | "completed" | "failed";

export interface BuildStep {
  id: string;
  label: string;
  status: BuildStepStatus;
  progress?: number;
  message?: string;
}

export type BuildStepStatus = "pending" | "active" | "completed" | "failed";

// Credits & Payments
export interface CreditBalance {
  userId: string;
  balance: number;
  totalPurchased: number;
  totalUsed: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceInr: number;
  popular?: boolean;
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  packageId: string;
  status: "pending" | "completed" | "failed";
}

// Figma Import
export interface FigmaImport {
  id: string;
  projectId: string;
  figmaUrl: string;
  status: "processing" | "completed" | "failed";
  progress: number;
  screens: FigmaScreen[];
  assets: FigmaAsset[];
}

export interface FigmaScreen {
  id: string;
  name: string;
  previewUrl: string;
  components: string[];
}

export interface FigmaAsset {
  id: string;
  name: string;
  type: "image" | "icon" | "font";
  url: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form types
export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SecurityQuestion {
  question: string;
  answer: string;
}
