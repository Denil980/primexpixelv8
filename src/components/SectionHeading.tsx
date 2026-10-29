interface Props { eyebrow?: string; title: string; highlight?: string; sub?: string; center?: boolean; }

export default function SectionHeading({ eyebrow, title, highlight, sub, center = true }: Props) {
  return (
    <div className={`reveal max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] card-surface px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full gradient-brand" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-app sm:text-4xl md:text-5xl">
        {title} {highlight && <span className="gradient-text">{highlight}</span>}
      </h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}
