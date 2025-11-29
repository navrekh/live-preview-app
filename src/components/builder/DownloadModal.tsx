import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileCode, 
  Server, 
  Database, 
  Package,
  ExternalLink,
  Check,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { GeneratedApp } from '@/services/generator';

interface DownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedApp: GeneratedApp | null;
  appName: string;
}

type DownloadType = 'frontend' | 'backend' | 'database' | 'all';

export function DownloadModal({ open, onOpenChange, generatedApp, appName }: DownloadModalProps) {
  const [downloading, setDownloading] = useState<DownloadType | null>(null);

  const handleDownload = async (type: DownloadType) => {
    if (!generatedApp) return;
    
    setDownloading(type);
    
    // Simulate download preparation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let content = '';
    let filename = '';
    
    switch (type) {
      case 'frontend':
        content = generatedApp.reactNativeCode;
        filename = `${appName || 'app'}-react-native.txt`;
        break;
      case 'backend':
        content = generatedApp.backendCode;
        filename = `${appName || 'app'}-backend.txt`;
        break;
      case 'database':
        content = generatedApp.databaseSchema;
        filename = `${appName || 'app'}-database.sql`;
        break;
      case 'all':
        content = `// ==========================================
// ${appName || 'App'} - Complete Code Package
// ==========================================

// ==========================================
// REACT NATIVE CODE
// ==========================================

${generatedApp.reactNativeCode}

// ==========================================
// BACKEND CODE (Node.js)
// ==========================================

${generatedApp.backendCode}

// ==========================================
// DATABASE SCHEMA (PostgreSQL)
// ==========================================

${generatedApp.databaseSchema}
`;
        filename = `${appName || 'app'}-complete.txt`;
        break;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloading(null);
    toast.success(`${type === 'all' ? 'Complete package' : type} downloaded!`);
  };

  const handleOpenExpoSnack = () => {
    const snackUrl = `https://snack.expo.dev/?name=${encodeURIComponent(appName || 'MyApp')}&platform=ios`;
    window.open(snackUrl, '_blank');
    toast.info('Opening Expo Snack - paste the generated code to preview');
  };

  const downloadOptions = [
    {
      type: 'frontend' as DownloadType,
      icon: FileCode,
      title: 'React Native Code',
      description: 'Download the mobile app source code',
      files: generatedApp?.files.filter(f => f.type !== 'backend').length || 0,
    },
    {
      type: 'backend' as DownloadType,
      icon: Server,
      title: 'Backend Code',
      description: 'Node.js + Express API server',
      files: generatedApp?.files.filter(f => f.type === 'backend').length || 0,
    },
    {
      type: 'database' as DownloadType,
      icon: Database,
      title: 'Database Schema',
      description: 'PostgreSQL tables and migrations',
      files: 1,
    },
    {
      type: 'all' as DownloadType,
      icon: Package,
      title: 'Complete Package',
      description: 'Everything bundled together',
      files: generatedApp?.files.length || 0,
      highlight: true,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Your App</DialogTitle>
          <DialogDescription>
            Choose what you want to download
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {downloadOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => handleDownload(option.type)}
              disabled={downloading !== null}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-colors text-left ${
                option.highlight 
                  ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <div className={`p-2 rounded-lg ${option.highlight ? 'bg-primary/10' : 'bg-muted'}`}>
                <option.icon className={`w-5 h-5 ${option.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{option.title}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{option.files} files</p>
              </div>
              {downloading === option.type ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : (
                <Download className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleOpenExpoSnack}
          >
            <ExternalLink className="w-4 h-4" />
            Open in Expo Snack
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Test your app instantly in the browser
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
