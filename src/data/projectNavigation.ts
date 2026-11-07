import { FEATURED } from "./projects";

/**
 * One editorial source of truth for the order of the recruiter-facing portfolio.
 * Fully documented cases come first; the rest are supporting work and should
 * never silently intrude into the case-study journey.
 */
// Editorial selection follows buyer needs and real professional contributions.
const PROFESSIONAL_CASES = ["medsharing", "flylooping", "echo-travel", "blueowl"];
const caseSlugs = new Set(PROFESSIONAL_CASES);
export const CASE_PROJECTS = PROFESSIONAL_CASES.flatMap((slug) => FEATURED.filter((project) => project.slug === slug));
const SUPPORTING_CASES = ["emargo", "largo", "n8n-nodes-opn", "paykit", "twenty-crm", "weave"];
export const SUPPORTING_PROJECTS = SUPPORTING_CASES.flatMap((slug) => FEATURED.filter((project) => project.slug === slug));
export const PORTFOLIO_PROJECTS = [...CASE_PROJECTS, ...SUPPORTING_PROJECTS];

export function getProjectJourney(slug: string) {
  const isCaseStudy = caseSlugs.has(slug);
  const collection = isCaseStudy ? CASE_PROJECTS : SUPPORTING_PROJECTS;
  const index = collection.findIndex((project) => project.slug === slug);

  return {
    isCaseStudy,
    previous: index > 0 ? collection[index - 1] : null,
    next: index >= 0 && index < collection.length - 1 ? collection[index + 1] : null,
  };
}
