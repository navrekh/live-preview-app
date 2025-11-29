// AWS Backend Services
// Export all services for easy importing

export * from './auth';
export * from './projects';
export * from './figma';
export { default as api } from './api';

/*
 * AWS Backend Integration Guide
 * =============================
 * 
 * Required AWS Services:
 * 
 * 1. API Gateway - REST API endpoints
 *    - Set VITE_AWS_API_URL environment variable
 * 
 * 2. AWS Cognito - User authentication
 *    - /auth/signup, /auth/signin, /auth/signout
 *    - /auth/forgot-password, /auth/reset-password
 *    - /auth/security-questions, /auth/verify-security
 * 
 * 3. AWS Lambda - Backend logic
 *    - Project creation and AI processing
 *    - Figma import and parsing
 *    - Build orchestration
 * 
 * 4. AWS S3 - File storage
 *    - APK/IPA storage
 *    - Figma assets
 *    - App previews
 * 
 * 5. AWS DynamoDB / RDS - Database
 *    - User data
 *    - Projects
 *    - Build history
 * 
 * 6. AWS SQS/Step Functions - Build pipeline
 *    - Queue build jobs
 *    - Orchestrate multi-step builds
 * 
 * Environment Variables:
 * - VITE_AWS_API_URL: Your API Gateway endpoint URL
 * 
 * All service functions include TODO comments showing
 * exactly what API calls need to be made.
 */
