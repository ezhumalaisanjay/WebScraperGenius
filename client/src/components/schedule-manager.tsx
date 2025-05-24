import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Clock, Play, Pause, Trash2, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Schedule {
  id: number;
  name: string;
  urls: string[];
  frequency: string;
  cronExpression?: string | null;
  isActive: boolean;
  lastRun?: string | null;
  nextRun?: string | null;
  createdAt: string;
  updatedAt: string;
  settings?: any;
}

interface ScheduleFormData {
  name: string;
  urls: string;
  frequency: string;
  cronExpression?: string;
}

export function ScheduleManager() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<ScheduleFormData>({
    name: "",
    urls: "",
    frequency: "daily",
    cronExpression: "",
  });
  const { toast } = useToast();

  const { data: schedules = [], isLoading, refetch } = useQuery<Schedule[]>({
    queryKey: ["/api/schedules"],
  });

  const createSchedule = useMutation({
    mutationFn: async (data: ScheduleFormData) => {
      const urlArray = data.urls.split('\n').filter(url => url.trim());
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          urls: urlArray,
          frequency: data.frequency,
          cronExpression: data.cronExpression || null,
        }),
      });
      if (!response.ok) throw new Error("Failed to create schedule");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      setIsCreating(false);
      setFormData({ name: "", urls: "", frequency: "daily", cronExpression: "" });
      toast({
        title: "Schedule Created",
        description: "Your scraping schedule has been created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create schedule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleSchedule = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await fetch(`/api/schedules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Failed to update schedule");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      toast({
        title: "Schedule Updated",
        description: "Schedule status updated successfully!",
      });
    },
  });

  const deleteSchedule = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/schedules/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete schedule");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      toast({
        title: "Schedule Deleted",
        description: "Schedule has been deleted successfully!",
      });
    },
  });

  const triggerSchedule = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/schedules/${id}/trigger`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to trigger schedule");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      toast({
        title: "Schedule Triggered",
        description: `Created ${data.jobsCreated} scraping jobs successfully!`,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.urls.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and at least one URL.",
        variant: "destructive",
      });
      return;
    }
    createSchedule.mutate(formData);
  };

  const getFrequencyDisplay = (frequency: string, cronExpression?: string | null) => {
    if (cronExpression) {
      return `Custom (${cronExpression})`;
    }
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  const getNextRunDisplay = (nextRun?: string | null) => {
    if (!nextRun) return "Not scheduled";
    return format(new Date(nextRun), "MMM dd, yyyy 'at' h:mm a");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Schedule Manager</h2>
          <p className="text-muted-foreground">
            Automate your web scraping with scheduled analysis
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Schedule
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Schedule</CardTitle>
            <CardDescription>
              Set up automated scraping for multiple websites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Schedule Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Daily Competitor Analysis"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urls">URLs to Scrape</Label>
                <Textarea
                  id="urls"
                  value={formData.urls}
                  onChange={(e) => setFormData({ ...formData, urls: e.target.value })}
                  placeholder="Enter one URL per line&#10;https://example1.com&#10;https://example2.com"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom (Cron)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.frequency === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="cron">Cron Expression</Label>
                    <Input
                      id="cron"
                      value={formData.cronExpression}
                      onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
                      placeholder="0 9 * * * (9 AM daily)"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createSchedule.isPending}>
                  {createSchedule.isPending ? "Creating..." : "Create Schedule"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {schedules.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Schedules Yet</h3>
              <p className="text-muted-foreground text-center">
                Create your first automated scraping schedule to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {schedule.name}
                      <Badge variant={schedule.isActive ? "default" : "secondary"}>
                        {schedule.isActive ? "Active" : "Paused"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {Array.isArray(schedule.urls) ? schedule.urls.length : 1} URLs • {getFrequencyDisplay(schedule.frequency, schedule.cronExpression)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={schedule.isActive}
                      onCheckedChange={(checked) =>
                        toggleSchedule.mutate({ id: schedule.id, isActive: checked })
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => triggerSchedule.mutate(schedule.id)}
                      disabled={triggerSchedule.isPending}
                      className="gap-1"
                    >
                      <Play className="h-3 w-3" />
                      Run Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSchedule.mutate(schedule.id)}
                      disabled={deleteSchedule.isPending}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Next run: {getNextRunDisplay(schedule.nextRun)}
                  </div>
                  {schedule.lastRun && (
                    <div className="text-sm text-muted-foreground">
                      Last run: {format(new Date(schedule.lastRun), "MMM dd, yyyy 'at' h:mm a")}
                    </div>
                  )}
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">URLs:</Label>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(schedule.urls) ? schedule.urls.map((url, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {new URL(url).hostname}
                        </Badge>
                      )) : (
                        <Badge variant="outline" className="text-xs">
                          {new URL(schedule.urls as string).hostname}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}