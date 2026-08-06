"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

import { useContent } from "@/lib/content-context";

type Point = { x: number; y: number };

/** Posição da tooltip. Ancora em top OU bottom, conforme o espaço na tela. */
type Tooltip = {
  index: number;
  left: number;
  top?: number;
  bottom?: number;
};

const TOOLTIP_WIDTH = 288; // w-72
const EDGE = 12;

/**
 * Raio em que a repulsão vai perdendo força até zerar em cima do cursor.
 * Sem isso a direção do empurrão fica instável no centro e a palavra treme —
 * o que torna palavras curtas ("API", "IA") quase impossíveis de acertar.
 */
const SETTLE = 70;

/** Ruído determinístico: mesma posição em todo render, sem Math.random. */
function noise(seed: number): number {
  const v = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

/**
 * Distribui as palavras numa grade com jitter, pulando as células centrais
 * (onde ficam foto, título, subtítulo e o campo de pergunta).
 *
 * São 6x5 menos 6 células reservadas = 24 posições. Palavras além disso são
 * descartadas — manter content/profile.ts dentro desse limite.
 */
function buildLayout(count: number): Point[] {
  const cols = 6;
  const rows = 5;
  const safeCols = [2, 3];
  const safeRows = [1, 2, 3];

  const cells: Point[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (safeCols.includes(col) && safeRows.includes(row)) continue;
      const seed = row * cols + col;
      cells.push({
        x: ((col + 0.5) / cols) * 100 + (noise(seed) - 0.5) * 9,
        y: ((row + 0.5) / rows) * 100 + (noise(seed + 97) - 0.5) * 9,
      });
    }
  }

  return cells.slice(0, count);
}

/**
 * As palavras só fazem sentido onde existe cursor de verdade para acendê-las.
 * Em telas de toque (ou janelas estreitas) sobra apenas a luz de fundo.
 */
function wordsMakeSense(): boolean {
  return (
    window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 768
  );
}

/** Reavalia quando a janela muda de tamanho ou o tipo de ponteiro muda. */
function subscribeToPointer(onChange: () => void) {
  const query = window.matchMedia("(pointer: fine)");
  window.addEventListener("resize", onChange);
  query.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("resize", onChange);
    query.removeEventListener("change", onChange);
  };
}

export default function SkillField({ skills }: { skills: string[] }) {
  const { glossary, ui } = useContent();
  const rootRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  // Estado derivado do ambiente, não do render: no servidor é sempre false,
  // então a hidratação bate e as palavras entram depois.
  const interactive = useSyncExternalStore(
    subscribeToPointer,
    wordsMakeSense,
    () => false,
  );

  const layout = useMemo(
    () => (interactive ? buildLayout(skills.length) : []),
    [interactive, skills.length],
  );

  // O loop de animação lê a seleção por ref: ele roda a 60fps e não pode
  // ser reiniciado a cada clique.
  const selectedRef = useRef<number | null>(null);
  useEffect(() => {
    selectedRef.current = tooltip?.index ?? null;
  }, [tooltip]);

  // Idem para o hover: com o ponteiro em cima, a palavra congela onde está.
  // Sem isso a repulsão empurra justamente o alvo que a pessoa está mirando.
  const hoveredRef = useRef<number | null>(null);

  function openTooltip(index: number, el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const half = TOOLTIP_WIDTH / 2;
    const center = rect.left + rect.width / 2;

    setTooltip({
      index,
      // Encosta na borda em vez de vazar da tela.
      left: Math.min(
        Math.max(center, half + EDGE),
        window.innerWidth - half - EDGE,
      ),
      // Sem altura conhecida ainda: ancorar por bottom evita ter que medir.
      ...(rect.bottom + 200 > window.innerHeight
        ? { bottom: window.innerHeight - rect.top + 12 }
        : { top: rect.bottom + 12 }),
    });
  }

  // Esc e clique fora fecham. Um clique em outra palavra fecha e reabre,
  // porque o pointerdown chega antes do click.
  useEffect(() => {
    if (!tooltip) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!tooltipRef.current?.contains(event.target as Node)) {
        setTooltip(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTooltip(null);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [tooltip]);

  // Redimensionar move as palavras: a tooltip ficaria apontando para o vazio.
  useEffect(() => {
    const close = () => setTooltip(null);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    // Sem palavras o loop continua: é ele que move a luz de fundo.
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let centers: Point[] = [];
    const measure = () => {
      centers = wordRefs.current.map((el) => {
        if (!el) return { x: -9999, y: -9999 };
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    measure();
    window.addEventListener("resize", measure);

    // Alvo do ponteiro. Sem mouse (touch, ou antes do primeiro movimento),
    // um ponto virtual passeia pela tela em uma curva de Lissajous.
    const target: Point = { x: window.innerWidth / 2, y: window.innerHeight * 0.45 };
    const cursor: Point = { ...target };
    let pointerSeen = false;

    const onPointerMove = (event: PointerEvent) => {
      pointerSeen = true;
      target.x = event.clientX;
      target.y = event.clientY;
    };
    // No toque a luz nunca segue o dedo: ela passeia sozinha, sempre.
    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);

      if (!pointerSeen && !reduced) {
        const t = (now - start) / 1000;
        target.x = window.innerWidth * (0.5 + 0.32 * Math.sin(t * 0.28));
        target.y = window.innerHeight * (0.5 + 0.26 * Math.sin(t * 0.19 + 1.2));
      }

      // Easing: o brilho persegue o ponteiro em vez de colar nele.
      cursor.x += (target.x - cursor.x) * 0.12;
      cursor.y += (target.y - cursor.y) * 0.12;

      root.style.setProperty("--mx", `${cursor.x}px`);
      root.style.setProperty("--my", `${cursor.y}px`);

      const radius = window.innerWidth < 768 ? 190 : 280;

      for (let i = 0; i < wordRefs.current.length; i++) {
        const el = wordRefs.current[i];
        const center = centers[i];
        if (!el || !center) continue;

        // A palavra aberta fica acesa e parada, senão ela fugiria do cursor
        // enquanto a pessoa lê a explicação.
        if (i === selectedRef.current) {
          el.style.opacity = "1";
          el.style.transform = "translate3d(0,0,0) scale(1.14)";
          el.style.textShadow = "0 0 20px rgba(125, 211, 252, 0.7)";
          continue;
        }

        // Sob o ponteiro ela fica acesa e imóvel — de propósito sem mexer no
        // transform: qualquer salto aqui a tiraria de baixo do cursor e o
        // pointerleave devolveria tudo, virando piscada.
        if (i === hoveredRef.current) {
          el.style.opacity = "1";
          el.style.textShadow = "0 0 20px rgba(125, 211, 252, 0.7)";
          continue;
        }

        const dx = center.x - cursor.x;
        const dy = center.y - cursor.y;
        const dist = Math.hypot(dx, dy);

        const raw = Math.max(0, 1 - dist / radius);
        const t = raw * raw * (3 - 2 * raw); // smoothstep

        if (t <= 0.001) {
          el.style.opacity = "0.06";
          el.style.transform = "translate3d(0,0,0)";
          el.style.textShadow = "none";
          continue;
        }

        // Repele levemente as palavras próximas ao cursor, mas o empurrão
        // decai até zero na aproximação final: a palavra se acomoda sob o
        // ponteiro em vez de fugir dele.
        const settle = Math.min(1, dist / SETTLE);
        const push = (18 * t * settle) / (dist || 1);
        el.style.opacity = String(0.06 + 0.82 * t);
        el.style.transform = `translate3d(${dx * push}px, ${dy * push}px, 0) scale(${1 + 0.16 * t})`;
        el.style.textShadow = `0 0 ${16 * t}px rgba(125, 211, 252, ${0.5 * t})`;
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [layout, interactive]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      {/* Blobs de fundo */}
      <div className="absolute inset-0">
        <div className="blob-a absolute -top-1/3 left-1/4 h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16),transparent_62%)]" />
        <div className="blob-b absolute -bottom-1/3 right-1/4 h-[65vmax] w-[65vmax] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.11),transparent_62%)]" />
      </div>

      {/* Grade fina */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(circle 420px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.25) 55%, transparent 78%)",
        }}
      />

      {/* Brilho do cursor */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 340px at var(--mx) var(--my), rgba(125,211,252,0.09), transparent 70%)",
        }}
      />

      {/* Skills */}
      {layout.map((point, i) => (
        <div
          key={skills[i]}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            animation: `float-word ${9 + noise(i) * 7}s ease-in-out ${noise(i + 41) * -8}s infinite`,
          }}
        >
          <button
            type="button"
            // Fora da ordem de tabulação: são 24 palavras decorativas antes
            // do conteúdo real, e o campo só existe onde há mouse.
            tabIndex={-1}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            onClick={(event) => openTooltip(i, event.currentTarget)}
            onPointerEnter={() => {
              hoveredRef.current = i;
            }}
            onPointerLeave={() => {
              if (hoveredRef.current === i) hoveredRef.current = null;
            }}
            // O padding é área de acerto, não espaçamento: sem ele "API" tem
            // uns 30px de alvo e a palavra escapa antes do clique.
            className="pointer-events-auto block cursor-pointer px-3 py-2 font-mono text-[11px] tracking-[0.22em] whitespace-nowrap text-white uppercase opacity-[0.06] will-change-transform sm:text-xs"
          >
            {skills[i]}
          </button>
        </div>
      ))}

      {/* Portal para o body: dentro do SkillField (que é fixed, logo abre um
          contexto de empilhamento) nenhum z-index escaparia para cima do hero.
          z-[45] fica acima do dock e dos links, e abaixo do overlay (z-50). */}
      {tooltip &&
        glossary[skills[tooltip.index]] &&
        createPortal(
          <div
            ref={tooltipRef}
            className="slide-down fixed z-[45] w-72 rounded-xl border border-white/12 bg-black/85 p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.95)] backdrop-blur-xl"
            style={{
              left: tooltip.left - TOOLTIP_WIDTH / 2,
              top: tooltip.top,
              bottom: tooltip.bottom,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
                {skills[tooltip.index]}
              </span>
              <button
                type="button"
                onClick={() => setTooltip(null)}
                aria-label={ui.skillClose}
                className="-mt-1 -mr-1 rounded-md px-1.5 py-0.5 text-xs text-white/35 transition hover:bg-white/5 hover:text-white/80"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              {glossary[skills[tooltip.index]]}
            </p>
          </div>,
          document.body,
        )}

      {/* Vinheta: mantém o centro legível */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,6,10,0.72)_100%)]" />
    </div>
  );
}
