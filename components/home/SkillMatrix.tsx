'use client';

import AnimateIn, { StaggerContainer } from '@/components/ui/AnimateIn';
import SectionLabel from '@/components/ui/SectionLabel';
import { skillCategories, languages } from '@/data/skills';

/** Minimal icon glyphs per category — keeps it clean, no icon library needed */
const categoryIcons: Record<string, string> = {
  'Strategy & Operations': '◈',
  'AI & Product': '⬡',
  'Technical': '⌘',
  'Range': '△',
};

export default function SkillMatrix() {
  return (
    <section className="py-16 md:py-20 border-t border-border">
      <div className="section-container">
        <AnimateIn>
          <SectionLabel>What I Do</SectionLabel>
        </AnimateIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
          {skillCategories.map((category) => (
            <AnimateIn key={category.title} className="h-full">
              <div className="group theme-card p-6 h-full flex flex-col relative overflow-hidden">
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-accent text-lg leading-none">
                    {categoryIcons[category.title] || '●'}
                  </span>
                  <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-text-primary">
                    {category.title}
                  </h3>
                </div>

                {/* Skill items */}
                <ul className="relative z-10 flex flex-col gap-2.5">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-sm text-text-secondary leading-[1.7] tracking-[0.01em] transition-colors duration-200 hover:text-accent"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          ))}
        </StaggerContainer>

        {/* Languages line */}
        <AnimateIn delay={0.3}>
          <div className="mt-16 pt-8 border-t border-border">
            <p className="font-mono text-sm md:text-base text-text-primary tracking-normal leading-relaxed">
              <span className="text-accent mr-2 text-lg">↗</span>
              {languages}
            </p>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
