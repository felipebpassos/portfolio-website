"use client";

import { createContext, useContext } from "react";

import type { SiteContent } from "@/content";

const ContentContext = createContext<SiteContent | null>(null);

export function ContentProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: React.ReactNode;
}) {
  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  );
}

/** Conteúdo do idioma atual. Só funciona dentro do ContentProvider. */
export function useContent(): SiteContent {
  const content = useContext(ContentContext);
  if (!content) {
    throw new Error("useContent precisa estar dentro de <ContentProvider>.");
  }
  return content;
}
