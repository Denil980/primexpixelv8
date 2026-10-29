import { clients } from '../lib/clients';

export default function LogoWall() {
  return (
    <div className="reveal mt-12">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {clients.map((c) => (
          <div
            key={c.name}
            className="group relative flex min-h-[140px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white p-8 shadow-premium transition-all duration-500 hover:-translate-y-1.5"
            title={c.name}
            style={{ boxShadow: 'var(--shadow)' }}
          >
            <img
              src={c.logo}
              alt={c.name}
              loading="lazy"
              className="relative max-h-16 w-auto max-w-[80%] object-contain transition-transform duration-500 group-hover:scale-[1.06]"
            />
            {/* brand accent line */}
            <span
              className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full"
              style={{ background: c.hue }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
