import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { profile } from "@/content/profile";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  // TODO: troque pelo domínio final para as imagens de preview funcionarem.
  metadataBase: new URL("https://example.com"),
  title,
  description: profile.summary,
  openGraph: {
    title,
    description: profile.summary,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.summary,
  },
};

export const viewport: Viewport = {
  themeColor: "#06060a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
