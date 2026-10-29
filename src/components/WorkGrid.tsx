import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { type WorkCategory } from '../lib/data';
import { useLiveWorks } from '../lib/useAdminData';

const filters: (WorkCategory | 'All')[] = ['All', 'Website', 'UI/UX', 'Logo', 'Social Media', 'Video Editing'];

export default function WorkGrid({ limit }: { limit?: number }) {
  const [active, setActive] = useState<WorkCategory | 'All'>('All');
  const workItems = useLiveWorks();
  const items = workItems.filter((w: any) => active === 'All' || w.category === active).slice(0, limit ?? workItems.length);

  return (
    <div>
      <div className="reveal flex flex-wrap justify-center gap-2.5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              active === f ? 'gradient-brand text-white shadow-premium' : 'card-surface text-muted hover:text-app'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((w) => (
          <Link key={w.slug} to={`/work/${w.slug}`} className="reveal group relative flex flex-col overflow-hidden rounded-2xl card-surface transition-all duration-500 hover:-translate-y-1.5">
            <div className="relative aspect-[675/620] overflow-hidden">
              {w.image ? (
                <img src={w.image} alt={w.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : w.detail ? (
                <img src={w.detail.cover} alt={w.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <>
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ background: `linear-gradient(135deg, ${w.hue}, #07111D)` }} />
                  <div className="absolute inset-0 tech-grid opacity-40" />
                  {/* mock browser */}
                  <div className="absolute inset-x-6 bottom-0 top-8 rounded-t-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                    <div className="flex gap-1 p-2.5">
                      <span className="h-2 w-2 rounded-full bg-white/40" />
                      <span className="h-2 w-2 rounded-full bg-white/40" />
                      <span className="h-2 w-2 rounded-full bg-white/40" />
                    </div>
                    <div className="space-y-2 px-4">
                      <div className="h-2.5 w-2/3 rounded-full bg-white/30" />
                      <div className="h-2 w-full rounded-full bg-white/15" />
                      <div className="h-2 w-4/5 rounded-full bg-white/15" />
                      <div className="mt-3 flex gap-2"><div className="h-8 w-20 rounded-lg bg-white/30" /><div className="h-8 w-14 rounded-lg bg-white/15" /></div>
                    </div>
                  </div>
                </>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-400 group-hover:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-medium text-white">View Case Study <ArrowUpRight className="h-4 w-4" /></span>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-muted">{w.category}</span>
                <span className="text-xs text-dim">{w.client}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-app">{w.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{w.outcome}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(w.results || []).map((r: any) => (
                  <span key={r.label} className="rounded-lg bg-[var(--surface)] px-2.5 py-1.5 text-xs">
                    <span className="font-semibold gradient-text">{r.value}</span> <span className="text-dim">{r.label}</span>
                  </span>
                ))}
              </div>
              <div className="mt-5 text-xs text-[color:var(--color-brand-blue)] group-hover:underline">View Full Case Study →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
