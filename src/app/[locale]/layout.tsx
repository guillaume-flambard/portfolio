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
  title: "Memo Labs — Full-Stack & AI Studio",
  description:
    "Memo Labs is a full-stack & AI studio that designs and ships complete products, from architecture to polished UI — its own SaaS and engineering missions.",
  openGraph: {
    title: "Memo Labs — Full-Stack & AI Studio",
    description:
      "Memo Labs is a full-stack & AI studio that designs and ships complete products, from architecture to polished UI — its own SaaS and engineering missions.",
    url: "https://memolabs.dev",
    siteName: "Memo Labs",
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "https://memolabs.dev/og.png",
        width: 1440,
        height: 900,
        alt: "Memo Labs — Full-Stack & AI Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memo Labs — Full-Stack & AI Studio",
    description:
      "Memo Labs is a full-stack & AI studio that designs and ships complete products, from architecture to polished UI.",
    images: ["https://memolabs.dev/og.png"],
  },
  alternates: {
    canonical: "https://memolabs.dev",
    languages: {
      "fr-FR": "https://memolabs.dev/fr",
      "en-US": "https://memolabs.dev/en",
    },
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
                  url: "https://memolabs.dev",
                  description:
                    "Memo Labs is a full-stack & AI studio that designs and ships complete products, from architecture to polished UI — its own SaaS and engineering missions.",
                  sameAs: [
                    "https://github.com/guillaume-flambard",
                    "https://lab.memolabs.dev",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    email: "contact@memolabs.dev",
                    contactType: "customer support",
                  },
                },
                {
                  "@type": "Person",
                  "@id": "https://memolabs.dev/#person",
                  name: "Guillaume Flambard",
                  url: "https://memolabs.dev",
                  jobTitle: "Full-Stack & AI Engineer",
                  worksFor: { "@id": "https://memolabs.dev/#org" },
                  sameAs: [
                    "https://github.com/guillaume-flambard",
                    "https://www.linkedin.com/in/guillaumeflambard/",
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
