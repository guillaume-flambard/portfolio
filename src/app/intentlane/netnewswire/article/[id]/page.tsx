import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open in NetNewsWire",
  robots: { index: false, follow: false },
};

export default async function NetNewsWireArticleFallback({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main>
      <h1>Open in NetNewsWire</h1>
      <p>
        This link identifies an article in NetNewsWire. If the app is installed,
        your device can open it there.
      </p>
      <p>Reference: {id}</p>
    </main>
  );
}
