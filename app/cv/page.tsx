import type { Metadata } from 'next';
import Link from 'next/link';
import AnimateIn, { StaggerContainer } from '@/components/ui/AnimateIn';
import Button from '@/components/ui/Button';
import SectionLabel from '@/components/ui/SectionLabel';

export const metadata: Metadata = {
  title: 'CV',
  description:
    'Ian Kuksov — Chief of Staff, strategic operator, and AI-native builder with experience across strategy, operations, and product prototyping.',
};

type JobLinkIcon = 'website' | 'linkedin' | 'email' | 'download';

const experience = [
  {
    company: 'Space Inch',
    role: 'Chief of Staff',
    period: '2024 – 2026',
    type: 'Full-time · Remote',
    summary:
      'Direct CEO report at an US Based software company. Owned strategy, operations, AI tooling, and product prototyping without waiting for perfect specs or a dedicated engineering team.',
    companyLinks: [
      {
        label: 'Website',
        href: 'https://spaceinch.com',
        icon: 'website' as JobLinkIcon,
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/company/space-inch',
        icon: 'linkedin' as JobLinkIcon,
      },
    ],
    bullets: [
      'Thought and execution partner for the CEO: translated shifting priorities into structured decisions, operational systems, and working software.',
      'Owned strategic research for new ventures and portfolio expansions; delivered reports that shaped C-suite decisions.',
      'Built 4 AI product prototypes (0 to 1), each scoped to test a specific business hypothesis for new venture evaluation.',
      'Designed and shipped internal tooling: CRM, dashboards, custom workflows, giving leadership real-time operational visibility.',
      'Developed operational playbooks across AI development, product, events, and lead generation.',
    ],
    caseStudies: [
      {
        label: 'BizDev Command Center',
        sublabel: 'Internal tool · Live demo',
        href: '/work/bizdev-command-center',
      },
      {
        label: 'AI Nutrition Assistant',
        sublabel: 'AI product · Live demo',
        href: '/work/ai-nutrition-assistant',
      },
    ],
  },
  {
    company: 'Kuhne & Skworzow d.o.o.',
    role: "Operations Manager & Director's Assistant",
    period: '2022 – 2024',
    type: 'Full-time · On-site',
    summary:
      "Full ownership of day-to-day business operations: procurement, compliance, recruitment, and the company's entire web and sales presence.",
    companyLinks: [],
    bullets: [
      'Ran procurement, vehicle imports, administrative management, and regulatory compliance.',
      'Owned the full recruitment pipeline from job postings through interviews and complex work permit processing.',
      "Built and managed the company's entire web presence from scratch: website, advertising channels, and sales listings.",
    ],
    caseStudies: [],
  },
] as const;

const skills = [
  {
    label: 'Operations & Strategy',
    icon: '◈',
    items: [
      'CEO-Level Decision Support',
      'Systems Design',
      'Strategic Research & Due Diligence',
      'Process Design & Playbooks',
      'Venture Evaluation',
      'Talent Sourcing & Recruitment',
    ],
  },
  {
    label: 'AI & Product',
    icon: '⬡',
    items: [
      'AI Prototyping (0→1)',
      'Agent Architecture',
      'MVP & POC Development',
      'Internal Tooling & Dashboards',
      'Prompt Engineering',
      'Local LLM (Ollama)',
    ],
  },
  {
    label: 'Technical',
    icon: '⌘',
    items: [
      'AI-Native Development',
      'Adaptive Tech Stack',
      'CRM & Pipeline Systems',
      'Product Documentation',
      '3D Design & Modeling',
      'Electronics & Firmware (ESP32)',
    ],
  },
] as const;

const languages = ['English — Fluent', 'Croatian — Fluent', 'Russian — Fluent'];

function ExternalArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <path
        d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGlyph({ icon }: { icon: JobLinkIcon }) {
  if (icon === 'linkedin') {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  if (icon === 'email') {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M2 4.25H14V11.75H2V4.25Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M2.75 5L8 8.5L13.25 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === 'download') {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M8 2.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M5.5 7.5L8 10L10.5 7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 12.25H13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M8 2.25C5.1005 2.25 2.75 4.6005 2.75 7.5C2.75 10.3995 5.1005 12.75 8 12.75C10.8995 12.75 13.25 10.3995 13.25 7.5C13.25 4.6005 10.8995 2.25 8 2.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M3.5 5.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3.5 9.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M7.99994 2.5C6.69439 3.70555 5.95312 5.3878 5.95312 7.5C5.95312 9.6122 6.69439 11.2944 7.99994 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 2.5C9.30555 3.70555 10.0468 5.3878 10.0468 7.5C10.0468 9.6122 9.30555 11.2944 8 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CompanyLink({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: JobLinkIcon;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 theme-pill font-mono text-[11px] uppercase tracking-[0.12em] hover:text-accent"
    >
      <IconGlyph icon={icon} />
      {label}
      <ExternalArrow />
    </a>
  );
}

export default function CVPage() {
  return (
    <div className="flex flex-col">
      {/* Hero — matches homepage design language */}
      <section className="relative overflow-hidden">
        <div className="page-grid-background" aria-hidden="true" />
        <div className="page-hero-frame" aria-hidden="true" />

        <div className="relative z-10 pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-20">
          <div className="section-container">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
              <StaggerContainer className="max-w-4xl space-y-7 md:space-y-9">
                <AnimateIn>
                  <SectionLabel>Curriculum Vitae</SectionLabel>
                </AnimateIn>

                <AnimateIn delay={0.08}>
                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.1] tracking-tight mb-6">
                    Ian <span className="text-accent">Kuksov</span>
                  </h1>
                </AnimateIn>

                <AnimateIn delay={0.14}>
                  <p className="font-mono text-sm text-text-secondary">
                    Chief of Staff · Strategic Operator · AI-Native Builder
                  </p>
                </AnimateIn>
              </StaggerContainer>

              <AnimateIn delay={0.22}>
                <div className="shrink-0 flex flex-col gap-3 lg:items-end lg:text-right">
                  <a
                    href="https://www.linkedin.com/in/ian-kuksov-5b8a952bb/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    <IconGlyph icon="linkedin" />
                    LinkedIn
                  </a>
                  <a
                    href="mailto:iankuksov.work@gmail.com"
                    className="inline-flex items-center gap-2 font-mono text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    <IconGlyph icon="email" />
                    iankuksov.work@gmail.com
                  </a>
                  <a
                    href="/cv.pdf"
                    download="Ian_Kuksov_CV.pdf"
                    className="inline-flex items-center gap-2 font-mono text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    <IconGlyph icon="download" />
                    Download PDF
                  </a>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* Bio — separate block below hero grid */}
      <section className="border-b border-border">
        <div className="py-12 md:py-16">
          <div className="section-container">
            <AnimateIn>
              <p className="max-w-4xl font-mono text-base md:text-lg text-text-primary leading-relaxed">
                I work directly with founders and C-suite on strategy, research, and AI. I&apos;m
                the person who takes the messy, ambiguous problem or idea and comes back with a
                plan, a prototype, or a system: whichever it actually needs.
              </p>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section className="pt-16 md:pt-20 pb-20 md:pb-24">
        <div className="section-container">
          <AnimateIn>
            <SectionLabel>Work Experience</SectionLabel>
          </AnimateIn>

          <div className="mt-8 flex flex-col gap-8">
            {experience.map((job, i) => (
              <AnimateIn key={job.company} delay={i * 0.08}>
                <article className="theme-card p-8 md:p-10">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-display text-2xl md:text-3xl text-text-primary leading-tight">
                          {job.company}
                        </h2>
                        {job.companyLinks.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {job.companyLinks.map((link) => (
                              <CompanyLink
                                key={link.label}
                                label={link.label}
                                href={link.href}
                                icon={link.icon}
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <p className="mt-3 font-mono text-sm uppercase tracking-[0.12em] text-accent">
                        {job.role}
                      </p>
                    </div>

                    <div className="shrink-0 border-l-2 border-accent pl-4 font-mono text-xs uppercase tracking-[0.12em] text-text-secondary">
                      <p>{job.period}</p>
                      <p className="mt-2">{job.type}</p>
                    </div>
                  </div>

                  <p className="mt-7 max-w-3xl font-mono text-sm md:text-base leading-relaxed text-text-secondary">
                    {job.summary}
                  </p>

                  <ul className="mt-8 grid gap-3">
                    {job.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 font-mono text-sm md:text-[15px] leading-relaxed text-text-primary"
                      >
                        <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {job.caseStudies.length > 0 ? (
                    <div className="mt-8 border-t border-border pt-6">
                      <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-text-secondary">
                        Proof of work
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {job.caseStudies.map((cs) => (
                          <Link
                            key={cs.label}
                            href={cs.href}
                            className="group theme-card flex items-center gap-3 px-4 py-3"
                          >
                            <div>
                              <div className="font-mono text-sm text-text-primary group-hover:text-accent transition-colors duration-200">
                                {cs.label}
                              </div>
                              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary">
                                {cs.sublabel}
                              </div>
                            </div>
                            <span className="text-accent transition-transform duration-200 group-hover:translate-x-1">
                              →
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Skills — matches homepage SkillMatrix style */}
      <section className="py-16 md:py-20 border-t border-border">
        <div className="section-container">
          <AnimateIn>
            <SectionLabel>Skills</SectionLabel>
          </AnimateIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            {skills.map((group) => (
              <AnimateIn key={group.label} className="h-full">
                <div className="group theme-card p-6 h-full flex flex-col relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-accent text-lg leading-none">{group.icon}</span>
                    <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-text-primary">
                      {group.label}
                    </h3>
                  </div>

                  <ul className="relative z-10 flex flex-col gap-2.5">
                    {group.items.map((item) => (
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
        </div>
      </section>

      {/* Education & Languages */}
      <section className="border-t border-border py-16 md:py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <AnimateIn>
              <div className="theme-card h-full p-8">
                <SectionLabel className="mb-8">Education</SectionLabel>
                <h2 className="font-display text-2xl md:text-3xl leading-tight text-text-primary">
                  B.Sc. Business, Management &amp; Marketing
                </h2>
                <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-text-secondary">
                  Faculty of Economics and Tourism &ldquo;Dr. Mijo Mirković&rdquo;
                </p>
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.12em] text-accent">
                  Expected 2027
                </p>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.08}>
              <div className="theme-card h-full p-8">
                <SectionLabel className="mb-8">Languages</SectionLabel>
                <div className="flex flex-col gap-3">
                  {languages.map((lang) => (
                    <div
                      key={lang}
                      className="flex items-center gap-3 font-mono text-sm md:text-base text-text-primary"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
                      {lang}
                    </div>
                  ))}
                </div>
                <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-text-secondary">
                  Operational across US, Balkan, and Eastern European contexts.
                </p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="section-container py-20 md:py-24">
          <AnimateIn>
            <SectionLabel>Next Step</SectionLabel>
          </AnimateIn>

          <AnimateIn delay={0.08}>
            <h2 className="mt-2 max-w-3xl font-display text-3xl md:text-4xl lg:text-5xl leading-tight text-text-primary">
              Want the <span className="text-accent">full picture</span>?
            </h2>
          </AnimateIn>

          <AnimateIn delay={0.16}>
            <p className="mt-6 max-w-2xl font-mono text-sm md:text-base leading-relaxed text-text-secondary">
              The case studies show the actual work: live demos, decision-making logic, problem framing,
              and what got built.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.24}>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/work" variant="filled">
                View Work
              </Button>
              <Button href="/cv.pdf" variant="ghost" download="Ian_Kuksov_CV.pdf">
                Download PDF
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
