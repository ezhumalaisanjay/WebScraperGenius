import { Users, Building, CheckCircle } from "lucide-react";
import { LinkedinData } from "../types/scraping";

interface LinkedinTabProps {
  data: LinkedinData;
}

export function LinkedinTab({ data }: LinkedinTabProps) {
  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* LinkedIn Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Followers</p>
                <p className="text-2xl font-bold text-blue-900">{data.home?.follower_count || "N/A"}</p>
              </div>
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">in</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Employees</p>
                <p className="text-2xl font-bold text-emerald-900">{data.home?.employee_count || data.about?.company_size || "N/A"}</p>
              </div>
              <Users className="text-emerald-500 text-xl w-6 h-6" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-lg border border-violet-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-600 text-sm font-medium">Industry</p>
                <p className="text-lg font-bold text-violet-900">{data.about?.industry || "N/A"}</p>
              </div>
              <Building className="text-violet-500 text-xl w-6 h-6" />
            </div>
          </div>
        </div>

        {/* LinkedIn Home Section */}
        {data.home && (
          <div className="border border-slate-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">in</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">LinkedIn Home</h3>
                  <p className="text-sm text-slate-500">Company profile overview</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3 inline mr-1" />
                Scraped
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-700 mb-3">Company Profile</h4>
                <dl className="space-y-3 text-sm">
                  {data.home.linkedin_name && (
                    <div>
                      <dt className="text-slate-500 mb-1">Company Name:</dt>
                      <dd className="text-slate-900 font-medium text-lg">{data.home.linkedin_name}</dd>
                    </div>
                  )}
                  {data.home.tagline && (
                    <div>
                      <dt className="text-slate-500 mb-1">Tagline:</dt>
                      <dd className="text-slate-900">{data.home.tagline}</dd>
                    </div>
                  )}
                  {data.home.follower_count && (
                    <div>
                      <dt className="text-slate-500 mb-1">Followers:</dt>
                      <dd className="text-slate-900 font-medium">{data.home.follower_count}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <div>
                {/* LinkedIn company cover image placeholder */}
                <div className="w-full h-32 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Building className="w-8 h-8 mb-2 mx-auto" />
                    <p className="text-sm font-medium">{data.home.linkedin_name || "Company"}</p>
                    <p className="text-xs opacity-90">LinkedIn Profile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LinkedIn About Section */}
        {data.about && (
          <div className="border border-slate-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Building className="text-violet-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">LinkedIn About</h3>
                  <p className="text-sm text-slate-500">Detailed company information</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3 inline mr-1" />
                Scraped
              </span>
            </div>
            <div className="space-y-6">
              {data.about.description && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">Company Description</h4>
                  <p className="text-slate-600 leading-relaxed">{data.about.description}</p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">Company Details</h4>
                  <dl className="space-y-2 text-sm">
                    {data.about.industry && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Industry:</dt>
                        <dd className="text-slate-900 font-medium">{data.about.industry}</dd>
                      </div>
                    )}
                    {data.about.company_size && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Company Size:</dt>
                        <dd className="text-slate-900">{data.about.company_size}</dd>
                      </div>
                    )}
                    {data.about.headquarters && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Headquarters:</dt>
                        <dd className="text-slate-900">{data.about.headquarters}</dd>
                      </div>
                    )}
                    {data.about.founded_year && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Founded:</dt>
                        <dd className="text-slate-900">{data.about.founded_year}</dd>
                      </div>
                    )}
                    {data.about.type && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Type:</dt>
                        <dd className="text-slate-900">{data.about.type}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.about.specialties && data.about.specialties.length > 0 ? (
                      data.about.specialties.map((specialty, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {specialty}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-sm">No specialties listed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
