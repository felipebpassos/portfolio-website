"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Project } from "@/content/projects";
import { fill } from "@/content/ui";
import { useContent } from "@/lib/content-context";

export default function PortfolioOverlay({ onClose }: { onClose: () => void }) {
  const { projects, ui } = useContent();
  const t = ui.work;
  const trackRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.7;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  // Esc fecha o detalhe, depois o overlay. Setas navegam entre os cards.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selected) setSelected(null);
        else onClose();
        return;
      }
      if (selected) return;
      if (event.key === "ArrowRight") scrollByCard(1);
      if (event.key === "ArrowLeft") scrollByCard(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, scrollByCard, selected]);

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
    if (!track || selected) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, [selected]);

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
        className="scrollbar-none flex min-h-0 flex-1 snap-x snap-mandatory items-center gap-6 overflow-x-auto overflow-y-hidden px-5 pb-6 sm:px-10"
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            onSelect={() => setSelected(project)}
          />
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

      {selected && (
        <ProjectDetail project={selected} onBack={() => setSelected(null)} />
      )}
    </div>
  );
}

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: () => void;
}) {
  const t = useContent().ui.work;

  return (
    <button
      data-card
      type="button"
      onClick={onSelect}
      className="group relative flex h-[min(30rem,62vh)] w-[min(22rem,78vw)] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-3xl border border-white/10 bg-ink-soft p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-white/25 focus-visible:-translate-y-1 focus-visible:border-white/40 focus-visible:outline-none sm:w-[min(26rem,60vw)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-45 transition-opacity duration-500 group-hover:opacity-70"
        style={{
          background: `radial-gradient(120% 80% at 20% 0%, ${project.accent[0]}55, transparent 60%), radial-gradient(110% 90% at 90% 20%, ${project.accent[1]}40, transparent 65%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent"
      />

      <div className="relative">
        <div className="mb-auto flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-4 bg-white/20" />
          <span>{project.kind}</span>
          <span className="ml-auto">{project.year}</span>
        </div>

        <h3 className="mt-4 text-2xl leading-tight font-medium tracking-[-0.02em] text-white">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          {project.subtitle}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/45"
            >
              {tech}
            </span>
          ))}
        </div>

        <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase transition group-hover:text-accent">
          {t.viewDetails} →
        </span>
      </div>
    </button>
  );
}

function ProjectDetail({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  const t = useContent().ui.work;

  return (
    <div className="fade-in absolute inset-0 z-10 overflow-y-auto bg-ink/97 backdrop-blur-2xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-35"
        style={{
          background: `radial-gradient(80% 100% at 30% 0%, ${project.accent[0]}55, transparent 70%), radial-gradient(70% 100% at 80% 0%, ${project.accent[1]}45, transparent 70%)`,
        }}
      />

      <div className="relative mx-auto w-full max-w-3xl px-5 py-6 sm:px-8 sm:py-10">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/10 px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white/55 uppercase transition hover:border-white/30 hover:text-white"
        >
          ← {t.back}
        </button>

        <div className="slide-up mt-8">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
            <span>{project.kind}</span>
            <span className="h-px w-4 bg-white/20" />
            <span>{project.year}</span>
            <span className="h-px w-4 bg-white/20" />
            <span>{project.role}</span>
          </div>

          <h3 className="mt-4 text-[clamp(2rem,6vw,3.5rem)] leading-[1.02] font-medium tracking-[-0.035em] text-white">
            {project.title}
          </h3>
          <p className="mt-3 text-lg leading-relaxed text-white/60 text-balance">
            {project.subtitle}
          </p>

          {project.metrics && project.metrics.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="bg-ink px-4 py-4">
                  <dt className="font-mono text-[10px] tracking-[0.18em] text-white/35 uppercase">
                    {metric.label}
                  </dt>
                  <dd className="mt-1.5 text-sm text-white">{metric.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <p className="mt-8 leading-relaxed text-white/70">{project.summary}</p>

          <h4 className="mt-10 font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
            {t.highlights}
          </h4>
          <ul className="mt-4 space-y-3">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-white/70">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                <span className="leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>

          <h4 className="mt-10 font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
            {t.stack}
          </h4>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-white/55"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.links && project.links.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3 border-t border-white/[0.07] pt-8">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/75 transition hover:border-white/35 hover:text-white"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
