import { PUBLIC_LINKS } from "@/data/publicLinks";
import { createRouteMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import SiteNav from "@/components/SiteNav";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [title, description] = locale === "fr"
    ? ["Contact — Freelance et recrutement remote | Memo Labs","Contacter Guillaume Flambard pour des missions freelance React/TypeScript ou des postes full-stack remote."]
    : ["Contact — Freelance and remote hiring | Memo Labs","Contact Guillaume Flambard about remote React/TypeScript freelance projects or full-stack hiring opportunities."];
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
            <div className="contact-track">
              <h2>{t("freelanceTitle")}</h2>
              <p>{t("freelanceBody")}</p>
              <a className="btn p" href={`mailto:${t("email")}?subject=${encodeURIComponent(t("freelanceSubject"))}`}>{t("freelanceCta")}</a>
            </div>
            <div className="contact-track">
              <h2>{t("jobTitle")}</h2>
              <p>{t("jobBody")}</p>
              <a className="btn p" href={`mailto:${t("email")}?subject=${encodeURIComponent(t("jobSubject"))}`}>{t("jobCta")}</a>
            </div>
          </div>
          <p className="contact-direct"><a href={`mailto:${t("email")}`}>{t("email")}</a></p>
          <div className="meta">
            <a href={PUBLIC_LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={PUBLIC_LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={`https://lab.memolabs.dev/${locale}/`} target="_blank" rel="noopener noreferrer">The Lab</a>
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
