import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] card-surface transition-all duration-300 hover:border-[color:var(--color-brand-blue)]"
    >
      <span className="relative h-5 w-5">
        <Sun className={`absolute inset-0 h-5 w-5 text-[color:var(--color-brand-green)] transition-all duration-500 ${theme === 'light' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
        <Moon className={`absolute inset-0 h-5 w-5 text-[color:var(--color-brand-blue)] transition-all duration-500 ${theme === 'dark' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`} />
      </span>
    </button>
  );
}
