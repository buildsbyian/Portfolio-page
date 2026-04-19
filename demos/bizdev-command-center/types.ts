export type ProjectPriority = 'high' | 'medium' | 'low';

export type ProjectStatus =
  | 'potential'
  | 'active'
  | 'on-hold'
  | 'completed'
  | 'archived';

export type TaskStatus = 'todo' | 'doing' | 'waiting' | 'done';

export type DemoContactType =
  | 'guest'
  | 'target_guest'
  | 'host'
  | 'established_connection'
  | 'vip'
  | 'potential_cto_club_member'
  | 'cto_club_member'
  | 'partner'
  | 'advisor'
  | 'founder';

export type DemoContactArea =
  | 'engineering'
  | 'founders'
  | 'product'
  | 'events'
  | 'partnerships'
  | 'community'
  | 'research'
  | null;

export type DemoEventType = 'product' | 'engineering' | 'startup' | 'cto_club';

export type DemoEventStatus =
  | 'Planning'
  | 'Invitations Sent'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export type DemoPipelineStage =
  | 'Initial Outreach'
  | 'Forming the Relationship'
  | 'Maintaining the Relationship';

export type DemoVipPriority = 'High' | 'Medium' | 'Low';

export type DemoVipInitiativeType = 'give' | 'ask';

export type DemoVipInitiativeStatus = 'active' | 'planned' | 'completed';

export type DemoVipActivityType = 'meeting' | 'email' | 'intro' | 'note';

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
  additionalEmails: string[];
  company: string;
  type: DemoContactType;
  area: DemoContactArea;
  linkedinUrl?: string;
  isInThinkTank: boolean;
  currentProjects: string[];
  goalsAspirations: string[];
  strategicGoals: string[];
  generalNotes: string;
  createdAt: string;
}

export interface DemoEvent {
  id: string;
  name: string;
  eventType: DemoEventType;
  eventDate: string;
  status: DemoEventStatus;
  venue: string;
  description: string;
  guestCount: number;
  maxAttendees: number;
  createdAt: string;
}

export interface DemoPipelineEntry {
  id: string;
  contactId: string;
  stage: DemoPipelineStage;
  nextAction: string;
  nextActionDate: string;
  lastActionDate: string;
  notes: string;
}

export interface DemoVipInitiative {
  id: string;
  title: string;
  type: DemoVipInitiativeType;
  status: DemoVipInitiativeStatus;
  detail: string;
}

export interface DemoVipActivity {
  id: string;
  date: string;
  type: DemoVipActivityType;
  summary: string;
}

export interface DemoVipProfile {
  id: string;
  contactId: string;
  priority: DemoVipPriority;
  relationshipSummary: string;
  objective: string;
  nextStep: string;
  tags: string[];
  initiatives: DemoVipInitiative[];
  activities: DemoVipActivity[];
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
