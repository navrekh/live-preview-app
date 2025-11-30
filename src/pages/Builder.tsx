import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Download,
  Send,
  Paperclip,
  FileUp,
  Loader2,
  Sparkles,
  PanelRightClose,
  PanelRightOpen,
  ExternalLink,
  PartyPopper,
  Smartphone
} from "lucide-react";
import { GooglePlayIcon, AppStoreIcon } from "@/components/StoreIcons";
import BuildProgress from "@/components/BuildProgress";
import { AppPreview } from "@/components/preview";
import { CodeTabs, CustomizationPanel, DownloadModal } from "@/components/builder";
import ExpoPreview from "@/components/builder/ExpoPreview";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCredits } from "@/hooks/useCredits";
import { useConfetti } from "@/hooks/useConfetti";
import { AppType, FeatureType, ColorTheme } from "@/services/generator/types";
import api from "@/services/api";

interface GeneratedApp {
  reactNativeCode: string;
  backendCode: string;
  databaseSchema: string;
  previewUrl: string;
  files: any[];
}

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
  const { fireConfetti, fireStars } = useConfetti();
  const [isGenerating, setIsGenerating] = useState(false);
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
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null);
  const [previewScreen, setPreviewScreen] = useState("splash");
  const [activeTab, setActiveTab] = useState<"preview" | "react-native" | "backend" | "database">("preview");
  const [snackUrl, setSnackUrl] = useState<string | null>(null);
  const [showExpoPreview, setShowExpoPreview] = useState(false);
  
  // Customization state
  const [appName, setAppName] = useState("MyApp");
  const [detectedAppType, setDetectedAppType] = useState<AppType>("ecommerce");
  const [previewTheme, setPreviewTheme] = useState<ColorTheme>({
    primary: '#3F51B5',
    secondary: '#FF4081',
    accent: '#00BCD4',
  });
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureType[]>(['login', 'payment', 'search', 'favorites']);
  const [selectedScreens, setSelectedScreens] = useState<string[]>(['Splash', 'Login', 'Home', 'Cart', 'Profile']);

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
    if (!content.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    // Extract app name from message
    const extractedName = extractAppName(content) || appName;
    setAppName(extractedName);

    // Immediately start generation
    setIsGenerating(true);
    setBuildProgress(0);
    setBuildComplete(false);
    setGeneratedApp(null);
    setSnackUrl(null);
    setShowExpoPreview(false);
    setActiveTab("preview");
    setPreviewScreen("splash");

    toast.info("Generating your app...");

    // Progress simulation
    const progressSteps = [
      { step: 'analyze', progress: 20, message: 'Analyzing requirements...', idx: 0 },
      { step: 'template', progress: 40, message: 'Selecting best template...', idx: 1 },
      { step: 'frontend', progress: 60, message: 'Generating React Native code...', idx: 2 },
      { step: 'backend', progress: 80, message: 'Creating backend APIs...', idx: 3 },
      { step: 'preview', progress: 95, message: 'Building preview...', idx: 4 },
    ];

    let progressIdx = 0;
    const progressInterval = setInterval(() => {
      if (progressIdx < progressSteps.length) {
        const step = progressSteps[progressIdx];
        setBuildProgress(step.progress);
        setBuildSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx < step.idx ? "completed" : idx === step.idx ? "active" : "pending",
          }))
        );
        progressIdx++;
      }
    }, 800);

    try {
      // Call API with simple format
      const apiResponse = await api.post<{
        success?: boolean;
        files?: any[];
        reactNativeCode?: string;
        backendCode?: string;
        databaseSchema?: string;
        previewUrl?: string;
        snackUrl?: string;
        message?: string;
      }>("/api/generate", {
        appName: extractedName,
        messages: [
          { role: "user", content: content.trim() }
        ]
      });

      clearInterval(progressInterval);

      if (apiResponse.error || !apiResponse.data) {
        throw new Error(apiResponse.error || 'Failed to generate app');
      }

      const data = apiResponse.data;

      // Process response
      const result = {
        reactNativeCode: data.reactNativeCode || '',
        backendCode: data.backendCode || '',
        databaseSchema: data.databaseSchema || '',
        previewUrl: data.previewUrl || '',
        files: data.files || [],
      };

      setGeneratedApp(result);
      
      if (data.snackUrl) {
        setSnackUrl(data.snackUrl);
      }

      setBuildSteps((prev) =>
        prev.map((step) => ({ ...step, status: "completed" as BuildStepStatus }))
      );
      setBuildProgress(100);
      setIsGenerating(false);
      setBuildComplete(true);
      setShowCustomization(true);
      
      // Fire confetti
      setTimeout(() => {
        fireConfetti();
        fireStars();
      }, 300);

      const completeMessage: Message = {
        id: `complete-${Date.now()}`,
        type: "assistant",
        content: `🎉 **Your ${extractedName} app is ready!**\n\nYou can now customize, download, or publish your app.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completeMessage]);
      
      refetchCredits();
      toast.success("🎉 Your app is ready!");

    } catch (error) {
      console.error("App generation error:", error);
      clearInterval(progressInterval);
      setIsGenerating(false);
      setBuildSteps((prev) =>
        prev.map((step) => ({ ...step, status: "pending" as BuildStepStatus }))
      );
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: "assistant",
        content: "Failed to generate app. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to generate app. Please try again.");
    }
  };

  const handleRegenerate = async () => {
    if (balance < 20) {
      toast.error("Not enough credits! You need 20 credits to regenerate.");
      navigate("/pricing");
      return;
    }
    
    setIsGenerating(true);
    setBuildProgress(0);
    setBuildComplete(false);
    setGeneratedApp(null);
    setSnackUrl(null);
    
    toast.info("Regenerating app with your customizations...");

    try {
      const userMessages = messages
        .filter(m => m.type === "user")
        .map(m => ({
          role: "user" as const,
          content: m.content
        }));

      const apiResponse = await api.post<{
        success?: boolean;
        files?: any[];
        reactNativeCode?: string;
        backendCode?: string;
        databaseSchema?: string;
        previewUrl?: string;
        snackUrl?: string;
        message?: string;
      }>("/api/generate", {
        appName,
        messages: userMessages
      });

      if (apiResponse.error || !apiResponse.data) {
        throw new Error(apiResponse.error || 'Regeneration failed');
      }

      const data = apiResponse.data;
      const result: GeneratedApp = {
        reactNativeCode: data.reactNativeCode || '',
        backendCode: data.backendCode || '',
        databaseSchema: data.databaseSchema || '',
        previewUrl: data.previewUrl || '',
        files: data.files || [],
      };

      setGeneratedApp(result);
      if (data.snackUrl) setSnackUrl(data.snackUrl);

      setBuildSteps((prev) =>
        prev.map((step) => ({ ...step, status: "completed" as BuildStepStatus }))
      );
      setBuildProgress(100);
      setIsGenerating(false);
      setBuildComplete(true);
      
      refetchCredits();
      toast.success("App regenerated successfully!");
    } catch (error) {
      console.error("Regeneration error:", error);
      setIsGenerating(false);
      toast.error("Failed to regenerate. Please try again.");
    }
  };

  const handleOpenExpoSnack = () => {
    if (snackUrl) {
      window.open(snackUrl, '_blank');
    } else {
      const encodedName = encodeURIComponent(appName || 'MyApp');
      window.open(`https://snack.expo.dev/?name=${encodedName}&platform=ios`, '_blank');
      toast.info('Opening Expo Snack - paste the generated code to preview');
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

  const handleDownloadCode = (type: 'frontend' | 'backend' | 'database' | 'all') => {
    if (!generatedApp) return;
    
    let content = '';
    let filename = '';
    
    if (type === 'frontend') {
      content = generatedApp.reactNativeCode;
      filename = `${appName}-react-native.txt`;
    } else if (type === 'backend') {
      content = generatedApp.backendCode;
      filename = `${appName}-backend.txt`;
    } else if (type === 'database') {
      content = generatedApp.databaseSchema;
      filename = `${appName}-database.sql`;
    } else {
      content = `${generatedApp.reactNativeCode}\n\n${generatedApp.backendCode}\n\n-- DATABASE SCHEMA --\n${generatedApp.databaseSchema}`;
      filename = `${appName}-complete.txt`;
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
    
    toast.success(`${type === 'all' ? 'Complete package' : type} downloaded!`);
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
              onClick={() => setShowDownloadModal(true)}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              disabled={!buildComplete}
              onClick={() => setShowCustomization(!showCustomization)}
            >
              {showCustomization ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
              <span className="hidden sm:inline">Customize</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              disabled={!buildComplete}
              onClick={handleOpenExpoSnack}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Expo Snack</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              disabled={!buildComplete}
              onClick={() => toast.info("Publishing to Play Store...")}
            >
              <GooglePlayIcon className="w-4 h-4" />
              <span className="hidden md:inline">Play Store</span>
            </Button>
            <Button 
              variant="gradient" 
              size="sm"
              className="gap-2"
              disabled={!buildComplete}
              onClick={() => toast.info("Publishing to App Store...")}
            >
              <AppStoreIcon className="w-4 h-4" />
              <span className="hidden md:inline">App Store</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left - Chat Panel */}
        <div className="flex-1 flex flex-col border-r border-border/50 min-w-0">
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
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Code Tabs (shown after build) */}
          {buildComplete && (
            <CodeTabs
              generatedApp={generatedApp}
              appName={appName}
              isGenerating={isGenerating}
              onDownload={handleDownloadCode}
            />
          )}

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
                  disabled={isGenerating}
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
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Center - Phone Preview */}
        <div className="w-auto flex flex-col items-center justify-start p-6 bg-muted/20 overflow-y-auto">
          {/* Preview Toggle */}
          {buildComplete && snackUrl && (
            <div className="flex items-center gap-2 mb-4 p-1 bg-muted rounded-lg animate-fade-in">
              <Button
                variant={!showExpoPreview ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowExpoPreview(false)}
                className="gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Phone Preview
              </Button>
              <Button
                variant={showExpoPreview ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowExpoPreview(true)}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Live Expo
              </Button>
            </div>
          )}
          
          {/* Success Badge */}
          {buildComplete && (
            <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full animate-bounce-in">
              <PartyPopper className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">App Ready!</span>
            </div>
          )}

          {showExpoPreview && snackUrl ? (
            <div className="w-[400px] h-[700px] rounded-xl border border-border overflow-hidden bg-card animate-fade-in">
              <ExpoPreview snackUrl={snackUrl} appName={appName} isLoading={isGenerating} />
            </div>
          ) : (
            <AppPreview
              appType={detectedAppType}
              appName={appName}
              theme={previewTheme}
              features={selectedFeatures}
              currentScreen={previewScreen}
              onScreenChange={setPreviewScreen}
              isGenerating={isGenerating}
              showNavigator={buildComplete || messages.length > 2}
              showSettings={buildComplete}
            />
          )}
        </div>

        {/* Right - Customization Panel */}
        {showCustomization && buildComplete && (
          <CustomizationPanel
            appName={appName}
            onAppNameChange={setAppName}
            theme={previewTheme}
            onThemeChange={setPreviewTheme}
            features={selectedFeatures}
            onFeaturesChange={setSelectedFeatures}
            screens={selectedScreens}
            onScreensChange={setSelectedScreens}
            appType={detectedAppType}
            onRegenerate={handleRegenerate}
            isRegenerating={isGenerating}
          />
        )}
      </main>

      {/* Download Modal */}
      <DownloadModal
        open={showDownloadModal}
        onOpenChange={setShowDownloadModal}
        generatedApp={generatedApp}
        appName={appName}
      />
    </div>
  );
};

export default Builder;
