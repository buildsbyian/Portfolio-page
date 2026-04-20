// app/cv/page.tsx
// Drop into /app/cv/page.tsx
// Only thing to update: your LinkedIn slug (~line 140)

import type { Metadata } from 'next';
import Link from 'next/link';
import AnimateIn, { StaggerContainer } from '@/components/ui/AnimateIn';

export const metadata: Metadata = {
  title: 'CV',
  description:
    'Ian Kuksov — Chief of Staff, strategic operator, and AI-native builder. Two years as direct CEO report at Space Inch.',
};

// ─── Data ────────────────────────────────────────────────────────────────────

const experience = [
  {
    company: 'Space Inch',
    companyUrl: 'https://spaceinch.com',
    role: 'Chief of Staff',
    period: '2024 – 2026',
    type: 'Full-time · Remote',
    summary:
      'Direct CEO report at a 30-person AI-native software company. Owned strategy, operations, AI tooling, and product prototyping — simultaneously, without an engineering team.',
    bullets: [
      'Primary thought partner and execution layer for the CEO — translated shifting priorities into structured decisions, operational systems, and working software.',
      'Owned strategic research for new ventures and portfolio expansions; delivered reports that shaped C-suite decisions.',
      'Built 4 AI product prototypes (0 to 1), each scoped to test a specific business hypothesis for new venture evaluation.',
      'Designed and shipped internal tooling — CRM, dashboards, custom workflows — giving leadership real-time operational visibility.',
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
    companyUrl: null,
    role: "Operations Manager & Director's Assistant",
    period: '2022 – 2024',
    type: 'Full-time · On-site',
    summary:
      "Full ownership of day-to-day business operations — procurement, compliance, recruitment, and the company's entire web and sales presence.",
    bullets: [
      'Ran procurement, vehicle imports, administrative management, and regulatory compliance.',
      'Owned the full recruitment pipeline from job postings through interviews and complex work permit processing.',
      "Built and managed the company's entire web presence from scratch: website, advertising channels, and sales listings.",
    ],
    caseStudies: [],
  },
];

const skills = [
  {
    label: 'Operations & Strategy',
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
    items: [
      'AI-Native Development',
      'Adaptive Tech Stack',
      'CRM & Pipeline Systems',
      'Product Documentation',
      '3D Design & Modeling',
      'Electronics & Firmware (ESP32)',
    ],
  },
];

const languages = ['English — Fluent', 'Croatian — Fluent', 'Russian — Fluent'];

function ExternalArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block ml-1 mb-0.5"
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

export default function CVPage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="page-grid-background" aria-hidden="true" />
        <div className="page-hero-frame" aria-hidden="true" />

        <div className="section-container relative z-10 pt-[28vh] pb-16">
          <StaggerContainer>

            <AnimateIn>
              <p className="label mb-8">Curriculum Vitae</p>
            </AnimateIn>

            <AnimateIn delay={0.08}>
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
                <div>
                  <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-text-primary leading-none tracking-tight mb-3">
                    Ian Kuksov
                  </h1>
                  <p className="font-mono text-sm text-text-secondary uppercase tracking-[0.14em]">
                    Chief of Staff · Strategic Operator · AI-Native Builder
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 font-mono text-sm shrink-0">
                  <a
                    href="https://linkedin.com/in/YOUR-SLUG-HERE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    <span className="inline-block w-1.5 h-1.5" style={{ backgroundColor: 'var(--accent)' }} />
                    LinkedIn
                    <ExternalArrow />
                  </a>
                  <a
                    href="mailto:iankuksov.work@gmail.com"
                    className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    <span className="inline-block w-1.5 h-1.5" style={{ backgroundColor: 'var(--accent)' }} />
                    iankuksov.work@gmail.com
                  </a>
                  <a
                    href="/cv.pdf"
                    download="Ian_Kuksov_CV.pdf"
                    className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    <span className="inline-block w-1.5 h-1.5" style={{ backgroundColor: 'var(--accent)' }} />
                    Download PDF
                  </a>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.16}>
              <div className="border-l-2 pl-6 max-w-2xl" style={{ borderColor: 'var(--accent)' }}>
                <p className="font-mono text-base text-text-primary leading-relaxed">
                  I work directly with founders and C-suite on strategy, research, and AI.
                  I&apos;m the person who takes the messy, ambiguous problem or idea and comes back
                  with a plan, a prototype, or a system — whichever it actually needs.
                </p>
              </div>
            </AnimateIn>

          </StaggerContainer>
        </div>
      </section>

      {/* Divider */}
      <div className="section-container">
        <div className="h-px" style={{ backgroundColor: 'var(--border)', opacity: 0.15 }} />
      </div>

      {/* Experience */}
      <section className="section-container py-20">
        <AnimateIn>
          <p className="label mb-12">Work Experience</p>
        </AnimateIn>

        <div className="flex flex-col gap-8">
          {experience.map((job, i) => (
            <AnimateIn key={job.company} delay={i * 0.1}>
              <div className="theme-card p-8 md:p-10">

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <div className="mb-1">
                      {job.companyUrl ? (
                        <a
                          href={job.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-display text-2xl md:text-3xl text-text-primary hover:text-accent transition-colors duration-200"
                        >
                          {job.company}
                          <ExternalArrow />
                        </a>
                      ) : (
                        <span className="font-display text-2xl md:text-3xl text-text-primary">
                          {job.company}
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-sm" style={{ color: 'var(--accent)' }}>
                      {job.role}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-1 font-mono text-xs text-text-secondary shrink-0">
                    <span>{job.period}</span>
                    <span>{job.type}</span>
                  </div>
                </div>

                <p className="font-mono text-sm text-text-secondary leading-relaxed mb-6 max-w-2xl">
                  {job.summary}
                </p>

                <ul className="flex flex-col gap-3 mb-8">
                  {job.bullets.map((bullet, bi) => (
                    <li key={bi} className="flex items-start gap-3 font-mono text-sm text-text-primary">
                      <span
                        className="mt-[0.45em] shrink-0 w-1.5 h-1.5"
                        style={{ backgroundColor: 'var(--accent)' }}
                        aria-hidden="true"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>

                {job.caseStudies.length > 0 && (
                  <div
                    className="flex flex-wrap items-center gap-3 pt-6"
                    style={{ borderTop: '1px solid var(--border)' }}
                  >
                    <span className="font-mono text-xs text-text-secondary uppercase tracking-widest">
                      Proof of work
                    </span>
                    {job.caseStudies.map((cs) => (
                      <Link
                        key={cs.label}
                        href={cs.href}
                        className="group flex items-center gap-3 px-4 py-2.5 font-mono text-xs border-2 transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:text-accent hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}
                      >
                        <div>
                          <div className="font-medium">{cs.label}</div>
                          <div className="text-[10px] text-text-secondary">{cs.sublabel}</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                          <path
                            d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}

              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="section-container pb-20">
        <AnimateIn>
          <p className="label mb-12">Skills</p>
        </AnimateIn>

        <AnimateIn delay={0.08}>
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ border: '2px solid var(--border)' }}
          >
            {skills.map((group, i) => (
              <div
                key={group.label}
                className="p-8"
                style={{ borderRight: i < skills.length - 1 ? '2px solid var(--border)' : 'none' }}
              >
                <p
                  className="font-mono text-xs uppercase tracking-[0.14em] mb-5 pb-4"
                  style={{ borderBottom: '1px solid var(--border)', color: 'var(--accent)' }}
                >
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="theme-pill font-mono text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnimateIn>
      </section>

      {/* Education + Languages */}
      <section className="section-container pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <AnimateIn>
            <div className="theme-card p-8 h-full">
              <p className="label mb-6">Education</p>
              <p className="font-display text-lg text-text-primary mb-1">
                B.Sc. Business, Management &amp; Marketing
              </p>
              <p className="font-mono text-sm text-text-secondary mb-2">
                Faculty of Economics and Tourism &ldquo;Dr. Mijo Mirković&rdquo;
              </p>
              <p className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
                Expected 2027
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.08}>
            <div className="theme-card p-8 h-full">
              <p className="label mb-6">Languages</p>
              <div className="flex flex-col gap-3">
                {languages.map((lang) => (
                  <div key={lang} className="flex items-center gap-3 font-mono text-sm text-text-primary">
                    <span
                      className="shrink-0 w-1.5 h-1.5"
                      style={{ backgroundColor: 'var(--accent)' }}
                      aria-hidden="true"
                    />
                    {lang}
                  </div>
                ))}
                <p className="font-mono text-xs text-text-secondary mt-2">
                  Operational across US, Balkan, and Eastern European contexts.
                </p>
              </div>
            </div>
          </AnimateIn>

        </div>
      </section>

      {/* CTA */}
      <section className="section-container pb-24">
        <AnimateIn>
          <div
            className="p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            style={{ border: '2px solid var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <div>
              <p className="label mb-4">Want the full picture?</p>
              <p className="font-mono text-sm text-text-secondary max-w-md">
                The case studies show the actual work — live demos, problem framing, and what got built.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/work"
                className="px-6 py-3 font-mono text-sm uppercase tracking-[0.12em] text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: 'var(--accent)', border: '2px solid var(--accent)' }}
              >
                View Work
              </Link>
              <a
                href="/cv.pdf"
                download="Ian_Kuksov_CV.pdf"
                className="px-6 py-3 font-mono text-sm uppercase tracking-[0.12em] text-text-primary transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ border: '2px solid var(--border)' }}
              >
                Download PDF
              </a>
            </div>
          </div>
        </AnimateIn>
      </section>

    </div>
  );
}
