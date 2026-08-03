"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import AskDock from "@/components/AskDock";
import Hero from "@/components/Hero";
import SkillField from "@/components/SkillField";
import { profile, skillCloud } from "@/content/profile";

// O overlay só entra no bundle quando alguém abre o portfolio.
const PortfolioOverlay = dynamic(() => import("@/components/PortfolioOverlay"));

const initials = profile.name
  .split(" ")
  .map((part) => part[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

export default function Shell() {
  const [portfolioOpen, setPortfolioOpen] = useState(false);

  // "P" abre o portfolio, desde que o foco não esteja num campo de texto.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /input|textarea/i.test(target.tagName)) return;
      if (event.key.toLowerCase() === "p" && !event.metaKey && !event.ctrlKey) {
        setPortfolioOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="relative h-[100dvh] overflow-hidden">
      <SkillField skills={skillCloud} />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-5 py-5 sm:px-8 sm:py-7">
        <div className="pointer-events-auto flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md border border-white/15 font-mono text-[10px] text-white/70">
            {initials}
          </span>
          <span className="text-sm text-white/70">{profile.name}</span>
        </div>

        <nav className="pointer-events-auto flex items-center gap-4 font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
          <span className="hidden items-center gap-2 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.5)]" />
            Available
          </span>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer noopener"
            className="transition hover:text-white"
          >
            GitHub
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="transition hover:text-white"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="transition hover:text-white"
          >
            Email
          </a>
        </nav>
      </header>

      <div className="flex h-full items-center justify-center">
        <Hero />
      </div>

      <AskDock />

      <button
        type="button"
        onClick={() => setPortfolioOpen(true)}
        className="group fixed right-4 bottom-5 z-40 flex items-center gap-3 rounded-full border border-white/10 bg-black/45 py-2.5 pr-3 pl-5 backdrop-blur-xl transition hover:border-white/25 sm:right-8 sm:bottom-8"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase transition group-hover:text-white">
          Portfolio
        </span>
        <span className="grid size-6 place-items-center rounded-full bg-white/10 text-xs text-white/70 transition group-hover:bg-accent/20 group-hover:text-accent">
          →
        </span>
      </button>

      {portfolioOpen && (
        <PortfolioOverlay onClose={() => setPortfolioOpen(false)} />
      )}
    </main>
  );
}
