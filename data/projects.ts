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
      outcome: "Replaced a fragmented, unmanageable system with a single operational tab. Reporting became instant. The CEO had full pipeline visibility without opening a single Excel file."
    }
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
    hook: 'A foundational primer for non-designers aiming to understand the core principles of creating intuitive and visually appealing digital products.',
    stack: ['CRASH COURSE', 'DESIGN BASICS', 'SLIDE DECK'],
    category: 'Strategy',
    roleTag: 'Client Work',
    content: {
      problem: 'Developers and business operators often struggle to make their functional apps look professional and feel intuitive to the end-user.',
      whatIBuilt: 'A condensed, actionable guide breaking down essential UX/UI heuristics, typography, layout fundamentals, and user flows.',
      myRole: 'Designed and structured the crash course to translate design fundamentals into practical decisions non-designers can apply immediately.',
      outcome: 'Empowers non-designers to make confident product decisions and build better, user-centric interfaces from day one.',
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
    hook: 'A custom configuration blueprint designed to optimize the output and coding standards of the Cursor AI code editor for modern development.',
    stack: ['CODE CONFIG', 'AI TOOLING', 'DEVELOPER RESOURCE'],
    category: 'Strategy',
    roleTag: 'Client Work',
    content: {
      problem: "AI coding assistants can generate inconsistent, messy, or outdated code if they aren't given strict, project-specific boundaries and context.",
      whatIBuilt: 'A comprehensive .cursorrules file that dictates styling, architecture preferences, and best practices for the AI to follow.',
      myRole: 'Authored and iterated the ruleset architecture to enforce quality, consistency, and project-specific constraints.',
      outcome: "Drastically reduces code review time and ensures all AI-generated code aligns perfectly with the project's technical standards.",
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
    hook: 'A step-by-step Standard Operating Procedure detailing the exact workflows for finding, vetting, and organizing high-quality targets.',
    stack: ['SOP', 'OPERATIONS', 'INTERNAL DOC'],
    category: 'Strategy',
    roleTag: 'Client Work',
    content: {
      problem: 'Manual sourcing is highly repetitive, prone to human error, and lacks the standardization needed to scale operations efficiently.',
      whatIBuilt: 'A clear, reproducible playbook that outlines the exact tools, search parameters, and data entry workflows needed for consistent sourcing.',
      myRole: 'Designed and documented the full SOP workflow so new contributors can execute consistently without tribal knowledge.',
      outcome: 'Streamlines the pipeline, allowing new team members or virtual assistants to onboard instantly and execute tasks flawlessly.',
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
