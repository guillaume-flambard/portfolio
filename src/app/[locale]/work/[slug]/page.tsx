import { createRouteMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ALL_PROJECTS, getProject } from "@/data/projects";
import { CASE_BY_SLUG } from "@/data/caseStudies";
import { routing } from "@/i18n/routing";
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

          <div className="plinks">
            {project.links.map((l) => (
              <a key={l.label} className="btn p" href={l.url} target="_blank" rel="noopener noreferrer">
                {linkLabel(l.label)}
              </a>
            ))}
          </div>

          <section className="evidence-note" aria-labelledby="evidence-title">
            <h2 id="evidence-title">{t("verificationTitle")}</h2>
            <p>{project.verification.note[lang]}</p>
            <p className="evidence-date">{t("checkedOn")} <time dateTime={project.verification.checkedAt}>{project.verification.checkedAt}</time></p>
          </section>

          <div className="pbody">
            <p className="pdesc">{project.description[lang]}</p>
            <div className="pstack">
              <h2>{t("stack")}</h2>
              <div className="stack">{project.stack.map((s) => <span key={s}>{s}</span>)}</div>
            </div>
          </div>

          {study && (
            <section className="case-study" aria-labelledby="case-study-heading">
              <p className="eyebrow"><span className="r" />{t("caseEyebrow")}</p>
              <h2 id="case-study-heading">{t("caseTitle")}</h2>
              <dl className="case-facts">
                <div><dt>{t("caseContext")}</dt><dd>{study.context[lang]}</dd></div>
                <div><dt>{t("caseOwnership")}</dt><dd>{study.ownership[lang]}</dd></div>
                <div><dt>{t("caseConstraint")}</dt><dd>{study.constraint[lang]}</dd></div>
                <div><dt>{t("caseDecision")}</dt><dd>{study.decision[lang]}</dd></div>
                <div><dt>{t("caseResult")}</dt><dd>{study.result[lang]}</dd></div>
              </dl>
              <p className="case-note"><strong>{t("caseNote")}</strong> {study.caveat[lang]}</p>
              <Link className="btn s maplink" href="/contact">{t("caseContact")}</Link>
            </section>
          )}

          {project.gallery.length > 0 && (
            <div className="pgallery">
              {project.gallery.map((src) => (
                <ProjectImage key={src} src={src} alt={project.name} />
              ))}
            </div>
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
        <Link href={`/${locale}/legal`}>Mentions légales</Link>
      </footer>
    </>
  );
}
