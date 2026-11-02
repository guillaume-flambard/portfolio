import { PUBLIC_LINKS } from "@/data/publicLinks";
import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Backdrop from "@/components/Backdrop";
import "../globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Guillaume Flambard · Full-stack developer, AI and automation",
  description:
    "Guillaume Flambard builds AI and automation into web products, on the stack teams already run: React, Vue, Laravel, Symfony, .NET. Available for remote freelance work and open to remote roles.",
  openGraph: {
    title: "Guillaume Flambard · Full-stack developer, AI and automation",
    description:
      "Guillaume Flambard builds AI and automation into web products, on the stack teams already run: React, Vue, Laravel, Symfony, .NET. Available for remote freelance work and open to remote roles.",
    url: "https://memolabs.dev",
    siteName: "Memo Labs",
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "https://memolabs.dev/og-fr.png",
        width: 1200,
        height: 630,
        alt: "Guillaume Flambard · Full-stack developer, AI and automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guillaume Flambard · Full-stack developer, AI and automation",
    description:
      "AI and automation built into web products, on React, Vue, Laravel, Symfony or .NET. Guillaume Flambard is available for remote freelance work and remote roles.",
    images: ["https://memolabs.dev/og-fr.png"],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={oswald.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://memolabs.dev/#org",
                  name: "Memo Labs",
                  founder: { "@id": "https://memolabs.dev/#person" },
                  url: "https://memolabs.dev",
                  description:
                    "Guillaume Flambard builds AI and automation into web products, on the stack teams already run: React, Vue, Laravel, Symfony, .NET. Available for remote freelance work and open to remote roles.",
                  sameAs: [
                    PUBLIC_LINKS.linkedinCompany,
                    PUBLIC_LINKS.github,
                    "https://lab.memolabs.dev",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    email: "contact@memolabs.dev",
                    contactType: "business inquiries",
                  },
                },
                {
                  "@type": "Person",
                  "@id": "https://memolabs.dev/#person",
                  name: "Guillaume Flambard",
                  url: "https://memolabs.dev",
                  jobTitle: "Full-stack developer, AI and automation",
                  description:
                    "Freelance full-stack developer who builds AI features, AI agents and n8n automations into web products. Former CTO at Echo Travel and Blue Owl.",
                  knowsAbout: [
                    "AI integration", "AI agents", "Large language models", "n8n", "Workflow automation",
                    "TypeScript", "React", "Next.js", "Vue.js", "PHP", "Laravel", "Symfony", ".NET", "Bootstrap", "Docker",
                  ],
                  knowsLanguage: ["fr", "en"],
                  worksFor: { "@id": "https://memolabs.dev/#org" },
                  sameAs: [
                    PUBLIC_LINKS.github,
                    PUBLIC_LINKS.linkedin,
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://memolabs.dev/#website",
                  name: "Memo Labs",
                  url: "https://memolabs.dev",
                  publisher: { "@id": "https://memolabs.dev/#org" },
                  inLanguage: ["fr", "en"],
                },
              ],
            }),
          }}
        />
        <Backdrop />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
