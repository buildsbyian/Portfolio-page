import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SectionLabel from '@/components/ui/SectionLabel';
import Tag from '@/components/ui/Tag';
import Button from '@/components/ui/Button';
import BizDevCommandCenterDemo from '@/demos/bizdev-command-center';
import { projects } from '@/data/projects';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.title,
    description: project.hook,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  const isSoftware = project.category === 'Software';
  const isWideDemo = project.slug === 'bizdev-command-center';
  const projectLinks = [
    ...(project.content?.repoUrl
      ? [{ href: project.content.repoUrl, label: 'View GitHub Repo', external: true }]
      : []),
    ...(project.content?.makerWorldUrls?.map((link) => ({
      href: link.url,
      label: link.text,
      external: true,
    })) ?? []),
    ...(project.content?.pdfUrl
      ? [{ href: project.content.pdfUrl, label: 'Download PDF Resource', external: false, download: true }]
      : []),
  ];
  const hasProjectLinks = projectLinks.length > 0;

  const renderMediaBox = (isFullWidth = false) => {
    switch (project.category) {
      case 'Software':
        if (project.slug === 'bizdev-command-center') {
          return <BizDevCommandCenterDemo />;
        }

        return (
          <div className={`w-full ${isFullWidth ? 'aspect-video' : 'aspect-[4/3] lg:aspect-[3/4]'} bg-surface border border-border flex flex-col items-center justify-center p-8 text-center relative overflow-hidden h-full min-h-[400px]`}>
             {/* Subtle grid pattern background */}
            <div 
              className="absolute inset-0 opacity-[0.15]" 
              style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
            />
            <h3 className="font-display text-text-primary text-xl mb-2 relative z-10">[Demo Environment]</h3>
            <p className="font-mono text-xs text-text-secondary relative z-10 max-w-xs mx-auto">
              Interactive UIs and data logic will snap into this container.
            </p>
          </div>
        );
      case 'Hardware':
        return (
          <div className="w-full space-y-4">
            {project.content?.images && project.content.images.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {project.content.images.map((src, idx) => (
                  <div key={idx} className="border border-border bg-surface overflow-hidden">
                    <img 
                      src={src} 
                      alt={`${project.title} - ${idx + 1}`} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full aspect-[4/3] lg:aspect-[3/4] bg-surface border border-border flex flex-col items-center justify-center p-8 text-center relative overflow-hidden h-full min-h-[400px]">
                <div className="absolute inset-0 bg-border/20" />
                <h3 className="font-display text-text-primary text-xl mb-2 relative z-10">[Image Gallery]</h3>
                <p className="font-mono text-xs text-text-secondary relative z-10 max-w-xs mx-auto">
                  High quality hardware photography and process shots will be carousel-mounted here.
                </p>
              </div>
            )}
          </div>
        );
      case 'Strategy':
        return (
          <div className="w-full">
            <div className="w-full aspect-[1/1.4] bg-surface border border-border relative overflow-hidden shadow-2xl">
              {project.content?.pdfUrl ? (
                <iframe 
                  src={`${project.content.pdfUrl}#toolbar=0`} 
                  className="w-full h-full border-none"
                  title={`${project.title} PDF Preview`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                   <h3 className="font-mono text-xs text-text-secondary">PDF Preview Render</h3>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderContentBlocks = (isTwoColumn = false) => {
    if (!project.content) return null;

    const contentSections = [
      { title: 'The Problem', body: project.content.problem },
      { title: 'What I Built', body: project.content.whatIBuilt },
      { title: 'Concrete Outcome', body: project.content.outcome },
      { title: 'My Role', body: project.content.myRole },
    ];

    const leftColumnSections = isTwoColumn ? contentSections.slice(0, 2) : contentSections;
    const rightColumnSections = isTwoColumn ? contentSections.slice(2) : [];

    const renderSection = (section: { title: string; body: string }) => (
      <div key={section.title}>
        <h2 className="font-display text-2xl text-text-primary mb-4 pb-3 border-b border-border/50">
          <span className="text-accent">{section.title}</span>
        </h2>
        <p className="font-mono text-sm text-text-secondary leading-relaxed">
          {section.body}
        </p>
      </div>
    );

    const resourcesSection = hasProjectLinks ? (
      <div key="resources-and-links">
        <h2 className="font-display text-2xl text-text-primary mb-4 pb-3 border-b border-border/50">
          <span className="text-accent">Resources & Links</span>
        </h2>
        <p className="font-mono text-sm text-text-secondary leading-relaxed mb-6">
          Supporting artifacts, downloads, and external references related to this project.
        </p>
        <div className="flex flex-wrap gap-3 md:gap-4">
          {projectLinks.map((link) => (
            <Button
              key={`${link.label}-${link.href}`}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              download={'download' in link ? link.download : undefined}
              variant="ghost"
            >
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    ) : null;

    return (
      <div className={`w-full ${isTwoColumn ? 'grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14' : 'space-y-10 md:space-y-12 lg:space-y-14'}`}>
        {/* Left/Main Column of content */}
        <div className="space-y-10 md:space-y-12">
          {leftColumnSections.map(renderSection)}
        </div>

        {/* Right/Secondary Column of content */}
        {isTwoColumn ? (
          <div className="space-y-10 md:space-y-12">
            {rightColumnSections.map(renderSection)}
            {resourcesSection}
          </div>
        ) : (
          resourcesSection
        )}
      </div>
    );
  };

  return (
    <div className="pt-20 md:pt-28 lg:pt-32 pb-16 md:pb-24">
      {/* Header Section */}
      <section className="section-container mb-12 md:mb-14 lg:mb-16">
        <div className="mb-5 md:mb-6">
          <SectionLabel>
            <span className="text-[0.9rem] md:text-[1rem] tracking-[0.18em] text-text-primary">
              {project.category} Case Study
            </span>
          </SectionLabel>
        </div>
        
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary mb-5 md:mb-6 leading-tight max-w-4xl">
          {project.title}
        </h1>
        
        <p className="font-mono text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed mb-6 md:mb-8">
          {project.hook}
        </p>

        <div className="flex flex-wrap gap-2.5 mb-8 md:mb-10">
          {project.stack.map(tech => (
            <Tag key={tech} variant="default">{tech}</Tag>
          ))}
        </div>
      </section>

      {isSoftware ? (
        /* Stacked Layout for Software */
        <div className="space-y-14 md:space-y-16 lg:space-y-20">
          <section className={isWideDemo ? 'mx-auto w-full max-w-[1700px] px-3 md:px-6 lg:px-10' : 'section-container'}>
            {renderMediaBox(true)}
          </section>
          <section className={isWideDemo ? 'mx-auto w-full max-w-[1500px] border-t border-border px-4 pt-14 md:px-6 md:pt-16 lg:px-10 lg:pt-20' : 'section-container border-t border-border pt-14 md:pt-16 lg:pt-20'}>
            {renderContentBlocks(true)}
          </section>
        </div>
      ) : (
        /* Split Layout for Hardware/Strategy */
        <section className="section-container grid grid-cols-1 lg:grid-cols-2 gap-14 md:gap-16 lg:gap-20 items-start">
          {/* Left Side: Media Split */}
          <div className="w-full lg:sticky lg:top-28">
            {renderMediaBox()}
          </div>

          {/* Right Side: Copy/Text Split */}
          <div className="w-full">
            {renderContentBlocks(false)}
          </div>
        </section>
      )}

    </div>
  );
}
