import { useEffect } from 'react';

const SITE = 'https://primexpixel.in';

interface SEOOptions {
  title: string;
  description: string;
  path?: string;              // e.g. '/blog/slug'
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: object | object[];  // structured data
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSEO({ title, description, path = '/', keywords, image = '/og-image.png', type = 'website', jsonLd }: SEOOptions) {
  useEffect(() => {
    const url = `${SITE}${path}`;
    document.title = title;

    setMeta('name', 'description', description);
    if (keywords?.length) setMeta('name', 'keywords', keywords.join(', '));

    // Canonical
    setLink('canonical', url);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', `${SITE}${image}`);

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', `${SITE}${image}`);

    // JSON-LD (managed under a dedicated id so we can replace it)
    const existing = document.getElementById('page-jsonld');
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'page-jsonld';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById('page-jsonld');
      if (s) s.remove();
    };
  }, [title, description, path, image, type, keywords, jsonLd]);
}

export { SITE };
