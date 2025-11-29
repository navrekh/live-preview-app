import React, { useState } from 'react';
import { ScreenProps } from '../types';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

export function LoginScreen({ theme, appName, onNavigate }: ScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('home');
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div 
        className="pt-12 pb-8 px-6 rounded-b-[32px]"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
          <span className="text-2xl">👋</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="text-white/70 text-sm mt-1">Sign in to {appName}</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-8">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button className="text-xs ml-auto block" style={{ color: theme.primary }}>
            Forgot Password?
          </button>

          <button
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: theme.primary }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button className="flex-1 py-2.5 border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-gray-50 transition-colors">
              <span>🍎</span> Apple
            </button>
            <button className="flex-1 py-2.5 border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-gray-50 transition-colors">
              <span>🔵</span> Google
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button 
            onClick={() => onNavigate('signup')}
            className="font-medium"
            style={{ color: theme.primary }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
