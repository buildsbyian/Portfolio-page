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
  DemoEvent,
  DemoPipelineEntry,
  DemoProject,
  DemoTask,
  ProjectPriority,
  ProjectStatus,
  TaskStatus,
} from './types';

const STORAGE_KEY = 'portfolio.command-center.demo.v2';

const TOOL_TABS = [
  { id: 'contacts', label: 'Contacts' },
  { id: 'events-management', label: 'Events Management' },
  { id: 'vip-management', label: 'VIP Management' },
  { id: 'cto-club', label: 'CTO Club' },
  { id: 'bizdev-pipeline', label: 'BizDev Pipeline' },
] as const;

const EVENTS_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'events', label: 'Events' },
  { id: 'pipeline', label: 'Pipeline' },
] as const;

const CONTACT_TYPES = ['all', 'guest', 'vip', 'partner', 'advisor', 'founder'] as const;
const CONTACT_AREAS = ['all', 'events', 'partnerships', 'community', 'research', 'none'] as const;
const CONTACT_SORTS = ['newest', 'oldest', 'name', 'company'] as const;
const PIPELINE_STAGES = [
  'New Contact',
  'Initial Outreach',
  'Connected',
  'Building Relationship',
  'Strategic Partner',
] as const;
const EVENT_STATUSES = ['Draft', 'Invitations Sent', 'In Progress', 'Completed'] as const;
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
type ContactTypeFilter = (typeof CONTACT_TYPES)[number];
type ContactAreaFilter = (typeof CONTACT_AREAS)[number];
type ContactSort = (typeof CONTACT_SORTS)[number];
type ContactPanelMode = 'create' | 'view' | 'edit' | null;

const defaultContactDraft: Omit<DemoContact, 'id'> = {
  name: '',
  role: '',
  email: '',
  company: '',
  type: 'guest',
  area: null,
  linkedinUrl: '',
};

const defaultEventDraft: Omit<DemoEvent, 'id' | 'guestCount'> = {
  name: '',
  eventDate: '',
  status: 'Draft',
  venue: '',
  focus: '',
};

function loadInitialState(): CommandCenterState {
  if (typeof window === 'undefined') {
    return createCommandCenterSeed();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CommandCenterState) : createCommandCenterSeed();
  } catch {
    return createCommandCenterSeed();
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
  const [activeTool, setActiveTool] = useState<ToolTab>('events-management');
  const [activeEventsTab, setActiveEventsTab] = useState<EventsTab>('contacts');
  const [contactSearch, setContactSearch] = useState('');
  const deferredContactSearch = useDeferredValue(contactSearch);
  const [contactTypeFilter, setContactTypeFilter] = useState<ContactTypeFilter>('all');
  const [contactAreaFilter, setContactAreaFilter] = useState<ContactAreaFilter>('all');
  const [contactSort, setContactSort] = useState<ContactSort>('newest');
  const [contactPanelMode, setContactPanelMode] = useState<ContactPanelMode>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [contactDraft, setContactDraft] = useState<Omit<DemoContact, 'id'>>(defaultContactDraft);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventDraft, setEventDraft] = useState(defaultEventDraft);
  const [bizdevSearch, setBizdevSearch] = useState('');
  const deferredBizdevSearch = useDeferredValue(bizdevSearch);
  const [selectedBizdevProjectId, setSelectedBizdevProjectId] = useState<string>('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showBizdevTaskForm, setShowBizdevTaskForm] = useState(false);
  const [bizdevTaskDraft, setBizdevTaskDraft] = useState({
    text: '',
    status: 'todo' as TaskStatus,
  });
  const importInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const selectedContact =
    state.contacts.find((contact) => contact.id === selectedContactId) ?? null;

  const filteredContacts = state.contacts
    .map((contact, index) => ({ contact, index }))
    .filter(({ contact }) => {
      const query = deferredContactSearch.trim().toLowerCase();
      const matchesSearch =
        !query ||
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.company.toLowerCase().includes(query);

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
        ? right.index - left.index
        : left.index - right.index;
    })
    .map(({ contact }) => contact);

  const pipelineWithContacts = state.pipeline.map((entry) => ({
    ...entry,
    contact: state.contacts.find((contact) => contact.id === entry.contactId) ?? null,
  }));

  const recentEvents = [...state.events].sort(
    (left, right) => new Date(right.eventDate).getTime() - new Date(left.eventDate).getTime()
  );

  const bizdevProjects = state.bizdev.projects
    .filter((project) =>
      project.name.toLowerCase().includes(deferredBizdevSearch.toLowerCase())
    )
    .sort((left, right) => computeProjectRating(right) - computeProjectRating(left));

  const selectedBizdevProject =
    state.bizdev.projects.find((project) => project.id === selectedBizdevProjectId) ??
    bizdevProjects[0] ??
    null;

  const selectedBizdevTasks = selectedBizdevProject
    ? state.bizdev.tasks.filter((task) => task.projectId === selectedBizdevProject.id)
    : [];

  function resetDemo() {
    const freshState = createCommandCenterSeed();
    window.localStorage.removeItem(STORAGE_KEY);

    startTransition(() => {
      setState(freshState);
      setActiveTool('events-management');
      setActiveEventsTab('contacts');
      setContactSearch('');
      setContactTypeFilter('all');
      setContactAreaFilter('all');
      setContactSort('newest');
      setContactPanelMode(null);
      setSelectedContactId(null);
      setShowEventForm(false);
      setSelectedBizdevProjectId('');
      setShowBizdevTaskForm(false);
      setBizdevTaskDraft({ text: '', status: 'todo' });
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
      company: contact.company,
      type: contact.type,
      area: contact.area,
      linkedinUrl: contact.linkedinUrl ?? '',
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
            type: ((cells[4] ?? 'guest').toLowerCase() || 'guest') as DemoContact['type'],
            area: (cells[5] ? (cells[5].toLowerCase() as DemoContact['area']) : null) ?? null,
            linkedinUrl: cells[6] || undefined,
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
      ['name', 'email', 'company', 'role', 'type', 'area', 'linkedinUrl'],
      ...filteredContacts.map((contact) => [
        contact.name,
        contact.email,
        contact.company,
        contact.role,
        contact.type,
        contact.area ?? '',
        contact.linkedinUrl ?? '',
      ]),
    ];

    downloadCsv('sanitized-command-center-contacts.csv', rows);
  }

  function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!eventDraft.name.trim() || !eventDraft.eventDate.trim()) return;

    const newEvent: DemoEvent = {
      id: createId('event'),
      ...eventDraft,
      guestCount: 12,
    };

    startTransition(() => {
      setState((currentState) => ({
        ...currentState,
        events: [newEvent, ...currentState.events],
      }));
      setEventDraft(defaultEventDraft);
      setShowEventForm(false);
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

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#d7dbe7] bg-[#f5f6fb] text-[#111827] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
      <div className="border-b border-[#e3e7f0] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6b7280]">
              Live Demo
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[#111827]">
              Sanitized Command Center Replica
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Browser-local clone of the original internal tool shell. Changes persist only on
              this device.
            </p>
          </div>
          <button
            type="button"
            onClick={resetDemo}
            className="rounded-xl border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#111827] shadow-sm transition hover:bg-[#f9fafb]"
          >
            Reset Demo
          </button>
        </div>
      </div>

      <div className="border-b border-[#e3e7f0] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-3 sm:px-6 lg:px-8">
          {TOOL_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTool(tab.id)}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                activeTool === tab.id
                  ? 'bg-[#e0e7ff] text-[#4338ca]'
                  : 'text-[#6b7280] hover:bg-[#f8fafc] hover:text-[#374151]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTool === 'events-management' ? (
        <div className="border-b border-[#e3e7f0] bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-5 sm:px-6 lg:px-8">
            <span className="text-[30px] font-semibold text-[#334155]">Events Management</span>
            <div className="flex flex-wrap gap-6">
              {EVENTS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveEventsTab(tab.id)}
                  className={`border-b-2 pb-4 text-base transition ${
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTool === 'events-management' && activeEventsTab === 'dashboard' ? (
          <div className="space-y-6">
            <HeaderBlock
              title="Events Management Dashboard"
              description="Manage your events, contacts, and pipeline"
            />

            <div className="grid gap-6 md:grid-cols-3">
              <MetricCard label="Events" value={String(state.events.length)} detail="Total events" />
              <MetricCard label="Contacts" value={String(state.contacts.length)} detail="Total contacts" />
              <MetricCard
                label="Pipeline"
                value={String(state.pipeline.length)}
                detail="Relationship building"
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
                        <p className="text-sm text-[#6b7280]">{event.focus}</p>
                      </div>
                      <div className="text-right text-sm text-[#6b7280]">
                        <p>{formatDate(event.eventDate, { month: 'short', day: 'numeric' })}</p>
                        <p>{event.status}</p>
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
                <div className="space-y-3">
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
              <HeaderBlock title="Contacts" description="Manage your network rolodex" />
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

            <SurfaceCard
              title="All Contacts"
              description="Add, edit, search, and manage all contacts in your network"
              badge={`${filteredContacts.length} total`}
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

                <p className="text-sm text-[#64748b]">
                  Showing {filteredContacts.length} of {state.contacts.length} contacts
                </p>

                <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
                  <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_120px_120px_180px] gap-4 border-b border-[#e5e7eb] px-4 py-3 text-sm font-semibold text-[#111827]">
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
                      className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_120px_120px_180px] gap-4 border-b border-[#eef2f7] px-4 py-4 text-sm last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-[#111827]">{contact.name}</p>
                        <p className="truncate text-sm text-[#64748b]">{contact.role}</p>
                      </div>
                      <p className="truncate text-[#111827]">{contact.email}</p>
                      <p className="truncate text-[#111827]">{contact.company}</p>
                      <span className="w-fit rounded-full border border-[#dbe1eb] px-3 py-1 text-xs font-medium text-[#111827]">
                        {toTitleCase(contact.type)}
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
                onClick={() => setShowEventForm((current) => !current)}
                className="rounded-xl bg-[#111827] px-4 py-2 text-sm font-semibold text-white shadow-sm"
              >
                {showEventForm ? 'Close Form' : '+ Add Event'}
              </button>
            </div>

            {showEventForm ? (
              <form
                onSubmit={createEvent}
                className="grid gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-4 md:grid-cols-2"
              >
                <input
                  value={eventDraft.name}
                  onChange={(event) =>
                    setEventDraft((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Event name"
                  className="rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
                />
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
                      status: event.target.value as DemoEvent['status'],
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
                <textarea
                  value={eventDraft.focus}
                  onChange={(event) =>
                    setEventDraft((current) => ({ ...current, focus: event.target.value }))
                  }
                  placeholder="Focus or event thesis"
                  className="min-h-28 rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none md:col-span-2"
                />
                <button
                  type="submit"
                  className="w-fit rounded-xl bg-[#111827] px-4 py-2 text-sm font-semibold text-white"
                >
                  Create Event
                </button>
              </form>
            ) : null}

            <SurfaceCard
              title="All Events"
              description="Create, track, and manage all your events and guest lists"
              badge={`${state.events.length} total`}
            >
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="grid gap-4 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-4 md:grid-cols-[minmax(0,1.4fr)_180px_160px_100px]"
                  >
                    <div>
                      <p className="text-base font-semibold text-[#111827]">{event.name}</p>
                      <p className="mt-1 text-sm text-[#64748b]">{event.focus}</p>
                    </div>
                    <div className="text-sm text-[#475569]">
                      <p>{formatDate(event.eventDate)}</p>
                      <p>{event.venue}</p>
                    </div>
                    <div className="text-sm text-[#475569]">
                      <p>{event.status}</p>
                      <p>{event.guestCount} guests</p>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-[#d1d5db] px-3 py-2 text-sm font-medium"
                    >
                      Details
                    </button>
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

            <div className="grid gap-4 md:grid-cols-5">
              {PIPELINE_STAGES.map((stage) => (
                <MetricCard
                  key={stage}
                  label={stage}
                  value={String(pipelineCounts[stage] ?? 0)}
                  detail="Current contacts"
                />
              ))}
            </div>

            <SurfaceCard
              title="Active Pipeline"
              description="Track and manage high-priority relationships with strategic follow-ups"
              badge={`${state.pipeline.length} contacts`}
            >
              <div className="space-y-3">
                {pipelineWithContacts.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid gap-4 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-4 lg:grid-cols-[minmax(0,1.1fr)_220px_minmax(0,1fr)_140px]"
                  >
                    <div>
                      <p className="font-semibold text-[#111827]">{entry.contact?.name ?? 'Contact missing'}</p>
                      <p className="text-sm text-[#64748b]">{entry.contact?.company ?? 'Unassigned company'}</p>
                    </div>

                    <select
                      value={entry.stage}
                      onChange={(event) =>
                        updatePipelineEntry(entry.id, {
                          stage: event.target.value as DemoPipelineEntry['stage'],
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

                    <div>
                      <p className="text-sm font-medium text-[#111827]">{entry.nextAction}</p>
                      <p className="text-sm text-[#64748b]">{entry.notes}</p>
                    </div>

                    <div className="text-sm text-[#475569]">
                      <p>Next action</p>
                      <p className="font-medium text-[#111827]">
                        {formatDate(entry.nextActionDate)}
                      </p>
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
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard label="Guests" value={String(state.contacts.filter((contact) => contact.type === 'guest').length)} detail="Event and network guests" />
                <MetricCard label="VIPs" value={String(state.contacts.filter((contact) => contact.type === 'vip').length)} detail="Priority relationship profiles" />
                <MetricCard label="Advisors" value={String(state.contacts.filter((contact) => contact.type === 'advisor').length)} detail="Trusted strategic support" />
              </div>
            </SurfaceCard>
          </div>
        ) : null}

        {activeTool === 'vip-management' ? (
          <div className="space-y-6">
            <HeaderBlock
              title="VIP Management"
              description="Strategic relationship management"
            />
            <SurfaceCard
              title="Priority Profiles"
              description="Sanitized profiles used for prep and follow-up"
              badge={`${state.vipProfiles.length} profiles`}
            >
              <div className="space-y-3">
                {state.vipProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="grid gap-4 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-4 lg:grid-cols-[minmax(0,1fr)_120px_minmax(0,1.2fr)_minmax(0,1fr)]"
                  >
                    <div>
                      <p className="font-semibold text-[#111827]">{profile.name}</p>
                      <p className="text-sm text-[#64748b]">{profile.company}</p>
                    </div>
                    <span className="w-fit rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1d4ed8]">
                      {profile.priority}
                    </span>
                    <p className="text-sm text-[#475569]">{profile.objective}</p>
                    <p className="text-sm text-[#111827]">{profile.nextStep}</p>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>
        ) : null}

        {activeTool === 'cto-club' ? (
          <div className="space-y-6">
            <HeaderBlock
              title="CTO Club"
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
              title="Club Pipeline"
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
              description="Source-faithful local demo of the original projects-and-tasks workflow"
            />

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <SurfaceCard
                title="Projects"
                description="Active business development and collaboration projects"
                badge={`${bizdevProjects.length} total`}
              >
                <div className="space-y-4">
                  <input
                    value={bizdevSearch}
                    onChange={(event) => setBizdevSearch(event.target.value)}
                    placeholder="Search projects..."
                    className="w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-sm outline-none"
                  />

                  <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
                    <div className="grid grid-cols-[minmax(0,1.4fr)_120px_120px_120px] gap-4 border-b border-[#e5e7eb] px-4 py-3 text-sm font-semibold text-[#111827]">
                      <span>Project</span>
                      <span>Rating</span>
                      <span>Priority</span>
                      <span>Status</span>
                    </div>

                    {bizdevProjects.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => setSelectedBizdevProjectId(project.id)}
                        className={`grid w-full grid-cols-[minmax(0,1.4fr)_120px_120px_120px] gap-4 border-b border-[#eef2f7] px-4 py-4 text-left last:border-b-0 ${
                          selectedBizdevProject?.id === project.id ? 'bg-[#eef2ff]' : 'bg-white'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-[#111827]">{project.name}</p>
                          <p className="text-sm text-[#64748b]">{project.description || 'No description'}</p>
                        </div>
                        <p className="font-semibold text-[#111827]">
                          {computeProjectRating(project).toFixed(2)}
                        </p>
                        <p className="text-sm text-[#475569]">{project.priority}</p>
                        <p className="text-sm text-[#475569]">{project.status}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </SurfaceCard>

              {selectedBizdevProject ? (
                <div className="space-y-6">
                  <SurfaceCard
                    title={selectedBizdevProject.name}
                    description={selectedBizdevProject.description || 'Project details'}
                    badge={`${selectedBizdevTasks.length} tasks`}
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <select
                        value={selectedBizdevProject.priority}
                        onChange={(event) =>
                          updateBizdevProject(selectedBizdevProject.id, {
                            priority: event.target.value as ProjectPriority,
                          })
                        }
                        className="rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
                      >
                        {PRIORITY_OPTIONS.map((priority) => (
                          <option key={priority} value={priority}>
                            {priority}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedBizdevProject.status}
                        onChange={(event) =>
                          updateBizdevProject(selectedBizdevProject.id, {
                            status: event.target.value as ProjectStatus,
                          })
                        }
                        className="rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
                      >
                        {PROJECT_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </SurfaceCard>

                  <SurfaceCard
                    title="Task Board"
                    description="Move tasks between columns to simulate the original local workflow"
                    badge="drag enabled"
                  >
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowBizdevTaskForm((current) => !current)}
                        className="rounded-xl bg-[#111827] px-4 py-2 text-sm font-semibold text-white"
                      >
                        {showBizdevTaskForm ? 'Close Form' : '+ Add Task'}
                      </button>
                    </div>

                    {showBizdevTaskForm ? (
                      <form
                        onSubmit={createBizdevTask}
                        className="mt-4 grid gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-4"
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
                          className="rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
                        />
                        <select
                          value={bizdevTaskDraft.status}
                          onChange={(event) =>
                            setBizdevTaskDraft((current) => ({
                              ...current,
                              status: event.target.value as TaskStatus,
                            }))
                          }
                          className="rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none"
                        >
                          {TASK_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {toTitleCase(status)}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="w-fit rounded-xl bg-[#111827] px-4 py-2 text-sm font-semibold text-white"
                        >
                          Create Task
                        </button>
                      </form>
                    ) : null}

                    <div className="mt-4 grid gap-4 xl:grid-cols-4">
                      {TASK_STATUS_OPTIONS.map((status) => {
                        const tasks = selectedBizdevTasks.filter((task) => task.status === status);
                        return (
                          <div
                            key={status}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => handleBizdevDrop(event, status)}
                            className="min-h-48 rounded-2xl border border-[#e5e7eb] bg-white"
                          >
                            <div className="border-b border-[#e5e7eb] px-4 py-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-[#111827]">
                                  {toTitleCase(status)}
                                </span>
                                <span className="text-sm text-[#64748b]">{tasks.length}</span>
                              </div>
                            </div>
                            <div className="space-y-3 p-3">
                              {tasks.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-[#d1d5db] px-3 py-6 text-center text-xs uppercase tracking-[0.14em] text-[#94a3b8]">
                                  Drop tasks here
                                </div>
                              ) : (
                                tasks.map((task) => (
                                  <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(event) => {
                                      event.dataTransfer.setData('text/plain', task.id);
                                      setDraggedTaskId(task.id);
                                    }}
                                    onDragEnd={() => setDraggedTaskId(null)}
                                    className={`rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-3 ${
                                      draggedTaskId === task.id ? 'opacity-60' : ''
                                    }`}
                                  >
                                    <p className="text-sm text-[#111827]">{task.text}</p>
                                    <select
                                      value={task.status}
                                      onChange={(event) =>
                                        updateBizdevTask(task.id, {
                                          status: event.target.value as TaskStatus,
                                          completed: event.target.value === 'done',
                                        })
                                      }
                                      className="mt-3 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-xs outline-none"
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
                  </SurfaceCard>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

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
                <DetailField label="Type" value={toTitleCase(selectedContact.type)} />
                <DetailField
                  label="Area"
                  value={selectedContact.area ? toTitleCase(selectedContact.area) : 'None'}
                />
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
                  options={['guest', 'vip', 'partner', 'advisor', 'founder']}
                  onChange={(value) =>
                    setContactDraft((current) => ({
                      ...current,
                      type: value as DemoContact['type'],
                    }))
                  }
                />

                <FormSelect
                  label="Area"
                  value={contactDraft.area ?? ''}
                  options={['', 'events', 'partnerships', 'community', 'research']}
                  onChange={(value) =>
                    setContactDraft((current) => ({
                      ...current,
                      area: value ? (value as DemoContact['area']) : null,
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
    </section>
  );
}

function HeaderBlock({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-5xl font-semibold tracking-tight text-[#111827]">{title}</h1>
      <p className="mt-2 text-xl text-[#64748b]">{description}</p>
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
    <div className="rounded-[24px] border border-[#d9dee8] bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">{title}</h3>
          <p className="mt-1 text-base text-[#64748b]">{description}</p>
        </div>
        {badge ? (
          <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-sm font-medium text-[#111827]">
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
    <div className="rounded-[22px] border border-[#d9dee8] bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-[#64748b]">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-[#111827]">{value}</p>
      <p className="mt-1 text-sm text-[#94a3b8]">{detail}</p>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#64748b]">{label}</p>
      <p className="mt-2 text-base text-[#111827]">{value}</p>
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
            {option ? toTitleCase(option) : 'None'}
          </option>
        ))}
      </select>
    </label>
  );
}

function toTitleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
