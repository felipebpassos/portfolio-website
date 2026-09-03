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
  skillClose: string;
  ask: {
    header: string;
    placeholder: string;
    inputAria: string;
    send: string;
    close: string;
    empty: string;
    suggestions: string[];
    /**
     * Palavras que aparecem ao lado do cursor enquanto a resposta não começou
     * a chegar. Entram e saem letra a letra, em ciclo, na ordem daqui.
     */
    thinking: string[];
    delivered: string;
    notDelivered: string;
    noAnswer: string;
    requestFailed: string;
    somethingWrong: string;
    unreachable: string;
    /** Freio do próprio site: muitas perguntas em pouco tempo. */
    tooFast: string;
    /** Freio do próprio site: cota de perguntas do visitante no dia. */
    dailyLimit: string;
    /** Cota diária da API do Gemini esgotada — não adianta insistir hoje. */
    quotaOver: string;
    /** Modelo sobrecarregado (503) — passageiro, tentar de novo em instantes. */
    busy: string;
  };
  work: {
    title: string;
    count: string;
    close: string;
    previous: string;
    next: string;
    hint: string;
  };
};

const strings: Record<Locale, UiStrings> = {
  en: {
    available: "Available",
    languageLabel: "Language",
    portfolio: "Portfolio",
    resume: "Résumé",
    resumeAria: "Download {name}'s résumé (PDF)",
    skillClose: "Close explanation",
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
      thinking: ["working…", "philosophizing…", "crafting…"],
      delivered: "✓ Message delivered",
      notDelivered: "! Not delivered — email {email}",
      noAnswer: "No answer came back. Reach out at {email}.",
      requestFailed: "Request failed.",
      somethingWrong: "Something went wrong.",
      unreachable: "Could not reach the assistant.",
      tooFast: "One question at a time — try again in a minute.",
      dailyLimit: "That's the question limit for today. Email {email}.",
      quotaOver:
        "The assistant is unavailable right now. Email {email} and I'll reply myself.",
      busy: "The assistant is briefly overloaded. Try again in a moment.",
    },
    work: {
      title: "Selected work",
      count: "{count} projects",
      close: "Close · Esc",
      previous: "Previous project",
      next: "Next project",
      hint: "Scroll or use arrows",
    },
  },

  "pt-br": {
    available: "Disponível",
    languageLabel: "Idioma",
    portfolio: "Ver portfólio",
    resume: "Currículo",
    resumeAria: "Baixar o currículo de {name} (PDF)",
    skillClose: "Fechar explicação",
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
      thinking: ["trabalhando…", "filosofando…", "criando…"],
      delivered: "✓ Recado entregue",
      notDelivered: "! Não entregue — escreva para {email}",
      noAnswer: "Não veio resposta. Fale direto em {email}.",
      requestFailed: "A requisição falhou.",
      somethingWrong: "Algo deu errado.",
      unreachable: "Não consegui falar com o assistente.",
      tooFast: "Uma pergunta de cada vez — tente de novo em um minuto.",
      dailyLimit: "Esse é o limite de perguntas por hoje. Escreva para {email}.",
      quotaOver:
        "O assistente está indisponível no momento. Escreva para {email} que eu mesmo respondo.",
      busy: "O assistente está sobrecarregado agora. Tente de novo em instantes.",
    },
    work: {
      title: "Trabalhos selecionados",
      count: "{count} projetos",
      close: "Fechar · Esc",
      previous: "Projeto anterior",
      next: "Próximo projeto",
      hint: "Role ou use as setas",
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
