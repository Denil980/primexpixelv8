import { useCounter } from '../../lib/useCounter';
import { useLiveSiteNumbers } from '../../lib/useAdminData';

function StatCard({ value, suffix, label }: { value: number | string; suffix: string; label: string }) {
  const numericVal = typeof value === 'number' ? value : parseInt(String(value), 10) || 0;
  const { value: v, ref } = useCounter(numericVal);
  return (
    <div className="reveal relative overflow-hidden rounded-2xl card-surface p-8 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 gradient-brand" />
      <div ref={ref} className="font-display text-4xl font-semibold text-app sm:text-5xl">
        <span className="gradient-text">{v}{suffix}</span>
      </div>
      <div className="mt-2 text-sm uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

export default function Results() {
  const stats = useLiveSiteNumbers('Results');
  return (
    <section className="relative overflow-hidden bg-app-2 px-6 py-24">
      <div className="pointer-events-none absolute inset-0 mesh-glow opacity-50" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s: any) => (
            <StatCard key={s.id || s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
