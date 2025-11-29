import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Pricing = () => {
  const navigate = useNavigate();

  const handleFreePlan = () => {
    navigate("/signup");
  };

  const handleProPlan = () => {
    // TODO: Connect to AWS payment gateway (Razorpay/PayU for INR)
    toast.info("Payment integration coming soon!");
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">AppDev</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Pricing Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Simple Pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Start building mobile apps for free. Upgrade when you need more.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Free</h3>
              <p className="text-muted-foreground text-sm">Perfect to get started</p>
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">₹0</span>
              <span className="text-muted-foreground">/forever</span>
            </div>

            <div className="py-4 border-t border-border">
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="text-2xl font-semibold">5 Credits</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 ml-11">
                Included on sign up
              </p>
            </div>

            <ul className="space-y-3">
              {[
                "AI-powered app generation",
                "Phone simulator preview",
                "Download APK",
                "Basic templates",
                "Community support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleFreePlan}
            >
              Get Started Free
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="rounded-2xl border-2 border-primary bg-card p-8 space-y-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Pro</h3>
              <p className="text-muted-foreground text-sm">For serious builders</p>
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">₹2,000</span>
              <span className="text-muted-foreground">/one-time</span>
            </div>

            <div className="py-4 border-t border-border">
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="text-2xl font-semibold">100 Credits</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 ml-11">
                ₹20 per credit
              </p>
            </div>

            <ul className="space-y-3">
              {[
                "Everything in Free",
                "Download APK & IPA",
                "Figma import",
                "Publish to Play Store",
                "Publish to App Store",
                "Priority support",
                "Premium templates",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              variant="gradient" 
              className="w-full"
              onClick={handleProPlan}
            >
              Get Pro
            </Button>
          </div>
        </div>

        {/* FAQ or additional info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Need more credits?{" "}
            <button 
              className="text-primary hover:underline"
              onClick={() => toast.info("Contact sales for custom plans!")}
            >
              Contact us for custom plans
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
