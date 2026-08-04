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
  REST: {
    en: "The shared language apps and servers use to exchange information. It's what lets the mobile app, the website and outside partners read the same data.",
    "pt-br":
      "A língua comum que apps e servidores usam para trocar informação. É o que faz o app, o site e parceiros externos lerem os mesmos dados.",
  },
  GraphQL: {
    en: "Lets a screen ask for exactly the data it needs in a single request. Fewer round trips means pages that still load fast on a weak connection.",
    "pt-br":
      "Permite que a tela peça exatamente o dado de que precisa numa requisição só. Menos idas e vindas significa páginas que carregam rápido mesmo em conexão fraca.",
  },
  WebSockets: {
    en: "Keeps a live channel open so the screen updates itself — messages, notifications and numbers that change without anyone pressing refresh.",
    "pt-br":
      "Mantém um canal vivo para a tela se atualizar sozinha — mensagens, notificações e números que mudam sem ninguém apertar atualizar.",
  },
  WebRTC: {
    en: "Video and voice calls that travel straight between two devices instead of through a server. That's what keeps live calls sharp and cheap to run.",
    "pt-br":
      "Chamadas de vídeo e voz que vão direto de um aparelho ao outro, sem passar por um servidor. É o que mantém a chamada ao vivo nítida e barata de operar.",
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
  n8n: {
    en: "Wires together tools that don't talk to each other and automates the repetitive path between them, replacing work someone was doing by hand every day.",
    "pt-br":
      "Liga ferramentas que não se falam e automatiza o caminho repetitivo entre elas, substituindo um trabalho que alguém fazia na mão todo dia.",
  },
  Webhooks: {
    en: "Lets another system tell ours the instant something happens — a payment cleared, an order shipped — instead of us asking again and again and finding out late.",
    "pt-br":
      "Faz outro sistema avisar o nosso no instante em que algo acontece — pagamento aprovado, pedido enviado — em vez de ficarmos perguntando toda hora e descobrindo tarde.",
  },
  Jobs: {
    en: "Heavy work pushed into the background: reports, emails, imports. The user gets an answer immediately while the slow part finishes out of sight.",
    "pt-br":
      "Trabalho pesado empurrado para segundo plano: relatórios, e-mails, importações. O usuário recebe resposta na hora enquanto a parte lenta termina nos bastidores.",
  },
  LLMs: {
    en: "The models behind ChatGPT-style features. Applied well, they turn a question inside your product into an answer, instead of into a support ticket.",
    "pt-br":
      "Os modelos por trás de recursos no estilo ChatGPT. Bem aplicados, transformam uma dúvida dentro do produto em resposta, em vez de em chamado no suporte.",
  },
  RAG: {
    en: "Anchors the AI to your own documents and data, so it answers from what the company actually knows — the difference between a useful assistant and a confident liar.",
    "pt-br":
      "Ancora a IA nos seus próprios documentos e dados, para ela responder a partir do que a empresa realmente sabe — a diferença entre um assistente útil e um mentiroso convincente.",
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
