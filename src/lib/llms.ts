import { EXPERIENCES } from "@/data/experience";
import { HOME_FAQ, SERVICES } from "@/data/services";
import { CASE_PROJECTS } from "@/data/projectNavigation";
import { CASE_BY_SLUG } from "@/data/caseStudies";
import { PUBLIC_LINKS } from "@/data/publicLinks";

/**
 * llms.txt and llms-full.txt are written from the same data as the pages, in English
 * (the language answer engines quote most), so they can never drift from the site.
 */
const SITE = "https://memolabs.dev";

function header(): string[] {
  return [
    "# Guillaume Flambard · Memo Labs",
    "",
    "> Guillaume Flambard is a freelance full-stack developer who builds AI and automation into web products, on the stack teams already run: React, Next.js, Vue, Laravel, Symfony, .NET, n8n. He works fully remote, for agencies (white-label included) and product teams, in French and English. Memo Labs is the name of his independent practice (sole proprietorship, France).",
    "",
    "## Contact",
    "",
    `- Freelance inquiries: ${SITE}/en/contact#freelance`,
    "- Email: contact@memolabs.dev",
    `- LinkedIn: ${PUBLIC_LINKS.linkedin}`,
    `- LinkedIn page: ${PUBLIC_LINKS.linkedinCompany}`,
    `- GitHub: ${PUBLIC_LINKS.github}`,
    "- Live demos: https://demos.memolabs.dev/",
    "",
    "## Services",
    "",
    ...SERVICES.map((s) => `- [${s.title.en}](${SITE}/en/services/${s.slug}): ${s.answer.en}`),
    "",
    "## Case studies",
    "",
    ...CASE_PROJECTS.map((p) => `- [${p.name}](${SITE}/en/work/${p.slug}): ${CASE_BY_SLUG[p.slug]?.preview.en ?? p.tagline.en}`),
    "",
    "## Other pages",
    "",
    `- [About and experience](${SITE}/en/about)`,
    `- [Resume](${SITE}/en/cv)`,
    `- [Open-source contributions](${SITE}/en/open-source)`,
    `- [French version](${SITE}/fr)`,
  ];
}

export function llmsTxt(): string {
  return header().join("\n") + "\n";
}

export function llmsFullTxt(): string {
  const lines = header();
  lines.push("", "## Experience", "");
  for (const job of EXPERIENCES) {
    lines.push(`### ${job.organization} · ${job.role.en} (${job.dates.en})`, "", job.description.en, "", `Technologies: ${job.technologies.join(", ")}`, "");
  }
  for (const s of SERVICES) {
    lines.push(`## ${s.title.en}`, "", s.answer.en, "", "Deliverables:", ...s.deliverables.map((d) => `- ${d.en}`), "");
    lines.push("Evidence:", ...s.proofs.map((p) => `- ${p.label.en}`), "", `Stack: ${s.stack.join(", ")}`, "");
    for (const item of s.faq) lines.push(`**${item.q.en}** ${item.a.en}`, "");
  }
  lines.push("## Frequently asked questions", "");
  for (const item of HOME_FAQ) lines.push(`**${item.q.en}** ${item.a.en}`, "");
  return lines.join("\n");
}
