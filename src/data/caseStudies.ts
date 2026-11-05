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
