import { ExternalLink, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpoPreviewProps {
  snackUrl: string;
  appName: string;
  className?: string;
}

export function ExpoPreview({ snackUrl, appName, className }: ExpoPreviewProps) {
  const previewUrl = snackUrl.includes('?') 
    ? `${snackUrl}&preview=true&platform=ios`
    : `${snackUrl}?preview=true&platform=ios`;

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Live Preview - {appName}</h3>
        </div>
        <a 
          href={snackUrl} 
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 hover:underline flex items-center gap-2 text-sm font-medium transition-colors"
        >
          Open in Expo Snack <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      <div className="relative w-full flex-1 min-h-[500px]" style={{ height: '700px' }}>
        <iframe
          src={previewUrl}
          title={`${appName} Preview`}
          className="w-full h-full border-0 rounded-xl overflow-hidden bg-background"
          allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone"
        />
      </div>
      
      <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
        <span className="text-lg">✨</span> 
        This is a live, interactive preview. You can click and test the app!
      </p>
    </div>
  );
}

export default ExpoPreview;
