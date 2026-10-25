import { createRouteMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import SiteNav from "@/components/SiteNav";
import { EXPERIENCES } from "@/data/experience";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [title, description] = locale === "fr"
    ? ["Guillaume Flambard — Parcours et expériences React & TypeScript","Développeur web indépendant React & TypeScript : Medsharing, Echo Travel, Symbyoz, services API et projets web. Découvrez mon parcours et mon CV."]
    : ["Guillaume Flambard — React & TypeScript developer experience","Independent React & TypeScript developer: Medsharing, Echo Travel, Symbyoz, APIs and real-world web projects. Explore my experience and resume."];
  return createRouteMetadata(locale, "/about", title, description);
}


export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const lang = locale as "fr" | "en";

  return (
    <>
      <SiteNav />

      <header className="hero" id="main-content" tabIndex={-1}>
        <div className="wrap">
          <p className="eyebrow"><span className="r" />{t("eyebrow")}</p>
          <h1 className="h" dangerouslySetInnerHTML={{ __html: t.raw("title") }} />
          <p className="lede">{t("lede")}</p>
        </div>
      </header>

      <main className="sec">
        <div className="wrap narrow">
          <div className="ldesc">
            <p dangerouslySetInnerHTML={{ __html: t.raw("p1") }} />
            <p dangerouslySetInnerHTML={{ __html: t.raw("p2") }} />

            <h2>{t("servicesTitle")}</h2>
            <p>{t("servicesP")}</p>
            <div className="facts">
              <div><span>{t("s1k")}</span><b>{t("s1v")}</b></div>
              <div><span>{t("s2k")}</span><b>{t("s2v")}</b></div>
              <div><span>{t("s3k")}</span><b>{t("s3v")}</b></div>
            </div>

            <div className="facts">
              <div><span>{t("f1k")}</span><b>{t("f1v")}</b></div>
              <div><span>{t("f2k")}</span><b>{t("f2v")}</b></div>
              <div><span>{t("f3k")}</span><b>{t("f3v")}</b></div>
            </div>

            <section className="experience" id="experience" aria-labelledby="experience-title">
              <div className="shead">
                <h2 id="experience-title">{t("experienceTitle")}</h2>
                <p>{t("experienceIntro")}</p>
              </div>
              <ol className="timeline">
                {EXPERIENCES.map((job) => (
                  <li key={job.organization} className="timeline-row" id={job.organization === "Medsharing" ? "experience-medsharing" : job.organization === "Symbyoz" ? "experience-symbyoz" : undefined}>
                    <div className="timeline-date">{job.dates[lang]}</div>
                    <div>
                      <h3>{job.organization}</h3>
                      <p className="timeline-role">{job.role[lang]}</p>
                      <p>{job.description[lang]}</p>
                      <div className="stack">{job.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="education"><strong>{t("educationTitle")}</strong> {t("educationBody")}</p>
              <div className="herobtns">
                <Link className="btn p" href="/cv">{t("cvCta")}</Link>
                <Link className="btn s" href="/contact">{t("cta")}</Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="foot">
        <span>© 2026 Memo Labs — Full-Stack Developer</span>
        <Link href={`/${locale}/legal`}>Mentions légales</Link>
      </footer>
    </>
  );
}
