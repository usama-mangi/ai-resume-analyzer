// Shared type definitions for the backend
// These mirror the frontend types in /types/index.d.ts

import { Prisma } from '@prisma/client';

// ============================================================================
// User & Auth Types
// ============================================================================

export interface AuthUser {
  userId: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified?: boolean;
}

export interface BetterAuthRequest extends Request {
  user?: AuthUser;
}

// ============================================================================
// Resume Types
// ============================================================================

export interface ResumeBasics {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  url?: string;
  summary?: string;
  headline?: string;
}

export interface ResumeExperience {
  id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  highlights?: string[];
  bullets?: string[];
  description?: string;
}

export interface ResumeEducation {
  id?: string;
  degree: string;
  field?: string;
  school: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

export interface ResumeSkill {
  name: string;
  level?: string;
  category?: string;
}

export interface ResumeProject {
  id?: string;
  name: string;
  description?: string;
  technologies?: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
  bullets?: string[];
}

export interface ResumeCertification {
  name: string;
  issuer?: string;
  date?: string;
  url?: string;
}

export interface ResumeLanguage {
  language: string;
  proficiency?: string;
}

export interface GeneratedResume {
  basics: ResumeBasics;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  certifications?: ResumeCertification[];
  languages?: ResumeLanguage[];
}

export interface ResumeParseResult {
  text: string;
  sections: Record<string, string>;
  format: 'pdf' | 'docx' | 'txt' | 'html' | 'linkedin';
}

export interface TailoredResumeResult {
  tailoredContent: GeneratedResume;
  changes: {
    added: string[];
    removed: string[];
    modified: string[];
  };
  keywordMatches: string[];
  keywordGaps: string[];
  matchScore: number;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  name: string;
  roleType: string;
  content: GeneratedResume;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Feedback Types
// ============================================================================

export interface FeedbackTip {
  type: 'good' | 'improve';
  tip: string;
  explanation: string;
}

export interface ATSTip {
  tip: string;
}

export interface FeedbackCategory {
  score: number;
  tips: FeedbackTip[];
}

export interface ATSFeedback {
  score: number;
  tips: ATSTip[];
}

export interface Feedback {
  overallScore: number;
  ATS: ATSFeedback;
  toneAndStyle: FeedbackCategory;
  content: FeedbackCategory;
  structure: FeedbackCategory;
  skills: FeedbackCategory;
}

// ============================================================================
// Job Types
// ============================================================================

export interface ExternalJobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  jobType?: string;
  remoteType?: string;
  experienceLevel?: string;
  source: string;
  sourceUrl: string;
  postedAt?: string;
  workArrangement?: string;
  seniorityLevel?: string;
  requiredExperienceYears?: number;
  requiredTechnologies?: string[];
  preferredTechnologies?: string[];
  jobFunction?: string;
  industry?: string;
  educationRequired?: string;
  visaSponsorship?: boolean;
  relocationRequired?: boolean;
  relocationAssistance?: boolean;
  contractDuration?: string;
  startDate?: string;
  hasManagementResponsibilities?: boolean;
  aiMlInvolved?: boolean;
  benefitsExtended?: string[];
  softSkills?: string[];
}

export interface Job {
  id: string;
  userId: string;
  title: string;
  companyName: string;
  location?: string;
  description?: string;
  requirements?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  jobType?: string;
  remoteType?: string;
  experienceLevel?: string;
  source: string;
  sourceUrl: string;
  postedAt?: Date;
  appliedAt?: Date;
  isBookmarked: boolean;
  tags: string[];
  // JSearch enrichment fields
  workArrangement?: string;
  seniorityLevel?: string;
  requiredExperienceYears?: number;
  requiredTechnologies: string[];
  preferredTechnologies: string[];
  jobFunction?: string;
  industry?: string;
  educationRequired?: string;
  visaSponsorship?: boolean;
  relocationRequired?: boolean;
  relocationAssistance?: boolean;
  contractDuration?: string;
  startDate?: string;
  hasManagementResponsibilities?: boolean;
  aiMlInvolved?: boolean;
  benefitsExtended: string[];
  softSkills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JobSearchResult {
  data: ExternalJobPosting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface JobDetailsResponse {
  job: Job;
  skillMatch: {
    percentage: number;
    matchedSkills: string[];
    missingSkills: string[];
  };
  skillGap: SkillGapResult;
  resumeId: string | null;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  keywords: string[];
  location?: string;
  jobTypes: string[];
  remoteTypes: string[];
  experienceLevels: string[];
  sources: string[];
  isActive: boolean;
  lastRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobMatchResult {
  jobId: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  resumeId: string;
}

// ============================================================================
// Skill Gap Types
// ============================================================================

export interface SkillGapRecommendation {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  resources: string[];
  estimatedHours: number;
  reason: string;
}

export interface SkillGapItem {
  skill: string;
  importance: number;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  recommendation: SkillGapRecommendation;
}

export interface SkillGapResult {
  overallMatch: number;
  items: SkillGapItem[];
  recommendations: SkillGapRecommendation[];
  summary: string;
}

// ============================================================================
// Interview Question Types
// ============================================================================

export interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sampleAnswer?: string;
}

export interface InterviewQuestionsResult {
  questions: InterviewQuestion[];
  categories: string[];
  totalCount: number;
}

// ============================================================================
// Salary Types
// ============================================================================

export interface SalaryPercentile {
  percentile: string;
  salary: number;
}

export interface SalaryRangeResult {
  role: string;
  location: string;
  experienceLevel: string;
  percentiles: SalaryPercentile[];
  currency: string;
  period: string;
  dataPoints: number;
  confidence: string;
  source: string;
  notes?: string;
}

// ============================================================================
// Multi-JD Comparison Types
// ============================================================================

export interface MultiJdEntry {
  jobId: string;
  title: string;
  company: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface MultiJdComparison {
  jobId: string;
  title: string;
  company: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
}

export interface MultiJdResult {
  resumeId: string;
  comparisons: MultiJdComparison[];
  bestMatch: MultiJdComparison | null;
  summary: string;
}

// ============================================================================
// Template Suggestions Types
// ============================================================================

export interface TemplateSuggestion {
  name: string;
  description: string;
  atsScore: number;
  pros: string[];
  cons: string[];
  bestFor: string[];
}

export interface ResumeTemplateSuggestionsResult {
  recommendations: TemplateSuggestion[];
  customizationTips: string[];
}

// ============================================================================
// Shared Report Types
// ============================================================================

export interface SharedReport {
  id: string;
  type: 'resume_analysis' | 'job_match' | 'skill_gap' | 'salary_estimate' | 'interview_questions' | 'multi_jd' | 'template_suggestions';
  title: string;
  data: unknown;
  createdAt: string;
  expiresAt?: string;
}

// ============================================================================
// LinkedIn Types
// ============================================================================

export interface ExperienceImprovement {
  original: string;
  improved: string;
  reason: string;
}

export interface SkillRecommendation {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export interface ContentStrategyItem {
  section: string;
  action: string;
  reason: string;
}

export interface LinkedInProfileAnalysis {
  score: number;
  headline: { current: string; suggested: string; reason: string };
  about: { current: string; suggested: string; reason: string };
  experienceImprovements: ExperienceImprovement[];
  skillRecommendations: SkillRecommendation[];
  contentStrategy: ContentStrategyItem[];
  keywords: string[];
}

export interface LinkedInProfile {
  id: string;
  userId: string;
  profileUrl?: string;
  profileText?: string;
  targetRole?: string;
  analysisResult?: LinkedInProfileAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Cover Letter Types
// ============================================================================

export interface CoverLetterTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  template: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoverLetter {
  id: string;
  resumeId: string;
  content: string;
  companyName: string;
  hiringManager?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Reference Types
// ============================================================================

export interface Reference {
  id: string;
  userId: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  relationship: string;
  yearsKnown?: number;
  notes?: string;
  status: 'not_contacted' | 'contacted' | 'agreed' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Portfolio Types
// ============================================================================

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  projectUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  technologies: string[];
  role?: string;
  startDate?: Date;
  endDate?: Date;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Interview Prep Types
// ============================================================================

export interface CompanyBriefing {
  overview: {
    name: string;
    industry: string;
    size: string;
    headquarters: string;
    founded: number;
    mission: string;
    description: string;
  };
  products: Array<{
    name: string;
    description: string;
    category: string;
  }>;
  competitors: Array<{
    name: string;
    description: string;
    differentiator: string;
  }>;
  culture: {
    values: string[];
    workEnvironment: string;
    benefits: string[];
    diversityInclusion: string;
  };
  recentNews: Array<{
    title: string;
    source: string;
    date: string;
    url: string;
    summary: string;
  }>;
  financials?: {
    revenue?: number;
    funding?: number;
    valuation?: number;
    publicStatus: string;
  };
  interviewInsights: {
    process: string[];
    commonQuestions: string[];
    difficulty: string;
    tips: string[];
  };
  roleSpecific: {
    keySkills: string[];
    challenges: string[];
    expectations: string[];
  };
}

export interface TechnicalAssessment {
  difficulty: 'junior' | 'mid' | 'senior' | 'staff';
  challenges: Array<{
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    timeLimit: number;
    starterCode?: string;
    solution?: string;
    testCases: Array<{ input: string; expectedOutput: string }>;
    hints: string[];
    learningObjectives: string[];
  }>;
  systemDesign?: {
    prompt: string;
    requirements: string[];
    keyComponents: string[];
    scalabilityConsiderations: string[];
    tradeoffs: string[];
  };
  takeHome?: {
    prompt: string;
    requirements: string[];
    deliverables: string[];
    timeEstimate: number;
    evaluationCriteria: string[];
  };
}

export interface BehavioralSTARQuestion {
  competency: string;
  question: string;
  starTemplate: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  followUpQuestions: string[];
  whatInterviewerLooksFor: string[];
}

export interface BehavioralQuestionBank {
  roleTitle: string;
  competencies: string[];
  questions: BehavioralSTARQuestion[];
  preparationTips: string[];
  summary: string;
}

export interface MockInterviewMessage {
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: string;
  questionNumber?: number;
  suggestedTopics?: string[];
  feedback?: {
    rating: number;
    strengths: string[];
    improvements: string[];
  };
}

export interface MockInterviewSession {
  id: string;
  userId: string;
  applicationId?: string;
  roleTitle: string;
  company?: string;
  messages: MockInterviewMessage[];
  status: 'in_progress' | 'completed';
  overallFeedback?: {
    overallRating: number;
    strengths: string[];
    areasForImprovement: string[];
    detailedFeedback: string;
    hireRecommendation: 'strong_hire' | 'hire' | 'neutral' | 'no_hire' | 'strong_no_hire';
  };
  topicsCovered: string[];
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewCheatSheet {
  companyName: string;
  roleTitle: string;
  talkingPoints: string[];
  questionsToAsk: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
    source: string;
  };
  keyFacts: string[];
  STARStories: Array<{
    competency: string;
    story: string;
  }>;
  technicalKeywords: string[];
  companyValues: string[];
}

export interface InterviewScheduleEntry {
  id: string;
  userId: string;
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  interviewType: 'phone_screen' | 'technical' | 'behavioral' | 'panel' | 'onsite' | 'virtual' | 'other';
  scheduledAt: Date;
  duration: number;
  timezone: string;
  location?: string;
  meetingLink?: string;
  interviewerNames: string[];
  prepTimeBlock?: number;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  reminders: Array<{
    type: string;
    minutesBefore: number;
    sent: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewPrep {
  id: string;
  userId: string;
  type: 'company_briefing' | 'cheat_sheet';
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  data: CompanyBriefing | InterviewCheatSheet;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Interview Process Types
// ============================================================================

export interface InterviewNote {
  id: string;
  userId: string;
  applicationId?: string;
  scheduleId?: string;
  companyName: string;
  roleTitle: string;
  interviewType: string;
  roundNumber: number;
  questionsAsked: Array<{
    question: string;
    category: string;
    myAnswer?: string;
    rating?: number;
  }>;
  selfRating: number;
  strengths: string[];
  weaknesses: string[];
  followUpItems: string[];
  generalNotes?: string;
  interviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
  feedbacks?: InterviewerFeedback[];
  followUpEmails?: FollowUpEmail[];
}

export interface InterviewerFeedback {
  id: string;
  userId: string;
  interviewNoteId: string;
  interviewerName: string;
  interviewerRole?: string;
  rating: number;
  feedbackText: string;
  recommendation: 'strong_hire' | 'hire' | 'neutral' | 'no_hire' | 'strong_no_hire';
  strengths: string[];
  concerns: string[];
  sharedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowUpEmail {
  id: string;
  userId: string;
  applicationId?: string;
  interviewNoteId?: string;
  type: 'thank_you' | 'check_in' | 'additional_materials' | 'custom';
  subject: string;
  body: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PanelInterview {
  id: string;
  userId: string;
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  scheduledAt: Date;
  duration: number;
  location?: string;
  meetingLink?: string;
  interviewers: Array<{
    name: string;
    role?: string;
    email?: string;
  }>;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseStudy {
  id: string;
  userId: string;
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  title: string;
  description?: string;
  slides: Array<{
    title: string;
    content: string;
    notes?: string;
    layout?: string;
  }>;
  aiAssisted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewPerformanceAnalytics {
  totalInterviews: number;
  averageSelfRating: number;
  byType: Record<string, { count: number; avgRating: number }>;
  byCompany: Record<string, { count: number; avgRating: number }>;
  ratingTrend: Array<{ date: string; rating: number; company: string; type: string }>;
  strengthFrequency: Record<string, number>;
  weaknessFrequency: Record<string, number>;
  feedbackSummary: {
    totalFeedbacks: number;
    averageRating: number;
    recommendationCounts: Record<string, number>;
  } | null;
  recentNotes: InterviewNote[];
}

// ============================================================================
// Offer & Negotiation Types
// ============================================================================

export interface OfferItem {
  id: string;
  name: string;
  baseSalary: number;
  equity?: number;
  equityType?: string;
  bonus?: number;
  signOn?: number;
  location: string;
  remotePolicy: string;
  benefits: string[];
  growthOpportunities?: string;
  companyCulture?: string;
  pto?: number;
}

export interface OfferComparisonItem {
  id: string;
  userId: string;
  name: string;
  offers: OfferItem[];
  weights: {
    compensation: number;
    growth: number;
    culture: number;
    workLifeBalance: number;
    location: number;
    benefits: number;
  };
  scores: Array<{
    offerName: string;
    totalScore: number;
    criterionScores: Array<{
      criterion: string;
      score: number;
      maxScore: number;
      notes: string;
    }>;
  }>;
  recommendation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NegotiationCoach {
  id: string;
  userId: string;
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  offerDetails: {
    baseSalary: number;
    equity?: number;
    equityType?: string;
    bonus?: number;
    signOn?: number;
    benefits?: string[];
  };
  marketData?: {
    percentiles: {
      p10: number;
      p25: number;
      p50: number;
      p75: number;
      p90: number;
    };
    currency: string;
    period: string;
    summary: string;
  };
  strategy?: {
    overallApproach: string;
    anchorPoint: number;
    targetPoint: number;
    walkAwayPoint: number;
    keyLeveragePoints: string[];
    timingAdvice: string;
    riskAssessment: string;
    stepByStep: Array<{
      step: number;
      action: string;
      script: string;
      tip: string;
    }>;
  };
  emailTemplates?: Array<{
    type: string;
    subject: string;
    body: string;
  }>;
  scripts?: Array<{
    scenario: string;
    opening: string;
    keyPoints: string[];
    closing: string;
    handlingObjections: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquityCalculationResult {
  summary: string;
  scenarios: Array<{
    name: string;
    description: string;
    exitValuation: number;
    totalValue: number;
    annualValue: number;
    monthlyValue: number;
    afterTaxEstimate: number;
    netAnnual: number;
  }>;
  vestingSchedule: Array<{
    year: number;
    vestedShares: number;
    cumulativeValue: number;
    taxOwed: number;
  }>;
  taxBreakdown: {
    ordinaryIncomeRate: number;
    longTermCapitalGainsRate: number;
    estimatedTax: number;
    afterTaxTotal: number;
  };
  recommendations: string[];
}

export interface BenefitsAnalysisResult {
  overallScore: number;
  summary: string;
  categories: Array<{
    name: string;
    score: number;
    items: Array<{
      name: string;
      value: string;
      marketBenchmark: string;
      rating: string;
      notes: string;
    }>;
  }>;
  comparison: {
    strengths: string[];
    weaknesses: string[];
    missingComparedToMarket: string[];
  };
  totalCompensationValue: number;
  recommendations: string[];
}

export interface DecisionCriterion {
  id: string;
  name: string;
  weight: number;
}

export interface OfferDecision {
  id: string;
  userId: string;
  name: string;
  criteria: DecisionCriterion[];
  offers: OfferItem[];
  scores: Record<string, Record<string, number>>;
  recommendation?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResignationLetter {
  id: string;
  userId: string;
  companyName: string;
  roleTitle: string;
  managerName?: string;
  lastDay?: string;
  reason?: string;
  tone?: string;
  letterContent: string;
  transitionPlan?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Application Tracking Types
// ============================================================================

export interface JobApplication {
  id: string;
  userId: string;
  jobId?: string;
  companyName: string;
  roleTitle: string;
  status: string;
  appliedAt?: Date;
  resumeId?: string;
  coverLetterId?: string;
  referralContact?: string;
  notes?: string;
  nextSteps?: string;
  nextActionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  communications?: CommunicationLog[];
  referral?: ReferralRequest;
}

export interface CommunicationLog {
  id: string;
  applicationId: string;
  type: string;
  subject?: string;
  content: string;
  direction?: string;
  occurredAt: Date;
  outcome?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferralRequest {
  id: string;
  applicationId: string;
  employeeName: string;
  employeeEmail?: string;
  relationship?: string;
  status: string;
  notes?: string;
  requestedAt?: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationsAnalytics {
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
}

// ============================================================================
// Post-Offer & Onboarding Types
// ============================================================================

export interface OnboardingPlan {
  id: string;
  userId: string;
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  startDate?: string;
  planType: '30-60-90' | 'custom';
  milestones: OnboardingMilestone[];
  learningGoals: LearningGoal[];
  stakeholders: Stakeholder[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingMilestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  phase: '30' | '60' | '90';
  progress: number;
}

export interface LearningGoal {
  id: string;
  topic: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours?: number;
  completed: boolean;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  department?: string;
  relationship?: string;
  meetingFrequency?: string;
}

export interface OnboardingChecklist {
  id: string;
  userId: string;
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  startDate?: string;
  categories: ChecklistCategory[];
  completedCount: number;
  totalCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistCategory {
  name: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ManagerAlignment {
  id: string;
  userId: string;
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  managerName?: string;
  successMetrics: SuccessMetric[];
  communicationStyle: CommunicationPreferences;
  meetingCadence: MeetingCadence[];
  expectations?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SuccessMetric {
  id: string;
  name: string;
  target: string;
  timeline: string;
  measurement: string;
}

export interface CommunicationPreferences {
  preferredChannels: string[];
  responseTimeExpectation: string;
  meetingStyle: string;
}

export interface MeetingCadence {
  type: string;
  frequency: string;
  duration: number;
  attendees: string[];
}

export interface NetworkMap {
  id: string;
  userId: string;
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  contacts: NetworkContact[];
  coffeeChats: CoffeeChat[];
  relationshipMap?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface NetworkContact {
  id: string;
  name: string;
  role: string;
  department: string;
  email?: string;
  linkedin?: string;
  relationship: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface CoffeeChat {
  id: string;
  contactId: string;
  scheduledAt?: string;
  completedAt?: string;
  notes?: string;
  status: 'pending' | 'scheduled' | 'completed';
}

export interface SkillRefresh {
  id: string;
  userId: string;
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  techStack: string[];
  recommendations: SkillRecommendation[];
  learningPath: LearningPathItem[];
  estimatedHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningPathItem {
  id: string;
  topic: string;
  resources: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedHours?: number;
  completed: boolean;
}

export interface First90DaysTracker {
  id: string;
  userId: string;
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  startDate?: string;
  milestones: First90Milestone[];
  feedbackLoops: FeedbackLoop[];
  earlyWins: EarlyWin[];
  currentPhase: 'learning' | 'contributing' | 'leading';
  overallProgress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface First90Milestone {
  id: string;
  title: string;
  description?: string;
  phase: '30' | '60' | '90';
  dueDate?: string;
  completed: boolean;
  progress: number;
}

export interface FeedbackLoop {
  id: string;
  date: string;
  source: string;
  feedback: string;
  actionItems: string[];
}

export interface EarlyWin {
  id: string;
  title: string;
  description: string;
  date: string;
  impact: string;
}

// ============================================================================
// Batch Types
// ============================================================================

export interface Batch {
  id: string;
  userId: string;
  jobTitle: string;
  jobDescription?: string;
  createdAt: Date;
}

// ============================================================================
// Prisma Json Type Helpers
// ============================================================================

/**
 * Type-safe helper to cast Prisma JSON fields to our domain types
 */
export function jsonToType<T>(json: Prisma.JsonValue | null | undefined): T | null {
  if (json === null || json === undefined) return null;
  return json as T;
}

/**
 * Type-safe helper to cast our domain types to Prisma JSON for storage
 */
export function typeToJson<T>(obj: T): Prisma.JsonValue {
  return obj as Prisma.JsonValue;
}