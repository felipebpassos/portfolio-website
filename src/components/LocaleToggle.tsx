"use client";

import Link from "next/link";

import { LOCALES, localeConfig, type Locale } from "@/content/locales";

/**
 * Pílula de vidro com os dois idiomas. Cada lado é um link real para /en e
 * /pt-br — o polegar desliza sobre o idioma ativo.
 */
export default function LocaleToggle({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const index = LOCALES.indexOf(locale);

  return (
    <div
      role="group"
      aria-label={label}
      className="relative grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.07] p-0.5 backdrop-blur-xl"
    >
      <span
        aria-hidden
        // Largura de uma coluna: metade do interior, descontando o padding.
        className="absolute inset-y-0.5 left-0.5 w-[calc(50%-0.125rem)] rounded-full bg-white/20 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(${index * 100}%)` }}
      />

      {LOCALES.map((option) => (
        <Link
          key={option}
          href={`/${option}`}
          hrefLang={localeConfig[option].htmlLang}
          aria-current={option === locale ? "true" : undefined}
          className={`relative rounded-full px-3 py-1 text-center font-mono text-[10px] tracking-[0.16em] transition ${
            option === locale
              ? "text-white"
              : "text-white/45 hover:text-white/75"
          }`}
        >
          {localeConfig[option].label}
        </Link>
      ))}
    </div>
  );
}
