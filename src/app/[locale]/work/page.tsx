import { createRouteMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { CASE_PROJECTS, SUPPORTING_PROJECTS } from "@/data/projectNavigation";
import { CASE_BY_SLUG } from "@/data/caseStudies";
import SiteNav from "@/components/SiteNav";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [title, description] = locale === "fr"
    ? ["Réalisations : interfaces, API et applications web | Guillaume Flambard", "Medsharing, Flylooping via Symbyoz, Echo Travel et Blue Owl : besoins, contributions et réalisations."]
    : ["Work: interfaces, APIs and web applications | Guillaume Flambard", "Medsharing, Flylooping through Symbyoz, Echo Travel and Blue Owl: needs, contributions and work delivered."];
  return createRouteMetadata(locale, "/work", title, description);
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const lang = locale as "fr" | "en";

  // Case studies have a written account of the problem, contribution and outcome.
  // Other projects still belong in the portfolio, but should not look equally substantiated.
  const caseProjects = CASE_PROJECTS;
  const otherProjects = SUPPORTING_PROJECTS;

  return (
    <>
      <SiteNav />

      <header className="hero work-hero" id="main-content" tabIndex={-1}>
        <div className="wrap">
          <p className="eyebrow"><span className="r" />{t("title")}</p>
          <h1 className="h">{t("title")}</h1>
          <p className="lede">{t("subtitle")}</p>
        </div>
      </header>

      <main className="sec work-page">
        <div className="wrap">
          <section className="work-group" aria-labelledby="work-case-heading">
            <div className="work-group-heading">
              <div>
                <p className="work-group-kicker">{t("caseListKicker")}</p>
                <h2 id="work-case-heading">{t("caseListTitle")}</h2>
              </div>
              <p>{t("caseListIntro")}</p>
            </div>
            <div className="grid professional-cases" data-testid="case-projects">
              {caseProjects.map((p) => {
                const study = CASE_BY_SLUG[p.slug];
                return (
                  <Link key={p.slug} className="card" href={`/work/${p.slug}`}>
                    <div className="cbody">
                      <p className="card-need">{study.need?.[lang]}</p>
                      <h3>{p.name}<span className="arrow" aria-hidden="true">→</span></h3>
                      <p>{study.preview[lang]}</p>
                      <p className="card-role"><strong>{t("cardRoleLabel")} :</strong> {study.role[lang]}</p>
                      <p className="card-proof">{t(`kind_${p.verification.kind}` as never)} · {t(`proof_${p.verification.proof}` as never)}</p>
                      <div className="stack">{p.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="work-group work-other" aria-labelledby="work-other-heading">
            <div className="work-group-heading">
              <div>
                <p className="work-group-kicker">{t("otherListKicker")}</p>
                <h2 id="work-other-heading">{t("otherListTitle")}</h2>
              </div>
              <p>{t("otherListIntro")}</p>
            </div>
            <ul className="work-other-list" data-testid="other-projects">
              {otherProjects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="work-other-link">
                    <strong>{p.name}</strong>
                    <span className="work-other-description">{p.tagline[lang]}</span>
                    <span className="work-other-evidence">{t(`kind_${p.verification.kind}` as never)} · {t(`proof_${p.verification.proof}` as never)}</span>
                    <span className="work-other-arrow" aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="proof-legend">{t("proofLegend")}</p>
          </section>
        </div>
      </main>

      <footer className="foot">
        <span>© 2026 Memo Labs · Guillaume Flambard EI</span>
        <Link href="/legal">{locale === "fr" ? "Mentions légales" : "Legal notice"}</Link>
      </footer>
    </>
  );
}
