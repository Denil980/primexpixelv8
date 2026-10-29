import type { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';

interface Props {
  eyebrow: string; title: string; highlight?: string; sub: string; children?: ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
}

export default function PageHero({ eyebrow, title, highlight, sub, children, breadcrumbs }: Props) {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-28">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-60" />
      <div className="pointer-events-none absolute inset-0 mesh-glow opacity-60" />
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} compact />}
      <div className="relative mx-auto mt-10 max-w-4xl text-center sm:mt-14">
        <span className="reveal inline-flex items-center gap-2 rounded-full border border-[var(--border)] card-surface px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full gradient-brand" />
          {eyebrow}
        </span>
        <h1 className="reveal mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-app sm:text-5xl md:text-6xl">
          {title} {highlight && <span className="gradient-text">{highlight}</span>}
        </h1>
        <p className="reveal mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">{sub}</p>
        {children && <div className="reveal mt-8">{children}</div>}
      </div>
    </section>
  );
}
