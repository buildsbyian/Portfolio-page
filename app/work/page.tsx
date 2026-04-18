import type { Metadata } from 'next';
import SectionLabel from '@/components/ui/SectionLabel';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Software & engineering projects — dashboards, AI products, internal tools, and client work.',
};

export default function WorkPage() {
  return (
    <section className="section-container py-24 md:py-32">
      <SectionLabel>Software & Engineering</SectionLabel>
      <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-4">
        Work
      </h1>
      <p className="font-mono text-sm text-text-secondary max-w-md">
        Projects will be listed here with tag filtering. Coming soon.
      </p>
    </section>
  );
}
