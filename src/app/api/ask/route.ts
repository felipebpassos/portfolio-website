import {
  GoogleGenAI,
  Type,
  type Content,
  type FunctionCall,
  type FunctionDeclaration,
  type Part,
} from "@google/genai";
import { Resend } from "resend";

import { profile } from "@/content/profile";
import { SYSTEM_INSTRUCTION } from "@/lib/ai-context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gemini-2.5-flash";
const MAX_TURNS = 4;
const MAX_MESSAGE_CHARS = 800;
const MAX_HISTORY = 16;

type ClientMessage = { role: "user" | "model"; text: string };

/**
 * Rate limit em memória. Some entre cold starts do serverless — é um freio
 * contra abuso casual, não uma garantia. Para algo sério, trocar por Upstash.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

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

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured." },
      { status: 500 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "Too many questions in a short time. Try again in a minute." },
      { status: 429 },
    );
  }

  let messages: ClientMessage[];
  try {
    const body = (await request.json()) as { messages?: ClientMessage[] };
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const contents = toContents(messages);
  if (contents.length === 0) {
    return Response.json({ error: "Ask something first." }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));

      try {
        for (let turn = 0; turn < MAX_TURNS; turn++) {
          const result = await ai.models.generateContentStream({
            model: MODEL,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.6,
              maxOutputTokens: 700,
              tools: [{ functionDeclarations: [submitContact] }],
            },
          });

          let text = "";
          const calls: FunctionCall[] = [];

          for await (const chunk of result) {
            if (chunk.text) {
              text += chunk.text;
              send({ type: "text", value: chunk.text });
            }
            if (chunk.functionCalls?.length) calls.push(...chunk.functionCalls);
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
        send({ type: "error", value: "The assistant is unavailable right now." });
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
