import { apiRequest } from "./queryClient";
import { ScrapingJob } from "../types/scraping";

export const scrapingApi = {
  async startScraping(url: string): Promise<ScrapingJob> {
    const response = await apiRequest("POST", "/api/scrape", { url });
    return response.json();
  },

  async getScrapingJob(id: number): Promise<ScrapingJob> {
    const response = await apiRequest("GET", `/api/scrape/${id}`);
    return response.json();
  },
};
