import { useState } from "react";
import { 
  ShoppingBag, 
  MessageSquare, 
  Calendar, 
  Utensils,
  Download,
  Sparkles,
  ChevronRight
} from "lucide-react";
import PhoneSimulator from "@/components/PhoneSimulator";
import ChatInput from "@/components/ChatInput";
import BuildProgress from "@/components/BuildProgress";
import PreviewScreen from "@/components/PreviewScreen";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type BuildStepStatus = "pending" | "active" | "completed";

interface BuildStep {
  id: string;
  label: string;
  status: BuildStepStatus;
}

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([
    { id: "analyze", label: "Analyzing prompt", status: "pending" },
    { id: "schema", label: "Generating app schema", status: "pending" },
    { id: "ui", label: "Creating UI components", status: "pending" },
    { id: "backend", label: "Setting up backend", status: "pending" },
    { id: "build", label: "Building APK/IPA", status: "pending" },
  ]);
  const [showPreview, setShowPreview] = useState(false);

  const handlePromptSubmit = async (message: string) => {
    setIsGenerating(true);
    setShowPreview(true);
    setBuildProgress(0);
    
    toast.info("Starting app generation...");

    const stepDurations = [2000, 3000, 4000, 3000, 3000];
    let currentProgress = 0;

    for (let i = 0; i < buildSteps.length; i++) {
      setBuildSteps((prev) =>
        prev.map((step, idx) => ({
          ...step,
          status: idx === i ? "active" : idx < i ? "completed" : "pending",
        }))
      );

      const progressIncrement = 100 / buildSteps.length;
      const stepDuration = stepDurations[i];
      const incrementPerTick = progressIncrement / (stepDuration / 100);

      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          currentProgress += incrementPerTick;
          if (currentProgress >= (i + 1) * progressIncrement) {
            clearInterval(interval);
            resolve();
          }
          setBuildProgress(Math.min(Math.round(currentProgress), 100));
        }, 100);
      });
    }

    setBuildSteps((prev) =>
      prev.map((step) => ({ ...step, status: "completed" as BuildStepStatus }))
    );
    setBuildProgress(100);
    setIsGenerating(false);
    
    toast.success("Your app is ready!");
  };

  const resetBuild = () => {
    setIsGenerating(false);
    setShowPreview(false);
    setBuildProgress(0);
    setBuildSteps((prev) =>
      prev.map((step) => ({ ...step, status: "pending" as BuildStepStatus }))
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">MobileDev</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={() => window.location.href = "/dashboard"}
            >
              Dashboard
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = "/signin"}
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                <span className="gradient-text">Build Mobile Apps</span>
                <br />
                <span className="text-foreground">with AI</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Describe your app idea and get a real APK or IPA in minutes. No coding required.
              </p>
            </div>

            {/* Build Progress */}
            {(isGenerating || showPreview) && (
              <div className="p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm animate-fade-in">
                <BuildProgress
                  steps={buildSteps}
                  progress={buildProgress}
                  estimatedTime={isGenerating ? "~2 minutes" : undefined}
                />

                {!isGenerating && buildProgress === 100 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="gradient" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download APK
                    </Button>
                    <Button variant="outline" onClick={resetBuild}>
                      New App
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Chat Input */}
            <ChatInput
              onSubmit={handlePromptSubmit}
              isLoading={isGenerating}
              placeholder="Describe your app... e.g., 'Build a salon booking app with payments'"
            />

            {/* Quick prompts */}
            {!isGenerating && !showPreview && (
              <div className="flex flex-wrap gap-2">
                {["Salon booking", "Food delivery", "Fitness tracker"].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handlePromptSubmit(prompt + " app")}
                    className="text-sm px-4 py-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Phone Preview */}
          <div className="hidden lg:flex justify-center">
            <PhoneSimulator
              isGenerating={isGenerating}
              content={
                <PreviewScreen template={showPreview ? "ecommerce" : "empty"} />
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
