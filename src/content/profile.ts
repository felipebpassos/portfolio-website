/**
 * FONTE DE VERDADE do site.
 * Tudo aqui alimenta (1) a interface e (2) o contexto que a IA recebe.
 *
 * Campos { en, "pt-br" } são as duas versões do site. NÃO precisam ser
 * traduções fiéis — escreva cada idioma como quiser (o título em inglês é
 * "Full-Stack Engineer" e em português é "Desenvolvedor Full-Stack", por exemplo).
 * Campos sem { en, "pt-br" } são iguais nos dois idiomas.
 *
 * Substitua os campos marcados com TODO pelos seus dados reais.
 */

import type { Locale, Localized } from "./locales";

/** O perfil já resolvido para um idioma. É isso que os componentes recebem. */
export type Profile = {
  name: string;
  email: string;
  links: { github: string; linkedin: string };
  resume: string;
  role: string;
  tagline: string;
  location: string;
  availability: string;
  summary: string;
  skills: { group: string; items: string[] }[];
  experience: {
    company: string;
    role: string;
    period: string;
    location: string;
    stack: string[];
    highlights: string[];
  }[];
  education: { school: string; degree: string; period: string }[];
  languages: string[];
  faq: { q: string; a: string }[];
};

const source = {
  // TODO: seu nome
  name: "Felipe Passos",
  email: "felipebpassos@gmail.com",

  links: {
    github: "https://github.com/felipebpassos", // TODO
    linkedin: "https://linkedin.com/in/felipebpassos", // TODO
  },

  /**
   * PDF do currículo, um por idioma. Os arquivos vão em public/.
   * TODO: adicionar public/felipe-passos-resume.pdf e public/felipe-passos-curriculo.pdf
   * Deixar a string vazia esconde o botão naquele idioma.
   */
  resume: {
    en: "/felipe-passos-resume.pdf",
    "pt-br": "/felipe-passos-curriculo.pdf",
  },

  role: {
    en: "Full-Stack Engineer",
    "pt-br": "Desenvolvedor Full-Stack",
  },

  tagline: {
    en: "React Native · Next.js · Node.js · AWS · AI",
    "pt-br": "React Native · Next.js · Node.js · AWS · IA",
  },

  location: {
    en: "Brazil · Remote (UTC-3)",
    "pt-br": "Brasil · Remoto (UTC-3)",
  },

  availability: {
    en: "Open to senior full-stack and AI engineering roles",
    "pt-br": "Aberto a vagas sênior de engenharia full-stack e de IA",
  },

  /** Bio curta, usada como abertura do contexto da IA. */
  summary: {
    en:
      "Engineer focused on shipping production products end to end: " +
      "React Native and Next.js on the front, Node.js and AWS on the back, and " +
      "LLM features wired into real user flows. Comfortable owning a feature from " +
      "requirements to deploy and on-call.", // TODO
    "pt-br":
      "Engenheiro focado em entregar produto em produção de ponta a ponta: " +
      "React Native e Next.js na frente, Node.js e AWS atrás, e recursos com LLM " +
      "integrados a fluxos reais de usuário. Acostumado a levar uma feature do " +
      "levantamento ao deploy e ao plantão.", // TODO
  },

  /**
   * Grupos de skills. Os nomes das tecnologias não mudam de idioma —
   * só o rótulo do grupo. A lista achatada alimenta o campo reativo do hero.
   *
   * ATENÇÃO: o campo do hero tem 24 posições (grade 6x5 menos as 6 células
   * centrais reservadas ao título). O que passar de 24 é descartado em
   * silêncio — ver buildLayout em components/SkillField.tsx.
   */
  skills: [
    {
      group: { en: "Frontend", "pt-br": "Frontend" },
      items: ["React Native", "Next.js", "TypeScript", "Expo"],
    },
    {
      group: { en: "Backend & APIs", "pt-br": "Backend & APIs" },
      items: ["Node.js", "NestJS", "API", "WebSockets"],
    },
    {
      group: { en: "Databases", "pt-br": "Bancos de dados" },
      items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
    },
    {
      group: { en: "Cloud & DevOps", "pt-br": "Nuvem & DevOps" },
      items: ["AWS", "Lambda", "Docker", "CI/CD"],
    },
    {
      group: {
        en: "Automation & Integrations",
        "pt-br": "Automação & Integrações",
      },
      items: ["Workflows", "Webhooks"],
    },
    {
      group: { en: "AI", "pt-br": "IA" },
      items: ["IA", "Prompt design"],
    },
  ],

  /** Experiência profissional, do mais recente para o mais antigo. */
  experience: [
    {
      company: "Ritmo do Esporte", // TODO
      stack: ["React Native", "Next.js", "Node.js", "PostgreSQL", "AWS"],
      role: {
        en: "Full-Stack Engineer",
        "pt-br": "Desenvolvedor Full-Stack",
      },
      period: {
        en: "2023 — present",
        "pt-br": "2023 — atual",
      },
      location: { en: "Remote", "pt-br": "Remoto" },
      highlights: {
        en: [
          "Owns mobile and web features end to end, from requirements to production deploy.",
          "Built and maintains the shared API layer consumed by the app and the web platform.",
          "Cut release friction by standardizing CI/CD and environment configuration.",
        ],
        "pt-br": [
          "Responsável por features de mobile e web de ponta a ponta, do requisito ao deploy em produção.",
          "Construiu e mantém a camada de API compartilhada entre o app e a plataforma web.",
          "Reduziu o atrito de release padronizando CI/CD e configuração de ambientes.",
        ],
      }, // TODO
    },
    {
      company: "Freelance / Consulting", // TODO
      stack: ["React", "Node.js", "PostgreSQL"],
      role: {
        en: "Software Engineer",
        "pt-br": "Engenheiro de Software",
      },
      period: { en: "2021 — 2023", "pt-br": "2021 — 2023" },
      location: { en: "Remote", "pt-br": "Remoto" },
      highlights: {
        en: [
          "Delivered web and mobile products for small teams, working directly with founders.",
          "Handled architecture, implementation and deployment as the single engineer on most projects.",
        ],
        "pt-br": [
          "Entregou produtos web e mobile para times pequenos, trabalhando direto com os fundadores.",
          "Cuidou de arquitetura, implementação e deploy como único engenheiro na maioria dos projetos.",
        ],
      }, // TODO
    },
  ],

  education: [
    {
      school: { en: "TODO: universidade", "pt-br": "TODO: universidade" },
      degree: { en: "TODO: curso", "pt-br": "TODO: curso" },
      period: { en: "TODO", "pt-br": "TODO" },
    },
  ],

  languages: {
    en: ["Portuguese (native)", "English (professional)"],
    "pt-br": ["Português (nativo)", "Inglês (profissional)"],
  },

  /**
   * Respostas prontas para perguntas que recrutadores fazem sempre.
   * A IA usa isso como referência — não é FAQ visível na tela.
   * As duas listas são independentes: podem ter tamanhos diferentes.
   */
  faq: {
    en: [
      {
        q: "What kind of role are you looking for?",
        a: "Senior full-stack or AI engineering roles where I can own features end to end. Remote first, open to hybrid in Brazil.",
      },
      {
        q: "What are your strongest areas?",
        a: "Product-facing engineering: React Native and Next.js interfaces backed by Node.js services on AWS, plus integrating LLMs into real product flows.",
      },
      {
        q: "Are you available right now?",
        a: "Open to conversations. Notice period and start date are best discussed directly — leave a message through the chat and I'll reply by email.",
      },
    ],
    "pt-br": [
      {
        q: "Que tipo de vaga você procura?",
        a: "Vagas sênior de engenharia full-stack ou de IA em que eu possa tocar features de ponta a ponta. Remoto de preferência, aberto a híbrido no Brasil.",
      },
      {
        q: "Quais são seus pontos mais fortes?",
        a: "Engenharia voltada a produto: interfaces em React Native e Next.js apoiadas por serviços Node.js na AWS, além de integrar LLMs em fluxos reais de produto.",
      },
      {
        q: "Você está disponível agora?",
        a: "Aberto a conversar. Aviso prévio e data de início são melhores de tratar direto — deixe um recado pelo chat que eu respondo por email.",
      },
    ],
  },
} satisfies {
  name: string;
  email: string;
  links: { github: string; linkedin: string };
  resume: Localized<string>;
  role: Localized<string>;
  tagline: Localized<string>;
  location: Localized<string>;
  availability: Localized<string>;
  summary: Localized<string>;
  skills: { group: Localized<string>; items: string[] }[];
  experience: {
    company: string;
    stack: string[];
    role: Localized<string>;
    period: Localized<string>;
    location: Localized<string>;
    highlights: Localized<string[]>;
  }[];
  education: {
    school: Localized<string>;
    degree: Localized<string>;
    period: Localized<string>;
  }[];
  languages: Localized<string[]>;
  faq: Localized<{ q: string; a: string }[]>;
};

/** Resolve o perfil para um idioma. Chamado uma vez, no servidor. */
export function getProfile(locale: Locale): Profile {
  return {
    name: source.name,
    email: source.email,
    links: { ...source.links },
    resume: source.resume[locale],
    role: source.role[locale],
    tagline: source.tagline[locale],
    location: source.location[locale],
    availability: source.availability[locale],
    summary: source.summary[locale],
    skills: source.skills.map((group) => ({
      group: group.group[locale],
      items: [...group.items],
    })),
    experience: source.experience.map((job) => ({
      company: job.company,
      stack: [...job.stack],
      role: job.role[locale],
      period: job.period[locale],
      location: job.location[locale],
      highlights: [...job.highlights[locale]],
    })),
    education: source.education.map((entry) => ({
      school: entry.school[locale],
      degree: entry.degree[locale],
      period: entry.period[locale],
    })),
    languages: [...source.languages[locale]],
    faq: source.faq[locale].map((item) => ({ ...item })),
  };
}

/**
 * Lista achatada de skills, usada pelo campo reativo ao mouse no hero.
 * Nomes de tecnologia são iguais nos dois idiomas, então não depende do locale.
 */
export const skillCloud: string[] = source.skills.flatMap((g) => g.items);
