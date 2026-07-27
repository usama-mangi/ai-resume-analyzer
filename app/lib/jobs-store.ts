import { create } from 'zustand';
import { api } from '~/lib/api';
import type { SavedSearch, JobMatchResult, ExternalJobPosting } from 'types';

interface ResumeListItem {
  id: string;
  jobTitle?: string;
  companyName?: string;
}

interface JobsState {
  // Search params
  searchKeywords: string;
  searchLocation: string;
  selectedSources: string[];
  selectedJobTypes: string[];
  selectedRemoteTypes: string[];
  selectedExperienceLevels: string[];
  selectedJobFunctions: string[];

  // UI state
  activeTab: 'search' | 'saved' | 'matches' | 'bookmarked';
  filtersOpen: boolean;
  hasSearched: boolean;

  // Results
  jobs: ExternalJobPosting[];
  loadingJobs: boolean;
  pagination: { page: number; limit: number; total: number; totalPages: number };

  // Saved searches
  savedSearches: SavedSearch[];
  loadingSavedSearches: boolean;

  // Resumes
  resumes: ResumeListItem[];

  // Match
  matchAnalysis: JobMatchResult | null;
  matchAnalysisJob: ExternalJobPosting | null;
  matchAnalysisLoading: boolean;
  matchScores: Record<string, number>;
  matchingJobs: ExternalJobPosting[];

  // Actions — search params
  setSearchKeywords: (v: string) => void;
  setSearchLocation: (v: string) => void;
  setSelectedSources: (v: string[]) => void;
  setSelectedJobTypes: (v: string[]) => void;
  setSelectedRemoteTypes: (v: string[]) => void;
  setSelectedExperienceLevels: (v: string[]) => void;
  setSelectedJobFunctions: (v: string[]) => void;

  // Actions — UI
  setActiveTab: (v: 'search' | 'saved' | 'matches' | 'bookmarked') => void;
  setFiltersOpen: (v: boolean) => void;

  // Actions — data
  loadJobs: (signal?: AbortSignal) => Promise<void>;
  loadSavedSearches: () => Promise<void>;
  loadResumes: () => Promise<void>;
  search: () => Promise<void>;
  goPage: (page: number) => void;
  toggleBookmark: (jobId: string) => Promise<void>;
  markAsApplied: (jobId: string) => Promise<void>;
  analyzeMatch: (jobId: string, resumeId: string) => Promise<void>;
  setMatchAnalysis: (v: JobMatchResult | null) => void;
  setMatchAnalysisJob: (v: ExternalJobPosting | null) => void;

  // Reset
  resetSearch: () => void;
}

const INITIAL_PARAMS = {
  searchKeywords: '',
  searchLocation: '',
  selectedSources: ['linkedin', 'indeed', 'glassdoor', 'company'],
  selectedJobTypes: [],
  selectedRemoteTypes: [],
  selectedExperienceLevels: [],
  selectedJobFunctions: [],
};

export const useJobsStore = create<JobsState>((set, get) => ({
  // Search params
  ...INITIAL_PARAMS,

  // UI state
  activeTab: 'search',
  filtersOpen: false,
  hasSearched: false,

  // Results
  jobs: [],
  loadingJobs: false,
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },

  // Saved searches
  savedSearches: [],
  loadingSavedSearches: false,

  // Resumes
  resumes: [],

  // Match
  matchAnalysis: null,
  matchAnalysisJob: null,
  matchAnalysisLoading: false,
  matchScores: {},
  matchingJobs: [],

  // Actions — search params
  setSearchKeywords: (v) => set({ searchKeywords: v }),
  setSearchLocation: (v) => set({ searchLocation: v }),
  setSelectedSources: (v) => set({ selectedSources: v }),
  setSelectedJobTypes: (v) => set({ selectedJobTypes: v }),
  setSelectedRemoteTypes: (v) => set({ selectedRemoteTypes: v }),
  setSelectedExperienceLevels: (v) => set({ selectedExperienceLevels: v }),
  setSelectedJobFunctions: (v) => set({ selectedJobFunctions: v }),

  // Actions — UI
  setActiveTab: (v) => set({ activeTab: v }),
  setFiltersOpen: (v) => set({ filtersOpen: v }),

  // Actions — data
  search: async () => {
    const s = get();
    set({ hasSearched: true, loadingJobs: true, pagination: { ...s.pagination, page: 1 }, matchScores: {}, matchingJobs: [] });
    try {
      // Hit JSearch API to fetch and save new jobs
      const data = await api.jobs.search({
        keywords: s.searchKeywords || undefined,
        location: s.searchLocation || undefined,
        jobTypes: s.selectedJobTypes.length > 0 ? s.selectedJobTypes : undefined,
        remoteTypes: s.selectedRemoteTypes.length > 0 ? s.selectedRemoteTypes : undefined,
        experienceLevels: s.selectedExperienceLevels.length > 0 ? s.selectedExperienceLevels : undefined,
        jobFunctions: s.selectedJobFunctions.length > 0 ? s.selectedJobFunctions : undefined,
        sources: s.selectedSources.length > 0 ? s.selectedSources : undefined,
        page: 1,
        limit: s.pagination.limit,
      });

      let jobsWithBookmark = data.jobs;
      try {
        const validIds = data.jobs.map((j) => j.id).filter(Boolean);
        const isBookmarked = validIds.length > 0 ? await api.jobs.isBookmarked(validIds) : {};
        jobsWithBookmark = data.jobs.map((job) => ({
          ...job,
          isBookmarked: job.id ? (isBookmarked[job.id] || false) : false,
        }));
      } catch {
        // Bookmark status is cosmetic
      }

      set({ jobs: jobsWithBookmark, pagination: data.pagination });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Failed to search jobs:', err);
    }
    set({ loadingJobs: false });
  },

  goPage: async (page: number) => {
    const s = get();
    set({ pagination: { ...s.pagination, page }, loadingJobs: true, matchScores: {}, matchingJobs: [] });
    try {
      // Load from DB for pagination (no re-fetching from JSearch)
      const data = await api.jobs.list({
        page,
        limit: s.pagination.limit,
      });

      let jobsWithBookmark = data.jobs;
      try {
        const validIds = data.jobs.map((j) => j.id).filter(Boolean);
        const isBookmarked = validIds.length > 0 ? await api.jobs.isBookmarked(validIds) : {};
        jobsWithBookmark = data.jobs.map((job) => ({
          ...job,
          isBookmarked: job.id ? (isBookmarked[job.id] || false) : false,
        }));
      } catch {
        // Bookmark status is cosmetic
      }

      set({ jobs: jobsWithBookmark, pagination: data.pagination });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Failed to load jobs page:', err);
    }
    set({ loadingJobs: false });
  },

  loadJobs: async (signal?: AbortSignal) => {
    const s = get();
    if (!s.hasSearched) return;

    set({ loadingJobs: true });
    try {
      // Load from DB — search results are already persisted there
      const data = await api.jobs.list({
        page: s.pagination.page,
        limit: s.pagination.limit,
      });

      // Fetch bookmark status (non-blocking — don't let failure prevent job display)
      let jobsWithBookmark = data.jobs;
      try {
        const validIds = data.jobs.map((j) => j.id).filter(Boolean);
        const isBookmarked = validIds.length > 0 ? await api.jobs.isBookmarked(validIds) : {};
        jobsWithBookmark = data.jobs.map((job) => ({
          ...job,
          isBookmarked: job.id ? (isBookmarked[job.id] || false) : false,
        }));
      } catch {
        // Bookmark status is cosmetic — show jobs without it
      }

      set({ jobs: jobsWithBookmark, pagination: data.pagination });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Failed to load jobs:', err);
    }
    set({ loadingJobs: false });
  },

  loadSavedSearches: async () => {
    set({ loadingSavedSearches: true });
    try {
      const data = await api.jobs.savedSearches.list();
      set({ savedSearches: data });
    } catch (err) {
      console.error('Failed to load saved searches:', err);
    }
    set({ loadingSavedSearches: false });
  },

  loadResumes: async () => {
    try {
      const data = await api.resumes.list();
      set({ resumes: data.map((r) => ({ id: r.id, jobTitle: r.jobTitle, companyName: r.companyName })) });
    } catch (err) {
      console.error('Failed to load resumes:', err);
    }
  },

  toggleBookmark: async (jobId: string) => {
    try {
      const updated = await api.jobs.toggleBookmark(jobId);
      set({ jobs: get().jobs.map((j) => (j.id === jobId ? { ...j, isBookmarked: updated.isBookmarked } : j)) });
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  },

  markAsApplied: async (jobId: string) => {
    try {
      const updated = await api.jobs.markAsApplied(jobId);
      set({ jobs: get().jobs.map((j) => (j.id === jobId ? updated : j)) });
    } catch (err) {
      console.error('Failed to mark as applied:', err);
    }
  },

  analyzeMatch: async (jobId: string, resumeId: string) => {
    set({ matchAnalysisLoading: true });
    try {
      const result = await api.jobs.analyzeMatch(jobId, resumeId);
      set({ matchAnalysis: result });
    } catch (err) {
      console.error('Failed to analyze match:', err);
    }
    set({ matchAnalysisLoading: false });
  },

  setMatchAnalysis: (v) => set({ matchAnalysis: v }),
  setMatchAnalysisJob: (v) => set({ matchAnalysisJob: v }),

  resetSearch: () => {
    set({
      ...INITIAL_PARAMS,
      jobs: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      hasSearched: false,
      matchAnalysis: null,
      matchAnalysisJob: null,
      matchScores: {},
      matchingJobs: [],
    });
  },
}));
