import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createRouteMetadata } from "@/lib/seo";
import { getExternalContributions, getGithubSync, type OpenSourceContribution } from "@/lib/githubActivity";
import SiteNav from "@/components/SiteNav";

export const revalidate = 3600;

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createRouteMetadata(locale, "/open-source",
    locale === "fr" ? "Contributions open source · Memo Labs" : "Open-source contributions · Memo Labs",
    locale === "fr"
      ? "Mes contributions publiques à des logiciels open source, avec liens GitHub et statut vérifié de chaque pull request."
      : "My public contributions to open-source software, linked to original GitHub pull requests with verified status.");
}

export default async function OpenSourcePage({ params }: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, feed, sync] = await Promise.all([
    getTranslations("openSource"),
    getExternalContributions(),
    getGithubSync(),
  ]);
  const formatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  });
  function items(contributions: OpenSourceContribution[], status: "merged" | "open") {
    return (
      <ul className="open-source-items" data-testid={"contributions-" + status}>
        {contributions.map((pr) => {
          const date = status === "merged" ? pr.mergedAt : pr.createdAt;
          return (
            <li key={pr.url}>
              <a href={pr.url} target="_blank" rel="noopener noreferrer">
                <span className="github-contribution-repo">{pr.repository}</span>
                <span className="github-item-title">{pr.title}<span aria-hidden="true">↗</span></span>
                <span className="github-meta">
                  <span>{status === "merged" ? t("mergedLabel") : t("openLabel")}</span>
                  {date ? <time dateTime={date}>{formatter.format(new Date(date))}</time> : null}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <>
      <SiteNav />
      <main className="open-source-page" id="main-content" tabIndex={-1}>
        <header className="open-source-hero">
          <div className="wrap">
            <p className="eyebrow"><span className="r" />{t("eyebrow")}</p>
            <h1 className="h">{t("title")}</h1>
            <p className="lede">{t("intro")}</p>
            <Link className="hero-inline-link open-source-back" href="/#github-activity">{t("back")}</Link>
          </div>
        </header>
        <section className="open-source-section" aria-labelledby="merged-title">
          <div className="wrap">
            <div className="github-block-heading">
              <h2 id="merged-title">{t("mergedTitle")}</h2>
              <span>{t("mergedSubtitle")}</span>
            </div>
            {feed.merged.length > 0 ? items(feed.merged, "merged") : <p className="github-empty">{t("empty")}</p>}
          </div>
        </section>
        <section className="open-source-section" aria-labelledby="open-title">
          <div className="wrap">
            <div className="github-block-heading">
              <h2 id="open-title">{t("openTitle")}</h2>
              <span>{t("openSubtitle")}</span>
            </div>
            {feed.open.length > 0 ? items(feed.open, "open") : <p className="github-empty">{t("emptyOpen")}</p>}
            <p className="github-disclaimer" data-testid="github-sync-status">
              {sync.source === "snapshot" ? t("snapshotSource") : t("liveSource")}
              {sync.updatedAt ? " · " + t("syncedAt") + " " + formatter.format(new Date(sync.updatedAt)) : ""}
              {sync.degraded ? " · " + t("snapshotStale") : ""}
            </p>
            <p className="github-disclaimer">{t("disclaimer")}</p>
          </div>
        </section>
      </main>
      <footer className="foot">
        <span>© 2026 Memo Labs — Full-Stack Developer</span>
        <Link href="/legal">{locale === "fr" ? "Mentions légales" : "Legal notice"}</Link>
      </footer>
    </>
  );
}
