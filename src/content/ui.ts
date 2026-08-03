/**
 * Textos da interface (botões, rótulos, mensagens de erro).
 * O conteúdo sobre você mora em profile.ts / projects.ts — aqui é só a casca.
 *
 * {name} e {email} são substituídos em runtime pelos componentes.
 * Nada de funções aqui: este objeto atravessa a fronteira servidor → cliente
 * e precisa ser serializável.
 */

import type { Locale } from "./locales";

export type UiStrings = {
  available: string;
  languageLabel: string;
  portfolio: string;
  resume: string;
  resumeAria: string;
  ask: {
    header: string;
    placeholder: string;
    inputAria: string;
    send: string;
    close: string;
    empty: string;
    suggestions: string[];
    delivered: string;
    notDelivered: string;
    noAnswer: string;
    requestFailed: string;
    somethingWrong: string;
    unreachable: string;
  };
  work: {
    title: string;
    count: string;
    close: string;
    previous: string;
    next: string;
    hint: string;
    viewDetails: string;
    back: string;
    highlights: string;
    stack: string;
  };
};

const strings: Record<Locale, UiStrings> = {
  en: {
    available: "Available",
    languageLabel: "Language",
    portfolio: "Portfolio",
    resume: "Résumé",
    resumeAria: "Download {name}'s résumé (PDF)",
    ask: {
      header: "Ask about {name}",
      placeholder: "Ask me anything",
      inputAria: "Ask anything about {name}",
      send: "Send question",
      close: "Close conversation",
      empty:
        "Ask anything about {name}'s experience, projects or availability.",
      suggestions: [
        "What has he built with LLMs?",
        "How much AWS experience?",
        "Is he open to work?",
      ],
      delivered: "✓ Message delivered",
      notDelivered: "! Not delivered — email {email}",
      noAnswer: "No answer came back. Reach out at {email}.",
      requestFailed: "Request failed.",
      somethingWrong: "Something went wrong.",
      unreachable: "Could not reach the assistant.",
    },
    work: {
      title: "Selected work",
      count: "{count} projects",
      close: "Close · Esc",
      previous: "Previous project",
      next: "Next project",
      hint: "Scroll or use arrows · click a card for details",
      viewDetails: "View details",
      back: "Back",
      highlights: "What I built",
      stack: "Stack",
    },
  },

  "pt-br": {
    available: "Disponível",
    languageLabel: "Idioma",
    portfolio: "Ver portfólio",
    resume: "Currículo",
    resumeAria: "Baixar o currículo de {name} (PDF)",
    ask: {
      header: "Pergunte sobre {name}",
      placeholder: "Pergunte o que quiser",
      inputAria: "Pergunte o que quiser sobre {name}",
      send: "Enviar pergunta",
      close: "Fechar conversa",
      empty:
        "Pergunte o que quiser sobre a experiência, os projetos ou a disponibilidade do {name}.",
      suggestions: [
        "O que ele já construiu com LLMs?",
        "Quanta experiência com AWS?",
        "Ele está aberto a propostas?",
      ],
      delivered: "✓ Recado entregue",
      notDelivered: "! Não entregue — escreva para {email}",
      noAnswer: "Não veio resposta. Fale direto em {email}.",
      requestFailed: "A requisição falhou.",
      somethingWrong: "Algo deu errado.",
      unreachable: "Não consegui falar com o assistente.",
    },
    work: {
      title: "Trabalhos selecionados",
      count: "{count} projetos",
      close: "Fechar · Esc",
      previous: "Projeto anterior",
      next: "Próximo projeto",
      hint: "Role ou use as setas · clique num card para ver os detalhes",
      viewDetails: "Ver detalhes",
      back: "Voltar",
      highlights: "O que eu construí",
      stack: "Stack",
    },
  },
};

export function getUi(locale: Locale): UiStrings {
  return strings[locale];
}

/** Troca {chave} pelos valores passados. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
