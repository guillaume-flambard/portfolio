import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Lang } from "@/data/caseStudies";
import { EXPERIENCES } from "@/data/experience";
import SiteNav from "@/components/SiteNav";
import GithubActivity from "@/components/GithubActivity";

export const revalidate = 3600;

const DEMOS_URL = "https://demos.memolabs.dev/";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [title, description] = locale === "fr"
    ? ["Guillaume Flambard · Développeur full-stack TypeScript freelance", "Je renforce agences et équipes produit sur React, les API et l’automatisation n8n, entièrement à distance. Parcours : Medsharing, Symbyoz, Echo Travel et Blue Owl (CTO), Data for Good. 26 démos en ligne."]
    : ["Guillaume Flambard · Freelance full-stack TypeScript developer", "I back agencies and product teams on React, APIs and n8n automation, fully remote. Track record: Medsharing, Symbyoz, Echo Travel and Blue Owl (CTO), Data for Good. 26 live demos."];
  return createRouteMetadata(locale, "", title, description);
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const t = await getTranslations("home");

  return (
    <>
      <SiteNav />

      <header className="hero hero-home" id="main-content" tabIndex={-1}>
        <div className="wrap">
          <p className="eyebrow"><span className="r" />{t("eyebrow")}</p>
          <h1 className="h">
            {t("h1a")} <span className="acc">{t("h1accent")}</span>
          </h1>
          <p className="lede">{t("lede")}</p>
          <p className="hero-identity">{t("identity")}</p>
          <div className="herobtns hero-actions">
            <Link className="btn p" href="/contact#freelance">{t("ctaContact")}</Link>
            <a className="btn s" href={DEMOS_URL}>{t("ctaDemos")}</a>
            <Link className="btn s" href="/cv">{t("ctaAbout")}</Link>
          </div>
          <dl className="hero-facts">
            <div>
              <dt>{t("proofLabel")}</dt>
              <dd className="hero-evidence-links">
                <Link href="/about#experience-medsharing">Medsharing</Link>
                <span aria-hidden="true">·</span>
                <Link href="/work/echo-travel">Echo Travel</Link>
                <span aria-hidden="true">·</span>
                <Link href="/work/blueowl">Blue Owl</Link>
                <span aria-hidden="true">·</span>
                <Link href="/about">{t("proofD4G")}</Link>
              </dd>
            </div>
            <div><dt>{t("availabilityLabel")}</dt><dd><Link className="hero-recruiter-link" href="/contact#recruitment">{t("availabilityValue")} <span aria-hidden="true">↗</span></Link></dd></div>
          </dl>
        </div>
      </header>

      <section className="focus-section" aria-labelledby="focus-heading">
        <div className="wrap">
          <div className="shead">
            <h2 id="focus-heading">{t("servicesTitle")}</h2>
            <p>{t("servicesIntro")}</p>
          </div>
          <ol className="focus-grid">
            <li>
              <span className="focus-number" aria-hidden="true">01</span>
              <h3>{t("service1Title")}</h3>
              <p>{t("service1Body")}</p>
              <p className="focus-evidence"><Link href="/about#experience-medsharing">{t("service1Evidence")} <span aria-hidden="true">↗</span></Link></p>
            </li>
            <li>
              <span className="focus-number" aria-hidden="true">02</span>
              <h3>{t("service2Title")}</h3>
              <p>{t("service2Body")}</p>
              <p className="focus-evidence"><Link href="/work/echo-travel">{t("service2Evidence")} <span aria-hidden="true">↗</span></Link></p>
            </li>
            <li>
              <span className="focus-number" aria-hidden="true">03</span>
              <h3>{t("service3Title")}</h3>
              <p>{t("service3Body")}</p>
              <p className="focus-evidence"><a href={DEMOS_URL}>{t("service3Evidence")} <span aria-hidden="true">↗</span></a></p>
            </li>
          </ol>
        </div>
      </section>

      <section className="end-cta" aria-labelledby="demos-heading">
        <div className="wrap end-cta-inner">
          <div>
            <h2 id="demos-heading">{t("demosTitle")}</h2>
            <p>{t("demosBody")}</p>
          </div>
          <a className="btn p" href={DEMOS_URL}>{t("demosCta")}</a>
        </div>
      </section>

      <section id="projects" className="sec featured-section" aria-labelledby="projects-heading">
        <div className="wrap">
          <div className="shead">
            <h2 id="projects-heading" className="display">{t("workTitle")}</h2>
            <p>{t("workSub")}</p>
          </div>
          <div className="ldesc">
            <section className="experience" aria-label={t("workTitle")}>
              <ol className="timeline">
                {EXPERIENCES.filter((job) => job.organization !== "Adriver Group").map((job) => (
                  <li key={job.organization} className="timeline-row">
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
            </section>
          </div>
          <div className="herobtns">
            <Link className="btn s" href="/cv">{t("ctaAbout")}</Link>
            <Link className="btn s" href="/work">{t("workLibrary")}</Link>
          </div>
          <p><Link className="hero-inline-link" href="/open-source">{t("ctaWork")}</Link></p>
        </div>
      </section>

      <GithubActivity locale={lang} />

      <section className="end-cta" aria-labelledby="end-cta-title">
        <div className="wrap end-cta-inner">
          <div>
            <h2 id="end-cta-title">{t("closingTitle")}</h2>
            <p>{t("closingBody")}</p>
          </div>
          <Link className="btn p" href="/contact#freelance">{t("closingCta")}</Link>
        </div>
      </section>

      <footer className="foot">
        <span>{t("footer")}</span>
        <Link href="/legal">{t("legalLink")}</Link>
      </footer>
    </>
  );
}
