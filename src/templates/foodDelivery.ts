// Food Delivery App Template

import { TemplateConfig, GeneratedTemplate, ColorTheme, sanitizeAppName } from './types';
import { generateReactNativePackageJson, generateBackendPackageJson } from './common/package';
import { generateAppEntry, generateAuthNavigator, generateBottomTabNavigator } from './common/navigation';
import { generateAuthContext, generateThemeContext, generateCartContext } from './common/contexts';
import { 
  generateLoadingScreen, 
  generateLoginScreen, 
  generateRegisterScreen,
  generateForgotPasswordScreen,
  generateProfileScreen 
} from './common/screens';
import { 
  generateApiService, 
  generateBackendServer,
  generateDatabaseConfig,
  generateErrorHandler,
  generateAuthMiddleware,
  generateUserModel,
  generateAuthRoutes,
  generateAuthController,
  generateValidateMiddleware,
  generateEnvExample
} from './common/api';

const defaultFoodTheme: ColorTheme = {
  primary: '#FF5722',
  secondary: '#FFC107',
  accent: '#4CAF50',
  background: '#F5F5F5',
  text: '#212121',
  card: '#FFFFFF',
  border: '#E0E0E0',
};

export function generateFoodDeliveryTemplate(config: TemplateConfig): GeneratedTemplate {
  const theme = { ...defaultFoodTheme, ...config.theme };
  const appName = config.appName;
  const apiBaseUrl = config.apiBaseUrl || 'http://localhost:3001/api';

  const files: Record<string, string> = {};

  // ============ REACT NATIVE FILES ============
  
  // Package.json
  files['mobile/package.json'] = generateReactNativePackageJson(config, {
    '@react-navigation/bottom-tabs': '^6.5.11',
    '@expo/vector-icons': '~14.0.0',
    'react-native-maps': '1.8.0',
    'expo-location': '~16.5.0',
  });

  // App.js
  files['mobile/App.js'] = generateAppEntry(theme, ['Home', 'Restaurant', 'Cart', 'Profile']);

  // Navigation
  files['mobile/navigation/AuthNavigator.js'] = generateAuthNavigator();
  files['mobile/navigation/MainNavigator.js'] = generateBottomTabNavigator([
    { name: 'Home', icon: 'home', component: 'Home' },
    { name: 'Search', icon: 'search', component: 'Search' },
    { name: 'Orders', icon: 'receipt', component: 'Orders' },
    { name: 'Profile', icon: 'person', component: 'Profile' },
  ], theme);

  // Contexts
  files['mobile/contexts/AuthContext.js'] = generateAuthContext(apiBaseUrl);
  files['mobile/contexts/ThemeContext.js'] = generateThemeContext();
  files['mobile/contexts/CartContext.js'] = generateCartContext();

  // Services
  files['mobile/services/api.js'] = generateApiService(apiBaseUrl);

  // Common Screens
  files['mobile/screens/LoadingScreen.js'] = generateLoadingScreen(theme, appName);
  files['mobile/screens/LoginScreen.js'] = generateLoginScreen(theme, appName);
  files['mobile/screens/RegisterScreen.js'] = generateRegisterScreen(theme, appName);
  files['mobile/screens/ForgotPasswordScreen.js'] = generateForgotPasswordScreen(theme);
  files['mobile/screens/ProfileScreen.js'] = generateProfileScreen(theme);

  // Food Delivery Specific Screens
  files['mobile/screens/HomeScreen.js'] = generateFoodHomeScreen(theme, appName);
  files['mobile/screens/RestaurantScreen.js'] = generateRestaurantScreen(theme);
  files['mobile/screens/CartScreen.js'] = generateCartScreen(theme);
  files['mobile/screens/SearchScreen.js'] = generateSearchScreen(theme);
  files['mobile/screens/OrdersScreen.js'] = generateOrdersScreen(theme);
  files['mobile/screens/CheckoutScreen.js'] = generateCheckoutScreen(theme);
  files['mobile/screens/OrderTrackingScreen.js'] = generateOrderTrackingScreen(theme);

  // Components
  files['mobile/components/RestaurantCard.js'] = generateRestaurantCard(theme);
  files['mobile/components/MenuItemCard.js'] = generateMenuItemCard(theme);
  files['mobile/components/CategoryList.js'] = generateCategoryList(theme);

  // ============ BACKEND FILES ============
  
  files['backend/package.json'] = generateBackendPackageJson(config, {
    'razorpay': '^2.9.2',
  });

  files['backend/src/index.js'] = generateBackendServer(appName, ['auth', 'restaurants', 'orders', 'payments']);
  files['backend/src/config/database.js'] = generateDatabaseConfig();
  files['backend/src/middleware/errorHandler.js'] = generateErrorHandler();
  files['backend/src/middleware/auth.js'] = generateAuthMiddleware();
  files['backend/src/middleware/validate.js'] = generateValidateMiddleware();

  // Models
  files['backend/src/models/User.js'] = generateUserModel();
  files['backend/src/models/Restaurant.js'] = generateRestaurantModel();
  files['backend/src/models/MenuItem.js'] = generateMenuItemModel();
  files['backend/src/models/Order.js'] = generateOrderModel();

  // Routes
  files['backend/src/routes/auth.js'] = generateAuthRoutes();
  files['backend/src/routes/restaurants.js'] = generateRestaurantRoutes();
  files['backend/src/routes/orders.js'] = generateOrderRoutes();
  files['backend/src/routes/payments.js'] = generatePaymentRoutes();

  // Controllers
  files['backend/src/controllers/authController.js'] = generateAuthController();
  files['backend/src/controllers/restaurantController.js'] = generateRestaurantController();
  files['backend/src/controllers/orderController.js'] = generateOrderController();
  files['backend/src/controllers/paymentController.js'] = generatePaymentController();

  // Environment
  files['backend/.env.example'] = generateEnvExample();

  // README
  const readme = generateReadme(appName, 'Food Delivery');

  return {
    files,
    readme,
    setupInstructions: [
      '1. Install mobile dependencies: cd mobile && npm install',
      '2. Install backend dependencies: cd backend && npm install',
      '3. Set up MongoDB database',
      '4. Copy backend/.env.example to backend/.env and configure',
      '5. Start backend: cd backend && npm run dev',
      '6. Start mobile: cd mobile && npm start',
    ],
  };
}

// Food Delivery Specific Screen Generators

function generateFoodHomeScreen(theme: ColorTheme, appName: string): string {
  return `import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import CategoryList from '../components/CategoryList';

const categories = [
  { id: '1', name: 'Pizza', emoji: '🍕' },
  { id: '2', name: 'Burger', emoji: '🍔' },
  { id: '3', name: 'Sushi', emoji: '🍣' },
  { id: '4', name: 'Indian', emoji: '🍛' },
  { id: '5', name: 'Chinese', emoji: '🥡' },
  { id: '6', name: 'Dessert', emoji: '🍰' },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCategory]);

  const fetchRestaurants = async () => {
    try {
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await api.get('/restaurants', { params });
      setRestaurants(response.data.restaurants || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      // Use sample data for demo
      setRestaurants([
        { _id: '1', name: 'Pizza Palace', cuisine: 'Italian', rating: 4.5, deliveryTime: '25-35', priceRange: '₹₹', image: null },
        { _id: '2', name: 'Burger Barn', cuisine: 'American', rating: 4.3, deliveryTime: '20-30', priceRange: '₹', image: null },
        { _id: '3', name: 'Spice Garden', cuisine: 'Indian', rating: 4.7, deliveryTime: '30-40', priceRange: '₹₹₹', image: null },
        { _id: '4', name: 'Dragon Wok', cuisine: 'Chinese', rating: 4.2, deliveryTime: '25-35', priceRange: '₹₹', image: null },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurants();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Guest'}! 👋</Text>
          <Text style={styles.subtitle}>What would you like to eat?</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationBtn}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="${theme.text}" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search restaurants, dishes..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Categories */}
      <CategoryList
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Restaurants */}
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            onPress={() => navigation.navigate('Restaurant', { restaurant: item })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Popular Near You</Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No restaurants found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '${theme.background}',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '${theme.text}',
  },
  subtitle: {
    fontSize: 14,
    color: '${theme.text}',
    opacity: 0.6,
    marginTop: 4,
  },
  notificationBtn: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '${theme.card}',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '${theme.border}',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '${theme.text}',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '${theme.text}',
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
`;
}

function generateRestaurantScreen(theme: ColorTheme): string {
  return `import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import MenuItemCard from '../components/MenuItemCard';

export default function RestaurantScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const { items, itemCount, total } = useCart();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await api.get(\`/restaurants/\${restaurant._id}/menu\`);
      setMenu(response.data.menu || []);
    } catch (error) {
      // Sample menu for demo
      setMenu([
        { _id: '1', name: 'Margherita Pizza', price: 299, description: 'Fresh tomatoes, mozzarella, basil', category: 'Pizza' },
        { _id: '2', name: 'Pepperoni Pizza', price: 399, description: 'Pepperoni, cheese, tomato sauce', category: 'Pizza' },
        { _id: '3', name: 'Garlic Bread', price: 149, description: 'Crispy bread with garlic butter', category: 'Sides' },
        { _id: '4', name: 'Pasta Alfredo', price: 349, description: 'Creamy alfredo sauce with fettuccine', category: 'Pasta' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']}>
        {/* Header Image */}
        <View style={styles.headerImage}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerPlaceholder}>
            <Text style={styles.headerEmoji}>🍽️</Text>
          </View>
        </View>

        {/* Restaurant Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text style={styles.metaText}>{restaurant.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{restaurant.deliveryTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{restaurant.priceRange}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Menu */}
      <FlatList
        data={menu}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            restaurantId={restaurant._id}
            restaurantName={restaurant.name}
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.menuTitle}>Menu</Text>
        }
      />

      {/* Cart Button */}
      {itemCount > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <View style={styles.cartInfo}>
            <Text style={styles.cartCount}>{itemCount} items</Text>
            <Text style={styles.cartTotal}>₹{total}</Text>
          </View>
          <Text style={styles.cartText}>View Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '${theme.background}',
  },
  headerImage: {
    height: 200,
    backgroundColor: '${theme.primary}',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerPlaceholder: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 64,
  },
  info: {
    padding: 20,
    backgroundColor: '${theme.card}',
    borderBottomWidth: 1,
    borderBottomColor: '${theme.border}',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '${theme.text}',
  },
  cuisine: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '${theme.text}',
    marginBottom: 16,
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '${theme.primary}',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  cartCount: {
    color: '#fff',
    fontSize: 14,
  },
  cartTotal: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
`;
}

function generateCartScreen(theme: ColorTheme): string {
  return `import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';

export default function CartScreen({ navigation }) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Add items to your cart to proceed');
      return;
    }
    navigation.navigate('Checkout');
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityBtn}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={18} color="${theme.primary}" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityBtn}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={18} color="${theme.primary}" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const deliveryFee = 40;
  const grandTotal = total + deliveryFee;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="${theme.text}" />
        </TouchableOpacity>
        <Text style={styles.title}>My Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseBtnText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{total}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{deliveryFee}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{grandTotal}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '${theme.background}',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '${theme.border}',
    backgroundColor: '${theme.card}',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '${theme.text}',
  },
  clearText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: '${theme.primary}',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '${theme.card}',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '${theme.text}',
  },
  itemPrice: {
    fontSize: 14,
    color: '${theme.primary}',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '${theme.primary}15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  summary: {
    backgroundColor: '${theme.card}',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '${theme.border}',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '${theme.text}',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '${theme.border}',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '${theme.text}',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '${theme.primary}',
  },
  checkoutBtn: {
    backgroundColor: '${theme.primary}',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
`;
}

function generateSearchScreen(theme: ColorTheme): string {
  return `import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RestaurantCard from '../components/RestaurantCard';

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search restaurants, cuisines..."
          placeholderTextColor="#999"
          autoFocus
        />
        {search.length > 0 && (
          <Ionicons 
            name="close-circle" 
            size={20} 
            color="#999"
            onPress={() => setSearch('')}
          />
        )}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            onPress={() => navigation.navigate('Restaurant', { restaurant: item })}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              {search ? 'No results found' : 'Search for restaurants'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '${theme.background}' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '${theme.card}',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: { flex: 1, fontSize: 16, color: '${theme.text}' },
  list: { padding: 16, paddingTop: 0 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: '#999', marginTop: 16, fontSize: 16 },
});
`;
}

function generateOrdersScreen(theme: ColorTheme): string {
  return `import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      // Sample orders for demo
      setOrders([
        { _id: '1', restaurant: { name: 'Pizza Palace' }, total: 598, status: 'delivered', createdAt: new Date().toISOString() },
        { _id: '2', restaurant: { name: 'Burger Barn' }, total: 348, status: 'on_the_way', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#4CAF50';
      case 'on_the_way': return '${theme.primary}';
      case 'preparing': return '#FFC107';
      default: return '#999';
    }
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderTracking', { order: item })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.restaurantName}>{item.restaurant?.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status?.replace('_', ' ')}
          </Text>
        </View>
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>₹{item.total}</Text>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '${theme.background}' },
  title: { fontSize: 24, fontWeight: 'bold', color: '${theme.text}', padding: 20 },
  list: { paddingHorizontal: 20 },
  orderCard: { backgroundColor: '${theme.card}', padding: 16, borderRadius: 12, marginBottom: 12 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  restaurantName: { fontSize: 16, fontWeight: '600', color: '${theme.text}' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '500', textTransform: 'capitalize' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: '${theme.primary}' },
  orderDate: { fontSize: 12, color: '#999' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: '#999', marginTop: 16, fontSize: 16 },
});
`;
}

function generateCheckoutScreen(theme: ColorTheme): string {
  return `import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';

export default function CheckoutScreen({ navigation }) {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('cod');

  const deliveryFee = 40;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          menuItem: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: grandTotal,
        paymentMethod: selectedPayment,
        deliveryAddress: selectedAddress || 'Default Address',
      };

      const response = await api.post('/orders', orderData);
      clearCart();
      Alert.alert('Success', 'Order placed successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('OrderTracking', { order: response.data.order || { _id: '1' } }) }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="${theme.text}" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TouchableOpacity style={styles.addressCard}>
            <Ionicons name="location" size={24} color="${theme.primary}" />
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Home</Text>
              <Text style={styles.addressText}>123 Main Street, City, State 12345</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {['cod', 'card', 'upi'].map((method) => (
            <TouchableOpacity
              key={method}
              style={[styles.paymentOption, selectedPayment === method && styles.selectedPayment]}
              onPress={() => setSelectedPayment(method)}
            >
              <Ionicons 
                name={method === 'cod' ? 'cash' : method === 'card' ? 'card' : 'phone-portrait'} 
                size={24} 
                color={selectedPayment === method ? '${theme.primary}' : '#666'}
              />
              <Text style={styles.paymentText}>
                {method === 'cod' ? 'Cash on Delivery' : method === 'card' ? 'Credit/Debit Card' : 'UPI'}
              </Text>
              {selectedPayment === method && (
                <Ionicons name="checkmark-circle" size={24} color="${theme.primary}" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <Text style={styles.summaryName}>{item.quantity}x {item.name}</Text>
              <Text style={styles.summaryPrice}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryPrice}>₹{total}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryPrice}>₹{deliveryFee}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{grandTotal}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.placeOrderBtn, loading && styles.btnDisabled]} 
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order - ₹{grandTotal}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '${theme.background}' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '${theme.card}' },
  title: { fontSize: 18, fontWeight: '600', color: '${theme.text}' },
  content: { flex: 1 },
  section: { backgroundColor: '${theme.card}', margin: 16, marginBottom: 0, padding: 16, borderRadius: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '${theme.text}', marginBottom: 16 },
  addressCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addressInfo: { flex: 1 },
  addressLabel: { fontSize: 14, fontWeight: '600', color: '${theme.text}' },
  addressText: { fontSize: 12, color: '#666', marginTop: 4 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, marginBottom: 8, backgroundColor: '${theme.background}' },
  selectedPayment: { backgroundColor: '${theme.primary}15', borderColor: '${theme.primary}', borderWidth: 1 },
  paymentText: { flex: 1, fontSize: 14, color: '${theme.text}' },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryName: { fontSize: 14, color: '${theme.text}' },
  summaryPrice: { fontSize: 14, color: '${theme.text}' },
  summaryLabel: { fontSize: 14, color: '#666' },
  divider: { height: 1, backgroundColor: '${theme.border}', marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '${theme.text}' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '${theme.primary}' },
  footer: { padding: 16, backgroundColor: '${theme.card}', borderTopWidth: 1, borderTopColor: '${theme.border}' },
  placeOrderBtn: { backgroundColor: '${theme.primary}', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnDisabled: { opacity: 0.7 },
  placeOrderText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
`;
}

function generateOrderTrackingScreen(theme: ColorTheme): string {
  return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const steps = [
  { id: 1, title: 'Order Placed', icon: 'receipt', completed: true },
  { id: 2, title: 'Preparing', icon: 'restaurant', completed: true },
  { id: 3, title: 'On the Way', icon: 'bicycle', completed: false },
  { id: 4, title: 'Delivered', icon: 'checkmark-circle', completed: false },
];

export default function OrderTrackingScreen({ route }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Track Order</Text>
      <View style={styles.card}>
        <Text style={styles.orderId}>Order #12345</Text>
        <Text style={styles.eta}>Estimated delivery: 25-30 min</Text>
      </View>

      <View style={styles.timeline}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.step}>
            <View style={[styles.stepIcon, step.completed && styles.completedIcon]}>
              <Ionicons name={step.icon} size={20} color={step.completed ? '#fff' : '#999'} />
            </View>
            <Text style={[styles.stepTitle, step.completed && styles.completedText]}>{step.title}</Text>
            {index < steps.length - 1 && (
              <View style={[styles.line, step.completed && styles.completedLine]} />
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '${theme.background}', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '${theme.text}', marginBottom: 20 },
  card: { backgroundColor: '${theme.card}', padding: 20, borderRadius: 12, marginBottom: 24 },
  orderId: { fontSize: 16, fontWeight: '600', color: '${theme.text}' },
  eta: { fontSize: 14, color: '${theme.primary}', marginTop: 8 },
  timeline: { paddingLeft: 20 },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, position: 'relative' },
  stepIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  completedIcon: { backgroundColor: '${theme.primary}' },
  stepTitle: { marginLeft: 16, fontSize: 16, color: '#999' },
  completedText: { color: '${theme.text}', fontWeight: '500' },
  line: { position: 'absolute', left: 19, top: 44, width: 2, height: 32, backgroundColor: '#E0E0E0' },
  completedLine: { backgroundColor: '${theme.primary}' },
});
`;
}

// Component Generators

function generateRestaurantCard(theme: ColorTheme): string {
  return `import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantCard({ restaurant, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.image}>
        <Text style={styles.emoji}>🍽️</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
        <View style={styles.meta}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
          <View style={styles.time}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.timeText}>{restaurant.deliveryTime} min</Text>
          </View>
          <Text style={styles.price}>{restaurant.priceRange}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '${theme.card}', borderRadius: 16, marginBottom: 16, flexDirection: 'row', padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  image: { width: 80, height: 80, borderRadius: 12, backgroundColor: '${theme.primary}20', justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 32 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '600', color: '${theme.text}' },
  cuisine: { fontSize: 13, color: '#666', marginTop: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '500' },
  time: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 13, color: '#666' },
  price: { fontSize: 13, color: '#666' },
});
`;
}

function generateMenuItemCard(theme: ColorTheme): string {
  return `import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';

export default function MenuItemCard({ item, restaurantId, restaurantName }) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === item._id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      id: item._id,
      name: item.name,
      price: item.price,
      restaurantId,
      restaurantName,
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      
      {quantity > 0 ? (
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item._id, quantity - 1)}>
            <Ionicons name="remove" size={18} color="${theme.primary}" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item._id, quantity + 1)}>
            <Ionicons name="add" size={18} color="${theme.primary}" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '${theme.card}', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '500', color: '${theme.text}' },
  description: { fontSize: 13, color: '#666', marginTop: 4 },
  price: { fontSize: 15, fontWeight: '600', color: '${theme.primary}', marginTop: 8 },
  addBtn: { backgroundColor: '${theme.primary}', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: '600' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '${theme.primary}15', justifyContent: 'center', alignItems: 'center' },
  quantity: { fontSize: 16, fontWeight: '600', minWidth: 20, textAlign: 'center' },
});
`;
}

function generateCategoryList(theme: ColorTheme): string {
  return `import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategoryList({ categories, selected, onSelect }) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.category, selected === cat.id && styles.selected]}
          onPress={() => onSelect(selected === cat.id ? null : cat.id)}
        >
          <Text style={styles.emoji}>{cat.emoji}</Text>
          <Text style={[styles.name, selected === cat.id && styles.selectedText]}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 8 },
  category: { alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, marginRight: 12, borderRadius: 16, backgroundColor: '${theme.card}', minWidth: 70 },
  selected: { backgroundColor: '${theme.primary}' },
  emoji: { fontSize: 24, marginBottom: 4 },
  name: { fontSize: 12, color: '${theme.text}', fontWeight: '500' },
  selectedText: { color: '#fff' },
});
`;
}

// Backend Model Generators

function generateRestaurantModel(): string {
  return `const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  cuisine: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: { lat: Number, lng: Number },
  },
  phone: String,
  email: String,
  image: String,
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  priceRange: { type: String, enum: ['₹', '₹₹', '₹₹₹', '₹₹₹₹'], default: '₹₹' },
  deliveryTime: { type: String, default: '30-45' },
  isOpen: { type: Boolean, default: true },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  categories: [String],
  featured: { type: Boolean, default: false },
}, { timestamps: true });

restaurantSchema.index({ 'address.coordinates': '2dsphere' });
restaurantSchema.index({ name: 'text', cuisine: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
`;
}

function generateMenuItemModel(): string {
  return `const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true, trim: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  image: String,
  isVegetarian: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  customizations: [{
    name: String,
    options: [{
      name: String,
      price: Number,
    }],
    required: Boolean,
    multiple: Boolean,
  }],
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
`;
}

function generateOrderModel(): string {
  return `const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    customizations: [{ name: String, option: String, price: Number }],
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 40 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: { type: String, enum: ['cod', 'card', 'upi'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: { lat: Number, lng: Number },
  },
  estimatedDelivery: Date,
  deliveredAt: Date,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
`;
}

// Backend Route Generators

function generateRestaurantRoutes(): string {
  return `const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', restaurantController.getAll);
router.get('/featured', restaurantController.getFeatured);
router.get('/search', restaurantController.search);
router.get('/:id', restaurantController.getById);
router.get('/:id/menu', restaurantController.getMenu);

module.exports = router;
`;
}

function generateOrderRoutes(): string {
  return `const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.post('/', orderController.create);
router.get('/', orderController.getMyOrders);
router.get('/:id', orderController.getById);
router.put('/:id/cancel', orderController.cancel);

module.exports = router;
`;
}

function generatePaymentRoutes(): string {
  return `const express = require('express');
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verify);

module.exports = router;
`;
}

// Backend Controller Generators

function generateRestaurantController(): string {
  return `const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

exports.getAll = async (req, res, next) => {
  try {
    const { category, cuisine, page = 1, limit = 20 } = req.query;
    const query = { isOpen: true };
    
    if (category) query.categories = category;
    if (cuisine) query.cuisine = cuisine;

    const restaurants = await Restaurant.find(query)
      .sort({ featured: -1, rating: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Restaurant.countDocuments(query);

    res.json({ restaurants, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

exports.getFeatured = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ featured: true, isOpen: true }).limit(10);
    res.json({ restaurants });
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    const restaurants = await Restaurant.find(
      { $text: { $search: q }, isOpen: true },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).limit(20);
    res.json({ restaurants });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({ restaurant });
  } catch (error) {
    next(error);
  }
};

exports.getMenu = async (req, res, next) => {
  try {
    const menu = await MenuItem.find({ restaurant: req.params.id, isAvailable: true });
    res.json({ menu });
  } catch (error) {
    next(error);
  }
};
`;
}

function generateOrderController(): string {
  return `const Order = require('../models/Order');

exports.create = async (req, res, next) => {
  try {
    const { items, restaurantId, deliveryAddress, paymentMethod, notes } = req.body;
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 40;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurantId,
      items,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      paymentMethod,
      notes,
      estimatedDelivery: new Date(Date.now() + 45 * 60000),
    });

    res.status(201).json({ message: 'Order placed', order });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant', 'name image')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
      .populate('restaurant')
      .populate('items.menuItem');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (error) {
    next(error);
  }
};

exports.cancel = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }
    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    next(error);
  }
};
`;
}

function generatePaymentController(): string {
  return `const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
  try {
    const { amount, orderId } = req.body;

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: orderId || \`order_\${Date.now()}\`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        status: 'confirmed',
      });
    }

    res.json({ message: 'Payment verified', paymentId: razorpay_payment_id });
  } catch (error) {
    next(error);
  }
};
`;
}

function generateReadme(appName: string, appType: string): string {
  return `# ${appName} - ${appType} App

A complete ${appType.toLowerCase()} application built with React Native (Expo) and Node.js backend.

## Features

- User authentication (Login, Register, Forgot Password)
- Browse and search functionality
- Shopping cart with persistent storage
- Order management
- Profile management
- Razorpay payment integration

## Tech Stack

### Mobile (React Native)
- Expo SDK 50
- React Navigation 6
- Axios for API calls
- AsyncStorage for local storage

### Backend (Node.js)
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Razorpay payment gateway

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Expo CLI (\`npm install -g expo-cli\`)

### Mobile Setup

\`\`\`bash
cd mobile
npm install
npm start
\`\`\`

### Backend Setup

\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
\`\`\`

## Environment Variables

### Backend (.env)
\`\`\`
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/${appName.toLowerCase().replace(/\s+/g, '')}
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
\`\`\`

## API Endpoints

### Auth
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user
- PUT /api/auth/profile - Update profile

### Additional endpoints documented in the code.

## License

MIT License
`;
}
