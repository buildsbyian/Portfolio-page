'use client';

import Link from 'next/link';
import AnimateIn, { StaggerContainer } from '@/components/ui/AnimateIn';
import SectionLabel from '@/components/ui/SectionLabel';
import { vaultItems } from '@/data/vault';

export default function VaultTeaser() {
  // Only show curated ready items on the homepage teaser.
  const featuredTitles = ['Sourcing SOP', 'AI Development Workbook', 'Cursor Ruleset'];
  const displayItems = featuredTitles
    .map((title) => vaultItems.find((item) => item.title === title))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className="py-16 md:py-20 border-t border-border">
      <div className="section-container">
        <AnimateIn>
          <SectionLabel>Free Resources</SectionLabel>
        </AnimateIn>

        <StaggerContainer>
          <div className="divide-y divide-border">
            {displayItems.map((item) => (
              <AnimateIn key={item.title}>
                <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-3 sm:gap-8">
                  {/* Left: title + description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono text-sm text-text-primary group-hover:text-accent transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="font-mono text-xs text-text-secondary mt-1 truncate">
                      {item.description}
                    </p>
                  </div>

                  {/* Right: type badge + view CTA */}
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-secondary">
                      {item.type}
                    </span>
                    {item.pageUrl ? (
                      <Link
                        href={item.pageUrl}
                        className="font-mono text-xs text-accent hover:text-accent-hover transition-colors duration-200 inline-flex items-center gap-1"
                      >
                        View
                        <span className="text-[10px]">→</span>
                      </Link>
                    ) : item.downloadUrl ? (
                      <a
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-accent hover:text-accent-hover transition-colors duration-200 inline-flex items-center gap-1"
                      >
                        View
                        <span className="text-[10px]">↗</span>
                      </a>
                    ) : (
                      <span className="font-mono text-xs text-text-secondary/50">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </StaggerContainer>

        {/* View all link */}
        <AnimateIn delay={0.2}>
          <div className="mt-8">
            <Link
              href="/work#resources"
              className="font-mono text-xs text-text-secondary hover:text-accent transition-colors duration-200 inline-flex items-center gap-1.5"
            >
              View all resources
              <span className="transition-transform duration-200 hover:translate-x-1">→</span>
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
