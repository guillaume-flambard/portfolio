import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createRouteMetadata } from "@/lib/seo";
import { getShowcaseProjects } from "@/lib/githubActivity";
import { getProjectTimeline, type TimelineKind } from "@/lib/projectTimeline";
import SiteNav from "@/components/SiteNav";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; owner: string; repo: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, owner, repo } = await params;
  if (!/^[a-z\d_.-]+$/i.test(owner) || !/^[a-z\d_.-]+$/i.test(repo)) {
    return { robots: { index: false } };
  }
  const projects = await getShowcaseProjects(100);
  const project = projects.find((entry) => entry.fullName.toLowerCase() === `${owner}/${repo}`.toLowerCase());
  if (!project) return { robots: { index: false } };
  return createRouteMetadata(locale, `/build/${owner}/${repo}`,
    `${project.name} — Project build log · Memo Labs`,
    locale === "fr"
      ? `Historique public de ${project.name} : évolutions fusionnées et versions GitHub vérifiables.`
      : `Public history of ${project.name}: verifiable merged changes and GitHub releases.`);
}

export default async function BuildLogPage({ params }: Props) {
  const { locale, owner, repo } = await params;
  setRequestLocale(locale);
  if (!/^[a-z\d_.-]+$/i.test(owner) || !/^[a-z\d_.-]+$/i.test(repo)) notFound();
  const projects = await getShowcaseProjects(100);
  const project = projects.find((entry) => entry.fullName.toLowerCase() === `${owner}/${repo}`.toLowerCase());
  if (!project) notFound();

  const [t, timeline] = await Promise.all([
    getTranslations("build"),
    getProjectTimeline(project, locale as "fr" | "en"),
  ]);
  const formatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
  const label = (kind: TimelineKind) => t(`kind_${kind}` as never) as string;

  return (
    <>
      <SiteNav />
      <main className="build-log" id="main-content" tabIndex={-1}>
        <header className="build-log-header">
          <div className="wrap">
            <p className="eyebrow"><span className="r" />{t("eyebrow")}</p>
            <h1 className="h">{project.name}</h1>
            <p className="lede">{project.description || t("defaultDescription")}</p>
            <div className="build-log-links">
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn p">{t("repoCta")}</a>
              <Link href="/#github-activity" className="btn s">{t("back")}</Link>
            </div>
          </div>
        </header>

        <section className="build-log-content sec" aria-labelledby="build-log-heading">
          <div className="wrap narrow">
            <p className="github-kicker">{t("sectionEyebrow")}</p>
            <h2 id="build-log-heading" className="display">{t("timelineTitle")}</h2>
            <p className="build-log-intro">{t("timelineIntro")}</p>
            {timeline.events.length ? (
              <ol className="build-events" data-testid="project-timeline">
                {timeline.events.map((event) => (
                  <li key={event.url + "-" + event.kind}>
                    <div className="build-event-date">
                      <time dateTime={event.date}>{formatter.format(new Date(event.date))}</time>
                    </div>
                    <div className="build-event-content">
                      <p className="build-event-kind">{label(event.kind)}</p>
                      <h3>{event.title}</h3>
                      <p className="build-event-explanation">{t(`note_${event.kind}` as never)}</p>
                      {event.detail ? <p className="build-event-detail">{event.detail}</p> : null}
                      <div className="build-event-links">
                        <a href={event.url} target="_blank" rel="noopener noreferrer">
                          {t("source")} <span aria-hidden="true">↗</span>
                        </a>
                        {event.demoUrl ? <a href={event.demoUrl} target="_blank" rel="noopener noreferrer">
                          {t("tryDemo")} <span aria-hidden="true">↗</span>
                        </a> : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="github-empty">{t("empty")}</p>
            )}
            {timeline.incomplete && <p className="build-log-limitation">{t("incomplete")}</p>}
            <p className="build-log-limitation">{t("limitations")}</p>
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
