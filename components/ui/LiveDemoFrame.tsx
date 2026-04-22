import type { ReactNode } from 'react';
import SectionLabel from '@/components/ui/SectionLabel';

interface LiveDemoFrameProps {
  id?: string;
  title: string;
  children: ReactNode;
  resetButton?: ReactNode;
}

export default function LiveDemoFrame({
  id = 'live-demo',
  title,
  children,
  resetButton,
}: LiveDemoFrameProps) {
  return (
    <section
      id={id}
      className="mx-auto w-full max-w-[1500px] scroll-mt-28 px-4 md:px-6 lg:px-10"
    >
      <div className="overflow-hidden border border-border bg-surface">
        <header className="flex flex-col gap-4 border-b border-border bg-surface px-5 py-4 md:flex-row md:items-end md:justify-between md:px-6 md:py-5">
          <div>
            <SectionLabel className="!mb-2">
              <span className="text-accent">Live</span> Demo
            </SectionLabel>
            <h2 className="font-display text-xl md:text-2xl text-text-primary leading-tight">
              {title}
            </h2>
          </div>
          {resetButton ? <div className="shrink-0">{resetButton}</div> : null}
        </header>

        <div className="bg-surface">{children}</div>
      </div>
    </section>
  );
}
