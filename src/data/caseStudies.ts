export type Lang = "fr" | "en";
type Localized = Record<Lang, string>;
export type CaseStudy = {
  slug: "echo-travel" | "paykit" | "blueowl";
  preview: Localized;
  role: Localized;
  context: Localized;
  ownership: Localized;
  constraint: Localized;
  decision: Localized;
  result: Localized;
  caveat: Localized;
};
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "echo-travel",
    preview: {
      fr: "Mission client terminée en août 2026 : réservations et paiements pour un opérateur maritime en Thaïlande, avec intégration 12Go.",
      en: "Past client engagement (ended August 2026): booking and payments for a Thai boat-transfer operator, including 12Go integration.",
    },
    role: {
      fr: "Ancien prestataire technique full-stack (jusqu’en août 2026)",
      en: "Former full-stack technical contractor (until August 2026)",
    },
    context: {
      fr: "Une activité de transferts maritimes en Thaïlande avait besoin d’un parcours de réservation, de paiements et d’un suivi opérationnel utilisables au quotidien.",
      en: "A Thai boat-transfer operator needed a daily-use booking, payment and operations workflow.",
    },
    ownership: {
      fr: "Prestataire technique full-stack : passage du prototype au code de production, interface React, back-end Laravel, paiements Omise et intégration avec la marketplace 12Go.",
      en: "Full-stack technical contractor: moving a prototype into production code, React frontend, Laravel backend, Omise payments and 12Go marketplace integration.",
    },
    constraint: {
      fr: "Des réservations et paiements réels, des opérations saisonnières et des données issues de plusieurs canaux.",
      en: "Real bookings and money, seasonal operations and data arriving through multiple booking channels.",
    },
    decision: {
      fr: "Conserver un parcours cohérent avec React/Inertia et Laravel ; intégrer 12Go dans une synchronisation à sens unique afin de limiter les conflits de modification entre systèmes.",
      en: "Keep the workflow cohesive with React/Inertia and Laravel; use one-way 12Go synchronisation to reduce conflicting updates between systems.",
    },
    result: {
      fr: "Une plateforme de réservation et de suivi opérationnel a été développée au cours de la mission, aujourd’hui terminée. Le site reste accessible ; son exploitation actuelle ne relève plus de ma responsabilité.",
      en: "A booking and operations platform was developed during this now-completed engagement. The site remains accessible, but I am no longer responsible for its operation.",
    },
    caveat: {
      fr: "Mission terminée en août 2026. Les écrans internes, le trafic et l’activité actuelle du produit ne sont pas vérifiables publiquement.",
      en: "Engagement ended in August 2026. Internal screens, traffic and the product’s current business operations are not publicly verifiable.",
    },
  },
  {
    slug: "paykit",
    preview: {
      fr: "Kit de facturation pour développeurs : Stripe Checkout, webhooks et crédits PostgreSQL. Accès anticipé.",
      en: "Developer billing toolkit: Stripe Checkout, webhooks and PostgreSQL credits. In early access.",
    },
    role: {
      fr: "Conception et développement du produit",
      en: "Product design and development",
    },
    context: {
      fr: "Les applications avec consommation de crédits et facturation à l’usage doivent coordonner paiements Stripe, événements webhook et comptabilité des crédits.",
      en: "Apps with credits and usage billing need to coordinate Stripe payments, webhooks and credit accounting.",
    },
    ownership: {
      fr: "Produit développeur construit en solo : intégration Stripe Checkout, traitement des webhooks, suivi d’usage, crédits PostgreSQL et interface d’intégration React.",
      en: "Solo-built developer product: Stripe Checkout integration, webhook processing, usage metering, PostgreSQL credits and React integration surface.",
    },
    constraint: {
      fr: "Éviter qu’une déduction de crédits concurrente crée un solde incohérent ; proposer une intégration suffisamment simple pour d’autres développeurs.",
      en: "Avoid inconsistent balances when credits are deducted concurrently; keep integration accessible to other developers.",
    },
    decision: {
      fr: "Opérations de crédit atomiques dans PostgreSQL, séparation des webhooks et du code client, SDK React et variante intégrable par script.",
      en: "Atomic PostgreSQL credit operations, separation of webhooks from client code, a React SDK and script-based integration.",
    },
    result: {
      fr: "Code source consultable et interface de présentation publique. Ce projet démontre la conception d’une API de facturation et d’une intégration TypeScript.",
      en: "Public source code and project landing page. The project demonstrates billing API design and TypeScript integration.",
    },
    caveat: {
      fr: "La présence d’une landing page ne prouve pas une adoption en production ; aucun chiffre de clients ou de revenus n’est revendiqué.",
      en: "A landing page does not prove production adoption; no customer or revenue metrics are claimed.",
    },
  },
  {
    slug: "blueowl",
    preview: {
      fr: "Ancienne collaboration sur une application de leçons : interface Next.js, streaming et service API TypeScript.",
      en: "Past collaboration on lesson generation: Next.js interface, streamed results and TypeScript API service.",
    },
    role: {
      fr: "Ancienne collaboration · terminée en août 2026",
      en: "Past technical collaboration · ended August 2026",
    },
    context: {
      fr: "Transformer un moteur expérimental de génération de leçons par IA en service web accessible, avec restitution progressive des réponses.",
      en: "Turn an experimental AI lesson engine into an accessible web service with streamed output.",
    },
    ownership: {
      fr: "Développement du service web et de l’interface Next.js. Le moteur d’agents sous-jacent a été développé en collaboration.",
      en: "Built the web service and Next.js frontend. The underlying agent engine was developed collaboratively.",
    },
    constraint: {
      fr: "Intégrer un moteur existant sans ajouter de file de messages ni d’infrastructure disproportionnée pour un premier déploiement.",
      en: "Integrate an existing engine without adding a queue or infrastructure disproportionate to an initial deployment.",
    },
    decision: {
      fr: "Passerelle NestJS/Fastify en TypeScript, moteur conservé en sous-module, streaming vers Next.js, exports MD/HTML/PDF et déploiement Docker Compose.",
      en: "TypeScript NestJS/Fastify gateway, engine retained as a submodule, streaming to Next.js, MD/HTML/PDF exports and Docker Compose deployment.",
    },
    result: {
      fr: "Une interface et un service de génération de leçons ont été développés pendant la collaboration, désormais terminée.",
      en: "A lesson-generation interface and service were developed during the collaboration, which has since ended.",
    },
    caveat: {
      fr: "Collaboration terminée en août 2026. Ni l’usage actuel, ni la qualité pédagogique ou factuelle des contenus générés n’ont été évalués indépendamment.",
      en: "Collaboration ended in August 2026. Neither current usage nor the educational or factual quality of generated lessons has been independently assessed.",
    },
  },
];
export const CASE_BY_SLUG: Record<string, CaseStudy> = Object.fromEntries(
  CASE_STUDIES.map((study) => [study.slug, study])
);
