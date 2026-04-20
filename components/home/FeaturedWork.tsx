'use client';

import Image from 'next/image';
import Link from 'next/link';
import AnimateIn, { StaggerContainer } from '@/components/ui/AnimateIn';
import SectionLabel from '@/components/ui/SectionLabel';
import Tag from '@/components/ui/Tag';
import { projects, Project } from '@/data/projects';

const categoryTagVariant = {
  Software: 'default' as const,
  Hardware: 'default' as const,
  Strategy: 'default' as const,
};

export default function FeaturedWork() {
  const getCardProps = (index: number) => {
    if (index === 0) {
      return { className: 'md:col-span-2 md:row-span-2', large: true };
    }

    return { className: 'md:col-span-2 h-full', large: false };
  };

  return (
    <section className="py-16 md:py-20 border-t border-border">
      <div className="section-container">
        <AnimateIn>
          <SectionLabel>Selected Work</SectionLabel>
        </AnimateIn>

        <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[minmax(240px,auto)] md:items-stretch">
          {projects.filter(p => p.featured).slice(0, 3).map((project, index) => {
            const props = getCardProps(index);
            return (
              <AnimateIn key={project.slug} className={props.className}>
                <ProjectCard project={project} large={props.large} />
              </AnimateIn>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
  large?: boolean;
}

function ProjectCard({ project, large = false }: ProjectCardProps) {
  const isPlaceholder = project.slug === '#';
  const highlightImage = project.content?.images?.[0];
  const useMediaLayout = large && project.category !== 'Software';
  const titleClassName = 'font-display text-text-primary leading-tight tracking-[-0.02em] text-2xl md:text-[2rem]';

  const cardContent = large ? (
    <div className="group relative theme-card h-full min-h-[360px] flex flex-col overflow-hidden">
      {useMediaLayout ? (
        <div className="h-[60%] border-b border-border bg-border/30 relative overflow-hidden flex items-center justify-center">
          {highlightImage ? (
            <Image
              src={highlightImage}
              alt={`${project.title} highlight`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />
          )}
        </div>
      ) : null}

      <div className="flex-1 p-6 md:p-8 flex flex-col gap-5">
        <div>
          <Tag variant={categoryTagVariant[project.category]}>
            {project.category}
          </Tag>
        </div>
        <div className="flex flex-1 flex-col justify-end">
          <h3 className={`${titleClassName} mb-3`}>
            {project.title}
          </h3>
          <p className="font-mono text-xs text-text-secondary leading-relaxed mb-4 max-w-md">
            {project.hook}
          </p>
          <span className="font-mono text-xs text-accent group-hover:text-accent-hover transition-colors duration-200 inline-flex items-center gap-1.5">
            {isPlaceholder ? 'Coming Soon' : 'View Project'}
            {!isPlaceholder && <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>}
          </span>
        </div>
      </div>

      {/* Decorative corner accent on hover */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 right-0 w-[1px] h-8 bg-accent/30" />
        <div className="absolute top-0 right-0 w-8 h-[1px] bg-accent/30" />
      </div>
    </div>
  ) : (
    <div className="group relative theme-card p-6 md:p-8 h-full min-h-[240px] flex flex-col">
      {/* Top: category tag */}
      <div className="mb-5">
        <Tag variant={categoryTagVariant[project.category]}>
          {project.category}
        </Tag>
      </div>

      {/* Middle: title + hook */}
      <div className="flex-1 flex flex-col justify-end">
        <h3 className={`${titleClassName} mb-3`}>
          {project.title}
        </h3>
        <p className="font-mono text-xs text-text-secondary leading-relaxed mb-4 max-w-md">
          {project.hook}
        </p>

        {/* CTA */}
        <span className="font-mono text-xs text-accent group-hover:text-accent-hover transition-colors duration-200 inline-flex items-center gap-1.5">
          {isPlaceholder ? 'Coming Soon' : 'View Project'}
          {!isPlaceholder && <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>}
        </span>
      </div>

      {/* Decorative corner accent on hover */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 right-0 w-[1px] h-8 bg-accent/30" />
        <div className="absolute top-0 right-0 w-8 h-[1px] bg-accent/30" />
      </div>
    </div>
  );

  if (isPlaceholder) {
    return cardContent;
  }

  return (
    <Link href={`/work/${project.slug}`} className="block h-full">
      {cardContent}
    </Link>
  );
}
