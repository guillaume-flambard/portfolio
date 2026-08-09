import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FEATURED } from "@/data/projects";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Work — Memo Labs",
  description:
    "The Memo Labs products in production — Largo, Blue Owl, PayKit and more, with live links and details.",
};

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const lang = locale as "fr" | "en";

  return (
    <>
      <SiteNav />

      <header className="hero">
        <div className="wrap">
          <p className="eyebrow"><span className="r" />{t("title")}</p>
          <h1 className="h">{t("title")}</h1>
          <p className="lede">{t("subtitle")}</p>
        </div>
      </header>

      <main className="sec">
        <div className="wrap">
          <div className="grid">
            {FEATURED.map((p) => (
              <Link key={p.slug} className="card" href={`/work/${p.slug}`}>
                <div className={`thumb ${p.thumb}`}>
                  {p.gallery[0] ? <img src={p.gallery[0]} alt={`Aperçu du site ${p.name}`} loading="lazy" /> : p.name}
                </div>
                <div className="cbody">
                  <h3>{p.name} <span className="arrow" aria-hidden>→</span></h3>
                  <p>{p.tagline[lang]}</p>
                  <div className="stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
                  {p.status !== "offline" && p.links[0] && (
                    <div className="curl"><span className="dot" aria-hidden />{p.links[0].url.replace(/^https?:\/\//, "").replace(/\/$/, "")}<span className="arr" aria-hidden>↗</span></div>
                  )}
                </div>
              </Link>
            ))}
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
