import type { Project } from "@/content/islands";

export type ProjectLinkLabels = {
  liveDemo: string;
  code: string;
  demoSoon: string;
};

export default function ProjectLink({
  project,
  labels,
}: {
  project: Project;
  labels: ProjectLinkLabels;
}) {
  return (
    <>
      {project.live && project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono rounded-sm border border-[var(--beacon)] bg-[var(--beacon)] px-3 py-2 text-xs tracking-wide text-[var(--paper)] transition-colors hover:bg-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
        >
          {labels.liveDemo}
        </a>
      ) : (
        <span className="font-mono rounded-sm border border-[var(--stone)]/40 px-3 py-2 text-xs tracking-wide text-[var(--stone)]">
          {labels.demoSoon}
        </span>
      )}

      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs tracking-wide text-[var(--ink)] underline decoration-[var(--contour)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--beacon)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
        >
          {labels.code}
        </a>
      )}
    </>
  );
}
