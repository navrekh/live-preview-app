import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Download,
  Send,
  Paperclip,
  Apple,
  Play,
  FileUp,
  Rocket,
  Loader2,
  Sparkles,
  Code
} from "lucide-react";
import PhoneSimulator from "@/components/PhoneSimulator";
import BuildProgress from "@/components/BuildProgress";
import PreviewScreen from "@/components/PreviewScreen";
import Logo from "@/components/Logo";
import FrameworkSelectModal from "@/components/FrameworkSelectModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendChatMessage, ChatMessage, ChatResponse } from "@/services/chat";
import { useCredits } from "@/hooks/useCredits";
import { 
  generateApp, 
  parseConversationToRequirements,
  GeneratedApp,
  GenerationProgress 
} from "@/services/generator";

type BuildStepStatus = "pending" | "active" | "completed";

interface BuildStep {
  id: string;
  label: string;
  status: BuildStepStatus;
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestedFeatures?: string[];
  readyToBuild?: boolean;
}

const Builder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialPrompt = location.state?.prompt || "";
  
  const { balance, refetch: refetchCredits } = useCredits();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([
    { id: "analyze", label: "Analyzing requirements", status: "pending" },
    { id: "structure", label: "Creating project structure", status: "pending" },
    { id: "frontend", label: "Generating React Native code", status: "pending" },
    { id: "backend", label: "Setting up Node.js backend", status: "pending" },
    { id: "preview", label: "Preparing live preview", status: "pending" },
  ]);
  const [buildComplete, setBuildComplete] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [readyToBuild, setReadyToBuild] = useState(false);
  const [showFrameworkModal, setShowFrameworkModal] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<"react-native" | "flutter" | null>(null);
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isSending || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    try {
      // Convert messages to chat format
      const chatHistory: ChatMessage[] = messages.map((m) => ({
        id: m.id,
        role: m.type === "user" ? "user" : "assistant",
        content: m.content,
        timestamp: m.timestamp,
      }));

      const response = await sendChatMessage(content, chatHistory);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: response.message,
        timestamp: new Date(),
        suggestedFeatures: response.suggestedFeatures,
        readyToBuild: response.readyToBuild,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      if (response.readyToBuild) {
        setReadyToBuild(true);
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleStartBuild = async (framework: "react-native" | "flutter") => {
    if (balance < 20) {
      toast.error("Not enough credits! You need 20 credits to build an app.");
      navigate("/pricing");
      return;
    }

    setSelectedFramework(framework);
    setIsGenerating(true);
    setBuildProgress(0);
    setBuildComplete(false);
    setReadyToBuild(false);
    setGeneratedApp(null);
    
    const frameworkName = framework === "react-native" ? "React Native" : "Flutter";
    toast.info(`Starting ${frameworkName} app generation with Node.js backend... This will use 20 credits.`);

    // Gather conversation for requirements parsing
    const conversationText = messages
      .filter(m => m.type === "user")
      .map(m => m.content)
      .join(" ");

    // Parse requirements from conversation
    const appName = extractAppName(conversationText) || "MyApp";
    const requirements = parseConversationToRequirements(conversationText, appName, framework);

    const stepMapping: Record<string, number> = {
      structure: 0,
      frontend: 2,
      backend: 3,
      database: 3,
      preview: 4,
      complete: 4,
    };

    try {
      // Generate the app with progress updates
      const result = await generateApp(requirements, (progress: GenerationProgress) => {
        setBuildProgress(progress.progress);
        
        // Update build steps based on current step
        const stepIndex = stepMapping[progress.step] ?? 0;
        setBuildSteps((prev) =>
          prev.map((step, idx) => ({
            ...step,
            status: idx < stepIndex ? "completed" : idx === stepIndex ? "active" : "pending",
          }))
        );

        // Add progress message
        if (progress.step !== 'complete') {
          const systemMessage: Message = {
            id: `step-${progress.step}-${Date.now()}`,
            type: "assistant",
            content: `⚙️ ${progress.message}`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, systemMessage]);
        }
      });

      setGeneratedApp(result);

      setBuildSteps((prev) =>
        prev.map((step) => ({ ...step, status: "completed" as BuildStepStatus }))
      );
      setBuildProgress(100);
      setIsGenerating(false);
      setBuildComplete(true);
      
      const completeMessage: Message = {
        id: `complete-${Date.now()}`,
        type: "assistant",
        content: `🎉 **Your ${appName} app is ready!**\n\n**Generated:**\n- ${result.files.filter(f => f.type !== 'backend').length} React Native files\n- ${result.files.filter(f => f.type === 'backend').length} Node.js backend files\n- Database schema\n\nYou can now download the code or publish to app stores. Use the buttons in the header to proceed.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completeMessage]);
      
      // Deduct credits
      refetchCredits();
      toast.success("Your app is ready! 20 credits deducted.");
    } catch (error) {
      console.error("App generation error:", error);
      setIsGenerating(false);
      setBuildSteps((prev) =>
        prev.map((step) => ({ ...step, status: "pending" as BuildStepStatus }))
      );
      toast.error("Failed to generate app. Please try again.");
    }
  };

  // Helper to extract app name from conversation
  const extractAppName = (text: string): string | null => {
    const patterns = [
      /(?:called|named|name it|app name[:\s]+)["']?([A-Za-z][A-Za-z0-9\s]{1,30})["']?/i,
      /(?:build|create|make)\s+(?:a|an)?\s*["']?([A-Za-z][A-Za-z0-9\s]{1,30})["']?\s+app/i,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  };

  const handleDownloadCode = (type: 'frontend' | 'backend' | 'all') => {
    if (!generatedApp) return;
    
    let content = '';
    let filename = '';
    
    if (type === 'frontend') {
      content = generatedApp.reactNativeCode;
      filename = 'react-native-app.txt';
    } else if (type === 'backend') {
      content = generatedApp.backendCode;
      filename = 'nodejs-backend.txt';
    } else {
      content = `${generatedApp.reactNativeCode}\n\n${generatedApp.backendCode}\n\n-- DATABASE SCHEMA --\n${generatedApp.databaseSchema}`;
      filename = 'full-app-code.txt';
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`${type === 'all' ? 'Full code' : type === 'frontend' ? 'React Native code' : 'Backend code'} downloaded!`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleFeatureClick = (feature: string) => {
    setInputValue((prev) => prev ? `${prev}, ${feature}` : `I need ${feature}`);
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
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Logo size="sm" />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              <Sparkles className="w-4 h-4" />
              <span>{balance} credits</span>
            </div>
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
              onClick={() => handleDownloadCode('frontend')}
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">RN Code</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              disabled={!buildComplete}
              onClick={() => handleDownloadCode('backend')}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Backend</span>
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
                <div className="text-center space-y-4 max-w-md">
                  <Logo size="xl" showText={false} className="justify-center" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Let's Build Your App</h2>
                    <p className="text-muted-foreground mt-2">
                      Tell me about your app idea. I'll ask questions to understand your needs and help you create the perfect app.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {["E-commerce app", "Social media app", "Fitness tracker", "Food delivery"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInputValue(`I want to build a ${suggestion.toLowerCase()}`)}
                        className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Suggested Features */}
                      {message.suggestedFeatures && message.suggestedFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/30">
                          {message.suggestedFeatures.map((feature) => (
                            <button
                              key={feature}
                              onClick={() => handleFeatureClick(feature)}
                              className="px-2 py-1 rounded-full bg-background/50 text-xs hover:bg-background transition-colors"
                            >
                              + {feature}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
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

                {/* Ready to Build Button */}
                {readyToBuild && !isGenerating && !buildComplete && (
                  <div className="flex justify-center py-4">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="gap-2"
                      onClick={() => setShowFrameworkModal(true)}
                    >
                      <Rocket className="w-5 h-5" />
                      Start Building (20 credits)
                    </Button>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-border/50">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-end gap-2 p-3 rounded-2xl border border-border bg-card/50 focus-within:border-primary/50 transition-colors">
                <button
                  type="button"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => toast.info("File upload coming soon!")}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={messages.length === 0 ? "Describe your app idea..." : "Continue the conversation..."}
                  className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground min-h-[24px] max-h-[120px]"
                  rows={1}
                  disabled={isSending || isGenerating}
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
                  disabled={!inputValue.trim() || isSending || isGenerating}
                  className="shrink-0"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
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
              <PreviewScreen template={buildComplete ? "ecommerce" : messages.length > 0 ? "loading" : "empty"} />
            }
          />
        </div>
      </main>

      {/* Framework Selection Modal */}
      <FrameworkSelectModal
        open={showFrameworkModal}
        onOpenChange={setShowFrameworkModal}
        onConfirm={handleStartBuild}
        creditsRequired={20}
      />
    </div>
  );
};

export default Builder;
