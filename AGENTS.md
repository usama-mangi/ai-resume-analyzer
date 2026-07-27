# career-autopilot

## Project Context

A full-stack AI-powered career platform that supports the complete job application lifecycle — from job search and discovery through offer negotiation and onboarding. Built with a **Bun.js + NestJS backend** and **React Router v7 frontend**, the platform provides AI assistance at every stage of the job hunt. Features include multi-source job board aggregation, AI-powered job matching, resume generation and tailoring, interview preparation, offer comparison, salary negotiation coaching, and post-offer onboarding tools. Authentication via Better Auth, persistent storage via Prisma/PostgreSQL, and background job processing via BullMQ/Redis.

## Tech Stack

- **Backend Runtime:** Bun.js (Node.js compatible, faster startup)
- **Backend Framework:** NestJS (modular architecture, dependency injection)
- **Frontend:** React 19, React Router 7 (SSR/SSG capable), TypeScript
- **Styling:** TailwindCSS 4, clsx, tailwind-merge, tw-animate-css
- **Build Tool:** Vite
- **Authentication:** Better Auth (email/password, session-based, PostgreSQL adapter)
- **Database:** PostgreSQL via Prisma ORM
- **Queue/Jobs:** BullMQ + Redis (scheduled alerts, background processing)
- **AI:** OpenAI-compatible API (configurable via `.env`: model, base_url, api_key)
- **PDF Processing:** pdfjs-dist, pdfmake, html2pdf.js
- **File Upload:** react-dropzone, multer
- **State Management:** Zustand
- **Package Manager:** Bun
- **Deployment:** Docker (Bun/Node.js 20 Alpine), docker-compose for local dev
- **Rate Limiting:** @nestjs/throttler

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React Router 7)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Routes     │  │ Components  │  │ Hooks / Lib / State     │  │
│  │ (loaders/   │  │ (UI, forms, │  │ (Zustand, API clients,  │  │
│  │  actions)   │  │  charts)    │  │  auth helpers)          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST API (prefix: /api)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (NestJS on Bun)                    │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐   │
│  │ Auth       │ │ Jobs       │ │ AI         │ │ Prisma      │   │
│  │ (Better    │ │ (Search,   │ │ (OpenAI    │ │ (PostgreSQL │   │
│  │  Auth)     │ │  Match,    │ │  wrapper,  │ │  ORM)       │   │
│  │            │ │  Alerts)   │ │  Prompts)  │ │             │   │
│  └────────────┘ └────────────┘ └────────────┘ └─────────────┘   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐   │
│  │ Resumes    │ │ Application│ │ Interview  │ │ Offer       │   │
│  │ (Upload,   │ │ Tracker    │ │ Prep       │ │ Negotiation │   │
│  │  Parse,    │ │ (Kanban,   │ │ (Mock,     │ │ (Compare,   │   │
│  │  Generate) │ │  Analytics)│ │  Notes)    │ │  Salary,    │   │
│  └────────────┘ └────────────┘ └────────────┘ │  Equity)    │   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ └─────────────┘   │
│  │ Companies  │ │ Portfolio  │ │ References │                   │
│  │ (Research, │ │ (Projects) │ │ (Manager)  │                   │
│  │  Deep-dive)│ │            │ │            │                   │
│  └────────────┘ └────────────┘ └────────────┘                   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐   │
│  │ Deadlines  │ │ Cover      │ │ LinkedIn   │ │ Extension   │   │
│  │ (Calendar) │ │ Letters    │ │ (Profile)  │ │ (Autofill)  │   │
│  └────────────┘ └────────────┘ └────────────┘ └─────────────┘   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐   │
│  │ Post-      │ │ User/      │ │ Redis/     │ │ Rate        │   │
│  │ Onboarding │ │ Profile    │ │ BullMQ     │ │ Limiter     │   │
│  └────────────┘ └────────────┘ └────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Feature Progress

| Feature | Status | Started | Completed | Notes |
|---------|--------|---------|-----------|-------|
| **Core Infrastructure** | | | | |
| NestJS + Bun Setup | ✅ Done | — | — | Modular architecture, global prefix `/api` |
| Prisma + PostgreSQL | ✅ Done | — | — | 45+ models covering full lifecycle |
| Better Auth Integration | ✅ Done | — | — | Email/password, sessions, middleware |
| Redis + BullMQ Queue | ✅ Done | — | — | Scheduled job alerts, background jobs |
| Rate Limiting | ✅ Done | — | — | @nestjs/throttler, 100 req/min default |
| **Phase 1: Job Search & Discovery** | | | | |
| Job Board Aggregation (JSearch) | ✅ Done | — | — | LinkedIn, Indeed, Glassdoor via RapidAPI |
| AI Job Matching | ✅ Done | — | — | Batch match resume against job feed |
| Saved Searches & Alerts | ✅ Done | — | — | Cron-scheduled alerts via BullMQ |
| Company Research Dashboard | ✅ Done | — | — | Glassdoor ratings, news, financials, culture |
| Job Bookmarking & Tagging | ✅ Done | — | — | Custom tags, track applications |
| Application Deadline Tracking | ✅ Done | — | — | Calendar view with reminders |
| **Phase 2: Pre-Application Preparation** | | | | |
| Resume Upload & Multi-format Parsing | ✅ Done | — | — | PDF, DOCX, TXT, HTML via pdfjs-dist/mammoth |
| AI Resume Generation | ✅ Done | — | — | Structured JSON output, semantic search |
| Tailored Resume Builder | ✅ Done | — | — | Keyword injection, reordering per JD |
| Resume Version Management | ✅ Done | — | — | Multiple versions for different roles |
| Cover Letter Generator | ✅ Done | — | — | Tailored per job analysis |
| Cover Letter Templates | ✅ Done | — | — | Variable substitution (company, role) |
| LinkedIn Profile Optimizer | ✅ Done | — | — | Analyze & suggest improvements |
| Portfolio / Project Showcase | ✅ Done | — | — | CRUD, tech badges, case studies, links |
| Reference Manager | ✅ Done | — | — | Track contacts, request status |
| Skill Gap Analysis | ✅ Done | — | — | Actionable learning recommendations |
| **Phase 3: Application Submission & Tracking** | | | | |
| Application Status Pipeline (Kanban) | ✅ Done | — | — | Draft → Applied → Phone Screen → Interview → Offer → Closed |
| Communication Log | ✅ Done | — | — | Emails, messages, calls with timestamps |
| Referral Tracker | ✅ Done | — | — | Request, track, thank-you follow-ups |
| Application Analytics | ✅ Done | — | — | Funnel: Apps → Screens → Interviews → Offers |
| One-click Application Autofill | ✅ Done | — | — | Browser extension for form filling |
| Application Document Bundle | ✅ Done | — | — | Package resume, CL, portfolio, refs |
| **Phase 4: Pre-Interview Preparation** | | | | |
| Company Deep-Dive Briefing | ✅ Done | — | — | AI-generated: mission, products, competitors |
| Technical Assessment Practice | ✅ Done | — | — | Coding challenges, system design, take-homes |
| Behavioral Question Bank (STAR) | ✅ Done | — | — | Per competency with sample answers |
| Mock Interview Simulator | ✅ Done | — | — | AI chat with real-time scoring feedback |
| Interview Cheat Sheet Generator | ✅ Done | — | — | One-page: talking points, questions, salary |
| Interview Scheduling & Calendar | ✅ Done | — | — | Booking, timezone, reminders, prep blocks |
| **Phase 5: Interview Process** | | | | |
| Interview Notes & Rating | ✅ Done | — | — | Per round: Q&A, self-rating |
| Interviewer Feedback Tracker | ✅ Done | — | — | Capture external + internal assessment |
| Follow-up Email Templates | ✅ Done | — | — | Thank-you, check-ins per stage |
| Panel Interview Coordinator | ✅ Done | — | — | Multi-interviewer schedules, consolidated feedback |
| Case Study/Presentation Builder | ✅ Done | — | — | Templates + AI assistance |
| Interview Performance Analytics | ✅ Done | — | — | Trends: strong/weak areas, conversion rates |
| **Phase 6: Offer & Negotiation** | | | | |
| Offer Comparison Matrix | ✅ Done | — | — | Base, equity, bonus, benefits, PTO, remote, growth |
| Salary Negotiation Coach | ✅ Done | — | — | Scripts, market data, counter-offers, emails |
| Equity/RSU Calculator | ✅ Done | — | — | Vesting, tax, scenario modeling (exit, IPO) |
| Benefits Analyzer | ✅ Done | — | — | Health, 401k, ESPP, wellness, parental leave |
| Decision Framework | ✅ Done | — | — | Weighted matrix: comp, growth, culture, WLB |
| Resignation Letter Generator | ✅ Done | — | — | Professional templates, transition plan |
| **Phase 7: Post-Offer & Onboarding** | | | | |
| 30-60-90 Day Plan Builder | ✅ Done | — | — | Role-specific milestones, stakeholders, goals |
| Onboarding Checklist | ✅ Done | — | — | Paperwork, equipment, accounts, intros |
| Manager Alignment Tool | ✅ Done | — | — | Shared expectations: metrics, cadence |
| Network Mapping | ✅ Done | — | — | Cross-functional contacts, coffee chats |
| Skill Refresh Recommendations | ✅ Done | — | — | Pre-start learning path (stack, domain) |
| First 90 Days Tracker | ✅ Done | — | — | Milestones, feedback loops, early wins |
| **Supporting Features** | | | | |
| ATS Analysis (Core) | ✅ Done | — | — | Scoring, keywords, strengths/weaknesses |
| Batch Resume Analysis | ✅ Done | — | — | Multiple resumes vs single JD |
| Multi-JD Comparison | ✅ Done | — | — | Single resume vs multiple JDs |
| Salary Range Estimation | ✅ Done | — | — | JD + market data |
| Interview Question Generator | ✅ Done | — | — | Based on JD + resume |
| ATS Template Suggestions | ✅ Done | — | — | Best practice recommendations |
| Export Reports (PDF/Share) | ✅ Done | — | — | Download + shareable links |
| User Feedback Loop | ✅ Done | — | — | Thumbs up/down on AI tips |
| Profile Completion System | ✅ Done | — | — | Onboarding wizard, completion % |

## Project Structure

### Backend (`/server`)
```
server/
├── src/
│   ├── ai/                      # AI service, prompts, OpenAI wrapper
│   ├── application-tracker/     # Kanban pipeline, analytics, comms log
│   ├── auth/                    # Better Auth middleware, module
│   ├── batches/                 # Batch resume analysis
│   ├── common/
│   │   └── rate-limiter/        # @nestjs/throttler config
│   ├── companies/               # Company research, deep-dive briefings
│   ├── cover-letter-templates/  # Template CRUD, variable substitution
│   ├── cover-letters/           # Generation, management
│   ├── deadlines/               # Calendar, reminders
│   ├── extension/               # Browser extension autofill API
│   ├── interview-prep/          # Company briefing, tech practice, behavioral, mock interview
│   ├── interview-process/       # Notes, feedback, follow-ups, panel, case study
│   ├── jobs/                    # Search, match, bookmark, alerts, JSearch integration
│   │   └── processor/           # BullMQ job processors
│   ├── lib/                     # Shared utilities (auth.ts - Better Auth instance)
│   ├── linkedin/                # Profile optimization
│   ├── offer-negotiation/       # Comparison, salary, equity, benefits, decision, resignation
│   ├── portfolio/               # Project showcase CRUD
│   ├── post-onboarding/         # 30-60-90, checklist, manager alignment, network, skills, 90-day tracker
│   ├── prisma/                  # PrismaService, PrismaModule
│   ├── redis/                   # Redis client, BullMQ queue setup
│   ├── references/              # Reference manager
│   ├── resumes/                 # Upload, parse, generate, tailor, versions
│   ├── upload/                  # File upload handling (multer)
│   ├── user/                    # User profile, onboarding
│   ├── users/                   # User management
│   ├── app.module.ts            # Root module (29 feature modules)
│   └── main.ts                  # Bootstrap, CORS, validation, prefix
├── prisma/
│   └── schema.prisma            # 45 models, comprehensive lifecycle
├── uploads/                     # File storage (served via ServeStaticModule)
├── Dockerfile
├── nest-cli.json
├── package.json
└── tsconfig.json
```

### Frontend (`/app`)
```
app/
├── routes/                      # 60+ route files (loaders/actions + UI)
│   ├── landing.tsx              # Public landing page
│   ├── auth.tsx                 # Better Auth callback
│   ├── login.tsx / register.tsx
│   ├── onboarding.tsx           # Profile completion wizard
│   ├── dashboard.tsx            # Main dashboard
│   ├── jobs.tsx                 # Job search, filters, results
│   ├── jobs.$id.tsx             # Job detail, match, apply
│   ├── saved-searches.tsx       # Saved search CRUD
│   ├── job-alerts.tsx           # Alert management
│   ├── companies.tsx / companies.$id.tsx  # Research dashboard
│   ├── applications.tsx         # Kanban board
│   ├── applications-analytics.tsx
│   ├── application-detail.tsx   # Single application view
│   ├── interview-prep.tsx       # Hub for prep tools
│   ├── interview-schedule.tsx
│   ├── interview-notes.tsx
│   ├── interviewer-feedback.tsx
│   ├── mock-interview.tsx       # AI chat simulator
│   ├── technical-practice.tsx
│   ├── behavioral-bank.tsx
│   ├── interview-cheat-sheet.tsx
│   ├── panel-interview.tsx
│   ├── case-study.tsx
│   ├── interview-analytics.tsx
│   ├── offers.tsx               # Offer list
│   ├── offer-comparison.tsx
│   ├── salary-negotiation.tsx
│   ├── equity-calculator.tsx
│   ├── benefits-analyzer.tsx
│   ├── decision-framework.tsx
│   ├── resignation-letter.tsx
│   ├── resumes.tsx              # Resume list
│   ├── generate-resume.tsx      # AI resume builder
│   ├── upload.tsx               # File upload
│   ├── batch-upload.tsx / batch.tsx
│   ├── resume.tsx               # Resume view + ATS analysis
│   ├── resume-edit.tsx
│   ├── cover-letter.tsx
│   ├── skill-gap.tsx
│   ├── interview-questions.tsx
│   ├── salary-estimate.tsx
│   ├── multi-jd.tsx
│   ├── templates.tsx
│   ├── tailored-resume.tsx
│   ├── resume-versions.tsx
│   ├── cover-letter-templates.tsx
│   ├── linkedin-profile.tsx
│   ├── portfolio.tsx
│   ├── references.tsx
│   ├── profile.tsx
│   ├── onboarding-plan.tsx
│   ├── onboarding-checklist.tsx
│   ├── manager-alignment.tsx
│   ├── network-map.tsx
│   ├── skill-refresh.tsx
│   ├── first-90-days.tsx
│   ├── follow-up-emails.tsx
│   ├── share.tsx                # Shareable analysis reports
│   └── wipe.tsx                 # Account deletion
├── components/
│   ├── Layout.tsx               # Authenticated shell, navigation
│   └── (UI components)
├── hooks/                       # Custom React hooks
├── lib/                         # API clients, utilities
├── root.tsx                     # Root layout
├── routes.ts                    # Route configuration (layout + public routes)
└── app.css                      # Tailwind imports
```

## Database Schema (Prisma) — Key Models

| Model | Purpose |
|-------|---------|
| `user` | Core user, profile fields, onboarding status |
| `UserProfile` | Extended profile: skills, experience, education, preferences |
| `Resume` / `ResumeVersion` | Uploaded & generated resumes with parsed content |
| `Batch` / `BatchResume` | Batch analysis jobs |
| `Job` | Aggregated job postings (JSearch + manual) |
| `SavedSearch` / `JobAlert` | Scheduled search criteria + BullMQ cron jobs |
| `Company` / `CompanyResearch` | Company profiles + AI deep-dive briefings |
| `JobApplication` | Kanban pipeline: status, stage, dates, resume link |
| `CommunicationLog` | Emails, calls, messages per application |
| `ReferralRequest` | Referral tracking |
| `TailoredResume` | AI-customized resume per job |
| `Portfolio` | Project showcase |
| `Reference` | Professional references |
| `CoverLetter` / `CoverLetterTemplate` | Generated & template letters |
| `InterviewPrep` / `MockInterviewSession` | Prep materials, AI mock sessions |
| `BehavioralBank` / `TechnicalPractice` | Question banks |
| `InterviewSchedule` / `InterviewNote` / `InterviewerFeedback` | Interview process |
| `FollowUpEmail` / `PanelInterview` / `CaseStudy` | Interview comms & artifacts |
| `OfferComparison` / `NegotiationCoach` / `OfferDecision` | Offer analysis |
| `ResignationLetter` | Resignation templates |
| `OnboardingPlan` / `OnboardingChecklist` / `ManagerAlignment` / `NetworkMap` / `SkillRefresh` / `First90DaysTracker` | Post-offer onboarding |

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Auth
BETTER_AUTH_SERVER_URL=http://localhost:3000/api/auth
BETTER_AUTH_CLIENT_URL=http://localhost:5173

# AI (OpenAI-compatible)
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.llm7.io/v1
OPENAI_MODEL=gpt-4o-mini

# Job Search (JSearch via RapidAPI)
JSEARCH_API_KEY=...
JSEARCH_API_HOST=jsearch.p.rapidapi.com

# Redis / BullMQ
REDIS_URL=redis://localhost:6379

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# File Upload
UPLOAD_DIR=./uploads

# CORS
CORS_ORIGIN=http://localhost:5173
```

## Key Conventions

### Backend
- **Modules**: Each feature = NestJS module (see `app.module.ts` imports)
- **Services**: Business logic in `*.service.ts`, injected via constructor
- **Controllers**: REST endpoints in `*.controller.ts`, decorated with `@Controller('api/feature')`
- **AI Prompts**: Centralized in `ai/prompts.ts` + feature-specific `prompts.ts` files
- **Validation**: DTOs with `class-validator`, global `ValidationPipe`
- **Auth**: Better Auth middleware on `/auth` routes; session cookie handled by Better Auth
- **Queue**: BullMQ processors in `jobs/processor/`, scheduled via `@nestjs/schedule`

### Frontend
- **Routes**: File-based in `app/routes/`, configured in `app/routes.ts`
- **Loaders/Actions**: React Router v7 `loader`/`action` for server data
- **Layout**: `components/Layout.tsx` wraps authenticated routes
- **Navigation**: Sidebar organized by lifecycle phase (Jobs → Applications → Interview → Offers → Resume)
- **State**: Zustand stores in `app/lib/stores/`
- **API**: Typed fetch wrappers in `app/lib/api/`

### Database
- **Naming**: `snake_case` tables/columns, `PascalCase` models
- **Relations**: Explicit `@relation` with foreign keys
- **Indexes**: `@@index` on frequently queried fields (userId, status, dates)
- **Enums**: Prisma enums for status fields (ApplicationStatus, InterviewStage, etc.)

## Development Workflow

### Local Development
```bash
# Start infrastructure
docker-compose up -d postgres redis

# Backend
cd server && bun install && bun run start:dev

# Frontend
cd .. && bun install && bun run dev
```

### Database
```bash
cd server
bunx prisma migrate dev    # Create/apply migrations
bunx prisma studio         # Visual DB browser
bunx prisma generate       # Regenerate client
```

### Testing
```bash
# Backend
cd server && bun test

# Frontend (if configured)
cd .. && bun test
```

## Deployment

- **Docker**: Multi-stage build (Bun base, copy deps, build, runtime)
- **docker-compose.yml**: postgres, redis, server services
- **Environment**: All secrets via `.env` / Docker secrets
- **Frontend**: Built via `react-router build`, served by `@react-router/serve` or static hosting

## Rules for Contributors

1. **Read First**: Understand existing modules, patterns, and conventions before adding code
2. **Module-First**: New features → new NestJS module + Prisma model(s) + React routes
3. **AI Prompts**: Add to `ai/prompts.ts` or feature `prompts.ts`, not inline in services
4. **Type Safety**: Share types via `types/` or Prisma-generated types; avoid `any`
5. **Auth**: All authenticated routes use Better Auth session; backend validates via middleware
6. **Rate Limits**: Respect `THROTTLE_LIMIT`; use BullMQ for heavy/async work
7. **Migrations**: Never edit migration files; create new ones via `prisma migrate dev`
8. **UI Consistency**: Use existing components, Tailwind utilities, `clsx` + `tailwind-merge`
9. **Documentation**: Update this AGENTS.md when adding/removing features or changing architecture
10. **No Serverless**: This is a long-running NestJS server on Bun — no serverless functions
