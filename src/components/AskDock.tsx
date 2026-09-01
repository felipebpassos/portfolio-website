"use client";

import { useEffect, useRef, useState } from "react";

import { fill } from "@/content/ui";
import { useContent } from "@/lib/content-context";

type Message = {
  role: "user" | "model";
  text: string;
  contactSent?: boolean;
};

/**
 * O modelo às vezes devolve markdown (`**assim**`). Sem tratar, os asteriscos
 * aparecem crus. Aqui cobrimos só o básico inline — negrito, itálico, código e
 * link — que é o que ele usa numa resposta de duas a quatro frases.
 */
const INLINE = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\))/g;

function renderRich(text: string) {
  return text.split(INLINE).map((part, i) => {
    const bold = /^\*\*([^*\n]+)\*\*$/.exec(part);
    if (bold) {
      return (
        <strong key={i} className="font-semibold text-white/90">
          {bold[1]}
        </strong>
      );
    }
    const code = /^`([^`\n]+)`$/.exec(part);
    if (code) {
      return (
        <code
          key={i}
          className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em]"
        >
          {code[1]}
        </code>
      );
    }
    const link = /^\[([^\]\n]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      return (
        <a
          key={i}
          href={link[2]}
          target="_blank"
          rel="noreferrer noopener"
          className="text-accent underline underline-offset-2 hover:text-white"
        >
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

export default function AskDock({
  /** Avisa o Shell que o painel abriu, para ele subir o hero e dar espaço. */
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) {
  const { profile, ui, locale } = useContent();
  const t = ui.ask;
  const firstName = profile.name.split(" ")[0];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Clique fora do dock (campo + painel) fecha, como o X e o Esc.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  /**
   * A API manda código, não frase: o texto visível sai daqui, no idioma da
   * página. Código desconhecido cai no genérico.
   */
  function messageFor(code?: string): string {
    switch (code) {
      case "rate_minute":
        return t.tooFast;
      case "rate_day":
        return fill(t.dailyLimit, { email: profile.email });
      case "quota":
        return fill(t.quotaOver, { email: profile.email });
      case "busy":
        return t.busy;
      default:
        return t.somethingWrong;
    }
  }

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;

    const history: Message[] = [...messages, { role: "user", text: trimmed }];
    setMessages([...history, { role: "model", text: "" }]);
    setInput("");
    setError(null);
    setBusy(true);
    setOpen(true);

    const controller = new AbortController();
    abortRef.current = controller;

    /** Aplica um patch na última mensagem (a do modelo, em construção). */
    const patchLast = (patch: (m: Message) => Message) =>
      setMessages((prev) =>
        prev.map((m, i) => (i === prev.length - 1 ? patch(m) : m)),
      );

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // O idioma da página define o dossiê e o idioma da resposta.
          locale,
          messages: history.map(({ role, text }) => ({ role, text })),
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const detail = (await response.json().catch(() => null)) as {
          code?: string;
        } | null;
        throw new Error(detail?.code ? messageFor(detail.code) : t.requestFailed);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let failed = false;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          let event: {
            type: string;
            value?: string;
            ok?: boolean;
            code?: string;
          };
          try {
            event = JSON.parse(line);
          } catch {
            continue;
          }

          if (event.type === "text" && event.value) {
            const chunk = event.value;
            patchLast((m) => ({ ...m, text: m.text + chunk }));
          } else if (event.type === "contact") {
            patchLast((m) => ({ ...m, contactSent: event.ok === true }));
          } else if (event.type === "error") {
            failed = true;
            setError(messageFor(event.code));
          }
        }
      }

      if (failed) {
        // A bolha vazia não diz nada e ainda soaria como resposta: quem explica
        // o que houve é a linha de erro logo abaixo.
        setMessages((prev) =>
          prev.at(-1)?.text.trim() ? prev : prev.slice(0, -1),
        );
      } else {
        patchLast((m) =>
          m.text.trim()
            ? m
            : { ...m, text: fill(t.noAnswer, { email: profile.email }) },
        );
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setMessages(history);
      setError((err as Error).message || t.unreachable);
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  const showPanel = open && (messages.length > 0 || !busy);

  useEffect(() => {
    onOpenChange?.(showPanel);
  }, [showPanel, onOpenChange]);

  return (
    <div
      ref={rootRef}
      // data-skill-void: área reservada, sem palavras do SkillField atrás.
      data-skill-void
      className={
        showPanel
          ? // No mobile o chat toma a tela inteira; a partir de sm volta a ser
            // o dropdown ancorado no campo.
            "rise fixed inset-0 z-50 flex w-full flex-col gap-3 bg-black/80 p-3 backdrop-blur-xl sm:relative sm:inset-auto sm:z-40 sm:mt-11 sm:block sm:w-[min(27rem,calc(100vw-2rem))] sm:gap-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none"
          : "rise relative z-40 mt-9 w-[min(27rem,calc(100vw-2rem))] sm:mt-11"
      }
      style={{ animationDelay: "280ms" }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void ask(input);
        }}
        className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/45 py-2 pr-2 pl-4 backdrop-blur-xl transition focus-within:border-white/25 hover:border-white/20"
      >
        <span aria-hidden className="text-sm text-accent/70 select-none">
          ✳
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={t.placeholder}
          aria-label={fill(t.inputAria, { name: profile.name })}
          className="min-w-0 flex-1 bg-transparent py-1 text-sm text-white placeholder:text-white/35 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 transition enabled:hover:bg-white/20 disabled:opacity-30"
          aria-label={t.send}
        >
          {busy ? "···" : "↵"}
        </button>
      </form>

      {showPanel && (
        <div className="slide-down flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/55 text-left shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:absolute sm:inset-x-0 sm:top-full sm:mt-3 sm:block sm:flex-none">
          <header className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
              {fill(t.header, { name: firstName })}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-mr-1 rounded-md px-2 py-1 text-xs text-white/40 transition hover:bg-white/5 hover:text-white/80"
              aria-label={t.close}
            >
              ✕
            </button>
          </header>

          <div
            ref={logRef}
            aria-live="polite"
            className="scrollbar-none min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm sm:max-h-[min(13rem,26dvh)] sm:flex-none"
          >
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-white/45">
                  {fill(t.empty, { name: firstName })}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/55 transition hover:border-white/25 hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, i) =>
              message.role === "user" ? (
                <p key={i} className="text-right text-white/85">
                  <span className="inline-block rounded-2xl rounded-br-sm bg-white/[0.08] px-3 py-1.5 text-left">
                    {message.text}
                  </span>
                </p>
              ) : (
                <div key={i} className="text-white/70">
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {renderRich(message.text)}
                    {busy && i === messages.length - 1 && (
                      <span className="blink ml-0.5 inline-block text-accent">▍</span>
                    )}
                  </p>
                  {message.contactSent === true && (
                    <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
                      {t.delivered}
                    </p>
                  )}
                  {message.contactSent === false && (
                    <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-amber-400/80 uppercase">
                      {fill(t.notDelivered, { email: profile.email })}
                    </p>
                  )}
                </div>
              ),
            )}

            {error && <p className="text-xs text-amber-400/80">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
