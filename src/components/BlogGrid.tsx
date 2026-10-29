import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { useLiveBlogs } from '../lib/useAdminData';

export default function BlogGrid({ limit }: { limit?: number }) {
  const blogPosts = useLiveBlogs();
  const posts = blogPosts.slice(0, limit ?? blogPosts.length);
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <Link key={p.slug} to={`/blog/${p.slug}`} className="reveal group flex flex-col overflow-hidden rounded-2xl card-surface transition-all duration-500 hover:-translate-y-1.5">
          <div className="relative h-44 overflow-hidden">
            <img src={p.image} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${p.hue}55, #07111Ddd)` }} />
            <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">{p.category}</span>
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              <MapPin className="h-3 w-3" /> {p.area}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center gap-3 text-xs text-dim">
              <span>{p.date}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.read}</span>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-app transition-colors group-hover:gradient-text">{p.title}</h3>
            <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{p.excerpt}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-brand-blue)]">
              Read Article <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
