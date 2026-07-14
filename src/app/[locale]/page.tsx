import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getIsland, ISLANDS } from "@/content/islands";
import type { Locale } from "@/content/islands";
import ArchipelagoScene from "@/three/ArchipelagoScene";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const home = getIsland("home");
  // `locale` is validated against `hasLocale` in the parent [locale]/layout.tsx
  // (which calls notFound() otherwise), so this cast to `Locale` is safe here.
  const blurb = home?.blurb[locale as Locale];

  return (
    <>
      <ArchipelagoScene islands={ISLANDS} locale={locale as Locale} />

      {/*
        `pointer-events-none` lets pointer/touch input pass through the
        empty chart area to the 3D canvas behind (island hover + sea
        wake, Task 11). Each actual interactive control below
        (`Link`s) opts back in with `pointer-events-auto` so hero
        navigation keeps working.
      */}
      <main className="pointer-events-none relative z-[1] flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 text-center">
        <div className="relative flex flex-col items-center gap-6 px-6 py-10 sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] backdrop-blur-[2px]"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--paper) 0%, color-mix(in srgb, var(--paper) 65%, transparent) 55%, transparent 80%)",
            }}
          />

          <p className="font-mono text-xs tracking-[0.3em] text-[var(--stone)] uppercase">
            {home?.titles[locale as Locale] ?? "Home Port"}
          </p>

          <h1 className="font-display text-5xl text-[var(--ink)] sm:text-6xl md:text-7xl">
            {t("hero.name")}
          </h1>

          <p className="font-mono max-w-xl text-sm text-[var(--stone)] sm:text-base">
            {t("hero.tagline")}
          </p>

          {blurb && (
            <p className="font-body max-w-xl text-[var(--ink)]/80">{blurb}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/"
              className="font-mono pointer-events-auto rounded-sm border border-[var(--beacon)] bg-[var(--beacon)] px-5 py-3 text-sm tracking-wide text-[var(--paper)] transition-colors hover:bg-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
            >
              {t("nav.enter")}
            </Link>

            <Link
              href="/list"
              className="font-mono pointer-events-auto rounded-sm border border-[var(--ink)] px-5 py-3 text-sm tracking-wide text-[var(--ink)] underline decoration-[var(--contour)] decoration-2 underline-offset-4 transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
            >
              {t("nav.list")}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
