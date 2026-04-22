import type { Project } from '@/data/projects';
import { digestCategories, digestDate } from './digest';

interface AINewsAgentDemoProps {
  project: Project;
}

const BADGES = ['Local LLM', 'AI Agent', 'Autonomous'];

interface PipelineStep {
  kind: 'python' | 'llm' | 'trigger' | 'output';
  glyph: string;
  label: string;
  detail: string;
  caption?: string;
}

const PIPELINE: PipelineStep[] = [
  {
    kind: 'trigger',
    glyph: '⏰',
    label: 'Scheduler',
    detail: 'Fires daily at 07:00',
    caption: 'No human input. Runs while the machine is on.',
  },
  {
    kind: 'python',
    glyph: '📡',
    label: 'Fetch',
    detail: 'RSS · 8 categories · ~20 sources',
  },
  {
    kind: 'python',
    glyph: '🧹',
    label: 'Dedupe & filter',
    detail: 'Drop duplicates and anything older than 24h',
  },
  {
    kind: 'llm',
    glyph: '🧠',
    label: 'AI Pass 1 · per article',
    detail: 'llama3.2-3b via Ollama',
    caption: 'Agent decides: relevance 1-10, 2-sentence summary, category.',
  },
  {
    kind: 'python',
    glyph: '🔍',
    label: 'Rank & slice',
    detail: 'Top 7 per category, sorted by score',
  },
  {
    kind: 'llm',
    glyph: '🧠',
    label: 'AI Pass 2 · category overview',
    detail: 'llama3.2-3b via Ollama',
    caption: 'Editorial voice. Morning-Brew tone. One overview per category.',
  },
  {
    kind: 'output',
    glyph: '💾',
    label: 'Write to Obsidian Vault',
    detail: '/Daily-Digest/YYYY-MM-DD.md + /Raw/*.md',
  },
  {
    kind: 'output',
    glyph: '📧',
    label: 'Email & push notification',
    detail: 'Gmail SMTP + ntfy.sh',
  },
];

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 theme-pill font-mono text-[11px] uppercase tracking-[0.14em]">
      <span className="h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
      {label}
    </span>
  );
}

function PipelineNode({ step, isLast }: { step: PipelineStep; isLast: boolean }) {
  const isLLM = step.kind === 'llm';
  const isTrigger = step.kind === 'trigger';
  const accentBorder = isLLM || isTrigger;

  return (
    <div className="relative">
      <div
        className="relative theme-card p-4 md:p-5"
        style={
          accentBorder
            ? {
                borderColor: 'var(--accent)',
              }
            : undefined
        }
      >
        <div className="flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5" aria-hidden="true">
            {step.glyph}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="font-mono text-[12px] uppercase tracking-[0.14em] text-text-primary">
                {step.label}
              </h4>
              {isLLM ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent border border-accent px-1.5 py-0.5">
                  Local LLM
                </span>
              ) : null}
              {isTrigger ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent border border-accent px-1.5 py-0.5">
                  Autonomous
                </span>
              ) : null}
            </div>
            <p className="font-mono text-[12px] text-text-secondary leading-relaxed">
              {step.detail}
            </p>
            {step.caption ? (
              <p className="mt-2 font-mono text-[11px] italic text-text-secondary leading-relaxed">
                {step.caption}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      {!isLast ? (
        <div
          className="flex justify-center"
          aria-hidden="true"
        >
          <div className="w-px h-5 bg-border" />
        </div>
      ) : null}
    </div>
  );
}

function GmailHeader() {
  return (
    <div className="border-b border-border px-5 md:px-7 py-4 bg-surface">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: 'var(--accent)' }} aria-hidden="true" />
          <span className="h-3 w-3 rounded-full border border-border" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full border border-border" aria-hidden="true" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
          Gmail · Inbox
        </p>
      </div>
      <h3 className="font-display text-xl md:text-2xl text-text-primary leading-tight">
        Daily Digest — {digestDate.pretty}
      </h3>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[11px] text-text-secondary">
        <span>
          <span className="text-text-primary">News Digest Agent</span>{' '}
          &lt;digest-agent@local&gt;
        </span>
        <span>07:04 AM</span>
      </div>
      <div className="mt-1 font-mono text-[11px] text-text-secondary">
        to me
      </div>
    </div>
  );
}

function DigestArticleBlock({
  title,
  url,
  summary,
}: {
  title: string;
  url: string;
  summary: string;
}) {
  return (
    <div className="mb-5">
      <p className="font-mono text-[13px] leading-relaxed text-text-primary">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-text-primary hover:text-accent"
        >
          {title}
        </a>
      </p>
      <p className="mt-1 font-mono text-[13px] leading-relaxed text-text-secondary">
        {summary}
      </p>
    </div>
  );
}

function DigestBody() {
  return (
    <div className="px-5 md:px-7 py-6 bg-surface">
      <p className="font-mono text-[13px] leading-relaxed text-text-primary mb-6">
        Morning. Here is what moved across your sources in the last 24 hours,
        grouped and ranked locally.
      </p>

      {digestCategories.map((cat, idx) => (
        <section key={cat.name} className={idx === 0 ? '' : 'mt-7'}>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-1.5 w-6 bg-accent shrink-0" aria-hidden="true" />
            <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-primary">
              {cat.name}
            </h4>
          </div>
          <p className="font-mono text-[12px] italic text-text-secondary leading-relaxed mb-4">
            {cat.overview}
          </p>

          {cat.top.map((art) => (
            <DigestArticleBlock
              key={art.url + art.title}
              title={art.title}
              url={art.url}
              summary={art.summary}
            />
          ))}

          {cat.alsoNotable.length > 0 ? (
            <div className="mt-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-primary mb-2">
                Also Notable
              </p>
              <ul className="space-y-1.5">
                {cat.alsoNotable.map((item) => (
                  <li key={item.url + item.title} className="font-mono text-[12px] leading-relaxed text-text-secondary">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-primary hover:text-accent font-semibold"
                    >
                      {item.title}
                    </a>
                    : {item.shortSummary}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-6 h-px bg-border" aria-hidden="true" />
        </section>
      ))}

      <p className="mt-6 font-mono text-[11px] italic text-text-secondary leading-relaxed">
        — Generated locally. No cloud APIs touched. Raw articles archived to Obsidian.
      </p>
    </div>
  );
}

function ContentSection({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-text-primary mb-4 pb-3 border-b border-border/50">
        <span className="text-accent">{title}</span>
      </h2>
      <p className="font-mono text-sm text-text-secondary leading-relaxed">{body}</p>
    </div>
  );
}

export default function AINewsAgentDemo({ project }: AINewsAgentDemoProps) {
  const content = project.content;

  return (
    <section className="section-container grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-14 items-start">
      {/* Left: Gmail showcase */}
      <div className="lg:col-span-7 w-full lg:sticky lg:top-28">
        <div className="theme-card overflow-hidden">
          <GmailHeader />
          <div className="max-h-[720px] overflow-y-auto">
            <DigestBody />
          </div>
        </div>
        <p className="mt-3 font-mono text-[11px] text-text-secondary leading-relaxed">
          Sample digest from a real run. Source links are illustrative.
        </p>
      </div>

      {/* Right: badges, how it works, pipeline, content blocks */}
      <div className="lg:col-span-5 w-full space-y-10 md:space-y-12">
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            {BADGES.map((b) => (
              <Badge key={b} label={b} />
            ))}
          </div>
          <h2 className="font-display text-2xl text-text-primary mb-4 pb-3 border-b border-border/50">
            <span className="text-accent">How it works</span>
          </h2>
          <p className="font-mono text-sm text-text-secondary leading-relaxed">
            Every morning at 7am the agent wakes itself up, pulls RSS across eight
            topic categories, and runs a two-pass local LLM pipeline on my laptop — no
            cloud, no API keys, no per-token costs. The first pass scores and
            summarizes each article with <span className="text-text-primary">llama3.2-3b via Ollama</span>,
            the second writes a Morning-Brew-style category overview from the top-ranked
            items. The agent then archives raw articles into my Obsidian vault,
            writes the compiled digest as a daily note, and emails it to me with a
            push notification before I open the laptop.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-text-primary mb-4 pb-3 border-b border-border/50">
            <span className="text-accent">Pipeline</span>
          </h2>
          <div className="flex flex-col">
            {PIPELINE.map((step, i) => (
              <PipelineNode
                key={step.label}
                step={step}
                isLast={i === PIPELINE.length - 1}
              />
            ))}
          </div>
        </div>

        {content ? (
          <>
            <ContentSection title="The Problem" body={content.problem} />
            <ContentSection title="What I Built" body={content.whatIBuilt} />
            <ContentSection title="My Role" body={content.myRole} />
            <ContentSection title="Concrete Outcome" body={content.outcome} />
          </>
        ) : null}
      </div>
    </section>
  );
}
