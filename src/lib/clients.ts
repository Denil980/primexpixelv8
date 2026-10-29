// Real client logos. Files live in `public/brand/clients/`.
// Rendered on clean tiles so each brand's original colours read well
// in both light and dark themes.
export interface Client {
  name: string;
  logo: string;
  hue: string; // brand tone for hover glow
}

export const clients: Client[] = [
  { name: 'Prime Heat', logo: '/brand/clients/prime-heat.png', hue: '#e23744' },
  { name: 'Glazemaster Solutions', logo: '/brand/clients/glazemaster.png', hue: '#9b1b3a' },
  { name: 'Al-Misbah Tours & Travels', logo: '/brand/clients/al-misbah.png', hue: '#0e5a73' },
  { name: 'GMadamG Foundation', logo: '/brand/clients/gmadamg.png', hue: '#f6a93d' },
  { name: 'Freshy Fruits', logo: '/brand/clients/freshy-fruits.png', hue: '#2fa84f' },
  { name: 'MEFCO', logo: '/brand/clients/mefco-dark.png', hue: '#0582D5' },
  { name: 'Azhari Tours & Travels', logo: '/brand/clients/azhari.png', hue: '#1f2d6b' },
  { name: 'Spellbound Home Decor', logo: '/brand/clients/spellbound.png', hue: '#111111' },
  { name: 'Smart Fleet Tours & Travels', logo: '/brand/clients/smart-fleet.png', hue: '#1c6bab' },
  { name: 'Mumtaz Tours & Travels', logo: '/brand/clients/mumtaz.png', hue: '#0d5aa7' },
];
