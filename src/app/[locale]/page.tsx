import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getIsland } from "@/content/islands";
import type { Locale } from "@/content/islands";

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
    <main
      className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 text-center"
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

      <div className="relative flex flex-col items-center gap-6">
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
            className="font-mono rounded-sm border border-[var(--beacon)] bg-[var(--beacon)] px-5 py-3 text-sm tracking-wide text-[var(--paper)] transition-colors hover:bg-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
          >
            {t("nav.enter")}
          </Link>

          <Link
            href="/list"
            className="font-mono rounded-sm border border-[var(--ink)] px-5 py-3 text-sm tracking-wide text-[var(--ink)] underline decoration-[var(--contour)] decoration-2 underline-offset-4 transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
          >
            {t("nav.list")}
          </Link>
        </div>
      </div>
    </main>
  );
}
