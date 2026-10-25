import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Contact — Memo Labs",
  description: "Contact Memo Labs for full-stack & AI engineering missions.",
};

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

      <header className="hero">
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
            <a href="https://www.linkedin.com/in/guillaumeflambard/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/guillaume-flambard" target="_blank" rel="noopener noreferrer">GitHub</a>
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
