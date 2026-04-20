'use client';

import AnimateIn, { StaggerContainer } from '@/components/ui/AnimateIn';
import Button from '@/components/ui/Button';
import SkillMatrix from '@/components/home/SkillMatrix';
import FeaturedWork from '@/components/home/FeaturedWork';
import VaultTeaser from '@/components/home/VaultTeaser';
import HomeCTA from '@/components/home/HomeCTA';
import { useLayout } from '@/components/ui/LayoutProvider';

export default function HomePage() {
  const { layout } = useLayout();

  const HeroContent = (
    <section className={`relative overflow-hidden ${layout === 'split' ? 'h-full flex flex-col justify-center' : ''}`}>
      {/* Subtle background grid element */}
      <div className="page-grid-background" />
      <div className="page-hero-frame" aria-hidden="true" />

      <div className={`section-container relative z-10 ${layout === 'split' ? 'pt-24 pb-20' : 'pt-[35vh] pb-10'} flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12`}>
        <StaggerContainer className="max-w-3xl">
          <AnimateIn>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.1] tracking-tight mb-6">
              I turn ambiguous problems into <span className="text-accent">working systems</span>
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
              <Button href="/cv.pdf" variant="ghost" download="Ian_Kuksov_CV.pdf">
                Download CV
              </Button>
            </div>
          </AnimateIn>
        </StaggerContainer>


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
          <HomeCTA />
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
      <HomeCTA />
    </div>
  );
}
