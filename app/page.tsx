'use client';

import AnimateIn, { StaggerContainer } from '@/components/ui/AnimateIn';
import Button from '@/components/ui/Button';
import SkillMatrix from '@/components/home/SkillMatrix';
import FeaturedWork from '@/components/home/FeaturedWork';
import VaultTeaser from '@/components/home/VaultTeaser';
import { useLayout } from '@/components/ui/LayoutProvider';

export default function HomePage() {
  const { layout } = useLayout();

  const HeroContent = (
    <section className={`relative overflow-hidden ${layout === 'split' ? 'h-full flex flex-col justify-center' : ''}`}>
      {/* Ambient Hero Glow */}
      <div className="hero-glow absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent to-[#9089FC] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      {/* Subtle background grid element */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className={`section-container relative z-10 ${layout === 'split' ? 'pt-24 pb-20' : 'pt-[35vh] pb-10'} flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12`}>
        <StaggerContainer className="max-w-3xl">
          <AnimateIn>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.1] tracking-tight mb-6">
              I&apos;ve never had a playbook.<br />
              <span className="text-accent">I write them.</span>
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.12}>
            <p className="font-mono text-sm text-text-secondary max-w-xl mb-10">
              Chief of Staff · Direct C-suite report · AI native
            </p>
          </AnimateIn>

          <AnimateIn delay={0.24}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/work" variant="filled">
                View Work
              </Button>
              <Button href="/cv.pdf" variant="ghost" download>
                Download CV
              </Button>
            </div>
          </AnimateIn>
        </StaggerContainer>

        {layout === 'screenshot' && (
          <AnimateIn delay={0.3} className="hidden lg:block shrink-0">
            <div className="font-mono text-text-secondary leading-[1.2] tracking-[0.4em] opacity-40 border border-border p-8 rounded-sm select-none theme-card">
{`+ - + - + - +
- + - + - + -
+ - + - + - +
- + - + - + -`}
            </div>
          </AnimateIn>
        )}
      </div>
    </section>
  );

  if (layout === 'split') {
    return (
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-var(--nav-height))]">
        <div className="lg:w-2/5 lg:sticky lg:top-[var(--nav-height)] lg:h-[calc(100vh-var(--nav-height))] overflow-hidden flex items-center bg-surface/50 border-r border-border backdrop-blur-sm shadow-[10px_0_30px_rgba(0,0,0,0.2)] z-20">
          {HeroContent}
        </div>
        <div className="lg:w-3/5 pb-20">
          <SkillMatrix />
          <FeaturedWork />
          <VaultTeaser />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {HeroContent}
      <SkillMatrix />
      <FeaturedWork />
      <VaultTeaser />
    </div>
  );
}
