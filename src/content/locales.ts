/**
 * Os dois idiomas do site. Cada versão é ESCRITA À MÃO, não traduzida:
 * os campos abaixo aceitam textos completamente diferentes por idioma.
 */

export const LOCALES = ["en", "pt-br"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Um valor que existe nas duas versões. Sempre exige as duas — o TS cobra. */
export type Localized<T> = Record<Locale, T>;

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const localeConfig: Record<
  Locale,
  {
    /** Valor do atributo lang no <html>. */
    htmlLang: string;
    /** Rótulo no toggle. */
    label: string;
    /** Nome do idioma como a IA deve entendê-lo. */
    aiLanguage: string;
  }
> = {
  en: { htmlLang: "en", label: "EN", aiLanguage: "English" },
  "pt-br": {
    htmlLang: "pt-BR",
    label: "PT-BR",
    aiLanguage: "Brazilian Portuguese",
  },
};
