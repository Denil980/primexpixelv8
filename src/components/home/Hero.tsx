import { ArrowRight, Play } from 'lucide-react';
import Button from '../Button';
import SplitText from '../SplitText';
import { useCounter } from '../../lib/useCounter';
import { useLiveSiteNumbers } from '../../lib/useAdminData';

function HeroStat({ target, suffix, label }: { target: number | string; suffix: string; label: string }) {
  const isPureNumber = typeof target === 'number' || (!isNaN(Number(target)) && !isNaN(parseFloat(String(target))));
  const numericVal = isPureNumber ? Number(target) : 0;
  const { value, ref } = useCounter(numericVal, 2400);
  const displayVal = isPureNumber ? `${value}${suffix}` : `${target}${suffix}`;
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-[1.75rem] font-bold leading-none text-app sm:text-[2.1rem]">{displayVal}</div>
      <div className="mt-1.5 text-xs uppercase tracking-wider text-dim">{label}</div>
    </div>
  );
}

function HeroDots() {
  const dots = [
    { top: '8%', left: '48%', size: 4, hue: '#0582D5', delay: '0s' },
    { top: '14%', left: '22%', size: 3, hue: '#97C73D', delay: '0.6s' },
    { top: '22%', left: '73%', size: 3, hue: '#0582D5', delay: '1.2s' },
    { top: '30%', left: '6%', size: 4, hue: '#0582D5', delay: '1.8s' },
    { top: '38%', left: '92%', size: 3, hue: '#97C73D', delay: '0.3s' },
    { top: '46%', left: '18%', size: 3, hue: '#0582D5', delay: '2.1s' },
    { top: '58%', left: '84%', size: 4, hue: '#97C73D', delay: '0.9s' },
    { top: '66%', left: '11%', size: 3, hue: '#0582D5', delay: '1.5s' },
    { top: '74%', left: '60%', size: 3, hue: '#97C73D', delay: '2.4s' },
    { top: '82%', left: '30%', size: 4, hue: '#0582D5', delay: '0.4s' },
    { top: '18%', left: '55%', size: 3, hue: '#97C73D', delay: '1.9s' },
    { top: '90%', left: '75%', size: 3, hue: '#0582D5', delay: '1.1s' },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            background: d.hue,
            boxShadow: `0 0 6px ${d.hue}`,
            animation: `pulse-line 3.2s ease-in-out infinite`,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const heroStats = useLiveSiteNumbers('Hero');

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-28">
      <div className="pointer-events-none absolute inset-0 tech-grid" />
      <div className="pointer-events-none absolute inset-0 mesh-glow" />
      <HeroDots />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] card-surface px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full gradient-brand" /> Premium Digital Growth Agency
          </span>
          <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.03] tracking-tight text-app sm:text-6xl">
            <SplitText text="Designing Digital" /><br />
            <SplitText text="Experiences That" delay={0.5} /><br />
            <SplitText text="Drive Growth" delay={1} gradient />
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">PrimeXPixel is a Mumbai-based growth agency crafting websites, brands and marketing engines that turn attention into measurable revenue — strategy-led, conversion-obsessed and enterprise-grade.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button to="/contact" icon={<ArrowRight className="h-4 w-4" />}>Start Your Project</Button>
            <Button to="/work" variant="outline" icon={<Play className="h-4 w-4" />}>View Portfolio</Button>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 sm:flex sm:gap-x-9">
            {heroStats.slice(0, 4).map((s: any) => (
              <HeroStat
                key={s.id || s.label}
                target={s.value}
                suffix={s.suffix || ''}
                label={s.label}
              />
            ))}
          </div>
        </div>
        <div className="relative hidden items-center justify-center lg:flex">
          <lottie-player
            src="/animations/designer.json"
            background="transparent"
            speed="1"
            loop
            autoplay
            style={{ width: '100%', maxWidth: 520 }}
          />
        </div>
      </div>
    </section>
  );
}
