/* eslint-disable react-refresh/only-export-components */
// Handcrafted SVG client logos (icon mark + wordmark).
// All use `currentColor` so they inherit theme colour and work with the
// grayscale -> brand-colour hover treatment on the logo wall.
import type { CSSProperties, ReactElement } from 'react';

interface LP { className?: string; style?: CSSProperties; }
const wrap = 'h-7 w-auto';

export function NovaHealth({ className = wrap, style }: LP) {
  return (
    <svg viewBox="0 0 150 32" className={className} style={style} fill="none" role="img" aria-label="Nova Health">
      <path d="M8 4v24M8 4l12 24M20 4v24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 16h5l2-5 3 10 2-5h5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="52" y="22" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">Nova</text>
    </svg>
  );
}

export function Meridian({ className = wrap, style }: LP) {
  return (
    <svg viewBox="0 0 170 32" className={className} style={style} fill="none" role="img" aria-label="Meridian">
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2.4" />
      <path d="M4 16h24M16 4c5 4 5 20 0 24M16 4c-5 4-5 20 0 24" stroke="currentColor" strokeWidth="2.2" />
      <text x="36" y="22" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">Meridian</text>
    </svg>
  );
}

export function AtlasFintech({ className = wrap, style }: LP) {
  return (
    <svg viewBox="0 0 150 32" className={className} style={style} fill="none" role="img" aria-label="Atlas Fintech">
      <path d="M16 4 4 28h24L16 4Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M10 20h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <text x="36" y="22" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">Atlas</text>
    </svg>
  );
}

export function Lumen({ className = wrap, style }: LP) {
  return (
    <svg viewBox="0 0 150 32" className={className} style={style} fill="none" role="img" aria-label="Lumen">
      <circle cx="15" cy="15" r="6.5" stroke="currentColor" strokeWidth="2.4" />
      <path d="M15 3v3M15 24v3M3 15h3M24 15h3M6.5 6.5l2 2M21.5 6.5l-2 2M6.5 23.5l2-2M21.5 23.5l-2-2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <text x="36" y="22" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">Lumen</text>
    </svg>
  );
}

export function Verde({ className = wrap, style }: LP) {
  return (
    <svg viewBox="0 0 150 32" className={className} style={style} fill="none" role="img" aria-label="Verde">
      <path d="M6 26C6 14 16 6 28 6c0 12-10 20-22 20Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M8 24C14 18 20 14 26 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <text x="36" y="22" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">Verde</text>
    </svg>
  );
}

export function Pulse({ className = wrap, style }: LP) {
  return (
    <svg viewBox="0 0 150 32" className={className} style={style} fill="none" role="img" aria-label="Pulse">
      <path d="M4 16h6l3-9 5 18 3-9h6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="36" y="22" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">Pulse</text>
    </svg>
  );
}

export function Quantic({ className = wrap, style }: LP) {
  return (
    <svg viewBox="0 0 165 32" className={className} style={style} fill="none" role="img" aria-label="Quantic">
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2.4" />
      <path d="M20 20l6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3.5" fill="currentColor" />
      <text x="34" y="22" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">Quantic</text>
    </svg>
  );
}

export function Stratos({ className = wrap, style }: LP) {
  return (
    <svg viewBox="0 0 160 32" className={className} style={style} fill="none" role="img" aria-label="Stratos">
      <path d="M5 22c4-2 8-2 12 0s8 2 12 0" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M5 15c4-2 8-2 12 0s8 2 12 0" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
      <path d="M8 8c3.5-2 6.5-2 10 0" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.4" />
      <text x="36" y="22" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">Stratos</text>
    </svg>
  );
}

export function Vertex({ className = wrap, style }: LP) {
  return (
    <svg viewBox="0 0 155 32" className={className} style={style} fill="none" role="img" aria-label="Vertex">
      <path d="M8 6l8 20 8-20" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="6" r="2.6" fill="currentColor" />
      <circle cx="24" cy="6" r="2.6" fill="currentColor" />
      <circle cx="16" cy="26" r="2.6" fill="currentColor" />
      <text x="34" y="22" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">Vertex</text>
    </svg>
  );
}

export function Halo({ className = wrap, style }: LP) {
  return (
    <svg viewBox="0 0 140 32" className={className} style={style} fill="none" role="img" aria-label="Halo">
      <ellipse cx="16" cy="16" rx="12" ry="5" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="16" cy="16" r="4.5" fill="currentColor" />
      <text x="34" y="22" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">Halo</text>
    </svg>
  );
}

export function Cobalt({ className = wrap, style }: LP) {
  return (
    <svg viewBox="0 0 155 32" className={className} style={style} fill="none" role="img" aria-label="Cobalt">
      <path d="M16 5l10 5.5v11L16 27 6 21.5v-11L16 5Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M16 11v10M11 13.5l10 5M21 13.5l-10 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <text x="34" y="22" fontFamily="Space Grotesk, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">Cobalt</text>
    </svg>
  );
}

export type BrandLogo = { name: string; hue: string; Comp: (p: LP) => ReactElement };

export const brandLogos: BrandLogo[] = [
  { name: 'Nova Health', hue: '#0582D5', Comp: NovaHealth },
  { name: 'Meridian', hue: '#97C73D', Comp: Meridian },
  { name: 'Atlas Fintech', hue: '#0582D5', Comp: AtlasFintech },
  { name: 'Lumen', hue: '#97C73D', Comp: Lumen },
  { name: 'Verde', hue: '#0582D5', Comp: Verde },
  { name: 'Pulse', hue: '#97C73D', Comp: Pulse },
  { name: 'Quantic', hue: '#0582D5', Comp: Quantic },
  { name: 'Stratos', hue: '#97C73D', Comp: Stratos },
  { name: 'Vertex', hue: '#0582D5', Comp: Vertex },
  { name: 'Halo', hue: '#97C73D', Comp: Halo },
  { name: 'Cobalt', hue: '#0582D5', Comp: Cobalt },
];
