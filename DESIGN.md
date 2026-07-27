# Design

## Visual World

**Clean minimalist SaaS.** White ground, generous whitespace, restrained typography, functional color only where it earns attention. No gradients, no decorative elements, no visual noise. The product is invisible until you need it.

## Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary-500` | `#2563eb` | CTA buttons only — conservative, single accent |
| `--color-gray-900` | `#111827` | Headings, strong text |
| `--color-gray-600` | `#4b5563` | Body text |
| `--color-gray-400` | `#9ca3af` | Secondary labels, captions |
| `--color-gray-200` | `#e5e7eb` | Borders, dividers |
| `--color-gray-50` | `#f9fafb` | Page background |
| `--color-success` | `#059669` | Positive states (functional) |
| `--color-danger` | `#dc2626` | Errors, destructive (functional) |
| `--color-warning` | `#d97706` | Warnings (functional) |
| `--color-info` | `#0891b2` | Informational (functional) |

Blue accent appears only on primary CTA buttons. All other color is semantic (success/danger/warning/info) and functional.

## Typography

| Role | Font | Weight |
|------|------|--------|
| Headings | DM Sans | 700 |
| Body | DM Sans | 400–500 |
| Labels | DM Sans | 500 |

Single typeface. No monospace in the UI. Clean geometric sans with distinct character (unlike Inter which is overused in AI-generated UIs).

## Surface Language

- **Ground:** `#f9fafb` — near-white with no tint
- **Cards:** White (`#ffffff`), 1px border `#e5e7eb`, subtle shadow, no gradient fills
- **Spacing:** Generous — `py-20` sections, `gap-6`+ between elements, breathing room
- **Borders:** Thin (1px), `rounded-xl` or `rounded-2xl`, no decorative borders
- **Shadows:** `shadow-sm` default, `shadow-lg` on hover only
- **No gradients, no grid overlays, no decorative backgrounds**

## Landing Page

Split layout — no scroll required for the first viewport:

**Left column:**
- Headline (bold, direct, no flourish)
- Subhead (plain language, one sentence per idea)
- Two CTAs: primary "Start free" + secondary "Browse jobs"
- Trust indicator: "No credit card required"

**Right column:**
- Product mockup card showing a clean dashboard preview (stats, job list, match scores)
- No terminal aesthetics, no data-dense layouts
- Clean card with shadows, whitespace, clear hierarchy

**Below fold:**
- Feature grid (6 cards, clean icons, minimal text)
- Simple CTA section
- Minimal footer

## Component Patterns

All defined in `@layer components` in `app/app.css`:

- **Primary button:** Blue fill (`#2563eb`), white text, no gradient
- **Secondary button:** White with border, no fill on hover
- **Ghost button:** Text only, subtle hover background
- **Card:** White background, 1px border, rounded-xl, shadow-sm
- **Input:** White field, border on focus only (ring)

## Anti-patterns to Avoid

- Side-tab accent borders on cards
- Gradient text
- Decorative grid backgrounds
- Overused fonts (Inter, Space Grotesk, Plus Jakarta Sans)
- Accent color on non-CTA elements
- Visual noise without functional purpose
