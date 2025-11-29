import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Copy, 
  Download, 
  ExternalLink, 
  Smartphone, 
  Server, 
  Database,
  Check,
  FileCode,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { GeneratedApp } from '@/services/generator';

interface CodeTabsProps {
  generatedApp: GeneratedApp | null;
  appName: string;
  isGenerating: boolean;
  onDownload: (type: 'frontend' | 'backend' | 'database' | 'all') => void;
}

export function CodeTabs({ generatedApp, appName, isGenerating, onDownload }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState('preview');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (code: string, type: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(type);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleOpenExpoSnack = () => {
    if (!generatedApp) return;
    
    // Create Expo Snack URL with the code
    const snackUrl = `https://snack.expo.dev/?name=${encodeURIComponent(appName || 'MyApp')}&platform=ios`;
    window.open(snackUrl, '_blank');
    toast.info('Opening Expo Snack - paste the generated code to preview');
  };

  if (!generatedApp && !isGenerating) {
    return null;
  }

  return (
    <div className="border-t border-border/50 bg-card/50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="preview" className="gap-2 data-[state=active]:bg-background">
              <Smartphone className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="react-native" 
              className="gap-2 data-[state=active]:bg-background"
              disabled={!generatedApp}
            >
              <FileCode className="w-4 h-4" />
              React Native
            </TabsTrigger>
            <TabsTrigger 
              value="backend" 
              className="gap-2 data-[state=active]:bg-background"
              disabled={!generatedApp}
            >
              <Server className="w-4 h-4" />
              Backend
            </TabsTrigger>
            <TabsTrigger 
              value="database" 
              className="gap-2 data-[state=active]:bg-background"
              disabled={!generatedApp}
            >
              <Database className="w-4 h-4" />
              Database
            </TabsTrigger>
          </TabsList>

          {generatedApp && activeTab !== 'preview' && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => {
                  const code = activeTab === 'react-native' 
                    ? generatedApp.reactNativeCode 
                    : activeTab === 'backend' 
                    ? generatedApp.backendCode 
                    : generatedApp.databaseSchema;
                  handleCopy(code, activeTab);
                }}
              >
                {copied === activeTab ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => onDownload(activeTab as 'frontend' | 'backend' | 'database')}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              {activeTab === 'react-native' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleOpenExpoSnack}
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Expo
                </Button>
              )}
            </div>
          )}
        </div>

        <TabsContent value="preview" className="m-0 p-0">
          {/* Preview content is handled in parent */}
        </TabsContent>

        <TabsContent value="react-native" className="m-0">
          {generatedApp ? (
            <ScrollArea className="h-[400px]">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>{generatedApp.files.filter(f => f.type !== 'backend').length} files generated</span>
                </div>
                <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto font-mono text-foreground">
                  {generatedApp.reactNativeCode}
                </pre>
              </div>
            </ScrollArea>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Generate your app to see the code
            </div>
          )}
        </TabsContent>

        <TabsContent value="backend" className="m-0">
          {generatedApp ? (
            <ScrollArea className="h-[400px]">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Server className="w-4 h-4" />
                  <span>{generatedApp.files.filter(f => f.type === 'backend').length} backend files</span>
                </div>
                <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto font-mono text-foreground">
                  {generatedApp.backendCode}
                </pre>
              </div>
            </ScrollArea>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Generate your app to see the backend code
            </div>
          )}
        </TabsContent>

        <TabsContent value="database" className="m-0">
          {generatedApp ? (
            <ScrollArea className="h-[400px]">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Database className="w-4 h-4" />
                  <span>PostgreSQL Schema</span>
                </div>
                <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto font-mono text-foreground">
                  {generatedApp.databaseSchema}
                </pre>
              </div>
            </ScrollArea>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Generate your app to see the database schema
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
