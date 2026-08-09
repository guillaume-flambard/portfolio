import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // AI search engines & answer engines — authorized (Memo Labs wants citations)
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot"],
        allow: "/",
      },
    ],
    sitemap: "https://memolabs.dev/sitemap.xml",
  };
}
