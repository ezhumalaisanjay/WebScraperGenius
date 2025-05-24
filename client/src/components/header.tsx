import { Globe, HelpCircle, Settings } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Globe className="text-white text-lg w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">WebScout</h1>
              <p className="text-sm text-slate-500">Website Intelligence Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-slate-600 hover:text-slate-900 transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="text-slate-600 hover:text-slate-900 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
