import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Plus, Play, Trash2, Settings } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ScrapingSchedule } from "@shared/schema";

interface SchedulingSectionProps {
  onScheduleCreated?: () => void;
}

export function SchedulingSection({ onScheduleCreated }: SchedulingSectionProps) {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    urls: "",
    frequency: "daily",
    cronExpression: "",
    settings: ""
  });

  // Fetch all schedules
  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['/api/schedules'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Create schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: (scheduleData: any) => apiRequest('/api/schedules', 'POST', scheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      setShowCreateForm(false);
      setFormData({ name: "", urls: "", frequency: "daily", cronExpression: "", settings: "" });
      toast({ title: "Schedule created successfully!", description: "Your automation is now active." });
      onScheduleCreated?.();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create schedule. Please try again.", variant: "destructive" });
    }
  });

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/schedules/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      toast({ title: "Schedule deleted", description: "Automation has been removed." });
    }
  });

  // Toggle schedule mutation
  const toggleScheduleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      apiRequest(`/api/schedules/${id}`, 'PUT', { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
    }
  });

  // Trigger schedule manually
  const triggerScheduleMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/schedules/${id}/trigger`, 'POST'),
    onSuccess: () => {
      toast({ title: "Schedule triggered!", description: "Manual execution started successfully." });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const urlList = formData.urls.split('\n').filter(url => url.trim());
    if (urlList.length === 0) {
      toast({ title: "Error", description: "Please enter at least one URL.", variant: "destructive" });
      return;
    }

    const scheduleData = {
      name: formData.name,
      urls: urlList,
      frequency: formData.frequency,
      cronExpression: formData.cronExpression || null,
      settings: formData.settings ? JSON.parse(formData.settings) : null
    };

    createScheduleMutation.mutate(scheduleData);
  };

  const formatNextRun = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const getFrequencyBadgeColor = (frequency: string) => {
    switch (frequency) {
      case 'hourly': return 'bg-green-100 text-green-800';
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-purple-100 text-purple-800';
      case 'monthly': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automation & Scheduling</h2>
          <p className="text-muted-foreground">Set up automated scraping schedules for continuous monitoring</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Schedule
        </Button>
      </div>

      {/* Create Schedule Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Schedule</CardTitle>
            <CardDescription>Configure automated scraping for multiple websites</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Schedule Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Daily Competitor Analysis"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom (Cron)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.frequency === 'custom' && (
                <div>
                  <Label htmlFor="cron">Cron Expression</Label>
                  <Input
                    id="cron"
                    value={formData.cronExpression}
                    onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
                    placeholder="0 9 * * * (Daily at 9 AM)"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="urls">URLs to Monitor</Label>
                <Textarea
                  id="urls"
                  value={formData.urls}
                  onChange={(e) => setFormData({ ...formData, urls: e.target.value })}
                  placeholder="Enter one URL per line:&#10;https://example.com&#10;https://competitor.com"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createScheduleMutation.isPending}>
                  {createScheduleMutation.isPending ? "Creating..." : "Create Schedule"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Existing Schedules */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">Loading schedules...</div>
            </CardContent>
          </Card>
        ) : schedules.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No schedules created yet.</p>
                <p className="text-sm">Create your first automation to get started!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          schedules.map((schedule: ScrapingSchedule) => (
            <Card key={schedule.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{schedule.name}</CardTitle>
                    <Badge className={getFrequencyBadgeColor(schedule.frequency)}>
                      {schedule.frequency}
                    </Badge>
                    <Switch
                      checked={schedule.isActive || false}
                      onCheckedChange={(checked) => 
                        toggleScheduleMutation.mutate({ id: schedule.id, isActive: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => triggerScheduleMutation.mutate(schedule.id)}
                      disabled={triggerScheduleMutation.isPending}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteScheduleMutation.mutate(schedule.id)}
                      disabled={deleteScheduleMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      Next Run
                    </div>
                    <div className="font-medium">
                      {schedule.nextRun ? formatNextRun(schedule.nextRun) : "Not scheduled"}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock className="h-4 w-4" />
                      Last Run
                    </div>
                    <div className="font-medium">
                      {schedule.lastRun ? formatNextRun(schedule.lastRun) : "Never"}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Settings className="h-4 w-4" />
                      URLs
                    </div>
                    <div className="font-medium">
                      {Array.isArray(schedule.urls) ? schedule.urls.length : 1} website(s)
                    </div>
                  </div>
                </div>
                
                {Array.isArray(schedule.urls) && schedule.urls.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground mb-1">Monitored URLs:</div>
                    <div className="flex flex-wrap gap-1">
                      {schedule.urls.map((url: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {new URL(url).hostname}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}