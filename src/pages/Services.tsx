import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReveal } from '../lib/useReveal';
import { useSEO } from '../lib/useSEO';
import PageHero from '../components/PageHero';
import CTASection from '../components/CTASection';
import FAQ from '../components/FAQ';
import SectionHeading from '../components/SectionHeading';
import { useLiveServices } from '../lib/useAdminData';
import { renderLucideIcon } from '../admin/components/IconPicker';

export default function Services() {
  useReveal();
  const services = useLiveServices();

  useSEO({
    title: 'Website Development, Digital Marketing & UI/UX Design Services | PrimeXPixel Mumbai',
    description: 'Website development, ecommerce, UI/UX design, branding, video editing and digital marketing services for businesses in Kurla, Mumbai and beyond. Free consultation.',
    path: '/services',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: services.map((s: any, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'Service', name: s.title, description: s.desc || s.shortDesc, url: `https://primexpixel.in/services/${s.slug}` },
      })),
    },
  });

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Our Services' }]}
        eyebrow="Our Services"
        title="Everything you need to"
        highlight="grow online"
        sub="Eleven deeply-integrated capabilities. Pick one below for the full breakdown — process, technologies, and what's included."
      />

      <section className="px-6 pb-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s: any, i: number) => {
              const tint = i % 2 === 0 ? 'rgba(5,130,213,0.16)' : 'rgba(151,199,61,0.16)';
              return (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="group reveal relative flex flex-col overflow-hidden rounded-2xl card-surface p-7 transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full transition-transform duration-700 group-hover:scale-125"
                    style={{ background: `radial-gradient(circle, ${tint}, transparent 70%)` }}
                  />
                  <span className="relative grid h-12 w-12 place-items-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface)]">
                    {typeof s.icon === 'string' ? (
                      renderLucideIcon(s.icon, 'h-5 w-5 text-[color:var(--color-brand-blue)]')
                    ) : s.icon ? (
                      <s.icon className="h-5 w-5 text-[color:var(--color-brand-blue)]" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-[color:var(--color-brand-blue)]" />
                    )}
                  </span>
                  <h3 className="relative mt-6 font-display text-xl font-semibold text-app">{s.title}</h3>
                  <p className="relative mt-2 text-sm text-muted">{s.tagline}</p>
                  <ul className="relative mt-5 space-y-2">
                    {(s.highlights || []).slice(0, 3).map((h: string) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-muted">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[color:var(--color-brand-green)]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <span className="relative mt-6 flex items-center gap-2 border-t border-[var(--border)] pt-4 text-sm font-medium gradient-text">
                    View Full Details <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case study strip */}
      <section className="mt-10 bg-app-2 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Proof" title="What this looks like" highlight="in practice" sub="A snapshot of the measurable outcomes our services deliver." />
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              { v: '+218%', l: 'Average traffic growth' },
              { v: '+180%', l: 'Average conversion lift' },
              { v: '4.8x', l: 'Average return on ad spend' },
            ].map((r) => (
              <div key={r.l} className="reveal rounded-2xl card-surface p-8 text-center">
                <div className="font-display text-4xl font-semibold gradient-text">{r.v}</div>
                <div className="mt-2 text-sm text-muted">{r.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="FAQ"
            title="FAQ (Frequently Asked"
            highlight="Questions)"
            sub="Common inquiries regarding our digital services, delivery timelines, and project scopes."
          />
          <div className="mt-14"><FAQ /></div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
