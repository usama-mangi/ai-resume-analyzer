# UI/UX Audit Report — Codebase vs Spec

> Every deviation between the implemented code and the `UI-UX-SPEC.md`, organized by severity and category. Each item links to the exact source file and line.

---

## Severity Key

| Level | Meaning |
|-------|---------|
| **CRITICAL** | Breaks a core design principle or causes a fundamentally wrong user experience |
| **HIGH** | Significant visual/interaction deviation that affects usability or consistency |
| **MEDIUM** | Noticeable inconsistency that a careful user would spot |
| **LOW** | Minor cosmetic deviation; polish item |

---

## 1. Typography

### 1.1 Wrong primary font family
**Severity:** CRITICAL
**Spec:** `--font-sans: 'Inter', system-ui, sans-serif`
**Code:** `app/app.css:6` — `--font-sans: "Mona Sans", ui-sans-serif, system-ui, sans-serif`
**Impact:** Inter is loaded via `root.tsx:23` but never used. Every rendered element uses Mona Sans, producing a fundamentally different visual personality than spec.

### 1.2 Inter loaded but unused
**Severity:** HIGH
**Spec:** Inter is the single typeface across the system.
**Code:** `app/root.tsx:23` loads Inter via Google Fonts, but `app.css:6` overrides `--font-sans` to Mona Sans. The Inter stylesheet is dead weight (~40KB).

---

## 2. Color System

### 2.1 Primary color mismatch
**Severity:** CRITICAL
**Spec:** `--color-primary-500: #2563EB` (Royal Blue). All CTAs, active states, links.
**Code:** `app/app.css:136` — `primary-gradient` uses `linear-gradient(to bottom, #8e98ff, #606beb)` (a muted indigo-purple gradient).
**Impact:** Every primary button, active tab, and CTA across the entire app uses a purple gradient instead of the spec's royal blue. This is the single largest visual divergence.

### 2.2 Score gradient colors wrong
**Severity:** HIGH
**Spec:** Score gradient uses `#FF97AD → #5171FF` (pink-to-blue). This is not defined anywhere in the spec's color system.
**Code:** `app/components/ScoreCircle.tsx:29-30` — `#FF97AD` to `#5171FF`.
**Code:** `app/components/ScoreGuage.tsx:26-29` — `#a78bfa` to `#fca5a5` (purple-to-red).
**Impact:** The two score visualizations use completely different gradients from each other and from the spec's score gradient (`#DC2626 → #F59E0B → #22C55E → #2563EB → #7C3AED`).

### 2.3 Score gradient should be range-based, not static
**Severity:** HIGH
**Spec:** 4-tier score gradient: 0–39% red→amber, 40–69% amber→yellow, 70–89% green→emerald, 90–100% blue→violet. Color should change based on score range.
**Code:** Both `ScoreCircle.tsx` and `ScoreGuage.tsx` use a single static gradient regardless of score value. A score of 15 and 95 get the same color.

### 2.4 Missing semantic color tokens
**Severity:** MEDIUM
**Spec:** Defines `--color-success: #059669`, `--color-warning: #D97706`, `--color-danger: #DC2626`, `--color-info: #0891B2` as first-class tokens.
**Code:** `app.css` only defines badge colors (`badge-green`, `badge-red`, `badge-yellow`, `badge-blue`, `badge-purple`). No `--color-success/warning/danger/info` tokens. Pages use raw Tailwind classes (`text-green-600`, `text-red-500`, etc.) inconsistently.

### 2.5 Badge colors don't match spec
**Severity:** MEDIUM
**Spec:** Badge semantic colors: `success` green, `warning` amber, `danger` red, `info` cyan.
**Code:** `app.css:12-22` — Badge tokens use different hex values (`#d5faf1` for green, `#f9e3e2` for red, etc.) that don't correspond to the spec's `--color-success` / `--color-warning` / `--color-danger`.

### 2.6 Page background is white, not spec gray
**Severity:** LOW
**Spec:** `--color-gray-50: #F9FAFB` as page background.
**Code:** `app.css:27` — `@apply bg-white`. Pure white instead of the warm off-white specified.

---

## 3. Spacing & Radius

### 3.1 Global input radius too large
**Severity:** MEDIUM
**Spec:** `--radius-md: 8px` for inputs.
**Code:** `app.css:45-46` — `@apply w-full p-4 inset-shadow rounded-2xl`. `rounded-2xl` = 16px. Spec says 8px.

### 3.2 Card radius too large
**Severity:** MEDIUM
**Spec:** `--radius-lg: 12px` for cards.
**Code:** `app.css:92` — `.resume-card` uses `rounded-2xl` (16px). `app.css:93` also uses `rounded-2xl`. Spec says 12px.

### 3.3 Input padding too generous
**Severity:** LOW
**Spec:** Input height 40px, standard padding.
**Code:** `app.css:45` — `p-4` (16px all sides) on inputs. With 16px radius this creates very large, bubbly inputs unlike the spec's 40px height with proportional padding.

### 3.4 Inset shadow on inputs not in spec
**Severity:** MEDIUM
**Spec:** Inputs: `border: 1px gray-200`. Focus: `primary-500` border + `shadow-focus` ring.
**Code:** `app.css:45` — `inset-shadow` applies `box-shadow: inset 0 0 12px 0 rgba(36, 99, 235, 0.2)` with `backdrop-filter: blur(10px)`. No visible border. This creates a frosted-glass effect not described in the spec.

---

## 4. Navigation

### 4.1 No fixed top nav bar
**Severity:** CRITICAL
**Spec:** Fixed to viewport top. Height: 64px. Z-index: 50. Full-width with bottom border indicator.
**Code:** `app/components/Navbar.tsx` — Floating pill-shaped navbar (`rounded-full`, `max-w-[1200px]`, `mx-auto`). Not fixed-position. No bottom border. No height constraint. It's a centered floating capsule, not a full-width fixed bar.

### 4.2 No sidebar navigation
**Severity:** CRITICAL
**Spec:** Dashboard context has a 240px collapsible sidebar with sections (Overview, Resumes, Batch) and quick actions (New Analysis, Upload).
**Code:** No sidebar component exists. All navigation is via the top navbar links and inline CTAs.

### 4.3 No command palette (Cmd+K)
**Severity:** HIGH
**Spec:** Global search overlay triggered by Cmd+K / Ctrl+K from any screen. Shows recent items, quick actions, navigation.
**Code:** No command palette implementation found anywhere in the codebase.

### 4.4 Nav links missing from spec
**Severity:** MEDIUM
**Spec:** Nav items: Dashboard, Jobs, Applications, Interviews, Offers, Onboard.
**Code:** `app/components/Navbar.tsx:22-33` — Only shows: Job Search, Batch Analysis, Portfolio, LinkedIn Optimizer. Missing: Applications, Interviews, Offers, Onboarding, Dashboard link.

### 4.5 No active nav indicator
**Severity:** MEDIUM
**Spec:** Active nav item: `primary-500` text + 2px bottom border indicator.
**Code:** `app/components/Navbar.tsx:22` — Nav links use static `text-gray-600`. No active state styling, no bottom border indicator, no route-aware highlighting.

### 4.6 Logo text doesn't match spec
**Severity:** LOW
**Spec:** Logo links to `/dashboard`.
**Code:** `app/components/Navbar.tsx:17` — Logo text is "Resumind" with `text-gradient` class. Spec doesn't name the product but the gradient (`from-[#AB8C95] via-[#000000] to-[#8E97C5]`) is a pink-black-purple gradient unrelated to the spec's color system.

---

## 5. Route Architecture

### 5.1 Flat route structure, not nested
**Severity:** HIGH
**Spec:** Hierarchical routes under section prefixes: `/dashboard/overview`, `/dashboard/resumes/:id`, `/jobs/search`, `/applications/board`, `/interviews/calendar`, `/offers/compare`, `/onboarding/checklist`.
**Code:** `app/routes.ts` — All routes are flat at root: `/resume/:id`, `/jobs`, `/applications`, `/mock-interview`, `/offer-comparison`, `/onboarding-checklist`. No nested layout routes, no section grouping.

### 5.2 Missing dashboard overview page
**Severity:** HIGH
**Spec:** `/dashboard/overview` with metric cards (Resumes, Applied, Interview, Avg ATS), Quick Actions bar, Recent Activity feed, Upcoming deadlines, Application Funnel.
**Code:** `app/routes/home.tsx` — The home/dashboard page is a resume list with filter tabs. No metric cards, no quick actions, no activity feed, no funnel visualization.

### 5.3 Missing dedicated resume list route
**Severity:** MEDIUM
**Spec:** `/dashboard/resumes` — Dedicated resume library with search, filter tabs (All, Tailored, Draft), and grid of resume cards.
**Code:** Resume list is combined with the home page (`app/routes/home.tsx`). No search functionality for resumes.

---

## 6. Component Deviations

### 6.1 Buttons use wrong shape
**Severity:** HIGH
**Spec:** Primary button: `bg-primary-500`, white text, `radius-md` (8px). Multiple sizes (sm/md/lg).
**Code:** `app.css:64` — `.primary-button` uses `rounded-full` (pill shape), `primary-gradient` (purple gradient), full-width by default. The spec explicitly says `radius-md` for buttons, not pill-shaped.

### 6.2 No button size variants
**Severity:** MEDIUM
**Spec:** Three button sizes: `sm` (32px), `md` (40px), `lg` (48px).
**Code:** Only one `.primary-button` class with fixed padding (`px-4 py-2`). No size variants.

### 6.3 ScoreCircle has no animation
**Severity:** MEDIUM
**Spec:** Score bar fill animated on mount (width transition 600ms ease-out). Donut chart: animated stroke-dashoffset on mount.
**Code:** `app/components/ScoreCircle.tsx` — SVG circle renders immediately with no entrance animation. No `stroke-dashoffset` transition.

### 6.4 ScoreGauge has no animation
**Severity:** MEDIUM
**Spec:** Animated fill on mount (600ms ease-out).
**Code:** `app/components/ScoreGuage.tsx` — Uses `useEffect` to measure path length but no CSS transition or animation on the stroke-dashoffset. Renders statically.

### 6.5 ScoreCircle is too small
**Severity:** LOW
**Spec:** "Large donut/ring chart" as hero element. "Score number centered inside, heading-1 size."
**Code:** `app/components/ScoreCircle.tsx:10` — `w-[100px] h-[100px]`. Score text uses `text-sm`. This is a small inline element, not a hero element.

### 6.6 ScoreBadge missing the numeric score
**Severity:** LOW
**Spec:** ScoreBadge should show the numeric score with a label ("Strong", "Good start", "Needs work").
**Code:** `app/components/ScoreBadge.tsx` — Only shows text label ("Strong", "Good start", "Needs work"). No numeric score displayed.

### 6.7 ResumeCard missing thumbnails
**Severity:** HIGH
**Spec:** "PDF-to-image preview, 120×160px, radius-md, shadow-sm. Fallback: file icon."
**Code:** `app/components/ResumeCard.tsx:164-186` — PDF resumes show a full-width image in a `gradient-border` wrapper at `h-[300px]`. Non-PDF resumes show a text preview. Neither matches the spec's 120×160px thumbnail card.

### 6.8 ResumeCard has no hover lift
**Severity:** LOW
**Spec:** Card hover: `shadow-md`, `translateY(-2px)`, 200ms transition.
**Code:** `app/components/ResumeCard.tsx:138` — No hover state classes. Cards are static `Link` elements with no visual hover feedback.

### 6.9 ATS component missing score bar
**Severity:** HIGH
**Spec:** "Horizontal bar, height 6px, radius-full. Fill color uses the score gradient."
**Code:** `app/components/ATS.tsx` — Shows a text string "ATS Score - {score}/100" with an icon. No visual score bar, no gradient fill, no animated progress.

### 6.10 ATS tips feedback hidden by default
**Severity:** MEDIUM
**Spec:** Thumbs up/down on each tip, always visible (or on hover).
**Code:** `app/components/ATS.tsx:69` — `opacity-0 group-hover:opacity-100`. Feedback buttons are invisible until hover. On mobile/touch, they're never visible.

### 6.11 Details component duplicate ScoreBadge
**Severity:** LOW
**Spec:** Single `ScoreBadge` component.
**Code:** `app/components/Details.tsx:11-42` — Defines a local `ScoreBadge` component that differs from the one in `ScoreBadge.tsx`. The Details version includes an icon; the standalone version doesn't. Two competing implementations.

### 6.12 Category scores missing horizontal bar
**Severity:** MEDIUM
**Spec:** Category scores shown as horizontal progress bars: `Formatting ██████████░ 92%`.
**Code:** `app/components/Summary.tsx:13-24` — Category scores show only a number + badge. No horizontal progress bar visualization.

### 6.13 Accordion items missing border
**Severity:** LOW
**Spec:** Cards have `border: 1px gray-200`.
**Code:** `app/components/Accordion.tsx:75` — Accordion items use `border-b border-gray-200` (only bottom border). Other card-like containers in the app use different border treatments.

---

## 7. Layout System

### 7.1 No page shell / layout wrapper
**Severity:** CRITICAL
**Spec:** Every authenticated page shares a consistent layout: Top Nav (64px) + Sidebar (240px) + Content Area. Max-width 1200px centered on wide screens.
**Code:** No shared layout component. Each route manually imports `<Navbar />` and wraps content in `<main className="main-section">`. The layout varies per page — some use `bg-[url('/images/bg-main.svg')]`, others use `bg-gray-50`.

### 7.2 Inconsistent page backgrounds
**Severity:** HIGH
**Spec:** Consistent `--color-gray-50: #F9FAFB` page background.
**Code:**
- `home.tsx:98` — `bg-[url('/images/bg-main.svg')] bg-cover` (background image)
- `upload.tsx:75` — `bg-[url('/images/bg-main.svg')] bg-cover`
- `resume.tsx:115` — No background class (inherits `bg-white` from body)
- `applications.tsx:133` — `bg-gray-50`
- `offer-comparison.tsx:122` — `min-h-screen bg-gray-50`
- `onboarding-checklist.tsx:106` — `min-h-screen bg-gray-50`
- `mock-interview.tsx:154` — `bg-[url('/images/bg-main.svg')] bg-cover`

Three different background strategies across the app.

### 7.3 No max-width constraint on content
**Severity:** MEDIUM
**Spec:** Content area max-width 1200px, centered with auto margins on wide screens.
**Code:** `app.css:82` — `.main-section` uses `max-w-6xl` (1152px). Some pages like `applications.tsx:135` use `max-w-[1400px]`. `jobs.tsx:786` uses `max-w-7xl` (1280px). Inconsistent max-widths.

### 7.4 Missing page header pattern
**Severity:** MEDIUM
**Spec:** Every page starts with: Breadcrumb + Page Title (heading-1) + One-line description + Primary CTA.
**Code:** Some pages have a heading + subtitle (`page-heading` class), but no breadcrumbs anywhere. CTA placement varies. No consistent page header pattern.

---

## 8. Missing Features (UI Layer)

### 8.1 No toast notification system
**Severity:** CRITICAL
**Spec:** Toast notifications: bottom-right stack, auto-dismiss (5s success, 8s warning), slide-in animation, 4 variants (success/error/warning/info), undo capability for destructive actions.
**Code:** No toast component exists. Error handling uses:
- `alert()` calls: `jobs.tsx:179,209,222,234,273,288` (6 occurrences)
- `confirm()` calls: `jobs.tsx:227`, `mock-interview.tsx:136`, `interview-schedule.tsx:123`, `onboarding-checklist.tsx:87`
- Inline error divs: `applications.tsx:178`, `offer-comparison.tsx:133`

All three patterns violate the spec's toast system.

### 8.2 No skeleton loading states
**Severity:** HIGH
**Spec:** Skeleton screens matching content layout. Pulse animation (opacity 0.4↔0.8, 1.5s infinite).
**Code:** Loading states are:
- GIF animations: `home.tsx:112` (`resume-scan-2.gif`), `upload.tsx:85` (`resume-scan.gif`), `interview-schedule.tsx:149`
- Spinner: `jobs.tsx:859` (CSS `animate-spin`)
- Plain text: `applications.tsx:207` (`"Loading..."`), `offer-comparison.tsx:136`, `onboarding-checklist.tsx:120`

No skeleton screens anywhere in the codebase.

### 8.3 No dark mode
**Severity:** HIGH
**Spec:** Full dark mode support via `prefers-color-scheme` with manual toggle. Complete dark palette mapping.
**Code:** No dark mode implementation. No `dark:` Tailwind classes. No theme toggle. No CSS custom property switching.

### 8.4 No reduced motion support
**Severity:** MEDIUM
**Spec:** `@media (prefers-reduced-motion: reduce)` — disable all animations.
**Code:** `app.css` has no `prefers-reduced-motion` media query. Animations (`animate-pulse`, `animate-bounce`, `animate-spin`, `animate-in fade-in`) run unconditionally.

### 8.5 No focus ring styling
**Severity:** MEDIUM
**Spec:** Focus visible: `shadow-focus` ring (`0 0 0 3px rgba(37,99,235,0.15)`) on all focusable elements.
**Code:** No `shadow-focus` token defined. `Accordion.tsx:128` uses `focus:outline-none` which removes the default outline with no custom replacement. Form inputs in `jobs.tsx:349` use `focus:ring-2 focus:ring-primary` but `primary` isn't defined as a Tailwind color.

### 8.6 No empty state illustrations
**Severity:** MEDIUM
**Spec:** Empty states: large icon (80px, gray-200) + heading + description + CTA button. Specific copy for each screen.
**Code:** Empty states are plain text:
- `jobs.tsx:882` — `"No jobs found. Try adjusting your search criteria."` (no icon, no CTA)
- `applications.tsx:308` — `"No applications found"` (no icon, no CTA)
- `onboarding-checklist.tsx:123` — `"No onboarding checklists yet. Click 'New Checklist' to get started."` (text only)

### 8.7 No keyboard navigation / accessibility attributes
**Severity:** HIGH
**Spec:** WCAG 2.1 AA. Keyboard navigable. Focus visible. `aria-valuenow` on score bars. Focus trap in modals. `aria-live` for toasts.
**Code:** No ARIA attributes on score visualizations. Modal components (e.g., `jobs.tsx:689`, `applications.tsx:319`, `offer-comparison.tsx:219`) have no focus trapping, no `role="dialog"`, no `aria-modal`. No `aria-live` regions.

---

## 9. Interaction Patterns

### 9.1 No optimistic updates for most actions
**Severity:** MEDIUM
**Spec:** Bookmark/unbookmark, kanban move, feedback toggle, checklist items — all optimistic with revert on failure.
**Code:**
- `home.tsx:70-83` — Status change IS optimistic (good).
- `jobs.tsx:238-245` — Bookmark toggle is NOT optimistic (waits for server).
- `onboarding-checklist.tsx:71-83` — Checklist toggle is NOT optimistic.
- `applications.tsx:93-101` — Kanban move is NOT optimistic (full `loadPipeline()` reload).

### 9.2 No micro-interactions
**Severity:** MEDIUM
**Spec:** Bookmark heart bounce (1→1.3→1, 300ms), score bar fill animation (600ms), card hover lift (200ms), button press scale(0.98), checkbox bounce.
**Code:** No CSS transitions or keyframe animations on any interactive element. The only animations are:
- `animate-in fade-in duration-1000` on some containers (from tw-animate-css)
- `animate-pulse` on loading text
- `animate-bounce` on typing indicator dots

### 9.3 No drag-and-drop on kanban
**Severity:** MEDIUM
**Spec:** Cards are draggable. Ghost card at 80% opacity follows cursor. Drop zone highlights. Undo toast on drop.
**Code:** `app/routes/applications.tsx:239-258` — Status change uses a `<select>` dropdown ("Move..."), not drag-and-drop.

### 9.4 Modal focus trap missing
**Severity:** MEDIUM
**Spec:** Modal traps focus, close on Escape, close on overlay click, scroll lock body.
**Code:** Modal close is only on overlay click (`onClick={() => setShowForm(false)}`) and `×` button. No Escape key handler. No focus trap. No body scroll lock.

### 9.5 No animation on modal enter/exit
**Severity:** LOW
**Spec:** Entrance: fade-in overlay (150ms) + scale(0.95)→scale(1) card (200ms). Exit: reverse.
**Code:** Modals render conditionally with no enter/exit animation. They appear/disappear instantly.

---

## 10. Page-Specific Deviations

### 10.1 Landing page is actually a dashboard
**Severity:** CRITICAL
**Spec:** Landing page (`/`) is a marketing page: hero section, value proposition, feature grid, social proof, CTA to sign up.
**Code:** `app/routes/home.tsx` — The index route (`/`) is the authenticated dashboard with resume list and filter tabs. There is no marketing/landing page. Unauthenticated users are redirected to `/login`.

### 10.2 Upload page has job description field (should be separate)
**Severity:** MEDIUM
**Spec:** Upload page: dropzone + accepted formats display. Job description is a separate step/input.
**Code:** `app/routes/upload.tsx:96-133` — Upload form includes Company Name, Job Title, and Job Description fields alongside the file upload. This conflates upload and analysis into one form.

### 10.3 Resume detail page has no tabs
**Severity:** HIGH
**Spec:** Resume detail has tabbed navigation: Overview, Skill Gap, Cover Letter, Interview, Salary, Templates, Export.
**Code:** `app/routes/resume.tsx:147-158` — Related features are shown as a row of pill buttons (Links), not tabs. No tab switching behavior — each click navigates to a separate route.

### 10.4 Job search has no match score on cards
**Severity:** MEDIUM
**Spec:** Job cards show match score: `Match: 87% ████████████░░` with colored pill badge.
**Code:** `app/routes/jobs.tsx:441-451` — Match scores ARE shown when available (good), but they're only computed for the first resume (`resumes[0].id`), not user-selectable.

### 10.5 Application kanban missing column counts in header
**Severity:** LOW
**Spec:** Column headers show count: `Draft (0)`, `Applied (2)`.
**Code:** `app/routes/applications.tsx:224` — Count IS shown as a badge within the column header. This matches.

### 10.6 Mock interview chat colors wrong
**Severity:** MEDIUM
**Spec:** User messages: `primary-500` bg, white text. Interviewer: `gray-100` bg, `gray-900` text.
**Code:** `app/routes/mock-interview.tsx:278-281` — User messages: `bg-blue-600 text-white`. Interviewer: `bg-gray-100 text-gray-900`. The user message color (`blue-600`) is close but not `primary-500` as specified.

### 10.7 Mock interview missing live score bar
**Severity:** MEDIUM
**Spec:** "Fixed bar below input. Minimal, non-intrusive. Numbers update after each user response with a subtle pulse animation."
**Code:** `app/routes/mock-interview.tsx` — No live score bar during the interview. Scores are only shown after completion in the feedback section.

### 10.8 Offer comparison missing sticky first column
**Severity:** LOW
**Spec:** Sticky first column (row labels) on horizontal scroll (mobile).
**Code:** `app/routes/offer-comparison.tsx:166-202` — Table has `overflow-x-auto` but no sticky positioning on the first column.

### 10.9 Onboarding checklist missing phase groupings
**Severity:** LOW
**Spec:** Checklist organized by phase: "Pre-Start (Jul 21–27)", "First Week (Jul 28–Aug 1)", "30-Day Milestones".
**Code:** `app/routes/onboarding-checklist.tsx:155-196` — Items are grouped by `category.name` from the API, which may or may not correspond to phases. No explicit phase/date grouping in the UI.

### 10.10 Interview schedule has no calendar view
**Severity:** HIGH
**Spec:** Calendar view with month grid, event dots, click event for details.
**Code:** `app/routes/interview-schedule.tsx` — List view only. No calendar grid, no month navigation, no visual date representation.

---

## 11. Error Handling

### 11.1 Using browser `alert()` instead of toasts
**Severity:** HIGH
**Spec:** Toast system: bottom-right stack, auto-dismiss, undo capability.
**Code:** 6 occurrences of `alert()` across the codebase:
- `jobs.tsx:179` — `"Search failed. Please try again."`
- `jobs.tsx:209` — `"Failed to save search. Please try again."`
- `jobs.tsx:222` — `"Failed to run saved search."`
- `jobs.tsx:234` — `"Failed to delete saved search."`
- `jobs.tsx:273` — `"Please upload a resume first to analyze job matches."`
- `jobs.tsx:288` — `"Failed to analyze job match."`

### 11.2 Using browser `confirm()` instead of in-app dialogs
**Severity:** MEDIUM
**Spec:** Confirmation via in-app modal dialog with styled Confirm/Cancel buttons.
**Code:** 4+ occurrences of `confirm()`:
- `jobs.tsx:227` — `"Delete this saved search?"`
- `mock-interview.tsx:136` — `"Delete this interview session?"`
- `interview-schedule.tsx:123` — `"Delete this schedule entry?"`
- `onboarding-checklist.tsx:87` — `"Delete this onboarding checklist?"`

---

## 12. Missing Shared Components

The spec defines these component patterns that have no implementation:

| Component | Spec Section | Status |
|-----------|-------------|--------|
| Toast notification system | §7.5 | Missing entirely |
| Modal/Dialog component | §7.4 | Inline `<div>` patterns, no shared component |
| Skeleton loader | §8.1 | Missing entirely |
| Empty state component | §7.8 | Inline text, no shared component |
| Focus ring utility | §10.1 | Missing entirely |
| Score horizontal bar | §7.8 | Missing (only circle/gauge exist) |
| Breadcrumb component | §5.2 | Missing entirely |
| Calendar grid | §6.9 | Missing (list only) |
| Kanban drag-and-drop | §6.8 | Select dropdown instead |
| Command palette | §4.3 | Missing entirely |
| Dark mode toggle | §11 | Missing entirely |

---

## 13. Summary Statistics

| Category | CRITICAL | HIGH | MEDIUM | LOW | Total |
|----------|----------|------|--------|-----|-------|
| Typography | 1 | 1 | 0 | 0 | 2 |
| Color System | 1 | 2 | 3 | 1 | 7 |
| Spacing & Radius | 0 | 0 | 3 | 1 | 4 |
| Navigation | 2 | 1 | 3 | 1 | 7 |
| Route Architecture | 0 | 2 | 1 | 0 | 3 |
| Components | 0 | 3 | 3 | 4 | 10 |
| Layout System | 1 | 1 | 2 | 0 | 4 |
| Missing Features | 1 | 3 | 3 | 0 | 7 |
| Interactions | 0 | 0 | 4 | 1 | 5 |
| Page-Specific | 1 | 2 | 3 | 2 | 8 |
| Error Handling | 0 | 1 | 1 | 0 | 2 |
| **Totals** | **7** | **16** | **26** | **10** | **59** |

---

## 14. Priority Remediation Order

### Phase 1: Foundation (fixes the most visual drift)
1. Replace Mona Sans with Inter as `--font-sans`
2. Replace `primary-gradient` with solid `#2563EB` (royal blue)
3. Add consistent page background (`bg-gray-50`) to all routes
4. Fix button shape: `rounded-full` → `rounded-lg` (8px)
5. Fix input styling: remove `inset-shadow`, add `border border-gray-200 rounded-lg`

### Phase 2: Navigation (structure the app correctly)
6. Build a fixed top nav bar (64px, full-width, z-50)
7. Build a collapsible sidebar for dashboard sections
8. Restructure routes under nested layouts (`/dashboard/*`, `/jobs/*`, etc.)
9. Add active nav state with bottom border indicator

### Phase 3: Component System (consistency)
10. Build a toast notification system
11. Build a modal/dialog component with focus trap + Escape
12. Build skeleton loaders for all data-fetching views
13. Build empty state component with icon + CTA
14. Add focus ring utility (`shadow-focus`)
15. Unify ScoreBadge (remove duplicate in Details.tsx)

### Phase 4: Score Visualizations (data as story)
16. Make ScoreCircle gradient range-based (4 tiers)
17. Make ScoreGauge gradient range-based (4 tiers)
18. Add animated fill on mount for both score components
19. Add horizontal score bar component
20. Make ScoreCircle larger for hero contexts

### Phase 5: Interactions (polish)
21. Add card hover lift (`translateY(-2px)`, `shadow-md`)
22. Add button press scale(0.98)
23. Add modal enter/exit animations
24. Add `prefers-reduced-motion` media query
25. Convert `alert()`/`confirm()` to toast/modal
26. Add optimistic updates to bookmark, checklist, kanban

### Phase 6: Missing Pages
27. Build marketing landing page (hero, features, social proof)
28. Build dashboard overview with metric cards + activity feed
29. Add calendar view for interview scheduling
30. Add Cmd+K command palette
31. Add dark mode toggle + dark palette
