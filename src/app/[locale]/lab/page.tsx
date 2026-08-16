import { redirect } from "next/navigation";

export default async function LabRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`https://lab.memolabs.dev/${locale}/`);
}
