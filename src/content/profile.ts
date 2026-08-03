/**
 * FONTE DE VERDADE do site.
 * Tudo aqui alimenta (1) a interface e (2) o contexto que a IA recebe.
 * Substitua os campos marcados com TODO pelos seus dados reais.
 */

export const profile = {
  // TODO: seu nome
  name: "Felipe Passos",
  role: "Full-Stack Engineer",
  tagline: "React Native · Next.js · Node.js · AWS · LLMs",
  location: "Brazil · Remote (UTC-3)",
  email: "felipebpassos@gmail.com",
  availability: "Open to senior full-stack and AI engineering roles",

  links: {
    github: "https://github.com/felipebpassos", // TODO
    linkedin: "https://linkedin.com/in/felipebpassos", // TODO
  },

  /** Bio curta, usada no hero e como abertura do contexto da IA. */
  summary:
    "Full-stack engineer focused on shipping production products end to end: " +
    "React Native and Next.js on the front, Node.js and AWS on the back, and " +
    "LLM features wired into real user flows. Comfortable owning a feature from " +
    "requirements to deploy and on-call.", // TODO

  /** Grupos de skills. A primeira lista de cada grupo aparece no campo reativo do mouse. */
  skills: [
    {
      group: "Frontend",
      items: ["React", "React Native", "Next.js", "TypeScript", "Tailwind", "Expo"],
    },
    {
      group: "Backend",
      items: ["Node.js", "NestJS", "PostgreSQL", "Prisma", "Redis", "REST", "WebSockets"],
    },
    {
      group: "Cloud & Infra",
      items: ["AWS", "Lambda", "S3", "RDS", "Docker", "CI/CD", "Vercel"],
    },
    {
      group: "AI",
      items: ["LLMs", "RAG", "Embeddings", "Function calling", "Prompt design"],
    },
  ],

  /** Experiência profissional, do mais recente para o mais antigo. */
  experience: [
    {
      company: "Ritmo do Esporte", // TODO
      role: "Full-Stack Engineer",
      period: "2023 — present",
      location: "Remote",
      stack: ["React Native", "Next.js", "Node.js", "PostgreSQL", "AWS"],
      highlights: [
        "Owns mobile and web features end to end, from requirements to production deploy.",
        "Built and maintains the shared API layer consumed by the app and the web platform.",
        "Cut release friction by standardizing CI/CD and environment configuration.",
      ], // TODO
    },
    {
      company: "Freelance / Consulting", // TODO
      role: "Software Engineer",
      period: "2021 — 2023",
      location: "Remote",
      stack: ["React", "Node.js", "PostgreSQL"],
      highlights: [
        "Delivered web and mobile products for small teams, working directly with founders.",
        "Handled architecture, implementation and deployment as the single engineer on most projects.",
      ], // TODO
    },
  ],

  education: [
    {
      school: "TODO: universidade",
      degree: "TODO: curso",
      period: "TODO",
    },
  ],

  languages: ["Portuguese (native)", "English (professional)"],

  /**
   * Respostas prontas para perguntas que recrutadores fazem sempre.
   * A IA usa isso como referência — não é FAQ visível na tela.
   */
  faq: [
    {
      q: "What kind of role are you looking for?",
      a: "Senior full-stack or AI engineering roles where I can own features end to end. Remote first, open to hybrid in Brazil.", // TODO
    },
    {
      q: "What are your strongest areas?",
      a: "Product-facing full-stack work: React Native and Next.js interfaces backed by Node.js services on AWS, plus integrating LLMs into real product flows.", // TODO
    },
    {
      q: "Are you available right now?",
      a: "Open to conversations. Notice period and start date are best discussed directly — leave a message through the chat and I'll reply by email.", // TODO
    },
  ],
} as const;

/** Lista achatada de skills, usada pelo campo reativo ao mouse no hero. */
export const skillCloud: string[] = profile.skills.flatMap((g) => [...g.items]);
