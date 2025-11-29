import React from 'react';
import { Signal, Wifi, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isGenerating?: boolean;
}

export function PhoneFrame({ children, isGenerating }: PhoneFrameProps) {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="relative">
      {/* Phone outer frame */}
      <div className="relative w-[320px] h-[660px] bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[45px] p-[10px] shadow-2xl">
        {/* Side buttons */}
        <div className="absolute -left-[3px] top-[100px] w-[3px] h-[30px] bg-zinc-700 rounded-l-sm" />
        <div className="absolute -left-[3px] top-[150px] w-[3px] h-[55px] bg-zinc-700 rounded-l-sm" />
        <div className="absolute -left-[3px] top-[215px] w-[3px] h-[55px] bg-zinc-700 rounded-l-sm" />
        <div className="absolute -right-[3px] top-[150px] w-[3px] h-[80px] bg-zinc-700 rounded-r-sm" />

        {/* Inner frame */}
        <div className="relative w-full h-full bg-black rounded-[38px] overflow-hidden">
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 h-11 px-6 flex items-center justify-between bg-transparent">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-[18px] flex items-center justify-center">
              <div className="w-[60px] h-[6px] bg-zinc-800 rounded-full mt-1" />
            </div>
            
            {/* Time */}
            <span className="text-white text-sm font-semibold">{currentTime}</span>
            
            {/* Status icons */}
            <div className="flex items-center gap-1">
              <Signal className="w-4 h-4 text-white" />
              <Wifi className="w-4 h-4 text-white" />
              <Battery className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Screen content */}
          <div className="h-full pt-11 pb-1 overflow-hidden bg-white">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/30 rounded-full animate-spin border-t-primary" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground animate-pulse">Generating preview...</p>
              </div>
            ) : (
              children
            )}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-zinc-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}
