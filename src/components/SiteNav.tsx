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
    <nav className="nav">
      <div className="wrap">
        <Link href="/" className="logo" aria-label={t("home")}>
          <span className="mark" aria-hidden />
          Memo Labs
        </Link>
        <div className="navlinks">
          <Link href="/" className={isActive("/") ? "on" : undefined}>{t("home")}</Link>
          <Link href="/work" className={isActive("/work") ? "on" : undefined}>{t("work")}</Link>
          <a href={`https://lab.memolabs.dev/${locale}/`} target="_blank" rel="noopener noreferrer">{t("lab")}</a>
          <Link href="/about" className={isActive("/about") ? "on" : undefined}>{t("about")}</Link>
          <Link href="/contact" className={isActive("/contact") ? "on" : undefined}>{t("contact")}</Link>
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
