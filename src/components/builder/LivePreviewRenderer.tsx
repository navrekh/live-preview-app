import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { GeneratedFile } from "@/services/generator/types";
import { 
  Smartphone, 
  Loader2, 
  Wifi, 
  Battery, 
  Signal,
  Trophy,
  Star,
  Heart,
  ShoppingCart,
  MapPin,
  Clock,
  Play,
  TrendingUp,
  Bookmark,
  MessageCircle,
  Home,
  Search,
  Bell,
  User
} from "lucide-react";

interface LivePreviewRendererProps {
  files: GeneratedFile[];
  appName: string;
  isLoading?: boolean;
  detectedAppType?: string | null;
}

export function LivePreviewRenderer({ 
  files, 
  appName, 
  isLoading = false,
  detectedAppType 
}: LivePreviewRendererProps) {
  
  const appType = useMemo(() => {
    if (detectedAppType) return detectedAppType;
    
    const allContent = files.map(f => f.content.toLowerCase()).join(" ");
    
    if (/cricket|score|match|ipl|batting|bowling|wicket/.test(allContent)) return "cricket";
    if (/food|restaurant|menu|delivery|cuisine/.test(allContent)) return "food";
    if (/product|cart|shop|ecommerce|price/.test(allContent)) return "ecommerce";
    if (/social|feed|post|follow|like/.test(allContent)) return "social";
    if (/fitness|workout|exercise|gym|health/.test(allContent)) return "fitness";
    if (/news|article|headline|breaking/.test(allContent)) return "news";
    if (/movie|video|stream|watch/.test(allContent)) return "entertainment";
    if (/travel|hotel|flight|booking/.test(allContent)) return "travel";
    
    return "generic";
  }, [files, detectedAppType]);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative">
      {/* iPhone Frame */}
      <div className="relative w-[320px] h-[650px] bg-foreground rounded-[50px] p-[12px] shadow-2xl">
        {/* Dynamic Island */}
        <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-background rounded-full z-20" />
        
        {/* Screen */}
        <div className="relative w-full h-full bg-background rounded-[40px] overflow-hidden">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-8 pt-4 pb-2 text-foreground">
            <span className="text-sm font-semibold">{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Battery className="w-5 h-5" />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 h-[calc(100%-60px)] overflow-hidden">
            {isLoading ? (
              <LoadingState />
            ) : files.length === 0 ? (
              <EmptyState appName={appName} />
            ) : (
              <AppPreview appType={appType} appName={appName} />
            )}
          </div>

          {/* Bottom Navigation */}
          {files.length > 0 && !isLoading && (
            <BottomNavigation appType={appType} />
          )}
        </div>
      </div>

      {/* Reflection Effect */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[280px] h-8 bg-gradient-to-b from-foreground/10 to-transparent rounded-full blur-xl" />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-primary/20 animate-ping absolute" />
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center relative">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-foreground">Generating your app...</p>
        <p className="text-xs text-muted-foreground">This takes a few seconds</p>
      </div>
      <div className="flex gap-1 mt-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

function EmptyState({ appName }: { appName: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
        <Smartphone className="w-10 h-10 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{appName}</h3>
      <p className="text-xs text-muted-foreground max-w-[200px]">
        Describe your app idea and watch it come to life here
      </p>
    </div>
  );
}

function AppPreview({ appType, appName }: { appType: string; appName: string }) {
  switch (appType) {
    case "cricket":
      return <CricketPreview />;
    case "food":
      return <FoodPreview />;
    case "ecommerce":
      return <EcommercePreview />;
    case "social":
      return <SocialPreview />;
    case "fitness":
      return <FitnessPreview />;
    case "news":
      return <NewsPreview />;
    case "entertainment":
      return <EntertainmentPreview />;
    case "travel":
      return <TravelPreview />;
    default:
      return <GenericPreview appName={appName} />;
  }
}

// Cricket App Preview
function CricketPreview() {
  return (
    <div className="h-full overflow-y-auto pb-16">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700">
        <h1 className="text-white font-bold text-lg">🏏 Live Cricket</h1>
        <p className="text-green-100 text-xs">IPL 2024</p>
      </div>

      {/* Live Match Card */}
      <div className="mx-4 mt-4 p-4 bg-card rounded-2xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">● LIVE</span>
          <span className="text-[10px] text-muted-foreground">Match 45</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-1">MI</div>
            <p className="text-xs font-semibold">Mumbai</p>
            <p className="text-lg font-bold text-foreground">186/4</p>
            <p className="text-[10px] text-muted-foreground">18.2 ov</p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">vs</p>
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto" />
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-1">CSK</div>
            <p className="text-xs font-semibold">Chennai</p>
            <p className="text-lg font-bold text-foreground">142/3</p>
            <p className="text-[10px] text-muted-foreground">15.0 ov</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-center text-primary font-medium">CSK need 45 runs from 30 balls</p>
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-semibold mb-3">Upcoming Matches</h2>
        {[
          { team1: "RCB", team2: "KKR", time: "7:30 PM" },
          { team1: "DC", team2: "RR", time: "Tomorrow" },
        ].map((match, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">{match.team1}</div>
              <span className="text-xs text-muted-foreground">vs</span>
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-xs font-bold">{match.team2}</div>
            </div>
            <span className="text-xs text-muted-foreground">{match.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Food Delivery Preview
function FoodPreview() {
  return (
    <div className="h-full overflow-y-auto pb-16">
      {/* Header */}
      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground">Deliver to</p>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Home • 123 Main St</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-2xl">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search restaurants...</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 px-4 mb-4 overflow-x-auto">
        {["🍕 Pizza", "🍔 Burger", "🍜 Asian", "🥗 Healthy"].map((cat) => (
          <div key={cat} className="px-4 py-2 bg-card border border-border rounded-full text-xs font-medium whitespace-nowrap">
            {cat}
          </div>
        ))}
      </div>

      {/* Restaurant Cards */}
      <div className="px-4 space-y-3">
        <h2 className="text-sm font-semibold">Popular Near You</h2>
        {[
          { name: "Pizza Palace", rating: 4.8, time: "25-30", cuisine: "Italian", img: "🍕" },
          { name: "Burger Barn", rating: 4.5, time: "20-25", cuisine: "American", img: "🍔" },
          { name: "Sushi Master", rating: 4.9, time: "35-40", cuisine: "Japanese", img: "🍣" },
        ].map((r, i) => (
          <div key={i} className="flex gap-3 p-3 bg-card rounded-2xl border border-border">
            <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center text-2xl">{r.img}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{r.name}</h3>
              <p className="text-xs text-muted-foreground">{r.cuisine}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium">{r.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">•</span>
                <div className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{r.time} min</span>
                </div>
              </div>
            </div>
            <Heart className="w-5 h-5 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

// E-commerce Preview
function EcommercePreview() {
  return (
    <div className="h-full overflow-y-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="font-bold text-lg">Shop</h1>
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-2xl">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search products...</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto">
        {["All", "Electronics", "Fashion", "Home"].map((cat, i) => (
          <div key={cat} className={cn(
            "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap",
            i === 0 ? "bg-primary text-primary-foreground" : "bg-card border border-border"
          )}>
            {cat}
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {[
          { name: "Wireless Earbuds", price: "$79", img: "🎧", rating: 4.8 },
          { name: "Smart Watch", price: "$199", img: "⌚", rating: 4.6 },
          { name: "Sneakers", price: "$129", img: "👟", rating: 4.9 },
          { name: "Backpack", price: "$59", img: "🎒", rating: 4.7 },
        ].map((p, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="h-24 bg-muted flex items-center justify-center text-3xl">{p.img}</div>
            <div className="p-3">
              <h3 className="font-medium text-xs truncate">{p.name}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-sm text-primary">{p.price}</span>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-[10px]">{p.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Social Media Preview
function SocialPreview() {
  return (
    <div className="h-full overflow-y-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h1 className="font-bold text-lg">Feed</h1>
        <div className="flex gap-3">
          <Bell className="w-5 h-5" />
          <MessageCircle className="w-5 h-5" />
        </div>
      </div>

      {/* Stories */}
      <div className="flex gap-3 p-4 border-b border-border overflow-x-auto">
        {["You", "John", "Sarah", "Mike", "Emma"].map((name, i) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center text-lg",
              i === 0 ? "border-2 border-dashed border-muted-foreground" : "bg-gradient-to-br from-pink-500 to-purple-500 p-[2px]"
            )}>
              {i === 0 ? "+" : (
                <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                  {name[0]}
                </div>
              )}
            </div>
            <span className="text-[10px]">{name}</span>
          </div>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4 p-4">
        {[
          { user: "Sarah", time: "2h ago", content: "Just finished my morning run! 🏃‍♀️", likes: 234, comments: 18 },
          { user: "Mike", time: "5h ago", content: "Check out this amazing sunset 🌅", likes: 567, comments: 42 },
        ].map((post, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                {post.user[0]}
              </div>
              <div>
                <p className="font-semibold text-sm">{post.user}</p>
                <p className="text-[10px] text-muted-foreground">{post.time}</p>
              </div>
            </div>
            <p className="text-sm mb-3">{post.content}</p>
            <div className="h-32 bg-muted rounded-xl mb-3" />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <span className="text-xs">{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs">{post.comments}</span>
              </div>
              <Bookmark className="w-5 h-5 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Fitness Preview
function FitnessPreview() {
  return (
    <div className="h-full overflow-y-auto pb-16">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500">
        <p className="text-white/80 text-xs">Good Morning!</p>
        <h1 className="text-white font-bold text-lg">Your Fitness</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 p-4">
        {[
          { label: "Steps", value: "8,432", icon: "👟" },
          { label: "Calories", value: "486", icon: "🔥" },
          { label: "Active", value: "45min", icon: "⏱" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border p-3 text-center">
            <span className="text-xl">{stat.icon}</span>
            <p className="font-bold text-sm mt-1">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Ring */}
      <div className="mx-4 p-4 bg-card rounded-2xl border border-border">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted" />
              <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray="226" strokeDashoffset="60" className="text-primary" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-lg">73%</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Daily Goal</h3>
            <p className="text-xs text-muted-foreground">2,568 steps to go</p>
            <p className="text-xs text-primary mt-1">Keep going! 💪</p>
          </div>
        </div>
      </div>

      {/* Workouts */}
      <div className="px-4 mt-4">
        <h2 className="text-sm font-semibold mb-3">Today's Workouts</h2>
        {[
          { name: "Morning Yoga", duration: "30 min", done: true },
          { name: "HIIT Training", duration: "20 min", done: false },
        ].map((w, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border mb-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              w.done ? "bg-green-500/20 text-green-500" : "bg-primary/20 text-primary"
            )}>
              {w.done ? "✓" : <Play className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{w.name}</p>
              <p className="text-xs text-muted-foreground">{w.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// News Preview
function NewsPreview() {
  return (
    <div className="h-full overflow-y-auto pb-16">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h1 className="font-bold text-lg">📰 News</h1>
      </div>

      {/* Categories */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        {["For You", "Tech", "Sports", "Business", "Health"].map((cat, i) => (
          <div key={cat} className={cn(
            "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap",
            i === 0 ? "bg-primary text-primary-foreground" : "bg-card border border-border"
          )}>
            {cat}
          </div>
        ))}
      </div>

      {/* Featured Article */}
      <div className="mx-4 mb-4">
        <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-3 flex items-end p-4">
          <div>
            <span className="px-2 py-1 bg-white/20 rounded text-white text-[10px] font-medium">BREAKING</span>
            <h2 className="text-white font-bold mt-2 text-sm leading-tight">Major Tech Companies Announce New AI Initiatives</h2>
          </div>
        </div>
      </div>

      {/* Article List */}
      <div className="px-4 space-y-3">
        {[
          { title: "Stock Market Hits Record High", source: "Finance Daily", time: "2h ago" },
          { title: "New Health Guidelines Released", source: "Health News", time: "4h ago" },
          { title: "Sports Team Wins Championship", source: "Sports Weekly", time: "6h ago" },
        ].map((article, i) => (
          <div key={i} className="flex gap-3 p-3 bg-card rounded-xl border border-border">
            <div className="w-20 h-20 bg-muted rounded-lg shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-xs line-clamp-2">{article.title}</h3>
              <p className="text-[10px] text-muted-foreground mt-1">{article.source}</p>
              <p className="text-[10px] text-muted-foreground">{article.time}</p>
            </div>
            <Bookmark className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Entertainment Preview
function EntertainmentPreview() {
  return (
    <div className="h-full overflow-y-auto pb-16">
      {/* Header */}
      <div className="px-4 py-3">
        <h1 className="font-bold text-lg">🎬 StreamHub</h1>
      </div>

      {/* Continue Watching */}
      <div className="px-4 mb-4">
        <h2 className="text-sm font-semibold mb-3">Continue Watching</h2>
        <div className="flex gap-3 overflow-x-auto">
          {["🎭", "🎪", "🎯"].map((icon, i) => (
            <div key={i} className="relative w-32 shrink-0">
              <div className="h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-2xl">{icon}</div>
              <div className="h-1 bg-muted rounded-full mt-2">
                <div className="h-full bg-primary rounded-full" style={{ width: `${30 + i * 25}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="px-4">
        <h2 className="text-sm font-semibold mb-3">Trending Now</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "The Adventure", rating: "8.5" },
            { title: "Mystery Night", rating: "9.1" },
            { title: "Comedy Hour", rating: "7.8" },
            { title: "Drama Series", rating: "8.9" },
          ].map((movie, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="h-28 bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <Play className="w-10 h-10 text-white/80" />
              </div>
              <div className="p-2">
                <h3 className="font-medium text-xs truncate">{movie.title}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-[10px]">{movie.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Travel Preview
function TravelPreview() {
  return (
    <div className="h-full overflow-y-auto pb-16">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500">
        <h1 className="text-white font-bold text-lg">✈️ TravelGo</h1>
        <p className="text-white/80 text-xs">Find your next adventure</p>
      </div>

      {/* Search */}
      <div className="p-4 -mt-2">
        <div className="bg-card rounded-2xl border border-border p-4 shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 bg-muted rounded-xl">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs">Where to?</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 p-2 bg-muted rounded-xl text-xs text-center">Check-in</div>
              <div className="flex-1 p-2 bg-muted rounded-xl text-xs text-center">Check-out</div>
            </div>
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="px-4">
        <h2 className="text-sm font-semibold mb-3">Popular Destinations</h2>
        <div className="flex gap-3 overflow-x-auto">
          {[
            { name: "Paris", emoji: "🗼" },
            { name: "Tokyo", emoji: "🏯" },
            { name: "Bali", emoji: "🏝" },
          ].map((dest) => (
            <div key={dest.name} className="shrink-0 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center text-2xl mb-1">
                {dest.emoji}
              </div>
              <span className="text-xs font-medium">{dest.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deals */}
      <div className="px-4 mt-4">
        <h2 className="text-sm font-semibold mb-3">Hot Deals</h2>
        {[
          { place: "Maldives Resort", price: "$299/night", rating: 4.9 },
          { place: "Swiss Alps Cabin", price: "$189/night", rating: 4.7 },
        ].map((deal, i) => (
          <div key={i} className="flex gap-3 p-3 bg-card rounded-xl border border-border mb-2">
            <div className="w-16 h-16 bg-muted rounded-lg" />
            <div className="flex-1">
              <h3 className="font-semibold text-xs">{deal.place}</h3>
              <p className="text-primary font-bold text-sm">{deal.price}</p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-[10px]">{deal.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Generic Preview
function GenericPreview({ appName }: { appName: string }) {
  return (
    <div className="h-full overflow-y-auto pb-16">
      <div className="px-4 py-3 border-b border-border">
        <h1 className="font-bold text-lg">{appName}</h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
          <span className="text-4xl">🚀</span>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-card rounded-xl border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Bottom Navigation
function BottomNavigation({ appType }: { appType: string }) {
  const getNavItems = () => {
    switch (appType) {
      case "cricket":
        return [
          { icon: Home, label: "Home" },
          { icon: Trophy, label: "Matches" },
          { icon: TrendingUp, label: "Stats" },
          { icon: User, label: "Profile" },
        ];
      case "food":
        return [
          { icon: Home, label: "Home" },
          { icon: Search, label: "Search" },
          { icon: ShoppingCart, label: "Cart" },
          { icon: User, label: "Profile" },
        ];
      case "social":
        return [
          { icon: Home, label: "Home" },
          { icon: Search, label: "Search" },
          { icon: Heart, label: "Activity" },
          { icon: User, label: "Profile" },
        ];
      default:
        return [
          { icon: Home, label: "Home" },
          { icon: Search, label: "Search" },
          { icon: Bell, label: "Alerts" },
          { icon: User, label: "Profile" },
        ];
    }
  };

  const items = getNavItems();

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around py-2 px-4 bg-card/95 backdrop-blur-lg border-t border-border">
      {items.map((item, i) => (
        <div key={item.label} className={cn(
          "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors",
          i === 0 ? "text-primary" : "text-muted-foreground"
        )}>
          <item.icon className="w-5 h-5" />
          <span className="text-[10px]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default LivePreviewRenderer;