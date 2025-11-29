import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Download,
  Send,
  Paperclip,
  Apple,
  Play,
  FileUp,
  Rocket
} from "lucide-react";
import PhoneSimulator from "@/components/PhoneSimulator";
import BuildProgress from "@/components/BuildProgress";
import PreviewScreen from "@/components/PreviewScreen";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type BuildStepStatus = "pending" | "active" | "completed";

interface BuildStep {
  id: string;
  label: string;
  status: BuildStepStatus;
}

interface Message {
  id: string;
  type: "user" | "system";
  content: string;
  timestamp: Date;
}

const Builder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialPrompt = location.state?.prompt || "";
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([
    { id: "analyze", label: "Analyzing prompt", status: "pending" },
    { id: "schema", label: "Generating app schema", status: "pending" },
    { id: "ui", label: "Creating UI components", status: "pending" },
    { id: "backend", label: "Setting up backend", status: "pending" },
    { id: "build", label: "Building APK/IPA", status: "pending" },
  ]);
  const [buildComplete, setBuildComplete] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (initialPrompt) {
      handleGenerate(initialPrompt);
    }
  }, []);

  const handleGenerate = async (prompt: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: prompt,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    setIsGenerating(true);
    setBuildProgress(0);
    setBuildComplete(false);
    
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

      // Add system message for current step
      const systemMessage: Message = {
        id: `step-${i}-${Date.now()}`,
        type: "system",
        content: `${buildSteps[i].label}...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);

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
    setBuildComplete(true);
    
    const completeMessage: Message = {
      id: `complete-${Date.now()}`,
      type: "system",
      content: "Your app is ready! You can download the APK or continue customizing.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, completeMessage]);
    
    toast.success("Your app is ready!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    
    handleGenerate(inputValue);
    setInputValue("");
  };

  const resetBuild = () => {
    setIsGenerating(false);
    setBuildProgress(0);
    setBuildComplete(false);
    setBuildSteps((prev) =>
      prev.map((step) => ({ ...step, status: "pending" as BuildStepStatus }))
    );
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Logo size="sm" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              onClick={() => toast.info("Import from Figma coming soon!")}
            >
              <FileUp className="w-4 h-4" />
              <span className="hidden sm:inline">Import Figma</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              disabled={!buildComplete}
              onClick={() => toast.success("APK download started!")}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">APK</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              disabled={!buildComplete}
              onClick={() => toast.success("IPA download started!")}
            >
              <Apple className="w-4 h-4" />
              <span className="hidden sm:inline">IPA</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              disabled={!buildComplete}
              onClick={() => toast.info("Publishing to Play Store...")}
            >
              <Play className="w-4 h-4" />
              <span className="hidden md:inline">Play Store</span>
            </Button>
            <Button 
              variant="gradient" 
              size="sm"
              className="gap-2"
              disabled={!buildComplete}
              onClick={() => toast.info("Publishing to App Store...")}
            >
              <Rocket className="w-4 h-4" />
              <span className="hidden md:inline">App Store</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left - Chat Panel */}
        <div className="flex-1 flex flex-col border-r border-border/50">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Logo size="xl" showText={false} className="justify-center" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Start Building</h2>
                    <p className="text-muted-foreground mt-1">Describe your app idea to get started</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            
            {/* Build Progress */}
            {isGenerating && (
              <div className="p-4 rounded-2xl border border-border bg-card/50">
                <BuildProgress
                  steps={buildSteps}
                  progress={buildProgress}
                  estimatedTime="~2 minutes"
                />
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-border/50">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-end gap-2 p-3 rounded-2xl border border-border bg-card/50 focus-within:border-primary/50 transition-colors">
                <button
                  type="button"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe changes or new features..."
                  className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground min-h-[24px] max-h-[120px]"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="gradient"
                  disabled={!inputValue.trim() || isGenerating}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right - Phone Preview */}
        <div className="w-[400px] flex items-center justify-center p-8 bg-muted/20">
          <PhoneSimulator
            isGenerating={isGenerating}
            content={
              <PreviewScreen template={messages.length > 0 ? "ecommerce" : "empty"} />
            }
          />
        </div>
      </main>
    </div>
  );
};

export default Builder;
