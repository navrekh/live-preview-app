import { Check, Loader2, Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface BuildStep {
  id: string;
  label: string;
  status: "pending" | "active" | "completed";
}

interface BuildProgressProps {
  steps: BuildStep[];
  progress: number;
  estimatedTime?: string;
}

const BuildProgress = ({ steps, progress, estimatedTime }: BuildProgressProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  // Smooth progress animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const activeStep = steps.find(s => s.status === 'active');
  
  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* Header with sparkle */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <div className="absolute inset-0 animate-ping">
            <Sparkles className="w-5 h-5 text-primary/30" />
          </div>
        </div>
        <span className="font-semibold text-foreground">Building Your App</span>
      </div>

      {/* Progress bar with glow effect */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {activeStep?.label || 'Preparing...'}
          </span>
          <span className="font-medium text-primary tabular-nums">{Math.round(animatedProgress)}%</span>
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          {/* Animated background stripes */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="h-full w-[200%] animate-[slide_1s_linear_infinite]"
              style={{
                background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, hsl(var(--primary)) 10px, hsl(var(--primary)) 20px)',
              }}
            />
          </div>
          {/* Main progress bar */}
          <div
            className="h-full bg-gradient-to-r from-primary via-primary to-accent rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${animatedProgress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
            {/* Glow dot at the end */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full blur-sm animate-pulse" />
          </div>
        </div>
        {estimatedTime && (
          <p className="text-xs text-muted-foreground">
            Estimated time remaining: {estimatedTime}
          </p>
        )}
      </div>

      {/* Steps list with staggered animations */}
      <div className="space-y-1">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-500",
              step.status === "active" && "bg-primary/10 scale-[1.02]",
              step.status === "completed" && "opacity-70"
            )}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300",
                step.status === "completed" && "bg-primary text-primary-foreground scale-100",
                step.status === "active" && "bg-primary/20 text-primary ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
                step.status === "pending" && "bg-muted text-muted-foreground scale-95"
              )}
            >
              {step.status === "completed" ? (
                <Check className="w-4 h-4 animate-scale-in" />
              ) : step.status === "active" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
            </div>
            <span
              className={cn(
                "text-sm transition-all duration-300",
                step.status === "active" && "text-foreground font-semibold",
                step.status === "pending" && "text-muted-foreground",
                step.status === "completed" && "text-foreground line-through decoration-primary/50"
              )}
            >
              {step.label}
            </span>
            {step.status === "completed" && (
              <Check className="w-4 h-4 text-primary ml-auto animate-fade-in" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuildProgress;