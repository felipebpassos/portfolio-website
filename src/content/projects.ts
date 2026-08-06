/**
 * Projetos do portfolio. A ordem aqui é a ordem do scroll horizontal.
 * Também vira contexto da IA — quanto mais específico, melhor ela responde.
 *
 * Mesma regra do profile: campos { en, "pt-br" } são as duas versões,
 * escritas de forma independente. Slug, ano, stack e cores não mudam de idioma.
 */

import type { Locale, Localized } from "./locales";

/** O projeto já resolvido para um idioma. É isso que os componentes recebem. */
export type Project = {
  slug: string;
  title: string;
  /** Uma linha. Aparece no card. */
  subtitle: string;
  year: string;
  role: string;
  /** Palavra-chave curta mostrada no canto do card (ex.: "Mobile", "Platform"). */
  kind: string;
  stack: string[];
  /** Parágrafo do detalhe: o problema e a solução. */
  summary: string;
  /** O que você de fato construiu. Use verbos no passado. */
  highlights: string[];
  /** Números que provam impacto. Opcional, mas é o que recrutador lê primeiro. */
  metrics?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
  /** Duas cores hex para o gradiente do card. */
  accent: [string, string];
};

type ProjectSource = {
  slug: string;
  year: string;
  stack: string[];
  accent: [string, string];
  title: Localized<string>;
  subtitle: Localized<string>;
  role: Localized<string>;
  kind: Localized<string>;
  summary: Localized<string>;
  highlights: Localized<string[]>;
  metrics?: Localized<{ label: string; value: string }[]>;
  links?: { href: string; label: Localized<string> }[];
};

// TODO: substitua os três projetos abaixo pelos reais.
const source: ProjectSource[] = [
  {
    slug: "ritmo-app",
    year: "2023 — 2026",
    stack: ["React Native", "Expo", "Next.js", "Node.js", "PostgreSQL", "AWS"],
    accent: ["#6366f1", "#22d3ee"],
    title: { en: "Ritmo do Esporte", "pt-br": "Ritmo do Esporte" },
    subtitle: {
      en: "Sports platform for athletes, clubs and event organizers",
      "pt-br": "Plataforma esportiva para atletas, clubes e organizadores de eventos",
    },
    role: { en: "Full-Stack Engineer", "pt-br": "Desenvolvedor Full-Stack" },
    kind: { en: "Product", "pt-br": "Produto" },
    summary: {
      en:
        "A sports platform where athletes register for events, clubs manage their rosters and organizers run competitions. " +
        "I work across the mobile app, the web platform and the shared API that backs both.",
      "pt-br":
        "Uma plataforma esportiva onde atletas se inscrevem em eventos, clubes gerenciam seus elencos e organizadores tocam competições. " +
        "Atuo no app mobile, na plataforma web e na API compartilhada que sustenta os dois.",
    },
    highlights: {
      en: [
        "Shipped registration and check-in flows used during live events.",
        "Designed the shared API contract consumed by the mobile app and the web dashboard.",
        "Set up CI/CD and environment separation so releases stopped being manual.",
      ],
      "pt-br": [
        "Entregou os fluxos de inscrição e check-in usados durante os eventos ao vivo.",
        "Desenhou o contrato da API compartilhada entre o app mobile e o painel web.",
        "Montou CI/CD e separação de ambientes para que os releases deixassem de ser manuais.",
      ],
    },
    metrics: {
      en: [
        { label: "Platforms", value: "iOS · Android · Web" },
        { label: "Role", value: "End to end" },
      ],
      "pt-br": [
        { label: "Plataformas", value: "iOS · Android · Web" },
        { label: "Atuação", value: "Ponta a ponta" },
      ],
    },
    links: [
      { href: "https://example.com", label: { en: "Website", "pt-br": "Site" } },
    ],
  },
  {
    slug: "ai-assistant",
    year: "2024",
    stack: ["Next.js", "TypeScript", "LLMs", "Embeddings", "PostgreSQL"],
    accent: ["#a855f7", "#ec4899"],
    title: {
      en: "AI Product Assistant",
      "pt-br": "Assistente de IA do Produto",
    },
    subtitle: {
      en: "RAG assistant answering questions over internal product data",
      "pt-br": "Assistente RAG que responde sobre os dados internos do produto",
    },
    role: { en: "Lead Engineer", "pt-br": "Engenheiro Líder" },
    kind: { en: "AI", "pt-br": "IA" },
    summary: {
      en:
        "An assistant that answers questions over internal documentation and product data, " +
        "with retrieval grounded in the company's own content instead of free-form generation.",
      "pt-br":
        "Um assistente que responde perguntas sobre a documentação interna e os dados do produto, " +
        "com busca ancorada no conteúdo da própria empresa em vez de geração livre.",
    },
    highlights: {
      en: [
        "Built the ingestion pipeline: chunking, embedding and incremental re-indexing.",
        "Implemented streaming responses with citations back to the source documents.",
        "Added function calling so the assistant could trigger real actions, not just answer.",
      ],
      "pt-br": [
        "Construiu o pipeline de ingestão: chunking, embeddings e reindexação incremental.",
        "Implementou respostas em streaming com citação dos documentos de origem.",
        "Adicionou function calling para o assistente disparar ações reais, não só responder.",
      ],
    },
    metrics: {
      en: [
        { label: "Latency", value: "< 1s to first token" },
        { label: "Grounding", value: "Cited sources" },
      ],
      "pt-br": [
        { label: "Latência", value: "< 1s até o 1º token" },
        { label: "Ancoragem", value: "Fontes citadas" },
      ],
    },
  },
  {
    slug: "infra-toolkit",
    year: "2023",
    stack: ["Node.js", "Docker", "AWS", "GitHub Actions"],
    accent: ["#f59e0b", "#ef4444"],
    title: { en: "Deploy Toolkit", "pt-br": "Deploy Toolkit" },
    subtitle: {
      en: "Internal tooling that turned manual deploys into one command",
      "pt-br": "Ferramenta interna que transformou deploys manuais em um comando",
    },
    role: { en: "Engineer", "pt-br": "Engenheiro" },
    kind: { en: "Infra", "pt-br": "Infra" },
    summary: {
      en:
        "Internal tooling that replaced a manual, error-prone release checklist with a single reproducible pipeline " +
        "for building, versioning and deploying services.",
      "pt-br":
        "Ferramenta interna que substituiu um checklist de release manual e sujeito a erro por um único pipeline reprodutível " +
        "de build, versionamento e deploy dos serviços.",
    },
    highlights: {
      en: [
        "Standardized environment configuration across staging and production.",
        "Automated build, migration and rollout steps behind one command.",
        "Documented the process so any engineer on the team could ship.",
      ],
      "pt-br": [
        "Padronizou a configuração de ambientes entre staging e produção.",
        "Automatizou build, migração e rollout atrás de um único comando.",
        "Documentou o processo para que qualquer engenheiro do time conseguisse subir.",
      ],
    },
    metrics: {
      en: [{ label: "Deploy time", value: "Minutes, not hours" }],
      "pt-br": [{ label: "Tempo de deploy", value: "Minutos, não horas" }],
    },
  },
];

/** Resolve os projetos para um idioma. Chamado uma vez, no servidor. */
export function getProjects(locale: Locale): Project[] {
  return source.map((project) => ({
    slug: project.slug,
    year: project.year,
    stack: [...project.stack],
    accent: [...project.accent] as [string, string],
    title: project.title[locale],
    subtitle: project.subtitle[locale],
    role: project.role[locale],
    kind: project.kind[locale],
    summary: project.summary[locale],
    highlights: [...project.highlights[locale]],
    metrics: project.metrics?.[locale].map((metric) => ({ ...metric })),
    links: project.links?.map((link) => ({
      href: link.href,
      label: link.label[locale],
    })),
  }));
}
