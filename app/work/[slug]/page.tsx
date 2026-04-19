import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SectionLabel from '@/components/ui/SectionLabel';
import Tag from '@/components/ui/Tag';
import Button from '@/components/ui/Button';
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

  const renderMediaBox = (isFullWidth = false) => {
    switch (project.category) {
      case 'Software':
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
          <div className="w-full space-y-6">
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
            <div className="flex justify-center">
               <Button href={project.content?.pdfUrl} download variant="filled" className="w-full sm:w-auto">
                 Download PDF Resource
               </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderContentBlocks = (isTwoColumn = false) => {
    if (!project.content) return null;

    return (
      <div className={`w-full ${isTwoColumn ? 'grid grid-cols-1 md:grid-cols-2 gap-12' : 'space-y-12'}`}>
        {/* Left/Main Column of content */}
        <div className="space-y-12">
          {/* The Problem */}
          <div>
            <h2 className="font-display text-2xl text-text-primary mb-4 pb-2 border-b border-border/50">The Problem</h2>
            <p className="font-mono text-sm text-text-secondary leading-relaxed">
              {project.content.problem}
            </p>
          </div>

          {/* What I Built */}
          <div>
            <h2 className="font-display text-2xl text-text-primary mb-4 pb-2 border-b border-border/50">What I Built</h2>
            <p className="font-mono text-sm text-text-secondary leading-relaxed">
              {project.content.whatIBuilt}
            </p>
          </div>
        </div>

        {/* Right/Secondary Column of content */}
        <div className="space-y-12">
          {/* Outcome */}
          <div>
            <h2 className="font-display text-2xl text-text-primary mb-4 pb-2 border-b border-border/50">Concrete Outcome</h2>
            <div className="font-mono text-sm text-accent leading-relaxed font-bold bg-accent/5 p-4 border-l-2 border-accent">
              {project.content.outcome}
            </div>
          </div>

          {/* Role */}
          <div className="p-6 bg-surface border border-border">
            <h3 className="font-display text-lg text-text-primary mb-3">My Role</h3>
            <p className="font-mono text-xs text-text-secondary leading-relaxed">
              {project.content.myRole}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24">
      {/* Header Section */}
      <section className="section-container mb-12 md:mb-16">
        <div className="mb-6 flex items-center gap-3">
          <SectionLabel>{project.category} Case Study</SectionLabel>
          <Tag variant="default">{project.roleTag}</Tag>
        </div>
        
        <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-6 leading-tight max-w-4xl">
          {project.title}
        </h1>
        
        <p className="font-mono text-lg text-text-secondary max-w-2xl leading-relaxed mb-8">
          {project.hook}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.stack.map(tech => (
            <Tag key={tech} variant="default">{tech}</Tag>
          ))}
        </div>

        {/* Links Array using Buttons - Moved above the split for Bongo Cat and Strategy */}
        {!isSoftware && (project.content?.repoUrl || project.content?.makerWorldUrls) && (
          <div className="flex flex-wrap gap-4 pt-6 mt-4 border-t border-border">
            {project.content?.repoUrl && (
              <Button href={project.content.repoUrl} target="_blank" variant="ghost">
                View GitHub Repo
              </Button>
            )}
            {project.content?.makerWorldUrls?.map(link => (
              <Button key={link.url} href={link.url} target="_blank" variant="ghost">
                {link.text}
              </Button>
            ))}
          </div>
        )}
      </section>

      {isSoftware ? (
        /* Stacked Layout for Software */
        <div className="space-y-16">
          <section className="section-container">
            {renderMediaBox(true)}
          </section>
          <section className="section-container border-t border-border pt-16">
            {renderContentBlocks(true)}
          </section>
        </div>
      ) : (
        /* Split Layout for Hardware/Strategy */
        <section className="section-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Side: Media Split */}
          <div className="w-full lg:sticky lg:top-24">
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
