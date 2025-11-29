import React, { useState } from 'react';
import { ScreenProps, Restaurant } from '../../types';
import { Search, Bell, MapPin, ChevronDown, Star, Clock, Heart } from 'lucide-react';

const categories = [
  { id: '1', name: 'Pizza', emoji: '🍕' },
  { id: '2', name: 'Burger', emoji: '🍔' },
  { id: '3', name: 'Sushi', emoji: '🍣' },
  { id: '4', name: 'Indian', emoji: '🍛' },
  { id: '5', name: 'Chinese', emoji: '🥡' },
  { id: '6', name: 'Dessert', emoji: '🍰' },
];

const restaurants: Restaurant[] = [
  { id: '1', name: 'Pizza Palace', cuisine: 'Italian', rating: 4.5, time: '25-35', priceRange: '₹₹' },
  { id: '2', name: 'Burger Barn', cuisine: 'American', rating: 4.3, time: '20-30', priceRange: '₹' },
  { id: '3', name: 'Spice Garden', cuisine: 'Indian', rating: 4.7, time: '30-40', priceRange: '₹₹₹' },
  { id: '4', name: 'Dragon Wok', cuisine: 'Chinese', rating: 4.2, time: '25-35', priceRange: '₹₹' },
];

export function FoodHomeScreen({ theme, appName, onNavigate }: ScreenProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div 
        className="px-4 pt-2 pb-4"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white/80" />
            <div>
              <p className="text-xs text-white/70">Deliver to</p>
              <button className="text-white text-sm font-medium flex items-center gap-1">
                Home <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
          <button 
            className="relative p-2 bg-white/20 rounded-full"
            onClick={() => onNavigate('notifications')}
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants, dishes..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-sm outline-none"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Categories */}
        <div className="px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Categories</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex flex-col items-center px-3 py-2 rounded-xl min-w-[60px] transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-opacity-100 text-white' 
                    : 'bg-white text-gray-700'
                }`}
                style={selectedCategory === cat.id ? { backgroundColor: theme.primary } : {}}
              >
                <span className="text-xl mb-1">{cat.emoji}</span>
                <span className="text-[10px] font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Banner */}
        <div className="px-4 mb-3">
          <div 
            className="p-4 rounded-xl text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${theme.primary}dd, ${theme.secondary}dd)` }}
          >
            <div className="relative z-10">
              <p className="text-xs opacity-80">Limited time</p>
              <p className="text-lg font-bold">50% OFF</p>
              <p className="text-xs opacity-80">On your first order</p>
              <button className="mt-2 px-3 py-1 bg-white text-xs font-medium rounded-full" style={{ color: theme.primary }}>
                Order Now
              </button>
            </div>
            <span className="absolute right-2 bottom-0 text-6xl opacity-30">🍔</span>
          </div>
        </div>

        {/* Restaurants */}
        <div className="px-4 pb-20">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-900">Popular Near You</h2>
            <button className="text-xs" style={{ color: theme.primary }}>See all</button>
          </div>

          <div className="space-y-3">
            {restaurants.map(restaurant => (
              <button
                key={restaurant.id}
                onClick={() => onNavigate('restaurant')}
                className="w-full bg-white rounded-xl p-3 flex gap-3 text-left shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-3xl">🍽️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{restaurant.name}</h3>
                      <p className="text-xs text-gray-500">{restaurant.cuisine} • {restaurant.priceRange}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(restaurant.id); }}
                      className="p-1"
                    >
                      <Heart 
                        className="w-4 h-4" 
                        style={{ 
                          color: favorites.includes(restaurant.id) ? '#ef4444' : '#9ca3af',
                          fill: favorites.includes(restaurant.id) ? '#ef4444' : 'none'
                        }}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{restaurant.time} min</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-around">
        {[
          { id: 'home', icon: '🏠', label: 'Home', active: true },
          { id: 'search', icon: '🔍', label: 'Search' },
          { id: 'cart', icon: '🛒', label: 'Cart' },
          { id: 'profile', icon: '👤', label: 'Profile' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center px-4 py-1 rounded-lg transition-colors ${
              item.active ? 'bg-primary/10' : ''
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span 
              className="text-[10px] font-medium"
              style={{ color: item.active ? theme.primary : '#6b7280' }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
