import { useEffect, useState } from 'react';

export default function HeroVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative hidden h-[520px] select-none lg:block" style={{ perspective: '1400px' }}>
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateY(-14deg) rotateX(8deg)',
        }}
      >
        {/* Main glowing orb container */}
        <div className="absolute left-[18%] top-[12%] h-[310px] w-[310px]">
          {/* Outer soft glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 40% 30%, rgba(5,130,213,0.35), rgba(151,199,61,0.12) 45%, transparent 70%)',
              filter: 'blur(22px)',
              animation: mounted ? 'pulse-glow 4.5s ease-in-out infinite' : 'none',
            }}
          />

          {/* Central Orb */}
          <div className="absolute left-1/2 top-1/2 h-[218px] w-[218px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[#0b1727]">
            {/* Gradient fill */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 35% 28%, #1a2f4e, #07111D 65%)',
              }}
            />

            {/* Animated inner glow ring */}
            <div
              className="absolute inset-[18px] rounded-full border border-white/20"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(5,130,213,0.6), transparent, rgba(151,199,61,0.5), transparent)',
                animation: mounted ? 'spin-slow 18s linear infinite' : 'none',
                maskImage: 'radial-gradient(circle, black 55%, transparent 78%)',
              }}
            />

            {/* PrimeXPixel X mark (stylized) */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 m-auto h-[108px] w-[108px] text-white/90"
              style={{ filter: 'drop-shadow(0 0 12px rgba(5,130,213,0.6))' }}
            >
              <defs>
                <linearGradient id="xgrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0582D5" />
                  <stop offset="100%" stopColor="#97C73D" />
                </linearGradient>
              </defs>
              <path
                d="M28 22 L72 78 M72 22 L28 78"
                fill="none"
                stroke="url(#xgrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="50" r="5.5" fill="#97C73D" />
            </svg>

            {/* Orbiting nodes */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#0582D5' : '#97C73D',
                  boxShadow: `0 0 12px ${i % 2 === 0 ? '#0582D5' : '#97C73D'}`,
                  animation: mounted
                    ? `orbit-${i} ${7 + i * 0.8}s linear infinite`
                    : 'none',
                  animationDelay: `${-i * 1.6}s`,
                }}
              />
            ))}
          </div>

          {/* Floating metric badges */}
          <div className="absolute -right-3 top-8 rounded-2xl card-surface px-4 py-3 shadow-premium" style={{ animation: mounted ? 'float-y 3.8s ease-in-out infinite' : 'none' }}>
            <div className="font-display text-xs font-semibold text-app">+218%</div>
            <div className="text-[10px] text-muted">Avg. Growth</div>
          </div>

          <div className="absolute -left-5 bottom-16 rounded-2xl card-surface px-4 py-3 shadow-premium" style={{ animation: mounted ? 'float-y 4.4s ease-in-out infinite 1.2s' : 'none' }}>
            <div className="font-display text-xs font-semibold text-app">4.9× ROAS</div>
            <div className="text-[10px] text-muted">Avg. Return</div>
          </div>

          <div className="absolute -right-6 bottom-6 rounded-2xl card-surface px-4 py-3 shadow-premium" style={{ animation: mounted ? 'float-y 3.2s ease-in-out infinite 2.1s' : 'none' }}>
            <div className="font-display text-xs font-semibold text-app">98%</div>
            <div className="text-[10px] text-muted">Satisfaction</div>
          </div>
        </div>

        {/* Subtle connecting animated lines */}
        <svg className="absolute left-[14%] top-[9%] h-[340px] w-[340px] opacity-40" viewBox="0 0 340 340">
          <defs>
            <linearGradient id="linegrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0582D5" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#97C73D" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path d="M85 78 Q170 170 255 262" fill="none" stroke="url(#linegrad)" strokeWidth="1.5" strokeDasharray="4 7" style={{ animation: mounted ? 'dash 3.2s linear infinite' : 'none' }} />
          <path d="M110 260 Q185 145 260 30" fill="none" stroke="url(#linegrad)" strokeWidth="1.5" strokeDasharray="4 7" style={{ animation: mounted ? 'dash 4.1s linear infinite 0.6s' : 'none' }} />
        </svg>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes float-y {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-13px); }
        }
        @keyframes dash {
          to { stroke-dashoffset: -22; }
        }
        @keyframes orbit-0 { to { transform: rotate(360deg) translateX(98px) rotate(-360deg); } }
        @keyframes orbit-1 { to { transform: rotate(-360deg) translateX(112px) rotate(360deg); } }
        @keyframes orbit-2 { to { transform: rotate(360deg) translateX(85px) rotate(-360deg); } }
        @keyframes orbit-3 { to { transform: rotate(-360deg) translateX(105px) rotate(360deg); } }
      `}</style>
    </div>
  );
}
