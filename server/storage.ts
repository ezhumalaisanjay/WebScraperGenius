import { scrapingJobs, scrapingSchedules, type ScrapingJob, type InsertScrapingJob, type ScrapingSchedule, type InsertScrapingSchedule, type ScrapingResults } from "@shared/schema";

export interface IStorage {
  createScrapingJob(job: InsertScrapingJob): Promise<ScrapingJob>;
  getScrapingJob(id: number): Promise<ScrapingJob | undefined>;
  updateScrapingJob(id: number, updates: Partial<ScrapingJob>): Promise<ScrapingJob | undefined>;
  getScrapingJobByUrl(url: string): Promise<ScrapingJob | undefined>;
  
  // Schedule management
  createSchedule(schedule: InsertScrapingSchedule): Promise<ScrapingSchedule>;
  getSchedule(id: number): Promise<ScrapingSchedule | undefined>;
  getAllSchedules(): Promise<ScrapingSchedule[]>;
  updateSchedule(id: number, updates: Partial<ScrapingSchedule>): Promise<ScrapingSchedule | undefined>;
  deleteSchedule(id: number): Promise<boolean>;
  getActiveSchedules(): Promise<ScrapingSchedule[]>;
  getSchedulesDue(): Promise<ScrapingSchedule[]>;
}

export class MemStorage implements IStorage {
  private jobs: Map<number, ScrapingJob>;
  private schedules: Map<number, ScrapingSchedule>;
  private currentJobId: number;
  private currentScheduleId: number;

  constructor() {
    this.jobs = new Map();
    this.schedules = new Map();
    this.currentJobId = 1;
    this.currentScheduleId = 1;
  }

  async createScrapingJob(insertJob: InsertScrapingJob): Promise<ScrapingJob> {
    const id = this.currentJobId++;
    const job: ScrapingJob = { 
      ...insertJob, 
      id,
      status: "pending",
      results: null,
      error: null,
      createdAt: new Date(),
      completedAt: null,
      scheduleId: insertJob.scheduleId || null,
    };
    this.jobs.set(id, job);
    return job;
  }

  async getScrapingJob(id: number): Promise<ScrapingJob | undefined> {
    return this.jobs.get(id);
  }

  async updateScrapingJob(id: number, updates: Partial<ScrapingJob>): Promise<ScrapingJob | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updates };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async getScrapingJobByUrl(url: string): Promise<ScrapingJob | undefined> {
    return Array.from(this.jobs.values()).find(job => job.url === url);
  }

  // Schedule management methods
  async createSchedule(insertSchedule: InsertScrapingSchedule): Promise<ScrapingSchedule> {
    const id = this.currentScheduleId++;
    const schedule: ScrapingSchedule = {
      ...insertSchedule,
      id,
      isActive: true,
      lastRun: null,
      nextRun: this.calculateNextRun(insertSchedule.frequency, insertSchedule.cronExpression),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.schedules.set(id, schedule);
    return schedule;
  }

  async getSchedule(id: number): Promise<ScrapingSchedule | undefined> {
    return this.schedules.get(id);
  }

  async getAllSchedules(): Promise<ScrapingSchedule[]> {
    return Array.from(this.schedules.values());
  }

  async updateSchedule(id: number, updates: Partial<ScrapingSchedule>): Promise<ScrapingSchedule | undefined> {
    const schedule = this.schedules.get(id);
    if (!schedule) return undefined;
    
    const updatedSchedule = { 
      ...schedule, 
      ...updates, 
      updatedAt: new Date(),
      nextRun: updates.frequency || updates.cronExpression ? 
        this.calculateNextRun(updates.frequency || schedule.frequency, updates.cronExpression || schedule.cronExpression) : 
        schedule.nextRun
    };
    this.schedules.set(id, updatedSchedule);
    return updatedSchedule;
  }

  async deleteSchedule(id: number): Promise<boolean> {
    return this.schedules.delete(id);
  }

  async getActiveSchedules(): Promise<ScrapingSchedule[]> {
    return Array.from(this.schedules.values()).filter(schedule => schedule.isActive);
  }

  async getSchedulesDue(): Promise<ScrapingSchedule[]> {
    const now = new Date();
    return Array.from(this.schedules.values()).filter(schedule => 
      schedule.isActive && schedule.nextRun && schedule.nextRun <= now
    );
  }

  private calculateNextRun(frequency: string, cronExpression?: string | null): Date {
    const now = new Date();
    
    if (cronExpression) {
      // Basic cron parsing for common patterns
      return this.parseCronExpression(cronExpression, now);
    }
    
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to daily
    }
  }

  private parseCronExpression(cronExpr: string, fromDate: Date): Date {
    // Basic cron parsing - in production you'd use a proper cron library
    const parts = cronExpr.split(' ');
    if (parts.length !== 5) {
      // Fallback to daily if invalid cron
      return new Date(fromDate.getTime() + 24 * 60 * 60 * 1000);
    }
    
    // For now, return next day as fallback
    return new Date(fromDate.getTime() + 24 * 60 * 60 * 1000);
  }
}

export const storage = new MemStorage();
