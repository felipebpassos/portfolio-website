import { notFound } from "next/navigation";

import Shell from "@/components/Shell";
import { getContent } from "@/content";
import { hasLocale } from "@/content/locales";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  // Resolvido aqui, no servidor: o cliente recebe só o idioma pedido.
  return <Shell content={getContent(lang)} />;
}
