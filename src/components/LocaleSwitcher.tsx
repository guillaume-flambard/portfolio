"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = locale === "fr" ? "en" : "fr";

  function switchLocale() {
    router.replace(pathname, { locale: otherLocale });
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={`Switch to ${otherLocale === "fr" ? "French" : "English"}`}
      className="font-mono fixed top-2 right-2 z-50 rounded-sm border border-[var(--ink)] bg-[var(--paper)] px-3 py-2 text-xs tracking-wide text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)]"
    >
      <span className={locale === "fr" ? "text-[var(--beacon)]" : "text-[var(--stone)]"}>FR</span>
      {" ⇄ "}
      <span className={locale === "en" ? "text-[var(--beacon)]" : "text-[var(--stone)]"}>EN</span>
    </button>
  );
}
