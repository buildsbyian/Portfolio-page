export interface VaultItem {
  title: string;
  description: string;
  type: 'Workbook' | 'Framework' | 'SOP' | 'Resource' | 'Article';
  status: 'Ready' | 'Needs update' | 'TBD';
  downloadUrl?: string;
}

/**
 * Vault items from ContentDoc.
 * Download URLs to be wired once files are in /public.
 */
export const vaultItems: VaultItem[] = [
  {
    title: 'AI Coding Workbook',
    description: 'A practical guide to AI-assisted development workflows.',
    type: 'Workbook',
    status: 'Ready',
    downloadUrl: undefined, // TODO: wire to /workbook.pdf
  },
  {
    title: 'Lean Product Framework',
    description: 'Lightweight framework for product discovery and validation.',
    type: 'Framework',
    status: 'Needs update',
    downloadUrl: undefined,
  },
  {
    title: 'Sourcing SOP',
    description: 'Standard operating procedure for talent sourcing pipelines.',
    type: 'SOP',
    status: 'Ready',
    downloadUrl: undefined, // TODO: wire to /sourcing-sop.pdf
  },
  {
    title: 'Cursor Ruleset',
    description: 'Opinionated ruleset for AI-assisted code editors.',
    type: 'Resource',
    status: 'Ready',
    downloadUrl: undefined,
  },
  {
    title: '3D Printing Articles',
    description: 'Technical articles on 3D printing and prototyping.',
    type: 'Article',
    status: 'TBD',
    downloadUrl: undefined,
  },
];
