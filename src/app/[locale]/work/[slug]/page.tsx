import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ALL_PROJECTS, getProject } from "@/data/projects";
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
  if (!project) return {};
  return {
    title: `${project.name} — Memo Labs`,
    description: project.tagline[locale as "fr" | "en"],
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const project = getProject(slug);
  if (!project) notFound();

  const lang = locale as "fr" | "en";
  const idx = ALL_PROJECTS.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? ALL_PROJECTS[idx - 1] : null;
  const next = idx >= 0 && idx < ALL_PROJECTS.length - 1 ? ALL_PROJECTS[idx + 1] : null;

  const linkLabel = (label: string) => t(`link_${label}` as never) as string;

  return (
    <>
      <SiteNav />

      <article className="pdetail">
        <div className="wrap">
          <p className="eyebrow"><span className="r" />{t(`category_${project.category}` as never)} · {t(`status_${project.status}` as never)}</p>
          <h1 className="pname">{project.name}</h1>
          <p className="ptagline">{project.tagline[lang]}</p>

          <div className="plinks">
            {project.links.map((l) => (
              <a key={l.label} className="btn p" href={l.url} target="_blank" rel="noopener noreferrer">
                {linkLabel(l.label)}
              </a>
            ))}
          </div>

          <div className="pbody">
            <p className="pdesc">{project.description[lang]}</p>
            <div className="pstack">
              <h2>{t("stack")}</h2>
              <div className="stack">{project.stack.map((s) => <span key={s}>{s}</span>)}</div>
            </div>
          </div>

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
