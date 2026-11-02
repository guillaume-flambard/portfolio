export type Locale = "fr" | "en";
export type LocalizedText = Record<Locale, string>;

export type Experience = {
  organization: string;
  dates: LocalizedText;
  role: LocalizedText;
  description: LocalizedText;
  technologies: string[];
};

export const EXPERIENCES: Experience[] = [
  {
    organization: "Data for Good · Rescue Atlas",
    dates: { fr: "Depuis octobre 2026", en: "Oct 2026 to present" },
    role: { fr: "Tech Lead bénévole · projet SOS Méditerranée", en: "Volunteer Tech Lead · SOS Méditerranée project" },
    description: {
      fr: "Co-cadrage technique de la refonte de la carte des sauvetages : architecture, sources et flux de données, découpage des travaux en backlog et préparation de l’accueil des bénévoles. Projet associatif en cours ; aucune livraison officielle revendiquée.",
      en: "Co-leading technical planning for the rescue map redesign: architecture, data sources and flows, backlog scoping and volunteer onboarding. Ongoing nonprofit project; no official product launch claimed.",
    },
    technologies: ["Architecture", "Data", "Open source"],
  },
  {
    organization: "Memo Labs",
    dates: { fr: "2025 à aujourd’hui", en: "2025 to present" },
    role: { fr: "Développeur indépendant · freelance", en: "Independent developer · freelance" },
    description: {
      fr: "Applications Next.js, intégrations d’API, flux n8n et fonctionnalités IA ; serveur de production opéré en propre et nœud n8n-nodes-opn publié sur npm.",
      en: "Next.js apps, API integrations, n8n flows and AI features; I run my own production server and published the n8n-nodes-opn node on npm.",
    },
    technologies: ["TypeScript", "Next.js", "n8n", "Docker"],
  },
  {
    organization: "Blue Owl",
    dates: { fr: "Juin à août 2026", en: "Jun to Aug 2026" },
    role: { fr: "CTO", en: "CTO" },
    description: {
      fr: "Version web d’un produit éducatif IA, depuis un moteur Electron de 2 600 fichiers : passerelle NestJS/Fastify, interface Next.js en streaming, exports.",
      en: "Web version of an AI education product, from a 2,600-file Electron engine: NestJS/Fastify gateway, streaming Next.js interface, exports.",
    },
    technologies: ["Next.js", "NestJS", "Fastify"],
  },
  {
    organization: "Echo Travel",
    dates: { fr: "2025 à août 2026", en: "2025 to Aug 2026" },
    role: { fr: "CTO", en: "CTO" },
    description: {
      fr: "Réservation et exploitation d’un transporteur insulaire (environ 150 passagers par jour) : 12Go, dispatch, billetterie, paiements.",
      en: "Booking and operations for an island transport business (about 150 passengers a day): 12Go, dispatch, ticketing, payments.",
    },
    technologies: ["React", "Laravel", "Inertia", "Omise"],
  },
  {
    organization: "Symbyoz",
    dates: { fr: "Avril 2024 à janvier 2025", en: "Apr 2024 to Jan 2025" },
    role: { fr: "Développeur full-stack · remote", en: "Full-stack developer · remote" },
    description: {
      fr: "BananAI en Next.js (authentification, back-office, éditeur de jeux sans code) ; API sécurisées pour Flylooping, réservation de vols sous Symfony.",
      en: "Built BananAI on Next.js (auth, back-office, no-code game builder); secure APIs for Flylooping, a Symfony flight-booking platform.",
    },
    technologies: ["Next.js", "Symfony"],
  },
  {
    organization: "Medsharing",
    dates: { fr: "Septembre 2021 à septembre 2023", en: "Sep 2021 to Sep 2023" },
    role: { fr: "Développeur front-end · remote", en: "Frontend developer · remote" },
    description: {
      fr: "Migration de plus de 100 écrans d’un SaaS clinique réglementé (ASP Classic et jQuery vers Bootstrap) ; tableaux de bord d’essais cliniques en D3 et amCharts.",
      en: "Migrated 100+ screens of a regulated clinical SaaS (ASP Classic and jQuery to Bootstrap); clinical-trial dashboards in D3 and amCharts.",
    },
    technologies: ["JavaScript", "Bootstrap", "D3", "amCharts"],
  },
  {
    organization: "Adriver Group",
    dates: { fr: "Février à juin 2020", en: "Feb to Jun 2020" },
    role: { fr: "Stagiaire développement web", en: "Web development intern" },
    description: {
      fr: "Contribution à des interfaces responsives et au suivi de campagnes dans un tableau de bord.",
      en: "Contributed to responsive interfaces and a campaign-reporting dashboard.",
    },
    technologies: ["Symfony", "Bootstrap"],
  },
];
