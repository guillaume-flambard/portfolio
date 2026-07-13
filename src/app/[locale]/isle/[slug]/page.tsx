import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ISLANDS, getIsland } from "@/content/islands";
import type { Locale } from "@/content/islands";
import IslandDetail from "@/components/IslandDetail";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ISLANDS.map((island) => ({ locale, slug: island.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const island = getIsland(slug);

  if (!island) {
    return {};
  }

  const l = locale as Locale;

  return {
    title: island.titles[l],
    description: island.blurb[l],
  };
}

export default async function IslandPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const island = getIsland(slug);

  if (!island) {
    notFound();
  }

  return <IslandDetail island={island} locale={locale as Locale} />;
}
