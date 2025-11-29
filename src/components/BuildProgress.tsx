import { Check, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className="w-full space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Building your app</span>
          <span className="font-medium text-primary">{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {estimatedTime && (
          <p className="text-xs text-muted-foreground">
            Estimated time remaining: {estimatedTime}
          </p>
        )}
      </div>

      {/* Steps list */}
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
              step.status === "active" && "bg-primary/10",
              step.status === "completed" && "opacity-60"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                step.status === "completed" && "bg-primary text-primary-foreground",
                step.status === "active" && "bg-primary/20 text-primary",
                step.status === "pending" && "bg-muted text-muted-foreground"
              )}
            >
              {step.status === "completed" ? (
                <Check className="w-3.5 h-3.5" />
              ) : step.status === "active" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
            </div>
            <span
              className={cn(
                "text-sm",
                step.status === "active" && "text-foreground font-medium",
                step.status === "pending" && "text-muted-foreground",
                step.status === "completed" && "text-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuildProgress;
