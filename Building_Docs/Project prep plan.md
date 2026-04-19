# Project Preparation Plan

This document outlines the systematic, multi-step process for converting our raw project copies and case studies into fully functional, interactive portfolio pages as defined by the Portfolio Dev Plan.

## Step 1: Foundation & Data Layer
- **Action**: Setup the project registry.
- **Details**: Convert the content from `Frontpage projects copy.md` and the individual case studies into a structured dataset inside `data/projects.ts` (or the respective JSON/TS setups). Each project will receive a `slug` (e.g., `bizdev-command-center`, `bongo-cat`), title, hook, stack tags, and the full text blocks (Problem, Built, Outcome, Role).
- **Goal**: Have all text accessible cleanly for dynamic page generation without hardcoding it in UI components.

## Step 2: Homepage Integration
- **Action**: Connect the front page.
- **Details**: Update the `FeaturedWork.tsx` component to pull from our data layer. Inject the updated text (one-line hook, name, tech tags) into the grids. Most importantly, wrap these grid cards in Next.js `<Link href="/work/[slug]">` components to make them fully clickable. 

## Step 3: Case Study Template Setup
- **Action**: Build the dynamic routing.
- **Details**: Implement the base `/app/work/[slug]/page.tsx` page to dynamically route visitors to the appropriate project. Apply the overall container styling, standardizing the text locations for "The Problem", "What I Built", "My Role", and "Outcome" blocks.

## Step 4: Asset Extraction & Visuals
- **Action**: Fetch remote documentation and artifacts.
- **Details**: Pull screenshots, diagrams, or GIFs from the MakerWorld links for **Bongo Cat**, and the GitHub repos for **BizDev Command Center**. Add them to the `/public/assets` directory and embed them onto their respective `[slug]` pages.

## Step 5: Demo Scaffold (Data & React Frame)
- **Action**: Prepare the foundation for interactive components.
- **Details**: For software projects needing a dummy mock-up (like BizDev Center), we will create `demos/bizdev-command-center/index.tsx` as a placeholder React component. We will also initialize a sanitized `data/dummy/bizdev-command-center.json` file. This maps out our data flow *before* heavy UI lifting begins.

## Step 6: Full Demo Implementation
- **Action**: Build out the interactive UIs.
- **Details**: Replace the placeholder `index.tsx` inside each demo folder with the actual recreated logic (e.g., the local kanban and client matrix tools), completely decoupled from real DBs and solely relying on local state and our dummy JSON files.
