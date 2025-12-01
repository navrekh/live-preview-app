import { useState, useCallback } from "react";
import api from "@/services/api";
import { GeneratedFile } from "@/services/generator/types";

export type { GeneratedFile };

export interface BuilderMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface GenerateResponse {
  success?: boolean;
  files?: GeneratedFile[];
  reactNativeCode?: string;
  backendCode?: string;
  databaseSchema?: string;
  previewUrl?: string;
  snackUrl?: string;
  message?: string;
}

const SYSTEM_PROMPT = `You are AppDev — an advanced AI mobile app generator specialized in creating production-ready mobile applications.

## CORE PRINCIPLES
1. **Domain Understanding**: Deeply analyze the user's request to understand their specific domain
2. **Contextual UI Generation**: Generate UI components that are SPECIFIC to the requested domain
3. **No Generic Fallbacks**: Never generate generic or placeholder content

## DOMAIN SPECIALIZATIONS

### 🏏 CRICKET / SPORTS
- Live match scorecards with ball-by-ball updates
- Team lineups and player statistics
- Tournament brackets and fixtures
- Match schedules with venue details
- Live commentary sections
- Player profiles with career stats

### 🍔 FOOD DELIVERY
- Restaurant listings with ratings and distance
- Menu categories with item cards
- Cart and checkout flow
- Order tracking with map
- Restaurant details with reviews
- Cuisine filters and search

### 🛒 E-COMMERCE
- Product grid/list views with images
- Category navigation
- Product detail pages with variants
- Shopping cart with quantity controls
- Wishlist functionality
- Order history and tracking

### 📱 SOCIAL MEDIA
- Feed with posts, likes, comments
- User profiles with followers/following
- Stories/reels carousel
- Direct messaging interface
- Notifications feed
- Search and discover

### 💪 FITNESS / HEALTH
- Workout plans with exercises
- Progress tracking charts
- Calorie/nutrition tracking
- Exercise library with demos
- Daily goals and streaks
- Health metrics dashboard

### 📰 NEWS / CONTENT
- Article cards with thumbnails
- Category tabs (Sports, Tech, Business)
- Reading view with typography
- Bookmarks and saved articles
- Breaking news alerts
- Personalized feed

### 🎬 ENTERTAINMENT
- Movie/show listings with posters
- Video player interface
- Watchlist and continue watching
- Reviews and ratings
- Cast and crew details
- Genre-based browsing

### ✈️ TRAVEL / BOOKING
- Search with date pickers
- Listing cards with prices
- Booking flow with forms
- Itinerary view
- Reviews and photos
- Map integration

## OUTPUT REQUIREMENTS
- Generate clean, semantic React Native components
- Use proper TypeScript types
- Include realistic mock data relevant to the domain
- Create multiple screens if needed (Home, Detail, Profile)
- Use modern UI patterns (cards, lists, tabs, bottom nav)
- Include proper navigation structure

IMPORTANT: If user says "cricket app", generate ONLY cricket-related UI. If user says "food app", generate ONLY food delivery UI. Never mix domains unless explicitly requested.`;

export default function useBuilder(initialAppName = "MyApp") {
  const [messages, setMessages] = useState<BuilderMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm AppDev AI. Tell me what kind of app you want to build, and I'll generate it instantly.\n\nTry: \"Cricket live scores app\" or \"Food delivery app\"",
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [appName, setAppName] = useState(initialAppName);
  const [snackUrl, setSnackUrl] = useState<string | null>(null);
  const [reactNativeCode, setReactNativeCode] = useState<string>("");
  const [backendCode, setBackendCode] = useState<string>("");
  const [buildComplete, setBuildComplete] = useState(false);
  const [detectedAppType, setDetectedAppType] = useState<string | null>(null);

  const detectAppType = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (/cricket|score|match|ipl|tournament|batting|bowling/.test(lowerText)) return "cricket";
    if (/food|restaurant|delivery|menu|order|cuisine|eat/.test(lowerText)) return "food";
    if (/shop|ecommerce|product|cart|buy|sell|store/.test(lowerText)) return "ecommerce";
    if (/social|feed|post|follow|friend|chat|message/.test(lowerText)) return "social";
    if (/fitness|workout|gym|exercise|health|calorie/.test(lowerText)) return "fitness";
    if (/news|article|blog|read|headline/.test(lowerText)) return "news";
    if (/movie|video|stream|watch|entertainment/.test(lowerText)) return "entertainment";
    if (/travel|book|hotel|flight|trip/.test(lowerText)) return "travel";
    
    return "generic";
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: BuilderMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setBuildComplete(false);

      // Detect app type from user input
      const appType = detectAppType(text);
      setDetectedAppType(appType);

      try {
        const response = await api.post<GenerateResponse>("/api/generate", {
          appName,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: text.trim() },
          ],
        });

        if (response.error || !response.data) {
          throw new Error(response.error || "Failed to generate app");
        }

        const data = response.data;

        if (data.success !== false && Array.isArray(data.files)) {
          setGeneratedFiles(data.files);
          setBuildComplete(true);

          if (data.reactNativeCode) setReactNativeCode(data.reactNativeCode);
          if (data.backendCode) setBackendCode(data.backendCode);
          if (data.snackUrl) setSnackUrl(data.snackUrl);

          const appTypeLabel = appType.charAt(0).toUpperCase() + appType.slice(1);
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: `🎉 Your ${appTypeLabel} app has been generated! Check out the live preview on the right.\n\nYou can:\n• Download the code\n• Open in Expo Snack\n• Ask me to modify it`,
              timestamp: new Date(),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: data.message || "I couldn't generate the UI. Could you describe your app in more detail?",
              timestamp: new Date(),
            },
          ]);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: `Something went wrong: ${errorMessage}\n\nPlease try again or describe your app differently.`,
            timestamp: new Date(),
          },
        ]);
      }

      setIsLoading(false);
    },
    [appName, isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hi! I'm AppDev AI. Tell me what kind of app you want to build, and I'll generate it instantly.\n\nTry: \"Cricket live scores app\" or \"Food delivery app\"",
        timestamp: new Date(),
      },
    ]);
    setGeneratedFiles([]);
    setBuildComplete(false);
    setSnackUrl(null);
    setReactNativeCode("");
    setBackendCode("");
    setDetectedAppType(null);
  }, []);

  return {
    messages,
    sendMessage,
    generatedFiles,
    isLoading,
    appName,
    setAppName,
    snackUrl,
    reactNativeCode,
    backendCode,
    buildComplete,
    clearMessages,
    detectedAppType,
  };
}