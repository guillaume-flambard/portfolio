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
      fr: "Missions et produits : applications Next.js, intégrations d’API et flux n8n, fonctionnalités IA. J’opère mon propre serveur de production (Docker, supervision, sauvegardes) et j’ai publié le nœud n8n-nodes-opn sur npm.",
      en: "Client work and products: Next.js apps, API integrations and n8n flows, AI features. I run my own production server (Docker, monitoring, backups) and published the n8n-nodes-opn node on npm.",
    },
    technologies: ["TypeScript", "Next.js", "n8n", "Docker"],
  },
  {
    organization: "Blue Owl",
    dates: { fr: "Juin à août 2026", en: "Jun to Aug 2026" },
    role: { fr: "CTO", en: "CTO" },
    description: {
      fr: "Version web d’un produit éducatif IA, à partir d’un moteur Electron de 2 600 fichiers : passerelle NestJS et Fastify, interface Next.js en streaming, exports de documents. Les contrôles obligatoires du modèle sont passés des prompts au code.",
      en: "Web version of an AI education product, built from a 2,600-file Electron engine: NestJS and Fastify gateway, streaming Next.js interface, document exports. The model’s mandatory checks moved from prompts into code.",
    },
    technologies: ["Next.js", "NestJS", "Fastify"],
  },
  {
    organization: "Echo Travel",
    dates: { fr: "2025 à août 2026", en: "2025 to Aug 2026" },
    role: { fr: "CTO", en: "CTO" },
    description: {
      fr: "Plateforme de réservation et d’exploitation d’un transporteur insulaire, environ 150 passagers par jour : 12Go, cartes, dispatch, billetterie et paiements.",
      en: "Booking and operations platform for an island transport business, about 150 passengers a day: 12Go, maps, dispatch, ticketing and payments.",
    },
    technologies: ["React", "Laravel", "Inertia", "Omise"],
  },
  {
    organization: "Symbyoz",
    dates: { fr: "Avril 2024 à janvier 2025", en: "Apr 2024 to Jan 2025" },
    role: { fr: "Développeur full-stack · remote", en: "Full-stack developer · remote" },
    description: {
      fr: "Création de BananAI en Next.js : routage multilingue, authentification, tableau de bord d’exploitation et éditeur de jeux sans code. API sécurisées pour Flylooping, plateforme Symfony de réservation de vols.",
      en: "Built BananAI on Next.js: internationalised routing, authentication, an operations dashboard and a no-code game builder. Shipped secure APIs for Flylooping, a Symfony flight-booking platform.",
    },
    technologies: ["Next.js", "Symfony"],
  },
  {
    organization: "Medsharing",
    dates: { fr: "Septembre 2021 à septembre 2023", en: "Sep 2021 to Sep 2023" },
    role: { fr: "Développeur front-end · remote", en: "Frontend developer · remote" },
    description: {
      fr: "Migration de plus de 100 écrans d’un SaaS clinique réglementé, d’ASP Classic et jQuery vers HTML5, Bootstrap et JavaScript. Tableaux de bord de suivi d’essais cliniques avec D3 et amCharts.",
      en: "Migrated 100+ screens of a regulated clinical SaaS from ASP Classic and jQuery to HTML5, Bootstrap and JavaScript. Built clinical-trial monitoring dashboards with D3 and amCharts.",
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
