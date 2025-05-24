import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, BarChart3 } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WebScout
              </h1>
              <p className="text-xs text-muted-foreground">Intelligence Platform</p>
            </div>
          </div>

          <nav className="flex items-center space-x-1">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"} 
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Analyze
              </Button>
            </Link>
            
            <Link href="/schedules">
              <Button 
                variant={location === "/schedules" ? "default" : "ghost"} 
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Schedules
                <Badge variant="secondary" className="ml-1 text-xs">
                  New
                </Badge>
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={() => window.open('/api/analytics', '_blank')}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}