import type { Lang } from "./caseStudies";

type Localized = Record<Lang, string>;
type Proof = { label: Localized; href: string };
type Faq = { q: Localized; a: Localized };
type Step = { title: Localized; body: Localized };
type Fact = { label: Localized; value: Localized };

export type Service = {
  slug: "ai-integration" | "automation-n8n" | "web-development" | "erp-cutover-proof";
  /** Search phrase this page answers, used in the title and the first sentence. */
  title: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  h1: Localized;
  /** Answer-first paragraph: what, for whom, how, in two sentences. */
  answer: Localized;
  /** Optional: how the engagement runs, for fixed-scope offers. */
  steps?: Step[];
  /** Optional: short format facts (who, when, duration, price). Keep each value short. */
  facts?: Fact[];
  deliverables: Localized[];
  stack: string[];
  proofs: Proof[];
  faq: Faq[];
};

export const SERVICES: Service[] = [
  {
    slug: "ai-integration",
    title: { fr: "Intégration IA", en: "AI integration" },
    metaTitle: { fr: "Développeur freelance IA : intégration d’IA et agents IA", en: "Freelance AI developer: AI features and agents" },
    metaDescription: {
      fr: "Développeur freelance en intégration d’IA : assistants, extraction de documents et agents IA branchés sur vos données. À distance, toute stack.",
      en: "Freelance developer for AI integration: assistants, document extraction and AI agents wired to your data. Fully remote, any stack.",
    },
    h1: { fr: "Développeur freelance IA, pour votre produit existant.", en: "Freelance AI developer, for the product you already have." },
    answer: {
      fr: "J’ajoute des fonctionnalités d’IA à des applications web en production : assistants, extraction de documents, génération de contenu et agents qui enchaînent des tâches. Le modèle propose, le code vérifie : les règles métier critiques restent dans des contrôles écrits, pas dans le prompt.",
      en: "I add AI features to web applications in production: assistants, document extraction, content generation and agents that chain tasks. The model proposes and the code checks: critical business rules live in written checks, not in the prompt.",
    },
    deliverables: [
      { fr: "Assistant ou copilote dans votre interface, branché sur vos données", en: "An assistant or copilot inside your interface, wired to your data" },
      { fr: "Extraction de documents (PDF, photos, e-mails) vers des données structurées", en: "Document extraction (PDF, photos, e-mails) into structured data" },
      { fr: "Agents IA qui enchaînent des étapes, avec validation humaine là où elle compte", en: "AI agents that chain steps, with human review where it matters" },
      { fr: "Réponses en streaming, exports et suivi des coûts par appel", en: "Streamed answers, exports and per-call cost tracking" },
    ],
    stack: ["TypeScript", "Next.js", "NestJS", "Python", "API OpenAI / Anthropic / modèles ouverts", "Docker"],
    proofs: [
      { label: { fr: "CTO de Blue Owl : produit éducatif IA porté d’un moteur Electron de 2 600 fichiers vers le web", en: "CTO at Blue Owl: an AI education product taken from a 2,600-file Electron engine to the web" }, href: "/work/blueowl" },
      { label: { fr: "BananAI chez Symbyoz : application Next.js avec éditeur de jeux sans code", en: "BananAI at Symbyoz: a Next.js app with a no-code game builder" }, href: "/about#experience-symbyoz" },
      { label: { fr: "Mes propres agents tournent en continu sur mon serveur de production", en: "My own agents run around the clock on my production server" }, href: "https://lab.memolabs.dev/" },
    ],
    faq: [
      {
        q: { fr: "Faut-il refaire mon application pour y ajouter de l’IA ?", en: "Do I need to rebuild my application to add AI?" },
        a: { fr: "Non. L’IA s’ajoute comme une fonctionnalité de plus, derrière une API, dans votre code et votre hébergement actuels.", en: "No. AI is added as one more feature, behind an API, inside your current code and hosting." },
      },
      {
        q: { fr: "Quel modèle d’IA utilisez-vous ?", en: "Which AI model do you use?" },
        a: { fr: "Celui qui convient au besoin et au budget : modèles OpenAI, Anthropic ou modèles ouverts auto-hébergés. Le code reste indépendant du fournisseur pour pouvoir en changer.", en: "Whichever fits the need and the budget: OpenAI, Anthropic or self-hosted open models. The code stays provider-independent so you can switch." },
      },
      {
        q: { fr: "Comment éviter les erreurs de l’IA ?", en: "How do you keep AI mistakes in check?" },
        a: { fr: "Les règles obligatoires sont vérifiées par du code, les sorties sont contrôlées avant d’être enregistrées, et une personne valide ce qui a des conséquences.", en: "Mandatory rules are checked in code, outputs are validated before they are stored, and a person approves anything with consequences." },
      },
    ],
  },
  {
    slug: "automation-n8n",
    title: { fr: "Automatisation n8n", en: "n8n automation" },
    metaTitle: { fr: "Freelance n8n : automatisation, API et webhooks", en: "Freelance n8n developer: automation, APIs, webhooks" },
    metaDescription: {
      fr: "Développeur freelance n8n : automatisations, API, webhooks et paiements, avec reprise après erreur. Auteur du nœud n8n-nodes-opn sur npm.",
      en: "Freelance n8n developer: automations, APIs, webhooks and payments, with retries. Author of the n8n-nodes-opn node on npm.",
    },
    h1: { fr: "Freelance n8n : vos tâches répétitives deviennent des flux.", en: "Freelance n8n developer: repetitive work becomes flows." },
    answer: {
      fr: "Je construis des automatisations n8n qui relient vos outils : CRM, facturation, e-mail, paiements et API métier. Chaque flux gère les erreurs, reprend après une panne et laisse une trace de chaque exécution.",
      en: "I build n8n automations that connect your tools: CRM, invoicing, e-mail, payments and business APIs. Every flow handles errors, resumes after an outage and keeps a record of each run.",
    },
    deliverables: [
      { fr: "Flux n8n auto-hébergés ou sur n8n Cloud, documentés et versionnés", en: "Self-hosted or n8n Cloud flows, documented and versioned" },
      { fr: "Nœuds n8n sur mesure quand l’intégration n’existe pas", en: "Custom n8n nodes when the integration does not exist" },
      { fr: "Webhooks, synchronisations entre systèmes et paiements", en: "Webhooks, system-to-system syncs and payments" },
      { fr: "Alertes et journal d’exécution pour savoir ce qui a tourné", en: "Alerts and run logs so you know what ran" },
    ],
    stack: ["n8n", "TypeScript", "Node.js", "Webhooks", "PostgreSQL", "Docker"],
    proofs: [
      { label: { fr: "n8n-nodes-opn : mon nœud n8n publié sur npm", en: "n8n-nodes-opn: my n8n node published on npm" }, href: "/work/n8n-nodes-opn" },
      { label: { fr: "Automatisations n8n : démos, scénarios et preuves d’exécution", en: "n8n automations: demos, scenarios and execution evidence" }, href: "https://demos.memolabs.dev/" },
      { label: { fr: "Echo Travel : synchronisation à sens unique avec la marketplace 12Go", en: "Echo Travel: one-way sync with the 12Go marketplace" }, href: "/work/echo-travel" },
    ],
    faq: [
      {
        q: { fr: "n8n auto-hébergé ou n8n Cloud ?", en: "Self-hosted n8n or n8n Cloud?" },
        a: { fr: "Les deux fonctionnent. L’auto-hébergement garde les données chez vous et coûte moins cher à volume élevé ; n8n Cloud évite d’opérer un serveur.", en: "Both work. Self-hosting keeps data on your side and costs less at high volume; n8n Cloud saves you from running a server." },
      },
      {
        q: { fr: "Que se passe-t-il quand un flux échoue ?", en: "What happens when a flow fails?" },
        a: { fr: "Le flux réessaie, puis vous alerte avec l’étape en cause. Rien n’est perdu en silence.", en: "The flow retries, then alerts you with the failing step. Nothing is lost silently." },
      },
      {
        q: { fr: "Pouvez-vous connecter un outil sans intégration n8n ?", en: "Can you connect a tool that n8n does not support?" },
        a: { fr: "Oui, par son API ou en écrivant un nœud n8n dédié, comme n8n-nodes-opn.", en: "Yes, through its API or by writing a dedicated n8n node, like n8n-nodes-opn." },
      },
    ],
  },
  {
    slug: "web-development",
    title: { fr: "Développement web toutes stacks", en: "Web development, any stack" },
    metaTitle: { fr: "Développeur full-stack freelance : React, Vue, Laravel, .NET", en: "Freelance full-stack developer: React, Vue, Laravel, .NET" },
    metaDescription: {
      fr: "Développeur full-stack freelance à distance : React, Next.js, Vue, Laravel, Symfony ou .NET, de l’interface au déploiement. Ex-CTO d’Echo Travel.",
      en: "Remote freelance full-stack developer: React, Next.js, Vue, Laravel, Symfony or .NET, from interface to deployment. Former CTO at Echo Travel.",
    },
    h1: { fr: "Développeur full-stack freelance, sur la stack que vous avez déjà.", en: "Freelance full-stack developer, on the stack you already run." },
    answer: {
      fr: "Je reprends des applications existantes en React, Next.js, Vue, Laravel, Symfony, .NET ou Bootstrap, et je livre de bout en bout : interface, API, base de données, tests et déploiement. En renfort d’une agence, en marque blanche, ou directement pour une équipe produit.",
      en: "I pick up existing applications in React, Next.js, Vue, Laravel, Symfony, .NET or Bootstrap and deliver end to end: interface, API, database, tests and deployment. As backup for an agency, white-label, or directly for a product team.",
    },
    deliverables: [
      { fr: "Modernisation d’écrans hérités sans casser les usages métier", en: "Modernising legacy screens without breaking business workflows" },
      { fr: "Nouvelle fonctionnalité livrée jusqu’à son usage réel", en: "A new feature shipped all the way to real use" },
      { fr: "API, paiements et intégrations tierces", en: "APIs, payments and third-party integrations" },
      { fr: "Déploiement Docker, supervision et sauvegardes", en: "Docker deployment, monitoring and backups" },
    ],
    stack: ["React", "Next.js", "Vue", "TypeScript", "PHP", "Laravel", "Symfony", ".NET", "Bootstrap"],
    proofs: [
      { label: { fr: "Medsharing : plus de 100 écrans d’un SaaS clinique réglementé migrés", en: "Medsharing: 100+ screens of a regulated clinical SaaS migrated" }, href: "/about#experience-medsharing" },
      { label: { fr: "CTO d’Echo Travel : React, Laravel et paiements, environ 150 passagers par jour", en: "CTO at Echo Travel: React, Laravel and payments, about 150 passengers a day" }, href: "/work/echo-travel" },
      { label: { fr: "Flylooping chez Symbyoz : l’essentiel du frontend en HTML, CSS et JavaScript", en: "Flylooping at Symbyoz: work across most of the frontend in HTML, CSS and JavaScript" }, href: "/work/flylooping" },
      { label: { fr: "Démos de flux joués pour de vrai", en: "Demos of flows played for real" }, href: "https://demos.memolabs.dev/" },
    ],
    faq: [
      {
        q: { fr: "Pouvez-vous reprendre un code que vous n’avez pas écrit ?", en: "Can you take over code you did not write?" },
        a: { fr: "Oui, c’est l’essentiel de mes missions : lire l’existant, le stabiliser, puis le faire évoluer sans tout réécrire.", en: "Yes, that is most of my work: read the existing code, stabilise it, then grow it without rewriting everything." },
      },
      {
        q: { fr: "Travaillez-vous en marque blanche pour des agences ?", en: "Do you work white-label for agencies?" },
        a: { fr: "Oui. Je m’intègre à vos outils et à votre façon de livrer, et votre client voit votre agence.", en: "Yes. I fit into your tools and delivery process, and your client sees your agency." },
      },
      {
        q: { fr: "Quel est le format d’une mission ?", en: "What does an engagement look like?" },
        a: { fr: "Une fonctionnalité au périmètre clair, ou un renfort sur plusieurs semaines. Tout se fait à distance, en français ou en anglais.", en: "A clearly scoped feature, or backup over several weeks. Everything happens remotely, in French or English." },
      },
    ],
  },
  {
    slug: "erp-cutover-proof",
    title: { fr: "Preuve de bascule ERP", en: "ERP cutover proof" },
    metaTitle: { fr: "Preuve de bascule ERP : vérifier une migration Odoo ou Business Central", en: "ERP cutover proof: check an Odoo or Business Central migration" },
    metaDescription: {
      fr: "Vos opérations réelles rejouées sur le nouvel ERP, chaque écart expliqué, un rapport à signer avant la bascule. Forfait de 1 à 2 semaines, à distance.",
      en: "Your real operations replayed on the new ERP, every difference explained, a report to sign before cutover. Fixed price, 1 to 2 weeks, remote.",
    },
    h1: { fr: "Avant la bascule, la preuve que le nouvel ERP fait ce que faisait l’ancien.", en: "Before cutover, proof that the new ERP does what the old one did." },
    answer: {
      fr: "Pendant votre migration vers Odoo ou Business Central, je rejoue vos opérations réelles sur le nouveau système et je compare les résultats à ceux de l’ancien : soldes, stock, factures, pièces ouvertes. Chaque écart arrive avec sa cause, et vous signez un rapport avant la date de bascule.",
      en: "During your move to Odoo or Business Central, I replay your real operations on the new system and compare the results with the old one: balances, stock, invoices, open documents. Every difference comes with its cause, and you sign a report before the cutover date.",
    },
    steps: [
      {
        title: { fr: "Relever", en: "Record" },
        body: { fr: "Je relève ce que fait l’ancien système sur une période réelle : les opérations passées, et les données avant et après chacune.", en: "I record what the old system does over a real period: the operations it ran, and the data before and after each one." },
      },
      {
        title: { fr: "Cartographier", en: "Map" },
        body: { fr: "Des agents IA en tirent les règles et les cas de test. Je les relis avec les personnes qui font le travail, et vous obtenez une carte de vos processus.", en: "AI agents derive the rules and test cases from it. I review them with the people who do the work, and you get a map of your processes." },
      },
      {
        title: { fr: "Rejouer", en: "Replay" },
        body: { fr: "Les mêmes opérations sont rejouées sur le nouveau système à chaque migration d’essai. Chaque écart est listé avec sa cause : paramétrage, reprise de données ou règle oubliée.", en: "The same operations are replayed on the new system at every trial migration. Each difference is listed with its cause: configuration, data load or a missing rule." },
      },
      {
        title: { fr: "Signer", en: "Sign" },
        body: { fr: "Le rapport dit ce qui est identique, ce qui diffère et pourquoi, et ce qui n’a pas été testé. Vous le signez avant la bascule, ou vous décalez la date.", en: "The report states what matches, what differs and why, and what was not tested. You sign it before cutover, or you move the date." },
      },
    ],
    facts: [
      { label: { fr: "Pour qui", en: "For" }, value: { fr: "PME, ETI et leurs intégrateurs", en: "SMEs, mid-size firms, their integrators" } },
      { label: { fr: "Quand", en: "When" }, value: { fr: "Avant la date de bascule", en: "Before the cutover date" } },
      { label: { fr: "Durée", en: "Length" }, value: { fr: "1 à 2 semaines au forfait", en: "1 to 2 weeks, fixed price" } },
      { label: { fr: "Prix", en: "Price" }, value: { fr: "À partir de 3 500 € HT", en: "From €3,500 excl. VAT" } },
      { label: { fr: "Accès", en: "Access" }, value: { fr: "Lecture seule, rien en production", en: "Read-only, nothing in production" } },
    ],
    deliverables: [
      { fr: "La carte de vos processus, avec les règles métier tirées de vos données", en: "A map of your processes, with the business rules drawn from your data" },
      { fr: "Les cas de test, rejouables à chaque nouvelle migration d’essai", en: "Test cases you can replay at every new trial migration" },
      { fr: "La liste des écarts, chacun avec sa cause et la personne qui doit le corriger", en: "The list of differences, each with its cause and who should fix it" },
      { fr: "Un rapport de conformité à signer avant la bascule, qui dit aussi ce qui n’a pas été vérifié", en: "A conformance report to sign before cutover, which also states what was not checked" },
    ],
    stack: ["PostgreSQL", "SQL", "Python", "TypeScript", "Docker"],
    proofs: [
      { label: { fr: "CTO d’Echo Travel : réservations sorties de Zapier et Google Sheets vers une application, environ 150 passagers par jour à mon départ", en: "CTO at Echo Travel: bookings moved off Zapier and Google Sheets into an application, about 150 passengers a day when I left" }, href: "/work/echo-travel" },
      { label: { fr: "Medsharing : plus de 100 écrans d’un SaaS clinique réglementé migrés", en: "Medsharing: 100+ screens of a regulated clinical SaaS migrated" }, href: "/about#experience-medsharing" },
      { label: { fr: "CTO de Blue Owl : un moteur Electron de 2 600 fichiers porté vers le web", en: "CTO at Blue Owl: a 2,600-file Electron engine taken to the web" }, href: "/work/blueowl" },
    ],
    faq: [
      {
        q: { fr: "Mon intégrateur teste déjà. Pourquoi un regard extérieur ?", en: "My integrator already tests. Why an outside check?" },
        a: { fr: "Les deux se complètent. L’intégrateur vérifie ce qu’il a paramétré ; je vérifie que les résultats sont ceux de l’ancien système, sur vos opérations réelles. Je peux aussi travailler pour l’intégrateur, qui remet alors le rapport à son client.", en: "The two fit together. The integrator checks what it configured; I check that the results match the old system, on your real operations. I can also work for the integrator, who then hands the report to its client." },
      },
      {
        q: { fr: "Quels systèmes ?", en: "Which systems?" },
        a: { fr: "Au départ : Sage, Dynamics NAV, EBP, Dolibarr, ERPNext ou des tableurs. À l’arrivée : Odoo ou Business Central. Le premier échange sert à vérifier que je peux lire vos deux systèmes.", en: "From Sage, Dynamics NAV, EBP, Dolibarr, ERPNext or spreadsheets, to Odoo or Business Central. The first call is there to check that I can read both of your systems." },
      },
      {
        q: { fr: "Mes données passent-elles par une IA ?", en: "Does my data go through an AI?" },
        a: { fr: "Seulement avec votre accord et dans le cadre que vous fixez : un modèle sous contrat avec votre entreprise, ou un modèle ouvert sur une machine à vous. Le rapport dit quel modèle a vu quelles données.", en: "Only with your consent and within the limits you set: a model under contract with your company, or an open model on a machine you control. The report states which model saw which data." },
      },
      {
        q: { fr: "Et si le rapport montre des écarts ?", en: "What if the report shows differences?" },
        a: { fr: "C’est son rôle. Chaque écart est corrigé par la personne indiquée, on rejoue, et la bascule se décide sur un rapport à jour.", en: "That is its job. Each difference is fixed by the person named, the operations are replayed, and cutover is decided on an up-to-date report." },
      },
    ],
  },
];

export const SERVICE_BY_SLUG: Record<string, Service> = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));

/** General questions answered on the homepage, mirrored in its FAQPage structured data. */
export const HOME_FAQ: Faq[] = [
  {
    q: { fr: "Guillaume Flambard est-il disponible en freelance ?", en: "Is Guillaume Flambard available for freelance work?" },
    a: { fr: "Oui, en mission freelance entièrement à distance, pour des agences (y compris en marque blanche) et des équipes produit, en français ou en anglais.", en: "Yes, for fully remote freelance work, for agencies (white-label included) and product teams, in French or English." },
  },
  {
    q: { fr: "Quels projets d’IA et d’automatisation réalisez-vous ?", en: "What AI and automation work do you do?" },
    a: { fr: "Des fonctionnalités d’IA dans des applications existantes (assistants, extraction de documents, agents IA) et des automatisations n8n qui relient vos outils, avec reprise après erreur et suivi.", en: "AI features inside existing applications (assistants, document extraction, AI agents) and n8n automations that connect your tools, with retries and monitoring." },
  },
  {
    q: { fr: "Sur quelles technologies travaillez-vous ?", en: "Which technologies do you work with?" },
    a: { fr: "TypeScript, React, Next.js, Vue, PHP avec Laravel et Symfony, .NET, Bootstrap, n8n, PostgreSQL et Docker.", en: "TypeScript, React, Next.js, Vue, PHP with Laravel and Symfony, .NET, Bootstrap, n8n, PostgreSQL and Docker." },
  },
  {
    q: { fr: "Quelle est votre expérience ?", en: "What is your background?" },
    a: { fr: "CTO d’Echo Travel (réservation et paiements, environ 150 passagers par jour) et de Blue Owl (produit éducatif IA), plus de 100 écrans migrés chez Medsharing, et Tech Lead bénévole du projet Rescue Atlas de Data for Good pour SOS Méditerranée.", en: "CTO at Echo Travel (booking and payments, about 150 passengers a day) and Blue Owl (AI education product), 100+ screens migrated at Medsharing, and volunteer Tech Lead of Data for Good’s Rescue Atlas project for SOS Méditerranée." },
  },
  {
    q: { fr: "Comment démarrer une mission ?", en: "How do we start?" },
    a: { fr: "Écrivez à contact@memolabs.dev avec le besoin, le contexte technique et ce qui bloque. Je réponds moi-même, sans intermédiaire.", en: "Write to contact@memolabs.dev with the need, the technical context and what is blocking. I answer myself, with no middleman." },
  },
];
