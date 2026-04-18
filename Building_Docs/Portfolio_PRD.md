# Portfolio Website PRD

## Overview
Personal portfolio for Ian -- operator, CoS, and builder. Target audience: founders and CEOs of founder-led, VC-backed remote companies hiring for Chief of Staff or Technical CoS roles. Secondary: recruiters at those companies.

**Core positioning:** Not a developer portfolio. Not a resume site. A proof-of-work operating system -- built by someone who understands both the strategic and technical layer.

**Audience:** Wide but direct. Site is delivered via outreach to decision makers -- founders, CEOs, hiring managers, recruiters across industries. The site's job is to confirm what the outreach already claimed: this person can actually do things. It does not need to pre-filter by audience type. It needs to answer one universal question in 10 seconds: "Can this person actually do things?"

---

## Design Direction

**Aesthetic:** Refined dark editorial. Think high-end tech meets operator precision. Not flashy, not corporate. Dense but clean. The kind of site that signals taste and competence in the first 3 seconds.

**Color Palette (CSS variables):**
- `--bg`: #0A0A0A (near black)
- `--surface`: #111111
- `--border`: #1E1E1E
- `--text-primary`: #F0EDE8 (warm off-white)
- `--text-secondary`: #6B6B6B
- `--accent`: #C8A97E (warm gold -- signals premium, not flashy)
- `--accent-hover`: #E0C99A
- `--red`: #C0392B (used sparingly for tags or status)

**Typography:**
- Display / Hero: `Playfair Display` (serif, editorial weight)
- Body / UI: `DM Mono` (monospace, technical precision feel)
- Labels / Tags: `DM Mono` uppercase, letter-spacing 0.12em

**Motion principles:**
- Page load: staggered fade-up reveals (opacity 0→1, translateY 20px→0), 60ms delay increments
- Hover states: border color transitions, subtle scale on cards (1.0→1.02), 200ms ease
- Demo embeds: slide-in from bottom on scroll entry
- No bounce, no spin, no gimmicks -- every animation should feel inevitable, not decorative

**Layout:**
- Max content width: 1200px
- Heavy use of negative space
- Asymmetric grid on project cards (not a uniform 3-column grid)
- Thin 1px borders (`--border`) as structural elements, not decorative ones

---

## Site Architecture

```
/                    → Homepage
/work                → Software & Engineering (project index)
/work/[slug]         → Individual project case study
/hardware            → Hardware & 3D / Vostok Labs
/vault               → The Vault (freebies, frameworks, articles)
/cv                  → Live CV + PDF download
```

---

## Page Specs

### 1. Homepage `/`

**Purpose:** Pass the 5-second test for a founder or CEO. Signal who Ian is, what he does, and where to go next.

**Sections in order:** Hero → Skill Matrix → Featured Work → Vault Teaser → CTA

Logic: decision maker reads the headline, immediately wants "okay, what specifically" -- Skill Matrix answers in 5 seconds -- Featured Work proves the skills are real -- Vault gives free value and keeps them longer -- CTA closes.

#### Hero
- Full viewport height
- Left-aligned text, right side: subtle animated grid or noise texture background element
- Headline (Playfair Display, large): `"I build the systems founders rely on."`
- Subheadline (DM Mono, small, secondary color): One sentence. E.g. `"Chief of Staff · Operator · Builder — 2 years as direct CEO report at a US software company."`
- Two CTAs side by side: `View Work` (filled, accent) + `Download CV` (ghost border)
- Subtle scroll indicator at bottom

#### Skill Matrix
- Clean grid of competency areas
- Not a tag cloud -- grouped by category: Strategy & Ops / AI & Product / Engineering / Hardware & 3D
- Each item: icon or single glyph + label in DM Mono
- Purpose: fast scan of what Ian can do, before seeing proof

#### Featured Work (3 cards only)
- Section label: `SELECTED WORK` in DM Mono uppercase
- Asymmetric layout: one large card left, two stacked right
- Each card: project title, one-line hook, category tag, "View Project" link
- Hover: thin accent-color border appears, slight card lift
- Cards: one Software project, one Hardware/Vostok project, one Strategy/Vault item
- 3D/hardware card framed as range signal, not hobby: one line max on homepage

#### Vault Teaser
- Section label: `FREE RESOURCES`
- 2-3 inline items with title + download CTA
- Purpose: surfaces lead magnets, adds value, keeps visitor on site longer
- Style: minimal table-like list, not cards

#### Contact / CTA Footer Section
- One line: `"Looking for a CoS or operator who ships? Let's talk."`
- Email link + LinkedIn icon

---

### 2. Software & Engineering `/work`

**Purpose:** Index of all software projects.

- Filterable by tag: `Dashboard` / `AI Product` / `Tool` / `Client Work`
- Project list: title, one-line hook, tech stack tags, thumbnail or live preview still
- Default sort: most relevant to CoS/operator audience first

---

### 3. Project Case Study `/work/[slug]`

**Structure per project (in order):**

1. **Hook bar** -- Title + tech stack tags + your role tag (e.g. `Solo Builder` or `CoS / Operator`)
2. **Live Demo** -- Embedded iframe or interactive artifact, full width, browser chrome mockup wrapper. `Reset Demo` button top-right of embed.
3. **Three-bullet summary** (visible without scrolling below demo):
   - What it is
   - Why it was built
   - What it replaced or improved
4. **Expandable "Go Deeper" section** (collapsed by default, click to expand):
   - Problem in full (2-3 sentences)
   - How you built it -- one honest challenge + resolution
   - Your role context (especially if CoS/operator, not dedicated engineer)
   - Artifact downloads (code snippet, architecture diagram, PRD -- whatever exists)
5. **Impact line** -- Single bold stat or outcome at the bottom. E.g. `"Replaced a 3hr/week manual tracking process."` Large type, accent color.

**For AI-dependent products:** Replace live embed with scripted scenario panel. Pre-written prompt cards the visitor clicks to trigger -- output displayed inline. No live API calls.

---

### 4. Hardware & 3D `/hardware`

- Visual-first grid layout
- Each item: high quality render or photo, project name, brief descriptor
- Bongo Cat featured prominently (crowdfunding proof of traction)
- Link to Vostok Labs if applicable

---

### 5. The Vault `/vault`

- Clean list layout, not cards
- Items grouped: `Frameworks` / `Workbooks` / `Articles`
- Each item: title, one-line description, download or read CTA
- AI Coding Workbook and Lean Product Framework featured at top
- Lead magnet framing: these are free, no gate

---

### 6. Live CV `/cv`

- Clean, readable chronological work history
- Prominent `Download PDF` button top-right
- Skills summary at top
- Contact links

---

## Technical Requirements

- Vibe-coded (full control, no platform lock-in)
- React or vanilla HTML/CSS/JS -- Ian's call
- Mobile responsive -- demos must not break on mobile
- Demo iframes: isolated instances, no shared state between visitors
- PDF downloads: direct link, no form gate
- No analytics that require cookie banners unless Ian wants them
- Fast load -- no heavy libraries unless justified

---

## Content Prep Dependencies (before build)

Before coding each project page, the following must exist:

| Item | Required |
|------|----------|
| One-line hook | Yes |
| Problem sentence | Yes |
| 2-3 sentence build description | Yes |
| One concrete outcome | Yes |
| Role context note | Yes |
| Demo (isolated) or scripted scenario | Yes |
| At least one artifact (code, diagram, screenshot) | Yes -- don't manufacture what doesn't exist |

---

## Build Sequence

1. Site shell -- homepage layout + navigation, no real content
2. Pick one project, get its demo isolated and sanitized
3. Build that single case study page end to end
4. Add PDF to homepage Vault teaser
5. Go live with homepage + one project page
6. Build remaining pages in parallel while site is live and linkable

---

## What This Site Is Not

- Not a developer portfolio (no GitHub contribution graphs, no "built with React" flexing)
- Not a resume site (CV is one page, not the point of entry)
- Not a blog (Vault items are resources, not posts)
- Not niche -- serves a wide audience of decision makers across industries, all arriving via direct outreach
- Not comprehensive on first load -- hardware and vault are real sections but don't compete with operational work for top billing
