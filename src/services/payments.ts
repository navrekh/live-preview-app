// Payment Service - Razorpay Integration
// Backend API: https://appdev.co.in/api

import api from './api';

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  popular?: boolean;
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentVerification {
  paymentId: string;
  orderId: string;
  signature: string;
}

// Available credit packages
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'pack_100',
    credits: 100,
    price: 2000,
    popular: true,
  },
  {
    id: 'pack_500',
    credits: 500,
    price: 9000,
    originalPrice: 10000,
    discount: 10,
  },
  {
    id: 'pack_1000',
    credits: 1000,
    price: 16000,
    originalPrice: 20000,
    discount: 20,
  },
];

// Create a payment order
export async function createPaymentOrder(packageId: string): Promise<PaymentOrder> {
  const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
  if (!pkg) {
    throw new Error('Invalid package');
  }

  const response = await api.post<PaymentOrder>('/payments/create-order', {
    amount: pkg.price,
    credits: pkg.credits,
    packageId: pkg.id,
  });

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data!;
}

// Verify payment after Razorpay checkout
export async function verifyPayment(verification: PaymentVerification): Promise<{ success: boolean; credits: number }> {
  const response = await api.post<{ success: boolean; credits: number }>('/payments/verify', verification);

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data!;
}

// Open Razorpay checkout
export function openRazorpayCheckout(
  pkg: CreditPackage,
  order: PaymentOrder,
  onSuccess: (response: RazorpayResponse) => void,
  onDismiss?: () => void,
  userDetails?: { name?: string; email?: string }
): void {
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

  if (!razorpayKeyId) {
    throw new Error('Razorpay key not configured');
  }

  const options: RazorpayOptions = {
    key: razorpayKeyId,
    amount: order.amount,
    currency: order.currency || 'INR',
    name: 'AppDev',
    description: `${pkg.credits} Credits`,
    order_id: order.orderId,
    handler: onSuccess,
    prefill: {
      name: userDetails?.name || '',
      email: userDetails?.email || '',
    },
    theme: {
      color: '#3b82f6',
    },
    modal: {
      ondismiss: onDismiss,
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
