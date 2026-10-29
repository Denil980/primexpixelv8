import { Link } from 'react-router-dom';
import {
  Target,
  Eye,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Rocket,
  PenTool,
  Users,
  Compass,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { useReveal } from '../lib/useReveal';
import { useSEO } from '../lib/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';
import SectionHeading from '../components/SectionHeading';
import CTASection from '../components/CTASection';
import Button from '../components/Button';
import { values, team } from '../lib/data';
import { useCounter } from '../lib/useCounter';
import { useLiveSiteNumbers, useLiveWorks } from '../lib/useAdminData';

function LiveStat({ value, suffix, label }: { value: number | string; suffix: string; label: string }) {
  const numericVal = typeof value === 'number' ? value : parseInt(String(value), 10) || 0;
  const { value: v, ref } = useCounter(numericVal);
  return (
    <div ref={ref} className="text-center group">
      <div className="font-display text-3xl font-semibold gradient-text sm:text-4xl transition-transform duration-300 group-hover:scale-105">
        {v}{suffix}
      </div>
      <div className="mt-1.5 text-xs uppercase tracking-wider text-muted font-medium">{label}</div>
    </div>
  );
}

// Icon mapping for values
const VALUE_ICONS = [PenTool, Users, ShieldCheck, Rocket];

// Verified team bios
const TEAM_BIOS: Record<string, string> = {
  'Saqib Shaikh': 'Leads strategic growth, visual direction and product engineering across client partnerships.',
  'Hanzala Momin': 'Directs high-retention cinematic video editing, motion graphics and visual storytelling.',
  'Affan Khan': 'Oversees commercial camera production, cinematography and on-location studio photography.',
};

export default function About() {
  useReveal();
  const liveStats = useLiveSiteNumbers('About');
  const liveWorks = useLiveWorks();
  const selectedWorks = liveWorks.slice(0, 3);

  useSEO({
    title: 'About PrimeXPixel — Web Design & Marketing Agency in Kurla, Mumbai',
    description:
      'PrimeXPixel is a Mumbai-based digital growth agency founded in 2019, serving Kurla, Bandra, Chembur and businesses across Mumbai with strategy-led websites, branding and marketing.',
    path: '/about',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About PrimeXPixel',
      url: 'https://primexpixel.in/about',
      mainEntity: {
        '@type': 'Organization',
        name: 'PrimeXPixel',
        foundingDate: '2019',
        url: 'https://primexpixel.in/',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kurla East, Mumbai',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
      },
    },
  });

  return (
    <>
      {/* ========================================================= */}
      {/* 1. HERO: Headline, intro, entrance animations & visual     */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden px-6 pb-12 pt-28">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-60" />
        <div className="pointer-events-none absolute inset-0 mesh-glow opacity-60" />
        
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} compact />

        <div className="relative mx-auto mt-10 max-w-4xl text-center sm:mt-14">
          {/* Eyebrow with entrance animation */}
          <div className="animate-hero-up" style={{ animationDelay: '0ms' }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] card-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full gradient-brand" />
              About PrimeXPixel
            </span>
          </div>

          {/* Strong Headline with subtle entrance animation */}
          <h1
            className="animate-hero-up mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-app sm:text-5xl md:text-6xl"
            style={{ animationDelay: '140ms' }}
          >
            We exist to make premium growth <span className="gradient-text">accessible</span>
          </h1>

          {/* Short Intro with subtle entrance animation */}
          <p
            className="animate-hero-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted"
            style={{ animationDelay: '280ms' }}
          >
            PrimeXPixel is a Mumbai-born digital growth agency on a mission to help ambitious brands look world-class
            and grow measurably — pairing handcrafted luxury design with rigorous revenue strategy.
          </p>

          {/* Buttons with subtle entrance animation */}
          <div
            className="animate-hero-up mt-8 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: '400ms' }}
          >
            <Button to="/contact" icon={<ArrowRight className="h-4 w-4" />}>
              Start a Project
            </Button>
            <Button to="/work" variant="outline">
              View Our Work
            </Button>
          </div>
        </div>
      </section>

      {/* Large Brand Visual Showcase with Entrance Animation */}
      <section className="px-6 pb-14 pt-2 -mt-4">
        <div
          className="animate-hero-scale mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border)] card-surface shadow-premium"
          style={{ animationDelay: '480ms' }}
        >
          <div className="relative aspect-[21/9] min-h-[260px] w-full overflow-hidden bg-app-2">
            <img
              src="/brand/monkbless/hero.jpg"
              alt="PrimeXPixel Studio Visual Showcase"
              loading="lazy"
              className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-102"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/brand/work/freshy-hero.jpg';
              }}
            />
            {/* Dark scrim ensuring total contrast across light & dark modes */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 tech-grid opacity-25" />

            {/* High-contrast floating brand badge */}
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8">
              <div className="flex items-center gap-3.5 rounded-2xl bg-black/75 border border-white/20 p-2.5 pr-5 shadow-2xl backdrop-blur-xl">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-white p-1.5 shadow-md">
                  <img src="/brand/mark-square.png" alt="PrimeXPixel Emblem" className="h-full w-full object-contain" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white sm:text-lg leading-tight">
                    PrimeX<span className="gradient-text font-extrabold">Pixel</span> Studio
                  </h3>
                  <p className="text-xs text-white/90 font-medium">Designing Digital Success Since 2019</p>
                </div>
              </div>

              <div className="hidden rounded-full border border-white/20 bg-black/75 px-4 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl sm:flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[color:var(--color-brand-green)] animate-pulse" />
                <span>Mumbai • Kurla • Global Partnerships</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. OUR STORY: Scroll-Reveal side-by-side animation        */}
      {/* ========================================================= */}
      <section className="px-6 py-20 overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          {/* Left Text: Smooth scroll reveal from left */}
          <div className="reveal-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] card-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full gradient-brand" />
              Our Story
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-app md:text-4xl">
              Built from a frustration with <span className="gradient-text">mediocre agencies</span>
            </h2>

            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted">
              <div className="rounded-2xl card-surface p-5 border border-[var(--border)] hover:border-[color:var(--color-brand-blue)] transition-colors">
                <h3 className="font-display text-base font-semibold text-app mb-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full gradient-brand" />
                  Who We Are
                </h3>
                <p className="text-sm">
                  PrimeXPixel is a Mumbai-born digital growth agency combining UI/UX design, performance engineering,
                  and revenue-driven marketing under one roof. We partner with ambitious brands across India and globally
                  to turn attention into measurable pipeline.
                </p>
              </div>

              <div className="rounded-2xl card-surface p-5 border border-[var(--border)] hover:border-[color:var(--color-brand-blue)] transition-colors">
                <h3 className="font-display text-base font-semibold text-app mb-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full gradient-brand" />
                  Why We Started
                </h3>
                <p className="text-sm">
                  We started in 2019 with a simple observation: most agencies either delivered beautiful work that failed
                  to convert, or chased vanity metrics with cheap-looking templates. Rarely both, done well. We set out
                  to build the agency we wished existed — one that pairs handcrafted luxury aesthetics with rigorous conversion strategy.
                </p>
              </div>

              <div className="rounded-2xl card-surface p-5 border border-[var(--border)] hover:border-[color:var(--color-brand-blue)] transition-colors">
                <h3 className="font-display text-base font-semibold text-app mb-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full gradient-brand" />
                  What We Believe In
                </h3>
                <p className="text-sm">
                  We believe craft matters. We treat every client's project like our own brand is on the line — no shortcuts,
                  no outsourced compromises, and complete transparency on the numbers that actually drive growth.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image Card: Smooth scroll reveal from right */}
          <div className="reveal-right relative">
            <div className="relative overflow-hidden rounded-[2rem] card-surface p-7 sm:p-8 shadow-premium">
              <div className="pointer-events-none absolute inset-0 tech-grid opacity-35" />
              <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] aspect-[4/3] mb-6 shadow-md">
                <img
                  src="/brand/work/mumtaz-hajj-umrah-hero.jpg"
                  alt="PrimeXPixel Craftsmanship and Team Execution"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/brand/work/freshy-cover.jpg';
                  }}
                />
              </div>

              <div className="relative rounded-2xl gradient-brand p-6 text-white shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
                <p className="mt-3 font-display text-lg font-medium leading-snug">
                  "Designing Digital Success" isn't a marketing slogan — it's the standard against which we measure every design, line of code, and campaign.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. MISSION AND VALUES: Icon cards with hover effects      */}
      {/* ========================================================= */}
      <section className="bg-app-2 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Mission & Values"
            title="Principles that"
            highlight="guide our craft"
            sub="How we think, how we build, and the relentless standards you can rely on."
          />

          {/* Mission & Vision Cards */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                text: 'To help ambitious businesses grow through digital experiences that are as effective as they are beautiful — measurable, premium, and built to scale for years.',
              },
              {
                icon: Eye,
                title: 'Our Vision',
                text: 'To become the most trusted digital growth partner for brands that refuse to blend in — setting the standard for what a modern agency can be.',
              },
            ].map((c) => (
              <div
                key={c.title}
                className="reveal group rounded-2xl card-surface p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-[color:var(--color-brand-blue)] shadow-premium"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl gradient-brand shadow-premium transition-transform duration-300 group-hover:scale-110">
                  <c.icon className="h-6 w-6 text-white" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-app group-hover:gradient-text transition-colors">
                  {c.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Values Grid */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <div
                  key={v.title}
                  className="reveal group rounded-2xl card-surface p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[color:var(--color-brand-green)] shadow-premium"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-bold gradient-text">0{i + 1}</span>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-app border border-[var(--border)] text-[color:var(--color-brand-green)] transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-app group-hover:text-[color:var(--color-brand-green)] transition-colors">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. NUMBERS: Animated counters from Admin Panel            */}
      {/* ========================================================= */}
      <section className="px-6 py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 mesh-glow opacity-30" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="By The Numbers"
            title="Real impact,"
            highlight="proven metrics"
            sub="Every counter reflects real businesses elevated and verified milestones achieved."
          />

          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {liveStats.slice(0, 4).map((s) => (
              <div
                key={s.id || s.label}
                className="reveal relative overflow-hidden rounded-2xl card-surface p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-brand-blue)] shadow-premium"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 gradient-brand" />
                <LiveStat value={s.value} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. TEAM: Photo cards with name, role and short line       */}
      {/* ========================================================= */}
      <section className="bg-app-2 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="The Team"
            title="Specialists who"
            highlight="sweat the details"
            sub="A dedicated team of senior specialists — hands-on builders who treat your brand like their own."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <div
                key={m.name}
                className="reveal group rounded-2xl border border-[var(--border)] card-surface p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[color:var(--color-brand-blue)] shadow-premium"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Photo / Avatar */}
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-2xl shadow-premium mb-5">
                  <div
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${m.hue}, #07111D)` }}
                  />
                  <div className="absolute inset-0 grid place-items-center font-display text-3xl font-bold text-white">
                    {m.initials}
                  </div>
                  <div className="absolute inset-0 tech-grid opacity-30" />
                </div>

                <h3 className="font-display text-lg font-semibold text-app">{m.name}</h3>
                <span className="inline-block mt-1.5 rounded-full bg-[var(--surface-solid)] border border-[var(--border)] px-3 py-0.5 text-xs font-semibold text-[color:var(--color-brand-blue)]">
                  {m.role}
                </span>

                <p className="mt-3 text-xs leading-relaxed text-muted">
                  {TEAM_BIOS[m.name] || 'Senior specialist dedicated to client success and exceptional execution.'}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal mt-12 flex items-center justify-center gap-3 rounded-2xl card-surface p-6">
            <Award className="h-6 w-6 text-[color:var(--color-brand-green)] shrink-0" />
            <p className="text-sm text-muted">
              <span className="font-semibold text-app">Recognised excellence</span> — trusted by funded startups,
              enterprises, and ambitious local brands across Mumbai and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. OUR WORK PREVIEW: Selected projects with link to see all */}
      {/* ========================================================= */}
      {selectedWorks.length > 0 && (
        <section className="px-6 py-20 border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-brand-blue)]">
                  Portfolio Spotlight
                </span>
                <h2 className="mt-3 font-display text-3xl font-semibold text-app md:text-4xl">
                  Work that speaks for <span className="gradient-text">itself</span>
                </h2>
              </div>
              <Link
                to="/work"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-brand-blue)] hover:underline"
              >
                <span>View all projects</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {selectedWorks.map((work) => {
                const cover = (work as any).coverImage || (work as any).image;
                return (
                  <Link
                    key={work.slug}
                    to={`/work/${work.slug}`}
                    className="reveal group overflow-hidden rounded-2xl border border-[var(--border)] card-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-[color:var(--color-brand-blue)] shadow-premium flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-app">
                      {cover ? (
                        <img
                          src={cover}
                          alt={work.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/brand/mark-square.png';
                          }}
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-black/20 text-dim text-xs">
                          {work.title}
                        </div>
                      )}
                      <span className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white">
                        {work.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] text-dim">{work.client}</span>
                        <h3 className="font-display text-base font-semibold text-app mt-0.5 group-hover:gradient-text transition-colors">
                          {work.title}
                        </h3>
                      </div>
                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs text-muted">
                        <span>Case Study</span>
                        <ExternalLink className="h-3.5 w-3.5 text-[color:var(--color-brand-blue)]" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Button to="/work" variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
                Browse All Case Studies
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 7. CALL TO ACTION: Clear "Start a project" / Contact us    */}
      {/* ========================================================= */}
      <CTASection />
    </>
  );
}
