import { useEffect, useState } from 'react';
import { useTheme } from '../lib/ThemeContext';

export default function Loader() {
  const [gone, setGone] = useState(false);
  const { theme } = useTheme();
  const src = theme === 'light' ? '/brand/logo-light.png' : '/brand/logo-dark.png';

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1500);
    return () => clearTimeout(t);
  }, []);
  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-app px-8"
      style={{ animation: 'loader-fade 0.6s ease 1.1s forwards' }}
    >
      <img
        src={src}
        alt="PrimexPixel"
        className="h-10 w-auto max-w-[260px] object-contain sm:h-12"
        style={{ animation: 'char-in 0.7s cubic-bezier(0.2,0.9,0.2,1) both, float-y 2.6s ease-in-out infinite' }}
      />
      <div className="mt-6 h-[2px] w-40 overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
        <div className="h-full w-full gradient-brand" style={{ transformOrigin: 'left', animation: 'shine 1.3s ease' }} />
      </div>
    </div>
  );
}
