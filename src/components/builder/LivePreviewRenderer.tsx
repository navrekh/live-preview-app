import { useMemo } from "react";
import { Signal, Wifi, Battery, Home, Search, User, ShoppingCart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeneratedFile } from "@/services/generator/types";

interface LivePreviewRendererProps {
  files: GeneratedFile[];
  appName: string;
  isLoading?: boolean;
}

// Convert React Native styles to web-friendly CSS
function convertRNStyleToWeb(style: Record<string, unknown>): React.CSSProperties {
  const webStyle: React.CSSProperties = {};

  for (const [key, value] of Object.entries(style)) {
    switch (key) {
      case "flex":
        webStyle.flex = value as number;
        break;
      case "flexDirection":
        webStyle.flexDirection = value as "row" | "column";
        break;
      case "justifyContent":
        webStyle.justifyContent = value as string;
        break;
      case "alignItems":
        webStyle.alignItems = value as string;
        break;
      case "padding":
      case "paddingHorizontal":
      case "paddingVertical":
      case "paddingTop":
      case "paddingBottom":
      case "paddingLeft":
      case "paddingRight":
        if (key === "paddingHorizontal") {
          webStyle.paddingLeft = value as number;
          webStyle.paddingRight = value as number;
        } else if (key === "paddingVertical") {
          webStyle.paddingTop = value as number;
          webStyle.paddingBottom = value as number;
        } else {
          (webStyle as Record<string, unknown>)[key] = value;
        }
        break;
      case "margin":
      case "marginHorizontal":
      case "marginVertical":
      case "marginTop":
      case "marginBottom":
      case "marginLeft":
      case "marginRight":
        if (key === "marginHorizontal") {
          webStyle.marginLeft = value as number;
          webStyle.marginRight = value as number;
        } else if (key === "marginVertical") {
          webStyle.marginTop = value as number;
          webStyle.marginBottom = value as number;
        } else {
          (webStyle as Record<string, unknown>)[key] = value;
        }
        break;
      case "backgroundColor":
      case "color":
      case "borderColor":
        (webStyle as Record<string, unknown>)[key] = value;
        break;
      case "borderRadius":
        webStyle.borderRadius = value as number;
        break;
      case "fontSize":
        webStyle.fontSize = value as number;
        break;
      case "fontWeight":
        webStyle.fontWeight = value as string;
        break;
      case "width":
      case "height":
        (webStyle as Record<string, unknown>)[key] = typeof value === "number" ? value : value;
        break;
      default:
        (webStyle as Record<string, unknown>)[key] = value;
    }
  }

  return webStyle;
}

// Parse and render JSX-like content from generated files
function renderGeneratedContent(files: GeneratedFile[], appName: string) {
  // Filter only frontend UI files
  const uiFiles = files.filter(
    (f) => f.type === "screen" || f.type === "component"
  );

  if (uiFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Home className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{appName}</h3>
        <p className="text-sm text-muted-foreground">Your app preview will appear here</p>
      </div>
    );
  }

  // Find the main screen/home screen based on path
  const mainScreen = uiFiles.find(
    (f) =>
      f.path.toLowerCase().includes("home") ||
      f.path.toLowerCase().includes("main") ||
      f.path.toLowerCase().includes("screen")
  ) || uiFiles[0];

  // Try to parse and render the content
  try {
    // For now, render a nice placeholder based on detected content
    const content = mainScreen.content.toLowerCase();
    
    // Detect app type from content
    const isCricket = content.includes("cricket") || content.includes("score") || content.includes("match");
    const isFood = content.includes("food") || content.includes("restaurant") || content.includes("delivery");
    const isSocial = content.includes("social") || content.includes("feed") || content.includes("post");
    const isEcommerce = content.includes("product") || content.includes("shop") || content.includes("cart");

    if (isCricket) {
      return <CricketAppPreview appName={appName} />;
    } else if (isFood) {
      return <FoodAppPreview appName={appName} />;
    } else if (isSocial) {
      return <SocialAppPreview appName={appName} />;
    } else if (isEcommerce) {
      return <EcommerceAppPreview appName={appName} />;
    }

    return <GenericAppPreview appName={appName} />;
  } catch {
    return <GenericAppPreview appName={appName} />;
  }
}

// Cricket App Preview
function CricketAppPreview({ appName }: { appName: string }) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-emerald-500 to-emerald-700">
      {/* Header */}
      <div className="p-4 pt-2">
        <h1 className="text-xl font-bold text-white">{appName}</h1>
        <p className="text-emerald-100 text-sm">Live Cricket Scores</p>
      </div>

      {/* Live Match Card */}
      <div className="mx-4 p-4 bg-white/95 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">
            ● LIVE
          </span>
          <span className="text-[11px] text-muted-foreground">T20 World Cup</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2 mx-auto">
              <span className="text-lg font-bold text-blue-600">IND</span>
            </div>
            <p className="font-bold text-foreground">185/4</p>
            <p className="text-[11px] text-muted-foreground">18.2 ov</p>
          </div>
          
          <div className="text-2xl font-bold text-muted-foreground">vs</div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2 mx-auto">
              <span className="text-lg font-bold text-green-600">PAK</span>
            </div>
            <p className="font-bold text-foreground">156/10</p>
            <p className="text-[11px] text-muted-foreground">19.4 ov</p>
          </div>
        </div>
        
        <p className="text-center text-sm text-emerald-600 font-medium mt-3">
          India needs 29 runs from 10 balls
        </p>
      </div>

      {/* Upcoming Matches */}
      <div className="flex-1 mt-4 px-4 space-y-2 overflow-auto">
        {["AUS vs ENG", "SA vs NZ", "WI vs SL"].map((match, i) => (
          <div key={i} className="p-3 bg-white/20 rounded-xl">
            <p className="text-white font-medium text-sm">{match}</p>
            <p className="text-emerald-100 text-[11px]">Tomorrow, {8 + i}:00 PM</p>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-around p-3 bg-white/95 border-t">
        <NavItem icon={<Home className="w-5 h-5" />} label="Home" active />
        <NavItem icon={<Search className="w-5 h-5" />} label="Search" />
        <NavItem icon={<User className="w-5 h-5" />} label="Profile" />
      </div>
    </div>
  );
}

// Food App Preview
function FoodAppPreview({ appName }: { appName: string }) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 pt-2">
        <p className="text-muted-foreground text-sm">Deliver to</p>
        <h1 className="text-lg font-bold text-foreground flex items-center gap-1">
          📍 123 Main Street
        </h1>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search restaurants...</span>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {["🍕 Pizza", "🍔 Burger", "🍜 Asian", "🥗 Healthy"].map((cat) => (
            <div key={cat} className="px-4 py-2 bg-primary/10 rounded-full whitespace-nowrap">
              <span className="text-sm font-medium text-primary">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Restaurants */}
      <div className="flex-1 px-4 space-y-3 overflow-auto">
        {[
          { name: "Pizza Palace", rating: "4.8", time: "25-35 min", img: "🍕" },
          { name: "Burger Barn", rating: "4.5", time: "20-30 min", img: "🍔" },
          { name: "Sushi House", rating: "4.9", time: "30-40 min", img: "🍣" },
        ].map((r, i) => (
          <div key={i} className="flex gap-3 p-3 bg-card rounded-xl border border-border/50">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl">
              {r.img}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{r.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>⭐ {r.rating}</span>
                <span>•</span>
                <span>{r.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-around p-3 bg-card border-t border-border">
        <NavItem icon={<Home className="w-5 h-5" />} label="Home" active />
        <NavItem icon={<Search className="w-5 h-5" />} label="Search" />
        <NavItem icon={<ShoppingCart className="w-5 h-5" />} label="Cart" badge="2" />
        <NavItem icon={<User className="w-5 h-5" />} label="Profile" />
      </div>
    </div>
  );
}

// Social App Preview
function SocialAppPreview({ appName }: { appName: string }) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">{appName}</h1>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-muted" />
        </div>
      </div>

      {/* Stories */}
      <div className="flex gap-3 p-4 overflow-x-auto">
        {["Your Story", "Alex", "Maria", "John"].map((name, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center",
              i === 0 ? "bg-muted border-2 border-dashed border-primary/50" : "bg-gradient-to-br from-pink-500 to-yellow-500 p-0.5"
            )}>
              {i === 0 ? (
                <span className="text-xl">+</span>
              ) : (
                <div className="w-full h-full rounded-full bg-muted" />
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">{name}</span>
          </div>
        ))}
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
            <div>
              <p className="font-semibold text-foreground text-sm">Sarah Wilson</p>
              <p className="text-[11px] text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <p className="text-sm text-foreground mb-3">Just finished an amazing hike! 🏔️ Nature is incredible.</p>
          <div className="aspect-video bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl mb-3" />
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="text-sm">❤️ 234</span>
            <span className="text-sm">💬 45</span>
            <span className="text-sm">↗️ Share</span>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-around p-3 bg-card border-t border-border">
        <NavItem icon={<Home className="w-5 h-5" />} label="Feed" active />
        <NavItem icon={<Search className="w-5 h-5" />} label="Discover" />
        <NavItem icon={<User className="w-5 h-5" />} label="Profile" />
      </div>
    </div>
  );
}

// Ecommerce App Preview
function EcommerceAppPreview({ appName }: { appName: string }) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 pt-2">
        <h1 className="text-xl font-bold text-foreground">{appName}</h1>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search products...</span>
        </div>
      </div>

      {/* Banner */}
      <div className="mx-4 h-28 bg-gradient-to-r from-primary to-accent rounded-2xl mb-4 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-2xl font-bold">50% OFF</p>
          <p className="text-sm opacity-90">Summer Sale</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 px-4 overflow-auto">
        <h2 className="font-semibold text-foreground mb-3">Popular Items</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Sneakers", price: "$129", img: "👟" },
            { name: "Watch", price: "$299", img: "⌚" },
            { name: "Headphones", price: "$199", img: "🎧" },
            { name: "Backpack", price: "$89", img: "🎒" },
          ].map((p, i) => (
            <div key={i} className="p-3 bg-card rounded-xl border border-border/50">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-3xl mb-2">
                {p.img}
              </div>
              <p className="font-medium text-foreground text-sm">{p.name}</p>
              <p className="text-primary font-bold">{p.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-around p-3 bg-card border-t border-border">
        <NavItem icon={<Home className="w-5 h-5" />} label="Home" active />
        <NavItem icon={<Search className="w-5 h-5" />} label="Search" />
        <NavItem icon={<ShoppingCart className="w-5 h-5" />} label="Cart" badge="3" />
        <NavItem icon={<User className="w-5 h-5" />} label="Profile" />
      </div>
    </div>
  );
}

// Generic App Preview
function GenericAppPreview({ appName }: { appName: string }) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 pt-2 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">{appName}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
          <span className="text-4xl">✨</span>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-card rounded-xl border border-border/50">
              <div className="h-3 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-around p-3 bg-card border-t border-border">
        <NavItem icon={<Home className="w-5 h-5" />} label="Home" active />
        <NavItem icon={<Search className="w-5 h-5" />} label="Search" />
        <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, label, active, badge }: { icon: React.ReactNode; label: string; active?: boolean; badge?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 relative">
      <div className={cn(active ? "text-primary" : "text-muted-foreground")}>
        {icon}
      </div>
      <span className={cn("text-[10px]", active ? "text-primary font-medium" : "text-muted-foreground")}>
        {label}
      </span>
      {badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
  );
}

export function LivePreviewRenderer({ files, appName, isLoading }: LivePreviewRendererProps) {
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });

  const content = useMemo(() => {
    if (isLoading) return null;
    return renderGeneratedContent(files, appName);
  }, [files, appName, isLoading]);

  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="relative w-[300px] h-[620px] bg-phone-frame rounded-[50px] p-[10px] shadow-phone">
        {/* Side Buttons */}
        <div className="absolute -left-[3px] top-[100px] w-[3px] h-[30px] bg-phone-frame rounded-l-sm" />
        <div className="absolute -left-[3px] top-[150px] w-[3px] h-[55px] bg-phone-frame rounded-l-sm" />
        <div className="absolute -left-[3px] top-[215px] w-[3px] h-[55px] bg-phone-frame rounded-l-sm" />
        <div className="absolute -right-[3px] top-[150px] w-[3px] h-[80px] bg-phone-frame rounded-r-sm" />

        {/* Inner Screen */}
        <div className="relative w-full h-full bg-phone-screen rounded-[42px] overflow-hidden">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 h-11 px-6 flex items-center justify-between">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-phone-notch rounded-b-[16px]" />
            
            <span className="text-white text-[13px] font-semibold">{currentTime}</span>
            
            <div className="flex items-center gap-1">
              <Signal className="w-4 h-4 text-white" />
              <Wifi className="w-4 h-4 text-white" />
              <Battery className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="h-full pt-11 pb-1 overflow-hidden">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/30 rounded-full animate-spin border-t-primary" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground animate-pulse">Generating preview...</p>
              </div>
            ) : (
              content
            )}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default LivePreviewRenderer;
