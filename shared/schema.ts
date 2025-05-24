import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scrapingJobs = pgTable("scraping_jobs", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  results: jsonb("results"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertScrapingJobSchema = createInsertSchema(scrapingJobs).pick({
  url: true,
});

export type InsertScrapingJob = z.infer<typeof insertScrapingJobSchema>;
export type ScrapingJob = typeof scrapingJobs.$inferSelect;

// Zod schemas for validation
export const websiteDataSchema = z.object({
  home: z.object({
    page_title: z.string().optional(),
    meta_description: z.string().optional(),
    summary: z.string().optional(),
    main_headings: z.array(z.string()).optional(),
    keywords: z.string().optional(),
    hero_text: z.string().optional(),
  }).optional(),
  about: z.object({
    company_name: z.string().optional(),
    mission_statement: z.string().optional(),
    about_summary: z.string().optional(),
    founding_year: z.string().optional(),
    leadership_team: z.array(z.string()).optional(),
  }).optional(),
  services: z.object({
    services_list: z.array(z.object({
      name: z.string(),
      description: z.string(),
    })).optional(),
    services_summary: z.string().optional(),
    industries_served: z.array(z.string()).optional(),
  }).optional(),
  products: z.object({
    products_list: z.array(z.object({
      name: z.string(),
      description: z.string(),
    })).optional(),
    product_categories: z.array(z.string()).optional(),
    products_summary: z.string().optional(),
  }).optional(),
  contact: z.object({
    email_addresses: z.array(z.string()).optional(),
    phone_numbers: z.array(z.string()).optional(),
    office_locations: z.array(z.string()).optional(),
    contact_form_url: z.string().optional(),
    support_info: z.string().optional(),
  }).optional(),
  social_media: z.object({
    linkedin_url: z.string().optional(),
    twitter_url: z.string().optional(),
    facebook_url: z.string().optional(),
    youtube_url: z.string().optional(),
    instagram_url: z.string().optional(),
  }).optional(),
});

export const linkedinDataSchema = z.object({
  home: z.object({
    linkedin_name: z.string().optional(),
    tagline: z.string().optional(),
    follower_count: z.string().optional(),
    employee_count: z.string().optional(),
    cover_image_url: z.string().optional(),
  }).optional(),
  about: z.object({
    description: z.string().optional(),
    specialties: z.array(z.string()).optional(),
    industry: z.string().optional(),
    company_size: z.string().optional(),
    headquarters: z.string().optional(),
    website: z.string().optional(),
    founded_year: z.string().optional(),
    type: z.string().optional(),
  }).optional(),
});

export const scrapingResultsSchema = z.object({
  website: websiteDataSchema,
  linkedin: linkedinDataSchema,
  stats: z.object({
    pagesAnalyzed: z.number(),
    sectionsFound: z.number(),
    aiSummariesGenerated: z.number(),
    socialLinksFound: z.number(),
  }).optional(),
});

export type WebsiteData = z.infer<typeof websiteDataSchema>;
export type LinkedinData = z.infer<typeof linkedinDataSchema>;
export type ScrapingResults = z.infer<typeof scrapingResultsSchema>;
