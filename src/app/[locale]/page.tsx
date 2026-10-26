import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CASE_PROJECTS } from "@/data/projectNavigation";
import { CASE_BY_SLUG, type Lang } from "@/data/caseStudies";
import SiteNav from "@/components/SiteNav";
import ProjectImage from "@/components/ProjectImage";
import GithubActivity from "@/components/GithubActivity";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [title, description] = locale === "fr"
    ? ["Guillaume Flambard — Product engineer React & TypeScript", "Du prototype au produit : ingénierie React et TypeScript, applications utilisables, livraisons et contributions open source vérifiables sur GitHub."]
    : ["Guillaume Flambard — React & TypeScript product engineer", "From prototype to working software: React and TypeScript engineering, shipped projects and verifiable open-source contributions on GitHub."];
  return createRouteMetadata(locale, "", title, description);
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const t = await getTranslations("home");
  const workText = await getTranslations("work");
  const caseProjects = CASE_PROJECTS;

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
            <Link className="btn s" href="/cv">{t("ctaAbout")}</Link>
            <Link className="hero-inline-link" href="#github-activity">{t("ctaWork")}</Link>
          </div>
          <dl className="hero-facts">
            <div>
              <dt>{t("proofLabel")}</dt>
              <dd className="hero-evidence-links">
                <Link href="/about#experience-medsharing">Medsharing</Link>
                <span aria-hidden="true">·</span>
                <Link href="/work/echo-travel">Echo Travel</Link>
                <span aria-hidden="true">·</span>
                <Link href="/about#experience-symbyoz">Symbyoz</Link>
              </dd>
            </div>
            <div><dt>{t("availabilityLabel")}</dt><dd><Link className="hero-recruiter-link" href="/contact#recruitment">{t("availabilityValue")} <span aria-hidden="true">↗</span></Link></dd></div>
          </dl>
        </div>
      </header>

      <GithubActivity locale={lang} />

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
              <p className="focus-evidence"><Link href="/work/paykit">{t("service3Evidence")} <span aria-hidden="true">↗</span></Link></p>
            </li>
          </ol>
        </div>
      </section>

      <section id="projects" className="sec featured-section" aria-labelledby="projects-heading">
        <div className="wrap">
          <div className="shead">
            <h2 id="projects-heading" className="display">{t("workTitle")}</h2>
            <p>{t("workSub")}</p>
          </div>
          <div className="grid">
            {caseProjects.map((p) => {
              const study = CASE_BY_SLUG[p.slug];
              return (
                <Link key={p.slug} className="card" href={`/work/${p.slug}`}>
                  <div className={`thumb ${p.thumb}`}>
                    {p.gallery[0] ? <ProjectImage src={p.gallery[0]} alt={`${p.name} — ${study.preview[lang]}`} /> : p.name}
                  </div>
                  <div className="cbody">
                    <h3>{p.name} <span className="arrow" aria-hidden>→</span></h3>
                    <p>{study.preview[lang]}</p>
                    <p className="card-role"><strong>{t("cardRoleLabel")} :</strong> {study.role[lang]}</p>
                    <p className="card-proof" aria-label={workText("proofShort")}>{workText(`kind_${p.verification.kind}` as never)} · {workText(`proof_${p.verification.proof}` as never)}</p>
                    <div className="stack">{p.stack.map((technology) => <span key={technology}>{technology}</span>)}</div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link className="btn s maplink" href="/work">{t("workLibrary")}</Link>
        </div>
      </section>

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
        <span>© 2026 Memo Labs — Full-Stack Developer</span>
        <Link href="/legal">{locale === "fr" ? "Mentions légales" : "Legal notice"}</Link>
      </footer>
    </>
  );
}
