'use client';

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from 'react';
import { createCommandCenterSeed } from './seed';
import type {
  CommandCenterState,
  DemoContact,
  DemoContactArea,
  DemoContactType,
  DemoEvent,
  DemoEventStatus,
  DemoEventType,
  DemoPipelineEntry,
  DemoPipelineStage,
  DemoProject,
  DemoTask,
  ProjectPriority,
  ProjectStatus,
  TaskStatus,
} from './types';

const STORAGE_KEY = 'portfolio.command-center.demo.v3';
const SANITIZED_TERM_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bApollo\b/gi, 'SummitArc'],
  [/\bWEX\b/gi, 'Northlane'],
  [/\bSchlegel\b/gi, 'Sterling'],
  [/^\s*ASC\s*$/i, 'BluePeak'],
  [/^\s*Built\s*$/i, 'ForgePath'],
  [/^\s*Mede\s*$/i, 'LumenGrid'],
  [/^\s*Subpop\s*$/i, 'CinderLoop'],
  [/\bMatthew Rotondo\b/gi, 'Mason Rivera'],
  [/\bEthan Orley\b/gi, 'Evan Norwood'],
  [/\bNeil Granberry\b/gi, 'Nolan Gray'],
  [/\bMitch Meiss\b/gi, 'Micah Voss'],
];

function sanitizeDemoString(value: string) {
  return SANITIZED_TERM_REPLACEMENTS.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    value
  );
}

function sanitizeDemoState<T>(value: T): T {
  if (typeof value === 'string') {
    return sanitizeDemoString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeDemoState(item)) as T;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => [
      key,
      sanitizeDemoState(entryValue),
    ]);

    return Object.fromEntries(entries) as T;
  }

  return value;
}

const TOOL_TABS = [
  { id: 'contacts', label: 'Contacts' },
  { id: 'events-management', label: 'Events Management' },
  { id: 'vip-management', label: 'VIP Management' },
  { id: 'cto-club', label: 'C-Suite Think Tank' },
  { id: 'bizdev-pipeline', label: 'BizDev Pipeline' },
] as const;

const EVENTS_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'events', label: 'Events' },
  { id: 'pipeline', label: 'Pipeline' },
] as const;

const BIZDEV_TABS = [
  { id: 'bizdev', label: 'BizDev Overview' },
  { id: 'collaboration', label: 'Collaboration' },
] as const;

const CONTACT_TYPES = [
  'all',
  'guest',
  'target_guest',
  'host',
  'established_connection',
  'vip',
  'potential_cto_club_member',
  'cto_club_member',
  'partner',
  'advisor',
  'founder',
] as const;
const CONTACT_AREAS = [
  'all',
  'engineering',
  'founders',
  'product',
  'events',
  'partnerships',
  'community',
  'research',
  'none',
] as const;
const CONTACT_SORTS = ['newest', 'oldest', 'name', 'company'] as const;
const PIPELINE_STAGES = [
  'Initial Outreach',
  'Forming the Relationship',
  'Maintaining the Relationship',
] as const;
const EVENT_TYPES = ['product', 'engineering', 'startup', 'cto_club'] as const;
const EVENT_STATUSES = [
  'Planning',
  'Invitations Sent',
  'In Progress',
  'Completed',
  'Cancelled',
] as const;
const PROJECT_STATUS_OPTIONS = [
  'potential',
  'active',
  'on-hold',
  'completed',
  'archived',
] as const;
const PRIORITY_OPTIONS = ['high', 'medium', 'low'] as const;
const TASK_STATUS_OPTIONS = ['todo', 'doing', 'waiting', 'done'] as const;

type ToolTab = (typeof TOOL_TABS)[number]['id'];
type EventsTab = (typeof EVENTS_TABS)[number]['id'];
type BizdevTab = (typeof BIZDEV_TABS)[number]['id'];
type ContactTypeFilter = (typeof CONTACT_TYPES)[number];
type ContactAreaFilter = (typeof CONTACT_AREAS)[number];
type ContactSort = (typeof CONTACT_SORTS)[number];
type ContactPanelMode = 'create' | 'view' | 'edit' | null;
type EventPanelMode = 'create' | 'edit' | null;
type VipTab = 'dashboard' | 'profile' | 'give' | 'ask' | 'activities';
type ContactDraft = Omit<DemoContact, 'id' | 'createdAt'>;
type EventDraft = Omit<DemoEvent, 'id' | 'guestCount' | 'createdAt'>;

const defaultContactDraft: ContactDraft = {
  name: '',
  role: '',
  email: '',
  additionalEmails: [],
  company: '',
  type: 'guest',
  area: null,
  linkedinUrl: '',
  isInThinkTank: false,
  currentProjects: [],
  goalsAspirations: [],
  strategicGoals: [],
  generalNotes: '',
};

const defaultEventDraft: EventDraft = {
  name: '',
  eventType: 'product',
  eventDate: '',
  status: 'Planning',
  venue: '',
  description: '',
  maxAttendees: 24,
};

function loadInitialState(): CommandCenterState {
  if (typeof window === 'undefined') {
    return sanitizeDemoState(createCommandCenterSeed());
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return sanitizeDemoState(
      stored ? (JSON.parse(stored) as CommandCenterState) : createCommandCenterSeed()
    );
  } catch {
    return sanitizeDemoState(createCommandCenterSeed());
  }
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function computeProjectRating(project: DemoProject) {
  const values = Object.values(project.ratingMetrics);
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(date));
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (insideQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === ',' && !insideQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += character;
  }

  cells.push(current.trim());
  return cells;
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replaceAll('"', '""')}"`;
          }
          return cell;
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function BizDevCommandCenterDemo() {
  const [state, setState] = useState<CommandCenterState>(loadInitialState);
  const [activeTool, setActiveTool] = useState<ToolTab>('bizdev-pipeline');
  const [activeEventsTab, setActiveEventsTab] = useState<EventsTab>('contacts');
  const [activeBizdevTab, setActiveBizdevTab] = useState<BizdevTab>('bizdev');
  const [contactSearch, setContactSearch] = useState('');
  const deferredContactSearch = useDeferredValue(contactSearch);
  const [contactTypeFilter, setContactTypeFilter] = useState<ContactTypeFilter>('all');
  const [contactAreaFilter, setContactAreaFilter] = useState<ContactAreaFilter>('all');
  const [contactSort, setContactSort] = useState<ContactSort>('newest');
  const [contactPanelMode, setContactPanelMode] = useState<ContactPanelMode>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [contactDraft, setContactDraft] = useState<ContactDraft>(defaultContactDraft);
  const [eventPanelMode, setEventPanelMode] = useState<EventPanelMode>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventDraft, setEventDraft] = useState(defaultEventDraft);
  const [eventSearch, setEventSearch] = useState('');
  const deferredEventSearch = useDeferredValue(eventSearch);
  const [eventTypeFilter, setEventTypeFilter] = useState<DemoEventType | 'all'>('all');
  const [eventStatusFilter, setEventStatusFilter] = useState<DemoEventStatus | 'all'>('all');
  const [eventSort, setEventSort] = useState<'date-asc' | 'date-desc' | 'name-asc' | 'created-desc'>(
    'date-asc'
  );
  const [pipelineSearch, setPipelineSearch] = useState('');
  const deferredPipelineSearch = useDeferredValue(pipelineSearch);
  const [pipelineStageFilter, setPipelineStageFilter] = useState<DemoPipelineStage | 'all'>('all');
  const [pipelineSort, setPipelineSort] = useState<
    'next-action-asc' | 'name-asc' | 'stage-asc' | 'last-action-desc'
  >('next-action-asc');
  const [bizdevSearch, setBizdevSearch] = useState('');
  const deferredBizdevSearch = useDeferredValue(bizdevSearch);
  const [bizdevStatusFilter, setBizdevStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [bizdevPriorityFilter, setBizdevPriorityFilter] = useState<ProjectPriority | 'all'>('all');
  const [bizdevSort, setBizdevSort] = useState<
    'rating-desc' | 'rating-asc' | 'created-desc' | 'name-asc' | 'priority-desc'
  >('rating-desc');
  const [selectedBizdevProjectId, setSelectedBizdevProjectId] = useState<string>('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showBizdevTaskForm, setShowBizdevTaskForm] = useState(false);
  const [bizdevTaskDraft, setBizdevTaskDraft] = useState({
    text: '',
    status: 'todo' as TaskStatus,
  });
  const [selectedVipContactId, setSelectedVipContactId] = useState<string>('');
  const [activeVipTab, setActiveVipTab] = useState<VipTab>('dashboard');
  const importInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    setState((currentState) => sanitizeDemoState(currentState));
  }, []);

  const selectedContact =
    state.contacts.find((contact) => contact.id === selectedContactId) ?? null;

  const filteredContacts = state.contacts
    .map((contact) => ({ contact }))
    .filter(({ contact }) => {
      const query = deferredContactSearch.trim().toLowerCase();
      const matchesSearch =
        !query ||
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.company.toLowerCase().includes(query) ||
        contact.role.toLowerCase().includes(query);

      const matchesType =
        contactTypeFilter === 'all' ? true : contact.type === contactTypeFilter;

      const matchesArea =
        contactAreaFilter === 'all'
          ? true
          : contactAreaFilter === 'none'
            ? contact.area === null
            : contact.area === contactAreaFilter;

      return matchesSearch && matchesType && matchesArea;
    })
    .sort((left, right) => {
      if (contactSort === 'name') {
        return left.contact.name.localeCompare(right.contact.name);
      }

      if (contactSort === 'company') {
        return left.contact.company.localeCompare(right.contact.company);
      }

      return contactSort === 'oldest'
        ? new Date(left.contact.createdAt).getTime() - new Date(right.contact.createdAt).getTime()
        : new Date(right.contact.createdAt).getTime() -
            new Date(left.contact.createdAt).getTime();
    })
    .map(({ contact }) => contact);

  const pipelineWithContacts = state.pipeline.map((entry) => ({
    ...entry,
    contact: state.contacts.find((contact) => contact.id === entry.contactId) ?? null,
  }));

  const filteredPipeline = pipelineWithContacts
    .filter((entry) => {
      const query = deferredPipelineSearch.trim().toLowerCase();
      const contactName = entry.contact?.name.toLowerCase() ?? '';
      const companyName = entry.contact?.company.toLowerCase() ?? '';
      const matchesSearch =
        !query ||
        contactName.includes(query) ||
        companyName.includes(query) ||
        entry.nextAction.toLowerCase().includes(query) ||
        entry.notes.toLowerCase().includes(query);

      const matchesStage =
        pipelineStageFilter === 'all' ? true : entry.stage === pipelineStageFilter;

      return matchesSearch && matchesStage;
    })
    .sort((left, right) => {
      switch (pipelineSort) {
        case 'name-asc':
          return (left.contact?.name ?? '').localeCompare(right.contact?.name ?? '');
        case 'stage-asc':
          return left.stage.localeCompare(right.stage);
        case 'last-action-desc':
          return (
            new Date(right.lastActionDate).getTime() - new Date(left.lastActionDate).getTime()
          );
        case 'next-action-asc':
        default:
          return (
            new Date(left.nextActionDate).getTime() - new Date(right.nextActionDate).getTime()
          );
      }
    });

  const recentEvents = [...state.events].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );

  const filteredEvents = [...state.events]
    .filter((event) => {
      const query = deferredEventSearch.trim().toLowerCase();
      const matchesSearch =
        !query ||
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query);

      const matchesType = eventTypeFilter === 'all' ? true : event.eventType === eventTypeFilter;
      const matchesStatus =
        eventStatusFilter === 'all' ? true : event.status === eventStatusFilter;

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((left, right) => {
      switch (eventSort) {
        case 'date-desc':
          return new Date(right.eventDate).getTime() - new Date(left.eventDate).getTime();
        case 'name-asc':
          return left.name.localeCompare(right.name);
        case 'created-desc':
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        case 'date-asc':
        default:
          return new Date(left.eventDate).getTime() - new Date(right.eventDate).getTime();
      }
    });

  const vipContacts = state.contacts.filter((contact) => contact.type === 'vip');
  const selectedVipContact =
    vipContacts.find((contact) => contact.id === selectedVipContactId) ?? vipContacts[0] ?? null;
  const selectedVipProfile =
    state.vipProfiles.find((profile) => profile.contactId === selectedVipContact?.id) ?? null;

  const bizdevProjectPool = state.bizdev.projects.filter((project) =>
    activeBizdevTab === 'collaboration'
      ? project.isIanCollaboration
      : !project.isIanCollaboration
  );

  const bizdevProjects = bizdevProjectPool
    .filter((project) => {
      const matchesSearch =
        !deferredBizdevSearch ||
        project.name.toLowerCase().includes(deferredBizdevSearch.toLowerCase()) ||
        project.description.toLowerCase().includes(deferredBizdevSearch.toLowerCase());

      const matchesStatus =
        bizdevStatusFilter === 'all' ? true : project.status === bizdevStatusFilter;

      const matchesPriority =
        bizdevPriorityFilter === 'all' ? true : project.priority === bizdevPriorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((left, right) => {
      switch (bizdevSort) {
        case 'rating-asc':
          return computeProjectRating(left) - computeProjectRating(right);
        case 'created-desc':
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        case 'name-asc':
          return left.name.localeCompare(right.name);
        case 'priority-desc':
          return getPriorityRank(right.priority) - getPriorityRank(left.priority);
        case 'rating-desc':
        default:
          return computeProjectRating(right) - computeProjectRating(left);
      }
    });

  const selectedBizdevProject =
    state.bizdev.projects.find((project) => project.id === selectedBizdevProjectId) ??
    bizdevProjects[0] ??
    null;

  const selectedBizdevTasks = selectedBizdevProject
    ? state.bizdev.tasks.filter((task) => task.projectId === selectedBizdevProject.id)
    : [];

  const vipStats = {
    total: vipContacts.length,
    activeGive: state.vipProfiles.reduce(
      (count, profile) =>
        count +
        profile.initiatives.filter(
          (initiative) => initiative.type === 'give' && initiative.status !== 'completed'
        ).length,
      0
    ),
    activeAsk: state.vipProfiles.reduce(
      (count, profile) =>
        count +
        profile.initiatives.filter(
          (initiative) => initiative.type === 'ask' && initiative.status !== 'completed'
        ).length,
      0
    ),
    totalActivities: state.vipProfiles.reduce(
      (count, profile) => count + profile.activities.length,
      0
    ),
    recentInteractions: state.vipProfiles.reduce(
      (count, profile) =>
        count +
        profile.activities.filter((activity) => {
          const days =
            (Date.now() - new Date(activity.date).getTime()) / (1000 * 60 * 60 * 24);
          return days <= 21;
        }).length,
      0
    ),
  };

  function resetDemo() {
    const freshState = createCommandCenterSeed();
    window.localStorage.removeItem(STORAGE_KEY);

    startTransition(() => {
      setState(freshState);
      setActiveTool('bizdev-pipeline');
      setActiveEventsTab('contacts');
      setActiveBizdevTab('bizdev');
      setContactSearch('');
      setContactTypeFilter('all');
      setContactAreaFilter('all');
      setContactSort('newest');
      setContactPanelMode(null);
      setSelectedContactId(null);
      setEventPanelMode(null);
      setSelectedEventId(null);
      setEventSearch('');
      setEventTypeFilter('all');
      setEventStatusFilter('all');
      setEventSort('date-asc');
      setPipelineSearch('');
      setPipelineStageFilter('all');
      setPipelineSort('next-action-asc');
      setBizdevStatusFilter('all');
      setBizdevPriorityFilter('all');
      setBizdevSort('rating-desc');
      setSelectedBizdevProjectId('');
      setShowBizdevTaskForm(false);
      setBizdevTaskDraft({ text: '', status: 'todo' });
      setSelectedVipContactId('');
      setActiveVipTab('dashboard');
    });
  }

  function openCreateContact() {
    setContactDraft(defaultContactDraft);
    setSelectedContactId(null);
    setContactPanelMode('create');
  }

  function openViewContact(contact: DemoContact) {
    setSelectedContactId(contact.id);
    setContactDraft({
      name: contact.name,
      role: contact.role,
      email: contact.email,
      additionalEmails: contact.additionalEmails,
      company: contact.company,
      type: contact.type,
      area: contact.area,
      linkedinUrl: contact.linkedinUrl ?? '',
      isInThinkTank: contact.isInThinkTank,
      currentProjects: contact.currentProjects,
      goalsAspirations: contact.goalsAspirations,
      strategicGoals: contact.strategicGoals,
      generalNotes: contact.generalNotes,
    });
    setContactPanelMode('view');
  }

  function openEditContact(contact: DemoContact) {
    openViewContact(contact);
    setContactPanelMode('edit');
  }

  function saveContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!contactDraft.name.trim() || !contactDraft.email.trim()) {
      return;
    }

    startTransition(() => {
      setState((currentState) => {
        if (contactPanelMode === 'edit' && selectedContactId) {
          return {
            ...currentState,
            contacts: currentState.contacts.map((contact) =>
              contact.id === selectedContactId
                ? {
                    ...contact,
                    ...contactDraft,
                    linkedinUrl: contactDraft.linkedinUrl || undefined,
                  }
                : contact
            ),
          };
        }

        const newContact: DemoContact = {
          id: createId('contact'),
          ...contactDraft,
          createdAt: new Date().toISOString(),
          linkedinUrl: contactDraft.linkedinUrl || undefined,
        };

        return {
          ...currentState,
          contacts: [newContact, ...currentState.contacts],
        };
      });

      setContactPanelMode(null);
      setSelectedContactId(null);
    });
  }

  function deleteContact(contactId: string) {
    startTransition(() => {
      setState((currentState) => ({
        ...currentState,
        contacts: currentState.contacts.filter((contact) => contact.id !== contactId),
        pipeline: currentState.pipeline.filter((entry) => entry.contactId !== contactId),
      }));
      setContactPanelMode(null);
      setSelectedContactId(null);
    });
  }

  function handleContactImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    file
      .text()
      .then((content) => {
        const rows = content.split(/\r?\n/).filter(Boolean);
        const [, ...dataRows] = rows;

        const importedContacts = dataRows
          .map(parseCsvLine)
          .map((cells) => ({
            id: createId('contact'),
            name: cells[0] ?? '',
            email: cells[1] ?? '',
            company: cells[2] ?? '',
            role: cells[3] ?? '',
            additionalEmails: [],
            type: ((cells[4] ?? 'guest').toLowerCase() || 'guest') as DemoContactType,
            area: (cells[5] ? (cells[5].toLowerCase() as DemoContactArea) : null) ?? null,
            linkedinUrl: cells[6] || undefined,
            isInThinkTank: false,
            currentProjects: [],
            goalsAspirations: [],
            strategicGoals: [],
            generalNotes: '',
            createdAt: new Date().toISOString(),
          }))
          .filter((contact) => contact.name && contact.email);

        startTransition(() => {
          setState((currentState) => ({
            ...currentState,
            contacts: [...importedContacts, ...currentState.contacts],
          }));
        });
      })
      .finally(() => {
        if (importInputRef.current) {
          importInputRef.current.value = '';
        }
      });
  }

  function exportContacts() {
    const rows = [
      [
        'name',
        'email',
        'company',
        'role',
        'type',
        'area',
        'linkedinUrl',
        'additionalEmails',
        'isInThinkTank',
        'currentProjects',
        'goalsAspirations',
        'strategicGoals',
        'generalNotes',
      ],
      ...filteredContacts.map((contact) => [
        contact.name,
        contact.email,
        contact.company,
        contact.role,
        contact.type,
        contact.area ?? '',
        contact.linkedinUrl ?? '',
        contact.additionalEmails.join('; '),
        contact.isInThinkTank ? 'Yes' : 'No',
        contact.currentProjects.join('; '),
        contact.goalsAspirations.join('; '),
        contact.strategicGoals.join('; '),
        contact.generalNotes,
      ]),
    ];

    downloadCsv('sanitized-command-center-contacts.csv', rows);
  }

  function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!eventDraft.name.trim() || !eventDraft.eventDate.trim()) return;

    startTransition(() => {
      setState((currentState) => {
        if (eventPanelMode === 'edit' && selectedEventId) {
          return {
            ...currentState,
            events: currentState.events.map((currentEvent) =>
              currentEvent.id === selectedEventId
                ? {
                    ...currentEvent,
                    ...eventDraft,
                  }
                : currentEvent
            ),
          };
        }

        const newEvent: DemoEvent = {
          id: createId('event'),
          ...eventDraft,
          guestCount: 0,
          createdAt: new Date().toISOString(),
        };

        return {
          ...currentState,
          events: [newEvent, ...currentState.events],
        };
      });
      setEventDraft(defaultEventDraft);
      setEventPanelMode(null);
      setSelectedEventId(null);
    });
  }

  function openEditEvent(event: DemoEvent) {
    setSelectedEventId(event.id);
    setEventDraft({
      name: event.name,
      eventType: event.eventType,
      eventDate: event.eventDate,
      status: event.status,
      venue: event.venue,
      description: event.description,
      maxAttendees: event.maxAttendees,
    });
    setEventPanelMode('edit');
  }

  function openCreateEvent() {
    setSelectedEventId(null);
    setEventDraft(defaultEventDraft);
    setEventPanelMode('create');
  }

  function deleteEvent(eventId: string) {
    startTransition(() => {
      setState((currentState) => ({
        ...currentState,
        events: currentState.events.filter((event) => event.id !== eventId),
      }));
      if (selectedEventId === eventId) {
        setSelectedEventId(null);
        setEventPanelMode(null);
      }
    });
  }

  function updatePipelineEntry(entryId: string, updates: Partial<DemoPipelineEntry>) {
    startTransition(() => {
      setState((currentState) => ({
        ...currentState,
        pipeline: currentState.pipeline.map((entry) =>
          entry.id === entryId ? { ...entry, ...updates } : entry
        ),
      }));
    });
  }

  function updateBizdevProject(projectId: string, updates: Partial<DemoProject>) {
    startTransition(() => {
      setState((currentState) => ({
        ...currentState,
        bizdev: {
          ...currentState.bizdev,
          projects: currentState.bizdev.projects.map((project) =>
            project.id === projectId ? { ...project, ...updates } : project
          ),
        },
      }));
    });
  }

  function updateBizdevTask(taskId: string, updates: Partial<DemoTask>) {
    startTransition(() => {
      setState((currentState) => ({
        ...currentState,
        bizdev: {
          ...currentState.bizdev,
          tasks: currentState.bizdev.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        },
      }));
    });
  }

  function createBizdevTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedBizdevProject || !bizdevTaskDraft.text.trim()) return;

    const newTask: DemoTask = {
      id: createId('task'),
      projectId: selectedBizdevProject.id,
      text: bizdevTaskDraft.text.trim(),
      status: bizdevTaskDraft.status,
      completed: bizdevTaskDraft.status === 'done',
      createdAt: new Date().toISOString(),
    };

    startTransition(() => {
      setState((currentState) => ({
        ...currentState,
        bizdev: {
          ...currentState.bizdev,
          tasks: [newTask, ...currentState.bizdev.tasks],
        },
      }));
      setBizdevTaskDraft({ text: '', status: 'todo' });
      setShowBizdevTaskForm(false);
    });
  }

  function handleBizdevDrop(event: DragEvent<HTMLDivElement>, status: TaskStatus) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    if (!taskId) return;

    setDraggedTaskId(null);
    updateBizdevTask(taskId, { status, completed: status === 'done' });
  }

  const pipelineCounts = PIPELINE_STAGES.reduce<Record<string, number>>((counts, stage) => {
    counts[stage] = state.pipeline.filter((entry) => entry.stage === stage).length;
    return counts;
  }, {});

  const pipelineDueThisWeek = state.pipeline.filter((entry) => {
    const actionDate = new Date(entry.nextActionDate);
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return actionDate >= now && actionDate <= nextWeek;
  }).length;

  const pipelineOverdue = state.pipeline.filter(
    (entry) => new Date(entry.nextActionDate) < new Date()
  ).length;

  const bizdevCounts = {
    bizdev: state.bizdev.projects.filter((project) => !project.isIanCollaboration).length,
    collaboration: state.bizdev.projects.filter((project) => project.isIanCollaboration).length,
  };

  return (
    <div className="space-y-8 bg-[#fcfcfd] px-4 py-6 text-[#111827] sm:px-6 lg:px-8 xl:px-10">
      <section className="mx-auto w-full max-w-[1500px] rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6366f1]">
              Sanitized Live Demo
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[#111827]">
              BizDev Command Center
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
              Source-shaped replica of the original internal tool. Data is local to this
              browser.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <p className="text-xs text-[#6b7280]">No external services or shared state</p>
            <button
              type="button"
              onClick={resetDemo}
              className="rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm font-medium text-[#111827] transition hover:bg-[#f9fafb]"
            >
              Reset Demo
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border border-[#e5e7eb] bg-[#f9fafb] shadow-sm">
        <div className="border-b border-[#e5e7eb] bg-white">
          <div className="flex flex-wrap gap-1 px-4 py-2 sm:px-6 lg:px-8">
            {TOOL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTool(tab.id)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  activeTool === tab.id
                    ? 'bg-[#e0e7ff] text-[#4338ca]'
                    : 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#374151]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTool === 'events-management' ? (
          <div className="border-b border-[#e5e7eb] bg-white">
            <div className="flex items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
              <span className="text-lg font-semibold text-[#374151]">Events Management</span>
              <div className="flex flex-wrap gap-6">
                {EVENTS_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveEventsTab(tab.id)}
                    className={`border-b-2 pb-3 text-sm transition ${
                      activeEventsTab === tab.id
                        ? 'border-[#4f46e5] text-[#111827]'
                        : 'border-transparent text-[#64748b] hover:text-[#111827]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        {activeTool === 'events-management' && activeEventsTab === 'dashboard' ? (
          <div className="space-y-6">
            <HeaderBlock
              title="Events Management Dashboard"
              description="Manage your events, contacts, and pipeline"
            />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Events" value={String(state.events.length)} detail="Total tracked events" />
              <MetricCard
                label="Upcoming"
                value={String(
                  state.events.filter((event) => new Date(event.eventDate) > new Date()).length
                )}
                detail="Future events on the calendar"
              />
              <MetricCard
                label="Due This Week"
                value={String(pipelineDueThisWeek)}
                detail="Pipeline actions scheduled"
              />
              <MetricCard
                label="Contacts"
                value={String(state.contacts.length)}
                detail="Shared relationship base"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <SurfaceCard
                title="Recent Events"
                description="Latest event activity"
                badge={`${state.events.length} total`}
              >
                <div className="space-y-4">
                  {recentEvents.slice(0, 4).map((event) => (
                    <div key={event.id} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-[#111827]">{event.name}</p>
                        <p className="text-sm text-[#6b7280]">{event.description}</p>
                      </div>
                      <div className="text-right text-sm text-[#6b7280]">
                        <p>{formatDate(event.eventDate, { month: 'short', day: 'numeric' })}</p>
                        <p>
                          {getEventTypeLabel(event.eventType)} · {event.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </SurfaceCard>

              <SurfaceCard
                title="Relationship Pipeline"
                description="Strategic relationship development"
                badge={`${state.pipeline.length} contacts`}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <MetricCard
                    label="Active Contacts"
                    value={String(state.pipeline.length)}
                    detail="In relationship pipeline"
                  />
                  <MetricCard
                    label="Overdue"
                    value={String(pipelineOverdue)}
                    detail="Need immediate attention"
                  />
                </div>
                <div className="mt-5 space-y-3">
                  {PIPELINE_STAGES.map((stage) => (
                    <div key={stage} className="flex items-center justify-between">
                      <span className="text-sm text-[#475569]">{stage}</span>
                      <span className="font-semibold text-[#111827]">
                        {pipelineCounts[stage] ?? 0}
                      </span>
                    </div>
                  ))}
                </div>
              </SurfaceCard>
            </div>
          </div>
        ) : null}

        {activeTool === 'events-management' && activeEventsTab === 'contacts' ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <HeaderBlock title="Contacts" description="Manage your network and relationship data" />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportContacts}
                  className="rounded-xl border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium shadow-sm"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => importInputRef.current?.click()}
                  className="rounded-xl border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium shadow-sm"
                >
                  Import CSV
                </button>
                <button
                  type="button"
                  onClick={openCreateContact}
                  className="rounded-xl bg-[#111827] px-4 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  + Add Contact
                </button>
                <input
                  ref={importInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleContactImport}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Total Contacts" value={String(state.contacts.length)} detail="Across the local demo" />
              <MetricCard
                label="With Company"
                value={String(state.contacts.filter((contact) => contact.company.trim()).length)}
                detail="Professional context captured"
              />
              <MetricCard
                label="LinkedIn"
                value={String(state.contacts.filter((contact) => contact.linkedinUrl).length)}
                detail="Profiles with a social reference"
              />
              <MetricCard
                label="Think Tank"
                value={String(state.contacts.filter((contact) => contact.isInThinkTank).length)}
                detail="Current community members"
              />
            </div>

            <SurfaceCard
              title="All Contacts"
              description="Source-shaped contact table with local-only persistence"
              badge={`Showing ${filteredContacts.length} of ${state.contacts.length}`}
            >
              <div className="space-y-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
                  <input
                    value={contactSearch}
                    onChange={(event) => setContactSearch(event.target.value)}
                    placeholder="Search contacts by name, email, or company..."
                    className="w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none"
                  />

                  <select
                    value={contactTypeFilter}
                    onChange={(event) =>
                      setContactTypeFilter(event.target.value as ContactTypeFilter)
                    }
                    className="rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none"
                  >
                    {CONTACT_TYPES.map((option) => (
                      <option key={option} value={option}>
                        {option === 'all' ? 'All Types' : toTitleCase(option)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={contactAreaFilter}
                    onChange={(event) =>
                      setContactAreaFilter(event.target.value as ContactAreaFilter)
                    }
                    className="rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none"
                  >
                    {CONTACT_AREAS.map((option) => (
                      <option key={option} value={option}>
                        {option === 'all'
                          ? 'All Areas'
                          : option === 'none'
                            ? 'No Area'
                            : toTitleCase(option)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={contactSort}
                    onChange={(event) => setContactSort(event.target.value as ContactSort)}
                    className="rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none"
                  >
                    {CONTACT_SORTS.map((option) => (
                      <option key={option} value={option}>
                        {option === 'newest'
                          ? 'Newest First'
                          : option === 'oldest'
                            ? 'Oldest First'
                            : option === 'name'
                              ? 'Name A-Z'
                              : 'Company A-Z'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
                  <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,1fr)_160px_140px_180px] gap-4 border-b border-[#e5e7eb] px-4 py-3 text-sm font-semibold text-[#111827]">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Company</span>
                    <span>Type</span>
                    <span>Area</span>
                    <span className="text-right">Actions</span>
                  </div>

                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,1fr)_160px_140px_180px] gap-4 border-b border-[#eef2f7] px-4 py-4 text-sm last:border-b-0"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-base font-semibold text-[#111827]">
                            {contact.name}
                          </p>
                          {contact.linkedinUrl ? (
                            <a
                              href={contact.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-[#4f46e5] hover:underline"
                            >
                              LinkedIn
                            </a>
                          ) : null}
                        </div>
                        <p className="truncate text-sm text-[#64748b]">{contact.role}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[#111827]">{contact.email}</p>
                        {contact.additionalEmails.length > 0 ? (
                          <p className="truncate text-xs text-[#64748b]">
                            +{contact.additionalEmails.length} additional
                          </p>
                        ) : null}
                      </div>
                      <p className="truncate text-[#111827]">{contact.company}</p>
                      <span className="w-fit rounded-full border border-[#dbe1eb] px-3 py-1 text-xs font-medium text-[#111827]">
                        {getContactTypeLabel(contact.type)}
                      </span>
                      <p className="text-[#475569]">
                        {contact.area ? toTitleCase(contact.area) : '-'}
                      </p>
                      <div className="flex items-center justify-end gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => openViewContact(contact)}
                          className="text-[#0f172a] hover:underline"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditContact(contact)}
                          className="text-[#0f172a] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteContact(contact.id)}
                          className="text-[#b91c1c] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SurfaceCard>
          </div>
        ) : null}

        {activeTool === 'events-management' && activeEventsTab === 'events' ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <HeaderBlock title="Events" description="Manage your event portfolio" />
              <button
                type="button"
                onClick={() =>
                  setEventPanelMode((current) => (current === 'create' ? null : 'create'))
                }
                className="rounded-xl bg-[#111827] px-4 py-2 text-sm font-semibold text-white shadow-sm"
              >
                {eventPanelMode === 'create' ? 'Close Form' : '+ Add Event'}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Total Events" value={String(state.events.length)} detail="Across all event types" />
              <MetricCard
                label="Upcoming"
                value={String(state.events.filter((event) => new Date(event.eventDate) > new Date()).length)}
                detail="Still ahead on the calendar"
              />
              <MetricCard
                label="Invitations Sent"
                value={String(state.events.filter((event) => event.status === 'Invitations Sent').length)}
                detail="Mid-funnel event work"
              />
              <MetricCard
                label="Completed"
                value={String(state.events.filter((event) => event.status === 'Completed').length)}
                detail="Finished events"
              />
            </div>

            {eventPanelMode ? (
              <form
                onSubmit={createEvent}
                className="grid gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-4 md:grid-cols-2 xl:grid-cols-3"
              >
                <input
                  value={eventDraft.name}
                  onChange={(event) =>
                    setEventDraft((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Event name"
                  className="rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
                />
                <select
                  value={eventDraft.eventType}
                  onChange={(event) =>
                    setEventDraft((current) => ({
                      ...current,
                      eventType: event.target.value as DemoEventType,
                    }))
                  }
                  className="rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {getEventTypeLabel(type)}
                    </option>
                  ))}
                </select>
                <input
                  type="datetime-local"
                  value={eventDraft.eventDate}
                  onChange={(event) =>
                    setEventDraft((current) => ({ ...current, eventDate: event.target.value }))
                  }
                  className="rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
                />
                <input
                  value={eventDraft.venue}
                  onChange={(event) =>
                    setEventDraft((current) => ({ ...current, venue: event.target.value }))
                  }
                  placeholder="Venue"
                  className="rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
                />
                <select
                  value={eventDraft.status}
                  onChange={(event) =>
                    setEventDraft((current) => ({
                      ...current,
                      status: event.target.value as DemoEventStatus,
                    }))
                  }
                  className="rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
                >
                  {EVENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={eventDraft.maxAttendees}
                  onChange={(event) =>
                    setEventDraft((current) => ({
                      ...current,
                      maxAttendees: Number(event.target.value) || 1,
                    }))
                  }
                  placeholder="Max attendees"
                  className="rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
                />
                <textarea
                  value={eventDraft.description}
                  onChange={(event) =>
                    setEventDraft((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Event description"
                  className="min-h-28 rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none md:col-span-2 xl:col-span-3"
                />
                <button
                  type="submit"
                  className="w-fit rounded-xl bg-[#111827] px-4 py-2 text-sm font-semibold text-white"
                >
                  {eventPanelMode === 'edit' ? 'Save Event' : 'Create Event'}
                </button>
              </form>
            ) : null}

            <SurfaceCard
              title="All Events"
              description="Source-shaped event table with local editing and filtering"
              badge={`Showing ${filteredEvents.length} of ${state.events.length}`}
            >
              <div className="space-y-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
                  <input
                    value={eventSearch}
                    onChange={(event) => setEventSearch(event.target.value)}
                    placeholder="Search events by name, description, or venue..."
                    className="w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none"
                  />
                  <select
                    value={eventTypeFilter}
                    onChange={(event) =>
                      setEventTypeFilter(event.target.value as DemoEventType | 'all')
                    }
                    className="rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All Types</option>
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {getEventTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={eventStatusFilter}
                    onChange={(event) =>
                      setEventStatusFilter(event.target.value as DemoEventStatus | 'all')
                    }
                    className="rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All Statuses</option>
                    {EVENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <select
                    value={eventSort}
                    onChange={(event) =>
                      setEventSort(
                        event.target.value as 'date-asc' | 'date-desc' | 'name-asc' | 'created-desc'
                      )
                    }
                    className="rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none"
                  >
                    <option value="date-asc">Date (Earliest)</option>
                    <option value="date-desc">Date (Latest)</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="created-desc">Recently Added</option>
                  </select>
                </div>

                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="grid gap-4 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-4 lg:grid-cols-[minmax(0,1.4fr)_200px_160px_220px]"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-[#111827]">{event.name}</p>
                        {new Date(event.eventDate) > new Date() ? (
                          <span className="rounded-full border border-[#d1d5db] px-2.5 py-1 text-xs text-[#4b5563]">
                            Upcoming
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-[#64748b]">{event.description}</p>
                    </div>
                    <div className="text-sm text-[#475569]">
                      <p>{formatDate(event.eventDate)}</p>
                      <p>{formatTime(event.eventDate)}</p>
                    </div>
                    <div className="text-sm text-[#475569]">
                      <p>{getEventTypeLabel(event.eventType)}</p>
                      <p>{event.status}</p>
                      <p>
                        {event.guestCount}/{event.maxAttendees} guests
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-2 text-sm lg:justify-end">
                      <span className="text-[#64748b]">{event.venue}</span>
                      <button
                        type="button"
                        onClick={() => openEditEvent(event)}
                        className="rounded-xl border border-[#d1d5db] px-3 py-2 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteEvent(event.id)}
                        className="rounded-xl border border-[#fecaca] px-3 py-2 text-sm font-medium text-[#b91c1c]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>
        ) : null}

        {activeTool === 'events-management' && activeEventsTab === 'pipeline' ? (
          <div className="space-y-6">
            <HeaderBlock
              title="Relationship Pipeline"
              description="Nurture high-value contacts into strategic partnerships"
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Active Contacts" value={String(state.pipeline.length)} detail="In relationship pipeline" />
              <MetricCard label="Due This Week" value={String(pipelineDueThisWeek)} detail="Scheduled follow-ups" />
              <MetricCard label="Overdue" value={String(pipelineOverdue)} detail="Need immediate attention" />
              <MetricCard
                label="Maintaining"
                value={String(pipelineCounts['Maintaining the Relationship'] ?? 0)}
                detail="Most mature relationships"
              />
            </div>

            <SurfaceCard
              title="Active Pipeline"
              description="Editable local version of the relationship pipeline table"
              badge={`Showing ${filteredPipeline.length} of ${state.pipeline.length}`}
            >
              <div className="space-y-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
                  <input
                    value={pipelineSearch}
                    onChange={(event) => setPipelineSearch(event.target.value)}
                    placeholder="Search by name, company, or next action..."
                    className="w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none"
                  />
                  <select
                    value={pipelineStageFilter}
                    onChange={(event) =>
                      setPipelineStageFilter(event.target.value as DemoPipelineStage | 'all')
                    }
                    className="rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All Stages</option>
                    {PIPELINE_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                  <select
                    value={pipelineSort}
                    onChange={(event) =>
                      setPipelineSort(
                        event.target.value as
                          | 'next-action-asc'
                          | 'name-asc'
                          | 'stage-asc'
                          | 'last-action-desc'
                      )
                    }
                    className="rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none"
                  >
                    <option value="next-action-asc">Next Action Date</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="stage-asc">Stage</option>
                    <option value="last-action-desc">Recent Last Action</option>
                  </select>
                </div>

                {filteredPipeline.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid gap-4 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-4 lg:grid-cols-[minmax(0,1fr)_220px_minmax(0,1.1fr)_minmax(0,1fr)_220px]"
                  >
                    <div>
                      <p className="font-semibold text-[#111827]">
                        {entry.contact?.name ?? 'Contact missing'}
                      </p>
                      <p className="text-sm text-[#64748b]">
                        {entry.contact?.company ?? 'Unassigned company'}
                      </p>
                      <p className="mt-1 text-xs text-[#94a3b8]">
                        Last action: {formatDate(entry.lastActionDate)}
                      </p>
                    </div>

                    <div>
                      <select
                        value={entry.stage}
                        onChange={(event) =>
                          updatePipelineEntry(entry.id, {
                            stage: event.target.value as DemoPipelineStage,
                          })
                        }
                        className="rounded-xl border border-[#d1d5db] px-3 py-2 text-sm outline-none"
                      >
                        {PIPELINE_STAGES.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      value={entry.notes}
                      onChange={(event) =>
                        updatePipelineEntry(entry.id, {
                          notes: event.target.value,
                        })
                      }
                      className="min-h-24 rounded-xl border border-[#d1d5db] px-3 py-2 text-sm outline-none"
                    />

                    <input
                      value={entry.nextAction}
                      onChange={(event) =>
                        updatePipelineEntry(entry.id, {
                          nextAction: event.target.value,
                        })
                      }
                      className="rounded-xl border border-[#d1d5db] px-3 py-2 text-sm outline-none"
                    />

                    <div className="grid gap-3">
                      <label className="block">
                        <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#64748b]">
                          Next Action Date
                        </span>
                        <input
                          type="date"
                          value={entry.nextActionDate}
                          onChange={(event) =>
                            updatePipelineEntry(entry.id, {
                              nextActionDate: event.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-xl border border-[#d1d5db] px-3 py-2 text-sm outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#64748b]">
                          Last Action Date
                        </span>
                        <input
                          type="date"
                          value={entry.lastActionDate}
                          onChange={(event) =>
                            updatePipelineEntry(entry.id, {
                              lastActionDate: event.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-xl border border-[#d1d5db] px-3 py-2 text-sm outline-none"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>
        ) : null}

        {activeTool === 'contacts' ? (
          <div className="space-y-6">
            <HeaderBlock
              title="Contacts"
              description="Standalone contact index from the original command center"
            />
            <SurfaceCard
              title="Network Snapshot"
              description="Shared rolodex across the broader internal tool"
              badge={`${state.contacts.length} contacts`}
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Guests" value={String(state.contacts.filter((contact) => contact.type === 'guest' || contact.type === 'target_guest').length)} detail="Event-oriented contacts" />
                <MetricCard label="VIPs" value={String(vipContacts.length)} detail="Priority relationship profiles" />
                <MetricCard label="Hosts" value={String(state.contacts.filter((contact) => contact.type === 'host').length)} detail="Repeat conveners and connectors" />
                <MetricCard label="Think Tank" value={String(state.contacts.filter((contact) => contact.isInThinkTank).length)} detail="Current peer-group members" />
              </div>
            </SurfaceCard>
          </div>
        ) : null}

        {activeTool === 'vip-management' ? (
          <div className="space-y-6">
            <HeaderBlock
              title="VIP Management"
              description="Manage strategic relationships with key contacts"
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <MetricCard label="Total VIPs" value={String(vipStats.total)} detail="Tracked strategic relationships" />
              <MetricCard label="Give" value={String(vipStats.activeGive)} detail="Active value-add initiatives" />
              <MetricCard label="Ask" value={String(vipStats.activeAsk)} detail="Active requests or strategic asks" />
              <MetricCard label="Activities" value={String(vipStats.totalActivities)} detail="Logged interactions" />
              <MetricCard label="Recent" value={String(vipStats.recentInteractions)} detail="Interactions in the last 21 days" />
            </div>

            {selectedVipContact && selectedVipProfile ? (
              <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                <SurfaceCard
                  title="VIP Directory"
                  description="Local view of VIP contacts derived from the source tool shape"
                  badge={`${vipContacts.length} VIPs`}
                >
                  <div className="space-y-3">
                    {vipContacts.map((contact) => {
                      const profile = state.vipProfiles.find(
                        (vipProfile) => vipProfile.contactId === contact.id
                      );
                      const isActive = selectedVipContact.id === contact.id;

                      return (
                        <button
                          key={contact.id}
                          type="button"
                          onClick={() => {
                            setSelectedVipContactId(contact.id);
                            setActiveVipTab('dashboard');
                          }}
                          className={`w-full rounded-xl border px-4 py-4 text-left transition ${
                            isActive
                              ? 'border-[#c7d2fe] bg-[#eef2ff]'
                              : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-[#111827]">{contact.name}</p>
                              <p className="text-sm text-[#64748b]">
                                {contact.role} · {contact.company}
                              </p>
                            </div>
                            <span className="rounded-full bg-[#e0e7ff] px-2.5 py-1 text-xs font-semibold text-[#4338ca]">
                              {profile?.priority ?? 'Medium'}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-[#475569]">
                            {profile?.relationshipSummary ?? contact.generalNotes}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </SurfaceCard>

                <SurfaceCard
                  title={selectedVipContact.name}
                  description={`${selectedVipContact.role} at ${selectedVipContact.company}`}
                  badge={`${selectedVipProfile.priority} priority`}
                >
                  <div className="flex flex-wrap gap-2 border-b border-[#e5e7eb] pb-4">
                    {(['dashboard', 'profile', 'give', 'ask', 'activities'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveVipTab(tab)}
                        className={`rounded-full px-3 py-2 text-sm font-medium ${
                          activeVipTab === tab
                            ? 'bg-[#111827] text-white'
                            : 'bg-[#f3f4f6] text-[#4b5563]'
                        }`}
                      >
                        {toTitleCase(tab)}
                      </button>
                    ))}
                  </div>

                  {activeVipTab === 'dashboard' ? (
                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                      <DetailField label="Objective" value={selectedVipProfile.objective} />
                      <DetailField label="Next Step" value={selectedVipProfile.nextStep} />
                      <DetailField
                        label="Our Goals"
                        value={
                          selectedVipContact.strategicGoals.length > 0
                            ? selectedVipContact.strategicGoals.join(', ')
                            : 'No strategic goals captured yet.'
                        }
                      />
                      <DetailField
                        label="Their Goals"
                        value={
                          selectedVipContact.goalsAspirations.length > 0
                            ? selectedVipContact.goalsAspirations.join(', ')
                            : 'No personal goals captured yet.'
                        }
                      />
                      <DetailField
                        label="Current Projects"
                        value={
                          selectedVipContact.currentProjects.length > 0
                            ? selectedVipContact.currentProjects
                                .map((project) => sanitizeDemoString(project))
                                .join(', ')
                            : 'No active projects documented yet.'
                        }
                      />
                      <DetailField
                        label="Relationship Summary"
                        value={selectedVipProfile.relationshipSummary}
                      />
                    </div>
                  ) : null}

                  {activeVipTab === 'profile' ? (
                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                      <DetailField label="Email" value={selectedVipContact.email} />
                      <DetailField label="Area" value={selectedVipContact.area ? toTitleCase(selectedVipContact.area) : 'None'} />
                      <DetailField
                        label="Tags"
                        value={
                          selectedVipProfile.tags.length > 0
                            ? selectedVipProfile.tags.join(', ')
                            : 'No tags assigned yet.'
                        }
                      />
                      <DetailField
                        label="General Notes"
                        value={selectedVipContact.generalNotes || 'No notes captured yet.'}
                      />
                    </div>
                  ) : null}

                  {activeVipTab === 'give' ? (
                    <div className="mt-5 space-y-3">
                      {selectedVipProfile.initiatives
                        .filter((initiative) => initiative.type === 'give')
                        .map((initiative) => (
                          <div
                            key={initiative.id}
                            className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-[#111827]">{initiative.title}</p>
                              <span className="rounded-full bg-[#dcfce7] px-2.5 py-1 text-xs font-medium text-[#15803d]">
                                {toTitleCase(initiative.status)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-[#475569]">{initiative.detail}</p>
                          </div>
                        ))}
                    </div>
                  ) : null}

                  {activeVipTab === 'ask' ? (
                    <div className="mt-5 space-y-3">
                      {selectedVipProfile.initiatives
                        .filter((initiative) => initiative.type === 'ask')
                        .map((initiative) => (
                          <div
                            key={initiative.id}
                            className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-[#111827]">{initiative.title}</p>
                              <span className="rounded-full bg-[#ede9fe] px-2.5 py-1 text-xs font-medium text-[#6d28d9]">
                                {toTitleCase(initiative.status)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-[#475569]">{initiative.detail}</p>
                          </div>
                        ))}
                    </div>
                  ) : null}

                  {activeVipTab === 'activities' ? (
                    <div className="mt-5 space-y-3">
                      {selectedVipProfile.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-[#111827]">{activity.summary}</p>
                            <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#64748b]">
                              {toTitleCase(activity.type)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-[#475569]">
                            {formatDate(activity.date)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </SurfaceCard>
              </div>
            ) : (
              <SurfaceCard
                title="VIP Directory"
                description="No VIP data available in the local demo yet."
              >
                <p className="text-sm text-[#64748b]">Add or promote a contact to VIP to populate this workspace.</p>
              </SurfaceCard>
            )}
          </div>
        ) : null}

        {activeTool === 'cto-club' ? (
          <div className="space-y-6">
            <HeaderBlock
              title="C-Suite Think Tank"
              description="Manage members and recruitment pipeline"
            />
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                label="Current Members"
                value={String(state.ctoLeads.filter((lead) => lead.status === 'Current Member').length)}
                detail="Active members"
              />
              <MetricCard
                label="In Pipeline"
                value={String(state.ctoLeads.filter((lead) => lead.status === 'In Pipeline').length)}
                detail="Active recruitment"
              />
              <MetricCard
                label="Potential"
                value={String(state.ctoLeads.filter((lead) => lead.status === 'Potential').length)}
                detail="Awaiting qualification"
              />
            </div>
            <SurfaceCard
              title="Think Tank Pipeline"
              description="Potential members and current relationship status"
              badge={`${state.ctoLeads.length} tracked`}
            >
              <div className="space-y-3">
                {state.ctoLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="grid gap-4 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-4 lg:grid-cols-[minmax(0,1fr)_160px_minmax(0,1fr)_minmax(0,1fr)]"
                  >
                    <div>
                      <p className="font-semibold text-[#111827]">{lead.name}</p>
                      <p className="text-sm text-[#64748b]">{lead.company}</p>
                    </div>
                    <span className="w-fit rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4338ca]">
                      {lead.status}
                    </span>
                    <p className="text-sm text-[#475569]">{lead.introSource}</p>
                    <p className="text-sm text-[#111827]">{lead.nextAction}</p>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>
        ) : null}

        {activeTool === 'bizdev-pipeline' ? (
          <div className="space-y-6">
            <HeaderBlock
              title="BizDev Pipeline"
              description="Manage business development projects and tasks"
            />

            <div className="flex flex-wrap gap-2">
              {BIZDEV_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveBizdevTab(tab.id);
                    setSelectedBizdevProjectId('');
                  }}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                    activeBizdevTab === tab.id
                      ? 'bg-[#111827] text-white'
                      : 'border border-[#d1d5db] bg-white text-[#4b5563] hover:bg-[#f9fafb]'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 text-xs opacity-75">
                    {tab.id === 'bizdev' ? bizdevCounts.bizdev : bizdevCounts.collaboration}
                  </span>
                </button>
              ))}
            </div>

            <SurfaceCard
              title={activeBizdevTab === 'bizdev' ? 'BizDev Projects' : 'Collaboration Projects'}
              description={
                activeBizdevTab === 'bizdev'
                  ? 'Manage business development projects and tasks'
                  : 'Internal collaboration initiatives with expandable task boards'
              }
              badge={`Showing ${bizdevProjects.length} of ${bizdevProjectPool.length}`}
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-4 xl:flex-row">
                  <input
                    value={bizdevSearch}
                    onChange={(event) => setBizdevSearch(event.target.value)}
                    placeholder="Search projects by name or description..."
                    className="w-full rounded-md border border-[#d1d5db] bg-white px-4 py-2.5 text-sm outline-none xl:max-w-sm"
                  />

                  <div className="flex flex-1 flex-wrap gap-3">
                    <select
                      value={bizdevStatusFilter}
                      onChange={(event) =>
                        setBizdevStatusFilter(event.target.value as ProjectStatus | 'all')
                      }
                      className="min-w-[170px] rounded-md border border-[#d1d5db] bg-white px-3 py-2.5 text-sm outline-none"
                    >
                      <option value="all">All Statuses</option>
                      {PROJECT_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {toTitleCase(status)}
                        </option>
                      ))}
                    </select>

                    <select
                      value={bizdevPriorityFilter}
                      onChange={(event) =>
                        setBizdevPriorityFilter(event.target.value as ProjectPriority | 'all')
                      }
                      className="min-w-[170px] rounded-md border border-[#d1d5db] bg-white px-3 py-2.5 text-sm outline-none"
                    >
                      <option value="all">All Priorities</option>
                      {PRIORITY_OPTIONS.map((priority) => (
                        <option key={priority} value={priority}>
                          {toTitleCase(priority)}
                        </option>
                      ))}
                    </select>

                    <select
                      value={bizdevSort}
                      onChange={(event) =>
                        setBizdevSort(
                          event.target.value as
                            | 'rating-desc'
                            | 'rating-asc'
                            | 'created-desc'
                            | 'name-asc'
                            | 'priority-desc'
                        )
                      }
                      className="min-w-[180px] rounded-md border border-[#d1d5db] bg-white px-3 py-2.5 text-sm outline-none"
                    >
                      <option value="rating-desc">Highest Rated</option>
                      <option value="rating-asc">Lowest Rated</option>
                      <option value="created-desc">Newest First</option>
                      <option value="name-asc">Name A-Z</option>
                      <option value="priority-desc">High Priority First</option>
                    </select>
                  </div>
                </div>

                <p className="text-sm text-[#6b7280]">
                  {activeBizdevTab === 'bizdev'
                    ? 'This mirrors the source BizDev overview table with inline project controls.'
                    : 'Collaboration rows expand into the project task board, matching the source workflow.'}
                </p>

                <div className="overflow-x-auto rounded-lg border border-[#e5e7eb] bg-white">
                  <div className={activeBizdevTab === 'bizdev' ? 'min-w-[860px]' : 'min-w-[760px]'}>
                    <div
                      className={`grid gap-4 border-b border-[#e5e7eb] px-4 py-3 text-sm font-semibold text-[#111827] ${
                        activeBizdevTab === 'bizdev'
                          ? 'grid-cols-[110px_minmax(0,1.8fr)_120px_120px_120px]'
                          : 'grid-cols-[minmax(0,1.9fr)_120px_120px_120px]'
                      }`}
                    >
                      {activeBizdevTab === 'bizdev' ? <span>Rating</span> : null}
                      <span>Project</span>
                      <span>Priority</span>
                      <span>Status</span>
                      <span>Created</span>
                    </div>

                    {bizdevProjects.length === 0 ? (
                      <div className="px-4 py-10 text-center text-sm text-[#6b7280]">
                        No projects match the current filters.
                      </div>
                    ) : (
                      bizdevProjects.map((project) => {
                        const isExpanded =
                          activeBizdevTab === 'collaboration' &&
                          selectedBizdevProjectId === project.id;
                        const projectTasks = state.bizdev.tasks.filter(
                          (task) => task.projectId === project.id
                        );

                        return (
                          <div key={project.id} className="border-b border-[#eef2f7] last:border-b-0">
                            <div
                              className={`grid gap-4 px-4 py-4 ${
                                activeBizdevTab === 'bizdev'
                                  ? 'grid-cols-[110px_minmax(0,1.8fr)_120px_120px_120px]'
                                  : 'grid-cols-[minmax(0,1.9fr)_120px_120px_120px]'
                              } ${isExpanded ? 'bg-[#f8fafc]' : 'bg-white'} ${
                                activeBizdevTab === 'collaboration' ? 'cursor-pointer hover:bg-[#f9fafb]' : ''
                              }`}
                              onClick={() => {
                                if (activeBizdevTab === 'collaboration') {
                                  setSelectedBizdevProjectId((current) =>
                                    current === project.id ? '' : project.id
                                  );
                                  setShowBizdevTaskForm(false);
                                }
                              }}
                            >
                              {activeBizdevTab === 'bizdev' ? (
                                <div className="font-semibold text-[#2563eb]">
                                  {computeProjectRating(project).toFixed(2)}
                                </div>
                              ) : null}

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  {activeBizdevTab === 'collaboration' ? (
                                    <span className="text-sm text-[#64748b]">
                                      {isExpanded ? '▾' : '▸'}
                                    </span>
                                  ) : null}
                                  <p className="truncate font-medium text-[#111827]">
                                    {project.name}
                                  </p>
                                </div>
                                {project.description ? (
                                  <p className="mt-1 text-sm text-[#6b7280]">{project.description}</p>
                                ) : null}
                              </div>

                              <div onClick={(event) => event.stopPropagation()}>
                                <select
                                  value={project.priority}
                                  onChange={(event) =>
                                    updateBizdevProject(project.id, {
                                      priority: event.target.value as ProjectPriority,
                                    })
                                  }
                                  className="w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm outline-none"
                                >
                                  {PRIORITY_OPTIONS.map((priority) => (
                                    <option key={priority} value={priority}>
                                      {toTitleCase(priority)}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div onClick={(event) => event.stopPropagation()}>
                                <select
                                  value={project.status}
                                  onChange={(event) =>
                                    updateBizdevProject(project.id, {
                                      status: event.target.value as ProjectStatus,
                                    })
                                  }
                                  className="w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm outline-none"
                                >
                                  {PROJECT_STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                      {toTitleCase(status)}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="text-sm text-[#6b7280]">
                                {formatDate(project.createdAt, {
                                  month: '2-digit',
                                  day: '2-digit',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>

                            {isExpanded ? (
                              <div className="border-t border-[#e5e7eb] bg-[#f8fafc] p-5">
                                <div className="space-y-5">
                                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div>
                                      <h3 className="text-base font-semibold text-[#111827]">
                                        Project Tasks - Kanban Board
                                      </h3>
                                      <p className="mt-1 text-sm text-[#6b7280]">
                                        {project.name} task management
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setSelectedBizdevProjectId(project.id);
                                        setShowBizdevTaskForm((current) => !current);
                                      }}
                                      className="w-fit rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
                                    >
                                      {showBizdevTaskForm && selectedBizdevProjectId === project.id
                                        ? 'Close Form'
                                        : '+ Add Task'}
                                    </button>
                                  </div>

                                  {showBizdevTaskForm && selectedBizdevProjectId === project.id ? (
                                    <form
                                      onSubmit={createBizdevTask}
                                      className="grid gap-3 rounded-lg border border-[#e5e7eb] bg-white p-4"
                                    >
                                      <input
                                        value={bizdevTaskDraft.text}
                                        onChange={(event) =>
                                          setBizdevTaskDraft((current) => ({
                                            ...current,
                                            text: event.target.value,
                                          }))
                                        }
                                        placeholder="Task description"
                                        className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm outline-none"
                                      />
                                      <select
                                        value={bizdevTaskDraft.status}
                                        onChange={(event) =>
                                          setBizdevTaskDraft((current) => ({
                                            ...current,
                                            status: event.target.value as TaskStatus,
                                          }))
                                        }
                                        className="rounded-md border border-[#d1d5db] px-4 py-2.5 text-sm outline-none"
                                      >
                                        {TASK_STATUS_OPTIONS.map((status) => (
                                          <option key={status} value={status}>
                                            {toTitleCase(status)}
                                          </option>
                                        ))}
                                      </select>
                                      <button
                                        type="submit"
                                        className="w-fit rounded-md bg-[#111827] px-4 py-2 text-sm font-semibold text-white"
                                      >
                                        Create Task
                                      </button>
                                    </form>
                                  ) : null}

                                  <div className="grid gap-4 lg:grid-cols-4">
                                    {TASK_STATUS_OPTIONS.map((status) => {
                                      const tasks = projectTasks.filter(
                                        (task) => task.status === status
                                      );

                                      return (
                                        <div
                                          key={status}
                                          onDragOver={(event) => event.preventDefault()}
                                          onDrop={(event) => {
                                            setSelectedBizdevProjectId(project.id);
                                            handleBizdevDrop(event, status);
                                          }}
                                          className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm"
                                        >
                                          <div
                                            className={`border-b px-4 py-3 ${getTaskColumnHeaderClasses(
                                              status
                                            )}`}
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="text-sm font-semibold text-[#111827]">
                                                {toTitleCase(status)}
                                              </span>
                                              <span className="text-sm text-[#64748b]">
                                                {tasks.length}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="space-y-3 p-3">
                                            {tasks.length === 0 ? (
                                              <div className="rounded-md border border-dashed border-[#d1d5db] px-3 py-6 text-center text-xs text-[#94a3b8]">
                                                No {status} tasks
                                              </div>
                                            ) : (
                                              tasks.map((task) => (
                                                <div
                                                  key={task.id}
                                                  draggable
                                                  onDragStart={(event) => {
                                                    event.dataTransfer.setData(
                                                      'text/plain',
                                                      task.id
                                                    );
                                                    setDraggedTaskId(task.id);
                                                  }}
                                                  onDragEnd={() => setDraggedTaskId(null)}
                                                  className={`rounded-md border border-[#e5e7eb] bg-[#f8fafc] p-3 shadow-sm ${
                                                    draggedTaskId === task.id ? 'opacity-60' : ''
                                                  }`}
                                                >
                                                  <p className="text-sm text-[#111827]">
                                                    {task.text}
                                                  </p>
                                                  <select
                                                    value={task.status}
                                                    onChange={(event) =>
                                                      updateBizdevTask(task.id, {
                                                        status: event.target.value as TaskStatus,
                                                        completed:
                                                          event.target.value === 'done',
                                                      })
                                                    }
                                                    className="mt-3 w-full rounded-md border border-[#d1d5db] px-3 py-2 text-xs outline-none"
                                                  >
                                                    {TASK_STATUS_OPTIONS.map((option) => (
                                                      <option key={option} value={option}>
                                                        {toTitleCase(option)}
                                                      </option>
                                                    ))}
                                                  </select>
                                                </div>
                                              ))
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </SurfaceCard>
          </div>
        ) : null}
        </div>
      </section>

      {contactPanelMode ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#6366f1]">
                  {contactPanelMode === 'create'
                    ? 'Add Contact'
                    : contactPanelMode === 'edit'
                      ? 'Edit Contact'
                      : 'Contact Details'}
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-[#111827]">
                  {contactPanelMode === 'create'
                    ? 'Create a new sanitized contact'
                    : contactDraft.name || 'Contact profile'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setContactPanelMode(null)}
                className="rounded-xl border border-[#d1d5db] px-3 py-2 text-sm"
              >
                Close
              </button>
            </div>

            {contactPanelMode === 'view' && selectedContact ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <DetailField label="Name" value={selectedContact.name} />
                <DetailField label="Role" value={selectedContact.role} />
                <DetailField label="Email" value={selectedContact.email} />
                <DetailField label="Company" value={selectedContact.company} />
                <DetailField label="Type" value={getContactTypeLabel(selectedContact.type)} />
                <DetailField
                  label="Area"
                  value={selectedContact.area ? toTitleCase(selectedContact.area) : 'None'}
                />
                <DetailField
                  label="Additional Emails"
                  value={
                    selectedContact.additionalEmails.length > 0
                      ? selectedContact.additionalEmails.join(', ')
                      : 'None'
                  }
                />
                <DetailField
                  label="Think Tank"
                  value={selectedContact.isInThinkTank ? 'Member' : 'No'}
                />
                <DetailField
                  label="Projects"
                  value={
                    selectedContact.currentProjects.length > 0
                      ? selectedContact.currentProjects.join(', ')
                      : 'None listed'
                  }
                />
                <DetailField
                  label="Goals"
                  value={
                    selectedContact.goalsAspirations.length > 0
                      ? selectedContact.goalsAspirations.join(', ')
                      : 'None listed'
                  }
                />
                <div className="md:col-span-2">
                  <DetailField
                    label="Notes"
                    value={selectedContact.generalNotes || 'No notes captured.'}
                  />
                </div>
              </div>
            ) : (
              <form onSubmit={saveContact} className="mt-6 grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Name"
                  value={contactDraft.name}
                  onChange={(value) =>
                    setContactDraft((current) => ({ ...current, name: value }))
                  }
                />
                <FormInput
                  label="Role"
                  value={contactDraft.role}
                  onChange={(value) =>
                    setContactDraft((current) => ({ ...current, role: value }))
                  }
                />
                <FormInput
                  label="Email"
                  value={contactDraft.email}
                  onChange={(value) =>
                    setContactDraft((current) => ({ ...current, email: value }))
                  }
                />
                <FormInput
                  label="Company"
                  value={contactDraft.company}
                  onChange={(value) =>
                    setContactDraft((current) => ({ ...current, company: value }))
                  }
                />

                <FormSelect
                  label="Type"
                  value={contactDraft.type}
                  options={[
                    'guest',
                    'target_guest',
                    'host',
                    'established_connection',
                    'vip',
                    'potential_cto_club_member',
                    'cto_club_member',
                    'partner',
                    'advisor',
                    'founder',
                  ]}
                  onChange={(value) =>
                    setContactDraft((current) => ({
                      ...current,
                      type: value as DemoContactType,
                    }))
                  }
                />

                <FormSelect
                  label="Area"
                  value={contactDraft.area ?? ''}
                  options={[
                    '',
                    'engineering',
                    'founders',
                    'product',
                    'events',
                    'partnerships',
                    'community',
                    'research',
                  ]}
                  onChange={(value) =>
                    setContactDraft((current) => ({
                      ...current,
                      area: value ? (value as DemoContactArea) : null,
                    }))
                  }
                />

                <div className="md:col-span-2">
                  <FormInput
                    label="LinkedIn URL"
                    value={contactDraft.linkedinUrl ?? ''}
                    onChange={(value) =>
                      setContactDraft((current) => ({ ...current, linkedinUrl: value }))
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <FormTextarea
                    label="General Notes"
                    value={contactDraft.generalNotes}
                    onChange={(value) =>
                      setContactDraft((current) => ({ ...current, generalNotes: value }))
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="w-fit rounded-xl bg-[#111827] px-4 py-2 text-sm font-semibold text-white"
                >
                  {contactPanelMode === 'create' ? 'Create Contact' : 'Save Changes'}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function HeaderBlock({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-[#111827]">{title}</h1>
      <p className="mt-2 text-base text-[#64748b]">{description}</p>
    </div>
  );
}

function SurfaceCard({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#d9dee8] bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[#111827]">{title}</h3>
          <p className="mt-1 text-sm text-[#64748b]">{description}</p>
        </div>
        {badge ? (
          <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-xs font-medium text-[#111827]">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-[#d9dee8] bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-[#64748b]">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[#111827]">{value}</p>
      <p className="mt-1 text-sm text-[#94a3b8]">{detail}</p>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#64748b]">{label}</p>
      <p className="mt-2 text-base text-[#111827]">{sanitizeDemoString(value)}</p>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#374151]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
      />
    </label>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#374151]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-28 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
      />
    </label>
  );
}

function FormSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#374151]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
      >
        {options.map((option) => (
          <option key={option || 'none'} value={option}>
            {option
              ? label === 'Type'
                ? getContactTypeLabel(option as DemoContactType)
                : toTitleCase(option)
              : 'None'}
          </option>
        ))}
      </select>
    </label>
  );
}

function getContactTypeLabel(type: DemoContactType) {
  switch (type) {
    case 'target_guest':
      return 'Target Guest';
    case 'established_connection':
      return 'Established Connection';
    case 'potential_cto_club_member':
      return 'Potential Think Tank Member';
    case 'cto_club_member':
      return 'Think Tank Member';
    default:
      return toTitleCase(type);
  }
}

function getEventTypeLabel(type: DemoEventType) {
  switch (type) {
    case 'cto_club':
      return 'C-Suite Think Tank';
    default:
      return toTitleCase(type);
  }
}

function toTitleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getPriorityRank(priority: ProjectPriority) {
  switch (priority) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 0;
  }
}

function getPriorityClasses(priority: ProjectPriority) {
  switch (priority) {
    case 'high':
      return 'bg-[#fee2e2] text-[#b91c1c]';
    case 'medium':
      return 'bg-[#fef3c7] text-[#b45309]';
    case 'low':
      return 'bg-[#dcfce7] text-[#15803d]';
    default:
      return 'bg-[#f3f4f6] text-[#4b5563]';
  }
}

function getStatusClasses(status: ProjectStatus) {
  switch (status) {
    case 'potential':
      return 'bg-[#ede9fe] text-[#6d28d9]';
    case 'active':
      return 'bg-[#dbeafe] text-[#1d4ed8]';
    case 'on-hold':
      return 'bg-[#ffedd5] text-[#c2410c]';
    case 'completed':
      return 'bg-[#dcfce7] text-[#15803d]';
    case 'archived':
      return 'bg-[#f3f4f6] text-[#4b5563]';
    default:
      return 'bg-[#f3f4f6] text-[#4b5563]';
  }
}

function getTaskColumnHeaderClasses(status: TaskStatus) {
  switch (status) {
    case 'todo':
      return 'border-[#cbd5e1] bg-[#f8fafc]';
    case 'doing':
      return 'border-[#93c5fd] bg-[#eff6ff]';
    case 'waiting':
      return 'border-[#fcd34d] bg-[#fffbeb]';
    case 'done':
      return 'border-[#86efac] bg-[#f0fdf4]';
    default:
      return 'border-[#e5e7eb] bg-white';
  }
}
