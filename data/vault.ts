export interface VaultItem {
  title: string;
  description: string;
  type: 'Workbook' | 'Framework' | 'SOP' | 'Resource' | 'Article';
  status: 'Ready' | 'Needs update' | 'TBD';
  tags?: string[];
  downloadUrl?: string;
  pageUrl?: string;
}

/**
 * Vault items from ContentDoc.
 * Download URLs wired to /public/resources/.
 */
export const vaultItems: VaultItem[] = [
  {
    title: 'Sourcing SOP',
    description: 'Standard operating procedure for talent sourcing pipelines.',
    type: 'SOP',
    status: 'Ready',
    tags: ['Sourcing', 'Operations', 'Talent Acquisition'],
    downloadUrl: '/resources/sourcing-sop.pdf',
    pageUrl: '/work/sourcing-sop',
  },
  {
    title: 'AI Development Workbook',
    description: 'Practical manual for non-technical operators building software with AI tools.',
    type: 'Workbook',
    status: 'Ready',
    tags: ['PDF Guide', 'AI-Native', 'Free Resource'],
    downloadUrl: '/resources/ai-workbook.pdf',
    pageUrl: '/work/ai-development-workbook',
  },
  {
    title: 'Cursor Ruleset',
    description: 'Opinionated ruleset for AI-assisted code editors.',
    type: 'Resource',
    status: 'Ready',
    tags: ['AI Configuration', 'DevEx', 'System Architecture'],
    downloadUrl: '/resources/cursor-ruleset.md',
    pageUrl: '/work/cursor-ruleset-resource',
  },
  {
    title: '3D Printing Articles',
    description: 'Technical articles on 3D printing and prototyping.',
    type: 'Article',
    status: 'TBD',
    downloadUrl: undefined,
  },
];
