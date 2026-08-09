"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function SiteNav() {
  const t = useTranslations("home.nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav className="nav">
      <div className="wrap">
        <Link href="/" className="logo">
          <span className="mark" aria-hidden />
          Memo Labs
        </Link>
        <div className="navlinks">
          <Link href="/work">{t("work")}</Link>
          <a href="https://lab.memolabs.dev" target="_blank" rel="noopener noreferrer">{t("lab")}</a>
          <Link href="/about">{t("about")}</Link>
          <Link href="/contact">{t("contact")}</Link>
        </div>
        <div className="navright">
          <span className="lang">
            <Link href={pathname} locale="fr" className={locale === "fr" ? "on" : undefined}>FR</Link>
            {" / "}
            <Link href={pathname} locale="en" className={locale === "en" ? "on" : undefined}>EN</Link>
          </span>
          <Link className="cta" href="/contact">{t("cta")}</Link>
        </div>
      </div>
    </nav>
  );
}
