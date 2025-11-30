import { useState, useEffect, useMemo } from "react";
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
  MoreVertical,
  LogOut,
  Settings,
  User,
  CreditCard,
  Loader2,
  Apple,
  Play,
  FileUp,
  ExternalLink,
  Trash2,
  Code,
  Server,
  Package,
  Check,
  Sparkles,
  RefreshCw,
  Search,
  Grid3X3,
  List,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Zap,
  TrendingUp,
  Calendar,
  Bell,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Project, 
  getAppTypeLabel, 
  getAppTypeIcon,
  getBuildStatus,
  downloadReactNativeCode,
  downloadBackendCode,
  downloadCompletePackage,
  deleteProject,
} from "@/services/projects";

const FEATURE_LABELS: Record<string, string> = {
  login: 'Auth',
  payment: 'Payment',
  maps: 'Maps',
  notifications: 'Push',
  chat: 'Chat',
  search: 'Search',
  favorites: 'Wishlist',
  reviews: 'Reviews',
  analytics: 'Analytics',
  'social-share': 'Share',
};

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'name' | 'status';
type FilterStatus = 'all' | 'completed' | 'building' | 'failed';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { balance, isLoading: creditsLoading } = useCredits();
  const { projects, completedProjects, buildingProjects, isLoading: projectsLoading, refetch } = useProjects();
  
  // UI State
  const [figmaDialogOpen, setFigmaDialogOpen] = useState(false);
  const [figmaUrl, setFigmaUrl] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filter & View State
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // Mock recent activity
  const recentActivity = useMemo(() => [
    { id: 1, action: 'created', project: 'FoodieGo', time: '2 hours ago', icon: '🚀' },
    { id: 2, action: 'completed', project: 'ShopNow', time: '5 hours ago', icon: '✅' },
    { id: 3, action: 'downloaded', project: 'FitTrack', time: 'Yesterday', icon: '📥' },
  ], []);

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];
    
    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(p => p.status === filterStatus);
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        getAppTypeLabel(p.appType).toLowerCase().includes(query)
      );
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          const statusOrder = { completed: 0, building: 1, draft: 2, failed: 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });
    
    return result;
  }, [projects, filterStatus, searchQuery, sortBy]);

  // Poll building projects
  useEffect(() => {
    if (buildingProjects.length === 0) return;

    const pollInterval = setInterval(async () => {
      for (const project of buildingProjects) {
        try {
          const status = await getBuildStatus(project.id);
          if (status.status === 'completed' || status.status === 'failed') {
            refetch();
          }
        } catch (error) {
          console.error('Failed to poll status:', error);
        }
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [buildingProjects, refetch]);

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

  const handleDownloadReactNative = async (project: Project) => {
    try {
      toast.info(`Preparing React Native code...`);
      const url = await downloadReactNativeCode(project.id);
      window.open(url, '_blank');
    } catch (error) {
      const content = `// ${project.name} - React Native Code\n// Generated by AppDev`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}-react-native.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Downloaded!');
    }
  };

  const handleDownloadBackend = async (project: Project) => {
    try {
      toast.info(`Preparing backend code...`);
      const url = await downloadBackendCode(project.id);
      window.open(url, '_blank');
    } catch (error) {
      const content = `// ${project.name} - Backend Code\n// Generated by AppDev`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}-backend.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Downloaded!');
    }
  };

  const handleDownloadComplete = async (project: Project) => {
    try {
      const url = await downloadCompletePackage(project.id);
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Download not available yet');
    }
  };

  const handleOpenExpoSnack = (project: Project) => {
    if (project.snackUrl) {
      window.open(project.snackUrl, '_blank');
    } else {
      window.open(`https://snack.expo.dev/?name=${encodeURIComponent(project.name)}&platform=ios`, '_blank');
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteProject(projectToDelete.id);
      toast.success(`${projectToDelete.name} deleted`);
      refetch();
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getStatusBadge = (project: Project) => {
    const config: Record<string, { class: string; label: string }> = {
      completed: { class: "bg-green-500/10 text-green-500 border-green-500/30", label: "Ready" },
      building: { class: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30", label: `${project.progress || 0}%` },
      draft: { class: "bg-muted text-muted-foreground border-border", label: "Draft" },
      failed: { class: "bg-red-500/10 text-red-500 border-red-500/30", label: "Failed" },
    };
    const { class: className, label } = config[project.status] || config.draft;
    
    return (
      <Badge variant="outline" className={`${className} gap-1`}>
        {project.status === 'building' && <Loader2 className="w-3 h-3 animate-spin" />}
        {project.status === 'completed' && <Check className="w-3 h-3" />}
        {label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Skeleton loader
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-5 rounded-xl border border-border bg-card/30">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 animate-bounce-in">
        <Sparkles className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">No apps yet</h3>
      <p className="text-muted-foreground mb-8 max-w-md">
        Start building your first mobile app with AI. Just describe your idea and we'll generate production-ready code.
      </p>
      <Button variant="gradient" size="lg" onClick={() => navigate("/builder")} className="gap-2 animate-pulse-glow">
        <Zap className="w-5 h-5" />
        Create Your First App
      </Button>
    </div>
  );

  // Project card for grid view
  const renderProjectCard = (project: Project) => (
    <div
      key={project.id}
      className="group relative p-5 rounded-xl border border-border bg-card/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-fade-in cursor-pointer"
      onClick={() => navigate(`/builder?project=${project.id}`)}
    >
      {/* Status indicator */}
      {project.status === 'building' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
            style={{ width: `${project.progress || 50}%` }}
          />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${project.theme.primary}20` }}
          >
            {getAppTypeIcon(project.appType)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground">{getAppTypeLabel(project.appType)}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/builder?project=${project.id}`); }}>
              Open in Builder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); setProjectToDelete(project); setDeleteDialogOpen(true); }} 
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
      
      {/* Theme & Features */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex -space-x-1">
          {[project.theme.primary, project.theme.secondary, project.theme.accent].map((color, i) => (
            <div 
              key={i}
              className="w-4 h-4 rounded-full border-2 border-background" 
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {project.features.slice(0, 3).map((feature) => (
            <span key={feature} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {FEATURE_LABELS[feature] || feature}
            </span>
          ))}
          {project.features.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              +{project.features.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        {getStatusBadge(project)}
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(project.createdAt)}
        </span>
      </div>

      {/* Building progress */}
      {project.status === "building" && (
        <div className="mb-4">
          <p className="text-xs text-yellow-500 mb-1 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            {project.currentStep || 'Building...'}
          </p>
        </div>
      )}

      {/* Quick actions for completed */}
      {project.status === "completed" && (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => handleDownloadReactNative(project)}>
            <Code className="w-3 h-3 mr-1" />
            Code
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => handleOpenExpoSnack(project)}>
            <ExternalLink className="w-3 h-3 mr-1" />
            Preview
          </Button>
          <Button variant="gradient" size="sm" className="h-8 text-xs px-2" onClick={() => handleDownloadComplete(project)}>
            <Package className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Failed state */}
      {project.status === "failed" && (
        <Button variant="outline" size="sm" className="w-full h-8 text-xs border-red-500/30 text-red-500" onClick={(e) => { e.stopPropagation(); navigate(`/builder?project=${project.id}`); }}>
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry Build
        </Button>
      )}
    </div>
  );

  // Project row for list view
  const renderProjectRow = (project: Project) => (
    <div
      key={project.id}
      className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50 hover:border-primary/50 hover:bg-card transition-all cursor-pointer animate-fade-in"
      onClick={() => navigate(`/builder?project=${project.id}`)}
    >
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
        style={{ backgroundColor: `${project.theme.primary}20` }}
      >
        {getAppTypeIcon(project.appType)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground truncate">{project.name}</h3>
          {getStatusBadge(project)}
        </div>
        <p className="text-sm text-muted-foreground truncate">{project.description}</p>
      </div>
      
      <div className="hidden sm:flex items-center gap-1">
        {[project.theme.primary, project.theme.secondary, project.theme.accent].map((color, i) => (
          <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        ))}
      </div>
      
      <span className="hidden md:block text-xs text-muted-foreground whitespace-nowrap">
        {formatDate(project.createdAt)}
      </span>
      
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        {project.status === 'completed' && (
          <>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownloadReactNative(project)}>
              <Code className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenExpoSnack(project)}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </>
        )}
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" />
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/pricing")} className="gap-2 hidden sm:flex">
              <CreditCard className="w-4 h-4" />
              {creditsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="font-semibold">{balance}</span>}
              <span className="text-muted-foreground">credits</span>
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
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
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="w-4 h-4 mr-2" />Profile</DropdownMenuItem>
                <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/pricing")}><CreditCard className="w-4 h-4 mr-2" />Buy Credits</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive"><LogOut className="w-4 h-4 mr-2" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Welcome & Quick Actions */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="text-muted-foreground">Manage and monitor your mobile applications</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setFigmaDialogOpen(true)} className="gap-2">
              <FileUp className="w-4 h-4" />
              Import Figma
            </Button>
            <Button variant="gradient" onClick={() => navigate("/builder")} className="gap-2 shadow-lg shadow-primary/25">
              <Plus className="w-4 h-4" />
              New App
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{projectsLoading ? '-' : projects.length}</p>
            <p className="text-sm text-muted-foreground">Total Apps</p>
          </div>
          
          <div className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-xs text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">Live</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{projectsLoading ? '-' : completedProjects.length}</p>
            <p className="text-sm text-muted-foreground">Ready</p>
          </div>
          
          <div className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              {buildingProjects.length > 0 && <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />}
            </div>
            <p className="text-2xl font-bold text-foreground">{projectsLoading ? '-' : buildingProjects.length}</p>
            <p className="text-sm text-muted-foreground">Building</p>
          </div>
          
          <div className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{creditsLoading ? '-' : balance}</p>
            <p className="text-sm text-muted-foreground">Credits</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card/50"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
                  <TabsList className="h-9">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="completed" className="text-xs">Ready</TabsTrigger>
                    <TabsTrigger value="building" className="text-xs">Building</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ArrowUpDown className="w-3 h-3" />
                      <span className="hidden sm:inline">Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('newest')}>Newest first</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('oldest')}>Oldest first</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('name')}>Name A-Z</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('status')}>By status</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button variant="ghost" size="icon" onClick={() => refetch()} className="h-9 w-9">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Projects */}
            {projectsLoading ? (
              renderSkeleton()
            ) : filteredProjects.length === 0 ? (
              projects.length === 0 ? renderEmptyState() : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No apps found matching "{searchQuery}"</p>
                  <Button variant="ghost" onClick={() => { setSearchQuery(""); setFilterStatus("all"); }} className="mt-2">
                    Clear filters
                  </Button>
                </div>
              )
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProjects.map(renderProjectCard)}
                
                {/* Create new card */}
                <button
                  onClick={() => navigate("/builder")}
                  className="p-5 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-3 min-h-[200px] transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Create New App</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProjects.map(renderProjectRow)}
              </div>
            )}
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-20">
              <div className="p-4 rounded-xl border border-border bg-card/50">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 group cursor-pointer">
                      <span className="text-lg">{activity.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          <span className="capitalize">{activity.action}</span>{" "}
                          <span className="font-medium text-primary">{activity.project}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Tips */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 mt-4">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Pro Tip
                </h4>
                <p className="text-sm text-muted-foreground">
                  Use detailed prompts with specific features for better app generation results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Figma Dialog */}
      <Dialog open={figmaDialogOpen} onOpenChange={setFigmaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import from Figma</DialogTitle>
            <DialogDescription>Paste your Figma file URL to convert designs into a mobile app.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="figma-url">Figma File URL</Label>
              <Input id="figma-url" placeholder="https://www.figma.com/file/..." value={figmaUrl} onChange={(e) => setFigmaUrl(e.target.value)} />
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Coming Soon!</span> Figma import is under development.
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFigmaDialogOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleFigmaImport}>Import</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {projectToDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete your app and all code. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;