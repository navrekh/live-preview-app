// AWS Backend Configuration
// ===========================
// 
// This file contains configuration for connecting to AWS backend services.
// Set these environment variables in your deployment environment.

export const awsConfig = {
  // API Gateway endpoint URL
  apiUrl: import.meta.env.VITE_AWS_API_URL || '',
  
  // AWS Region
  region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
  
  // Cognito configuration (if using AWS Cognito)
  cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
    domain: import.meta.env.VITE_COGNITO_DOMAIN || '',
  },
  
  // S3 configuration (for file uploads)
  s3: {
    bucketName: import.meta.env.VITE_S3_BUCKET || '',
    region: import.meta.env.VITE_S3_REGION || 'ap-south-1',
  },
};

// Check if AWS is configured
export const isAwsConfigured = (): boolean => {
  return !!awsConfig.apiUrl;
};

// Get API URL with optional path
export const getApiUrl = (path: string = ''): string => {
  const baseUrl = awsConfig.apiUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/*
 * Environment Variables Required:
 * ================================
 * 
 * VITE_AWS_API_URL          - Your AWS API Gateway endpoint (required)
 * VITE_AWS_REGION           - AWS region (default: ap-south-1)
 * VITE_COGNITO_USER_POOL_ID - Cognito User Pool ID (if using Cognito)
 * VITE_COGNITO_CLIENT_ID    - Cognito App Client ID (if using Cognito)
 * VITE_COGNITO_DOMAIN       - Cognito Domain (if using Cognito)
 * VITE_S3_BUCKET            - S3 bucket name for file storage
 * VITE_S3_REGION            - S3 bucket region
 * 
 * AWS Services to Set Up:
 * =======================
 * 
 * 1. API Gateway
 *    - REST API with CORS enabled
 *    - Lambda integrations for each endpoint
 *    - API key authentication or Cognito authorizer
 * 
 * 2. Lambda Functions
 *    - auth-signup, auth-signin, auth-signout
 *    - auth-forgot-password, auth-reset-password
 *    - auth-security-questions
 *    - projects-create, projects-list, projects-get
 *    - projects-build-status, projects-download
 *    - figma-import, figma-status
 *    - payments-create-order, payments-verify
 *    - credits-balance, credits-use, credits-history
 * 
 * 3. DynamoDB Tables
 *    - users: id, email, name, createdAt, hashedPassword
 *    - projects: id, userId, name, status, prompt, etc.
 *    - credits: userId, balance, totalPurchased, totalUsed
 *    - transactions: id, userId, type, amount, description
 *    - security_questions: userId, questions (encrypted)
 * 
 * 4. S3 Buckets
 *    - appdev-builds: Store APK/IPA files
 *    - appdev-assets: Store Figma imports and previews
 * 
 * 5. Cognito (Optional)
 *    - User Pool for authentication
 *    - App Client for web application
 * 
 * 6. SQS / Step Functions
 *    - Build queue for app generation jobs
 *    - Step functions for build orchestration
 * 
 * 7. CloudWatch
 *    - Logging and monitoring
 *    - Alerts for build failures
 */
