import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  className?: string;
}

export function MessageInput({
  onSend,
  isLoading,
  placeholder = "Describe your app idea...",
  className,
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-end gap-3 p-3 rounded-2xl",
          "bg-card/80 backdrop-blur-xl",
          "border border-border/50",
          "shadow-card",
          "transition-all duration-300",
          "focus-within:border-primary/50 focus-within:shadow-glow",
          isLoading && "opacity-70"
        )}
      >
        {/* AI Indicator */}
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>

        {/* Input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className={cn(
            "flex-1 bg-transparent border-none outline-none resize-none",
            "text-foreground placeholder:text-muted-foreground",
            "text-[15px] leading-relaxed",
            "min-h-[40px] py-2",
            "disabled:cursor-not-allowed"
          )}
        />

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
            "transition-all duration-200",
            value.trim() && !isLoading
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Helper Text */}
      <p className="text-[11px] text-muted-foreground mt-2 text-center">
        Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium">Enter</kbd> to send
        • <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}

export default MessageInput;
