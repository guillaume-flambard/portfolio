import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CASE_PROJECTS } from "@/data/projectNavigation";
import { CASE_BY_SLUG } from "@/data/caseStudies";
import type { Lang } from "@/data/caseStudies";
import { HOME_FAQ, SERVICES } from "@/data/services";
import SiteNav from "@/components/SiteNav";

export const revalidate = 3600;

const DEMOS_URL = "https://demos.memolabs.dev/";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [title, description] = locale === "fr"
    ? ["Développeur freelance pour agences et entreprises | Guillaume Flambard", "Automatisation, intégrations et applications web. Guillaume Flambard accompagne agences et équipes produit, du cadrage au déploiement, à distance."]
    : ["Freelance developer for agencies and businesses | Guillaume Flambard", "Automation, integrations and web applications. Guillaume Flambard works with agencies and product teams, from scope to deployment, remotely."];
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
            <a className="btn s" href="#examples">{t("ctaDemos")}</a>
          </div>
          <dl className="hero-facts">
            <div>
              <dt>{t("proofLabel")}</dt>
              <dd className="hero-evidence-links">
                {CASE_PROJECTS.map((project) => <Link key={project.slug} href={`/work/${project.slug}`}>{project.name}</Link>)}
              </dd>
            </div>
            <div><dt>{t("availabilityLabel")}</dt><dd>{t("availabilityValue")}</dd></div>
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
              <h3>{t("service3Title")}</h3>
              <p>{t("service3Body")}</p>
              <p className="focus-evidence"><Link href="/work/medsharing">{t("service3Evidence")} <span aria-hidden="true">↗</span></Link></p>
              <p className="focus-more"><Link href="/services/web-development">{t("serviceMore")} <span aria-hidden="true">→</span></Link></p>
            </li>
            <li>
              <h3>{t("service2Title")}</h3>
              <p>{t("service2Body")}</p>
              <p className="focus-evidence"><a href="https://demos.memolabs.dev/partenaire-automation/">{t("service2Evidence")} <span aria-hidden="true">↗</span></a></p>
              <p className="focus-more"><Link href="/services/automation-n8n">{t("serviceMore")} <span aria-hidden="true">→</span></Link></p>
            </li>
            <li>
              <h3>{t("service1Title")}</h3>
              <p>{t("service1Body")}</p>
              <p className="focus-evidence"><Link href="/work/blueowl">{t("service1Evidence")} <span aria-hidden="true">↗</span></Link></p>
              <p className="focus-more"><Link href="/services/ai-integration">{t("serviceMore")} <span aria-hidden="true">→</span></Link></p>
            </li>
          </ol>
        </div>
      </section>

      <section id="examples" className="sec client-examples" aria-labelledby="examples-heading">
        <div className="wrap">
          <div className="shead">
            <h2 id="examples-heading">{t("examplesTitle")}</h2>
            <p>{t("examplesIntro")}</p>
          </div>
          <div className="client-example-list">
            {CASE_PROJECTS.map((project) => {
              const study = CASE_BY_SLUG[project.slug];
              return <article className="client-example" key={project.slug}>
                <div><p className="client-example-context">{project.name} · {study.role[lang]}</p><h3>{study.need?.[lang]}</h3></div>
                <div><p>{study.preview[lang]}</p><Link href={`/work/${project.slug}`}>{t("readCase", { name: project.name })}</Link></div>
              </article>;
            })}
          </div>
          <p className="client-more"><a href={DEMOS_URL}>{t("demosCta")}</a> · <Link href="/work">{t("workLibrary")}</Link></p>
        </div>
      </section>

      <section className="focus-section client-process" aria-labelledby="process-heading">
        <div className="wrap">
          <div className="shead"><h2 id="process-heading">{t("processTitle")}</h2><p>{t("processIntro")}</p></div>
          <ol className="focus-grid">
            {[1, 2, 3].map((step) => <li key={step}><span className="focus-number" aria-hidden="true">0{step}</span><h3>{t(`step${step}Title`)}</h3><p>{t(`step${step}Body`)}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="sec faq-section" aria-labelledby="faq-heading">
        <div className="wrap narrow">
          <div className="shead">
            <h2 id="faq-heading">{t("faqTitle")}</h2>
          </div>
          <div className="faq">
            {HOME_FAQ.map((item) => (
              <details key={item.q.en} className="faq-item">
                <summary>{item.q[lang]}</summary>
                <p>{item.a[lang]}</p>
              </details>
            ))}
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "FAQPage",
                  mainEntity: HOME_FAQ.map((item) => ({
                    "@type": "Question",
                    name: item.q[lang],
                    acceptedAnswer: { "@type": "Answer", text: item.a[lang] },
                  })),
                },
                {
                  "@type": "OfferCatalog",
                  name: lang === "fr" ? "Services freelance" : "Freelance services",
                  itemListElement: SERVICES.map((service) => ({
                    "@type": "Offer",
                    itemOffered: { "@type": "Service", name: service.title[lang], description: service.answer[lang], provider: { "@id": "https://memolabs.dev/#person" } },
                  })),
                },
              ],
            }),
          }}
        />
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

      <section id="github-activity" className="client-background" aria-labelledby="background-heading">
        <div className="wrap">
          <h2 id="background-heading">{t("backgroundTitle")}</h2>
          <p><Link href="/about">{t("backgroundAbout")}</Link> · <Link href="/cv">{t("ctaAbout")}</Link> · <Link href="/open-source">{t("ctaWork")}</Link> · <a href={`https://lab.memolabs.dev/${locale}/`}>{t("nav.lab")}</a></p>
          <p><Link className="hero-recruiter-link" href="/contact#recruitment">{t("recruitmentLink")}</Link></p>
        </div>
      </section>

      <footer className="foot">
        <span>{t("footer")}</span>
        <Link href="/legal">{t("legalLink")}</Link>
      </footer>
    </>
  );
}
