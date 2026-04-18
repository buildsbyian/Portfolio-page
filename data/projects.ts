export interface Project {
  title: string;
  slug: string;
  hook: string;
  stack: string[];
  category: 'Software' | 'Hardware' | 'Strategy';
  roleTag: 'Solo Builder' | 'CoS Operator' | 'Client Work';
  featured?: boolean;
}

/**
 * Project data — populate as case studies are built.
 * Each project maps to a /work/[slug] page.
 */
export const projects: Project[] = [];
