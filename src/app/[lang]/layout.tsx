import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import {
  DEFAULT_LOCALE,
  LOCALES,
  hasLocale,
  localeConfig,
} from "@/content/locales";
import { getProfile } from "@/content/profile";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type LangParams = { params: Promise<{ lang: string }> };

/** Pré-renderiza /en e /pt-br no build. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/** Qualquer outro idioma na URL vira 404 em vez de ser gerado sob demanda. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const profile = getProfile(locale);
  const title = `${profile.name} — ${profile.role}`;

  return {
    // TODO: troque pelo domínio final para as imagens de preview funcionarem.
    metadataBase: new URL("https://example.com"),
    title,
    description: profile.summary,
    alternates: {
      canonical: `/${locale}`,
      // Diz ao Google que as duas URLs são a mesma página em idiomas diferentes.
      languages: {
        en: "/en",
        "pt-BR": "/pt-br",
      },
    },
    openGraph: {
      title,
      description: profile.summary,
      type: "website",
      locale: localeConfig[locale].htmlLang,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: profile.summary,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#06060a",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
  params,
}: LangParams & { children: React.ReactNode }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={localeConfig[lang].htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
