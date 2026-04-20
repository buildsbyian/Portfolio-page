export interface ProjectContent {
  problem: string;
  whatIBuilt: string;
  myRole: string;
  outcome: string;
  repoUrl?: string;
  makerWorldUrls?: { text: string; url: string }[];
  resourceDownloads?: { label: string; url: string; external?: boolean; download?: boolean }[];
  images?: string[];
  pdfUrl?: string;
  previewUrl?: string;
}

export interface Project {
  title: string;
  slug: string;
  hook: string;
  stack: string[];
  category: 'Software' | 'Hardware' | 'Strategy';
  roleTag: 'Solo Builder' | 'CoS Operator' | 'Client Work';
  featured?: boolean;
  content?: ProjectContent;
}

/**
 * Project data — populate as case studies are built.
 * Each project maps to a /work/[slug] page.
 */
export const projects: Project[] = [
  {
    title: 'BizDev Command Center',
    slug: 'bizdev-command-center',
    hook: "Built to replace 20+ scattered Excel sheets and a CEO's Post-it system. A single internal tool for managing leads, networking contacts, events, and collaboration pipelines -- with kanban boards, a rated client matrix, and full visibility from one tab.",
    stack: ['Internal Tooling', 'AI-Assisted', '0→1'],
    category: 'Software',
    roleTag: 'Solo Builder',
    featured: true,
    content: {
      problem: "The CEO was navigating 20+ disconnected Excel sheets across different locations. Leads, contacts, event guests, and project status all lived in separate files -- or in someone's head. Finding the right sheet for a current project took longer than the actual work it was meant to track.",
      whatIBuilt: "A custom internal management platform built entirely on my own initiative, with no engineering team involvement. The tool unified four operational layers into one interface: a lead and contact database, event and guest management, a think tank matrix with rated current and potential clients, and kanban-style pipeline boards for each active BizDev project. Everything interconnected -- a contact ties to an event, an event ties to a deal.",
      myRole: "Identified the problem before it was flagged as one. Scoped, designed, and shipped the entire product solo in 10 days using AI-assisted development. TypeScript. Zero input from engineering.",
      outcome: "Replaced a fragmented, unmanageable system with a single operational tab. Reporting became instant. The CEO had full pipeline visibility without opening a single Excel file.",
      images: ['/assets/projects/bizdev-command-center/command-center-highlight.svg'],
    }
  },
  {
    title: 'NutriPal AI Nutrition Assistant',
    slug: 'ai-nutrition-assistant',
    hook: 'A reasoning-first nutrition assistant built to turn messy meal descriptions, saved recipes, audits, and what-if decisions into reliable daily nutrition tracking without silent guessing.',
    stack: ['Agentic Architecture', 'Nutrition Tracking', 'Stateful UX'],
    category: 'Software',
    roleTag: 'Solo Builder',
    content: {
      problem:
        'Traditional nutrition trackers create too much friction for real meals, while naive LLM logging creates a different problem: silent assumptions, hallucinated macros, and numbers users stop trusting.',
      whatIBuilt:
        'A multi-agent nutrition system with intent classification, a reasoning orchestrator, specialist nutrition and recipe agents, and an insight layer for audits, summaries, patterns, and day classification. The local portfolio demo recreates those product flows with deterministic browser state so visitors can inspect goals, logs, recipes, and what-if decisions in one place.',
      myRole:
        'Designed the end-to-end agent workflow, mapped the execution paths for logging, saved recipes, audits, and hypothetical scenarios, then translated the original mobile-first source into a browser-based portfolio demo that showcases how the system actually works.',
      outcome:
        'Created an auditable product architecture that prioritizes trust over flashy AI behavior. The result is a nutrition assistant that can clarify ambiguity, remember context, reuse saved recipes, and explain tradeoffs instead of acting like a calorie guesser.',
      repoUrl: 'https://github.com/buildsbyian/AI-nutritional-assistant',
      images: [
        '/assets/projects/ai-nutrition-assistant/meal-log-with-label.png',
        '/assets/projects/ai-nutrition-assistant/audit-correction.png',
        '/assets/projects/ai-nutrition-assistant/nutrition-explainer.png',
      ],
    },
  },
  {
    title: 'Bongo Cat Typing Companion',
    slug: 'bongo-cat',
    hook: "An ESP32-based desk device with a digital pet that animates when you type -- displaying real-time typing speed, CPU, and RAM load.",
    stack: ['Firmware (C++)', '3D Design', 'Crowdfunded'],
    category: 'Hardware',
    roleTag: 'Solo Builder',
    featured: true,
    content: {
      problem: "Learning touch typing on a new ergonomic split keyboard with no real-time feedback. Existing typing tools were browser apps or raw text displays -- nothing that made the feedback loop engaging enough to sustain practice.",
      whatIBuilt: "A standalone ESP32-based desk device running custom firmware. The Bongo Cat animates in sync with your typing, displaying live typing speed, CPU load, and RAM usage pulled from the connected computer. Multiple animation states were hand-drawn as embedded bitmap stacks. A 3D-printed housing was designed and printed to make it a proper desk object, not a loose board. A web flasher was built so anyone can set it up without writing a single line of code or touching a soldering iron.",
      myRole: "Wrote all firmware in C++. Drew and animated every state. Designed and printed the housing. Ran the entire crowdfunding campaign including promotion and fulfillment strategy.",
      outcome: "Hit its crowdfunding goal. Received an offer for commercialization and mass production -- declined due to time constraints.",
      repoUrl: "https://github.com/vostoklabs/bongo_cat_monitor",
      makerWorldUrls: [
        { text: "MW free page", url: "https://makerworld.com/en/models/1654522-bongo-cat-mini-monitor-animated-esp32-display#profileId-1749680" },
        { text: "MW crowdfunding", url: "https://makerworld.com/en/crowdfunding/53-bongo-cat-mini-monitor-2-0-new-features-upgrades" }
      ],
      images: [
        '/assets/projects/bongo-cat/Coover photo with text.jpg',
        '/assets/projects/bongo-cat/Typing gif.gif',
        '/assets/projects/bongo-cat/Board and case exploded view.jpg',
        '/assets/projects/bongo-cat/Crowdfunding screenshot.png'
      ]
    }
  },
  {
    title: '20 20 Split Keyboard',
    slug: '20-20-split-keyboard',
    hook: 'A wireless, handwired split keyboard with hotswap sockets and a magnetic snap-together design, built entirely without a PCB.',
    stack: ['Firmware (ZMK)', '3D Design', 'No-PCB / Handwired'],
    category: 'Hardware',
    roleTag: 'Solo Builder',
    content: {
      problem:
        'Getting into custom ergonomic keyboards is often intimidating and expensive. Existing options usually require navigating complicated PCB orders, buying expensive pre-made kits, or committing to permanent soldering. There was a lack of highly accessible, "actually buildable" kits that offered premium features like hotswap and wireless capabilities without the high barrier to entry.',
      whatIBuilt:
        'A standalone wireless split keyboard that completely eliminates the need for a complicated PCB. Using custom 3D-printed plates to secure hotswap sockets for Cherry MX switches, the board is fully handwired while still allowing users to swap switches freely. It runs ZMK firmware on Nice!Nano v2 clones, enabling full Bluetooth wireless support. To make it versatile, I designed the 3D-printed case with an embedded magnet system. This allows the two halves to magnetically snap together into a compact 40% ortholinear layout, or detach into a fully ergonomic 24 + 24 split setup. I also fully documented the build with a detailed matrix pinout, step-by-step manual, and a wiring guide so anyone can build it at home.',
      myRole:
        'Designed and 3D modeled the hotswap plate, switch plate, and magnetic housing. Handwired the matrix and configured the custom ZMK firmware. Documented the entire project by writing the step-by-step build instructions, creating the visual wiring pinout, and producing a full YouTube build video.',
      outcome:
        'Published a fully open-source, accessible custom keyboard that removes the friction for newcomers. Provided the community with a complete kit including STEP files for remixing, a detailed Bill of Materials, and ZMK firmware setups, making it one of the simplest ways to get into custom split keyboards.',
      repoUrl: 'https://github.com/vostoklabs/zmk-config-ortho20_20',
      makerWorldUrls: [{ text: 'MakerWorld Page', url: 'https://makerworld.com/en/models/2563301' }],
      images: [
        '/assets/projects/20-20-split-keyboard/split-view.jpg',
        '/assets/projects/20-20-split-keyboard/together-view.jpg',
      ],
    },
  },
  {
    title: 'Designer Instant Coffee Dispenser',
    slug: 'designer-instant-coffee-dispenser',
    hook: 'A stylish 3D-printed instant coffee dispenser inspired by professional grinders that delivers exactly one teaspoon per push.',
    stack: ['3D Design', 'Functional Print', 'Product Design'],
    category: 'Hardware',
    roleTag: 'Solo Builder',
    content: {
      problem:
        'Making instant coffee often involves dealing with messy spoons, inconsistent measurements, and unsightly jars cluttering the kitchen counter. There was a need for a quick, one-handed solution for busy mornings that solved the measurement problem while actually looking elegant and professional in a home coffee corner.',
      whatIBuilt:
        'I designed and fully 3D-printed a custom instant coffee dispenser inspired by the sleek aesthetics of professional espresso grinders. The core of the device is a carefully engineered dispensing mechanism driven by a simple lever and a rubber band return system that calculates and drops exactly one teaspoon of coffee with a single push. The design features a translucent top hopper to easily monitor supply levels and an elegantly curved base that perfectly frames a standard coffee mug. During the prototyping phase, the internal mechanism was extensively tested and optimized specifically for the consistency of instant coffee, identifying that harder crystals like sugar would jam the precise tolerances of the moving parts.',
      myRole:
        'Conceptualized the aesthetic design and form factor. Engineered, calculated, and iteratively tested the internal moving parts to achieve the precise one-teaspoon dispensing volume. Prepared all models for reliable 3D printing and authored the straightforward assembly documentation.',
      outcome:
        'Created a highly functional, daily-use kitchen appliance that streamlines the morning coffee routine. Published the complete 3D model files online alongside a comprehensive, step-by-step assembly guide, allowing anyone to easily print and build their own functional kitchen decor.',
      makerWorldUrls: [{ text: 'View on MakerWorld', url: 'https://makerworld.com/en/models/910659' }],
      images: [
        '/assets/projects/designer-instant-coffee-dispenser/demo.gif',
        '/assets/projects/designer-instant-coffee-dispenser/real-pic.jpg',
        '/assets/projects/designer-instant-coffee-dispenser/render.jpg',
      ],
    },
  },
  {
    title: 'AI Development Workbook',
    slug: 'ai-development-workbook',
    hook: "A 19-page practical manual for non-technical operators who want to build real software products using AI tools -- not just chat with ChatGPT.",
    stack: ['PDF Guide', 'AI-Native', 'Free Resource'],
    category: 'Strategy',
    roleTag: 'Client Work',
    featured: true,
    content: {
      problem: "Non-technical operators want to leverage AI for real product creation, but struggle to move beyond simple chat interactions.",
      whatIBuilt: "A 19-page practical manual covering end-to-end workflows, tooling, prompts, and decision points for building real software products using AI tools.",
      myRole: "Authored and designed the entire guide.",
      outcome: "Provides a structured pathway for operators to build MVPs independently.",
      pdfUrl: '/resources/ai-workbook.pdf'
    }
  },
  {
    title: 'Lean Product Alignment Framework',
    slug: 'lean-product-framework',
    hook: 'A five-step system for solo AI builders who want to ship the right thing the first time--turning a raw idea into a buildable V1 without needing a product manager.',
    stack: ['FRAMEWORK', 'PRODUCT STRATEGY', 'TEMPLATES'],
    category: 'Strategy',
    roleTag: 'Client Work',
    content: {
      problem: "Solo builders often start coding before knowing exactly what they are building, add features based on instinct rather than user need, and end up with a V1 that doesn't match the original vision.",
      whatIBuilt: 'A structured, 5-step workflow (Capture, Echo + Sprinkle, Persona Snapshot, Freeze, Build + Show). It includes a blank template for immediate use and a completed real-world example (Blink) to reference.',
      myRole: 'Created the full framework structure, documented each step, and packaged both reusable and example versions for immediate execution.',
      outcome: 'Forces builders to lock their V1 scope, prevents over-building, and ensures the product can be clearly explained to anyone else.',
      previewUrl: '/resources/lean-product-framework-fillable.pdf',
      resourceDownloads: [
        {
          label: 'Download Fillable PDF',
          url: '/resources/lean-product-framework-fillable.pdf',
          download: true,
        },
        {
          label: 'Download DOCX Version',
          url: '/resources/lean-product-framework.docx',
          download: true,
        },
      ],
    },
  },
  {
    title: 'UX UI and Product Crash Course',
    slug: 'ux-ui-product-crash-course',
    hook: 'A foundational primer for product builders, founders, and designers aiming to understand users, validate decisions, and build intuitive digital products that solve real problems.',
    stack: ['PRODUCT STRATEGY', 'UX RESEARCH', 'CRASH COURSE'],
    category: 'Strategy',
    roleTag: 'Client Work',
    content: {
      problem:
        'Teams often guess what features to build instead of observing real user behavior, leading to products that function well but fail to solve genuine pain points. As the course notes, most product teams fail not because they build poorly, but because they build the wrong thing.',
      whatIBuilt:
        'An actionable, no-nonsense guide breaking down core lean UX research methods, the psychology of intuitive design, user story creation, and customer journey mapping.',
      myRole: 'Designed and structured the crash course to translate design fundamentals into practical decisions non-designers can apply immediately.',
      outcome:
        "Equips teams to stop optimizing for pixels and start designing for moments that matter. Readers will learn how to gather behavioral insights, write testable user stories, and design interfaces that perfectly match their users' mental models.",
      previewUrl: '/resources/ux-ui-product-crash-course.pdf',
      resourceDownloads: [
        {
          label: 'Download PDF Resource',
          url: '/resources/ux-ui-product-crash-course.pdf',
          download: true,
        },
      ],
    },
  },
  {
    title: 'Cursor Ruleset',
    slug: 'cursor-ruleset-resource',
    hook: 'A comprehensive configuration blueprint designed to enforce strict coding standards, safe execution protocols, and architectural alignment for AI coding assistants in modern full-stack development.',
    stack: ['AI CONFIGURATION', 'DEVEX', 'SYSTEM ARCHITECTURE'],
    category: 'Strategy',
    roleTag: 'Client Work',
    content: {
      problem:
        "AI code assistants often make dangerous assumptions, suggest unverified modifications, or struggle with workspace context, leading to critical pathing errors and messy code. Without strict behavioral boundaries, they risk executing unsafe file operations, creating redundant logic, or breaking existing architectures without user consent.",
      whatIBuilt:
        'A robust, highly specific ruleset governing AI behavior for a full-stack environment (React Native, Python/FastAPI, Prisma, and Supabase). It enforces mandatory codebase analysis using terminal commands, dictates strict workspace-relative pathing for all file edits, and mandates the use of Angular-convention Conventional Commits for all version control.',
      myRole: 'Authored and iterated the ruleset architecture to enforce quality, consistency, and project-specific constraints.',
      outcome:
        'Transforms the AI from a reactive suggestion engine into a disciplined engineering partner. It guarantees a "safety-first" execution model by absolutely prohibiting unprompted commits or changes without explicit user instruction. Furthermore, it ensures all generated code adheres to clean code guidelines, DRY principles, and modern React/Database best practices.',
      previewUrl: '/resources/cursor-ruleset.md',
      resourceDownloads: [
        {
          label: 'Download Markdown Ruleset',
          url: '/resources/cursor-ruleset.md',
          download: true,
        },
      ],
    },
  },
  {
    title: 'Sourcing SOP',
    slug: 'sourcing-sop',
    hook: 'A step-by-step Standard Operating Procedure detailing the exact workflows for finding, vetting, and organizing high-quality targets using advanced search techniques and automated tracking.',
    stack: ['SOURCING', 'STRATEGY', 'OPERATIONS', 'TALENT ACQUISITION'],
    category: 'Strategy',
    roleTag: 'Client Work',
    content: {
      problem:
        'Without a structured methodology, finding high-quality candidates often results in either overwhelming search volumes or entirely irrelevant data. Furthermore, providing stakeholders with a massive list of candidates who only "somewhat fit" is highly inefficient and creates unnecessary friction in the pipeline.',
      whatIBuilt:
        'A comprehensive Standard Operating Procedure (SOP) that outlines precise workflows for utilizing LinkedIn and Sales Navigator. It details advanced Boolean logic execution, candidate evaluation criteria, and a structured approach to spreadsheet data management.',
      myRole: 'Designed and documented the full SOP workflow so new contributors can execute consistently without tribal knowledge.',
      outcome:
        'Empowers teams to conduct highly targeted searches and efficiently manage talent pipelines. The guide provides actionable tools, including automated spreadsheet formulas for ranking candidates based on years of experience and company tenure, allowing teams to instantly identify top-tier prospects while remaining adaptable to tight deadlines.',
      previewUrl: '/resources/sourcing-sop.pdf',
      resourceDownloads: [
        {
          label: 'Download SOP PDF',
          url: '/resources/sourcing-sop.pdf',
          download: true,
        },
      ],
    },
  },
];
