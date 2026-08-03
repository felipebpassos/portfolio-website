/**
 * Projetos do portfolio. A ordem aqui é a ordem do scroll horizontal.
 * Também vira contexto da IA — quanto mais específico, melhor ela responde.
 */

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

export const projects: Project[] = [
  // TODO: substitua os três projetos abaixo pelos reais.
  {
    slug: "ritmo-app",
    title: "Ritmo do Esporte",
    subtitle: "Sports platform for athletes, clubs and event organizers",
    year: "2023 — present",
    role: "Full-Stack Engineer",
    kind: "Product",
    stack: ["React Native", "Expo", "Next.js", "Node.js", "PostgreSQL", "AWS"],
    summary:
      "A sports platform where athletes register for events, clubs manage their rosters and organizers run competitions. " +
      "I work across the mobile app, the web platform and the shared API that backs both.",
    highlights: [
      "Shipped registration and check-in flows used during live events.",
      "Designed the shared API contract consumed by the mobile app and the web dashboard.",
      "Set up CI/CD and environment separation so releases stopped being manual.",
    ],
    metrics: [
      { label: "Platforms", value: "iOS · Android · Web" },
      { label: "Role", value: "End to end" },
    ],
    links: [{ label: "Website", href: "https://example.com" }],
    accent: ["#6366f1", "#22d3ee"],
  },
  {
    slug: "ai-assistant",
    title: "AI Product Assistant",
    subtitle: "RAG assistant answering questions over internal product data",
    year: "2024",
    role: "Lead Engineer",
    kind: "AI",
    stack: ["Next.js", "TypeScript", "LLMs", "Embeddings", "PostgreSQL"],
    summary:
      "An assistant that answers questions over internal documentation and product data, " +
      "with retrieval grounded in the company's own content instead of free-form generation.",
    highlights: [
      "Built the ingestion pipeline: chunking, embedding and incremental re-indexing.",
      "Implemented streaming responses with citations back to the source documents.",
      "Added function calling so the assistant could trigger real actions, not just answer.",
    ],
    metrics: [
      { label: "Latency", value: "< 1s to first token" },
      { label: "Grounding", value: "Cited sources" },
    ],
    accent: ["#a855f7", "#ec4899"],
  },
  {
    slug: "infra-toolkit",
    title: "Deploy Toolkit",
    subtitle: "Internal tooling that turned manual deploys into one command",
    year: "2023",
    role: "Engineer",
    kind: "Infra",
    stack: ["Node.js", "Docker", "AWS", "GitHub Actions"],
    summary:
      "Internal tooling that replaced a manual, error-prone release checklist with a single reproducible pipeline " +
      "for building, versioning and deploying services.",
    highlights: [
      "Standardized environment configuration across staging and production.",
      "Automated build, migration and rollout steps behind one command.",
      "Documented the process so any engineer on the team could ship.",
    ],
    metrics: [{ label: "Deploy time", value: "Minutes, not hours" }],
    accent: ["#f59e0b", "#ef4444"],
  },
];
