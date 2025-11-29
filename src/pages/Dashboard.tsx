import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import { useProjects } from "@/hooks/useProjects";
import {
  Plus,
  FolderOpen,
  Clock,
  Download,
  MoreVertical,
  LogOut,
  Settings,
  User,
  CreditCard,
  Loader2,
  Apple,
  Play,
  Rocket,
  FileUp,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { balance, isLoading: creditsLoading } = useCredits();
  const { projects, completedProjects, buildingProjects, isLoading: projectsLoading } = useProjects();
  const [figmaDialogOpen, setFigmaDialogOpen] = useState(false);
  const [figmaUrl, setFigmaUrl] = useState("");

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/signin");
  };

  const handleFigmaImport = () => {
    if (!figmaUrl.trim()) {
      toast.error("Please enter a Figma URL");
      return;
    }
    toast.info("Figma import feature coming soon!");
    setFigmaDialogOpen(false);
    setFigmaUrl("");
  };

  const handleDownloadAPK = (projectId: string, projectName: string) => {
    toast.success(`Downloading APK for ${projectName}...`);
    // TODO: Call downloadApk(projectId) from projects service
  };

  const handleDownloadIPA = (projectId: string, projectName: string) => {
    toast.success(`Downloading IPA for ${projectName}...`);
    // TODO: Call downloadIpa(projectId) from projects service
  };

  const handlePublishPlayStore = (projectId: string, projectName: string) => {
    toast.info(`Publishing ${projectName} to Play Store...`);
    // TODO: Call publishToPlayStore(projectId) from projects service
  };

  const handlePublishAppStore = (projectId: string, projectName: string) => {
    toast.info(`Publishing ${projectName} to App Store...`);
    // TODO: Call publishToAppStore(projectId) from projects service
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      building: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      draft: "bg-muted text-muted-foreground border-border",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    const labels: Record<string, string> = {
      completed: "Ready",
      building: "Building...",
      draft: "Draft",
      failed: "Failed",
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full border ${styles[status] || styles.draft}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" />
          </Link>

          <div className="flex items-center gap-4">
            {/* Credits Display */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/pricing")}
              className="gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {creditsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="font-medium">{balance} Credits</span>
              )}
            </Button>

            {/* Import Figma */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFigmaDialogOpen(true)}
              className="gap-2"
            >
              <FileUp className="w-4 h-4" />
              <span className="hidden sm:inline">Import Figma</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                    {getUserInitials()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="font-medium text-foreground">{user?.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</p>
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
                <DropdownMenuItem onClick={() => navigate("/pricing")}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Buy Credits
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
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-muted-foreground">Manage your mobile app projects</p>
          </div>
          <Button variant="gradient" onClick={() => navigate("/builder")} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New App
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
                {projectsLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                )}
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
                {projectsLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{completedProjects.length}</p>
                )}
                <p className="text-sm text-muted-foreground">Ready to Download</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                {projectsLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{buildingProjects.length}</p>
                )}
                <p className="text-sm text-muted-foreground">Building</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Apps</h2>
          
          {projectsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group p-5 rounded-xl border border-border bg-card/30 hover:border-primary/50 hover:bg-card/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                      📱
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
                        <DropdownMenuItem onClick={() => navigate(`/builder?project=${project.id}`)}>
                          Open in Builder
                        </DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-semibold text-foreground mb-1">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    {getStatusBadge(project.status)}
                    <span className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Building progress */}
                  {project.status === "building" && (
                    <div className="mb-4">
                      <Progress value={50} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Building your app...</p>
                    </div>
                  )}

                  {/* Action buttons for completed projects */}
                  {project.status === "completed" && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-1"
                          onClick={() => handleDownloadAPK(project.id, project.name)}
                        >
                          <Download className="w-3 h-3" />
                          APK
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-1"
                          onClick={() => handleDownloadIPA(project.id, project.name)}
                        >
                          <Apple className="w-3 h-3" />
                          IPA
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-1 text-xs"
                          onClick={() => handlePublishPlayStore(project.id, project.name)}
                        >
                          <Play className="w-3 h-3" />
                          Play Store
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-1 text-xs"
                          onClick={() => handlePublishAppStore(project.id, project.name)}
                        >
                          <Rocket className="w-3 h-3" />
                          App Store
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* New project card */}
              <button
                onClick={() => navigate("/builder")}
                className="p-5 rounded-xl border border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-3 min-h-[180px] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Create New App</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Figma Import Dialog */}
      <Dialog open={figmaDialogOpen} onOpenChange={setFigmaDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import from Figma</DialogTitle>
            <DialogDescription>
              Paste your Figma file URL to import designs and convert them into a mobile app.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="figma-url">Figma File URL</Label>
              <Input
                id="figma-url"
                placeholder="https://www.figma.com/file/..."
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
              />
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Coming Soon!</span> Figma import is currently under development. You'll be able to convert your Figma designs directly into functional mobile apps.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFigmaDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleFigmaImport}>
              Import
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
