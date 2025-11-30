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
  Code,
  Settings,
  PanelRightClose,
  PanelRightOpen,
  ExternalLink
} from "lucide-react";
import BuildProgress from "@/components/BuildProgress";
import { AppPreview } from "@/components/preview";
import { CodeTabs, CustomizationPanel, DownloadModal } from "@/components/builder";
import Logo from "@/components/Logo";
import FrameworkSelectModal from "@/components/FrameworkSelectModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendChatMessage, ChatMessage, ChatResponse } from "@/services/chat";
import { useCredits } from "@/hooks/useCredits";
import { 
  generateApp, 
  parseConversationToRequirements,
  detectAppType,
  GeneratedApp,
  GenerationProgress 
} from "@/services/generator";
import { AppType, FeatureType, ColorTheme } from "@/services/generator/types";

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
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<"react-native" | "flutter" | null>(null);
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

      // Auto-detect app type from conversation to update preview
      const allUserMessages = [...messages, userMessage].filter(m => m.type === "user").map(m => m.content).join(" ");
      const detected = detectAppType(allUserMessages) as AppType;
      if (detected) {
        setDetectedAppType(detected);
        // Update theme based on app type
        const themesByType: Record<string, ColorTheme> = {
          'food-delivery': { primary: '#FF5722', secondary: '#FFC107', accent: '#4CAF50' },
          'ecommerce': { primary: '#3F51B5', secondary: '#FF4081', accent: '#00BCD4' },
          'social': { primary: '#E91E63', secondary: '#9C27B0', accent: '#03A9F4' },
          'booking': { primary: '#009688', secondary: '#FF9800', accent: '#2196F3' },
          'fitness': { primary: '#8BC34A', secondary: '#FF5722', accent: '#00BCD4' },
          'travel': { primary: '#2196F3', secondary: '#FF9800', accent: '#4CAF50' },
          'education': { primary: '#673AB7', secondary: '#FF5722', accent: '#4CAF50' },
          'healthcare': { primary: '#00BCD4', secondary: '#4CAF50', accent: '#FF9800' },
        };
        setPreviewTheme(themesByType[detected] || themesByType['ecommerce']);
        setPreviewScreen('home');
      }
      
      // Extract app name from conversation
      const extractedName = extractAppName(allUserMessages);
      if (extractedName) {
        setAppName(extractedName);
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
    setSnackUrl(null);
    setShowExpoPreview(false);
    setActiveTab("preview");
    
    const frameworkName = framework === "react-native" ? "React Native" : "Flutter";
    toast.info(`Starting ${frameworkName} app generation with Node.js backend... This will use 20 credits.`);

    // Gather conversation for requirements parsing
    const conversationText = messages
      .filter(m => m.type === "user")
      .map(m => m.content)
      .join(" ");

    const extractedName = extractAppName(conversationText) || appName;
    setAppName(extractedName);
    setPreviewScreen("splash");

    // Progress simulation for API call
    const progressSteps = [
      { step: 'analyze', progress: 20, message: 'Analyzing requirements...', idx: 0 },
      { step: 'template', progress: 40, message: 'Selecting best template...', idx: 1 },
      { step: 'frontend', progress: 60, message: 'Generating React Native code...', idx: 2 },
      { step: 'backend', progress: 80, message: 'Creating backend APIs...', idx: 3 },
      { step: 'preview', progress: 95, message: 'Building preview...', idx: 4 },
    ];

    try {
      const token = localStorage.getItem('token');
      
      // Start progress animation
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
          
          const progressMessage: Message = {
            id: `step-${step.step}-${Date.now()}`,
            type: "assistant",
            content: `⚙️ ${step.message}`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, progressMessage]);
          progressIdx++;
        }
      }, 800);

      // Call the backend API
      const response = await fetch('https://appdev.co.in/api/generate/app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          appName: extractedName,
          conversationHistory: messages.map(m => ({ role: m.type, content: m.content })),
          framework,
          appType: detectedAppType,
          theme: previewTheme,
          features: selectedFeatures,
        })
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate app');
      }

      if (data.success) {
        // Update with API response
        const result: GeneratedApp = {
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

        // Update detected values from API response
        if (data.appType) setDetectedAppType(data.appType);
        if (data.theme) setPreviewTheme(data.theme);
        if (data.features) setSelectedFeatures(data.features);
        if (data.screens) setSelectedScreens(data.screens);

        setBuildSteps((prev) =>
          prev.map((step) => ({ ...step, status: "completed" as BuildStepStatus }))
        );
        setBuildProgress(100);
        setIsGenerating(false);
        setBuildComplete(true);
        setShowCustomization(true);
        
        const fileCount = result.files?.length || 0;
        const frontendFiles = result.files?.filter(f => f.type !== 'backend').length || 0;
        const backendFiles = result.files?.filter(f => f.type === 'backend').length || 0;

        const completeMessage: Message = {
          id: `complete-${Date.now()}`,
          type: "assistant",
          content: `🎉 **Your ${extractedName} app is ready!**\n\n**Generated:**\n- ${frontendFiles || 'Multiple'} React Native files\n- ${backendFiles || 'Multiple'} Node.js backend files\n- Database schema\n\n${data.snackUrl ? '**Live Preview:** Open in Expo Snack to test your app!\n\n' : ''}You can now customize, download, or publish your app using the controls on the right.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, completeMessage]);
        
        refetchCredits();
        toast.success("Your app is ready! 20 credits deducted.");
      } else {
        throw new Error(data.message || 'Generation failed');
      }
    } catch (error) {
      console.error("App generation error:", error);
      setIsGenerating(false);
      setBuildSteps((prev) =>
        prev.map((step) => ({ ...step, status: "pending" as BuildStepStatus }))
      );
      
      // Fallback to local generation if API fails
      toast.error("Backend unavailable. Using local generation...");
      await handleLocalGeneration(framework, extractedName, conversationText);
    }
  };

  // Fallback local generation
  const handleLocalGeneration = async (framework: "react-native" | "flutter", extractedName: string, conversationText: string) => {
    const requirements = parseConversationToRequirements(conversationText, extractedName, framework);
    
    setDetectedAppType(requirements.type);
    setPreviewTheme(requirements.colorTheme);
    setSelectedFeatures(requirements.features);
    setSelectedScreens(requirements.screens);

    const stepMapping: Record<string, number> = {
      structure: 0,
      frontend: 2,
      backend: 3,
      database: 3,
      preview: 4,
      complete: 4,
    };

    try {
      const result = await generateApp(requirements, (progress: GenerationProgress) => {
        setBuildProgress(progress.progress);
        const stepIndex = stepMapping[progress.step] ?? 0;
        setBuildSteps((prev) =>
          prev.map((step, idx) => ({
            ...step,
            status: idx < stepIndex ? "completed" : idx === stepIndex ? "active" : "pending",
          }))
        );
      });

      setGeneratedApp(result);
      setBuildSteps((prev) =>
        prev.map((step) => ({ ...step, status: "completed" as BuildStepStatus }))
      );
      setBuildProgress(100);
      setIsGenerating(false);
      setBuildComplete(true);
      setShowCustomization(true);
      
      const completeMessage: Message = {
        id: `complete-${Date.now()}`,
        type: "assistant",
        content: `🎉 **Your ${extractedName} app is ready!** (Generated locally)\n\nYou can now customize, download, or publish your app.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completeMessage]);
      
      refetchCredits();
      toast.success("Your app is ready! 20 credits deducted.");
    } catch (error) {
      console.error("Local generation error:", error);
      setIsGenerating(false);
      setBuildSteps((prev) =>
        prev.map((step) => ({ ...step, status: "pending" as BuildStepStatus }))
      );
      toast.error("Failed to generate app. Please try again.");
    }
  };

  const handleRegenerate = async () => {
    if (!selectedFramework) {
      setShowFrameworkModal(true);
      return;
    }
    
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
    
    toast.info("Regenerating app with your customizations... This will use 20 credits.");

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://appdev.co.in/api/generate/app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          appName,
          framework: selectedFramework,
          appType: detectedAppType,
          theme: previewTheme,
          features: selectedFeatures,
          screens: selectedScreens,
          regenerate: true,
        })
      });

      const data = await response.json();

      if (data.success) {
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
        toast.success("App regenerated successfully! 20 credits deducted.");
      } else {
        throw new Error(data.message || 'Regeneration failed');
      }
    } catch (error) {
      console.error("Regeneration error:", error);
      
      // Fallback to local regeneration
      const requirements = {
        name: appName,
        type: detectedAppType,
        framework: selectedFramework,
        features: selectedFeatures,
        colorTheme: previewTheme,
        screens: selectedScreens,
      };

      try {
        const result = await generateApp(requirements, (progress: GenerationProgress) => {
          setBuildProgress(progress.progress);
        });

        setGeneratedApp(result);
        setBuildSteps((prev) =>
          prev.map((step) => ({ ...step, status: "completed" as BuildStepStatus }))
        );
        setBuildProgress(100);
        setIsGenerating(false);
        setBuildComplete(true);
        
        refetchCredits();
        toast.success("App regenerated locally! 20 credits deducted.");
      } catch (localError) {
        setIsGenerating(false);
        toast.error("Failed to regenerate. Please try again.");
      }
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
              <Apple className="w-4 h-4" />
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

        {/* Center - Phone Preview */}
        <div className="w-auto flex items-start justify-center p-6 bg-muted/20 overflow-y-auto">
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

      {/* Framework Selection Modal */}
      <FrameworkSelectModal
        open={showFrameworkModal}
        onOpenChange={setShowFrameworkModal}
        onConfirm={handleStartBuild}
        creditsRequired={20}
      />

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
