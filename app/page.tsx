import AnimateIn, { StaggerContainer } from '@/components/ui/AnimateIn';
import Button from '@/components/ui/Button';
import SkillMatrix from '@/components/home/SkillMatrix';
import FeaturedWork from '@/components/home/FeaturedWork';
import VaultTeaser from '@/components/home/VaultTeaser';
import HomeCTA from '@/components/home/HomeCTA';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        {/* Subtle background grid element */}
        <div className="page-grid-background" />
        <div className="page-hero-frame" aria-hidden="true" />

        <div className="section-container relative z-10 pt-[35vh] pb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
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
                <Button href="/Ian_Kuksov_CV.pdf" variant="ghost" download="Ian_Kuksov_CV.pdf">
                  Download CV
                </Button>
              </div>
            </AnimateIn>
          </StaggerContainer>
        </div>
      </section>
      <SkillMatrix />
      <FeaturedWork />
      <VaultTeaser />
      <HomeCTA />
    </div>
  );
}
