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
          <a className="btn p" href={`mailto:${t("email")}`}>{t("email")}</a>
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
