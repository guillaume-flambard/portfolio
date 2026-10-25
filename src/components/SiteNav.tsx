"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function SiteNav() {
  const t = useTranslations("home.nav");
  const locale = useLocale();
  const pathname = usePathname();

  const isActive = (segment: string) => {
    if (segment === "/") return pathname === "/";
    return pathname === segment || pathname.startsWith(`${segment}/`);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">{t("skip")}</a>
      <nav className="nav" aria-label={t("navigation")}>
        <div className="wrap">
          <Link href="/" className="logo" aria-label={t("home")}>
            <span className="mark" aria-hidden />
            Memo Labs
          </Link>
          <div className="navlinks">
            <Link href="/" className={isActive("/") ? "on" : undefined} aria-current={isActive("/") ? "page" : undefined}>{t("home")}</Link>
            <Link href="/work" className={isActive("/work") ? "on" : undefined} aria-current={isActive("/work") ? "page" : undefined}>{t("work")}</Link>
            <a href={`https://lab.memolabs.dev/${locale}/`} target="_blank" rel="noopener noreferrer">{t("lab")}</a>
            <Link href="/about" className={isActive("/about") ? "on" : undefined} aria-current={isActive("/about") ? "page" : undefined}>{t("about")}</Link>
            <Link href="/contact" className={isActive("/contact") ? "on" : undefined} aria-current={isActive("/contact") ? "page" : undefined}>{t("contact")}</Link>
          </div>
          <details className="mobile-menu" key={`${locale}:${pathname}`}>
            <summary className="mobile-menu-trigger">{t("menu")}</summary>
            <div className="mobile-menu-panel">
              <Link href="/" aria-current={isActive("/") ? "page" : undefined}>{t("home")}</Link>
              <Link href="/work" aria-current={isActive("/work") ? "page" : undefined}>{t("work")}</Link>
              <Link href="/about" aria-current={isActive("/about") ? "page" : undefined}>{t("about")}</Link>
              <Link href="/cv" aria-current={isActive("/cv") ? "page" : undefined}>{t("cv")}</Link>
              <Link href="/contact" aria-current={isActive("/contact") ? "page" : undefined}>{t("contact")}</Link>
              <a href={`https://lab.memolabs.dev/${locale}/`} target="_blank" rel="noopener noreferrer">{t("lab")}</a>
            </div>
          </details>
          <div className="navright">
            <span className="lang" aria-label={t("language")}>
              <Link href={pathname} locale="fr" lang="fr" aria-current={locale === "fr" ? "page" : undefined} className={locale === "fr" ? "on" : undefined}>FR</Link>
              {" / "}
              <Link href={pathname} locale="en" lang="en" aria-current={locale === "en" ? "page" : undefined} className={locale === "en" ? "on" : undefined}>EN</Link>
            </span>
            <Link className="cta" href="/contact">{t("cta")}</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
