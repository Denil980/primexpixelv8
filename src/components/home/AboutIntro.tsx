import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Rocket, Star } from 'lucide-react';
import { useCounter } from '../../lib/useCounter';
import { useLiveSiteNumbers } from '../../lib/useAdminData';

function Metric({ target, suffix, label }: { target: number | string; suffix: string; label: string }) {
  const isPureNumber = typeof target === 'number' || (!isNaN(Number(target)) && !isNaN(parseFloat(String(target))));
  const numericVal = isPureNumber ? Number(target) : 0;
  const { value, ref } = useCounter(numericVal);
  const displayVal = isPureNumber ? `${value}${suffix}` : `${target}${suffix}`;
  return (
    <div ref={ref}>
      <div className="font-display text-3xl font-semibold text-app">
        <span className="gradient-text">{displayVal}</span>
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

const pillars = [
  { icon: ShieldCheck, title: 'Enterprise Trust', desc: 'Senior specialists, transparent process and rock-solid delivery.' },
  { icon: Rocket, title: 'Growth Obsessed', desc: 'Every decision tied to revenue, rankings and retention.' },
  { icon: Sparkles, title: 'Handcrafted Craft', desc: 'Premium, pixel-perfect work — never a template.' },
];

export default function AboutIntro() {
  const introStats = useLiveSiteNumbers('About Intro');

  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-0 mesh-glow opacity-30" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left — content */}
        <div>
          <span className="reveal inline-flex items-center gap-2 rounded-full border border-[var(--border)] card-surface px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full gradient-brand" />
            About PrimeXPixel
          </span>

          <h2 className="reveal mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-app sm:text-4xl md:text-[2.7rem]">
            A Mumbai-born growth agency for brands that{' '}
            <span className="gradient-text">refuse to blend in</span>
          </h2>

          <p className="reveal mt-6 max-w-xl text-base leading-relaxed text-muted">
            Since 2019, PrimeXPixel has helped 60+ ambitious businesses across Mumbai and beyond
            look world-class and grow measurably. We pair handcrafted, luxurious design with
            rigorous, revenue-focused strategy — treating every project like it's our own brand
            on the line.
          </p>

          {/* Pillars */}
          <div className="reveal mt-8 space-y-4">
            {pillars.map((p) => (
              <div key={p.title} className="group flex items-start gap-4 rounded-2xl card-surface p-4 transition-all duration-400 hover:-translate-y-0.5 hover:border-[color:var(--color-brand-blue)]">
                <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-colors duration-400 group-hover:border-transparent">
                  <span className="absolute inset-0 gradient-brand opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                  <p.icon className="relative h-5 w-5 text-[color:var(--color-brand-blue)] transition-colors duration-400 group-hover:text-white" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-app">{p.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal mt-8">
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 text-sm font-medium text-white shadow-premium transition-transform duration-300 hover:-translate-y-0.5"
            >
              Learn More About Us
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right — visual card */}
        <div className="reveal relative">
          {/* main glass panel */}
          <div className="relative overflow-hidden rounded-[2rem] card-surface p-8 shadow-premium">
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-40" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full" style={{ background: 'radial-gradient(circle, rgba(5,130,213,0.28), transparent 70%)' }} />

            <div className="relative">
              {/* signature quote */}
              <div className="flex items-center gap-3">
                <img src="/brand/mark-square.png" alt="PrimeXPixel" className="h-11 w-11 object-contain" />
                <div>
                  <div className="font-display text-sm font-semibold text-app">PrimeXPixel</div>
                  <div className="text-xs text-muted">Designing Digital Success</div>
                </div>
              </div>

              <p className="mt-6 font-display text-lg font-medium leading-snug text-app">
                "We exist to make{' '}
                <span className="gradient-text">premium digital growth</span> accessible to
                every ambitious brand."
              </p>

              {/* metrics grid */}
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-[var(--border)] pt-6">
                {introStats.slice(0, 4).map((s: any) => (
                  <Metric
                    key={s.id || s.label}
                    target={s.value}
                    suffix={s.suffix || ''}
                    label={s.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* floating badge — rating */}
          <div className="float-med absolute -right-4 -top-5 hidden items-center gap-2.5 rounded-2xl card-surface px-4 py-3 shadow-premium sm:flex">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand">
              <Star className="h-4 w-4 fill-white text-white" />
            </span>
            <div>
              <div className="font-display text-sm font-semibold text-app">4.9 / 5</div>
              <div className="text-[11px] text-muted">Client rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
