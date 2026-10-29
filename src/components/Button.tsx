import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
  to?: string; href?: string; onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'outline';
  children: ReactNode; className?: string; icon?: ReactNode;
}

export default function Button({ to, href, onClick, variant = 'primary', children, className = '', icon }: Props) {
  const base = 'group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 will-change-transform';
  const styles = {
    primary: 'gradient-brand text-white shadow-premium hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-15px_rgba(5,130,213,0.6)]',
    ghost: 'text-app hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)]',
    outline: 'text-app border border-[var(--border-strong)] hover:border-[color:var(--color-brand-blue)] hover:-translate-y-0.5 card-surface',
  }[variant];
  const cls = `${base} ${styles} ${className}`;
  const inner = <>{children}{icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}</>;
  if (to) return <Link to={to} onClick={onClick} className={cls}>{inner}</Link>;
  if (href) return <a href={href} target="_blank" rel="noreferrer" onClick={onClick} className={cls}>{inner}</a>;
  return <button onClick={onClick} className={cls}>{inner}</button>;
}
