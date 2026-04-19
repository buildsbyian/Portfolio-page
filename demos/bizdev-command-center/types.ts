export type ProjectPriority = 'high' | 'medium' | 'low';

export type ProjectStatus =
  | 'potential'
  | 'active'
  | 'on-hold'
  | 'completed'
  | 'archived';

export type TaskStatus = 'todo' | 'doing' | 'waiting' | 'done';

export interface RatingMetrics {
  revenuePotential: number;
  insiderSupport: number;
  strategicFit: number;
  timing: number;
  effort: number;
  stabilityClarity: number;
}

export interface DemoProject {
  id: string;
  name: string;
  description: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  isIanCollaboration: boolean;
  createdAt: string;
  ratingMetrics: RatingMetrics;
}

export interface DemoTask {
  id: string;
  projectId: string;
  text: string;
  status: TaskStatus;
  completed: boolean;
  createdAt: string;
}

export interface BizDevDemoState {
  projects: DemoProject[];
  tasks: DemoTask[];
}

export interface DemoContact {
  id: string;
  name: string;
  role: string;
  email: string;
  company: string;
  type: 'guest' | 'vip' | 'partner' | 'advisor' | 'founder';
  area: 'events' | 'partnerships' | 'community' | 'research' | null;
  linkedinUrl?: string;
}

export interface DemoEvent {
  id: string;
  name: string;
  eventDate: string;
  status: 'Draft' | 'Invitations Sent' | 'In Progress' | 'Completed';
  venue: string;
  focus: string;
  guestCount: number;
}

export interface DemoPipelineEntry {
  id: string;
  contactId: string;
  stage:
    | 'New Contact'
    | 'Initial Outreach'
    | 'Connected'
    | 'Building Relationship'
    | 'Strategic Partner';
  nextAction: string;
  nextActionDate: string;
  notes: string;
}

export interface DemoVipProfile {
  id: string;
  name: string;
  company: string;
  priority: 'High' | 'Medium' | 'Low';
  objective: string;
  nextStep: string;
}

export interface DemoCtoLead {
  id: string;
  name: string;
  company: string;
  status: 'Potential' | 'In Pipeline' | 'Current Member';
  introSource: string;
  nextAction: string;
}

export interface CommandCenterState {
  contacts: DemoContact[];
  events: DemoEvent[];
  pipeline: DemoPipelineEntry[];
  vipProfiles: DemoVipProfile[];
  ctoLeads: DemoCtoLead[];
  bizdev: BizDevDemoState;
}
