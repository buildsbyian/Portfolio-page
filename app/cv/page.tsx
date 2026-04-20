import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import PageHero from '@/components/ui/PageHero';

export const metadata: Metadata = {
  title: 'CV',
  description: 'Ian Kuksov — Chief of Staff, operator, and builder. View or download CV.',
};

export default function CVPage() {
  return (
    <>
      <PageHero
        label="Curriculum Vitae"
        title={
          <>
            CV <span className="text-accent">Overview</span>
          </>
        }
        description="A concise snapshot of roles, operating scope, and experience, with the downloadable PDF available right away."
        aside={
          <Button href="/cv.pdf" variant="filled" download>
            Download PDF
          </Button>
        }
        sectionClassName="pt-24 pb-14 md:pt-32 md:pb-16"
        titleClassName="text-3xl md:text-4xl lg:text-5xl"
        descriptionClassName="max-w-lg"
      />

      <section className="section-container pb-24 md:pb-32">
        <p className="font-mono text-sm text-text-secondary max-w-md">
          Full interactive CV will be displayed here. Coming soon.
        </p>
      </section>
    </>
  );
}
