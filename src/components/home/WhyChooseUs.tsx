import { features } from '../../lib/data';

const [lead, ...restFeatures] = features;
const leadTwo = restFeatures[0];
const compact = restFeatures.slice(1);

const pillars = [
  { f: lead, hue: '#0582D5', tint: 'rgba(5,130,213,0.18)' },
  { f: leadTwo, hue: '#97C73D', tint: 'rgba(151,199,61,0.18)' },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-app-2 px-6 py-24">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" />
      <div className="relative mx-auto max-w-6xl">
        <div className="reveal max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] card-surface px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full gradient-brand" />
            Why PrimeXPixel
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-app sm:text-4xl md:text-5xl">
            Built for brands that <span className="gradient-text">refuse to blend in</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Two pillars we never compromise on, and four capabilities that put them into practice.
          </p>
        </div>

        {/* Twin pillars — brand blue + brand green */}
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {pillars.map(({ f, hue, tint }) => {
            const Icon = f.icon;
            return (
              <article
                key={f.title}
                className="reveal group relative overflow-hidden rounded-[1.75rem] card-surface p-8 transition-all duration-500 hover:-translate-y-1.5 md:p-10"
              >
                <div
                  className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full transition-transform duration-700 group-hover:scale-125"
                  style={{ background: `radial-gradient(circle, ${tint}, transparent 70%)` }}
                />
                <span
                  className="relative grid h-14 w-14 place-items-center rounded-2xl border border-[var(--border-strong)]"
                  style={{ background: `${hue}1a` }}
                >
                  <Icon className="h-6 w-6" style={{ color: hue }} />
                </span>
                <h3 className="relative mt-6 font-display text-2xl font-semibold text-app">{f.title}</h3>
                <p className="relative mt-3 max-w-md text-sm leading-relaxed text-muted">{f.desc}</p>
                <span
                  className="relative mt-6 block h-px w-12 transition-all duration-500 group-hover:w-24"
                  style={{ background: hue }}
                />
              </article>
            );
          })}
        </div>

        {/* Four supporting capabilities */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {compact.map(({ icon: Icon, title, desc }, i) => (
            <article
              key={title}
              className="reveal group relative overflow-hidden rounded-2xl card-surface p-6 transition-all duration-400 hover:-translate-y-1 hover:border-[color:var(--color-brand-blue)]"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 gradient-brand transition-transform duration-500 group-hover:scale-x-100" />
              <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-colors duration-300 group-hover:border-[color:var(--color-brand-blue)]">
                <Icon className="h-5 w-5 text-[color:var(--color-brand-blue)]" />
              </span>
              <h4 className="mt-4 font-display text-sm font-semibold text-app">{title}</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
