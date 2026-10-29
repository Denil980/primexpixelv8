import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useReveal } from '../lib/useReveal';
import PageHero from '../components/PageHero';
import CTASection from '../components/CTASection';
import SectionHeading from '../components/SectionHeading';
import LogoWall from '../components/LogoWall';
import { useLiveWorks } from '../lib/useAdminData';
import { useSEO } from '../lib/useSEO';

export default function Work() {
  useReveal();
  const workItems = useLiveWorks();
  useSEO({
    title: 'Our Work — Website Design & Branding Portfolio | PrimeXPixel Mumbai',
    description: 'Explore case studies from PrimeXPixel — websites, branding and marketing engagements delivered for businesses across Kurla, Bandra, Chembur and Mumbai.',
    path: '/work',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'PrimeXPixel Portfolio',
      url: 'https://primexpixel.in/work',
      hasPart: workItems.map((w) => ({ '@type': 'CreativeWork', name: w.title, url: `https://primexpixel.in/work/${w.slug}` })),
    },
  });
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Work' }]}
        eyebrow="Selected Work"
        title="Case studies that"
        highlight="prove the point"
        sub="Every engagement below started with a real business challenge. Explore the approach, the technology and the measurable results."
      />

      <section className="px-6 pb-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {workItems.map((w, i) => (
            <div key={w.slug} className="reveal group grid gap-0 overflow-hidden rounded-[1.75rem] card-surface lg:grid-cols-2 lg:aspect-[1350/620]" style={{ transitionDelay: `${i * 40}ms` }}>
              {/* visual */}
              <Link to={`/work/${w.slug}`} className={`relative block h-full min-h-[300px] overflow-hidden ${i % 2 ? 'lg:order-2' : ''}`}>
                {w.image ? (
                  <>
                    <img src={w.image} alt={w.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </>
                ) : w.detail ? (
                  <>
                    <img src={w.detail.cover} alt={w.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ background: `linear-gradient(135deg, ${w.hue}, #07111D)` }} />
                    <div className="absolute inset-0 tech-grid opacity-40" />
                    <div className="absolute inset-x-10 bottom-0 top-14 rounded-t-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <div className="flex gap-1.5 pb-4">
                        <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                      </div>
                      <div className="space-y-2.5">
                        <div className="h-3 w-1/2 rounded-full bg-white/40" />
                        <div className="h-2.5 w-full rounded-full bg-white/15" />
                        <div className="h-2.5 w-5/6 rounded-full bg-white/15" />
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {(w.results || []).map((r: any) => (
                            <div key={r.label} className="rounded-lg bg-white/10 p-2.5 text-center">
                              <div className="font-display text-sm font-semibold text-white">{r.value}</div>
                              <div className="text-[10px] text-white/60">{r.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-400 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-medium text-white">View Case Study <ArrowUpRight className="h-4 w-4" /></span>
                </div>
              </Link>
              {/* content */}
              <div className="flex flex-col justify-center overflow-hidden p-6 md:p-8 lg:p-9">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-muted">{w.category}</span>
                  <span className="text-xs text-dim">{w.client}</span>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold text-app md:text-2xl">{w.title}</h2>
                <div className="mt-4 space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-brand-blue)]">Challenge</h4>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{w.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-brand-green)]">Approach</h4>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{w.approach}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-app">Outcome</h4>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{w.outcome}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(w.tech || []).slice(0, 4).map((t: string) => (
                    <span key={t} className="rounded-lg bg-[var(--surface)] px-3 py-1.5 text-xs text-muted">{t}</span>
                  ))}
                </div>
                <Link to={`/work/${w.slug}`} className="group/link mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-brand-blue)]">
                  View Full Case Study
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 bg-app-2 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Trusted By" title="Brands across" highlight="every stage" sub="From seed-stage startups to established enterprises." />
          <LogoWall />
        </div>
      </section>

      <CTASection />
    </>
  );
}
