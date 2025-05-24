export interface ScrapingJob {
  id: number;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results?: ScrapingResults;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ScrapingResults {
  website: WebsiteData;
  linkedin: LinkedinData;
  stats?: {
    pagesAnalyzed: number;
    sectionsFound: number;
    aiSummariesGenerated: number;
    socialLinksFound: number;
  };
}

export interface WebsiteData {
  home?: {
    page_title?: string;
    meta_description?: string;
    summary?: string;
    main_headings?: string[];
    keywords?: string;
    hero_text?: string;
  };
  about?: {
    company_name?: string;
    mission_statement?: string;
    about_summary?: string;
    founding_year?: string;
    leadership_team?: string[];
  };
  services?: {
    services_list?: Array<{
      name: string;
      description: string;
    }>;
    services_summary?: string;
    industries_served?: string[];
  };
  products?: {
    products_list?: Array<{
      name: string;
      description: string;
    }>;
    product_categories?: string[];
    products_summary?: string;
  };
  contact?: {
    email_addresses?: string[];
    phone_numbers?: string[];
    office_locations?: string[];
    contact_form_url?: string;
    support_info?: string;
  };
  social_media?: {
    linkedin_url?: string;
    twitter_url?: string;
    facebook_url?: string;
    youtube_url?: string;
    instagram_url?: string;
  };
}

export interface LinkedinData {
  home?: {
    linkedin_name?: string;
    tagline?: string;
    follower_count?: string;
    employee_count?: string;
    cover_image_url?: string;
  };
  about?: {
    description?: string;
    specialties?: string[];
    industry?: string;
    company_size?: string;
    headquarters?: string;
    website?: string;
    founded_year?: string;
    type?: string;
  };
}
