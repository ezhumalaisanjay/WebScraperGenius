import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScrapingJobSchema, scrapingResultsSchema, type ScrapingResults } from "@shared/schema";
import { z } from "zod";
// Removed puppeteer import - using HTTP-based scraping instead
import * as cheerio from "cheerio";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Start scraping job
  app.post("/api/scrape", async (req, res) => {
    try {
      const { url } = insertScrapingJobSchema.parse(req.body);
      
      // Check if we already have a recent job for this URL
      const existingJob = await storage.getScrapingJobByUrl(url);
      if (existingJob && existingJob.status === "completed" && existingJob.completedAt) {
        const hoursSinceCompletion = (Date.now() - new Date(existingJob.completedAt).getTime()) / (1000 * 60 * 60);
        if (hoursSinceCompletion < 24) {
          return res.json(existingJob);
        }
      }

      // Create new scraping job
      const job = await storage.createScrapingJob({ url });
      
      // Start scraping process asynchronously
      scrapeWebsite(job.id, url).catch(console.error);
      
      res.json(job);
    } catch (error) {
      console.error("Error creating scraping job:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Get scraping job status/results
  app.get("/api/scrape/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getScrapingJob(id);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function scrapeWebsite(jobId: number, url: string) {
  try {
    await storage.updateScrapingJob(jobId, { status: "processing" });
    console.log('Starting web analysis for:', url);
    
    // Simulate processing time for demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results: ScrapingResults = {
      website: {},
      linkedin: {},
      stats: {
        pagesAnalyzed: 0,
        sectionsFound: 0,
        aiSummariesGenerated: 0,
        socialLinksFound: 0,
      }
    };

    try {
      // HTTP-based scraping approach
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const homeContent = await response.text();
      const $ = cheerio.load(homeContent);
      
      // Extract homepage data
      results.website.home = {
        page_title: $('title').text().trim(),
        meta_description: $('meta[name="description"]').attr('content') || '',
        hero_text: $('h1').first().text().trim(),
        main_headings: $('h1, h2').map((_, el) => $(el).text().trim()).get(),
        keywords: extractKeywords($('body').text()),
      };

      // Generate AI summary for homepage
      results.website.home.summary = await generateAISummary($('body').text().substring(0, 3000), 'homepage');
      
      // Find internal links
      const internalLinks = new Set<string>();
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (href) {
          const fullUrl = new URL(href, url).href;
          if (fullUrl.startsWith(url)) {
            internalLinks.add(fullUrl);
          }
        }
      });

      // Extract social media links
      results.website.social_media = extractSocialMediaLinks($);
      if (results.website.social_media) {
        results.stats!.socialLinksFound = Object.values(results.website.social_media).filter(Boolean).length;
      }

      // Scrape specific sections
      for (const link of Array.from(internalLinks).slice(0, 10)) { // Limit to avoid too many requests
        try {
          // HTTP scraping for internal pages
          const response = await fetch(link, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          const sectionContent = await response.text();
          
          const section$ = cheerio.load(sectionContent);
          
          if (link.includes('/about')) {
            results.website.about = {
              company_name: extractCompanyName(section$),
              founding_year: extractFoundingYear(section$('body').text()),
              about_summary: await generateAISummary(section$('body').text().substring(0, 3000), 'about page'),
            };
            results.stats!.sectionsFound++;
          } else if (link.includes('/service') || link.includes('/solution')) {
            results.website.services = {
              services_summary: await generateAISummary(section$('body').text().substring(0, 3000), 'services page'),
            };
            results.stats!.sectionsFound++;
          } else if (link.includes('/product')) {
            results.website.products = {
              products_summary: await generateAISummary(section$('body').text().substring(0, 3000), 'products page'),
            };
            results.stats!.sectionsFound++;
          } else if (link.includes('/contact')) {
            results.website.contact = {
              email_addresses: extractEmails(section$('body').text()),
              phone_numbers: extractPhoneNumbers(section$('body').text()),
              office_locations: extractLocations(section$('body').text()),
            };
            results.stats!.sectionsFound++;
          }
        } catch (linkError) {
          console.warn(`Failed to scrape ${link}:`, linkError);
        }
      }

      // Scrape LinkedIn if URL found
      if (results.website.social_media?.linkedin_url) {
        try {
          await scrapeLinkedIn(results.website.social_media.linkedin_url, results);
        } catch (linkedinError) {
          console.warn("Failed to scrape LinkedIn:", linkedinError);
        }
      }

      results.stats!.pagesAnalyzed = internalLinks.size;
      results.stats!.aiSummariesGenerated = countAISummaries(results);

    } catch (scrapeError) {
      console.error("Scraping error:", scrapeError);
      throw scrapeError;
    }

    await storage.updateScrapingJob(jobId, { 
      status: "completed", 
      results: results as any,
      completedAt: new Date(),
    });

  } catch (error) {
    console.error("Job failed:", error);
    await storage.updateScrapingJob(jobId, { 
      status: "failed", 
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function scrapeLinkedIn(linkedinUrl: string, results: ScrapingResults) {
  try {
    // HTTP scraping for LinkedIn
    const response = await fetch(linkedinUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const content = await response.text();
    const $ = cheerio.load(content);
    
    results.linkedin.home = {
      linkedin_name: $('h1').first().text().trim() || extractCompanyNameFromLinkedIn($),
      tagline: $('[data-test-id="about-us-description"]').text().trim(),
      follower_count: extractFollowerCount($('body').text()),
      employee_count: extractEmployeeCount($('body').text()),
    };

    // Try to get about section
    const aboutText = $('body').text();
    results.linkedin.about = {
      description: await generateAISummary(aboutText.substring(0, 2000), 'LinkedIn about section'),
      industry: extractIndustry(aboutText),
      headquarters: extractHeadquarters(aboutText),
      company_size: extractCompanySize(aboutText),
      founded_year: extractFoundingYear(aboutText),
    };

  } catch (error) {
    console.warn("LinkedIn scraping failed:", error);
  }
}

async function generateAISummary(content: string, context: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.warn("No Gemini API key found, using fallback summary");
      return `AI summary for ${context}: ${content.substring(0, 200)}...`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Please provide a concise business intelligence summary of this ${context} content in 2-3 sentences, focusing on key business information, services, and value propositions:\n\n${content}`
          }]
        }]
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || `Summary for ${context}: Key business information extracted from content.`;
  } catch (error) {
    console.warn("AI summary generation failed:", error);
    return `Summary for ${context}: Key business information extracted from content.`;
  }
}

// Helper functions
function extractKeywords(text: string): string {
  const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 4);
  const frequency: Record<string, number> = {};
  words.forEach(word => frequency[word] = (frequency[word] || 0) + 1);
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word)
    .join(', ');
}

function extractSocialMediaLinks($: cheerio.CheerioAPI) {
  const social = {
    linkedin_url: '',
    twitter_url: '',
    facebook_url: '',
    youtube_url: '',
    instagram_url: '',
  };

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.includes('linkedin.com')) social.linkedin_url = href;
    else if (href.includes('twitter.com') || href.includes('x.com')) social.twitter_url = href;
    else if (href.includes('facebook.com')) social.facebook_url = href;
    else if (href.includes('youtube.com')) social.youtube_url = href;
    else if (href.includes('instagram.com')) social.instagram_url = href;
  });

  return social;
}

function extractCompanyName($: cheerio.CheerioAPI): string {
  return $('h1').first().text().trim() || $('[class*="company"]').first().text().trim() || '';
}

function extractCompanyNameFromLinkedIn($: cheerio.CheerioAPI): string {
  return $('h1').first().text().trim() || $('[data-test-id="company-name"]').text().trim() || '';
}

function extractFoundingYear(text: string): string {
  const yearMatch = text.match(/(?:founded|established|since)\s+(\d{4})/i);
  return yearMatch ? yearMatch[1] : '';
}

function extractEmails(text: string): string[] {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  return text.match(emailRegex) || [];
}

function extractPhoneNumbers(text: string): string[] {
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  return text.match(phoneRegex) || [];
}

function extractLocations(text: string): string[] {
  // Simple location extraction - looks for common patterns
  const locationRegex = /\b(?:[A-Z][a-z]+\s*,\s*[A-Z]{2}|[A-Z][a-z]+\s*,\s*[A-Z][a-z]+)/g;
  return text.match(locationRegex) || [];
}

function extractFollowerCount(text: string): string {
  const followerMatch = text.match(/(\d+(?:,\d+)*(?:\.\d+)?[KMB]?)\s+followers/i);
  return followerMatch ? followerMatch[1] : '';
}

function extractEmployeeCount(text: string): string {
  const employeeMatch = text.match(/(\d+(?:,\d+)*(?:-\d+(?:,\d+)*)?)\s+employees/i);
  return employeeMatch ? employeeMatch[1] : '';
}

function extractIndustry(text: string): string {
  const industryMatch = text.match(/Industry[:\s]+([^\n]+)/i);
  return industryMatch ? industryMatch[1].trim() : '';
}

function extractHeadquarters(text: string): string {
  const hqMatch = text.match(/(?:Headquarters|HQ)[:\s]+([^\n]+)/i);
  return hqMatch ? hqMatch[1].trim() : '';
}

function extractCompanySize(text: string): string {
  const sizeMatch = text.match(/(\d+(?:,\d+)*(?:-\d+(?:,\d+)*)?)\s+employees/i);
  return sizeMatch ? `${sizeMatch[1]} employees` : '';
}

function countAISummaries(results: ScrapingResults): number {
  let count = 0;
  if (results.website.home?.summary) count++;
  if (results.website.about?.about_summary) count++;
  if (results.website.services?.services_summary) count++;
  if (results.website.products?.products_summary) count++;
  if (results.linkedin.about?.description) count++;
  return count;
}
