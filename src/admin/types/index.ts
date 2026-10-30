export type ItemStatus = 'published' | 'draft';

export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  category: string;
  tags: string[];
  excerpt: string;
  content: string; // rich text or structured HTML
  author: string;
  publishDate: string; // e.g. "Feb 18, 2026" or "YYYY-MM-DD"
  seoTitle: string;
  seoDescription: string;
  status: ItemStatus;
  readingTime?: string;
  area?: string;
  order: number;
  updatedAt: string;
}

export interface AdminReview {
  id: string;
  name: string;
  company: string;
  role?: string;
  photo?: string;
  initials?: string;
  rating: number; // 1 to 5
  reviewText: string;
  date: string;
  show: boolean;
  order: number;
  updatedAt: string;
}

export interface AdminVideoReview {
  id: string;
  name: string;
  company: string;
  videoUrl: string; // YouTube or direct video link
  thumbnail: string;
  metric?: string;
  hue?: string;
  show: boolean;
  order: number;
  updatedAt: string;
}

export interface WorkResult {
  label: string;
  value: string;
}

export interface AdminWorkItem {
  id: string;
  title: string;
  slug: string;
  client: string;
  category: string; // 'Website' | 'UI/UX' | 'Logo' | 'Social Media' | 'Video Editing' | string
  coverImage: string;
  gallery: string[];
  description: string;
  overview?: string;
  features?: string[];
  highlights?: string[];
  resultsList?: string[];
  challenge?: string;
  approach?: string;
  outcome?: string;
  liveLink?: string;
  tech: string[];
  year: string;
  results: WorkResult[];
  show: boolean;
  order: number;
  updatedAt: string;
}

export interface ServiceFAQItem {
  q: string;
  a: string;
}

export interface AdminService {
  id: string;
  title: string;
  slug: string;
  icon: string; // lucide icon identifier
  tagline: string;
  heroImage?: string;
  shortDesc: string;
  fullDesc: string;
  overview?: string;
  whoItIsFor?: string;
  problem: string;
  solution: string;
  highlights: string[];
  benefits: string[];
  process: string[];
  faqs?: ServiceFAQItem[];
  ctaText?: string;
  gallery: string[];
  metaTitle: string;
  metaDescription: string;
  technologies: string[];
  workCategories?: string[];
  show: boolean;
  order: number;
  updatedAt: string;
}

export interface AdminProcessStep {
  id: string;
  stepNumber: number;
  title: string;
  shortDesc: string;
  icon: string;
  show: boolean;
  order: number;
  updatedAt: string;
}

export interface AdminFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  show: boolean;
  order: number;
  updatedAt: string;
}

export interface AdminSiteNumber {
  id: string;
  label: string;
  value: number;
  suffix: string; // e.g. "+", "%", "K", "/7"
  location: string; // e.g. "Hero Stats", "About Intro Metrics", "Results Counter", "Service Detail Trust"
  show: boolean;
  order: number;
  updatedAt: string;
}

export interface AdminDatabase {
  blogs: AdminBlogPost[];
  reviews: AdminReview[];
  videoReviews: AdminVideoReview[];
  works: AdminWorkItem[];
  services: AdminService[];
  process: AdminProcessStep[];
  faqs: AdminFAQ[];
  siteNumbers: AdminSiteNumber[];
  version: number;
  lastUpdated: string;
}
