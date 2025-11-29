import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Check } from "lucide-react";

interface FrameworkSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (framework: "react-native" | "flutter") => void;
  creditsRequired: number;
}

const frameworks = [
  {
    id: "react-native" as const,
    name: "React Native",
    description: "JavaScript-based framework by Meta. Great for web developers.",
    icon: "⚛️",
    features: ["JavaScript/TypeScript", "Hot Reload", "Large ecosystem", "Native performance"],
  },
  {
    id: "flutter" as const,
    name: "Flutter",
    description: "Dart-based framework by Google. Beautiful native apps.",
    icon: "🐦",
    features: ["Dart language", "Hot Reload", "Material & Cupertino", "High performance"],
  },
];

const FrameworkSelectModal = ({
  open,
  onOpenChange,
  onConfirm,
  creditsRequired,
}: FrameworkSelectModalProps) => {
  const [selectedFramework, setSelectedFramework] = useState<"react-native" | "flutter">("react-native");

  const handleConfirm = () => {
    onConfirm(selectedFramework);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Select Framework</DialogTitle>
          <DialogDescription>
            Choose the mobile framework for your app. Backend will use Node.js.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {frameworks.map((framework) => (
            <button
              key={framework.id}
              onClick={() => setSelectedFramework(framework.id)}
              className={`relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                selectedFramework === framework.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-card"
              }`}
            >
              {/* Selection indicator */}
              {selectedFramework === framework.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}

              {/* Icon */}
              <div className="text-3xl">{framework.icon}</div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{framework.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {framework.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {framework.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Backend info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
          <div className="text-2xl">🟢</div>
          <div>
            <p className="text-sm font-medium text-foreground">Backend: Node.js</p>
            <p className="text-xs text-muted-foreground">
              Powered by Express.js with REST API
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleConfirm} className="gap-2">
            <Rocket className="w-4 h-4" />
            Build with {selectedFramework === "react-native" ? "React Native" : "Flutter"} ({creditsRequired} credits)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FrameworkSelectModal;
