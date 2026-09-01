"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

import AskDock from "@/components/AskDock";
import Hero from "@/components/Hero";
import LocaleToggle from "@/components/LocaleToggle";
import SkillField from "@/components/SkillField";
import type { SiteContent } from "@/content";
import { skillCloud } from "@/content/profile";
import { fill } from "@/content/ui";
import { ContentProvider } from "@/lib/content-context";

// O overlay só entra no bundle quando alguém abre o portfolio.
const PortfolioOverlay = dynamic(() => import("@/components/PortfolioOverlay"));

export default function Shell({ content }: { content: SiteContent }) {
  const { profile, ui, locale } = content;
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

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
    <ContentProvider content={content}>
      <main className="relative h-[100dvh] overflow-hidden">
        <SkillField skills={skillCloud} />

        {/* data-skill-void marca as áreas que o SkillField não pode ocupar:
            ele mede esses elementos e joga as palavras para fora deles. */}
        <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-5 py-5 sm:px-8 sm:py-7">
          <div data-skill-void className="pointer-events-auto flex items-center gap-2.5">
            <Image
              src="/me.png"
              alt={profile.name}
              width={80}
              height={80}
              className="size-10 rounded-full object-cover ring-1 ring-white/15"
            />

            <div>
              <span className="block text-sm leading-tight text-white/70">
                {profile.name}
              </span>

              {profile.resume && (
                <a
                  href={profile.resume}
                  download
                  aria-label={fill(ui.resumeAria, { name: profile.name })}
                  className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-white/50 uppercase transition hover:text-white"
                >
                  {ui.resume}
                  <span aria-hidden>↓</span>
                </a>
              )}
            </div>
          </div>

          <nav
            data-skill-void
            className="pointer-events-auto flex items-center gap-4 font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase"
          >
            <span className="hidden items-center gap-2 sm:flex">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.5)]" />
              {ui.available}
            </span>
            <LocaleToggle locale={locale} label={ui.languageLabel} />
          </nav>
        </header>

        {/* Sobe um pouco quando o chat abre, para o painel caber abaixo. No
            mobile o chat vira tela cheia, então não precisa (e o transform aqui
            quebraria o position:fixed do painel). */}
        <div
          className={`flex h-full flex-col items-center justify-center transition-transform duration-500 ease-out ${
            chatOpen ? "sm:-translate-y-[12dvh]" : ""
          }`}
        >
          <Hero />
          <AskDock onOpenChange={setChatOpen} />
        </div>

        {/* No mobile são só os links: a casca de vidro roubaria a largura que o
            botão do Portfolio precisa na mesma linha. */}
        <nav
          aria-label={profile.name}
          data-skill-void
          className="fixed bottom-5 left-4 z-40 flex h-11 items-center gap-3 font-mono text-[10px] tracking-[0.14em] text-white/55 uppercase sm:bottom-8 sm:left-8 sm:h-auto sm:gap-4 sm:rounded-full sm:border sm:border-white/10 sm:bg-black/45 sm:px-5 sm:py-2.5 sm:tracking-[0.18em] sm:backdrop-blur-xl"
        >
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer noopener"
            className="transition hover:text-white"
          >
            GitHub
          </a>
          <span aria-hidden className="hidden h-3 w-px bg-white/15 sm:block" />
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="transition hover:text-white"
          >
            LinkedIn
          </a>
          <span aria-hidden className="hidden h-3 w-px bg-white/15 sm:block" />
          <a
            href={`mailto:${profile.email}`}
            className="transition hover:text-white"
          >
            Email
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setPortfolioOpen(true)}
          data-skill-void
          className="group fixed right-4 bottom-5 z-40 flex items-center gap-3 rounded-full border border-white/10 bg-black/45 py-2.5 pr-3 pl-5 backdrop-blur-xl transition hover:border-white/25 sm:right-8 sm:bottom-8"
        >
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase transition group-hover:text-white">
            {ui.portfolio}
          </span>
          <span className="grid size-6 place-items-center rounded-full bg-white/10 text-xs text-white/70 transition group-hover:bg-accent/20 group-hover:text-accent">
            →
          </span>
        </button>

        {portfolioOpen && (
          <PortfolioOverlay onClose={() => setPortfolioOpen(false)} />
        )}
      </main>
    </ContentProvider>
  );
}
