import type { ReactNode } from 'react';
import SectionLabel from '@/components/ui/SectionLabel';

interface PageHeroProps {
  label: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  aside?: ReactNode;
  sectionClassName?: string;
  innerClassName?: string;
  copyClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function PageHero({
  label,
  title,
  description,
  actions,
  footer,
  aside,
  sectionClassName = '',
  innerClassName = '',
  copyClassName = '',
  titleClassName = '',
  descriptionClassName = '',
}: PageHeroProps) {
  const hasAside = Boolean(aside);

  return (
    <section className={`page-hero relative overflow-hidden ${sectionClassName}`.trim()}>
      <div className="page-grid-background" aria-hidden="true" />
      <div className="page-hero-frame" aria-hidden="true" />

      <div
        className={`section-container relative z-10 flex flex-col gap-8 md:gap-10 ${
          hasAside ? 'lg:flex-row lg:items-end lg:justify-between' : ''
        } ${innerClassName}`.trim()}
      >
        <div className={`max-w-4xl ${copyClassName}`.trim()}>
          <SectionLabel>{label}</SectionLabel>

          <h1
            className={`font-display text-3xl md:text-5xl lg:text-6xl text-text-primary leading-tight ${titleClassName}`.trim()}
          >
            {title}
          </h1>

          {description ? (
            <p
              className={`mt-6 font-mono text-sm md:text-base text-text-secondary leading-relaxed max-w-2xl ${descriptionClassName}`.trim()}
            >
              {description}
            </p>
          ) : null}

          {actions ? (
            <div className="mt-8 flex flex-col sm:flex-row gap-4">{actions}</div>
          ) : null}

          {footer ? <div className="mt-8 md:mt-10">{footer}</div> : null}
        </div>

        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
    </section>
  );
}
