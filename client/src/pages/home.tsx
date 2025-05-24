import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Header } from "../components/header";
import { UrlInputSection } from "../components/url-input-section";
import { ResultsTabs } from "../components/results-tabs";
import { scrapingApi } from "../lib/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Globe } from "lucide-react";
import { ScrapingJob, ScrapingResults } from "../types/scraping";

export default function Home() {
  const [currentJob, setCurrentJob] = useState<ScrapingJob | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const { toast } = useToast();

  // Poll for job updates
  const { data: jobData } = useQuery({
    queryKey: ['/api/scrape', currentJob?.id],
    enabled: !!currentJob && isPolling,
    refetchInterval: 2000,
  });

  // Update current job when polling data changes
  useEffect(() => {
    if (jobData) {
      setCurrentJob(jobData);
      if (jobData.status === 'completed' || jobData.status === 'failed') {
        setIsPolling(false);
      }
    }
  }, [jobData]);

  // Start scraping mutation
  const startScrapingMutation = useMutation({
    mutationFn: scrapingApi.startScraping,
    onSuccess: (job) => {
      setCurrentJob(job);
      setIsPolling(true);
      toast({
        title: "Analysis Started",
        description: "Website scraping and analysis has begun.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to start analysis",
        variant: "destructive",
      });
    },
  });

  const handleStartScraping = (url: string) => {
    startScrapingMutation.mutate(url);
  };

  const handleExport = () => {
    if (currentJob?.results) {
      const dataStr = JSON.stringify(currentJob.results, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `website-analysis-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast({
        title: "Export Complete",
        description: "Analysis data has been downloaded as JSON.",
      });
    } else {
      toast({
        title: "No Data to Export",
        description: "Please complete an analysis first.",
        variant: "destructive",
      });
    }
  };

  const getProgressValue = () => {
    if (!currentJob) return 0;
    switch (currentJob.status) {
      case 'pending': return 10;
      case 'processing': return 60;
      case 'completed': return 100;
      case 'failed': return 0;
      default: return 0;
    }
  };

  const getProgressText = () => {
    if (!currentJob) return "Analyzing website...";
    switch (currentJob.status) {
      case 'pending': return "Starting analysis...";
      case 'processing': return "Scraping pages and generating AI summaries...";
      case 'completed': return "Analysis complete!";
      case 'failed': return "Analysis failed";
      default: return "Analyzing website...";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UrlInputSection
          onStartScraping={handleStartScraping}
          onExport={handleExport}
          isAnalyzing={isPolling || startScrapingMutation.isPending}
          progress={getProgressValue()}
          progressText={getProgressText()}
        />

        {/* Error State */}
        {currentJob?.status === 'failed' && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              Analysis failed: {currentJob.error || "Unknown error occurred"}. Please check the URL and try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {currentJob?.results && currentJob.status === 'completed' && (
          <ResultsTabs 
            results={currentJob.results as ScrapingResults} 
            onExport={handleExport}
          />
        )}

        {/* Empty State */}
        {!currentJob && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to Analyze</h3>
            <p className="text-slate-600">Enter a website URL above to begin comprehensive analysis with AI-powered insights.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                <Globe className="text-white text-sm w-4 h-4" />
              </div>
              <span className="text-slate-600 text-sm">&copy; 2024 WebScout. Built with React, Gemini AI & Express.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-700 transition-colors">API Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
