export type Lang = "fr" | "en";
type Localized = Record<Lang, string>;
export type CaseStudy = {
  slug: "medsharing" | "flylooping" | "echo-travel" | "paykit" | "blueowl" | "twenty-crm";
  need?: Localized;
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
  "slug": "medsharing",
  need: {"fr": "Moderniser une interface métier", "en": "Modernise a business interface"},
  "preview": {
    "fr": "Reprise d’un logiciel métier existant : migration de plus de 100 écrans et développement de tableaux de bord.",
    "en": "Improving existing business software: migration of 100+ screens and dashboard development."
  },
  "role": {
    "fr": "Développeur frontend salarié, 2021 à 2023",
    "en": "Employed frontend developer, 2021 to 2023"
  },
  "context": {
    "fr": "Moderniser les écrans d’un logiciel de suivi d’essais cliniques construit avec ASP Classic et jQuery, tout en conservant les parcours métier.",
    "en": "Modernise the screens of clinical-trial software built with ASP Classic and jQuery while retaining its business workflows."
  },
  "ownership": {
    "fr": "Migration d’écrans vers HTML5, JavaScript et Bootstrap ; développement de tableaux de bord et travail avec l’équipe sur la séparation frontend/backend.",
    "en": "Migrating screens to HTML5, JavaScript and Bootstrap; developing dashboards and working with the team on frontend/backend separation."
  },
  "constraint": {
    "fr": "Faire évoluer une application existante avec ses règles métier, ses données et ses habitudes d’utilisation, sans repartir de zéro.",
    "en": "Improve an existing application with its business rules, data and established workflows, without starting over."
  },
  "decision": {
    "fr": "Migration des interfaces en HTML5, Bootstrap et JavaScript, et séparation frontend/backend avec des échanges XML.",
    "en": "Interface migration with HTML5, Bootstrap and JavaScript, and frontend/backend separation using XML exchanges."
  },
  "result": {
    "fr": "Plus de 100 écrans migrés et des tableaux de bord développés pendant cette expérience salariée. Une référence de travail sur un logiciel métier existant.",
    "en": "100+ screens migrated and dashboards developed during this employment. An example of work on an existing business application."
  },
  "caveat": {
    "fr": "Rôle frontend de septembre 2021 à septembre 2023. Les écrans privés et le code de l’employeur ne sont pas publiés ici.",
    "en": "Frontend role from September 2021 to September 2023. Private screens and employer source code are not published here."
  }
},
{
  "slug": "flylooping",
  need: {"fr": "Développer les interfaces d’un produit existant", "en": "Build interfaces within an existing product"},
  "preview": {
    "fr": "Chez Symbyoz : intervention sur l’essentiel du frontend de Flylooping, en HTML, CSS et JavaScript.",
    "en": "At Symbyoz: work across most of Flylooping’s frontend, using HTML, CSS and JavaScript."
  },
  "role": {
    "fr": "Contribution principalement frontend chez Symbyoz, 2024 à 2025",
    "en": "Primarily frontend work at Symbyoz, 2024 to 2025"
  },
  "context": {
    "fr": "Développer les interfaces web d’une plateforme de recherche et de réservation de voyages, au sein d’une équipe d’agence.",
    "en": "Develop the web interfaces of a travel search and booking platform as part of an agency team."
  },
  "ownership": {
    "fr": "Chez Symbyoz, j’ai travaillé sur l’essentiel du frontend de Flylooping en HTML, CSS et JavaScript.",
    "en": "At Symbyoz, I worked across most of Flylooping’s frontend in HTML, CSS and JavaScript."
  },
  "constraint": {
    "fr": "Intervenir dans un produit existant au sein de l’équipe Symbyoz, avec une contribution principalement frontend.",
    "en": "Work within an existing product as part of the Symbyoz team, with a primarily frontend contribution."
  },
  "decision": {
    "fr": "Développer les interfaces en HTML et CSS, et leurs interactions en JavaScript, dans le produit en place.",
    "en": "Develop interfaces in HTML and CSS, with JavaScript interactions, within the existing product."
  },
  "result": {
    "fr": "Une intervention couvrant la quasi-totalité du frontend, dans l’équipe Symbyoz. Une expérience de développement d’interfaces sur un produit de réservation.",
    "en": "Work spanning almost the entire frontend within the Symbyoz team. An example of interface development for a booking product."
  },
  "caveat": {
    "fr": "Contribution chez Symbyoz, dans la période d’avril 2024 à janvier 2025. Le lien public présente le produit actuel.",
    "en": "Contribution at Symbyoz within the April 2024 to January 2025 employment period. The public link presents the current product."
  }
},
  {
    slug: "echo-travel",
  need: {"fr": "Relier réservation, paiement et opérations", "en": "Connect booking, payments and operations"},
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
  need: {"fr": "Faire passer un moteur IA au web", "en": "Bring an AI engine to the web"},
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
      fr: "Twenty auto-hébergé et un flux n8n : chaque demande entrante devient une fiche complète dans le CRM, sans saisie.",
      en: "Self-hosted Twenty and an n8n flow: every incoming request becomes a complete CRM record, with no typing.",
    },
    role: {
      fr: "Intégrateur, en solo : hébergement, modèle de données et automatisation (projet interne, novembre 2026)",
      en: "Implementer, solo: hosting, data model and automation (internal project, November 2026)",
    },
    context: {
      fr: "Une demande arrive par le site, une autre par email, une troisième par un formulaire. Si rien ne relie ces canaux au CRM, quelqu’un recopie à la main, ou la demande se perd. Je voulais pour Memo Labs ce que je propose à mes clients : un CRM où chaque demande arrive seule, rattachée à la bonne entreprise, avec la relance déjà planifiée.",
      en: "One request comes in through the website, another by email, a third through a form. When nothing links those channels to the CRM, someone copies them by hand, or the request gets lost. I wanted for Memo Labs what I offer my clients: a CRM where every request lands on its own, attached to the right company, with the follow-up already scheduled.",
    },
    ownership: {
      fr: "Tout : déploiement de Twenty v2.55 (serveur, worker, PostgreSQL 16, Redis) derrière Traefik, modèle de données (étapes du pipeline, champs Canal et Démo), flux n8n en six étapes sur l’API GraphQL de Twenty, et accès de Claude Code au CRM par le serveur MCP de Twenty et sa CLI officielle.",
      en: "Everything: deploying Twenty v2.55 (server, worker, PostgreSQL 16, Redis) behind Traefik, the data model (pipeline stages, Channel and Demo fields), a six-step n8n flow on Twenty’s GraphQL API, and Claude Code access to the CRM through Twenty’s MCP server and its official CLI.",
    },
    constraint: {
      fr: "Aucun doublon quand la même personne écrit deux fois, une clé d’API qui ne doit jamais apparaître en clair, et un serveur partagé par 90 conteneurs.",
      en: "No duplicates when the same person writes twice, an API key that must never appear in clear, and a server shared by 90 containers.",
    },
    decision: {
      fr: "Créations en mode upsert : l’entreprise est retrouvée par son domaine, le contact par son email. La clé d’API vit dans un identifiant chiffré de n8n, posé côté serveur sans jamais être affichée. L’opportunité s’ouvre à l’étape Contacté avec le canal Demande entrante, le message devient une note et la tâche « Répondre à… » tombe le lendemain matin, toutes deux rattachées à l’opportunité. Côté hébergement : compose officiel adapté, images épinglées, plafonds mémoire, inscription sur invitation seulement.",
      en: "Records are created as upserts: the company is matched by its domain, the contact by their email. The API key lives in an encrypted n8n credential, set on the server without ever being displayed. The opportunity opens at the Contacted stage with the Inbound request channel, the message becomes a note, and a Reply to… task is due the next morning, both linked to the opportunity. On the hosting side: the official compose adapted, pinned images, memory caps, invitation-only sign-up.",
    },
    result: {
      fr: "Sur mes essais, un message envoyé devient en moins d’une demi-seconde une opportunité complète : entreprise, contact, note du message et tâche de réponse datée. Un second envoi de la même personne ne crée ni entreprise ni contact en double. Je contribue aussi au code de Twenty : trois PR fusionnées dans le dépôt principal (#23323, #23325, #24919).",
      en: "In my tests, a sent message becomes a complete opportunity in under half a second: company, contact, a note with the message and a dated reply task. A second message from the same person creates no duplicate company or contact. I also contribute to Twenty’s code: three PRs merged into the main repository (#23323, #23325, #24919).",
    },
    caveat: {
      fr: "Projet interne, sans client. Les captures montrent une demande de démonstration (Cabinet Lambert), pas de vrais prospects ; le CRM et le formulaire demandent un compte.",
      en: "Internal project, no client. The screenshots show a demo request (Cabinet Lambert), not real prospects; the CRM and the form require an account.",
    },
  },
];
export const CASE_BY_SLUG: Record<string, CaseStudy> = Object.fromEntries(
  CASE_STUDIES.map((study) => [study.slug, study])
);
