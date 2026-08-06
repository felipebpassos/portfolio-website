/**
 * Explicação de cada palavra do campo de skills, aberta ao clicar nela.
 *
 * Regra de escrita: quem lê é gente de produto, recrutamento ou negócio —
 * não engenharia. Diga o que a tecnologia PERMITE, não como ela funciona.
 * Uma ou duas frases, sem jargão, sempre terminando em valor concreto.
 *
 * A chave precisa bater exatamente com o item em profile.ts.
 */

import type { Locale, Localized } from "./locales";

const source: Record<string, Localized<string>> = {
  "React Native": {
    en: "One codebase that becomes a real app on both iPhone and Android. A feature reaches every user at once instead of being built twice.",
    "pt-br":
      "Uma base de código só que vira app de verdade no iPhone e no Android. A funcionalidade chega a todo mundo de uma vez, em vez de ser construída duas vezes.",
  },
  "Next.js": {
    en: "The framework behind fast, search-friendly websites. Pages open quickly and Google can actually read them — which decides whether people find you.",
    "pt-br":
      "O framework por trás de sites rápidos e encontráveis. As páginas abrem rápido e o Google consegue ler o conteúdo — o que decide se as pessoas te acham.",
  },
  TypeScript: {
    en: "A safety net over the language of the web. It catches mistakes while the code is being written, instead of letting users find them in production.",
    "pt-br":
      "Uma rede de segurança sobre a linguagem da web. Ela pega os erros enquanto o código é escrito, em vez de deixar o usuário descobrir em produção.",
  },
  Expo: {
    en: "The toolkit that puts a mobile app on the App Store and Play Store, and ships fixes to phones without waiting days for store review.",
    "pt-br":
      "O ferramental que coloca o app nas lojas da Apple e do Google e envia correções para os celulares sem esperar dias pela revisão da loja.",
  },
  "Node.js": {
    en: "The engine running everything that happens after a click: saving data, applying rules, talking to other systems. The part users never see but always feel.",
    "pt-br":
      "O motor que roda tudo o que acontece depois do clique: salvar dados, aplicar regras, conversar com outros sistemas. A parte que o usuário nunca vê, mas sempre sente.",
  },
  NestJS: {
    en: "Structure for the server side that keeps a growing product organized, so adding the tenth feature stays as safe as adding the first.",
    "pt-br":
      "Estrutura para o lado servidor que mantém o produto organizado enquanto cresce, para a décima funcionalidade entrar com a mesma segurança da primeira.",
  },
  API: {
    en: "The shared language systems use to exchange information. It's what lets the mobile app, the website and outside partners read the same data — and what turns a product into something other companies can plug into.",
    "pt-br":
      "A língua comum que os sistemas usam para trocar informação. É o que faz o app, o site e parceiros externos lerem os mesmos dados — e o que transforma o produto em algo em que outras empresas conseguem se plugar.",
  },
  WebSockets: {
    en: "Keeps a live channel open so the screen updates itself — messages, notifications and numbers that change without anyone pressing refresh.",
    "pt-br":
      "Mantém um canal vivo para a tela se atualizar sozinha — mensagens, notificações e números que mudam sem ninguém apertar atualizar.",
  },
  PostgreSQL: {
    en: "The vault for a product's critical records — accounts, orders, payments — with hard guarantees that nothing is lost, duplicated or half-saved.",
    "pt-br":
      "O cofre dos registros críticos do produto — contas, pedidos, pagamentos — com garantia dura de que nada se perde, duplica ou fica salvo pela metade.",
  },
  MySQL: {
    en: "Another database of the same family, still running under a huge share of the web. Knowing both means joining a team without asking them to change what already works.",
    "pt-br":
      "Outro banco da mesma família, ainda rodando sob boa parte da web. Conhecer os dois significa entrar num time sem pedir que ele troque o que já funciona.",
  },
  MongoDB: {
    en: "A database for information that refuses to fit fixed rows and columns — flexible content, or data whose shape keeps changing as the product evolves.",
    "pt-br":
      "Um banco para informação que se recusa a caber em linhas e colunas fixas — conteúdo flexível, ou dados cujo formato muda conforme o produto evolui.",
  },
  Redis: {
    en: "A fast layer that keeps frequent answers ready to serve. Heavy screens open instantly instead of doing the same expensive work over and over.",
    "pt-br":
      "Uma camada rápida que deixa as respostas frequentes prontas. Telas pesadas abrem na hora, em vez de refazer o mesmo trabalho caro toda vez.",
  },
  AWS: {
    en: "Amazon's cloud, where the product actually lives. It grows with demand, so a spike in traffic becomes a bigger bill instead of an outage.",
    "pt-br":
      "A nuvem da Amazon, onde o produto de fato vive. Ela cresce com a demanda, então um pico de acesso vira uma conta maior em vez de uma queda.",
  },
  Lambda: {
    en: "Code that wakes up only when something triggers it and costs nothing while idle. Ideal for work that arrives in bursts rather than steadily.",
    "pt-br":
      "Código que só acorda quando algo o dispara e não custa nada parado. Ideal para trabalho que chega em rajadas, e não de forma constante.",
  },
  Docker: {
    en: "Ships the software with everything it depends on, so it behaves identically on a laptop, in testing and in production. It ends the \"but it worked here\" class of bug.",
    "pt-br":
      "Empacota o software com tudo de que ele depende, então ele se comporta igual no notebook, no teste e em produção. Acaba com a categoria de bug \"mas aqui funcionava\".",
  },
  "CI/CD": {
    en: "Every change gets tested and published automatically. Releases stop being a tense event and become routine — which is what lets a team ship weekly instead of quarterly.",
    "pt-br":
      "Cada mudança é testada e publicada automaticamente. O release deixa de ser um evento tenso e vira rotina — é o que permite um time entregar toda semana em vez de a cada trimestre.",
  },
  Workflows: {
    en: "Repetitive work handed over to the system: tools that don't talk to each other wired together, reports and imports running on their own in the background. It gives back hours someone was spending by hand every day.",
    "pt-br":
      "Trabalho repetitivo entregue ao sistema: ferramentas que não se falam ligadas entre si, relatórios e importações rodando sozinhos em segundo plano. Devolve horas que alguém gastava na mão todo dia.",
  },
  Webhooks: {
    en: "Lets another system tell ours the instant something happens — a payment cleared, an order shipped — instead of us asking again and again and finding out late.",
    "pt-br":
      "Faz outro sistema avisar o nosso no instante em que algo acontece — pagamento aprovado, pedido enviado — em vez de ficarmos perguntando toda hora e descobrindo tarde.",
  },
  IA: {
    en: "ChatGPT-style features built into the product and anchored to the company's own data, so they answer from what the business actually knows. A question inside the product becomes an answer, instead of a support ticket.",
    "pt-br":
      "Recursos no estilo ChatGPT dentro do produto, ancorados nos dados da própria empresa, para responderem a partir do que o negócio realmente sabe. Uma dúvida dentro do produto vira resposta, em vez de chamado no suporte.",
  },
  "Prompt design": {
    en: "Writing the instructions that make an AI dependable: consistent tone, no invented facts, and answers that stay inside the boundaries the business needs.",
    "pt-br":
      "Escrever as instruções que tornam a IA confiável: tom consistente, sem fatos inventados e respostas que ficam dentro dos limites que o negócio precisa.",
  },
};

/** Resolve o glossário para um idioma. Chave = nome da skill. */
export function getGlossary(locale: Locale): Record<string, string> {
  return Object.fromEntries(
    Object.entries(source).map(([term, text]) => [term, text[locale]]),
  );
}

/** Termos que têm explicação — usado para validar contra profile.ts. */
export const glossaryTerms = Object.keys(source);
