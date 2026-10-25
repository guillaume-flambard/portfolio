import { CASE_STUDIES } from "./caseStudies";
import { FEATURED } from "./projects";

/**
 * One editorial source of truth for the order of the recruiter-facing portfolio.
 * Fully documented cases come first; the rest are supporting work and should
 * never silently intrude into the case-study journey.
 */
const caseSlugs = new Set<string>(CASE_STUDIES.map((study) => study.slug));

export const CASE_PROJECTS = CASE_STUDIES.flatMap((study) =>
  FEATURED.filter((project) => project.slug === study.slug),
);
export const SUPPORTING_PROJECTS = FEATURED.filter((project) => !caseSlugs.has(project.slug));
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
