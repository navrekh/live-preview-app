import React from 'react';
import { ScreenProps } from '../../types';
import { 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  Heart, 
  Clock, 
  Settings, 
  HelpCircle, 
  LogOut,
  Bell,
  Gift
} from 'lucide-react';

const menuItems = [
  { id: 'orders', icon: Clock, label: 'My Orders', badge: '3' },
  { id: 'favorites', icon: Heart, label: 'Favorites' },
  { id: 'addresses', icon: MapPin, label: 'Addresses' },
  { id: 'payments', icon: CreditCard, label: 'Payment Methods' },
  { id: 'rewards', icon: Gift, label: 'Rewards', badge: 'NEW' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'help', icon: HelpCircle, label: 'Help & Support' },
];

export function ProfileScreen({ theme, onNavigate }: ScreenProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div 
        className="px-4 pt-4 pb-6"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        <h1 className="text-lg font-semibold text-white mb-4">Profile</h1>
        
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <div className="flex-1">
            <h2 className="text-white font-semibold">John Doe</h2>
            <p className="text-white/70 text-sm">john.doe@email.com</p>
            <p className="text-white/70 text-xs">+91 98765 43210</p>
          </div>
          <button className="px-3 py-1 bg-white/20 rounded-full text-white text-xs font-medium">
            Edit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-xl p-4 shadow-sm flex justify-around">
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: theme.primary }}>12</p>
            <p className="text-xs text-gray-500">Orders</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: theme.primary }}>₹240</p>
            <p className="text-xs text-gray-500">Saved</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: theme.primary }}>5</p>
            <p className="text-xs text-gray-500">Favorites</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <div className="bg-white rounded-xl divide-y">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                <span className="flex-1 text-sm font-medium text-gray-700">{item.label}</span>
                {item.badge && (
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: item.badge === 'NEW' ? '#10b981' : theme.primary }}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button 
          onClick={() => onNavigate('login')}
          className="w-full mt-4 bg-white rounded-xl px-4 py-3 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Logout</span>
        </button>

        {/* App Version */}
        <p className="text-center text-xs text-gray-400 mt-4">Version 1.0.0</p>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-around">
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'search', icon: '🔍', label: 'Search' },
          { id: 'cart', icon: '🛒', label: 'Cart' },
          { id: 'profile', icon: '👤', label: 'Profile', active: true },
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
