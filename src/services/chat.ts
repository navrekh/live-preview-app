// AI Chat Service for App Builder
// Backend API: https://appdev.co.in/api

import api from './api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  suggestedFeatures?: string[];
  readyToBuild?: boolean;
  appSpec?: AppSpecification;
}

export interface AppSpecification {
  name?: string;
  description?: string;
  features: string[];
  screens: string[];
  colorScheme?: string;
  hasAuth?: boolean;
  hasPayments?: boolean;
}

// Send a message to the AI chat
export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[]
): Promise<ChatResponse> {
  const response = await api.post<ChatResponse>('/apps/chat', {
    message,
    history: conversationHistory.map(m => ({
      role: m.role,
      content: m.content,
    })),
  });

  if (response.error) {
    // For now, return a mock response if backend isn't ready
    return getMockResponse(message, conversationHistory);
  }

  return response.data!;
}

// Mock AI responses for development
function getMockResponse(message: string, history: ChatMessage[]): ChatResponse {
  const lowerMessage = message.toLowerCase();
  const messageCount = history.filter(m => m.role === 'user').length;

  // First message - understand the app idea
  if (messageCount === 0) {
    return {
      message: `Great idea! I'd love to help you build that. To create the best app for you, I have a few questions:\n\n1. **What's the main purpose** of your app?\n2. **Who will use it** - is it for personal use, a business, or the general public?\n3. **What are the must-have features** you need?`,
      suggestedFeatures: ['User Login', 'Push Notifications', 'Payment Integration', 'Maps', 'Social Sharing'],
    };
  }

  // Check for feature-related keywords
  if (lowerMessage.includes('login') || lowerMessage.includes('auth') || lowerMessage.includes('user')) {
    return {
      message: `Perfect! I'll add user authentication with:\n- Email/password login\n- Social login (Google, Apple)\n- Password reset functionality\n\nWhat **color scheme** would you prefer? I can suggest:\n- Modern Blue\n- Vibrant Purple\n- Clean Green\n- Professional Gray`,
      suggestedFeatures: ['Email Login', 'Google Sign-in', 'Apple Sign-in'],
    };
  }

  if (lowerMessage.includes('payment') || lowerMessage.includes('buy') || lowerMessage.includes('sell')) {
    return {
      message: `I'll integrate payment processing with:\n- Secure checkout\n- Multiple payment methods (Cards, UPI, Wallets)\n- Order history\n\nDo you need **inventory management** or will this be a service-based app?`,
    };
  }

  if (lowerMessage.includes('color') || lowerMessage.includes('blue') || lowerMessage.includes('purple') || lowerMessage.includes('green')) {
    return {
      message: `Excellent choice! I've noted your color preference. Here's what I have so far for your app:\n\n✅ User authentication\n✅ Clean, modern UI\n✅ Your chosen color scheme\n\nAre you ready to **generate your app**, or would you like to add more features?`,
      readyToBuild: true,
    };
  }

  // After enough context, suggest building
  if (messageCount >= 2) {
    return {
      message: `Based on our conversation, I have a good understanding of your app. Here's the summary:\n\n📱 **App Type:** ${detectAppType(message)}\n🎨 **Style:** Modern, clean design\n⚡ **Features:** Based on your requirements\n\nWould you like me to **start building** your app now? It will cost 20 credits and take about 2 minutes.`,
      readyToBuild: true,
      appSpec: {
        features: ['User Authentication', 'Modern UI', 'Push Notifications'],
        screens: ['Home', 'Profile', 'Settings'],
      },
    };
  }

  // Default response
  return {
    message: `I understand! Tell me more about:\n- What **screens** do you need? (Home, Profile, Settings, etc.)\n- Do you need **offline support**?\n- Any **specific integrations** you need? (Maps, Camera, Social media)`,
  };
}

function detectAppType(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('shop') || lower.includes('store') || lower.includes('ecommerce')) return 'E-commerce';
  if (lower.includes('social') || lower.includes('chat') || lower.includes('community')) return 'Social';
  if (lower.includes('food') || lower.includes('restaurant') || lower.includes('delivery')) return 'Food Delivery';
  if (lower.includes('fitness') || lower.includes('health') || lower.includes('workout')) return 'Health & Fitness';
  if (lower.includes('education') || lower.includes('learn') || lower.includes('course')) return 'Education';
  return 'Custom App';
}
