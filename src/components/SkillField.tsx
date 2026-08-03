"use client";

import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

/** Ruído determinístico: mesma posição em todo render, sem Math.random. */
function noise(seed: number): number {
  const v = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

/**
 * Distribui as palavras numa grade com jitter, pulando as células centrais
 * (onde ficam foto, título e subtítulo).
 */
function buildLayout(count: number, narrow: boolean): Point[] {
  const cols = narrow ? 3 : 6;
  const rows = narrow ? 7 : 5;
  const safeCols = narrow ? [1] : [2, 3];
  const safeRows = narrow ? [2, 3, 4] : [1, 2, 3];

  const cells: Point[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (safeCols.includes(col) && safeRows.includes(row)) continue;
      const seed = row * cols + col;
      cells.push({
        x: ((col + 0.5) / cols) * 100 + (noise(seed) - 0.5) * (narrow ? 8 : 9),
        y: ((row + 0.5) / rows) * 100 + (noise(seed + 97) - 0.5) * (narrow ? 6 : 9),
      });
    }
  }

  return cells.slice(0, count);
}

export default function SkillField({ skills }: { skills: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [layout, setLayout] = useState<Point[]>([]);

  useEffect(() => {
    const applyLayout = () =>
      setLayout(buildLayout(skills.length, window.innerWidth < 768));

    applyLayout();
    window.addEventListener("resize", applyLayout);
    return () => window.removeEventListener("resize", applyLayout);
  }, [skills.length]);

  useEffect(() => {
    const root = rootRef.current;
    if (!layout.length || !root) return;

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
    window.addEventListener("pointermove", onPointerMove, { passive: true });

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

        // Repele levemente as palavras próximas ao cursor.
        const push = (18 * t) / (dist || 1);
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
  }, [layout]);

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
          <span
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className="block font-mono text-[11px] tracking-[0.22em] whitespace-nowrap text-white uppercase opacity-[0.06] will-change-transform sm:text-xs"
          >
            {skills[i]}
          </span>
        </div>
      ))}

      {/* Vinheta: mantém o centro legível */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,6,10,0.72)_100%)]" />
    </div>
  );
}
