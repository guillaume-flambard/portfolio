import type { Island, Locale } from "@/content/islands";
import ProjectLink from "@/components/ProjectLink";

export type ListLabels = {
  title: string;
  liveDemo: string;
  code: string;
  demoSoon: string;
  viewIsland: string;
  stack: string;
  kind: Record<Island["kind"], string>;
};

export default function ListView({
  islands,
  locale,
  labels,
}: {
  islands: Island[];
  locale: Locale;
  labels: ListLabels;
}) {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-16 px-6 py-16">
      <h1 className="font-display text-4xl text-[var(--ink)] sm:text-5xl">
        {labels.title}
      </h1>

      {islands.map((island) => (
        <section
          key={island.slug}
          aria-labelledby={`island-${island.slug}`}
          className="flex flex-col gap-4 border-t border-[var(--contour)] pt-8"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--stone)] uppercase">
            {labels.kind[island.kind]}
          </p>

          <h2
            id={`island-${island.slug}`}
            className="font-display text-2xl text-[var(--ink)] sm:text-3xl"
          >
            {island.titles[locale]}
          </h2>

          <p className="font-body max-w-2xl text-[var(--ink)]/80">
            {island.blurb[locale]}
          </p>

          <a
            href={`/${locale}/isle/${island.slug}`}
            className="font-mono self-start text-xs tracking-wide text-[var(--ink)] underline decoration-[var(--contour)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--beacon)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
          >
            {labels.viewIsland}
            <span className="sr-only">{`: ${island.titles[locale]}`}</span>
          </a>

          {island.projects && island.projects.length > 0 && (
            <ul className="mt-4 flex flex-col gap-4">
              {island.projects.map((project) => (
                <li
                  key={project.name}
                  className="flex flex-col gap-2 rounded-sm border border-[var(--contour)] p-4"
                >
                  <h3 className="font-display text-lg text-[var(--ink)]">
                    {project.name}
                  </h3>

                  <ul
                    className="flex flex-wrap gap-2"
                    aria-label={labels.stack}
                  >
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        className="font-mono rounded-sm border border-[var(--contour)] px-2 py-1 text-[10px] tracking-wide text-[var(--stone)] uppercase"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <ProjectLink project={project} labels={labels} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}
