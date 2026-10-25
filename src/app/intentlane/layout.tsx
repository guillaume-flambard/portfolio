/**
 * Independent root layout for universal-link fallback routes.
 *
 * Next.js requires a root layout for every top-level App Router branch.
 * The localized portfolio lives under /[locale]/layout.tsx; /intentlane
 * deliberately bypasses next-intl in src/middleware.ts.
 */
export default function IntentlaneLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#f7f5f1",
          color: "#22201e",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          padding: "clamp(24px, 6vw, 64px)",
          lineHeight: 1.6,
        }}
      >
        {children}
      </body>
    </html>
  );
}
