import { useState, useEffect } from "react";
import { Wifi, Battery, Signal } from "lucide-react";

interface PhoneSimulatorProps {
  content: React.ReactNode;
  isGenerating?: boolean;
}

const PhoneSimulator = ({ content, isGenerating = false }: PhoneSimulatorProps) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative animate-float">
      {/* Phone frame */}
      <div className="relative w-[320px] h-[660px] bg-phone-frame rounded-[3rem] p-3 shadow-phone">
        {/* Inner bezel */}
        <div className="relative w-full h-full bg-phone-screen rounded-[2.5rem] overflow-hidden">
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 pt-3 pb-2">
            <span className="text-xs font-medium text-foreground/80">{time}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-foreground/80" />
              <Wifi className="w-3.5 h-3.5 text-foreground/80" />
              <Battery className="w-4 h-4 text-foreground/80" />
            </div>
          </div>

          {/* Dynamic Island / Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
            <div className="w-28 h-7 bg-phone-notch rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-background/30" />
            </div>
          </div>

          {/* Screen content */}
          <div className="relative w-full h-full pt-12 pb-8 overflow-hidden">
            {isGenerating && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-phone-screen/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">Generating...</span>
                </div>
              </div>
            )}
            {content}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <div className="w-32 h-1 bg-foreground/30 rounded-full" />
          </div>
        </div>

        {/* Side buttons */}
        <div className="absolute left-0 top-32 w-1 h-8 bg-phone-frame rounded-l-sm" />
        <div className="absolute left-0 top-44 w-1 h-12 bg-phone-frame rounded-l-sm" />
        <div className="absolute left-0 top-60 w-1 h-12 bg-phone-frame rounded-l-sm" />
        <div className="absolute right-0 top-40 w-1 h-16 bg-phone-frame rounded-r-sm" />
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
        <div className="w-full h-full bg-gradient-primary rounded-full" />
      </div>
    </div>
  );
};

export default PhoneSimulator;
