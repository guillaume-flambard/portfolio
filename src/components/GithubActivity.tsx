import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getGithubActivity } from "@/lib/githubActivity";

/**
 * Server-rendered evidence. Never equate a code push with a deployment,
 * nor a merged PR with an independent quality certification.
 */
export default async function GithubActivity({ locale }: { locale: "fr" | "en" }) {
  const [t, activity] = await Promise.all([
    getTranslations("activity"),
    getGithubActivity(),
  ]);
  const formatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });

  return (
    <section className="github-activity sec" id="github-activity" aria-labelledby="github-heading">
      <div className="wrap">
        <div className="github-activity-top">
          <div>
            <p className="github-kicker">{t("eyebrow")}</p>
            <h2 id="github-heading" className="display">{t("title")}</h2>
            <p className="github-activity-intro">{t("intro")}</p>
          </div>
          <a className="github-profile-link" href="https://github.com/guillaume-flambard" target="_blank" rel="noopener noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="github-activity-columns">
          <div className="github-activity-block">
            <div className="github-block-heading">
              <h3>{t("projectsTitle")}</h3>
              <span>{t("projectsCaption")}</span>
            </div>
            {activity.projects.length > 0 ? (
              <ul className="github-project-list" data-testid="github-showcase">
                {activity.projects.map((project) => (
                  <li key={project.fullName}>
                    <a className="github-project-link" href={project.url} target="_blank" rel="noopener noreferrer">
                      <span className="github-item-title">{project.name}<span aria-hidden="true">↗</span></span>
                      {project.description ? <span className="github-project-description">{project.description}</span> : null}
                      <span className="github-meta">
                        {project.language ? <span>{project.language}</span> : null}
                        <span>{t("lastCodeUpdate")} {formatter.format(new Date(project.pushedAt))}</span>
                      </span>
                    </a>
                    <Link className="github-build-log-link" href={`/build/${project.fullName}`}>
                      {t("buildLogCta")} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="github-empty">{t("projectsEmpty")}</p>}
          </div>

          <div className="github-activity-block">
            <div className="github-block-heading">
              <h3>{t("contributionsTitle")}</h3>
              <span>{t("contributionsCaption")}</span>
            </div>
            {activity.contributions.length > 0 ? (
              <ul className="github-contribution-list" data-testid="github-contributions">
                {activity.contributions.map((contribution) => (
                  <li key={contribution.url}>
                    <a href={contribution.url} target="_blank" rel="noopener noreferrer">
                      <span className="github-contribution-repo">{contribution.repository}</span>
                      <span className="github-item-title">{contribution.title}<span aria-hidden="true">↗</span></span>
                      <span className="github-meta">{t("mergedPr")}{contribution.mergedAt ? ` · ${formatter.format(new Date(contribution.mergedAt))}` : ""}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : <p className="github-empty">{t("contributionsEmpty")}</p>}
            {activity.openContributions.length > 0 && (
              <div className="github-open-contributions">
                <p className="github-kicker">{t("openContributionsTitle")}</p>
                <ul className="github-contribution-list" data-testid="github-open-contributions">
                  {activity.openContributions.map((contribution) => (
                    <li key={contribution.url}>
                      <a href={contribution.url} target="_blank" rel="noopener noreferrer">
                        <span className="github-contribution-repo">{contribution.repository}</span>
                        <span className="github-item-title">{contribution.title}<span aria-hidden="true">↗</span></span>
                        <span className="github-meta">{t("openPr")}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link className="github-all-contributions-link" href="/open-source">
              {t("allContributions")} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="github-activity-block github-discovery-block">
            <div className="github-block-heading">
              <h3>{t("newProjectsTitle")}</h3>
              <span>{t("newProjectsCaption")}</span>
            </div>
            {activity.newProjects.length > 0 ? (
              <ul className="github-project-list" data-testid="github-auto-discovered">
                {activity.newProjects.map((project) => (
                  <li key={project.fullName}>
                    <a className="github-project-link" href={project.url} target="_blank" rel="noopener noreferrer">
                      <span className="github-item-title">{project.name}<span aria-hidden="true">↗</span></span>
                      {project.description ? <span className="github-project-description">{project.description}</span> : null}
                      <span className="github-meta">
                        <span>{t("newRepoStatus")}</span>
                        {project.createdAt ? <span>{formatter.format(new Date(project.createdAt))}</span> : null}
                      </span>
                    </a>
                    <Link className="github-build-log-link" href={"/build/" + project.fullName}>
                      {t("buildLogCta")} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="github-empty">{t("newProjectsEmpty")}</p>}
          </div>

        </div>
        <p className="github-disclaimer">{t("disclaimer")}</p>
      </div>
    </section>
  );
}
