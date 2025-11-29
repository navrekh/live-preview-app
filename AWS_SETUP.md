# AppDev AWS Backend Setup Guide

This document provides instructions for setting up the AWS backend for AppDev.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│   API Gateway   │────▶│  Lambda Funcs   │
│   (Frontend)    │     │   (REST API)    │     │   (Backend)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                        ┌───────────────────────────────┼───────────────────────────────┐
                        │                               │                               │
                        ▼                               ▼                               ▼
                ┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
                │    DynamoDB     │             │       S3        │             │    Cognito      │
                │   (Database)    │             │    (Storage)    │             │    (Auth)       │
                └─────────────────┘             └─────────────────┘             └─────────────────┘
```

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured locally
- Node.js 18+ for Lambda functions

## Step 1: Create DynamoDB Tables

### Users Table
```bash
aws dynamodb create-table \
  --table-name appdev-users \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    "IndexName=email-index,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL}" \
  --billing-mode PAY_PER_REQUEST
```

### Projects Table
```bash
aws dynamodb create-table \
  --table-name appdev-projects \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    "IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL}" \
  --billing-mode PAY_PER_REQUEST
```

### Credits Table
```bash
aws dynamodb create-table \
  --table-name appdev-credits \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

### Transactions Table
```bash
aws dynamodb create-table \
  --table-name appdev-transactions \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    "IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL}" \
  --billing-mode PAY_PER_REQUEST
```

## Step 2: Create S3 Buckets

```bash
# Bucket for APK/IPA builds
aws s3 mb s3://appdev-builds --region ap-south-1

# Bucket for assets (Figma imports, previews)
aws s3 mb s3://appdev-assets --region ap-south-1

# Configure CORS for assets bucket
aws s3api put-bucket-cors --bucket appdev-assets --cors-configuration '{
  "CORSRules": [{
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }]
}'
```

## Step 3: Create Lambda Functions

Create Lambda functions for each endpoint. Example structure:

```
lambda/
├── auth/
│   ├── signup.js
│   ├── signin.js
│   ├── signout.js
│   ├── me.js
│   ├── forgot-password.js
│   └── reset-password.js
├── projects/
│   ├── create.js
│   ├── list.js
│   ├── get.js
│   ├── delete.js
│   └── build-status.js
├── credits/
│   ├── balance.js
│   ├── use.js
│   └── history.js
└── payments/
    ├── create-order.js
    └── verify.js
```

### Example Lambda Function (signup.js)
```javascript
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event) => {
  const { name, email, password } = JSON.parse(event.body);
  
  // Check if user exists
  const existing = await dynamodb.query({
    TableName: 'appdev-users',
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: { ':email': email }
  }).promise();
  
  if (existing.Items.length > 0) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'User already exists' })
    };
  }
  
  // Create user
  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await dynamodb.put({
    TableName: 'appdev-users',
    Item: {
      id: userId,
      email,
      name,
      hashedPassword,
      createdAt: new Date().toISOString()
    }
  }).promise();
  
  // Initialize credits (5 free credits)
  await dynamodb.put({
    TableName: 'appdev-credits',
    Item: {
      userId,
      balance: 5,
      totalPurchased: 5,
      totalUsed: 0
    }
  }).promise();
  
  // Generate JWT
  const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
  
  return {
    statusCode: 201,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      user: { id: userId, email, name },
      token
    })
  };
};
```

## Step 4: Create API Gateway

1. Create a new REST API in API Gateway
2. Create resources and methods for each endpoint
3. Configure CORS for all endpoints
4. Deploy to a stage (e.g., "prod")

### API Gateway Resources
```
/auth
  POST /signup
  POST /signin
  POST /signout
  GET  /me
  POST /forgot-password
  POST /reset-password
  POST /security-questions

/projects
  GET    /              (list)
  POST   /              (create)
  GET    /{id}          (get)
  DELETE /{id}          (delete)
  GET    /{id}/status   (build status)
  GET    /{id}/download/apk
  GET    /{id}/download/ipa
  POST   /{id}/publish/playstore
  POST   /{id}/publish/appstore

/figma
  POST /import
  POST /upload
  GET  /status/{id}

/credits
  GET  /balance
  POST /use
  GET  /history

/payments
  POST /create-order
  POST /verify
```

## Step 5: Configure Environment Variables

Set the following in your frontend `.env` file:

```env
VITE_AWS_API_URL=https://your-api-id.execute-api.ap-south-1.amazonaws.com/prod
```

## Step 6: Payment Integration (Razorpay)

1. Create a Razorpay account at https://razorpay.com
2. Get your API keys from the Razorpay Dashboard
3. Add keys to Lambda environment variables

### Payment Flow
1. Frontend calls `/payments/create-order` with package ID
2. Lambda creates Razorpay order and returns order ID
3. Frontend opens Razorpay checkout
4. On success, frontend calls `/payments/verify` with payment details
5. Lambda verifies payment and adds credits

## Security Considerations

1. **JWT Authentication**: All protected endpoints verify JWT token
2. **Password Hashing**: Use bcrypt with salt rounds >= 10
3. **CORS**: Configure properly for your domain
4. **API Keys**: Store in AWS Secrets Manager or Parameter Store
5. **Input Validation**: Validate all inputs in Lambda functions
6. **Rate Limiting**: Configure API Gateway throttling

## Monitoring

1. Enable CloudWatch Logs for all Lambda functions
2. Set up CloudWatch Alarms for errors and latency
3. Use X-Ray for distributed tracing

## Cost Optimization

1. Use DynamoDB On-Demand for variable workloads
2. Configure Lambda memory appropriately
3. Use S3 Intelligent-Tiering for builds bucket
4. Set up billing alerts
