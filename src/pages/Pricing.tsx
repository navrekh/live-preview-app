import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Zap, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { 
  CREDIT_PACKAGES, 
  CreditPackage, 
  createPaymentOrder, 
  openRazorpayCheckout, 
  verifyPayment 
} from "@/services/payments";
import { useAuth } from "@/contexts/AuthContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);

  const handleFreePlan = () => {
    navigate("/signup");
  };

  const handleBuyCredits = async (pkg: CreditPackage) => {
    if (!user) {
      toast.info("Please sign in to purchase credits");
      navigate("/signin");
      return;
    }

    setLoadingPackage(pkg.id);

    try {
      // Create order on backend
      const order = await createPaymentOrder(pkg.id);

      // Open Razorpay checkout
      openRazorpayCheckout(
        pkg,
        order,
        async (response) => {
          try {
            // Verify payment
            const result = await verifyPayment({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            if (result.success) {
              toast.success(`Successfully added ${result.credits} credits!`);
              navigate("/dashboard");
            }
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setLoadingPackage(null);
          }
        },
        () => {
          setLoadingPackage(null);
        },
        { name: user.name, email: user.email }
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create order");
      setLoadingPackage(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Logo size="sm" />
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
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Simple Pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Start building mobile apps for free. Buy credits when you need more.
          </p>
        </div>

        {/* Free Plan Card */}
        <div className="max-w-md mx-auto mb-12">
          <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Free Starter</h3>
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
                <span className="text-2xl font-semibold">5 Free Credits</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 ml-11">
                On signup - enough for 1 app build
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
        </div>

        {/* Credit Packages */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-foreground">Buy Credits</h2>
          <p className="text-center text-muted-foreground">Each app build costs 20 credits</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {CREDIT_PACKAGES.map((pkg) => (
              <div 
                key={pkg.id}
                className={`rounded-2xl border bg-card p-6 space-y-4 relative ${
                  pkg.popular ? 'border-2 border-primary' : 'border-border'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Popular
                    </span>
                  </div>
                )}

                {pkg.discount && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {pkg.discount}% OFF
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    pkg.credits >= 1000 ? 'bg-yellow-500/10' : 'bg-primary/10'
                  }`}>
                    {pkg.credits >= 1000 ? (
                      <Crown className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Zap className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-foreground">{pkg.credits}</span>
                    <span className="text-muted-foreground ml-1">credits</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">{formatPrice(pkg.price)}</span>
                    {pkg.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(pkg.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ₹{(pkg.price / pkg.credits).toFixed(0)} per credit
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  Build up to {Math.floor(pkg.credits / 20)} apps
                </p>

                <Button 
                  variant={pkg.popular ? "gradient" : "outline"}
                  className="w-full"
                  onClick={() => handleBuyCredits(pkg)}
                  disabled={loadingPackage === pkg.id}
                >
                  {loadingPackage === pkg.id ? "Processing..." : `Buy ${pkg.credits} Credits`}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* How Credits Work */}
        <div className="mt-16 p-6 rounded-2xl border border-border bg-card/50 max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">How Credits Work</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">20</div>
              <p className="text-sm text-muted-foreground">Credits per app build</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5</div>
              <p className="text-sm text-muted-foreground">Free credits on signup</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">~2 min</div>
              <p className="text-sm text-muted-foreground">Build time per app</p>
            </div>
          </div>
        </div>

        {/* Features included */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-6 text-center">All Plans Include</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "AI-powered app generation",
              "Live phone preview",
              "Download APK & IPA",
              "Figma import",
              "Publish to Play Store",
              "Publish to App Store",
              "Premium templates",
              "Priority support",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Need more credits or custom pricing?{" "}
            <button 
              className="text-primary hover:underline"
              onClick={() => toast.info("Contact us at support@appdev.co.in")}
            >
              Contact us
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
