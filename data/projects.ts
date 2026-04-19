export interface ProjectContent {
  problem: string;
  whatIBuilt: string;
  myRole: string;
  outcome: string;
  repoUrl?: string;
  makerWorldUrls?: { text: string; url: string }[];
  images?: string[];
  pdfUrl?: string;
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
  }
];
