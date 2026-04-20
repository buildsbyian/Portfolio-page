import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Ian Kuksov — operator, builder, and Chief of Staff.',
};

export default function ContactPage() {
  return (
    <PageHero
      label="Contact"
      title={
        <>
          Let&apos;s build something <span className="text-accent">together.</span>
        </>
      }
      description="Whether you need a Chief of Staff, a strategic operator, or someone to turn ambiguity into execution, I'm interested in talking."
      actions={
        <>
          <a
            href="mailto:iankuksov.work@gmail.com"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-mono tracking-wide bg-accent text-bg hover:bg-accent-hover transition-all duration-200"
          >
            Send an Email
          </a>
          <a
            href="https://www.linkedin.com/in/ian-kuksov-5b8a952bb/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-mono tracking-wide border border-border text-text-primary hover:border-accent hover:text-accent transition-all duration-200"
          >
            Connect on LinkedIn
          </a>
        </>
      }
      sectionClassName="py-24 md:py-32 min-h-[60vh] flex flex-col justify-center"
      copyClassName="max-w-3xl"
      titleClassName="max-w-3xl"
      descriptionClassName="max-w-md"
    />
  );
}
