import { useState } from 'react';
import { ExternalLink, Loader2, RefreshCw, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExpoPreviewProps {
  snackUrl: string | null;
  appName: string;
  isLoading?: boolean;
}

export function ExpoPreview({ snackUrl, appName, isLoading }: ExpoPreviewProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefresh = () => {
    setIframeLoaded(false);
    setIframeKey(prev => prev + 1);
  };

  const handleOpenExternal = () => {
    if (snackUrl) {
      window.open(snackUrl, '_blank');
    }
  };

  if (!snackUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted/30 rounded-xl p-8 text-center">
        <Smartphone className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-foreground mb-2">No Live Preview Available</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Generate your app to see a live interactive preview powered by Expo Snack.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/50 bg-card/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-foreground">Live Preview</span>
          <span className="text-xs text-muted-foreground">• {appName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={cn("w-4 h-4", !iframeLoaded && "animate-spin")} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenExternal}
            className="h-8 gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open in Expo</span>
          </Button>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 relative bg-background">
        {/* Loading overlay */}
        {(!iframeLoaded || isLoading) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Loading Expo Snack...</p>
            <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={snackUrl}
          className="w-full h-full border-0"
          title={`${appName} Preview`}
          onLoad={() => setIframeLoaded(true)}
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}

export default ExpoPreview;