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
    organization: "Memo Labs",
    dates: { fr: "2025 – aujourd’hui", en: "2025 – present" },
    role: { fr: "Ingénieur logiciel indépendant", en: "Independent software engineer" },
    description: {
      fr: "Produits web, intégrations d’API et automatisations ; interfaces, services, déploiement et résolution d’incidents.",
      en: "Web products, API integrations and automation; frontend, services, deployments and production incident investigation.",
    },
    technologies: ["TypeScript", "React", "Node.js"],
  },
  {
    organization: "Blue Owl",
    dates: { fr: "Juin – août 2026", en: "Jun – Aug 2026" },
    role: { fr: "Ingénieur full-stack / CTO", en: "Full-stack engineer / CTO" },
    description: {
      fr: "Service éducatif intégrant l’IA : passerelle NestJS/Fastify, interface Next.js avec streaming et exports documentaires, au sein d’une petite équipe.",
      en: "AI education product: NestJS/Fastify gateway, streaming Next.js interface and document exports, within a small team.",
    },
    technologies: ["Next.js", "NestJS", "Fastify"],
  },
  {
    organization: "Echo Travel",
    dates: { fr: "2025 – août 2026", en: "2025 – Aug 2026" },
    role: { fr: "Développeur full-stack · prestataire technique", en: "Full-stack developer · technical contractor" },
    description: {
      fr: "Plateforme opérationnelle de réservation et paiements pour un transporteur maritime thaïlandais, avec intégration 12Go.",
      en: "Operational booking and payment platform for a Thai boat-transfer operator, including a 12Go integration.",
    },
    technologies: ["React", "Laravel", "Omise"],
  },
  {
    organization: "Symbyoz",
    dates: { fr: "Avril 2024 – janvier 2025", en: "Apr 2024 – Jan 2025" },
    role: { fr: "Développeur full-stack · remote", en: "Full-stack developer · remote" },
    description: {
      fr: "Création d’un éditeur de jeu et d’un back-office Next.js ; contribution à des API Symfony pour une plateforme de voyage.",
      en: "Built a Next.js interactive game editor and back-office; contributed Symfony API features for a travel product.",
    },
    technologies: ["Next.js", "Symfony"],
  },
  {
    organization: "Medsharing",
    dates: { fr: "Septembre 2021 – septembre 2023", en: "Sep 2021 – Sep 2023" },
    role: { fr: "Développeur front-end · remote", en: "Frontend developer · remote" },
    description: {
      fr: "Modernisation de plus de 100 écrans d’un SaaS clinique historique et création de tableaux de bord en environnement réglementé.",
      en: "Modernized 100+ screens of a legacy clinical SaaS and built dashboards in a regulated environment.",
    },
    technologies: ["JavaScript", "jQuery", "Chart.js"],
  },
  {
    organization: "Adriver Group",
    dates: { fr: "Février – juin 2020", en: "Feb – Jun 2020" },
    role: { fr: "Stagiaire développement web", en: "Web development intern" },
    description: {
      fr: "Contribution à des interfaces responsives et au suivi de campagnes dans un tableau de bord.",
      en: "Contributed to responsive interfaces and a campaign-reporting dashboard.",
    },
    technologies: ["Symfony", "Bootstrap"],
  },
];
