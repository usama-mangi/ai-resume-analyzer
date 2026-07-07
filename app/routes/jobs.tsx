import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import { useJobsStore } from "~/lib/jobs-store";
import { PageShell, PageHeader, Button, Input, Select, Card, Modal, ModalFooter, useToastHelpers, ScoreBadge } from "~/components/ui";

export const meta = () => [
  { title: "Resumind | Job Search" },
  { name: "description", content: "Search jobs across LinkedIn, Indeed, Glassdoor, and company career pages" },
];

const SOURCES = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "glassdoor", label: "Glassdoor" },
  { value: "company", label: "Company Career Pages" },
];

const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const REMOTE_TYPES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead/Principal" },
  { value: "executive", label: "Executive" },
];

const JOB_FUNCTIONS = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "full-stack", label: "Full-Stack" },
  { value: "mobile", label: "Mobile" },
  { value: "ml-ai", label: "ML/AI" },
  { value: "data", label: "Data" },
  { value: "devops", label: "DevOps" },
  { value: "security", label: "Security" },
  { value: "cloud", label: "Cloud" },
  { value: "qa", label: "QA/Testing" },
];

export default function JobsPage() {
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToastHelpers();

  const store = useJobsStore();
  const searchAbortRef = useRef<AbortController | null>(null);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<any[]>([]);
  const [loadingBookmarked, setLoadingBookmarked] = useState(true);

  const activeFilterCount = store.selectedSources.length + store.selectedJobTypes.length + store.selectedRemoteTypes.length + store.selectedExperienceLevels.length + store.selectedJobFunctions.length;

  // Saved search form
  const [showNewSearchForm, setShowNewSearchForm] = useState(false);
  const [newSearchName, setNewSearchName] = useState("");
  const [newSearchKeywords, setNewSearchKeywords] = useState("");
  const [newSearchLocation, setNewSearchLocation] = useState("");
  const [newSearchSources, setNewSearchSources] = useState<string[]>([]);
  const [newSearchJobTypes, setNewSearchJobTypes] = useState<string[]>([]);
  const [newSearchRemoteTypes, setNewSearchRemoteTypes] = useState<string[]>([]);
  const [newSearchExperienceLevels, setNewSearchExperienceLevels] = useState<string[]>([]);

  useEffect(() => {
    if (!isPending && !isAuthenticated) navigate("/login");
  }, [isPending, isAuthenticated]);

  useEffect(() => {
    return () => { searchAbortRef.current?.abort(); };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      store.loadResumes();
      store.loadSavedSearches();
      loadBookmarkedJobs();
    }
  }, [isAuthenticated]);

  // Load jobs on page change — only after first search
  useEffect(() => {
    if (!store.hasSearched) return;
    if (store.activeTab === "search") store.loadJobs();
    else if (store.activeTab === "matches") {
      // trigger batch match
      if (store.resumes.length > 0 && store.jobs.length > 0) {
        const jobIds = store.jobs.map((j: any) => j.id);
        Promise.all(
          store.resumes.map(async (resume: any) => {
            const matches = await api.jobs.batchMatch(jobIds, resume.id);
            return { resumeId: resume.id, resumeTitle: resume.jobTitle, matches };
          })
        ).then((results) => {
          const matchMap: Record<string, number> = {};
          results.forEach((r) => {
            r.matches.forEach((m: any, index: number) => {
              const jobId = jobIds[index];
              matchMap[jobId] = Math.max(matchMap[jobId] || 0, m.overallMatch);
            });
          });
          useJobsStore.setState({ matchScores: matchMap, matchingJobs: store.jobs.filter((j: any) => matchMap[j.id] > 0) });
        });
      }
    }
  }, [store.activeTab]);

  // Reload bookmarked jobs whenever the bookmarked tab is selected
  useEffect(() => {
    if (isAuthenticated && store.activeTab === "bookmarked") {
      loadBookmarkedJobs();
    }
  }, [store.activeTab, isAuthenticated]);

  async function loadBookmarkedJobs() {
    setLoadingBookmarked(true);
    try {
      const data = await api.jobs.list({ isBookmarked: true, limit: 50 });
      setBookmarkedJobs(data.jobs || []);
    } catch (err) {
      console.error("Failed to load bookmarked jobs:", err);
    }
    setLoadingBookmarked(false);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    searchAbortRef.current?.abort();
    searchAbortRef.current = new AbortController();
    await store.search();
  }

  async function handleRunSavedSearch(search: any) {
    store.setSearchKeywords(Array.isArray(search.keywords) ? search.keywords.join(', ') : '');
    store.setSearchLocation(search.location || '');
    store.setSelectedSources(search.sources || []);
    store.setSelectedJobTypes(search.jobTypes || []);
    store.setSelectedRemoteTypes(search.remoteTypes || []);
    store.setSelectedExperienceLevels(search.experienceLevels || []);
    store.setActiveTab("search");
    await store.search();
  }

  async function handleDeleteSavedSearch(id: string) {
    if (!confirm("Delete this saved search?")) return;
    try {
      await api.jobs.savedSearches.delete(id);
      toastSuccess("Deleted", "Saved search removed");
      store.loadSavedSearches();
    } catch (err) {
      toastError("Delete failed", err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function handleToggleBookmark(jobId: string) {
    await store.toggleBookmark(jobId);
  }

  async function handleMarkAsApplied(jobId: string) {
    await store.markAsApplied(jobId);
    toastSuccess("Applied", "Job marked as applied");
  }

  async function handleAnalyzeMatch(job: any) {
    if (store.resumes.length === 0) {
      toastError("No resumes", "Upload a resume first");
      return;
    }
    store.setMatchAnalysisJob(job);
    store.setMatchAnalysis(null);
    await store.analyzeMatch(job.id, store.resumes[0].id);
  }

  async function handleCreateSavedSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!newSearchName || !newSearchKeywords) return;
    try {
      await api.jobs.savedSearches.create({
        name: newSearchName,
        keywords: newSearchKeywords.split(",").map(k => k.trim()).filter(Boolean),
        location: newSearchLocation || undefined,
        sources: newSearchSources.length > 0 ? newSearchSources : undefined,
        jobTypes: newSearchJobTypes.length > 0 ? newSearchJobTypes : undefined,
        remoteTypes: newSearchRemoteTypes.length > 0 ? newSearchRemoteTypes : undefined,
        experienceLevels: newSearchExperienceLevels.length > 0 ? newSearchExperienceLevels : undefined,
      });
      setShowNewSearchForm(false);
      setNewSearchName("");
      setNewSearchKeywords("");
      setNewSearchLocation("");
      setNewSearchSources([]);
      setNewSearchJobTypes([]);
      setNewSearchRemoteTypes([]);
      setNewSearchExperienceLevels([]);
      toastSuccess("Search saved", "Your job search has been saved");
      store.loadSavedSearches();
    } catch (err) {
      toastError("Failed to save search", err instanceof Error ? err.message : "Unknown error");
    }
  }

  if (isPending) {
    return (
      <PageShell>
        <PageHeader title="Job Search" subtitle="Loading..." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Card key={i} className="h-48 animate-pulse bg-gray-100"><div className="h-full" /></Card>)}
        </div>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const displayedJobs = store.activeTab === "matches" ? store.matchingJobs : store.jobs;

  return (
    <PageShell maxWidth="full" padding="lg">
      <PageHeader
        title="Job Search"
        subtitle="Search across LinkedIn, Indeed, Glassdoor, and company career pages"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowNewSearchForm(true)}>+ Save Search</Button>
          </div>
        }
      />

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { key: "search", label: "Search", icon: "🔍" },
          { key: "bookmarked", label: "Bookmarked", icon: "⭐" },
          { key: "saved", label: "Saved Searches", icon: "💾" },
          { key: "matches", label: "AI Matches", icon: "🎯" },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={store.activeTab === tab.key ? "primary" : "ghost"}
            size="sm"
            onClick={() => store.setActiveTab(tab.key as "search" | "saved" | "matches" | "bookmarked")}
            className="flex items-center gap-1"
          >
            {tab.icon} {tab.label}
          </Button>
        ))}
      </div>

      {store.activeTab === "search" && (
        <div className="space-y-6">
          {/* Search Form */}
          <Card>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    label="Keywords"
                    placeholder="e.g. React, Python, Product Manager"
                    value={store.searchKeywords}
                    onChange={(e) => store.setSearchKeywords(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-52">
                  <Input
                    label="Location"
                    placeholder="e.g. San Francisco, Remote"
                    value={store.searchLocation}
                    onChange={(e) => store.setSearchLocation(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full sm:w-auto" disabled={store.loadingJobs}>
                    {store.loadingJobs ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>

              {/* Collapsible filters */}
              <div>
                <button
                  type="button"
                  onClick={() => store.setFiltersOpen(!store.filtersOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className={`w-4 h-4 transition-transform ${store.filtersOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {store.filtersOpen && (
                  <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {SOURCES.map((s) => (
                          <label key={s.value} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={store.selectedSources.includes(s.value)}
                              onChange={(e) => (e.target.checked ? store.setSelectedSources([...store.selectedSources, s.value]) : store.setSelectedSources(store.selectedSources.filter((v) => v !== s.value)))}
                              className="w-3.5 h-3.5 text-primary-500 border-gray-300 rounded"
                            />
                            <span className="text-gray-600">{s.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Job Types</p>
                      <div className="flex flex-wrap gap-2">
                        {JOB_TYPES.map((t) => (
                          <label key={t.value} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={store.selectedJobTypes.includes(t.value)}
                              onChange={(e) => (e.target.checked ? store.setSelectedJobTypes([...store.selectedJobTypes, t.value]) : store.setSelectedJobTypes(store.selectedJobTypes.filter((v) => v !== t.value)))}
                              className="w-3.5 h-3.5 text-primary-500 border-gray-300 rounded"
                            />
                            <span className="text-gray-600">{t.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Remote</p>
                      <div className="flex flex-wrap gap-2">
                        {REMOTE_TYPES.map((r) => (
                          <label key={r.value} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={store.selectedRemoteTypes.includes(r.value)}
                              onChange={(e) => (e.target.checked ? store.setSelectedRemoteTypes([...store.selectedRemoteTypes, r.value]) : store.setSelectedRemoteTypes(store.selectedRemoteTypes.filter((v) => v !== r.value)))}
                              className="w-3.5 h-3.5 text-primary-500 border-gray-300 rounded"
                            />
                            <span className="text-gray-600">{r.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Experience</p>
                      <div className="flex flex-wrap gap-2">
                        {EXPERIENCE_LEVELS.map((l) => (
                          <label key={l.value} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={store.selectedExperienceLevels.includes(l.value)}
                              onChange={(e) => (e.target.checked ? store.setSelectedExperienceLevels([...store.selectedExperienceLevels, l.value]) : store.setSelectedExperienceLevels(store.selectedExperienceLevels.filter((v) => v !== l.value)))}
                              className="w-3.5 h-3.5 text-primary-500 border-gray-300 rounded"
                            />
                            <span className="text-gray-600">{l.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Job Function</p>
                      <div className="flex flex-wrap gap-2">
                        {JOB_FUNCTIONS.map((f) => (
                          <label key={f.value} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={store.selectedJobFunctions.includes(f.value)}
                              onChange={(e) => (e.target.checked ? store.setSelectedJobFunctions([...store.selectedJobFunctions, f.value]) : store.setSelectedJobFunctions(store.selectedJobFunctions.filter((v) => v !== f.value)))}
                              className="w-3.5 h-3.5 text-primary-500 border-gray-300 rounded"
                            />
                            <span className="text-gray-600">{f.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </Card>

          {/* Results */}
          {store.loadingJobs ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => <Card key={i} className="h-64 animate-pulse bg-gray-100"><div className="h-full" /></Card>)}
            </div>
          ) : displayedJobs.length === 0 && !store.hasSearched ? (
            /* No search yet — show bookmarked jobs */
            loadingBookmarked ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => <Card key={i} className="h-48 animate-pulse bg-gray-100"><div className="h-full" /></Card>)}
              </div>
            ) : bookmarkedJobs.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Your Bookmarked Jobs</h3>
                  <Button variant="ghost" size="sm" onClick={loadBookmarkedJobs}>Refresh</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {bookmarkedJobs.map((job: any) => (
                    <JobCard key={job.id} job={job} matchScore={undefined} resumes={store.resumes} onAnalyzeMatch={handleAnalyzeMatch} />
                  ))}
                </div>
              </div>
            ) : (
              <Card className="text-center py-12">
                <p className="text-lg font-medium text-gray-900 mb-1">Search for jobs</p>
                <p className="text-sm text-gray-500">Enter keywords and click Search to find opportunities.</p>
              </Card>
            )
          ) : displayedJobs.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-lg font-medium text-gray-900 mb-1">No jobs found</p>
              <p className="text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {displayedJobs.map((job: any) => (
                  <JobCard key={job.id} job={job} matchScore={store.matchScores[job.id]} resumes={store.resumes} onAnalyzeMatch={handleAnalyzeMatch} />
                ))}
              </div>

              {store.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => store.goPage(store.pagination.page - 1)} disabled={store.pagination.page === 1}>Previous</Button>
                  <span className="text-sm text-gray-600">Page {store.pagination.page} of {store.pagination.totalPages}</span>
                  <Button variant="ghost" size="sm" onClick={() => store.goPage(store.pagination.page + 1)} disabled={store.pagination.page === store.pagination.totalPages}>Next</Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {store.activeTab === "bookmarked" && (
        <div className="space-y-4">
          {loadingBookmarked ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => <Card key={i} className="h-48 animate-pulse bg-gray-100"><div className="h-full" /></Card>)}
            </div>
          ) : bookmarkedJobs.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-500">No bookmarked jobs yet.</p>
              <p className="text-sm text-gray-400 mt-1">Bookmark jobs from search results to see them here.</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarkedJobs.map((job: any) => (
                <JobCard key={job.id} job={job} matchScore={undefined} resumes={store.resumes} onAnalyzeMatch={handleAnalyzeMatch} />
              ))}
            </div>
          )}
        </div>
      )}

      {store.activeTab === "saved" && (
        <div className="space-y-4">
          {showNewSearchForm && (
            <Card>
              <form onSubmit={handleCreateSavedSearch} className="space-y-4">
                <h3 className="font-semibold text-gray-900">Create New Saved Search</h3>
                <Input label="Search Name" placeholder="e.g. Remote React Jobs" value={newSearchName} onChange={(e) => setNewSearchName(e.target.value)} required />
                <Input label="Keywords" placeholder="e.g. React, TypeScript" value={newSearchKeywords} onChange={(e) => setNewSearchKeywords(e.target.value)} required />
                <Input label="Location" placeholder="e.g. Remote, San Francisco" value={newSearchLocation} onChange={(e) => setNewSearchLocation(e.target.value)} />
                <div className="flex gap-2">
                  <Button type="submit" disabled={store.loadingSavedSearches}>{store.loadingSavedSearches ? "Saving..." : "Save Search"}</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowNewSearchForm(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          )}

          {store.loadingSavedSearches ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => <Card key={i} className="h-48 animate-pulse bg-gray-100"><div className="h-full" /></Card>)}
            </div>
          ) : store.savedSearches.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-500">No saved searches yet.</p>
              <Button onClick={() => setShowNewSearchForm(true)} className="mt-4">Create Your First Search</Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {store.savedSearches.map((search) => (
                <Card key={search.id} className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{search.name}</h4>
                    <p className="text-sm text-gray-500">Keywords: {search.keywords?.join(', ')} | Location: {search.location || "Any"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleRunSavedSearch(search)}>Run</Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteSavedSearch(search.id)}>Delete</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {store.activeTab === "matches" && (
        <div className="space-y-6">
          {store.resumes.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-500 mb-4">Upload a resume first to enable AI job matching.</p>
              <Button variant="secondary" onClick={() => navigate("/resumes")}>Go to Resumes</Button>
            </Card>
          ) : store.matchingJobs.length === 0 && !store.loadingJobs ? (
            <Card className="text-center py-12">
              <p className="text-gray-500">No matching jobs found. Try searching for jobs first.</p>
              <Button variant="secondary" onClick={() => store.setActiveTab("search")} className="mt-4">Search Jobs</Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {store.matchingJobs.map((job: any) => (
                <JobCard key={job.id} job={job} matchScore={store.matchScores[job.id]} resumes={store.resumes} onAnalyzeMatch={handleAnalyzeMatch} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Search Modal */}
      <Modal isOpen={showNewSearchForm} onClose={() => setShowNewSearchForm(false)} title="Create Saved Search" size="lg">
        <form onSubmit={handleCreateSavedSearch} className="space-y-4">
          <Input label="Search Name" placeholder="e.g. Remote React Jobs" value={newSearchName} onChange={(e) => setNewSearchName(e.target.value)} required />
          <Input label="Keywords" placeholder="e.g. React, TypeScript" value={newSearchKeywords} onChange={(e) => setNewSearchKeywords(e.target.value)} required />
          <Input label="Location" placeholder="e.g. Remote, San Francisco" value={newSearchLocation} onChange={(e) => setNewSearchLocation(e.target.value)} />
          <ModalFooter
            actions={[
              { label: "Cancel", variant: "secondary", onClick: () => setShowNewSearchForm(false) },
              { label: "Save Search", variant: "primary", onClick: handleCreateSavedSearch },
            ]}
          />
        </form>
      </Modal>
    </PageShell>
  );
}

const SOURCE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  linkedin: { bg: "bg-blue-50", text: "text-blue-700", border: "border-l-blue-500" },
  indeed: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-l-indigo-500" },
  glassdoor: { bg: "bg-green-50", text: "text-green-700", border: "border-l-green-500" },
  jsearch: { bg: "bg-violet-50", text: "text-violet-700", border: "border-l-violet-500" },
  company: { bg: "bg-amber-50", text: "text-amber-700", border: "border-l-amber-500" },
};

function JobCard({ job, matchScore, resumes, onAnalyzeMatch }: { job: any; matchScore?: number; resumes: any[]; onAnalyzeMatch: (job: any) => void }) {
  const matchPercent = matchScore || 0;
  const sourceStyle = SOURCE_COLORS[job.source] || SOURCE_COLORS.jsearch;

  return (
    <Link to={`/jobs/${job.id}`} className="block group">
      <Card className={`h-full border-l-[3px] ${sourceStyle.border} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${sourceStyle.bg} ${sourceStyle.text}`}>
            {job.source}
          </span>
          {job.isBookmarked && (
            <span className="text-amber-400 text-lg leading-none" title="Bookmarked">★</span>
          )}
        </div>

        <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {job.title}
        </h3>

        <p className="text-sm font-medium text-primary-600 mb-1">{job.companyName}</p>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 flex-wrap">
          {job.location && <span>{job.location}</span>}
          {job.location && job.jobType && <span className="text-gray-300">·</span>}
          {job.jobType && <span className="capitalize">{job.jobType}</span>}
          {job.workArrangement && job.workArrangement !== job.remoteType && (
            <>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 capitalize">{job.workArrangement}</span>
            </>
          )}
        </div>

        {(job.seniorityLevel || job.jobFunction) && (
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {job.seniorityLevel && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 capitalize">{job.seniorityLevel}</span>
            )}
            {job.jobFunction && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 capitalize">{job.jobFunction}</span>
            )}
          </div>
        )}

        {matchPercent > 0 && (
          <div className="mb-3">
            <ScoreBadge score={matchPercent} size="sm" variant="compact" />
          </div>
        )}

        {job.salaryMin && (
          <p className="text-sm font-semibold text-success mb-3">
            ${job.salaryMin.toLocaleString()} – ${job.salaryMax?.toLocaleString() || "N/A"}
            <span className="text-xs font-normal text-gray-400 ml-1">{job.salaryCurrency || "USD"}/yr</span>
          </p>
        )}

        {job.requiredTechnologies?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {job.requiredTechnologies.slice(0, 4).map((tech: string) => (
              <span key={tech} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[11px] font-medium">{tech}</span>
            ))}
            {job.requiredTechnologies.length > 4 && (
              <span className="px-2 py-0.5 text-gray-400 text-[11px]">+{job.requiredTechnologies.length - 4}</span>
            )}
          </div>
        )}

        {job.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {job.tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-medium">{tag}</span>
            ))}
            {job.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-400 text-[11px]">+{job.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <span className="text-[11px] text-gray-400 font-medium">
            {job.postedAt ? new Date(job.postedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Recent"}
          </span>
          <button
            type="button"
            className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              onAnalyzeMatch({ id: job.id, title: job.title, companyName: job.companyName, location: job.location, description: job.description });
            }}
          >
            AI Match
          </button>
        </div>
      </Card>
    </Link>
  );
}

