export interface SkillCategory {
  title: string;
  items: string[];
}

/**
 * Skill matrix data from ContentDoc.
 * Four categories + languages line.
 */
export const skillCategories: SkillCategory[] = [
  {
    title: 'Strategy & Operations',
    items: [
      'Strategic Research & Due Diligence',
      'Executive Decision Support',
      'Process Design & Playbooks',
      'Venture Evaluation',
      'Event Strategy & Management',
      'Talent Sourcing & Recruitment',
    ],
  },
  {
    title: 'AI & Product',
    items: [
      'AI Prototyping (0→1)',
      'Agent Architecture',
      'Product Documentation (PRD, User Stories)',
      'MVP & POC Development',
      'Prompt Engineering',
    ],
  },
  {
    title: 'Technical',
    items: [
      'AI-Assisted Development (Cursor, Antigravity, Claude Code)',
      'Adaptive Tech Stack — fast adoption, language/framework agnostic',
      'Internal Tooling & Dashboards',
      'CRM & Pipeline Systems',
      'Local LLM & Agent Architecture (Ollama)',
    ],
  },
  {
    title: 'Range',
    items: [
      'Physical Product Development',
      'Electronics & Firmware (ESP32)',
      '3D Design & Modeling',
      'Custom Hardware Prototyping',
    ],
  },
];

export const languages = 'English · Croatian · Russian — operational across US, Balkan, and Eastern European contexts';
