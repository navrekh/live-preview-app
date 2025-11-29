import { cn } from "@/lib/utils";

interface TemplateCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const TemplateCard = ({
  title,
  description,
  icon,
  gradient,
  onClick,
  isSelected = false,
}: TemplateCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative p-4 rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300 text-left w-full",
        "hover:border-primary/30 hover:bg-card/80 hover:shadow-card",
        isSelected && "border-primary bg-primary/5 shadow-glow"
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110",
          gradient
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}
    </button>
  );
};

export default TemplateCard;
