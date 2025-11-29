import { useState } from "react";
import { 
  Smartphone, 
  LayoutTemplate, 
  Settings, 
  CreditCard, 
  History, 
  HelpCircle,
  ChevronLeft,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "create", icon: Sparkles, label: "Create App" },
    { id: "templates", icon: LayoutTemplate, label: "Templates" },
    { id: "projects", icon: Smartphone, label: "My Projects" },
    { id: "history", icon: History, label: "History" },
  ];

  const bottomItems = [
    { id: "credits", icon: CreditCard, label: "Credits" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "help", icon: HelpCircle, label: "Help" },
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-5 h-5 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-foreground">AppDev</h1>
            <p className="text-xs text-muted-foreground">AI App Builder</p>
          </div>
        )}
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              activeSection === item.id
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5 flex-shrink-0", activeSection === item.id && "text-primary")} />
            {!isCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 space-y-1 border-t border-sidebar-border">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              activeSection === item.id
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft
          className={cn(
            "w-5 h-5 transition-transform duration-300",
            isCollapsed && "rotate-180"
          )}
        />
      </button>
    </aside>
  );
};

export default Sidebar;
