// AWS Backend Services
// Export all services for easy importing

export * from './auth';
export * from './projects';
export * from './figma';
export * from './credits';
export { default as api } from './api';

/*
 * AWS Backend Integration Guide
 * =============================
 * 
 * QUICK START:
 * 1. Set VITE_AWS_API_URL in your environment
 * 2. Deploy Lambda functions for each endpoint
 * 3. Configure API Gateway with CORS
 * 4. Set up DynamoDB tables
 * 5. Configure S3 buckets for file storage
 * 
 * REQUIRED ENVIRONMENT VARIABLES:
 * - VITE_AWS_API_URL: Your API Gateway endpoint URL
 * 
 * OPTIONAL ENVIRONMENT VARIABLES:
 * - VITE_AWS_REGION: AWS region (default: ap-south-1)
 * - VITE_COGNITO_USER_POOL_ID: For AWS Cognito auth
 * - VITE_COGNITO_CLIENT_ID: For AWS Cognito auth
 * - VITE_S3_BUCKET: For file uploads
 * 
 * API ENDPOINTS REQUIRED:
 * =======================
 * 
 * Authentication:
 * - POST /auth/signup        - Create new user account
 * - POST /auth/signin        - Sign in existing user
 * - POST /auth/signout       - Sign out user
 * - GET  /auth/me            - Get current user
 * - POST /auth/forgot-password    - Request password reset
 * - POST /auth/reset-password     - Reset password with token
 * - POST /auth/security-questions - Set up security questions
 * - POST /auth/verify-security    - Verify security question answer
 * 
 * Projects:
 * - GET    /projects           - List user projects
 * - GET    /projects/:id       - Get single project
 * - POST   /projects           - Create new project
 * - DELETE /projects/:id       - Delete project
 * - GET    /projects/:id/status    - Get build status
 * - GET    /projects/:id/download/apk  - Get APK download URL
 * - GET    /projects/:id/download/ipa  - Get IPA download URL
 * - POST   /projects/:id/publish/playstore  - Publish to Play Store
 * - POST   /projects/:id/publish/appstore   - Publish to App Store
 * 
 * Figma:
 * - POST /figma/import       - Import from Figma URL
 * - POST /figma/upload       - Import from uploaded file
 * - GET  /figma/status/:id   - Get import status
 * 
 * Credits & Payments:
 * - GET  /credits/balance    - Get user credit balance
 * - POST /credits/use        - Use credits for action
 * - GET  /credits/history    - Get credit transaction history
 * - POST /payments/create-order  - Create payment order
 * - POST /payments/verify        - Verify payment
 * 
 * RESPONSE FORMAT:
 * ================
 * All endpoints should return JSON with this structure:
 * 
 * Success: { data: <response_data> }
 * Error:   { message: "Error description" }
 * 
 * HTTP Status Codes:
 * - 200: Success
 * - 201: Created
 * - 400: Bad Request
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 404: Not Found
 * - 500: Server Error
 * 
 * AUTHENTICATION:
 * ===============
 * All protected endpoints expect:
 * Authorization: Bearer <jwt_token>
 * 
 * The token is stored in localStorage under 'auth_token'
 * and automatically included in all API requests.
 * 
 * DATABASE SCHEMA:
 * ================
 * 
 * users:
 *   - id: string (primary key)
 *   - email: string (unique)
 *   - name: string
 *   - hashedPassword: string
 *   - createdAt: timestamp
 *   - updatedAt: timestamp
 * 
 * projects:
 *   - id: string (primary key)
 *   - userId: string (foreign key -> users.id)
 *   - name: string
 *   - description: string
 *   - prompt: string
 *   - status: enum (draft, building, completed, failed)
 *   - apkUrl: string (nullable)
 *   - ipaUrl: string (nullable)
 *   - previewUrl: string (nullable)
 *   - createdAt: timestamp
 *   - updatedAt: timestamp
 * 
 * credits:
 *   - userId: string (primary key, foreign key -> users.id)
 *   - balance: number
 *   - totalPurchased: number
 *   - totalUsed: number
 *   - updatedAt: timestamp
 * 
 * transactions:
 *   - id: string (primary key)
 *   - userId: string (foreign key -> users.id)
 *   - type: enum (purchase, usage)
 *   - amount: number
 *   - description: string
 *   - createdAt: timestamp
 * 
 * security_questions:
 *   - userId: string (primary key, foreign key -> users.id)
 *   - questions: encrypted JSON array
 *   - updatedAt: timestamp
 */
