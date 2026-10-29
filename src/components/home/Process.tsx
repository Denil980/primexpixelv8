import { useRef, useEffect, type CSSProperties } from 'react';
import { ArrowRight, Compass, Target, PenTool, Code2, Rocket, TrendingUp } from 'lucide-react';
import { useLiveProcessSteps } from '../../lib/useAdminData';
import { renderLucideIcon } from '../../admin/components/IconPicker';
import SectionHeading from '../SectionHeading';

const FALLBACK_ICONS: Record<string, any> = {
  Discover: Compass,
  Strategy: Target,
  Design: PenTool,
  Develop: Code2,
  Launch: Rocket,
  Scale: TrendingUp,
};

export default function Process() {
  const trackRef = useRef<HTMLDivElement>(null);
  const steps = useLiveProcessSteps();

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.25;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      el.style.setProperty('--progress', `${p * 100}%`);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-0 mesh-glow opacity-30" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Our Process"
          title="A proven path from"
          highlight="idea to impact"
          sub="Six deliberate stages. Every project moves through this structured framework with total transparency, speed, and measurable growth."
        />

        {/* =========================================================================
            DESKTOP TIMELINE (Horizontal Numbered Timeline with Animated Progress Line)
           ========================================================================= */}
        <div
          ref={trackRef}
          className="mt-16 hidden lg:block"
          style={{ '--progress': '0%' } as CSSProperties}
        >
          <div className="relative">
            {/* Background connecting line between steps */}
            <div
              className="absolute left-10 right-10 top-[38px] h-[2.5px] rounded-full"
              style={{ background: 'var(--border-strong)' }}
            />
            {/* Animated progress track fill that glows as user scrolls */}
            <div
              className="absolute left-10 top-[38px] h-[2.5px] rounded-full gradient-brand transition-[width] duration-300 ease-out"
              style={{ width: 'var(--progress)', boxShadow: '0 0 20px rgba(5,130,213,0.5)' }}
            />

            {/* Steps Grid: Sequential Step Cards */}
            <div
              className="relative grid gap-4"
              style={{ gridTemplateColumns: `repeat(${Math.max(steps.length, 1)}, minmax(0, 1fr))` }}
            >
              {steps.map((step, i) => {
                const stepNum = step.stepNumber || i + 1;
                const FallbackIcon = FALLBACK_ICONS[step.title] || Compass;

                return (
                  <div
                    key={step.id || step.title}
                    className="reveal group flex flex-col items-center text-center"
                    style={{ transitionDelay: `${i * 120}ms` }}
                  >
                    {/* Node / Numbered Badge with Icon */}
                    <div className="relative z-10 flex h-[76px] w-[76px] items-center justify-center rounded-2xl gradient-brand shadow-premium transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_rgba(5,130,213,0.35)]">
                      {typeof step.icon === 'string' && step.icon ? (
                        renderLucideIcon(step.icon, 'h-8 w-8 text-white')
                      ) : (
                        <FallbackIcon className="h-8 w-8 text-white" />
                      )}

                      {/* Numbered Step indicator */}
                      <span className="absolute -top-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-full bg-white text-[color:var(--color-brand-blue)] text-xs font-bold shadow-md border border-[var(--border)]">
                        {stepNum}
                      </span>
                    </div>

                    {/* Step Card with Hover Effect */}
                    <div className="mt-6 w-full max-w-[190px] rounded-2xl card-surface p-4 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[color:var(--color-brand-blue)] group-hover:shadow-lg">
                      <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-brand-blue)] bg-[var(--surface)] border border-[var(--border)]">
                        Step {stepNum}
                      </div>

                      <h3 className="font-display text-[15px] font-semibold text-app group-hover:gradient-text transition-all duration-300 mt-2">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-[12px] leading-relaxed text-muted line-clamp-3">
                        {step.shortDesc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            MOBILE & TABLET TIMELINE (Vertical Connected Timeline with Step Cards)
           ========================================================================= */}
        <div className="mt-14 space-y-6 lg:hidden">
          {steps.map((step, i) => {
            const stepNum = step.stepNumber || i + 1;
            const FallbackIcon = FALLBACK_ICONS[step.title] || Compass;

            return (
              <div
                key={step.id || step.title}
                className="reveal flex gap-4 sm:gap-5"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                {/* Vertical Timeline spine */}
                <div className="flex flex-col items-center">
                  <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-brand shadow-premium">
                    {typeof step.icon === 'string' && step.icon ? (
                      renderLucideIcon(step.icon, 'h-5 w-5 text-white')
                    ) : (
                      <FallbackIcon className="h-5 w-5 text-white" />
                    )}

                    <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[color:var(--color-brand-blue)] text-[10px] font-bold shadow border border-[var(--border)]">
                      {stepNum}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <span
                      className="mt-2 w-[2px] flex-1 rounded-full"
                      style={{ background: 'linear-gradient(to bottom, var(--color-brand-blue), var(--border-strong))' }}
                    />
                  )}
                </div>

                {/* Mobile Step Card */}
                <div className="flex-1 rounded-2xl card-surface p-5 transition-all duration-300 hover:border-[color:var(--color-brand-blue)] hover:shadow-md">
                  <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-brand-blue)] bg-[var(--surface)] border border-[var(--border)]">
                    Step {stepNum}
                  </div>

                  <h3 className="font-display text-base font-semibold text-app mt-2">
                    {step.title}
                  </h3>

                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {step.shortDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA / Guarantee pill */}
        <div className="reveal mt-14 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full card-surface px-5 py-2.5 text-sm text-muted shadow-sm border border-[var(--border)]">
            From kickoff to launch in as little as{' '}
            <span className="font-semibold gradient-text">8 weeks</span>
            <ArrowRight className="h-4 w-4 text-[color:var(--color-brand-blue)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
