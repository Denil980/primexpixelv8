import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items, compact = false }: { items: { label: string; to?: string }[]; compact?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`relative mx-auto flex max-w-6xl items-center gap-1.5 px-6 text-xs text-muted ${compact ? '' : 'pt-28'}`}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-app">{item.label}</Link>
          ) : (
            <span className="text-app">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="h-3 w-3 text-dim" />}
        </span>
      ))}
    </nav>
  );
}
