# AI Resume Analyzer — UI/UX Specification

> A comprehensive design guide for every surface, interaction, and state in the application.

---

## 1. Design Philosophy

**One-liner:** A career command center that feels like a confident advisor — not a cluttered tool belt.

### Core Principles

| Principle | Meaning |
|-----------|---------|
| **Progressive disclosure** | Show the minimum viable UI at each step. Reveal complexity only when the user needs it. A first-time visitor sees a clean upload area; a power user sees the full analytics suite. |
| **Confidence over noise** | Every screen should make the user feel *more* capable, not overwhelmed. Favor calm typography, generous whitespace, and restrained color over dashboards crammed with charts. |
| **Action-oriented** | Every page answers: "What should I do next?" Every card has a primary CTA. Dead-end screens are a bug. |
| **Data as story** | Numbers without narrative are noise. Every metric ships with a human-readable takeaway ("Your resume ranks above 78% of applicants for this role"). |
| **Consistency is trust** | Same patterns, same spacing, same component behavior everywhere. The user should never have to relearn how a button works. |

---

## 2. Visual Language

### 2.1 Color System

```
Primary palette
───────────────
--color-primary-500:  #2563EB   (Royal Blue — CTAs, active states, links)
--color-primary-600:  #1D4ED8   (Hover / pressed)
--color-primary-50:   #EFF6FF   (Light tints for backgrounds, badges)
--color-primary-900:  #1E3A5F   (Dark headings on light bg)

Neutral palette
───────────────
--color-gray-50:   #F9FAFB   (Page background)
--color-gray-100:  #F3F4F6   (Card backgrounds)
--color-gray-200:  #E5E7EB   (Borders, dividers)
--color-gray-400:  #9CA3AF   (Muted text, placeholders)
--color-gray-600:  #4B5563   (Body text)
--color-gray-900:  #111827   (Headings)

Semantic accents
────────────────
--color-success:   #059669   (Green — high scores, completed states)
--color-warning:   #D97706   (Amber — medium scores, deadlines approaching)
--color-danger:    #DC2626   (Red — low scores, errors, destructive actions)
--color-info:      #0891B2   (Cyan — informational callouts, tips)

Score gradient (used across all scoring UIs)
────────────────────────────────────────────
0–39%   → linear-gradient(#DC2626, #F59E0B)   "Needs work"
40–69%  → linear-gradient(#F59E06, #EAB308)   "Getting there"
70–89%  → linear-gradient(#22C55E, #10B981)   "Strong match"
90–100% → linear-gradient(#2563EB, #7C3AED)   "Excellent"
```

### 2.2 Typography

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `heading-1` | 2rem / 32px | 700 | Page titles |
| `heading-2` | 1.5rem / 24px | 600 | Section headings |
| `heading-3` | 1.125rem / 18px | 600 | Card titles, sub-sections |
| `body` | 0.9375rem / 15px | 400 | Default body text |
| `body-sm` | 0.8125rem / 13px | 400 | Captions, metadata, timestamps |
| `label` | 0.75rem / 12px | 500 | Badges, tags, input labels |
| `mono` | 0.875rem / 14px | 400 | Code snippets, salary figures |

Font stack: `'Inter', system-ui, -apple-system, sans-serif`

### 2.3 Spacing Scale

Base unit: **4px**. All spacing is a multiple of 4.

| Token | Value | Use |
|-------|-------|-----|
| `space-1` | 4px | Tight inner padding (icon gaps) |
| `space-2` | 8px | Inline element gaps |
| `space-3` | 12px | Compact card padding |
| `space-4` | 16px | Standard padding, input padding |
| `space-5` | 20px | Section gaps |
| `space-6` | 24px | Card padding, list item gaps |
| `space-8` | 32px | Section spacing |
| `space-10` | 40px | Page section dividers |
| `space-16` | 64px | Major section breaks |

### 2.4 Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `radius-sm` | 6px | Badges, tags, small elements |
| `radius-md` | 8px | Inputs, buttons, cards |
| `radius-lg` | 12px | Modals, large cards |
| `radius-xl` | 16px | Hero sections, feature cards |
| `radius-full` | 9999px | Pills, avatars, round buttons |

### 2.5 Shadows

```
shadow-sm:  0 1px 2px rgba(0,0,0,0.05)                    — Subtle card lift
shadow-md:  0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05) — Cards, dropdowns
shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04) — Modals, popovers
shadow-focus: 0 0 0 3px rgba(37,99,235,0.15)             — Focus rings
```

---

## 3. Information Architecture

### 3.1 Sitemap

```
/ (Landing)
├── /sign-in
├── /sign-up
│
├── /dashboard                          ← Default authenticated view
│   ├── /dashboard/overview             ← At-a-glance metrics + quick actions
│   ├── /dashboard/resumes              ← Resume library
│   │   └── /dashboard/resumes/:id      ← Resume detail + analysis
│   │       ├── /dashboard/resumes/:id/analyze
│   │       ├── /dashboard/resumes/:id/skill-gap
│   │       ├── /dashboard/resumes/:id/cover-letter
│   │       ├── /dashboard/resumes/:id/interview-prep
│   │       ├── /dashboard/resumes/:id/salary
│   │       └── /dashboard/resumes/:id/export
│   └── /dashboard/batch                ← Batch analysis (multiple resumes × one JD)
│
├── /jobs                               ← Job search & discovery
│   ├── /jobs/search                    ← Unified search with filters
│   ├── /jobs/:id                       ← Job detail + company intel
│   ├── /jobs/matches                   ← AI-matched jobs for my resume
│   ├── /jobs/saved                     ← Bookmarked jobs
│   └── /jobs/alerts                    ← Saved searches & alert config
│
├── /applications                       ← Application pipeline
│   ├── /applications/board             ← Kanban board view
│   ├── /applications/:id               ← Application detail
│   │   ├── /applications/:id/comms     ← Communication log
│   │   ├── /applications/:id/documents ← Document bundle
│   │   └── /applications/:id/referral  ← Referral tracking
│   └── /applications/analytics         ← Funnel analytics
│
├── /interviews                         ← Interview preparation & tracking
│   ├── /interviews/calendar            ← Calendar + scheduling
│   ├── /interviews/prep                ← Prep hub (cheat sheets, questions, mock)
│   ├── /interviews/:id                 ← Single interview round
│   │   ├── /interviews/:id/notes       ← Note-taking + self-rating
│   │   ├── /interviews/:id/feedback    ← Interviewer feedback
│   │   └── /interviews/:id/followup    ← Follow-up email composer
│   ├── /interviews/mock                ← Mock interview simulator
│   ├── /interviews/practice            ← Technical + behavioral practice
│   └── /interviews/analytics           ← Performance trends
│
├── /offers                             ← Offer evaluation
│   ├── /offers/compare                 ← Side-by-side comparison matrix
│   ├── /offers/negotiate               ← Negotiation coach
│   ├── /offers/calculator              ← Equity / RSU / total comp calculator
│   ├── /offers/decide                  ← Weighted decision framework
│   └── /offers/:id                     ← Single offer detail
│
├── /onboarding                         ← Post-acceptance
│   ├── /onboarding/checklist           ← Pre-start tasks
│   ├── /onboarding/plan                ← 30-60-90 day plan
│   ├── /onboarding/alignment           ← Manager alignment doc
│   ├── /onboarding/network             ← Network / relationship map
│   ├── /onboarding/learning            ← Skill refresh learning path
│   └── /onboarding/tracker             ← First 90 days milestone tracker
│
├── /portfolio                          ← Project showcase
│   └── /portfolio/:id                  ← Individual project / case study
│
└── /settings
    ├── /settings/profile               ← Personal info, resume defaults
    ├── /settings/notifications         ← Alert preferences
    ├── /settings/integrations          ← LinkedIn, calendar, email connections
    └── /settings/billing               ← Plan & usage
```

### 3.2 User Journey Phases

The app maps to a natural career journey. Each phase surfaces relevant features and hides the rest:

```
┌─────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  1. PREPARE  │──▶│ 2. DISCOVER  │──▶│  3. APPLY    │──▶│ 4. INTERVIEW │
│  Upload &    │   │ Search &     │   │ Submit &     │   │ Practice &   │
│  polish      │   │ match        │   │ track        │   │ perform      │
└─────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
                                                              │
                                          ┌───────────────────┘
                                          ▼
                                ┌──────────────┐   ┌──────────────┐
                                │  5. DECIDE    │──▶│ 6. ONBOARD   │
                                │  Offer eval & │   │ Ramp up at   │
                                │  negotiate    │   │ new role     │
                                └──────────────┘   └──────────────┘
```

---

## 4. Navigation System

### 4.1 Top Navigation Bar

Fixed to viewport top. Height: 64px. Z-index: 50.

```
┌──────────────────────────────────────────────────────────────────────┐
│ [Logo]  Dashboard  Jobs  Applications  Interviews  Offers  Onboard  │
│                                                                     │
│                                    🔍 Search    [🔔] [👤 avatar ▾] │
└──────────────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Logo links to `/dashboard`.
- Active nav item: `primary-500` text + 2px bottom border indicator.
- Hover: `gray-600` text transition (150ms ease).
- Mobile: Hamburger menu, full-screen slide-out overlay with same items.
- Search triggers a **command palette** (Cmd+K / Ctrl+K) — not a page nav.

### 4.2 Sidebar Navigation (Dashboard Context)

Visible on dashboard sub-routes. Width: 240px. Collapsible to 64px (icon-only).

```
┌────────────────┐
│ 📊 Overview    │
│ 📄 Resumes     │
│ 📦 Batch       │
│                 │
│ ── Quick ────── │
│ ⚡ New Analysis │
│ 📤 Upload      │
└────────────────┘
```

### 4.3 Command Palette (Cmd+K)

Global search overlay. Triggers from any screen.

```
┌─────────────────────────────────────────────┐
│ 🔍 Type a command or search...              │
│─────────────────────────────────────────────│
│ Recent                                      │
│   → Resume: "Senior SWE - Google"           │
│   → Application: Stripe — Applied           │
│                                             │
│ Quick Actions                               │
│   → New resume analysis                     │
│   → Search jobs                             │
│   → Start mock interview                    │
│                                             │
│ Navigation                                  │
│   → Go to Dashboard                         │
│   → Go to Applications                      │
└─────────────────────────────────────────────┘
```

---

## 5. Core Layout System

### 5.1 Page Shell

All authenticated pages share this structure:

```
┌──────────────────────────────────────────────────────────────┐
│                        Top Nav (64px)                         │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                 │
│  Sidebar   │                 Content Area                    │
│  (240px)   │                                                 │
│            │    ┌─────────────────────────────────────┐      │
│  (collaps- │    │  Page Header                       │      │
│   ible to  │    │  [Title]                    [CTA]  │      │
│   64px on  │    ├─────────────────────────────────────┤      │
│   large    │    │                                     │      │
│   screens) │    │         Page Content                │      │
│            │    │                                     │      │
│            │    │                                     │      │
│            │    └─────────────────────────────────────┘      │
│            │                                                 │
└────────────┴─────────────────────────────────────────────────┘
```

**Breakpoints:**
- `< 768px` (mobile): No sidebar. Content full width. Bottom tab bar replaces sidebar.
- `768px–1024px` (tablet): Collapsed sidebar (64px, icons only).
- `> 1024px` (desktop): Full sidebar (240px).
- `> 1440px` (wide): Content area max-width 1200px, centered with auto margins.

### 5.2 Page Header Pattern

Every page starts with a consistent header:

```
┌──────────────────────────────────────────────────────────┐
│  [Breadcrumb]                                             │
│                                                           │
│  Page Title (heading-1)              [Primary CTA Button] │
│  One-line description text (body, gray-400)               │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Page-by-Page UI/UX Specifications

---

### 6.1 Landing Page (`/`)

**Goal:** Convert visitors to sign-ups. Communicate value in < 5 seconds.

```
┌──────────────────────────────────────────────────────────┐
│  [Logo]     Features     Pricing     [Sign In] [Get Free]│
├──────────────────────────────────────────────────────────┤
│                                                          │
│            Your resume, decoded by AI.                    │
│            Get past the bots. Land the interview.        │
│                                                          │
│     ┌─────────────────────────────────┐                  │
│     │  Drop your resume (PDF)    📎   │                  │
│     │  ─── or paste a URL ───         │                  │
│     │                                 │                  │
│     │  [Paste Job Description]        │                  │
│     │  ┌─────────────────────────┐    │                  │
│     │  │                         │    │                  │
│     │  └─────────────────────────┘    │                  │
│     │                                 │                  │
│     │       [ Analyze My Resume → ]   │                  │
│     └─────────────────────────────────┘                  │
│                                                          │
│  Trusted by 12,000+ job seekers                          │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                │
│  │ 📊   │  │ 🔍   │  │ 📝   │  │ 💰   │                │
│  │ ATS  │  │ Skill│  │Cover │  │Salary│                │
│  │Score │  │ Gap  │  │Letter│  │Range │                │
│  └──────┘  └──────┘  └──────┘  └──────┘                │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  Footer                                                  │
└──────────────────────────────────────────────────────────┘
```

**Interactions:**
- Drag-and-drop zone: dashed border (`gray-200`), turns solid `primary-500` on dragover with scale(1.02) transition.
- "Analyze" button: `primary-500` fill, full width within form, `shadow-md` on hover. Shows spinner on submit.
- Feature cards: hover lifts with `shadow-md`, 200ms transition.

---

### 6.2 Dashboard Overview (`/dashboard/overview`)

**Goal:** Quick pulse check + shortcuts to next action.

```
┌──────────────────────────────────────────────────────────┐
│  Welcome back, [Name] 👋                                  │
│  Here's your job search at a glance.                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 📄 5     │ │ 📋 12    │ │ 🎯 3     │ │ 📈 68%   │   │
│  │ Resumes  │ │ Applied  │ │ Interview│ │ Avg ATS  │   │
│  │          │ │          │ │          │ │ Score    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│  ┌─── Quick Actions ───────────────────────────────────┐ │
│  │  [⚡ New Analysis]  [🔍 Search Jobs]  [📝 New Cover] │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─── Recent Activity ─────┐  ┌─── Upcoming ──────────┐ │
│  │ ● Analyzed "SWE @ Meta" │  │ 📅 Interview: Stripe   │ │
│  │   Score: 82%  2h ago    │  │    Tomorrow, 10:00 AM  │ │
│  │ ● Applied to Google     │  │ 📅 Deadline: Netflix    │ │
│  │   1d ago                │  │    Apply by Jul 20      │ │
│  │ ● Mock interview done   │  │ 📅 Follow-up: Amazon    │ │
│  │   2d ago                │  │    Send thank-you note  │ │
│  └─────────────────────────┘  └─────────────────────────┘ │
│                                                          │
│  ┌─── Application Funnel ──────────────────────────────┐ │
│  │  Applied: 12  →  Screened: 8  →  Interview: 3  →   │ │
│  │  Offer: 1                                             │ │
│  │  [View full analytics →]                              │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Metric cards:**
- Each is a white card (`gray-50` bg, `shadow-sm`, `radius-lg`).
- Icon in `primary-50` circle with `primary-500` icon color.
- Number in `heading-2` weight. Label in `body-sm gray-400`.
- Hover: subtle lift, cursor pointer, links to relevant section.

**Activity feed:**
- Timeline dots: `success` green for completed, `primary` blue for in-progress, `warning` amber for upcoming.
- Relative timestamps ("2h ago", "Tomorrow").

---

### 6.3 Resume Library (`/dashboard/resumes`)

```
┌──────────────────────────────────────────────────────────┐
│  Your Resumes                                [📤 Upload] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [All] [Tailored] [Draft]          🔍 Search resumes...  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  ┌──────┐  Senior SWE - Google Version             │  │
│  │  │ PDF  │  ATS Score: 87% ████████████░░           │  │
│  │  │thumb │  Last analyzed: Jul 15, 2026             │  │
│  │  │      │  Tags: [google] [senior] [backend]       │  │
│  │  └──────┘                           [View] [⋯]     │  │
│  ├────────────────────────────────────────────────────┤  │
│  │  ┌──────┐  General Resume v3                       │  │
│  │  │ PDF  │  ATS Score: 72% █████████░░░░           │  │
│  │  │thumb │  Last analyzed: Jul 12, 2026             │  │
│  │  │      │  Tags: [general] [full-stack]            │  │
│  │  └──────┘                           [View] [⋯]     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  Showing 2 of 5 resumes                                 │
└──────────────────────────────────────────────────────────┘
```

**Upload flow:**
1. Click "Upload" → full-screen dropzone overlay (not a modal — it's the main action).
2. Drop file → processing animation (animated ring + "Extracting text..." label).
3. Success → toast "Resume uploaded" + auto-navigate to detail page.
4. Error → inline error within dropzone, red border + specific message.

**Resume thumbnail:**
- PDF-to-image preview, 120×160px, `radius-md`, `shadow-sm`.
- Fallback: file icon with extension badge if thumbnail fails.

**ATS Score bar:**
- Horizontal bar, height 6px, `radius-full`.
- Fill color uses the score gradient from §2.1.
- Animated fill on mount (width transition 600ms ease-out).

---

### 6.4 Resume Detail & Analysis (`/dashboard/resumes/:id`)

**Goal:** Deep-dive into one resume's analysis with all related tools accessible.

```
┌──────────────────────────────────────────────────────────┐
│  Resumes > Senior SWE - Google Version                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─── Tabs ────────────────────────────────────────────┐ │
│  │ [Overview] [Skill Gap] [Cover Letter] [Interview]   │ │
│  │ [Salary] [Templates] [Export]                       │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─── Overview Tab (default) ──────────────────────────┐ │
│  │                                                     │ │
│  │  Overall Score                              87/100  │ │
│  │  ┌───────────────────────────────────────────┐      │ │
│  │  │  🟢████████████████████████████░░░  87%   │      │ │
│  │  └───────────────────────────────────────────┘      │ │
│  │                                                     │ │
│  │  Your resume is a strong match for this role.       │ │
│  │  It outperforms ~78% of similar resumes.           │ │
│  │                                                     │ │
│  │  ┌─── Category Scores ──────────────────────────┐   │ │
│  │  │  Formatting    ██████████░  92%  ✓ Excellent │   │ │
│  │  │  Keywords      █████████░░  85%  ✓ Strong    │   │ │
│  │  │  Experience    ████████░░░  78%  ✓ Good       │   │ │
│  │  │  Education     ███████████  95%  ✓ Excellent │   │ │
│  │  │  Skills Match  ███████░░░░  71%  ○ Fair      │   │ │
│  │  └───────────────────────────────────────────────┘   │ │
│  │                                                     │ │
│  │  ┌─── Strengths ────┐  ┌─── Weaknesses ──────────┐ │ │
│  │  │ ✓ Strong keyword │  │ ✗ Missing: "CI/CD"       │ │ │
│  │  │   alignment for  │  │ ✗ No quantified metrics  │ │ │
│  │  │   senior roles   │  │   in recent experience   │ │ │
│  │  │ ✓ Clear career   │  │ ✗ Skills section lacks   │ │ │
│  │  │   progression    │  │   cloud technologies     │ │ │
│  │  └──────────────────┘  └──────────────────────────┘ │ │
│  │                                                     │ │
│  │  ┌─── AI Tips ──────────────────────────────────┐   │ │
│  │  │  💡 Add "Kubernetes" to your skills section  │   │ │
│  │  │     [👍] [👎]                                │   │ │
│  │  │  💡 Quantify your Stripe impact: "Reduced    │   │ │
│  │  │     latency by 40%"                          │   │ │
│  │  │     [👍] [👎]                                │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                     │ │
│  │  [⚡ Tailor This Resume]  [📝 Generate Cover Letter]│ │
│  │  [🔍 Find Matching Jobs]  [📊 Compare Multi-JD]    │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Score circle (hero element):**
- Large donut/ring chart. Stroke width: 8px. Animated stroke-dashoffset on mount.
- Score number centered inside, `heading-1` size.
- Color: follows score gradient.

**AI Tips feedback:**
- Thumbs up/down per tip, 16px icons.
- Click → optimistic UI update ("Thanks for your feedback"), persisted to backend.
- Active state: filled icon in `primary-500`.

---

### 6.5 Batch Analysis (`/dashboard/batch`)

**Goal:** Compare N resumes against one JD.

```
┌──────────────────────────────────────────────────────────┐
│  Batch Analysis                            [➕ Add JD]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Job Description                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Senior Software Engineer — Google                  │  │
│  │ Requirements: 5+ years, Python, distributed...     │  │
│  │                                    [Edit] [Paste New]│  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─── Results (sorted by score) ──────────────────────┐ │
│  │                                                     │ │
│  │  Rank  Resume              Score   Keywords  Exp    │ │
│  │  ─────────────────────────────────────────────────  │ │
│  │  #1    SWE-Google v2      87%     92%       85%    │ │
│  │  #2    General Resume v3  72%     78%       65%    │ │
│  │  #3    Frontend Resume    54%     61%       48%    │ │
│  │                                                     │ │
│  │  Click any row to view side-by-side comparison      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  [📥 Export Comparison as PDF]                           │
└──────────────────────────────────────────────────────────┘
```

**Comparison table:**
- Striped rows (`gray-50` / white alternating).
- Score cell: colored pill badge matching score gradient.
- Sortable column headers (click to toggle asc/desc).
- Row hover: `gray-100` background, pointer cursor.

---

### 6.6 Job Search (`/jobs/search`)

**Goal:** Find relevant jobs with powerful filtering, without overwhelming the UI.

```
┌──────────────────────────────────────────────────────────┐
│  Job Search                                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🔍 Job title, company, or keywords...              │  │
│  │    📍 Location or "Remote"              [Search]   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─── Filters ────────────────────────────────────────┐  │
│  │ [All Sources ▾] [Full-time ▾] [Remote ▾] [Level ▾]│  │
│  │ [Salary: $100k+] [Posted: Past week] [Match > 70%] │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─── Results ────────────────────────────────────────┐  │
│  │                                                     │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ Senior Backend Engineer                      │   │  │
│  │  │ Google · Mountain View, CA · 3d ago          │   │  │
│  │  │                                               │   │  │
│  │  │ Match: 87% ████████████░░  💰 $180k-$240k   │   │  │
│  │  │                                               │   │  │
│  │  │ Python, Kubernetes, distributed systems...    │   │  │
│  │  │                                               │   │  │
│  │  │ [🔖 Save]  [📋 Quick Apply]  [📊 Full Match] │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                     │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ Full Stack Developer                         │   │  │
│  │  │ Stripe · Remote · 1w ago                     │   │  │
│  │  │ Match: 72% █████████░░░░  💰 $150k-$200k    │   │  │
│  │  │ ...                                           │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                          │
│  [Save This Search 🔔]                                   │
└──────────────────────────────────────────────────────────┘
```

**Job card interactions:**
- Hover: card lifts (`shadow-md`), "Quick Apply" button becomes `primary-500`.
- Bookmark toggle: heart icon fills red on save with a micro-animation (scale bounce).
- Match score: color-coded pill, same gradient as ATS scores.
- Salary: mono font, gray-600, right-aligned.

**Filter chips:**
- Applied filters show as removable chips below the filter bar.
- Each chip: `gray-100` bg, `gray-600` text, `×` to remove.
- Filter counts: "Full-time (42)" — always show counts.

---

### 6.7 Job Detail (`/jobs/:id`)

```
┌──────────────────────────────────────────────────────────┐
│  Jobs > Senior Backend Engineer — Google                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Senior Backend Engineer                                 │
│  Google · Mountain View, CA (Hybrid)                     │
│  Posted 3 days ago · 247 applicants                      │
│                                                          │
│  ┌─── AI Match ────────────────────────────────────────┐ │
│  │  🎯 Your Match: 87%                                 │ │
│  │  "This role strongly aligns with your backend and   │ │
│  │   distributed systems experience."                  │ │
│  │                                                     │ │
│  │  Matched: Python ✓  K8s ✓  Distributed ✓           │ │
│  │  Missing:  Terraform ✗  gRPC ✗                      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─── Job Description ─────────────────────────────────┐ │
│  │  About the role...                                  │ │
│  │  Requirements...                                    │ │
│  │  Nice to have...                                    │ │
│  │  Benefits...                                        │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─── Company Intel ───────────────────────────────────┐ │
│  │  Google · Technology · 180,000+ employees           │ │
│  │  ⭐ Glassdoor: 4.3/5  |  💰 Revenue: $307B         │ │
│  │  📰 Recent: Announces new AI initiative...          │ │
│  │  [View Full Company Profile →]                      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  [🔖 Bookmark]  [📝 Tailor Resume]  [📋 Apply →]        │
└──────────────────────────────────────────────────────────┘
```

---

### 6.8 Application Kanban Board (`/applications/board`)

**Goal:** Visual pipeline of all applications, drag-and-drop status updates.

```
┌──────────────────────────────────────────────────────────┐
│  Application Pipeline          [Board] [List] [Calendar] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─ Draft ─┐  ┌─ Applied ─┐  ┌─ Screen ─┐  ┌─ Interview┐ │
│  │         │  │           │  │          │  │           │ │
│  │ ┌─────┐ │  │ ┌───────┐ │  │ ┌──────┐ │  │ ┌───────┐ │ │
│  │ │Netflix│ │  ││Google │ │  ││Stripe│ │  ││Amazon │ │ │
│  │ │$190k │ │  ││$220k  │ │  ││$180k │ │  ││$200k  │ │ │
│  │ └─────┘ │  │ └───────┘ │  │ └──────┘ │  │ └───────┘ │ │
│  │         │  │ ┌───────┐ │  │          │  │ ┌───────┐ │ │
│  │         │  ││Meta   │ │  │          │  ││Uber   │ │ │
│  │         │  ││$210k  │ │  │          │  ││$175k  │ │ │
│  │         │  │ └───────┘ │  │          │  │ └───────┘ │ │
│  │   (0)   │  │    (2)    │  │    (1)   │  │    (2)    │ │
│  └─────────┘  └───────────┘  └──────────┘  └───────────┘ │
│                                                          │
│  ┌─ Offer ─┐  ┌─ Closed ─┐                               │
│  │         │  │          │                               │
│  │         │  │ ┌──────┐ │                               │
│  │         │  ││Stripe│ │                               │
│  │         │  ││Accepted││                               │
│  │         │  │└──────┘ │                               │
│  │   (0)   │  │   (1)   │                               │
│  └─────────┘  └──────────┘                               │
└──────────────────────────────────────────────────────────┘
```

**Drag and drop:**
- Cards are draggable. Ghost card at 80% opacity follows cursor.
- Drop zone highlights with `primary-50` background + dashed `primary-500` border.
- On drop: optimistic move + toast "Moved [Company] to [Stage]".
- Undo toast: "Undo" link appears for 5 seconds.

**Application card:**
- White card, `shadow-sm`, `radius-md`.
- Company name (heading-3), salary range (mono), days-in-stage badge.
- Color-coded left border: `primary` for active, `success` for offer, `gray` for closed.

---

### 6.9 Interview Calendar (`/interviews/calendar`)

```
┌──────────────────────────────────────────────────────────┐
│  Interview Calendar       [< Jul 2026 >]  [📅 Today]     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Mon   Tue   Wed   Thu   Fri   Sat   Sun                 │
│  ─────────────────────────────────────────────           │
│                  1     2     3     4     5               │
│                                                          │
│  6     7     8     9    10    11    12                   │
│                                  ▲                        │
│                               Stripe                     │
│                               Phone Screen               │
│                                                          │
│  13    14    15    16    17    18    19                   │
│                ▲                          ▲               │
│             Google                    Amazon              │
│             Onsite                    Final               │
│                                                          │
│  20    21    22    23    24    25    26                   │
└──────────────────────────────────────────────────────────┘
```

**Calendar interactions:**
- Today cell: `primary-50` background, `primary-500` date text.
- Event dots: colored by type — blue for phone screen, green for onsite, purple for final.
- Click event → popover with details + "Prepare" and "Add Notes" actions.
- Month navigation: smooth crossfade transition (200ms).

---

### 6.10 Mock Interview Simulator (`/interviews/mock`)

**Goal:** Realistic practice with AI, low anxiety, high learning.

```
┌──────────────────────────────────────────────────────────┐
│  Mock Interview                              [✕ End]     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Role: Senior Backend Engineer — Google                  │
│  Type: Technical + Behavioral (45 min)                   │
│                                                          │
│  ┌─── Chat ────────────────────────────────────────────┐ │
│  │                                                     │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ 👤 Interviewer                               │   │ │
│  │  │ Tell me about a time you handled a critical  │   │ │
│  │  │ production outage. What was your approach?   │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                     │ │
│  │            ┌──────────────────────────────────┐     │ │
│  │            │ 🧑 You                           │     │ │
│  │            │ In my previous role at Acme, we   │     │ │
│  │            │ experienced a...                  │     │ │
│  │            └──────────────────────────────────┘     │ │
│  │                                                     │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ 👤 Interviewer                               │   │ │
│  │  │ Good response. Follow-up: how did you        │   │ │
│  │  │ measure the impact of your resolution?       │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                     │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Type your answer...                      [Send]  │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─── Live Score ──────────────────────────────────────┐ │
│  │  Clarity: 8/10  |  Relevance: 9/10  |  Depth: 7/10 │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Chat UI:**
- Messages: standard chat bubble layout. Interviewer left, user right.
- Typing indicator: three animated dots when AI is "thinking".
- Auto-scroll to bottom on new message.
- User messages: `primary-500` bg, white text. Interviewer: `gray-100` bg, `gray-900` text.
- Input: sticky bottom, full-width, auto-expanding textarea (max 4 lines).

**Live score:**
- Fixed bar below input. Minimal, non-intrusive.
- Numbers update after each user response with a subtle pulse animation.

---

### 6.11 Offer Comparison Matrix (`/offers/compare`)

**Goal:** Unbiased side-by-side to make confident decisions.

```
┌──────────────────────────────────────────────────────────┐
│  Offer Comparison          [➕ Add Offer]                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│              Google         Meta          Stripe         │
│  ────────────────────────────────────────────────────    │
│  💰 Base      $220,000      $210,000      $195,000      │
│  📈 Equity    $80k/yr RSU   $90k/yr stock $120k/yr opt  │
│  🎯 Bonus     15% ($33k)    20% ($42k)    10% ($19.5k)  │
│  🏥 Health    Excellent     Good          Excellent     │
│  🏖️ PTO       20 days       Unlimited     25 days       │
│  🏠 Remote    Hybrid (3/2)  On-site       Fully remote  │
│  📊 Growth    Senior→Staff  IC5→IC6       Senior→Lead   │
│  ────────────────────────────────────────────────────    │
│                                                          │
│  ┌─── Your Weighted Score ────────────────────────────┐  │
│  │  Compensation: 30%    Google: 85    Meta: 82       │  │
│  │  Growth:       25%    Google: 90    Meta: 78       │  │
│  │  Culture:      20%    Google: 75    Meta: 80       │  │
│  │  Work-Life:    15%    Google: 70    Meta: 60       │  │
│  │  Location:     10%    Google: 65    Meta: 55       │  │
│  │  ──────────────────────────────────────────────    │  │
│  │  TOTAL               79.5          75.8            │  │
│  │                                                     │  │
│  │  🏆 Recommendation: Google edges ahead on growth   │  │
│  │     and compensation balance.                       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                          │
│  [📝 Negotiate]  [⚖️ Adjust Weights]  [📥 Export PDF]   │
└──────────────────────────────────────────────────────────┘
```

**Comparison table:**
- Sticky first column (row labels) on horizontal scroll (mobile).
- "Winning" value in each row: `success` green text + subtle green bg tint.
- Weight sliders: range inputs, 0–100%, with live score recalculation.
- Recommendation card: `primary-50` bg, `primary-500` left border, 4px.

---

### 6.12 Onboarding Checklist (`/onboarding/checklist`)

```
┌──────────────────────────────────────────────────────────┐
│  Onboarding Checklist — Starting at Google Jul 28        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Progress: ████████░░░░░░░░  12/20 tasks                │
│                                                          │
│  ┌─── Pre-Start (Jul 21–27) ──────────────────────────┐ │
│  │  ✅ Sign offer letter                               │ │
│  │  ✅ Submit background check                         │ │
│  │  ✅ Set up direct deposit                           │ │
│  │  ☐  Order laptop (due Jul 23)                      │ │
│  │  ☐  Complete benefits enrollment                    │ │
│  │  ☐  Review employee handbook                        │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─── First Week (Jul 28–Aug 1) ──────────────────────┐ │
│  │  ☐  Team introductions (scheduled: Jul 28 10am)    │ │
│  │  ☐  Dev environment setup                          │ │
│  │  ☐  First PR (stretch goal)                        │ │
│  │  ☐  1:1 with manager                               │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─── 30-Day Milestones ──────────────────────────────┐ │
│  │  ☐  Ship first feature                             │ │
│  │  ☐  Complete codebase walkthrough                  │ │
│  │  ☐  Establish on-call rotation understanding       │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Checklist interactions:**
- Checkbox: custom styled. Checked → `success` green + line-through text.
- Unchecking: immediate revert with no confirmation (it's a low-stakes toggle).
- Due date badges: `warning` amber if approaching, `danger` red if overdue.
- Progress bar: animated fill, percentage label, changes color at milestones (25%, 50%, 75%, 100%).

---

### 6.13 Settings (`/settings`)

```
┌──────────────────────────────────────────────────────────┐
│  Settings                                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────┬───────────────────────────────────────────┐   │
│  │      │                                           │   │
│  │ [👤]  │  Profile & Defaults                      │   │
│  │ [🔔]  │  Name: [Usama Khan        ]             │   │
│  │ [🔗]  │  Email: usama@example.com                │   │
│  │ [💳]  │  Default role target: [Senior Engineer ▾]│   │
│  │      │  Preferred location: [Remote     ▾]       │   │
│  │      │                                           │   │
│  │      │  [Save Changes]                           │   │
│  │      │                                           │   │
│  └──────┴───────────────────────────────────────────┘   │
│                                                          │
│  Notification Preferences                                │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Job match alerts           [Toggle: ON]           │  │
│  │  Application reminders      [Toggle: ON]           │  │
│  │  Interview prep nudges      [Toggle: OFF]          │  │
│  │  Weekly summary email       [Toggle: ON]           │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 7. Component Design System

### 7.1 Buttons

| Variant | Style | Use |
|---------|-------|-----|
| `primary` | `bg-primary-500`, white text, `radius-md` | Primary CTAs: "Analyze", "Apply", "Save" |
| `secondary` | `bg-white`, `border-gray-200`, `gray-700` text | Secondary actions: "Cancel", "Export" |
| `ghost` | transparent bg, `gray-600` text | Tertiary: "View All", navigation links |
| `danger` | `bg-danger`, white text | Destructive: "Delete", "Remove" |
| `icon` | `radius-full`, 40×40, `gray-100` bg | Icon-only: bookmark, settings, more menu |

**Sizes:**
- `sm`: height 32px, padding 0 12px, font 13px
- `md`: height 40px, padding 0 16px, font 14px (default)
- `lg`: height 48px, padding 0 24px, font 15px

**States:**
- Hover: darken bg by 10%
- Active/pressed: darken by 15%, scale(0.98)
- Disabled: opacity 50%, no pointer events
- Loading: spinner replaces label, button width preserved

### 7.2 Input Fields

```
┌─────────────────────────────────────────┐
│  Label (label token, gray-600)          │
│  ┌─────────────────────────────────────┐│
│  │ Placeholder (gray-400)              ││
│  └─────────────────────────────────────┘│
│  Helper text (body-sm, gray-400)        │
└─────────────────────────────────────────┘
```

- Height: 40px. Border: 1px `gray-200`. `radius-md`.
- Focus: `primary-500` border, `shadow-focus` ring.
- Error: `danger` border, error text below in `danger`.
- Success: `success` border + checkmark icon on right.

### 7.3 Cards

```
┌─────────────────────────────────────────┐
│  bg: white                              │
│  border: 1px gray-200                   │
│  radius: radius-lg (12px)               │
│  shadow: shadow-sm                      │
│  padding: space-6 (24px)                │
│                                         │
│  Hover: shadow-md, translateY(-2px)     │
│  Transition: 200ms ease                 │
└─────────────────────────────────────────┘
```

### 7.4 Modal / Dialog

```
┌──────────────────────────────────────────────────┐
│  Overlay: rgba(0,0,0,0.4), backdrop-blur(4px)    │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │  bg: white                               │    │
│  │  radius: radius-xl (16px)                │    │
│  │  shadow: shadow-lg                       │    │
│  │  max-width: 560px (standard), 720px (lg) │    │
│  │                                          │    │
│  │  ┌─ Header ──────────────────────── [✕]┐ │    │
│  │  │  Title (heading-3)                   │ │    │
│  │  ├──────────────────────────────────────┤ │    │
│  │  │                                      │ │    │
│  │  │           Body                       │ │    │
│  │  │                                      │ │    │
│  │  ├──────────────────────────────────────┤ │    │
│  │  │  [Cancel]              [Confirm]     │ │    │
│  │  └──────────────────────────────────────┘ │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

- Entrance: fade-in overlay (150ms) + scale(0.95)→scale(1) card (200ms).
- Exit: reverse of entrance.
- Trap focus inside modal. Close on Escape, close on overlay click.
- Scroll lock body when open.

### 7.5 Toast Notifications

```
┌─────────────────────────────────────────┐
│  ✅  Resume uploaded successfully.      │
│      [View]                    [✕]      │
└─────────────────────────────────────────┘
```

- Position: bottom-right, 16px from edges.
- Stack upward on multiple toasts (newest at bottom).
- Auto-dismiss: 5 seconds (success/info), 8 seconds (warning), manual dismiss (error).
- Entrance: slide in from right + fade. Exit: fade out.
- Variants: `success` (green left border), `error` (red), `warning` (amber), `info` (blue).

### 7.6 Tags / Badges

```
┌──────────────┐
│  remote       │  ← pill shape, radius-full
└──────────────┘
```

- `default`: `gray-100` bg, `gray-600` text
- `primary`: `primary-50` bg, `primary-500` text
- `success`: `success` bg at 10% opacity, `success` text
- `warning`: `warning` bg at 10% opacity, `warning` text
- `danger`: `danger` bg at 10% opacity, `danger` text
- Height: 24px. Font: `label` token (12px, 500).
- Removable variant: includes `×` button.

### 7.7 Score Indicator

Used everywhere scores appear (ATS, match, performance).

```
Horizontal bar (compact, in tables/cards):
┌──────────────────────────────┐
│  ████████████░░░░░  87%      │
└──────────────────────────────┘
Height: 6px. Gradient fill from §2.1.

Donut chart (hero/detail pages):
      ┌───────────┐
      │    87     │
      │   /100    │
      └───────────┘
Ring: 8px stroke. Animated on mount.
```

### 7.8 Empty States

Every list/table view needs a designed empty state:

```
┌─────────────────────────────────────────┐
│                                         │
│           📄 (large, gray-200)          │
│                                         │
│     No resumes uploaded yet             │
│                                         │
│  Upload your first resume to get        │
│  started with AI-powered analysis.      │
│                                         │
│       [📤 Upload Resume]                │
│                                         │
└─────────────────────────────────────────┘
```

- Illustration/icon: large (80px), `gray-200`.
- Heading: `heading-3`, `gray-600`.
- Description: `body`, `gray-400`, max-width 320px, centered.
- CTA: primary button.

---

## 8. Interaction Patterns

### 8.1 Loading States

| Scenario | Pattern |
|----------|---------|
| Page load (route transition) | Skeleton screens matching content layout. Pulse animation (opacity 0.4↔0.8, 1.5s infinite). |
| Button action (submit, save) | Spinner inside button, label replaced, width preserved. |
| AI processing (analysis, generation) | Full-page or section-level progress: animated ring + status text ("Analyzing keywords...", "Generating cover letter..."). |
| Data fetch (list, table) | Skeleton rows (3–5 placeholder rows matching card/table height). |

### 8.2 Error States

| Scenario | Pattern |
|----------|---------|
| Network error | Toast: "Connection lost. Retrying..." with auto-retry. |
| 404 | Full-page illustration + "Page not found" + back to dashboard CTA. |
| Validation error | Inline field errors (red border + message below input). |
| AI failure | Graceful fallback: "Analysis unavailable right now. Please try again." + retry button. Never show raw error. |
| Auth expired | Redirect to sign-in with return URL. Toast: "Session expired. Please sign in again." |

### 8.3 Optimistic Updates

- **Bookmark/unbookmark:** Toggle immediately, revert on failure.
- **Move on Kanban:** Move card, show undo toast, revert on failure.
- **Feedback (thumbs up/down):** Icon fills immediately, persists async.
- **Checklist items:** Toggle immediately.

### 8.4 Micro-interactions

| Element | Interaction |
|---------|-------------|
| Bookmark heart | Scale bounce: 1→1.3→1 on toggle (300ms) |
| Score bar fill | Width animates from 0 on mount (600ms ease-out) |
| Card hover | `translateY(-2px)` + `shadow-md` (200ms) |
| Button press | `scale(0.98)` (100ms) |
| Toast entry | Slide right + fade in (200ms) |
| Modal entry | Overlay fade (150ms) + card scale from 0.95 (200ms) |
| Tab indicator | `translateX` slides to active tab (250ms spring) |
| Checkbox check | Scale bounce + color fill (200ms) |

---

## 9. Responsive Design

### 9.1 Breakpoints

| Name | Width | Layout |
|------|-------|--------|
| `mobile` | < 640px | Single column, bottom tab nav, no sidebar |
| `tablet` | 640px–1024px | Two-column where possible, collapsed sidebar |
| `desktop` | > 1024px | Full layout with sidebar |
| `wide` | > 1440px | Content max-width 1200px, centered |

### 9.2 Mobile-Specific Adaptations

| Desktop Pattern | Mobile Adaptation |
|----------------|-------------------|
| Sidebar navigation | Bottom tab bar (5 items max): Dashboard, Jobs, Applications, Interviews, More |
| Kanban board (horizontal columns) | Vertical stacked columns, swipe between stages |
| Command palette (Cmd+K) | Search icon in header opens full-screen search |
| Side-by-side comparison | Stacked cards with horizontal scroll for metric rows |
| Calendar month view | Week view default, month available via toggle |
| Multi-column settings | Full-width stacked sections |

### 9.3 Mobile Bottom Tab Bar

```
┌──────────────────────────────────────────────┐
│  🏠       🔍       📋       🎤       ⋯      │
│  Home    Jobs    Apps    Interviews  More     │
└──────────────────────────────────────────────┘
```

- Height: 56px + safe area inset.
- Active tab: `primary-500` icon + label.
- Inactive: `gray-400` icon + label.
- "More" opens a sheet with remaining nav items.

---

## 10. Accessibility

### 10.1 Requirements

- **WCAG 2.1 AA** compliance minimum.
- All interactive elements must be keyboard-navigable (Tab, Enter, Escape, Arrow keys).
- Focus visible: `shadow-focus` ring on all focusable elements.
- Color is never the sole indicator of meaning — always pair with icons, text, or patterns.
- All images/icons have meaningful `alt` text or `aria-label`.
- Score bars include `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Modals trap focus and return focus on close.
- Toasts announced via `aria-live="polite"`.

### 10.2 Color Contrast

- All text meets 4.5:1 contrast ratio against its background (AA normal text).
- Large text (18px+ bold, 24px+ regular) meets 3:1 ratio.
- Interactive elements meet 3:1 against adjacent colors.

### 10.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animations (score fills, card hovers, modal transitions) are disabled or reduced to instant transitions for users who prefer reduced motion.

---

## 11. Dark Mode

Support system preference via `prefers-color-scheme` with manual toggle in settings.

### 11.1 Dark Palette Adjustments

| Token | Light | Dark |
|-------|-------|------|
| Page bg | `gray-50` (#F9FAFB) | `gray-950` (#0B0F19) |
| Card bg | white | `gray-900` (#111827) |
| Border | `gray-200` (#E5E7EB) | `gray-800` (#1F2937) |
| Body text | `gray-600` (#4B5563) | `gray-300` (#D1D5DB) |
| Heading text | `gray-900` (#111827) | `gray-50` (#F9FAFB) |
| Primary | `primary-500` (#2563EB) | `primary-400` (#60A5FA) |
| Score gradient | Same hues, full saturation | Same hues, slightly desaturated |

### 11.2 Dark Mode Specifics

- Shadows become more subtle (reduced opacity) or replaced with 1px borders.
- Skeleton screens use `gray-800` ↔ `gray-700` pulse.
- Score gradient colors shift slightly for contrast on dark backgrounds.

---

## 12. Animation & Motion

### 12.1 Timing Functions

| Token | Value | Use |
|-------|-------|-----|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exiting elements |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entering elements |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy micro-interactions |

### 12.2 Duration Scale

| Token | Value | Use |
|-------|-------|-----|
| `duration-fast` | 100ms | Button press, checkbox toggle |
| `duration-normal` | 200ms | Hover states, focus rings |
| `duration-slow` | 300ms | Modal enter/exit, toast slide |
| `duration-slower` | 600ms | Score bar fills, page transitions |

---

## 13. Copy & Content Guidelines

### 13.1 Voice & Tone

- **Confident, not arrogant.** "Your resume scores 87%" not "Congratulations, you're amazing!"
- **Action-oriented.** Every message tells the user what to do next.
- **Specific, not generic.** "Add 'Kubernetes' to your skills section" not "Consider updating your skills."
- **Encouraging on low scores.** "This resume has room to grow — here's where to focus" not "This resume is weak."

### 13.2 Empty State Copy

| Screen | Heading | Description | CTA |
|--------|---------|-------------|-----|
| No resumes | "No resumes yet" | "Upload your first resume to get AI-powered analysis and job matching." | "Upload Resume" |
| No applications | "Your pipeline is empty" | "Start applying to jobs and track your progress here." | "Search Jobs" |
| No interviews | "No interviews scheduled" | "When you land an interview, it'll show up here with prep tools." | "View Upcoming Deadlines" |
| No matches | "No job matches yet" | "We're scanning for roles that fit your profile. Try broadening your search." | "Adjust Filters" |
| Empty search | "No results found" | "Try different keywords or remove some filters." | "Clear Filters" |

---

## 14. File & Upload UX

### 14.1 Upload Flow

1. **Dropzone:** Large dashed-border area, centered icon + "Drop your resume or click to browse".
2. **Accepted formats:** PDF (primary), DOCX, TXT, HTML. Show accepted formats below dropzone.
3. **Dragover state:** Border becomes solid `primary-500`, background `primary-50`, subtle scale(1.01).
4. **File selected:** Show filename + size + format badge. "Remove" link. "Upload & Analyze" button appears.
5. **Uploading:** Progress bar (indeterminate if unknown size). Filename remains visible.
6. **Processing:** "Extracting text from PDF..." → "Analyzing against job description..." → "Generating recommendations..." (step indicator).
7. **Success:** Toast + auto-navigate to analysis page.
8. **Error:** Inline error in dropzone. Specific message ("File too large (max 10MB)" / "Unable to extract text from this PDF").

### 14.2 Drag & Drop Global

- Accept drag-and-drop for resume upload on dashboard pages.
- Visual feedback: full-screen overlay with dropzone styling when dragging files over the app.
- Multiple files: batch upload mode activates, shows queue with individual progress.

---

## 15. Notification System

### 15.1 In-App Notifications

- Bell icon in top nav with unread count badge (red circle, `label` token size).
- Dropdown: max 10 recent notifications, "View all" link.
- Each notification: icon + title + description + relative timestamp.
- Unread: `primary-50` background. Read: white.
- Types: job match, application update, interview reminder, deadline alert, system.

### 15.2 Push / Email Notifications

Configurable in settings. Defaults:
- **Email:** Weekly summary, interview reminders (24h before), deadline alerts (48h before).
- **Push:** New job matches (if browser permission granted), application status changes.

---

## 16. Print & Export Styling

### 16.1 PDF Export

Analysis reports exported as PDF should:
- Use print-optimized layout (no shadows, no animations, clean borders).
- Include all scores, recommendations, and tips.
- Header: app logo + resume name + export date.
- Footer: page numbers.
- Colors: full color supported, but ensure readability in grayscale (test).

### 16.2 Shareable Links

- Public report links: read-only, no auth required.
- Design: simplified layout, no nav sidebar, centered content, max-width 720px.
- Watermark: "Generated by AI Resume Analyzer" at bottom.

---

## 17. Performance Perceived Speed

| Technique | Application |
|-----------|-------------|
| **Skeleton screens** | Every data-loading page shows a layout skeleton before content arrives |
| **Optimistic updates** | Bookmarks, checklist toggles, kanban moves update UI before server confirms |
| **Progressive image loading** | Resume thumbnails blur-up: show 20px-wide blurred version, crossfade to full |
| **Prefetch on hover** | Job cards prefetch full job detail on hover (200ms delay) |
| **Stale-while-revalidate** | Dashboard metrics show cached data immediately, refresh in background |
| **Route-level code splitting** | Each major section (Jobs, Applications, Interviews, Offers, Onboarding) is a lazy chunk |

---

## 18. Design Tokens Summary

All design decisions above collapse into these token files for implementation:

```
tokens/
├── colors.ts        — All color values
├── typography.ts    — Font sizes, weights, line heights
├── spacing.ts       — Space scale (4px base)
├── radii.ts         — Border radius values
├── shadows.ts       — Box shadow definitions
├── animation.ts     — Durations, easing functions
├── breakpoints.ts   — Responsive breakpoints
└── components.ts    — Component-level tokens (button heights, card padding, etc.)
```

---

*This document is the single source of truth for all UI/UX decisions. When implementation diverges from this spec, update this file first — the code follows the design, not the other way around.*
