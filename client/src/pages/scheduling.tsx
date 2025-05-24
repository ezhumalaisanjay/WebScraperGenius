import { SchedulingSection } from "@/components/scheduling-section";
import { Header } from "@/components/header";

export default function Scheduling() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <SchedulingSection />
      </main>
    </div>
  );
}