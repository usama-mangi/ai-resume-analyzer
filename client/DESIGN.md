# Design

<!-- impeccable:design-schema 1 -->

## Visual World

**Expedition Journal.** Your career traverse starts here. The AI is your sherpa who has mapped the route; each lifecycle phase is a base camp; "You are here" with next-camp preview. Warm parchment ground, terracotta accents, deep forest green for success, field-note cards, compass rose logo. The interface feels like a well-used field journal — purposeful, warm, trustworthy.

## Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary-500` | `#C2410C` | Primary CTA, active waypoints, brand accent (terracotta) |
| `--color-primary-600` | `#A3340A` | Primary hover/active state |
| `--color-primary-50` | `#FFF8F0` | Card backgrounds, active waypoint fill |
| `--color-gray-900` | `#2C2621` | Headings, strong text (warm black) |
| `--color-gray-600` | `#5C5046` | Body text (warm gray) |
| `--color-gray-500` | `#9C8E7E` | Secondary labels, captions |
| `--color-gray-200` | `#E8DDD1` | Borders, dividers, waypoint lines |
| `--color-gray-50` | `#FFFBF5` | Page background (parchment) |
| `--color-success` | `#065F46` | Success states, completed waypoints (forest green) |
| `--color-danger` | `#B91C1C` | Errors, destructive actions |
| `--color-warning` | `#A16207` | Warnings, caution states (ochre) |
| `--color-info` | `#1E5F8C` | Informational states |

Blue accent is **removed**. The primary accent is terracotta (`#C2410C`). Success/completed states use forest green (`#065F46`). All other color is semantic.

## Typography

| Role | Font | Weight |
|------|------|--------|
| Headings | DM Sans | 700 |
| Body | DM Sans | 400–500 |
| Labels | DM Sans | 500 |

Single typeface. Clean geometric sans with distinct character. No decorative fonts — warmth comes from color and texture, not typeface quirks.

## Surface Language

- **Ground:** `#FFFBF5` — warm parchment, not cold white
- **Cards:** White (`#ffffff`), 1px border `#E8DDD1` (warm gray), `shadow-paper` (warm tone), no gradients
- **Texture:** Subtle topographic grid lines at 3% opacity (CSS-only, fixed position)
- **Spacing:** Generous — `py-20` sections, `gap-5`+ between elements
- **Borders:** Thin (1px), `rounded-xl` or `rounded-2xl`, warm gray tone
- **Shadows:** `shadow-sm` default, `shadow-paper` for field-note cards, `shadow-lg` on hover
- **No gradients, no decorative overlays, no cold blue accents**

## Landing Page

Split layout — no scroll required for the first viewport:

**Left column:**
- Status badge: "AI sherpa active — mapping your route" (pulsing dot)
- Headline: "Your career traverse starts here."
- Subhead: One sentence per idea, warm plain language
- Two CTAs: primary "Start your expedition" + secondary "Browse jobs"
- Trust indicator: "No credit card required. Free to start."

**Right column:**
- Route map card showing 7 waypoints (lifecycle phases)
- Vertical timeline with numbered markers
- "You are here" indicator on first waypoint
- AI Sherpa card at bottom with compound context explanation
- Warm paper card style with field-note feel

**Below fold:**
- "The traverse, explained" — 7 camp cards with icons
- Compound advantage callout card
- CTA section with compass icon
- Warm parchment footer

## Component Patterns

All defined in `@layer components` in `app/app.css`:

- **Primary button:** Terracotta fill (`#C2410C`), white text, warm shadow
- **Secondary button:** White with warm border (`#E8DDD1`), no fill on hover
- **Ghost button:** Text only, warm hover background (`#F5EDE4`)
- **Card:** White background, 1px warm border, rounded-xl, `shadow-paper`
- **Waypoint card:** White, warm border, paper shadow, slight hover lift
- **Field note:** Slightly rotated (-0.5deg), paper shadow, straightens on hover
- **Input:** White field, warm border on focus only (ring)

## Anti-patterns to Avoid

- Blue accents (cold, corporate, AI-slop indicator)
- Purple/violet gradients (AI color palette slop)
- Gray text on colored backgrounds (low contrast)
- Decorative grid backgrounds or glassmorphism
- Overused fonts (Inter, Space Grotesk, Plus Jakarta Sans)
- Gradient text or glowing effects
- Visual noise without functional purpose
- Cold whites (`#f9fafb`) — always use warm parchment (`#FFFBF5`)
