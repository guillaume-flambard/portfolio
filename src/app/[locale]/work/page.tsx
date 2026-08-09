import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MAP } from "@/data/projects";
import SiteNav from "@/components/SiteNav";

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
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
          {MAP.map((group) => (
            <section key={group.key} className="mgroup">
              <h2 className="mgrouptitle">{t(`category_${group.key}` as never)}</h2>
              <div className="mlist">
                {group.items.map((p) => (
                  <div key={p.slug} className="mrow">
                    <div className="mrow-name">
                      {p.links[0] ? (
                        <a href={p.links[0].url} target="_blank" rel="noopener noreferrer">{p.name}</a>
                      ) : (
                        <span>{p.name}</span>
                      )}
                    </div>
                    <p className="mrow-tag">{p.tagline[lang]}</p>
                    <div className="mrow-meta">
                      <span className={`status s-${p.status}`}>{t(`status_${p.status}` as never)}</span>
                      <span className="mrow-stack">{p.stack.join(" · ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="foot">© 2026 Memo Labs — Full-Stack Developer</footer>
    </>
  );
}
