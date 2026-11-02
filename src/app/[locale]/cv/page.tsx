import { PUBLIC_LINKS } from "@/data/publicLinks";
import { createRouteMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import SiteNav from "@/components/SiteNav";
import PrintCvButton from "@/components/PrintCvButton";
import { Link } from "@/i18n/navigation";
import { EXPERIENCES } from "@/data/experience";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [title, description] = locale === "fr"
    ? ["CV · Guillaume Flambard | Développeur full-stack, IA et automatisation","CV de Guillaume Flambard, développeur full-stack freelance IA et automatisation : CTO d’Echo Travel et de Blue Owl, React, Vue, Laravel, Symfony, .NET, n8n."]
    : ["Resume · Guillaume Flambard | Full-stack developer, AI and automation","Resume of Guillaume Flambard, freelance full-stack developer for AI and automation: CTO at Echo Travel and Blue Owl, React, Vue, Laravel, Symfony, .NET, n8n."];
  return createRouteMetadata(locale, "/cv", title, description);
}


export default async function CvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cv");
  const lang = locale as "fr" | "en";

  return (
    <>
      <div className="print-hide"><SiteNav /></div>
      <main className="resume wrap" id="main-content" tabIndex={-1}>
        <header className="resume-head">
          <p className="eyebrow print-hide"><span className="r" />{t("eyebrow")}</p>
          <h1>Guillaume Flambard</h1>
          <p className="resume-role">{t("role")}</p>
          <p className="resume-intro">{t("intro")}</p>
          <p className="resume-links">
            <a href="mailto:contact@memolabs.dev">contact@memolabs.dev</a>
            <span aria-hidden="true">·</span>
            <a href={PUBLIC_LINKS.github}>GitHub</a>
            <span aria-hidden="true">·</span>
            <a href={PUBLIC_LINKS.linkedin}>LinkedIn</a>
            <span aria-hidden="true">·</span>
            <a href="https://memolabs.dev">memolabs.dev</a>
          </p>
          <div className="herobtns print-hide">
            <PrintCvButton label={t("print")} />
            <Link className="btn s" href="/contact">{t("contact")}</Link>
          </div>
          <p className="resume-print-hint print-hide">{t("printHint")}</p>
        </header>

        <section className="resume-section" aria-labelledby="resume-stack">
          <h2 id="resume-stack">{t("stackTitle")}</h2>
          <p>{t("stack")}</p>
        </section>

        <section className="resume-section" aria-labelledby="resume-experience">
          <h2 id="resume-experience">{t("experienceTitle")}</h2>
          <ol className="timeline">
            {EXPERIENCES.map((job) => (
              <li key={job.organization} className="timeline-row">
                <p className="timeline-date">{job.dates[lang]}</p>
                <div>
                  <h3>{job.organization}</h3>
                  <p className="timeline-role">{job.role[lang]}</p>
                  <p>{job.description[lang]}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="resume-section" aria-labelledby="resume-projects">
          <h2 id="resume-projects">{t("projectsTitle")}</h2>
          <p>{t("projects")}</p>
          <div className="resume-links print-hide">
            <Link href="/work/emargo">Émargo</Link>
            <Link href="/work/largo">Largo IA</Link>
            <Link href="/work/echo-travel">Echo Travel</Link>
          </div>
        </section>

        <section className="resume-section" aria-labelledby="resume-education">
          <h2 id="resume-education">{t("educationTitle")}</h2>
          <p>{t("education")}</p>
          <p>{t("languages")}</p>
        </section>
      </main>
      <footer className="foot print-hide">
        <Link href="/about">{t("about")}</Link>
      </footer>
    </>
  );
}
