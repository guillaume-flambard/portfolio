"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function SiteNav() {
  const t = useTranslations("home.nav");
  const locale = useLocale();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const homeLink = (hash: string) => (isHome ? `#${hash}` : { pathname: "/", hash });

  return (
    <nav className="nav">
      <div className="wrap">
        <Link href="/" className="logo">
          <span className="mark" aria-hidden />
          Guillaume Flambard
        </Link>
        <div className="navlinks">
          <Link href={isHome ? "#work" : "/work"}>{t("work")}</Link>
          <Link href={homeLink("about")}>{t("about")}</Link>
          <Link href={homeLink("contact")}>{t("contact")}</Link>
          <a href="https://lab.memolabs.dev" target="_blank" rel="noopener noreferrer">{t("lab")}</a>
        </div>
        <div className="navright">
          <span className="lang">
            <Link href={pathname} locale="fr" className={locale === "fr" ? "on" : undefined}>FR</Link>
            {" / "}
            <Link href={pathname} locale="en" className={locale === "en" ? "on" : undefined}>EN</Link>
          </span>
          <Link className="cta" href={homeLink("contact")}>{t("cta")}</Link>
        </div>
      </div>
    </nav>
  );
}
