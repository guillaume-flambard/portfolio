import { createRouteMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [title, description] = locale === "fr"
    ? ["Mentions légales | Memo Labs","Mentions légales et contact du site Memo Labs."]
    : ["Legal notice | Memo Labs","Legal notice and website contact information for Memo Labs."];
  return createRouteMetadata(locale, "/legal", title, description);
}


export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <>
      <SiteNav />

      <header className="hero">
        <div className="wrap">
          <p className="eyebrow"><span className="r" />{t("eyebrow")}</p>
          <h1 className="h">{t("title")}</h1>
        </div>
      </header>

      <main className="sec">
        <div className="wrap narrow">
          <div className="ldesc">
            <h2>{t("editorTitle")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t.raw("editor") }} />
            <p dangerouslySetInnerHTML={{ __html: t.raw("siren") }} />

            <h2>{t("hostTitle")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t.raw("host") }} />

            <h2>{t("contactTitle")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t.raw("contact") }} />
          </div>
        </div>
      </main>

      <footer className="foot">
        <span>© 2026 Memo Labs — Full-Stack Developer</span>
      </footer>
    </>
  );
}
