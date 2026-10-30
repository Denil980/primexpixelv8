import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowUpRight, CheckCircle2, Target, UserCog, Workflow,
  Palette, Layers, Sparkles, TrendingUp, MessageCircle,
} from 'lucide-react';
import { useReveal } from '../lib/useReveal';
import { useSEO, SITE } from '../lib/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';
import CTASection from '../components/CTASection';
import Button from '../components/Button';
import { useLiveWorksWithState } from '../lib/useAdminData';

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-app">
      {children}
    </span>
  );
}

function Block({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="reveal">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl gradient-brand shadow-premium">
          <Icon className="h-5 w-5 text-white" />
        </span>
        <h2 className="font-display text-2xl font-semibold text-app">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function WorkDetail() {
  useReveal();
  const { slug } = useParams();
  const { data: workItems, loading } = useLiveWorksWithState();
  const item = workItems.find((w: any) => w.slug === slug);
  const related = workItems.filter((w: any) => w.slug !== slug).slice(0, 3);

  useSEO({
    title: item ? `${item.title} — Case Study | PrimexPixel` : 'Case Study | PrimexPixel',
    description: item ? `${item.title}: ${item.outcome}` : '',
    path: `/work/${slug}`,
    image: item?.detail?.cover,
    type: 'article',
    jsonLd: item
      ? {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: item.title,
          about: item.detail?.subtitle || item.title,
          creator: { '@type': 'Organization', name: 'PrimexPixel' },
          url: `${SITE}/work/${item.slug}`,
        }
      : undefined,
  });

  if (!item && loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--color-brand-blue)] border-t-transparent" />
        <p className="mt-4 text-xs text-muted">Loading case study...</p>
      </div>
    );
  }

  if (!item) return <Navigate to="/work" replace />;
  const d = item.detail;

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Work', to: '/work' }, { label: item.title }]} />

      {/* Hero */}
      <header className="px-6 pt-8">
        <div className="mx-auto max-w-5xl">
          <span className="reveal inline-flex items-center gap-2 rounded-full border border-[var(--border)] card-surface px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full gradient-brand" /> Case Study
          </span>
          <h1 className="reveal mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-app md:text-6xl">
            {item.title}
          </h1>
          {d && <p className="reveal mt-3 font-display text-lg text-muted md:text-xl">{d.subtitle}</p>}

          {/* quick results */}
          <div className="reveal mt-7 flex flex-wrap gap-3">
            {(item.results || []).map((r: any) => (
              <span key={r.label} className="rounded-xl bg-[var(--surface)] px-4 py-2.5 text-sm">
                <span className="font-display font-semibold gradient-text">{r.value}</span>{' '}
                <span className="text-muted">{r.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* cover image */}
        <div className="reveal mx-auto mt-10 max-w-6xl">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] shadow-premium">
            {d ? (
              <img src={d.cover} alt={item.title} className="w-full object-cover" />
            ) : (
              <div className="relative h-64 md:h-96" style={{ background: `linear-gradient(135deg, ${item.hue}, #07111D)` }}>
                <div className="absolute inset-0 tech-grid opacity-40" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-14">
            {/* Overview */}
            <Block icon={Layers} title="Overview">
              <p className="text-base leading-relaxed text-muted">{d?.overview || item.approach}</p>
            </Block>

            {/* Challenge */}
            <Block icon={Target} title="Challenge">
              <p className="text-base leading-relaxed text-muted">{item.challenge}</p>
            </Block>

            {/* Goals */}
            {d?.goals && d.goals.length > 0 && (
              <Block icon={CheckCircle2} title="Goals">
                <div className="grid gap-3 sm:grid-cols-2">
                  {d.goals!.map((g: string) => (
                    <div key={g} className="flex items-center gap-3 rounded-xl card-surface px-4 py-3 text-sm text-app">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full gradient-brand">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </span>
                      {g}
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {/* Roles */}
            {d?.roles && d.roles.length > 0 && (
              <Block icon={UserCog} title="My Role">
                <div className="flex flex-wrap gap-2.5">{d.roles!.map((r: string) => <Chip key={r}>{r}</Chip>)}</div>
              </Block>
            )}

            {/* Process */}
            {d?.process && d.process.length > 0 && (
              <Block icon={Workflow} title="Design Process">
                <div className="flex flex-wrap gap-2.5">{d.process!.map((p: string) => <Chip key={p}>{p}</Chip>)}</div>
                <p className="mt-5 text-sm leading-relaxed text-muted">
                  Low-fidelity layouts were created to organize navigation, product discovery, promotional
                  sections, testimonials, FAQs, and the checkout flow before visual design.
                </p>
              </Block>
            )}

            {/* Visual design / palette */}
            {d && d.palette && d.palette.length > 0 && (
              <Block icon={Palette} title="Visual Design">
                <p className="text-sm leading-relaxed text-muted">The interface follows a premium organic aesthetic built on a cohesive palette:</p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {d.palette.map((c: any) => (
                    <div key={c.name} className="overflow-hidden rounded-2xl card-surface">
                      <div className="h-20 w-full" style={{ background: c.hex }} />
                      <div className="p-3">
                        <div className="text-sm font-medium text-app">{c.name}</div>
                        <div className="text-xs uppercase text-dim">{c.hex}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {/* Full gallery */}
            {d?.gallery?.length ? (
              <section className="reveal space-y-6">
                {d.gallery.map((src: string) => (
                  <div key={src} className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] shadow-premium">
                    <img src={src} alt={`${item.title} showcase`} loading="lazy" className="w-full object-cover" />
                  </div>
                ))}
              </section>
            ) : null}

            {/* Key features */}
            {d?.features && d.features.length > 0 && (
              <Block icon={Sparkles} title="Key Features">
                <div className="grid gap-3 sm:grid-cols-2">
                  {d.features!.map((f: string) => (
                    <div key={f} className="flex items-center gap-3 rounded-xl card-surface px-4 py-3 text-sm text-app">
                      <span className="h-1.5 w-1.5 rounded-full gradient-brand" /> {f}
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {/* Highlights */}
            {d?.highlights && d.highlights.length > 0 && (
              <Block icon={CheckCircle2} title="Design Highlights">
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {d.highlights!.map((h: string) => (
                    <div key={h} className="flex items-center gap-2.5 text-sm text-app">
                      <CheckCircle2 className="h-4 w-4 text-[color:var(--color-brand-green)]" /> {h}
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {/* Results */}
            <Block icon={TrendingUp} title="Results">
              {d?.resultsList && d.resultsList.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {d.resultsList!.map((r: string) => (
                    <div key={r} className="flex items-center gap-3 rounded-xl card-surface px-4 py-3 text-sm text-app">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full gradient-brand">
                        <TrendingUp className="h-3 w-3 text-white" />
                      </span>
                      {r}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base leading-relaxed text-muted">{item.outcome}</p>
              )}
            </Block>
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="reveal rounded-[1.5rem] card-surface p-6 shadow-premium">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-app">Project Overview</h3>
              <dl className="mt-5 space-y-4">
                {(d?.meta || [{label:'Client', value:item.client},{label:'Category', value:item.category}]).map((m: any) => (
                  <div key={m.label} className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                    <dt className="text-sm text-muted">{m.label}</dt>
                    <dd className="text-right text-sm font-medium text-app">{m.value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-7 font-display text-sm font-semibold uppercase tracking-wider text-app">Technologies</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {(item.tech || []).map((t: string) => (
                  <span key={t} className="rounded-lg bg-[var(--surface)] px-3 py-1.5 text-xs text-muted">{t}</span>
                ))}
              </div>

              <div className="mt-7 space-y-3">
                <Button to="/contact" className="w-full">Start a Similar Project</Button>
                <Button href="https://wa.me/919892369965?text=Hi%20PrimeXPixel%2C%20I%27d%20like%20a%20free%20consultation" variant="outline" className="w-full" icon={<MessageCircle className="h-4 w-4" />}>Chat on WhatsApp</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related */}
      <section className="px-6 pb-4">
        <div className="mx-auto max-w-6xl">
          <div className="reveal flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-app">More work</h2>
            <Link to="/work" className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-brand-blue)]">
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((w) => (
              <Link key={w.slug} to={`/work/${w.slug}`} className="reveal group flex flex-col overflow-hidden rounded-2xl card-surface transition-all duration-500 hover:-translate-y-1.5">
                <div className="relative h-40 overflow-hidden">
                  {w.detail ? (
                    <img src={w.detail.cover} alt={w.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${w.hue}, #101C2D)` }} />
                  )}
                  <div className="absolute inset-0 tech-grid opacity-25" />
                  <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">{w.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-base font-semibold text-app transition-colors group-hover:gradient-text">{w.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{w.outcome}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-brand-blue)]">
                    View Case Study <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
