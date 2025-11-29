import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  MessageSquare, 
  Calendar, 
  Utensils,
  Download,
  Zap,
  ArrowRight
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PhoneSimulator from "@/components/PhoneSimulator";
import ChatInput from "@/components/ChatInput";
import BuildProgress from "@/components/BuildProgress";
import TemplateCard from "@/components/TemplateCard";
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
  const [activeSection, setActiveSection] = useState("create");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
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

  const templates = [
    {
      id: "ecommerce",
      title: "E-Commerce",
      description: "Shopping app with cart & payments",
      icon: <ShoppingBag className="w-6 h-6 text-primary-foreground" />,
      gradient: "bg-gradient-to-br from-primary to-accent",
    },
    {
      id: "social",
      title: "Social Media",
      description: "Feed, profiles & messaging",
      icon: <MessageSquare className="w-6 h-6 text-primary-foreground" />,
      gradient: "bg-gradient-to-br from-accent to-primary",
    },
    {
      id: "booking",
      title: "Booking App",
      description: "Appointments & scheduling",
      icon: <Calendar className="w-6 h-6 text-primary-foreground" />,
      gradient: "bg-gradient-to-br from-primary/80 to-accent/80",
    },
    {
      id: "food",
      title: "Food Delivery",
      description: "Restaurant ordering system",
      icon: <Utensils className="w-6 h-6 text-primary-foreground" />,
      gradient: "bg-gradient-to-br from-accent/80 to-primary/80",
    },
  ];

  const handlePromptSubmit = async (message: string) => {
    setIsGenerating(true);
    setShowPreview(true);
    setBuildProgress(0);
    
    toast.info("Starting app generation...");

    // Simulate build process
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
    
    toast.success("Your app is ready! 🎉");
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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 flex overflow-hidden">
        {/* Left panel - Chat & Controls */}
        <div className="flex-1 flex flex-col p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <header className="mb-8 animate-slide-up">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              <span className="gradient-text">Build Mobile Apps</span>
              <br />
              <span className="text-foreground">with AI</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Describe your app idea and watch it come to life
            </p>
          </header>

          {/* Templates */}
          {!isGenerating && !showPreview && (
            <section className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Quick Start Templates
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    {...template}
                    isSelected={selectedTemplate === template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Build Progress */}
          {(isGenerating || showPreview) && (
            <section className="mb-8 animate-fade-in">
              <div className="p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
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
                    <Button variant="glass" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download IPA
                    </Button>
                    <Button variant="outline" onClick={resetBuild}>
                      Create New App
                    </Button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Chat Input */}
          <div className="mt-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <ChatInput
              onSubmit={handlePromptSubmit}
              isLoading={isGenerating}
              placeholder={
                selectedTemplate
                  ? `Describe your ${templates.find((t) => t.id === selectedTemplate)?.title} app...`
                  : "Describe your app idea... e.g., 'Build a salon booking app with appointment scheduling and online payments'"
              }
            />

            {/* Quick prompts */}
            {!isGenerating && !showPreview && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground mr-2">Try:</span>
                {[
                  "Salon booking app",
                  "Food delivery app",
                  "Fitness tracker",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handlePromptSubmit(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right panel - Phone Preview */}
        <div className="hidden lg:flex flex-col items-center justify-center w-[420px] border-l border-border bg-gradient-subtle p-8">
          <PhoneSimulator
            isGenerating={isGenerating}
            content={
              <PreviewScreen
                template={showPreview || selectedTemplate ? "ecommerce" : "empty"}
              />
            }
          />

          {/* Stats */}
          <div className="mt-8 flex items-center gap-6 text-center">
            <div>
              <p className="text-2xl font-bold gradient-text">50K+</p>
              <p className="text-xs text-muted-foreground">Apps Built</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="text-2xl font-bold gradient-text">2min</p>
              <p className="text-xs text-muted-foreground">Avg Build</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="text-2xl font-bold gradient-text">100%</p>
              <p className="text-xs text-muted-foreground">No-Code</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
