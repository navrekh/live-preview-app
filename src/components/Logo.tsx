import appdevLogo from "@/assets/appdev-logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

const Logo = ({ size = "md", showText = true, className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-xl overflow-hidden`}>
        <img 
          src={appdevLogo} 
          alt="AppDev Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      {showText && (
        <span className={`font-bold text-foreground ${textSizeClasses[size]}`}>
          AppDev
        </span>
      )}
    </div>
  );
};

export default Logo;
