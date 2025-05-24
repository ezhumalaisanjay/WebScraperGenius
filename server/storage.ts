import { scrapingJobs, type ScrapingJob, type InsertScrapingJob, type ScrapingResults } from "@shared/schema";

export interface IStorage {
  createScrapingJob(job: InsertScrapingJob): Promise<ScrapingJob>;
  getScrapingJob(id: number): Promise<ScrapingJob | undefined>;
  updateScrapingJob(id: number, updates: Partial<ScrapingJob>): Promise<ScrapingJob | undefined>;
  getScrapingJobByUrl(url: string): Promise<ScrapingJob | undefined>;
}

export class MemStorage implements IStorage {
  private jobs: Map<number, ScrapingJob>;
  private currentId: number;

  constructor() {
    this.jobs = new Map();
    this.currentId = 1;
  }

  async createScrapingJob(insertJob: InsertScrapingJob): Promise<ScrapingJob> {
    const id = this.currentId++;
    const job: ScrapingJob = { 
      ...insertJob, 
      id,
      status: "pending",
      results: null,
      error: null,
      createdAt: new Date(),
      completedAt: null,
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
}

export const storage = new MemStorage();
