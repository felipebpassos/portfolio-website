# Portfolio

Portfolio de engenheiro de software: uma tela só, sem rolagem, com um assistente de IA
(Gemini) que responde sobre experiência e projetos e encaminha recados de recrutadores por email.

## Rodar

```bash
npm install
cp .env.example .env.local   # preencha as chaves
npm run dev
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

## O que editar

Todo o conteúdo do site — e o contexto que a IA recebe — sai de dois arquivos:

- `src/content/profile.ts` — nome, bio, skills, experiência, respostas prontas
- `src/content/projects.ts` — projetos do scroll horizontal

Estão marcados com `TODO` nos pontos que precisam dos seus dados reais.
Trocar o conteúdo atualiza a interface **e** o que a IA sabe, sem mexer em prompt.

Outros pontos:

- `public/me.jpg` — sua foto (quadrada, 512px ou mais). O arquivo atual é placeholder.
- `src/app/layout.tsx` — `metadataBase` está em `https://example.com`, troque pelo domínio final.

## Estrutura

```
src/
  app/
    page.tsx              home (estática, pré-renderizada no build)
    api/ask/route.ts      Gemini + streaming + function calling → Resend
  components/
    Shell.tsx             estado da página e chrome (topo, botão do portfolio)
    SkillField.tsx        fundo reativo ao mouse com as skills
    Hero.tsx              foto, h1 e subtítulo
    AskDock.tsx           campo de pergunta + chat, canto inferior esquerdo
    PortfolioOverlay.tsx  overlay em tela cheia, scroll horizontal + detalhe
  content/                fonte de verdade (profile, projects)
  lib/ai-context.ts       monta o system prompt a partir de content/
```

A home é estática. Só `/api/ask` roda no servidor, e é por isso que a chave do
Gemini nunca chega ao browser.

## Como o chat funciona

1. O browser faz `POST /api/ask` com o histórico da conversa.
2. A rota chama o Gemini com o dossiê montado a partir de `content/`.
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
