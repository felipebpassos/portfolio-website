"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import type { Project } from "@/content/projects";
import { fill } from "@/content/ui";
import { useContent } from "@/lib/content-context";

export default function PortfolioOverlay({ onClose }: { onClose: () => void }) {
  const { projects, ui } = useContent();
  const t = ui.work;
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.7;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  // Esc fecha o overlay. Setas navegam entre os cards.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowRight") scrollByCard(1);
      if (event.key === "ArrowLeft") scrollByCard(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, scrollByCard]);

  // Trava o scroll da página enquanto o overlay está aberto.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Roda do mouse (vertical) vira scroll horizontal no track.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      className="fade-in fixed inset-0 z-50 flex flex-col bg-ink/92 backdrop-blur-2xl"
    >
      <header className="flex shrink-0 items-center justify-between px-5 py-5 sm:px-10">
        <div>
          <h2 className="text-sm font-medium tracking-[-0.01em] text-white">
            {t.title}
          </h2>
          <p className="mt-0.5 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
            {fill(t.count, { count: projects.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/10 px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white/55 uppercase transition hover:border-white/30 hover:text-white"
        >
          {t.close}
        </button>
      </header>

      <div
        ref={trackRef}
        className="scrollbar-none flex min-h-0 flex-1 snap-x snap-mandatory items-center gap-8 overflow-x-auto overflow-y-hidden px-5 pb-6 sm:px-10"
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
        <div aria-hidden className="w-1 shrink-0" />
      </div>

      <footer className="hidden shrink-0 items-center gap-3 px-10 pb-5 font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase sm:flex">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          className="rounded-full border border-white/10 px-2.5 py-1 transition hover:border-white/30 hover:text-white/70"
          aria-label={t.previous}
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          className="rounded-full border border-white/10 px-2.5 py-1 transition hover:border-white/30 hover:text-white/70"
          aria-label={t.next}
        >
          →
        </button>
        <span>{t.hint}</span>
      </footer>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const href = project.links?.[0]?.href;
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      data-card
      {...(href ? { href, target: "_blank", rel: "noreferrer noopener" } : {})}
      className="group flex w-[min(19rem,78vw)] shrink-0 snap-center flex-col gap-4 sm:w-[min(22rem,42vw)]"
    >
      <span className="font-mono text-xs tracking-[0.2em] text-white/35">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-ink-soft transition duration-300 group-hover:-translate-y-1 group-hover:border-white/25">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 640px) 42vw, 78vw"
            className="object-cover grayscale contrast-[1.05] transition duration-500 ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 grayscale contrast-[1.05] transition duration-500 ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
            style={{
              background: `radial-gradient(120% 90% at 15% 10%, ${project.accent[0]}80, transparent 60%), radial-gradient(110% 100% at 95% 90%, ${project.accent[1]}70, transparent 65%), #0c0c10`,
            }}
          />
        )}
      </div>

      <div>
        <h3 className="text-lg leading-tight font-medium tracking-[-0.01em] text-white">
          {project.title}
        </h3>
        {/* Quatro linhas fixas: sem isso, um texto mais curto encolhe o card e
            desalinha a fileira, porque o track centraliza cada card. */}
        <p className="mt-2 line-clamp-4 min-h-[4lh] text-sm leading-relaxed text-white/55">
          {project.blurb}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/45"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
