export type Lang = "fr" | "en";
type Localized = Record<Lang, string>;
export type CaseStudy = {
  slug: "echo-travel" | "paykit" | "blueowl" | "twenty-crm";
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
      fr: "CTO jusqu’en août 2026 : réservations et paiements pour un opérateur maritime en Thaïlande, avec intégration 12Go.",
      en: "CTO until August 2026: booking and payments for a Thai boat-transfer operator, including 12Go integration.",
    },
    role: {
      fr: "CTO : réservations et paiements (jusqu’en août 2026)",
      en: "CTO: bookings and payments (until August 2026)",
    },
    context: {
      fr: "Une activité de transferts maritimes en Thaïlande avait besoin d’un parcours de réservation, de paiements et d’un suivi opérationnel utilisables au quotidien.",
      en: "A Thai boat-transfer operator needed a daily-use booking, payment and operations workflow.",
    },
    ownership: {
      fr: "CTO : passage du prototype au code de production, interface React, back-end Laravel, paiements Omise et intégration avec la marketplace 12Go.",
      en: "CTO: moving a prototype into production code, React frontend, Laravel backend, Omise payments and 12Go marketplace integration.",
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
      fr: "CTO de juin à août 2026 sur un produit éducatif IA : interface Next.js, streaming et service API TypeScript.",
      en: "CTO from June to August 2026 on an AI education product: Next.js interface, streamed results and TypeScript API service.",
    },
    role: {
      fr: "CTO : produit éducatif IA (juin à août 2026)",
      en: "CTO: AI education product (June to August 2026)",
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
  {
    slug: "twenty-crm",
    preview: {
      fr: "Implémentation interne de Twenty : CRM auto-hébergé, modèle de données commercial et accès par MCP.",
      en: "Internal Twenty implementation: self-hosted CRM, sales data model and MCP access.",
    },
    role: {
      fr: "Intégrateur : hébergement, configuration et données (projet interne, novembre 2026)",
      en: "Implementer: hosting, configuration and data (internal project, November 2026)",
    },
    context: {
      fr: "Mon suivi commercial était éparpillé dans des notes : 22 agences contactées, leurs démos, leurs relances et aucune vue d’ensemble. Il fallait un vrai CRM, hébergé chez moi, que mes outils d’IA puissent aussi lire.",
      en: "My sales follow-up lived in scattered notes: 22 agencies contacted, their demos, their follow-ups and no overview. I needed a real CRM, hosted on my own server, that my AI tools could also read.",
    },
    ownership: {
      fr: "Tout, en solo : déploiement de Twenty v2.55 (serveur, worker, PostgreSQL 16, Redis), modèle de données, import des données, sauvegardes et accès des agents par MCP et par la CLI officielle.",
      en: "Everything, solo: deploying Twenty v2.55 (server, worker, PostgreSQL 16, Redis), the data model, the data import, backups, and agent access through MCP and the official CLI.",
    },
    constraint: {
      fr: "Un serveur partagé par une centaine de conteneurs, des données commerciales privées, et une fenêtre d’installation où le premier visiteur peut créer l’espace de travail.",
      en: "A server shared by about a hundred containers, private sales data, and an install window where the first visitor can create the workspace.",
    },
    decision: {
      fr: "Compose officiel adapté : aucun port publié, images épinglées par digest, plafonds mémoire, télémétrie coupée, Redis protégé par mot de passe. Route fermée jusqu’à la création du compte, puis inscription sur invitation seulement. Étapes du pipeline renommées selon mon cycle, champs Démo et Canal ajoutés pour mesurer quel canal amène des clients. Accès agents en OAuth, sans clé API stockée.",
      en: "Adapted the official compose: no published port, images pinned by digest, memory caps, telemetry off, password-protected Redis. The route stayed closed until the owner account existed, then sign-up became invitation-only. Pipeline stages renamed to match my sales cycle, plus Demo and Channel fields to measure which channel brings clients. Agent access over OAuth, with no stored API key.",
    },
    result: {
      fr: "Le CRM tourne sur crm.memolabs.dev avec 22 entreprises, 18 contacts et 22 opportunités reliés entre eux, un tableau de bord du pipeline et une sauvegarde nocturne de la base et des fichiers. Claude Code lit et écrit dans le CRM par le serveur MCP de Twenty.",
      en: "The CRM runs at crm.memolabs.dev with 22 companies, 18 contacts and 22 linked opportunities, a pipeline dashboard and a nightly backup of the database and files. Claude Code reads and writes in the CRM through Twenty’s MCP server.",
    },
    caveat: {
      fr: "Projet interne, sans client. L’instance demande un compte et les données commerciales restent privées : les captures montrent la configuration, pas les prospects.",
      en: "Internal project, no client. The instance requires an account and the sales data stays private: the screenshots show the configuration, not the prospects.",
    },
  },
];
export const CASE_BY_SLUG: Record<string, CaseStudy> = Object.fromEntries(
  CASE_STUDIES.map((study) => [study.slug, study])
);
