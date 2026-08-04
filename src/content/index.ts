import { getGlossary } from "./glossary";
import type { Locale } from "./locales";
import { getProfile, type Profile } from "./profile";
import { getProjects, type Project } from "./projects";
import { getUi, type UiStrings } from "./ui";

/** Todo o conteúdo do site já resolvido para um idioma. */
export type SiteContent = {
  locale: Locale;
  profile: Profile;
  projects: Project[];
  ui: UiStrings;
  /** Explicação de cada skill, aberta ao clicar na palavra do fundo. */
  glossary: Record<string, string>;
};

/**
 * Resolve o site inteiro para um idioma. Roda no servidor, uma vez por rota:
 * os componentes cliente recebem objetos simples, sem saber que existe i18n.
 */
export function getContent(locale: Locale): SiteContent {
  return {
    locale,
    profile: getProfile(locale),
    projects: getProjects(locale),
    ui: getUi(locale),
    glossary: getGlossary(locale),
  };
}
