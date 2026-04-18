import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Ian Kuksov — operator, builder, and Chief of Staff.',
};

export default function ContactPage() {
  return (
    <section className="section-container py-24 md:py-32 min-h-[60vh] flex flex-col justify-center">
      <p className="label mb-6">Contact</p>
      <h1 className="font-display text-3xl md:text-5xl text-text-primary mb-6 leading-tight">
        Let&apos;s build something<br />
        <span className="text-accent">together.</span>
      </h1>
      <p className="font-mono text-sm text-text-secondary max-w-md mb-10">
        Whether you need a Chief of Staff, a strategic operator, or someone to
        turn ambiguity into execution — I&apos;m interested in talking.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
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
      </div>
    </section>
  );
}
