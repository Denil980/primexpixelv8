import type { MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../lib/ThemeContext';

export default function Logo({ onClick, className = 'h-8 sm:h-9' }: { onClick?: () => void; className?: string }) {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const src = theme === 'light' ? '/brand/logo-light.png' : '/brand/logo-dark.png';

  const handleClick = (e: MouseEvent) => {
    onClick?.();
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Link to="/" onClick={handleClick} className="group inline-flex items-center" aria-label="PrimexPixel home">
      <img
        src={src}
        alt="PrimexPixel — Your Digital Growth Partner"
        className={`w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
      />
    </Link>
  );
}
