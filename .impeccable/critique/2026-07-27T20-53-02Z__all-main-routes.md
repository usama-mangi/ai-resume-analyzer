---
target: all main routes
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 1
p2_count: 2
p3_count: 1
timestamp: 2026-07-27T20-53-02Z
slug: all-main-routes
---
## Design Specificity Verdict

**Verdict: Partially authored, mostly category-interchangeable.**

The "Expedition Journal" metaphor is present in CSS tokens (parchment background, `shadow-paper`, `waypoint-card`, `field-note`, compass rose logo) and in copy ("traverse," "base camps," "sherpa," "route"). But the actual visual surfaces don't deliver on this promise. The cards, layouts, buttons, and empty states are structurally identical to any SaaS job tracker. The topographic grid at 3% opacity is invisible. The `field-note` rotation (-0.5deg) is never used in the authenticated surfaces. The waypoint timeline appears only on the landing page. The authenticated experience — where users spend 95% of their time — looks like a generic React dashboard with warm-tinted colors swapped in. The design system is a warm palette on a cold skeleton.

**LLM assessment:** 2/5 for design specificity. The bones exist. The flesh doesn't.

**Deterministic scan:** 1 finding from the CLI detector (1 warning, 0 errors). The single finding — `gray-on-color` on `ResumeCard.tsx:242` — is a false positive (hover-only state). The detector is thin; the real issues are structural (STATUS_CONFIG duplication, inconsistent skeleton colors, dead CSS utilities).

**Visual overlays:** No browser injection was attempted for this broad review. The detector ran only the CLI scan.

---

## Cognitive Load Checklist

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Single focus per screen | PASS | Each route has a clear primary action |
| 2 | Chunking | PASS | Dashboard chunks stats, pipeline, matches |
| 3 | Grouping | PASS | Sidebar groups by lifecycle phase |
| 4 | Visual hierarchy | PARTIAL | Landing page works; dashboard stat cards compete |
| 5 | One thing at a time | FAIL | Dashboard crams pipeline, matches, interviews, actions, saved searches, resumes into one scroll |
| 6 | Minimal choices | FAIL | Jobs page: 5 filter groups + 4 tabs + search + save form = decision overload on first load |
| 7 | Working memory | FAIL | Kanban has 8 columns visible simultaneously — user must hold pipeline state in memory |
| 8 | Progressive disclosure | FAIL | Interview prep form shows all fields at once; no "advanced options" for JD/resume inputs |

**Failures: 4 → HIGH cognitive load.**

---

## Emotional Journey

The peak-end rule applies. The landing page creates a strong positive peak: the route map visualization is the single best design moment in the product. It communicates the compound context value prop visually.

**Emotional valleys:**
- Empty dashboard (first-time user): functional but emotionally flat. "Start your expedition" is good copy, but the visual is a generic icon in a warm circle. No illustration, no sense of possibility.
- Offers page — the highest-stakes moment — is the weakest surface. Plain card grid with raw salary numbers. No celebration when an offer arrives. No anxiety-soothing copy. No "this is a big deal" framing. The negotiation CTA is a small secondary button.
- Interview prep generation uses `resume-scan.gif` — a generic spinner with no progress indication.

**Reassurance at high-stakes moments:** Missing. Offer comparison, salary negotiation, and resignation letter pages have zero emotional design.

---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading skeletons present; no progress on AI generation |
| 2 | Match System / Real World | 3 | Expedition metaphors in copy; "pipeline" is industry jargon |
| 3 | User Control and Freedom | 4 | Undo on kanban, cancel on modals, back nav — excellent |
| 4 | Consistency and Standards | 2 | STATUS_CONFIG duplicated 3x with structural drift; tab patterns inconsistent |
| 5 | Error Prevention | 2 | No confirmation on destructive kanban moves; confirm() used inconsistently |
| 6 | Recognition Rather Than Recall | 3 | Sidebar remembers expansion state; but no breadcrumbs on deep routes |
| 7 | Flexibility and Efficiency | 3 | Keyboard shortcuts on kanban; none on jobs page; no batch actions |
| 8 | Aesthetic and Minimalist Design | 2 | Dashboard too dense; interview prep shows advanced fields upfront |
| 9 | Error Recovery | 2 | Error banners auto-dismiss after 3s; no retry; no error illustrations |
| 10 | Help and Documentation | 1 | Zero tooltips, zero onboarding hints, zero contextual help app-wide |
| **Total** | | **23/40** | **Acceptable — significant improvements needed** |

---

## What's Working

**1. Kanban + Undo (applications.tsx:229-281)**
Optimistic updates with a 5-second undo window. DnD + keyboard arrow shortcuts + visual keyboard shortcut guide. The most sophisticated interaction in the app.

**2. Landing page route map (landing.tsx:83-151)**
The vertical timeline with waypoints, "You are here" marker, and "AI Sherpa" footer — the one moment where the Expedition Journal metaphor becomes a real visual experience.

**3. Consistent empty states (dashboard.tsx:200-471)**
Every dashboard section has a context-specific empty state with distinct icon, copy, and CTA. Rare in a 60-route app.

---

## Priority Issues

### [P0] Offers page has zero emotional design for highest-stakes moments
**Element:** `app/routes/offers.tsx:80-184`
**Why:** Users decide between life-changing jobs here. Flat card grid, raw salary numbers, no celebration, no anxiety mitigation. Past offers at 70% opacity like they're irrelevant.
**Fix:** Add emotional framing. Visual highlight when total comp exceeds benchmarks. Make "Compare Offers" a primary CTA. Remove opacity reduction on past offers.
**Suggested command:** $impeccable bolder or $impeccable delight

### [P1] STATUS_CONFIG duplicated 3 times with structural drift
**Element:** `dashboard.tsx:9-18`, `applications.tsx:29-38`, `offers.tsx:13-19`
**Why:** Same status enum, 3 different config objects. Different property names (`bgColor` vs `bg`). Offers uses `yellow-600` while dashboard uses `#A16207` for the same status. Maintainability bomb.
**Fix:** Extract a single `STATUS_CONFIG` to `~/lib/status-config.ts`. Standardize property names and ensure Expedition Journal palette is applied consistently.
**Suggested command:** $impeccable distill

### [P2] Sidebar not responsive — permanently 260px on mobile
**Element:** `Layout.tsx:66`, `Sidebar.tsx:270,326`
**Why:** No mobile breakpoint, no hamburger menu. On viewports <768px, the sidebar overlaps content or pushes it off-screen. This is a P1 usability blocker for mobile users.
**Fix:** Add mobile breakpoint with hamburger toggle, overlay sidebar, and backdrop. Use the existing `collapsed` state pattern.
**Suggested command:** $impeccable adapt

### [P2] Jobs page filter overload on first load
**Element:** `jobs.tsx:368-403`
**Why:** 5 filter groups (Sources, Job Type, Work Style, Experience, Function) visible simultaneously. Paradox of choice — looks like a form to fill out rather than optional refinement.
**Fix:** Default filters to collapsed. Make the "Filters" toggle more prominent (button with icon + count). Let users opt in to complexity.
**Suggested command:** $impeccable distill

### [P3] Tabs lack ARIA semantics across the app
**Element:** `jobs.tsx:406-425`, `interview-prep.tsx:215-225`
**Why:** No `role="tablist"`, `role="tab"`, `aria-selected`. Screen readers won't announce tab semantics. Interview prep tabs have no active indicator styling at all.
**Fix:** Add ARIA attributes. Apply consistent active tab pattern (`border-b-2 border-primary-500`).
**Suggested command:** $impeccable harden

---

## Persona Red Flags

### Alex (Power User)
- No keyboard shortcuts on jobs page (the most-used surface). No `/` to focus search, no `j/k` to navigate results, no `b` to bookmark.
- No batch actions for bookmarking, deleting, or moving applications.
- Filter state isn't URL-persisted — sharing a filtered search link loses all filters.

### Jordan (First-Timer)
- Sidebar has 18 nav items across 5 collapsible sections. No guided onboarding after the profile wizard — lands on empty dashboard with no indication of what to do first.
- Interview prep asks for "Job Description" and "Your Resume Text" as raw text paste with no helper text, no example, no guidance on what/how much to paste.
- The "compound advantage" concept from the landing page doesn't carry through. Jordan signs up, sees 6 empty sections, has no idea they'll feed each other.

### Sam (Accessibility-Dependent)
- Kanban drag-drop has keyboard shortcuts but no `aria-live` announcement when a card moves between columns.
- Tabs (`jobs.tsx`, `interview-prep.tsx`) have no ARIA tab semantics — invisible to screen readers.
- No skip-to-content link — must tab through entire sidebar to reach main content.
- Loading spinner (`Layout.tsx:44-46`) has no `role="status"` or sr-only text.

---

## Minor Observations

- `app.css:346-348`: `@utility primary-gradient` sets `background: #2563eb` (blue) — conflicts with terracotta palette. Appears unused but is a landmine.
- Loading states mix `bg-gray-100` (cold) with `bg-[#F5EDE4]` (warm). Dashboard uses warm skeletons; jobs uses cold gray.
- `TrendIndicator` on dashboard shows `applied - draft` as a "trend" — semantically wrong, it's a ratio.
- Sidebar collapsed state shows "CA" text, not the compass rose logo from the landing page.
- Dark mode overrides don't cover score bar gradients — may appear washed on dark backgrounds.
- No `:focus-visible` global styles — focus ring consistency depends on each component implementing it correctly.
- `--shadow-focus` token defined but never used anywhere.

---

## Questions to Consider

1. What if the landing page's route map became the dashboard's primary navigation — a vertical timeline showing the user's actual progress through the 7 camps with real data?
2. What if offers and negotiation had their own emotional design language — gold accents, celebration micro-animations, "you've reached the peak" framing?
3. What if progressive disclosure replaced the flat filter panel — show only search + location first, reveal filters as the user refines?
4. What if every AI generation showed a "recipe" of what it's doing — "Researching company financials... Analyzing job description..." instead of just "Generating..."?
5. What if the compass rose was the primary nav metaphor — a radial navigation showing Jobs, Applications, Interview, Offers as compass directions?
