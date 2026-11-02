import { createRouteMetadata, routeUrls } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Lang } from "@/data/caseStudies";
import { SERVICES, SERVICE_BY_SLUG } from "@/data/services";
import SiteNav from "@/components/SiteNav";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = SERVICE_BY_SLUG[slug];
  if (!service) return { robots: { index: false } };
  const lang = locale as Lang;
  return createRouteMetadata(locale, `/services/${slug}`, service.metaTitle[lang], service.metaDescription[lang]);
}

const isExternal = (href: string) => href.startsWith("http");

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = SERVICE_BY_SLUG[slug];
  if (!service) notFound();
  const lang = locale as Lang;
  const t = await getTranslations("services");
  const url = routeUrls(locale, `/services/${slug}`).canonical;
  const others = SERVICES.filter((s) => s.slug !== slug);

  // Mirrors the visible page: the service itself, its FAQ and where it sits in the site.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title[lang],
        description: service.answer[lang],
        serviceType: service.title[lang],
        provider: { "@id": "https://memolabs.dev/#person" },
        areaServed: { "@type": "Place", name: lang === "fr" ? "Monde entier, à distance" : "Worldwide, remote" },
        availableLanguage: ["fr", "en"],
        url,
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: service.faq.map((item) => ({
          "@type": "Question",
          name: item.q[lang],
          acceptedAnswer: { "@type": "Answer", text: item.a[lang] },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Memo Labs", item: routeUrls(locale).canonical },
          { "@type": "ListItem", position: 2, name: service.title[lang], item: url },
        ],
      },
    ],
  };

  return (
    <>
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="hero" id="main-content" tabIndex={-1}>
        <div className="wrap">
          <p className="eyebrow"><span className="r" />{t("eyebrow")} · {service.title[lang]}</p>
          <h1 className="h">{service.h1[lang]}</h1>
          <p className="lede">{service.answer[lang]}</p>
          <div className="herobtns">
            <Link className="btn p" href="/contact#freelance">{t("cta")}</Link>
            <a className="btn s" href="https://demos.memolabs.dev/">{t("demos")}</a>
          </div>
        </div>
      </header>

      <main className="sec">
        <div className="wrap narrow">
          <div className="ldesc">
            <h2>{t("deliverablesTitle")}</h2>
            <ul className="service-list">
              {service.deliverables.map((item) => <li key={item.en}>{item[lang]}</li>)}
            </ul>

            <h2>{t("proofTitle")}</h2>
            <ul className="service-list service-proofs">
              {service.proofs.map((proof) => (
                <li key={proof.href}>
                  {isExternal(proof.href)
                    ? <a href={proof.href}>{proof.label[lang]} <span aria-hidden="true">↗</span></a>
                    : <Link href={proof.href}>{proof.label[lang]} <span aria-hidden="true">→</span></Link>}
                </li>
              ))}
            </ul>

            <h2>{t("stackTitle")}</h2>
            <div className="stack">{service.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>

            <section className="faq" aria-labelledby="faq-title">
              <h2 id="faq-title">{t("faqTitle")}</h2>
              {service.faq.map((item) => (
                <details key={item.q.en} className="faq-item">
                  <summary>{item.q[lang]}</summary>
                  <p>{item.a[lang]}</p>
                </details>
              ))}
            </section>

            <h2>{t("otherTitle")}</h2>
            <ul className="service-list">
              {others.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.title[lang]} <span aria-hidden="true">→</span></Link></li>)}
            </ul>
          </div>
        </div>
      </main>

      <section className="end-cta" aria-labelledby="service-cta">
        <div className="wrap end-cta-inner">
          <div>
            <h2 id="service-cta">{t("closingTitle")}</h2>
            <p>{t("closingBody")}</p>
          </div>
          <Link className="btn p" href="/contact#freelance">{t("cta")}</Link>
        </div>
      </section>

      <footer className="foot">
        <span>© 2026 Memo Labs · Guillaume Flambard EI</span>
        <Link href="/legal">{lang === "fr" ? "Mentions légales" : "Legal notice"}</Link>
      </footer>
    </>
  );
}
