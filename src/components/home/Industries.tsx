import { industries } from '../../lib/data';
import SectionHeading from '../SectionHeading';

export default function Industries() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Industries" title="Trusted across" highlight="every sector" sub="Deep experience translating growth principles into results for diverse industries." />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {industries.map((ind, i) => (
            <div key={ind.name} className="reveal group flex items-center gap-3 rounded-2xl card-surface p-5 transition-all duration-400 hover:-translate-y-1 hover:border-[color:var(--color-brand-blue)]" style={{ transitionDelay: `${i * 30}ms` }}>
              <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-colors duration-400 group-hover:border-transparent">
                <span className="absolute inset-0 gradient-brand opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                <ind.icon className="relative h-5 w-5 text-[color:var(--color-brand-green)] transition-colors duration-400 group-hover:text-white" />
              </span>
              <span className="font-display text-sm font-medium text-app">{ind.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
