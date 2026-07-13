export type Locale = 'fr' | 'en'

export type Project = {
  name: string
  url?: string
  repo?: string
  stack: string[]
  live: boolean
}

export type Island = {
  slug: string
  kind: 'port' | 'craft' | 'ventures' | 'ai' | 'contact'
  pos: [number, number]
  titles: Record<Locale, string>
  blurb: Record<Locale, string>
  projects?: Project[]
}

export const ISLANDS: Island[] = [
  {
    slug: 'home',
    kind: 'port',
    pos: [-6, 0],
    titles: {
      fr: 'Port d’Attache',
      en: 'Home Port',
    },
    blurb: {
      fr: 'Guillaume Flambard, ingénieur design — fullstack et IA, naviguant depuis Koh Phangan, Thaïlande. Ce port est le point de départ de l’archipel : qui je suis, comment je travaille, où aller ensuite.',
      en: 'Guillaume Flambard, design engineer — fullstack and AI, sailing out of Koh Phangan, Thailand. This port is the archipelago’s starting point: who I am, how I work, where to head next.',
    },
  },
  {
    slug: 'craft',
    kind: 'craft',
    pos: [2, 5],
    titles: {
      fr: 'Île de l’Artisanat',
      en: 'Craft Isle',
    },
    blurb: {
      fr: 'Des interfaces soignées, construites avec rigueur : sites d’agence, design systems, SaaS. Chaque projet est un démonstrateur de mon approche d’ingénieur design.',
      en: 'Carefully built interfaces: agency sites, design systems, SaaS products. Each project is a live demo of my design-engineering craft.',
    },
    projects: [
      {
        name: 'largo-ai',
        url: 'https://largo-ai.vercel.app',
        stack: ['Next.js', 'React', 'Tailwind', 'GSAP'],
        live: true,
      },
      {
        name: 'blueowl',
        url: 'https://blueowl.org',
        stack: ['Turborepo', 'Next.js', 'AI'],
        live: true,
      },
      {
        name: 'portsense',
        stack: ['Next.js', 'shadcn/ui', 'Mapbox', 'Anthropic SDK'],
        live: false,
      },
      {
        name: 'zentegra',
        stack: ['Next.js', 'Tailwind', 'D3', 'Chart.js'],
        live: false,
      },
    ],
  },
  {
    slug: 'echo',
    kind: 'ventures',
    pos: [6, 2],
    titles: {
      fr: 'Atoll Echo',
      en: 'Echo Atoll',
    },
    blurb: {
      fr: 'Echo Travel : transport et réservation inter-îles pour Koh Phangan et le golfe de Thaïlande. Une aventure entrepreneuriale née sur le terrain, pensée pour durer.',
      en: 'Echo Travel: island transport and booking for Koh Phangan and the Gulf of Thailand. A venture born on the ground, built to last.',
    },
  },
  {
    slug: 'ai',
    kind: 'ai',
    pos: [4, -5],
    titles: {
      fr: 'Labo IA',
      en: 'AI Lab',
    },
    blurb: {
      fr: 'Agents, RAG, LLM en production. Minerva, mon plus grand chantier, explore une « conscience augmentée par la recherche » pour transformer la connaissance en action.',
      en: 'Agents, RAG, LLMs in production. Minerva, my flagship build, explores a "retrieval augmented consciousness" turning knowledge into action.',
    },
    projects: [
      {
        name: 'minerva',
        url: 'https://minerva-web.vercel.app',
        stack: ['React', 'Vite', 'Tailwind', 'RAG'],
        live: true,
      },
      {
        name: 'talktwin',
        stack: ['Next.js', 'Vercel AI SDK', 'OpenAI'],
        live: false,
      },
      {
        name: 'wikipedia-semantic-search',
        stack: ['Next.js', 'Upstash Vector', 'RAG'],
        live: false,
      },
    ],
  },
  {
    slug: 'lighthouse',
    kind: 'contact',
    pos: [-3, -6],
    titles: {
      fr: 'Le Phare',
      en: 'Lighthouse',
    },
    blurb: {
      fr: 'Un signal pour me contacter : ouvert à un CDI comme à des missions freelance. Si votre projet a besoin d’un cap clair, ce phare vous guide jusqu’à moi.',
      en: 'A signal to reach me: open to full-time roles and freelance missions alike. If your project needs a clear heading, this lighthouse guides you in.',
    },
  },
]

export function getIsland(slug: string): Island | undefined {
  return ISLANDS.find(i => i.slug === slug)
}
