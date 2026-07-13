import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function SkipToList() {
  const t = await getTranslations("nav");

  return (
    <Link
      href="/list"
      className="font-mono fixed top-2 left-2 z-50 rounded-sm border border-[var(--ink)] bg-[var(--paper)] px-3 py-2 text-xs text-[var(--ink)] underline decoration-[var(--beacon)] decoration-2 underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beacon)]"
    >
      {t("skipToList")}
    </Link>
  );
}
