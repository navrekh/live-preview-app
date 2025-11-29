import { useState } from "react";
import { User, Home, Search, ShoppingCart, Menu } from "lucide-react";

interface PreviewScreenProps {
  template?: string;
}

const PreviewScreen = ({ template = "ecommerce" }: PreviewScreenProps) => {
  const [activeTab, setActiveTab] = useState("home");

  if (template === "empty") {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your app preview will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-phone-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
        <Menu className="w-5 h-5 text-foreground/70" />
        <h1 className="text-sm font-semibold text-foreground">ShopApp</h1>
        <div className="relative">
          <ShoppingCart className="w-5 h-5 text-foreground/70" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] font-bold flex items-center justify-center text-primary-foreground">
            3
          </span>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 rounded-xl">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Search products...</span>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto px-4 pb-4 space-y-4">
        {/* Featured banner */}
        <div className="relative h-28 rounded-2xl bg-gradient-primary overflow-hidden">
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <span className="text-[10px] font-medium text-primary-foreground/80 uppercase tracking-wider">
              New Collection
            </span>
            <h2 className="text-lg font-bold text-primary-foreground">Summer Sale</h2>
            <span className="text-xs text-primary-foreground/90">Up to 50% off</span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-foreground">Categories</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["All", "Clothing", "Shoes", "Accessories"].map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors ${
                  cat === "All"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-card border border-border/30 overflow-hidden"
            >
              <div className="h-20 bg-gradient-to-br from-muted to-muted/50" />
              <div className="p-2.5 space-y-1">
                <p className="text-[10px] text-muted-foreground">Brand</p>
                <p className="text-xs font-medium text-foreground truncate">
                  Product Name
                </p>
                <p className="text-xs font-bold text-primary">$99.00</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-around py-2 border-t border-border/20 bg-card/80 backdrop-blur-sm">
        {[
          { id: "home", icon: Home, label: "Home" },
          { id: "search", icon: Search, label: "Search" },
          { id: "cart", icon: ShoppingCart, label: "Cart" },
          { id: "profile", icon: User, label: "Profile" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[9px]">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PreviewScreen;
