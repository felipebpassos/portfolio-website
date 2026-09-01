import {
  GoogleGenAI,
  Type,
  type Content,
  type FunctionCall,
  type FunctionDeclaration,
  type Part,
} from "@google/genai";
import { Resend } from "resend";

import { DEFAULT_LOCALE, hasLocale, type Locale } from "@/content/locales";
import { getProfile } from "@/content/profile";
import { buildSystemInstruction } from "@/lib/ai-context";

// Nome e email não mudam de idioma — qualquer locale serve para lê-los.
const profile = getProfile(DEFAULT_LOCALE);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gemini-3.6-flash";
const MAX_TURNS = 4;
/** Retentativas quando o modelo responde 503 (sobrecarga passageira). */
const MAX_RETRIES = 2;
const RETRY_BASE_MS = 600;
const MAX_MESSAGE_CHARS = 800;
const MAX_HISTORY = 16;

type ClientMessage = { role: "user" | "model"; text: string };

/**
 * Rate limit em memória. Some entre cold starts do serverless — é um freio
 * contra abuso casual, não uma garantia. Para algo sério, trocar por Upstash.
 *
 * Os números são baixos de propósito: o nível gratuito da API do Gemini tem
 * cota DIÁRIA (algumas centenas de requisições, ver
 * ai.google.dev/gemini-api/docs/rate-limits). Sem o teto por dia, um único
 * visitante insistente esgota a cota e o chat morre para todo mundo até o dia
 * seguinte. Se um dia migrar para o tier pago, dá para afrouxar os dois.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 4;
const DAY_MS = 24 * 60 * 60_000;
const MAX_PER_DAY = 20;
const hits = new Map<string, number[]>();

/** Devolve qual teto foi batido, ou null quando a pergunta pode passar. */
function rateLimited(ip: string): "rate_minute" | "rate_day" | null {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < DAY_MS);
  // Zera antes de guardar: a entrada deste IP sobrevive à faxina de memória.
  if (hits.size > 5_000) hits.clear();
  hits.set(ip, recent);

  // Pergunta barrada não conta: senão quem martela o endpoint prorroga o
  // próprio castigo para sempre.
  if (recent.length >= MAX_PER_DAY) return "rate_day";
  if (recent.filter((t) => now - t < WINDOW_MS).length >= MAX_PER_WINDOW) {
    return "rate_minute";
  }

  recent.push(now);
  return null;
}

/**
 * Cota estourada do lado do Google — o erro que aparece quando o free tier
 * acaba. Vale uma mensagem própria: não é falha do site nem culpa de quem
 * perguntou, e insistir não resolve.
 */
function isQuotaError(error: unknown): boolean {
  if ((error as { status?: number })?.status === 429) return true;
  const message = error instanceof Error ? error.message : String(error);
  return /RESOURCE_EXHAUSTED|quota|429/i.test(message);
}

/**
 * Modelo sobrecarregado do lado do Google (503 UNAVAILABLE). É passageiro:
 * vale retentar algumas vezes e, se persistir, pedir para tentar mais tarde.
 */
function isOverloadError(error: unknown): boolean {
  if ((error as { status?: number })?.status === 503) return true;
  const message = error instanceof Error ? error.message : String(error);
  return /\b503\b|UNAVAILABLE|overloaded|high demand/i.test(message);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const submitContact: FunctionDeclaration = {
  name: "submit_contact",
  description:
    `Send a message to ${profile.name} by email. Use only when the visitor wants to get in touch ` +
    `and has given a name, an email address and something to say. Never invent these values.`,
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Visitor's full name." },
      email: { type: Type.STRING, description: "Visitor's email address." },
      company: { type: Type.STRING, description: "Company or organization, if mentioned." },
      message: {
        type: Type.STRING,
        description: "The message, including the role or opportunity if there is one.",
      },
    },
    required: ["name", "email", "message"],
  },
};

type ContactArgs = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
};

async function sendContactEmail(args: ContactArgs) {
  const name = String(args.name ?? "").trim();
  const email = String(args.email ?? "").trim();
  const company = String(args.company ?? "").trim();
  const message = String(args.message ?? "").trim();

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Missing or invalid name, email or message." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? profile.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error("[contact] RESEND_API_KEY or CONTACT_FROM_EMAIL not configured");
    return { ok: false, error: "Email delivery is not configured." };
  }

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: email,
    subject: `Portfolio · ${name}${company ? ` (${company})` : ""}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    console.error("[contact] resend error", error);
    return { ok: false, error: "Could not deliver the message." };
  }

  return { ok: true, delivered_to: profile.name };
}

async function runTool(call: FunctionCall) {
  if (call.name === "submit_contact") {
    return sendContactEmail((call.args ?? {}) as ContactArgs);
  }
  return { ok: false, error: `Unknown tool: ${call.name}` };
}

function toContents(messages: ClientMessage[]): Content[] {
  return messages
    .filter((m) => typeof m?.text === "string" && m.text.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: m.text.slice(0, MAX_MESSAGE_CHARS) }],
    }));
}

/**
 * O cliente traduz `code`; `error` fica em inglês só para log e para quem
 * chamar a API na mão. Mandar a frase pronta daqui vazaria inglês numa página
 * em PT-BR — os textos visíveis moram em content/ui.ts.
 */
function fail(code: string, error: string, status: number) {
  return Response.json({ code, error }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fail("unavailable", "GEMINI_API_KEY is not configured.", 500);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimited(ip);
  if (limit === "rate_minute") {
    return fail(limit, "Too many questions in a short time.", 429);
  }
  if (limit === "rate_day") {
    return fail(limit, "Daily question limit reached for this visitor.", 429);
  }

  let messages: ClientMessage[];
  let locale: Locale = DEFAULT_LOCALE;
  try {
    const body = (await request.json()) as {
      messages?: ClientMessage[];
      locale?: string;
    };
    messages = Array.isArray(body.messages) ? body.messages : [];
    if (typeof body.locale === "string" && hasLocale(body.locale)) {
      locale = body.locale;
    }
  } catch {
    return fail("bad_request", "Invalid request body.", 400);
  }

  const contents = toContents(messages);
  if (contents.length === 0) {
    return fail("bad_request", "Ask something first.", 400);
  }

  const ai = new GoogleGenAI({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));

      try {
        for (let turn = 0; turn < MAX_TURNS; turn++) {
          let text = "";
          let calls: FunctionCall[] = [];

          // Enquanto nada foi transmitido, um 503 é recuperável: espera e tenta
          // de novo. Depois do primeiro chunk não dá — o cliente já mostrou texto.
          for (let attempt = 0; ; attempt++) {
            try {
              const result = await ai.models.generateContentStream({
                model: MODEL,
                contents,
                config: {
                  systemInstruction: buildSystemInstruction(locale),
                  temperature: 0.6,
                  maxOutputTokens: 700,
                  tools: [{ functionDeclarations: [submitContact] }],
                },
              });

              for await (const chunk of result) {
                if (chunk.text) {
                  text += chunk.text;
                  send({ type: "text", value: chunk.text });
                }
                if (chunk.functionCalls?.length) calls.push(...chunk.functionCalls);
              }
              break;
            } catch (error) {
              if (attempt < MAX_RETRIES && text === "" && isOverloadError(error)) {
                calls = [];
                await sleep(RETRY_BASE_MS * 2 ** attempt);
                continue;
              }
              throw error;
            }
          }

          const modelParts: Part[] = [];
          if (text) modelParts.push({ text });
          for (const call of calls) modelParts.push({ functionCall: call });
          if (modelParts.length) contents.push({ role: "model", parts: modelParts });

          if (calls.length === 0) break;

          const responses: Part[] = [];
          for (const call of calls) {
            const response = await runTool(call);
            responses.push({
              functionResponse: { name: call.name, response },
            });
            if (call.name === "submit_contact") {
              send({ type: "contact", ok: response.ok === true });
            }
          }
          contents.push({ role: "user", parts: responses });
        }
      } catch (error) {
        console.error("[ask] generation failed", error);
        const code = isQuotaError(error)
          ? "quota"
          : isOverloadError(error)
            ? "busy"
            : "unavailable";
        send({ type: "error", code });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
