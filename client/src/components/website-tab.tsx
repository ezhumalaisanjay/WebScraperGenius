import { Globe, Info, ServerCog, Package, Mail, Share, CheckCircle } from "lucide-react";
import { WebsiteData } from "../types/scraping";

interface WebsiteTabProps {
  data: WebsiteData;
  stats?: {
    pagesAnalyzed: number;
    sectionsFound: number;
    aiSummariesGenerated: number;
    socialLinksFound: number;
  };
}

export function WebsiteTab({ data, stats }: WebsiteTabProps) {
  return (
    <div className="p-6">
      <div className="grid gap-6">
        {/* Website Overview Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Pages Analyzed</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.pagesAnalyzed}</p>
                </div>
                <Globe className="text-blue-500 text-xl w-6 h-6" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">Sections Found</p>
                  <p className="text-2xl font-bold text-emerald-900">{stats.sectionsFound}</p>
                </div>
                <Package className="text-emerald-500 text-xl w-6 h-6" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-lg border border-violet-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-600 text-sm font-medium">AI Summaries</p>
                  <p className="text-2xl font-bold text-violet-900">{stats.aiSummariesGenerated}</p>
                </div>
                <ServerCog className="text-violet-500 text-xl w-6 h-6" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">Social Links</p>
                  <p className="text-2xl font-bold text-amber-900">{stats.socialLinksFound}</p>
                </div>
                <Share className="text-amber-500 text-xl w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {/* Website Sections */}
        <div className="space-y-6">
          {/* Web Home Section */}
          {data.home && (
            <div className="border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Homepage</h3>
                    <p className="text-sm text-slate-500">Main landing page analysis</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Analyzed
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Key Information</h4>
                  <dl className="space-y-2 text-sm">
                    {data.home.page_title && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Page Title:</dt>
                        <dd className="text-slate-900 font-medium">{data.home.page_title}</dd>
                      </div>
                    )}
                    {data.home.keywords && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Main Keywords:</dt>
                        <dd className="text-slate-900">{data.home.keywords}</dd>
                      </div>
                    )}
                    {data.home.hero_text && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Hero Text:</dt>
                        <dd className="text-slate-900">{data.home.hero_text}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">AI Summary</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {data.home.summary || "No summary available"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Web About Section */}
          {data.about && (
            <div className="border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Info className="text-violet-600 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">About</h3>
                    <p className="text-sm text-slate-500">Company background and mission</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Analyzed
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Company Details</h4>
                  <dl className="space-y-2 text-sm">
                    {data.about.company_name && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Company:</dt>
                        <dd className="text-slate-900 font-medium">{data.about.company_name}</dd>
                      </div>
                    )}
                    {data.about.founding_year && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Founded:</dt>
                        <dd className="text-slate-900 font-medium">{data.about.founding_year}</dd>
                      </div>
                    )}
                    {data.about.mission_statement && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Mission:</dt>
                        <dd className="text-slate-900">{data.about.mission_statement}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">AI Summary</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {data.about.about_summary || "No summary available"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Web Services Section */}
          {data.services && (
            <div className="border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <ServerCog className="text-emerald-600 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Services</h3>
                    <p className="text-sm text-slate-500">Services and offerings analysis</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Analyzed
                </span>
              </div>
              <div className="space-y-4">
                {data.services.services_list && data.services.services_list.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-3">Service Offerings</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {data.services.services_list.map((service, index) => (
                        <div key={index} className="bg-slate-50 p-3 rounded-lg">
                          <h5 className="font-medium text-slate-900">{service.name}</h5>
                          <p className="text-sm text-slate-600">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">AI Summary</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {data.services.services_summary || "No summary available"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Web Products Section */}
          {data.products && (
            <div className="border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="text-orange-600 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Products</h3>
                    <p className="text-sm text-slate-500">Product offerings analysis</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Analyzed
                </span>
              </div>
              <div className="space-y-4">
                {data.products.products_list && data.products.products_list.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-3">Product Offerings</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {data.products.products_list.map((product, index) => (
                        <div key={index} className="bg-slate-50 p-3 rounded-lg">
                          <h5 className="font-medium text-slate-900">{product.name}</h5>
                          <p className="text-sm text-slate-600">{product.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">AI Summary</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {data.products.products_summary || "No summary available"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Web Contact Section */}
          {data.contact && (
            <div className="border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Mail className="text-amber-600 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Contact</h3>
                    <p className="text-sm text-slate-500">Contact information and locations</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Analyzed
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {data.contact.email_addresses && data.contact.email_addresses.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Email Addresses</h4>
                    <div className="space-y-1">
                      {data.contact.email_addresses.map((email, index) => (
                        <p key={index} className="text-sm text-slate-600 font-mono">{email}</p>
                      ))}
                    </div>
                  </div>
                )}
                {data.contact.office_locations && data.contact.office_locations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Office Locations</h4>
                    <div className="space-y-1">
                      {data.contact.office_locations.map((location, index) => (
                        <p key={index} className="text-sm text-slate-600">{location}</p>
                      ))}
                    </div>
                  </div>
                )}
                {data.contact.phone_numbers && data.contact.phone_numbers.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Phone Numbers</h4>
                    <div className="space-y-1">
                      {data.contact.phone_numbers.map((phone, index) => (
                        <p key={index} className="text-sm text-slate-600 font-mono">{phone}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Web Social Media Section */}
          {data.social_media && (
            <div className="border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Share className="text-pink-600 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Social Media</h3>
                    <p className="text-sm text-slate-500">Social media presence and links</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Analyzed
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.social_media.linkedin_url && (
                  <a href={data.social_media.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">in</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">LinkedIn</span>
                  </a>
                )}
                {data.social_media.twitter_url && (
                  <a href={data.social_media.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">X</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">Twitter</span>
                  </a>
                )}
                {data.social_media.facebook_url && (
                  <a href={data.social_media.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">f</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">Facebook</span>
                  </a>
                )}
                {data.social_media.youtube_url && (
                  <a href={data.social_media.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">▶</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">YouTube</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
