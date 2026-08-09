import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FEATURED } from "@/data/projects";
import SiteNav from "@/components/SiteNav";

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
            <a className="btn p" href="#work">{t("ctaWork")}</a>
            <a className="btn s" href="#contact">{t("ctaContact")}</a>
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
                  {p.gallery[0] ? <img src={p.gallery[0]} alt={`Aperçu du site ${p.name}`} loading="lazy" /> : p.name}
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

      <section id="about" className="sec about">
        <div className="wrap narrow">
          <div className="cols">
            <div>
              <h2 dangerouslySetInnerHTML={{ __html: t.raw("aboutTitle") }} />
            </div>
            <div className="body">
              <p dangerouslySetInnerHTML={{ __html: t.raw("aboutP1") }} />
              <p dangerouslySetInnerHTML={{ __html: t.raw("aboutP2") }} />
              <div className="facts">
                <div><span>{t("f1k")}</span><b>{t("f1v")}</b></div>
                <div><span>{t("f2k")}</span><b>{t("f2v")}</b></div>
                <div><span>{t("f3k")}</span><b>{t("f3v")}</b></div>
                <div><span>{t("f4k")}</span><b>FR · EN</b></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="sec contact">
        <div className="wrap narrow">
          <h2 dangerouslySetInnerHTML={{ __html: t.raw("contactTitle") }} />
          <p>{t("contactSub")}</p>
          <a className="btn p" href="mailto:g.flambard@gmail.com">g.flambard@gmail.com</a>
          <div className="meta">
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/guillaume-flambard" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#">Echo Travel</a>
          </div>
        </div>
      </section>

      <footer className="foot">© 2026 Memo Labs — Full-Stack Developer</footer>
    </>
  );
}
