import type { ApplicationAnalyticsRequest, ApplicationCreateRequest, ApplicationStatusUpdateRequest, ApplicationUpdateRequest, BatchItemResponse, BehavioralBankRequest, BehavioralQuestionBank, BenefitsAnalysisRequest, BenefitsAnalysisResult, CaseStudyCreateRequest, CaseStudyDetail, CaseStudyGenerateRequest, CaseStudyListItem, CaseStudyUpdateRequest, CheatSheetRequest, ChecklistItemUpdateRequest, CommunicationLogCreateRequest, CompanyBriefing, CompanyBriefingRequest, CoverLetter, CoverLetterTemplate, CoverLetterTemplateApplyRequest, CoverLetterTemplateCreateRequest, CoverLetterTemplateUpdateRequest, DecisionCreateRequest, DecisionUpdateRequest, EquityCalculationRequest, EquityCalculationResult, Feedback, FeedbackCreateRequest, FeedbackUpdateRequest, First90DaysTracker, FollowUpEmail, FollowUpEmailCreateRequest, FollowUpEmailGenerateRequest, FollowUpEmailUpdateRequest, InterviewAnalyticsRequest, InterviewCheatSheet, InterviewerFeedback, InterviewNote, InterviewNoteCreateRequest, InterviewNoteUpdateRequest, InterviewPerformanceAnalytics, InterviewQuestionsResult, InterviewScheduleEntry, Job, JobDetailsResponse, JobListRequest, JobMatchResult, JobSearchRequest, JobSearchResult, LinkedInProfile, LinkedInProfileAnalysis, ManagerAlignment, ManagerAlignmentCreateRequest, MockInterviewCreateRequest, MockInterviewMessageRequest, MockInterviewSession, MultiJdResult, NegotiationCoach, NegotiationCoachCreateRequest, NetworkMap, NetworkMapCreateRequest, OfferComparisonCreateRequest, OfferComparisonItem, OfferComparisonUpdateRequest, OfferDecision, OnboardingChecklist, OnboardingChecklistCreateRequest, OnboardingPlan, OnboardingPlanCreateRequest, PanelInterview, PanelInterviewCreateRequest, PanelInterviewUpdateRequest, ProfileUpdateRequest, Project, Reference, ReferralUpsertRequest, ResignationLetter, ResignationLetterGenerateRequest, Resume, ResumeContentUpdateRequest, ResumeGenerateRequest, ResumeTailorRequest, ResumeTemplateSuggestionsResult, ResumeVersion, ResumeVersionCreateRequest, ResumeVersionUpdateRequest, SalaryRangeResult, SavedSearch, SavedSearchCreateRequest, SavedSearchUpdateRequest, ScheduleCreateRequest, ScheduleListRequest, ScheduleUpdateRequest, SkillGapResult, SkillRefresh, SkillRefreshCreateRequest, TailoredResumeResult, TechnicalAssessment, TechnicalAssessmentRequest, TrackerCreateRequest, TrackerUpdateRequest, UserUpdateRequest } from "types";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request<T>(
  path: string,
  options?: RequestInit & { isFormData?: boolean },
): Promise<T> {
  const headers: Record<string, string> = {};

  if (!options?.isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...headers,
      ...(options?.headers as Record<string, string> || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}

export const api = {
  // ========================================================================
  // RESUMES
  // ========================================================================
  resumes: {
    create: (formData: FormData) =>
      request<Resume>('/api/resumes', {
        method: 'POST',
        body: formData,
        isFormData: true,
      }),

    list: () => request<Resume[]>('/api/resumes'),

    get: (id: string) => request<Resume>(`/api/resumes/${id}`),

    delete: (id: string) =>
      request<void>(`/api/resumes/${id}`, { method: 'DELETE' }),

    updateContent: (id: string, body: ResumeContentUpdateRequest) =>
      request<Resume>(`/api/resumes/${id}/content`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    generate: (body: ResumeGenerateRequest) =>
      request<Resume>('/api/resumes/generate', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    analyze: (id: string) =>
      request<Feedback>(`/api/resumes/${id}/analyze`, { method: 'POST' }),

    coverLetter: (id: string, body: { companyName: string; hiringManager?: string; jobDescription?: string }) =>
      request<CoverLetter>(`/api/resumes/${id}/cover-letter`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    skillGap: (id: string, body: { jobDescription?: string }) =>
      request<SkillGapResult>(`/api/resumes/${id}/skill-gap`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    interviewQuestions: (id: string, body: { jobDescription?: string; questionCount?: number; focusAreas?: string }) =>
      request<InterviewQuestionsResult>(`/api/resumes/${id}/interview-questions`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    salaryEstimate: (id: string, body: { targetLocation?: string; yearsOfExperience?: string; targetIndustry?: string }) =>
      request<SalaryRangeResult>(`/api/resumes/${id}/salary-estimate`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    multiJd: (id: string, body: { jobEntries: Array<{ title: string; description: string }> }) =>
      request<MultiJdResult>(`/api/resumes/${id}/multi-jd`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    templateSuggestions: (id: string) =>
      request<ResumeTemplateSuggestionsResult>(`/api/resumes/${id}/template-suggestions`),

    getSkillGap: (id: string) =>
      request<SkillGapResult>(`/api/resumes/${id}/skill-gap`),

    getInterviewQuestions: (id: string) =>
      request<InterviewQuestionsResult>(`/api/resumes/${id}/interview-questions`),

    getSalaryEstimate: (id: string) =>
      request<SalaryRangeResult>(`/api/resumes/${id}/salary-estimate`),

    getTemplateSuggestions: (id: string) =>
      request<ResumeTemplateSuggestionsResult>(`/api/resumes/${id}/template-suggestions`),

    getTailoredResume: (id: string) =>
      request<TailoredResumeResult>(`/api/resumes/${id}/tailored-resume`),

    generateTailoredResume: (id: string, body: ResumeTailorRequest) =>
      request<TailoredResumeResult>(`/api/resumes/${id}/tailored-resume`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    createResumeVersion: (id: string, body: ResumeVersionCreateRequest) =>
      request<ResumeVersion>(`/api/resumes/${id}/versions`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    getResumeVersions: (id: string) =>
      request<ResumeVersion[]>(`/api/resumes/${id}/versions`),

    getResumeVersion: (versionId: string) =>
      request<ResumeVersion>(`/api/resumes/versions/${versionId}`),

    updateResumeVersion: (versionId: string, body: ResumeVersionUpdateRequest) =>
      request<ResumeVersion>(`/api/resumes/versions/${versionId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    deleteResumeVersion: (versionId: string) =>
      request<void>(`/api/resumes/versions/${versionId}`, { method: 'DELETE' }),

    setPrimaryResumeVersion: (versionId: string) =>
      request<ResumeVersion>(`/api/resumes/versions/${versionId}/primary`, { method: 'PATCH' }),

    getMultiJd: (id: string) =>
      request<MultiJdResult>(`/api/resumes/${id}/multi-jd`),

    getLatestCoverLetter: (id: string) =>
      request<CoverLetter>(`/api/resumes/${id}/cover-letter`),

    getTipFeedback: (id: string) =>
      request<Record<string, 'up' | 'down'>>(`/api/resumes/${id}/tip-feedback`),

    saveTipFeedback: (id: string, body: Record<string, 'up' | 'down'>) =>
      request<void>(`/api/resumes/${id}/tip-feedback`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    generateShareLink: (id: string) =>
      request<{ shareToken: string; shareUrl: string }>(`/api/resumes/${id}/share`, { method: 'POST' }),

    updateStatus: (id: string, body: { status: string }) =>
      request<Resume>(`/api/resumes/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
  },

  // ========================================================================
  // LINKEDIN
  // ========================================================================
  linkedin: {
    analyze: (body: { profileText: string; targetRole?: string }) =>
      request<LinkedInProfileAnalysis>('/api/linkedin/analyze', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    list: () => request<LinkedInProfile[]>('/api/linkedin'),

    get: (id: string) => request<LinkedInProfile>(`/api/linkedin/${id}`),

    delete: (id: string) =>
      request<void>(`/api/linkedin/${id}`, { method: 'DELETE' }),

    reanalyze: (id: string, body: { targetRole?: string }) =>
      request<LinkedInProfileAnalysis>(`/api/linkedin/${id}/reanalyze`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  // ========================================================================
  // COVER LETTER TEMPLATES
  // ========================================================================
  coverLetterTemplates: {
    create: (body: CoverLetterTemplateCreateRequest) =>
      request<CoverLetterTemplate>('/api/cover-letter-templates', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    list: () => request<CoverLetterTemplate[]>('/api/cover-letter-templates'),

    get: (id: string) => request<CoverLetterTemplate>(`/api/cover-letter-templates/${id}`),

    update: (id: string, body: CoverLetterTemplateUpdateRequest) =>
      request<CoverLetterTemplate>(`/api/cover-letter-templates/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    delete: (id: string) =>
      request<void>(`/api/cover-letter-templates/${id}`, { method: 'DELETE' }),

    apply: (id: string, body: CoverLetterTemplateApplyRequest) =>
      request<{ rendered: string }>(`/api/cover-letter-templates/${id}/apply`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    setDefault: (id: string) =>
      request<CoverLetterTemplate>(`/api/cover-letter-templates/${id}/default`, { method: 'PATCH' }),
  },

  // ========================================================================
  // REFERENCES
  // ========================================================================
  references: {
    create: (body: {
      name: string;
      title: string;
      company: string;
      email: string;
      phone?: string;
      relationship: string;
      yearsKnown?: number;
      notes?: string;
    }) =>
      request<Reference>('/api/references', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    list: () => request<Reference[]>('/api/references'),

    get: (id: string) => request<Reference>(`/api/references/${id}`),

    update: (id: string, body: {
      name?: string;
      title?: string;
      company?: string;
      email?: string;
      phone?: string;
      relationship?: string;
      yearsKnown?: number;
      notes?: string;
      status?: 'not_contacted' | 'contacted' | 'agreed' | 'declined';
    }) =>
      request<Reference>(`/api/references/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    delete: (id: string) =>
      request<void>(`/api/references/${id}`, { method: 'DELETE' }),

    updateStatus: (id: string, body: { status: 'not_contacted' | 'contacted' | 'agreed' | 'declined' }) =>
      request<Reference>(`/api/references/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
  },

  // ========================================================================
  // SHARE
  // ========================================================================
  share: {
    getReport: (token: string) =>
      request<{ id: string; type: string; title: string; data: unknown; createdAt: string }>(`/api/share/${token}`),
  },

  // ========================================================================
  // CASE STUDIES
  // ========================================================================
  caseStudy: {
    create: (body: CaseStudyCreateRequest) =>
      request<CaseStudyDetail>('/api/case-studies', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    list: () => request<CaseStudyListItem[]>('/api/case-studies'),

    get: (id: string) => request<CaseStudyDetail>(`/api/case-studies/${id}`),

    update: (id: string, body: CaseStudyUpdateRequest) =>
      request<CaseStudyDetail>(`/api/case-studies/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    delete: (id: string) =>
      request<void>(`/api/case-studies/${id}`, { method: 'DELETE' }),

    generateAI: (body: CaseStudyGenerateRequest) =>
      request<CaseStudyDetail>('/api/case-studies/generate', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  // ========================================================================
  // PORTFOLIO
  // ========================================================================
  portfolio: {
    list: () => request<Project[]>('/api/portfolio'),

    get: (id: string) => request<Project>(`/api/portfolio/${id}`),

    create: (body: {
      title: string;
      description: string;
      projectUrl?: string;
      githubUrl?: string;
      demoUrl?: string;
      technologies: string[];
      role?: string;
      startDate?: string;
      endDate?: string;
      isPublic?: boolean;
    }) =>
      request<Project>('/api/portfolio', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    update: (id: string, body: {
      title?: string;
      description?: string;
      projectUrl?: string;
      githubUrl?: string;
      demoUrl?: string;
      technologies?: string[];
      role?: string;
      startDate?: string;
      endDate?: string;
      isPublic?: boolean;
    }) =>
      request<Project>(`/api/portfolio/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    delete: (id: string) =>
      request<void>(`/api/portfolio/${id}`, { method: 'DELETE' }),
  },

  // ========================================================================
  // BATCHES
  // ========================================================================
  batches: {
    create: (formData: FormData) =>
      request<BatchItemResponse>('/api/batches', {
        method: 'POST',
        body: formData,
        isFormData: true,
      }),

    get: (id: string) => request<BatchItemResponse>(`/api/batches/${id}`),
  },

  // ========================================================================
  // JOBS
  // ========================================================================
  jobs: {
    search: (body: JobSearchRequest) => {
      const signal = AbortSignal.timeout(30000);
      return request<JobSearchResult>('/api/jobs/search', {
        method: 'POST',
        body: JSON.stringify(body),
        signal,
      });
    },

    list: (params?: JobListRequest) => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
      const query = searchParams.toString();
      return request<{ jobs: Job[]; pagination: JobSearchResult['pagination'] }>(
        `/api/jobs${query ? `?${query}` : ''}`,
      );
    },

    get: (id: string) => request<Job>(`/api/jobs/${id}`),

    getDetails: (id: string) =>
      request<JobDetailsResponse>(`/api/jobs/${id}/details`),

    toggleBookmark: (id: string) =>
      request<{ isBookmarked: boolean }>(`/api/jobs/${id}/bookmark`, { method: 'POST' }),

    addTags: (id: string, tags: string[]) =>
      request<Job>(`/api/jobs/${id}/tags`, {
        method: 'POST',
        body: JSON.stringify({ tags }),
      }),

    removeTag: (id: string, tag: string) =>
      request<Job>(`/api/jobs/${id}/tags/${encodeURIComponent(tag)}`, { method: 'DELETE' }),

    markAsApplied: (id: string) =>
      request<Job>(`/api/jobs/${id}/applied`, { method: 'POST' }),

    analyzeMatch: (jobId: string, resumeId: string) =>
      request<JobMatchResult>(`/api/jobs/${jobId}/match`, {
        method: 'POST',
        body: JSON.stringify({ resumeId }),
      }),

    batchMatch: (jobIds: string[], resumeId: string) =>
      request<JobMatchResult[]>(`/api/jobs/batch-match`, {
        method: 'POST',
        body: JSON.stringify({ jobIds, resumeId }),
      }),

    savedSearches: {
      create: (body: SavedSearchCreateRequest) =>
        request<SavedSearch>('/api/jobs/saved-searches', {
          method: 'POST',
          body: JSON.stringify(body),
        }),

      list: () => request<SavedSearch[]>('/api/jobs/saved-searches'),

      update: (id: string, body: SavedSearchUpdateRequest) =>
        request<SavedSearch>(`/api/jobs/saved-searches/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        }),

      delete: (id: string) =>
        request<void>(`/api/jobs/saved-searches/${id}`, { method: 'DELETE' }),

      run: (id: string) =>
        request<JobSearchResult>(`/api/jobs/saved-searches/${id}/run`, { method: 'POST' }),
    },

    isBookmarked: (jobIds: string[]) =>
      request<Record<string, boolean>>('/api/jobs/bookmarked', {
        method: 'POST',
        body: JSON.stringify({ jobIds }),
      }),

    clear: () =>
      request<void>('/api/jobs', { method: 'DELETE' }),
  },

  // ========================================================================
  // APPLICATIONS
  // ========================================================================
  applications: {
    create: (body: ApplicationCreateRequest) =>
      request<{ id: string; companyName: string; roleTitle: string; status: string; createdAt: string }>(
        '/api/applications',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
      ),

    list: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set('status', params.status);
      if (params?.search) sp.set('search', params.search);
      if (params?.page) sp.set('page', String(params.page));
      if (params?.limit) sp.set('limit', String(params.limit));
      const query = sp.toString();
      return request<{ applications: Array<{ id: string; companyName: string; roleTitle: string; status: string; appliedAt?: string; company?: { name: string } }>; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
        `/api/applications${query ? `?${query}` : ''}`,
      );
    },

    get: (id: string) =>
      request<{
        id: string;
        userId: string;
        companyName: string;
        roleTitle: string;
        status: string;
        appliedAt?: string;
        jobId?: string;
        resumeId?: string;
        coverLetterId?: string;
        referralContact?: string;
        notes?: string;
        nextSteps?: string;
        nextActionAt?: string;
        createdAt: string;
        updatedAt: string;
        communications?: Array<{
          id: string;
          applicationId: string;
          type: string;
          subject?: string;
          content: string;
          direction?: string;
          occurredAt: string;
          outcome?: string;
          createdAt: string;
          updatedAt: string;
        }>;
        referral?: {
          id: string;
          applicationId: string;
          employeeName: string;
          employeeEmail?: string;
          relationship?: string;
          status: string;
          notes?: string;
          requestedAt?: string;
          respondedAt?: string;
          createdAt: string;
          updatedAt: string;
        };
      }>(`/api/applications/${id}`),

    update: (id: string, body: ApplicationUpdateRequest) =>
      request<{ id: string; companyName: string; roleTitle: string; status: string; updatedAt: string }>(
        `/api/applications/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(body),
        },
      ),

    delete: (id: string) =>
      request<void>(`/api/applications/${id}`, { method: 'DELETE' }),

    updateStatus: (id: string, body: ApplicationStatusUpdateRequest) =>
      request<{ id: string; status: string }>(`/api/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    getComms: (id: string) =>
      request<Array<{
        id: string;
        type: string;
        subject?: string;
        content: string;
        direction?: string;
        occurredAt: string;
        outcome?: string;
        createdAt: string;
      }>>(`/api/applications/${id}/comms`),

    addComm: (id: string, body: CommunicationLogCreateRequest) =>
      request<{
        id: string;
        type: string;
        subject?: string;
        content: string;
        direction?: string;
        occurredAt: string;
        outcome?: string;
      }>(`/api/applications/${id}/comms`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    getReferral: (id: string) =>
      request<{
        id: string;
        employeeName: string;
        employeeEmail?: string;
        relationship?: string;
        status: string;
        notes?: string;
        requestedAt?: string;
        respondedAt?: string;
      }>(`/api/applications/${id}/referral`),

    upsertReferral: (id: string, body: ReferralUpsertRequest) =>
      request<{
        id: string;
        employeeName: string;
        employeeEmail?: string;
        relationship?: string;
        status: string;
        notes?: string;
        requestedAt?: string;
        respondedAt?: string;
      }>(`/api/applications/${id}/referral`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    analytics: (params?: ApplicationAnalyticsRequest) => {
      const sp = new URLSearchParams();
      if (params?.startDate) sp.set('startDate', params.startDate);
      if (params?.endDate) sp.set('endDate', params.endDate);
      const query = sp.toString();
      return request<{
        totalApplications: number;
        applicationsByStatus: Record<string, number>;
        applicationsByMonth: Array<{ month: string; count: number }>;
        topStrengths: [string, number][];
        topWeaknesses: [string, number][];
        conversionRate: number;
        averageTimeToOffer: number;
        interviewsByStage: Record<string, number>;
        sourceBreakdown: Record<string, number>;
        salaryOffers: Array<{ company: string; baseSalary: number; totalComp: number }>;
        timeline: Array<{ date: string; event: string; company: string }>;
      }>(`/api/applications/analytics${query ? `?${query}` : ''}`);
    },

    pipeline: () =>
      request<Array<{
        id: string;
        companyName: string;
        roleTitle: string;
        status: string;
        appliedAt?: string;
        nextActionAt?: string;
        company?: { name: string };
      }>>('/api/applications/pipeline'),
  },

  // ========================================================================
  // INTERVIEW PREP
  // ========================================================================
  interviewPrep: {
    // Company Briefing
    generateBriefing: (body: CompanyBriefingRequest) =>
      request<CompanyBriefing>('/api/interview-prep/briefing', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listBriefings: () =>
      request<Array<{ id: string; companyName: string; roleTitle: string; createdAt: string }>>(
        '/api/interview-prep/briefings',
      ),

    getBriefing: (id: string) =>
      request<CompanyBriefing>(`/api/interview-prep/briefing/${id}`),

    deleteBriefing: (id: string) =>
      request<void>(`/api/interview-prep/briefing/${id}`, { method: 'DELETE' }),

    // Technical Assessment
    generateTechnical: (body: TechnicalAssessmentRequest) =>
      request<TechnicalAssessment>('/api/interview-prep/technical', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listTechnicals: () =>
      request<Array<{ id: string; roleTitle: string; difficulty: string; createdAt: string }>>(
        '/api/interview-prep/technicals',
      ),

    getTechnical: (id: string) =>
      request<TechnicalAssessment>(`/api/interview-prep/technical/${id}`),

    deleteTechnical: (id: string) =>
      request<void>(`/api/interview-prep/technical/${id}`, { method: 'DELETE' }),

    // Behavioral Bank
    generateBehavioral: (body: BehavioralBankRequest) =>
      request<BehavioralQuestionBank>('/api/interview-prep/behavioral', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listBehaviorals: () =>
      request<Array<{ id: string; roleTitle: string; competencies: string[]; createdAt: string }>>(
        '/api/interview-prep/behaviorals',
      ),

    getBehavioral: (id: string) =>
      request<BehavioralQuestionBank>(`/api/interview-prep/behavioral/${id}`),

    deleteBehavioral: (id: string) =>
      request<void>(`/api/interview-prep/behavioral/${id}`, { method: 'DELETE' }),

    // Mock Interview
    createMockInterview: (body: MockInterviewCreateRequest) =>
      request<MockInterviewSession>('/api/interview-prep/mock-interview', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listMockInterviews: () =>
      request<Array<{ id: string; roleTitle: string; company?: string; status: string; totalQuestions: number; createdAt: string }>>(
        '/api/interview-prep/mock-interviews',
      ),

    getMockInterview: (id: string) =>
      request<MockInterviewSession>(`/api/interview-prep/mock-interview/${id}`),

    sendMockMessage: (id: string, body: MockInterviewMessageRequest) =>
      request<MockInterviewSession>(`/api/interview-prep/mock-interview/${id}/message`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    deleteMockInterview: (id: string) =>
      request<void>(`/api/interview-prep/mock-interview/${id}`, { method: 'DELETE' }),

    // Cheat Sheet
    generateCheatSheet: (body: CheatSheetRequest) =>
      request<InterviewCheatSheet>('/api/interview-prep/cheat-sheet', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listCheatSheets: () =>
      request<Array<{ id: string; companyName: string; roleTitle: string; createdAt: string }>>(
        '/api/interview-prep/cheat-sheets',
      ),

    getCheatSheet: (id: string) =>
      request<InterviewCheatSheet>(`/api/interview-prep/cheat-sheet/${id}`),

    deleteCheatSheet: (id: string) =>
      request<void>(`/api/interview-prep/cheat-sheet/${id}`, { method: 'DELETE' }),

    // Interview Scheduling
    createSchedule: (body: ScheduleCreateRequest) =>
      request<InterviewScheduleEntry>('/api/interview-prep/schedule', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listSchedule: (params?: ScheduleListRequest) => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set('status', params.status);
      if (params?.startDate) sp.set('startDate', params.startDate);
      if (params?.endDate) sp.set('endDate', params.endDate);
      const query = sp.toString();
      return request<InterviewScheduleEntry[]>(
        `/api/interview-prep/schedule${query ? `?${query}` : ''}`,
      );
    },

    getUpcoming: () =>
      request<InterviewScheduleEntry[]>('/api/interview-prep/schedule/upcoming'),

    getScheduleEntry: (id: string) =>
      request<InterviewScheduleEntry>(`/api/interview-prep/schedule/${id}`),

    updateSchedule: (id: string, body: ScheduleUpdateRequest) =>
      request<InterviewScheduleEntry>(`/api/interview-prep/schedule/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    deleteSchedule: (id: string) =>
      request<void>(`/api/interview-prep/schedule/${id}`, { method: 'DELETE' }),
  },

  // ========================================================================
  // INTERVIEW PROCESS
  // ========================================================================
  interviewProcess: {
    // Interview Notes
    createNote: (body: InterviewNoteCreateRequest) =>
      request<InterviewNote>('/api/interview-process/notes', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listNotes: (filters?: { companyName?: string; interviewType?: string }) => {
      const sp = new URLSearchParams();
      if (filters?.companyName) sp.set('companyName', filters.companyName);
      if (filters?.interviewType) sp.set('interviewType', filters.interviewType);
      const query = sp.toString();
      return request<InterviewNote[]>(
        `/api/interview-process/notes${query ? `?${query}` : ''}`,
      );
    },

    getNote: (id: string) => request<InterviewNote>(`/api/interview-process/notes/${id}`),

    updateNote: (id: string, body: InterviewNoteUpdateRequest) =>
      request<InterviewNote>(`/api/interview-process/notes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    deleteNote: (id: string) =>
      request<void>(`/api/interview-process/notes/${id}`, { method: 'DELETE' }),

    // Interviewer Feedback
    addFeedback: (noteId: string, body: FeedbackCreateRequest) =>
      request<InterviewerFeedback>(`/api/interview-process/notes/${noteId}/feedback`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listFeedbacks: (noteId: string) =>
      request<InterviewerFeedback[]>(`/api/interview-process/notes/${noteId}/feedback`),

    updateFeedback: (id: string, body: FeedbackUpdateRequest) =>
      request<InterviewerFeedback>(`/api/interview-process/feedback/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    deleteFeedback: (id: string) =>
      request<void>(`/api/interview-process/feedback/${id}`, { method: 'DELETE' }),

    // Follow-up Emails
    createFollowUpEmail: (body: FollowUpEmailCreateRequest) =>
      request<FollowUpEmail>('/api/interview-process/follow-up-emails', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listFollowUpEmails: (params?: { applicationId?: string; type?: string }) => {
      const sp = new URLSearchParams();
      if (params?.applicationId) sp.set('applicationId', params.applicationId);
      if (params?.type) sp.set('type', params.type);
      const query = sp.toString();
      return request<FollowUpEmail[]>(
        `/api/interview-process/follow-up-emails${query ? `?${query}` : ''}`,
      );
    },

    getFollowUpEmail: (id: string) => request<FollowUpEmail>(`/api/interview-process/follow-up-emails/${id}`),

    updateFollowUpEmail: (id: string, body: FollowUpEmailUpdateRequest) =>
      request<FollowUpEmail>(`/api/interview-process/follow-up-emails/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    deleteFollowUpEmail: (id: string) =>
      request<void>(`/api/interview-process/follow-up-emails/${id}`, { method: 'DELETE' }),

    generateFollowUpEmail: (body: FollowUpEmailGenerateRequest) =>
      request<FollowUpEmail>('/api/interview-process/follow-up-emails/generate', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    // Panel Interviews
    createPanelInterview: (body: PanelInterviewCreateRequest) =>
      request<PanelInterview>('/api/interview-process/panel-interviews', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listPanelInterviews: (params?: { status?: string; startDate?: string; endDate?: string }) => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set('status', params.status);
      if (params?.startDate) sp.set('startDate', params.startDate);
      if (params?.endDate) sp.set('endDate', params.endDate);
      const query = sp.toString();
      return request<PanelInterview[]>(
        `/api/interview-process/panel-interviews${query ? `?${query}` : ''}`,
      );
    },

    getPanelInterview: (id: string) => request<PanelInterview>(`/api/interview-process/panel-interviews/${id}`),

    updatePanelInterview: (id: string, body: PanelInterviewUpdateRequest) =>
      request<PanelInterview>(`/api/interview-process/panel-interviews/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    deletePanelInterview: (id: string) =>
      request<void>(`/api/interview-process/panel-interviews/${id}`, { method: 'DELETE' }),

    // Case Studies
    createCaseStudy: (body: CaseStudyCreateRequest) =>
      request<CaseStudyDetail>('/api/interview-process/case-studies', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listCaseStudies: () => request<CaseStudyListItem[]>('/api/interview-process/case-studies'),

    getCaseStudy: (id: string) => request<CaseStudyDetail>(`/api/interview-process/case-studies/${id}`),

    updateCaseStudy: (id: string, body: CaseStudyUpdateRequest) =>
      request<CaseStudyDetail>(`/api/interview-process/case-studies/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    deleteCaseStudy: (id: string) =>
      request<void>(`/api/interview-process/case-studies/${id}`, { method: 'DELETE' }),

    generateCaseStudy: (body: CaseStudyGenerateRequest) =>
      request<CaseStudyDetail>('/api/interview-process/case-studies/generate', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    // Analytics
    getAnalytics: (params?: InterviewAnalyticsRequest) => {
      const sp = new URLSearchParams();
      if (params?.startDate) sp.set('startDate', params.startDate);
      if (params?.endDate) sp.set('endDate', params.endDate);
      const query = sp.toString();
      return request<InterviewPerformanceAnalytics>(
        `/api/interview-process/analytics${query ? `?${query}` : ''}`,
      );
    },
  },

  // ========================================================================
  // OFFER NEGOTIATION
  // ========================================================================
  offerNegotiation: {
    // Offer Comparison
    createComparison: (body: OfferComparisonCreateRequest) =>
      request<OfferComparisonItem>('/api/offer-negotiation/comparisons', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listComparisons: () => request<OfferComparisonItem[]>('/api/offer-negotiation/comparisons'),

    getComparison: (id: string) => request<OfferComparisonItem>(`/api/offer-negotiation/comparisons/${id}`),

    deleteComparison: (id: string) =>
      request<void>(`/api/offer-negotiation/comparisons/${id}`, { method: 'DELETE' }),

    updateComparison: (id: string, body: OfferComparisonUpdateRequest) =>
      request<OfferComparisonItem>(`/api/offer-negotiation/comparisons/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    // Negotiation Coach
    createCoach: (body: NegotiationCoachCreateRequest) =>
      request<NegotiationCoach>('/api/offer-negotiation/coach', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listCoaches: () => request<NegotiationCoach[]>('/api/offer-negotiation/coach'),

    getCoach: (id: string) => request<NegotiationCoach>(`/api/offer-negotiation/coach/${id}`),

    deleteCoach: (id: string) =>
      request<void>(`/api/offer-negotiation/coach/${id}`, { method: 'DELETE' }),

    // Equity Calculator
    calculateEquity: (body: EquityCalculationRequest) =>
      request<EquityCalculationResult>('/api/offer-negotiation/equity', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    // Benefits Analyzer
    analyzeBenefits: (body: BenefitsAnalysisRequest) =>
      request<BenefitsAnalysisResult>('/api/offer-negotiation/benefits', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    // Decision Framework
    createDecision: (body: DecisionCreateRequest) =>
      request<OfferDecision>('/api/offer-negotiation/decision', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listDecisions: () => request<OfferDecision[]>('/api/offer-negotiation/decision'),

    getDecision: (id: string) => request<OfferDecision>(`/api/offer-negotiation/decision/${id}`),

    deleteDecision: (id: string) =>
      request<void>(`/api/offer-negotiation/decision/${id}`, { method: 'DELETE' }),

    updateDecision: (id: string, body: DecisionUpdateRequest) =>
      request<OfferDecision>(`/api/offer-negotiation/decision/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    // Resignation Letter
    generateResignationLetter: (body: ResignationLetterGenerateRequest) =>
      request<ResignationLetter>('/api/offer-negotiation/resignation', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listResignationLetters: () => request<ResignationLetter[]>('/api/offer-negotiation/resignation'),

    getResignationLetter: (id: string) => request<ResignationLetter>(`/api/offer-negotiation/resignation/${id}`),

    deleteResignationLetter: (id: string) =>
      request<void>(`/api/offer-negotiation/resignation/${id}`, { method: 'DELETE' }),
  },

  // ========================================================================
  // POST ONBOARDING
  // ========================================================================
  postOnboarding: {
    // Onboarding Plan
    createPlan: (body: OnboardingPlanCreateRequest) =>
      request<OnboardingPlan>('/api/post-onboarding/plans', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listPlans: () => request<OnboardingPlan[]>('/api/post-onboarding/plans'),

    getPlan: (id: string) => request<OnboardingPlan>(`/api/post-onboarding/plans/${id}`),

    deletePlan: (id: string) =>
      request<void>(`/api/post-onboarding/plans/${id}`, { method: 'DELETE' }),

    // Onboarding Checklist
    createChecklist: (body: OnboardingChecklistCreateRequest) =>
      request<OnboardingChecklist>('/api/post-onboarding/checklists', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listChecklists: () => request<OnboardingChecklist[]>('/api/post-onboarding/checklists'),

    getChecklist: (id: string) => request<OnboardingChecklist>(`/api/post-onboarding/checklists/${id}`),

    updateChecklistItem: (id: string, itemId: string, body: ChecklistItemUpdateRequest) =>
      request<OnboardingChecklist>(`/api/post-onboarding/checklists/${id}/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    deleteChecklist: (id: string) =>
      request<void>(`/api/post-onboarding/checklists/${id}`, { method: 'DELETE' }),

    // Manager Alignment
    createAlignment: (body: ManagerAlignmentCreateRequest) =>
      request<ManagerAlignment>('/api/post-onboarding/alignments', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listAlignments: () => request<ManagerAlignment[]>('/api/post-onboarding/alignments'),

    getAlignment: (id: string) => request<ManagerAlignment>(`/api/post-onboarding/alignments/${id}`),

    deleteAlignment: (id: string) =>
      request<void>(`/api/post-onboarding/alignments/${id}`, { method: 'DELETE' }),

    // Network Map
    createNetwork: (body: NetworkMapCreateRequest) =>
      request<NetworkMap>('/api/post-onboarding/network', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listNetworks: () => request<NetworkMap[]>('/api/post-onboarding/network'),

    getNetwork: (id: string) => request<NetworkMap>(`/api/post-onboarding/network/${id}`),

    deleteNetwork: (id: string) =>
      request<void>(`/api/post-onboarding/network/${id}`, { method: 'DELETE' }),

    // Skill Refresh
    createSkill: (body: SkillRefreshCreateRequest) =>
      request<SkillRefresh>('/api/post-onboarding/skills', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listSkills: () => request<SkillRefresh[]>('/api/post-onboarding/skills'),

    getSkill: (id: string) => request<SkillRefresh>(`/api/post-onboarding/skills/${id}`),

    deleteSkill: (id: string) =>
      request<void>(`/api/post-onboarding/skills/${id}`, { method: 'DELETE' }),

    // First 90 Days Tracker
    createTracker: (body: TrackerCreateRequest) =>
      request<First90DaysTracker>('/api/post-onboarding/tracker', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    listTrackers: () => request<First90DaysTracker[]>('/api/post-onboarding/tracker'),

    getTracker: (id: string) => request<First90DaysTracker>(`/api/post-onboarding/tracker/${id}`),

    updateTracker: (id: string, body: TrackerUpdateRequest) =>
      request<First90DaysTracker>(`/api/post-onboarding/tracker/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    deleteTracker: (id: string) =>
      request<void>(`/api/post-onboarding/tracker/${id}`, { method: 'DELETE' }),
  },

  // ========================================================================
  // PROFILE
  // ========================================================================
  profile: {
    get: () =>
      request<{
        user: { id: string; name: string; email: string; image?: string; headline?: string; summary?: string; location?: string; linkedinUrl?: string; githubUrl?: string; websiteUrl?: string; phone?: string; onboardingCompleted: boolean };
        profile: { id: string; userId: string; education?: Array<{ degree: string; field?: string; school: string; location?: string; startDate?: string; endDate?: string; gpa?: string }>; experience?: Array<{ title: string; company: string; location?: string; startDate: string; endDate?: string; current?: boolean; highlights?: string[]; description?: string }>; projects?: Array<{ name: string; description: string; technologies: string[]; url?: string; startDate?: string; endDate?: string }>; skills: string[]; certifications?: Array<{ name: string; issuer?: string; date?: string; url?: string }>; languages: string[] };
        completion: { percentage: number; missingFields: string[] };
      }>('/api/profile'),

    update: (data: ProfileUpdateRequest) =>
      request<{ id: string; userId: string; education?: Array<{ degree: string; field?: string; school: string; location?: string; startDate?: string; endDate?: string; gpa?: string }>; experience?: Array<{ title: string; company: string; location?: string; startDate: string; endDate?: string; current?: boolean; highlights?: string[]; description?: string }>; projects?: Array<{ name: string; description: string; technologies: string[]; url?: string; startDate?: string; endDate?: string }>; skills: string[]; certifications?: Array<{ name: string; issuer?: string; date?: string; url?: string }>; languages: string[] }>('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    updateUser: (data: UserUpdateRequest) =>
      request<{ id: string; name: string; email: string; image?: string; headline?: string; summary?: string; location?: string; linkedinUrl?: string; githubUrl?: string; websiteUrl?: string; phone?: string; onboardingCompleted: boolean }>('/api/profile/user', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    completeOnboarding: () =>
      request<{ success: boolean; message: string }>('/api/profile/complete-onboarding', { method: 'POST' }),
  },
};

export function getUploadUrl(endpoint: string): string {
  return `${API_BASE}${endpoint}`;
}
