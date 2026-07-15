import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/content/islands";

type Project = {
  key: "largo" | "blueowl" | "minerva";
  name: string;
  url: string | null;
  href: string | null;
  shot: string | null;
  thumb: "t1" | "t2" | "t3";
  stack: string[];
};

const PROJECTS: Project[] = [
  { key: "largo", name: "Largo IA", url: "largo-ai.vercel.app", href: "https://largo-ai.vercel.app", shot: "/shots/largo.png", thumb: "t1", stack: ["Next.js", "React", "Tailwind", "GSAP"] },
  { key: "blueowl", name: "Blue Owl", url: "blueowl.org", href: "https://blueowl.org", shot: "/shots/blueowl.png", thumb: "t2", stack: ["Turborepo", "Next.js", "AI"] },
  { key: "minerva", name: "minerva", url: null, href: null, shot: null, thumb: "t3", stack: ["React", "Vite", "RAG"] },
];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  void (locale as Locale);

  return (
    <>
      <nav className="nav">
        <div className="wrap">
          <div className="logo">
            <span className="mark" aria-hidden />
            Guillaume Flambard
          </div>
          <div className="navlinks">
            <a href="#work">{t("nav.work")}</a>
            <a href="#about">{t("nav.about")}</a>
            <a href="#contact">{t("nav.contact")}</a>
          </div>
          <div className="navright">
            <span className="lang">
              <Link href="/" locale="fr" className={locale === "fr" ? "on" : undefined}>FR</Link>
              {" / "}
              <Link href="/" locale="en" className={locale === "en" ? "on" : undefined}>EN</Link>
            </span>
            <a className="cta" href="#contact">{t("nav.cta")}</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <p className="eyebrow"><span className="r" />{t("eyebrow")}</p>
          <h1 className="h">
            {t("h1a")} <span className="acc">{t("h1accent")}</span>
          </h1>
          <p className="lede" dangerouslySetInnerHTML={{ __html: t.raw("lede") }} />
          <div className="herobtns">
            <a className="btn p" href="#work">{t("ctaWork")} →</a>
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
            {PROJECTS.map((p) => {
              const inner = (
                <>
                  <div className={`thumb ${p.thumb}`}>
                    {p.shot ? <img src={p.shot} alt={`Aperçu du site ${p.name}`} loading="lazy" /> : p.name}
                  </div>
                  <div className="cbody">
                    <h3>{p.name} {p.href && <span className="arrow" aria-hidden>→</span>}</h3>
                    <p>{t(`project_${p.key}`)}</p>
                    <div className="stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
                    {p.url && (
                      <div className="curl"><span className="dot" aria-hidden />{p.url}<span className="arr" aria-hidden>↗</span></div>
                    )}
                  </div>
                </>
              );
              return p.href ? (
                <a key={p.key} className="card" href={p.href} target="_blank" rel="noopener noreferrer">{inner}</a>
              ) : (
                <div key={p.key} className="card">{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="sec about">
        <div className="wrap">
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
        <div className="wrap">
          <h2 dangerouslySetInnerHTML={{ __html: t.raw("contactTitle") }} />
          <p>{t("contactSub")}</p>
          <a className="btn p" href="mailto:g.flambard@gmail.com">g.flambard@gmail.com →</a>
          <div className="meta">
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/guillaume-flambard" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#">Echo Travel</a>
          </div>
        </div>
      </section>

      <footer className="foot">© 2026 Guillaume Flambard — Full-Stack Developer</footer>
    </>
  );
}
