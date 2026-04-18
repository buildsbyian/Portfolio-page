import Link from 'next/link';

export default function HomeCTA() {
  return (
    <section className="border-t border-border">
      <div className="section-container py-32 md:py-40 lg:py-48">
        <p className="font-display text-xl md:text-2xl lg:text-3xl text-text-primary leading-snug max-w-2xl">
          Need an AI-native Chief of Staff or Strategic Operator who actually
          executes?{' '}
          <Link
            href="/contact"
            className="hover:text-accent-hover transition-colors duration-200 underline decoration-accent/30 hover:decoration-accent underline-offset-4"
            style={{ color: 'var(--accent)' }}
          >
            Let&apos;s connect.
          </Link>
        </p>
      </div>
    </section>
  );
}
