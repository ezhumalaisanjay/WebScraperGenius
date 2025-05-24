import { useState } from "react";
import { Globe, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WebsiteTab } from "./website-tab";
import { LinkedinTab } from "./linkedin-tab";
import { ScrapingResults } from "../types/scraping";

interface ResultsTabsProps {
  results: ScrapingResults;
  onExport: () => void;
}

export function ResultsTabs({ results, onExport }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState("website");

  const websiteSectionsCount = Object.keys(results.website).filter(key => 
    results.website[key as keyof typeof results.website]
  ).length;

  const linkedinSectionsCount = Object.keys(results.linkedin).filter(key => 
    results.linkedin[key as keyof typeof results.linkedin]
  ).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <TabsList className="grid w-auto grid-cols-2">
              <TabsTrigger value="website" className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Website Summary</span>
                <Badge variant="secondary">{websiteSectionsCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                <span>LinkedIn Summary</span>
                <Badge variant="secondary">{linkedinSectionsCount}</Badge>
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" onClick={onExport} className="ml-4">
              <ExternalLink className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <TabsContent value="website" className="m-0">
          <WebsiteTab data={results.website} stats={results.stats} />
        </TabsContent>

        <TabsContent value="linkedin" className="m-0">
          <LinkedinTab data={results.linkedin} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
