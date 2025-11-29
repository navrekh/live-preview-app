import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PhoneSimulator from "@/components/PhoneSimulator";
import ChatInput from "@/components/ChatInput";
import PreviewScreen from "@/components/PreviewScreen";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const handlePromptSubmit = (message: string) => {
    navigate("/builder", { state: { prompt: message } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={() => navigate("/pricing")}
            >
              Pricing
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/signin")}
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
                <span className="gradient-text">From Idea to App Store</span>
                <br />
                <span className="text-foreground">in Minutes</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Just describe what you want. AI builds your mobile app and delivers a real APK or IPA — no coding needed.
              </p>
            </div>

            {/* Chat Input */}
            <ChatInput
              onSubmit={handlePromptSubmit}
              isLoading={false}
              placeholder="Describe your app... e.g., 'Build a salon booking app with payments'"
            />

            {/* Quick prompts */}
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
          </div>

          {/* Right - Phone Preview */}
          <div className="hidden lg:flex justify-center">
            <PhoneSimulator
              isGenerating={false}
              content={
                <PreviewScreen template="empty" />
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
