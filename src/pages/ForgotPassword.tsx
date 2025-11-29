import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Connect to AWS backend
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      toast.success("Reset link sent to your email!");
    }, 1500);
  };

  const handleResend = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Reset link resent!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mb-8">
            <Logo size="lg" className="justify-center" />
          </div>

          {!emailSent ? (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Forgot password?</h1>
              <p className="text-muted-foreground mt-2">
                No worries, we'll send you reset instructions.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
              <p className="text-muted-foreground mt-2">
                We sent a password reset link to<br />
                <span className="text-foreground font-medium">{email}</span>
              </p>
            </>
          )}
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button 
              type="submit" 
              variant="gradient" 
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Button 
              variant="gradient" 
              className="w-full h-12 text-base"
              onClick={() => window.open("https://mail.google.com", "_blank")}
            >
              Open Email App
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Didn't receive the email?{" "}
              <button 
                onClick={handleResend}
                disabled={isLoading}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Click to resend
              </button>
            </p>
          </div>
        )}

        <Link 
          to="/signin" 
          className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
