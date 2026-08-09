import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import LabGrid, { type LabProject } from "@/components/LabGrid";
import projectsData from "../../../../public/projects.json";

export const metadata: Metadata = {
  title: "Memo Labs · Lab",
  description: "Memo Labs playground — WIP demos, prototypes and experiments.",
};

const projects = projectsData as LabProject[];

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("lab");

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
        </div>
      </header>

      <main>
        <LabGrid projects={projects} />
      </main>

      <footer className="foot">© 2026 Memo Labs — Full-Stack Developer</footer>
    </>
  );
}
