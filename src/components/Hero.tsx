"use client";

import Image from "next/image";

import { useContent } from "@/lib/content-context";

export default function Hero() {
  const { profile } = useContent();

  return (
    <div className="relative z-10 flex flex-col items-center px-6 text-center">
      <div className="rise relative mb-8 sm:mb-10">
        <div
          aria-hidden
          className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.22),transparent_70%)] blur-xl"
        />
        <Image
          src="/me.png"
          alt={profile.name}
          width={144}
          height={144}
          priority
          className="relative size-28 rounded-full object-cover ring-1 ring-white/15 sm:size-36"
        />
      </div>

      <h1
        className="rise text-[clamp(2.4rem,8.5vw,5.5rem)] leading-[0.95] font-medium tracking-[-0.04em] text-balance text-white"
        style={{ animationDelay: "80ms" }}
      >
        {profile.role}
      </h1>

      <p
        className="rise mt-5 font-mono text-[clamp(0.7rem,2.4vw,0.95rem)] tracking-[0.14em] text-white/45 sm:mt-6"
        style={{ animationDelay: "180ms" }}
      >
        {profile.tagline}
      </p>
    </div>
  );
}
