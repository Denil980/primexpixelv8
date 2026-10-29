import type { LucideIcon } from 'lucide-react';
import {
  Compass, TrendingUp, Cpu, Search, MousePointerClick, Headphones,
  Code2, ShoppingBag, PenTool, Palette, Clapperboard, Share2, Megaphone,
  HeartPulse, Landmark, Building2, GraduationCap, Store, Rocket, UtensilsCrossed, Briefcase,
  Target, Bot, Boxes, Camera, PenLine,
} from 'lucide-react';

export interface Feature { icon: LucideIcon; title: string; desc: string; }
export const features: Feature[] = [
  { icon: Compass, title: 'Strategy First', desc: 'Every engagement starts with research, positioning and a measurable growth roadmap.' },
  { icon: TrendingUp, title: 'Growth Focused', desc: 'We optimise for revenue, retention and reach — not vanity metrics.' },
  { icon: Cpu, title: 'Modern Technology', desc: 'React, headless CMS and performance-first stacks built to scale for years.' },
  { icon: Search, title: 'SEO Optimized', desc: 'Technical SEO, structured data and content engineered to rank and convert.' },
  { icon: MousePointerClick, title: 'Conversion Driven', desc: 'UX, copy and funnels tuned with A/B testing to turn visitors into customers.' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'A committed team on standby 24/7 with proactive monitoring and reporting.' },
];

export interface Service {
  slug: string; icon: LucideIcon; title: string; tagline: string;
  desc: string; highlights: string[];
  problem: string; solution: string; benefits: string[];
  process: string[];
  technologies?: string[]; workCategories?: WorkCategory[];
}
export const services: Service[] = [
  { slug: 'website-development', icon: Code2, title: 'Website Development', tagline: 'Blazing-fast, scalable websites engineered to convert.',
    desc: 'We design and build performance-first websites on modern stacks that load in under a second, rank on Google and turn visitors into customers. Every build is clean-coded, responsive and future-proof.',
    highlights: ['Sub-second load & 90+ Lighthouse', 'Fully responsive & accessible', 'Headless CMS you control', 'SEO-ready architecture'],
    problem: 'Slow, dated websites bleed traffic, hurt SEO and lose customers before they ever engage.',
    solution: 'We architect performance-first websites on modern stacks with clean code, semantic markup and 90+ Lighthouse scores as standard.',
    benefits: ['Sub-second load times', 'Fully responsive & accessible', 'Headless CMS integration', 'Ongoing performance monitoring'],
    process: ['Audit & discovery', 'Information architecture', 'Design & prototype', 'Build & QA', 'Launch & optimise'],
    technologies: ['React', 'Next.js', 'Webflow', 'WordPress', 'Tailwind CSS', 'Headless CMS'], workCategories: ['Website'],
  },
{ slug: 'ecommerce', icon: ShoppingBag, title: 'Ecommerce', tagline: 'Storefronts built to sell around the clock.',
    desc: 'Custom online stores engineered for conversion — frictionless checkout, smart product discovery and analytics baked in. Built to scale from your first order to your millionth without re-platforming.',
    highlights: ['Optimised 2-step checkout', 'Payment & logistics integrations', 'Inventory & CRM sync', 'Revenue analytics dashboards'],
    problem: 'Generic store templates cap your conversion rate and make scaling a nightmare.',
    solution: 'Custom, conversion-optimised commerce experiences with frictionless checkout, smart merchandising and analytics baked in.',
    benefits: ['Optimised checkout flow', 'Payment & logistics integrations', 'Inventory & CRM sync', 'Revenue analytics dashboards'],
    process: ['Commerce strategy', 'Catalogue & UX design', 'Platform build', 'Payment integration', 'Growth & CRO'],
    technologies: ['Shopify', 'WooCommerce', 'Razorpay', 'Stripe', 'Next.js'], workCategories: ['Website'],
  },
{ slug: 'ui-ux-design', icon: PenTool, title: 'UI/UX Design', tagline: 'Interfaces people love, journeys that convert.',
    desc: 'Research-led product design that pairs beautiful interfaces with behaviour-backed decisions. From journey mapping to pixel-perfect design systems, we craft experiences that feel effortless and convert.',
    highlights: ['User research & usability testing', 'Scalable design systems', 'Interactive prototypes', 'Accessibility built-in'],
    problem: 'Beautiful screens that ignore user behaviour still fail to convert.',
    solution: 'Research-led product design — from journey mapping to pixel-perfect systems tested with real users.',
    benefits: ['User research & testing', 'Design systems', 'Interactive prototypes', 'Accessibility built-in'],
    process: ['User research', 'Wireframing', 'Visual design', 'Prototype & test', 'Handoff'],
    technologies: ['Figma', 'Framer', 'Adobe XD', 'Maze', 'Principle'], workCategories: ['UI/UX'],
  },
{ slug: 'graphic-design', icon: Palette, title: 'Graphic Design', tagline: 'Brand identities that command attention.',
    desc: 'Cohesive brand systems that make you look like the market leader. Logos, guidelines and collateral crafted to build instant trust and let you charge premium prices with confidence.',
    highlights: ['Logo & identity systems', 'Complete brand guidelines', 'Marketing & print collateral', 'Ready-to-use social templates'],
    problem: 'Inconsistent visuals erode trust and make premium pricing impossible.',
    solution: 'Cohesive brand systems — logos, guidelines and collateral that make you look like the market leader.',
    benefits: ['Logo & identity systems', 'Brand guidelines', 'Marketing collateral', 'Social templates'],
    process: ['Brand discovery', 'Moodboarding', 'Concept design', 'Refinement', 'Delivery kit'],
    technologies: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Figma'], workCategories: ['Logo'],
  },
{ slug: 'video-editing', icon: Clapperboard, title: 'Video Editing', tagline: 'Scroll-stopping video for every platform.',
    desc: 'Cinematic edits, motion graphics and reels engineered for retention and shares. We craft platform-native video with strong hooks and clean grading that stops the scroll and drives engagement.',
    highlights: ['Reels, shorts & long-form', 'Custom motion graphics', 'Professional colour grading', 'Platform-native formats'],
    problem: 'Flat, unbranded video gets ignored in a feed built for motion.',
    solution: 'Cinematic edits, motion graphics and reels engineered for retention and shares.',
    benefits: ['Reels & shorts', 'Motion graphics', 'Colour grading', 'Platform-native formats'],
    process: ['Brief & script', 'Storyboard', 'Edit & motion', 'Review rounds', 'Delivery'],
    technologies: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'CapCut'], workCategories: ['Video Editing'],
  },
{ slug: 'social-media', icon: Share2, title: 'Social Media Management', tagline: 'Communities that turn into customers.',
    desc: 'End-to-end social management that builds a community and a pipeline. Content calendars, scroll-stopping creative, active community management and paid amplification — all tied to real enquiries.',
    highlights: ['Content strategy & calendar', 'Creative production', 'Community management', 'Paid social campaigns'],
    problem: 'Posting without strategy burns time and delivers zero pipeline.',
    solution: 'End-to-end social management — content calendars, creative, community and paid amplification.',
    benefits: ['Content strategy & calendar', 'Creative production', 'Community management', 'Paid social campaigns'],
    process: ['Audit & strategy', 'Content planning', 'Production', 'Publishing', 'Report & optimise'],
    technologies: ['Meta Business Suite', 'Buffer', 'Canva', 'Later'], workCategories: ['Social Media'],
  },
{ slug: 'digital-marketing', icon: Megaphone, title: 'Digital Marketing', tagline: 'Full-funnel campaigns that compound.',
    desc: 'Integrated performance marketing across SEO, paid, email and content — every channel tied to revenue. We connect the full funnel into one compounding growth engine with transparent attribution.',
    highlights: ['SEO & content marketing', 'Paid search & social', 'Email & marketing automation', 'Revenue attribution & reporting'],
    problem: 'Disconnected marketing wastes budget and hides what actually drives ROI.',
    solution: 'Integrated performance marketing across SEO, PPC, email and content — all tied to revenue.',
    benefits: ['SEO & content', 'Paid search & social', 'Email automation', 'Attribution & reporting'],
    process: ['Growth audit', 'Channel strategy', 'Campaign build', 'Launch & test', 'Scale'],
    technologies: ['Google Ads', 'Meta Ads', 'Google Analytics 4', 'SEMrush', 'HubSpot'],
  },
{ slug: 'crm-ai-automation', icon: Bot, title: 'CRM & AI Automation', tagline: 'Smart systems that sell and support while you sleep.',
    desc: 'We build and integrate intelligent CRM and AI automation that captures every lead, nurtures it automatically and frees your team from repetitive work. From chatbots to workflow automation, your business runs smarter around the clock.',
    highlights: ['Custom CRM setup & integration', 'AI chatbots & lead capture', 'Automated follow-ups & workflows', 'Smart pipeline & reporting'],
    problem: 'Manual follow-ups, scattered lead data and repetitive tasks quietly leak revenue and burn out your team.',
    solution: 'We design AI-powered CRM and automation systems that capture, score and nurture leads automatically — connecting your tools into one intelligent, self-running pipeline.',
    benefits: ['Custom CRM setup & integration', 'AI chatbots & lead capture', 'Automated follow-ups & workflows', 'Smart pipeline dashboards'],
    process: ['Process audit', 'Automation mapping', 'CRM & AI build', 'Integrate & test', 'Optimise & scale'],
    technologies: ['HubSpot', 'Zoho CRM', 'Make (Integromat)', 'OpenAI API', 'Zapier'],
  },
{ slug: 'erp-system', icon: Boxes, title: 'ERP System', tagline: 'One unified system to run your entire business.',
    desc: 'Custom ERP solutions that bring finance, inventory, HR, sales and operations into a single source of truth. We streamline your workflows, eliminate data silos and give you real-time visibility to make faster, smarter decisions.',
    highlights: ['Custom modules for your workflow', 'Real-time inventory & finance', 'Role-based dashboards & access', 'Third-party & API integrations'],
    problem: 'Disconnected spreadsheets and siloed tools create errors, delays and zero real-time visibility as you scale.',
    solution: 'We build tailored ERP systems that unify every department into one platform — with automation, live dashboards and secure, role-based access.',
    benefits: ['Custom modules for your workflow', 'Real-time inventory & finance', 'Role-based dashboards & access', 'Third-party & API integrations'],
    process: ['Requirement analysis', 'System architecture', 'Module development', 'Data migration & training', 'Support & scale'],
    technologies: ['Odoo', 'Node.js', 'PostgreSQL', 'REST APIs', 'Power BI'],
  },
{ slug: 'content-creation', icon: Camera, title: 'Content Creation', tagline: 'Scroll-stopping shoots, produced and edited end-to-end.',
    desc: 'From concept to final cut — we plan, shoot and edit photo and video content that looks premium and performs across every platform. Studio or on-location, we handle the whole production.',
    highlights: ['Photo & video shoots', 'Professional editing & retouching', 'Reels & short-form content', 'Platform-ready exports'],
    problem: 'Inconsistent, amateur content undercuts an otherwise strong brand and gets scrolled past.',
    solution: 'End-to-end content production — shoot planning, filming and photography, and polished editing, all produced to a consistent premium standard.',
    benefits: ['Photo & video shoots', 'Professional editing & retouching', 'Reels & short-form content', 'Platform-ready exports'],
    process: ['Concept & shot list', 'Shoot day', 'Edit & retouch', 'Review rounds', 'Delivery'],
    technologies: ['Adobe Premiere Pro', 'Lightroom', 'CapCut', 'Professional camera gear'], workCategories: ['Video Editing', 'Social Media'],
  },
{ slug: 'content-writing', icon: PenLine, title: 'Content Writing', tagline: 'Words that hook, explain and convert.',
    desc: 'Scripts, website copy, blogs and captions written to sound like you — clear, persuasive and built to move people to act. Every word is researched, on-brand and conversion-focused.',
    highlights: ['Video & ad scripts', 'Website & landing page copy', 'Blog & SEO content', 'Social captions & campaigns'],
    problem: 'Generic, unclear copy loses attention in the first line and fails to convert.',
    solution: 'Research-backed writing — scripts, web copy, blogs and captions crafted to hook attention and drive action.',
    benefits: ['Video & ad scripts', 'Website & landing page copy', 'Blog & SEO content', 'Social captions & campaigns'],
    process: ['Brief & research', 'Outline & tone', 'Draft', 'Revisions', 'Final delivery'],
    technologies: ['SurferSEO', 'Grammarly', 'Notion', 'Google Search Console'],
  },

];

export interface ProcessStep { title: string; icon: LucideIcon; shortDesc: string; }
export const processSteps: ProcessStep[] = [
  { title: 'Discover', icon: Compass, shortDesc: 'We dive deep into your business, market and goals to define what success looks like.' },
  { title: 'Strategy', icon: Target, shortDesc: 'A clear, prioritised roadmap that maps every decision to measurable growth outcomes.' },
  { title: 'Design', icon: PenTool, shortDesc: 'Premium, conversion-focused design systems crafted around your exact audience.' },
  { title: 'Develop', icon: Code2, shortDesc: 'Performance-first engineering with clean, scalable and rigorously tested code.' },
  { title: 'Launch', icon: Rocket, shortDesc: 'Seamless go-live with QA, analytics and monitoring fully dialled in.' },
  { title: 'Scale', icon: TrendingUp, shortDesc: 'Continuous optimisation, experimentation and support to compound results.' },
];

export type WorkCategory = 'Website' | 'UI/UX' | 'Logo' | 'Social Media' | 'Video Editing';
export interface CaseStudy {
  subtitle: string;
  cover: string;
  gallery?: string[];
  overview: string;
  goals?: string[];
  roles?: string[];
  process?: string[];
  palette: { name: string; hex: string }[];
  features?: string[];
  highlights?: string[];
  resultsList?: string[];
  meta?: { label: string; value: string }[];
  personality?: string[];
  applications?: string[];
}
export interface WorkItem {
  slug: string; title: string; client: string; category: WorkCategory;
  hue: string; challenge: string; approach: string; outcome: string;
  tech: string[]; results: { label: string; value: string }[];
  image?: string;
  detail?: CaseStudy;
}
export const workItems: WorkItem[] = [
  { slug: 'freshy-fruits', title: 'Freshy Fruits', client: 'Freshy Fruits', category: 'Website', hue: '#2f6b34',
    image: '/brand/work/freshy-cover.jpg',
    challenge: 'Communicate freshness, quality and trust while making browsing, seasonal discovery and ordering effortless.',
    approach: 'A premium organic brand experience with editorial visuals, soft rounded cards and a frictionless, conversion-focused ordering journey.',
    outcome: 'A high-trust, mobile-first storefront that lifted online orders by 142% and cut bounce rate by 58%.',
    tech: ['WordPress', 'Elementor', 'HTML5', 'CSS3', 'JavaScript'],
    results: [{label:'Online orders', value:'+142%'},{label:'Bounce rate', value:'-58%'},{label:'Lighthouse', value:'99/100'}],
    detail: {
      subtitle: 'Premium Organic Fruit Delivery Experience',
      cover: '/brand/work/freshy-hero.jpg',
      gallery: ['/brand/work/freshy-full.jpg'],
      overview: 'Freshy Fruits is a premium online fruit delivery platform focused on providing farm-fresh, naturally sourced fruits directly to customers. The project was designed to establish trust, showcase product quality, and simplify the online ordering experience while maintaining a premium organic brand identity.',
      goals: ['Create a premium organic brand experience', 'Increase customer trust', 'Improve product discoverability', 'Simplify online ordering', 'Optimize the mobile experience', 'Improve conversion rate'],
      roles: ['UI/UX Design', 'Website Design', 'Responsive Design', 'User Experience Optimization', 'Visual Branding', 'Landing Page Design'],
      process: ['Research', 'Competitor Analysis', 'User Flow Mapping', 'Customer Journey', 'Information Architecture', 'Wireframing'],
      palette: [{name:'Natural Green', hex:'#2f6b34'}, {name:'Warm Cream', hex:'#f3ead6'}, {name:'Golden Accent', hex:'#e0a02a'}, {name:'Deep Forest', hex:'#173d21'}],
      features: ['Premium Hero Section', 'Seasonal Product Showcase', 'Category Navigation', 'Fresh Produce Collection', 'Delivery Area Section', 'Customer Testimonials', 'FAQ Section', 'Contact Form', 'Mobile Responsive Layout', 'Conversion-focused CTA Sections'],
      highlights: ['Clean Visual Hierarchy', 'Premium Organic Branding', 'Modern Card Layouts', 'Mobile-first Experience', 'Strong Typography', 'Trust Building Sections', 'Easy Navigation', 'Fast User Journey'],
      resultsList: ['Premium Brand Identity', 'Better User Experience', 'Higher Customer Trust', 'Mobile Optimized', 'Faster Product Discovery', 'Improved Conversion Journey'],
      meta: [{label:'Industry', value:'E-commerce / Organic Food'}, {label:'Platform', value:'WordPress'}, {label:'Project Type', value:'Website Design & Development'}, {label:'Duration', value:'4 Weeks'}],
    },
  },
  {
    slug: 'smart-fleet-travels',
    title: 'Smart Fleet Travels',
    client: 'Smart Fleet Travels',
    category: 'Website',
    hue: '#0582D5',
    image: '/brand/work/smart-fleet-cover.jpg',
    challenge: 'Smart Fleet Travels needed a premium, booking-ready website that could showcase Mumbai city tours, outstation packages and curated hotel stays while earning instant trust from tourists, NRIs and corporate travellers landing on the site for the first time.',
    approach: 'We built a destination-led experience anchored by a live search widget, clear tour categories (Mumbai City, Shirdi, Lonavala, Mahabaleshwar), verified trust badges (Maharashtra Tourism, IATA, ISO 9001:2015) and a direct WhatsApp enquiry flow for instant response.',
    outcome: 'A fast, trust-first travel website that guides visitors from browsing to enquiry in a few taps, with credibility built in from the first scroll.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    results: [{label:'Tour Categories', value:'10+'},{label:'Trust Certifications', value:'5'},{label:'Booking Flow', value:'Search-to-Enquiry'}],
    detail: {
      subtitle: 'Premium Mumbai & Maharashtra Travel Booking Website',
      cover: '/brand/work/smart-fleet-travels-hero.jpg',
      overview: 'Smart Fleet Travels is a Mumbai-based tours and travels company serving tourists, NRIs, families and corporate travellers with curated city tours, spiritual journeys and hill-station getaways. We built a booking-ready website that leads with a live destination search, showcases verified trust credentials and routes every enquiry straight to WhatsApp.',
      goals: ['Build instant trust with first-time visitors', 'Make browsing tours and packages effortless', 'Showcase government and industry certifications', 'Create a fast path from browsing to enquiry'],
      roles: ['UI/UX Design', 'Website Design', 'Responsive Development', 'Booking Flow Design'],
      process: ['Discovery & Research', 'Information Architecture', 'Wireframing', 'Visual Design', 'Responsive Development', 'Testing & Launch'],
      palette: [{name:'Ocean Blue', hex:'#0582D5'}, {name:'Deep Navy', hex:'#0a1a2e'}, {name:'Warm Sand', hex:'#f3ead6'}, {name:'Clean White', hex:'#ffffff'}],
      features: ['Live Destination Search Widget', 'Mumbai & Outstation Tour Categories', 'Verified Trust Badges', 'Featured Hotels Section', 'Traveller Testimonials', 'Travel Journal / Blog', 'WhatsApp Enquiry Integration', 'Mobile Responsive Layout'],
      highlights: ['Search-first booking journey', 'Government & industry certification display', 'Clean, premium travel-brand visual language', 'Fast, guided enquiry path'],
      resultsList: ['Clear, trust-led first impression', 'Simplified destination discovery', 'Direct WhatsApp enquiry path', 'Fully responsive across devices'],
      meta: [{label:'Industry', value:'Travel & Tourism'}, {label:'Location', value:'Mumbai'}, {label:'Project Type', value:'Website Design & Development'}, {label:'Tech Stack', value:'HTML/CSS/JS'}],
    },
  },
  {
    slug: 'mumtaz-hajj-umrah-tours-travels',
    title: 'Mumtaz Hajj & Umrah Tours and Travels',
    client: 'Mumtaz Hajj & Umrah',
    category: 'Website',
    hue: '#0f5132',
    image: '/brand/work/mumtaz-cover.jpg',
    challenge: 'As a Hajj & Umrah operator, Mumtaz needed a website that earns deep trust from pilgrims and their families within seconds, while making a genuinely complex booking process — packages, documents, group travel — feel calm and simple.',
    approach: 'We designed a warm, reassuring experience built around real pilgrim concerns: Haram-proximity stays, licensed group-organiser status and transparent, fixed pricing — paired with a guided 5-step booking flow and a WhatsApp-first enquiry path for families who prefer to talk it through.',
    outcome: 'A calm, trustworthy booking experience that reflects the seriousness of the journey while making package comparison and enquiries effortless for pilgrims of every age.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    results: [{label:'Package Tiers', value:'4'},{label:'Booking Flow', value:'5-Step Guided'},{label:'Enquiry Channels', value:'WhatsApp + Form'}],
    detail: {
      subtitle: 'Trust-First Hajj & Umrah Booking Website',
      cover: '/brand/work/mumtaz-hajj-umrah-hero.jpg',
      overview: 'Mumtaz Hajj & Umrah Tours and Travels is a Kurla, Mumbai-based pilgrimage operator serving Indian Muslim families since 2009. We built a website that leads with trust — licensing, Haram-proximity stays, transparent pricing — and turns a traditionally overwhelming booking process into a clear, guided 5-step journey.',
      goals: ['Build immediate trust for a high-stakes, emotional journey', 'Simplify comparison across Silver, Gold, Platinum & Family packages', 'Make the booking process feel guided, not overwhelming', 'Give families an easy, familiar way to enquire'],
      roles: ['UI/UX Design', 'Website Design', 'Responsive Development', 'Booking Flow Design'],
      process: ['Discovery & Research', 'Information Architecture', 'Wireframing', 'Visual Design', 'Responsive Development', 'Testing & Launch'],
      palette: [{name:'Deep Green', hex:'#0f5132'}, {name:'Warm Gold', hex:'#c5a24a'}, {name:'Charcoal', hex:'#141414'}, {name:'Clean White', hex:'#ffffff'}],
      features: ['5-Step Guided Booking Flow', 'Package Comparison (Silver/Gold/Platinum/Family)', 'Quick Enquiry Form', 'Scholar Guidance Section', 'Pilgrim Testimonials', 'FAQ Section', 'WhatsApp Enquiry Integration', 'Mobile Responsive Layout'],
      highlights: ['Warm, reassuring visual language for a sensitive journey', 'Government & Haj Committee credentials front and centre', 'Clear, jargon-free package comparison', 'Guided step-by-step booking journey'],
      resultsList: ['Clear trust signals from the first screen', 'Simplified 4-package comparison', 'Direct WhatsApp enquiry path for families', 'Fully responsive across devices'],
      meta: [{label:'Industry', value:'Travel — Hajj & Umrah'}, {label:'Location', value:'Kurla, Mumbai'}, {label:'Project Type', value:'Website Design & Development'}, {label:'Tech Stack', value:'HTML/CSS/JS'}],
    },
  },
  { slug: 'monkbless', title: 'MonkBless Digital Platform', client: 'MonkBless', category: 'Website', hue: '#0e3f2b',
    image: '/brand/work/monkbless-cover.jpg',
    challenge: 'MonkBless had a scattered digital presence across multiple platforms with no unified brand story, inconsistent visuals and poor conversion rates on their website.',
    approach: 'We crafted a complete digital ecosystem: a premium, minimal, calm design language inspired by Buddhist aesthetics, a headless website with advanced booking system, a full brand identity system, and a cohesive content strategy across web and social.',
    outcome: 'A serene, premium digital experience that increased meditation session bookings by 184% and established MonkBless as the most refined wellness brand in its category.',
    tech: ['Next.js', 'Sanity CMS', 'Framer Motion', 'Tailwind', 'Stripe'],
    results: [{label:'Bookings', value:'+184%'},{label:'Avg. Session', value:'+67%'},{label:'Lighthouse', value:'98/100'}],
    detail: {
      subtitle: 'A serene digital sanctuary for modern mindfulness',
      cover: '/brand/work/monkbless-hero.jpg',
      gallery: ['/brand/work/monkbless-hero.jpg'],
      overview: 'MonkBless is a premium wellness brand offering guided meditation, retreats and digital courses. We built a complete digital ecosystem that reflects their philosophy of calm, clarity and depth.',
      goals: [
        'Create a peaceful, premium brand identity',
        'Build a high-converting booking experience',
        'Establish consistent digital presence across all touchpoints',
        'Increase direct bookings and reduce reliance on third-party platforms'
      ],
      roles: ['Brand Strategy', 'UI/UX Design', 'Website Development', 'Content Direction', 'Social Media System'],
      process: ['Discovery & Brand Audit', 'Visual Identity System', 'Website Design & Prototyping', 'Development & Integrations', 'Launch & Content Rollout'],
      palette: [
        { name: 'Deep Forest', hex: '#0e3f2b' },
        { name: 'Warm Sand', hex: '#d8c9b0' },
        { name: 'Soft Mist', hex: '#f4f1eb' },
        { name: 'Saffron', hex: '#c67c4e' }
      ],
      features: [
        'Elegant, calm-first user interface',
        'Seamless meditation booking flow',
        'Membership & digital course platform',
        'Retreat calendar with availability',
        'Beautiful typography and micro-animations'
      ],
      highlights: [
        'Full brand identity including logo, typography and colour system',
        'Headless website with Sanity CMS',
        'Stripe-powered direct booking system',
        'Fully responsive and accessible design'
      ],
      resultsList: [
        '184% increase in meditation session bookings',
        '67% longer average session duration',
        '98/100 Lighthouse performance score',
        'Strong increase in brand recall and social engagement'
      ],
      meta: [
        { label: 'Industry', value: 'Wellness & Mindfulness' },
        { label: 'Location', value: 'Mumbai' },
        { label: 'Project Duration', value: '9 weeks' },
        { label: 'Platform', value: 'Next.js + Sanity' }
      ]
    }
  },
  {
    slug: 'primeheat-industrial',
    title: 'PrimeHeat Industrial Solutions',
    client: 'PrimeHeat',
    category: 'Website',
    hue: '#1e3a5f',
    image: '/brand/work/primeheat-cover.jpg',
    challenge: 'The company needed a professional digital platform capable of presenting highly technical products, engineering capabilities, global operations, and company achievements without overwhelming visitors.',
    approach: 'Designed a modern corporate website with structured information architecture, responsive layouts, and strong visual hierarchy. The interface highlights industrial products, engineering expertise, global presence, and company milestones while making navigation simple for potential clients.',
    outcome: 'The final website delivers a modern and professional digital presence that effectively communicates PrimeHeat Industrial Solutions\' engineering expertise, product portfolio, and global reach.',
    tech: ['Figma', 'HTML5', 'CSS3', 'JavaScript', 'Responsive Web Design'],
    results: [
      { label: 'Credibility', value: '+210%' },
      { label: 'Inquiries', value: '+165%' },
      { label: 'Lighthouse', value: '98/100' },
    ],
    detail: {
      subtitle: 'Industrial Manufacturing Website',
      cover: '/brand/work/primeheat-hero.png',
      gallery: ['/brand/work/primeheat-hero.png'],
      overview: 'PrimeHeat Industrial Solutions is a leading industrial engineering company specializing in the design, manufacturing, and installation of advanced thermal processing systems. The website was designed to establish credibility, showcase technical expertise, and provide an intuitive experience for industrial clients seeking furnace solutions and engineering services.',
      goals: ['Establish professional brand presence', 'Showcase technical expertise', 'Support business inquiries', 'Organize complex industrial information'],
      roles: ['UI/UX Design', 'Website Design', 'Information Architecture', 'Responsive Design', 'User Experience', 'Visual Design', 'Design System', 'Prototype Design'],
      process: ['Research & Discovery', 'Information Architecture', 'Wireframing & Prototyping', 'Visual Design', 'Responsive Development', 'Testing & Refinement'],
      palette: [
        { name: 'Industrial Navy', hex: '#1e3a5f' },
        { name: 'Steel Blue', hex: '#2f5c8a' },
        { name: 'Warm Accent', hex: '#c75c2e' },
        { name: 'Clean White', hex: '#f8f9fb' },
      ],
      features: ['Hero Banner', 'Product Showcase', 'Company Overview', 'Engineering Expertise', 'Services Section', 'Global Presence Map', 'Client Showcase', 'Latest News', 'Responsive Navigation', 'Contact & Inquiry Form', 'Corporate Footer', 'Mobile Responsive Design'],
      highlights: ['Clean Information Hierarchy', 'Corporate Visual Identity', 'Industrial-Focused Layout', 'Product-Centric Navigation', 'Responsive Design', 'Clear Call-to-Actions', 'High Readability', 'Professional Branding', 'Conversion-Oriented Structure'],
      resultsList: ['Stronger brand credibility', 'Increased qualified inquiries', 'Professional digital presence', 'Seamless user experience', 'Improved navigation for industrial clients'],
      meta: [
        { label: 'Category', value: 'Website' },
        { label: 'Industry', value: 'Industrial Manufacturing' },
        { label: 'Timeline', value: '8 weeks' },
        { label: 'Tech Stack', value: 'Figma + HTML/CSS/JS' },
      ],
    },
  },
  { slug: 'spellbound-brand', title: 'Spellbound Brand Identity', client: 'Spellbound', category: 'Logo', hue: '#111111',
    image: '/brand/work/spellbound-cover.jpg',
    challenge: 'Spellbound needed a premium, memorable brand identity that communicates timeless elegance and modern sophistication in the competitive home décor and interior design space.',
    approach: 'A refined visual system built around architectural lines and interior framing elements. Clean geometric forms paired with sophisticated typography create a timeless, scalable identity that feels both contemporary and enduring.',
    outcome: 'Delivered a highly versatile, instantly recognisable brand system that works flawlessly across packaging, retail, digital platforms, signage and merchandise — positioning Spellbound as a premium, trustworthy home décor leader.',
    tech: ['Brand Strategy', 'Logo Design', 'Visual Identity', 'Typography', 'Mockups'],
    results: [{label:'Scalability', value:'100%'}, {label:'Recognition', value:'Instant'}, {label:'Applications', value:'12+'}],
    detail: {
      subtitle: 'Premium Home Décor Brand Identity',
      cover: '/brand/work/spellbound-brand.png',
      gallery: ['/brand/work/spellbound-brand.png'],
      overview: 'Spellbound is a premium home décor brand identity crafted to represent timeless elegance, sophisticated interiors, and modern living. The visual identity combines clean geometric lines with contemporary typography, creating a memorable and refined brand presence across digital and physical touchpoints.',
      palette: [
        { name: 'Matte Black', hex: '#111111' },
        { name: 'Pure White', hex: '#FFFFFF' },
        { name: 'Warm Gray', hex: '#5C5C5C' },
        { name: 'Stone Beige', hex: '#D4C9B8' },
      ],
      personality: ['Elegant', 'Modern', 'Premium', 'Minimal', 'Sophisticated', 'Timeless', 'Professional'],
      applications: ['Product Packaging', 'Shopping Bags', 'Business Cards', 'Furniture Tags', 'Website', 'Social Media', 'Signage', 'Interior Branding', 'Catalogs', 'Marketing Materials'],
    } },
  { slug: 'mefco-brand', title: 'MEFCO Brand Identity', client: 'MEFCO', category: 'Logo', hue: '#111111',
    image: '/brand/work/mefco-cover.jpg',
    challenge: 'MEFCO needed a timeless corporate identity that communicates trust, reliability and precision in the competitive manufacturing and logistics sector.',
    approach: 'A modern minimal identity built around geometric horizontal lines symbolising movement and efficiency. Bold typography paired with a clean black-and-white palette creates instant recognition across digital and physical touchpoints.',
    outcome: 'Delivered a highly scalable, instantly recognisable brand system that works flawlessly on stationery, packaging, website, merchandise, bags and corporate assets — establishing MEFCO as a premium, trustworthy corporate player.',
    tech: ['Brand Strategy', 'Logo Design', 'Visual Identity', 'Typography', 'Mockups'],
    results: [{label:'Scalability', value:'100%'}, {label:'Recognition', value:'Instant'}, {label:'Applications', value:'12+'}],
    detail: {
      subtitle: 'Modern Corporate Brand Identity',
      cover: '/brand/work/mefco-brand.png',
      gallery: ['/brand/work/mefco-brand.png'],
      overview: 'MEFCO is a modern brand identity designed to communicate trust, reliability, and professionalism through a clean, minimal, and memorable visual language. The logo combines geometric simplicity with bold typography to create a strong corporate presence across both digital and physical applications.',
      palette: [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Charcoal Gray', hex: '#1A1A1A' },
      ],
      features: ['Minimal Geometry', 'Strong Visual Balance', 'Clean Typography', 'High Scalability', 'Instant Recognition'],
      highlights: ['Business Stationery', 'Product Branding', 'Packaging', 'Website', 'Social Media', 'Corporate Documents', 'Merchandise', 'Bags & Accessories', 'Marketing Materials'],
      resultsList: ['Instantly recognizable corporate presence', 'Highly scalable across all touchpoints', 'Strong visual consistency in every application'],
      meta: [
        { label: 'Industry', value: 'Corporate • Manufacturing • Logistics' },
        { label: 'Project Type', value: 'Brand Identity Design' },
        { label: 'Brand Personality', value: 'Modern • Professional • Reliable • Bold • Minimal • Trustworthy' },
      ],
      goals: ['Build a timeless corporate identity', 'Communicate trust & precision', 'Ensure perfect scalability across all touchpoints'],
      roles: ['Brand Strategy', 'Logo Design', 'Visual Identity', 'Typography', 'Mockups & Applications'],
      process: ['Discovery & Strategy', 'Logo Exploration', 'Typography & Palette', 'Applications Design', 'Mockups & Delivery'],
    } },
  { slug: 'carereach-foundation', title: 'CareReach Foundation', client: 'CareReach', category: 'Website', hue: '#0d6e8f',
    challenge: 'An NGO needed a modern, trustworthy website capable of presenting a large volume of information — healthcare, education, food relief, community welfare and beneficiary stories — without overwhelming visitors.',
    approach: 'Clean, modern NGO website with strong visual hierarchy, intuitive navigation, fully responsive layouts and clear sections that build credibility and drive donations and volunteer sign-ups.',
    outcome: 'Successfully positioned CareReach as a credible, compassionate nonprofit. Improved content accessibility, strengthened public trust, simplified donation/volunteer flows and effectively showcased their impact.',
    tech: ['Figma', 'HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    results: [{label:'Medical Aid', value:'4.5k+'},{label:'Lives Impacted', value:'5Cr+'},{label:'People Helped', value:'3.65L+'}],
    image: '/brand/work/carereach-cover.jpg',
    detail: {
      subtitle: 'Nonprofit Website Design',
      cover: '/brand/work/carereach.png',
      gallery: ['/brand/work/carereach.png'],
      overview: 'CareReach Foundation is a nonprofit organization committed to improving lives through healthcare assistance, educational support, food relief, and community welfare programs. The website was designed to create a trustworthy, informative, and accessible digital platform.',
      roles: ['UI/UX Design', 'Website Design', 'UX Research', 'Information Architecture', 'Wireframing', 'Responsive Design', 'Visual Design', 'Design System', 'Prototype Design'],
      features: ['Hero Banner', 'Mission & Vision', 'Donation Call-to-Action', 'Medical Assistance', 'Education Support', 'Food Relief', 'Community Welfare', 'Beneficiary Stories', 'Impact Statistics', 'Volunteer Registration', 'Patient Schedule', 'Gallery', 'Contact Form'],
      highlights: ['Clean Information Hierarchy', 'Trust-Oriented Visual Design', 'Donation-Focused CTAs', 'Mobile-First Design', 'Accessibility-Focused Layout', 'Clear Section-Based Structure'],
      palette: [
        { name: 'Primary Teal', hex: '#0d6e8f' },
        { name: 'Accent Green', hex: '#00b894' },
        { name: 'Deep Navy', hex: '#0a2540' },
        { name: 'Soft White', hex: '#f8fafc' },
      ],
    } },
];

export interface Industry { icon: LucideIcon; name: string; }
export const industries: Industry[] = [
  { icon: HeartPulse, name: 'Healthcare' },
  { icon: Landmark, name: 'Finance' },
  { icon: Building2, name: 'Real Estate' },
  { icon: GraduationCap, name: 'Education' },
  { icon: Store, name: 'Ecommerce' },
  { icon: Rocket, name: 'Startups' },
  { icon: UtensilsCrossed, name: 'Restaurants' },
  { icon: Briefcase, name: 'Professional Services' },
];

export interface Testimonial { name: string; role: string; company: string; quote: string; rating: number; initials: string; }
export const testimonials: Testimonial[] = [
  { name: 'Zaid Khan', role: 'CEO', company: 'Freshy Fruits', rating: 5, initials: 'ZK',
    quote: 'Our online store finally looks and feels as premium as the fruit we deliver. Orders have grown steadily since launch, and customers keep telling us how easy the checkout is.' },
  { name: 'Sadiq Khan', role: 'Co-Founder', company: 'MK Enterprises', rating: 5, initials: 'SK',
    quote: 'PrimeXPixel took our entire online presence and gave it direction — from our website to how we show up online. It finally feels professional and consistent.' },
  { name: 'Irfan Shaikh', role: 'Director', company: 'Mumtaz Hajj & Umrah Tours and Travels', rating: 5, initials: 'IS',
    quote: 'Families trust us with one of the most important journeys of their life, and our website finally reflects that. Enquiries have gone up noticeably since the new site went live.' },
  { name: 'Saqib Shaikh', role: 'CEO', company: 'Laxura Perfumes', rating: 5, initials: 'SS',
    quote: 'PrimeXPixel captured the luxury and elegance we wanted for our fragrance brand — the website looks and feels premium from the very first click.' },
  { name: 'Govind', role: 'Co-Founder', company: 'MonkBless', rating: 5, initials: 'G',
    quote: 'The website they built genuinely elevated our brand. It feels premium and thoughtfully designed — exactly what we needed for our fragrance and god-accessories line.' },
  { name: 'Kaleem Shaikh', role: 'Director', company: 'Glazemaster', rating: 5, initials: 'KS',
    quote: 'Our new website represents our brand the way it deserves — professional, credible and easy for customers to navigate. Exactly what we needed.' },
  { name: 'Meera Kapoor', role: 'Founder & Creative Director', company: 'Spellbound', rating: 5, initials: 'MK',
    quote: 'The brand identity PrimeXPixel created is simply stunning. It captures the essence of premium home décor perfectly and looks incredible across every touchpoint — packaging, digital, and retail. We couldn’t be happier.' },
  { name: 'Miladi Sound', role: 'Client', company: 'Google Review', rating: 5, initials: 'MS',
    quote: 'MashaAllah, they do an excellent job! The quality is top-notch, the pricing is very reasonable, and they always complete the work before the deadline. Very professional and reliable service. Highly recommended!' },
  { name: 'Halima Kazi', role: 'Client', company: 'Google Review', rating: 5, initials: 'HK',
    quote: 'I\u2019m really happy with the service I received from PrimeXPixel. From the beginning, the team was attentive, easy to communicate with, and genuinely focused on getting things right. They brought great ideas to the project and made the whole experience smooth and hassle-free. The final result looked professional and worked exactly as I needed.' },
  { name: 'Shaziya Shaikh', role: 'Client', company: 'Google Review', rating: 5, initials: 'SS',
    quote: 'I had a great experience with PrimeXPixel. The team was professional, responsive, and understood the requirements really well. The website design was modern, clean, and user-friendly, and they were also very cooperative throughout the process. Highly recommended for website development and digital marketing services!' },
];

export interface Stat { value: number; suffix: string; label: string; }
export const stats: Stat[] = [
  { value: 100, suffix: '+', label: 'Projects Delivered' },
  { value: 60, suffix: '+', label: 'Happy Clients' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 24, suffix: '/7', label: 'Dedicated Support' },
];

export interface BlogPost {
  slug: string; image: string; title: string; category: string; excerpt: string;
  date: string; iso: string; read: string; hue: string;
  area: string; keywords: string[];
  metaTitle: string; metaDescription: string;
  content: { heading: string; body: string[] }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'website-development-company-kurla-mumbai',
    image: '/brand/blog/kurla-web-dev.jpg',
    title: 'Website Development in Kurla: What Local Businesses Get Wrong',
    category: 'Web Design',
    area: 'Kurla',
    excerpt: 'Most Kurla businesses lose customers to slow, dated websites. Here is how a modern website development approach wins local search and converts nearby buyers.',
    date: 'Feb 18, 2026', iso: '2026-02-18', read: '7 min', hue: '#0582D5',
    keywords: ['website development company Kurla', 'website development Mumbai', 'web design Kurla', 'website designer near Kurla', 'local business website Mumbai'],
    metaTitle: 'Website Development Company in Kurla, Mumbai | PrimexPixel',
    metaDescription: 'Looking for a website development company in Kurla, Mumbai? PrimexPixel builds fast, SEO-friendly websites that rank locally and convert. Free consultation.',
    content: [
      { heading: 'Why Kurla businesses need a modern website', body: [
        'Kurla sits at the heart of Mumbai\u2019s commercial corridor \u2014 from Phoenix Marketcity to the BKC fringe \u2014 yet most local businesses still run websites that load in five seconds or more. On mobile, where the majority of Kurla searches happen, that delay quietly kills conversions before a customer ever sees your offer.',
        'A website development company in Kurla should treat speed, mobile UX and local search as non-negotiables. When someone nearby searches \u201cbest [your service] near Kurla\u201d, Google rewards fast, well-structured, locally-optimised sites \u2014 not pretty templates that ignore performance.',
      ]},
      { heading: 'The three mistakes that cost you local customers', body: [
        '1. Ignoring local SEO. Without a Google Business Profile, location schema and Kurla-specific landing content, you are invisible to \u201cnear me\u201d searches that drive walk-ins and calls.',
        '2. Template overload. Cheap templates bloat your site with unused code, tanking Core Web Vitals and your mobile ranking.',
        '3. No conversion path. Traffic means nothing without clear CTAs, WhatsApp click-to-chat and forms tuned for Mumbai buyers.',
      ]},
      { heading: 'How PrimexPixel builds websites that rank in Kurla', body: [
        'We architect performance-first websites with sub-second load times, semantic HTML, structured data and location pages that target Kurla and neighbouring areas like Chembur, Ghatkopar and BKC. Every build ships with a 90+ Lighthouse score and a conversion path mapped to how local customers actually buy.',
        'The result: higher local rankings, more qualified enquiries and a brand that looks as premium as the market leaders \u2014 without the enterprise price tag.',
      ]},
    ],
  },
  {
    slug: 'digital-marketing-agency-chembur-mumbai',
    image: '/brand/blog/chembur-marketing.jpg',
    title: 'Digital Marketing in Chembur: A Local Growth Playbook',
    category: 'Marketing',
    area: 'Chembur',
    excerpt: 'A practical digital marketing playbook for Chembur businesses \u2014 local SEO, paid ads and social that turn nearby searches into paying customers.',
    date: 'Feb 12, 2026', iso: '2026-02-12', read: '8 min', hue: '#97C73D',
    keywords: ['digital marketing agency Chembur', 'digital marketing Mumbai', 'local SEO Chembur', 'social media marketing Chembur', 'PPC agency Mumbai'],
    metaTitle: 'Digital Marketing Agency in Chembur, Mumbai | PrimexPixel',
    metaDescription: 'PrimexPixel is a results-driven digital marketing agency serving Chembur, Mumbai. Local SEO, Google Ads & social media that grow revenue. Book a free audit.',
    content: [
      { heading: 'Chembur is competitive \u2014 your marketing has to be sharper', body: [
        'From Chembur Naka to Diamond Garden, local businesses compete hard for attention. Generic marketing that ignores geography wastes budget. A digital marketing agency in Chembur should build campaigns around how people in this pocket of Mumbai actually search, scroll and buy.',
      ]},
      { heading: 'The local growth stack that works', body: [
        'Local SEO: Optimise your Google Business Profile, earn local citations and publish Chembur-specific content so you appear in the map pack for \u201cnear me\u201d searches.',
        'Paid search: Geo-target Chembur and surrounding areas like Ghatkopar, Kurla and Wadala so every rupee reaches buyers within delivery or travel distance.',
        'Social media: Consistent, locally-relevant creative that builds trust and drives WhatsApp enquiries from a nearby audience.',
      ]},
      { heading: 'Measuring what matters', body: [
        'We tie every channel to revenue \u2014 calls, WhatsApp chats, form fills and walk-ins \u2014 not vanity metrics. Chembur clients see exactly which campaigns bring paying customers, and we double down on what compounds.',
      ]},
    ],
  },
  {
    slug: 'ui-ux-design-agency-bandra-mumbai',
    image: '/brand/blog/bandra-uiux.jpg',
    title: 'UI/UX Design in Bandra: Designing for a Premium Audience',
    category: 'UI/UX',
    area: 'Bandra',
    excerpt: 'Bandra brands expect polish. Learn how research-led UI/UX design turns Mumbai\u2019s most discerning audience into loyal customers.',
    date: 'Feb 06, 2026', iso: '2026-02-06', read: '6 min', hue: '#0582D5',
    keywords: ['UI UX design agency Bandra', 'UI UX design Mumbai', 'product design Bandra', 'app design agency Mumbai', 'website UX Bandra'],
    metaTitle: 'UI/UX Design Agency in Bandra, Mumbai | PrimexPixel',
    metaDescription: 'PrimexPixel is a UI/UX design agency in Bandra, Mumbai crafting research-led, conversion-focused interfaces for premium brands. See our work.',
    content: [
      { heading: 'Bandra\u2019s audience notices the details', body: [
        'From Linking Road to Bandra West\u2019s cafe culture, this is one of Mumbai\u2019s most design-literate audiences. A clunky interface signals a clunky business. Premium UI/UX design is how Bandra brands earn trust in the first three seconds.',
      ]},
      { heading: 'Research before pixels', body: [
        'Great design is not decoration \u2014 it is decision-making backed by evidence. We map user journeys, run usability testing with real Mumbai users and build design systems that stay consistent as you scale.',
      ]},
      { heading: 'From beautiful to profitable', body: [
        'Every screen we design is tuned for conversion: clear hierarchy, frictionless flows and accessible, mobile-first layouts. The outcome is a product that looks world-class and moves the metrics that matter.',
      ]},
    ],
  },
  {
    slug: 'ecommerce-website-development-dadar-mumbai',
    image: '/brand/blog/dadar-ecommerce.jpg',
    title: 'Ecommerce Website Development in Dadar: Sell More Online',
    category: 'Business Growth',
    area: 'Dadar',
    excerpt: 'Dadar\u2019s retailers are moving online fast. Here is how to build an ecommerce website that actually converts and scales with your Mumbai business.',
    date: 'Jan 30, 2026', iso: '2026-01-30', read: '9 min', hue: '#97C73D',
    keywords: ['ecommerce website development Dadar', 'ecommerce development Mumbai', 'online store Dadar', 'Shopify developer Mumbai', 'ecommerce agency Mumbai'],
    metaTitle: 'Ecommerce Website Development in Dadar, Mumbai | PrimexPixel',
    metaDescription: 'Launch a high-converting online store with PrimexPixel \u2014 ecommerce website development for Dadar & Mumbai businesses. Fast, secure & built to scale.',
    content: [
      { heading: 'Dadar\u2019s retail heritage meets online growth', body: [
        'Dadar has been a shopping destination for generations \u2014 from Ranade Road to Dadar Market. Today, the smartest retailers are extending that footfall online. But a template store capped at a 1% conversion rate leaves money on the table.',
      ]},
      { heading: 'What a high-converting store needs', body: [
        'A streamlined, two-step checkout, smart product discovery, fast mobile performance and integrated payments and logistics. We also connect your store to CRM and analytics so every order teaches you how to sell more.',
      ]},
      { heading: 'Built to scale across Mumbai and beyond', body: [
        'Whether you serve Dadar, Mahim and Matunga locally or ship across India, we build ecommerce foundations that grow with you \u2014 no re-platforming every year.',
      ]},
    ],
  },
  {
    slug: 'graphic-design-branding-mahim-mumbai',
    image: '/brand/blog/mahim-branding.jpg',
    title: 'Branding & Graphic Design in Mahim: Look Like the Leader',
    category: 'Web Design',
    area: 'Mahim',
    excerpt: 'Consistent branding lets Mahim businesses charge premium prices. A practical guide to logos, identity and graphic design that builds trust.',
    date: 'Jan 22, 2026', iso: '2026-01-22', read: '5 min', hue: '#0582D5',
    keywords: ['graphic design agency Mahim', 'branding agency Mumbai', 'logo design Mahim', 'brand identity Mumbai', 'graphic design Mumbai'],
    metaTitle: 'Graphic Design & Branding Agency in Mahim, Mumbai | PrimexPixel',
    metaDescription: 'PrimexPixel crafts premium brand identities and graphic design for Mahim & Mumbai businesses \u2014 logos, guidelines and collateral that command trust.',
    content: [
      { heading: 'Why branding is a growth lever, not a cost', body: [
        'In a dense market like Mahim, inconsistent visuals make even good businesses look uncertain. A cohesive brand identity signals quality \u2014 and quality lets you charge more.',
      ]},
      { heading: 'What a complete brand system includes', body: [
        'A distinctive logo, a defined colour and type system, brand guidelines and ready-to-use templates for social, packaging and print. Everything works together so you look consistent everywhere a Mumbai customer meets you.',
      ]},
      { heading: 'From local shop to recognised name', body: [
        'We have helped Mumbai brands reposition as category leaders \u2014 enabling price increases and stronger recall. Good design pays for itself.',
      ]},
    ],
  },
  {
    slug: 'local-seo-guide-mumbai-near-me',
    image: '/brand/blog/mumbai-seo.jpg',
    title: 'The Local SEO Guide to Ranking for \u201cNear Me\u201d in Mumbai',
    category: 'SEO',
    area: 'Mumbai',
    excerpt: 'A step-by-step local SEO guide to help your Mumbai business appear at the top for \u201cnear me\u201d searches across Kurla, Chembur, Bandra, Andheri and more.',
    date: 'Jan 14, 2026', iso: '2026-01-14', read: '10 min', hue: '#97C73D',
    keywords: ['local SEO Mumbai', 'SEO company Mumbai', 'near me SEO', 'Google Business Profile Mumbai', 'rank on Google Mumbai'],
    metaTitle: 'Local SEO Company in Mumbai | Rank for \u201cNear Me\u201d | PrimexPixel',
    metaDescription: 'Rank at the top for \u201cnear me\u201d searches in Mumbai. PrimexPixel\u2019s local SEO guide covers Google Business Profile, citations, reviews & location pages.',
    content: [
      { heading: 'How \u201cnear me\u201d search actually works', body: [
        'When someone in Andheri, Powai or Ghatkopar searches \u201cbest [service] near me\u201d, Google blends proximity, relevance and prominence. Win all three and you land in the map pack \u2014 the three listings that capture most local clicks and calls.',
      ]},
      { heading: 'Your local SEO checklist', body: [
        'Claim and fully optimise your Google Business Profile with categories, photos and posts.',
        'Build consistent NAP citations across Indian directories.',
        'Earn genuine reviews \u2014 they strongly influence local rank and trust.',
        'Publish area-specific landing pages for the neighbourhoods you serve.',
        'Add LocalBusiness schema so search engines understand your location and services.',
      ]},
      { heading: 'Covering the whole city, one area at a time', body: [
        'We build a hub-and-spoke content structure \u2014 one strong service hub linked to dedicated pages for Kurla, Chembur, Bandra, Mahim, Dadar, Andheri and more \u2014 so you compound rankings across Mumbai instead of fighting for a single generic keyword.',
      ]},
    ],
  },
  {
    slug: 'social-media-management-andheri-mumbai',
    image: '/brand/blog/andheri-social.jpg',
    title: 'Social Media Management in Andheri: From Posts to Pipeline',
    category: 'Marketing',
    area: 'Andheri',
    excerpt: 'Turn your Andheri brand\u2019s social presence into real enquiries. A guide to content, community and paid social that drives Mumbai customers.',
    date: 'Jan 08, 2026', iso: '2026-01-08', read: '6 min', hue: '#0582D5',
    keywords: ['social media management Andheri', 'social media marketing Mumbai', 'Instagram marketing Andheri', 'social media agency Mumbai'],
    metaTitle: 'Social Media Management in Andheri, Mumbai | PrimexPixel',
    metaDescription: 'PrimexPixel manages social media for Andheri & Mumbai brands \u2014 content, community and paid campaigns that turn followers into paying customers.',
    content: [
      { heading: 'Andheri\u2019s audience lives on their feeds', body: [
        'With a young, digital-first population from Andheri East to Lokhandwala, social is often the first place customers discover you. Random posting won\u2019t cut through \u2014 strategy will.',
      ]},
      { heading: 'The system: content, community, conversion', body: [
        'We build a content calendar rooted in your goals, produce scroll-stopping creative, manage community engagement and amplify winners with targeted paid social geo-focused on Andheri and nearby Mumbai suburbs.',
      ]},
      { heading: 'From vanity metrics to real pipeline', body: [
        'Followers are nice; enquiries pay the bills. Every campaign routes to WhatsApp, DMs or forms so social becomes a measurable channel \u2014 not a time sink.',
      ]},
    ],
  },
  {
    slug: 'video-editing-services-powai-mumbai',
    image: '/brand/blog/powai-video.jpg',
    title: 'Video Editing in Powai: Reels That Actually Perform',
    category: 'Technology',
    area: 'Powai',
    excerpt: 'Powai\u2019s startups and creators need video that stops the scroll. A guide to reels, motion graphics and edits engineered for retention.',
    date: 'Jan 02, 2026', iso: '2026-01-02', read: '5 min', hue: '#97C73D',
    keywords: ['video editing services Powai', 'video editing Mumbai', 'reels editing Powai', 'motion graphics Mumbai', 'video production Mumbai'],
    metaTitle: 'Video Editing Services in Powai, Mumbai | PrimexPixel',
    metaDescription: 'PrimexPixel offers professional video editing in Powai, Mumbai \u2014 reels, shorts and motion graphics engineered for retention and shares.',
    content: [
      { heading: 'Powai runs on content', body: [
        'From Hiranandani\u2019s startup offices to IIT Bombay\u2019s creator community, Powai produces a lot of video \u2014 but flat, unbranded edits get ignored in a feed built for motion.',
      ]},
      { heading: 'What makes video perform', body: [
        'A strong hook in the first second, tight pacing, branded motion graphics, clean colour grading and platform-native formatting for Reels, Shorts and YouTube. We edit for the metric that matters: watch time.',
      ]},
      { heading: 'Consistency at scale', body: [
        'We help Powai brands ship a steady stream of high-quality video without burning out \u2014 so your channel compounds instead of stalling after a few posts.',
      ]},
    ],
  },
  {
    slug: 'website-development-company-mumbai',
    image: '/brand/blog/website-development-mumbai.jpg',
    title: 'How to Choose a Website Development Company in Mumbai (2026 Guide)',
    category: 'Web Design',
    area: 'Mumbai',
    excerpt: 'Mumbai has no shortage of website developers — few actually build for speed, SEO and conversions. Here is what to look for before you hire one.',
    date: 'Aug 05, 2026', iso: '2026-08-05', read: '8 min', hue: '#0582D5',
    keywords: ['website development company in Mumbai', 'best website development company Mumbai', 'web design company Mumbai', 'website designer Mumbai', 'custom website development Mumbai'],
    metaTitle: 'Best Website Development Company in Mumbai | PrimexPixel',
    metaDescription: 'Searching for the best website development company in Mumbai? PrimexPixel builds fast, SEO-ready websites for businesses across the city. Free consultation.',
    content: [
      { heading: 'Why "a website" isn\u2019t enough anymore', body: [
        'Every business in Mumbai has a website. Very few have one that actually loads fast, ranks on Google and converts a visitor into an enquiry. A website development company in Mumbai worth hiring treats the site as a growth asset, not a digital business card \u2014 which means performance, structure and conversion paths are decided before a single pixel is designed.',
        'If your current site takes more than two to three seconds to load on mobile, you are already losing a large share of visitors before they see what you offer. That is the baseline every serious web development partner in Mumbai should fix first.',
      ]},
      { heading: 'What to check before you hire', body: [
        'Portfolio depth: Ask to see real, live projects \u2014 not just mockups \u2014 and check how those sites actually perform on Google PageSpeed Insights.',
        'Local SEO built in: A Mumbai-focused developer should default to semantic HTML, schema markup and location-aware content, not bolt it on later as an afterthought.',
        'Ownership and handover: You should walk away owning your code, your domain and your content \u2014 not locked into a developer\u2019s proprietary platform.',
        'Post-launch support: Ask what happens after go-live. A site with no maintenance plan degrades in rankings and security within months.',
      ]},
      { heading: 'How PrimexPixel approaches every Mumbai build', body: [
        'We are based in Kurla and build for businesses across Mumbai \u2014 from Bandra to Chembur, Andheri to Dadar. Every site we ship targets a 90+ Lighthouse score, ships with structured data out of the box, and is mapped to a clear conversion path before we write a line of code.',
        'The goal is simple: when someone in Mumbai searches for what you do, your site should be fast enough, relevant enough and structured well enough to actually show up \u2014 and convert once it does.',
      ]},
    ],
  },
  {
    slug: 'content-writing-services-mumbai',
    image: '/brand/blog/content-writing-mumbai.jpg',
    title: 'Content Writing Services in Mumbai: Words That Actually Convert',
    category: 'Content',
    area: 'Mumbai',
    excerpt: 'Good design gets someone to your page. Good writing is what makes them stay, trust you and enquire. A look at what real SEO content writing involves.',
    date: 'Jul 28, 2026', iso: '2026-07-28', read: '6 min', hue: '#97C73D',
    keywords: ['content writing services Mumbai', 'SEO content writing Mumbai', 'website copywriting Mumbai', 'blog writing services Mumbai', 'content writer Mumbai'],
    metaTitle: 'Content Writing Services in Mumbai | PrimexPixel',
    metaDescription: 'PrimexPixel offers SEO content writing, website copy and blog writing for Mumbai businesses that want to rank and convert. Free consultation.',
    content: [
      { heading: 'Traffic without good copy is a leaky bucket', body: [
        'You can rank on page one and still lose the customer if your copy does not explain why you are the right choice, quickly and clearly. Content writing services in Mumbai should be judged on one thing above all: does the writing move a reader toward an enquiry, or does it just fill space?',
      ]},
      { heading: 'What real SEO content writing looks like', body: [
        'Keyword research grounded in how Mumbai customers actually search \u2014 not just high-volume generic terms.',
        'Website copy that leads with the customer\u2019s problem, not a list of your services.',
        'Blog content built around genuine questions your customers ask, structured to earn featured snippets and "near me" visibility.',
        'A consistent voice across your site, blog and social \u2014 so your brand feels like one business, not five different writers.',
      ]},
      { heading: 'How we write for Mumbai businesses', body: [
        'We pair every piece of content with the SEO and design work happening around it, so your copy is never written in isolation. The result is content that reads naturally, respects the reader\u2019s time and is structured for search engines to actually understand and rank.',
      ]},
    ],
  },
  {
    slug: 'crm-ai-automation-mumbai-businesses',
    image: '/brand/blog/crm-automation-mumbai.jpg',
    title: 'CRM & AI Automation for Mumbai Businesses: Stop Losing Leads',
    category: 'Technology',
    area: 'Mumbai',
    excerpt: 'Most Mumbai businesses still track leads on WhatsApp and spreadsheets. Here is how CRM and AI automation plugs the gaps that quietly cost you sales.',
    date: 'Jul 20, 2026', iso: '2026-07-20', read: '7 min', hue: '#0582D5',
    keywords: ['CRM automation Mumbai', 'AI automation agency Mumbai', 'WhatsApp CRM Mumbai', 'sales automation Mumbai', 'business automation Mumbai'],
    metaTitle: 'CRM & AI Automation Services in Mumbai | PrimexPixel',
    metaDescription: 'PrimexPixel builds CRM systems and AI automation for Mumbai businesses that respond faster, follow up automatically and close more leads. Free consultation.',
    content: [
      { heading: 'The real cost of manual follow-up', body: [
        'A lead messages you on WhatsApp or fills a form, and if no one replies within minutes, they have already messaged your competitor. For most Mumbai businesses, the problem is not a lack of leads \u2014 it is leads slipping through the cracks between a spreadsheet, a personal phone and a busy team.',
      ]},
      { heading: 'What CRM & AI automation actually fixes', body: [
        'Instant response: AI-assisted replies acknowledge every enquiry the moment it arrives, on WhatsApp, web forms or Instagram DMs, so no lead goes cold waiting on a human.',
        'Structured follow-up: Every lead is logged, tagged and automatically nudged through a follow-up sequence instead of relying on someone remembering to call back.',
        'Clear pipeline visibility: You see exactly where every lead stands \u2014 new, contacted, quoted, won \u2014 instead of guessing from chat history.',
      ]},
      { heading: 'Built to fit how you already work', body: [
        'We do not force Mumbai businesses onto rigid enterprise software. We build CRM and automation around the channels you already use \u2014 WhatsApp, Instagram, calls \u2014 so adoption is easy and the system starts paying for itself from week one.',
      ]},
    ],
  },
  {
    slug: 'best-digital-agency-kurla-mumbai',
    image: '/brand/blog/best-agency-kurla.jpg',
    title: 'Best Digital Agency in Kurla, Mumbai: How to Choose the Right Partner (2026)',
    category: 'Business Growth',
    area: 'Kurla',
    excerpt: 'Kurla has plenty of freelancers and one-service vendors. Very few can actually run your website, branding, marketing and video under one roof. Here is what separates the two.',
    date: 'Aug 08, 2026', iso: '2026-08-08', read: '7 min', hue: '#0582D5',
    keywords: ['best agency in Kurla', 'best digital marketing agency Kurla', 'top agency in Kurla Mumbai', 'branding agency Kurla', 'advertising agency Kurla Mumbai'],
    metaTitle: 'Best Digital Agency in Kurla, Mumbai | PrimexPixel',
    metaDescription: 'Looking for the best digital agency in Kurla, Mumbai? PrimexPixel offers website development, branding, marketing and video under one roof. Free consultation.',
    content: [
      { heading: 'Kurla has no shortage of vendors \u2014 few real agencies', body: [
        'Search "best agency in Kurla" and you will find plenty of freelance designers, single-service WhatsApp vendors and one-person operations. What is genuinely rare is a team that can take a business from a logo, to a website, to a running marketing engine \u2014 without you having to manage three different vendors who do not talk to each other.',
        'That gap is exactly what most growing Kurla businesses run into: the website is handled by one person, the Instagram page by another, and nobody owns whether any of it is actually generating enquiries.',
      ]},
      { heading: 'What actually separates a real agency from a vendor', body: [
        'One team, one accountability: your website, branding and marketing are planned together, not handed to disconnected freelancers who never see the full picture.',
        'A real portfolio you can verify: ask to see live, working sites and real client outcomes \u2014 not just Instagram mockups.',
        'Local understanding: an agency based in Kurla understands the mix of nearby markets \u2014 Kurla East\u2019s industrial and trading businesses, Kurla West\u2019s retail and residential footfall \u2014 and how differently each should be marketed.',
        'Clear ownership after launch: what happens when something breaks, or you want a page updated six months later? A vendor disappears; an agency has a support process.',
      ]},
      { heading: 'Why Kurla businesses choose PrimexPixel', body: [
        'We are based right here in Kurla East, and we intentionally built PrimexPixel to remove the multi-vendor problem \u2014 website development, UI/UX, branding, video editing, social media and digital marketing all run by one accountable team.',
        'If you are comparing agencies in Kurla, the fair test is simple: ask for real, live client websites and speak to us directly \u2014 no lock-in, no jargon, just a clear plan for what your business actually needs.',
      ]},
    ],
  },
  {
    slug: 'marketing-kurla-east-west-mumbai',
    image: '/brand/blog/kurla-east-west-marketing.jpg',
    title: 'Kurla East vs Kurla West: Marketing Your Business to Both Sides',
    category: 'Marketing',
    area: 'Kurla',
    excerpt: 'Kurla East and Kurla West are separated by a railway line and a completely different customer mindset. Generic marketing misses both. Here is how to reach each side properly.',
    date: 'Aug 09, 2026', iso: '2026-08-09', read: '6 min', hue: '#97C73D',
    keywords: ['digital marketing Kurla East', 'digital marketing Kurla West', 'marketing agency Kurla', 'advertising Kurla Mumbai', 'local marketing agency Kurla'],
    metaTitle: 'Digital Marketing in Kurla East & West, Mumbai | PrimexPixel',
    metaDescription: 'Marketing agency serving both Kurla East and Kurla West, Mumbai. PrimexPixel helps local businesses reach customers across the LBS Marg corridor. Free consultation.',
    content: [
      { heading: 'Two very different Kurlas, one postal code', body: [
        'Kurla East \u2014 anchored around LBS Marg, the industrial estates and Nehru Nagar \u2014 skews toward trading, manufacturing and B2B businesses. Kurla West, with its markets, residential density and proximity to Phoenix Marketcity, is far more retail and footfall driven. A single generic Instagram strategy rarely works for both.',
      ]},
      { heading: 'What actually works on each side', body: [
        'Kurla East: LinkedIn and Google Search carry more weight here \u2014 decision-makers search with intent rather than browse casually, so a strong website and clear service pages matter more than reels.',
        'Kurla West: Instagram, WhatsApp broadcast and hyperlocal Google Business optimisation drive walk-ins and enquiries \u2014 visual, fast-moving content wins attention.',
        'Both sides share one thing: Google "near me" searches are decided in seconds by whichever business has a fast website, real photos and recent reviews \u2014 not just the loudest ad spend.',
      ]},
      { heading: 'How we plan Kurla campaigns', body: [
        'Every campaign we run for a Kurla business starts by identifying which side of the line their actual customers sit on \u2014 sometimes both \u2014 and building the channel mix around that, instead of applying the same playbook everywhere.',
      ]},
    ],
  },
  {
    slug: 'freshy-fruits-ecommerce-case-study',
    image: '/brand/work/freshy-hero.jpg',
    title: 'How We Built Freshy Fruits: A Premium Online Fruit Delivery Platform',
    category: 'Case Study',
    area: 'Kurla',
    excerpt: 'Freshy Fruits needed an online store that felt as premium and trustworthy as farm-fresh produce deserves. Here is how we designed and built their ecommerce platform.',
    date: 'Aug 11, 2026', iso: '2026-08-11', read: '6 min', hue: '#97C73D',
    keywords: ['ecommerce website case study Mumbai', 'fruit delivery website design', 'ecommerce web design Kurla', 'online store development Mumbai', 'Freshy Fruits website'],
    metaTitle: 'Freshy Fruits Case Study: Ecommerce Website Design | PrimexPixel',
    metaDescription: 'See how PrimexPixel designed and built Freshy Fruits, a premium online fruit delivery platform \u2014 from brand trust to a simplified checkout experience.',
    content: [
      { heading: 'The challenge: selling freshness online', body: [
        'Freshy Fruits sources and delivers farm-fresh fruit directly to customers, but their biggest hurdle had nothing to do with the produce itself \u2014 it was convincing someone browsing on a phone that fruit ordered online would actually arrive as fresh as it looked in the photos.',
        'That meant the website carried the entire weight of trust-building, before a single order was even placed. A generic ecommerce template was never going to be enough.',
      ]},
      { heading: 'Our approach: premium, organic, effortless', body: [
        'We designed a storefront built around a warm, organic visual identity \u2014 natural tones, honest product photography and clear sourcing information \u2014 so visitors feel the quality before they buy.',
        'On the functional side, we focused on a simplified ordering flow: fast product discovery, a frictionless cart and checkout, and clear delivery information up front, so customers never have to guess whether Freshy Fruits delivers to them or when their order will arrive.',
      ]},
      { heading: 'The result', body: [
        'The finished platform gives Freshy Fruits a storefront that matches the quality of what they sell \u2014 fast, trustworthy and built to convert first-time visitors into repeat customers.',
        'It is a good example of what we believe every ecommerce build should do: make the product the hero, and remove every bit of friction between "I want this" and "order placed".',
      ]},
    ],
  },
  {
    slug: 'mumtaz-hajj-umrah-website-case-study',
    image: '/brand/work/mumtaz-hajj-umrah-hero.jpg',
    title: 'Designing Trust: The Mumtaz Hajj & Umrah Tours Website',
    category: 'Case Study',
    area: 'Kurla',
    excerpt: 'A Hajj and Umrah travel website has to earn trust faster than almost any other kind of site. Here is how we designed the Mumtaz Tours and Travels website to do exactly that.',
    date: 'Aug 12, 2026', iso: '2026-08-12', read: '6 min', hue: '#0582D5',
    keywords: ['Hajj Umrah website design', 'travel agency website case study Mumbai', 'tours and travels website development', 'Mumtaz Tours and Travels', 'pilgrimage travel website design'],
    metaTitle: 'Mumtaz Hajj & Umrah Website Case Study | PrimexPixel',
    metaDescription: 'See how PrimexPixel designed the Mumtaz Hajj & Umrah Tours and Travels website \u2014 built to earn trust and guide pilgrims through every step of their journey.',
    content: [
      { heading: 'The challenge: a decision unlike any other trip', body: [
        'Booking a Hajj or Umrah package is not like booking a holiday. Families are trusting an agency with one of the most meaningful journeys of their life, and that trust has to come through the moment the website loads \u2014 long before a phone call ever happens.',
        'Mumtaz Tours and Travels needed a website that reflected years of experience guiding pilgrims, without feeling like a generic travel template repurposed for a different audience.',
      ]},
      { heading: 'Our approach: calm, credible, guided', body: [
        'We built the site around a warm, respectful visual identity \u2014 imagery of the Haram, clear service breakdowns for visas, flights and accommodation, and prominent trust signals like years of service and pilgrims guided \u2014 so visitors immediately understand who they are dealing with.',
        'Every page is structured to answer the questions families actually have: what is included, how the process works, and how to reach a real consultant \u2014 not buried in menus, but front and centre.',
      ]},
      { heading: 'The result', body: [
        'The finished website gives Mumtaz Tours and Travels a digital presence that matches the trust they have built over years of service \u2014 clear, credible and built to turn visitors into confident enquiries.',
        'For any travel or pilgrimage business, the lesson is the same: when the decision is emotional, design has to lead with reassurance first, and conversion follows naturally.',
      ]},
    ],
  },
];

export interface FAQ { q: string; a: string; }
export const faqs: FAQ[] = [
  { q: 'What makes PrimeXPixel different from other agencies?', a: 'We lead with strategy and tie every deliverable to measurable growth. You get an enterprise-grade team, handcrafted work and full transparency on the metrics that matter.' },
  { q: 'How long does a typical project take?', a: 'A focused website launches in 4\u20136 weeks; larger platforms and ecommerce builds run 8\u201312 weeks. We share a clear timeline during discovery.' },
  { q: 'Do you work with businesses outside Mumbai?', a: 'Absolutely. We are based in Mumbai but partner with clients across India and globally, working seamlessly across time zones.' },
  { q: 'What is included in ongoing support?', a: 'Proactive monitoring, performance optimisation, security updates, analytics reporting and a dedicated point of contact available around the clock.' },
  { q: 'How do you measure success?', a: 'We define KPIs up front \u2014 conversions, revenue, rankings, retention \u2014 and report against them transparently throughout the engagement.' },
  { q: 'Can you take over an existing project or website?', a: 'Yes. We regularly audit, rescue and elevate existing products, migrating them to modern, performant foundations.' },
];

export interface Value { title: string; desc: string; }
export const values: Value[] = [
  { title: 'Craft', desc: 'Every pixel and line of code is handcrafted to an obsessive standard.' },
  { title: 'Partnership', desc: 'We win when you win \u2014 your growth goals become ours.' },
  { title: 'Transparency', desc: 'Clear communication, honest timelines and metrics you can trust.' },
  { title: 'Momentum', desc: 'We ship fast, learn faster and compound results over time.' },
];

export interface TimelineItem { year: string; title: string; desc: string; }
export const companyTimeline: TimelineItem[] = [
  { year: '2019', title: 'The Beginning', desc: 'PrimeXPixel founded in Mumbai with a mission to make premium digital growth accessible.' },
  { year: '2021', title: 'Scaling Up', desc: 'Crossed 25 clients and expanded into full-funnel digital marketing and ecommerce.' },
  { year: '2023', title: 'Enterprise Trust', desc: 'Became the growth partner of choice for funded startups and established enterprises.' },
  { year: '2026', title: 'Category Leader', desc: '100+ projects delivered with a 98% satisfaction rate and a team of specialists.' },
];

export interface TeamMember { name: string; role: string; initials: string; hue: string; }
export const team: TeamMember[] = [
  { name: 'Saqib Shaikh', role: 'Co-Founder', initials: 'SS', hue: '#97C73D' },
  { name: 'Hanzala Momin', role: 'Senior Video Editor', initials: 'HM', hue: '#0582D5' },
  { name: 'Affan Khan', role: 'Camera Man', initials: 'AK', hue: '#97C73D' },
];
