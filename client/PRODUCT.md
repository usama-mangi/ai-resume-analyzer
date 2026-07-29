# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary audiences (mixed):** Active job seekers, passive career explorers, and career professionals (coaches, resume writers). All use the platform to navigate the complete job application lifecycle with AI assistance.

**Situation:** Professionals at any career stage — from new graduates to senior executives — who need to discover roles, prepare tailored materials, track submissions, prepare for interviews, negotiate offers, and transition into new positions.

**Job-to-be-done:** "Help me manage every stage of my job search in one place, with AI that threads context across the entire lifecycle so I don't lose signal when switching between tools."

## Product Purpose

A full-stack AI-powered career platform supporting the complete job application lifecycle: job search and discovery → resume generation and tailoring → application submission and tracking → interview preparation → offer comparison and negotiation → post-offer onboarding. Built with Bun.js + NestJS backend and React Router v7 frontend, featuring multi-source job aggregation, AI-powered job matching, resume parsing and generation, interview simulation, offer analysis with equity modeling, and onboarding planning.

**Success means:** Users secure better roles faster with less cognitive overhead, leveraging a unified system where AI assistance compounds across stages instead of treating each step in isolation.

## Positioning

**Full lifecycle integration with compounding AI context.** Unlike point solutions for resume building, job search, or interview prep, Career Autopilot connects every stage of the job hunt in one platform. The meaningfully different mechanism: AI assistance threads context across stages — the resume tailored for a job feeds the interview prep, which feeds the offer comparison, which feeds the onboarding plan. This compounding intelligence is what a neighboring product could not truthfully copy without rebuilding the full stack.

## Operating Context

- **Environment:** Desktop and mobile web (React Router 7, SSR-capable)
- **Workflow rhythm:** Mix of dedicated sessions (resume building, interview prep) and lightweight daily check-ins (application status, job alerts, interview scheduling)
- **Integrations:** JSearch API (RapidAPI) for job aggregation; OpenAI-compatible LLM for AI features; PostgreSQL via Prisma for persistence; Redis/BullMQ for scheduled alerts and background processing
- **Authentication:** Better Auth (email/password, session-based, PostgreSQL adapter)
- **Background processing:** BullMQ + Redis for scheduled job alerts, resume parsing, AI batch operations

## Capabilities and Constraints

**Confirmed functionality (7 phases, 45+ Prisma models):**
- Phase 1: Job Search & Discovery — Aggregation, AI matching, saved searches/alerts, company research, bookmarking, deadline tracking
- Phase 2: Pre-Application — Resume upload/parse (PDF, DOCX, TXT, HTML), AI generation, tailoring, version management, cover letters, LinkedIn optimizer, portfolio, references, skill gap analysis
- Phase 3: Application Submission & Tracking — Kanban pipeline, communication log, referral tracker, analytics, autofill extension, document bundles
- Phase 4: Pre-Interview Prep — Company deep-dive, technical practice, behavioral bank (STAR), mock interviewer, cheat sheet generator, scheduling
- Phase 5: Interview Process — Notes/rating, feedback tracker, follow-up templates, panel coordinator, case study builder, performance analytics
- Phase 6: Offer & Negotiation — Comparison matrix, salary coach, equity/RSU calculator, benefits analyzer, decision framework, resignation letters
- Phase 7: Post-Offer Onboarding — 30-60-90 plan, checklist, manager alignment, network mapping, skill refresh, 90-day tracker

**Visual redesign constraints:** **Open to change** — the product is in a pre-brand, pre-launch state. No established visual identity, brand guidelines, or external commitments exist. The current UI uses "Resumind" on the landing page but "Career Autopilot" in code/architecture; this naming discrepancy must be resolved as part of the new visual world.

## Brand Commitments

None formally established. The landing page uses "Resumind" with a specific visual style (Inter font, royal blue primary, gradient accents), but the repository and architecture use "Career Autopilot." No brand guidelines, voice documentation, or legal constraints exist. The new visual world must choose and commit to one canonical name and identity.

## Evidence on Hand

No real user evidence exists (testimonials, case studies, press, usage metrics, or demonstration recordings). All content in the codebase is synthetic/demo data. The "Trusted by job seekers at Google, Microsoft, Amazon, Meta, Netflix, Stripe" claim on the current landing page is placeholder copy and must be replaced or removed before any public-facing deployment. Future work must not fabricate user evidence, benchmarks, or customer logos.

## Product Principles

1. **Compound context over isolated tools** — Every stage feeds the next; AI assistance threads resume → job match → interview prep → offer → onboarding.
2. **Progressive disclosure** — Show minimum viable UI at each step; reveal complexity only when the user needs it.
3. **Action-oriented defaults** — Every screen answers "What should I do next?" Every card has a primary CTA; dead-end screens are a bug.
4. **Data as narrative** — Numbers without human-readable takeaways are noise. Every metric ships with a plain-language insight.
5. **Consistency as trust** — Same patterns, spacing, component behavior everywhere. The user should never relearn how a button works.

## Accessibility & Inclusion

No product-specific accessibility requirement established. The codebase includes reduced-motion support (`prefers-reduced-motion: reduce`) and semantic HTML patterns, but no explicit WCAG target (AA/AAA) or inclusive design audit has been defined. The new visual world should establish a baseline standard if the product targets enterprise or public-sector users.