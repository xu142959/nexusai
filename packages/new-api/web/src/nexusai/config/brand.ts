export const BRAND = {
  name: 'NexusAI',
  shortName: 'NexusAI',
  company: 'NexusAI Inc.',
  tagline: 'The Unified Interface For Every Model',
  description: 'Better prices, better uptime, no subscriptions. One API for 500+ models.',
  url: 'https://nexusai.example.com',
  supportEmail: 'support@nexusai.com',
  colors: {
    bg: '#03080a',
    primary: '#c8ff00',
    text: '#fcfcfe',
  },
  nav: [
    { label: 'Models', href: '/models' },
    { label: 'Chat', href: '/chat' },
    { label: 'Rankings', href: '/rankings' },
    { label: 'Pricing', href: '/plans' },
    { label: 'Docs', href: '/docs' },
  ],
  social: {
    discord: '#',
    twitter: '#',
    github: '#',
  },
} as const
