import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ISLANDS } from "@/content/islands";
import type { Locale } from "@/content/islands";
import ListView from "@/components/ListView";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "list" });

  return {
    title: t("title"),
  };
}

export default async function ListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const labels = {
    title: t("list.title"),
    liveDemo: t("project.liveDemo"),
    code: t("project.code"),
    demoSoon: t("project.demoSoon"),
  };

  // `locale` is validated against `hasLocale` in the parent [locale]/layout.tsx
  // (which calls notFound() otherwise), so this cast to `Locale` is safe here.
  return (
    <ListView islands={ISLANDS} locale={locale as Locale} labels={labels} />
  );
}
