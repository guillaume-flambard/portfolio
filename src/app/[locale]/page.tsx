import { getTranslations, setRequestLocale } from "next-intl/server";
import { getIsland, ISLANDS } from "@/content/islands";
import type { Locale } from "@/content/islands";
import ArchipelagoScene from "@/three/ArchipelagoScene";
import HeroPanel from "@/three/HeroPanel";
import { ExploreProvider } from "@/three/explore-context";

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
    // `ExploreProvider` connects the hero's "Enter the archipelago" button
    // (`HeroPanel`, plain DOM) to the R3F camera (`Canvas3D`, mounted
    // separately inside `ArchipelagoScene` via `next/dynamic`) — both are
    // client components rendered as children here, so React context is
    // enough; no window events or extra state libraries needed.
    <ExploreProvider>
      <ArchipelagoScene islands={ISLANDS} locale={locale as Locale} />

      {/*
        `pointer-events-none` lets pointer/touch input pass through the
        empty chart area to the 3D canvas behind (island hover + sea
        wake, Task 11). Each actual interactive control inside `HeroPanel`
        opts back in with `pointer-events-auto` so hero navigation keeps
        working.
      */}
      <HeroPanel
        portTitle={home?.titles[locale as Locale] ?? "Home Port"}
        name={t("hero.name")}
        tagline={t("hero.tagline")}
        blurb={blurb}
        enterLabel={t("nav.enter")}
        listLabel={t("nav.list")}
      />
    </ExploreProvider>
  );
}
