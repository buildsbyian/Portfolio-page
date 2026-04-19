import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import SectionLabel from '@/components/ui/SectionLabel';
import Tag from '@/components/ui/Tag';
import { projects } from '@/data/projects';
import { vaultItems } from '@/data/vault';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'A unified index of software, hardware, and resource work across operating systems, tools, products, and proof of work.',
};

const sectionCopy = {
  Software:
    'Dashboards, internal tools, AI-native builds, and operating systems turned into usable products.',
  Hardware:
    'Physical products, firmware, 3D design, and shipped hardware work with real-world traction.',
  Strategy:
    'Free resources, frameworks, and operating documents that show how the work is structured.',
} as const;

export default function WorkPage() {
  const softwareProjects = projects.filter((project) => project.category === 'Software');
  const hardwareProjects = projects.filter((project) => project.category === 'Hardware');
  const strategyProjects = projects.filter((project) => project.category === 'Strategy');
  const strategyProjectTitles = new Set(strategyProjects.map((project) => project.title));
  const readyResources = vaultItems.filter(
    (item) => item.status === 'Ready' && !strategyProjectTitles.has(item.title)
  );

  return (
    <section className="section-container py-24 md:py-32">
      <div className="max-w-3xl mb-16">
        <SectionLabel>All Work</SectionLabel>
        <h1 className="font-display text-3xl md:text-5xl text-text-primary mb-6 leading-tight">
          Software, hardware, and resources in one place.
        </h1>
        <p className="font-mono text-sm text-text-secondary leading-relaxed">
          This is the main index for everything on the site. Work is grouped by type so the
          portfolio stays easy to scan without splitting the navigation into separate sections.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-16">
        <a href="#software" className="theme-pill">
          Software
        </a>
        <a href="#hardware" className="theme-pill">
          Hardware
        </a>
        <a href="#resources" className="theme-pill">
          Resources
        </a>
      </div>

      <WorkSection
        id="software"
        label="Software"
        title="Software"
        description={sectionCopy.Software}
        items={softwareProjects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      />

      <WorkSection
        id="hardware"
        label="Hardware"
        title="Hardware"
        description={sectionCopy.Hardware}
        items={hardwareProjects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      />

      <WorkSection
        id="resources"
        label="Resources"
        title="Resources"
        description={sectionCopy.Strategy}
        items={[
          ...strategyProjects.map((project) => <ProjectRow key={project.slug} project={project} />),
          ...readyResources.map((resource) => <ResourceRow key={resource.title} title={resource.title} description={resource.description} type={resource.type} downloadUrl={resource.downloadUrl} />),
        ]}
      />
    </section>
  );
}

function WorkSection({
  id,
  label,
  title,
  description,
  items,
}: {
  id: string;
  label: string;
  title: string;
  description: string;
  items: ReactNode[];
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border py-14 md:py-16">
      <div className="max-w-3xl mb-8">
        <SectionLabel>{label}</SectionLabel>
        <h2 className="font-display text-2xl md:text-4xl text-text-primary mb-4">{title}</h2>
        <p className="font-mono text-sm text-text-secondary leading-relaxed">{description}</p>
      </div>

      <div className="space-y-4">{items}</div>
    </section>
  );
}

function ProjectRow({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="theme-card block p-6 md:p-8 group"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <h3 className="font-display text-xl md:text-2xl text-text-primary mb-3 group-hover:text-accent transition-colors duration-200">
            {project.title}
          </h3>
          <p className="font-mono text-sm text-text-secondary leading-relaxed mb-4">
            {project.hook}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <Tag key={item} variant="default">
                {item}
              </Tag>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Tag variant="accent">{project.category}</Tag>
          <span className="font-mono text-xs text-accent inline-flex items-center gap-1.5">
            View
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function ResourceRow({
  title,
  description,
  type,
  downloadUrl,
}: {
  title: string;
  description: string;
  type: string;
  downloadUrl?: string;
}) {
  return (
    <div className="theme-card p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <h3 className="font-display text-xl md:text-2xl text-text-primary mb-3">{title}</h3>
          <p className="font-mono text-sm text-text-secondary leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Tag variant="default">{type}</Tag>
          {downloadUrl ? (
            <a
              href={downloadUrl}
              download
              className="font-mono text-xs text-accent hover:text-accent-hover transition-colors duration-200 inline-flex items-center gap-1.5"
            >
              Download
              <span>↓</span>
            </a>
          ) : (
            <span className="font-mono text-xs text-text-secondary">Coming soon</span>
          )}
        </div>
      </div>
    </div>
  );
}
