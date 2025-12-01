import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileUp,
  ExternalLink,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { GooglePlayIcon, AppStoreIcon } from "@/components/StoreIcons";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCredits } from "@/hooks/useCredits";
import { useConfetti } from "@/hooks/useConfetti";
import useBuilder from "@/hooks/useBuilder";
import { MessageInput, ChatMessage, LivePreviewRenderer, DownloadModal } from "@/components/builder";
import { useState } from "react";

const Builder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialPrompt = location.state?.prompt || "";

  const { balance } = useCredits();
  const { fireConfetti, fireStars } = useConfetti();
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const {
    messages,
    sendMessage,
    generatedFiles,
    isLoading,
    appName,
    setAppName,
    snackUrl,
    reactNativeCode,
    backendCode,
    buildComplete,
    clearMessages,
    detectedAppType,
  } = useBuilder("MyApp");

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle initial prompt
  useEffect(() => {
    if (initialPrompt) {
      // Extract app name from prompt if possible
      const nameMatch = initialPrompt.match(/(?:called|named|build|create)\s+(?:a\s+)?["']?([A-Za-z][A-Za-z0-9\s]{1,20})["']?/i);
      if (nameMatch) {
        setAppName(nameMatch[1].trim());
      }
      sendMessage(initialPrompt);
    }
  }, []);

  // Fire confetti when build completes
  useEffect(() => {
    if (buildComplete) {
      setTimeout(() => {
        fireConfetti();
        fireStars();
        toast.success("🎉 Your app is ready!");
      }, 300);
    }
  }, [buildComplete, fireConfetti, fireStars]);

  const handleOpenExpoSnack = () => {
    if (snackUrl) {
      window.open(snackUrl, "_blank");
    } else {
      const encodedName = encodeURIComponent(appName || "MyApp");
      window.open(
        `https://snack.expo.dev/?name=${encodedName}&platform=ios`,
        "_blank"
      );
      toast.info("Opening Expo Snack - paste the generated code to preview");
    }
  };

  const suggestions = [
    "Cricket score app",
    "Food delivery app",
    "Social media app",
    "E-commerce app",
    "Fitness tracker",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 px-4 py-3 shrink-0 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground hover:text-foreground rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Logo size="sm" />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>{balance} credits</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              onClick={() => toast.info("Import from Figma coming soon!")}
            >
              <FileUp className="w-4 h-4" />
              <span className="hidden sm:inline">Figma</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              disabled={!buildComplete}
              onClick={() => setShowDownloadModal(true)}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              disabled={!buildComplete}
              onClick={handleOpenExpoSnack}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Expo</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              disabled={!buildComplete}
              onClick={() => toast.info("Publishing to Play Store...")}
            >
              <GooglePlayIcon className="w-4 h-4" />
              <span className="hidden md:inline">Play Store</span>
            </Button>
            <Button
              variant="gradient"
              size="sm"
              className="gap-2 rounded-xl"
              disabled={!buildComplete}
              onClick={() => toast.info("Publishing to App Store...")}
            >
              <AppStoreIcon className="w-4 h-4" />
              <span className="hidden md:inline">App Store</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left - Chat Panel */}
        <div className="flex-1 flex flex-col min-w-0 max-w-2xl border-r border-border/30">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 1 && messages[0].role === "assistant" ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md animate-fade-in">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-glow">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      What do you want to build?
                    </h2>
                    <p className="text-muted-foreground">
                      Describe your app idea and I'll generate it instantly.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        className="px-4 py-2 rounded-xl bg-card border border-border/50 text-sm text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-200 shadow-sm"
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
                  <ChatMessage key={message.id} message={message} />
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-card border border-border/50">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/30 bg-background/50 backdrop-blur-xl">
            {buildComplete && (
              <div className="flex items-center justify-center gap-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearMessages}
                  className="gap-2 rounded-xl text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Project
                </Button>
              </div>
            )}
            <MessageInput
              onSend={sendMessage}
              isLoading={isLoading}
              placeholder={
                buildComplete
                  ? "Describe changes or start a new project..."
                  : "Describe your app idea..."
              }
            />
          </div>
        </div>

        {/* Right - Mobile Preview */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-muted/30 to-muted/10 overflow-auto">
          <div className="animate-scale-in">
            {/* Success Badge */}
            {buildComplete && (
              <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full animate-bounce-in mx-auto w-fit">
                <span className="text-lg">🎉</span>
                <span className="text-sm font-medium text-green-500">
                  App Generated!
                </span>
              </div>
            )}

            <LivePreviewRenderer
              files={generatedFiles}
              appName={appName}
              isLoading={isLoading}
              detectedAppType={detectedAppType}
            />

            {/* App Name Input */}
            {!isLoading && (
              <div className="mt-4 text-center">
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="bg-transparent border-none text-center text-foreground font-semibold text-lg outline-none focus:ring-2 focus:ring-primary/50 rounded-lg px-3 py-1"
                  placeholder="App Name"
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Download Modal */}
      <DownloadModal
        open={showDownloadModal}
        onOpenChange={setShowDownloadModal}
        generatedApp={{
          reactNativeCode,
          backendCode,
          databaseSchema: "",
          previewUrl: "",
          files: generatedFiles,
        }}
        appName={appName}
      />
    </div>
  );
};

export default Builder;
