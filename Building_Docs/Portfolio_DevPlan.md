# Portfolio Website -- Dev Plan

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 (App Router) | File-based routing, React components, fast to vibe-code, production-ready |
| Styling | Tailwind CSS + CSS variables | Tailwind for layout speed, CSS vars for design token system from PRD |
| Animations | Framer Motion | Staggered reveals, scroll-triggered entries, hover states -- cleaner than raw keyframes |
| Demo data | Static JSON files | One JSON file per project with sanitized dummy data. No database, no backend, no shared state |
| Hosting | Vercel | Free custom domain, SSL, auto-deploys from GitHub, global CDN, zero server maintenance |
| Domain | Cloudflare Registrar | At-cost pricing, best DNS management |
| Font loading | next/font | Google Fonts (Playfair Display + DM Mono) loaded optimally |

---

## Repository Structure

```
/
├── app/
│   ├── page.tsx                  → Homepage
│   ├── work/
│   │   ├── page.tsx              → Project index
│   │   └── [slug]/
│   │       └── page.tsx          → Case study template
│   ├── hardware/
│   │   └── page.tsx
│   ├── vault/
│   │   └── page.tsx
│   └── cv/
│       └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── SkillMatrix.tsx
│   │   ├── FeaturedWork.tsx
│   │   └── VaultTeaser.tsx
│   ├── work/
│   │   ├── ProjectCard.tsx
│   │   ├── DemoEmbed.tsx         → Iframe wrapper with Reset button
│   │   ├── ScriptedDemo.tsx      → For AI-dependent projects
│   │   └── GoDeeper.tsx          → Expandable section
│   └── ui/
│       ├── Tag.tsx
│       ├── Button.tsx
│       └── SectionLabel.tsx
├── demos/
│   ├── bizdev-pipeline/          → Self-contained React component
│   ├── rolodex/                  → Self-contained React component
│   ├── bizdev-overview/          → Self-contained React component
│   └── [other-projects]/
├── data/
│   ├── projects.ts               → All project metadata (title, slug, hook, stack, etc.)
│   ├── skills.ts                 → Skill matrix data
│   ├── vault.ts                  → Vault items metadata
│   └── dummy/
│       ├── bizdev-pipeline.json  → Sanitized static data per project
│       ├── rolodex.json
│       └── bizdev-overview.json
├── public/
│   ├── cv.pdf
│   ├── workbook.pdf
│   └── assets/
└── styles/
    └── globals.css               → CSS variables, base styles
```

---

## CSS Variables (globals.css)

```css
:root {
  --bg: #0A0A0A;
  --surface: #111111;
  --border: #1E1E1E;
  --text-primary: #F0EDE8;
  --text-secondary: #6B6B6B;
  --accent: #C8A97E;
  --accent-hover: #E0C99A;
  --red: #C0392B;
  --max-width: 1200px;
  --font-display: 'Playfair Display', serif;
  --font-mono: 'DM Mono', monospace;
}
```

---

## Demo Architecture

Each demo is a self-contained React component, not an iframe of an external app. This gives full control over styling, reset behavior, and mobile layout.

**Pattern for every demo:**
```
demos/[project-name]/
├── index.tsx         → Main component, exported as default
├── data.json         → Sanitized static dummy data
└── components/       → Sub-components if needed
```

**Rules:**
- All state is local (`useState`, `useReducer`) -- no external calls
- `Reset Demo` button resets state to initial `data.json` values
- No `localStorage`, no cookies, no shared state between visitors
- Component mounts fresh on every page load

**For AI-dependent projects (FlashCourse, Blink, Venture Ideation):**
- Replace live API with `ScriptedDemo` component
- 3-4 pre-written scenario cards the visitor clicks
- On click: show a pre-written realistic output inline
- Framed as: "Try a scenario" not "Type a prompt"

---

## Build Sequence

### Phase 1 -- Shell (Day 1)
- [ ] Init Next.js project with Tailwind
- [ ] Set up CSS variables and font imports
- [ ] Build Navbar and Footer components
- [ ] Create all route files as blank pages
- [ ] Deploy to Vercel, connect custom domain

**Goal: site is live at your domain, even if blank.**

### Phase 2 -- Homepage (Day 2-3)
- [ ] Hero section with headline and CTAs
- [ ] Skill Matrix with grouped competencies
- [ ] Featured Work cards (3 -- placeholder content first)
- [ ] Vault Teaser with PDF download links
- [ ] Footer CTA
- [ ] Framer Motion: staggered page load animation

**Goal: homepage is live and presentable. Can be sent to Josh's contacts.**

### Phase 3 -- First Project End to End (Day 4-6)
- [ ] Pick easiest demo to sanitize (Rolodex or BizDev Overview)
- [ ] Write copy block (hook, problem, built, outcome, role)
- [ ] Build sanitized JSON dummy data file
- [ ] Rebuild demo as self-contained React component
- [ ] Build case study page with demo embed, three-bullet summary, Go Deeper section, Impact line
- [ ] Add Reset Demo button and test it

**Goal: one complete project page live. Portfolio is now functional proof of work.**

### Phase 4 -- Remaining Projects (Ongoing, 1-2 per week)
- [ ] Repeat Phase 3 pattern for each project
- [ ] Priority order: dashboard/tool projects first (easier), AI scripted demos second
- [ ] BizDev Pipeline (restore or recreate dummy data in JSON)
- [ ] Real estate landing page (already live -- just link and write copy)
- [ ] FlashCourse, Blink, Venture Ideation (scripted scenario pattern)
- [ ] Money app (needs rebuild as web component -- lowest priority)

### Phase 5 -- Supporting Pages (Week 2-3)
- [ ] `/work` project index with tag filters
- [ ] `/hardware` visual grid (Bongo Cat, keyboards, prints)
- [ ] `/vault` full resource list
- [ ] `/cv` page with PDF download

### Phase 6 -- Polish (Before major outreach push)
- [ ] Mobile QA across all demo embeds
- [ ] Scroll-triggered animations on project cards
- [ ] Performance check (Lighthouse score, image optimization)
- [ ] Test all PDF download links
- [ ] Cross-browser check

---

## Content Prep Checklist (Per Project, Before Building Page)

- [ ] One-line hook written
- [ ] Problem sentence written
- [ ] 2-3 sentence build description written
- [ ] Concrete outcome identified
- [ ] Role context note written
- [ ] Dummy data JSON created (sanitized)
- [ ] Demo component built and reset-tested
- [ ] At least one artifact ready (screenshot, snippet, or diagram)

---

## Hosting & Domain Setup

1. Buy domain via Cloudflare Registrar
2. Push repo to GitHub
3. Connect GitHub repo to Vercel
4. Add custom domain in Vercel dashboard
5. Point Cloudflare DNS to Vercel nameservers
6. SSL auto-provisioned by Vercel

**Cost estimate:**
- Domain: ~$10/yr via Cloudflare
- Vercel: Free (Hobby tier covers everything needed)
- Total: ~$10/yr

---

## Decisions Still Outstanding

- [ ] Which 3 projects go on the homepage featured section
- [ ] Final hero headline copy
- [ ] Domain name
