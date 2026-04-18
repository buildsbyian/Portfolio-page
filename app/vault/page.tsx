import type { Metadata } from 'next';
import SectionLabel from '@/components/ui/SectionLabel';

export const metadata: Metadata = {
  title: 'The Vault',
  description: 'Free resources, frameworks, workbooks, and tools for operators and builders.',
};

export default function VaultPage() {
  return (
    <section className="section-container py-24 md:py-32">
      <SectionLabel>Free Resources</SectionLabel>
      <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-4">
        The Vault
      </h1>
      <p className="font-mono text-sm text-text-secondary max-w-md">
        Frameworks, workbooks, and resources — all free, no gate. Coming soon.
      </p>
    </section>
  );
}
