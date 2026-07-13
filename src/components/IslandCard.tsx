import { getTranslations } from "next-intl/server";
import type { Project } from "@/content/islands";

export default async function IslandCard({ project }: { project: Project }) {
  const t = await getTranslations("project");

  return (
    <article className="flex flex-col gap-4 rounded-sm border border-[var(--contour)] bg-[var(--paper)] p-5 shadow-[2px_2px_0_0_var(--contour)]">
      <h3 className="font-display text-xl text-[var(--ink)]">{project.name}</h3>

      <ul className="flex flex-wrap gap-2" aria-label="stack">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="font-mono rounded-sm border border-[var(--contour)] px-2 py-1 text-[10px] tracking-wide text-[var(--stone)] uppercase"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
        {project.live && project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono rounded-sm border border-[var(--beacon)] bg-[var(--beacon)] px-3 py-2 text-xs tracking-wide text-[var(--paper)] transition-colors hover:bg-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
          >
            {t("liveDemo")}
          </a>
        ) : (
          <span className="font-mono rounded-sm border border-[var(--stone)]/40 px-3 py-2 text-xs tracking-wide text-[var(--stone)]">
            {t("demoSoon")}
          </span>
        )}

        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-wide text-[var(--ink)] underline decoration-[var(--contour)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--beacon)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
          >
            {t("code")}
          </a>
        )}
      </div>
    </article>
  );
}
