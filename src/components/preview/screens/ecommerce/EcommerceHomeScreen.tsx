import React, { useState } from 'react';
import { ScreenProps, Product } from '../../types';
import { Search, Bell, Heart, ShoppingBag, Star, Filter } from 'lucide-react';

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'];

const products: Product[] = [
  { id: '1', name: 'Wireless Earbuds', price: 2999, originalPrice: 4999, rating: 4.5, category: 'Electronics' },
  { id: '2', name: 'Smart Watch', price: 5999, originalPrice: 8999, rating: 4.7, category: 'Electronics' },
  { id: '3', name: 'Running Shoes', price: 3499, originalPrice: 4999, rating: 4.3, category: 'Sports' },
  { id: '4', name: 'Backpack', price: 1499, originalPrice: 2499, rating: 4.4, category: 'Fashion' },
  { id: '5', name: 'Water Bottle', price: 599, originalPrice: 999, rating: 4.2, category: 'Sports' },
  { id: '6', name: 'Desk Lamp', price: 899, originalPrice: 1299, rating: 4.1, category: 'Home' },
];

export function EcommerceHomeScreen({ theme, onNavigate }: ScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => 
    selectedCategory === 'All' || p.category === selectedCategory
  );

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-2 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">Welcome back</p>
            <h1 className="text-lg font-bold text-gray-900">Discover Products</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 bg-gray-100 rounded-full">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button 
              onClick={() => onNavigate('cart')}
              className="relative p-2 bg-gray-100 rounded-full"
            >
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              <span 
                className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.primary }}
              >
                2
              </span>
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none"
            />
          </div>
          <button 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: theme.primary }}
          >
            <Filter className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white px-4 py-2 border-b">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat ? 'text-white' : 'bg-gray-100 text-gray-600'
              }`}
              style={selectedCategory === cat ? { backgroundColor: theme.primary } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 py-3">
        <div 
          className="p-4 rounded-xl text-white relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
        >
          <div className="max-w-[60%]">
            <p className="text-xs opacity-80">Flash Sale</p>
            <p className="text-xl font-bold mt-1">Up to 70% OFF</p>
            <p className="text-xs opacity-80 mt-1">On selected items</p>
            <button className="mt-3 px-4 py-1.5 bg-white text-xs font-semibold rounded-full" style={{ color: theme.primary }}>
              Shop Now
            </button>
          </div>
          <span className="absolute right-2 bottom-0 text-7xl opacity-30">🛍️</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Popular Products</h2>
          <button className="text-xs" style={{ color: theme.primary }}>See all</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => onNavigate('product')}
              className="bg-white rounded-xl p-3 text-left shadow-sm"
            >
              <div className="relative aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-3xl">
                  {product.category === 'Electronics' ? '🎧' : 
                   product.category === 'Sports' ? '👟' : 
                   product.category === 'Fashion' ? '🎒' : '💡'}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm"
                >
                  <Heart 
                    className="w-4 h-4" 
                    style={{ 
                      color: wishlist.includes(product.id) ? '#ef4444' : '#9ca3af',
                      fill: wishlist.includes(product.id) ? '#ef4444' : 'none'
                    }}
                  />
                </button>
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
              <h3 className="font-medium text-xs text-gray-900 line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-500">{product.rating}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-sm" style={{ color: theme.primary }}>₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-around">
        {[
          { id: 'home', icon: '🏠', label: 'Home', active: true },
          { id: 'search', icon: '🔍', label: 'Search' },
          { id: 'wishlist', icon: '❤️', label: 'Wishlist' },
          { id: 'cart', icon: '🛒', label: 'Cart' },
          { id: 'profile', icon: '👤', label: 'Profile' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center px-3 py-1 rounded-lg ${item.active ? 'bg-primary/10' : ''}`}
          >
            <span className="text-base">{item.icon}</span>
            <span 
              className="text-[9px] font-medium"
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
