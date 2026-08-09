import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FEATURED } from "@/data/projects";
import SiteNav from "@/components/SiteNav";
import ProjectImage from "@/components/ProjectImage";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <>
      <SiteNav />

      <header className="hero">
        <div className="wrap">
          <p className="eyebrow"><span className="r" />{t("eyebrow")}</p>
          <h1 className="h">
            {t("h1a")} <span className="acc">{t("h1accent")}</span>
          </h1>
          <p className="lede" dangerouslySetInnerHTML={{ __html: t.raw("lede") }} />
          <div className="herobtns">
            <Link className="btn p" href="/work">{t("ctaWork")}</Link>
            <Link className="btn s" href="/contact">{t("ctaContact")}</Link>
          </div>
          <div className="chips">
            <span className="chip">{t("chip0")}</span>
            <span className="chip">{t("chip1")}</span>
            <span className="chip">{t("chip2")}</span>
          </div>
        </div>
      </header>

      <section id="work" className="sec">
        <div className="wrap">
          <div className="shead">
            <h2 className="display">{t("workTitle")}</h2>
            <p>{t("workSub")}</p>
          </div>
          <div className="grid">
            {FEATURED.map((p) => (
              <Link key={p.slug} className="card" href={`/work/${p.slug}`}>
                <div className={`thumb ${p.thumb}`}>
                  {p.gallery[0] ? <ProjectImage src={p.gallery[0]} alt={`Aperçu du site ${p.name}`} /> : p.name}
                </div>
                <div className="cbody">
                  <h3>{p.name} <span className="arrow" aria-hidden>→</span></h3>
                  <p>{p.tagline[locale as "fr" | "en"]}</p>
                  <div className="stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
                  {p.status !== "offline" && p.links[0] && (
                    <div className="curl"><span className="dot" aria-hidden />{p.links[0].url.replace(/^https?:\/\//, "").replace(/\/$/, "")}<span className="arr" aria-hidden>↗</span></div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <Link className="btn s maplink" href="/work">{t("workLibrary")}</Link>
        </div>
      </section>

      <footer className="foot">
        <span>© 2026 Memo Labs — Full-Stack Developer</span>
        <Link href={`/${locale}/legal`}>Mentions légales</Link>
      </footer>
    </>
  );
}
