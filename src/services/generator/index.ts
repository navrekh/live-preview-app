// Main App Generation Service

import {
  AppRequirements,
  AppType,
  ColorTheme,
  FeatureType,
  Framework,
  GeneratedApp,
  GeneratedFile,
  GenerationProgress,
} from './types';

import {
  appTemplates,
  getTemplate,
  detectAppType,
  detectFeatures,
} from './templates';

import {
  generatePackageJson,
  generateAppTsx,
  generateAuthContext,
  generateThemeContext,
  generateApiService,
  generateRootNavigator,
  generateAuthNavigator,
  generateLoginScreen,
  generateSignupScreen,
  generateSplashScreen,
  generateComponentLibrary,
} from './react-native-templates';

import {
  generateBackendPackageJson,
  generateServerIndex,
  generateDatabaseConfig,
  generateUserModel,
  generateAuthRoutes,
  generateAuthController,
  generateAuthMiddleware,
  generateErrorHandler,
  generateValidateMiddleware,
  generateEnvExample,
  generatePaymentRoutes,
  generatePaymentController,
  generateDatabaseSchema,
} from './backend-templates';

// Re-export types
export * from './types';
export { appTemplates, getTemplate, detectAppType, detectFeatures };

// Generation progress callback type
export type ProgressCallback = (progress: GenerationProgress) => void;

/**
 * Main app generation function
 */
export async function generateApp(
  requirements: AppRequirements,
  onProgress?: ProgressCallback
): Promise<GeneratedApp> {
  const files: GeneratedFile[] = [];
  const template = getTemplate(requirements.type);

  if (!template) {
    throw new Error(`Unknown app type: ${requirements.type}`);
  }

  // Step 1: Generate project structure
  onProgress?.({
    step: 'structure',
    progress: 10,
    message: 'Creating project structure...',
  });

  // Step 2: Generate React Native code
  onProgress?.({
    step: 'frontend',
    progress: 30,
    message: 'Generating React Native components...',
  });

  const reactNativeFiles = generateReactNativeCode(requirements, template);
  files.push(...reactNativeFiles);

  // Simulate async operation
  await delay(500);

  // Step 3: Generate backend code
  onProgress?.({
    step: 'backend',
    progress: 60,
    message: 'Setting up Node.js backend...',
  });

  const backendFiles = generateBackendCode(requirements, template);
  files.push(...backendFiles);

  await delay(500);

  // Step 4: Generate database schema
  onProgress?.({
    step: 'database',
    progress: 80,
    message: 'Creating database schema...',
  });

  const databaseSchema = generateDatabaseSchema(template.backend.models);

  await delay(300);

  // Step 5: Generate preview URL
  onProgress?.({
    step: 'preview',
    progress: 95,
    message: 'Preparing live preview...',
  });

  const previewUrl = generatePreviewUrl(requirements, files);

  await delay(200);

  onProgress?.({
    step: 'complete',
    progress: 100,
    message: 'App generation complete!',
  });

  // Combine all React Native files into a single output
  const reactNativeCode = combineFilesToString(
    files.filter(f => f.type !== 'backend')
  );

  const backendCode = combineFilesToString(
    files.filter(f => f.type === 'backend')
  );

  return {
    reactNativeCode,
    backendCode,
    databaseSchema,
    previewUrl,
    files,
  };
}

/**
 * Generate React Native code files
 */
function generateReactNativeCode(
  requirements: AppRequirements,
  template: ReturnType<typeof getTemplate>
): GeneratedFile[] {
  if (!template) return [];

  const { name, colorTheme, features } = requirements;
  const files: GeneratedFile[] = [];

  // Package.json
  files.push({
    path: 'package.json',
    content: generatePackageJson(requirements),
    type: 'config',
  });

  // App.tsx
  files.push({
    path: 'App.tsx',
    content: generateAppTsx(requirements),
    type: 'config',
  });

  // Contexts
  files.push({
    path: 'src/contexts/AuthContext.tsx',
    content: generateAuthContext(),
    type: 'service',
  });

  files.push({
    path: 'src/contexts/ThemeContext.tsx',
    content: generateThemeContext(),
    type: 'service',
  });

  // Services
  files.push({
    path: 'src/services/api.ts',
    content: generateApiService('https://api.yourdomain.com'),
    type: 'service',
  });

  // Navigation
  files.push({
    path: 'src/navigation/RootNavigator.tsx',
    content: generateRootNavigator(template.screens),
    type: 'component',
  });

  files.push({
    path: 'src/navigation/AuthNavigator.tsx',
    content: generateAuthNavigator(),
    type: 'component',
  });

  // Screens
  files.push({
    path: 'src/screens/SplashScreen.tsx',
    content: generateSplashScreen(colorTheme, name),
    type: 'screen',
  });

  files.push({
    path: 'src/screens/LoginScreen.tsx',
    content: generateLoginScreen(colorTheme, name),
    type: 'screen',
  });

  files.push({
    path: 'src/screens/SignupScreen.tsx',
    content: generateSignupScreen(colorTheme, name),
    type: 'screen',
  });

  // Components
  files.push({
    path: 'src/components/ui/index.tsx',
    content: generateComponentLibrary(colorTheme),
    type: 'component',
  });

  // Generate app-specific screens based on template
  const appScreens = generateAppSpecificScreens(requirements, template);
  files.push(...appScreens);

  return files;
}

/**
 * Generate app-specific screens based on template type
 */
function generateAppSpecificScreens(
  requirements: AppRequirements,
  template: ReturnType<typeof getTemplate>
): GeneratedFile[] {
  if (!template) return [];

  const files: GeneratedFile[] = [];
  const { name, colorTheme, type } = requirements;

  // Generate home screen based on app type
  files.push({
    path: 'src/screens/HomeScreen.tsx',
    content: generateHomeScreen(type, colorTheme, name),
    type: 'screen',
  });

  // Add more screens based on app type
  // This can be expanded with more detailed templates

  return files;
}

/**
 * Generate home screen based on app type
 */
function generateHomeScreen(
  appType: AppType,
  theme: ColorTheme,
  appName: string
): string {
  const screenTemplates: Record<AppType, string> = {
    'food-delivery': generateFoodDeliveryHomeScreen(theme, appName),
    'ecommerce': generateEcommerceHomeScreen(theme, appName),
    'social': generateSocialHomeScreen(theme, appName),
    'booking': generateBookingHomeScreen(theme, appName),
    'fitness': generateFitnessHomeScreen(theme, appName),
    'travel': generateTravelHomeScreen(theme, appName),
    'education': generateEducationHomeScreen(theme, appName),
    'healthcare': generateHealthcareHomeScreen(theme, appName),
  };

  return screenTemplates[appType] || generateGenericHomeScreen(theme, appName);
}

function generateFoodDeliveryHomeScreen(theme: ColorTheme, appName: string): string {
  return `import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui';

const categories = [
  { id: '1', name: 'Pizza', icon: '🍕' },
  { id: '2', name: 'Burger', icon: '🍔' },
  { id: '3', name: 'Sushi', icon: '🍣' },
  { id: '4', name: 'Indian', icon: '🍛' },
  { id: '5', name: 'Chinese', icon: '🥡' },
  { id: '6', name: 'Dessert', icon: '🍰' },
];

const popularRestaurants = [
  { id: '1', name: 'Pizza Palace', rating: 4.5, cuisine: 'Italian', deliveryTime: '25-35 min', image: null },
  { id: '2', name: 'Burger Barn', rating: 4.3, cuisine: 'American', deliveryTime: '20-30 min', image: null },
  { id: '3', name: 'Spice Garden', rating: 4.7, cuisine: 'Indian', deliveryTime: '30-40 min', image: null },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'Guest'}!</Text>
            <Text style={styles.subtitle}>What would you like to eat?</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants or food..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Restaurants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Near You</Text>
          {popularRestaurants.map((restaurant) => (
            <TouchableOpacity key={restaurant.id}>
              <Card style={styles.restaurantCard}>
                <View style={styles.restaurantImage}>
                  <Text style={styles.placeholderText}>🍽️</Text>
                </View>
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                  <View style={styles.restaurantMeta}>
                    <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
                    <Text style={styles.deliveryTime}>{restaurant.deliveryTime}</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '${theme.background || '#FFFFFF'}',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '${theme.text || '#212121'}',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '${theme.text || '#212121'}',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoryCard: {
    alignItems: 'center',
    marginLeft: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '${theme.primary}15',
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '${theme.text || '#212121'}',
  },
  restaurantCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '${theme.text || '#212121'}',
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  restaurantMeta: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  rating: {
    fontSize: 12,
    color: '${theme.primary}',
    fontWeight: '500',
  },
  deliveryTime: {
    fontSize: 12,
    color: '#666',
  },
});
`;
}

function generateEcommerceHomeScreen(theme: ColorTheme, appName: string): string {
  return `import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from '../components/ui';

export default function HomeScreen() {
  const { user } = useAuth();

  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'];
  const featuredProducts = [
    { id: '1', name: 'Wireless Headphones', price: 2999, originalPrice: 4999 },
    { id: '2', name: 'Smart Watch', price: 5999, originalPrice: 8999 },
    { id: '3', name: 'Running Shoes', price: 3499, originalPrice: 4999 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {user?.name || 'Shopper'}!</Text>
          <Text style={styles.subtitle}>Discover amazing deals</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat, idx) => (
              <TouchableOpacity key={idx} style={styles.categoryChip}>
                <Text style={styles.categoryText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          {featuredProducts.map((product) => (
            <Card key={product.id} style={styles.productCard}>
              <View style={styles.productImage}>
                <Text style={styles.placeholderIcon}>📦</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>₹{product.price}</Text>
                  <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '${theme.background || '#FFFFFF'}' },
  header: { padding: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '${theme.text || '#212121'}' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  section: { paddingVertical: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', paddingHorizontal: 20, marginBottom: 12, color: '${theme.text || '#212121'}' },
  categoryChip: { marginLeft: 20, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '${theme.primary}', borderRadius: 20 },
  categoryText: { color: '#FFFFFF', fontWeight: '500' },
  productCard: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 12, padding: 12 },
  productImage: { width: 80, height: 80, backgroundColor: '#F5F5F5', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  placeholderIcon: { fontSize: 32 },
  productInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  productName: { fontSize: 16, fontWeight: '600', color: '${theme.text || '#212121'}' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  price: { fontSize: 18, fontWeight: 'bold', color: '${theme.primary}' },
  originalPrice: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },
});
`;
}

// Simplified generators for other app types
function generateSocialHomeScreen(theme: ColorTheme, appName: string): string {
  return generateGenericHomeScreen(theme, appName, 'social');
}

function generateBookingHomeScreen(theme: ColorTheme, appName: string): string {
  return generateGenericHomeScreen(theme, appName, 'booking');
}

function generateFitnessHomeScreen(theme: ColorTheme, appName: string): string {
  return generateGenericHomeScreen(theme, appName, 'fitness');
}

function generateTravelHomeScreen(theme: ColorTheme, appName: string): string {
  return generateGenericHomeScreen(theme, appName, 'travel');
}

function generateEducationHomeScreen(theme: ColorTheme, appName: string): string {
  return generateGenericHomeScreen(theme, appName, 'education');
}

function generateHealthcareHomeScreen(theme: ColorTheme, appName: string): string {
  return generateGenericHomeScreen(theme, appName, 'healthcare');
}

function generateGenericHomeScreen(theme: ColorTheme, appName: string, type?: string): string {
  return `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card } from '../components/ui';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>${appName}</Text>
        <Text style={styles.subtitle}>Welcome, {user?.name || 'User'}!</Text>
        
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Getting Started</Text>
          <Text style={styles.cardText}>
            This is your app's home screen. Customize it to match your needs.
          </Text>
        </Card>

        <Button title="Logout" onPress={logout} variant="outline" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '${theme.background || '#FFFFFF'}' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '${theme.primary}', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 8, marginBottom: 24 },
  card: { marginBottom: 24 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '${theme.text || '#212121'}', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#666', lineHeight: 20 },
});
`;
}

/**
 * Generate backend code files
 */
function generateBackendCode(
  requirements: AppRequirements,
  template: ReturnType<typeof getTemplate>
): GeneratedFile[] {
  if (!template) return [];

  const { name, features } = requirements;
  const files: GeneratedFile[] = [];

  // Package.json
  files.push({
    path: 'backend/package.json',
    content: generateBackendPackageJson(name),
    type: 'backend',
  });

  // Server index
  files.push({
    path: 'backend/src/index.js',
    content: generateServerIndex(name),
    type: 'backend',
  });

  // Config
  files.push({
    path: 'backend/src/config/database.js',
    content: generateDatabaseConfig(),
    type: 'backend',
  });

  // Models
  files.push({
    path: 'backend/src/models/User.js',
    content: generateUserModel(),
    type: 'backend',
  });

  // Routes
  files.push({
    path: 'backend/src/routes/auth.js',
    content: generateAuthRoutes(),
    type: 'backend',
  });

  // Controllers
  files.push({
    path: 'backend/src/controllers/authController.js',
    content: generateAuthController(),
    type: 'backend',
  });

  // Middleware
  files.push({
    path: 'backend/src/middleware/auth.js',
    content: generateAuthMiddleware(),
    type: 'backend',
  });

  files.push({
    path: 'backend/src/middleware/errorHandler.js',
    content: generateErrorHandler(),
    type: 'backend',
  });

  files.push({
    path: 'backend/src/middleware/validate.js',
    content: generateValidateMiddleware(),
    type: 'backend',
  });

  // Environment example
  files.push({
    path: 'backend/.env.example',
    content: generateEnvExample(),
    type: 'backend',
  });

  // Payment routes if needed
  if (features.includes('payment')) {
    files.push({
      path: 'backend/src/routes/payments.js',
      content: generatePaymentRoutes(),
      type: 'backend',
    });

    files.push({
      path: 'backend/src/controllers/paymentController.js',
      content: generatePaymentController(),
      type: 'backend',
    });
  }

  return files;
}

/**
 * Generate a preview URL (simulated - would integrate with Expo Snack in production)
 */
function generatePreviewUrl(
  requirements: AppRequirements,
  files: GeneratedFile[]
): string {
  // In a real implementation, this would:
  // 1. Upload files to Expo Snack or similar service
  // 2. Return the live preview URL
  
  // For now, return a placeholder
  const appId = `app-${Date.now()}`;
  return `https://snack.expo.dev/@appdev/${appId}`;
}

/**
 * Combine files into a single string for download
 */
function combineFilesToString(files: GeneratedFile[]): string {
  return files
    .map((file) => {
      return `// ============================================
// File: ${file.path}
// ============================================

${file.content}
`;
    })
    .join('\n\n');
}

/**
 * Utility delay function
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse conversation history to extract requirements
 */
export function parseConversationToRequirements(
  conversation: string,
  appName: string,
  framework: Framework
): AppRequirements {
  const detectedType = detectAppType(conversation) as AppType;
  const detectedFeatures = detectFeatures(conversation) as FeatureType[];
  const template = getTemplate(detectedType);

  return {
    name: appName,
    type: detectedType,
    framework,
    features: detectedFeatures,
    colorTheme: template?.defaultTheme || {
      primary: '#3F51B5',
      secondary: '#FF4081',
      accent: '#00BCD4',
    },
    screens: template?.screens || [],
    description: conversation.substring(0, 500),
  };
}
