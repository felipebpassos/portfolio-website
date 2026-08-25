/**
 * Projetos do portfolio. A ordem aqui é a ordem do scroll horizontal.
 * Também vira contexto da IA — quanto mais específico, melhor ela responde.
 *
 * Mesma regra do profile: campos { en, "pt-br" } são as duas versões,
 * escritas de forma independente. Slug, ano, stack e cores não mudam de idioma.
 */

import type { Locale, Localized } from "./locales";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  /** Parágrafo curto do card: 3 a 4 linhas. Passou disso, o card corta. */
  blurb: string;
  year: string;
  role: string;
  kind: string;
  stack: string[];
  summary: string;
  highlights: string[];
  metrics?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
  accent: [string, string];
  /** Screenshot do card, em public/portfolio/. Sem imagem, o card cai no gradiente do accent. */
  image?: string;
};

type ProjectSource = {
  slug: string;
  year: string;
  stack: string[];
  accent: [string, string];
  image?: string;
  title: Localized<string>;
  subtitle: Localized<string>;
  blurb: Localized<string>;
  role: Localized<string>;
  kind: Localized<string>;
  summary: Localized<string>;
  highlights: Localized<string[]>;
  metrics?: Localized<{ label: string; value: string }[]>;
  links?: { href: string; label: Localized<string> }[];
};

const source: ProjectSource[] = [
  {
    slug: "ritmo-do-esporte",
    year: "2025 — presente",
    // As 5 primeiras aparecem no card — ver ProjectCard em components/PortfolioOverlay.tsx.
    stack: [
      "React Native",
      "Node.js",
      "GraphQL",
      "AWS",
      "MongoDB",
      "Redis",
      "Docker",
      "Kubernetes",
      "Vue/Quasar",
      "Capacitor",
      "Electron",
      "Expo",
      "TypeScript",
    ],
    accent: ["#6366f1", "#22d3ee"],
    image: "/portfolio/ritmo.webp",
    title: { en: "Ritmo do Esporte", "pt-br": "Ritmo do Esporte" },
    subtitle: {
      en: "Management app for sports academies",
      "pt-br": "App de gestão para escolinhas de esporte",
    },
    blurb: {
      en:
        "The app sports academies use to run the day to day: charging monthly fees, enrolling " +
        "students, organizing classes and keeping parents posted. Used by 300+ academies and " +
        "40k+ people.",
      "pt-br":
        "App que escolinhas de esporte usam para tocar o dia a dia: cobrar mensalidade, " +
        "matricular aluno, montar turmas e manter os pais informados. Hoje são mais de 300 " +
        "escolinhas e 40 mil usuários.",
    },
    role: { en: "Mid-level Software Engineer", "pt-br": "Engenheiro de Software Pleno" },
    kind: { en: "Mobile", "pt-br": "Mobile" },
    summary: {
      en:
        "A multi-tenant SaaS management platform for sports academies, with a strong focus on financial management, " +
        "including contracts and plans, enrollment, classes, attendance tracking and assessments, document management, " +
        "announcements, reports, and more — allowing managers to run their entire academy from their mobile device. " +
        "The platform currently serves more than 300 sports academies and has over 40,000 active users. " +
        "The solution is structured into five components: Ritmo Equipes (manager app), Ritmo Atletas (app for students and parents or guardians), " +
        "Node.js backend (GraphQL API), financial microservice, and Ritmo Admin (web frontend).",
      "pt-br":
        "Plataforma (SaaS) multi-tenant completa de gestão para escolinhas de esportes, com foco em gestão financeira, " +
        "incluindo contratos e planos, matrículas, turmas, controle de presença e avaliações, documentos, comunicados, " +
        "relatórios, entre outras funcionalidades — o gestor administra toda a escolinha pelo celular. " +
        "Atualmente, são mais de 300 escolinhas clientes e mais de 40 mil usuários ativos. " +
        "A solução é estruturada em cinco componentes: Ritmo Equipes (app do gestor), Ritmo Atletas (app para alunos e pais ou responsáveis), " +
        "backend em Node.js (API GraphQL), microserviço financeiro e Ritmo Admin (frontend web).",
    },
    highlights: {
      en: [
        "V2 of Ritmo Atletas — the app for students and guardians — in React Native: monthly fee and invoice payments, enrollment and contract signing, document upload, call-ups, announcements, and more.",
        "I design and implement new features end to end, working across every app in the ecosystem, from requirements gathering with the Product team through implementation, testing, and release.",
        "Implementation of improvements and bug fixes based on Support team tickets, prioritizing demands according to their impact and their potential to generate value for the product, clients and users.",
        "Automation with scheduled jobs and n8n flows: recurring routines such as billing generation, due date and overdue reminders, and notification dispatch over push, WhatsApp and email, as well as integrations between the ecosystem services.",
      ],
      "pt-br": [
        "V2 do Ritmo Atletas — o app do aluno e do responsável — em React Native: pagamento de mensalidade e faturas, matrícula e assinatura de contratos, envio de documentos, convocações, comunicados, entre outros.",
        "Desenho e implemento novas funcionalidades de ponta a ponta, atuando em todos apps do ecossistema, desde o levantamento de requisitos junto ao time de Produto até a implementação, testes e release.",
        "Implementação de melhorias e correção de bugs a partir de chamados do time de Suporte, priorizando demandas de acordo com seu impacto e potencial de geração de valor para o produto, clientes e usuários.",
        "Automação via jobs agendados e fluxos no n8n: rotinas recorrentes como geração de cobranças, lembretes de vencimento e inadimplência e disparo de notificações por push, WhatsApp e e-mail, além de integrações entre os serviços do ecossistema.",
      ],
    },
    metrics: {
      en: [
        { label: "Ecosystem", value: "5 apps and services" },
        { label: "Platforms", value: "iOS · Android · Web · Desktop" },
        { label: "Role", value: "Full-Stack Engineer" },
      ],
      "pt-br": [
        { label: "Ecossistema", value: "5 apps e serviços" },
        { label: "Plataformas", value: "iOS · Android · Web · Desktop" },
        { label: "Atuação", value: "Engenheiro Full-Stack" },
      ],
    },
  },
  {
    slug: "minha-loja",
    year: "2026", // TODO: confirmar o ano
    // As 5 primeiras aparecem no card.
    stack: [
      "Next.js",
      "NestJS",
      "PostgreSQL",
      "Prisma",
      "WebSockets",
      "Redis",
      "REST",
      "Docker",
      "TypeScript",
    ],
    accent: ["#a855f7", "#ec4899"],
    title: { en: "Minha Loja", "pt-br": "Minha Loja" },
    subtitle: {
      en: "E-commerce SaaS for small retailers to run their own online store",
      "pt-br": "SaaS de e-commerce para o pequeno lojista ter sua própria loja virtual",
    },
    blurb: {
      en:
        "A ready-made online store for small retailers. The owner subscribes to a plan, adds " +
        "the products and starts selling, watching the orders arrive in real time from the " +
        "admin panel.",
      "pt-br":
        "Loja virtual pronta para o pequeno lojista vender online. Ele assina um plano, " +
        "cadastra os produtos e começa a vender, acompanhando os pedidos chegarem em tempo " +
        "real pelo painel.",
    },
    role: { en: "Full-Stack Engineer", "pt-br": "Desenvolvedor Full-Stack" },
    kind: { en: "Full-Stack", "pt-br": "Full-Stack" },
    summary: {
      en:
        "A multi-tenant e-commerce SaaS where small retailers create and configure their own online store. " +
        "The retailer signs up, subscribes to a plan and gets a store of their own, with catalog, cart and checkout. " +
        "The admin panel centralizes the operation: real-time orders, customers, products with variants, " +
        "financial control reports and full store configuration (payments, delivery with shipping zones, policies). " +
        "The end customer browses the products, places the order and follows its status in real time.",
      "pt-br":
        "SaaS multi-tenant de e-commerce para pequenos lojistas criarem e configurarem sua própria loja virtual. " +
        "O lojista se cadastra, assina um plano e ganha uma loja virtual própria, com catálogo, carrinho e checkout. " +
        "O painel administrativo centraliza a operação: pedidos em tempo real, clientes, produtos com variações, " +
        "relatórios de controle financeiro e configuração completa da loja (pagamentos, entrega com zonas de frete, políticas). " +
        "O cliente final navega pelos produtos, finaliza o pedido e acompanha o status da compra em tempo real.",
    },
    highlights: {
      en: [
        "Multi-tenant architecture: each retailer gets an isolated store — catalog, settings and data — served from a single application and database.",
        "Storefront in Next.js: product browsing, cart and checkout, plus order status tracking in real time for the end customer.",
        "Admin panel where the retailer runs the operation: incoming orders over WebSockets, customers, products with variants and financial control reports.",
        "Store configuration end to end: payments, delivery with shipping zones, store policies and plan subscription.",
      ],
      "pt-br": [
        "Arquitetura multi-tenant: cada lojista tem uma loja isolada — catálogo, configurações e dados — servida por uma única aplicação e banco.",
        "Loja em Next.js: navegação pelos produtos, carrinho e checkout, e acompanhamento do status do pedido em tempo real para o cliente final.",
        "Painel administrativo onde o lojista toca a operação: pedidos chegando por WebSockets, clientes, produtos com variações e relatórios de controle financeiro.",
        "Configuração da loja de ponta a ponta: pagamentos, entrega com zonas de frete, políticas da loja e assinatura de plano.",
      ],
    },
    metrics: {
      en: [
        { label: "Architecture", value: "Multi-tenant SaaS" },
        { label: "Real time", value: "WebSockets" },
        { label: "Role", value: "Personal project, solo" },
      ],
      "pt-br": [
        { label: "Arquitetura", value: "SaaS multi-tenant" },
        { label: "Tempo real", value: "WebSockets" },
        { label: "Atuação", value: "Projeto pessoal, solo" },
      ],
    },
  },
  {
    slug: "atende-mais",
    year: "2024", // TODO: confirmar o ano
    // As 5 primeiras aparecem no card.
    stack: [
      "React Native",
      "Expo",
      "Node.js",
      "WebRTC",
      "MySQL",
      "Redux",
      "Express.js",
      "WebSockets",
      "Redis",
      "AWS S3",
      "Firebase",
      "JWT",
    ],
    accent: ["#14b8a6", "#0ea5e9"],
    image: "/portfolio/atende.webp",
    title: { en: "Atende+", "pt-br": "Atende+" },
    subtitle: {
      en: "Telemedicine marketplace app for online consultations",
      "pt-br": "App marketplace de telemedicina para consultas online",
    },
    blurb: {
      en:
        "A telemedicine app: the patient finds a doctor, books a time, pays in the app and is " +
        "seen over video, without leaving home. On the other side, the doctor runs the schedule.",
      "pt-br":
        "App de telemedicina: o paciente acha um médico, agenda o horário, paga pelo app e é " +
        "atendido por vídeo, sem sair de casa. Do outro lado, o médico organiza a agenda.",
    },
    role: { en: "Full-Stack Engineer", "pt-br": "Desenvolvedor Full-Stack" },
    kind: { en: "Mobile", "pt-br": "Mobile" },
    summary: {
      en:
        "A telemedicine marketplace in a mobile app: the patient searches for a professional by specialty, " +
        "books a time, pays in the app and takes the consultation over video inside the platform itself. " +
        "The doctor manages availability, schedule and consultation history. " +
        "Built with React Native (Expo) on the app and Node.js/Express on the API, with video over WebRTC, " +
        "payments integrated with Asaas including card tokenization, push notifications via Firebase and " +
        "WebSockets for real-time updates.",
      "pt-br":
        "Marketplace de telemedicina em app mobile: o paciente busca um profissional por especialidade, " +
        "agenda o horário, paga pelo app e faz a consulta por vídeo dentro da própria plataforma. " +
        "O médico gerencia disponibilidade, agenda e histórico de atendimentos. " +
        "Construído com React Native (Expo) no app e Node.js/Express na API, com vídeo por WebRTC, " +
        "pagamento integrado ao Asaas com tokenização de cartão, notificações push via Firebase e " +
        "WebSockets para as atualizações em tempo real.",
    },
    highlights: {
      en: [
        "Mobile app in React Native (Expo): advanced search by specialty, booking, appointment history and profile, with state managed in Redux.",
        "Video consultations inside the app, over WebRTC.",
        "Payment integrated with Asaas, including card tokenization.",
        "Push notifications via Firebase and real-time updates over WebSockets, backed by a Node.js/Express API with JWT authentication.",
      ],
      "pt-br": [
        "App mobile em React Native (Expo): busca avançada por especialidade, agendamento, histórico de consultas e perfil, com estado em Redux.",
        "Consulta por vídeo dentro do app, com WebRTC.",
        "Pagamento integrado ao Asaas, com tokenização de cartão.",
        "Notificações push via Firebase e atualizações em tempo real por WebSockets, sobre uma API Node.js/Express com autenticação JWT.",
      ],
    },
    metrics: {
      en: [
        { label: "Platforms", value: "iOS · Android" },
        { label: "Video", value: "WebRTC" },
        { label: "Role", value: "Personal project, solo" },
      ],
      "pt-br": [
        { label: "Plataformas", value: "iOS · Android" },
        { label: "Vídeo", value: "WebRTC" },
        { label: "Atuação", value: "Projeto pessoal, solo" },
      ],
    },
  },
  {
    slug: "estud-ai",
    year: "2025", // TODO: confirmar o ano
    // As 5 primeiras aparecem no card.
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "Express",
      "Tailwind",
    ],
    accent: ["#7c3aed", "#c084fc"],
    title: { en: "ESTUD.AI", "pt-br": "ESTUD.AI" },
    subtitle: {
      en: "School platform with academic records, dashboards and AI summaries",
      "pt-br": "Plataforma escolar com boletim, painéis e resumos com IA",
    },
    blurb: {
      en:
        "A school platform for students, teachers and staff: grades, records and attendance in " +
        "one place, with AI-written study summaries and dashboards showing how each class is doing.",
      "pt-br":
        "Plataforma escolar para aluno, professor e direção: notas, boletim e frequência num " +
        "lugar só, com resumos de estudo escritos por IA e painéis de desempenho por turma.",
    },
    role: { en: "Full-Stack Engineer", "pt-br": "Desenvolvedor Full-Stack" },
    kind: { en: "Full-Stack", "pt-br": "Full-Stack" },
    summary: {
      en:
        "A school platform with five access levels, each one seeing only what belongs to it. " +
        "It covers academic records, grade management and attendance, performance dashboards for students, " +
        "classes, teachers and the school as a whole, and AI-generated study summaries for students and teachers. " +
        "Built with Next.js, React and TypeScript on the front, Node.js and Express on the API, " +
        "and PostgreSQL with Prisma for the data.",
      "pt-br":
        "Plataforma escolar com cinco níveis de acesso, cada um enxergando apenas o que lhe cabe. " +
        "Cobre registro acadêmico, lançamento de notas e frequência, painéis de desempenho por aluno, " +
        "turma, professor e escola, e resumos de estudo gerados por IA para alunos e professores. " +
        "Construída com Next.js, React e TypeScript na frente, Node.js e Express na API, " +
        "e PostgreSQL com Prisma nos dados.",
    },
    highlights: {
      en: [
        "Access system with five levels, each role seeing only its own data and actions.",
        "Academic management: student records, grade entry, attendance and reports by class and subject.",
        "AI-generated study summaries for students and teachers, from the subject content.",
        "Performance dashboards by student, class, teacher and school.",
      ],
      "pt-br": [
        "Sistema de acesso com cinco níveis, cada perfil enxergando só os seus dados e ações.",
        "Gestão acadêmica: registro do aluno, lançamento de notas, frequência e relatórios por turma e matéria.",
        "Resumos de estudo gerados por IA para alunos e professores, a partir do conteúdo da matéria.",
        "Painéis de desempenho por aluno, turma, professor e escola.",
      ],
    },
    metrics: {
      en: [
        { label: "Access levels", value: "5 roles" },
        { label: "AI", value: "Study summaries" },
        { label: "Role", value: "Personal project, solo" },
      ],
      "pt-br": [
        { label: "Níveis de acesso", value: "5 perfis" },
        { label: "IA", value: "Resumos de estudo" },
        { label: "Atuação", value: "Projeto pessoal, solo" },
      ],
    },
  },
  {
    slug: "pomar-do-brasil",
    year: "2023", // TODO: confirmar o ano
    // As 5 primeiras aparecem no card.
    stack: ["PHP", "JavaScript", "MySQL", "Bootstrap", "HTML", "CSS"],
    accent: ["#22c55e", "#f59e0b"],
    image: "/portfolio/pomar.webp",
    title: { en: "Pomar do Brasil", "pt-br": "Pomar do Brasil" },
    subtitle: {
      en: "E-commerce and institutional site for a fruit pulp factory",
      "pt-br": "Site institucional e e-commerce de uma fábrica de polpas",
    },
    blurb: {
      en:
        "Website and online catalog for a fruit pulp factory. The customer browses the products, " +
        "fills the cart and sends the order straight through WhatsApp.",
      "pt-br":
        "Site e catálogo online de uma fábrica de polpa de fruta. O cliente navega pelos " +
        "produtos, monta o pedido no carrinho e envia direto pelo WhatsApp.",
    },
    role: { en: "Full-Stack Engineer", "pt-br": "Desenvolvedor Full-Stack" },
    kind: { en: "Web", "pt-br": "Web" },
    summary: {
      en:
        "An e-commerce and institutional website for a fruit pulp factory. " +
        "It has a product catalog where the customer browses items, adds them to the cart and " +
        "submits the order via WhatsApp — no payment gateway in the middle, which fits how the " +
        "factory already sold. The site also carries the company information and contact options.",
      "pt-br":
        "Site institucional e e-commerce de uma fábrica de polpa de fruta. " +
        "Tem um catálogo em que o cliente navega pelos produtos, adiciona ao carrinho e envia o " +
        "pedido pelo WhatsApp — sem gateway de pagamento no meio, o que combina com o jeito que a " +
        "fábrica já vendia. O site também traz as informações da empresa e os canais de contato.",
    },
    highlights: {
      en: [
        "Product catalog organized by category, with cart and order assembly.",
        "Order sent through WhatsApp, keeping the channel the factory already used with its customers.",
        "Responsive institutional site with company information and contact options.",
      ],
      "pt-br": [
        "Catálogo de produtos organizado por categoria, com carrinho e montagem do pedido.",
        "Envio do pedido pelo WhatsApp, mantendo o canal que a fábrica já usava com os clientes.",
        "Site institucional responsivo, com informações da empresa e canais de contato.",
      ],
    },
    metrics: {
      en: [
        { label: "Client", value: "Fruit pulp factory" },
        { label: "Checkout", value: "Order via WhatsApp" },
        { label: "Role", value: "Solo, end to end" },
      ],
      "pt-br": [
        { label: "Cliente", value: "Fábrica de polpas" },
        { label: "Fechamento", value: "Pedido via WhatsApp" },
        { label: "Atuação", value: "Solo, ponta a ponta" },
      ],
    },
  },
  {
    slug: "area-de-cinema",
    year: "2024", // TODO: confirmar o ano
    // As 5 primeiras aparecem no card.
    stack: [
      "Next.js",
      "React",
      "Node.js",
      "PostgreSQL",
      "Tailwind",
      "Express",
      "Prisma",
      "AWS S3",
      "Asaas",
    ],
    accent: ["#dc2626", "#f97316"],
    image: "/portfolio/areadecinema.webp",
    title: { en: "Área de Cinema", "pt-br": "Área de Cinema" },
    subtitle: {
      en: "White-label course platform with members area and video lessons",
      "pt-br": "Plataforma de cursos white-label com área de membros e vídeo-aulas",
    },
    blurb: {
      en:
        "A white-label platform other creators use to sell their own courses: video lessons in " +
        "modules, progress tracking and a members area that opens automatically once payment " +
        "goes through.",
      "pt-br":
        "Plataforma white-label que outros criadores usam para vender os próprios cursos: " +
        "vídeo-aulas em módulos, acompanhamento de progresso e área de membros que libera " +
        "sozinha assim que o pagamento é aprovado.",
    },
    role: { en: "Full-Stack Engineer", "pt-br": "Desenvolvedor Full-Stack" },
    kind: { en: "Full-Stack", "pt-br": "Full-Stack" },
    summary: {
      en:
        "A white-label, multi-tenant course platform: each client runs their own branded members area, " +
        "with video lessons organized into modules and progress tracking per student. " +
        "Access is unlocked automatically once the subscription payment is confirmed, through Asaas webhooks. " +
        "Built with Next.js, React and Tailwind on the front, Node.js and Express on the API, " +
        "PostgreSQL with Prisma for the data, and AWS S3 for the video assets.",
      "pt-br":
        "Plataforma de cursos white-label e multi-tenant: cada cliente roda a própria área de membros " +
        "com a sua marca, com vídeo-aulas organizadas em módulos e acompanhamento de progresso por aluno. " +
        "O acesso libera sozinho assim que o pagamento da assinatura é confirmado, via webhooks do Asaas. " +
        "Construída com Next.js, React e Tailwind na frente, Node.js e Express na API, " +
        "PostgreSQL com Prisma nos dados e AWS S3 para os vídeos.",
    },
    highlights: {
      en: [
        "Multi-tenant, white-label setup: each client gets an isolated, brandable members area.",
        "Video lessons organized into modules, with per-student progress tracking.",
        "Subscription payments with automatic access activation via Asaas webhooks.",
        "Customizable layout per client, on top of a shared Next.js codebase.",
      ],
      "pt-br": [
        "Estrutura multi-tenant e white-label: cada cliente tem uma área de membros isolada e personalizável.",
        "Vídeo-aulas organizadas em módulos, com acompanhamento de progresso por aluno.",
        "Pagamento por assinatura com liberação automática de acesso via webhooks do Asaas.",
        "Layout customizável por cliente, sobre uma base de código única em Next.js.",
      ],
    },
    metrics: {
      en: [
        { label: "Setup", value: "Multi-tenant, white-label" },
        { label: "Activation", value: "Automatic via Asaas" },
        { label: "Role", value: "Personal project, solo" },
      ],
      "pt-br": [
        { label: "Estrutura", value: "Multi-tenant, white-label" },
        { label: "Ativação", value: "Automática via Asaas" },
        { label: "Atuação", value: "Projeto pessoal, solo" },
      ],
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
    image: project.image,
    title: project.title[locale],
    subtitle: project.subtitle[locale],
    blurb: project.blurb[locale],
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
