// Credits & Payment Service - AWS Backend
// These functions are ready to connect to your AWS Lambda / Razorpay / PayU

import api from './api';

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceInr: number;
  popular?: boolean;
}

export interface UserCredits {
  userId: string;
  balance: number;
  totalPurchased: number;
  totalUsed: number;
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  packageId: string;
}

// Credit packages
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'free',
    name: 'Free',
    credits: 5,
    priceInr: 0,
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 100,
    priceInr: 2000,
    popular: true,
  },
];

// Get user's credit balance
export async function getCreditBalance(): Promise<UserCredits | null> {
  // TODO: Connect to AWS endpoint
  // const response = await api.get<UserCredits>('/credits/balance');
  // return response.data || null;
  
  console.log('Get credit balance called');
  // Return mock data for UI development
  return {
    userId: 'mock-user',
    balance: 5,
    totalPurchased: 5,
    totalUsed: 0,
  };
}

// Create payment order (Razorpay/PayU)
export async function createPaymentOrder(packageId: string): Promise<PaymentOrder> {
  // TODO: Connect to AWS Lambda that creates Razorpay/PayU order
  // const response = await api.post<PaymentOrder>('/payments/create-order', { packageId });
  // if (response.data) return response.data;
  // throw new Error(response.error || 'Failed to create order');
  
  console.log('Create payment order called:', packageId);
  throw new Error('AWS backend not connected. Implement /payments/create-order endpoint.');
}

// Verify payment and add credits
export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<UserCredits> {
  // TODO: Connect to AWS Lambda that verifies with Razorpay/PayU
  // const response = await api.post<UserCredits>('/payments/verify', {
  //   orderId,
  //   paymentId,
  //   signature,
  // });
  // if (response.data) return response.data;
  // throw new Error(response.error || 'Payment verification failed');
  
  console.log('Verify payment called:', orderId);
  throw new Error('AWS backend not connected. Implement /payments/verify endpoint.');
}

// Use credits for an action
export async function useCredits(amount: number, action: string): Promise<UserCredits> {
  // TODO: Connect to AWS endpoint
  // const response = await api.post<UserCredits>('/credits/use', { amount, action });
  // if (response.data) return response.data;
  // throw new Error(response.error || 'Failed to use credits');
  
  console.log('Use credits called:', amount, action);
  throw new Error('AWS backend not connected. Implement /credits/use endpoint.');
}

// Get credit history
export async function getCreditHistory(): Promise<{
  id: string;
  type: 'purchase' | 'usage';
  amount: number;
  description: string;
  createdAt: string;
}[]> {
  // TODO: Connect to AWS endpoint
  // const response = await api.get('/credits/history');
  // return response.data || [];
  
  console.log('Get credit history called');
  return [];
}

// Add free credits on signup
export async function addSignupCredits(userId: string): Promise<void> {
  // TODO: This would typically be handled by AWS Lambda trigger on user creation
  // await api.post('/credits/signup-bonus', { userId });
  
  console.log('Add signup credits called:', userId);
}
