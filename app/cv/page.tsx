import type { Metadata } from 'next';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'CV',
  description: 'Ian Kuksov — Chief of Staff, operator, and builder. View or download CV.',
};

export default function CVPage() {
  return (
    <section className="section-container py-24 md:py-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <SectionLabel>Curriculum Vitae</SectionLabel>
          <h1 className="font-display text-3xl md:text-4xl text-text-primary">
            CV
          </h1>
        </div>
        <Button href="/cv.pdf" variant="filled" download>
          Download PDF
        </Button>
      </div>
      <p className="font-mono text-sm text-text-secondary max-w-md">
        Full interactive CV will be displayed here. Coming soon.
      </p>
    </section>
  );
}
