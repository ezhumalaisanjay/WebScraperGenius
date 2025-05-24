import { useState } from "react";
import { Globe, Search, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface UrlInputSectionProps {
  onStartScraping: (url: string) => void;
  onExport: () => void;
  isAnalyzing: boolean;
  progress?: number;
  progressText?: string;
}

export function UrlInputSection({ 
  onStartScraping, 
  onExport, 
  isAnalyzing, 
  progress = 0, 
  progressText = "Analyzing website..." 
}: UrlInputSectionProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid website URL",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    onStartScraping(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Website Analysis</h2>
        <p className="text-slate-600">Enter a website URL to scrape and analyze its content with AI-powered insights</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="url-input" className="block text-sm font-medium text-slate-700 mb-2">
            Website URL
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 py-3 font-mono text-sm"
              disabled={isAnalyzing}
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
          <Button
            type="submit"
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 min-w-[140px]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onExport}
            className="px-6 py-3 min-w-[140px]"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </form>

      {isAnalyzing && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-blue-800 font-medium">Analyzing website...</span>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-blue-700">{progressText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
