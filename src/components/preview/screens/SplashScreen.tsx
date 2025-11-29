import React, { useEffect, useState } from 'react';
import { ScreenProps } from '../types';
import { Loader2 } from 'lucide-react';

export function SplashScreen({ theme, appName, onNavigate }: ScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onNavigate('login'), 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onNavigate]);

  return (
    <div 
      className="h-full flex flex-col items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
          <span className="text-3xl">🚀</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{appName}</h1>
        <p className="text-white/70 text-sm mb-8">Your favorite app</p>
        
        <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-white rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <Loader2 className="w-5 h-5 text-white/70 animate-spin mx-auto mt-4" />
      </div>
    </div>
  );
}
