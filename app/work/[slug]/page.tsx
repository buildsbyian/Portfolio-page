import type { Metadata } from 'next';
import SectionLabel from '@/components/ui/SectionLabel';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  return (
    <section className="section-container py-24 md:py-32">
      <SectionLabel>Case Study</SectionLabel>
      <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-4 capitalize">
        {slug.replace(/-/g, ' ')}
      </h1>
      <p className="font-mono text-sm text-text-secondary max-w-md">
        This case study page will be built with demo embed, three-bullet summary, Go Deeper section, and impact line.
      </p>
    </section>
  );
}
