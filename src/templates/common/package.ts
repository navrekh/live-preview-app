// Common Package.json Templates

import { TemplateConfig, sanitizeAppName } from '../types';

export function generateReactNativePackageJson(config: TemplateConfig, additionalDeps: Record<string, string> = {}): string {
  const baseDeps = {
    "expo": "~50.0.0",
    "expo-status-bar": "~1.11.0",
    "react": "18.2.0",
    "react-native": "0.73.2",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "react-native-screens": "~3.29.0",
    "react-native-safe-area-context": "4.8.2",
    "react-native-gesture-handler": "~2.14.0",
    "@react-native-async-storage/async-storage": "1.21.0",
    "axios": "^1.6.5",
    "expo-splash-screen": "~0.26.0",
    "expo-font": "~11.10.0",
  };

  const allDeps = { ...baseDeps, ...additionalDeps };

  return JSON.stringify({
    name: sanitizeAppName(config.appName),
    version: "1.0.0",
    main: "expo/AppEntry.js",
    scripts: {
      start: "expo start",
      android: "expo start --android",
      ios: "expo start --ios",
      web: "expo start --web",
      test: "jest",
      lint: "eslint ."
    },
    dependencies: allDeps,
    devDependencies: {
      "@babel/core": "^7.23.7",
      "@types/react": "~18.2.48",
      "typescript": "^5.3.3",
      "jest": "^29.7.0",
      "@testing-library/react-native": "^12.4.3"
    },
    private: true
  }, null, 2);
}

export function generateBackendPackageJson(config: TemplateConfig, additionalDeps: Record<string, string> = {}): string {
  const baseDeps = {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "express-validator": "^7.0.1",
    "express-rate-limit": "^7.1.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.1.1"
  };

  const allDeps = { ...baseDeps, ...additionalDeps };

  return JSON.stringify({
    name: `${sanitizeAppName(config.appName)}-backend`,
    version: "1.0.0",
    main: "src/index.js",
    scripts: {
      start: "node src/index.js",
      dev: "nodemon src/index.js",
      test: "jest",
      lint: "eslint src/"
    },
    dependencies: allDeps,
    devDependencies: {
      "nodemon": "^3.0.3",
      "jest": "^29.7.0",
      "eslint": "^8.56.0"
    }
  }, null, 2);
}
