import Link from 'next/link';

export default function HomeCTA() {
  return (
    <section className="border-t border-border">
      <div className="section-container py-32 md:py-40 lg:py-48">
        <p className="font-display text-2xl md:text-3xl lg:text-4xl text-text-primary leading-snug max-w-2xl">
          Need an AI-native Chief of Staff or Strategic Operator who actually
          executes?{' '}
          <Link
            href="/contact"
            className="text-accent hover:text-accent-hover transition-colors duration-200 underline decoration-accent/30 hover:decoration-accent underline-offset-4"
          >
            Let&apos;s connect.
          </Link>
        </p>
      </div>
    </section>
  );
}
