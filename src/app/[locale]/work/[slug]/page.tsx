import { createRouteMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ALL_PROJECTS, getProject } from "@/data/projects";
import { CASE_BY_SLUG } from "@/data/caseStudies";
import { projectVisualLabel } from "@/data/projectVisuals";
import SiteNav from "@/components/SiteNav";
import ProjectImage from "@/components/ProjectImage";

export function generateStaticParams() {
  return ALL_PROJECTS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return { robots: { index: false } };
  return createRouteMetadata(
    locale,
    `/work/${slug}`,
    `${project.name} — Memo Labs`,
    project.tagline[locale as "fr" | "en"],
  );
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const project = getProject(slug);
  if (!project) notFound();

  const lang = locale as "fr" | "en";
  const study = CASE_BY_SLUG[slug];
  const idx = ALL_PROJECTS.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? ALL_PROJECTS[idx - 1] : null;
  const next = idx >= 0 && idx < ALL_PROJECTS.length - 1 ? ALL_PROJECTS[idx + 1] : null;

  const linkLabel = (label: string) => t(`link_${label}` as never) as string;

  return (
    <>
      <SiteNav />

      <article className="pdetail" id="main-content" tabIndex={-1}>
        <div className="wrap">
          <p className="eyebrow"><span className="r" />{t(`kind_${project.verification.kind}` as never)} · {t(`proof_${project.verification.proof}` as never)}</p>
          <h1 className="pname">{project.name}</h1>
          <p className="ptagline">{project.tagline[lang]}</p>

          {study && (
            <section className="case-snapshot" aria-labelledby="case-snapshot-title">
              <h2 id="case-snapshot-title">{t("caseSummaryTitle")}</h2>
              <dl className="case-snapshot-grid">
                <div>
                  <dt>{t("caseProblem")}</dt>
                  <dd>{study.context[lang]}</dd>
                </div>
                <div>
                  <dt>{t("caseIntervention")}</dt>
                  <dd>{study.ownership[lang]}</dd>
                </div>
                <div>
                  <dt>{t("caseOutcome")}</dt>
                  <dd>{study.result[lang]}</dd>
                </div>
              </dl>
              <p className="case-snapshot-caveat"><strong>{t("caseNote")}</strong> {study.caveat[lang]}</p>
            </section>
          )}

          <div className="plinks">
            {project.links.map((l) => (
              <a key={l.label} className="btn p" href={l.url} target="_blank" rel="noopener noreferrer">
                {linkLabel(l.label)}
              </a>
            ))}
            {study && <Link className="btn s" href="/contact">{t("caseContact")}</Link>}
          </div>

          <section className="evidence-note" aria-labelledby="evidence-title">
            <h2 id="evidence-title">{t("verificationTitle")}</h2>
            <p>{project.verification.note[lang]}</p>
            <p className="evidence-date">{t("checkedOn")} <time dateTime={project.verification.checkedAt}>{project.verification.checkedAt}</time></p>
          </section>

          {study ? (
            <details className="case-technical">
              <summary>{t("caseTechnicalToggle")}</summary>
              <div className="case-technical-body">
                <h2>{t("caseTechnicalTitle")}</h2>
                <dl className="case-facts">
                  <div><dt>{t("caseConstraint")}</dt><dd>{study.constraint[lang]}</dd></div>
                  <div><dt>{t("caseDecision")}</dt><dd>{study.decision[lang]}</dd></div>
                </dl>
                <div className="pstack">
                  <h3>{t("stack")}</h3>
                  <div className="stack">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
                </div>
              </div>
            </details>
          ) : (
            <div className="pbody">
              <p className="pdesc">{project.description[lang]}</p>
              <div className="pstack">
                <h2>{t("stack")}</h2>
                <div className="stack">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
              </div>
            </div>
          )}

          {project.gallery.length > 0 && (
            <section className="project-gallery" aria-labelledby="project-gallery-heading">
              <div className="project-gallery-intro">
                <h2 id="project-gallery-heading">{t("galleryTitle")}</h2>
                <p>{t("galleryEvidenceNote")}</p>
              </div>
              <div className="pgallery">
                {project.gallery.map((src, index) => {
                  const caption = projectVisualLabel(src, project.name, lang);
                  return (
                    <figure className="project-figure" key={src}>
                      <a
                        className="project-visual-link"
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("openGalleryImage", { name: project.name, number: index + 1 })}
                      >
                        <ProjectImage
                          src={src}
                          alt={caption}
                          sizes="(max-width: 820px) 100vw, (max-width: 1280px) 85vw, 1184px"
                        />
                      </a>
                      <figcaption>
                        <span className="project-figure-number">{String(index + 1).padStart(2, "0")} / {String(project.gallery.length).padStart(2, "0")}</span>
                        <span>{caption}</span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </section>
          )}

          <div className="ppager">
            {prev && <Link className="btn s" href={`/work/${prev.slug}`}>← {prev.name}</Link>}
            <Link className="btn s" href="/work">{t("allProjects")}</Link>
            {next && <Link className="btn s" href={`/work/${next.slug}`}>{next.name} →</Link>}
          </div>
        </div>
      </article>

      <footer className="foot">
        <span>© 2026 Memo Labs — Full-Stack Developer</span>
        <Link href="/legal">{locale === "fr" ? "Mentions légales" : "Legal notice"}</Link>
      </footer>
    </>
  );
}
