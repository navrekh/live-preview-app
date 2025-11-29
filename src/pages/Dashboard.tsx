import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Plus,
  FolderOpen,
  Clock,
  Download,
  MoreVertical,
  LogOut,
  Settings,
  User,
  CreditCard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "completed" | "building" | "draft";
  createdAt: string;
  thumbnail: string;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Salon Booking App",
    description: "A complete salon appointment booking system",
    status: "completed",
    createdAt: "2 days ago",
    thumbnail: "💇",
  },
  {
    id: "2",
    name: "Food Delivery",
    description: "Restaurant ordering and delivery tracking",
    status: "completed",
    createdAt: "1 week ago",
    thumbnail: "🍕",
  },
  {
    id: "3",
    name: "Fitness Tracker",
    description: "Workout logging and progress tracking",
    status: "building",
    createdAt: "Just now",
    thumbnail: "💪",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects] = useState<Project[]>(mockProjects);

  const handleSignOut = () => {
    toast.success("Signed out successfully");
    navigate("/signin");
  };

  const getStatusBadge = (status: Project["status"]) => {
    const styles = {
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      building: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      draft: "bg-muted text-muted-foreground border-border",
    };
    const labels = {
      completed: "Completed",
      building: "Building...",
      draft: "Draft",
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">AppDev</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
              <CreditCard className="w-4 h-4" />
              <span className="font-medium">250 Credits</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                    JD
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="font-medium text-foreground">John Doe</p>
                  <p className="text-sm text-muted-foreground">john@example.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, John</h1>
            <p className="text-muted-foreground">Manage your mobile app projects</p>
          </div>
          <Button variant="gradient" onClick={() => navigate("/")} className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl border border-border bg-card/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {projects.filter((p) => p.status === "completed").length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {projects.filter((p) => p.status === "building").length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group p-5 rounded-xl border border-border bg-card/30 hover:border-primary/50 hover:bg-card/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                    {project.thumbnail}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Open</DropdownMenuItem>
                      <DropdownMenuItem>Download APK</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{project.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                <div className="flex items-center justify-between">
                  {getStatusBadge(project.status)}
                  <span className="text-xs text-muted-foreground">{project.createdAt}</span>
                </div>
              </div>
            ))}

            {/* New project card */}
            <button
              onClick={() => navigate("/")}
              className="p-5 rounded-xl border border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-3 min-h-[180px] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Create New Project</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
