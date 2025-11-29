import React, { useState } from 'react';
import { ScreenProps, CartItem } from '../../types';
import { ArrowLeft, Star, Clock, Heart, Plus, Minus, ShoppingCart } from 'lucide-react';

const menuItems = [
  { id: '1', name: 'Margherita Pizza', price: 299, description: 'Fresh tomatoes, mozzarella, basil', category: 'Pizza', rating: 4.5 },
  { id: '2', name: 'Pepperoni Pizza', price: 399, description: 'Pepperoni, cheese, tomato sauce', category: 'Pizza', rating: 4.7 },
  { id: '3', name: 'Garlic Bread', price: 149, description: 'Crispy bread with garlic butter', category: 'Sides', rating: 4.3 },
  { id: '4', name: 'Pasta Alfredo', price: 349, description: 'Creamy alfredo sauce with fettuccine', category: 'Pasta', rating: 4.6 },
  { id: '5', name: 'Caesar Salad', price: 199, description: 'Romaine, croutons, parmesan', category: 'Salads', rating: 4.2 },
];

export function RestaurantScreen({ theme, onNavigate }: ScreenProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(c => c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c);
      }
      return prev.filter(c => c.id !== itemId);
    });
  };

  const getItemQuantity = (itemId: string) => {
    return cart.find(c => c.id === itemId)?.quantity || 0;
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Image */}
      <div className="relative h-40 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
        <span className="text-6xl">🍕</span>
        
        <button
          onClick={() => onNavigate('home')}
          className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
        >
          <Heart 
            className="w-4 h-4" 
            style={{ 
              color: isFavorite ? '#ef4444' : '#6b7280',
              fill: isFavorite ? '#ef4444' : 'none'
            }}
          />
        </button>
      </div>

      {/* Restaurant Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">Pizza Palace</h1>
        <p className="text-xs text-gray-500">Italian • Pizza • Pasta</p>
        
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">4.5</span>
            <span className="text-xs text-gray-500">(200+)</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">25-35 min</span>
          </div>
          <span className="text-sm text-gray-500">₹₹</span>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Menu</h2>
          
          <div className="space-y-3">
            {menuItems.map(item => {
              const quantity = getItemQuantity(item.id);
              return (
                <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-2xl">
                      {item.category === 'Pizza' ? '🍕' : item.category === 'Pasta' ? '🍝' : item.category === 'Salads' ? '🥗' : '🥖'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-sm" style={{ color: theme.primary }}>
                        ₹{item.price}
                      </span>
                      
                      {quantity > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${theme.primary}20` }}
                          >
                            <Minus className="w-3 h-3" style={{ color: theme.primary }} />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: theme.primary }}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: theme.primary }}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cart Button */}
      {totalItems > 0 && (
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => onNavigate('cart')}
            className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-between px-4"
            style={{ backgroundColor: theme.primary }}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-3.5 h-3.5" />
              </div>
              <span>{totalItems} item{totalItems > 1 ? 's' : ''}</span>
            </div>
            <span className="font-bold">₹{totalPrice}</span>
          </button>
        </div>
      )}
    </div>
  );
}
