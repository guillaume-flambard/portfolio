"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = locale === "fr" ? "en" : "fr";
  const switchLabel = otherLocale === "fr" ? t("switchToFrench") : t("switchToEnglish");

  function switchLocale() {
    router.replace(pathname, { locale: otherLocale });
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      className="font-mono fixed top-2 right-2 z-50 rounded-sm border border-[var(--ink)] bg-[var(--paper)] px-3 py-2 text-xs tracking-wide text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)]"
    >
      {/*
        No `aria-label` here on purpose: the accessible name is derived
        from this content, so it always contains the visible "FR ⇄ EN"
        text (WCAG 2.5.3 Label in Name — an `aria-label` that replaces
        rather than extends the visible label fails this for speech
        -input / screen-reader users, as Lighthouse's
        `label-content-name-mismatch` audit flagged on the previous
        `aria-label="Switch to French"` variant).
      */}
      <span className={locale === "fr" ? "text-[var(--beacon)]" : "text-[var(--stone)]"}>FR</span>
      {" ⇄ "}
      <span className={locale === "en" ? "text-[var(--beacon)]" : "text-[var(--stone)]"}>EN</span>
      <span className="sr-only">{`, ${switchLabel}`}</span>
    </button>
  );
}
