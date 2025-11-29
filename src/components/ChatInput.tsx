import { useState } from "react";
import { Send, Sparkles, Paperclip, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const ChatInput = ({ onSubmit, isLoading = false, placeholder = "Describe your app idea..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "relative rounded-2xl transition-all duration-300",
          isFocused ? "shadow-glow" : ""
        )}
      >
        <div
          className={cn(
            "relative rounded-2xl border bg-card/50 backdrop-blur-xl transition-all duration-300",
            isFocused ? "border-primary/50" : "border-border"
          )}
        >
          {/* Input area */}
          <div className="flex items-start gap-2 p-4">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              rows={3}
              className="flex-1 bg-transparent resize-none text-foreground placeholder:text-muted-foreground focus:outline-none text-sm leading-relaxed"
              disabled={isLoading}
            />
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="w-4 h-4 mr-1.5" />
                <span className="text-xs">Figma</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-muted-foreground hover:text-foreground"
              >
                <ImageIcon className="w-4 h-4 mr-1.5" />
                <span className="text-xs">Image</span>
              </Button>
            </div>

            <Button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="h-9 px-4 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <span className="mr-2">Generate</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
