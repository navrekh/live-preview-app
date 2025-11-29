// Common Navigation Templates

import { ColorTheme } from '../types';

export function generateAppEntry(theme: ColorTheme, screens: string[]): string {
  const screenImports = screens.map(s => `import ${s}Screen from './screens/${s}Screen';`).join('\n');
  const stackScreens = screens.map(s => `        <Stack.Screen name="${s}" component={${s}Screen} />`).join('\n');

  return `import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthNavigator from './navigation/AuthNavigator';
import MainNavigator from './navigation/MainNavigator';
import LoadingScreen from './screens/LoadingScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const theme = {
  primary: '${theme.primary}',
  secondary: '${theme.secondary}',
  accent: '${theme.accent}',
  background: '${theme.background}',
  text: '${theme.text}',
  card: '${theme.card}',
  border: '${theme.border}',
};

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load any resources here
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
`;
}

export function generateAuthNavigator(): string {
  return `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
`;
}

export function generateBottomTabNavigator(tabs: { name: string; icon: string; component: string }[], theme: ColorTheme): string {
  const imports = tabs.map(t => `import ${t.component}Screen from '../screens/${t.component}Screen';`).join('\n');
  const tabScreens = tabs.map(t => `
      <Tab.Screen
        name="${t.name}"
        component={${t.component}Screen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="${t.icon}" size={size} color={color} />
          ),
        }}
      />`).join('');

  return `import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
${imports}

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '${theme.primary}',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '${theme.card}',
          borderTopColor: '${theme.border}',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >${tabScreens}
    </Tab.Navigator>
  );
}
`;
}
