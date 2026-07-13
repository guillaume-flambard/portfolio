import { getTranslations } from "next-intl/server";
import type { Island, Locale } from "@/content/islands";
import IslandCard from "@/components/IslandCard";

export default async function IslandDetail({
  island,
  locale,
}: {
  island: Island;
  locale: Locale;
}) {
  const [lat, lng] = island.pos;
  const t = await getTranslations("kind");

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 py-24"
      style={{
        backgroundImage:
          "linear-gradient(var(--contour) 1px, transparent 1px), linear-gradient(90deg, var(--contour) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        backgroundPosition: "center",
        backgroundColor: "var(--paper)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, var(--paper) 75%)",
        }}
      />

      <div className="relative mx-auto flex max-w-3xl flex-col gap-6">
        <p className="font-mono text-xs tracking-[0.3em] text-[var(--stone)] uppercase">
          {t(island.kind)}
        </p>

        <h1 className="font-display text-4xl text-[var(--ink)] sm:text-5xl md:text-6xl">
          {island.titles[locale]}
        </h1>

        <p className="font-mono text-xs tracking-wide text-[var(--amber)]">
          {`${lat >= 0 ? "N" : "S"} ${Math.abs(lat).toFixed(2)}° / ${lng >= 0 ? "E" : "W"} ${Math.abs(lng).toFixed(2)}°`}
        </p>

        <p className="font-body max-w-2xl text-lg text-[var(--ink)]/80">
          {island.blurb[locale]}
        </p>

        {island.projects && island.projects.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {island.projects.map((project) => (
              <IslandCard key={project.name} project={project} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
