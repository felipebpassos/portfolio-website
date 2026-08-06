# Portfolio

Portfolio de engenheiro de software: uma tela só, sem rolagem, com um assistente de IA
(Gemini) que responde sobre experiência e projetos e encaminha recados de recrutadores por email.

## Rodar

```bash
yarn install
cp .env.example .env.local   # preencha as chaves
yarn dev
```

A home funciona sem nenhuma chave. Sem `GEMINI_API_KEY` o chat responde com erro
de configuração; sem `RESEND_API_KEY` a IA responde normalmente mas não consegue
enviar recados.

| Variável             | Obrigatória | Para quê                                                            |
| -------------------- | ----------- | ------------------------------------------------------------------- |
| `GEMINI_API_KEY`     | sim         | Chat. Chave em https://aistudio.google.com/apikey                    |
| `RESEND_API_KEY`     | não         | Envio dos recados. Chave em https://resend.com/api-keys              |
| `CONTACT_FROM_EMAIL` | não         | Remetente verificado no Resend (`onboarding@resend.dev` para testar) |
| `CONTACT_TO_EMAIL`   | não         | Destino dos recados. Padrão: `profile.email`                         |

## Dois idiomas

O site existe em duas URLs, ambas geradas estáticas no build:

| URL      | Idioma            |
| -------- | ----------------- |
| `/`      | redireciona → `/en` |
| `/en`    | inglês (padrão)   |
| `/pt-br` | português         |

**As versões não são traduções automáticas.** Cada campo carrega os dois textos e
eles podem dizer coisas diferentes — o `h1` é `Full-Stack Engineer` em inglês e
`Desenvolvedor Full-Stack` em português:

```ts
role: {
  en: "Full-Stack Engineer",
  "pt-br": "Desenvolvedor Full-Stack",
},
```

Campos sem `{ en, "pt-br" }` (email, links, stack, cores, slugs) são iguais nos
dois idiomas de propósito, para não divergirem. O TypeScript exige os dois
idiomas em todo campo localizado, então não dá para esquecer metade.

Para trocar o idioma padrão, mude o destino do redirect em `next.config.ts`.

## O que editar

Todo o conteúdo do site — e o contexto que a IA recebe — sai de dois arquivos:

- `src/content/profile.ts` — nome, bio, skills, experiência, respostas prontas
- `src/content/projects.ts` — projetos do scroll horizontal

Estão marcados com `TODO` nos pontos que precisam dos seus dados reais.
Trocar o conteúdo atualiza a interface **e** o que a IA sabe, sem mexer em prompt.

Outros pontos:

- `src/content/ui.ts` — textos da casca (botões, rótulos, erros), um dicionário por idioma.
- `public/me.png` — sua foto. A atual é recortada em círculo com `object-cover`.
- `src/app/[lang]/layout.tsx` — `metadataBase` está em `https://example.com`, troque pelo domínio final.

## Estrutura

```
src/
  app/
    [lang]/
      layout.tsx          root layout: <html lang>, metadata e hreflang por idioma
      page.tsx            resolve o conteúdo do idioma e entrega ao Shell
    api/ask/route.ts      Gemini + streaming + function calling → Resend
  components/
    Shell.tsx             estado da página e chrome (topo, botão do portfolio)
    SkillField.tsx        fundo reativo ao mouse com as skills
    Hero.tsx              foto, h1 e subtítulo
    AskDock.tsx           campo de pergunta + chat, canto inferior esquerdo
    PortfolioOverlay.tsx  overlay em tela cheia, scroll horizontal + detalhe
    LocaleToggle.tsx      pílula EN / PT-BR (dois links reais)
  content/
    locales.ts            idiomas suportados e o tipo Localized<T>
    profile.ts            perfil nos dois idiomas + getProfile(locale)
    projects.ts           projetos nos dois idiomas + getProjects(locale)
    ui.ts                 textos da interface, um dicionário por idioma
    index.ts              getContent(locale): resolve o site inteiro
  lib/
    ai-context.ts         monta o system prompt no idioma da página
    content-context.tsx   entrega o conteúdo resolvido aos componentes cliente
```

O idioma é resolvido **uma vez, no servidor**: `getContent(locale)` devolve
objetos comuns e os componentes recebem só o idioma pedido, sem saber que existe
i18n. Nenhum dos dois idiomas carrega o texto do outro.

As duas páginas são estáticas. Só `/api/ask` roda no servidor, e é por isso que a
chave do Gemini nunca chega ao browser.

## Como o chat funciona

1. O browser faz `POST /api/ask` com o histórico da conversa e o idioma da página.
2. A rota chama o Gemini com o dossiê montado a partir de `content/`, na versão
   daquele idioma — quem lê `/pt-br` recebe resposta em português.
3. A resposta volta em streaming (NDJSON, uma linha por evento) e é escrita na tela token a token.
4. Se o visitante demonstra interesse de contratação, o modelo chama a tool
   `submit_contact`; a rota valida os dados e envia o email pelo Resend.

Limites embutidos: 12 perguntas por IP por minuto, 16 mensagens de histórico,
800 caracteres por mensagem, 700 tokens de resposta.

> O rate limit é em memória e some entre cold starts do serverless. Para algo
> robusto, trocar por Upstash Redis.

## Deploy (Vercel)

```bash
npx vercel
```

Depois configure as variáveis de ambiente no dashboard (Production + Preview).
Nenhuma configuração extra é necessária — a home vira estática e `/api/ask` vira
uma function automaticamente.

## Atalhos

- `P` abre o portfolio
- `←` `→` navegam entre os projetos
- `Esc` volta do detalhe / fecha o overlay / fecha o chat
