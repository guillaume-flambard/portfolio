import { getTranslations } from "next-intl/server";
import type { Project } from "@/content/islands";
import ProjectLink from "@/components/ProjectLink";

export default async function IslandCard({ project }: { project: Project }) {
  const t = await getTranslations("project");

  const labels = {
    liveDemo: t("liveDemo"),
    code: t("code"),
    demoSoon: t("demoSoon"),
  };

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
        <ProjectLink project={project} labels={labels} />
      </div>
    </article>
  );
}
