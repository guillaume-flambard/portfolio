/**
 * Text labels for assets already shipped in /public/work.
 *
 * These describe what the image is for (a project visual), not independently
 * verified customer activity, production use or a completed transaction.
 */
export type VisualLabel = { fr: string; en: string };

export const PROJECT_VISUALS: Record<string, VisualLabel> = {
  "/work/emargo/hero.png": {
    fr: "Visuel de présentation d’Émargo",
    en: "Émargo overview visual",
  },
  "/work/echo-travel/hero.png": {
    fr: "Visuel de présentation d’Echo Travel",
    en: "Echo Travel overview visual",
  },
  "/work/paykit/hero.png": {
    fr: "Visuel de présentation de PayKit",
    en: "PayKit overview visual",
  },
  "/work/paykit/usage.png": {
    fr: "Visuel du suivi d’utilisation de PayKit",
    en: "PayKit usage view",
  },
  "/work/blueowl/hero.png": {
    fr: "Visuel de présentation de Blue Owl",
    en: "Blue Owl overview visual",
  },
  "/work/blueowl/framework.png": {
    fr: "Visuel de présentation du framework Blue Owl",
    en: "Blue Owl framework overview",
  },
  "/work/blueowl/mission.png": {
    fr: "Visuel associé à la mission Blue Owl",
    en: "Blue Owl mission visual",
  },
  "/work/weave/hero.png": {
    fr: "Visuel de présentation de Weave",
    en: "Weave overview visual",
  },
  "/work/n8n-nodes-opn/hero.png": {
    fr: "Visuel de présentation du nœud n8n Opn",
    en: "n8n Opn node overview visual",
  },
  "/work/n8n-nodes-opn/readme.png": {
    fr: "Visuel de documentation du nœud n8n",
    en: "n8n node documentation visual",
  },
  "/work/n8n-nodes-opn/repo.png": {
    fr: "Visuel du dépôt source n8n-nodes-opn",
    en: "n8n-nodes-opn source repository visual",
  },
  "/work/largo/hero.png": {
    fr: "Visuel de présentation de Largo IA",
    en: "Largo IA overview visual",
  },
  "/work/largo/services.png": {
    fr: "Visuel de la section services de Largo IA",
    en: "Largo IA services visual",
  },
  "/work/largo/blog.png": {
    fr: "Visuel de la section blog de Largo IA",
    en: "Largo IA blog visual",
  },
};

/** The neutral fallback never invents an image's contents. */
export function projectVisualLabel(
  source: string,
  name: string,
  locale: "fr" | "en",
): string {
  return PROJECT_VISUALS[source]?.[locale] ??
    (locale === "fr" ? `Visuel de présentation — ${name}` : `Project visual — ${name}`);
}
