import { PUBLIC_LINKS } from "@/data/publicLinks";
import { createRouteMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import SiteNav from "@/components/SiteNav";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [title, description] = locale === "fr"
    ? ["Contacter un développeur freelance IA et full-stack | Guillaume Flambard","Une mission d’intégration IA, d’automatisation n8n ou de développement web ? Écrivez à Guillaume Flambard, freelance à distance. Réponse directe."]
    : ["Hire a freelance AI and full-stack developer | Guillaume Flambard","An AI integration, n8n automation or web development project? Write to Guillaume Flambard, remote freelancer. Direct reply."];
  return createRouteMetadata(locale, "/contact", title, description);
}


export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <SiteNav />

      <header className="hero" id="main-content" tabIndex={-1}>
        <div className="wrap">
          <p className="eyebrow"><span className="r" />{t("eyebrow")}</p>
          <h1 className="h" dangerouslySetInnerHTML={{ __html: t.raw("title") }} />
          <p className="lede">{t("sub")}</p>
        </div>
      </header>

      <main className="sec contact">
        <div className="wrap narrow">
          <div className="contact-tracks">
            <section className="contact-track" id="freelance" aria-labelledby="freelance-title">
              <h2 id="freelance-title">{t("freelanceTitle")}</h2>
              <p>{t("freelanceBody")}</p>
              <details className="contact-choice">
                <summary className="btn p">{t("freelanceCta")}</summary>
                <div className="contact-choice-panel">
                  <p className="contact-choice-intro">{t("contactOptionsIntro")}</p>
                  <p className="contact-choice-address">{t("email")}</p>
                  <div className="contact-choice-links">
                    <a href={`mailto:${t("email")}?subject=${encodeURIComponent(t("freelanceSubject"))}`}>{t("contactEmailApp")}</a>
                    <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t("email"))}&su=${encodeURIComponent(t("freelanceSubject"))}`} target="_blank" rel="noopener noreferrer">{t("contactGmail")}</a>
                    <a href={`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(t("email"))}&subject=${encodeURIComponent(t("freelanceSubject"))}`} target="_blank" rel="noopener noreferrer">{t("contactOutlook")}</a>
                  </div>
                </div>
              </details>
            </section>
            <section className="contact-track" id="recruitment" aria-labelledby="recruitment-title">
              <h2 id="recruitment-title">{t("jobTitle")}</h2>
              <p>{t("jobBody")}</p>
              <details className="contact-choice">
                <summary className="btn p">{t("jobCta")}</summary>
                <div className="contact-choice-panel">
                  <p className="contact-choice-intro">{t("contactOptionsIntro")}</p>
                  <p className="contact-choice-address">{t("email")}</p>
                  <div className="contact-choice-links">
                    <a href={`mailto:${t("email")}?subject=${encodeURIComponent(t("jobSubject"))}`}>{t("contactEmailApp")}</a>
                    <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t("email"))}&su=${encodeURIComponent(t("jobSubject"))}`} target="_blank" rel="noopener noreferrer">{t("contactGmail")}</a>
                    <a href={`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(t("email"))}&subject=${encodeURIComponent(t("jobSubject"))}`} target="_blank" rel="noopener noreferrer">{t("contactOutlook")}</a>
                  </div>
                </div>
              </details>
            </section>
          </div>
          <p className="contact-direct"><a href={`mailto:${t("email")}`}>{t("email")}</a></p>
          <div className="meta">
            <a href={PUBLIC_LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={PUBLIC_LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={`https://lab.memolabs.dev/${locale}/`}>The Lab</a>
          </div>
        </div>
      </main>

      <footer className="foot">
        <span>© 2026 Memo Labs · Guillaume Flambard EI</span>
        <Link href="/legal">{locale === "fr" ? "Mentions légales" : "Legal notice"}</Link>
      </footer>
    </>
  );
}
